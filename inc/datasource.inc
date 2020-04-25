<?php

/**
 * @file
 * Datasource
 */

function dlts_viewer_list_books() {
	$query = new EntityFieldQuery;
	$result = $query
	->entityCondition('entity_type', 'node')
	->entityCondition('bundle', 'dlts_book')
	->propertyCondition('language', 'en')
	->propertyCondition('status', 1)
	->addMetaData('account', user_load(0))
	->execute();
	
	if (empty($result['node'])) return FALSE;
	return array_keys($result['node']);

}

function dlts_viewer_multivolume_book($nid) {
	$query = new EntityFieldQuery;
	$result = $query
	->entityCondition('entity_type', 'node')
	->entityCondition('bundle', 'dlts_multivol_book')
	->fieldCondition('field_book', 'nid', $nid, '=')
	->execute();
	if (empty($result['node'])) return FALSE;
	$keys = array_keys($result['node']);
	return node_load_multiple($keys);
}

function dlts_viewer_is_multivolume_book($entity) {
	$query = new EntityFieldQuery;
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

function dlts_viewer_is_series_book(&$entity) {
  
	$is_part_of = array();
	
	$entity->isSeriesBook = false;
	
	$entity_type = 'node';
	
	$bundle = 'dlts_series_book';
	
	$book_nid = $entity->nid;
	
	$book_entity = $entity;
	
	$book_wrapper = entity_metadata_wrapper($entity_type, $entity);
	
	$book_long_title = $book_wrapper->field_title->value();
	
	$collections = $book_wrapper->field_collection->value(); // multi-value field
	
	foreach ($collections as $key => $collection) {
		$collection_wrapper = entity_metadata_wrapper($entity_type, $collection);
		$collection_label = $collection_wrapper->field_name->value(); // single-value field
		$collection_code = $collection_wrapper->field_code->value(); // single-value field
		$query = new EntityFieldQuery;
		$result = $query
		  ->entityCondition('entity_type', $entity_type)
		  ->entityCondition('bundle', $bundle)
		  ->fieldCondition('field_book', 'nid', $book_nid, '=')
		  ->fieldCondition('field_collection', 'nid', array($collection->nid)) // multi-value field
		  ->execute();
		if (!empty($result['node'])) {
			$entity->isSeriesBook = true;
			$nids = array_keys($result['node']);
			foreach ($nids as $nid) {
				$title = $book_long_title;
				$series_book_node = node_load($nid);
				$series_book_wrapper = entity_metadata_wrapper($entity_type, $series_book_node);
				
				$series = $series_book_wrapper->field_series->value(); // single-value field
				
				$volume_number = $series_book_wrapper->field_volume_number->value(); // single-value field
				
				$volume_number_str = $series_book_wrapper->field_volume_number_str->value(); // single-value field
				
				if (!empty($volume_number_str)) {
					$title = $book_long_title . ' ' . $volume_number_str;
				}
				elseif (!empty($volume_number)) {
					$title = $book_long_title . ' ' . $volume_number;
				}
				
			  $series_wrapper = entity_metadata_wrapper($entity_type, $series);
			  
			  $series_identifier = $series_wrapper->field_identifier->value();
				
				$is_part_of[] = array(
				  'series_identifier' => $series_identifier,
				  'series' => $series->title,
					'volume_label' => $title,
					'volume_number' => $volume_number,
					'volume_number_str' => $volume_number_str,
					'collection_label' => $collection_label,
					'collection_code' => $collection_code,
				);
			}
		}
	}

	$entity->seriesBook = $is_part_of;

}

function dlts_viewer_series_book($nid) {
	$query = new EntityFieldQuery;
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

function book_nid($identifier, $language = LANGUAGE_NONE) {

	$query = new EntityFieldQuery;

  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();

  if (empty($result['node'])) return FALSE;

  $keys = array_keys($result['node']);

  return (int)$keys[0];
}

function series_nid($identifier) {
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_series')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
  return (int)$keys[0];
}

function series_book_nid($identifier) {
    $query = new EntityFieldQuery;
    $result = $query
        ->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', 'dlts_series_book')
        ->fieldCondition('field_identifier', 'value', $identifier, '=')
        ->execute();
    if (empty($result['node'])) return FALSE;
    $keys = array_keys($result['node']);
    return (int)$keys[0];
}

function find_nodes($type) {
  /** find all */
  $query = db_query("SELECT DISTINCT nid FROM {node} WHERE type = :type", array('type' => $type));
  /** return nids */
  return $query->fetchAll();
}

function stitched_page_nid($identifier, $left, $right) {
  $book_nid = book_nid($identifier);
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book_stitched_page')
    ->fieldCondition('field_sequence_number_left', 'value', $left, '=')
    ->fieldCondition('field_sequence_number_right', 'value', $right, '=')
    ->fieldCondition('field_book', 'nid', $book_nid, '=')
    ->execute();
  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
  return (int)$keys[0];
}

function collection_nid($identifier) {
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
  return (int)$keys[0];
}

function multivol_nid($identifier) {
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
  return (int)$keys[0];
}

// all multivolume books have the same external identifier
// as the multivolume itself. We use volume number to
// insure uniqueness
function multivol_book_nid($multivol_identifier, $volume_number) {
    $query = new EntityFieldQuery;
    $multivol_nid = multivol_nid($multivol_identifier);
    $result = $query
        ->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', 'dlts_multivol_book')
        ->fieldCondition('field_multivol', 'nid', $multivol_nid, '=')
        ->fieldCondition('field_volume_number', 'value', $volume_number, '=')
        ->execute();
    if (empty($result['node'])) return FALSE;
    $keys = array_keys($result['node']);
    return (int)$keys[0];
}

function book_page_nid($book_nid, $sequence_number) {
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book_page')
    ->fieldCondition('field_sequence_number', 'value', $sequence_number, '=')
    ->fieldCondition('field_book', 'nid', $book_nid, '=')
    ->execute();

  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
  return (int)$keys[0];
}

function partner_nid($identifier) {
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_partner')
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
  return (int)$keys[0];
}

function map_nid($identifier, $language = LANGUAGE_NONE) {
  $query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_map')
    ->propertyCondition('language', $language)
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (empty($result['node'])) return FALSE;
  $keys = array_keys($result['node']);
	return (int)$keys[0];
}
