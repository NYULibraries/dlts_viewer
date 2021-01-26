<?php

/**
 * @file
 * IIIF API callbacks.
 * @link https://iiif.io/technical-details/
 */

/**
 * Proxy Image service.
 * @link http://localhost:9000/api/image/books/uaena_aco000016/1/info.json
 *
 * @param string $type
 *   Entity type.
 * @param object $resource
 *   Node entity.
 * @param array $resource_sequence
 *   Sequence record.
 * @param bool $cache
 *   True if can return cached version of the request.
 *
 * @return array
 *   Resource as array.
 */
function dlts_viewer_iiif_api($type, object $resource, array $resource_sequence, $cache = TRUE) {

  // @todo While I develop.
  $cache = FALSE;

  $wrapper = entity_metadata_wrapper('node', $resource);

  $identifier = $wrapper->field_identifier->value();

  $realpath = drupal_realpath('public://');

  $dir_path = "$realpath/iiif/$type/$identifier";

  $sequence = $resource_sequence['sequence'];

  $file_destination = "$dir_path/$sequence.json";

  if ($cache && file_exists($file_destination)) {
    return drupal_json_decode(
      file_get_contents($file_destination)
    );
  }

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');

  $static_source = variable_get('dlts_image_static_source', 'HttpSource');

  switch ($static_source) {
    case 'FilesystemSource':
      $image_id = $resource_sequence['fid'];
      break;

    case 'HttpSource':
      $image_id = $resource_sequence['url'];
      break;
  }

  $uri = urlencode($image_id);

  $response = drupal_http_request(
    "$image_server/iiif/2/$uri/info.json",
    array(
      'method' => 'GET',
      'timeout' => 15,
    )
  );

  if ($response) {
    if ($response->code == '200' && isset($response->data)) {
      drupal_register_shutdown_function(
        'dlts_viewer_cache_book_sequence',
        array(
          'type' => $type,
          'resource' => $resource,
          'sequence' => $sequence['sequence'][0],
          'data' => $response->data,
        )
      );
      return drupal_json_decode($response->data);
    }
  }

}

/**
 * Returns III Image tile.
 * @link https://iiif.io/api/image/3.0/#4-image-requests
 * @link http://localhost:9000/iiif/2/books/uaena_aco000016/1/full/max/0/default.jpg
 *
 * @param string $type
 *   Resource type.
 * @param object $resource
 *   Node.
 * @param string $sequence
 *   Mongo DB object.
 * @param string $region
 *   Defines the rectangular portion of the underlying image content.
 * @param string $size
 *   Specifies the dimensions to which the extracted region.
 * @param int $rotation
 *   Mirroring and rotation.
 * @param string $quality
 *   Whether the image is delivered in color, grayscale or black and white.
 */
