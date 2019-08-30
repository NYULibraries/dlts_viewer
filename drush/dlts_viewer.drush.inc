<?php

/**
 * @file
 * DLTS Viewer
 */

/**
 * Implements hook_drush_command().
 *
 * In this hook, you specify which commands your
 * drush module makes available, what it does and
 * description.
 *
 * Notice how this structure closely resembles how
 * you define menu hooks.
 *
 * @see drush_parse_command()
 *   for a list of recognized keys.
 *
 * @return
 *   An associative array describing your command(s).
 */

function dlts_viewer_drush_command () {

  $items = array();

  $items['import-photo'] = array(
    'callback' => 'dlts_viewer_import_photo',
    'description' => dt('Import photo from JSON document.'),
    'options' => array(
      'source' => dt('JSON document filepath.'),
      'file' => dt('list of JSON files.'),
    ),
  );

  $items['import-map'] = array(
    'callback' => 'dlts_viewer_import_map',
    'description' => dt('Import map from a JSON document.'),
    'options' => array(
      'source' => dt('JSON document filepath.'),
    ),
  );

  $items['import-book'] = array(
    'callback' => 'dlts_viewer_import_book',
    'description' => dt('Import book from a JSON document.'),
    'options' => array(
      'source' => dt('JSON document filepath.'),
      'pages' => dt('Create pages.'),
      'legacy' => dt('Create book using legacy JSON documents.'),
    ),
  );

  $items['update-mongo-record'] = array(
    'callback' => 'dlts_viewer_update_mongo_record',
    'description' => dt('Update book pages record with IFFF V. 2'),
  );

  $items['search-mongo-record'] = array(
    'callback' => 'dlts_viewer_search_mongo_record',
    'description' => dt('Search book pages record.'),
  );

  $items['update-book-topic'] = array(
    'callback' => 'dlts_viewer_update_book_topic',
    'description' => dt('Update book topic from call number'),
  );

//   $items['purge-books'] = array(
//     'callback' => 'dlts_viewer_purge_books',
//     'description' => dt('Purge books'),
//   );

  return $items;

}

/**
 * Implements hook_drush_help().
 *
 * This function is called whenever a drush user calls
 * 'drush help <name-of-your-command>'
 *
 * @param
 *   A string with the help section(prepend with 'drush:')
 *
 * @return
 *   A string with the help text for your command.
 */
function dlts_viewer_drush_help ($section) {
  switch ($section) {
    case 'drush:import-book':
      return dt("Some day someone will document this module");
      break;
  }
}
