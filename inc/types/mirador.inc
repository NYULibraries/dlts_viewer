<?php

/**
 * Mirador dispatcher.
 *
 * @param object $entity
 *   Entity.
 */
function dlts_viewer_viewer_dispatcher($node) {

  global $base_url;

  $language = 'en';

  $bundle = $node->document;

  $identifier = $node->identifier;

  $realpath = drupal_realpath('public://');

  $cachepath = "$realpath/iiif/$bundle/$identifier/manifest.json";

  if (file_exists($cachepath)) {
    $cache = file_get_contents($cachepath);

    $data = json_decode($cache);

    $title = $data->label->$language[0];

  } else {

    $entity = node_load($node->nid);

    $language = $entity->language;

    // Wrapp book entity with Entity API wrapper.
    $wrapper = entity_metadata_wrapper('node', $entity);

    $title = $wrapper->field_title->value();  

  }

  $title = html_entity_decode($title, ENT_QUOTES);

  // Set entity title.
  drupal_set_title($title);

  $module = drupal_get_path('module', 'dlts_viewer');

  $out  = '';
  $out .= '<!doctype html>';
  $out .= "<html lang='$language'>";
  $out .= '<head>';
  $out .= '<meta charset="utf-8" />';
  $out .= "  <title>$title</title>";
  $out .= '</head>';
  $out .= '<body>';
  $out .= "<div id='mirador-app' data-language='$language' data-endpoint='$base_url' data-type='$bundle' data-identifier='$identifier'></div>";
  $out .= "<script src='$base_url/$module/mirador/integration/dist/mirador.js'></script>";
  $out .= '</body>';
  $out .= '</html>';

  echo $out;

}
