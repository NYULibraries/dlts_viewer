<?php

/**
 * @file
 * Admin callbacks.
 */

/**
 * Register Admin routes.
 *
 * @return array
 *   Items to register in the menu system.
 */
function _dlts_viewer_menu_admin() {

  $items = [];

  /*
   * Admin page to administer the fileServer and the
   * fileServer stream wrapper
   */
  $items['admin/viewer/config'] = [
    'title' => 'Viewer: Administer and configure',
    'description' => 'Administer and configure viewer.',
    'page callback' => 'drupal_get_form',
    'page arguments' => ['dlts_viewer_admin'],
    'access arguments' => ['administer fileserver'],
    'file' => 'inc/admin.inc',
  ];

  /*
   * Convinient way to edit object
   */
  $items['books/%dlts_resource/edit'] = $items['photos/%dlts_resource/edit'] = $items['maps/%dlts_resource/edit'] = [
    'title' => 'Edit object',
    'access arguments' => ['edit any dlts_book content'],
    'page callback' => '_dlts_viewer_edit_redirect',
    'page arguments' => [0, 1],
    'load arguments' => ['%map', '%index'],
    'type' => MENU_CALLBACK,
  ];

  return $items;
}
