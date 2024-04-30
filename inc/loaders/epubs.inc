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
function dlts_epub_load($identifier, $map_array, $_index) {

  $version = $map_array[1];

  $publisher = $map_array[3]->code;

  $reset_cache = true;

  $identifier = filter_xss($identifier);

  $result = dlts_viewer_epubs_metadata($version, $publisher, $identifier, $reset_cache);

  if (!isset($result['error'])) {
    return $result;
  }
  return FALSE;
}
