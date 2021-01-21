<?php

/**
 * @file
 * DLTS Viewer shutdown functions.
 */

// function dlts_viewer_node_update_dlts_book($node) {
// }

// function dlts_viewer_node_insert_dlts_book($node) {
// }

// function dlts_viewer_node_update($node) {
//   $wrapper = entity_metadata_wrapper('node', $node);
//   $type = $wrapper->getBundle();
//   $collections = array();
//   if ($type == 'dlts_book') {
//     foreach ($wrapper->field_collection->value() as $collection) {
//       $c_wrapper = entity_metadata_wrapper('node', $collection);
//       $collections[] = $c_wrapper->field_code->value();
//     }
//     $handle_field = $wrapper->field_handle->value();
//     $handle = $handle_field['url'];
//     $edits = array(
//       'identifier' => $wrapper->field_identifier->value(),
//       'collection' => array_shift($collections),
//       'handle' => $handle,
//       'type' => $type,
//     );
//     // we only have 1 handle, if we have more than one collection
//     // there is nothing we can do at this point. Do not
//     // register or try to update a handle
//     if (count($edits['collection']) <= 1) {
//       drupal_register_shutdown_function('dlts_viewer_node_update_dlts_book', $edits);
//     }
//   }
// }

// function dlts_viewer_node_insert($node) {
//   if ($node->type == 'dlts_book') {
//     drupal_register_shutdown_function('dlts_viewer_node_insert_dlts_book', $node);
//   }
// }