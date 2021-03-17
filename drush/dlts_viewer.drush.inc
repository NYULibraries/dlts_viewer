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
  $items = array();

  $items['import-photo'] = array(
    'callback' => 'dlts_viewer_import_photo',
    'description' => dt('Import photo from JSON document.'),
    'options' => array(
      'source' => dt('JSON document filepath.'),
      'file' => dt('list of JSON files.'),
    ),
  );

  $items['import-map'] = array(
    'callback' => 'dlts_viewer_import_map',
    'description' => dt('Import map from a JSON document.'),
    'options' => array(
      'source' => dt('JSON document filepath.'),
    ),
  );

  $items['import-book'] = array(
    'callback' => 'dlts_viewer_import_book',
    'description' => dt('Import book from a JSON document.'),
    'options' => array(
      'source' => dt('JSON document filepath.'),
      'pages' => dt('Create pages.'),
      'legacy' => dt('Create book using legacy JSON documents.'),
    ),
  );

  $items['import-free-queue'] = array(
    'callback' => 'dlts_viewer_free_json_documents_queue',
    'description' => dt('Import book from a git repository'),
    'options' => array(
      'pages' => dt('Create pages.'),
    ),
  );

  $items['init-pdf-filesize'] = array(
    'callback' => 'dlts_viewer_drush_init_pdf_filesize',
    'description' => dt('Init PDF filesize'),
  );

  $items['update-pdf-filesize'] = array(
    'callback' => 'dlts_viewer_drush_update_pdf_filesize',
    'description' => dt('Update PDF filesize'),
  );

  $items['update-book-topic'] = array(
    'callback' => 'dlts_viewer_update_book_topic',
    'description' => dt('Update book topic from call number'),
  );

  $items['reset-pdf-filesize-table'] = array(
    'callback' => 'dlts_viewer_drush_reset_pdf_filesize_table',
    'description' => dt('Reset PDF filesize'),
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

  $items['index-node-by-identifier'] = array(
    'callback' => 'dlts_viewer_drush_index_node',
    'description' => dt('Index node by identifier'),
    'options' => array(
      'identifier' => dt('Node identifier'),
    ),
  );

  $items['create-photo-object'] = array(
    'callback' => 'dlts_viewer_create_photo_object',
    'description' => dt('Create photo object'),
  );

  $items['create-book-object'] = array(
    'callback' => 'dlts_viewer_create_book_object',
    'description' => dt('Create book bject'),
  );

  $items['list-resource-by-type'] = array(
    'callback' => 'dlts_viewer_drush_list_resource_by_type',
    'description' => dt('List resource pages'),
    'options' => array(
      'type' => dt('Resource type'),
    ),
  );

  $items['update-resource-pages'] = array(
    'callback' => 'dlts_viewer_drush_update_resource_pages',
    'description' => dt('Update resource pages'),
    'options' => array(
      'identifier' => dt('Resource identifier'),
    ),
  );

  $items['generate-resource-record'] = array(
    'callback' => 'dlts_viewer_drush_generate_resource_record',
    'description' => dt('Update resource pages'),
    'options' => array(
      'type' => dt('Resource type'),
    ),
  );

  /*
   * https://jira.nyu.edu/jira/browse/DLPAS-274
   * https://jira.nyu.edu/jira/secure/attachment/41481/se-list.txt
   */
  $items['ticket-dlpas-274'] = array(
    'callback' => 'dlts_viewer_drush_ticket_dlpas_274',
    'description' => dt('Make searchable the PDFs for The Fight Against War and Fascism.'),
  );

  /*
   * https://jira.nyu.edu/jira/browse/DLTSBOOKS-292
   * https://jira.nyu.edu/jira/secure/attachment/41769/se-list.txt
   */
  $items['ticket-dltsbooks-292'] = array(
    'callback' => 'dlts_viewer_drush_ticket_dltsbooks_292',
    'description' => dt('Update PDF with missing filesize data.'),
  );

  /*
   * https://jira.nyu.edu/jira/browse/DLTSBOOKS-292
   * https://jira.nyu.edu/jira/secure/attachment/41769/se-list.txt
   */
  $items['apes-strong-together'] = array(
    'callback' => 'dlts_viewer_gme',
    'aliases' => ['gme'],
    'description' => dt('Diamonds hands'),
  );

  return $items;

}

