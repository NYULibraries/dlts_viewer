<?php

/**
 * @file
 * Epubs callbacks.
 */

/**
 * Register Books routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_epubs() {

  $items = [];

  // epubs.
  // http://192.168.0.5/admin/epubs
  $items['admin/epubs'] = [
    'title' => 'Epubs',
    'description' => 'Epubs - List partner.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_admin_epubs',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://192.168.0.5/admin/epubs/partner
  $items['admin/epubs/%'] = [
    'title' => 'Epubs',
    'description' => 'Epubs - Partner.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 2 ],
    'page callback' => 'dlts_viewer_admin_epubs_partner',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://192.168.0.5/admin/epubs/partner
  $items['admin/epubs/%/%'] = [
    'title' => 'Epubs - Partner',
    'description' => 'Epubs - Partner.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 2, 3 ],
    'page callback' => 'dlts_viewer_admin_epubs_partner_item',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];  

  // epubs.
  // http://192.168.0.5/api/v0/epubs
  $items['api/v0/epubs'] = [
    'title' => 'Query repository',
    'description' => 'Query epubs API.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3 ],
    'page callback' => 'dlts_viewer_epubs',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://192.168.0.5/api/v0/epubs/nyupress
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
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814744758
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814753460
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
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814744758/opt/indexer
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814753460/opt/indexer
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

  // epubs.
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814744758/opt/version
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814753460/opt/version
  $items['api/v0/epubs/%/%/opt/version'] = [
    'title' => 'Epub version',
    'description' => 'Epub version.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3, 4 ],
    'page callback' => 'dlts_viewer_epubs_versions',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];

  // epubs.
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814744758/opt/version
  // http://192.168.0.5/api/v0/epubs/nyupress/9780814753460/opt/version
  $items['api/v0/epubs/%/%/opt/version/%'] = [
    'title' => 'Epub version',
    'description' => 'Epub version.',
    'access arguments' => [
      'access content',
    ],
    'page arguments' => [ 3, 4, 7 ],
    'page callback' => 'dlts_viewer_epubs_versions_hash',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/epubs.inc',
    'type' => MENU_CALLBACK,
  ];  

  return $items;
}
