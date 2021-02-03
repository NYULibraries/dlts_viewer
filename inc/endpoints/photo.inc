<?php

// full/max/0/default.jpg
// api/iiif/photos/%dlts_photo_handle/%dlts_photo_sequence/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality
function dlts_viewer_dlts_photo_sequence_image_iiif($entity, $sequence, $region = 'full', $size = 'max', $rotation = 0, $quality = 'default.jpg') {
  $image_server = variable_get('dlts_viewer_image_server', 'http://127.0.0.1:8182');
  // $image_server = 'http://192.168.0.102:8182';
  if (!empty($sequence['cm']['uri'])) {
    $image_uri = file_create_url($sequence['cm']['uri']);
    $url = "$image_server/iiif/2/" . urlencode($image_uri) . "/$region/$size/$rotation/$quality";
    $arrContextOptions = array(
      'ssl' => array(
        'verify_peer' => FALSE,
        'verify_peer_name' => FALSE,
      ),
    );
    $content = file_get_contents(
      $url,
      FALSE,
      stream_context_create($arrContextOptions)
    );
    $requestStatus = substr($http_response_header[0], 9, 3);
    $responseType = substr($http_response_header[7], 14);
    if ($content && $requestStatus === '200' && $responseType === 'image/jpeg') {
      $etag = md5($content);
      header('Content-type: image/jpeg');
      header('Access-Control-Allow-Origin: *');
      header('Access-Control-Allow-Methods: GET');
      header("Content-Transfer-Encoding: binary");
      header("Original-Image-Source: $image_uri");
      header("Etag: $etag");
      echo $content;
      exit(0);
    }
    else {
      if (isset($http_response_header)) {
        header('HTTP/1.1 400 Bad Request', TRUE, 400);
        die('HTTP/1.1 400 Bad Request');
      }
      else {
        header('HTTP/1.1 400 Bad Request', TRUE, 400);
        die('HTTP/1.1 400 Bad Request');
      }
      exit(1);
    }
  }
}
