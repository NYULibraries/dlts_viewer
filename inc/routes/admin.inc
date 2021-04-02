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

  $items = array();

  /*
   * Admin page to administer the fileServer and the
   * fileServer stream wrapper
   */
  $items['admin/config/media/viewer'] = array(
    'title' => 'Administer and configure viewer',
    'description' => 'Administer and configure viewer.',
    'page callback' => 'drupal_get_form',
    'page arguments' => array('dlts_viewer_admin'),
    'access arguments' => array('administer fileserver'),
    'file' => 'inc/admin.inc',
  );

  $items['admin/list/topics/%dlts_collection'] = array(
    'title' => 'List topics',
    'access arguments' => array('dlts topic api'),
    'page callback' => 'dlts_viewer_admin_list_topics',
    'page arguments' => array(3),
    'file' => 'inc/admin.inc',
  );

  $items['admin/list/topics/%dlts_collection/%'] = array(
    'title' => 'List topics',
    'access arguments' => array('dlts topic api'),
    'page callback' => 'dlts_viewer_admin_list_topics_',
    'page arguments' => array(3, 4),
    'file' => 'inc/admin.inc',
  );

  /*
   * Convinient way to edit object
   */
  $items['books/%dlts_resource/edit'] =
  $items['photos/%dlts_resource/edit'] =
  $items['maps/%dlts_resource/edit'] = array(
    'title' => 'Edit object',
    'access arguments' => array('edit any dlts_book content'),
    'page callback' => '_dlts_viewer_edit_redirect',
    'page arguments' => array(0, 1),
    'load arguments' => array('%map', '%index'),
    'type' => MENU_CALLBACK,
  );

  return $items;
}
