<?php

function dlts_viewer_iiif_data ($type, $isPartOf, $sequence = 1) {

  $image_server = variable_get('dlts_viewer_image_server', 'http://127.0.0.1:8182');  
  
  // while I develop
  if (
      isset($_SERVER['SERVER_NAME']) 
      && $_SERVER['SERVER_NAME'] == 'viewer.local' || $_SERVER['SERVER_NAME'] == 'localhost'
  ) {
    if (isset($_SERVER['REMOTE_ADDR'])) {
      $image_server = 'http://' . $_SERVER['REMOTE_ADDR'] . ':8182';
    }
  } else {
      // off until we have something to use
      // I can only test locally at the moment
      // waiting for the server to be up
      return false;
  }

  $image_server = 'http://192.168.0.11:8182';
  
  // $image_server = 'http://192.168.0.4:8182';
  $options = array(
    'method' => 'GET',
    'timeout' => 15,
  );

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf);

  $image_id = urlencode(str_replace('fileserver://',  '', $result['cm']['uri']));

  $uri = file_create_url($result['cm']['uri']);

  $image_metadata_uri = $image_server . '/iiif/2/' . urlencode($uri) . '/info.json';

  $response = drupal_http_request($image_metadata_uri, $options);

  if ($response) {
    if ($response->code == '200' && isset($response->data)) {
      return drupal_json_decode($response->data);
    }
  }
  
}
