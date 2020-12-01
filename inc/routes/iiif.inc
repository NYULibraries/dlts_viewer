<?php

function _dlts_viewer_menu_iiif() {

  $items = array();

  // request image
  // e.g., http://localhost:9000/iiif/2/books/uaena_aco000016/1/info.json
  $items['iiif/2/%type/%dlts_book/%page_item/info.json'] = array(
    'title' => 'IIIF API 2',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_iiif_api',
    'page arguments' => array(2, 3, 4),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  // request image
  // e.g., http://localhost:9000/iiif/2/books/uaena_aco000016/1/{region}/{size}/{rotation}/{quality}.{format}
  $items['iiif/2/%/%/%/%/%/%/%'] = array(
    'title' => 'IIIF API 2',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_iiif_tile',
    'page arguments' => array(2, 3, 4, 5, 6, 7, 8),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );  
  
  // Canvas
  // e.g., http://localhost:9000/api/v1/books/princeton_aco000102/canvas/p1
  $items['api/v1/%type/%dlts_book/canvas/%dlts_book_canvas_page'] = array(
    'title' => 'IIIF Canvas',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_iiif_book_page_canvas',
    'page arguments' => array(2, 3, 5),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  // AnnotationPage
  // e.g., http://localhost:9000/api/v1/books/princeton_aco000102/page/p1/1
  $items['api/v1/%type/%dlts_book/page/%dlts_book_canvas_page/%item'] = array(
    'title' => 'IIIF AnnotationPage',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_iiif_book_page_annotation_page',
    'page arguments' => array(2, 3, 5, 6),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  // Annotation
  // http://localhost:9000/api/v1/books/princeton_aco000102/annotation/p0001-image
  $items['api/v1/%type/%dlts_book/annotation/%page_item'] = array(
    'title' => 'IIIF Annotation',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_iiif_annotation',
    'page arguments' => array(2, 3, 5),
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/iiif.inc',
  );

  return $items;

}
