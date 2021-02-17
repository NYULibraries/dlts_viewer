<?php

/**
 * @file
 * IIIF callbacks.
 */

/**
 * A wildcard loader for IIIF region.
 *
 * @parameter string $region
 *  The value of the region.
 *
 * @return string|bool
 *   Value of the region if valid input or FALSE.
 */
function dlts_iiif_region_load($region) {
  // @link https://iiif.io/api/image/3.0/#41-region
  $valid_regions = array(
    'full',
    'square',
  );
  if (
    in_array($region, $valid_regions) ||
    preg_match('/^[0-9]*,{1}[0-9]*,{1}[0-9]*,{1}[0-9]*$/', $region) ||
    preg_match('/^pct:[\.0-9]*,{1}[\.0-9]*,{1}[\.0-9]*,{1}[\.0-9]*$/', $region)
  ) {
    return $region;
  }
  return FALSE;
}

/**
 * A wildcard loader for IIIF Size.
 *
 * @parameter sting $size
 *  The value of the size.
 */
function dlts_iiif_size_load($size) {
  return $size;
}

/**
 * A wildcard loader for IIIF Rotation.
 *
 * @parameter sting $rotation
 *  The value of the rotation.
 */
function dlts_iiif_rotation_load($rotation) {
  return $rotation;
}

/**
 * A wildcard loader for IIIF Quality.
 *
 * @parameter sting $quality
 *  The value of the rotation.
 */
function dlts_iiif_quality_load($quality) {
  // @link https://iiif.io/api/image/3.0/#44-quality
  $valid = array(
    'default.jpg',
    'gray.jpg',
    'color.jpg',
    'bitonal.jpg',
  );
  if (in_array($quality, $valid)) {
    return $quality;
  }
  return FALSE;
}

/**
 * A wildcard loader for IIIF Annotation painting.
 *
 * @parameter sting $sequence
 *  The value of the sequence.
 */
function dlts_iiif_annotation_painting_load($sequence, $map, $index = NULL) {
  $resource = $map[$index - 3];
  switch ($resource->type) {
    case 'dlts_book':
      preg_match('/^([\d]+)$/', $sequence, $matches);
      if (!empty($matches)) {
        return dlts_book_page_load($sequence, $map, $index - 2);
      }
      break;
  }
  return FALSE;
}

/**
 * A wildcard loader for IIIF Quality.
 *
 * @parameter sting $quality
 *  The value of the rotation.
 *
 * @return string
 *   Value of the rotation if valid input or FALSE.
 */
function dlts_iiif_annotation_page_load($sequence, $map, $index = NULL) {
  $resource = $map[$index - 2];
  switch ($resource->type) {
    case 'dlts_book':
      preg_match('/^([\d]+)$/', $sequence, $matches);
      if (!empty($matches)) {
        return dlts_book_page_load($sequence, $map, $index - 1);
      }
      break;
  }
  return FALSE;
}

/**
 * A wildcard loader for IIIF Quality.
 *
 * @parameter sting $quality
 *  The value of the rotation.
 *
 * @return string
 *   Value of the rotation if valid input or FALSE.
 */
function dlts_canvas_page_load($sequence, $map, $index = NULL) {
  $resource = $map[$index - 2];
  switch ($resource->type) {
    case 'dlts_book':
      preg_match('/^([\d]+)$/', $sequence, $matches);
      if (!empty($matches)) {
        return dlts_book_page_load($sequence, $map, $index - 1);
      }
      break;
  }
  return FALSE;
}

/**
 * A wildcard loader for dlts_resource_sequence data from MongoDB.
 *
 * @param string $sequence
 *   Sequence number.
 * @param array $map
 *   All elements of the path are converted to a keyed array.
 *   This is also a variable reference.
 * @param int $resource_index
 *   The element of the path the wildcard loader is defined in.
 *
 * @return object
 *   MongoDB object
 */
 function dlts_resource_sequence_load($sequence, array $map, $resource_index) {

  $wrapper = entity_metadata_wrapper('node', $map[$resource_index - 1]);

  $type = $wrapper->getBundle();

  $identifier = $wrapper->field_identifier->value();

  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  // View modes, we map the views with their machine names in MongoDB.
  $collections = array(
    'single' => 'dlts_books_page',
    'double' => 'dlts_stitched_books_page',
  );

  // Viewer defaults to single page view.
  $collection_name = 'dlts_books_page';

  // User can requests a view modes, get query parameters and
  // check if page_view is set.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['page_view'])) {
    // Check if the requested view mode is valid.
    if (array_key_exists($query_parameters['page_view'], $collections)) {
      $collection_name = $collections[$query_parameters['page_view']];
    }
  }

  $result = dlts_viewer_mongodb_load_sequence(
    $sequence,
    $identifier,
    $collection_name
  );

  if (
    $result &&
    isset($result['cm']) &&
    !empty($result['cm']['uri'])
  ) {
    return array(
      'fid' => str_replace('fileserver://', '', $result['cm']['uri']),
      'sequence' => array_pop($result['sequence']),
      'url' => file_create_url($result['cm']['uri']),
      'uri' => $result['cm']['uri'],
      'width' => isset($result['cm']['width']) ? $result['cm']['width'] : NULL,
      'height' => isset($result['cm']['height']) ? $result['cm']['height'] : NULL,
    );
  }

  drupal_set_message(
    t('<em>DLTS Viewer</em>: Sequence page <strong>@sequence</strong> from book identify by identifier <strong>@identifier</strong> not found.',
    array(
      '@identifier' => $identifier,
      '@sequence' => $sequence,
    )
  ), 'error');

  watchdog(
    'MongoDB sequence not found',
    'Unable to find book sequence page <strong>%sequence</strong> from book <strong>%identifier</strong>.',
    array(
      '%identifier' => $identifier,
      '%sequence' => $sequence,
    ),
    WATCHDOG_NOTICE
  );

  // If $result is empty, retrun FALSE so that hook_menu can 404 redirect.
  return FALSE;
}
