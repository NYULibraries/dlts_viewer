<?php

/**
 * @file
 * Datasource.
 */

/**
 * Get nid by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function nid_by_identifier($identifier, $language = LANGUAGE_NONE) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * List of translation by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function dlts_viewer_list_translation($identifier) {
  $langs = array();
  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);
  $nodes = node_load_multiple($nids);
  foreach ($nodes as $node) {
    $langs[$node->language] = "node/$node->nid";
  }
  return $langs;
}

/**
 * Get translation by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function dlts_viewer_get_translations_nid_by_identifier($identifier) {
  $keys = array();
  $query = new EntityFieldQuery();
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
  }
  return $keys;
}

/**
 * List of maps.
 *
 * @todo Use range query.
 */
function dlts_viewer_list_map() {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_map')
    ->propertyCondition('status', 1)
    ->addMetaData('account', user_load(0))
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  return array_keys($result['node']);
}

/**
 * List of photos.
 *
 * @todo Use range query.
 */
function dlts_viewer_list_photos() {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_photo_set')
    ->propertyCondition('status', 1)
    ->addMetaData('account', user_load(0))
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  return array_keys($result['node']);
}

/**
 * List of books.
 */
function dlts_viewer_list_books() {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('language', 'en')
    ->propertyCondition('status', 1)
    ->addMetaData('account', user_load(0))
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  return array_keys($result['node']);
}

/**
 * Get multivolume book by node id.
 *
 * @param string $nid
 *   Node id.
 */
function dlts_viewer_multivolume_book($nid) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol_book')
    ->fieldCondition('field_book', 'nid', $nid, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return node_load_multiple($keys);
}

/**
 * Test multivolume.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_is_multivolume_book($entity) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol_book')
    ->fieldCondition('field_book', 'nid', array($entity->nid))
    ->execute();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    $nid = array_pop($keys);
    return node_load($nid);
  }
  return FALSE;
}

/**
 * Test is series book.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_is_series_book(&$entity) {
  $is_part_of = array();
  $entity->isSeriesBook = FALSE;
  $entity_type = 'node';
  $bundle = 'dlts_series_book';
  $book_nid = $entity->nid;
  $book_wrapper = entity_metadata_wrapper($entity_type, $entity);
  $book_long_title = $book_wrapper->field_title->value();
  $collections = $book_wrapper->field_collection->value();
  foreach ($collections as $key => $collection) {
    $collection_wrapper = entity_metadata_wrapper($entity_type, $collection);
    $collection_label = $collection_wrapper->field_name->value();
    $collection_code = $collection_wrapper->field_code->value();
    $query = new EntityFieldQuery();
    $result = $query
      ->entityCondition('entity_type', $entity_type)
      ->entityCondition('bundle', $bundle)
      ->fieldCondition('field_book', 'nid', $book_nid, '=')
      ->fieldCondition('field_collection', 'nid', array($collection->nid))
      ->execute();
    if (!empty($result['node'])) {
      $entity->isSeriesBook = TRUE;
      $nids = array_keys($result['node']);
      foreach ($nids as $nid) {
        $volume_title = $book_long_title;
        $series_book_node = node_load($nid);
        $series_book_wrapper = entity_metadata_wrapper('node', $series_book_node);
        if ($series_book_wrapper->getIdentifier()) {
          $field_series = $series_book_wrapper->field_series->value();
          /*
           * Check that the value still valid.
           * A node can be deleted without using the proper Drupal API
           * and this will not fire up the cleanup hooks
           */
          if ($field_series) {
            $volume_number = $series_book_wrapper->field_volume_number->value();
            $volume_number_str = $series_book_wrapper->field_volume_number_str->value();
            if (!empty($volume_number_str)) {
              $volume_title = $book_long_title . ' ' . $volume_number_str;
            }
            elseif (!empty($volume_number)) {
              $volume_title = $book_long_title . ' ' . $volume_number;
            }
            $series_wrapper = entity_metadata_wrapper($entity_type, $field_series);
            $series_identifier = $series_wrapper->field_identifier->value();
            $is_part_of[] = array(
              'series_identifier' => $series_identifier,
              'series' => $series_book_node->title,
              'volume_label' => $volume_title,
              'volume_number' => $volume_number,
              'volume_number_str' => $volume_number_str,
              'collection_label' => $collection_label,
              'collection_code' => $collection_code,
            );
          }
        }
      }
    }
  }
  $entity->seriesBook = $is_part_of;
}

