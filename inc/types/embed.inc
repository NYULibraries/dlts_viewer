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

  // Map resource type to its viewer theme family. Types with no mapping
  // fall back to the base "light"/"dark" theme.
  $type_theme_prefixes = [
    'books' => 'book',
    'maps' => 'map',
    'photos' => 'photo',
    'serials' => 'serial',
  ];

  // Each resource type has its own default dark/light mode, overridable
  // via the "mode" query parameter.
  $type_default_modes = [
    'books' => 'dark',
    'maps' => 'dark',
    'photos' => 'light',
    'serials' => 'dark',
  ];

  $mode = isset($type_default_modes[$type]) ? $type_default_modes[$type] : 'light';

  if (isset($query_parameters['mode'])) {
    $requested_mode = filter_xss($query_parameters['mode']);

    if (in_array($requested_mode, ['light', 'dark'])) {
      $mode = $requested_mode;
    }
  }

  $theme = isset($type_theme_prefixes[$type]) ? "{$type_theme_prefixes[$type]}_$mode" : $mode;

  if (is_null($sequence)) {
    $sequence = 1;
  }

  // Set entity title.
  drupal_set_title($title);

  $sequence = (int) filter_xss($sequence);

  $total_sequence_count = $wrapper->field_sequence_count->value();

  $module = drupal_get_path('module', 'dlts_viewer');

  $language_list = language_list('enabled');

  $direction = 'ltr';

  if (isset($language_list[1][$language])) {
    $direction = ($language_list[1][$language]->direction == '1') ? 'rtl' : 'ltr';
  }

  $template = 'viewer_embed_mirador_ext_page';

  if (ctype_digit((string) $viewer)) {
    $viewer_dir = "mirador-$viewer";
  }
  else {
    $viewer_dir = 'mirador4';
  }

  $basePath = "$module/viewers/$viewer_dir/dist";

  if (!is_dir($basePath)) {
    watchdog('dlts_viewer', 'Viewer prototype not found: @path', ['@path' => $basePath], WATCHDOG_ERROR);
    drupal_not_found();
    return;
  }

  $jsFile = dlts_viewer_find_asset($basePath, 'js');

  $cssFile = dlts_viewer_find_asset($basePath, 'css');

  if (empty($jsFile) || empty($cssFile)) {
    watchdog('dlts_viewer', 'Viewer assets (js/css) not found in @path', ['@path' => $basePath], WATCHDOG_ERROR);
  }

  $modulePath = base_path() . $module;

  $opts = [
    'analytics' => $analytics,
    'appid' => 'mirador-app',
    'title' => $title,
    'language' => $language,
    'direction' => $direction,
    'sequence' => $sequence,
    'sequence_total_count' => $total_sequence_count,
    'default_view_theme' => $theme,
    'endpoint' => $base_url,
    'type' => $type,
    'identifier' => $identifier,
    'manifest' => "$base_url/api/presentation/" . rawurlencode($type) . '/' . rawurlencode($identifier) . "/manifest.json",
    'is_multivolume' => $is_multivolume ? 'true' : 'false',
    'js_url' => "$modulePath/viewers/$viewer_dir/dist/$jsFile",
    'css_url' => "$modulePath/viewers/$viewer_dir/dist/$cssFile",
    'embeded' => 'false',
    'show_canvas_info' => 'false',
    'show_collection' => 'false',
    'show_image_tools' => 'true',
    'enable_history' => 'false',
    'workspace_view' => 'mosaic',
    // Configure which viewing mode (e.g. single, book, gallery) for windows to be opened in.
    'view_type' => $view_type,
  ];

  echo theme($template, $opts);

}

/**
 * Finds a hashed asset file of a given extension within a directory.
 *
 * @param string $basePath
 *   Directory to search for the "mirador4.*.<extension>" asset.
 * @param string $extension
 *   File extension to search for (e.g. 'js' or 'css').
 *
 * @return string
 *   The basename of the first matching file, or an empty string if none
 *   is found.
 */
function dlts_viewer_find_asset($basePath, $extension) {
  $files = glob("$basePath/mirador4.*.$extension");
  return $files ? basename($files[0]) : '';
}

/**
 * Redirects to the node edit form for the given object, or 404s.
 *
 * @param object $object
 *   Record containing an "nid" property identifying the node to edit.
 */
function dlts_viewer_embed_edit_dispatcher($object) {
  if (is_object($object)) {
    $node = node_load($object->nid);
    drupal_goto("node/{$node->nid}/edit");
  }
  drupal_not_found();
}