function dlts_viewer_iiif_tile($type, $resource, $sequence, $region = 'full', $size = 'max', $rotation = 0, $quality = 'default.jpg') {

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');

  $static_source = variable_get('dlts_image_static_source', 'HttpSource');

  switch ($static_source) {
    case 'FilesystemSource':
      $image_id = str_replace(file_create_url('fileserver://'), '', $sequence['uri']);
      break;

    case 'HttpSource':
      $image_id = $sequence['uri'];
      break;
  }

  $uri = urlencode($image_id);

  $image = "$image_server/iiif/2/$uri/$region/$size/$rotation/$quality";

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

/**
 * IIIF Presentation API v3 - Book manifest.
 *
 * @link https://manifests.sub.uni-goettingen.de/iiif/presentation/PPN857449303/manifest
 * @link http://localhost:9000/api/3/presentation/books/princeton_aco000102/manifest.json
 *
 * @param object $entity
 *   Book node.
 * @param bool $cache
 *   TRUE if is ok to return a cached (in-disk) version of the manifest. Set
 *   to false if the manifest needs to be recreated from database.
 *
 * @return array
 *   IIIF Presentation API v3 - Book manifest as array.
 */
function dlts_viewer_iiif_book_manifest($entity, $cache = TRUE) {

  // While I develop.
  $cache = FALSE;

  global $base_url;

  $wrapper = entity_metadata_wrapper('node', $entity);

  $identifier = $wrapper->field_identifier->value();

  $realpath = drupal_realpath('public://');

  $type = 'books';

  $dir_path = $realpath . '/iiif/' . $type . '/' . $identifier;

  $file_destination = "$dir_path/manifest.json";

  if ($cache && file_exists($file_destination)) {
    // @todo Thinks about this, we are decoding a JSON file
    // so that we can pass it to drupal_json_output
    // and then json_encode it again...
    // should we create another output callback?
    return drupal_json_decode(
      file_get_contents($file_destination)
    );
  }

  module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.book');

  module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.collection');

  $fields = array();

  $series = array();

  $volumes = array();

  $collections = array();

  $availableLanguages = language_list();

  // Default to left-to-rigth.
  // will set later on using the book field "field_language_code"
  // and the language map from $availableLanguages.
  $viewingDirection = 'left-to-right';

  $behavior = array('individuals');

  $isMultivolume = FALSE;

  $sequence_count = $wrapper->field_sequence_count->value();

  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);

  $translations = array(
    $entity->language => $wrapper,
  );

  $search_nid = array_search($entity->nid, $nids);

  if ($search_nid !== FALSE) {
    unset($nids[$search_nid]);
  }

  foreach (node_load_multiple($nids) as $node) {
    $translations[$translation->language] = entity_metadata_wrapper('node', $node);
  }

  $label = array();

  $items = array();

  $types = dlts_utilities_content_types_type($entity->type);

  $summary = array();

  foreach ($translations as $translation) {
    // Entity language.
    $language = $translation->language->value();
    foreach ($types['fields'] as $field) {
      // Machine name of field.
      $field_name = $field['field_name'];
      // Get the raw value of the field.
      $raw_value = $wrapper->$field_name->value();
      // Name of the field.
      $name = str_replace('field_', '', $field_name);
      // Localize label of the field.
      $label = locale($field['label'], NULL, $language);
      // Field value.
      $value = $translation->$field_name->value();
      // Fields.
      switch ($name) {
        case 'title':
          if (!empty($value)) {
            if (!isset($fields[$field_name]['label'][$language])) {
              $fields[$field_name]['label'][$language] = array($label);
            }
            if (!isset($fields[$field_name]['value'][$language])) {
              $fields[$field_name]['value'][$language] = array($value);
            }
          }
          break;

        case 'read_order':
          // [0] => Left to right
          // [1] => Right to left
          $lang_map = array(
            0 => 'left-to-right',
            1 => 'right-to-left',
          );
          $viewingDirection = $lang_map[$value];
          $fields[$name]['value'][$node->language][] = $viewingDirection;
          break;
      }
    }
  }

  if ($sequence_count > 1) {
    $behavior = array('paged');
  }

  $collection_name = 'dlts_books_page';

  $sequences = dlts_viewer_mongodb_load_resource_by_identifier($identifier, $collection_name);

  foreach ($sequences as $page) {
    // This index is a hack until I figure out the MongoDB query to
    // remove duplicates.
    $items[$page['realPageNumber'] - 1] = dlts_viewer_iiif_book_page_canvas(
      $type,
      $entity,
      array(
        'sequence' => $page['sequence'],
        'width' => $page['cm']['width'],
        'height' => $page['cm']['height'],
      )
    );
  }

  $res = array(
    '@context' => array(
      'http://www.w3.org/ns/anno.jsonld',
      'http://iiif.io/api/presentation/3/context.json',
    ),
    'id' => "$base_url/api/3/presentation/$type/$identifier/manifest.json",
    'type' => 'Manifest',
    'label' => $label,
    'metadata' => array_values($fields),
    'viewingDirection' => $viewingDirection,
    'homepage' => array(
      array(
        // I will have to figure out how to get the sites URL.
        'id' => "$base_url/$type/$identifier/1",
        'type' => 'Text',
        'label' => array(
          'en' => array(
            'View on NYU DLTS Viewer',
          ),
        ),
        'format' => 'text/html',
      ),
    ),
    // 'logo' => array(
    //   array(
    //     'id' => '/full/256,/0/default.jpg',
    //     'type' => 'Image',
    //     'service' => array(
    //       'type' => 'ImageService2',
    //       'profile' => 'level1',
    //       'id' => '/'
    //     ),
    //   ),
    // ),
    // 'thumbnail' => array(
    //   array(
    //     '@id' => '/full/256,/0/default.jpg',
    //     'service' => array(
    //       'type' => 'ImageService2',
    //       'profile' => 'level1',
    //       '@id' => '/'
    //     ),
    //   ),
    // ),
    'requiredStatement' => array(
      'label' => array(
        'en' => array(
          'Terms of Use',
        ),
      ),
      'value' => array(
        'en' => array(
          'Terms of use: http://digital.bodleian.ox.ac.uk/terms.html',
        ),
      ),
    ),
    // 'partOf' => array(),
    'behaviour' => $behavior,
    'items' => $items,
    // 'structures' => array(),
  );

  if (!empty($summary)) {
    $res['summary'] = $summary;
  }

  // drupal_register_shutdown_function(
  //   'dlts_viewer_cache_book_manifest',
  //   array(
  //     'type' => $type,
  //     'resource' => $entity,
  //     'data' => $res,
  //   )
  // );

  // // check if this books is part of a multi-volume
  // $multivolume_book = dlts_viewer_is_multivolume_book($resource);

  // // if book is part of multi-volume; append volume value to entity title
  // if ($multivolume_book) {
  //   $isMultivolume = true;
  //   // wrapp multi-volume entity with Entity API wrapper
  //   $wrapper = entity_metadata_wrapper('node', $multivolume_book);
  //   // get volume value
  //   $volume_number_str = $wrapper->field_volume_number_str->value();
  //   // change entity title
  //   $title = t('@title @volume', array(
  //     '@title' => $multivolume_book->title,
  //     '@volume' => $volume_number_str,
  //     )
  //   );
  //   $multivolume_books = dlts_viewer_books_isPartof_multivolume($wrapper->field_multivol->value()->nid);
  //   foreach ($multivolume_books as $mb) {
  //     // wrapp multi-volume entity with Entity API wrapper
  //     $mb_wrapper = entity_metadata_wrapper('node', $mb);
  //     $volume = $mb_wrapper->field_volume_number->value();
  //     // the book we map to this multivolume
  //     $bs_wrapper = entity_metadata_wrapper('node', $mb_wrapper->field_book->value());
  //     $volumes[$volume] = array(
  //       'identifier' => $bs_wrapper->field_identifier->value(),
  //       'selected' => ($bs_wrapper->nid->value() == $entity->nid),
  //       'title' => t('@title @volume', array(
  //         '@title' => $mb->title,
  //         '@volume' => $mb_wrapper->field_volume_number_str->value(),
  //         )
  //       ),
  //     );
  //     unset($mb_wrapper);
  //   }
  //   unset($multivolume_books);
  //   asort($volumes);
  // }

  // $series_books = dlts_viewer_series_book($entity->nid);

  // $isSeries = false;

  // if (!empty($series_books)) {
  //   $isSeries = true;
  //   foreach ($series_books as $series_book) {
  //     $series_wrapper = entity_metadata_wrapper('node', $series_book);
  //     $series_volume_number_str = trim($series_wrapper->field_volume_number_str->value());
  //     $series_title = t(
  //       '@title, @volume',
  //       array(
  //         '@title' => trim($series_wrapper->title->value()),
  //         '@volume' => $series_volume_number_str,
  //       )
  //     );
  //     $series_book_identifier = $series_wrapper->field_identifier->value();
  //     $parent = $series_wrapper->field_series->value();
  //     $parent_wrapper = entity_metadata_wrapper('node', $parent);
  //     $parent_title = trim($parent_wrapper->title->value());
  //     $parent_identifier = $parent_wrapper->field_identifier->value();
  //     $series[] = array(
  //       'title' => $series_title,
  //       'identifier' => $series_book_identifier,
  //       'isPartOf' => array(
  //         'title' => $parent_title,
  //         'identifier' => $parent_identifier,
  //       ),
  //     );
  //   }
  //   unset($series_volume_number_str);
  //   unset($series_title);
  //   unset($parent_series);
  //   unset($series_wrapper);
  //   unset($parent_wrapper);
  //   unset($series_books);
  // }

  return $res;

}