/**
 * Get series book by node id.
 *
 * @param string $nid
 *   Node id.
 */
function dlts_viewer_series_book($nid) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_series_book')
    ->fieldCondition('field_book', 'nid', $nid, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return node_load_multiple($keys);
}

/**
 * Get book id by identifier.
 *
 * @param string $identifier
 *   Node identifier.
 * @param string $language
 *   Node language.
 */
function book_nid($identifier, $language = LANGUAGE_NONE) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get photoset id by identifier.
 *
 * @param string $identifier
 *   Node identifier.
 * @param string $language
 *   Node language.
 */
function photoset_nid($identifier, $language = LANGUAGE_NONE) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_photo_set')
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get series id by identifier.
 *
 * @param string $identifier
 *   Node identifier.
 */
function series_nid($identifier) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_series')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get series book id by identifier.
 *
 * @param string $identifier
 *   Node identifier.
 */
function series_book_nid($identifier) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_series_book')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get nodes by type.
 *
 * @param string $type
 *   Node type.
 */
function find_nodes($type) {
  // Find all.
  $query = db_query("SELECT DISTINCT nid FROM {node} WHERE type = :type", array('type' => $type));
  // Return nids.
  return $query->fetchAll();
}

/**
 * Get stitched page by identifier.
 *
 * @param string $identifier
 *   Identifier.
 * @param string $left
 *   Left value.
 * @param string $right
 *   Right value.
 */
