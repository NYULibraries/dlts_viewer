<?php

/**
 * @file
 * DLTS Viewer drush
 */

function create_dlts_partner($node) {
  global $user;
  $node = (array) $node;
  $exists = partner_nid($node['identifier']);
  if ($exists) {
    // Load the node by NID
    $entity = node_load($exists);
    // Wrap it with Entity API
    $ewrapper = entity_metadata_wrapper('node', $entity);
  } else {
    $entity = entity_create('node', [
      'type' => 'dlts_partner',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => LANGUAGE_NONE,
    ]);
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }

  $entity->exists = $exists;

  $uniqid = (string) uniqid();

  if (isset($node['title'])) {
    $ewrapper->title->set($node['title']);
  } else {
    $ewrapper->title->set("partner $uniqid");
  }

  if (isset($node['identifier'])) {
    $ewrapper->field_identifier->set($node['identifier']);
  } else {
    $ewrapper->field_identifier->set($uniqid);
  }

  if (isset($node['code'])) {
    $ewrapper->field_code->set($node['code']);
  }

  if (isset($node['name'])) {
    $ewrapper->field_name->set($node['name']);
  }

  $ewrapper->save();

  return $entity;

}

function create_dlts_provider($node) {
  global $user;
  $node = (array) $node;
  $exists = partner_nid($node['uuid']);
  if ($exists) {
    // Load the node by NID
    $entity = node_load($exists);
    // Wrap it with Entity API
    $ewrapper = entity_metadata_wrapper('node', $entity);
  } else {
    $entity = entity_create('node', [
      'type' => 'dlts_partner',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => LANGUAGE_NONE,
    ]);
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }

  $entity->exists = $exists;

  $uniqid = (string) uniqid();

  if (isset($node['name'])) {
    $ewrapper->title->set($node['name']);
  } else {
    $ewrapper->title->set("Partner $uniqid");
  }

  if (isset($node['identifier'])) {
    $ewrapper->field_identifier->set($node['uuid']);
  } else {
    $ewrapper->field_identifier->set($uniqid);
  }

  if (isset($node['code'])) {
    $ewrapper->field_code->set($node['code']);
  }

  if (isset($node['name'])) {
    $ewrapper->field_name->set($node['name']);
  }

  $ewrapper->save();

  return $entity;

}
