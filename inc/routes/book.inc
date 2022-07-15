<?php

/**
 * @file
 * Books callbacks.
 */

/**
 * Register Books routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_book() {

  $items = [];

  /*
   * Render thumbnails for book pages
   * No need to load the Book object % instead of %dlts_book
   * request accept ?page=INT(mimic Drupal's pager) and ?limit=INT
   */
  $items['books/%dlts_book/thumbnails'] = [
    'title' => 'Book page',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_dispatch_thumbnails',
    'page arguments' => [ 1 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  // Render book metadata pane.
  $items['books/%dlts_book/display'] = [
    'title' => 'Book metadata display',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_dispatcher',
    'page callback' => 'dlts_viewer_book_dispatcher',
    'page arguments' => [ 1, 2 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  // Render book pages.
  $items['books/%dlts_book/%dlts_book_page'] = [
    'title' => 'Book page',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_book_dispatcher',
    'page arguments' => [ 1, 2 ],
    'load arguments' => [ '%map', '%index' ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  return $items;
}
