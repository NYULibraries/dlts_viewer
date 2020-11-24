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

  /* JSON */
  $items['books.json'] = array(
    'title' => 'All books in JSON format',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_books',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
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
    'access arguments' => array('dlts create object'),
    'page callback' => 'dlts_viewer_api_v1_objects',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  $items['api/v1/topics'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_topics',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  );

  // JSON.
  $items['api/v1/books'] = array(
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_api_list_books',
    'delivery callback' => 'drupal_json_output',
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

  // @link api/v1/princeton_aco000102/thumbnails
  $items['api/v1/books/%dlts_book/thumbnails'] = array(
    'access arguments' => array('access content'),
    'page callback' => '_dlts_viewer_book_thumbnails_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => array(3),
    'file' => 'inc/endpoints.inc',
  );

  // @link api/v1/books/princeton_aco000102/1
  $items['api/v1/books/%dlts_book/%djakota_book_page'] = array(
    'title' => 'JSON representation of the book',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_djakota_book_page_loader',
    'page arguments' => array(4),
    'delivery callback' => 'drupal_json_output',
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

  return $items;

}
