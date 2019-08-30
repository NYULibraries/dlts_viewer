<?php

function dlts_viewer_update_mongo_record () {

    /**
     * Load MongoDB helper
     */
    module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

    $isPartOf = 'ifa_frdl_book000002';

    // viewer defaults to single page view
    $collection = 'dlts_books_page';

    $entity = dlts_book_load($isPartOf);

    $wrapper = entity_metadata_wrapper('node', $entity);

    $sequence = (int) $wrapper->field_sequence_count->value();

    $page = 1;

    while ($sequence > $page) {

        $result = dlts_viewer_mongodb_load_sequence($page, $isPartOf);

        $options = array(
            'method' => 'GET',
            'timeout' => 15,
        );

        if ($result) {
            error_log("isPartOf $isPartOf", 3, '/var/tmp/dlts_viewer.log');
            error_log("Sequence $page", 3, '/var/tmp/dlts_viewer.log');
            // error_log(print_r($result, true), 3, '/var/tmp/dlts_viewer.log');
        }

        // Vagran can't reach container using 127.0.0.1
        // $image_server_url = variable_get('dlts_viewer_djatoka_service', 'http://192.168.0.8');
        $image_server_url = 'http://192.168.0.3:8182';

        // when using HttpSource source we need to escape certain characters
        // see: https://cantaloupe-project.github.io/manual/4.1/sources.html#HttpSource
        // $image_id = urlencode(file_create_url($result['cm']['uri']));

        if (strpos($result['cm']['uri'], 'fileserver://') !== false) {

            $image_id = urlencode(str_replace('fileserver://',  '', $result['cm']['uri']));

            $image_metadata_uri = $image_server_url . '/iiif/2/' . $image_id . '/info.json';

            $metadata = drupal_http_request($image_metadata_uri, $options);

            if ($metadata) {

                // update $result reference with Image Server requested metadata
                $result['iiif'] = json_decode($metadata->data);

                error_log(print_r($metadata, true), 3, '/var/tmp/dlts_viewer.log');

                // update sequence record
                dlts_viewer_mongodb_update_sequence($result, $collection);

            }
            else {
                drush_log('Request fail', 'error');
            }
        }

        ++$page;

        continue;

    }

}


