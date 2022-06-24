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

  // Render book metadata pane.
  $items['mirador/%dlts_noid'] = [
    'title' => 'Mirador viewer',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_mirador_dispatcher',
    'page arguments' => [ 1 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  return $items;
}
