<?php

function dlts_viewer_iiif_api($type, $isPartOf, $sequence = 1) {

  $wrapper = entity_metadata_wrapper('node', $isPartOf);

  $identifier = $wrapper->field_identifier->value();

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');

  $image_id = str_replace(file_create_url('fileserver://'), '', $sequence['uri']);

  $uri = urlencode($image_id);

  $image_metadata_uri = $image_server . '/iiif/2/' . $uri . '/info.json';

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

// Region https://iiif.io/api/image/3.0/#4-image-requests
// @link http://localhost:9000/iiif/2/books/uaena_aco000016/1/full/max/0/default.jpg
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

function dlts_viewer_iiif_book_page_canvas($type, $book, $page) {
  global $base_url;

  $sequence = $page['sequence'][0];

  $item = 1;

  $wrapper = entity_metadata_wrapper('node', $book);

  $identifier = $wrapper->field_identifier->value();

  return array(
    'id' => "$base_url/api/v1/$type/$identifier/canvas/p$sequence",
    'type' => 'Canvas',
    'label' => array(
      'en' => array(
        (string) $sequence,
      ),
    ),
    'width' => $page['width'],
    'height' => $page['height'],
    'items' => array(
      dlts_viewer_iiif_book_page_annotation_page($type, $book, $page, $item)
    ),
  );
}

# https://iiif.io/api/presentation/3.0/#overview-annotationpage
# http://localhost:9000/api/v1/books/princeton_aco000102/canvas/p193/1
function dlts_viewer_iiif_book_page_annotation_page($type, $book, $page, $item) {
  global $base_url;
  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $book);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $page['sequence'][0];
  return array(
    'id' => "$base_url/api/v1/$type/$identifier/page/p$sequence/$item",
    'type' => 'AnnotationPage',
    'items' => array(
      dlts_viewer_iiif_annotation($type, $book, $page),
    ),
  );
}

// http://localhost:9000/api/v1/books/princeton_aco000102/annotation/p11-image
function dlts_viewer_iiif_annotation($type, $book, $item) {
  global $base_url;
  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $book);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $item['sequence'][0];
  $image = "$base_url/iiif/2/$type/$identifier/$sequence";
  return array(
    'id' => "$base_url/api/v1/$type/$identifier/annotation/p$sequence-image",
    'type' => 'Annotation',
    'motivation' => 'painting',
    'body' => array(
      'id' => "$image/full/max/0/default.jpg",
      'type' => 'Image',
      'format' => 'image/jpeg',
      'height' => $item['height'],
      'width' => $item['width'],
      'service' => array(
        array(
          'id' => "$image/info.json",
          'type' => 'ImageService3',
          'profile' => 'level1',
        ),
      ),
    ),
    'target' => "$base_url/api/v1/$type/$identifier/canvas/p$sequence",
  );
}
