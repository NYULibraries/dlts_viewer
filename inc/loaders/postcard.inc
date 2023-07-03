<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * A wildcard loader for dlts_postcard nodes, using the postcard identifier.
 *
 * @parameter $identifier
 *  The value of field_identifier for a dtls_postcard node.
 *
 * @return object
 *   A node object with the given value for field_identifier.
 */
function dlts_postcard_load($identifier) {
  $language = array('en', LANGUAGE_NONE);
  $query_parameters = drupal_get_query_parameters();
  if (isset($query_parameters['lang'])) {
    $language = array(filter_xss($query_parameters['lang']));
  }
  $query = new EntityFieldQuery();
  $identifier = filter_xss($identifier);
  $result = $query->entityCondition('entity_type', 'node')->entityCondition('bundle', 'dlts_postcard')
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
 * Load sequence.
 *
 * @param int $sequence
 *   Sequence page.
 * @param array $map
 *   An array of all path fragments.
 *
 * @return array
 *   sequence.
 */
function dlts_postcard_page_load(int $sequence, array $map) {
  exit(__FUNCTION__);
}
