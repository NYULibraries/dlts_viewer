<?php

/**
 * @file
 * IIIF Presentation API v3 manifest generation for serial resources.
 *
 * Handles metadata aggregation across translations, thumbnail resolution,
 * PDF rendering entries, and manifest caching.
 */

/**
 * Fetches locale translations for a set of source strings in one query.
 *
 * Returns an associative array of source => translation. Sources with no
 * translation row are absent from the result so callers can fall back
 * gracefully via isset().
 *
 * @param string   $language  Drupal language code (e.g. 'en', 'ar').
 * @param string[] $sources   Raw source strings to look up.
 *
 * @return string[]
 */
function _dlts_fetch_translations($language, array $sources) {
  if (empty($sources)) {
    return [];
  }

  return db_query(
    'SELECT source, translation
       FROM {dlts_viewer_locale}
      WHERE language = :language
        AND source IN (:sources)
        AND translation <> \'\'',
    [':language' => $language, ':sources' => $sources]
  )->fetchAllKeyed();
}

/**
 * Translates an array of arbitrary string values in a single query.
 *
 * Returns an ordered array of translated strings, falling back to the
 * original value when no translation is found.
 *
 * @param string   $language
 * @param string[] $values   Raw values to translate.
 *
 * @return string[]
 */
function _dlts_translate_values($language, array $values) {
  if (empty($values)) {
    return [];
  }

  $translations = _dlts_fetch_translations($language, $values);

  return array_map(
    function ($v) use ($translations) {
      return isset($translations[$v]) ? $translations[$v] : $v;
    },
    $values
  );
}

/**
 * Resolves human-readable field labels for every field on a bundle.
 *
 * Labels are looked up in {dlts_viewer_locale} first; any that are missing
 * fall back to Drupal's locale() function. A single bulk query is used so
 * that label resolution never triggers per-field database round-trips.
 *
 * @param array  $field_info_instances  Output of field_info_instances().
 * @param string $language
 *
 * @return string[] Keyed by field name.
 */
function _dlts_resolve_field_labels(array $field_info_instances, $language) {
  $raw_labels = array_map(
    function ($instance) { return $instance['label']; },
    $field_info_instances
  );

  $translations = _dlts_fetch_translations($language, array_values($raw_labels));

  $labels = [];
  foreach ($field_info_instances as $field_name => $instance) {
    $source = $instance['label'];
    $labels[$field_name] = isset($translations[$source])
      ? $translations[$source]
      : locale($source, NULL, $language);
  }

  return $labels;
}

/**
 * Returns a metadata entry array or NULL when the field has no value.
 *
 * @param string $label
 * @param mixed  $value  Scalar or array; empty values yield NULL.
 *
 * @return array|null
 */
function _dlts_metadata_entry($label, $value) {
  $values = is_array($value) ? array_filter($value, 'strlen') : [$value];
  if (empty($values)) {
    return NULL;
  }

  return ['label' => $label, 'value' => array_values($values)];
}

/**
 * Builds IIIF-compatible metadata for a serial node wrapper.
 *
 * Only fields present on the bundle are processed. Translatable text fields
 * are listed in $translatable_fields; all other supported field types are
 * handled explicitly below.
 *
 * @param EntityMetadataWrapper $wrapper
 * @param string[]              $translatable_fields  Simple text/list fields.
 *
 * @return array  Keyed by field name; each entry has 'label' and 'value'.
 */
