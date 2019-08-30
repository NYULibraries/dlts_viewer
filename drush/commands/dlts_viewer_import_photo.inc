<?php

function dlts_viewer_import_photo ($source = NULL) {

  include_once(__DIR__ . '/inc/common.inc');

  include_once(__DIR__ . '/inc/datasource.inc');

  include_once(__DIR__ . '/inc/create.inc');

  $file = drush_get_option('file');

  if (!$source) {
    $source = drush_get_option('source', NULL);
    if (!$source) {
      drush_log('No source to import ', 'error');
      return;
    }
  }

  if (!empty($file) && (!file_exists($file))) {
    drush_log("file option: $file is specified and must exist", "error");
    return;
  }

  if (is_dir($source) && is_null($file)) {
    create_dlts_photo_set_from_json(file_scan_directory($source, '/(.*)\.json$/', array('recurse' => FALSE)));
  } elseif (is_dir($source) && (!empty($file))) {
    $handle = @fopen($file, "r") or exit("unable to open file ($file)");
    if ($handle) {
      while (($line = fgets($handle, 4096)) !== false) {
        $fn = trim($line);
        $full_file = "$source/$fn";
        if (file_exists($full_file)) {
          create_dlts_photo_set_from_json(array((object) array('uri' => $full_file)));
        }
        elseif (!file_exists($full_file)){
          drush_log("file listed in $file: $full_file, does not exist","error");
        }
      }
    }
  } else {
    return create_dlts_photo_set_from_json(array((object) array('uri' => $source)));
  }

}