/**
 * Publish migrated items.
 */
function dlts_viewer_drush_ticket_dltsbooks_292() {
  $dir = drupal_get_path('module', 'dlts_viewer') . '/datasource';
  $lines = file($dir . '/DLTSBOOKS-292-se-list.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $identifier) {
    $contents = file_get_contents($dir . '/dlts_viewer_content/books/' . htmlspecialchars($identifier) . '.en.json');
    $data = json_decode($contents);
    foreach ($data->metadata->pdfs->value as $key => $pdf) {
      if ($pdf->type == 'hi') {
        $data->metadata->pdfs->value[$key]->label = 'High-resolution';
      }
      if ($pdf->type == 'lo') {
        $data->metadata->pdfs->value[$key]->label = 'Low-resolution';
      }
      $data->metadata->pdfs->value[$key]->searchable = TRUE;
    }
    $nid = nid_by_identifier($identifier, 'en');
    if ($nid) {
      $node = node_load($nid);
      $wrapper = entity_metadata_wrapper('node', $node);
      $update = [];
      foreach ($data->metadata->pdfs->value as $value) {
        $update[] = array(
          'uri' => $value->uri,
          'label' => $value->label,
          'data' => serialize(
            array(
              'label' => $value->label,
              'uri' => $value->uri,
              'filesize' => $value->size,
              'searchable' => (isset($value->searchable) && $value->searchable) ? $value->searchable : FALSE,
            )
          ),
        );
      }
      $wrapper->field_pdf_file->set($update);
      $wrapper->save();
      node_save($node);
    }
    drush_log(drupal_get_path_alias('node/' . $nid, 'en'), 'ok');
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

/**
 * FAWF Collection: make PDFs searchable.
 */
function dlts_viewer_drush_ticket_dlpas_274() {
  $dir = drupal_get_path('module', 'dlts_viewer') . '/datasource';
  $lines = file($dir . '/DLPAS-274-se-list.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $identifier) {
    $contents = file_get_contents($dir . '/dlts_viewer_content/books/' . htmlspecialchars($identifier) . '.en.json');
    $data = json_decode($contents);
    foreach ($data->metadata->pdfs->value as $key => $pdf) {
      if ($pdf->type == 'hi') {
        $data->metadata->pdfs->value[$key]->label = 'High resolution';
      }
      if ($pdf->type == 'lo') {
        $data->metadata->pdfs->value[$key]->label = 'Low resolution';
      }
      $data->metadata->pdfs->value[$key]->searchable = TRUE;
    }
    $nid = nid_by_identifier($identifier, 'en');

    if ($nid) {
      $node = node_load($nid);
      $wrapper = entity_metadata_wrapper('node', $node);
      $update = [];
      foreach ($data->metadata->pdfs->value as $value) {
        $update[] = array(
          'uri' => $value->uri,
          'label' => $value->label,
          'data' => serialize(
            array(
              'label' => $value->label,
              'uri' => $value->uri,
              'filesize' => $value->filesize,
              'searchable' => (isset($value->searchable) && $value->searchable) ? $value->searchable : FALSE,
            )
          ),
        );
      }
      $wrapper->field_pdf_file->set($update);
      $wrapper->save();
      node_save($node);
    }
    drush_log(drupal_get_path_alias('node/' . $nid, 'en'), 'ok');
  }
}

/**
 * Update resource pages.
 */
function dlts_viewer_drush_update_resource_pages() {
  include_once __DIR__ . '/../inc/djatoka.inc';
  $type = 'node';
  $identifier = drush_get_option('identifier', NULL);
  $collection_name = 'dlts_books_page';
  $language = 'en';
  $nid = nid_by_identifier($identifier, $language);
  if ($nid) {
    $cursor = mongodb_collection($collection_name);
    $node = node_load($nid);
    $wrapper = entity_metadata_wrapper('node', $node);
    $count = $wrapper->field_sequence_count->value();
    $pages = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name);
    foreach ($pages as $page) {
      $uri = $page['uri'];
      $cm = $page['cm'];
      if (empty($cm['width']) || empty($cm['height'])) {
        $metadata = dlts_viewer_djatoka_request($cm);
        $page['cm']['width'] = $metadata['width'];
        $page['cm']['height'] = $metadata['height'];
        $page['cm']['dwtLevels'] = $metadata['dwtLevels'];
        $page['cm']['levels'] = $metadata['levels'];
        $page['cm']['compositingLayerCount'] = $metadata['compositingLayerCount'];
        if (dlts_viewer_mongodb_update_sequence($page, $collection_name)) {
          $realPageNumber = $page['realPageNumber'];
          drush_log("Sequence $realPageNumber of $count part resource $identifier was updated.", 'ok');
        }
      }
    }
  }
}

/**
 * List resource pages.
 */
function dlts_viewer_drush_list_resource_by_type() {
  $type = 'node';
  $collection_name = 'dlts_books_page';
  $bundle = drush_get_option('type', NULL);
  $results = db_query("SELECT * FROM dlts_viewer_resource WHERE proceed = 0 LIMIT 1")->fetchAll();
  foreach ($results as $result) {
    if ($result->nid) {
      $cursor = mongodb_collection($collection_name);
      $node = node_load($result->nid);
      $wrapper = entity_metadata_wrapper('node', $node);
      $identifier = $wrapper->field_identifier->value();
      $count = $wrapper->field_sequence_count->value();
      $field_handle = $wrapper->field_handle->value();
      $parsed_url = parse_url($field_handle['url']);
      $noid = str_replace('/2333.1/', '', $parsed_url['path']);
      $pages = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name);
      $error = FALSE;
      foreach ($pages as $page) {
        $cm = $page['cm'];
        if (empty($cm['width']) || empty($cm['height'])) {
          $realPageNumber = $page['realPageNumber'];
          $request_url = "http://dev-sites.dlib.nyu.edu/viewer/api/image/books/$identifier/$realPageNumber";
          $response = drupal_http_request($request_url);
          if ($response->code == '200' && isset($response->data)) {
            $data = json_decode($response->data);
            $page['cm']['width'] = $data->width;
            $page['cm']['height'] = $data->height;
            if (dlts_viewer_mongodb_update_sequence($page, $collection_name)) {
              drush_log("Sequence $realPageNumber of $count part resource $identifier was updated.", 'ok');
            }
          }
        }
      }
      if (!$error) {
        db_update('dlts_viewer_resource')
          ->fields(array(
            'identifier' => $identifier,
            'noid' => $noid,
            'proceed' => 1,
          )
        )->condition('nid', $result->nid, '=')->execute();
      }
    }
  }
}

