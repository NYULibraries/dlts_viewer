<?php

function dlts_proxy_load($identifier) {
  $identifier = filter_xss($identifier);
  $proxies = variable_get('dlts_proxies', []);
  $keys = array_keys($proxies);
  if (in_array($identifier, $keys)) {
    return $proxies[$identifier];
  }
  return false;
}

/**
 * @file
 * Wildcard loaders.
 */

 /**
 * A wildcard loader for dlts_epub, using the ePub edition ISBN13.
 *
 * @parameter $identifier
 *  The value of ePub edition ISBN13.
 *
 * @return object
 */
function dlts_epub_load($identifier, $publisher, $version = 'v1', $reset_cache = false) {

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  $reset_cache = isset($query_parameters['reset_cache']) ? filter_xss($query_parameters['reset_cache']) : $reset_cache;

  $version = isset($query_parameters['version']) ? filter_xss($query_parameters['version']) : $version;

  $proxy_request = $query_parameters['proxy'] ? filter_xss($query_parameters['proxy']) : FALSE;

  $identifier = filter_xss($identifier);

  $publisher = filter_xss($publisher);

  $proxy_request = dlts_proxy_load($proxy_request);

  if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($proxy_request)) {
    return dlts_viewer_supafolio_book($identifier);
  } else {
    if ($proxy_request) {
      $proxy_url = $proxy_request['url'];
      $record = drupal_http_request("$proxy_url/api/$version/epubs/$publisher/$identifier?reset_cache=true");
      if ($record->code == '200' && isset($record->data)) {
        return json_decode($record->data);
      } else {
        return FALSE;
      }
    } else {
      $data = dlts_viewer_epubs_metadata($version, $publisher, $identifier, $reset_cache);
      if (!isset($data['error'])) {
        return $data;
      } else {
        return FALSE;
      }
    }
  }
  return FALSE;
}
