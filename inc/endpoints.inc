<?php

/**
 * @file
 * Endpoints callbacks.
 */

/**
 * Book object.
 *
 * @param object $node
 *   Node.
 * @param bool $list_pages
 *   True if need to list pages.
 *
 * @return array
 *   Book.
 */
function dlts_viewer_book($node, $list_pages = TRUE) {
  $book = dlts_viewer_book_metadata($node);
  if ($list_pages) {
    $book = array_merge((array) $book, (array) dlts_viewer_book_pages($node));
  }
  return $book;
}

/**
 * Books object.
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 *
 * @return array
 *   Books.
 */
function dlts_viewer_books(int $start = 0, int $length = 25) {
  $request_uri = drupal_parse_url(request_uri());
  if (isset($request_uri['query'])) {
    if (isset($request_uri['query']['rows']) && is_numeric($request_uri['query']['rows'])) {
      $length = $request_uri['query']['rows'];
    }
    if (isset($request_uri['query']['start']) && is_numeric($request_uri['query']['start'])) {
      $start = $request_uri['query']['start'];
    }
  }
  $count_query = new EntityFieldQuery();
  $entities_query = new EntityFieldQuery();
  $count = $count_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', 1)
    ->count()
    ->execute();
  $entities = $entities_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', 1)
    ->range($start, $length)
    ->execute();
  $keys = array_keys($entities['node']);
  $nodes = entity_load('node', $keys);
  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => $count,
      'start' => $start,
      'docs' => [],
    ],
  ];
  foreach ($nodes as $node) {
    $response['response']['docs'][] = dlts_viewer_api_book_json($node, $node->language);
  }
  return $response;
}

/**
 * Generate metadata about a book.
 *
 * @param object $node
 *   A dlts_book node object.
 *
 * @return array
 *   Keyed array with entity_title, identifier, entity_path, base_url,
 *   entity_language, entity_status, entity_type, and a metadata sub-array,
 *   or an error array if $node is not a valid object.
 */
function dlts_viewer_book_metadata($node) {

  if (!is_object($node)) {
    return [
      'argument' => $node,
      'code' => 1,
      'message' => t('Invalid book'),
      'status' => t('fail'),
    ];
  }

  $type = dlts_viewer_content_types_type($node->type);

  $fields = [];

  $ewrapper = entity_metadata_wrapper('node', $node);

  foreach ($type['fields'] as $field) {
    $field_name = $field['field_name'];
    $name = str_replace('field_', '', $field_name);
    $raw_value = $ewrapper->$field_name->value();
    if ($field['type'] == 'options_buttons') {
      $value = $field['settings']['allowed_values'][$raw_value];
    } elseif ($field['type'] == 'link_field' && isset($raw_value['url'])) {
      $value = $raw_value['url'];
    } elseif ($field['type'] == 'file_generic') {
      $value = [];
      foreach ((array) $raw_value as $pdf_file) {
        $value[] = file_create_url($pdf_file['uri']);
      }
    } elseif ($field['type'] == 'date_text') {
      $value = $raw_value['value'] ?? NULL;
    } elseif ($field['type'] == 'image_image') {
      $value = file_create_url($raw_value['uri']);
    } elseif ($field['type'] == 'taxonomy_autocomplete') {
      $value = [];
      foreach ($raw_value as $taxonomy) {
        $value[] = $taxonomy->name;
      }
    } else {
      $value = $raw_value;
    }
    $fields[$name] = [
      'label' => $field['label'],
      'value' => (array) $value,
    ];
  }
  return [
    'entity_title' => $node->title,
    'identifier' => $fields['identifier']['value'][0],
    'entity_path' => url('books/' . $fields['identifier']['value'][0] . '/1', ['absolute' => TRUE]),
    'base_url' => url('', ['absolute' => TRUE]),
    'entity_language' => $node->language,
    'entity_status' => $node->status,
    'entity_type' => $node->type,
    'metadata' => $fields,
  ];
}

/**
 * List resources.
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function dlts_viewer_list_resource(int $start = 0, int $length = 10) {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  global $base_url;

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  $status = 1;
  if (isset($query_parameters['status']) && is_numeric($query_parameters['status'])) {
    $status = $query_parameters['status'];
  }

  $placeholders = [
    ':status' => $status,
  ];

  $base_query = "
    FROM node
    LEFT JOIN field_data_field_title title
      ON node.nid = title.entity_id
    LEFT JOIN field_data_field_handle handle
      ON node.nid = handle.entity_id
    LEFT JOIN field_data_field_identifier identifier
      ON node.nid = identifier.entity_id
    LEFT JOIN field_data_field_collection collection
      ON node.nid = collection.entity_id
    INNER JOIN field_data_field_code collection_code
      ON collection.field_collection_nid = collection_code.entity_id
    LEFT JOIN field_data_field_partner partner
      ON node.nid = partner.entity_id
    INNER JOIN field_data_field_code partner_code
      ON partner.field_partner_nid = partner_code.entity_id
    WHERE node.status = :status";

  if (isset($query_parameters['collection'])) {
    $base_query .= ' AND collection_code.field_code_value = :collection';
    $placeholders[':collection'] = filter_xss($query_parameters['collection']);
  }

  if (isset($query_parameters['type'])) {
    $base_query .= ' AND node.type = :type';
    $placeholders[':type'] = filter_xss($query_parameters['type']);
  }

  if (isset($query_parameters['partner'])) {
    $base_query .= ' AND partner_code.field_code_value = :partner';
    $placeholders[':partner'] = filter_xss($query_parameters['partner']);
  }

  if (isset($query_parameters['searchTerm'])) {
    $base_query .= ' AND (title.field_title_value LIKE :search OR identifier.field_identifier_value LIKE :search OR handle.field_handle_url LIKE :search)';
    $placeholders[':search'] = '%' . db_like(filter_xss($query_parameters['searchTerm'])) . '%';
  }

  if (isset($query_parameters['identifier'])) {
    $base_query .= ' AND (identifier.field_identifier_value = :identifier)';
    $placeholders[':identifier'] = filter_xss($query_parameters['identifier']);
  }

  if (isset($query_parameters['noid'])) {
    $base_query .= ' AND (handle.field_handle_url LIKE :noid)';
    $placeholders[':noid'] = '%' . db_like(filter_xss($query_parameters['noid'])) . '%';
  }

  $count = db_query("SELECT COUNT(DISTINCT node.nid)" . $base_query, $placeholders)->fetchField();
  $results = db_query_range("SELECT node.nid" . $base_query, $start, $length, $placeholders)->fetchAll();

  $nodes = [];

  foreach ($results as $result) {
    $node = node_load($result->nid);
    $wrapper = entity_metadata_wrapper('node', $node);
    $collections = [];
    $partners = [];
    $handle_raw = $wrapper->field_handle->value();
    $handle = explode('/', $handle_raw['url']);
    foreach ($wrapper->field_collection->value() as $collection) {
      $collection_wrapper = entity_metadata_wrapper('node', $collection);
      $collections[] = [
        'code' => $collection_wrapper->field_code->value(),
        'name' => $collection_wrapper->field_name->value(),
      ];
    }
    foreach ($wrapper->field_partner->value() as $partner) {
      $partner_wrapper = entity_metadata_wrapper('node', $partner);
      $partners[] = [
        'code' => $partner_wrapper->field_code->value(),
        'name' => $partner_wrapper->field_name->value(),
      ];
    }

    $result_identifier = $wrapper->field_identifier->value();

    $uri = "$base_url/api/v1/noid/$result_identifier";

    $embedUrl = "$base_url/api/embed/$result_identifier";

    $result_type = str_replace('dlts_', '', $wrapper->getBundle());

    $result_alias = $result_type . 's';

    $viewerUrl = "$base_url/$result_alias/$result_identifier";

    if ($result_alias === 'photo_sets') {
      $result_alias = 'photos';
      $viewerUrl = "$base_url/$result_alias/$result_identifier";
    }

    if ($result_type === 'book' || $result_type === 'map') {
      $viewerUrl = "$base_url/$result_alias/$result_identifier/1";
      $embedUrl = "$embedUrl/1";
    }

    if ($result_type === 'serial') {
      $viewerUrl = "$embedUrl/1";
      $embedUrl = "$embedUrl/1";
    }

    $nodes[] = [
      'title' => trim($wrapper->field_title->value()),
      'nid' => $node->nid,
      'noid' => $handle[count($handle) - 1],
      'type' => $result_type,
      'typeAlias' => $result_alias,
      'identifier' => $wrapper->field_identifier->value(),
      'collections' => $collections,
      'partners' => $partners,
      'uri' => $uri,
      'handle' => $handle_raw['url'],
      'viewerUrl' => $viewerUrl,
      'embedUrl' => $embedUrl,
      'iiif' => [
        'thumbnail' => "$base_url/api/image/$result_alias/$result_identifier/1/full/!400,400/0/default.jpg",
        'presentation' => "$base_url/api/presentation/$result_alias/$result_identifier/manifest.json",
      ],
    ];
  }

  return [
    'response' => [
      'numFound' => (int) $count,
      'start' => (int) $start,
      'docs' => $nodes,
    ],
  ];

}

/**
 * List resources belonging to a set of collections.
 *
 * Returns a paginated list of content nodes (books, maps, photos, etc.)
 * that belong to the given collection nodes. Supports pagination via
 * ?rows= and ?start= query parameters. Results are filtered by collection
 * code and, if available, the first partner code of each collection.
 *
 * @link api/v1/collections/{collection_code}:{partner_code}
 *
 * @param array $collections
 *   Array of dlts_collection node objects to query within.
 *
 * @return array
 *   Solr-style response array with numFound, start, and docs.
 */
