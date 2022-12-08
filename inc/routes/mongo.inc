<?php

/**
 * @file
 * Books callbacks.
 */

/**
 * Register routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_mongo() {

  $items = [];

  $items['admin/records/%dlts_noid'] = [
    'title' => 'Record',
    'access arguments' => [ 'administer viewer' ],
    'page callback' => 'dlts_viewer_dispatch_mongodb_record',
    'delivery callback' => 'drupal_deliver_html_page',
    'page arguments' => [ 2 ],
    'file' => 'inc/mongodb.inc',
    'type' => MENU_CALLBACK,
  ];

  return $items;

}
