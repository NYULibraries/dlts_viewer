<?php

/**
 * @file
 * MongoDB.inc.
 */

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
  $query = array(
    'sequence' => $data['sequence'],
    'isPartOf' => $data['isPartOf'],
  );
  // Find document and modify
  // See: https://docs.mongodb.org/manual/reference/method/db.collection.findAndModify/
  // See: http://php.net/manual/en/mongocollection.findandmodify.php
  $op = $cursor->findAndModify(
    $query,
    array(
      '$set' => $data,
    ),
    NULL,
    array(
      'sort' => array(
        'rating' => 1,
      ),
      'upsert' => TRUE,
      'new' => TRUE,
    )
  );
  // We should have the current result document as an associative array.
  // if NULL, we have a problem, log error.
  if (!$op) {
    watchdog(
      'MongoDB update document',
      'Unable to update book sequence page <strong>%sequence</strong> from book <strong>%identifier</strong>.',
      array(
        '%identifier' => $arguments['isPartOf'],
        '%sequence' => $arguments['sequence'],
      ),
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
  $query = array('identifier' => $identifier);
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
  $query = array('isPartOf' => $isPartOf);
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
function dlts_viewer_mongodb_load_sequence(int $sequence, $isPartOf, $collection_name = 'dlts_books_page') {
  // Make sure we have a number.
  $sequence = $sequence;
  // Prepare query.
  $query = array(
    'isPartOf' => $isPartOf,
    'sequence' => $sequence,
  );
  $cursor = mongodb_collection($collection_name);
  $result = $cursor->findOne($query);
  return $result;
}

/**
 * Load thumbnails.
 *
 * @param string $isPartOf
 *   Identifier.
 * @param int $page
 *   Pagination page.
 * @param int $per_page
 *   Items per page.
 * @param string $collection_name
 *   Name of collection to table to query.
 * @param string $content_type
 *   Type of resource.
 * @param bool $embeded_thumb
 *   True if embeded.
 *
 * @return array
 *   List of items and count.
 */
function dlts_viewer_mongodb_load_thumbnails($isPartOf, int $page = 0, int $per_page = 10, $collection_name = NULL, $content_type = NULL, $embeded_thumb = FALSE) {
  // Load helpers.
  module_load_include('inc', 'dlts_viewer', 'inc/djatoka');
  $items = array();
  $query = array('isPartOf' => $isPartOf);
  $cursor = mongodb_collection($collection_name)->find($query);
  // No need to continue if request does not have items.
  $count = $cursor->count();
  if ($cursor->count() > 0) {
    // DLTSVIEWER-27.
    // @link https://docs.mongodb.org/manual/reference/method/cursor.sort/
    $cursor->sort(array('sequence' => 1));
    $cursor->limit($per_page);
    $cursor->skip($per_page * $page);
    // DLTSVIEWER-27.
    $cursor->sort(array('sequence' => 1));
    $cursor->limit($per_page);
    $thumbnails = $cursor->skip($per_page * $page);
    foreach ($thumbnails as $thumbnail) {
      if (is_array($thumbnail['sequence'])) {
        $thumbnail['sequence'] = min($thumbnail['sequence']);
      }
      $thumbnail['url'] = url($content_type . '/' . $isPartOf . '/' . $thumbnail['sequence'], array('absolute' => TRUE));
      if (dlts_viewer_is_embed() && $collection_name == 'dlts_photo') {
        $thumbnail['url'] = url($thumbnail['url'], array('query' => array('embed' => 'true')));
      }
      $thumbnail['imageServeURI'] = dlts_viewer_djatoka_url($thumbnail['cm'], $embeded_thumb);
      $items[] = $thumbnail;
    }
    return array('count' => $count, 'items' => $items);
  }
  return FALSE;
}

function dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name) {
  $items = array();
  $query = array('isPartOf' => $identifier);
  $cursor = mongodb_collection($collection_name)->find($query);
  $count = $cursor->count();
  if ($count > 0) {
    $cursor->sort(array('sequence' => 1));
    return $cursor->skip(0);
  }
  return $items;
}
