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

  /*
   * Canvas.
   *
   * @link http://localhost:9000/api/presentation/books/princeton_aco000102/canvas/1
   */
  $items['api/presentation/%dlts_type/%dlts_resource/canvas/%dlts_canvas_page'] = array(
    'title' => 'IIIF Presentation API 3 - Canvas',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_resource_page_canvas',
    'page arguments' => array(2, 3, 5),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  // Annotation.
  // @link http://localhost:9000/api/v3/presentation/books/princeton_aco000102/annotation/painting/1
  $items['api/presentation/%dlts_type/%dlts_resource/annotation/painting/%dlts_iiif_annotation_painting'] = array(
    'title' => 'IIIF Presentation API 3 - Annotation painting',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_annotation',
    'page arguments' => array(2, 3, 6),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );
  // AnnotationPage.
  // @link http://localhost:9000/api/v3/presentation/books/princeton_aco000102/page/1
  $items['api/presentation/%dlts_type/%dlts_resource/page/%dlts_iiif_annotation_page'] = array(
    'title' => 'IIIF Presentation API 3 - AnnotationPage',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_book_page_annotation_page',
    'page arguments' => array(2, 3, 5),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  /*
   * For the Image service we can not add the version to
   * the URL. If we add the version, the page arguments
   * for the request turns out to be 10 arguments, and
   * Drupal's router can not deal with this.
   */

  // Proxy Image service.
  // @link http://localhost:9000/api/image/books/uaena_aco000016/1/info.json
  $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence'] =
  $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence/info.json'] = array(
    'title' => 'IIIF API - Request metadata',
    'access arguments' => [ 'access iiif content' ],
    'page callback' => 'dlts_viewer_iiif_api',
    'page arguments' => [ 2, 3, 4 ],
    'load arguments' => ['%map', '%index' ],
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  // Request image.
  // @link https://iiif.io/api/image/2.0
  // @link http://localhost:9000/api/image/books/princeton_aco000102/1/full/max/0/default.jpg
  // http://localhost:9000/api/image/books/princeton_aco000102/1/{region}/{size}/{rotation}/{quality}.{format}
  $items['api/image/%dlts_type/%dlts_resource/%dlts_resource_sequence/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality'] = array(
    'title' => 'IIIF API - Request image',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_tile',
    'page arguments' => array(2, 3, 4, 5, 6, 7, 8),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  /*
   * Register IIIF Presentation Manifest routes.
   * @link https://iiif.io/api/presentation/3.0/
   * @link https://iiif.io/api/cookbook/recipe/0009-book-1/manifest.json
   * @link http://localhost:9000/api/presentation/books/princeton_aco000102/manifest.json
   *
   * @return array
   *   IIIF Presentation Manifest.
   */
  $items['api/presentation/%dlts_type/%dlts_resource/manifest.json'] = array(
    'title' => 'IIIF Presentation API 3 - Manifest',
    'access arguments' => array('access iiif content'),
    'page callback' => 'dlts_viewer_iiif_resource_manifest',
    'page arguments' => array(2, 3),
    'type' => MENU_CALLBACK,
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'dlts_viewer_ldjson_iiif_presentation_3_output',
    'file' => 'inc/iiif.inc',
  );

  return $items;
}
