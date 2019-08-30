<?php

function dlts_viewer_import_map ($source = NULL) {
    include_once(__DIR__ . '/inc/common.inc');
    include_once(__DIR__ . '/inc/datasource.inc');
    include_once(__DIR__ . '/inc/create.inc');

    if (!$source) {
        $source = drush_get_option('source', NULL);
        if (!$source) {
            drush_log('No source to import ', 'error');
            return;
        }
    }

    if (is_dir($source)) {
        create_dlts_map_from_json(file_scan_directory($source, '/(.*)\.json$/', array('recurse' => FALSE)));
    }

    else {
        return create_dlts_map_from_json(array((object) array('uri' => $source)));
    }
}


