<?php

/**
 * @file
 * DLTS Viewer Create Photo resource.
 */

/**
 * Save photo object.
 *
 * @param string $node
 *   Entity.
 * @param string $node_language
 *   Lang of resource.
 *
 * @return object
 *   Photo.
 */
function save_dlts_photo_set($node, $node_language = 'en') {

  global $user;

  $username = $user->name;

  if (!user_access('dlts create object')) {
    throw new Exception("Action not allowed for user $username.");
  }

  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_collection');

  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_partner');

  // Force EN language.
  if ($node_language == LANGUAGE_NONE) {
    $node_language = 'en';
  }

  $photo_set_exist = photoset_nid($node['identifier'], $node_language);

  if ($photo_set_exist) {
    // Load the node by NID.
    $entity = node_load($photo_set_exist);
    // Wrap it with Entity API.
    $ewrapper = entity_metadata_wrapper('node', $entity);
  } else {
    $entity = entity_create('node', [
      'type' => 'dlts_photo_set',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0,
      'language' => $node_language,
    ]);
    $ewrapper = entity_metadata_wrapper('node', $entity);
  }

  $collections_nids = [];

  if (!empty($node['entity_title'])) {
    $node['entity_title'] = trim($node['entity_title']);
    $substr_title = $node['entity_title'];
    if (strlen($substr_title) > 255) {
      $substr_title = substr($node['entity_title'], 0, 200);
    }
    $ewrapper->title->set($substr_title);
  } else {
    $ewrapper->title->set('Untitled');
  }

  if (!empty($node['identifier'])) {
    $ewrapper->field_identifier->set($node['identifier']);
  } else {
    die('Node identifier must not be empty');
  }

  if (!empty($node['partners']) && is_array($node['partners']) && count($node['partners']) > 0) {
    foreach ($node['partners'] as $partner) {
      $nid = partner_nid($partner['identifier']);
      if (!$nid) {
        $partner_entity = create_dlts_partner($partner);
        if ($partner_entity) {
          $nid = $partner_entity->nid;
        }
      }
      if ($nid) {
        $partners_nids[] = $nid;
      }
      $partner_entity = NULL;
      $nid = NULL;
    }
  }

  if (!empty($node['collections']) && is_array($node['collections']) && count($node['collections']) > 0) {
    foreach ($node['collections'] as $collection) {
      $nid = collection_nid($collection['identifier']);
      // Create collection.
      if (!$nid) {
        $collection_entity = create_dlts_collection($collection);
        if ($collection_entity) {
          $nid = $collection_entity->nid;
        }
      }
      if ($nid) {
        $collections_nids[] = $nid;
      }
      $collection_entity = NULL;
      $nid = NULL;
    }
  }

  if (!empty($partners_nids)) {
    $ewrapper->field_partner->set($partners_nids);
  }

  if (!empty($collections_nids)) {
    $ewrapper->field_collection->set($collections_nids);
  }

  if (!empty($node['handle'])) {
    $ewrapper->field_handle->set(array('url' => $node['handle']));
  }

  if (!empty($node['page_count'])) {
    $ewrapper->field_page_count->set((int) $node['page_count']);
  }

  if (!empty($node['sequence_count'])) {
    $ewrapper->field_sequence_count->set((int) $node['sequence_count']);
  }

  if (!empty($node['title_long'])) {
    $ewrapper->field_title->set($node['title_long']);
  }
  elseif (!empty($node['entity_title'])) {
    $ewrapper->field_title->set($node['entity_title']);
  }

  $saved = $ewrapper->save();
  if ($saved) {

    $nid = $ewrapper->getIdentifier();

    $exists = db_query("SELECT nid FROM dlts_viewer_resource WHERE nid = '$nid'")->fetchAll();

    if (count($exists) <= 0) {

      $identifier = $node['identifier'];

      $parsed_url = parse_url($node['handle']['url']);
    
      $noid = str_replace('/2333.1/', '', $parsed_url['path']);

      $edit_query = "INSERT INTO dlts_viewer_resource (nid, noid, identifier, document, proceed) VALUES ('$nid', '$noid', '$identifier', 'dlts_photo_set', '0');";

      $results = db_query($edit_query);

    }
  }

  return $saved;

}
