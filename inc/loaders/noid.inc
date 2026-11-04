<?php

/**
 * @file
 * NoId load.
 */

/**
 * A wildcard loader for dlts_noid.
 *
 * @parameter string $identifier
 *  The value of noid.
 *
 * @return object
 *   A resource object.
 */
function dlts_noid_load($id) {
  $result = db_query(
    'SELECT * FROM {dlts_viewer_resource} 
     WHERE noid = :id 
     OR identifier = :id 
     LIMIT 1',
    [':id' => $id]
  )->fetchObject();

  return $result ? $result : FALSE;
}