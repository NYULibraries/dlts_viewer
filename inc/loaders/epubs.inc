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
function dlts_epub_load($identifier, $publisher, $version = 'v1') {

  $version = 'v1';

  $identifier = filter_xss($identifier);

  $publisher = filter_xss($publisher);

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    return dlts_viewer_supafolio_book($identifier);
  } else {
    $data = dlts_viewer_epubs_metadata($version, $publisher, $identifier);
    if (!isset($data['error'])) {
      return $data;
    } else {
      return FALSE;
    }
  }
  return FALSE;
}
