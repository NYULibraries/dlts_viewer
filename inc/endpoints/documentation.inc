<?php

/**
 * @file
 * API Documentation endpoint.
 */

/**
 * Documentation page.
 */
function dlts_viewer_api_v1_documentation() {

  global $base_url;

  module_load_include('inc', 'dlts_viewer', 'inc/routes');

  $routes = [];

  foreach (dlts_viewer_menu() as $key => $route) {
    if (
      isset($route['title']) &&
      isset($route['delivery callback']) &&
      (
        $route['delivery callback'] == 'drupal_json_output' ||
        $route['delivery callback'] == 'dlts_viewer_ldjson_iiif_presentation_3_output'
      )
    ) {
      $routes[$key] = [
        'title' => $route['title'],
        'path' => $key,
        'access' => $route['access arguments'],
        'delivery' => $route['delivery callback'],
        'page arguments' => (isset($route['page arguments'])) ? $route['page arguments'] : [],
        'page callback' => $route['page callback'],
      ];
    }
  }

  return theme('viewer_documentation_page', [
    'base_url' => $base_url,
    'routes' => $routes,
  ]);

}
