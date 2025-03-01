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
        $number = $wrapper->field_volume_number_str->value();
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

        // https://jira.nyu.edu/browse/DLPAS-341
        // DLPAS-341 introduced a bug where the volume number was being appended to the title
        // See https://jira.nyu.edu/browse/DLTSVIEWER-182
        // This code checks if the volume number is already appended to the title
        if (strpos($field_title, (string) $number) === false) {
          $result->field_field_book_1[0]['rendered']['#markup'] = $field_title . ' ' . $number;
        }

        if (!empty($number) && strpos($field_title, (string) $number) !== FALSE) {
          $result->field_field_book_1[0]['rendered']['#markup'] = $field_title . ' ' . $number;
        }
      }
    }
  }
}
