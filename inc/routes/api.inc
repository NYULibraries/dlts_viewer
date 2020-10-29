<?php
function _dlts_viewer_menu_api() {
  $items = array();

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
    'page arguments' => array(1),
    'access arguments' => array('access content'),
    'type' => MENU_CALLBACK,
  );

  $items['content/%/nodeid/%'] = array(
    'title' => 'Return nid of node',
    'page callback' => 'return_nodeid_json',
    'page arguments' => array(1, 3),
    'access arguments' => array('access content'),
    'type' => MENU_CALLBACK,
  );

  $items['content/%/page_nodeids'] = array(
    'title' => 'Return page nodeids for book',
    'page callback' => 'return_page_nodeids_json',
    'page arguments' => array(1),
    'access arguments' => array('access content'),
    'type' => MENU_CALLBACK,
  );

  $items['api/v1/objects'] = array(
    'title' => 'Create object',
    'access arguments' => array('dlts create object'),
    'page callback' => 'dlts_viewer_api_v1_objects',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // type/identifier
  // e.g., api/v1/books/princeton_aco000102
  $items['api/v1/books/%'] = array(
    'access arguments' => array('access content'),
    'page callback' => '_dlts_viewer_book_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(2, 3),
    'file' => 'inc/endpoints.inc',
  );

  $items['api/v1/topics'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_topics',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // type/identifier
  // e.g., api/v1/princeton_aco000102/thumbnails
  $items['api/v1/books/%/thumbnails'] = array(
    'access arguments' => array('access content'),
    'page callback' => '_dlts_viewer_book_thumbnails_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(3),
    'file' => 'inc/endpoints.inc',
  );

  // type/identifier/sequence
  // e.g., api/v1/princeton_aco000102/1
  $items['api/v1/books/%/%'] = array(
    'title' => 'JSON representation of the book',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_djakota_book_page_loader',
    'page arguments' => array(3, 4),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // stream_book_page
  // identifier, region, level
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

  // JSON
  $items['api/v1/books'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_books',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // list collections
  $items['api/v1/collections'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_list_collections',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // request image
  // e.g., http://localhost:9000/iiif/2/books/uaena_aco000016/1/info.json
  $items['iiif/2/%/%/%/info.json'] = array(
    'title' => 'IIIF API 2',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_iiif_data',
    'page arguments' => array(2, 3, 4),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  return $items;

}
