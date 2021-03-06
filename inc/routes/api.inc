<?php

/**
 * @file
 * API callbacks.
 */

/**
 * Register API routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_api() {

  $items = array();

  $items['api/v1/search'] = array(
    'title' => 'Search',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_search_json',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/search.inc',
    'type' => MENU_CALLBACK,
  );

  $items['sources/field/%'] = array(
    'title' => 'Cotent types',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_content_by_field',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(2),
  );

  $items['content/%/nodeid'] = array(
    'title' => 'Return nid of node',
    'page callback' => 'return_nodeid_json',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(1),
    'access arguments' => array('access content'),
    'delivery callback' => 'drupal_json_output',
    'type' => MENU_CALLBACK,
  );

  $items['content/%/nodeid/%'] = array(
    'title' => 'Return nid of node',
    'page callback' => 'return_nodeid_json',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(1, 3),
    'access arguments' => array('access content'),
    'type' => MENU_CALLBACK,
  );

  $items['api/v1/maps/%dlts_map/json'] = array(
    'title' => 'JSON representation of the book',
    'access arguments' => array('access content'),
    'page callback' => '_dlts_viewer_map_json',
    'page arguments' => array(3),
    'delivery callback' => 'drupal_json_output',
    'type' => MENU_CALLBACK,
  );

  $items['api/v1/objects'] = array(
    'title' => 'Create object',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_v1_objects',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(1),
    'file' => 'inc/endpoints.inc',
  );

  $items['api/v1/objects/books/%dlts_book'] = array(
    'title' => 'Update book',
    'access arguments' => array('dlts create object'),
    'page callback' => 'dlts_viewer_api_v1_update_book',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(4),
    'file' => 'inc/endpoints/book.inc',
  );

  $items['api/v1.0.1/objects'] = array(
    'title' => 'Create object',
    'access arguments' => array('dlts create object'),
    'page callback' => 'dlts_viewer_api_v1_0_1_dlts_book_objects',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(1),
    'file' => 'inc/endpoints.inc',
  );

  $items['api/v1/topics'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_topics',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // @link http://localhost:9000/books.json
  // @todo remove.
  $items['books.json'] = array(
    'title' => 'All books in JSON format',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_books',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // @todo remove.
  $items['api/v1/books'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_books',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  $items['api/v1/maps'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_maps',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // @link api/v1/books/princeton_aco000102/1
  $items['api/v1/books/%dlts_book/%dlts_book_page'] = array(
    'title' => 'JSON representation of the book',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_djakota_book_page',
    'page arguments' => array(4),
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // @link http://localhost:9000/api/iiif/photos/5tb2rnch/2/full/250,/0/default.jpg
  $items['api/iiif/photos/%dlts_photo_handle/%dlts_photo_sequence/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality'] = array(
    'title' => 'III Image Photo sequence.',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_dlts_photo_sequence_image_iiif',
    'page arguments' => array(3, 4, 5, 6, 7, 8),
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/photo.inc',
  );

  // @link api/v1/princeton_aco000102/thumbnails
  $items['api/v1/books/%dlts_book/thumbnails'] = array(
    'access arguments' => array('access content'),
    'page callback' => '_dlts_viewer_book_thumbnails_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(3),
    'file' => 'inc/endpoints.inc',
  );

  // @link api/v1/books/princeton_aco000102
  $items['api/v1/books/%dlts_book'] = array(
    'access arguments' => array('access content'),
    'page callback' => '_dlts_viewer_book_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(3),
    'file' => 'inc/endpoints.inc',
  );

  // Stream tile from resource page.
  $items['api/v1/tile'] = array(
    'title' => 'Stream image tile',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_djakota_stream_book_page',
    'file' => 'inc/endpoints.inc',
  );

  $items['api/v1/image/resolver'] = array(
    'title' => 'Image resolver',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_djakota_resolver_stream',
    'file' => 'inc/endpoints.inc',
  );

  // List collections.
  $items['api/v1/collections'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_list_collections',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // List documents.
  $items['api/v1/resources'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_list_resource',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  return $items;

}
