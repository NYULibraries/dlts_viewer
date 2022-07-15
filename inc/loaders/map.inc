<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * Wildcard loader for dlts_map.
 *
 * @param string $identifier
 *
 * @return object node.
 */ 
function dlts_map_load($identifier) {
  $language = [ 'en', LANGUAGE_NONE ];
  $query_parameters = drupal_get_query_parameters();
  if (isset($query_parameters['lang'])) {
    $language = [
      filter_xss($query_parameters['lang'])
    ];
  }
  $query = new EntityFieldQuery;
  $identifier = filter_xss($identifier);
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_map')
    ->propertyCondition('status', 1)
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->addMetaData('account', user_load(0))
    ->execute();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    $nid = array_pop($keys);
    return node_load($nid);
  }
  return FALSE;
}

/**
 * A wildcard loader for dlts_map pages data from MongoDB.
 *
 * @param string $sequence
 *
 * @return object MongoDB book page object.
 */
function dlts_map_page_load($sequence) {

  // Load MongoDB helper.
  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');
  
  // Identifier.
  $isPartOf = arg(1);

  // Viewer defaults to single page view.
  $collection_name = 'dlts_map_page';

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
        unset($edit['cm']['levels']);
        unset($edit['cm']['dwtLevels']);
        unset($edit['cm']['compositingLayerCount']);
        unset($edit['cm']['timestamp']);
        unset($edit['cm']['identifier']);
        unset($edit['cm']['imagefile']);
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
