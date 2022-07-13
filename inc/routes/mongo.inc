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
function _dlts_viewer_menu_mongo() {

  $items = [];

  $items['admin/records'] = [
    'title' => 'Viewer Content',
    'access arguments' => [ 'administer viewer' ],
    'page callback' => 'dlts_viewer_dispatch_mongodb_dashboard',
    'delivery callback' => 'drupal_deliver_html_page',
    'file' => 'inc/mongodb.inc',
    'type' => MENU_NORMAL_ITEM,
  ];

  $items['admin/records/%'] = [
    'title callback' => 'dlts_viewer_dispatch_mongodb_title',
    'title arguments' => [ 2 ],
    'access arguments' => [ 'administer viewer' ],
    'page callback' => 'dlts_viewer_dispatch_mongodb',
    'delivery callback' => 'drupal_deliver_html_page',
    'file' => 'inc/mongodb.inc',
    'page arguments' => [ 2 ],
    'type' => MENU_CALLBACK,
  ];

  $items['admin/records/%/%'] = [
    'title' => 'Record',
    'access arguments' => [ 'administer viewer' ],
    'page callback' => 'dlts_viewer_dispatch_mongodb_record',
    'delivery callback' => 'drupal_deliver_html_page',
    'page arguments' => [ 2, 3 ],
    'file' => 'inc/mongodb.inc',
    'type' => MENU_CALLBACK,
  ];

  return $items;

}
