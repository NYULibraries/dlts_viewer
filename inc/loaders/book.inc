<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * A wildcard loader for dlts_book nodes, using the book identifier.
 *
 * @parameter $identifier
 *  The value of field_identifier for a dtls_book node.
 *
 * @return object
 *   A node object with the given value for field_identifier.
 */
function dlts_book_load($identifier) {
  $language = array('en', LANGUAGE_NONE);
  $query_parameters = drupal_get_query_parameters();
  if (isset($query_parameters['lang'])) {
    $language = array(filter_xss($query_parameters['lang']));
  }
  $query = new EntityFieldQuery();
  $identifier = filter_xss($identifier);
  $result = $query->entityCondition('entity_type', 'node')->entityCondition('bundle', 'dlts_book')
    // Only load books that are published.
    ->propertyCondition('status', 1)
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    $nid = array_pop($keys);
    return node_load($nid);
  }
  return FALSE;
}

/**
 * A wildcard loader for dlts_book pages data from MongoDB.
 *
 * @param string $sequence
 *   Item sequence.
 * @param array $map
 *   All elements of the path are converted to a keyed array.
 *   This is also a variable reference.
 * @param int $resource_index
 *   The element of the path the wildcard loader is defined in.
 *
 * @return object
 *   MongoDB object.
 */
function dlts_book_page_load($sequence, array $map, $resource_index) {

  $wrapper = entity_metadata_wrapper('node', $map[$resource_index - 1]);

  $isPartOf = $wrapper->field_identifier->value();

  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  // View modes, we map the views with their machine names in MongoDB.
  $collections = [
    'single' => 'dlts_books_page',
    'double' => 'dlts_stitched_books_page',
    'photo' => 'dlts_photo',
  ];

  // Viewer defaults to single page view.
  $collection_name = 'dlts_books_page';

  // User can requests a view modes, get query parameters and
  // check if page_view is set.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['page_view'])) {
    // Check if the requested view mode is valid.
    if (array_key_exists($query_parameters['page_view'], $collections)) {
      $collection_name = $collections[$query_parameters['page_view']];
    }
  }

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf, $collection_name);

  if ($result && isset($result['cm']) && !empty($result['cm']['uri'])) {
    // Sequence exist in MongoDB but we need to request metadata
    // from image server.
    if (empty($result['cm']['levels'])) {
      // Load connector.
      module_load_include('inc', 'dlts_viewer', 'inc/djatoka');
      // Pass over $result['cm'] as $file argument.
      $djatoka = dlts_viewer_djatoka_request($result['cm']);
      /*
       * No error, update MongoDB record
       * @todo Consider using Drupal queue to update the record.
       * link: https://api.drupal.org/api/drupal/modules!system!system.queue.inc/class/DrupalQueue/7
       */
      if (!isset($djatoka['error'])) {
        // Update $result reference with Image Server requested metadata.
        $result['cm'] = array_merge($result['cm'], $djatoka);
        // Update sequence record.
        dlts_viewer_mongodb_update_sequence($result, $collection_name);
        // Return sequence object.
        return array(
          'fid' => (string) $result['_id'],
          'sequence' => $result['sequence'],
          'uri' => file_create_url($result['cm']['uri']),
          'width' => $djatoka['width'],
          'height' => $djatoka['height'],
          'levels' => $djatoka['levels'],
          'dwtLevels' => $djatoka['dwtLevels'],
          'compositingLayerCount' => $djatoka['compositingLayerCount'],
          'timestamp' => $result['cm']['timestamp'],
        );
      }
    }
    else {
      return array(
        'fid' => (string) $result['_id'],
        'sequence' => $result['sequence'],
        'uri' => file_create_url($result['cm']['uri']),
        'width' => $result['cm']['width'],
        'height' => $result['cm']['height'],
        'levels' => $result['cm']['levels'],
        'dwtLevels' => $result['cm']['dwtLevels'],
        'compositingLayerCount' => $result['cm']['compositingLayerCount'],
        'timestamp' => $result['cm']['timestamp'],
      );
    }
  }

  drupal_set_message(
    t('<em>DLTS Viewer</em>: Sequence page <strong>@sequence</strong> from book identify by identifier <strong>@identifier</strong> not found.',
    array(
      '@sequence' => $sequence,
      '@identifier' => $isPartOf,
    )
  ), 'error');

  watchdog(
    'MongoDB sequence not found',
    'Unable to find book sequence page <strong>%sequence</strong> from book <strong>%identifier</strong>.',
    array(
      '%identifier' => $isPartOf,
      '%sequence' => $sequence,
    ),
    WATCHDOG_NOTICE
  );

  // If $result is empty, retrun FALSE so that hook_menu can 404 redirect.
  return FALSE;
}

/**
 * Load sequence.
 *
 * @param string $sequence
 *   Sequence.
 *
 * @return array
 *   Sequence.
 */
function dlts_book_canvas_page_load($sequence) {
  preg_match('/^p{1}([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load(
      $matches[1],
      arg(3)
    );
  }
  return FALSE;
}

/**
 * Load sequence.
 *
 * @param object $item
 *   Item.
 *
 * @return array
 *   Item.
 */
function page_item_load($item) {
  preg_match('/^([\d]+)/', $item, $matches);
  // http://localhost:9000/iiif/2/books/princeton_aco000102/1/info.json
  if ($matches) {
    $sequence = (int) $matches[1];
    return dlts_book_page_load($sequence, arg(3));
  }
  else {
    preg_match('/^p{1}([\d]+)-image/', $item, $matches);
    if (!empty($matches)) {
      $sequence = (int) $matches[1];
      return dlts_book_page_load($sequence, arg(3));
    }
  }
  return FALSE;
}

/**
 * Load sequence using Djakota as image server.
 *
 * @param object $sequence
 *   Sequence page.
 *
 * @return array
 *   Book sequence.
 */
function djakota_book_page_load($sequence, array $map) {
  if (isset($sequence['uri'])) {
    // Load djatoka helper.
    module_load_include('inc', 'dlts_viewer', 'inc/djatoka');
    return dlts_viewer_djatoka_request(
      array(
        'uri' => $sequence['uri'],
      )
    );
  }
  exit(1);
}