/**
 * Generate resource record.
 */
function dlts_viewer_drush_generate_resource_record() {
  $type = 'node';
  $bundle = drush_get_option('type', NULL);
  $content_type = dlts_type_load($bundle);
  switch ($content_type) {
    case 'photos':
      $nids = dlts_viewer_list_photos();
      break;

    case 'books':
      $nids = dlts_viewer_list_books();
      break;

    case 'maps':
      $nids = dlts_viewer_list_maps();
      break;
  }
  foreach ($nids as $nid) {
    $nid = db_insert('dlts_viewer_resource')->fields([
      'nid' => $nid,
      'proceed' => 0,
    ])->execute();
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
 * List pdfs associated with node.
 */
function dlts_viewer_list_nodes_pdf() {
  $query = db_query("SELECT * FROM {dlts_viewer_pdf_node_map} WHERE status = 0 LIMIT 1");
  if ($query->rowCount() > 0) {
    return $query->fetchAll();
  }
  return FALSE;
}

/**
 * Helper function used to update PDF table.
 *
 * @todo Remove
 */
function dlts_viewer_drush_reset_pdf_filesize_table() {
  db_query("DELETE FROM dlts_viewer_pdf_node_map WHERE status <> 100");
  foreach (dlts_viewer_list_books() as $nid) {
    db_insert('dlts_viewer_pdf_node_map')->fields(array('nid' => $nid))->execute();
  }
}

/**
 * Helper function used to update PDF table.
 *
 * @todo Remove
 */
function dlts_viewer_drush_init_pdf_filesize() {
  $table = 'dlts_viewer_pdf_node_map';
  if (!db_table_exists($table)) {
    db_create_table(
      $table,
      array(
        'description' => 'Table map to save nodes that need to be update per ticket DLTSACO-771.',
        'fields' => array(
          'nid' => array(
            'type' => 'int',
            'unsigned' => TRUE,
            'not null' => TRUE,
          ),
          'status' => array(
            'type' => 'int',
            'unsigned' => TRUE,
            'not null' => TRUE,
            'default' => '0',
          ),
        ),
      )
    );
  }

  foreach (dlts_viewer_list_books() as $nid) {
    db_insert('dlts_viewer_pdf_node_map')->fields(array('nid' => $nid))->execute();
  }

}

/**
 * Helper function used to update PDF.
 *
 * @todo Remove
 */
function dlts_viewer_drush_update_pdf_node($nodes, $edit) {
  global $base_url;
  $en_nid = $nodes[0]->nid;
  foreach ($nodes as $node) {
    $url = url("$base_url/node/$node->nid");
    drush_log($url . ' - ' . $node->language . ' - ' . $node->title, 'ok');
    try {
      $wrapper = entity_metadata_wrapper('node', $node);
      $wrapper->field_pdf_file->set($edit);
      $wrapper->save();
    }
    catch (Exception $e) {
      drush_log('Caught exception: ' . $e->getMessage(), 'error');
    }
  }
  db_merge('dlts_viewer_pdf_node_map')->key(array('nid' => $en_nid))->fields(array('status' => 1))->execute();
}

/**
 * Helper function used to update PDF filesize.
 *
 * @todo Remove
 */
function dlts_viewer_drush_update_pdf_filesize() {
  // Flag to not update node since we don't have the filesize information.
  $skip = FALSE;
  $results = dlts_viewer_list_nodes_pdf();
  if (!$results) {
    exit(1);
  }
  foreach ($results as $result) {
    $nodes = array();
    $entity = node_load($result->nid);
    $wrapper = entity_metadata_wrapper('node', $entity);
    $items = $wrapper->field_pdf_file->value();
    $edit = array();
    $ar_nid = book_nid($wrapper->field_identifier->value(), 'ar');
    $nodes[] = $entity;
    if ($ar_nid) {
      $nodes[] = node_load($ar_nid);
    }
    foreach ($items as $item) {
      $data = unserialize($item['data']);
      $data['filesize'] = field_fileserver_get_pdf_filesize($data);
      if ((int) $data['filesize'] < 1) {
        $skip = TRUE;
      }
      $item['uri'] = str_replace('fileserver', 'pdfserver', $item['uri']);
      $data['uri'] = $item['uri'];
      $item['data'] = serialize($data);
      $edit[] = $item;
    }
    if (!$skip) {
      dlts_viewer_drush_update_pdf_node($nodes, $edit);
    }
    else {
      db_merge('dlts_viewer_pdf_node_map')->key(array('nid' => $result->nid))->fields(array('status' => 2))->execute();
    }
  }
}

/**
 * Helper function to import photos from CLI.
 */
function dlts_viewer_import_photo($source = NULL) {
  include_once __DIR__ . '/inc/common.inc';
  include_once __DIR__ . '/inc/datasource.inc';
  include_once __DIR__ . '/inc/create.inc';
  if (!$source) {
    $source = drush_get_option('source', NULL);
    if (!$source) {
      drush_log('No source to import ', 'error');
      return;
    }
  }
  $file = drush_get_option('file');
  if (!empty($file) && (!file_exists($file))) {
    drush_log("file option: $file is specified and must exist", "error");
    return;
  }
  if (is_dir($source) && is_null($file)) {
    create_dlts_photo_set_from_json(file_scan_directory($source, '/(.*)\.json$/', array('recurse' => FALSE)));
  }
  elseif (is_dir($source) && (!empty($file))) {
    $handle = @fopen($file, "r") or exit("unable to open file ($file)");
    if ($handle) {
      while (($line = fgets($handle, 4096)) !== FALSE) {
        $fn = trim($line);
        $full_file = "$source/$fn";
        if (file_exists($full_file)) {
          create_dlts_photo_set_from_json(array((object) array('uri' => $full_file)));
        }
        elseif (!file_exists($full_file)) {
          drush_log("file listed in $file: $full_file, does not exist", "error");
        }
      }
    }
  }
  else {
    return create_dlts_photo_set_from_json(array((object) array('uri' => $source)));
  }
}

/**
 * Helper function to import maps from CLI.
 */
function dlts_viewer_import_map($source = NULL) {
  include_once __DIR__ . '/inc/common.inc';
  include_once __DIR__ . '/inc/datasource.inc';
  include_once __DIR__ . '/inc/create.inc';
  if (!$source) {
    $source = drush_get_option('source', NULL);
    if (!$source) {
      drush_log('No source to import ', 'error');
      return;
    }
  }
  if (is_dir($source)) {
    create_dlts_map_from_json(file_scan_directory($source, '/(.*)\.json$/', array('recurse' => FALSE)));
  }
  else {
    return create_dlts_map_from_json(array((object) array('uri' => $source)));
  }
}

/**
 * Helper function to import books from CLI.
 */
function dlts_viewer_import_book($source = NULL, $create_pages = FALSE) {
  include_once __DIR__ . '/inc/common.inc';
  include_once __DIR__ . '/inc/datasource.inc';
  include_once __DIR__ . '/inc/create.inc';
  if (drush_get_option('pages', FALSE)) {
    $create_pages = TRUE;
  }
  if (!$source) {
    $source = drush_get_option('source', NULL);
    if (!$source) {
      drush_log('No source to import', 'error');
      return;
    }
  }
  if (is_dir($source)) {
    create_dlts_book_from_json(file_scan_directory($source, '/(.*)\.en.json$/', array('recurse' => FALSE)), $create_pages);
    // @todo re-think.
    create_dlts_book_from_json(file_scan_directory($source, '/(.*)\.ar.json$/', array('recurse' => FALSE)), $create_pages);
  }
  else {
    return create_dlts_book_from_json(array((object) array('uri' => $source)), $create_pages);
  }
}

/**
 * Find books.
 *
 * @todo Why?
 */
function dlts_viewer_json_documents($language = 'en', $limit = 100) {
  $query = db_select('dlts_viewer_books_json', 'b')->fields('b', array(
    'document',
    'legacy',
    'identifier',
  ))->condition('proceed', '0')
    ->condition('language', $language)
    ->orderBy('created', 'DESC')
    ->range(0, $limit);
  return $query->execute()->fetchAll();
}

/**
 * Not used. Should not be use.
 *
 * @todo Remove.
 */
function dlts_viewer_free_json_documents_queue($limit = 100) {
  include_once __DIR__ . '/inc/common.inc';
  include_once __DIR__ . '/inc/datasource.inc';
  include_once__DIR__ . '/inc/create.inc';
  $language = 'en';
  $results = dlts_viewer_json_documents($language, $limit);
  if (count($results) < 1) {
    $language = 'ar';
    $results = dlts_viewer_json_documents($language, $limit);
    if (count($results) < 1) {
      return;
    }
  }
  foreach ($results as $key => $result) {
    if (file_exists($result->document)) {
      $created = create_dlts_book_from_json(array((object) array('uri' => $result->document)), FALSE, $result->legacy);
      if (isset($created[0])) {
        $node = $created[0];
        if ($node->nid) {
          $fields = array(
            'nid' => $node->nid,
            'proceed' => 1,
            'created' => $node->created,
            'changed' => $node->changed,
          );
          db_update('dlts_viewer_books_json')->fields($fields)->condition('identifier', $result->identifier, '=')->condition('language', $language, '=')->execute();
        }
        else {
          db_update('dlts_viewer_books_json')->fields(array('proceed' => 2))->condition('identifier', $result->identifier, '=')->condition('language', $language, '=')->execute();
        }
      }
      else {
        db_update('dlts_viewer_books_json')->fields(array('proceed' => 3))->condition('identifier', $result->identifier, '=')->condition('language', $language, '=')->execute();
      }
    }
    else {
      db_delete('dlts_viewer_books_json')->condition('identifier', $result->identifier)->condition('language', $language)->execute();
    }
  }
}

/**
 * Update book topics from callnumber.
 */
function dlts_viewer_update_book_topic($m = 0, $l = 300) {
  $result = db_query("select node.nid,tnid from node,field_data_field_collection where node.nid=field_data_field_collection.entity_id and field_collection_nid in (select nid from node where title='Arabic Collections Online') and type='dlts_book' LIMIT " . $m . "," . $l . ";");
  foreach ($result as $record) {
    $entity = node_load($record->nid);
    $ewrapper = entity_metadata_wrapper('node', $entity);
    $call_number = $ewrapper->field_call_number->value();
    $topic_letter = substr($call_number, 0, 1);
    $topic = $ewrapper->field_topic->value();
    if ($record->tnid == 0 || $record->tnid == $record->nid) {
      switch ($topic_letter) {
        case 'A':
          if (count($topic) == 0) {
            $topic[] = 'General Works';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'B':
          if (count($topic) == 0) {
            $topic[] = 'Philosophy. Psychology. Religion';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'C':
          if (count($topic) == 0) {
            $topic[] = 'Auxiliary Sciences of History';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'D':
          if (count($topic) == 0) {
            $topic[] = 'World History and History of Europe, Asia, Africa, Australia, New Zealand, etc.';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'E':
          if (count($topic) == 0) {
            $topic[] = 'History of the Americas';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'F':
          if (count($topic) == 0) {
            $topic[] = 'History of the Americas';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'G':
          if (count($topic) == 0) {
            $topic[] = 'Geography. Anthropology. Recreation';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'H':
          if (count($topic) == 0) {
            $topic[] = 'Social Sciences';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'J':
          if (count($topic) == 0) {
            $topic[] = 'Political Science';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'K':
          if (count($topic) == 0) {
            $topic[] = 'Law';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'L':
          if (count($topic) == 0) {
            $topic[] = 'Education';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'M':
          if (count($topic) == 0) {
            $topic[] = 'Music and Books on Music';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'N':
          if (count($topic) == 0) {
            $topic[] = 'Fine Arts';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'P':
          if (count($topic) == 0) {
            $topic[] = 'Language and Literature';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'Q':
          if (count($topic) == 0) {
            $topic[] = 'Science';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'R':
          if (count($topic) == 0) {
            $topic[] = 'Medicine';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'S':
          if (count($topic) == 0) {
            $topic[] = 'Agriculture';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'T':
          if (count($topic) == 0) {
            $topic[] = 'Technology';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'U':
          if (count($topic) == 0) {
            $topic[] = 'Military Science';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'V':
          if (count($topic) == 0) {
            $topic[] = 'Naval Science';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'Z':
          if (count($topic) == 0) {
            $topic[] = 'Bibliography. Library Science. Information Resources (General)';
            $ewrapper->field_topic->set($topic);
          }
          break;

      }
    }
    else {
      switch ($topic_letter) {
        case 'A':
          if (count($topic) == 0) {
            $topic[] = 'المعارف العامة';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'B':
          if (count($topic) == 0) {
            $topic[] = 'الفلسفة وعلم النفس والدين';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'C':
          if (count($topic) == 0) {
            $topic[] = 'العلوم الفرعية للتاريخ';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'D':
          if (count($topic) == 0) {
            $topic[] = 'تاريخ العالم وتاريخ أوروبا وآسيا وأفريقيا';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'E':
          if (count($topic) == 0) {
            $topic[] = 'تاريخ أمريكا';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'F':
          if (count($topic) == 0) {
            $topic[] = 'تاريخ أمريكا';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'G':
          if (count($topic) == 0) {
            $topic[] = 'الجغرافيا والأنثربولوجيا والترفيه';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'H':
          if (count($topic) == 0) {
            $topic[] = 'العلوم الاجتماعية';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'J':
          if (count($topic) == 0) {
            $topic[] = 'العلوم السياسية';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'K':
          if (count($topic) == 0) {
            $topic[] = 'القانون';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'L':
          if (count($topic) == 0) {
            $topic[] = 'التعليم';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'M':
          if (count($topic) == 0) {
            $topic[] = 'الموسيقى';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'N':
          if (count($topic) == 0) {
            $topic[] = 'الفنون الجميلة';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'P':
          if (count($topic) == 0) {
            $topic[] = 'اللغات والآداب';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'Q':
          if (count($topic) == 0) {
            $topic[] = 'العلوم';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'R':
          if (count($topic) == 0) {
            $topic[] = 'الطب';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'S':
          if (count($topic) == 0) {
            $topic[] = 'الزراعة';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'T':
          if (count($topic) == 0) {
            $topic[] = 'التكنولوجيا';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'U':
          if (count($topic) == 0) {
            $topic[] = 'العلوم العسكرية';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'V':
          if (count($topic) == 0) {
            $topic[] = 'العلوم البحرية';
            $ewrapper->field_topic->set($topic);
          }
          break;

        case 'Z':
          if (count($topic) == 0) {
            $topic[] = 'الببليوغرافيا ، وعلوم المكتبات ، والمعلومات العامة';
            $ewrapper->field_topic->set($topic);
          }
          break;

      }
    }
    $ewrapper->save();
  }
}

/**
 * Create Photo object.
 */
function dlts_viewer_create_photo_object() {
  include_once __DIR__ . '/../inc/endpoints.inc';
  // $data = file_get_contents(__DIR__ . '/../datasource/photo.json');
  // dlts_viewer_api_v1_dlts_photo_set_objects((array)json_decode($data));
}

/**
 * Create Book object.
 */
function dlts_viewer_create_book_object() {
  include_once __DIR__ . '/../inc/endpoints.inc';
  // princeton_aco003877
  // https://jira.nyu.edu/jira/browse/DLTSACO-806
  // $data = file_get_contents(__DIR__ . '/../datasource/princeton_aco003877.en.json');
  // dlts_viewer_api_v1_dlts_book_objects(json_decode($data));
  // $data = file_get_contents(__DIR__ . '/../datasource/princeton_aco003877.ar.json');
  // dlts_viewer_api_v1_dlts_book_objects(json_decode($data));
  // $data = file_get_contents(__DIR__ . '/../datasource/adl-persian-axample.en.json');
  // dlts_viewer_api_v1_dlts_book_objects(json_decode($data));
  // $data = file_get_contents(__DIR__ . '/../datasource/adl-persian-axample.fa.json');
  // dlts_viewer_api_v1_dlts_book_objects(json_decode($data));
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
 * Apes Strong Together.
 */
function dlts_viewer_gme() {
  drush_log('💎 ✋ 🚀', 'ok');
}
