<?php

/**
 * @file
 * Photos callbacks.
 */

/**
 * Register Photos routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_photo() {

  $items = array();

  // Render photo object.
  $items['photos/%dlts_photo_set/mode/embed'] = array(
    'title' => 'Book metadata display',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_photo_embed_redirect',
    'page arguments' => array(1, 2),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  $items['photos/%dlts_photo_set/%dlts_photo/mode/thumb'] = array(
    'title' => 'Book metadata display',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_photo_thumb',
    'page arguments' => array(1, 2),
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  $items['photos/%dlts_photo_set/%dlts_photo'] = array(
    'title' => 'Photo page',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_photo_dispatcher',
    'page arguments' => array(1, 2, 3),
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  $items['photos/%dlts_photo_set'] = array(
    'title' => 'Book metadata display',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_photo_dispatcher',
    'page arguments' => array(1, 2, 3),
    'type' => MENU_CALLBACK,
  );

  $items['photos/%dlts_photo_set/set'] = array(
    'title' => 'Book metadata display',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_photo_dispatcher',
    'page arguments' => array(1, 2, 3),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  return $items;
}
