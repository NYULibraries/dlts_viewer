<?php

/**
 * @file
 * IIIF API callbacks.
 * @link https://iiif.io/technical-details/
 */

/**
 * IIIF Image API proxy.
 *
 * This function acts as a proxy to a IIIF image server. It retrieves image
 * information (info.json) for a specific sequence of a resource. It can
 * cache the response to a file to improve performance.
 *
 * @link /api/image/books/uaena_aco000016/1
 * @link https://iiif.io/api/image/2.1/#image-information
 *
 * @param string $type
 *   The entity type (e.g., 'books', 'photos').
 * @param object $resource
 *   The node object representing the resource.
 * @param array $resource_sequence
 *   An array containing sequence information, including the sequence number and
 *   the image identifier (URL or file ID).
 * @param bool $cache
 *   Whether to use a cached version of the info.json response if available.
 *   Defaults to TRUE.
 *
 * @return array
 *   The decoded JSON response from the IIIF image server as an array, or an
 *   HTTP error response array.
 */
function dlts_viewer_iiif_api($type, object $resource, array $resource_sequence, $cache = TRUE) {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  $type = dlts_viewer_resource_type($type);

  $wrapper = entity_metadata_wrapper('node', $resource);

  $identifier = $wrapper->field_identifier->value();

  $realpath = drupal_realpath('public://');

  $dir_path = "$realpath/iiif/$type/$identifier";

  $sequence = $resource_sequence['sequence'];

  $file_destination = "$dir_path/$sequence.json";

  if ($cache && file_exists($file_destination)) {
    return drupal_json_decode(
      file_get_contents($file_destination)
    );
  }

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');

  $static_source = variable_get('dlts_image_static_source', 'HttpSource');

  switch ($static_source) {
    case 'FilesystemSource':
      $image_id = $resource_sequence['fid'];
      break;

    case 'HttpSource':
      $image_id = $resource_sequence['url'];
      break;
  }

  $uri = urlencode($image_id);

  // Set the options to disable SSL verification
  $options = [
    'method' => 'GET',
    'timeout' => 500,
    'ssl' => [
      // Set to FALSE to disable checking the remote certificate against a local certificate authority.
      'verify_peer' => FALSE,    
      // Set to FALSE to not verify the remote host's name against the common name (CN)
      // or subject alternative name (SAN) fields in the certificate.
      'verify_peer_name' => FALSE,    
      // Allow self-signed certificates. Requires verify_peer set to TRUE, 
      // but in this case, setting verify_peer to FALSE overrides it for a full bypass.
      // Including it here for completeness with the general self-signed certificate options.
      'allow_self_signed' => TRUE,
    ],
  ];

  $response = drupal_http_request("$image_server/iiif/2/$uri/info.json", $options);

  if ($response) {
    if ($response->code == '200' && isset($response->data)) {
      drupal_register_shutdown_function(
        'dlts_viewer_cache_book_sequence',
        [
          'type' => $type,
          'resource' => $resource,
          'sequence' => $sequence,
          'data' => $response->data,
        ]
      );
      return drupal_json_decode($response->data);
    }
    else {
      return $response;
    }
  }
  else {
    return [
      'code' => 500,
      'error' => 'Unexpected error occurred.',
    ];
  }
}

/**
 * Returns a IIIF Image tile.
 *
 * This function retrieves an image tile from a IIIF image server based on the
 * provided parameters. It constructs the IIIF image URL and fetches the
 * image content, then serves it to the client with appropriate headers.
 *
 * @link https://iiif.io/api/image/2.1/#image-requests
 * @link http://[HOST]/api/image/books/princeton_aco000102/1/full/max/0/default.jpg
 *
 * @param string $type
 *   The resource type (e.g., 'books', 'photos').
 * @param object $resource
 *   The node object representing the resource.
 * @param array $sequence
 *   A sequence array from MongoDB containing the image URI.
 * @param string $region
 *   The region of the image to be returned. Defaults to 'full'.
 * @param string $size
 *   The size of the image to be returned. Defaults to 'max'.
 * @param int $rotation
 *   The rotation of the image. Defaults to 0.
 * @param string $quality
 *   The quality of the image. Defaults to 'default.jpg'.
 */
function dlts_viewer_iiif_tile($type, $resource, $sequence, $region = 'full', $size = 'max', $rotation = 0, $quality = 'default.jpg') {
  
  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');

  $static_source = variable_get('dlts_image_static_source', 'HttpSource');

  $sequence_uri = $sequence['uri'];

  $apiVersion = '2';

  switch ($static_source) {
    case 'HttpSource':
      $image_id = $sequence_uri;
      break;
    case 'FilesystemSource':
      $image_id = str_replace('fileserver://', '', $sequence_uri);
      break;
    default:
      $image_id = str_replace('fileserver://', '', $sequence_uri);
      break;
  }

  $uri = urlencode($image_id);

  $image = "$image_server/iiif/$apiVersion/$uri/$region/$size/$rotation/$quality?v=" . time();

  $context = stream_context_create([
    'method' => 'GET',
    'timeout' => 500,
    'ssl' => [
      // Set to FALSE to disable checking the remote certificate against a local certificate authority.
      'verify_peer' => FALSE,    
      // Set to FALSE to not verify the remote host's name against the common name (CN)
      // or subject alternative name (SAN) fields in the certificate.
      'verify_peer_name' => FALSE,    
      // Allow self-signed certificates. Requires verify_peer set to TRUE, 
      // but in this case, setting verify_peer to FALSE overrides it for a full bypass.
      // Including it here for completeness with the general self-signed certificate options.
      'allow_self_signed' => TRUE,
    ],
  ]);

  $content = file_get_contents($image, false, $context);

  $requestStatus = substr($http_response_header[0], 9, 3);

  $responseType = substr($http_response_header[7], 14);

  if ($responseType !== 'image/jpeg') {
    $responseType = substr($http_response_header[3], 14);
  }

  $original_image_source = file_create_url($sequence['cm']['uri']);

  if ($content && $requestStatus === '200' && $responseType === 'image/jpeg') {
    $etag = md5($content);
    header('Content-type: image/jpeg');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Content-Transfer-Encoding: binary');
    header("Master-Image: $image_id");
    header("Image-Server-Url: $image");
    header("Image-Source-Url: $original_image_source");
    header("Etag: $etag");
    echo $content;
    exit(0);
  }
  else {
    if (isset($http_response_header)) {
      header('HTTP/1.1 400 Bad Request', TRUE, 400);
      header("Master-Image: $image_id");
      header("Image-Server-Url: $image");
      header("Image-Source-Url: $original_image_source");
      die('HTTP/1.1 400 Bad Request');
    }
    else {
      header('HTTP/1.1 400 Bad Request', TRUE, 400);
      header("Master-Image: $image_id");
      header("Image-Server-Url: $image");
      header("Image-Source-Url: $original_image_source");
      die('HTTP/1.1 400 Bad Request');
    }
    exit(1);
  }

}

/**
 * Dispatches manifest generation to the appropriate function based on entity type.
 *
 * This function acts as a router for generating IIIF Presentation API manifests.
 * It takes an entity and calls the corresponding manifest generation function
 * (e.g., for books, photos, maps).
 *
 * @param string $type
 *   The resource type (e.g., 'books', 'photos', 'maps').
 * @param object $entity
 *   The node object for which to generate the manifest.
 * @param bool $cache
 *   Whether to allow returning a cached version of the manifest. Defaults to
 *   TRUE. Can be overridden with a 'reset' query parameter.
 *
 * @return array
 *   The IIIF manifest as a PHP array.
 */
function dlts_viewer_iiif_resource_manifest($type, $entity, $cache = TRUE) {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['reset']) || isset($query_parameters['reset_cache'])) {
    $cache = FALSE;
  }

  switch ($entity->type) {
    case 'dlts_book':
      return dlts_viewer_iiif_book_manifest($entity, $cache);

    case 'dlts_photo_set':
      return dlts_viewer_iiif_photo_manifest($entity, $cache);

    case 'dlts_map':
      return dlts_viewer_iiif_map_manifest($entity, $cache);
  }
}

