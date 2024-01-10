<?php

/**
 * @file
 * IIIF callbacks.
 */

/**
 * Register IIIF routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_iiif() {

  $items = [];

  /*
   * Canvas.
   *
   * @link https://[HOST]/api/presentation/books/princeton_aco000102/canvas/1
   */
  $items['api/presentation/%dlts_type/%dlts_resource/canvas/%dlts_canvas_page'] = [
    'title' => 'IIIF Presentation API 3 - Canvas',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_resource_page_canvas',
    'page arguments' => [ 2, 3, 5 ],
    'load arguments' => [ '%map', '%index' ],
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  ];

  // Annotation.
  // @link https://[HOST]/api/v3/presentation/books/princeton_aco000102/annotation/painting/1
  $items['api/presentation/%dlts_type/%dlts_resource/annotation/painting/%dlts_iiif_annotation_painting'] = [
    'title' => 'IIIF Presentation API 3 - Annotation painting',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_annotation',
    'page arguments' => [ 2, 3, 6 ],
    'load arguments' => [ '%map', '%index' ],
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  ];

  // AnnotationPage.
  // @link https://[HOST]/api/v3/presentation/books/princeton_aco000102/page/1
  $items['api/presentation/%dlts_type/%dlts_resource/page/%dlts_iiif_annotation_page'] = [
    'title' => 'IIIF Presentation API 3 - AnnotationPage',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_book_page_annotation_page',
    'page arguments' => [ 2, 3, 5 ],
    'load arguments' => [ '%map', '%index' ],
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  ];

  /*
   * For the Image service we can not add the version to
   * the URL. If we add the version, the page arguments
   * for the request turns out to be 10 arguments, and
   * Drupal's router can not deal with this.
   */

  // Proxy Image service.
  // @link https://[HOST]/api/image/books/uaena_aco000016/1
  $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence'] = [
    'title' => 'IIIF API - Request metadata',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_api',
    'page arguments' => [ 2, 3, 4 ],
    'load arguments' => [ '%map', '%index' ],
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  ];

  $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence/info.json'] = $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence'];

  // Request image.
  // @link https://iiif.io/api/image/2.0
  // @link https://[HOST]/api/image/books/princeton_aco000102/1/full/max/0/default.jpg
  // @details https://[HOST]/api/image/books/princeton_aco000102/1/{region}/{size}/{rotation}/{quality}.{format}
  $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality'] = [
    'title' => 'IIIF API - Request image',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_tile',
    'page arguments' => [ 2, 3, 4, 5, 6, 7, 8 ],
    'load arguments' => [ '%map', '%index' ],
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  ];

  /*
   * Register IIIF Presentation Manifest routes.
   * @link https://iiif.io/api/presentation/3.0/
   * @link https://[HOST]/api/presentation/books/princeton_aco000102/manifest.json
   *
   * @return array
   *   IIIF Presentation Manifest.
   */
  $items['api/presentation/%dlts_type/%dlts_resource/manifest.json'] = [
    'title' => 'IIIF Presentation API 3 - Manifest',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_resource_manifest',
    'page arguments' => [ 2, 3 ],
    'type' => MENU_CALLBACK,
    'load arguments' => [ '%map', '%index' ],
    'delivery callback' => 'dlts_viewer_ldjson_iiif_presentation_3_output',
    'file' => 'inc/iiif.inc',
  ];

  // Redirect deprecated Adore Djakota routes.
  $items['api/v1/image/resolver'] = [
    'title' => 'Redirect deprecated Adore Djakota routes',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_djakot_iiif_resolver',
    'type' => MENU_CALLBACK,
    'file' => 'inc/iiif.inc',
  ];

  return $items;

}
