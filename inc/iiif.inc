<?php

/**
 * @file
 * IIIF API callbacks.
 * @link https://iiif.io/technical-details/
 */

/**
 * Proxy Image service.
 * @link http://localhost:9000/api/image/books/uaena_aco000016/1
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
    else {
      return $response;
    }
  }
  else {
    return [
      'code' => 500,
      'error' => 'Unexpected error occurred.',
    ];
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
 * Dispatch resource manifest.
 *
 * @param string $type
 *   Resource type.
 * @param object $entity
 *   Node.
 */
function dlts_viewer_iiif_resource_manifest($type, $entity) {
  $query_parameters = drupal_get_query_parameters();
  // Use cache?
  $cache = TRUE;
  if (isset($query_parameters['reset'])) {
    $cache = FALSE;
  }
  switch ($type) {
    case 'dlts_book':
      return dlts_viewer_iiif_book_manifest($entity, $cache);
  }
}

/**
 * Build metadata values to returs as metadata.
 * @link https://iiif.io/api/presentation/3.0/#metadata
 *
 * @param string $wrapper
 *   Resource Entity wrapper.
 */
function dlts_book_fields_values($wrapper) {
  // Entity language.
  $language = $wrapper->language->value();
  $content_type = node_type_get_type($wrapper->getBundle());
  $fields = [];
  $field_info_instances = field_info_instances('node', $content_type->type);
  foreach ($field_info_instances as $field_name => $field_info_instance) {
    $fields[$field_name] = locale($field_info_instance['label'], NULL, $language);
  }
  // Return the value of all the fields.
  $metadata = [];
  $translatable_fields = [
    'field_author',
    'field_contributor',
    'field_creator',
    'field_editor',
    'field_subtitle',
    'field_description',
    'field_call_number',
    'field_dimensions',
    'field_volume',
    'field_title',
    'field_publication_date_text',
    'field_publication_location',
    'field_identifier',
    'field_isbn',
    'field_language',
    'field_language_code',
    'field_number',
    'field_page_count',
    'field_publisher',
    'field_scanning_notes',
    'field_sequence_count',
    'field_topic',
  ];

  foreach ($translatable_fields as $field_name) {
    $field_value = $wrapper->$field_name->value();
    if (!empty($field_value)) {
      $metadata[$field_name] = [
        'label' => $fields[$field_name],
        'value' => is_array($field_value) ? $field_value : [$field_value],
      ];
    }
  }

  $field_collection_raw = $wrapper->field_collection->value();
  if (!empty($field_collection_raw)) {
    $metadata['field_collection'] = [
      'label' => $fields['field_collection'],
      'value' => [],
    ];
    foreach ($field_collection_raw as $field_collection) {
      $wrapper_collection = entity_metadata_wrapper('node', $field_collection);
      $metadata['field_collection']['value'][] = $wrapper_collection->field_name->value();
    }
  }

  $geographic_subjects = [];
  foreach ($wrapper->field_geographic_subject->getIterator() as $term_wrapper) {
    $geographic_subjects[] = $term_wrapper->name->value();
  }

  if (!empty($geographic_subjects)) {
    $metadata['field_geographic_subject'] = [
      'label' => $fields['field_geographic_subject'],
      'value' => $geographic_subjects,
    ];
  }

  $field_subject_raw = $wrapper->field_subject->value();
  if (!empty($field_subject_raw)) {
    $subjects = [];
    foreach ($field_subject_raw as $subject) {
      $subjects[] = $subject->name;
    }
    if (!empty($subjects)) {
      $metadata['field_subject'] = [
        'label' => $fields['field_subject'],
        'value' => $subjects,
      ];
    }
  }

  $field_handle_raw = $wrapper->field_handle->value();
  if (!empty($field_handle_raw)) {
    $metadata['field_handle'] = [
      'label' => $fields['field_handle'],
      'value' => [
        $field_handle_raw['url'],
      ],
    ];
  }

  $field_other_version_raw = $wrapper->field_other_version->value();
  if (!empty($field_other_version_raw)) {
    $metadata['field_other_version'] = [
      'label' => $fields['field_other_version'],
      'value' => [],
    ];
    foreach ($field_other_version_raw as $field_other_version_value) {
      $metadata['field_other_version']['value'][] = $field_other_version_value['url'];
    }
  }

  $lang_map = array(
    0 => 'Left to right',
    1 => 'Right to left',
  );

  $field_read_order_raw = $wrapper->field_read_order->value();
  if (!empty($field_read_order_raw)) {
    $metadata['field_read_order'] = [
      'label' => $fields['field_read_order'],
      'value' => [
        locale($lang_map[$field_read_order_raw], NULL, $language),
      ],
    ];
  }

  $field_binding_orientation_raw = $wrapper->field_binding_orientation->value();
  if (!empty($field_binding_orientation_raw)) {
    $metadata['field_binding_orientation'] = [
      'label' => $fields['field_binding_orientation'],
      'value' => [
        locale(['Vertical', 'Horizontal'][$field_binding_orientation_raw], NULL, $language),
      ],
    ];
  }

  $field_scan_order_raw = $wrapper->field_scan_order->value();
  if ($field_scan_order_raw) {
    $metadata['field_scan_order'] = [
      'label' => $fields['field_scan_order'],
      'value' => [
        locale(['Left to right', 'Right to left'][$field_binding_orientation_raw], NULL, $language),
      ],
    ];
  }

  $field_partner_raw = $wrapper->field_partner->value();
  if (!empty($field_partner_raw)) {
    $metadata['field_partner'] = [
      'label' => $fields['field_partner'],
      'value' => [],
    ];
    foreach ($field_partner_raw as $field_partner) {
      $wrapper_partner = entity_metadata_wrapper('node', $field_partner);
      $metadata['field_partner']['value'][] = $wrapper_partner->field_name->value();
    }
  }

  // Ask Rasan what I need to do here.
  // $field_geographic_coordinates_raw = $wrapper->field_geographic_coordinates->value();

  return $metadata;

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

  global $base_url;

  module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.collection');

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

  $fields = array();

  $series = array();

  $volumes = array();

  $collections = array();

  $availableLanguages = language_list();

  // https://iiif.io/api/presentation/3.0/#rendering
  $field_pdf_file_raw = $wrapper->field_pdf_file->value();

  $rendering = [];

  if ($field_pdf_file_raw) {
    $pdfs = [];
    foreach ($field_pdf_file_raw as $value) {
      $data = array(
        'uri' => $value['uri'],
        'label' => $value['label'],
      );
      $data['size'] = field_fileserver_get_pdf_filesize($data);
      $data['uri'] = file_create_url($data['uri']);
      $filename = pathinfo($data['uri'], PATHINFO_FILENAME);
      preg_match('/_(hi|lo)/', $filename, $matches);
      if (isset($matches) && isset($matches[1])) {
        switch ($matches[1]) {
          case 'hi':
            $pdfs[] = array(
              'id' => $data['uri'],
              'type' => 'Text',
              'format' => 'application/pdf',
              'label' => [
                'en' => [
                  locale('High-resolution PDF rendering of Book', NULL, 'en') . ' (' . field_fileserver_human_filesize($data['size']) . ')',
                ],
              ],
            );
            break;

          case 'lo':
            $pdfs[] = array(
              'id' => $data['uri'],
              'type' => 'Text',
              'format' => 'application/pdf',
              'label' => [
                'en' => [
                  locale('Low-resolution PDF rendering of Book', NULL, 'en') . ' (' . field_fileserver_human_filesize($data['size']) . ')',
                ],
              ],
            );
            break;
        }
      }
    }
  }

  // Default to left-to-rigth.
  // will set later on using the book field "field_language_code"
  // and the language map from $availableLanguages.
  $viewingDirection = 'left-to-right';

  $lang_map = array(
    0 => 'left-to-right',
    1 => 'right-to-left',
  );

  $field_language_code_raw = $wrapper->field_language_code->value();
  if ($field_language_code_raw) {
    $language_code_raw = dlts_viewer_map_language_code($field_language_code_raw);
    if (isset($availableLanguages[$language_code_raw])) {
      $viewingDirection = $lang_map[$availableLanguages[$language_code_raw]->direction];
    }
  }

  $behavior = array('individuals');

  $sequence_count = $wrapper->field_sequence_count->value();

  $nids = dlts_viewer_get_translations_nid_by_identifier($identifier);

  $translations = array(
    $entity->language => $wrapper,
  );

  $search_nid = array_search($entity->nid, $nids);

  if ($search_nid !== FALSE) {
    unset($nids[$search_nid]);
  }

  foreach ($nids as $nid) {
    $translations[] = entity_metadata_wrapper('node', $nid);
  }

  $items = [];

  $summary = [];

  $values = [];

  $fields = [];

  // https://iiif.io/api/presentation/3.0/#metadata
  foreach ($translations as $translation) {
    $values[$translation->language->value()] = dlts_book_fields_values($translation);
  }

  foreach ($values as $lang => $field) {
    foreach ($field as $name => $value) {
      if (empty($value['value'])) {
        continue;
      }
      if (!isset($fields[$name])) {
        $fields[$name] = [];
      }
      $fields[$name]['label'][$lang] = [$value['label']];
      $fields[$name]['value'][$lang] = $value['value'];
    }
  }

  $field_rights_raw = $wrapper->field_rights->value();
  if ($field_rights_raw) {
    $required_statement = [
      'label' => [
        'en' => [
          locale('Rights', NULL, 'en'),
        ],
      ],
      'value' => [
        'en' => [
          $field_rights_raw,
        ],
      ],
    ];
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
      $wrapper->getBundle(),
      $entity,
      array(
        'sequence' => $page['sequence'],
        'width' => (int) $page['cm']['width'],
        'height' => (int) $page['cm']['height'],
      )
    );
  }

  // Check if this books is part of a multivol.
  $multivolume_book = dlts_viewer_is_multivolume_book($entity);
  // If book is part of multi-volume; append volume value to entity title.
  if ($multivolume_book) {
    $wrapper = entity_metadata_wrapper('node', $multivolume_book);
    // Get volume value.
    $volume_number_str = $wrapper->field_volume_number_str->value();
    // Change entity title.
    foreach ($fields['field_title']['value'] as $key => $value) {
      $fields['field_title']['value'][$key][0] = t('@title @volume', [
        '@title' => $value[0],
        '@volume' => $volume_number_str,
      ]);
    }
    // $multivolume_books = dlts_viewer_books_isPartof_multivolume($wrapper->field_multivol->value()->nid);
    // foreach ($multivolume_books as $mb) {
    //   // wrapp multi-volume entity with Entity API wrapper
    //   $mb_wrapper = entity_metadata_wrapper('node', $mb);
    //   $volume = $mb_wrapper->field_volume_number->value();
    //   // the book we map to this multivolume
    //   $bs_wrapper = entity_metadata_wrapper('node', $mb_wrapper->field_book->value());
    //   $volumes[$volume] = array(
    //     'identifier' => $bs_wrapper->field_identifier->value(),
    //     'selected' => ($bs_wrapper->nid->value() == $entity->nid),
    //     'title' => t('@title @volume', array(
    //       '@title' => $mb->title,
    //       '@volume' => $mb_wrapper->field_volume_number_str->value(),
    //       )
    //     ),
    //   );
    //   unset($mb_wrapper);
    // }
    unset($multivolume_books);
    asort($volumes);
  }

  // https://iiif.io/api/presentation/3.0/#partof

  // https://iiif.io/api/presentation/3.0/#51-collection
  // {
  //   "@context": "http://iiif.io/api/presentation/3/context.json",
  //   "id": "https://example.org/iiif/collection/top",
  //   "type": "Collection",
  //   "label": { "en": [ "Collection for Example Organization" ] },
  //   "summary": { "en": [ "Short summary of the Collection" ] },
  //   "requiredStatement": {
  //     "label": { "en": [ "Attribution" ] },
  //     "value": { "en": [ "Provided by Example Organization" ] }
  //   },
  //   "items": [
  //     {
  //       "id": "https://example.org/iiif/1/manifest",
  //       "type": "Manifest",
  //       "label": { "en": [ "Example Manifest 1" ] },
  //       "thumbnail": [
  //         {
  //           "id": "https://example.org/manifest1/thumbnail.jpg",
  //           "type": "Image",
  //           "format": "image/jpeg"
  //         }
  //       ]
  //     }
  //   ]
  // }

  // @todo to implement we need to change partner content-type
  // to include URI and logo.
  $providers = FALSE;
  // $fields['field_partner'];
  // https://iiif.io/api/presentation/3.0/#provider
  // $providers = [
  //   [
  //     'id' => 'http://dlib.nyu.edu',
  //     'type' => 'Agent',
  //     'label' => [
  //       'en' => [
  //         'New York University',
  //       ],
  //     ],
  //     'homepage' => [
  //       [
  //         'id' => 'http://dlib.nyu.edu/',
  //         'type' => 'Text',
  //         'label' => [
  //           'en' => [
  //             'New York University',
  //           ],
  //         ],
  //         'format' => 'text/html',
  //       ],
  //     ],
  //     'logo' => [
  //       [
  //         'id' => 'http://dlib.nyu.edu/aco/images/logos/nyu_short_color.png',
  //         'type' => 'Image',
  //         'format' => 'image/png',
  //         'height' => 100,
  //         'width' => 120,
  //       ],
  //     ],
  //   ],
  // ];

  $thumbnail = [];
  if ($sequences && !empty($sequences)) {
    $thumbnail_raw = $items[0]['items'][0]['items'][0]['body'];
    $thumbnail = [
      [
        'id' => $thumbnail_raw['id'] . '/full/256,/0/default.jpg',
        'type' => 'Image',
        'format' => 'image/jpeg',
        'service' => $thumbnail_raw['service'],
      ],
    ];
  }

  $logo = 'https://yt3.ggpht.com/-RZYi5isxH_M/AAAAAAAAAAI/AAAAAAAAAAA/rmWpoe2qZzI/s900-c-k-no/photo.jpg';

  $metadata = array_values($fields);

  $res = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$type/$identifier/manifest.json",
    'type' => 'Manifest',
    'label' => $fields['field_title']['value'],
    'behavior' => $behavior,
    'items' => $items,
    'metadata' => $metadata,
    'viewingDirection' => $viewingDirection,
    'homepage' => [
      [
        'id' => "$base_url/$type/$identifier/1",
        'type' => 'Text',
        'label' => [
          'en' => [
            'View on NYU DLTS Viewer',
          ],
        ],
        'format' => 'text/html',
      ],
    ],
    'logo' => [
      [
        'id' => $logo,
        'type' => 'Image',
        'format' => 'image/jpeg',
        'height' => 100,
        'width' => 120,
      ],
    ],
    'thumbnail' => $thumbnail,
  ];

  if (isset($pdfs)) {
    $res['rendering'] = $pdfs;
  }

  if (isset($fields['field_description']) && !empty($fields['field_description']['value'])) {
    $res['summary'] = $fields['field_description']['value'];
  }

  if (isset($required_statement)) {
    $res['requiredStatement'] = $required_statement;
  }

  if ($providers) {
    $res['providers'] = $providers;
  }

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

  drupal_register_shutdown_function(
    'dlts_viewer_cache_book_manifest',
    array(
      'type' => $type,
      'resource' => $entity,
      'data' => $res,
    )
  );

  return $res;

}

