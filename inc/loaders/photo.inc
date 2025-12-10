<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * A wildcard loader for dlts_photo, using the book identifier.
 *
 * @parameter $identifier
 *  The value of field_identifier for a dtls_book node.
 *
 * @return object
 *   A node object with the given value for field_identifier.
 */
function dlts_photo_set_load($identifier) {
  
  $language = [ 'en', LANGUAGE_NONE ];
  
  $query_parameters = drupal_get_query_parameters();
  
  if (isset($query_parameters['lang'])) {
    $language = [ filter_xss($query_parameters['lang']) ];
  }

  $identifier = filter_xss($identifier);

  $noid = dlts_noid_load($identifier);

  if ($noid && isset($noid->nid) && $noid->document == 'photos') {
    return node_load($noid->nid);
  } else {
    $query = new EntityFieldQuery();
    $result = $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'dlts_photo_set')
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
 * A wildcard loader for dlts_photo sequence.
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
function dlts_photo_load($sequence, $map, $resource_index) {

  // Load MongoDB helper.
  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  $wrapper = entity_metadata_wrapper('node', $map[$resource_index - 1]);

  $isPartOf = $wrapper->field_identifier->value();

  $handle = $wrapper->field_handle->value();
  
  $parsed_url = parse_url($handle['url']);
  
  $noid = str_replace('/2333.1/', '', $parsed_url['path']);        

  $collection_name = 'dlts_photo';

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf, $collection_name);

  if (
    $result && 
    isset($result['cm']) && 
    !empty($result['cm']['uri'])
  ) {
    if (!empty($result['cm']['width'])) {
      return [
        'fid' => (string) $result['_id'],
        'sequence' => $result['sequence'],
        'uri' => file_create_url($result['cm']['uri']),
        'width' => $result['cm']['width'],
        'height' => $result['cm']['height'],
      ];
    } else {
      $edit = $result;
      // IIIF Image Server.
      $image_server = variable_get('dlts_image_server', 'https://image1.dlib.nyu.edu:8183');
      $uri = $result['cm']['uri'];
      $image_id = urlencode(str_replace('fileserver://', '', $uri));    
      $response = drupal_http_request("$image_server/iiif/2/$image_id/info.json", [ 'method' => 'GET', 'timeout' => 15 ]);
      if ($response->code == '200' && isset($response->data)) {
        $data = drupal_json_decode($response->data);
        $edit['cm']['width'] = $data['width'];
        $edit['cm']['height'] = $data['height'];
        $edit['noid'] = $noid;
        unset($edit['cm']['levels']);
        unset($edit['cm']['dwtLevels']);
        unset($edit['cm']['compositingLayerCount']);
        unset($edit['cm']['identifier']);
        unset($edit['cm']['imagefile']);
        if (isset($edit['cm']['timestamp'])) {
          unset($edit['cm']['timestamp']);
        }
        dlts_viewer_mongodb_update_sequence($edit, $collection_name);
        return [
          'fid' => (string) md5(rand()),
          'sequence' => $result['sequence'],
          'uri' => file_create_url($result['cm']['uri']),
          'width' => $result['cm']['width'],
          'height' => $result['cm']['height'],
        ];
      } else {
        watchdog('MongoDB metadata error', 'Unable to request metadata for sequence <strong>%sequence</strong> of resource <strong>%identifier</strong>.', [ '%identifier' => $isPartOf, '%sequence' => $sequence ], WATCHDOG_NOTICE);
        return false;
      }
    }
  } else {
    watchdog('MongoDB sequence not found', 'Unable to find sequence <strong>%sequence</strong> of resource <strong>%identifier</strong>.', [ '%identifier' => $isPartOf, '%sequence' => $sequence ], WATCHDOG_NOTICE);
    return false;
  }
}

/**
 * A wildcard loader for dlts_photo pages data from MongoDB, using the book.
 *
 * @param string $sequence
 *   Sequemce.
 *
 * @return object
 *   object MongoDB book page object
 */
function dlts_photo_sequence_load($sequence, $map, $resource_index) {

  // Load MongoDB helper.
  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  $wrapper = entity_metadata_wrapper('node', $map[$resource_index - 1]);

  $identifier = $wrapper->field_identifier->value();

  $result = dlts_viewer_mongodb_load_sequence($sequence, $identifier, 'dlts_photo');

  if ($result) {
    return $result;
  }

  return FALSE;

}
