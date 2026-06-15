<?php

/**
 * @file
 * Views files.
 */

/**
 * Views (module)
 *
 * @link https://www.drupal.org/project/views
 * @link https://api.drupal.org/api/views/views.api.php
 * @link https://api.drupal.org/api/views/views.api.php/function/hook_views_pre_render/7.x-3.x
 */
function dlts_viewer_views_pre_render(&$view) {
  if ($view->name == 'mv') {
    $language = NULL;
    $results = $view->result;
    $query_parameters = drupal_get_query_parameters();
    if (isset($query_parameters['lang'])) {
      $language = array(filter_xss($query_parameters['lang']));
    }
    foreach ($results as $key => $result) {
      if (isset($result->_field_data['field_multivol_node_nid']['entity'])) {
        $node = $result->_field_data['field_multivol_node_nid']['entity'];
        $wrapper = entity_metadata_wrapper('node', $node);
        // Cast to string and trim any accidental whitespace
        $number = trim((string) $wrapper->field_volume_number_str->value());        
        $book = $wrapper->field_book->value();
        $book_wrapper = entity_metadata_wrapper('node', $book);
        if ($book->language != $language) {
          $field_identifier = $book_wrapper->field_identifier->value();
          $lang_book = dlts_book_load($field_identifier);
          $lang_book_wrapper = entity_metadata_wrapper('node', $lang_book);
          $field_title = $lang_book_wrapper->field_title->value();
        } else {
          $field_title = $book_wrapper->field_title->value();
        }
        // Ensure field_title is treated as a string
        $field_title = (string) $field_title;
        // Verify that the needle ($number) is not an empty string before using strpos()
        if ($number !== '') {
          if (strpos($field_title, $number) === FALSE) {
            $result->field_field_book_1[0]['rendered']['#markup'] = $field_title . ' ' . $number;
          }
          else {
            $result->field_field_book_1[0]['rendered']['#markup'] = $field_title . ' ' . $number;
          }
        }
      }
    }
  }
}
