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
  // Manifest.
  // @link http://localhost:9000/api/v3/presentation/books/princeton_aco000102/manifest.json
  $items['api/v3/presentation/books/%dlts_book/manifest.json'] = array(
    'title' => 'IIIF Presentation API 3 - Book manifest',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_book_manifest',
    'page arguments' => array(4),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'dlts_viewer_ldjson_iiif_presentation_3_output',
    'file' => 'inc/iiif.inc',
  );
  // Canvas.
  // @link http://localhost:9000/api/v3/presentation/books/princeton_aco000102/canvas/1
  $items['api/v3/presentation/books/%dlts_book/canvas/%dlts_canvas_page'] = array(
    'title' => 'IIIF Presentation API 3 - Canvas',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_book_page_canvas',
    'page arguments' => array(4, 6),
    'load arguments' => array('%map'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  // Annotation.
  // @link http://localhost:9000/api/v3/presentation/books/princeton_aco000102/annotation/painting/1
  $items['api/v3/presentation/books/%dlts_book/annotation/painting/%dlts_iiif_annotation_painting'] = array(
    'title' => 'IIIF Presentation API 3 - Annotation painting',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_annotation',
    'page arguments' => array(3, 4, 7),
    'load arguments' => array('%map'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );
  // AnnotationPage.
  // @link http://localhost:9000/api/v3/presentation/books/princeton_aco000102/page/1
  $items['api/v3/presentation/books/%dlts_book/page/%dlts_iiif_annotation_page'] = array(
    'title' => 'IIIF Presentation API 3 - AnnotationPage',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_book_page_annotation_page',
    'page arguments' => array(3, 4, 6),
    'load arguments' => array('%map'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );
  /*
   * For the Image service we can not add the version to
   * the URL. If we add the version, the page arguments
   * for the request turns out to be 10 arguments, and
   * looks like Drupal's router can not deal with this.
   */

  // Proxy Image service.
  // @link http://localhost:9000/api/image/books/uaena_aco000016/1/info.json
  $items['api/image/books/%dlts_book/%dlts_resource_sequence/info.json'] = array(
    'title' => 'IIIF API - Request metadata',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_api',
    'page arguments' => array(2, 3, 4),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );
  // Request image.
  // @link https://iiif.io/api/image/2.0
  // @link http://localhost:9000/api/image/books/princeton_aco000102/1/full/max/0/default.jpg
  // http://localhost:9000/api/image/books/princeton_aco000102/1/{region}/{size}/{rotation}/{quality}.{format}
  $items['api/image/books/%dlts_book/%dlts_book_page/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality'] = array(
    'title' => 'IIIF API - Request image',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_tile',
    'page arguments' => array(2, 3, 4, 5, 6, 7, 8),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );
  return $items;
}