function dlts_viewer_list_collections_collection($collections) {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  global $base_url;

  $nodes = [];

  $count = 0;

  $start = 0;

  $length = 10;

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = (int) $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = (int) $query_parameters['start'];
  }

  // foreach ($entities['node'] as $node) {
  //   $entity = node_load($node->nid);
  //   $wrapper = entity_metadata_wrapper('node', $entity);
  //   $partners = [];
  //   $collection_code = '';
  //   $partners_code = '';
  //   foreach ($wrapper->field_partner->getIterator() as $delta => $partner_wrapper) {
  //     if ($partner_wrapper->getBundle() == 'dlts_partner') {
  //       $partners[] = [
  //         'name' => $partner_wrapper->field_name->value(),
  //         'code' => $partner_wrapper->field_code->value(),
  //       ];
  //     }
  //   }

  $collection = reset($collections);

  $collection_wrapper = entity_metadata_wrapper('node', $collection);

  $collection_code = $collection_wrapper->field_code->value();

  $collection_name = $collection_wrapper->field_name->value();

  $collection_identifier = $collection_wrapper->field_identifier->value();

  $partners = [];

  foreach ($collection_wrapper->field_partner->value() as $partner) {
    $partner_wrapper = entity_metadata_wrapper('node', $partner);
    $partners[] = [
      'code' => $partner_wrapper->field_code->value(),
      'name' => $partner_wrapper->field_name->value(),
    ];
  }

  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => (int) $count,
      'start' => (int) $start,
      'rows' => (int) $length,
      'collection' => [
        'nid' => $collection->nid,
        'identifier' => $collection_identifier,
        'title' => $collection_name,
        'code' => $collection_code,
        'partners' => $partners,

      ],
      'docs' => $nodes,
    ],
  ];

  return $response;

}

