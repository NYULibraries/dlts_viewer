<?php

/**
 * @file
 * Types.
 */

function dlts_type_load($type) {
  $types = array(
    'books' => 'dlts_book',
    'maps' => 'dlts_map',
    'photos' => 'dlts_photo_set',
    'postcards' => 'dlts_postcard',
    'collections' => 'dlts_collection',
    'partners' => 'dlts_partner',
  );
  if (isset($types[$type])) {
    return $types[$type];
  }
  return FALSE;
}

// noid or identifier
function dlts_resource_load($identifier, array $map, int $resource_index) {
  $bundle = $map[$resource_index - 1];
  $language = array('en', LANGUAGE_NONE);
  $query_parameters = drupal_get_query_parameters();
  if (isset($query_parameters['lang'])) {
    $language = array(filter_xss($query_parameters['lang']));
  }
  $query = new EntityFieldQuery();
  $identifier = filter_xss($identifier);
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
  return FALSE;

}
