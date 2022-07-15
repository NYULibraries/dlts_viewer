<?php

/**
 * @file
 * DLTS Viewer Drush commands.
 */

/**
 * Implements hook_drush_command().
 *
 * In this hook, you specify which commands your
 * drush module makes available, what it does and
 * description.
 */
function dlts_viewer_drush_command() {
  $items = [];

  $items['solr-index-photos'] = [
    'callback' => 'dlts_viewer_solr_index_photos',
    'description' => dt('Index photos entities .'),
    'options' => [
      'limit' => dt('Limit.'),
    ],
  ];

  $items['list-translation'] = [
    'callback' => 'dlts_viewer_drush_list_translation',
    'description' => dt('List translation'),
  ];

  $items['delete-book-by-identifier'] = [
    'callback' => 'dlts_viewer_delete_book_by_identifier',
    'description' => dt('Delete book by identifier'),
    'options' => [
      'identifier' => dt('Book identifier'),
    ],
  ];

  $items['update-handle'] = [
    'callback' => 'dlts_viewer_update_handle',
    'description' => dt('Update handle'),
    'options' => [
      'identifier' => dt('Book identifier'),
      'handle' => dt('Book handle'),
    ],
  ];

  $items['index-node-by-identifier'] = [
    'callback' => 'dlts_viewer_drush_index_node',
    'description' => dt('Index node by identifier'),
    'options' => [
      'identifier' => dt('Node identifier'),
    ],
  ];

  $items['add-resources'] = [
    'callback' => 'dlts_viewer_drush_add_resources',
    'description' => dt('List resources'),
    'options' => [
      'type' => dt('Resource type'),
    ],
  ];

  $items['resources-list'] = [
    'callback' => 'dlts_viewer_drush_resources_list',
    'description' => dt('Returns list of resources')
  ];

  $items['resources-list-cleanup'] = [
    'callback' => 'dlts_viewer_drush_resources_list_cleanup',
    'description' => dt('Delete all records from the resources list')
  ];

  $items['total-resources-to-update'] = [
    'callback' => 'dlts_viewer_drush_total_resources_to_update',
    'description' => dt('Returns total of resources to update')
  ];

  $items['update-resource-pages'] = [
    'callback' => 'dlts_viewer_drush_update_resource_pages',
    'description' => dt('Update resource pages'),
    'options' => [
      'identifier' => dt('Resource identifier'),
      'log' => dt('Display opt logs'),
      'limit' => dt('Limit'),
    ],
  ];

  return $items;

}

/**
 * Implements hook_drush_help().
 */
function dlts_viewer_drush_help($section) {
  switch ($section) {
    case 'drush:import-book':
      return dt('Some day someone will document this module');
  }
}


// ./vendor/bin/drush resources-list-cleanup
function dlts_viewer_drush_resources_list_cleanup() {
  db_query("DELETE FROM dlts_viewer_resource WHERE nid <> 'OUT';");
}

// ./vendor/bin/drush resources-list
function dlts_viewer_drush_resources_list() {
  $resources = db_query("SELECT * FROM dlts_viewer_resource")->fetchAll();
  foreach ($resources as $resource) {
    print_r($resource);
  }
}

// DELETE FROM dlts_viewer_resource WHERE nid <> 'YOLO';

// ./vendor/bin/drush add-resources --type=books
// ./vendor/bin/drush add-resources --type=maps
// ./vendor/bin/drush add-resources --type=photos
function dlts_viewer_drush_add_resources() {

  global $base_url;

  $type = drush_get_option('type', FALSE);

  if (!$type) {
    drush_log('No type selected.', 'error');
    exit();
  }

  $types = [
    'books' => 'dlts_book',
    'maps' => 'dlts_map',
    'photos' => 'dlts_photo_set',
    'postcards' => 'dlts_postcard',
  ];

  if (!isset($types[$type])) {
    drush_log('Type not supported.', 'error');
    exit();
  }

  $type = $types[$type];

  $sql = "SELECT DISTINCT nid FROM node WHERE type = '$type' AND status = 1 AND (language = 'und' OR language = 'en')";

  $nodes = db_query($sql)->fetchAll();

  foreach ($nodes as $node) {
    $exists = db_query("SELECT nid FROM dlts_viewer_resource WHERE nid = '$node->nid'")->fetchAll();
    if (count($exists) <= 0) {
      db_query("INSERT INTO dlts_viewer_resource (nid, noid, identifier, document, proceed) VALUES ('$node->nid', '', '', '$types[$type]', '0')");
    }
  }

}

