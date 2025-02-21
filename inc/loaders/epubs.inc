<?php

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

  $identifier = filter_xss($identifier);

  $publisher = filter_xss($publisher);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    return dlts_viewer_supafolio_book($identifier);
  } else {
    $result = dlts_viewer_epubs_metadata($version, $publisher, $identifier, $reset_cache);
    if (!isset($result['error'])) {
      return $result;
    } else {
      return FALSE;
    }
  }
  return FALSE;
}