/**
 * Build metadata values for a photo resource.
 *
 * This function extracts metadata field values from a photo entity wrapper and
 * formats them for inclusion in a IIIF manifest's metadata section.
 *
 * @link https://iiif.io/api/presentation/3.0/#metadata
 *
 * @param EntityMetadataWrapper $wrapper
 *   The entity metadata wrapper for the photo node.
 *
 * @return array
 *   An array of metadata fields, where each field has a 'label' and a 'value'.
 */
function dlts_photo_fields_values($wrapper) {

  // Entity language.
  $language = $wrapper->language->value();

  $content_type = node_type_get_type($wrapper->getBundle());

  $fields = [];

  $field_info_instances = field_info_instances('node', $content_type->type);

  foreach ($field_info_instances as $field_name => $field_info_instance) {
    $fields[$field_name] = locale($field_info_instance['label'], NULL, $language);
  }

  // Return the value of all the fields.
  $metadata = [];

  $field_collection_raw = $wrapper->field_collection->value();
  if (!empty($field_collection_raw)) {
    $metadata['field_collection'] = [
      'label' => $fields['field_collection'],
      'value' => [],
    ];
    foreach ($field_collection_raw as $field_collection) {
      $wrapper_collection = entity_metadata_wrapper('node', $field_collection);
      $metadata['field_collection']['value'][] = $wrapper_collection->field_name->value();
    }
  }

  $field_handle_raw = $wrapper->field_handle->value();
  if (!empty($field_handle_raw)) {
    $metadata['field_handle'] = [
      'label' => $fields['field_handle'],
      'value' => [
        $field_handle_raw['url'],
      ],
    ];
  }

  $field_partner_raw = $wrapper->field_partner->value();
  if (!empty($field_partner_raw)) {
    $metadata['field_partner'] = [
      'label' => $fields['field_partner'],
      'value' => [],
    ];
    foreach ($field_partner_raw as $field_partner) {
      $wrapper_partner = entity_metadata_wrapper('node', $field_partner);
      $metadata['field_partner']['value'][] = $wrapper_partner->field_name->value();
    }
  }
  return $metadata;
}

/**
 * Build metadata values for a book resource.
 *
 * This function extracts metadata field values from a book entity wrapper and
 * formats them for inclusion in a IIIF manifest's metadata section. It handles
 * translatable fields and looks up localized labels.
 *
 * @link https://iiif.io/api/presentation/3.0/#metadata
 *
 * @param EntityMetadataWrapper $wrapper
 *   The entity metadata wrapper for the book node.
 * @param array $translatable_fields
 *   An array of field names that should be processed.
 *
 * @return array
 *   An array of metadata fields, where each field has a 'label' and a 'value'.
 */
function dlts_book_fields_values($wrapper, array $translatable_fields = []) {

  $field_info_instances = field_info_instances('node', $wrapper->getBundle());

  $type_fields = array_keys($field_info_instances);

  // Entity language.
  $language = $wrapper->language->value();

  $content_type = node_type_get_type($wrapper->getBundle());

  $fields = [];

  // Return the value of all the fields.
  $metadata = [];

  $field_info_instances = field_info_instances('node', $content_type->type);
  foreach ($field_info_instances as $field_name => $field_info_instance) {
    $field_info_label_locale = db_query('SELECT translation FROM dlts_viewer_locale WHERE language = :language AND source = :source LIMIT 1', [ ':language' => $language, ':source' => $field_info_instance['label'] ])->fetchField();
    if (isset($field_info_label_locale) && !empty($field_info_label_locale)) {
      $fields[$field_name] = $field_info_label_locale;
    } else {
      $fields[$field_name] = locale($field_info_instance['label'], NULL, $language);
    }
  }

  foreach ($translatable_fields as $field_name) {
    if (array_search($field_name, $type_fields) !== false) {
      $field_value = $wrapper->$field_name->value();
      if (!empty($field_value)) {
        $metadata[$field_name] = [
          'label' => $fields[$field_name],
          'value' => is_array($field_value) ? $field_value : [ $field_value ],
        ];
      }
    }
  }

  // All DTLS resources have Collection.
  $field_collection_raw = $wrapper->field_collection->value();
  if (!empty($field_collection_raw)) {
    $metadata['field_collection'] = [
      'label' => $fields['field_collection'],
      'value' => [],
    ];
    foreach ($field_collection_raw as $field_collection) {
      $wrapper_collection = entity_metadata_wrapper('node', $field_collection);
      $collection_name = $wrapper_collection->field_name->value();
      $collection_locale = db_query('SELECT translation FROM dlts_viewer_locale WHERE language = :language AND source = :source LIMIT 1', [ ':language' => $language, ':source' => $collection_name ])->fetchField();
      if (isset($collection_locale)) {
        $metadata['field_collection']['value'][] = $collection_locale;
      } else {
        $metadata['field_collection']['value'][] = $collection_name;
      }
    }
  }

  $field_partner_raw = $wrapper->field_partner->value();
  if (!empty($field_partner_raw)) {
    $metadata['field_partner'] = [
      'label' => $fields['field_partner'],
      'value' => [],
    ];
    foreach ($field_partner_raw as $field_partner) {
      $wrapper_partner = entity_metadata_wrapper('node', $field_partner);
      $partner_name = $wrapper_partner->field_name->value();
      $partner_locale = db_query('SELECT translation FROM dlts_viewer_locale WHERE language = :language AND source = :source LIMIT 1', [ ':language' => $language, ':source' => $partner_name ])->fetchField();
      if (isset($partner_locale)) {
        $metadata['field_partner']['value'][] = $partner_locale;
      } else {
        $metadata['field_partner']['value'][] = $partner_name;
      }
    }
  }

  if (array_search('field_language', $type_fields)) {
    $metadata['field_language'] = [
      'label' => $fields['field_language'],
      'value' => [],
    ];
    $field_language_raw = $wrapper->field_language->value();
    foreach ($field_language_raw as $field_language) {
      $field_language_locale = db_query('SELECT translation FROM dlts_viewer_locale WHERE language = :language AND source = :source LIMIT 1', [ ':language' => $language, ':source' => $field_language ])->fetchField();
      if ($field_language_locale) {
        $metadata['field_language']['value'][] = $field_language_locale;
      } else {
        $metadata['field_language']['value'][] = $field_language;
      }
    }
  }

  if (array_search('field_geographic_subject', $type_fields)) {
    $geographic_subjects = [];
    foreach ($wrapper->field_geographic_subject->getIterator() as $term_wrapper) {
      $geographic_subjects[] = $term_wrapper->name->value();
    }
    if (!empty($geographic_subjects)) {
      $metadata['field_geographic_subject'] = [
        'label' => $fields['field_geographic_subject'],
        'value' => $geographic_subjects,
      ];
    }
  }

  if (array_search('field_subject', $type_fields)) {
    $field_subject_raw = $wrapper->field_subject->value();
    if (!empty($field_subject_raw)) {
      $subjects = [];
      foreach ($field_subject_raw as $subject) {
        $subjects[] = $subject->name;
      }
      if (!empty($subjects)) {
        $metadata['field_subject'] = [
          'label' => $fields['field_subject'],
          'value' => $subjects,
        ];
      }
    }
  }

  if (array_search('field_handle', $type_fields)) {
    $field_handle_raw = $wrapper->field_handle->value();
    if (!empty($field_handle_raw)) {
      $metadata['field_handle'] = [
        'label' => $fields['field_handle'],
        'value' => [
          $field_handle_raw['url'],
        ],
      ];
    }
  }

  if (array_search('field_other_version', $type_fields)) {
    $field_other_version_raw = $wrapper->field_other_version->value();
    if (!empty($field_other_version_raw)) {
      $metadata['field_other_version'] = [
        'label' => $fields['field_other_version'],
        'value' => [],
      ];
      foreach ($field_other_version_raw as $field_other_version_value) {
        $metadata['field_other_version']['value'][] = $field_other_version_value['url'];
      }
    }
  }

  $lang_map = [
    0 => 'Left to right',
    1 => 'Right to left',
  ];

  if (array_search('field_read_order', $type_fields)) {
    $field_read_order_raw = $wrapper->field_read_order->value();
  }
  else {
    $fields['field_read_order'] = locale('Read order', NULL, $language);
    $field_read_order_raw = 0;
  }

  if (!empty($field_read_order_raw)) {
    $metadata['field_read_order'] = [
      'label' => $fields['field_read_order'],
      'value' => [
        locale($lang_map[$field_read_order_raw], NULL, $language),
      ],
    ];
  }

  if (array_search('field_binding_orientation', $type_fields)) {
    $field_binding_orientation_raw = $wrapper->field_binding_orientation->value();
    if (!empty($field_binding_orientation_raw)) {
      $metadata['field_binding_orientation'] = [
        'label' => $fields['field_binding_orientation'],
        'value' => [
          locale(['Vertical', 'Horizontal'][$field_binding_orientation_raw], NULL, $language),
        ],
      ];
    }
  }

  if (array_search('field_scan_order', $type_fields)) {
    $field_scan_order_raw = $wrapper->field_scan_order->value();
    if ($field_scan_order_raw) {
      $metadata['field_scan_order'] = [
        'label' => $fields['field_scan_order'],
        'value' => [
          locale(['Left to right', 'Right to left'][$field_binding_orientation_raw], NULL, $language),
        ],
      ];
    }
  }

  return $metadata;
}

