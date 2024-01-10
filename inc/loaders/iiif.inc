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
  $valid_regions = [
    'full',
    'square',
  ];
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
  $valid = [
    'default.jpg',
    'gray.jpg',
    'color.jpg',
    'bitonal.jpg',
  ];
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

    case 'dlts_photo_set':
      preg_match('/^([\d]+)$/', $sequence, $matches);
      if (!empty($matches)) {
        return dlts_photo_load($sequence, $map, $index - 2);
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

    case 'dlts_photo_set':
      preg_match('/^([\d]+)$/', $sequence, $matches);
      if (!empty($matches)) {
        return dlts_photo_load($sequence, $map, $index - 1);
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

    case 'dlts_photo_set':
      preg_match('/^([\d]+)$/', $sequence, $matches);
      if (!empty($matches)) {
        return dlts_photo_load($sequence, $map, $index - 1);
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
function dlts_resource_sequence_load($sequence, array $map = [], $resource_index = 0) {

  $object = $map[$resource_index - 1];

  if (is_object($object) && isset($object->document)) {
    $object = node_load($object->nid);
  }

  $wrapper = entity_metadata_wrapper('node', $object);

  $type = $wrapper->getBundle();

  $identifier = $wrapper->field_identifier->value();

  $collection_name = dlts_viewer_mongodb_collections_by_type($type);

  $result = dlts_viewer_mongodb_load_sequence($sequence, $identifier, $collection_name);

  if (
    $result &&
    isset($result['cm']) &&
    !empty($result['cm']['uri'])
  ) {
    return [
      'fid' => str_replace('fileserver://', '', $result['cm']['uri']),
      'sequence' => array_pop($result['sequence']),
      'url' => file_create_url($result['cm']['uri']),
      'uri' => $result['cm']['uri'],
      'width' => isset($result['cm']['width']) ? $result['cm']['width'] : NULL,
      'height' => isset($result['cm']['height']) ? $result['cm']['height'] : NULL,
    ];
  }

  watchdog('MongoDB sequence not found', 'Unable to find book sequence page <strong>%sequence</strong> from %resource <strong>%identifier</strong>.',
    [
      '%identifier' => $identifier,
      '%sequence' => $sequence,
      '%resource' => $type,
    ], WATCHDOG_NOTICE);

  // If $result is empty, retrun FALSE so that hook_menu can 404 redirect.
  return FALSE;
}
