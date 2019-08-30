<?php

function dlts_viewer_import_book ($source = NULL, $create_pages = FALSE) {
  include_once(__DIR__ . '/inc/common.inc');
  include_once(__DIR__ . '/inc/datasource.inc');
  include_once(__DIR__ . '/inc/create.inc');
  if (drush_get_option('pages', FALSE)) $create_pages = TRUE;
  if (!$source) {
    $source = drush_get_option('source', NULL);
    if (!$source) {
    	drush_log('No source to import', 'error');
    	return;
    }
  }
  if (is_dir($source)) {
  	create_dlts_book_from_json(file_scan_directory($source, '/(.*)\.en.json$/', array('recurse' => FALSE)), $create_pages);
    // re-think
    create_dlts_book_from_json(file_scan_directory($source, '/(.*)\.ar.json$/', array('recurse' => FALSE)), $create_pages);
  }
  else {
  	return create_dlts_book_from_json(array((object) array('uri' => $source)), $create_pages);
  }
}