/**
 * IIIF Presentation API v3 - Photo manifest.
 * @link https://localhost/viewer/api/presentation/photos/fales_mss208_cuid4751/manifest.json
 *
 * @param object $entity
 *   Photo node.
 * @param bool $cache
 *   TRUE if is ok to return a cached (in-disk) version of the manifest. Set
 *   to false if the manifest needs to be recreated from database.
 *
 * @return array
 *   IIIF Presentation API v3 - Photo manifest as array.
 */
function dlts_viewer_iiif_photo_manifest($entity, $cache = true) {

  global $base_url;

  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['reset']) && $query_parameters['reset'] == 'true') {
    $cache = false;
  }

  $module = drupal_get_path('module', 'dlts_viewer');

  $wrapper = entity_metadata_wrapper('node', $entity);

  $identifier = $wrapper->field_identifier->value();

  $ids = dlts_noid_load($identifier);

  $noid = $ids->noid;

  $realpath = drupal_realpath('public://');

  $bundle = $wrapper->getBundle();

  $type = dlts_viewer_get_bundle_alias($bundle);

  $dir_path = "{$realpath}/iiif/{$type}/{$identifier}";

  $file_destination = "$dir_path/manifest.json";

  if ($cache && file_exists($file_destination)) {
    return drupal_json_decode(
      file_get_contents($file_destination)
    );
  }

  $lang = 'en';

  $fields = [];

  $items = [];

  $thumbnail = [];

  $collection_codes = [];

  $partner_codes = [];

  // Default to left-to-rigth.
  $viewingDirection = 'left-to-right';

  $behavior = [ 'paged' ];

  $sequence_count = $wrapper->field_sequence_count->value();

  if ($sequence_count > 1) {
    $behavior = [ 'paged' ];
  }

  $collection_name = dlts_viewer_mongodb_collections_by_type($bundle);

  $sequences = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name);

  foreach ($sequences as $page) {
    $items[$page['realPageNumber'] - 1] = dlts_viewer_iiif_resource_page_canvas($bundle, $entity,
      [
        'sequence' => $page['sequence'],
        'width' => (int) $page['cm']['width'],
        'height' => (int) $page['cm']['height'],
      ]
    );
  }

  if ($sequences && !empty($sequences)) {
    $thumbnail_raw = $items[0]['items'][0]['items'][0]['body'];
    $thumbnail = [
      [
        'id' => $thumbnail_raw['id'] . '/full/!300,300/0/default.jpg',
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 300,
        'width' => 300,
        'service' => $thumbnail_raw['service'],
      ],
    ];
  }

  $partners = [];

  foreach ($wrapper->field_collection->value() as $collection) {
    $cw = entity_metadata_wrapper('node', $collection);
    $collection_code = $cw->field_code->value();
    $field_partner = $cw->field_partner->value();
    $pw = entity_metadata_wrapper('node',  $field_partner[0]);
    $partner_code = $pw->field_code->value();
    $partners[] = [
      'label' => $field_partner[0]->title,
      'code' => $partner_code,
    ];
    $collection_codes[] = $collection_code;
    $partner_codes[] = $partner_code;
    $partof[] = [
      'id' => "$base_url/api/presentation/collections/$collection_code:$partner_code/manifest.json",
      'type' => 'Collection',
      'label' => [
        $entity->language => [
          $cw->field_name->value(),
        ],
      ],
    ];
  }

  $collection_code = $collection_codes[0];

  $partner_code = $partner_codes[0];

  $hjson = dlts_viewer_repository_hjson($noid, $cache);

  $ijson = dlts_viewer_repository_ijson($noid, $partner_code, $collection_code);

  // I want to add this information to the request header.
  // $sourcefile = $ijson->runinfo->sourcefile;

  // $reposidentifier = $ijson->pubinfo->reposidentifier;

  $archdesc = $ijson->archdesc;

  $eadheader = $ijson->eadheader;

  // Resource
  $fields['resource'] = [
    'label' => [ $lang => [ 'Resource' ], ],
    'value' => [ $lang => [ $hjson->daodesc ], ],
  ];

  // Finding Aid Title
  if (isset($eadheader->filedesc->titlestmt->titleproper)) {
    $fields['findingaidtitle'] = [
      'label' => [ $lang => [ 'Finding Aid Title' ], ],
      'value' => [ $lang => [ strip_tags($eadheader->filedesc->titlestmt->titleproper) ], ],
    ];
  }

  // Permanent Link
  if (isset($hjson->href)) {
    $fields['permanentlink'] = [
      'label' => [ $lang => [ 'Permanent Link' ], ],
      'value' => [ $lang => [ "<a href='{$hjson->href}'>{$hjson->href}</a>" ], ],
    ];
  }

  // Provider
  if (isset($partners)) {
    $fields['provider'] = [
      'label' => [ $lang => [ 'Provider' ], ],
      'value' => [ $lang => [ $partners[0]['label'] ], ],
    ];
  }

  // Finding Aid URL
  if (isset($eadheader->eadid) && isset($eadheader->eadid->url)) {
    $fields['findingaidurl'] = [
      'label' => [ $lang => [ 'Finding Aid URL' ], ],
      'value' => [ $lang => [ $eadheader->eadid->url ], ],
    ];
  }

  // Language of Material
  if (isset($archdesc->did) && isset($archdesc->did->langmaterial) && isset($archdesc->did->langmaterial[0])) {
    $fields['langmaterial'] = [
      'label' => [ $lang => [ 'Language of Material' ] ],
      'value' => [ $lang => [ $archdesc->did->langmaterial[0]->value ], ],
    ];
  }

  // Title - this looks wrong need fix
  $title = html_entity_decode($hjson->unittitle);

  $fields['title'] = [
    'label' => [ $lang => [ 'Title' ], ],
    'value' => [ $lang => [ $title ], ],
  ];

  // Series
  // https://nyu.atlassian.net/browse/DLTSIMAGES-515
  if (isset($hjson->parenttitle) && !empty($hjson->parenttitle) && strtolower($hjson->parenttitle) != 'view inventory') {
    $fields['series'] = [
      'label' => [ $lang => [ 'Series' ], ],
      'value' => [ $lang => [ $hjson->parenttitle ], ],
    ];
  }

  // Date
  if (isset($hjson->unitdate) && !empty($hjson->unitdate)) {
    $fields['unitdate'] = [
      'label' => [ $lang => [ 'Date' ], ],
      'value' => [ $lang => [ $hjson->unitdate[0]->value ], ],
    ];
  }

  // Sponsor
  if (isset($eadheader->filedesc->titlestmt->sponsor)) {
    $fields['sponsor'] = [
      'label' => [ $lang => [ 'Sponsor' ], ],
      'value' => [ $lang => [ $eadheader->filedesc->titlestmt->sponsor ], ],
    ];
  }

  $required_statement = [];

  // Conditions Governing Use
  // Add 'Conditions Governing Use' <userrestrict> metadata field to Mirador viewer for archival objects
  // Should go in Copyright section
  if (isset($archdesc->userestrict) && !empty($archdesc->userestrict[0])) {
    foreach ($archdesc->userestrict as $userestrict) {
      if (isset($userestrict->children) && !empty($userestrict->children)) {
        foreach ($userestrict->children as $item) {
          $required_statement[]= "<p>{$item->value->value}</p>";
        }
      }
    }
  }

  // Preferred Citation
  // Should go in Copyright section
  if (isset($archdesc->prefercite)) {
    $prefercite = $archdesc->prefercite[0];
    foreach ($prefercite->children as $children) {
      $required_statement[] = "<p>{$children->value->value}</p>";
    }
  }

  if (isset($title)) {
    $label = $title;
  } else {
    $label = $entity->title;
  }

  $metadata = array_values($fields);

  $res = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$type/$identifier/manifest.json",
    'type' => 'Manifest',
    'label' => [
      $lang => [ $label ],
    ],
    'behavior' => $behavior,
    'items' => $items,
    'metadata' => $metadata,
    'provider' => [ [
      'id' => 'https://dlib.nyu.edu/',
      'type' => 'Agent',
      'label' => [ $lang => [ "NYU Digital Library Technology Services" ], ],
      'homepage' => [ [
        'id' => 'https://dlib.nyu.edu/',
        'type' => 'Text',
        'label' => [ $lang => [ "NYU Digital Library Technology Services" ], ],
        'format' => 'text/html',
      ], ],
      'logo' => [ [
        'id' => "$base_url/$module/images/nyu-logo.jpg",
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 900,
        'width' => 900,
      ], ],
    ], ],
    'viewingDirection' => $viewingDirection,
    'homepage' => [
      [
        'id' => "$base_url/$type/$identifier/1",
        'type' => 'Text',
        'label' => [
          'en' => [
            'View on NYU DLTS Viewer',
          ],
        ],
        'format' => 'text/html',
      ],
    ],

    'partOf' => $partof,
    'thumbnail' => $thumbnail,
  ];

  if (isset($required_statement)) {

    $res['requiredStatement'] = [
      'label' => [
        'en' => [
          'Rights',
        ],
      ],
      'value' => [
        'en' =>  [ implode($required_statement) ],
      ],
    ];
  }

  drupal_register_shutdown_function('dlts_viewer_cache_manifest', [ 'type' => $type, 'resource' => $entity, 'data' => $res, ]);

  return $res;

}

