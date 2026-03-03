<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * A wildcard loader for dlts_serial nodes, using the serial identifier.
 *
 * @parameter $identifier
 *  The value of field_identifier for a dlts_serial node.
 *
 * @return object
 *   A node object with the given value for field_identifier.
 */
function dlts_serial_load($identifier) {

  $bundle = 'dlts_serial';

  $type = 'serials';

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
  }

  return FALSE;

}

/**
 * A wildcard loader for dlts_serial pages data from MongoDB.
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
function dlts_serial_page_load($sequence, array $map, $resource_index) {

  $wrapper = entity_metadata_wrapper('node', $map[$resource_index - 1]);

  $isPartOf = $wrapper->field_identifier->value();

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf, 'dlts_serial');

  if ($result && isset($result['cm']) && !empty($result['cm']['uri'])) {
    $resp = [
      'fid' => (string) $result['_id'],
      'sequence' => $result['sequence'],
      'uri' => file_create_url($result['cm']['uri']),
      'width' => $result['cm']['width'],
      'height' => $result['cm']['height'],
    ];
    return $resp;
  }

  drupal_set_message(t('<em>DLTS Viewer</em>: Sequence page <strong>@sequence</strong> from serial identify by identifier <strong>@identifier</strong> not found.', [ '@sequence' => $sequence, '@identifier' => $isPartOf, ]), 'error');

  watchdog('MongoDB sequence not found', 'Unable to find serial sequence page <strong>%sequence</strong> from serial <strong>%identifier</strong>.', [ '%identifier' => $isPartOf, '%sequence' => $sequence, ], WATCHDOG_NOTICE);

  // If $result is empty, retrun FALSE so that hook_menu can 404 redirect.
  return FALSE;
}

