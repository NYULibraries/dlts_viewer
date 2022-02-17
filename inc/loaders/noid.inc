<?php

/**
 * @file
 * NoId load.
 */

/**
 * A wildcard loader for dlts_resource, using noid.
 *
 * @parameter string $identifier
 *  The value of noid.
 *
 * @return object
 *   A node object.
 */
function dlts_noid_load($noid) {
  $language = ['en', LANGUAGE_NONE];
  $query_parameters = drupal_get_query_parameters();
  if (isset($query_parameters['lang'])) {
    $language = array(filter_xss($query_parameters['lang']));
  }
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->propertyCondition('language', $language)
    ->propertyCondition('status', 1)
    ->fieldCondition('field_handle', 'url', '%' . db_like($noid) . '%', 'LIKE')
    ->addTag('node_access')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  $nid = array_pop($keys);
  return node_load($nid);  
}
