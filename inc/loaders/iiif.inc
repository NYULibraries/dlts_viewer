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
function dlts_iiif_annotation_painting_load($sequence, $map) {
  preg_match('/^([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load($sequence, $map, 5);
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
function dlts_iiif_annotation_page_load($sequence, $map) {
  preg_match('/^([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load($sequence, $map, 5);
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
function dlts_canvas_page_load($sequence, $map) {
  preg_match('/^([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load($sequence, $map, 5);
  }
  return FALSE;
}
