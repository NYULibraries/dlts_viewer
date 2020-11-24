<?php

function dlts_iiif_region_load($region) {
  # https://iiif.io/api/image/3.0/#41-region
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

function dlts_iiif_size_load($size) {
  return $size;
}

function dlts_iiif_rotation_load($rotation) {
  return $rotation;
}

function dlts_iiif_quality_load($quality) {
  # https://iiif.io/api/image/3.0/#44-quality
  $valid = array(
    'default.jpg',
  );
  if (in_array($quality, $valid)) {
    return $quality;
  }
  return FALSE;
}

function dlts_iiif_annotation_painting_load($sequence, $map) {
  preg_match('/^([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load($sequence, $map, 6);
  }
  return FALSE;
}

function dlts_iiif_annotation_page_load($sequence, $map) {
  die(__FUNCTION__);
  preg_match('/^([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load($sequence, $map, 6);
  }
  return FALSE;
}

function dlts_canvas_page_load($sequence, $map) {
  preg_match('/^([\d]+)$/', $sequence, $matches);
  if (!empty($matches)) {
    return dlts_book_page_load($sequence, $map, 6);
  }
  return FALSE;
}

function item_load($item) {
  die(__FUNCTION__);
  return $item;
}

function page_item_load($item) {
  preg_match('/^([\d]+)/', $item, $matches);
  // http://localhost:9000/iiif/2/books/princeton_aco000102/1/info.json
  if ($matches) {
    $sequence = (int)$matches[1];
    return dlts_book_page_load($sequence, arg(3));
  } else {
    preg_match('/^p{1}([\d]+)-image/', $item, $matches);
    if (!empty($matches)) {
      $sequence = (int)$matches[1];
      return dlts_book_page_load($sequence, arg(3));
    }
  }
  return FALSE;
}