function dlts_viewer_iiif_book_page_canvas($type, $resource, $page) {
  global $base_url;

  $sequence = $page['sequence'][0];

  $item = 1;

  $wrapper = entity_metadata_wrapper('node', $resource);

  $identifier = $wrapper->field_identifier->value();

  return array(
    'id' => "$base_url/api/3/presentation/$type/$identifier/canvas/$sequence",
    'type' => 'Canvas',
    'label' => array(
      'en' => array(
        (string) $sequence,
      ),
    ),
    'width' => $page['width'],
    'height' => $page['height'],
    'items' => array(
      dlts_viewer_iiif_book_page_annotation_page(
        $type,
        $resource,
        $page,
        $item
      ),
    ),
  );
}

// AnnotationPage.
// @link https://iiif.io/api/presentation/3.0/#overview-annotationpage
// @link http://localhost:9000/api/v1/books/princeton_aco000102/canvas/p193/1
function dlts_viewer_iiif_book_page_annotation_page($type, $book, $page, $item) {
  global $base_url;
  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $book);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $page['sequence'][0];
  return array(
    'id' => "$base_url/api/3/presentation/$type/$identifier/page/$sequence",
    'type' => 'AnnotationPage',
    'items' => array(
      dlts_viewer_iiif_annotation($type, $book, $page),
    ),
  );
}