function dlts_viewer_list_resource_node($resource = null) {

  $results = db_query('SELECT nid FROM dlts_viewer_resource WHERE proceed = 0 ORDER BY RAND() LIMIT 1')->fetchAll();

  $collections = [
    'dlts_book' => 'dlts_books_page',
    'dlts_collection' => 'dlts_collection',
    'dlts_map' => 'dlts_map_page',
    'dlts_partner' => 'dlts_partner',
    'dlts_photo_set' => 'dlts_photo',
    'dlts_postcard' => 'dlts_postcard',
  ];

  $types = [
    'dlts_book' => 'books',
    'dlts_map' => 'maps',
    'dlts_photo_set' => 'photos',
    'dlts_postcard' => 'postcards',
  ];

  if ($results) {
    $node = node_load($results[0]->nid);
    $nid = $node->nid;
    $wrapper = entity_metadata_wrapper('node', $node);
    $identifier = $wrapper->field_identifier->value();
    $type = $types[$node->type];
    $collection_name = $collections[$node->type];
    $cursor = mongodb_collection($collection_name)->find([ 'isPartOf' => $identifier, 'cm.width' => '' ]);
    $count = $cursor->count();
    if ($count < 1) {
      $handle = $wrapper->field_handle->value();
      $parsed_url = parse_url($handle['url']);
      $noid = str_replace('/2333.1/', '', $parsed_url['path']);      
      $edit_query = "UPDATE dlts_viewer_resource SET noid = '$noid', identifier = '$identifier', document = '$type', proceed = '1' WHERE nid = '$nid' LIMIT 1;";
      $results = db_query($edit_query);
      return dlts_viewer_list_resource_node();
    }
    return [
      'identifier' => $identifier,
      'nid' => $node->nid,
      'count' => $count,
    ];
  } else {
    die('Error: Node not found or in scope of API.');
  } 
}

/**
 * Find how many documets we need to update.
 *  $ ./vendor/bin/drush total-resources-to-update
 */
function dlts_viewer_drush_total_resources_to_update() {
  $results = db_query('SELECT nid FROM dlts_viewer_resource WHERE proceed = 0 ORDER BY RAND() LIMIT 1')->fetchAll();
  echo count($results);
}

/**
 * Update resource pages.
 *  $ ./vendor/bin/drush update-resource-pages
 *  $ ./vendor/bin/drush update-resource-pages --identifier=princeton_aco000070
 */
