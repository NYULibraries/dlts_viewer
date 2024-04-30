<?php

/**
 * @file
 * photo.inc
 */

 // Photo set
 // https://[HOST]/photos/AD_MC_036_ref349

/**
 * Photo set dispatcher.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_photo_set_dispatcher($entity) {

  global $base_url;

  // Load helpers.
  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  $module_path = drupal_get_path('module', 'dlts_viewer');

  drupal_add_css("$module_path/dist/viewer.css", [ 'group' => CSS_DEFAULT,  'every_page' => TRUE ]);

  // Test if resource, will return the maped type of resource (e.g., books, photos).
  $is_resource = dlts_viewer_is_resource();

  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  // Identifier.
  $identifier = $wrapper->field_identifier->value();

  // Count.
  $count = $wrapper->field_page_count->value();

  // Collection.
  $field_collection = $wrapper->field_collection->value();

  // Partner.
  // $field_partner = $wrapper->field_partner->value();

  // Title.
  $title = $wrapper->field_title->value();

  $service = "$base_url/api/image";

  $index = 0;

  $resources = [];

  $width = 150;

  $height = '';

  while ($index < $count) {
    $sequence = (int) $index + 1;
    $resources[] = [
      'identifier' => "$identifier/$sequence",
      'sequence' => $sequence,
      'url' => "$service/$is_resource/$identifier/$sequence/full/$width,$height/0/default.jpg",
      'manifest' => "$base_url/api/image/$is_resource/$identifier/$sequence/info.json",
      'width' => $width,
      'height' => $height,
      'path' => "$base_url/$is_resource/$identifier/$sequence",
    ];
    $index++;
  }

  $collections = [];

  foreach ($field_collection as $collection) {
    $collection_wrapper = entity_metadata_wrapper('node', $collection);
    $collections[] =  (object) [
      'label' => $collection_wrapper->field_name->value(),
      'code' => $collection_wrapper->field_code->value(),
      'identifier' => $collection_wrapper->field_identifier->value(),
    ];
  }

  $collection_title = $collections[0]->label;

  $page_title = "$collection_title - $title";

  drupal_set_title($page_title);

  return theme('dlts_viewer_set', [
    'title' => null,
    'identifier' => $identifier,
    'resources' => $resources,
    'collections' => $collections,
  ]);

}

/**
 * Photo dispatcher.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_photo_dispatcher($entity, $sequence) {

  global $base_url;

  $module_path = drupal_get_path('module', 'dlts_viewer');

  drupal_add_css($module_path . '/dist/viewer.css', [ 'group' => CSS_DEFAULT, 'every_page' => TRUE ]);

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

  // Wrapp book entity with Entity API wrapper.
  $set_wrapper = entity_metadata_wrapper('node', $entity);

  // Identifier.
  $identifier = $set_wrapper->field_identifier->value();

  // Set $identifier so that .tpl.php can use it.
  $entity->identifier = $identifier;

  // Set $url so that .tpl.php can use it.
  $entity->url = url("$is_resource/$entity->identifier", [ 'absolute' => TRUE ]);

  $entity->sequence = array_pop($sequence['sequence']);

  $sequence_count = $set_wrapper->field_sequence_count->value();

  $entity->read_order = 'ltr';

  $next_page = $entity->sequence + 1;

  $previous_page = $entity->sequence - 1;

  $previous_page_active = TRUE;

  $next_page_active = TRUE;

  if ($previous_page < 1) {
    $previous_page = 1;
  }

  if ($next_page > $sequence_count) {
    $next_page = $sequence_count;
    $next_page_active = FALSE;
  }

  if ($entity->sequence == 1) {
    $previous_page_active = FALSE;
  }
  $navbar_options = [];
  if ($sequence_count > 1) {
    $navbar_options = [
      'thumbnails' => [
        'label' => t('Select page'),
        'type' => $is_resource,
        'href' => "$base_url/photos/$identifier",
        'id' => 'button-thumbnails',
        'class' => implode(' ', [
          'button',
          'thumbnails',
          'off',
        ])
      ],
    ];
    $navbar_options['previous'] = [
      'id' => 'previous-page',
      'label' => t('Go to previous page'),
      'type' => $is_resource,
      'href' => "$entity->url/$previous_page",
      'identifier' => $identifier,
      'sequence' => $entity->sequence,
      'count' => $sequence_count,
      'operation' => 'decrease',
      'class' => implode(' ', [
        'paging',
        'previous',
        'pager-left',
        ($previous_page_active ? 'active' : 'inactive'),
      ])
    ];
    $navbar_options['next'] = [
      'id' => 'next-page',
      'label' => t('Go to next page'),
      'type' => $is_resource,
      'href' => "$entity->url/$next_page",
      'identifier' => $identifier,
      'sequence' => $entity->sequence,
      'count' => $sequence_count,
      'operation' => 'increase',
      'class' => implode(' ', [
        'paging',
        'next',
        'pager-right',
        ($next_page_active ? 'active' : 'inactive'),
      ])
    ];
  }

  $servie_url = "$base_url/api/image";

  $entity->manifest = "$base_url/api/image/$is_resource/$entity->identifier/$entity->sequence/info.json";

  $entity->presentation = t('<a href="@url">IIIF Presentation</a>', [ '@url' => url("$base_url/api/presentation/$is_resource/$entity->identifier/manifest.json") ]);

  $viewer = [
    'book_page' => theme(
      'dlts_viewer_openseadragon_image',
      [
        'id' => 'openseadragon1',
        'view' => 'single',
        'type' => $is_resource,
        'identifier' => $identifier,
        'sequence' => $entity->sequence,
        'count' => $sequence_count,
        'manifest' => "$base_url/api/image/$is_resource/$identifier/$entity->sequence/info.json",
        'service' => $servie_url ,
        'uri' => "$base_url/$is_resource/$identifier",
        'dir' => $entity->read_order,
        'classList' => [
          'dlts_image_map',
          'dlts_viewer_map',
        ],
      ]
    ),
    'sequence' => $entity->sequence,
    'count' => $sequence_count,
    'language_dir' => $entity->read_order,
    'pagemeta' => NULL,
    'navbar' => theme('dlts_viewer_navbar', $navbar_options),
    'url' => $entity->url,
    'identifier' => $entity->identifier,
    'title' => $entity->title,
  ];

  return theme('viewer', $viewer);

}

/**
 * Undocumented function.
 */
