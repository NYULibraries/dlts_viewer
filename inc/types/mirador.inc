<?php

/**
 * Mirador dispatcher.
 *
 * @param object $entity
 *   Entity.
 */
function dlts_viewer_mirador_dispatcher($entity) {

  global $base_url;

  // Check for mobile devices.
  // $is_mobile = dlts_viewer_is_mobile();

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  // Test if resource, will return the maped type of resource (e.g., books).
  $is_resource = dlts_viewer_is_resource();

  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  $entity->title = $wrapper->field_title->value();

  // Check if this books is part of a multi-volume.
  // $multivolume_book = dlts_viewer_is_multivolume_book($entity);
  // If book is part of multi-volume; use append volume value to entity title.
  // if ($multivolume_book) {
  //   $multivolume_book_wrapper = entity_metadata_wrapper('node', $multivolume_book);
  //   // Get volume value.
  //   $volume_number_str = $multivolume_book_wrapper->field_volume_number_str->value();
  //   // Change entity title.
  //   $entity->title = t(
  //    '@title @volume', 
  //     [
  //       '@title' => $entity->title,
  //       '@volume' => $volume_number_str
  //     ]
  //   );
  // }

  $entity->title = html_entity_decode($entity->title, ENT_QUOTES);

  // Set entity title.
  drupal_set_title($entity->title);

  // Set $identifier so that .tpl.php can use it.
  $entity->identifier = $wrapper->field_identifier->value();

  $iiif_manifest_endpoint = 'http://192.168.0.21:9000';

  $is_resource = 'books';

  $out  = '';
  $out .= '<!doctype html>';
  $out .= '<html>';
  $out .= '<head>';
  $out .= '<meta charset="utf-8" />';
  $out .= "  <title>$entity->title</title>";
  $out .= '</head>';
  $out .= '<body>';
  $out .= "<div id='mirador-app' data-endpoint='$iiif_manifest_endpoint' data-type='$is_resource' data-identifier='$entity->identifier'></div>";
  $out .= '<script src="/sites/all/modules/dlts_viewer/mirador/integration/webpack/dist/mirador.js"></script>';
  $out .= '</body>';
  $out .= '</html>';

  print $out;

}