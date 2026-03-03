<?php

/**
 * @file
 * Serial callbacks.
 */

/**
 * Register Serial routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_serial() {

  $items = [];

  // $items['serials/%dlts_serial/%dlts_serial_page'] = [
  //   'title' => 'Serial page',
  //   'access arguments' => [ 'access content' ],
  //   'page callback' => 'dlts_viewer_serial_dispatcher',
  //   'page arguments' => [ 1, 2 ],
  //   'load arguments' => [ '%map', '%index' ],
  //   'delivery callback' => 'drupal_deliver_html_page',
  //   'type' => MENU_CALLBACK,
  // ];

  return $items;

}
