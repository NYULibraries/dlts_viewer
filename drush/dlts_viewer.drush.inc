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

  $items['list-translation'] = [
    'callback' => 'dlts_viewer_drush_list_translation',
    'description' => dt('List translation'),
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
    'description' => dt('Returns list of all resources in the table dlts_viewer_resources')
  ];

  $items['resources-list-cleanup'] = [
    'callback' => 'dlts_viewer_drush_resources_list_cleanup',
    'description' => dt('Delete all records from the resources list')
  ];

  // $ ./vendor/bin/drush total-resources-to-update
  $items['total-resources-to-update'] = [
    'callback' => 'dlts_viewer_drush_total_resources_to_update',
    'description' => dt('Returns total of resources to update')
  ];

  // $ ./vendor/bin/drush resources-to-update
  $items['resources-to-update'] = [
    'callback' => 'dlts_viewer_drush_resources_to_update',
    'description' => dt('Returns resource to update')
  ];

  // $ ./vendor/bin/drush update-resource-pages
  $items['update-resource-pages'] = [
    'callback' => 'dlts_viewer_drush_update_resource_pages',
    'description' => dt('Update resource pages'),
    'options' => [
      'identifier' => dt('Resource identifier'),
      'log' => dt('Display opt logs'),
      'limit' => dt('Limit'),
    ],
  ];

  $items['viewer-test'] = [
    'callback' => 'dlts_viewer_drush_viewer_test',
    'description' => dt('Run test while developing.')
  ];

  $items['total-resources'] = [
    'callback' => 'dlts_viewer_drush_total_resources',
    'description' => dt('Pick one identifier'),
  ];

  $items['pick-one-identifier'] = [
    'callback' => 'dlts_viewer_pick_one_identifier',
    'description' => dt('Pick one identifier'),
  ];

  $items['delete-by-identifier'] = [
    'callback' => 'dlts_viewer_delete_by_identifier',
    'description' => dt('Delete by identifier'),
    'options' => [
      'identifier' => dt('Identifier'),
    ],
  ];

  // drush create-table-resources
  $items['create-table-resources'] = [
    'callback' => 'dlts_viewer_drush_create_table_resources',
    'description' => dt('Create table resources'),
  ];

  // drush create-table-epubs
  $items['create-table-epubs'] = [
    'callback' => 'dlts_viewer_drush_create_table_epubs',
    'description' => dt('Create table ePubs'),
  ];

  // drush add-epub --identifier=9780814705384 --user=[username]
  $items['add-epub'] = [
    'callback' => 'dlts_viewer_drush_add_epub',
    'description' => dt('Add ePub'),
    'options' => [
      'identifier' => dt('Identifier'),
    ],
  ];

  $items['jira-dlpas-370'] = [
    'callback' => 'dlts_viewer_drush_jira_dlpas_370',
    'description' => dt('Update Freedom magazine records.'),
  ];

  return $items;

}

function dlts_viewer_drush_jira_dlpas_370() {
  global $base_url;
  $records = drupal_http_request('https://sites.dlib.nyu.edu/viewer/api/v1/objects?collection=fdm&rows=500');
  $data = json_decode($records->data);
  foreach ($data->response->docs as $record) {
    $identifier = $record->identifier;
    $nid = $record->nid;
    $node = node_load($nid);
    $type = 'node';
    $wrapper = entity_metadata_wrapper($type, $node);
    $title = $wrapper->title->value();
    $wrapper->field_title->set(trim($title));
    $long_title = $wrapper->field_title->value();
    $wrapper->save();

    $indexer_table = apachesolr_get_indexer_table($type);

    db_merge($indexer_table)->key(
      [
        'entity_type' => $type,
        'entity_id' => $node->nid,
      ]
    )->insertFields(
      [
        'entity_type' => $type,
        'entity_id' => $node->nid,
        'bundle' => $wrapper->getBundle(),
        'status' => 1,
      ]
    )->fields([ 'changed' => REQUEST_TIME ])->execute();
    drush_log("Record $base_url/books/$identifier/1 - $long_title - Updated.", 'ok');
  }
}

