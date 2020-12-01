<?php

/**
 * @file
 * Datasource
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

function dlts_viewer_get_translations_nid_by_identifier($identifier) {
  $keys = array();
  $query = new EntityFieldQuery;
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', 1) // only load books that are published
    ->fieldCondition('field_identifier', 'value', $identifier, '=')
    ->execute();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
  }
  return $keys;
}

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

function photoset_nid($identifier, $language = LANGUAGE_NONE) {
	$query = new EntityFieldQuery;
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_photo_set')
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

function dlts_viewer_partner_nid_by_code($code) {
	$query = new EntityFieldQuery;
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

function dlts_viewer_collection_nids_by_code($code, $partnerCode = null) {

	$partnerNid = dlts_viewer_partner_nid_by_code($partnerCode);
	
	$query = new EntityFieldQuery;

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
	} else {
		return array_keys($result['node']);	
	}
}

function dlts_viewer_books_isPartof_multivolume($nid) {
	$query = new EntityFieldQuery;
	$result = $query ->entityCondition('entity_type', 'node')
	  ->entityCondition('bundle', 'dlts_multivol_book')
	  ->fieldCondition('field_multivol', 'nid', $nid, '=')
		->execute();
	if (empty($result['node'])) {
		return FALSE;
	} else {
		$keys = array_keys($result['node']);
		return node_load_multiple($keys);	
	}
}

function dlts_viewer_books_isPartof_series($nid) {
	$query = new EntityFieldQuery;
	$result = $query ->entityCondition('entity_type', 'node')
	  ->entityCondition('bundle', 'dlts_series_book')
	  ->fieldCondition('field_series', 'nid', $nid, '=')
		->execute();
	if (empty($result['node'])) {
		return FALSE;
	} else {
		$keys = array_keys($result['node']);
		return node_load_multiple($keys);	
	}
}

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

function dlts_viewer_subject_vocabulary_vid() {
	$global_vocabulary_vid = &drupal_static('global_vocabulary_vid');
	if (empty($global_vocabulary_vid)) {
		$global_vocabulary_vid = taxonomy_vocabulary_machine_name_load('subjects')->vid;
	}
	return $global_vocabulary_vid;
}

// Return a list of created %d-%m-%Y. Usuful to select batch of nodes
// that were publish in a specific day.
function dlts_viewer_batch_days($collectionCode = NULL, $status = 1, $requestedLang = 'en') {
	
	$query = "
    SELECT 
    DISTINCT DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') created
		FROM node ";

	if ($collectionCode) {
		$query .= "
      LEFT JOIN field_data_field_collection collection 
        ON node.nid = collection.entity_id
		  INNER JOIN field_data_field_code code
		    ON collection.field_collection_nid = code.entity_id 
		    AND code.field_code_value = :collection_code ";
	}

	$query .= "
    WHERE node.language = :language
    AND node.status = :status
		ORDER BY node.created DESC";

	$args = array(
    ':language' => $requestedLang, 
    ':status' => $status,
	);

	if ($collectionCode) {
		$args[':collection_code'] = $collectionCode;
	}

  $result = db_query($query, $args)->fetchAll();

	$dates = array();
	
	foreach ($result as $date) {
		$dates[] = $date->created;
	}
  
  return $dates;

}