/**
 * Generates a IIIF Presentation API v3 manifest for a map resource.
 *
 * @link https://manifests.sub.uni-goettingen.de/iiif/presentation/PPN857449303/manifest
 * @link http://localhost:9000/api/presentation/maps/fales_io_map000205/manifest.json
 *
 * @param object $entity
 *   The map node object.
 * @param bool $cache
 *   TRUE if it is ok to return a cached (in-disk) version of the manifest.
 *   Set to FALSE if the manifest needs to be recreated from the database.
 *
 * @return array
 *   The IIIF Presentation API v3 map manifest as a PHP array.
 */
function dlts_viewer_iiif_map_manifest($entity, $cache = TRUE) {

  global $base_url;

  $module = drupal_get_path('module', 'dlts_viewer');

  $wrapper = entity_metadata_wrapper('node', $entity);

  $identifier = $wrapper->field_identifier->value();

  $realpath = drupal_realpath('public://');

  $bundle = $wrapper->getBundle();

  $type = dlts_viewer_get_bundle_alias($bundle);

  $dir_path = $realpath . '/iiif/' . $type . '/' . $identifier;

  $file_destination = "$dir_path/manifest.json";

  if ($cache && file_exists($file_destination)) {
    return drupal_json_decode(
      file_get_contents($file_destination)
    );
  }

  $fields = [];

  // $collections = [];

  $availableLanguages = language_list();

  // https://iiif.io/api/presentation/3.0/#rendering
  $field_pdf_file_raw = $wrapper->field_pdf_file->value();

  if ($field_pdf_file_raw) {
    $pdfs = [];
    foreach ($field_pdf_file_raw as $value) {
      $data = array(
        'uri' => $value['uri'],
        'label' => $value['label'],
      );
      $data['size'] = field_fileserver_get_pdf_filesize($data);
      $data['uri'] = file_create_url($data['uri']);
      $filename = pathinfo($data['uri'], PATHINFO_FILENAME);
      preg_match('/_(hi|lo)/', $filename, $matches);
      if (isset($matches) && isset($matches[1])) {
        switch ($matches[1]) {
          case 'hi':
            $pdfs[] = array(
              'id' => $data['uri'],
              'type' => 'Text',
              'format' => 'application/pdf',
              'label' => [
                'en' => [
                  locale('High-resolution PDF rendering', NULL, 'en') . ' (' . field_fileserver_human_filesize($data['size']) . ')',
                ],
              ],
            );
            break;

          case 'lo':
            $pdfs[] = array(
              'id' => $data['uri'],
              'type' => 'Text',
              'format' => 'application/pdf',
              'label' => [
                'en' => [
                  locale('Low-resolution PDF rendering', NULL, 'en') . ' (' . field_fileserver_human_filesize($data['size']) . ')',
                ],
              ],
            );
            break;
        }
      }
    }
  }

  // Default to left-to-rigth.
  // will set later on using the book field "field_language_code"
  // and the language map from $availableLanguages.
  $viewingDirection = 'left-to-right';

  $lang_map = [
    0 => 'left-to-right',
    1 => 'right-to-left',
  ];

  $field_language_code_raw = $wrapper->field_language_code->value();
  if ($field_language_code_raw) {
    $language_code_raw = dlts_viewer_map_language_code($field_language_code_raw);
    if (isset($availableLanguages[$language_code_raw])) {
      $viewingDirection = $lang_map[$availableLanguages[$language_code_raw]->direction];
    }
  }

  $behavior = [ 'individuals' ];

  $sequence_count = $wrapper->field_sequence_count->value();

  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);

  $translations = [
    $entity->language => $wrapper,
  ];

  $search_nid = array_search($entity->nid, $nids);

  if ($search_nid !== FALSE) {
    unset($nids[$search_nid]);
  }

  foreach ($nids as $nid) {
    $translations[] = entity_metadata_wrapper('node', $nid);
  }

  $items = [];

  $values = [];

  $fields = [];

  $metadata_fields = [
    'field_author',
    'field_contributor',
    'field_creator',
    'field_editor',
    'field_subtitle',
    'field_description',
    'field_call_number',
    'field_dimensions',
    'field_title',
    'field_publication_date_text',
    'field_publication_location',
    'field_identifier',
    'field_language',
    'field_language_code',
    'field_page_count',
    'field_publisher',
    'field_scanning_notes',
    'field_sequence_count',
    'field_topic',
  ];

  // https://iiif.io/api/presentation/3.0/#metadata
  foreach ($translations as $translation) {
    $values[$translation->language->value()] = dlts_book_fields_values($translation, $metadata_fields);
  }

  foreach ($values as $lang => $field) {
    foreach ($field as $name => $value) {
      if (empty($value['value'])) {
        continue;
      }
      if (!isset($fields[$name])) {
        $fields[$name] = [];
      }
      $fields[$name]['label'][$lang] = [$value['label']];
      $fields[$name]['value'][$lang] = $value['value'];
    }
  }

  $field_rights_raw = $wrapper->field_rights->value();
  if ($field_rights_raw) {
    $required_statement = [
      'label' => [
        'en' => [
          locale('Rights', NULL, 'en'),
        ],
      ],
      'value' => [
        'en' => [
          $field_rights_raw,
        ],
      ],
    ];
  }

  if ($sequence_count > 1) {
    $behavior = [ 'paged' ];
  }

  $collection_name = dlts_viewer_mongodb_collections_by_type($bundle);

  $sequences = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name);

  foreach ($sequences as $page) {
    // This index is a hack until I figure out the MongoDB query to
    // remove duplicates.
    $items[$page['realPageNumber'] - 1] = dlts_viewer_iiif_resource_page_canvas(
      $wrapper->getBundle(),
      $entity,
      [
        'sequence' => $page['sequence'],
        'width' => (int) $page['cm']['width'],
        'height' => (int) $page['cm']['height'],
      ]
    );
  }

  $thumbnail = [];

  if ($sequences && !empty($sequences)) {
    $thumbnail_raw = $items[0]['items'][0]['items'][0]['body'];
    $thumbnail = [
      [
        'id' => $thumbnail_raw['id'] . '/full/!300,300/0/default.jpg',
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 300,
        'width' => 300,
        'service' => $thumbnail_raw['service'],
      ],
    ];
  }

  $logo = "$base_url/$module/images/nyu-logo.jpg";

  $metadata = array_values($fields);

  $res = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$type/$identifier/manifest.json",
    'type' => 'Manifest',
    'label' => $fields['field_title']['value'],
    'behavior' => $behavior,
    'items' => $items,
    'metadata' => $metadata,
    'viewingDirection' => $viewingDirection,
    'homepage' => [
      [
        'id' => "$base_url/$type/$identifier/1",
        'type' => 'Text',
        'label' => [
          'en' => [
            'View on NYU DLTS Viewer',
          ],
        ],
        'format' => 'text/html',
      ],
    ],
    'logo' => [
      [
        'id' => $logo,
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 900,
        'width' => 900,
      ],
    ],
    'thumbnail' => $thumbnail,
  ];

  if (isset($pdfs)) {
    $res['rendering'] = $pdfs;
  }

  if (isset($fields['field_description']) && !empty($fields['field_description']['value'])) {
    $res['summary'] = $fields['field_description']['value'];
  }

  if (isset($required_statement)) {
    $res['requiredStatement'] = $required_statement;
  }

  drupal_register_shutdown_function('dlts_viewer_cache_manifest', [ 'type' => $type, 'resource' => $entity, 'data' => $res ]);

  return $res;

}

