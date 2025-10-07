<?php

/**
 * @file
 * API Routes.
 */

/**
 * Check MongoDB server status.
 *
 * @return array
 * ...
 */
function dlts_viewer_api_check_status_mongodb() {
  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);
  if (user_access('dlts create object')) {
    // Load helpers.
    module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

    $mongodb = mongodb();

    $result = $mongodb->command(['ping' => 1]);

    // Check the result
    if ($result && $result['ok'] == 1) {
      return [
        'status' => 'available',
        'message' => 'MongoDB server is available.',
        'code' => 200,
      ];
    } else {
      return [
        'status' => 'not available',
        'message' => $result['errmsg'],
        'code' => $result['code'],
      ];
    }
    return [
      'status' => 'error',
      'message' => 'Unknown error.'
    ];
  } else {
    return [
      'status' => 'error',
      'message' => 'Action not allowed.'
    ];
  }
}