function dlts_serial_fields_values($wrapper, array $translatable_fields = []) {
  $bundle = $wrapper->getBundle();
  $field_info_instances = field_info_instances('node', $bundle);
  $type_fields = array_flip(array_keys($field_info_instances));  // O(1) lookup
  $language = $wrapper->language->value();
  $metadata = [];

  // Resolve all field labels in one database round-trip.
  $labels = _dlts_resolve_field_labels($field_info_instances, $language);

  // -------------------------------------------------------------------------
  // Simple translatable text / list fields.
  // -------------------------------------------------------------------------
  foreach ($translatable_fields as $field_name) {
    if (!isset($type_fields[$field_name])) {
      continue;
    }

    $raw = $wrapper->$field_name->value();
    $entry = _dlts_metadata_entry(
      $labels[$field_name],
      is_array($raw) ? $raw : [$raw]
    );
    if ($entry !== NULL) {
      $metadata[$field_name] = $entry;
    }
  }

  // -------------------------------------------------------------------------
  // Reference fields: Collection and Partner.
  // Both share the same pattern: load child nodes, collect their field_name
  // values, translate them in bulk.
  // -------------------------------------------------------------------------
  foreach (['field_collection', 'field_partner'] as $ref_field) {
    if (!isset($type_fields[$ref_field])) {
      continue;
    }

    $raw_nodes = $wrapper->$ref_field->value();
    if (empty($raw_nodes)) {
      continue;
    }

    // Collect all raw name values first to allow a single translate call.
    $names = [];
    foreach ($raw_nodes as $node) {
      $item_wrapper = entity_metadata_wrapper('node', $node);
      $names[] = $item_wrapper->field_name->value();
    }

    $metadata[$ref_field] = [
      'label' => $labels[$ref_field],
      'value' => _dlts_translate_values($language, $names),
    ];
  }

  // -------------------------------------------------------------------------
  // Language field (stored as raw codes; translated in bulk).
  // -------------------------------------------------------------------------
  if (isset($type_fields['field_language'])) {
    $lang_values = $wrapper->field_language->value();
    if (!empty($lang_values)) {
      $metadata['field_language'] = [
        'label' => $labels['field_language'],
        'value' => _dlts_translate_values($language, (array) $lang_values),
      ];
    }
  }

  // -------------------------------------------------------------------------
  // Taxonomy term fields.
  // -------------------------------------------------------------------------
  if (isset($type_fields['field_geographic_subject'])) {
    $geo = [];
    foreach ($wrapper->field_geographic_subject->getIterator() as $term) {
      $geo[] = $term->name->value();
    }
    $entry = _dlts_metadata_entry($labels['field_geographic_subject'], $geo);
    if ($entry !== NULL) {
      $metadata['field_geographic_subject'] = $entry;
    }
  }

  if (isset($type_fields['field_subject'])) {
    $subjects = [];
    // Use getIterator() for consistency and to get proper wrapper objects.
    foreach ($wrapper->field_subject->getIterator() as $term) {
      $subjects[] = $term->name->value();
    }
    $entry = _dlts_metadata_entry($labels['field_subject'], $subjects);
    if ($entry !== NULL) {
      $metadata['field_subject'] = $entry;
    }
  }

  // -------------------------------------------------------------------------
  // Link / URL fields.
  // -------------------------------------------------------------------------
  if (isset($type_fields['field_handle'])) {
    $handle = $wrapper->field_handle->value();
    if (!empty($handle['url'])) {
      $metadata['field_handle'] = [
        'label' => $labels['field_handle'],
        'value' => [$handle['url']],
      ];
    }
  }

  if (isset($type_fields['field_other_version'])) {
    $others = $wrapper->field_other_version->value();
    if (!empty($others)) {
      $urls = array_column($others, 'url');
      $entry = _dlts_metadata_entry($labels['field_other_version'], $urls);
      if ($entry !== NULL) {
        $metadata['field_other_version'] = $entry;
      }
    }
  }

  $order_fields = [
    'field_read_order' => [ 0 => 'Left to right', 1 => 'Right to left' ],
    'field_scan_order' => [ 0 => 'Left to right', 1 => 'Right to left' ],
    'field_binding_orientation' => [ 0 => 'Vertical', 1 => 'Horizontal' ],
  ];

  foreach ($order_fields as $field_name => $map) {
    if (!isset($type_fields[$field_name])) {
      continue;
    }

    $int_val   = (int) $wrapper->$field_name->value();
    $raw_label = isset($map[$int_val]) ? $map[$int_val] : reset($map);
    $label_key = isset($labels[$field_name])
      ? $labels[$field_name]
      : locale(str_replace('field_', '', str_replace('_', ' ', $field_name)), NULL, $language);

    $metadata[$field_name] = [
      'label' => $label_key,
      'value' => [locale($raw_label, NULL, $language)],
    ];
  }

  return $metadata;
}

// ---------------------------------------------------------------------------
// Manifest builder
// ---------------------------------------------------------------------------

/**
 * Builds and optionally caches a IIIF Presentation API v3 manifest.
 *
 * The manifest is cached as JSON on the filesystem after first generation.
 * Pass $cache = FALSE to bypass the cache (e.g. during content updates).
 *
 * @param object $entity  Fully-loaded Drupal node object.
 * @param bool   $cache   Whether to read from / write to the file cache.
 *
 * @return array  The manifest as a PHP array (JSON-serializable).
 */