/**
 * IIIF Presentation API v3 - Book manifest.
 *
 * @link http://[HOST]/api/presentation/books/princeton_aco000102/manifest.json
 *
 * @param object $entity
 *   Book node.
 * @param bool $cache
 *   TRUE if is ok to return a cached (in-disk) version of the manifest. Set
 *   to false if the manifest needs to be recreated from database.
 *
 * @return array
 *   IIIF Presentation API v3 - Book manifest as array.
 */
function dlts_viewer_iiif_book_manifest($entity, $cache = TRUE) {

  global $base_url;

  $wrapper = entity_metadata_wrapper('node', $entity);

  $identifier = $wrapper->field_identifier->value();

  $realpath = drupal_realpath('public://');

  $bundle = $wrapper->getBundle();

  $type = dlts_viewer_get_bundle_alias($bundle);

  $dir_path = "$realpath/iiif/$type/$identifier";

  $file_destination = "$dir_path/manifest.json";

  if ($cache && file_exists($file_destination)) {
    // @todo Thinks about this, we are decoding a JSON file
    // so that we can pass it to drupal_json_output
    // and then json_encode it again...
    // should we create another output callback?
    return drupal_json_decode(
      file_get_contents($file_destination)
    );
  }

  $module = drupal_get_path('module', 'dlts_viewer');

  $fields = [];

  $volumes = [];

  $items = [];

  $values = [];

  $pdfs = [];

  $partof = [];

  $availableLanguages = language_list();

  // Default to left-to-rigth.
  // will set later on using the book field "field_language_code"
  // and the language map from $availableLanguages.
  $viewingDirection = 'left-to-right';

  $lang_map = [
    0 => 'left-to-right',
    1 => 'right-to-left',
  ];

  $field_language_code_raw = $wrapper->field_language_code->value();

  if ($field_language_code_raw) {
    $language_code_raw = dlts_viewer_map_language_code($field_language_code_raw);
    if (isset($availableLanguages[$language_code_raw])) {
      $viewingDirection = $lang_map[$availableLanguages[$language_code_raw]->direction];
    }
  }

  $behavior = ['individuals'];

  $sequence_count = $wrapper->field_sequence_count->value();

  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);

  $translations = [
    $entity->language => $wrapper,
  ];

  $search_nid = array_search($entity->nid, $nids);

  if ($search_nid !== FALSE) {
    unset($nids[$search_nid]);
  }

  foreach ($nids as $nid) {
    $nid_wrapper = entity_metadata_wrapper('node', $nid);
    $translations[$nid_wrapper->language->value()] = $nid_wrapper;
    unset($nid_wrapper);
  }

  $translations_keys = array_keys($translations);

  // https://iiif.io/api/presentation/3.0/#rendering
  $field_pdf_file_raw = $wrapper->field_pdf_file->value();

  if ($field_pdf_file_raw) {
    foreach ($field_pdf_file_raw as $value) {

      $data = [
        'uri' => $value['uri'],
        'label' => $value['label'],
      ];

      $udata = unserialize($value['data']);

      $data['size'] = 'Not available';

      if (isset($udata['filesize'])) {
        $data['size'] = field_fileserver_human_filesize( (int) $udata['filesize']);
      }

      $data['uri'] = file_create_url($data['uri']);

      $filename = pathinfo($data['uri'], PATHINFO_FILENAME);

      preg_match('/_(hi|lo)/', $filename, $matches);

      if (isset($matches) && isset($matches[1])) {
        switch ($matches[1]) {
          case 'hi':
            $pdfs[] = [
              'id' => $data['uri'],
              'type' => 'Text',
              'format' => 'application/pdf',
              'label' => [
                'en' => [
                  locale('High-resolution PDF rendering', NULL, 'en') . ' (' . $data['size'] . ')',
                ],
              ],
            ];
            break;
          case 'lo':
            $pdfs[] = [
              'id' => $data['uri'],
              'type' => 'Text',
              'format' => 'application/pdf',
              'label' => [
                'en' => [
                  locale('Low-resolution PDF rendering', NULL, 'en') . ' (' . $data['size'] . ')',
                ],
              ],
            ];
            break;
        }
      }
    }
  }

  $metadata_fields = [
    'field_author',
    'field_contributor',
    'field_creator',
    'field_editor',
    'field_subtitle',
    'field_description',
    'field_call_number',
    'field_volume',
    'field_title',
    'field_publication_date_text',
    'field_publication_location',
    'field_isbn',
    'field_language',
    'field_publisher',
    'field_topic',
    // 'field_scanning_notes',
    // 'field_sequence_count',
    // 'field_language_code',
    // 'field_number',
    // 'field_page_count',
    // 'field_identifier',
    // 'field_dimensions',
  ];

  // https://iiif.io/api/presentation/3.0/#metadata
  foreach ($translations as $lang => $translation) {
    $values[$lang] = dlts_book_fields_values($translation, $metadata_fields);
  }

  foreach ($values as $lang => $field) {
    foreach ($field as $name => $value) {
      if (empty($value['value'])) {
        continue;
      }
      if (!isset($fields[$name])) {
        $fields[$name] = [];
      }
      $fields[$name]['label'][$lang] = [$value['label']];
      $fields[$name]['value'][$lang] = $value['value'];
    }
  }

  // https://jira.nyu.edu/browse/DLTSVIEWER-152
  unset($fields['field_page_count']);
  unset($fields['field_dimensions']);
  unset($fields['field_identifier']);
  unset($fields['field_sequence_count']);
  unset($fields['field_geographic_subject']);
  unset($fields['field_geographic_coordinates']);
  unset($fields['field_language_code']);
  unset($fields['field_binding_orientation']);
  unset($fields['field_read_order']);
  unset($fields['field_scan_order']);
  unset($fields['field_scanning_notes']);
  unset($fields['field_ocr_text']);

  $field_rights_raw = $wrapper->field_rights->value();

  if ($field_rights_raw) {
    $required_statement = [
      'label' => [
        'en' => [
          locale('Rights', NULL, 'en'),
        ],
      ],
      'value' => [
        'en' => [
          $field_rights_raw,
        ],
      ],
    ];
  }

  foreach ($wrapper->field_collection->value() as $collection) {
    $cw = entity_metadata_wrapper('node', $collection);
    $collection_code = $cw->field_code->value();
    $field_partner = $cw->field_partner->value();
    $pw = entity_metadata_wrapper('node',  $field_partner[0]);
    $partner_code = $pw->field_code->value();
    $partof[] = [
      // '@context' => 'http://iiif.io/api/presentation/3/context.json',
      'id' => "$base_url/api/presentation/collections/$collection_code:$partner_code/manifest.json",
      'type' => 'Collection',
      'label' => [
        $entity->language => [
          $cw->field_name->value(),
        ],
      ],
    ];
  }

  if ($sequence_count > 1) {
    $behavior = [ 'paged' ];
  }

  // Check if this books is part of a multivol.
  $multivolume_book = dlts_viewer_is_multivolume_book($entity);

  // If book is part of multi-volume; append volume value to entity title.
  if ($multivolume_book) {

    $multivolume_book_wrapper = entity_metadata_wrapper('node', $multivolume_book);

    $multivolume_idenfier = $multivolume_book_wrapper->field_identifier->value();

    $multivolume_partof = [
      // '@context' => 'http://iiif.io/api/presentation/3/context.json',
      'id' => "$base_url/api/presentation/multivolume/$multivolume_idenfier/manifest.json",
      'type' => 'Collection',
      'label' => [
        $multivolume_book_wrapper->language->value() => [
          $multivolume_book_wrapper->title->value(),
        ],
      ],
      'items' => [],
    ];

    // Get volume value.
    $volume_number_str = $multivolume_book_wrapper->field_volume_number_str->value();

    // Change entity title.
    foreach ($fields['field_title']['value'] as $key => $value) {
      $fields['field_title']['value'][$key][0] = t('@title @volume', [ '@title' => $value[0], '@volume' => $volume_number_str ]);
    }

    $multivolume_books = dlts_viewer_books_is_partof_multivolume($multivolume_book_wrapper->field_multivol->value()->nid);

    foreach ($multivolume_books as $mb) {
      // wrapp multi-volume entity with Entity API wrapper
      $mb_wrapper = entity_metadata_wrapper('node', $mb);
      // the book we map to this multivolume
      $bs_wrapper = entity_metadata_wrapper('node', $mb_wrapper->field_book->value());
      $multivolume_book_idenfier = $bs_wrapper->field_identifier->value();

      // @TODO:  Here I need to find out if the book has translations; if so, I need to get the translation.
      $multivolume_partof['items'][] = [
        'id' => "$base_url/api/presentation/books/$multivolume_book_idenfier/manifest.json",
        'type' => 'Manifest',
        'label' => [
          $multivolume_book_wrapper->language->value() => t('@title @volume', [ '@title' => $mb->title, '@volume' => $mb_wrapper->field_volume_number_str->value() ]),
        ],
      ];

      unset($mb_wrapper);
    }
    unset($multivolume_book);
    asort($volumes);

    // Need fix
    // $partof[] = $multivolume_partof;
  }

  $collection_name = dlts_viewer_mongodb_collections_by_type($bundle);

  $sequences = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name);

  $thumbnail = [];

  $field_representative_image = $wrapper->field_representative_image->value();

  $field_representative_image_uri = '';

  if (isset($field_representative_image['uri']) && !empty($field_representative_image['uri'])) {
    $field_representative_image_uri = $field_representative_image['uri'];
  }

  foreach ($sequences as $page) {
    // find the representative image and use it as the thumbnail.
    if ($page['cm']['uri'] == $field_representative_image_uri) {
      $sequence = end($page['sequence']);
      $thumbnail[] = [
        'id' => "$base_url/api/image/$type/$identifier/$sequence/full/!300,300/0/default.jpg",
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 300,
        'width' => 300,
        'service' => [
          [
            'id' => "$base_url/api/image/$type/$identifier/$sequence",
            'type' => 'ImageService2',
            'profile' => 'level1',
          ],
        ],
      ];
    }

    $items[$page['realPageNumber'] - 1] = dlts_viewer_iiif_resource_page_canvas(
      $wrapper->getBundle(),
      $entity,
      [
        'sequence' => $page['sequence'],
        'width' => (int) $page['cm']['width'],
        'height' => (int) $page['cm']['height'],
      ]
    );
  }

  if (empty($thumbnail) && $sequences && !empty($sequences)) {
    $thumbnail_raw = $items[0]['items'][0]['items'][0]['body'];
    $thumbnail = [
      [
        'id' => $thumbnail_raw['id'] . '/full/!300,300/0/default.jpg',
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 300,
        'width' => 300,
        'service' => $thumbnail_raw['service'],
      ],
    ];
  }

  $metadata = array_values($fields);

  $res = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$type/$identifier/manifest.json",
    'type' => 'Manifest',
    'label' => $fields['field_title']['value'],
    'behavior' => $behavior,
    'items' => $items,
    'metadata' => $metadata,
    'viewingDirection' => $viewingDirection,
    'homepage' => [
      [
        'id' => "$base_url/$type/$identifier/1",
        'type' => 'Text',
        'label' => [
          'en' => [
            'View on NYU DLTS Viewer',
          ],
        ],
        'format' => 'text/html',
      ],
    ],
    'logo' => [
      [
        'id' => "$base_url/$module/images/nyu-logo.jpg",
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 900,
        'width' => 900,
      ],
    ],
    'thumbnail' => $thumbnail,
  ];

  if (isset($pdfs)) {
    $res['rendering'] = $pdfs;
  }

  if (isset($fields['field_description']) && !empty($fields['field_description']['value'])) {
    $res['summary'] = $fields['field_description']['value'];
  }

  if (isset($required_statement)) {
    $res['requiredStatement'] = $required_statement;
  }

  if (isset($partof) && !empty($partof)) {
    $res['partOf'] = $partof;
  }

  // $series_books = dlts_viewer_series_book($entity->nid);

  // $isSeries = false;

  // if (!empty($series_books)) {
  //   $isSeries = true;
  //   foreach ($series_books as $series_book) {
  //     $series_wrapper = entity_metadata_wrapper('node', $series_book);
  //     $series_volume_number_str = trim($series_wrapper->field_volume_number_str->value());
  //     $series_title = t(
  //       '@title, @volume',
  //       array(
  //         '@title' => trim($series_wrapper->title->value()),
  //         '@volume' => $series_volume_number_str,
  //       )
  //     );
  //     $series_book_identifier = $series_wrapper->field_identifier->value();
  //     $parent = $series_wrapper->field_series->value();
  //     $parent_wrapper = entity_metadata_wrapper('node', $parent);
  //     $parent_title = trim($parent_wrapper->title->value());
  //     $parent_identifier = $parent_wrapper->field_identifier->value();
  //     $series[] = array(
  //       'title' => $series_title,
  //       'identifier' => $series_book_identifier,
  //       'isPartOf' => array(
  //         'title' => $parent_title,
  //         'identifier' => $parent_identifier,
  //       ),
  //     );
  //   }
  //   unset($series_volume_number_str);
  //   unset($series_title);
  //   unset($parent_series);
  //   unset($series_wrapper);
  //   unset($parent_wrapper);
  //   unset($series_books);
  // }

  drupal_register_shutdown_function('dlts_viewer_cache_manifest', [ 'type' => $type, 'resource' => $entity, 'data' => $res ]);

  return $res;

}

