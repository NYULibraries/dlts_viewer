<?php

/**
 * @file
 * Maps.
 */

/**
 * Implements template_preprocess_node().
 * @link https://api.drupal.org/api/drupal/modules%21node%21node.module/function/template_preprocess_node/7
 */
function dlts_viewer_preprocess_node_dlts_map(&$vars) {
  // We don't render a DLTS Map object, redirect to a "map page".
  if ($vars['view_mode'] == 'full') {
    $wrapper = entity_metadata_wrapper('node', $vars['node']);
    $identifier = $wrapper->field_identifier->value();
    drupal_goto('maps/' . $identifier . '/1');
  }
  $vars['language_dir'] = dlts_viewer_viewer_language($vars);
  if ($vars['view_mode'] == 'metadata') {
    $args = arg();
    $count = count($args);
    if ($count === 3 && $args[2] == 'display') {
      $vars['theme_hook_suggestions'][] = 'node__display';
    }
  }
}

/**
 * Render Map metadata view.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_map_metadata_view($entity) {
  $element = node_view($entity, 'metadata');
  return drupal_render($element);
}

/**
 * Render Map view.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_map_dispatcher($entity, array $arg) {

  global $base_url;

  $module_path = drupal_get_path('module', 'dlts_viewer');

  drupal_add_css("$module_path/dist/viewer.css", [ 'group' => CSS_DEFAULT,  'every_page' => TRUE ]);

  drupal_add_js(
    'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js',
    'external',
    [
      'group' => JS_LIBRARY,
      'weight' => -101,
    ]
  );

  drupal_add_js(
    'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/openseadragon.min.js',
    'external',
    [
      'group' => JS_LIBRARY,
      'weight' => -101,
    ]
  );

  drupal_add_js($module_path . '/dist/polyfill.bundle.js', [ 'type' => 'file', 'scope' => 'footer' ]);

  drupal_add_js($module_path . '/dist/books.bundle.js', [ 'type' => 'file', 'scope' => 'footer' ]);

  // Test if resource, will return the maped type of resource (e.g., books, photos).
  $is_resource = dlts_viewer_is_resource();

  // Check for mobile devices.
  $is_mobile = dlts_viewer_is_mobile();

  drupal_set_title($entity->title);

  // Wrapp map entity with Entity API wrapper.
  $book_wrapper = entity_metadata_wrapper('node', $entity);

  // Map identifier.
  $identifier = $book_wrapper->field_identifier->value();

  // Set $identifier so that .tpl.php can use it.
  $entity->identifier = $identifier;

  // URL.
  $book_url = url('node/' . $entity->nid, array('absolute' => TRUE));

  // Set $url so that .tpl.php can use it.
  $entity->url = $book_url;

  $button_metadata_options = array(
    'title' => t('Metadata'),
    'path' => 'node/' . $entity->nid,
    'attributes' => array(
      'data-title' => t('Metadata'),
      'title' => t('Show/hide metadata'),
      'class' => array(
        'button',
        'metadata',
        'on',
      ),
      'id' => array(
        'button-metadata',
      ),
    ),
    'fragment' => 'metadata',
  );

  $button_fullscreen_options = array(
    'title' => t('Toggle fullscreen'),
    'path' => 'node/' . $entity->nid,
    'attributes' => array(
      'data-title' => t('Toggle fullscreen'),
      'title' => t('Toggle fullscreen'),
      'class' => array('button', 'fullscreen', 'off'),
      'id' => array(
        'button-fullscreen',
      ),
    ),
    'fragment' => 'fullscreen',
  );

  // Fullscreen button.
  $button_fullscreen = theme('dlts_viewer_navbar_item', $button_fullscreen_options);

  // Metadata button.
  $button_metadata = theme('dlts_viewer_navbar_item', $button_metadata_options);

  // Map page sequence number.
  $entity->book_page_sequence_number = 1;

  $navbar_options = [
    'metadata' => [
      'label' => t('Show/hide metadata'),
      'operation' => 'togglemetadata',
      'href' => '#metadata',
      'class' => implode(' ', [
        'button',
        'metadata',
        (($is_mobile) ? 'off' : 'on')
      ]),
      'id' => 'button-metadata',
    ],
  ];

  $entity->navbar = theme('dlts_viewer_navbar', $navbar_options);

  $entity->button_metadata = $button_metadata;

  $entity->pane_metadata_hidden = $is_mobile;

  $entity->pageView = 'single';

  $arg['pageView'] = $entity->pageView;

  $servie_url = "$base_url/api/image";

  $entity->sequence_count = 1;

  $entity->sequence = 1;

  $entity->manifest = "$base_url/api/image/$is_resource/$entity->identifier/$entity->sequence/info.json";

  $entity->presentation = t('<a href="@url">IIIF Presentation</a>', [ '@url' => url("$base_url/api/presentation/$is_resource/$entity->identifier/manifest.json") ]);

  $entity->book_page = theme(
    'dlts_viewer_openseadragon_image',
    [
      'id' => 'openseadragon1',
      'view' => 'single',
      'type' => $is_resource,
      'identifier' => $identifier,
      'sequence' => 1,
      'count' => 1,
      'manifest' => "$base_url/api/image/$is_resource/$identifier/1/info.json",
      'service' => $servie_url,
      'uri' => "$base_url/$is_resource/$identifier/1",
      'dir' => 'ltr',
      'classList' => [
        'dlts_image_map',
        'dlts_viewer_map',
      ],
    ]
  );

  return node_view($entity, 'metadata', $entity->language);

}

/**
 * Route callback for books edit page.
 *
 * @param object $node
 *   Node.
 */
