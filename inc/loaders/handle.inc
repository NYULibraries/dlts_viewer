<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * A wildcard loader for dlts_photo nodes, using the node handle or identifier.
 *
 * @parameter $handle
 *  The value of the field_handle url for a dlts_photo_set node.
 *
 * @return object
 *   A node object with the given value for field_handle url.
 */
function dlts_photo_handle_load($handle, array $map = [], $resource_index = 0) {

  $language = [ 'en', LANGUAGE_NONE ];

  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['lang'])) {
    $language = [
      filter_xss($query_parameters['lang'])
    ];
  }

  $query = new EntityFieldQuery();

  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_photo_set')
    ->propertyCondition('language', $language)
    ->propertyCondition('status', 1)
    ->fieldCondition('field_handle', 'url', '%' . db_like($handle) . '%', 'LIKE')
    ->addTag('node_access')
    ->execute();

  if (empty($result['node'])) {

    $query = new EntityFieldQuery();

    $result = $query
      ->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'dlts_photo_set')
      ->propertyCondition('language', $language)
      ->propertyCondition('status', 1)
      ->fieldCondition('field_identifier', 'value', $handle)
      ->addTag('node_access')
      ->execute();

    if (empty($result['node'])) {
      return FALSE;
    }

  }

  $keys = array_keys($result['node']);

  $nid = array_pop($keys);

  return node_load($nid);

}
