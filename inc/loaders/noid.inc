<?php

/**
 * @file
 * NoId load.
 */

/**
 * A wildcard loader for dlts_resource, using noid.
 *
 * @parameter string $identifier
 *  The value of noid.
 *
 * @return object
 *   A node object.
 */
function dlts_noid_load($id) {
  // id can be noid or identifier.
  $results = db_query(
    'SELECT * FROM dlts_viewer_resource 
     WHERE noid = :id 
     OR identifier = :id 
     LIMIT 1', 
    [ ':id' => $id ]
    )->fetchAll();

  if (empty($results)) {
    return FALSE;
  } else {
    $result = array_pop($results);
    return $result;
  }
}
