<?php

function dlts_viewer_purge () {

  $filter = array();

  $query = 'select * from {node} where type = :type LIMIT 100';

  $replacesments = array(':type' => 'dlts_multivol_book');

  $result = db_query($query, $replacesments);

  foreach ($result as $record) {

    $node = node_load($record->nid);

    // Wrap it with Entity API
    $wrapper = entity_metadata_wrapper('node', $node);

    $identifier = $wrapper->field_identifier->value();

    if (!in_array($identifier, $filter)) {
      node_delete($node->nid);
    }

  }

}

