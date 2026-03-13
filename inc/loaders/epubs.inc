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
function dlts_epub_load($identifier, $publisher, $version = 'v1') {

  $identifier = filter_xss($identifier);

  $publisher = filter_xss($publisher);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    return dlts_viewer_supafolio_book($identifier);
  } else {
    $data = dlts_viewer_epubs_metadata($version, $publisher, $identifier, true);
    if (!isset($data['error'])) {
      return $data;
    } else {
      return FALSE;
    }
  }
  return FALSE;
}
