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

  $items['solr-index-photos'] = array(
    'callback' => 'dlts_viewer_solr_index_photos',
    'description' => dt('Index photos entities .'),
    'options' => array(
      'limit' => dt('Limit.'),
    ),
  );

  $items['list-translation'] = array(
    'callback' => 'dlts_viewer_drush_list_translation',
    'description' => dt('List translation'),
  );

  $items['delete-book-by-identifier'] = array(
    'callback' => 'dlts_viewer_delete_book_by_identifier',
    'description' => dt('Delete book by identifier'),
    'options' => array(
      'identifier' => dt('Book identifier'),
    ),
  );

  $items['update-handle'] = array(
    'callback' => 'dlts_viewer_update_handle',
    'description' => dt('Update handle'),
    'options' => array(
      'identifier' => dt('Book identifier'),
      'handle' => dt('Book handle'),
    ),
  );

  $items['index-node-by-identifier'] = [
    'callback' => 'dlts_viewer_drush_index_node',
    'description' => dt('Index node by identifier'),
    'options' => [
      'identifier' => dt('Node identifier'),
    ],
  ];

  $items['update-resource-pages'] = [
    'callback' => 'dlts_viewer_drush_update_resource_pages',
    'description' => dt('Update resource pages'),
    'options' => [
      'identifier' => dt('Resource identifier'),
      'log' => dt('Display opt logs'),
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

/**
 * Update resource pages.
 *  ./vendor/bin/drush update-resource-pages --identifier=tamwag_fawf000056
 */
function dlts_viewer_drush_update_resource_pages() {
  
  global $base_url;

  $identifier = drush_get_option('identifier', FALSE);

  $log = drush_get_option('log', TRUE);

  $start = microtime(true);

  // MongoDB records limit.
  $per_page = (int) 1000;

  // MongoDB pagination.
  $page = 0;

  // Collection to search
  $collection_name = 'dlts_books_page';

  // IIIF Image Server
  $image_server = variable_get('dlts_image_server', 'https://image1.dlib.nyu.edu:8183');

  //
  $isPartOf = '';

  // Entity type.
  $type = 'node';

  if ($log === 'false') {
    $log = FALSE;
  } else {
    $log = TRUE;
  }
  if ($identifier) {
    $nid = nid_by_identifier($identifier);
    if ($nid) {
      $node = node_load($nid);
      $wrapper = entity_metadata_wrapper('node', $node);
      $cursor = mongodb_collection($collection_name)->find([ 'isPartOf' => $identifier, 'cm.width' => '' ]);
      $page = (int) $page;
      $cursor->limit($per_page);
      $records = $cursor->skip($per_page * $page);
      $count = $cursor->count();
      $i = 0;
      if ($count > 0) {
        $cursor->sort([ 'realPageNumber' => 1 ]);
        $handle = $wrapper->field_handle->value();
        $parsed_url = parse_url($handle['url']);
        $noid = str_replace('/2333.1/', '', $parsed_url['path']);
        foreach ($records as $doc) {
          $i++;
          $edit = $doc;
          if (isset($doc['cm']) && isset($doc['cm']['uri'])) {
            $uri = $doc['cm']['uri'];
            $realPageNumber = $doc['realPageNumber'];
            $image_id = urlencode(str_replace('fileserver://', '', $uri));    
            $response = drupal_http_request("$image_server/iiif/2/$image_id/info.json", [ 'method' => 'GET', 'timeout' => 15 ]);
            if ($response->code == '200' && isset($response->data)) {
              $data = drupal_json_decode($response->data);
              $width = $data['width'];
              $height = $data['height'];
              $edit['noid'] = $noid;
              $edit['cm']['width'] = $width;
              $edit['cm']['height'] = $height;
              unset($edit['cm']['levels']);
              unset($edit['cm']['dwtLevels']);
              unset($edit['cm']['compositingLayerCount']);
              unset($edit['cm']['timestamp']);            
              $update = dlts_viewer_mongodb_update_sequence($edit, $collection_name);
              if ($update) {
                if ($log) {
                  drush_log("Updating item $i of $count. Sequence $realPageNumber of resource $identifier.", 'ok');
                }
              }
            }
          }
        }      
      }
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