function dlts_viewer_preprocess_html_photos(&$vars) {
  dlts_viewer_preprocess_html_photo($vars);
}

/**
 * Undocumented function.
 */
function dlts_viewer_preprocess_html_photo(&$vars) {
  $vars['classes_array'][] = 'photo';
}

/**
 * Undocumented function.
 */
function dlts_viewer_photo_embed_redirect($entity) {
  if (is_object($entity)) {
    $wrapper = entity_metadata_wrapper('node', $entity);
    // Identifier.
    $identifier = $wrapper->field_identifier->value();
    drupal_goto("photos/$identifier", [ 'query' => [ 'embed' => 'true' ] ]);
  }
  return drupal_exit();
}

/**
 * Redirect request and delivers photo thumbail.
 * E.g.,
 * - https://[HOST]/photos/AD_MC_036_ref349/1/mode/thumb
 */
function dlts_viewer_photo_thumb($entity, $page) {
  if (is_object($entity)) {
    global $base_url;

    $wrapper = entity_metadata_wrapper('node', $entity);

    $query_parameters = drupal_get_query_parameters();

    // Identifier.
    $identifier = $wrapper->field_identifier->value();

    $width = '150';

    $height = '';

    if (isset($query_parameters['w']) && $query_parameters['w']) {
      $width = filter_var($query_parameters['w'], FILTER_UNSAFE_RAW);
    }

    if (isset($query_parameters['h']) && $query_parameters['h']) {
      $width = filter_var($query_parameters['h'], FILTER_UNSAFE_RAW);
    }

    $sequence = array_pop($page['sequence']);

    drupal_goto("$base_url/api/image/photos/$identifier/$sequence/full/$width,$height/0/default.jpg");

  }
  return drupal_exit();
}
