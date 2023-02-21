<?php

/**
 * Mirador dispatcher.
 *
 * @param object $entity
 *   Entity.
 */
function dlts_viewer_embed_dispatcher($node) {

  global $base_url;

  $language = 'en';

  $type = $node->document;

  $identifier = $node->identifier;

  $realpath = drupal_realpath('public://');

  $cachepath = "$realpath/iiif/$type/$identifier/manifest.json";

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

  echo theme('viewer_embed_page', [
    'appid' => 'mirador-app',
    'title' => $title,
    'language' => $language,
    'endpoint' => $base_url,
    'type' => $type,
    'identifier' => $identifier,
    'script' => "$base_url/$module/mirador/integration/dist/mirador.js",
  ]);

}
