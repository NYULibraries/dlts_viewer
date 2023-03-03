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
  ];
  if (isset($collections[$type])) {
    return $collections[$type];
  } else {
    return FALSE;
  }
}

/**
 * Update sequence.
 *
 * @param array $arguments
 *   Arguments.
 * @param string $collection_name
 *   Name of collection to table to query.
 *
 * @return array
 *   Item.
 */
function dlts_viewer_mongodb_update_sequence(array $arguments, $collection_name = 'dlts_books_page') {
  $cursor = mongodb_collection($collection_name);
  $data = (array) $arguments;
  // Make sure we let MongoDB assing the _id for the document.
  if (isset($data['_id'])) {
    unset($data['_id']);
  }
  $query = [
    'sequence' => $data['sequence'],
    'isPartOf' => $data['isPartOf'],
  ];
  // Find document and modify.
  // See: https://docs.mongodb.org/manual/reference/method/db.collection.findAndModify/
  // See: http://php.net/manual/en/mongocollection.findandmodify.php
  $op = $cursor->findAndModify(
    $query, 
    [ '$set' => $data ], 
    NULL,
    [
      'sort' => [ 'rating' => 1 ],
      'upsert' => TRUE,
      'new' => TRUE,
    ]
  );
  // We should have the current result document as an associative array.
  // if NULL, we have a problem, log error.
  if (!$op) {
    watchdog(
      'MongoDB update document',
      'Unable to update sequence page <strong>%sequence</strong> from resource <strong>%identifier</strong>.',
      [
        '%identifier' => $arguments['isPartOf'],
        '%sequence' => $arguments['sequence'],
      ],
      WATCHDOG_ERROR
    );
    return FALSE;
  }
  return $op;
}

/**
 * See dlts_viewer_mongodb_update_sequence.
 */
function dlts_viewer_mongodb_new_sequence($arguments, $collection_name = 'dlts_books_page') {
  return dlts_viewer_mongodb_update_sequence($arguments, $collection_name);
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
function dlts_viewer_dispatch_mongodb_record($node) {

  global $base_url;

  $bundle = dlts_viewer_get_bundle_alias($node->document);

  $identifier = $node->identifier;

  $entity = node_load($node->nid);

  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  $title = $wrapper->field_title->value();  

  $title = html_entity_decode($title, ENT_QUOTES);

  // Set entity title.
  drupal_set_title($title);

  $collection_name = dlts_viewer_mongodb_collections_by_type($node->document);

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
  
  $noid = $node->noid;
  
  if ($count > 0) {
    $cursor->sort([ 'sequence' => 1 ]);
    $cursor->limit($per_page);
    $docs = $cursor->skip($per_page * $page);
    foreach ($docs as $doc) {
      $sequence = $doc['realPageNumber'];
      $thumbnail = "<a href='$base_url/$bundle/$identifier/$sequence'>$sequence</a>";
      $height = isset($doc['cm']['height']) ? $doc['cm']['height'] : '';
      $width = isset($doc['cm']['width']) ? $doc['cm']['width'] : '';
      $uri = $doc['cm']['uri'];
      $rows[] = [
        [ 'field' => 'sequence', 'data' => $thumbnail ],
        [ 'field' => 'uri', 'data' => "<a href='$base_url/api/image/$bundle/$identifier/$sequence/full/full/0/default.jpg'>$uri</a>" ],
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
      [ 'field' => 'value', 'data' => $handle['url'] ],
    ],
    [
      [ 'field' => 'label', 'data' => 'NoId' ],
      [ 'field' => 'value', 'data' => $noid ],
    ],
    [
      [ 'field' => 'label', 'data' => 'Type' ],
      [ 'field' => 'value', 'data' => ucwords(str_replace('s', '', $bundle)) ],
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
      [ 'data' => 'Master file', 'field' => 'uri' ],
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
