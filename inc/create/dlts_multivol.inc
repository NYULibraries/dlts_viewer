<?php

function create_dlts_multivol($node) {
  global $user;
  $exists = multivol_nid($node->identifier);
  if (!$exists) {
    // entity_create replaces the procedural steps in the first example of
    // creating a new object $node and setting its 'type' and uid property
    $values = [
      'type' => 'dlts_multivol',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => LANGUAGE_NONE, // make sure we only translate the book object
    ];
    $entity = entity_create('node', $values);
  }
  else {
    $entity = node_load($exists);
  }
  $entity->exists = $exists;
  $ewrapper = entity_metadata_wrapper('node', $entity);
  if (!empty($node->title)) {
    if (strlen($node->title) > 255) {
      $ewrapper->title->set($node->identifier);
    } else {
      $ewrapper->title->set($node->title);
    }
  } else {
  	$ewrapper->title->set($node->identifier);
  }
  $ewrapper->field_identifier->set($node->identifier);
  if (isset($node->handle) && !empty($node->handle)) {
    $ewrapper->field_handle->set([ 'url' => $node->handle ]);
  }
  if (isset($node->ri) && !empty($node->ri)) {
    $ewrapper->representative_image->set([ 'url' => $node->ri ]);
  }
  $ewrapper->save();
  return $entity;
}
