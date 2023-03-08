<?php

/**
 * Mirador dispatcher.
 *
 * @param object $entity
 *   Entity.
 */
function dlts_viewer_embed_dispatcher($node, $sequence = 1) {

  global $base_url;

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  $language = isset($query_parameters['language']) ? filter_xss($query_parameters['language']) : 'en';

  $type = $node->document;

  $identifier = $node->identifier;

  $realpath = drupal_realpath('public://');

  $cachepath = "$realpath/iiif/$type/$identifier/manifest.json";

  if (file_exists($cachepath)) {

    $cache = file_get_contents($cachepath);

    $data = json_decode($cache);

    $title = $data->label->$language[0];

    $languages = array_keys( (array) $data->label);

  } else {

    $entity = node_load($node->nid);

    // Wrapp book entity with Entity API wrapper.
    $wrapper = entity_metadata_wrapper('node', $entity);

    $title = $wrapper->field_title->value();  

    $translations = dlts_viewer_list_translation($identifier, $entity->type);

    $languages = array_keys($translations);

  }

  if (!in_array($language, $languages)) {
    $language = 'en';
  }

  $title = html_entity_decode($title, ENT_QUOTES);

  // Set entity title.
  drupal_set_title($title);

  $sequence = (int) filter_xss($sequence);

  $module = drupal_get_path('module', 'dlts_viewer');

  $language_list = language_list('enabled');

  $direction = 'ltr';

  if (isset($language_list[1][$language])) {
    $direction = ($language_list[1][$language]->direction == '1') ? 'rtl' : 'ltr';
  }

  echo theme('viewer_embed_page', [
    'appid' => 'mirador-app',
    'title' => $title,
    'language' => $language,
    'direction' => $direction,
    'sequence' => $sequence,
    'endpoint' => $base_url,
    'type' => $type,
    'identifier' => $identifier,
    'script' => "$base_url/$module/mirador/integration/dist/mirador.js",
  ]);

}
