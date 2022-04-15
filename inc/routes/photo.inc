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
  $items = [
    'photos/%dlts_photo_set' => [
      'title' => 'Book metadata display',
      'access arguments' => [ 'access content' ],
      'page callback' => 'dlts_viewer_photo_set_dispatcher',
      'page arguments' => [ 1 ],
      'delivery callback' => 'drupal_deliver_html_page',
      'type' => MENU_CALLBACK,
    ],
    // deprecated: Same as photos/%dlts_photo_set
    'photos/%dlts_photo_set/set' => [
      'title' => 'Book metadata display',
      'access arguments' => [ 'access content' ],
      'page callback' => 'dlts_viewer_photo_dispatcher',
      'page arguments' => [ 1, 'embed' ],
      'delivery callback' => 'drupal_deliver_html_page',
      'type' => MENU_CALLBACK,
    ],
    // deprecated: Same as photos/%dlts_photo_set
    'photos/%dlts_photo_set/mode/embed' => [
      'title' => 'Book metadata display',
      'access arguments' => [ 'access content' ],
      'page callback' => 'dlts_viewer_photo_embed_redirect',
      'page arguments' => [ 1 ],
      'delivery callback' => 'drupal_deliver_html_page',
      'type' => MENU_CALLBACK,
    ],
    'photos/%dlts_photo_set/%dlts_photo' => [
      'title' => 'Photo page',
      'access arguments' => [ 'access content' ],
      'page callback' => 'dlts_viewer_photo_dispatcher',
      'page arguments' => [ 1, 2 ],
      'load arguments' => [ '%map', '%index' ],
      'delivery callback' => 'drupal_deliver_html_page',
      'type' => MENU_CALLBACK,
    ],
    // deprecated
    'photos/%dlts_photo_set/%dlts_photo/mode/thumb' => [
      'title' => 'Book metadata display',
      'access arguments' => [ 'access content' ],
      'page callback' => 'dlts_viewer_photo_thumb',
      'page arguments' => [ 1, 2 ],
      'load arguments' => [ '%map', '%index' ],
      'delivery callback' => 'drupal_deliver_html_page',
      'type' => MENU_CALLBACK,
    ],

  ];
  return $items;
}