function dlts_viewer_iiif_book_page_canvas($type, $resource, $page) {
  global $base_url;

  $sequence = $page['sequence'][0];

  $item = 1;

  $wrapper = entity_metadata_wrapper('node', $resource);

  $identifier = $wrapper->field_identifier->value();

  $resource_type = dlts_viewer_resource_type($type);

  return array(
    'id' => "$base_url/api/presentation/$resource_type/$identifier/canvas/$sequence",
    'type' => 'Canvas',
    'label' => array(
      'en' => array(
        (string) $sequence,
      ),
    ),
    'width' => (int) $page['width'],
    'height' => (int) $page['height'],
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
function dlts_viewer_iiif_book_page_annotation_page($type, $resource, $page) {
  global $base_url;
  $wrapper = entity_metadata_wrapper('node', $resource);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $page['sequence'][0];
  $resource_type = dlts_viewer_resource_type($type);
  return array(
    'id' => "$base_url/api/presentation/$resource_type/$identifier/page/$sequence",
    'type' => 'AnnotationPage',
    'items' => array(
      dlts_viewer_iiif_annotation($type, $resource, $page),
    ),
  );
}

// Annotation.
// @link http://localhost:9000/api/3/presentation/books/princeton_aco000102/annotation/painting/1
function dlts_viewer_iiif_annotation($type, $resource, $item) {
  global $base_url;
  $wrapper = entity_metadata_wrapper('node', $resource);
  $identifier = $wrapper->field_identifier->value();
  $sequence = $item['sequence'][0];
  $resource_type = dlts_viewer_resource_type($type);
  $image = "$base_url/api/image/$resource_type/$identifier/$sequence";
  return [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/$resource_type/$identifier/annotation/painting/$sequence",
    'type' => 'Annotation',
    'motivation' => 'painting',
    'body' => [
      'id' => $image,
      'type' => 'Image',
      'format' => 'image/jpeg',
      'service' => [
        [
          'id' => $image,
          'type' => 'ImageService2',
          'profile' => 'level1',
        ],
      ],
      'height' => (int) $item['height'],
      'width' => (int) $item['width'],
    ],
    'target' => "$base_url/api/presentation/$resource_type/$identifier/canvas/$sequence",
  ];
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
