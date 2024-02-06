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

  $bundle = 'dlts_book';

  $type = 'books';

  $language = [ 'en', LANGUAGE_NONE ];

  $identifier = filter_xss($identifier);

  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['lang'])) {
    $language = [ filter_xss($query_parameters['lang']) ];
  }

  $resource = dlts_noid_load($identifier);

  if ($resource && isset($resource->nid) && $resource->document == $type) {
    if (array_intersect($language, [ 'en', LANGUAGE_NONE ])) {
      return node_load($resource->nid);
    } else {
      $query = new EntityFieldQuery();

      $result = $query->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', $bundle)
        ->propertyCondition('status', 1)
        ->propertyCondition('language', $language)
        ->fieldCondition('field_identifier', 'value', $resource->identifier, '=')
        ->execute();

      if (!empty($result['node'])) {  
        $keys = array_keys($result['node']);
        $nid = array_pop($keys);
        return node_load($nid);
      }
    }  
  } else {

    $query = new EntityFieldQuery();

    $result = $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $bundle)
      ->propertyCondition('status', 1)
      ->propertyCondition('language', $language)
      ->fieldCondition('field_identifier', 'value', $identifier, '=')
      ->execute();

    if (!empty($result['node'])) {  
      $keys = array_keys($result['node']);
      $nid = array_pop($keys);
      return node_load($nid);
    }

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

  $realpath = drupal_realpath('public://') . '/datasource';

  $bundle = dlts_viewer_get_bundle_alias($wrapper->getBundle());

  $dir_path = "$realpath/$bundle/$isPartOf";

  if (!file_exists($dir_path)) {
    mkdir($dir_path, 0755, TRUE);
  }

  if (file_exists("$dir_path/sequence.$sequence.json")) {
    $data = json_decode(
      file_get_contents("$dir_path/sequence.$sequence.json")
    );
    return (array) $data;
  } else {
    $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf, 'dlts_books_page');
    if ($result && isset($result['cm']) && !empty($result['cm']['uri'])) {
      $resp = [
        'fid' => (string) $result['_id'],
        'sequence' => $result['sequence'],
        'uri' => file_create_url($result['cm']['uri']),
        'width' => $result['cm']['width'],
        'height' => $result['cm']['height'],
      ];
      file_put_contents("$dir_path/sequence.$sequence.json", json_encode($resp), LOCK_EX);
      return $resp;
    }
  }

  drupal_set_message(t('<em>DLTS Viewer</em>: Sequence page <strong>@sequence</strong> from book identify by identifier <strong>@identifier</strong> not found.', [ '@sequence' => $sequence, '@identifier' => $isPartOf, ]), 'error');

  watchdog('MongoDB sequence not found', 'Unable to find book sequence page <strong>%sequence</strong> from book <strong>%identifier</strong>.', [ '%identifier' => $isPartOf, '%sequence' => $sequence, ], WATCHDOG_NOTICE);

  // If $result is empty, retrun FALSE so that hook_menu can 404 redirect.
  return FALSE;
}

