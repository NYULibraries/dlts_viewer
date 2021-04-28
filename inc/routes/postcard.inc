<?php

/**
 * @file
 * Postcards callbacks.
 */

/**
 * Register Postcards routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_postcard() {
  $items = array();
  /*
   * Convinient way to edit a object
   * @link http://localhost:9000/postcards/{{IDENTIFIER}}/edit
   */
  $items['postcards/%dlts_postcard/edit'] = array(
    'title' => 'Edit postcard',
    'access arguments' => array('edit any dlts_postcard content'),
    'page callback' => '_dlts_viewer_postcard_edit_redirect',
    'page arguments' => array(1),
    'type' => MENU_CALLBACK,
  );
  /*
   * Render thumbnails for postcard pages
   * request accept ?page=INT(mimic Drupal's pager) and ?limit=INT
   */
  $items['postcards/%dlts_postcard/thumbnails'] = array(
    'title' => 'Postcard thumbnails',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_dispatch_postcard_thumbnails',
    'page arguments' => array(1),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );
  // Render metadata pane.
  $items['postcards/%dlts_postcard/display'] = array(
    'title' => 'Postcard metadata display',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_postcard_dispatcher',
    'page arguments' => array(1, 2),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );
  // Render postcard pages.
  $items['postcards/%dlts_postcard/%'] = array(
    'title' => 'Postcard page',
    'access arguments' => array('access content'),
    'page callback' => 'dlts_viewer_postcard_dispatcher',
    'page arguments' => array(1, 2),
    'load arguments' => array('%map', '%index'),
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  );
  return $items;
}
