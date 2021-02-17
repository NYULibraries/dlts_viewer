<?php

/**
 * @file
 * Create postcard.
 */

/**
 * Create postcard.
 *
 * @parameter $source
 *  Postcard metadata.
 *
 * @example @dlts_viewer_content/books/fales_io_card000419.en.json
 * @example curl -c ./cookie -vvv -X POST -H 'Content-Type: application/json' -d '{"username": "publisher","password": "sVpgdCZ7FCvYqBi"}' http://localhost:9000/api/v0/import/user/login.json -k
 * @example curl -b ./cookie -X POST --data "@dlts_viewer_content/books/fales_io_card000419.en.json" http://localhost:9000/api/v1/objects | jq .
 *
 * @return array
 *   Array to returns as JSON.
 */
function dlts_viewer_api_v1_dlts_postcard_objects($source) {
  module_load_include('inc', 'dlts_viewer', 'inc/create/postcard');
  $apiVersion = 'v1';
  try {
    if ($source['entity_type'] !== 'dlts_postcard') {
      throw new Exception('Wrong entity type.');
    }
    // Check if request has all the keys we required.
    if (
      isset($source['entity_type']) &&
      isset($source['identifier']) &&
      isset($source['entity_language']) &&
      isset($source['entity_status']) &&
      isset($source['entity_type']) &&
      isset($source['metadata'])
    ) {
      if (!isset($source['entity_title'])) {
        throw new Exception('Field entity_title can not be empty.');
      }
      if (!isset($source['identifier'])) {
        throw new Exception('Field identifier can not be empty.');
      }
      $entity = create_dlts_postcard_from_json($source);
      if ($entity) {
        return array(
          'data' => $entity,
        );
      }
      else {
        return ['NO YOLO'];
      }
    }
  }
  catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), array(), WATCHDOG_CRITICAL);
    die($e->getMessage());
  }
}
