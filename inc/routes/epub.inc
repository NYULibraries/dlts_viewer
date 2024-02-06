<?php

/**
 * @file
 * Epubs callbacks.
 */

/**
 * Register ePubs routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_epub() {

  $items = [];

  $items['admin/epubs'] = [
    'title' => 'EPUB publishers',
    'description' => 'EPUB publishers.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_admin_epubs',
    'delivery callback' => 'drupal_deliver_html_page',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_LOCAL_TASK,
  ];

  $items['admin/epubs/%dlts_publisher'] = [
    'title callback' => 'admin_epub_publisher_title',
    'title arguments' => [ 2 ],
    'description' => 'Admin Partners ePubs.',
    'page arguments' => [ 2 ],
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_admin_partner_epubs',
    'delivery callback' => 'drupal_deliver_html_page',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_NORMAL_ITEM,
  ];

  $items['admin/epubs/%dlts_publisher/%dlts_epub'] = [
    'title callback' => 'admin_epub_book_title',
    'title arguments' => [ 3 ],    
    'description' => 'Admin ePubs.',
    'page arguments' => [ 2, 3 ],
    'access arguments' => [
      'dlts create object',
    ],
    'page callback' => 'dlts_viewer_admin_epub',
    'delivery callback' => 'drupal_deliver_html_page',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_NORMAL_ITEM,
  ];

  // epubs.
  // curl -b ./cookie http://HOST/api/v0/epubs
  // curl -b ./cookie -X POST http://HOST/api/v0/epubs
  // curl -b ./cookie -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' --data "@data.xml" http://localhost/api/v0/epubs
  // http://HOST/api/v0/epubs
  $items['api/v0/epubs'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_api_v0_epubs',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://HOST/api/v0/epubs/nyu-press
  $items['api/v0/epubs/%dlts_publisher'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3 ],
    'page callback' => 'dlts_viewer_api_v0_epubs_publisher',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // curl -b ./cookie http://HOST/api/v0/epubs/nyu-press/9780814744758
  // curl -b ./cookie -X POST http://localhost:9000/api/v0/epubs/nyu-press/9780814744758
  // curl -b ./cookie -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' --data "@data.json" http://localhost:9000/api/v0/epubs/nyupress/9780814707517
  $items['api/v0/epubs/%/%'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 1, 3, 4 ],
    'page callback' => 'dlts_viewer_epubs_metadata',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://HOST/api/v0/epubs/nyu-press/9780814744758/opt/indexer
  // http://HOST/api/v0/epubs/nyu-press/9780814753460/opt/indexer
  $items['api/v0/epubs/%dlts_publisher/%dlts_epub/opt/indexer'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 1, 3, 4 ],
    'page callback' => 'dlts_viewer_epubs_indexer',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_CALLBACK,
  ];

  // http://HOST/api/v0/supafolio/[isbn13]
  $items['api/v0/supafolio/%'] = [
    'title' => 'Supafolio API',
    'description' => 'Supafolio API.',
    'page arguments' => [ 3, true ],
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_supafolio_book',
    'file' => 'inc/types/epub.inc',
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
  ];

  return $items;

}
