<?php

function dlts_viewer_iiif_api($type, $isPartOf, $sequence = 1) {

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');  

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf);

  $image_id = urlencode(str_replace('fileserver://', '', $result['cm']['uri']));

  $uri = urlencode(file_create_url($result['cm']['uri']));

  // $uri if httpSource
  // $image_id if local

  $image_metadata_uri = $image_server . '/iiif/2/' . $image_id . '/info.json';

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

# Region https://iiif.io/api/image/3.0/#4-image-requests
# http://localhost:9000/iiif/2/books/uaena_aco000016/1/full/max/0/default.jpg
function dlts_viewer_iiif_tile($type, $isPartOf, $sequence = 1, $region = 'full', $size = 'max', $rotation = 0, $quality = 'default.jpg') {
  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');  

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf);

  $image_id = urlencode(str_replace('fileserver://', '', $result['cm']['uri']));
  
  $uri = urlencode(file_create_url($result['cm']['uri']));

  $image = "$image_server/iiif/2/$image_id/$region/$size/$rotation/$quality";

  $content = file_get_contents($image);

  $requestStatus = substr($http_response_header[0], 9, 3);
  
  $responseType = substr($http_response_header[7], 14);

  if ($content && $requestStatus === '200' && $responseType === 'image/jpeg') {
    $etag = md5($content);
    header('Content-type: image/jpeg');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header("Content-Transfer-Encoding: binary");
    header("Etag: $etag");
    echo $content;
    exit(0);
  } else {
    if (isset($http_response_header)) {
      
      header('HTTP/1.1 400 Bad Request', true, 400);
      die('HTTP/1.1 400 Bad Request');
    } else {
      header('HTTP/1.1 400 Bad Request', true, 400);
      die('HTTP/1.1 400 Bad Request');
    }
    exit(1);
  }

}