/**
 * List collections.
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function dlts_viewer_list_collections(int $start = 0, int $length = 100) {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  global $base_url;

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  $count_query = new EntityFieldQuery();

  $entities_query = new EntityFieldQuery();

  $count = $count_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->propertyCondition('status', 1)
    ->count()
    ->execute();

  $entities = $entities_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->propertyCondition('status', 1)
    ->range($start, $length)
    ->execute();

  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => $count,
      'start' => $start,
      'docs' => [],
    ],
  ];

  foreach ($entities['node'] as $node) {
    $entity = node_load($node->nid);
    $wrapper = entity_metadata_wrapper('node', $entity);
    $partners = [];
    $collection_code = '';
    $partners_code = '';
    foreach ($wrapper->field_partner->getIterator() as $delta => $partner_wrapper) {
      if ($partner_wrapper->getBundle() == 'dlts_partner') {
        $partners[] = [
          'name' => $partner_wrapper->field_name->value(),
          'code' => $partner_wrapper->field_code->value(),
        ];
      }
    }

    $collection_code = $wrapper->field_code->value();

    if (!empty($partners)) {
      $partners_code = $partners[0]['code'];
    }

    $response['response']['docs'][] = [
      'title' => trim($wrapper->field_name->value()),
      'identifier' => $wrapper->field_identifier->value(),
      'code' => $wrapper->field_code->value(),
      'partners' => $partners,
      'iiif' => [
        'presentation' => "$base_url/api/presentation/collections/$collection_code:$partners_code/manifest.json",
      ],
      'uri' => "$base_url/api/v1/collections/$collection_code:$partners_code",
    ];
  }

  return $response;

}

/**
 * List topics.
 * @link http://localhost:9000/api/v1/topics
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 * @param string $requestedLang
 *   Language code.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function dlts_viewer_api_list_topics(int $start = 0, int $length = 50, $requestedLang = 'en') {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  $availableLanguages = array_keys(language_list());

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  $filter_date = date('Y-m-d');

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  if (isset($query_parameters['date'])) {
    $filter_date = filter_xss($query_parameters['date']);
  }

  // Need to make sure lang exists.
  if (isset($query_parameters['lang']) && in_array($query_parameters['lang'], $availableLanguages)) {
    $requestedLang = $query_parameters['lang'];
  }

  // Status, default to published items.
  $status = 1;
  if (isset($query_parameters['status']) && is_numeric($query_parameters['status'])) {
    $status = (int) $query_parameters['status'] < 1 ? 0 : 1;
  }

  $sql_dates = "
    SELECT
      DISTINCT DATE_FORMAT(FROM_UNIXTIME(node.created), '%Y-%m-%d') created
      FROM node
      LEFT JOIN field_data_field_collection collection
        ON node.nid = collection.entity_id
      INNER JOIN field_data_field_code code
        ON collection.field_collection_nid = code.entity_id
    WHERE node.language = :language
    AND node.status = :status
    ORDER BY node.created DESC";

  $sql = "
    SELECT
      topic.field_topic_value topic,
      COUNT(topic.field_topic_value) count
    FROM node
    LEFT JOIN field_data_field_collection collection
      ON node.nid = collection.entity_id
    INNER JOIN field_data_field_topic topic
      ON node.nid = topic.entity_id
    INNER JOIN field_data_field_code code
      ON collection.field_collection_nid = code.entity_id
    WHERE node.language = :language
    AND node.created <= UNIX_TIMESTAMP(:date)
    AND node.status = :status
    GROUP BY topic.field_topic_value
    ORDER BY count DESC";

  $result = db_query_range(
    $sql,
    $start,
    $length,
    [
      ':language' => $requestedLang,
      ':date' => $filter_date,
      ':status' => $status,
    ]
  )->fetchAll();

  $dates = db_query(
    $sql_dates,
    [
      ':language' => $requestedLang,
      ':status' => $status,
    ]
  )->fetchAll();

  $filter_dates = [];

  foreach ($dates as $date) {
    $filter_dates[] = $date->created;
  }

  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => count($result),
      'start' => $start,
      'docs' => $result,
      'facets' => [
        'date' => $filter_dates,
      ],
    ],
  ];

  return $response;

}

/**
 * List books.
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 * @param string $requestedLang
 *   Language code.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function dlts_viewer_api_list_books(int $start = 0, int $length = 15, $requestedLang = 'en') {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  global $base_url;

  $cnid = NULL;

  $partner = NULL;

  $wt = 'solr';

  $filter = '';

  $availableLanguages = array_keys(language_list());

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['wt'])) {
    $wt = $query_parameters['wt'];
  }

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  if (isset($query_parameters['collection'])) {
    if (isset($query_parameters['partner'])) {
      $partner = $query_parameters['partner'];
    }
    $cnid = dlts_viewer_collection_nids_by_code($query_parameters['collection'], $partner);
  }

  if (isset($query_parameters['filter'])) {
    $filter = $query_parameters['filter'];
  }

  // Need to make sure lang exists.
  if (isset($query_parameters['lang']) && in_array($query_parameters['lang'], $availableLanguages)) {
    $requestedLang = $query_parameters['lang'];
  }

  $count_query = new EntityFieldQuery();

  $entities_query = new EntityFieldQuery();

  // @link https://www.drupal.org/docs/7/creating-custom-modules/howtos/how-to-use-entityfieldquery-for-drupal-7
  $count_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('language', $requestedLang)
    ->propertyCondition('status', NODE_PUBLISHED);

  if ($cnid) {
    $count_query->fieldCondition('field_collection', 'nid', $cnid, 'IN');
  }

  if ($filter) {
    // Equal to "contains".
    $count_query->fieldCondition('field_identifier', 'value', '%' . db_like($filter) . '%', 'like');
  }

  // Run the query as user 0.
  $count = $count_query->addMetaData('account', user_load(0))
    ->count()
    ->execute();

  $entities_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('status', NODE_PUBLISHED)
    ->propertyCondition('language', $requestedLang);

  if ($cnid) {
    $entities_query->fieldCondition('field_collection', 'nid', $cnid, 'IN');
  }

  if ($filter) {
    // Equal to "contains".
    $entities_query->fieldCondition('field_identifier', 'value', '%' . db_like($filter) . '%', 'like');
  }

  $entities = $entities_query->range($start, $length)
    ->addMetaData('account', user_load(0))
    ->execute();

  $docs = [];

  foreach ($entities['node'] as $node) {

    $entity = node_load($node->nid);

    $book = entity_metadata_wrapper('node', $entity);

    $handle = $book->field_handle->value();

    $handle = explode('/', $handle['url']);

    $identifier = $book->field_identifier->value();

    $translation = dlts_viewer_list_translation($identifier, 'dlts_book');

    $multivolume = dlts_viewer_multivolume_book($translation['en']);

    $isSeries = dlts_viewer_is_series_book($node);

    switch ($wt) {
      case 'iiif':
        $docs[] = [
          'id' => "$base_url/api/presentation/books/$identifier/manifest.json",
          'type' => 'Manifest',
          'label' => [
            $requestedLang => trim($book->field_title->value()),
          ],
        ];
        break;
      default:
        $docs[] = [
          'title' => trim($book->field_title->value()),
          'identifier' => $identifier,
          'noid' => $handle[count($handle) - 1],
          'metadata' => "$base_url/api/v1/books/$identifier",
          'availableLanguages' => array_keys($translation),
          'isMultivolume' => $multivolume,
          'isSeries' => $isSeries,
          'iiif' => [
            'manifest' => "$base_url/api/presentation/books/$identifier/manifest.json",
          ],
        ];
        break;
    }
  }

  switch ($wt) {
    case 'iiif':
      // "https://iiif.io/api/cookbook/recipe/0032-collection/collection.json"
      // label
      // en
      // 0	"Simple Collection Example"
      return [
        '@context' => 'http://iiif.io/api/presentation/3/context.json',
        'id' => url(current_path(), [ 'absolute' => TRUE, 'query' => drupal_get_query_parameters() ]),
        'type' => 'Collection',
          'label' => [
            $requestedLang => 'Books',
          ],
        'items' => $docs,
      ];
    default:
      // Try to mimic Apache Solr response.
      return [
        'response' => [
          'numFound' => $count,
          'start' => $start,
          'docs' => $docs,
        ],
      ];
  }

}

/**
 * List maps.
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 * @param string $requestedLang
 *   Language code.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function dlts_viewer_api_list_maps(int $start = 0, int $length = 15, $requestedLang = 'en') {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  $availableLanguages = array_keys(language_list());

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  $cnid = NULL;

  if (isset($query_parameters['collection'])) {
    $partner = NULL;
    if (isset($query_parameters['partner'])) {
      $partner = $query_parameters['partner'];
    }
    $cnid = dlts_viewer_collection_nids_by_code($query_parameters['collection'], $partner);
  }

  $filter = '';

  if (isset($query_parameters['filter'])) {
    $filter = $query_parameters['filter'];
  }

  // Need to make sure lang exists.
  if (isset($query_parameters['lang']) && in_array($query_parameters['lang'], $availableLanguages)) {
    $requestedLang = $query_parameters['lang'];
  }

  $count_query = new EntityFieldQuery();

  $entities_query = new EntityFieldQuery();

  $count_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_map')
    ->propertyCondition('language', $requestedLang)
    ->propertyCondition('status', NODE_PUBLISHED);

  if ($cnid) {
    $count_query->fieldCondition('field_collection', 'nid', $cnid, 'IN');
  }

  if ($filter) {
    // Equal to "contains".
    $count_query->fieldCondition('field_identifier', 'value', '%' . db_like($filter) . '%', 'like');
  }

  // Run the query as user 0.
  $count = $count_query->addMetaData('account', user_load(0))
    ->count()
    ->execute();

  $entities_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_map')
    ->propertyCondition('status', NODE_PUBLISHED)
    ->propertyCondition('language', $requestedLang);

  if ($cnid) {
    $entities_query->fieldCondition('field_collection', 'nid', $cnid, 'IN');
  }

  if ($filter) {
    // Equal to "contains".
    $entities_query->fieldCondition('field_identifier', 'value', '%' . db_like($filter) . '%', 'like');
  }

  $entities = $entities_query->range($start, $length)
    ->addMetaData('account', user_load(0))
    ->execute();

  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => $count,
      'start' => $start,
      'docs' => [],
    ],
  ];

  foreach ($entities['node'] as $node) {
    $entity = node_load($node->nid);
    $response['response']['docs'][] = dlts_viewer_api_map_json($entity);
  }

  return $response;
}

/**
 * Filter and normalize available languages for a resource.
 *
 * Removes disabled languages and languages the resource does not exist in.
 * Normalizes direction (0/1 → 'ltr'/'rtl') and marks the requested language
 * as default. Strips internal Drupal language properties from the output.
 *
 * @param string $identifier
 *   The resource identifier.
 * @param string $entity_language
 *   The language code of the loaded entity.
 * @param string $requestedLang
 *   The requested language code.
 * @param string $nid_lookup_fn
 *   Name of a function that looks up a node ID by (identifier, language_code).
 *   Use 'book_nid' for books/serials and 'map_nid' for maps/photos.
 *
 * @return array
 *   Filtered and normalized language objects keyed by language code.
 */
function _dlts_viewer_filter_available_languages($identifier, $entity_language, $requestedLang, $nid_lookup_fn) {
  $availableLanguages = language_list();
  foreach ($availableLanguages as $code => $lang) {
    if (
      $availableLanguages[$code]->enabled &&
      ($code == $entity_language || call_user_func($nid_lookup_fn, $identifier, $code))
    ) {
      $availableLanguages[$code]->direction = ($availableLanguages[$code]->direction == 0) ? 'ltr' : 'rtl';
      $availableLanguages[$code]->default = ($code == $requestedLang) ? 1 : 0;
      unset($availableLanguages[$code]->prefix);
      unset($availableLanguages[$code]->plurals);
      unset($availableLanguages[$code]->formula);
      unset($availableLanguages[$code]->domain);
      unset($availableLanguages[$code]->weight);
      unset($availableLanguages[$code]->javascript);
    }
    else {
      unset($availableLanguages[$code]);
    }
  }
  return $availableLanguages;
}

/**
 * Process metadata fields for a resource entity.
 *
 * Iterates over the field definitions for a content type and builds the
 * $fields metadata array. Handles field-type-specific transformations
 * (collections, partners, PDF files, read/scan order, etc.).
 *
 * @param array $type_fields
 *   Field definitions from dlts_viewer_content_types_type()['fields'].
 * @param object $wrapper
 *   Entity API metadata wrapper for the entity.
 * @param string $requestedLang
 *   Language code to use for localized labels and values.
 * @param array|null $volumes
 *   Pre-built volumes array for multivolume books/serials. When non-NULL,
 *   the 'volume' field is replaced with $fields['volumes'] = $volumes.
 *   When NULL the 'volume' field is treated as a simple passthrough.
 *
 * @return array
 *   Keyed array with:
 *   - 'fields': processed metadata fields array.
 *   - 'imageCount': total number of images/sequences (int).
 *   - 'worldDirection': reading direction string ('ltr' or 'rtl').
 *   - 'handle': raw handle URL string (from field_handle).
 */
