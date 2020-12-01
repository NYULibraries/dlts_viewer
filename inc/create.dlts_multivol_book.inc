<?php

function create_dlts_multivol_book($node) {
  global $user;
  module_load_include('inc', 'dlts_viewer', 'inc/create.dlts_multivol');
  /** make sure the parent relationship exist*/
  if (is_array($node->isPartOf)) {
    foreach ($node->isPartOf as $isPartOf) {
      $multivolume_nid = multivol_nid($isPartOf->identifier);
      if (!$multivolume_nid) {
        create_dlts_multivol($isPartOf);
      }
    }
  }
  else {
    $multivolume_nid = multivol_nid($node->isPartOf->identifier); 
    if (!$multivolume_nid) {
      create_dlts_multivol($node->isPartOf);
    }
  }
  $multivol_book_exist = multivol_book_nid($node->identifier,$node->volume_number);
  if ($multivol_book_exist) {
    // Load the node by NID
    $entity = node_load($multivol_book_exist);
    // Wrap it with Entity API
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }
  else {
    // entity_create replaces the procedural steps in the first example of
    // creating a new object $node and setting its 'type' and uid property
    $values = array(
      'type' => 'dlts_multivol_book',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => LANGUAGE_NONE, // make sure we only translate the book object
    );
    $entity = entity_create('node', $values);
    // The entity is now created, but we have not yet simplified use of it.
    // Now create an entity_metadata_wrapper around the new node entity
    // to make getting and setting values easier
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }
  if (!empty($node->title)) {
    if (strlen($node->title) > 255) {
      $ewrapper->title->set($node->identifier);
    } else {
      $ewrapper->title->set($node->title);
    }
  }
  else {
  	$ewrapper->title->set($node->identifier);
  }
  if (!empty($node->collection)) {
    $nids = array();
    $collections = array();
    # there is 2 dimensional array for old books so need that check.
    if(is_array( $node->collection[0])) {
      $collections = $node->collection[0];
    } 
    else {
      $collections = $node->collection;
    }
    foreach ($collections as $collection) {
      $nid = collection_nid($collection->identifier);
      if ($nid) {
        $nids[]= $nid;
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
  if ($node->volume_number) {
    $ewrapper->field_volume_number->set((int)$node->volume_number);
  }
  if ($node->volume_number_str) {
    $ewrapper->field_volume_number_str->set($node->volume_number_str);
  }
  if ($node->book) {
    $book_exist = book_nid($node->book, 'en');
    if ($book_exist) {
      $ewrapper->field_book->set($book_exist);
    }
  }
  if (is_array($node->isPartOf)) {
    $multivol_exist = multivol_nid($node->isPartOf[0]->identifier);
  }
  else {
    $multivol_exist = multivol_nid($node->isPartOf->identifier);
  }
  if ($multivol_exist) {
    $ewrapper->field_multivol->set($multivol_exist);
  }
  $ewrapper->save();
  return $entity;
}