function dlts_viewer_iiif_serial_manifest($entity, $cache = TRUE) {

  global $base_url;

  $wrapper = entity_metadata_wrapper('node', $entity);
  $identifier = $wrapper->field_identifier->value();
  $bundle = $wrapper->getBundle();
  $type = dlts_viewer_get_bundle_alias($bundle);

  $cache_path = drupal_realpath('public://') . "/iiif/$type/$identifier/manifest.json";

  $cache = false;

  if ($cache && file_exists($cache_path)) {
    $cached = file_get_contents($cache_path);
    if ($cached !== FALSE) {
      return drupal_json_decode($cached);
    }
    watchdog('dlts_viewer', 'Failed to read cached manifest at %path.', ['%path' => $cache_path], WATCHDOG_WARNING);
  }

  // -------------------------------------------------------------------------
  // Viewing direction: derive from the language code stored on the node.
  // -------------------------------------------------------------------------
  $viewingDirection    = 'left-to-right';
  $available_languages = language_list();
  $field_lang_code     = $wrapper->field_language_code->value();

  if (!empty($field_lang_code)) {
    $mapped = dlts_viewer_map_language_code($field_lang_code);
    if (isset($available_languages[$mapped])) {
      // Maps integer field values to IIIF viewing direction strings.
      $dirMap = [ 0 => 'left-to-right', 1 => 'right-to-left' ];
      $viewingDirection = $dirMap[(int) $available_languages[$mapped]->direction];
    }
  }

  // -------------------------------------------------------------------------
  // Translations: build a map of language => wrapper for metadata aggregation.
  // -------------------------------------------------------------------------
  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);
  $translations = [$entity->language => $wrapper];

  foreach ($nids as $nid) {
    if ((int) $nid === (int) $entity->nid) {
      continue;
    }
    $tw = entity_metadata_wrapper('node', $nid);
    $translations[$tw->language->value()] = $tw;
  }

  // -------------------------------------------------------------------------
  // PDF renderings.
  // -------------------------------------------------------------------------
  $pdfs = [];

  $pdf_files = $wrapper->field_pdf_file->value();

  if (!empty($pdf_files)) {
    foreach ($pdf_files as $file_val) {
      $url   = file_create_url($file_val['uri']);

      $udata = @unserialize($file_val['data']);

      // Validate unserialize result before trusting it.
      $size  = (is_array($udata) && isset($udata['filesize']))
        ? field_fileserver_human_filesize((int) $udata['filesize'])
        : 'Unknown';

      $is_hi     = strpos($file_val['uri'], '_hi') !== FALSE;
      $label_key = $is_hi ? 'High-resolution PDF rendering' : 'Low-resolution PDF rendering';

      $pdfs[] = [
        'id'     => $url,
        'type'   => 'Text',
        'format' => 'application/pdf',
        'label'  => ['en' => [locale($label_key, NULL, 'en') . " ($size)"]],
      ];
    }
  }

  // -------------------------------------------------------------------------
  // Aggregate metadata across all language wrappers.
  // -------------------------------------------------------------------------
  // https://nyu.atlassian.net/browse/DLTSVIEWER-211 - No 'field_subtitle', 
  $metadata_keys = [
    'field_author', 'field_contributor', 'field_creator', 'field_editor',
    'field_description', 'field_volume', 'field_title',
    'field_publication_date_text', 'field_publication_location', 'field_isbn',
    'field_language', 'field_publisher', 'field_topic', 'field_scanning_notes',
  ];

  $fields = [];

  foreach ($translations as $lang => $tw) {
    $lang_metadata = dlts_serial_fields_values($tw, $metadata_keys);
    foreach ($lang_metadata as $name => $data) {
      if (empty($data['value'])) {
        continue;
      }
      $fields[$name]['label'][$lang] = [$data['label']];
      $fields[$name]['value'][$lang] = $data['value'];
    }
  }

  // -------------------------------------------------------------------------
  // Rights / Required Statement.
  // -------------------------------------------------------------------------
  $rights = $wrapper->field_rights->value();

  $required_statement = !empty($rights) ? [
    'label' => ['en' => [locale('Rights', NULL, 'en')]],
    'value' => ['en' => [(string) $rights]],
  ] : NULL;

  // -------------------------------------------------------------------------
  // partOf (Collections).
  // -------------------------------------------------------------------------
  $partof = [];

  $collection_nodes = $wrapper->field_collection->value();

  if (!empty($collection_nodes)) {
    foreach ($collection_nodes as $col_node) {
      $cw = entity_metadata_wrapper('node', $col_node);
      $col_code = $cw->field_code->value();
      $partner_list = $cw->field_partner->value();

      // Guard against missing partner reference before array access.
      if (empty($partner_list)) {
        watchdog('dlts_viewer', 'Collection node %nid has no partner; skipped in partOf.', ['%nid' => $col_node->nid], WATCHDOG_WARNING);
        continue;
      }

      $pw = entity_metadata_wrapper('node', $partner_list[0]);
      $partner_code = $pw->field_code->value();

      $partof[] = [
        'id'    => "$base_url/api/presentation/collections/$col_code:$partner_code/manifest.json",
        'type'  => 'Collection',
        'label' => [$entity->language => [$cw->field_name->value()]],
      ];
    }
  }

  // Canvases from MongoDB sequences.
  $items = [];
  $thumbnail = [];
  $rep_image_uri = '';

  $rep_field = $wrapper->field_representative_image->value();
  if (!empty($rep_field['uri'])) {
    $rep_image_uri = $rep_field['uri'];
  }

  $mongo_col = dlts_viewer_mongodb_collections_by_type($bundle);

  $sequences = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $mongo_col);

  foreach ($sequences as $page) {
    $seq_id = end($page['sequence']);
    $page_num = (int) $page['realPageNumber'];
    $width = (int) $page['cm']['width'];
    $height = (int) $page['cm']['height'];

    $canvas = dlts_viewer_iiif_resource_page_canvas($bundle, $entity, [
      'sequence' => $page['sequence'],
      'width' => $width,
      'height' => $height,
    ]);

    // Store by 0-based index for reliable ksort ordering.
    $items[$page_num - 1] = $canvas;

    // Use the representative image URI when available, otherwise page 1.
    $use_as_thumb = ($page['cm']['uri'] === $rep_image_uri)
      || (empty($thumbnail) && $page_num === 1);

    if ($use_as_thumb) {
      $thumbnail = [[
        'id' => "$base_url/api/image/$type/$identifier/$seq_id/full/!300,300/0/default.jpg",
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 300,
        'width' => 300,
        'service' => [[
          'id' => "$base_url/api/image/$type/$identifier/$seq_id",
          'type' => 'ImageService2',
          'profile' => 'level1',
        ]],
      ]];
    }
  }

  ksort($items);

  // Assemble the manifest.
  $sequence_count = (int) $wrapper->field_sequence_count->value();

  $module_path = drupal_get_path('module', 'dlts_viewer');

  $manifest = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$type/$identifier/manifest.json",
    'type' => 'Manifest',
    'label' => $fields['field_title']['value'] ?? ['en' => ['Untitled']],
    'behavior' => $sequence_count > 1 ? ['paged'] : ['individuals'],
    'viewingDirection' => $viewingDirection,
    'items' => array_values($items),
    'metadata' => array_values($fields),
    'logo'             => [[
      'id' => "$base_url/$module_path/images/nyu-logo.jpg",
      'type' => 'Image',
      'format' => 'image/jpeg',
      'height' => 900,
      'width' => 900,
    ]],
    'thumbnail' => $thumbnail,
  ];

  $handle = $wrapper->field_handle->value();
  if (!empty($handle['url'])) {
    $manifest['homepage'] = [
      'id' => $handle['url'],
      'type' => 'Text',
      'label' => ['en' => ['View on NYU DLTS Viewer']],
      'format' => 'text/html',
    ];
  }

  // Optional top-level keys — only added when non-empty to keep the manifest clean.
  if (!empty($pdfs)) {
    $manifest['rendering'] = $pdfs;
  }

  if (!empty($fields['field_description']['value'])) {
    $manifest['summary'] = $fields['field_description']['value'];
  }

  if ($required_statement !== NULL) {
    $manifest['requiredStatement'] = $required_statement;
  }

  if (!empty($partof)) {
    $manifest['partOf'] = $partof;
  }

  // Defer filesystem cache write to shutdown so it does not block the response.
  drupal_register_shutdown_function('dlts_viewer_cache_manifest', [
    'type' => $type,
    'resource' => $entity,
    'data' => $manifest,
  ]);

  return $manifest;
}