function _dlts_viewer_process_metadata_fields(array $type_fields, $wrapper, $requestedLang, $volumes = NULL) {
  $fields = [];
  $imageCount = 0;
  $worldDirection = 'ltr';
  $handle = NULL;

  foreach ($type_fields as $field) {
    $name = str_replace('field_', '', $field['field_name']);
    $field_name = $field['field_name'];
    $raw_value = $wrapper->$field_name->value();
    $fields[$name] = [
      'label' => locale($field['label'], NULL, $requestedLang),
      'value' => NULL,
    ];
    switch ($name) {
      case 'author':
      case 'contributor':
      case 'creator':
      case 'description':
      case 'dimensions':
      case 'editor':
      case 'geographic_coordinates':
      case 'isbn':
      case 'number':
      case 'ocr_text':
      case 'other_version':
      case 'page_count':
      case 'publication_date_text':
      case 'publication_location':
      case 'publisher':
      case 'scan_date':
      case 'scanning_notes':
      case 'subtitle':
      case 'call_number':
        $fields[$name]['value'] = $raw_value;
        break;

      case 'binding_orientation':
        $fields[$name]['value'] = $field['settings']['allowed_values'][$raw_value];
        break;

      case 'collection':
        $fields[$name]['value'] = [];
        $collections = dlts_viewer_collections($raw_value);
        foreach ($collections as $collection) {
          unset($collection['title']);
          unset($collection['type']);
          unset($collection['language']);
          unset($collection['partner']['title']);
          unset($collection['partner']['type']);
          unset($collection['partner']['language']);
          $collection['name'] = locale($collection['name'], NULL, $requestedLang);
          $collection['partner']['name'] = locale($collection['partner']['name'], NULL, $requestedLang);
          $fields[$name]['value'][] = $collection;
        }
        break;

      case 'geographic_subject':
        // @todo Find out how to deal with this.
        unset($fields[$name]);
        break;

      case 'handle':
        $handle = $fields[$name]['value'] = $raw_value['url'];
        break;

      case 'identifier':
        unset($fields[$name]);
        break;

      case 'language':
        $fields[$name]['value'] = array_pop($raw_value);
        break;

      case 'language_code':
        $fields[$name]['value'] = array_pop($raw_value);
        break;

      case 'partner':
        $partner_value = [];
        foreach ($raw_value as $partner) {
          $partner_wrapper = entity_metadata_wrapper('node', $partner);
          $partner_value[] = [
            'identifier' => $partner_wrapper->field_identifier->value(),
            'code' => $partner_wrapper->field_code->value(),
            'name' => locale($partner_wrapper->field_name->value(), NULL, $requestedLang),
          ];
        }
        $fields[$name]['value'] = $partner_value;
        unset($partner_value);
        break;

      case 'pdf_file':
        // Notice: Undefined index: searchable in _dlts_viewer_process_metadata_fields()
        // (line 1160 of /var/www/html/viewer/sites/all/modules/dlts_viewer/inc/endpoints.inc).
        $fields[$name]['value'] = [
          'hi' => [],
          'lo' => [],
        ];
        foreach ($raw_value as $value) {
          $data = [
            'uri' => $value['uri'],
            'label' => $value['label'],
          ];
          $data['size'] = field_fileserver_get_pdf_filesize($data);
          $data['uri'] = file_create_url($data['uri']);
          $filename = pathinfo($data['uri'], PATHINFO_FILENAME);
          preg_match('/_(hi|lo)/', $filename, $matches);
          if (isset($value['data'])) {
            $serial = unserialize($value['data'], ['allowed_classes' => false]);
            if (isset($serial['filesize']) && $serial['filesize'] > 0) {
              $data['size'] = $serial['filesize'];
            }
            if (isset($serial['searchable'])) {
              $data['searchable'] = $serial['searchable'];
            }
          }
          if (isset($matches) && isset($matches[1])) {
            switch ($matches[1]) {
              case 'hi':
                $fields[$name]['value']['hi'] = [
                  'label' => locale('High-resolution', NULL, $requestedLang),
                  'uri' => $data['uri'],
                  'searchable' => $data['searchable'],
                  'filesize' => $data['size'],
                ];
                break;

              case 'lo':
                $fields[$name]['value']['lo'] = [
                  'label' => locale('Low-resolution', NULL, $requestedLang),
                  'uri' => $data['uri'],
                  'searchable' => $data['searchable'],
                  'filesize' => $data['size'],
                ];
                break;
            }
          }
        }
        break;

      case 'publication_date':
        $fields[$name]['value'] = $raw_value['value'] ?? NULL;
        break;

      case 'read_order':
        // [0] => Left to right
        // [1] => Right to left
        $map = [0 => 'ltr', 1 => 'rtl'];
        $worldDirection = $fields[$name]['value'] = $map[$raw_value];
        unset($map);
        break;

      case 'representative_image':
        unset($fields[$name]);
        break;

      case 'rights':
        $fields[$name]['value'] = trim($raw_value);
        break;

      case 'scan_order':
        // [0] => Left to right
        // [1] => Right to left
        $map = [0 => 'ltr', 1 => 'rtl'];
        $fields[$name]['value'] = $map[$raw_value];
        unset($map);
        break;

      case 'sequence_count':
        $imageCount = $fields[$name]['value'] = (int) $raw_value;
        break;

      case 'subject':
        $subjects = [];
        foreach ($raw_value as $subject) {
          $subjects[] = [
            'uuid' => $subject->uuid,
            'name' => $subject->name,
          ];
        }
        $fields[$name]['value'] = $subjects;
        unset($subjects);
        break;

      case 'title':
        unset($fields[$name]);
        break;

      case 'topic':
        $topics = [];
        foreach ($raw_value as $topic) {
          $topics[] = locale($topic, NULL, $requestedLang);
        }
        $fields[$name]['value'] = $topics;
        unset($topics);
        break;

      case 'volume':
        if ($volumes !== NULL) {
          $fields['volumes'] = $volumes;
          unset($fields[$name]);
        }
        else {
          $fields[$name]['value'] = $raw_value;
        }
        break;
    }
  }

  return [
    'fields' => $fields,
    'imageCount' => $imageCount,
    'worldDirection' => $worldDirection,
    'handle' => $handle,
  ];

}

/**
 * Build the JSON metadata response for a map entity.
 *
 * @param object $entity
 *   A dlts_map node object.
 * @param string $requestedLang
 *   Language code for the response (e.g. 'en'). Overridden by ?lang= query param.
 *
 * @return array
 *   Keyed metadata array including fields, IIIF image/presentation URLs,
 *   available languages, viewer URL, and handle.
 */
function dlts_viewer_api_map_json($entity, $requestedLang = 'en') {

  global $base_url;

  $fields = $collections = [];

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  // Need to make sure lang exists.
  if (isset($query_parameters['lang'])) {
    $requestedLang = $query_parameters['lang'];
  }

  $availableLanguages = language_list();

  // Default to left-to-rigth.
  $worldDirection = 'ltr';

  // Entity API wrapper.
  $book = entity_metadata_wrapper('node', $entity);

  // Identifier.
  $identifier = $book->field_identifier->value();

  $bundle = dlts_viewer_get_bundle_alias($book->getBundle());

  $availableLanguages = _dlts_viewer_filter_available_languages($identifier, $entity->language, $requestedLang, 'map_nid');

  // Field representative image.
  $fri = $book->field_representative_image->value();

  // Default title of the book.
  $displayTitle = $title = trim($book->field_title->value());

  $type = dlts_viewer_content_types_type($entity->type);

  $result = _dlts_viewer_process_metadata_fields($type['fields'], $book, $requestedLang);
  $fields = $result['fields'];
  $imageCount = $result['imageCount'];
  $worldDirection = $result['worldDirection'];
  $handle = explode('/', $result['handle']);

  $items = [];
  for ($sequence = 1; $imageCount >= $sequence; ++$sequence) {
    $items[] = "$base_url/api/image/$bundle/$identifier/$sequence/info.json";
  }


  $response = [
    'title' => $title,
    'displayTitle' => $displayTitle,
    'type' => 'map',
    'typeAlias' => $bundle,
    'identifier' => $identifier,
    'nid' => $entity->nid,
    'noid' => $handle[count($handle) - 1],
    'worldDirection' => $worldDirection,
    'requestedLanguage' => $availableLanguages[$requestedLang],
    'availableLanguages' => $availableLanguages,
    'status' => (int) $entity->status,
    'embedUrl' => "$base_url/api/embed/$identifier/1",
    'viewerUrl' => "$base_url/maps/$identifier/1",
    'iiif' => [
      'identifier' => "$bundle/$identifier",
      'image' => [
        'service' => "$base_url/api/image",
        'version' => 2,
        'items' => $items,
      ],
      'presentation' => [
        'service' => "$base_url/api/presentation",
        'manifest' => "$base_url/api/presentation/$bundle/$identifier/manifest.json",
        'version' => 3,
      ],
    ],
    'isMultivolume' => false,
    'isSeries' => false,
    'thumbnail' => "$base_url/iiif/2/maps/$identifier/1/full/!400,400/0/default.jpg",
    'metadata' => $fields,
  ];

  return $response;

}