function stitched_page_nid($identifier, $left, $right) {
  $book_nid = book_nid($identifier);
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book_stitched_page')
    ->fieldCondition('field_sequence_number_left', 'value', $left, '=')
    ->fieldCondition('field_sequence_number_right', 'value', $right, '=')
    ->fieldCondition('field_book', 'nid', $book_nid, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get collection by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function collection_nid($identifier) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get multivol by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function multivol_nid($identifier) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get multivol nid by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function multivol_book_nid($identifier, $volume_number) {
  // All multivolume books have the same external identifier as the
  // multivolume itself. We use volume number to insure uniqueness.
  $query = new EntityFieldQuery();
  $multivol_nid = multivol_nid($identifier);
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol_book')
    ->fieldCondition('field_multivol', 'nid', $multivol_nid, '=')
    ->fieldCondition('field_volume_number', 'value', $volume_number, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get partner nid by identifier.
 *
 * @param string $identifier
 *   Identifier.
 */
function partner_nid($identifier) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_partner')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get map nid by identifier.
 *
 * @param string $identifier
 *   Identifier.
 * @param string $language
 *   Node language.
 */
function map_nid($identifier, $language = LANGUAGE_NONE) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_map')
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  $keys = array_keys($result['node']);
  return (int) $keys[0];
}

/**
 * Get partner nid by code.
 *
 * @param string $code
 *   Code.
 */
function dlts_viewer_partner_nid_by_code($code) {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_partner')
    ->fieldCondition('field_code', 'value', $code, '=')
    ->addMetaData('account', user_load(0))
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  return array_keys($result['node']);
}

/**
 * Get collection nid by code.
 *
 * @param string $code
 *   Code.
 * @param string $partnerCode
 *   Optional partner code.
 */
function dlts_viewer_collection_nids_by_code($code, $partnerCode = NULL) {
  $partnerNid = dlts_viewer_partner_nid_by_code($partnerCode);
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->fieldCondition('field_code', 'value', $code, '=');
  if ($partnerCode) {
    $query->fieldCondition('field_partner', 'nid', $partnerNid, '=');
  }
  $query->addMetaData('account', user_load(0));
  $result = $query->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  else {
    return array_keys($result['node']);
  }
}

/**
 * Undocumented function.
 *
 * @todo document function
 */
function dlts_viewer_books_is_partof_multivolume($nid) {
  $query = new EntityFieldQuery();
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol_book')
    ->fieldCondition('field_multivol', 'nid', $nid, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  else {
    $keys = array_keys($result['node']);
    return node_load_multiple($keys);
  }
}

/**
 * Undocumented function.
 *
 * @todo document function
 */
function dlts_viewer_books_is_partof_series($nid) {
  $query = new EntityFieldQuery();
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_series_book')
    ->fieldCondition('field_series', 'nid', $nid, '=')
    ->execute();
  if (empty($result['node'])) {
    return FALSE;
  }
  else {
    $keys = array_keys($result['node']);
    return node_load_multiple($keys);
  }
}

/**
 * Undocumented function.
 *
 * @todo document function
 */
function dlts_viewer_subject_tid($subject, $vid) {
  $global_subjects = &drupal_static('global_subjects');
  if (empty($global_subjects)) {
    $global_subjects = array();
  }
  if (!empty($subject)) {
    $this_subject = trim(preg_replace('/\s\s+/', ' ', str_replace("\n", " ", $subject)));
    if (!array_key_exists($this_subject, $global_subjects)) {
      $term = taxonomy_get_term_by_name($this_subject);
      if ($term) {
        $this_term = array_pop($term);
        $tid = $this_term->tid;
      }
      else {
        $tid = create_taxonomy_term($this_subject, $vid);
      }
      $global_subjects[$this_subject] = $tid;
    }
  }
  return $global_subjects;
}

/**
 * Undocumented function.
 *
 * @todo document function
 */
function dlts_viewer_subject_vocabulary_vid() {
  $global_vocabulary_vid = &drupal_static('global_vocabulary_vid');
  if (empty($global_vocabulary_vid)) {
    $global_vocabulary_vid = taxonomy_vocabulary_machine_name_load('subjects')->vid;
  }
  return $global_vocabulary_vid;
}

/**
 * List of created %d-%m-%Y, usuful to select batch of nodes that were publish in a specific day.
 */
function dlts_viewer_batch_days($collectionCode = NULL, $status = 1, $requestedLang = 'en') {
  $dates = array();
  $query = "SELECT DISTINCT DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') created FROM node ";
  if ($collectionCode) {
    $query .= "
      LEFT JOIN field_data_field_collection collection
        ON node.nid = collection.entity_id
      INNER JOIN field_data_field_code code
        ON collection.field_collection_nid = code.entity_id
        AND code.field_code_value = :collection_code ";
  }
  $query .= "WHERE node.language = :language AND node.status = :status ORDER BY node.created DESC";
  $args = array(
    ':language' => $requestedLang,
    ':status' => $status,
  );
  if ($collectionCode) {
    $args[':collection_code'] = $collectionCode;
  }
  $result = db_query($query, $args)->fetchAll();
  foreach ($result as $date) {
    $dates[] = $date->created;
  }
  return $dates;
}

/**
 * Undocumented function.
 *
 * @todo document function
 */
function dlts_viewer_collections($collections) {
  $value = array();
  foreach ($collections as $collection) {
    $collection_wrapper = entity_metadata_wrapper('node', $collection);
    $col_partner = $collection_wrapper->field_partner->value();
    $partner_wrapper = entity_metadata_wrapper('node', $col_partner[0]);
    $value[] = array(
      'title' => $collection_wrapper->title->value(),
      'identifier' => $collection_wrapper->field_identifier->value(),
      'code' => $collection_wrapper->field_code->value(),
      'name' => $collection_wrapper->field_name->value(),
      'type' => 'dlts_collection',
      'language' => 'und',
      'partner' => array(
        'title' => $partner_wrapper->title->value(),
        'type' => 'dlts_partner',
        'language' => 'und',
        'identifier' => $partner_wrapper->field_identifier->value(),
        'code' => $partner_wrapper->field_code->value(),
        'name' => $partner_wrapper->field_name->value(),
      ),
    );
  }
  return $value;
}

/**
 * Undocumented function.
 *
 * @todo document function
 */
function dlts_viewer_multivolume_book_by_book_nid($entity) {
  $volumes = array();
  // Only with books.
  if ($entity->type == 'dlts_book') {
    $query = new EntityFieldQuery();
    $keys = array();
    $result = $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', 'dlts_multivol_book')
      ->fieldCondition('field_book', 'nid', array($entity->nid))
      ->execute();
    if (!empty($result['node'])) {
      $keys = array_keys($result['node']);
      $nodes = node_load_multiple($keys);
      if ($nodes) {
        foreach ($nodes as $node) {
          $wrapper = entity_metadata_wrapper('node', $node);
          $multivol = $wrapper->field_multivol->value();
          $volume_number = $wrapper->field_volume_number->value();
          $volume_number_str = $wrapper->field_volume_number_str->value();
          $volumes[] = array(
            'multivol' => $multivol->nid,
            'volume_number' => $volume_number,
            'volume_number_str' => $volume_number_str,
          );
        }
      }
    }
  }
  return $volumes;
}
