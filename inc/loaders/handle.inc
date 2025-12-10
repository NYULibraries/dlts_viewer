<?php

/**
 * @file
 * Wildcard loaders.
 */

/**
 * A wildcard loader for dlts_photo nodes, using the node handle or identifier.
 *
 * @parameter $handle
 *  The value of the field_handle url for a dlts_photo_set node.
 *
 * @return object
 *   A node object with the given value for field_handle url.
 */
function dlts_photo_handle_load($handle, array $map = [], $resource_index = 0) {

  $id = filter_xss($handle);

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

    $resource = array_pop($results);

    $node = node_load($resource->nid);

    return $node;

  }

}