/**
 * Build the JSON metadata response for a photo set entity.
 *
 * @param object $entity
 *   A dlts_photo_set node object.
 * @param string $requestedLang
 *   Language code for the response (e.g. 'en'). Overridden by ?lang= query param.
 *
 * @return array
 *   Keyed metadata array including fields, IIIF image/presentation URLs,
 *   available languages, viewer URL, and handle.
 */
function dlts_viewer_api_photo_json($entity, $requestedLang = 'en') {

  global $base_url;

  $fields = $collections = [];

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  // Need to make sure lang exists.
  if (isset($query_parameters['lang'])) {
    $requestedLang = $query_parameters['lang'];
  }

  // Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  // identifier.
  $identifier = $wrapper->field_identifier->value();

  $availableLanguages = _dlts_viewer_filter_available_languages($identifier, $entity->language, $requestedLang, 'map_nid');

  // Default to left-to-right.
  $worldDirection = 'ltr';

  // Default title of the book.
  $displayTitle = $title = trim($wrapper->field_title->value());

  $type = dlts_viewer_content_types_type($entity->type);

  $bundle = dlts_viewer_get_bundle_alias($wrapper->getBundle());

  $imageCount = 0;

  $handle = NULL;

  foreach ($type['fields'] as $field) {

    $name = str_replace('field_', '', $field['field_name']);

    $field_name = $field['field_name'];

    // Get the raw value of the field.
    $raw_value = $wrapper->$field_name->value();

    $fields[$name] = [
      'label' => locale($field['label'], NULL, $requestedLang),
      'value' => NULL,
    ];

    switch ($name) {

      case 'collection':
        $fields[$name]['value'] = [];
        $collections = dlts_viewer_collections($raw_value);
        foreach ($collections as $collection) {
          unset($collection['title']);
          unset($collection['type']);
          unset($collection['language']);
          unset($collection['partner']['title']);
          unset($collection['partner']['type']);
          unset($collection['partner']['language']);
          $collection['name'] = locale($collection['name'], NULL, $requestedLang);
          $collection['partner']['name'] = locale($collection['partner']['name'], NULL, $requestedLang);
          $fields[$name]['value'][] = $collection;
        }
        break;

      case 'handle':
        $handle = $fields[$name]['value'] = $raw_value['url'];
        break;

      case 'identifier':
        unset($fields[$name]);
        break;

      case 'partner':
        $partner_value = [];
        foreach ($raw_value as $partner) {
          $partner_wrapper = entity_metadata_wrapper('node', $partner);
          $partner_value[] = [
            'identifier' => $partner_wrapper->field_identifier->value(),
            'code' => $partner_wrapper->field_code->value(),
            'name' => locale($partner_wrapper->field_name->value(), NULL, $requestedLang),
          ];
        }
        $fields[$name]['value'] = $partner_value;
        unset($partner_value);
        break;

      case 'sequence_count':
        $imageCount = $fields[$name]['value'] = (int) $raw_value;
        break;

      case 'page_count':
        $fields[$name]['value'] = (int) $raw_value;
        break;

      case 'title':
        unset($fields[$name]);
        break;
    }
  }

  $handle = explode('/', $handle ?? '');

  $items = [];
  for ($sequence = 1; $imageCount >= $sequence; ++$sequence) {
    $items[] = "$base_url/api/image/$bundle/$identifier/$sequence/info.json";
  }

  $response = [
    'title' => $title,
    'displayTitle' => $displayTitle,
    'type' => 'photo',
    'typeAlias' => $bundle,
    'identifier' => $identifier,
    'nid' => $entity->nid,
    'noid' => $handle[count($handle) - 1],
    'worldDirection' => $worldDirection,
    'requestedLanguage' => $availableLanguages[$requestedLang],
    'availableLanguages' => $availableLanguages,
    'status' => (int) $entity->status,
    'viewerUrl' => "$base_url/photos/$identifier",
    'embedUrl' => "$base_url/api/embed/$identifier",
    'iiif' => [
      'identifier' => "$bundle/$identifier",
      'image' => [
        'service' => "$base_url/api/image",
        'version' => 2,
        'items' => $items,
      ],
      'presentation' => [
        'service' => "$base_url/api/presentation",
        'manifest' => "$base_url/api/presentation/$bundle/$identifier/manifest.json",
        'version' => 3,
      ],
    ],
    'isMultivolume' => false,
    'isSeries' => false,
    'thumbnail' => "$base_url/api/image/$bundle/$identifier/1/full/!400,400/0/default.jpg",
    'metadata' => $fields,
  ];

  return $response;

}

/**
 * Build the JSON metadata response for a serial entity.
 *
 * @param object $entity
 *   A dlts_serial node object.
 * @param string $requestedLang
 *   Language code for the response (e.g. 'en'). Overridden by ?lang= query param.
 *
 * @return array
 *   Keyed metadata array including fields, IIIF image/presentation URLs,
 *   available languages, viewer URL, handle, and volume list.
 */
function dlts_viewer_api_serial_json($entity, $requestedLang = 'en') {

  global $base_url;

  $volumes = [];

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  // Need to make sure lang exists.
  if (isset($query_parameters['lang'])) {
    $requestedLang = $query_parameters['lang'];
  }

  // Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  $bundle = dlts_viewer_get_bundle_alias($wrapper->getBundle());

  // identifier.
  $identifier = $wrapper->field_identifier->value();

  $availableLanguages = _dlts_viewer_filter_available_languages($identifier, $entity->language, $requestedLang, 'book_nid');

  // Default title of the book.
  $displayTitle = $title = trim($wrapper->field_title->value());

  $type = dlts_viewer_content_types_type($entity->type);

  $result = _dlts_viewer_process_metadata_fields($type['fields'], $wrapper, $requestedLang, $volumes);

  $fields = $result['fields'];

  $imageCount = $result['imageCount'];

  $worldDirection = $result['worldDirection'];

  $handle = explode('/', $result['handle']);

  $items = [];

  for ($sequence = 1; $imageCount >= $sequence; ++$sequence) {
    $items[] = "$base_url/api/image/$bundle/$identifier/$sequence/info.json";
  }

  $response = [
    'title' => $title,
    'displayTitle' => $displayTitle,
    'type' => 'serial',
    'typeAlias' => $bundle,
    'identifier' => $identifier,
    'nid' => $entity->nid,
    'noid' => $handle[count($handle) - 1],
    'worldDirection' => $worldDirection,
    'requestedLanguage' => $availableLanguages[$requestedLang],
    'availableLanguages' => $availableLanguages,
    'status' => (int) $entity->status,
    'viewerUrl' => "$base_url/api/embed/$identifier/1",
    'embedUrl' => "$base_url/api/embed/$identifier/1",
    'iiif' => [
      'identifier' => "$bundle/$identifier",
      'image' => [
        'service' => "$base_url/api/image",
        'version' => 2,
        'items' => $items,
      ],
      'presentation' => [
        'service' => "$base_url/api/presentation",
        'manifest' => "$base_url/api/presentation/$bundle/$identifier/manifest.json",
        'version' => 3,
      ],
    ],
    'isMultivolume' => false,
    'isSeries' => false,
    'thumbnail' => "$base_url/api/image/$bundle/$identifier/1/full/!400,400/0/default.jpg",
    'metadata' => $fields,
  ];

  $realpath = drupal_realpath('public://') . '/datasource';

  $cachepath = "$realpath/$bundle/$identifier/info.$requestedLang.json";

  if (!file_exists("$realpath/$bundle/$identifier")) {
    mkdir("$realpath/$bundle/$identifier", 0755, TRUE);
  }

  file_put_contents($cachepath, json_encode($response), LOCK_EX);

  return $response;

}

