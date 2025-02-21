<?php

/**
 * @file
 * API callbacks.
 */

/**
 * Register API routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_repository() {

  $items = [];

  $items['api/v1/repository'] = [
    'title' => 'Query repository',
    'description' => 'Query repository.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_search_repository',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/repository.inc',
    'type' => MENU_CALLBACK,
  ];
 
  // List all partners.
  // https://HOST/api/v1/repository/partners
  // https://stage-sites.dlib.nyu.edu/viewer/api/v1/repository/partners
  $items['api/v1/repository/partners'] = [
    'title' => 'Query repository partners',
    'description' => 'Query repository.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_search_repository_partner',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/repository.inc',
    'type' => MENU_CALLBACK,
  ];

  // https://HOST/api/v1/repository/partners/8c32791e-0fcd-4508-86e0-6fd28ee4550d
  // https://stage-sites.dlib.nyu.edu/viewer/api/v1/repository/partners/8c32791e-0fcd-4508-86e0-6fd28ee4550d
  $items['api/v1/repository/partners/%'] = [
    'title' => 'Query repository by partner code',
    'description' => 'Query repository.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_search_repository_partner_code',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/repository.inc',
    'type' => MENU_CALLBACK,
    'page arguments' => [ 4 ],
  ];

  $items['api/v1/repository/partners/%/%'] = [
    'title' => 'Query repository by partner code',
    'description' => 'Query repository.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_search_repository_collection_ses',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/repository.inc',
    'type' => MENU_CALLBACK,
    'page arguments' => [ 4, 5 ],
  ];

  $items['api/v1/repository/partners/%/%/%'] = [
    'title' => 'Query repository by partner/collection/digi_id',
    'description' => 'Query repository.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_search_repository_collection_se_id',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/repository.inc',
    'type' => MENU_CALLBACK,
    'page arguments' => [ 4, 5, 6 ],
  ];

  $items['api/v1/repository/collections/%'] = [
    'title' => 'Query repository by collection id',
    'description' => 'Query repository.',
    'access arguments' => [
      'access content',
    ],
    'page callback' => 'dlts_viewer_repository_query_repository_by_collection_id',
    'delivery callback' => 'drupal_json_output',
    'file' => 'inc/endpoints/repository.inc',
    'type' => MENU_CALLBACK,
    'page arguments' => [ 4 ],
  ];

  return $items;

}