// Annotation.
// @link http://localhost:9000/api/3/presentation/books/princeton_aco000102/annotation/painting/1
function dlts_viewer_iiif_annotation($type, $book, $item) {
  global $base_url;
  // Wrapp book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $book);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $item['sequence'][0];
  $image = "$base_url/api/image/$type/$identifier/$sequence/info.json";
  return array(
    'id' => "$base_url/api/iiif/3/presentation/$type/$identifier/annotation/painting/$sequence",
    'type' => 'Annotation',
    'motivation' => 'painting',
    'target' => "$base_url/api/iiif/3/presentation/$type/$identifier/canvas/$sequence",
    'body' => array(
      'type' => 'Image',
      'id' => $image,
      'format' => 'image/jpeg',
      'label' => 'Primary Colour',
      'height' => $item['height'],
      'width' => $item['width'],
      'service' => array(
        'type' => 'ImageService2',
        'profile' => 'level1',
        'id' =>  $image,
      ),
    ),
  );
}

function dlts_viewer_cache_book_sequence($edit) {

  $wrapper = entity_metadata_wrapper('node', $edit['resource']);

  $identifier = $wrapper->field_identifier->value();

  $type = $edit['type'];

  $sequence = $edit['sequence'];

  $realpath = drupal_realpath('public://');

  $dir_path = $realpath . '/iiif/' . $type . '/' . $identifier;

  $file_destination = "$dir_path/$sequence.json";

  file_prepare_directory($dir_path, FILE_CREATE_DIRECTORY);

  file_unmanaged_save_data($edit['data'], $file_destination, FILE_EXISTS_REPLACE);

  watchdog('dlts_viewer', 'Cached sequence %sequence for type %type with identifier equals to %identifier. See %uri', array(
    '%identifier' => $identifier,
    '%sequence' => $sequence,
    '%type' => $type,
    '%uri' => $file_destination,
  ), WATCHDOG_INFO);
}

function dlts_viewer_cache_book_manifest($edit) {

  $wrapper = entity_metadata_wrapper('node', $edit['resource']);

  $identifier = $wrapper->field_identifier->value();

  $type = $edit['type'];

  $realpath = drupal_realpath('public://');

  $dir_path = $realpath . '/iiif/' . $type . '/' . $identifier;

  $file_destination = "$dir_path/manifest.json";

  file_prepare_directory($dir_path, FILE_CREATE_DIRECTORY);

  file_unmanaged_save_data(
    drupal_json_encode($edit['data']),
    $file_destination,
    FILE_EXISTS_REPLACE
  );

  watchdog('dlts_viewer', 'Cached manifest %manifest', array(
    '%manifest' => $file_destination,
  ), WATCHDOG_INFO);

}