/**
 * Build the JSON metadata response for a book entity.
 *
 * @param object $entity
 *   A dlts_book node object.
 * @param string $requestedLang
 *   Language code for the response (e.g. 'en'). Overridden by ?lang= query param.
 *
 * @return array
 *   Keyed metadata array including fields, IIIF image/presentation URLs,
 *   available languages, viewer URL, handle, multivolume flag, and series info.
 */
function dlts_viewer_api_book_json($entity, $requestedLang = 'en') {

  global $base_url;

  $series = [];

  $volumes = [];

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  // Need to make sure lang exists.
  if (isset($query_parameters['lang'])) {
    $requestedLang = $query_parameters['lang'];
  }

  // Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  $bundle = dlts_viewer_get_bundle_alias($wrapper->getBundle());

  // identifier.
  $identifier = $wrapper->field_identifier->value();

  $availableLanguages = _dlts_viewer_filter_available_languages($identifier, $entity->language, $requestedLang, 'book_nid');

  // Default title of the book.
  $displayTitle = $title = trim($wrapper->field_title->value());

  $type = dlts_viewer_content_types_type($entity->type);

  $isMultivolume = FALSE;

  // Check if this books is part of a multi-volume.
  $multivolume_book = dlts_viewer_is_multivolume_book($entity);

  // If book is part of multi-volume; append volume value to entity title.
  if ($multivolume_book) {
    $isMultivolume = TRUE;
    // Wrapp multi-volume entity with Entity API wrapper.
    $multivolume_wrapper = entity_metadata_wrapper('node', $multivolume_book);
    // Get volume value.
    $volume_number_str = $multivolume_wrapper->field_volume_number_str->value();
    // Change entity title.
    $displayTitle = t(
      '@title @volume',
      [
        '@title' => trim($multivolume_book->title),
        '@volume' => $volume_number_str,
      ]
    );
    $multivolume_books = dlts_viewer_books_is_partof_multivolume($multivolume_wrapper->field_multivol->value()->nid);
    foreach ($multivolume_books as $mb) {
      // Wrapp multi-volume entity with Entity API wrapper.
      $mb_wrapper = entity_metadata_wrapper('node', $mb);
      $wrapper_multivolume_book_multivol = entity_metadata_wrapper('node', $mb_wrapper->field_multivol->value());
      $volume = $mb_wrapper->field_volume_number->value();
      // The book we map to this multivolume.
      $bs_wrapper = entity_metadata_wrapper('node', $mb_wrapper->field_book->value());
      $volume_ispartof_collections = $collections = dlts_viewer_collections($mb_wrapper->field_collection->value());
      $volumes_collection = [];
      foreach ($volume_ispartof_collections as $volume_ispartof_collection) {
        $volume_ispartof_collection = (array) $volume_ispartof_collection;
        unset($volume_ispartof_collection['title']);
        unset($volume_ispartof_collection['type']);
        unset($volume_ispartof_collection['language']);
        unset($volume_ispartof_collection['partner']['title']);
        unset($volume_ispartof_collection['partner']['type']);
        unset($volume_ispartof_collection['partner']['language']);
        $volume_ispartof_collection['name'] = locale($volume_ispartof_collection['name'], NULL, $requestedLang);
        $volume_ispartof_collection['partner']['name'] = locale($volume_ispartof_collection['partner']['name'], NULL, $requestedLang);
        $volumes_collection[] = $volume_ispartof_collection;
      }

      $volumes[$volume] = [
        'identifier' => $mb_wrapper->field_identifier->value(),
        'sameAs' => $bs_wrapper->field_identifier->value(),
        'volume_number' => $mb_wrapper->field_volume_number->value(),
        'volume_number_str' => $mb_wrapper->field_volume_number_str->value(),
        'collection' => $volumes_collection,
        'isPartOf' => [
          'language' => $wrapper_multivolume_book_multivol->language->value(),
          'identifier' => $wrapper_multivolume_book_multivol->field_identifier->value(),
          'title' => $wrapper_multivolume_book_multivol->title->value(),
          'handle' => ($wrapper_multivolume_book_multivol->field_handle->value() ?? [])['url'] ?? NULL,
        ],
        'selected' => ($bs_wrapper->nid->value() == $entity->nid),
        'title' => t(
          '@title @volume',
          [
            '@title' => trim($mb->title),
            '@volume' => $mb_wrapper->field_volume_number_str->value(),
          ]
        ),
      ];
      unset($mb_wrapper);
    }
    unset($multivolume_books);
    asort($volumes);
  }

  $series_books = dlts_viewer_series_book($entity->nid);

  $isSeries = FALSE;

  if (!empty($series_books)) {
    $isSeries = TRUE;
    foreach ($series_books as $series_book) {
      $series_collections = [];
      $series_wrapper = entity_metadata_wrapper('node', $series_book);
      $series_volume_number_str = trim($series_wrapper->field_volume_number_str->value());
      $series_title = t(
        '@title, @volume',
        [
          '@title' => trim($series_wrapper->title->value()),
          '@volume' => $series_volume_number_str,
        ]
      );
      $series_book_identifier = $series_wrapper->field_identifier->value();
      $parent = $series_wrapper->field_series->value();
      $parent_wrapper = entity_metadata_wrapper('node', $parent);
      $parent_title = trim($parent_wrapper->title->value());
      $parent_identifier = $parent_wrapper->field_identifier->value();
      foreach ((array) $series_wrapper->field_collection->value() as $series_collection) {
        $series_collection_wrapper = entity_metadata_wrapper('node', $series_collection);
        $series_collections_partners = [];
        foreach ((array) $series_collection_wrapper->field_partner->value() as $series_collections_partner) {
          $series_collections_partner_wrapper = entity_metadata_wrapper('node', $series_collections_partner);
          $series_collections_partners[] = [
            'title' => $series_collections_partner->title,
            'uuid' => $series_collections_partner->uuid,
            'name' => $series_collections_partner_wrapper->field_name->value(),
            'code' => locale($series_collections_partner_wrapper->field_code->value(), NULL, $requestedLang),
            'identifier' => $series_collections_partner_wrapper->field_identifier->value(),
          ];
        }
        $series_collections[] = [
          'uuid' => $series_collection->uuid,
          'name' => $series_collection_wrapper->field_name->value(),
          'code' => locale($series_collection_wrapper->field_code->value(), NULL, $requestedLang),
          'identifier' => $series_collection_wrapper->field_identifier->value(),
          'partner' => $series_collections_partners,
        ];
      }
      $series[] = [
        'title' => $series_title,
        'identifier' => $series_book_identifier,
        'volumeNumber' => $series_wrapper->field_volume_number->value(),
        'volumeDisplay' => $series_wrapper->field_volume_number_str->value(),
        'isPartOf' => [
          'title' => $parent_title,
          'identifier' => $parent_identifier,
        ],
        'collection' => $series_collections,
      ];
    }
    unset($series_volume_number_str);
    unset($series_title);
    unset($series_wrapper);
    unset($parent_wrapper);
    unset($series_books);
  }

  $result = _dlts_viewer_process_metadata_fields($type['fields'], $wrapper, $requestedLang, $volumes);

  $fields = $result['fields'];

  $imageCount = $result['imageCount'];

  $worldDirection = $result['worldDirection'];
  $fields['multivolume'] = array_values($volumes);
  $fields['series'] = $series;
  $handle = explode('/', $result['handle']);

  $items = [];
  for ($sequence = 1; $imageCount >= $sequence; ++$sequence) {
    $items[] = "$base_url/api/image/$bundle/$identifier/$sequence/info.json";
  }

  $response = [
    'title' => $title,
    'displayTitle' => $displayTitle,
    'type' => 'book',
    'typeAlias' => $bundle,
    'identifier' => $identifier,
    'nid' => $entity->nid,
    'noid' => $handle[count($handle) - 1],
    'worldDirection' => $worldDirection,
    'requestedLanguage' => $availableLanguages[$requestedLang],
    'availableLanguages' => $availableLanguages,
    'status' => (int) $entity->status,
    'embedUrl' => "$base_url/api/embed/$identifier/1",
    'viewerUrl' => "$base_url/books/$identifier/1",
    'iiif' => [
      'identifier' => "$bundle/$identifier",
      'image' => [
        'service' => "$base_url/api/image",
        'version' => 2,
        'items' => $items,
      ],
      'presentation' => [
        'service' => "$base_url/api/presentation",
        'manifest' => "$base_url/api/presentation/$bundle/$identifier/manifest.json",
        'version' => 3,
      ],
    ],
    'isMultivolume' => $isMultivolume,
    'isSeries' => $isSeries,
    'thumbnail' => "$base_url/api/image/$bundle/$identifier/1/full/!400,400/0/default.jpg",
    'metadata' => $fields,
  ];

  $realpath = drupal_realpath('public://') . '/datasource';

  $cachepath = "$realpath/$bundle/$identifier/info.$requestedLang.json";

  if (!file_exists("$realpath/$bundle/$identifier")) {
    mkdir("$realpath/$bundle/$identifier", 0755, TRUE);
  }

  file_put_contents($cachepath, json_encode($response), LOCK_EX);

  return $response;

}

