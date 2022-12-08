<?php

/**
 * @file
 * DLTS Viewer shutdown functions.
 */


/**
 * Undocumented function.
 *
 * @todo document function
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
 *
 * @todo document function
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