/**
 * Creates a IIIF canvas for a single page of a resource.
 *
 * This function constructs a canvas object for the IIIF manifest, representing
 * a single page or view of the resource. It includes the canvas dimensions,
 * a thumbnail, and the annotation page that links to the actual image.
 *
 * @link https://iiif.io/api/presentation/3.0/#canvas
 *
 * @param string $type
 *   The bundle name of the resource (e.g., 'dlts_book', 'dlts_photo_set').
 * @param object $resource
 *   The node object of the resource.
 * @param array $page
 *   An array containing page information, including sequence number, width,
 *   and height.
 *
 * @return array
 *   A IIIF canvas object as a PHP array.
 */
function dlts_viewer_iiif_resource_page_canvas($type, $resource, $page) {

  global $base_url;

  $sequence = $page['sequence'][0];

  $item = 1;

  $wrapper = entity_metadata_wrapper('node', $resource);

  $identifier = $wrapper->field_identifier->value();

  $resource_type = dlts_viewer_resource_type($type);

  return [
    'id' => "$base_url/api/presentation/$resource_type/$identifier/canvas/$sequence",
    'type' => 'Canvas',
    'label' => array(
      'en' => [
        (string) $sequence,
      ],
    ),
    'width' => (int) $page['width'],
    'height' => (int) $page['height'],
    'thumbnail' => [
      [
        'id' => "$base_url/api/image/$resource_type/$identifier/$sequence/full/!300,300/0/default.jpg",
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 300,
        'width' => 300,
        'service' => [
          [
            'id' => "$base_url/api/image/$resource_type/$identifier/$sequence",
            'type' => 'ImageService2',
            'profile' => 'level1',
          ],
      ],
      ],
    ],
    'items' => [
      dlts_viewer_iiif_book_page_annotation_page(
        $type,
        $resource,
        $page,
        $item
      ),
    ],
  ];

}

