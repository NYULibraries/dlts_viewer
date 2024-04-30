<?php

/**
 * @file
 * API Photos endpoint.
 */

// full/max/0/default.jpg
// api/iiif/photos/%dlts_photo_handle/%dlts_photo_sequence/%dlts_iiif_region/%dlts_iiif_size/%dlts_iiif_rotation/%dlts_iiif_quality
function dlts_viewer_dlts_photo_sequence_image_iiif($entity, $sequence, $region = 'full', $size = 'max', $rotation = 0, $quality = 'default.jpg') {
  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');
  if (!empty($sequence['cm']['uri'])) {
    $static_source = variable_get('dlts_image_static_source', 'FilesystemSource');
    switch ($static_source) {
      case 'FilesystemSource':
        $image_id = str_replace('fileserver://', '', $sequence['cm']['uri']);
        break;

      case 'HttpSource':
        $image_id = file_create_url($sequence['cm']['uri']);
        break;
    }

    $uri = urlencode($image_id);

    $image = "$image_server/iiif/2/$uri/$region/$size/$rotation/$quality";

    $arrContextOptions = [
      'ssl' => [
        'verify_peer' => FALSE,
        'verify_peer_name' => FALSE,
      ],
      'http' => [
        'timeout' => 300,  // 300 Seconds is 5 Minutes
      ],
    ];

    $content = file_get_contents(
      $image,
      FALSE,
      stream_context_create($arrContextOptions)
    );

    $original_image_source = file_create_url($sequence['cm']['uri']);

    $requestStatus = substr($http_response_header[0], 9, 3);

    $responseType = substr($http_response_header[7], 14);

    if ($content && $requestStatus === '200' && $responseType === 'image/jpeg') {
      $etag = md5($content);
      header('Content-type: image/jpeg');
      header('Access-Control-Allow-Origin: *');
      header('Access-Control-Allow-Methods: GET');
      header("Content-Transfer-Encoding: binary");
      header("Master-Image: $original_image_source");
      header("Etag: $etag");
      echo $content;
      exit(0);
    } else {
      if (isset($http_response_header)) {
        header($http_response_header[0], TRUE, 400);
        $error = [
          'response' => [
            'message' => $http_response_header,
            'error' => $http_response_header[0],
            'imageSource' => $original_image_source,
            'request' => $image,
          ],
        ];
        drupal_json_output($error);
        die();
      } else {
        header('HTTP/1.1 400 Bad Request', TRUE, 400);
        die('HTTP/1.1 400 Bad Request');
      }
      exit(1);
    }
  }
}