/**
 * API callback for a single book page sequence.
 *
 * @param array $sequence
 *   Sequence data array for the requested page.
 *
 * @return array
 *   The sequence array unchanged (passed through as the response).
 */
function dlts_viewer_imageserver_book_page(array $sequence) {
  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);
  return $sequence;
}

/**
 * Create or update image sequences for a photo set entity.
 *
 * Fetches IIIF image info for each page from the image server and updates
 * the stored sequence dimensions via dlts_viewer_mongodb_update_sequence().
 * Accepts a decoded POST body as $source.
 *
 * @param array $source
 *   Decoded POST data. Must include 'entity_type' ('dlts_photo_set' or
 *   'image_set'), 'identifier', and 'pages'.
 *
 * @return array|null
 *   Array with a 'data' key containing the source on success, NULL otherwise.
 */
function dlts_viewer_api_v1_dlts_photo_set_sequences($source) {

  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_photo_set');

  try {
    if ($source['entity_type'] == 'dlts_photo_set' || $source['entity_type'] == 'image_set') {

      if (isset($source['identifier'])) {
        $entity_identifier = $source['identifier'];
      } else {
        throw new Exception('Field identifier can not be empty.');
      }

      if (isset($source['pages'])) {
        // IIIF Image Server.
        $image_server = variable_get('dlts_image_server', 'https://image1.dlib.nyu.edu:8183');
        $collections = [
          'dlts_book' => 'dlts_books_page',
          'dlts_collection' => 'dlts_collection',
          'dlts_map' => 'dlts_map_page',
          'dlts_partner' => 'dlts_partner',
          'dlts_photo_set' => 'dlts_photo',
          'dlts_postcard' => 'dlts_postcard',
        ];
        $collection_name = $collections[$source['entity_type']];
        foreach ($source['pages']->page as $edit) {
          $uri = $edit->cm->uri;
          $image_id = urlencode(str_replace('fileserver://', '', $uri));
          $response = drupal_http_request("$image_server/iiif/2/$image_id/info.json", [ 'method' => 'GET', 'timeout' => 300 ]);
          if ($response->code == '200' && isset($response->data)) {
            $data = drupal_json_decode($response->data);
            unset($edit->cm->levels);
            unset($edit->cm->dwtLevels);
            unset($edit->cm->compositingLayerCount);
            unset($edit->cm->timestamp);
            $edit->cm->width = $data['width'];
            $edit->cm->height = $data['height'];
            $update = dlts_viewer_mongodb_update_sequence((array) $edit, $collection_name);
          }
        }
        return [
          'data' => $source,
        ];
      }
    }
  } catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), [], WATCHDOG_CRITICAL);
    die($e->getMessage());
  }
}

/**
 * Create or update a photo set entity from ingestion data.
 *
 * Validates required keys, extracts metadata (title, handle, partners,
 * collections, page/sequence counts), creates or updates the entity via
 * save_dlts_photo_set(), and returns the resulting metadata.
 *
 * @param array $source
 *   Decoded POST data. Must include 'entity_type', 'entity_language',
 *   'identifier', and optionally 'metadata', 'noid', 'ticket'.
 *
 * @return array|null
 *   Array with a 'data' key containing the saved node metadata on success,
 *   NULL otherwise. Calls die() on exception.
 */
function dlts_viewer_api_v1_dlts_photo_set_objects($source) {

  module_load_include('inc', 'dlts_viewer', 'inc/save/dlts_photo_set');

  // Define metadata fields.
  $partners = [];

  $collections = [];

  $title = NULL;

  $page_count = NULL;

  $sequence_count = NULL;

  $handle = NULL;

  $metadata = (object) [];

  $expected_keys = [
    'entity_title',
    'identifier',
    'entity_language',
    'entity_status',
    'entity_type',
    'metadata',
    'pages',
  ];

  try {

    if ($source['entity_type'] == 'dlts_photo_set' || $source['entity_type'] == 'image_set') {

      $keys = array_keys($source);

      // https://stackoverflow.com/questions/9655687/php-check-if-array-contains-all-array-values-from-another-array
      $containsSearch = !array_diff($expected_keys, $keys);

      // Check if request has all the keys we required.
      if ($containsSearch && count($expected_keys) == count($keys)) {
        if (isset($source['entity_title'])) {
          $entity_title = $source['entity_title'];
        } else {
          throw new Exception('Field entity_title can not be empty.');
        }

        if (isset($source['identifier'])) {
          $entity_identifier = $source['identifier'];
        } else {
          throw new Exception('Field identifier can not be empty.');
        }

        if (isset($source['metadata'])) {
          $metadata = $source['metadata'];
        }

        // Partners the book belong.
        if (isset($metadata->partner)) {
          foreach ($metadata->partner->value as $value) {
            $partners[] = [
              'title' => $value->title,
              'language' => $value->language,
              'identifier' => $value->identifier,
              'code' => $value->code,
              'name' => $value->name,
            ];
          }
        }

        // Collections the book belong.
        if (isset($metadata->collection)) {
          foreach ($metadata->collection->value as $value) {
            $collections[] = [
              'title' => $value->title,
              'language' => $value->language,
              'identifier' => $value->identifier,
              'code' => $value->code,
              'name' => $value->name,
              'partner' => $value->partner,
            ];
          }
        }

        // Change title to string not array.
        if (isset($metadata->title)) {
          $title = $metadata->title->value[0];
        }

        if (isset($metadata->page_count) && !empty($metadata->page_count->value)) {
          $page_count = $metadata->page_count->value[0];
        }

        if (isset($metadata->sequence_count) && !empty($metadata->sequence_count->value)) {
          $sequence_count = $metadata->sequence_count->value[0];
        }

        if (isset($metadata->handle) && !empty($metadata->handle->value)) {
          $handle = trim($metadata->handle->value[0]);
        }

        $ticket = '';
        if (isset($source['ticket'])) {
          $ticket = trim($source['ticket']);
        }

        $noid = '';
        if (isset($source['noid'])) {
          $noid = trim($source['noid']);
        } elseif (isset($handle)) {
          $parsed_url = parse_url($handle);
          $handlepath = str_replace('/2333.1/', '', $parsed_url['path']);
          $noid = trim($handlepath);
        }
        $node = [
          'entity_title' => $entity_title,
          'identifier' => $entity_identifier,
          'partners' => $partners,
          'collections' => $collections,
          'title' => $title,
          'page_count' => $page_count,
          'handle' => $handle,
          'sequence_count' => $sequence_count,
          'ticket' => $ticket,
          'noid' => $noid,
        ];
        $entity = save_dlts_photo_set($node, $source['entity_language']);
        if ($entity) {
          return [
            'data' => $node,
          ];
        }
      } else {
        throw new Exception('Keys: ' . implode(', ', $keys) . ' do not match the requirement: ' . implode(', ', $expected_keys));
      }
    } else {
      throw new Exception('Wrong entity type.');
    }
  } catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), [], WATCHDOG_CRITICAL);
    die($e->getMessage());
  }
}