/**
 * Creates a IIIF AnnotationPage for a canvas.
 *
 * An AnnotationPage groups the annotations that apply to a canvas. In this
 * case, it contains the painting annotation that links the image to the canvas.
 *
 * @link https://iiif.io/api/presentation/3.0/#annotationpage
 * @link ${HOST}/api/v1/books/princeton_aco000102/canvas/p193/1
 *
 * @param string $type
 *   The bundle name of the resource.
 * @param object $resource
 *   The node object of the resource.
 * @param array $page
 *   An array containing page information.
 *
 * @return array
 *   A IIIF AnnotationPage object as a PHP array.
 */
function dlts_viewer_iiif_book_page_annotation_page($type, $resource, $page) {
  global $base_url;
  $wrapper = entity_metadata_wrapper('node', $resource);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $page['sequence'][0];
  $resource_type = dlts_viewer_resource_type($type);
  return array(
    'id' => "$base_url/api/presentation/$resource_type/$identifier/page/$sequence",
    'type' => 'AnnotationPage',
    'items' => array(
      dlts_viewer_iiif_annotation($type, $resource, $page),
    ),
  );
}

/**
 * Creates a IIIF painting annotation.
 *
 * This function creates the annotation that "paints" the image onto the
 * canvas. It links the image resource to the canvas it belongs to.
 *
 * @link https://iiif.io/api/presentation/3.0/#painting-annotations
 * @link ${HOST}/api/3/presentation/books/princeton_aco000102/annotation/painting/1
 *
 * @param string $type
 *   The bundle name of the resource.
 * @param object $resource
 *   The node object of the resource.
 * @param array $item
 *   An array containing item information (sequence, width, height).
 *
 * @return array
 *   A IIIF Annotation object as a PHP array.
 */
function dlts_viewer_iiif_annotation($type, $resource, $item) {
  global $base_url;
  $wrapper = entity_metadata_wrapper('node', $resource);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $item['sequence'][0];
  $resource_type = dlts_viewer_resource_type($type);
  $image = "$base_url/api/image/$resource_type/$identifier/$sequence";
  return [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$resource_type/$identifier/annotation/painting/$sequence",
    'type' => 'Annotation',
    'motivation' => 'painting',
    'body' => [
      'id' => $image,
      'type' => 'Image',
      'format' => 'image/jpeg',
      'service' => [
        [
          'id' => $image,
          'type' => 'ImageService2',
          'profile' => 'level1',
        ],
      ],
      'height' => (int) $item['height'],
      'width' => (int) $item['width'],
    ],
    'target' => "$base_url/api/presentation/$resource_type/$identifier/canvas/$sequence",
  ];
}

/**
 * Deprecated IIIF resolver.
 *
 * This function was used to resolve IIIF requests from an older system
 * (Djatoka). It is now deprecated.
 */
function dlts_viewer_djakot_iiif_resolver() {
  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);
  $query_parameters = drupal_get_query_parameters();
  if (isset($query_parameters['rft_id']) && isset($query_parameters['svc_level'])) {
    $pathinfo = pathinfo($query_parameters['rft_id']);

    $reqinfo = explode('/', $pathinfo['dirname']);

    $resources = [
      'books' => 'dlts_book',
      'photos' => 'dlts_photo_set',
      'photos' => 'dlts_photo',
      'maps' => 'dlts_map',
      'postcards' => 'dlts_postcard',
    ];

    $isPartOf = $reqinfo[5];

    $type = $reqinfo[4];

    $basename = $pathinfo['basename'];

    $basename = parse_url($basename, PHP_URL_PATH);

    $collection_name = dlts_viewer_mongodb_collections_by_type($resources[$type]);

    // Prepare query.
    $query = [
      'isPartOf' => $isPartOf,
      'cm.uri' => "fileserver://$type/$isPartOf/$basename",
    ];

    $cursor = mongodb_collection($collection_name);

    $sequence = $cursor->findOne($query);

    if ($query_parameters['svc_level'] == 1) {
      dlts_viewer_iiif_tile(null, null, $sequence['cm'], 'full', '250,', '0', 'default.jpg');
    } else {
      dlts_viewer_iiif_tile(null, null, $sequence['cm']);
    }

  } else {
    die('Missing parameters');
  }
}

/**
 * Generates a IIIF manifest for a single collection.
 *
 * This function creates a IIIF Collection manifest that lists all the items
 * (books, maps, photos) belonging to a specific collection.
 *
 * @param object $entity
 *   The collection node object.
 * @param bool $cache
 *   Whether to use a cached version of the manifest. Defaults to TRUE.
 *
 * @return array
 *   A IIIF Collection manifest as a PHP array.
 */
function dlts_viewer_iiif_resource_manifest_collections_item($entity, $cache = TRUE) {

  global $base_url;

  $wrapper = entity_metadata_wrapper('node', $entity);

  // $identifier = $wrapper->field_identifier->value();

  $name = $wrapper->field_name->value();

  $code = $wrapper->field_code->value();

  $partner = $wrapper->field_partner->value();

  $pwrapper = entity_metadata_wrapper('node', $partner[0]);

  $partner_code = $pwrapper->field_code->value();

  $partner_name = $pwrapper->field_name->value();

  $query = new EntityFieldQuery();

  $result = $query
    ->entityCondition('entity_type', 'node')
    ->propertyCondition('language', ['en', 'und'])
    ->entityCondition('bundle', [ 'dlts_map', 'dlts_book', 'dlts_photo_set' ])
    ->propertyCondition('status', 1)
    ->fieldCondition('field_collection', 'nid', $entity->nid, '=')
    ->addTag('node_access')
    ->execute();

  $items = [];

  if (!empty($result['node'])) {
    $nodes = node_load_multiple(array_keys($result['node']));
    foreach ($nodes as $node) {
      $ew = entity_metadata_wrapper('node', $node);
      $eidentifier = $ew->field_identifier->value();
      $bundle = $ew->getBundle();
      $type = dlts_viewer_resource_type($bundle);
      $items[] = [
        'id' => "$base_url/api/presentation/$type/$eidentifier/manifest.json",
        'type' => 'Manifest',
        'label' => [
          'en' => [
            $ew->title->value(),
          ],
        ],
        // 'thumbnail' => [
        //   [
        //     'id' => "$base_url/api/image/$type/$eidentifier/1/full/!300,300/0/default.jpg",
        //     'type' => 'Image',
        //     'format' => 'image/jpeg',
        //   ],
        // ],
      ];
    }
  }

  return [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/collections/$code:$partner_code/manifest.json",
    'type' => 'Collection',
    'label' => [
      'en' => [
        "$name - $partner_name",
      ],
    ],
    'items' => $items,
  ];

}

/**
 * Generates a IIIF manifest for a set of collections.
 *
 * This function can either generate a manifest for a single collection (if only
 * one is provided) or a higher-level collection that lists multiple
 * sub-collections.
 *
 * @param array $entities
 *   An array of collection node objects.
 * @param bool $cache
 *   Whether to use a cached version of the manifest. Defaults to TRUE.
 *
 * @return array
 *   A IIIF Collection manifest as a PHP array.
 */
function dlts_viewer_iiif_resource_manifest_collections($entities, $cache = TRUE) {
  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  global $base_url;

  if (count($entities) == 1) {
    $entity = reset($entities);
    return dlts_viewer_iiif_resource_manifest_collections_item($entity);
  }
  else {

    $items = [];

    foreach ($entities as $entity) {

      $wrapper = entity_metadata_wrapper('node', $entity);

      $name = $wrapper->field_name->value();

      $collection_code = $wrapper->field_code->value();

      $partner = $wrapper->field_partner->value();

      $pwrapper = entity_metadata_wrapper('node', $partner[0]);

      $partner_code = $pwrapper->field_code->value();

      $partner_name = $pwrapper->field_name->value();

      $items[] = [
        'id' => "$base_url/api/presentation/collections/$collection_code:$partner_code/manifest.json",
        'type' => 'Collection',
        'label' => [
          'en' => [
            "$name - $partner_name",
          ],
        ],
      ];
    }

  }

  $entity = next($entities);

  $wrapper = entity_metadata_wrapper('node', $entity);

  $name = $wrapper->field_name->value();

  $collection_code = $wrapper->field_code->value();

  return [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/collections/$collection_code/manifest.json",
    'type' => 'Collection',
    'label' => [
      'en' => [
        $name,
      ],
    ],
    'items' => $items,
  ];

}