function dlts_viewer_drush_create_table_resources() {
  $tablename = 'dlts_viewer_resource';
  if (!db_table_exists($tablename)) {
    $table = [
      'description' => 'Resource table',
      'fields' => [
        'nid' => [ 'type' => 'varchar', 'length' => 255, 'not null' => FALSE ],
        'noid' => [ 'type' => 'varchar', 'length' => 255, 'not null' => FALSE ],
        'identifier' => [ 'type' => 'varchar', 'length' => 255, 'not null' => FALSE ],
        'document' => [ 'type' => 'text' ],
        'proceed' => [ 'type' => 'int', 'not null' => TRUE, 'default' => 0 ],
      ]
    ];
    db_create_table($tablename, $table);
  }
}

function dlts_viewer_drush_create_table_epubs() {
  $tablename = 'dlts_viewer_epubs';
  if (!db_table_exists($tablename)) {
    $table = [
      'description' => 'ePubs table',
      'fields' => [
        'label' => [ 'type' => 'text' ],
        'identifier' => [ 'type' => 'varchar', 'length' => 13, 'not null' => TRUE ],
        'publisher' => [ 'type' => 'text' ],
        'status' => [ 'type' => 'int', 'not null' => TRUE, 'default' => 0 ],
        'lastModified' => [ 'type' => 'text' ],
        'data' => [ 'type' => 'text' ],
      ]
    ];
    db_create_table($tablename, $table);
  }
}

function dlts_viewer_drush_add_epub() {
  $tablename = 'dlts_viewer_epubs';
  if (db_table_exists($tablename)) {
    $identifier = drush_get_option('identifier', FALSE);
    if ($identifier && user_access('dlts create object')) {
      $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier', [ ':identifier' => $identifier ]);
      $record = $results->fetchObject();
      if ($record) {
        drush_log("ePub $record->label already published.", 'error');
      }
      else {
        $record = dlts_viewer_supafolio_book($identifier, true);
        if (isset($record->status) && $record->status === 'error') {
          drush_log("Supafolio API - Record with ISBN13 $identifier - " . $record->data['errors'][0]['message'], 'error');
        } else {
          if ($identifier === $record->isbn13) {
            $metadata = dlts_viewer_epubs_metadata_v0($record);
            db_insert('dlts_viewer_epubs')
              ->fields([
                'label' => $record->title,
                'identifier' => $identifier,
                'publisher' => str_replace(' ' ,'-', strtolower($metadata['publisher'])),
                'status' => 1,
                'lastModified' => date('Y-m-d'),
                'data' => ''
              ])
              ->execute();
              drush_log("Record created for ePub with ISBN13 $identifier.", 'ok');
          }
          else {
            drush_log("Supafolio API - No match found for ISBN13 $identifier.", 'error');
          }
        }
      }
    }
    else {
      drush_log('Action not allowed. User aregument must be provided.', 'error');
    }
  } else {
    dlts_viewer_drush_create_table_epubs();
    dlts_viewer_drush_add_epub();
  }
}

/**
 * Count documents.
 *  $ ./vendor/bin/drush total-resources
 */
function dlts_viewer_drush_total_resources() {
  $count_query = "SELECT DISTINCT COUNT(dlts_viewer_resource.nid) numFound FROM dlts_viewer_resource";
  $count = db_query($count_query)->fetchField();
  if (isset($count)) {
    echo $count;
  } else {
    echo 0;
  }
}

// $ ./vendor/bin/drush pick-one-identifier
function dlts_viewer_pick_one_identifier() {
  $record = db_query("SELECT identifier FROM dlts_viewer_resource")->fetchField();
  echo $record;
}

/**
 * Delete by identifier.
 * $ ./vendor/bin/drush delete-by-identifier --identifier=princeton_aco000150
 */
