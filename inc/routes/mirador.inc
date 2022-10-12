<?php

/**
 * @file
 * Mirador callbacks.
 */

/**
 * Register Mirador routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_mirador() {

  $items = [];

  // Render viewer.
  // http://localhost/api/viewer/xsj3v3x1
  // http://localhost/api/viewer/columbia_aco002609
  $items['api/viewer/%dlts_noid'] = [
    'title' => 'Mirador viewer',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_viewer_dispatcher',
    'page arguments' => [ 2 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  return $items;
}
