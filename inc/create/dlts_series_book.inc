<?php

/**
 * @file
 * Create DLTS Series book.
 */

/**
 * Create DLTS Series book.
 */
function create_dlts_series_book($node) {
  global $user;
  // Make sure the parent relationship exist.
  if (is_array($node->isPartOf)) {
    foreach ($node->isPartOf as $isPartOf) {
      $series_nid = series_nid($isPartOf->identifier);
      if (!$series_nid) {
        create_dlts_series($isPartOf);
      }
    }
  }
  else {
    $series_nid = series_nid($node->isPartOf->identifier);
    if (!$series_nid) {
      create_dlts_series($node->isPartOf);
    }
  }
  $exist = series_book_nid($node->identifier);
  if ($exist) {
    // Load the node by NID.
    $entity = node_load($exist);
    // Wrap it with Entity API.
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }
  else {
    $values = array(
      'type' => 'dlts_series_book',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => LANGUAGE_NONE,
    );
    $entity = entity_create('node', $values);
    // The entity is now created, but we have not yet simplified use of it.
    // Now create an entity_metadata_wrapper around the new node entity
    // to make getting and setting values easier.
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }

  if (!empty($node->title)) {
    $substr_title = $node->title;
    if (strlen($substr_title) > 255) {
      $ewrapper->title->set('Title longer that 255 characters');
    }
    else {
      $ewrapper->title->set($substr_title);
    }
  }
  else {
    $ewrapper->title->set('Untitled');
  }
  if (!empty($node->collection)) {
    $nids = array();
    $collections = array();
    // There is 2 dimensional array for old books so need that check.
    if (is_array($node->collection[0])) {
      $collections = $node->collection[0];
    }
    else {
      $collections = $node->collection;
    }
    foreach ($collections as $collection) {
      $nid = collection_nid($collection->identifier);
      if ($nid) {
        $nids[] = $nid;
      }
    }
    $ewrapper->field_collection->set(array($nid));
  }
  if ($node->identifier) {
    $ewrapper->field_identifier->set($node->identifier);
  }
  else {
    $ewrapper->field_identifier->set(uniqid());
  }
  if (isset($node->volumeNumber)) {
    $ewrapper->field_volume_number->set((int) $node->volumeNumber);
  }
  if (isset($node->volumeDisplay)) {
    $ewrapper->field_volume_number_str->set($node->volumeDisplay);
  }
  if ($node->book) {
    $book_exist = book_nid($node->book, 'en');
    if ($book_exist) {
      $ewrapper->field_book->set($book_exist);
    }
  }
  if (is_array($node->isPartOf)) {
    $series_exist = series_nid($node->isPartOf[0]->identifier);
  }
  else {
    $series_exist = series_nid($node->isPartOf->identifier);
  }
  if ($series_exist) {
    $ewrapper->field_series->set($series_exist);
  }
  $ewrapper->save();
  return $entity;
}
