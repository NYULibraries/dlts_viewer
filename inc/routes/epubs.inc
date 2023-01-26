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
function _dlts_viewer_menu_epubs() {

  $items = [];

  // epubs.
  // http://HOST/api/v0/epubs
  $items['api/v0/epubs'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_epubs',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://HOST/api/v0/epubs/nyupress
  $items['api/v0/epubs/%'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3 ],
    'page callback' => 'dlts_viewer_epubs_partner',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://HOST/api/v0/epubs/nyupress/9780814744758
  // http://HOST/api/v0/epubs/nyupress/9780814753460
  $items['api/v0/epubs/%/%'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3, 4 ],
    'page callback' => 'dlts_viewer_epubs_metadata',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://HOST/api/v0/epubs/nyupress/9780814744758/opt/rebuild
  // http://HOST/api/v0/epubs/nyupress/9780814753460/opt/rebuild
  $items['api/v0/epubs/%/%/opt/rebuild'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access supafolio api',
    ],
    'page arguments' => [ 3, 4 ],
    'page callback' => 'dlts_viewer_epubs_rebuild',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://HOST/api/v0/epubs/nyupress/9780814744758/opt/indexer
  // http://HOST/api/v0/epubs/nyupress/9780814753460/opt/indexer
  $items['api/v0/epubs/%/%/opt/indexer'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3, 4 ],
    'page callback' => 'dlts_viewer_epubs_indexer',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // http://HOST/api/v0/supafolio
  $items['api/v0/supafolio'] = [
    'title' => 'Supafolio API',
    'description' => 'Supafolio API.',
    'access arguments' => [
      'access supafolio api',
    ],
    'page callback' => 'dlts_viewer_supafolio',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
    'delivery callback' => 'drupal_json_output',
  ];

  return $items;

}