/**
 * REST API endpoint: create or update sequences for an entity.
 *
 * Accepts a POST request (requires 'dlts create object' permission) with a
 * JSON body specifying entity_type and sequence data. Currently handles
 * 'dlts_photo_set' and 'image_set' entity types.
 *
 * @param string|null $version
 *   API version string (e.g. 'v1'). Unrecognised versions return an error.
 *
 * @return array
 *   Response array from the handler, or ['error' => 'User not allowed.'].
 */
function dlts_viewer_api_v1_sequences($version = NULL) {
  // @todo Also filter by hosts with access
  if (user_access('dlts create object') &&  $_SERVER['REQUEST_METHOD'] == 'POST') {
    $datasource = [];
    $entity_types = [
      'image_set',
      'dlts_book',
      'dlts_photo_set',
      'dlts_postcard',
      'dlts_map',
    ];
    $datasource = (array) json_decode(
      file_get_contents('php://input')
    );
    switch ($version) {
      case 'v1':
        if (in_array($datasource['entity_type'], $entity_types)) {
          switch ($datasource['entity_type']) {
            case 'dlts_photo_set':
            case 'image_set':
              return dlts_viewer_api_v1_dlts_photo_set_sequences($datasource);
          }
        }
        break;
    }
  }
  return [
    'error' => 'User not allowed.',
  ];
}

/**
 * REST API endpoint: create or update an entity, or list resources.
 *
 * POST (requires 'dlts create object'): creates or updates a DLTS entity
 * from a JSON body with 'entity_type'. Supports dlts_book, dlts_photo_set,
 * image_set, dlts_map, dlts_postcard, and dlts_serial.
 * GET (requires 'access content'): returns dlts_viewer_list_resource().
 *
 * @param string|null $version
 *   API version string (e.g. 'v1'). Unrecognised versions return an error.
 *
 * @return array
 *   Response array from the handler, or ['error' => 'User not allowed.'].
 */
function dlts_viewer_api_v1_objects($version = NULL) {
  if (
    user_access('dlts create object') &&
    $_SERVER['REQUEST_METHOD'] == 'POST'
  ) {

    $datasource = [];

    $entity_types = [
      'image_set',
      'dlts_book',
      'dlts_photo_set',
      'dlts_map',
      'dlts_serial',
    ];

    $datasource = (array) json_decode(
      file_get_contents('php://input')
    );

    switch ($version) {
      case 'v1':
        if (in_array($datasource['entity_type'], $entity_types)) {
          switch ($datasource['entity_type']) {
            case 'dlts_book':
              module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_book');
              return dlts_viewer_api_v1_dlts_book_objects($datasource);

            case 'dlts_photo_set':
            case 'image_set':
              return dlts_viewer_api_v1_dlts_photo_set_objects($datasource);

            case 'dlts_map':
              module_load_include('inc', 'dlts_viewer', 'inc/endpoints/map');
              return dlts_viewer_api_v1_dlts_map_objects($datasource);

            case 'dlts_serial':
              module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_serial');
              return dlts_viewer_api_v1_serial_objects($datasource);
          }
        }
        break;
    }
  } elseif (user_access('access content') && $_SERVER['REQUEST_METHOD'] == 'GET') {
    return dlts_viewer_list_resource();
  }

  return [
    'error' => 'User not allowed.',
  ];

}

/**
 * Generate metadata about a DLTS resource.
 *
 * @param object $resource
 *   A resource record from dlts_resource table.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function _dlts_viewer_noid_loader($resource) {

  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET');
  header('Content-Type: application/json;charset=utf-8');

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);
  if (isset($resource->nid)) {
    $entity = node_load($resource->nid);
    switch ($resource->document) {
      case 'books':
        // http://HOST/api/v1/noid/hqbzkt5z
        return dlts_viewer_api_book_json($entity);
      case 'photos':
        // http://HOST/api/v1/noid/fttdz79p
        return dlts_viewer_api_photo_json($entity);
      case 'maps':
        // http://HOST/api/v1/noid/6hdr7z37
        return dlts_viewer_api_map_json($entity);
      case 'serials':
        // http://HOST/api/v1/noid/fales_ear000102
        return dlts_viewer_api_serial_json($entity);
    }
    return false;
  }
  return false;
}

/**
 * List entities.
 *
 * @param int $start
 *   Index to start.
 * @param int $length
 *   Length of items in request.
 *
 * @return json|array
 *   A keyed array to be converted into JSON.
 */
function dlts_viewer_list_entities(int $start = 0, int $length = 10) {

  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }

  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  $status = 0;
  if (isset($query_parameters['status']) && is_numeric($query_parameters['status'])) {
    $status = $query_parameters['status'];
  }

  $type = '';
  if (isset($query_parameters['type'])) {
    $type = $query_parameters['type'];
  }

  $placeholders = [
    ':status' => (int) $status,
  ];

  $type_condition = '';
  if ($type !== '') {
    $type_condition = ' AND dlts_viewer_resource.document = :type';
    $placeholders[':type'] = $type;
  }

  $base_query = "
    FROM dlts_viewer_resource
    LEFT JOIN field_data_field_title title
      ON dlts_viewer_resource.nid = title.entity_id
    LEFT JOIN field_data_field_handle handle
      ON dlts_viewer_resource.nid = handle.entity_id
    LEFT JOIN field_data_field_collection collection
      ON dlts_viewer_resource.nid = collection.entity_id
    INNER JOIN field_data_field_code collection_code
      ON collection.field_collection_nid = collection_code.entity_id
    LEFT JOIN field_data_field_partner partner
      ON dlts_viewer_resource.nid = partner.entity_id
    INNER JOIN field_data_field_code partner_code
      ON partner.field_partner_nid = partner_code.entity_id
    WHERE dlts_viewer_resource.proceed > :status" . $type_condition;

  $count = db_query(
    "SELECT COUNT(DISTINCT dlts_viewer_resource.nid)" . $base_query,
    $placeholders
  )->fetchField();

  $results = db_query_range(
    "SELECT
      dlts_viewer_resource.nid,
      dlts_viewer_resource.noid,
      dlts_viewer_resource.document type,
      dlts_viewer_resource.identifier,
      dlts_viewer_resource.proceed,
      title.field_title_value title,
      handle.field_handle_url handle,
      collection_code.field_code_value collection_code,
      partner_code.field_code_value partner_code" . $base_query,
    $start,
    $length,
    $placeholders
  )->fetchAll();

  $nodes = [];

  foreach ($results as $result) {
    $nodes[] = [
      'nid' => $result->nid,
      'noid' => $result->noid,
      'type' => $result->type,
      'identifier' => $result->identifier,
      'title' => $result->title,
      'handle' => $result->handle,
      'collections' => $result->collection_code,
      'partners' => $result->partner_code,
    ];
  }
  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => (int) $count,
      'start' => (int) $start,
      'docs' => $nodes,
    ],
  ];
  return $response;

}

/**
 * Load sequences for a node from MongoDB.
 *
 * @param object $object
 *   A resource record from dlts_viewer_resource containing at least a nid.
 *
 * @return array
 *   Solr-style response array with numFound, start, and docs containing
 *   sequence data (fid, sequence, uri, url, width, height).
 */
function dlts_viewer_objects_sequences($object) {

  $node = node_load($object->nid);

  $wrapper = entity_metadata_wrapper('node', $node);

  $isPartOf = $wrapper->field_identifier->value();

  $results = dlts_viewer_mongodb_load_resource_by_identifier($isPartOf, 'dlts_books_page');

  $docs = [];

  foreach ($results as $result) {
    $result = (array) $result;
    $docs[] = [
      'fid' => (string) $result['_id'],
      'sequence' => $result['sequence'],
      'uri' => $result['cm']['uri'],
      'url' => file_create_url($result['cm']['uri']),
      'width' => $result['cm']['width'],
      'height' => $result['cm']['height'],
    ];
  }

  // Try to mimic Apache Solr response.
  $response = [
    'response' => [
      'numFound' => count($docs),
      'start' => 0,
      'docs' => $docs,
    ],
  ];

  return $response;

}
