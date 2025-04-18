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

  $items = [];

  $items['api/v1'] = [
    'title' => 'DLTS Viewer - Endpoints documentation',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_v1_documentation',
    'file' => 'inc/endpoints/documentation.inc',
    'type' => MENU_CALLBACK,
  ];

$items['api/documentation'] = $items['api/v1'];


  $items['api/v1/search'] = [
    'title' => 'Apache Solr Search',
    'description' => 'Proxy Apache Solr full-text search. See [Common Query Parameters|https://solr.apache.org/guide/6_6/common-query-parameters.html#common-query-parameters] for documentation.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_search_json',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/search.inc',
    'type' => MENU_CALLBACK,
  ];

  $items['sources/field/%'] = [
    'title' => 'Cotent types',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_content_by_field',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 2 ],
  ];

  $items['api/v1/maps/%dlts_map/json'] = [
    'title' => 'JSON representation of the book',
    'access arguments' => [
      'access content',
    ],
    'page callback' => '_dlts_viewer_map_json',
    'page arguments' => [ 3 ],
    'delivery callback' => 'drupal_json_output',
    'type' => MENU_CALLBACK,
  ];

  $items['api/v1/objects'] = [
    'title' => 'Create object',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_v1_objects',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 1 ],
    'file' => 'inc/endpoints.inc',
  ];

  // Create sequences.
  $items['api/v1/sequences'] = [
    'title' => 'Create sequences',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_v1_sequences',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 1 ],
    'file' => 'inc/endpoints.inc',
  ];

  // Update/Delete book.
  $items['api/v1/objects/books/%dlts_book'] = [
    'title' => 'Update book',
    'access arguments' => [
      'dlts create object',
    ],
    'page callback' => 'dlts_viewer_api_v1_update_book',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 4 ],
    'file' => 'inc/endpoints/book.inc',
  ];

  // api/objects/resource/arabartarchive_ad_mc094_cuid298
  $items['api/objects/resource/%dlts_noid'] = [
    'title' => 'Update or delete resource',
    'access arguments' => [
      'dlts create object',
    ],
    'page callback' => 'dlts_viewer_api_update_resource',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 3 ],
    'file' => 'inc/endpoints/api.inc',
  ];

  $items['api/v1.0.1/objects'] = [
    'title' => 'Create object',
    'access arguments' => [
      'dlts create object',
    ],
    'page callback' => 'dlts_viewer_api_v1_0_1_dlts_book_objects',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 1 ],
    'file' => 'inc/endpoints.inc',
  ];

  $items['api/v1/topics'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_list_topics',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  $items['api/v1/noid/%dlts_noid'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => '_dlts_viewer_noid_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 3 ],
    'file' => 'inc/endpoints.inc',
  ];

  $items['api/v1/books'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_list_books',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  $items['api/v1/maps'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_list_maps',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  // @link api/v1/books/princeton_aco000102/1
  $items['api/v1/books/%dlts_book/%dlts_book_page'] = [
    'title' => 'JSON representation of the book',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_imageserver_book_page',
    'page arguments' => [ 4 ],
    'load arguments' => [ '%map', '%index' ],
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  // @link http://localhost:9000/api/iiif/photos/5tb2rnch/2/full/250,/0/default.jpg
  $items['api/iiif/photos/%dlts_photo_handle/%dlts_photo_sequence/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality'] = [
    'title' => 'III Image Photo sequence.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_dlts_photo_sequence_image_iiif',
    'page arguments' => [ 3, 4, 5, 6, 7, 8 ],
    'load arguments' => [ '%map', '%index' ],
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/photo.inc',
  ];

  // @link api/v1/princeton_aco000102/thumbnails
  $items['api/v1/books/%dlts_book/thumbnails'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => '_dlts_viewer_book_thumbnails_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 3 ],
    'file' => 'inc/endpoints.inc',
  ];

  // @link api/v1/books/princeton_aco000102
  $items['api/v1/books/%dlts_book'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => '_dlts_viewer_book_loader',
    'delivery callback' => 'drupal_json_output',
    'page arguments' => [ 3 ],
    'file' => 'inc/endpoints.inc',
  ];

  // Stream tile from resource page.
  $items['api/v1/tile'] = [
    'title' => 'Stream image tile',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_djakota_stream_book_page',
    'file' => 'inc/endpoints.inc',
  ];

  // List collections.
  $items['api/v1/collections'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_list_collections',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  // List documents.
  $items['api/v1/resources'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_list_resource',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  // List resources to update.
  // https://[HOST]/api/v1/resources-to-update
  $items['api/v1/resources-to-update'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_resources_to_update',
    'delivery callback' => 'drupal_json_output',
  ];

  // Update resources sequence by type.
  // e.g., https://[HOST]/api/v1/resources-to-update/books
  // e.g., https://[HOST]/api/v1/resources-to-update/maps
  // e.g., https://[HOST]/api/v1/resources-to-update/photos
  $items['api/v1/resources-update/%dlts_type'] = [
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3 ],
    'page callback' => 'dlts_viewer_update_sequence',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/sequence.inc',
  ];

  // Render viewer.
  // https://[HOST]/api/embed/xsj3v3x1
  // https://[HOST]/api/embed/columbia_aco002609
  $items['api/embed/%dlts_noid'] = [
    'title' => 'Viewer',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_embed_dispatcher',
    'page arguments' => [ 2 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  $items['api/embed/%dlts_noid/%'] = [
    'title' => 'Viewer',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_embed_dispatcher',
    'page arguments' => [ 2, 3 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  $items['api/v1/eads/%'] = [
    'title' => 'Viewer',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_eads_dispatcher',
    'page arguments' => [ 3 ],
    'delivery callback' => 'drupal_json_output',
    'type' => MENU_CALLBACK,
    'file' => 'inc/endpoints/eads.inc',
  ];

  $items['api/v1/ijson/%/%'] = [
    'title' => 'iJSON',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_ijson_dispatcher',
    'page arguments' => [ 3, 4 ],
    'delivery callback' => 'drupal_json_output',
    'type' => MENU_CALLBACK,
    'file' => 'inc/endpoints/ijson.inc',
  ];

  // List documents.
  $items['api/v1/entities'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_list_entities',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints.inc',
  ];

  // List documents.
  $items['api/services/status/mongodb'] = [
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_check_status_mongodb',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/api.inc',
  ];

  return $items;

}