function dlts_viewer_drush_update_resource_pages() {

  global $base_url;

  $log = drush_get_option('log', true);

  $identifier = drush_get_option('identifier', false);  

  // MongoDB pagination.
  $page = 0;

  // MongoDB records limit.
  $per_page = (int) drush_get_option('limit', 10);

  $types = [
    'dlts_book' => 'books',
    'dlts_map' => 'maps',
    'dlts_photo_set' => 'photos',
    'dlts_postcard' => 'postcards',
  ];

  $collections = [
    'dlts_book' => 'dlts_books_page',
    'dlts_collection' => 'dlts_collection',
    'dlts_map' => 'dlts_map_page',
    'dlts_partner' => 'dlts_partner',
    'dlts_photo_set' => 'dlts_photo',
    'dlts_postcard' => 'dlts_postcard',
  ];  

  // IIIF Image Server.
  $image_server = variable_get('dlts_image_server', 'https://image1.dlib.nyu.edu:8183');  
  
  if ($log === 'false') {
    $log = false;
  } else {
    $log = true;
  }

  if (!$identifier) {
    $rand = dlts_viewer_list_resource_node();
    $identifier = $rand['identifier'];
    $nid =  $rand['nid'];
  } else {
    $nid = nid_by_identifier($identifier);
  }

  if (!$nid) die('Node not found.');

  // Load node from Drupal.
  $node = node_load($nid);

  // Resource type.
  $type = $types[$node->type];

  // Collection to search.
  $collection_name = $collections[$node->type];    

  $wrapper = entity_metadata_wrapper('node', $node);
  $filter = [ 'isPartOf' => $identifier, 'cm.width' => '' ];
  $cursor = mongodb_collection($collection_name)->find($filter);
  $cursor->limit($per_page);
  $records = $cursor->skip($per_page * $page);
  $count = $cursor->count();
  $handle = $wrapper->field_handle->value();
  $parsed_url = parse_url($handle['url']);
  $noid = str_replace('/2333.1/', '', $parsed_url['path']);      
  if ($count > 0) {
    foreach ($records as $doc) {
      $edit = $doc;
      if (isset($doc['cm']) && isset($doc['cm']['uri'])) {
        $uri = $doc['cm']['uri'];
        $realPageNumber = $doc['realPageNumber'];
        $image_id = urlencode(str_replace('fileserver://', '', $uri));    
        $response = drupal_http_request("$image_server/iiif/2/$image_id/info.json", [ 'method' => 'GET', 'timeout' => 15 ]);
        if ($response->code == '200' && isset($response->data)) {
          $data = drupal_json_decode($response->data);
          $edit['noid'] = $noid;
          $edit['cm']['width'] = $data['width'];
          $edit['cm']['height'] = $data['height'];
          unset($edit['cm']['levels']);
          unset($edit['cm']['dwtLevels']);
          unset($edit['cm']['compositingLayerCount']);
          unset($edit['cm']['timestamp']);            
          $update = dlts_viewer_mongodb_update_sequence($edit, $collection_name);
          if ($update) {
            if ($log) {
              drush_log("Updating sequence $realPageNumber of resource $identifier.", 'ok');
            }
          } else {
            drush_log('Error: Updating sequence $realPageNumber of resource $identifier.', 'error');
          }
        } else {
          drush_log('Error: Unable to request data.', 'error');
        }
      } else {
        // Something is wrong.
        $edit_query = "UPDATE dlts_viewer_resource SET noid = '$noid', identifier = '$identifier', document = '$type', proceed = '5' WHERE nid = '$nid' LIMIT 1;";
        $results = db_query($edit_query);
        drush_log('Error: MongoDB object is missing CM data.', 'error'); 
      }
    }
    // Search collectiong again, if we are done, update the record in Drupal and set it as done.
    $cursor = mongodb_collection($collection_name)->find([ 'isPartOf' => $identifier, 'cm.width' => '' ]);
    if ($cursor->count() < 1) {
      $edit_query = "UPDATE dlts_viewer_resource SET noid = '$noid', identifier = '$identifier', document = '$type', proceed = '1' WHERE nid = '$nid' LIMIT 1;";
      $results = db_query($edit_query);
      return dlts_viewer_list_resource_node();
    }
  }
}

/**
 * Index nodes in Apache Solr.
 */
function dlts_viewer_drush_index_node() {
  $language = 'en';
  $type = 'node';
  $identifier = drush_get_option('identifier', NULL);
  // @todo Make this more generic, a way to get maps too.
  $nid = book_nid($identifier, $language);
  if ($nid) {
    $node = node_load($nid);
    $wrapper = entity_metadata_wrapper('node', $node);
    $query = new EntityFieldQuery();
    $keys = array();
    $indexer_table = apachesolr_get_indexer_table($type);
    db_merge($indexer_table)->key(
      array(
        'entity_type' => $type,
        'entity_id' => $nid,
      )
    )->insertFields(
      array(
        'entity_type' => $type,
        'entity_id' => $id,
        'bundle' => $wrapper->getBundle(),
        'status' => 1,
      )
    )->fields(
      array(
        'changed' => REQUEST_TIME,
      )
    )->execute();
  }
}

