<?php

/**
 * @file
 * DLTS Viewer shutdown functions.
 */

/**
 * Undocumented function.
 */
function dlts_viewer_cache_ijson($edit) {

  $noid = $edit['noid'];

  $type = $edit['type'];

  $data = $edit['data'];

  $realpath = drupal_realpath('public://');

  $dir_path = $realpath . '/ijson/' . $type . '/';

  $file_destination = "$dir_path/ijson.$noid.json";

  file_prepare_directory($dir_path, FILE_CREATE_DIRECTORY);

  file_unmanaged_save_data(drupal_json_encode($data), $file_destination, FILE_EXISTS_REPLACE);

  watchdog('dlts_viewer', 'Cached ijson %ijson', [ '%ijson' => $file_destination ], WATCHDOG_INFO);

}

/**
 * Undocumented function.
 */
function dlts_viewer_cache_manifest($edit) {

  $wrapper = entity_metadata_wrapper('node', $edit['resource']);

  $identifier = $wrapper->field_identifier->value();

  $realpath = drupal_realpath('public://');

  $dir_path = $realpath . '/iiif/' . $edit['type'] . '/' . $identifier;

  $file_destination = "$dir_path/manifest.json";

  file_prepare_directory($dir_path, FILE_CREATE_DIRECTORY);

  file_unmanaged_save_data(drupal_json_encode($edit['data']), $file_destination, FILE_EXISTS_REPLACE);

  watchdog('dlts_viewer', 'Cached manifest %manifest', [ '%manifest' => $file_destination ], WATCHDOG_INFO);

}

/**
 * Undocumented function.
 */
function dlts_viewer_cache_book_sequence($edit) {

  $wrapper = entity_metadata_wrapper('node', $edit['resource']);

  $identifier = $wrapper->field_identifier->value();

  $sequence = $edit['sequence'];

  $realpath = drupal_realpath('public://');

  $dir_path = $realpath . '/iiif/' . $edit['type'] . '/' . $identifier;

  $file_destination = "$dir_path/$sequence.json";

  file_prepare_directory($dir_path, FILE_CREATE_DIRECTORY);

  file_unmanaged_save_data($edit['data'], $file_destination, FILE_EXISTS_REPLACE);

}

/**
 * Undocumented function.
 * @link https://nyu.atlassian.net/browse/DLTSVIEWER-187
 */
function dlts_viewer_shutdown_log_api_requests($request) {

  global $user;

  $q = $_GET['q'];

  $REQUEST_TIME = $_SERVER['REQUEST_TIME'];

  $HTTP_USER_AGENT = $_SERVER['HTTP_USER_AGENT'];

  // $REDIRECT_URL = $_SERVER['REDIRECT_URL'];

  $HTTP_REFERER = $_SERVER['HTTP_REFERER'];

  db_insert('dlts_viewer_apilog')->fields([
    'q' => $q,
    'time' => $REQUEST_TIME,
    'useragent' => $HTTP_USER_AGENT,
    'referer' => $HTTP_REFERER,
    'user' => $user->uid,
  ])
  ->execute();

}