function dlts_viewer_delete_by_identifier() {
  $identifier = drush_get_option('identifier', NULL);
  $record = db_query("SELECT nid, document FROM dlts_viewer_resource WHERE identifier = '$identifier' LIMIT 1")->fetchAll();
  $type = $record[0]->document;
  if ($type == 'maps' || $type == 'photos') {
    $nid = $record[0]->nid;
    node_delete($nid);
    drush_log("Node $nid deleted.", 'success');
    db_query("DELETE FROM dlts_viewer_resource WHERE identifier = '$identifier'");
  } else {
    $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);
    if (count($nids) > 0) {
      drush_log("Deleting node by identifier $identifier.", 'ok');
      foreach ($nids as $nid) {
        node_delete($nid);
        drush_log("Node $nid deleted", 'success');
        db_query("DELETE FROM dlts_viewer_resource WHERE identifier = '$identifier'");
      }
    } else {
      drush_log("Node not found. Identifier $identifier ");
    }
  }
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

// ./vendor/bin/drush viewer-test
function dlts_viewer_drush_viewer_test() {
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

  $sql = '';
  $sql .= "SELECT";
  $sql .= " DISTINCT node.nid nid, identifier.field_identifier_value identifier, handle.field_handle_url handle";
  $sql .= " FROM node";
  $sql .= " LEFT JOIN field_data_field_identifier identifier";
  $sql .= " ON node.nid = identifier.entity_id ";
  $sql .= " LEFT JOIN field_data_field_handle handle ";
  $sql .= " ON node.nid = handle.entity_id ";
  $sql .= " WHERE node.type = '$types[$type]'";
  $sql .= " AND node.status = 1";
  $sql .= " AND (node.language = 'und' OR  node.language = 'en')";

  $_type = $types[$type];

  db_query("DELETE FROM dlts_viewer_resource WHERE document = '$type';");

  db_query("DELETE FROM dlts_viewer_resource WHERE document = '$_type';");

  $nodes = db_query($sql)->fetchAll();

  foreach ($nodes as $node) {
    $nid = $node->nid;
    $identifier = $node->identifier;
    $handlepathinfo = parse_url($node->handle);
    $handle = explode('/', $handlepathinfo['path']);
    $noid = trim($handle[2]);
    db_query("INSERT INTO dlts_viewer_resource (nid, noid, identifier, document, proceed) VALUES ('$nid', '$noid', '$identifier', '$type', '1')");
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
  $count_query = "SELECT DISTINCT COUNT(dlts_viewer_resource.nid) numFound FROM dlts_viewer_resource WHERE proceed = 0";
  $count = db_query($count_query)->fetchField();
  if (isset($count)) {
    echo $count;
  } else {
    echo 0;
  }
}

/**
 * Find resource to update.
 *  $ ./vendor/bin/drush resources-to-update
 */
function dlts_viewer_drush_resources_to_update() {
  return dlts_viewer_resources_to_update();
}

/**
 * Update resource pages.
 *  $ ./vendor/bin/drush update-resource-pages
 *  $ ./vendor/bin/drush update-resource-pages --identifier=princeton_aco000064
 */
function dlts_viewer_drush_update_resource_pages() {

  $log = drush_get_option('log', true);

  $identifier = drush_get_option('identifier', false);

  // MongoDB pagination.
  $page = 0;

  // MongoDB records limit.
  $per_page = (int) drush_get_option('limit', 500);

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
 * e.g., ./vendor/bin/drush index-node-by-identifier --identifier=princeton_aco000102
 */
function dlts_viewer_drush_index_node() {

  $type = 'node';

  $identifier = drush_get_option('identifier', NULL);

  if ($identifier) {
    $node = dlts_resource_load($identifier);

    $wrapper = entity_metadata_wrapper('node', $node);

    $indexer_table = apachesolr_get_indexer_table($type);

    db_merge($indexer_table)->key(
      [
        'entity_type' => $type,
        'entity_id' => $node->nid,
      ]
    )->insertFields(
      [
        'entity_type' => $type,
        'entity_id' => $node->nid,
        'bundle' => $wrapper->getBundle(),
        'status' => 1,
      ]
    )->fields([ 'changed' => REQUEST_TIME ])->execute();

  } else {
    drush_log('Error: Identifier is missing.', 'error');
  }
}

/**
 * List translation of a book query by identifier.
 */
function dlts_viewer_drush_list_translation() {
  $query = new EntityFieldQuery();
  $identifier = drush_get_option('identifier', NULL);
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  $langs = [];
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
