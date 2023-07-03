<?php

/**
 * @file
 * Types.
 */

/**
 * Machine name alias.
 *
 * @parameter string $types.
 *  The value of types.
 *
 * @return string
 *   Alias.
 */
function dlts_viewer_get_bundle_alias($type) {
  $types = [
    'dlts_book' => 'books',
    'dlts_map' => 'maps',
    'dlts_photo_set' => 'photos',
    'dlts_postcard' => 'postcards',
    'dlts_collection' => 'collections',
    'dlts_partner' => 'partners',
    'creativework' => 'creativework',
  ];
  if (isset($types[$type])) {
    return $types[$type];
  }
  return FALSE;
}

/**
 * Is bundle.
 *
 * @parameter string $bundle.
 *  The value of bundle.
 *
 * @return string
 *   Machine name of the content type.
 */
function dlts_viewer_is_bundle($bundle) {
  $bundles = [
    'dlts_book',
    'dlts_map',
    'dlts_photo_set',
    'dlts_postcard',
    'dlts_collection',
    'dlts_partner',
    'creativework'
  ];
  return in_array($bundle, $bundles);
}

/**
 * A wildcard loader for types.
 *
 * @parameter string $types.
 *  The value of types.
 *
 * @return string
 *   Machine name of the content type.
 */
function dlts_type_load($type) {

  $types = [
    'books' => 'dlts_book',
    'maps' => 'dlts_map',
    'photos' => 'dlts_photo_set',
    'postcards' => 'dlts_postcard',
    'collections' => 'dlts_collection',
    'partners' => 'dlts_partner',
    'creativework' => 'creativework',
  ];

  if (isset($types[$type])) {
    return $types[$type];
  }

  return FALSE;
}

/**
 * A wildcard loader for dlts_resource, using identifier or noid.
 *
 * @parameter string $identifier
 *   The value of identifier or noid.
 *
 * @return object
 *   A node object with the given value for field_identifier.
 */
function dlts_resource_load($identifier) {

  $language = [ 'en', LANGUAGE_NONE ];

  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['lang'])) {
    $language = [ filter_xss($query_parameters['lang']) ];
  }

  $identifier = filter_xss($identifier);

  // id can be noid or identifier.
  $results = db_query(
    'SELECT * FROM dlts_viewer_resource 
     WHERE noid = :id 
     OR identifier = :id 
     LIMIT 1', 
    [ ':id' => $identifier ]
    )->fetchAll();

  if (!empty($results)) {
    $result = array_pop($results);
    return node_load($result->nid);
  }
 
  return FALSE;

}

/**
 * Route callback for edit page.
 * @link http://localhost:9000/admin/content/{identifier|noid}/edit
 */
function _dlts_viewer_edit_redirect($entity) {
  drupal_goto('node/' . $entity->nid . '/edit');
}
