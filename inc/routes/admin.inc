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
    'page arguments' => [ 'dlts_viewer_admin' ],
    'access arguments' => [ 'administer fileserver' ],
    'file' => 'inc/admin.inc',
  ];

  /*
   * Convenient way to edit object
   * e.g., /admin/content/princeton_aco004434/edit
   */
  $items['admin/content/%dlts_resource/edit'] = [
    'title' => 'Edit resource',
    'access arguments' => [ 'edit any resource' ],
    'page callback' => '_dlts_viewer_edit_redirect',
    'page arguments' => [ 1, 2 ],
    'type' => MENU_CALLBACK,
  ];

  $items['books/%dlts_resource/edit'] = [
    'title' => 'Edit resource',
    'access arguments' => [ 'edit any resource' ],
    'page callback' => '_dlts_viewer_edit_redirect',
    'page arguments' => [ 0, 1 ],
    'type' => MENU_CALLBACK,
  ];

  $items['photos/%dlts_resource/edit'] = [
    'title' => 'Edit resource',
    'access arguments' => [ 'edit any resource' ],
    'page callback' => '_dlts_viewer_edit_redirect',
    'page arguments' => [ 0, 1 ],
    'type' => MENU_CALLBACK,
  ];

  $items['admin/config/services/iiif-cache'] = [
    'title' => 'IIIF Manifest Cache',
    'description' => 'Manage and purge cached IIIF Presentation manifests.',
    'page callback' => 'dlts_viewer_cache_admin_page',
    'access arguments' => ['administer site configuration'],
    'type' => MENU_NORMAL_ITEM,
  ];

  // Hidden path for the purge action
  $items['admin/config/services/iiif-cache/purge/%/%'] = [
    'page callback' => 'dlts_viewer_cache_purge_action',
    'page arguments' => [5, 6],
    'access arguments' => ['administer site configuration'],
    'type' => MENU_CALLBACK,
  ];

  return $items;

}
