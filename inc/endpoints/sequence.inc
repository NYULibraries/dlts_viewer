<?php

function dlts_viewer_update_sequence($type) {

  $query_parameters = drupal_get_query_parameters();

  // MongoDB pagination.
  $page = 0;

  // MongoDB records limit.
  $per_page = 10;

  if (isset($query_parameters['rows'])) {
    $per_page = (int) $query_parameters['rows'];
  }

  $collections = [
    'dlts_book' => 'dlts_books_page',
    'dlts_map' => 'dlts_map_page',
    'dlts_photo_set' => 'dlts_photo',
    'dlts_postcard' => 'dlts_postcard',
    'dlts_collection' => 'dlts_collection',
    'dlts_partner' => 'dlts_partner',
  ];

  if (!isset($collections[$type])) {
    return [ 'error' => 'Type does not exist.' ];
  }

  // IIIF Image Server.
  $image_server = variable_get('dlts_image_server', 'https://image1.dlib.nyu.edu:8183');

  // Collection to search.
  $collection_name = $collections[$type];

  $cursor = mongodb_collection($collection_name)->find([ 'cm.width' => '' ]);

  $cursor->limit($per_page);

  $records = $cursor->skip($per_page * $page);

  $count = (int) $cursor->count();

  if ($count > 0) {
    foreach ($records as $doc) {
      $edit = $doc;
      if (isset($doc['cm']) && isset($doc['cm']['uri'])) {       
        $uri = $doc['cm']['uri'];        
        $image_id = urlencode(str_replace('fileserver://', '', $uri));        
        $response = drupal_http_request("$image_server/iiif/2/$image_id/info.json", [ 'method' => 'GET', 'timeout' => 15 ]);        
        if ($response->code == '200' && isset($response->data)) {
          $data = drupal_json_decode($response->data);
          $edit['cm']['width'] = $data['width'];
          $edit['cm']['height'] = $data['height'];
          unset($edit['cm']['levels']);
          unset($edit['cm']['dwtLevels']);
          unset($edit['cm']['compositingLayerCount']);
          dlts_viewer_mongodb_update_sequence($edit, $collection_name);
        }
      }
    }
  }

  return [ 'needUpdate' => $count ];

}
