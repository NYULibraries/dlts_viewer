<?php

function dlts_viewer_iiif_data ($type, $isPartOf, $sequence = 1) {

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');  

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf);

  $image_id = urlencode(str_replace('fileserver://', '', $result['cm']['uri']));

  $uri = urlencode(file_create_url($result['cm']['uri']));

  // $uri if httpSource
  // $image_id if local

  $image_metadata_uri = $image_server . '/iiif/2/' . $image_id . '/info.json';

  die($image_metadata_uri);

  $response = drupal_http_request(
    $image_metadata_uri, 
    array(
      'method' => 'GET',
      'timeout' => 15,
    )
  );

  if ($response) {
    if ($response->code == '200' && isset($response->data)) {
      return drupal_json_decode($response->data);
    }
  }
  
}
