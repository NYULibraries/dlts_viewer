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
function dlts_epub_load($identifier, $version = 'v0') {
  $identifier = filter_xss($identifier);
  $result = $result = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier', [ ':identifier' => $identifier ])->fetchObject();
  if (!empty($result->identifier)) {
    $data = dlts_viewer_supafolio_book($result->identifier, true);
    switch ($version) {
      case 'v0':
        return dlts_viewer_epubs_metadata_v0($data);
    }
  }
  return FALSE;
}
