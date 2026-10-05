<?php

/**
 * @file
 * MongoDB.inc.
 */

/**
 * MongoDB collection name by content type.
 *
 * @param string $type
 *   Content type.
 * @param string $view
 *   Legacy.
 *
 * @return string
 *   Collection name.
 */
function dlts_viewer_mongodb_collections_by_type($type) {
  $collections = [
    'dlts_book' => 'dlts_books_page',
    'dlts_collection' => 'dlts_collection',
    'dlts_map' => 'dlts_map_page',
    'dlts_partner' => 'dlts_partner',
    'dlts_photo_set' => 'dlts_photo',
    'dlts_postcard' => 'dlts_postcard',
    'dlts_serial' => 'dlts_serial',
  ];
  if (isset($collections[$type])) {
    return $collections[$type];
  } else {
    return FALSE;
  }
}

/**
 * Insert or replace sequence documents for a given identifier.
 *
 * Drops existing documents where `isPartOf` matches the target identifier
 * before inserting the new sequence array.
 *
 * @param array $pages
 *   Array of page/sequence documents (as arrays or objects).
 * @param string $collection_name
 *   Name of the MongoDB collection.
 *
 * @return bool|array
 *   Array of inserted documents/status on success, or FALSE on failure.
 */
function dlts_viewer_mongodb_new_sequence(array $pages,$collection_name = 'dlts_books_page') {
  if (empty($pages)) {
    return FALSE;
  }

  // Get the target identifier from the first element
  $first_item = reset($pages);
  $isPartOf = is_object($first_item) ? ($first_item->isPartOf ?? NULL) : ($first_item['isPartOf'] ?? NULL);

  if (!$isPartOf) {
    watchdog(
      'MongoDB insert sequences',
      'Missing isPartOf property in provided sequence array.',
      [],
      WATCHDOG_ERROR
    );
    return FALSE;
  }

  $cursor = mongodb_collection($collection_name);

  // 1. Remove all existing records matching this identifier
  $cursor->remove(['isPartOf' =>$isPartOf]);

  // 2. Prepare documents (ensure each element is an array and strip out existing _id)
  $documents = [];
  foreach ($pages as$page) {
    $doc = (array)$page;
    unset($doc['_id']);
    $documents[] =$doc;
  }

  // 3. Perform batch insert
  if (!empty($documents)) {
    // Legacy mongo driver method: batchInsert
    $result = $cursor->batchInsert($documents);
    return $result;
  }

  return FALSE;
}

/**
 * Load by isPartOf.
 *
 * @param string $identifier
 *   Identifier.
 * @param string $collection_name
 *   Name of collection to table to query.
 *
 * @return array
 *   Item.
 */
function dlts_viewer_mongodb_load_by_identifier($identifier, $collection_name) {
  $query = [ 'identifier' => $identifier ];
  $cursor = mongodb_collection($collection_name);
  $result = $cursor->findOne($query);
  return $result;
}

/**
 * Load by isPartOf.
 *
 * @param string $isPartOf
 *   isPartOf.
 * @param string $collection_name
 *   Name of collection to table to query.
 *
 * @return array
 *   Item.
 */
function dlts_viewer_mongodb_load_by_item_identifier($isPartOf, $collection_name) {
  $query = [ 'isPartOf' => $isPartOf ];
  $cursor = mongodb_collection($collection_name);
  $result = $cursor->find($query);
  return $result;
}

/**
 * Load sequence.
 *
 * @param int $sequence
 *   Sequence number.
 * @param string $isPartOf
 *   Identifier.
 * @param string $collection_name
 *   Name of collection to table to query.
 *
 * @return array
 *   Sequence.
 */
function dlts_viewer_mongodb_load_sequence($sequence = 1, $isPartOf, $collection_name = 'dlts_books_page') {
  // Prepare query.
  $query = [
    'isPartOf' => $isPartOf,
    'sequence' => (int) $sequence,
  ];
  $cursor = mongodb_collection($collection_name);
  $result = $cursor->findOne($query);
  return $result;
}

/**
 * Load resource by identifier.
 *
 * @param string $identifier
 *   Identifier.
 * @param string $collection_name
 *   Name of collection to table to query.
 *
 * @return array
 *   Resource.
 */
function dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name) {
  $items = [];
  $query = [ 'isPartOf' => $identifier ];
  $cursor = mongodb_collection($collection_name)->find($query);
  $count = $cursor->count();
  if ($count > 0) {
    $cursor->sort([ 'sequence' => 1 ]);
    return $cursor->skip(0);
  }
  return $items;
}

/**
 * Admin page: Review record.
 *
 * @param string $identifier OR $noid
 *   Identifier or NoId.
 */
