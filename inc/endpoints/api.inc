<?php

/**
 * @file
 * API Routes.
 */

/**
 * Retrieves paginated log data from the 'dlts_viewer_apilog' table 
 * and returns it as a structured array for JSON output.
 *
 * This function uses low-level DB API calls (range() and COUNT(*)) to manage 
 * pagination without relying on the global Drupal pager functions, making it 
 * robust for custom MENU_CALLBACK endpoints.
 *
 * @param array $options
 * (Optional) An array of options that could be passed to the function 
 * (e.g., to override $limit or $element). Not currently used in the 
 * implementation but included for future scalability.
 *
 * @return array|bool
 * A structured array containing 'metadata' (paging info) and 'logs' (data)
 * on success, or FALSE if the user does not have the required permission.
 * The calling page callback must json_encode() this array.
 *
 * @see db_select::range()
 * @see user_access()
 */
function dlts_viewer_services_api_usage() {
  if (user_access('dlts create object')) {

    // 1. Setup Paging Variables.
    $limit = 100; // Items per page.
    $element = 0; // Pager element ID.

    // 2. Determine Total Items (Low-Level Count Query).
    $count_query = db_select('dlts_viewer_apilog', 'd');
    $count_query->addExpression('COUNT(*)', 'total_count');
    
    $total_items = $count_query->execute()->fetchField();
    $total_items = (int) $total_items; // Ensure it's an integer.

    // 3. Calculate Current Page and Offset.
    $total_pages = $total_items > 0 ? ceil($total_items / $limit) : 1;

    // Read the 'page' query parameter. It is 0-indexed.
    $current_page_0_indexed = isset($_GET['page']) ? (int) $_GET['page'] : 0;
    
    // Validate page number (must be >= 0 and not exceed total pages).
    $current_page_0_indexed = max(0, $current_page_0_indexed);
    $current_page_0_indexed = min($current_page_0_indexed, $total_pages - 1);
    
    // Calculate the database OFFSET.
    $offset = $current_page_0_indexed * $limit;


    // 4. Build the Final Query (with LIMIT and OFFSET).
    $query = db_select('dlts_viewer_apilog', 'd');
    $query->fields('d', [ 'q', 'time', 'useragent', 'referer', 'user' ]);

    // Apply the manually calculated pagination range.
    $query
      ->orderBy('time', 'DESC')
      ->range($offset, $limit); 
  
    $result = $query->execute();

    // 5. Collect the Log Data.
    $data = [];
    foreach ($result as $log) {
      $data[] = [
        'q' => $log->q,
        'time' => format_date($log->time, 'custom', 'Y-m-d H:i:s'),
        'useragent' => $log->useragent,
        'referer' => $log->referer,
        'user' => $log->user,
      ];
    }

    // 6. Construct the Response.
    $response = [
      'metadata' => [
        'total_items' => $total_items,
        'items_per_page' => $limit,
        // Convert 0-indexed page number to human-readable 1-indexed page number.
        'current_page' => $current_page_0_indexed + 1, 
        'total_pages' => (int) $total_pages,
      ],
      'logs' => $data,
    ];  

    return $response;
  }
}

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
