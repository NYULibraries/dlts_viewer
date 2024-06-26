<?php

/**
 * Mirador dispatcher.
 *
 * @param object $record
 *   Record from dlts_resource table.
 */
function dlts_viewer_embed_dispatcher($record, $sequence = 1) {

  global $base_url;

  $analytics = variable_get('analytics', []);

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  $language = isset($query_parameters['language']) ? filter_xss($query_parameters['language']) : 'en';

  $viewer = isset($query_parameters['viewer']) ? filter_xss($query_parameters['viewer']) : 'mirador';

  $reset = isset($query_parameters['reset']) ? filter_xss($query_parameters['reset']) : false;

  $type = $record->document;

  $identifier = $record->identifier;

  $realpath = drupal_realpath('public://');

  $cachepath = "$realpath/iiif/$type/$identifier/manifest.json";

  if ($reset && file_exists($cachepath)) {

    $cache = file_get_contents($cachepath);

    $data = json_decode($cache);

    $title = $data->label->$language[0];

    $languages = array_keys( (array) $data->label);

  } else {

    $entity = node_load($record->nid);

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

  switch ($viewer) {
    case 'uv':
      $template = 'viewer_embed_uv_page';
      $opts =  [
        'analytics' => $analytics,
        'appid' => 'uv-app',
        'title' => $title,
        'language' => $language,
        'direction' => $direction,
        'sequence' => $sequence,
        'endpoint' => $base_url,
        'type' => $type,
        'identifier' => $identifier,
        'manifest' => "$base_url/api/presentation/$type/$identifier/manifest.json",
      ];
      break;
    case 'clover':
      $template = 'viewer_embed_clover_page';
      $opts =  [
        'analytics' => $analytics,
        'appid' => 'clover-app',
        'title' => $title,
        'language' => $language,
        'direction' => $direction,
        'sequence' => $sequence,
        'endpoint' => $base_url,
        'type' => $type,
        'identifier' => $identifier,
        'manifest' => "$base_url/api/presentation/$type/$identifier/manifest.json",
        'script' => file_get_contents("$module/viewers/clover-iiif/dist/clover-iiif.2.3.2.umd.js"),
      ];
      break;
    case 'mirador4':
      $template = 'viewer_embed_mirador_latest_page';
      $opts =  [
        'analytics' => $analytics,
        'appid' => 'mirador-app',
        'title' => $title,
        'language' => $language,
        'direction' => $direction,
        'sequence' => $sequence,
        'endpoint' => $base_url,
        'type' => $type,
        'identifier' => $identifier,
        'manifest' => "$base_url/api/presentation/$type/$identifier/manifest.json",
        'script' => file_get_contents("$module/viewers/mirador-4/dist/mirador.js"),
      ];
      break;
    case 'mirador':
      $template = 'viewer_embed_page';
      $opts =  [
        'analytics' => $analytics,
        'appid' => 'mirador-app',
        'title' => $title,
        'language' => $language,
        'direction' => $direction,
        'sequence' => $sequence,
        'endpoint' => $base_url,
        'type' => $type,
        'identifier' => $identifier,
        'manifest' => "$base_url/api/presentation/$type/$identifier/manifest.json",
        'script' => file_get_contents("$module/mirador/integration/dist/mirador.js"),
      ];
      break;
  }

  echo theme($template, $opts);

}