function dlts_viewer_dispatch_mongodb_record($record) {

  global $base_url;

  $identifier = $record->identifier;

  $entity = node_load($record->nid);

  $wrapper = entity_metadata_wrapper('node', $entity);

  $title = $wrapper->field_title->value();  

  $title = html_entity_decode($title, ENT_QUOTES);

  // Set entity title.
  drupal_set_title($title);

  $bundle = $wrapper->getBundle();

  $type = dlts_viewer_resource_type($bundle);

  $collection_name = dlts_viewer_mongodb_collections_by_type($bundle);

  $page = 0;

  $rows = [];

  $node_rows = [];

  $handle = $wrapper->field_handle->value();
  
  $c = $wrapper->field_collection->value();
  
  $cwrapper = entity_metadata_wrapper('node', $c[0]);
  
  $collection = $cwrapper->field_name->value();
  
  $p = $wrapper->field_partner->value();
  
  $pwrapper = entity_metadata_wrapper('node', $p[0]);
  
  $partner = $pwrapper->field_name->value();

  $per_page = (int) $wrapper->field_sequence_count->value();
  
  $cursor = mongodb_collection($collection_name)->find([ 'isPartOf' => $identifier ]);
  
  $count = $cursor->count();
  
  $noid = $record->noid;
  
  if ($count > 0) {
    $cursor->sort([ 'sequence' => 1 ]);
    $cursor->limit($per_page);
    $docs = $cursor->skip($per_page * $page);
    foreach ($docs as $doc) {
      $sequence = $doc['realPageNumber'];
      $thumbnail = "<a href='$base_url/$type/$identifier/$sequence'><img loading='lazy' src='$base_url/api/image/$type/$identifier/$sequence/full/150,/0/default.jpg'></a>";
      $height = isset($doc['cm']['height']) ? $doc['cm']['height'] : '';
      $width = isset($doc['cm']['width']) ? $doc['cm']['width'] : '';
      $uri = $doc['cm']['uri'];
      $rows[] = [
        [ 'field' => 'sequence', 'data' => $thumbnail ],
        [ 'field' => 'uri', 'data' => "<a href='$base_url/api/image/$type/$identifier/$sequence/full/full/0/default.jpg'>$base_url/api/image/$type/$identifier/$sequence/full/full/0/default.jpg</a>" ],
        [ 'field' => 'height', 'data' => $height ],
        [ 'field' => 'width', 'data' => $width ],
      ];
    }
  }
  $node_rows = [
    [
      [ 'field' => 'label', 'data' => 'Title' ],
      [ 'field' => 'value', 'data' => $title ],
    ],      
    [
      [ 'field' => 'label', 'data' => 'Handle' ],
      [ 'field' => 'value', 'data' => "<a href='{$handle['url']}'>{$handle['url']}</a>" ],
    ],
    [
      [ 'field' => 'label', 'data' => 'NoId' ],
      [ 'field' => 'value', 'data' => "$noid" ],
    ],
    [
      [ 'field' => 'label', 'data' => 'Type' ],
      [ 'field' => 'value', 'data' => $type ],
    ],      
    [
      [ 'field' => 'label', 'data' => 'Sequence count' ],
      [ 'field' => 'value', 'data' => $per_page ],
    ],
    [
      [ 'field' => 'label', 'data' => 'Collection' ],
      [ 'field' => 'value', 'data' => $collection ],
    ],
    [
      [ 'field' => 'label', 'data' => 'Partner' ],
      [ 'field' => 'value', 'data' => $partner ],
    ],
    [
      [ 'field' => 'label', 'data' => 'Url' ],
      [ 'field' => 'value', 'data' => "<a href='$base_url/api/embed/$identifier'>$base_url/api/embed/$identifier</a>" ],
    ],                    
  ];    

  $node_table = [
    'header' => [
      [ 'data' => 'Label', 'field' => 'label' ],
      [ 'data' => 'Value', 'field' => 'value' ],
    ],
    'rows' => $node_rows,
    'attributes' => [],
    'empty' => 'No records found.',
    'sticky' => FALSE,
    'caption' => 'Metadata',
    'colgroups' => [],
  ];

  $records_table = [
    'header' => [
      [ 'data' => 'Sequence', 'field' => 'sequence' ],
      [ 'data' => 'Image Url', 'field' => 'uri' ],
      [ 'data' => 'Height', 'field' => 'height' ],
      [ 'data' => 'Width', 'field' => 'width' ],
    ],
    'empty' => 'No records found.',
    'rows' => $rows,
    'sticky' => TRUE,
    'attributes' => [],
    'caption' => 'Sequences',
    'colgroups' => [],
  ];

  $output = '
    <script src="https://polyfill.io/v3/polyfill.min.js?flags=gated&features=IntersectionObserver" crossorigin="anonymous"></script>
    <script async src="https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@0.2.0/loading-attribute-polyfill.min.js" integrity="sha256-kX73NqVUoUbV0K44kgoqP8P8IZfU0OEjr/afCnK2Mrg=" crossorigin="anonymous"></script>
    <style>
      caption {
        text-align: left;
        margin-bottom: 1em;
        font-weight: bold;
      }
      td img {
        width: 100px;
      }
    </style>
   ';

  $output .= theme_table($node_table) . '<hr style="border-top: 1px gray red; display: block; margin-top: 1.5em; margin-bottom: 1em;">' . theme_table($records_table);
  
  return $output;

}
