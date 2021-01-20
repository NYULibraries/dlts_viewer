<?php

/**
 * @file
 * Create DLTS Series.
 */

/**
 * Create DLTS Series.
 */
function create_dlts_series($node) {
  global $user;
  $exists = series_nid($node->identifier);
  if (!$exists) {
    $values = array(
      'type' => 'dlts_series',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => LANGUAGE_NONE,
    );
    $entity = entity_create('node', $values);
  }
  else {
    $entity = node_load($exists);
  }
  $entity->exists = $exists;
  $ewrapper = entity_metadata_wrapper('node', $entity);
  if (!empty($node->title)) {
    // Find the max for this field and trunk it.
    $ewrapper->title->set($node->title);
  }
  else {
    $ewrapper->title->set('Untitled');
  }

  $ewrapper->field_identifier->set($node->identifier);

  if (isset($node->handle)) {
    $ewrapper->field_handle->set(array('url' => $node->handle));
  }

  $ewrapper->save();

  return $entity;
}
