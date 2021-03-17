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

  $items = array();

  // /*
  //  * Convinient way to edit a Book object
  //  * e.g., http://{{HOST}}/{{SITE}}/books/{{IDENTIFIER}}/edit
  //  */
  // $items['books/%dlts_book/edit'] = array(
  //   'title' => 'Edit book',
  //   'access arguments' => array('edit any dlts_book content'),
  //   'page callback' => '_dlts_viewer_book_edit_redirect',
  //   'page arguments' => array(1),
  //   'type' => MENU_CALLBACK,
  // );

  /*
   * Render thumbnails for book pages
   * No need to load the Book object % instead of %dlts_book
   * request accept ?page=INT(mimic Drupal's pager) and ?limit=INT
   */
  $items['books/%/thumbnails'] = array(
    'title' => 'Book page',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_dispatch_thumbnails',
    'page arguments' => array(1),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  // Render book metadata pane.
  $items['books/%dlts_book/display'] = array(
    'title' => 'Book metadata display',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_dispatcher',
    'page callback' => 'dlts_viewer_book_dispatcher',
    'page arguments' => array(1, 2),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  // Render book pages.
  $items['books/%dlts_book/%dlts_book_page'] = array(
    'title' => 'Book page',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_book_dispatcher',
    'page arguments' => array(1, 2),
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );

  return $items;
}