/**
 * List translation of a bookm query by identifier.
 */
function dlts_viewer_drush_list_translation() {
  $query = new EntityFieldQuery();
  $identifier = drush_get_option('identifier', NULL);
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  $langs = array();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    $nodes = node_load_multiple($keys);
    foreach ($nodes as $node) {
      $langs[$node->language] = "node/$node->nid";
    }
  }
  foreach ($langs as $lang) {
    drush_log($lang, 'ok');
  }
}

/**
 * Delete book query by identifier.
 */
function dlts_viewer_delete_book_by_identifier() {
  $identifier = drush_get_option('identifier', NULL);
  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);
  if (count($nids) > 0) {
    drush_log("Removing nodes by identifier $identifier", 'ok');
    foreach ($nids as $nid) {
      node_delete($nid);
      drush_log("Node $nid deleted", 'success');
    }
  }
  else {
    drush_log("Not found - nodes by identifier $identifier", 'ok');
  }
}

/**
 * Update handle.
 */
function dlts_viewer_update_handle($identifier, $handle) {
  /*
   * "ruby list_handle.rb -p 2333.1 -l
   * ncjsxwst -b 'http://dlib.nyu.edu/aco/book/aub_aco002627'"
   *  <\?xml version="1.0" encoding="UTF-8"?\>
   *  <hs:info xmlns:hs="info:nyu/dl/v1.0/identifiers/handle">
   *    <hs:binding>http://dlib.nyu.edu/aco/book/aub_aco002627</hs:binding>
   *      <hs:description></hs:description>
   * </hs:info>
   */

  $username = '';

  $password = '';

  $protocol = 'https';

  $handleUrl = 'handle.dlib.nyu.edu';

  $handle = 'ncjsxwst';

  $servicePrefix = '2333.1';

  $url = "$protocol://$username:$password@$handleUrl/id/handle/$servicePrefix/$handle";

  $data = array();

  $request = drupal_http_request(
    url($url, array('query' => $data))
  );

  if ($request->code === '200') {
    preg_match('/<hs:binding>(.*)<\/hs:binding>/', $request->data, $binding);
    preg_match('/<hs:location>(.*)<\/hs:location>/', $request->data, $location);
    $location = trim($location[1]);
    $binding = trim($binding[1]);
    drush_log("Binded $binding to $location", 'ok');
  }
}

/**
 * Batch Operation Callback
 *
 * @param string $env_id
 *   The machine name of the environment.
 * @param $total_limit
 *   The total number of items to index across all batches
 * @param array $context
 *
 * @return false
 *   return false when an exception was caught
 *
 * @throws Exception
 *   When solr gives an error, throw an exception that solr is not available
 */
function dlts_viewer_solr_index_photos() {
  module_load_include('inc', 'apachesolr', 'apachesolr.index');
  $id = apachesolr_default_environment();
  try {
    // Get the $solr object
    $solr = apachesolr_get_solr($id);
    // If there is no server available, don't continue.
    if (!$solr->ping()) {
      throw new Exception(t('No Solr instance available during indexing.'));
    }


    $docs = [78242, 79159];

    foreach ($docs as $doc) {

      $entity = node_load($doc);

      $documents = apachesolr_convert_entity_to_documents($entity, 'node', $env_id);
      
      $indexed = $solr->addDocuments($documents);
  
      print_r($indexed);
    }

    $entity = node_load('78095');

    $documents = apachesolr_convert_entity_to_documents($entity, 'node', $env_id);    

    $indexed = $solr->addDocuments($documents);

    print_r($indexed);

    $entity = node_load('27398');

    $documents = apachesolr_convert_entity_to_documents($entity, 'node', $env_id);    

    $indexed = $solr->addDocuments($documents);

    print_r($indexed);    

  }
  catch (Exception $e) {
    apachesolr_log_exception($env_id, $e);
    return FALSE;
  }
}
