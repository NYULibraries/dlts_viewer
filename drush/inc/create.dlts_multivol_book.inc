<?php

/**
 * @file
 * DLTS Viewer drush
 */

function create_dlts_multivol_book($node) {

  global $user;

  /** make sure the parent relationship exist*/
    if (is_array($node->isPartOf)) {
        foreach ($node->isPartOf as $isPartOf) {
            $multivolume_nid = multivolume_nid($isPartOf->identifier);
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

  $multivol_book_exist = multivol_book_nid($node->identifier);

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
  	// find the max for this field and trunk it
  	$ewrapper->title->set($node->title);
        $substr_title = $node->title;
        if (strlen($substr_title) > 255) {
            //$substr_title = substr($node['entity_title'], 0, 200);
           $ewrapper->title->set('Title longer that 255 characters');
        } else {
           $ewrapper->title->set($substr_title);
        }
  }
  else {
  	$ewrapper->title->set('Untitled');
  }

    if (!empty($node->collection)) {
        $nids = array();
        foreach ($node->collection as $collection) {
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

  $multivol_exist = multivol_nid($node->isPartOf->identifier);
  if ($multivol_exist) {
    $ewrapper->field_multivol->set($multivol_exist);
  }

  $ewrapper->save();

  return $entity;

}