/**
 * Generates a IIIF manifest listing all available collections.
 *
 * This function creates a top-level IIIF Collection manifest that serves as an
 * entry point to all collections in the system.
 *
 * @link https://iiif.io/api/presentation/3.0/#a-summary-of-property-requirements
 *
 * @return array
 *   A IIIF Collection manifest as a PHP array.
 */
function dlts_viewer_iiif_resource_manifest_collections_list() {
  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);
  global $base_url;

  $query = new EntityFieldQuery();

  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->propertyCondition('status', 1)
    ->addTag('node_access')
    ->execute();

  $items = [];

  if (!empty($result['node'])) {
    $nodes = node_load_multiple(array_keys($result['node']));
    foreach ($nodes as $node) {
      $ew = entity_metadata_wrapper('node', $node);
      $identifier = $ew->field_identifier->value();
      $collection_code = $ew->field_code->value();
      $partner_field = $ew->field_partner->value();
      $pw = entity_metadata_wrapper('node', $partner_field[0]);
      $partner_code = $pw->field_code->value();
      $partner_name = $pw->field_name->value();
      $collection_name = $ew->field_name->value();
      $items[] = [
        'id' => "$base_url/api/presentation/collections/$collection_code:$partner_code/manifest.json",
        'type' => 'Manifest',
        'label' => [
          'en' => [
            "$collection_name - $partner_name",
          ],
        ],
      ];
    }
  }

  return [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/collections/manifest.json",
    'type' => 'Collection',
    'label' => [
      'en' => [
        "All Collections",
      ],
    ],
    'items' => $items,
  ];
}

/**
 * Generates a IIIF manifest from a "boutique" JSON file.
 *
 * This function is intended to serve pre-generated, custom, or "boutique"
 * manifests that are stored as static JSON files. It looks for a file
 * matching the identifier and returns its content.
 *
 * @param string $identifier
 *   The identifier for the boutique manifest.
 *
 * @return array
 *   The decoded boutique manifest as a PHP array.
 */
function dlts_viewer_iiif_resource_manifest_boutique($identifier) {

  global $base_url;

  $items = [];

  $identifier = filter_xss($identifier);

  $realpath = drupal_realpath('public://');

  $filepath = "$realpath/boutique/$identifier.json";

  if (file_exists($filepath)) {
    return drupal_json_decode(
      file_get_contents($filepath)
    );
  }

  die('Not implemented yet');

}

/**
 * Fetches HJSON metadata for a resource from the repository.
 *
 * This function retrieves HJSON metadata for a given noid.
 * It can use a local file cache to avoid repeated HTTP requests. If the data
 * is not in the cache or if caching is disabled, it fetches the data from the
 * repository's metadata API endpoint, using credentials stored in Drupal
 * variables.
 *
 * @param string $noid
 *   The noid of the resource.
 * @param bool $cache
 *   (optional) Whether to use the cached version of the metadata if available.
 *   Defaults to TRUE.
 *
 * @return object|array
 *   The decoded HJSON metadata as a PHP object or array, or an error array
 *   if the repository credentials are not configured.
 */
function dlts_viewer_repository_hjson($noid, $cache = true) {

  // Username for the repository challange.
  $user = variable_get('publisher_user', NULL);

  // Password for repository challange.
  $pass = variable_get('publisher_pass', NULL);

  // Repository URL.
  $endpoint = variable_get('publisher_endpoint', NULL);

  if ($user && $pass && $endpoint) {

    $endpoint = parse_url($endpoint);

    $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'] . (isset($endpoint['path']) ? $endpoint['path'] : '');

    $item_metadata_endpoint = "$endpoint/metadata/api/v0/hjson/$noid.json";

    $realpath = drupal_realpath('public://');

    $dir_path = "$realpath/hjson";

    $file_path= "$dir_path/$noid.json";

    if ($cache && file_exists($file_path)) {

      $data = json_decode(
        file_get_contents($file_path)
      );

    } else {

      $request = drupal_http_request($item_metadata_endpoint);

      if ($request->code == '200') {

        $data = json_decode($request->data);

        drupal_register_shutdown_function('dlts_viewer_cache_hjson', [ 'noid' => $noid, 'data' => $request->data, ]);

      }

    }

    return $data;

  } else {
  
    return [ 'error' => 'error' ];

  }

}

/**
 * Fetches ijson metadata for a resource from the repository.
 *
 * This function retrieves ijson metadata for a given noid, partner code, and
 * collection code. It first checks for a cached version of the data. If
 * available and caching is enabled, it returns the cached data. Otherwise,
 * it constructs the appropriate API endpoint using repository credentials
 * (username, password, and endpoint URL) retrieved from Drupal variables.
 * It then makes an HTTP request to this endpoint, caches the response upon
 * success, and returns the decoded JSON data. The collection code is
 * transformed based on predefined patterns before constructing the API URL.
 *
 * @param string $noid
 *   The noid of the resource.
 * @param string $partner_code
 *   The code of the partner associated with the resource.
 * @param string $collection_code
 *   The code of the collection associated with the resource.
 * @param bool $cache
 *   (optional) Whether to use the cached version of the metadata if available.
 *   Defaults to TRUE.
 *
 * @return object|array
 *   The decoded ijson metadata as a PHP object or array, or an error array
 *   if the repository credentials are not configured or the request fails.
 */
function  dlts_viewer_repository_ijson($noid, $partner_code, $collection_code, $cache = true) {

  // Username for the repository challange.
  $user = variable_get('publisher_user', NULL);

  // Password for repository challange.
  $pass = variable_get('publisher_pass', NULL);

  // Repository URL.
  $endpoint = variable_get('publisher_endpoint', NULL);

  if ($user && $pass && $endpoint) {

    $endpoint = parse_url($endpoint);

    $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'] . (isset($endpoint['path']) ? $endpoint['path'] : '');

    $realpath = drupal_realpath('public://');

    $dir_path = "$realpath/ijson";

    $file_path = "$dir_path/$noid.json";

    if ($cache && file_exists($file_path)) {

      $data = json_decode(
        file_get_contents($file_path)
      );

    } else {

      $collection_code_transformed = $collection_code;

      // 1. Preferred Pattern: Handles R* code like 'ad_mc016' and transforms it to 'ad_mc_016'
      // Pattern: (Letters) _ (Letters) (Digits) -> Transformation: (Letters) _ (Letters) _ (Digits)
      if (preg_match('/^([a-zA-Z]+)_([a-zA-Z]+)(\d+)$/', $collection_code, $matches)) {
        array_shift($matches);
        $collection_code_transformed = implode('_', $matches); // Result: 'ad_mc_016'
      }

      // 2. NEW PATTERN: Handles codes like 'tam674' and transforms it to 'tam_674'
      // Pattern: (Letters)(Digits) -> Transformation: (Letters)_(Digits)
      else if (preg_match('/^([a-zA-Z]+)(\d+)$/', $collection_code, $matches)) {
        array_shift($matches);
        $collection_code_transformed = implode('_', $matches); // Result: 'tam_674'
      }

      // 3. Original, Faulty Pattern Test (Included for completeness/debugging)
      // Pattern: (Letters)(Digits)_(Digits)
      else if (preg_match('/^([a-zA-Z]+)(\d+)_(\d+)$/', $collection_code, $matches)) {
        array_shift($matches);
        $collection_code_transformed = implode('_', $matches);
      }
    
      else {
        return [ 'error' => 'error' ];
      }

      $ijson_endpoint = "$endpoint/metadata/api/v0/ijson/$partner_code/$collection_code_transformed/$collection_code_transformed.json";

      $ijson_request = drupal_http_request($ijson_endpoint);

      if ($ijson_request ->code == '200') {
        $data = json_decode($ijson_request->data);
        drupal_register_shutdown_function('dlts_viewer_cache_ijson', [ 'noid' => $noid, 'data' => $ijson_request->data, ]);
      } else {
        return [ 'error' => 'error' ];
      }

    }

    return $data;

  }

}
