<?php

/**
 * Mirador dispatcher.
 *
 * @param object $record
 *   Record from dlts_resource table.
 */
function dlts_viewer_embed_dispatcher($record, $sequence = null) {

  global $base_url;

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  $analytics = variable_get('analytics', []);

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  $language = 'en';

  if (isset($query_parameters['language'])) {
    $language = filter_xss($query_parameters['language']);
  } elseif (isset($query_parameters['lang'])) {
    $language = filter_xss($query_parameters['lang']);
  }

  if (isset($query_parameters['language'])) {
    $language = filter_xss($query_parameters['language']);
  } elseif (isset($query_parameters['lang'])) {
    $language = filter_xss($query_parameters['lang']);
  }

  $viewer = isset($query_parameters['viewer']) ? filter_xss($query_parameters['viewer']) : 'mirador';

  $type = $record->document;

  $identifier = $record->identifier;

  $entity = node_load($record->nid);

  $wrapper = entity_metadata_wrapper('node', $entity);

  $title = $wrapper->field_title->value();

  $translations = dlts_viewer_list_translation($identifier, $entity->type);

  $languages = array_keys($translations);

  if (!in_array($language, $languages)) {
    $language = 'en';
  }

  $title = html_entity_decode($title, ENT_QUOTES);

  $is_multivolume = false;

  $view_type = 'single';
 
  if ($type === 'books') {
    $is_multivolume = dlts_viewer_is_multivolume($identifier);
  }

  if ($type === 'photos' && is_null($sequence)) {
    $view_type = 'gallery';
  }

  if (is_null($sequence)) {
    $sequence = 1;
  }

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

    default:

      $template = 'viewer_embed_mirador_ext_page';

      $basePath = "$module/viewers/mirador4/dist";

      // Find the JS and CSS files regardless of hash.
      $jsFiles = glob("$basePath/mirador4.*.js");

      $cssFiles = glob("$basePath/mirador4.*.css");

      $jsFile = $jsFiles ? basename($jsFiles[0]) : '';

      $cssFile = $cssFiles ? basename($cssFiles[0]) : '';

      $modulePath = base_path() . $module;

      $opts = [
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
        'is_multivolume' => $is_multivolume ? 'true' : 'false',
        'js_url' => "$modulePath/viewers/mirador4/dist/$jsFile",
        'css_url' => "$modulePath/viewers/mirador4/dist/$cssFile",
        'embeded' => 'false',
        'show_canvas_info' => 'false',
        'show_collection' => 'false',
        'show_image_tools' => 'true',
        'enable_history' => 'false',
        'workspace_view' => 'mosaic', 
        'view_type' => $view_type, // Configure which viewing mode (e.g. single, book, gallery) for windows to be opened in
      ];

      break;
  }

  echo theme($template, $opts);

}

function dlts_viewer_embed_edit_dispatcher($object) {
  if (is_object($object)) {
    $node = node_load($object->nid);
    drupal_goto("node/{$node->nid}/edit");
  }
  drupal_not_found();
}
