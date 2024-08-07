<?php

/**
 * @file
 * Include routes (menu).
 */

/**
 * Load routes.
 *
 * @link https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_menu/7
 */
function dlts_viewer_menu() {
  $menu = [];
  foreach (file_scan_directory(drupal_get_path('module', 'dlts_viewer') . '/inc/routes', '/.*\.inc$/') as $absolute => $file) {
    include_once $absolute;
    $callback = '_dlts_viewer_menu_' . $file->name;
    if (function_exists($callback)) {
      $menu = array_merge($menu, $callback());
    }
  }
  return $menu;
}