function _dlts_viewer_map_edit_redirect($node) {
  if (is_object($node)) {
    $wrapper = entity_metadata_wrapper('node', $node);
    $identifier = $wrapper->field_identifier->value();
    if ($identifier) {
      $path = drupal_lookup_path('source', "maps/$identifier");
      if ($path) {
        drupal_goto("$path/edit");
      }
    }
  }
  drupal_not_found();
}

/**
 * Map metadata display .
 *
 * @param object $node
 *   Node.
 */
function dlts_viewer_map_metadata_display($node) {
  return node_view($node, 'metadata', $node->language);
}

/**
 * Map metadata display .
 *
 * @param object $entity
 *   Node.
 * @param bool $add_pages
 *   True if must include pages.
 */
function _dlts_viewer_map_json($entity, $add_pages = TRUE) {

  header("Access-Control-Allow-Origin: *");

  header('Content-Type: application/json;charset=utf-8');

  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  // Wrapp book entity with Entity API wrapper.
  $map = entity_metadata_wrapper('node', $entity);

  // Identifier.
  $identifier = $map->field_identifier->value();

  $title = $entity->title;

  $type = dlts_viewer_content_types_type($entity->type);

  $fields = [];

  $pages = [];

  foreach ($type['fields'] as $field) {
    $name = str_replace('field_', '', $field['field_name']);
    $raw_value = $map->$field['field_name']->value();
    if ($field['label'] != 'Representative Image') {
      if ($field['type'] == 'options_buttons') {
        $value = $field['settings']['allowed_values'][$raw_value];
      }
      elseif ($field['type'] == 'link_field' && isset($raw_value['url'])) {
        $value = $raw_value['url'];
      }
      elseif ($field['type'] == 'field_fileserver_link') {
        $value = array();
        foreach ((array) $raw_value as $pdf_file) {
          $value[] = ($pdf_file['uri']);
        }
      }
      elseif ($field['type'] == 'date_text') {
        $raw_value['value'];
      }
      elseif ($field['type'] == 'taxonomy_autocomplete') {
        $value = array();
        foreach ($raw_value as $taxonomy) {
          $value[] = $taxonomy->name;
        }
      }
      elseif ($field['label'] == 'Collection') {
        $value = array();
        foreach ($raw_value as $collection) {
          $collection_wrapper = entity_metadata_wrapper('node', $collection);
          $col_partner = $collection_wrapper->field_partner->value();
          $partner_wrapper = entity_metadata_wrapper('node', $col_partner[0]);
          $value[] = array(
            'title' => $collection_wrapper->title->value(),
            'identifier' => $collection_wrapper->field_identifier->value(),
            'code' => $collection_wrapper->field_code->value(),
            'name' => $collection_wrapper->field_name->value(),
            'type' => 'dlts_collection',
            'language' => 'und',
            'partner' => array(
              'title' => $partner_wrapper->title->value(),
              'type' => 'dlts_partner',
              'language' => 'und',
              'identifier' => $partner_wrapper->field_identifier->value(),
              'code' => $partner_wrapper->field_code->value(),
              'name' => $partner_wrapper->field_name->value(),
            ),
          );
        }
      }
      elseif ($field['label'] == 'Provider') {
        $value = array();
        foreach ($raw_value as $partner) {
          $partner_wrapper = entity_metadata_wrapper('node', $partner);
          $value[] = array(
            'title' => $partner_wrapper->title->value(),
            'identifier' => $partner_wrapper->field_identifier->value(),
            'code' => $partner_wrapper->field_code->value(),
            'name' => $partner_wrapper->field_name->value(),
            'type' => 'dlts_partner',
            'language' => 'und',
          );
        }
      }
      else {
        $value = $raw_value;
      }
      $fields[$name] = array(
        'label' => $field['label'],
        'value' => (array) $value,
      );
    }
    else {
      $fields[$name] = array(
        'isPartOf' => $identifier,
        'sequence' => array(1),
        'realPageNumber' => 1,
        'cm' => array(
          'uri' => $raw_value['uri'],
        ),
      );
    }
  }

  // $page_count = $entity->field_page_count['en'][0]['value'];

  if ($add_pages) {
    $pages_raw = dlts_viewer_mongodb_load_by_item_identifier($identifier, 'dlts_map_page');
    foreach ($pages_raw as $page_raw) {
      $page = [
        'page' => [
          'isPartOf' => $identifier,
          'realPageNumber' => $page_raw['realPageNumber'],
          'sequence' => $page_raw['sequence'],
          'cm' => [
            'uri' => $page_raw['cm']['uri'],
            'width' => $page_raw['cm']['width'],
            'height' => $page_raw['cm']['height'],
            'levels' => $page_raw['cm']['levels'],
            'dwtLevels' => $page_raw['cm']['dwtLevels'],
            'compositingLayerCount' => $page_raw['cm']['compositingLayerCount'],
            'timestamp' => $page_raw['cm']['timestamp'],
          ],
        ],
      ];
      $pages[] = $page;
    }
  }
  echo json_encode(
    array(
      'entity_title' => !empty($title) ? $title : $entity->title,
      'identifier' => $identifier,
      'entity_path' => url('maps/' . $identifier . '/1', array('absolute' => TRUE)),
      'base_url' => url('', array('absolute' => TRUE)),
      'entity_language' => $entity->language,
      'entity_status' => $entity->status,
      'entity_type' => $entity->type,
      'metadata' => $fields,
      'pages' => $pages,
    )
  );
}
