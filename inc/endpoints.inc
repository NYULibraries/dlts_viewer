<?php

/**
 * @file
 */
function dlts_viewer_book($node, $list_pages = TRUE) {
  $book = dlts_viewer_book_metadata($node);
  if ($list_pages) {
    $book = array_merge((array) $book, (array) dlts_viewer_book_pages($node));
  }
  return $book;
}

function dlts_viewer_books($start = 0, $length = 25) {
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
  // try to mimic Apache Solr response
  $response = array(
    'response' => array(
      'numFound' => $count,
      'start' => $start,
      'docs' => array(),
    )
  );
  foreach ((array) $nodes as $node) {
    $response['response']['docs'][] = dlts_viewer_book($node, FALSE);
  }
  return $response;
}

/**
 * Generate metadata about a book.
 *
 * @param $dlts_book
 * A dlts_book node object
 * @return
 * A keyed array to be converted into JSON
 *
 */
function dlts_viewer_book_metadata($book) {
	if (!is_object($book)) {
    return array('argument' => $book, 'code' => 1, 'message' => t('Invalid book'), 'status' => t('fail') );
	}
	module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.book');
	module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.collection');
  $type = dlts_utilities_content_types_type($book->type);
  $fields = array();
  $ewrapper = entity_metadata_wrapper('node', $book);
  foreach ($type['fields'] as $field) {
    $name = str_replace('field_', '', $field['field_name']);
    $raw_value = $ewrapper->$field['field_name']->value();
    if ($field['type'] == 'options_buttons') {
      $value = $field['settings']['allowed_values'][$raw_value];
    }
    elseif ($field['type'] == 'link_field' && isset($raw_value['url'] )) {
      $value = $raw_value['url'];
    }
    elseif ($field['type'] == 'file_generic') {
      $value = array();
      foreach ((array) $raw_value as $pdf_file) {
        $value[] = file_create_url($pdf_file['uri']);
      }
    }
    elseif ($field['type'] == 'date_text') {
      $raw_value['value'];
    }
    elseif ($field['type'] == 'image_image') {
      $value = file_create_url($raw_value['uri']);
    }
    elseif ($field['type'] == 'taxonomy_autocomplete') {
      $value = array();
      foreach ($raw_value as $taxonomy) {
        $value[] = $taxonomy->name;
      }
    }
    else {
      $value = $raw_value;
    }
    $fields[$name] = array('label' => $field['label'], 'value' => (array) $value);
  }
  return array(
    'entity_title' => !empty($title) ? $title : $book->title,
    'identifier' => $fields['identifier']['value'][0],
    'entity_path' => url('books/' . $identifier . '/1', array('absolute' => TRUE)),
    'base_url' => url('', array('absolute' => TRUE)),
    'entity_language' => $book->language,
    'entity_status' => $book->status,
    'entity_type' => $book->type,
    'metadata' => $fields,
  );
}

function dlts_viewer_list_collections($start = 0, $length = 100) {

  // get query parameters
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

  // try to mimic Apache Solr response
  $response = array(
    'response' => array(
      'numFound' => $count,
      'start' => $start,
      'docs' => array(),
    ),
  );

  foreach ($entities['node'] as $node) {
    $entity = node_load('node', $node->nid);
    $wrapper = entity_metadata_wrapper('node', $entity);
    $partners = array();
    foreach ($wrapper->field_partner->getIterator() as $delta => $partner_wrapper) {
      if ($partner_wrapper->getBundle() == 'dlts_partner') {
        $partners[] = array(
          'name' => $partner_wrapper->field_name->value(),
          'code' => $partner_wrapper->field_code->value(),
        );
      }
    }
    $response['response']['docs'][] = array(
      'title' => trim($wrapper->field_name->value()),
      'identifier' => $wrapper->field_identifier->value(),
      'code' => $wrapper->field_code->value(),
      'partners' => $partners,
    );
  }

  return $response;

}

function dlts_viewer_api_list_topics($start = 0, $length = 50, $requestedLang = 'en') {
  
  $availableLanguages = array_keys(language_list());

  // get query parameters
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
  
  // need to make sure lang exists
  if (isset($query_parameters['lang']) && in_array($query_parameters['lang'], $availableLanguages)) {
    $requestedLang = $query_parameters['lang'];
  }

  $sql_dates = "
    SELECT 
      DISTINCT DATE_FORMAT(FROM_UNIXTIME(node.created), '%Y-%m-%d') created
      FROM node
      LEFT JOIN field_data_field_collection collection 
        ON node.nid = collection.entity_id
      INNER JOIN field_data_field_code code 
        ON collection.field_collection_nid = code.entity_id 
        AND code.field_code_value = :collection_code
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
      AND code.field_code_value = :collection_code
    WHERE node.language = :language
    AND node.created <= UNIX_TIMESTAMP(:date)
    AND node.status = :status
    GROUP BY topic.field_topic_value 
    ORDER BY count DESC"; 

  $result = db_query_range(
    $sql, 
    $start, 
    $length, 
    array(
      ':language' => $requestedLang,
      ':collection_code' => 'aco',
      ':date' => $filter_date,
      'status' => 1,
    )
  )->fetchAll();

  $dates = db_query($sql_dates, array(
    ':language' => $requestedLang, 
    ':collection_code' => 'aco', 
    ':status' => 1,
    )
  )->fetchAll();

  $filter_dates = array();

  foreach ($dates as $date) {
    $filter_dates[] = $date->created;
  }

  // try to mimic Apache Solr response
  $response = array(
    'response' => array(
      'numFound' => count($result),
      'start' => $start,
      'docs' => $result,
      'facets' => array(
        'date' => $filter_dates,
      ),
    ),
  );

  return $response;

}

// list books and return array ('title', 'identifier')
function dlts_viewer_api_list_books($start = 0, $length = 15, $requestedLang = 'en') {

  $availableLanguages = array_keys(language_list());

  // get query parameters
  $query_parameters = drupal_get_query_parameters();
  
  if (isset($query_parameters['rows']) && is_numeric($query_parameters['rows'])) {
    $length = $query_parameters['rows'];
  }
  
  if (isset($query_parameters['start']) && is_numeric($query_parameters['start'])) {
    $start = $query_parameters['start'];
  }

  $cnid = null;

  if (isset($query_parameters['collection'])) {
    $partner = null;
    if (isset($query_parameters['partner'])) {
      $partner = $query_parameters['partner'];
    }    
    $cnid = dlts_viewer_collection_nids_by_code($query_parameters['collection'], $partner);
  }

  $filter = '';
  
  if (isset($query_parameters['filter'])) {
    $filter = $query_parameters['filter'];
  }

  // need to make sure lang exists
  if (isset($query_parameters['lang']) && in_array($query_parameters['lang'], $availableLanguages)) {
    $requestedLang = $query_parameters['lang'];
  }

  $count_query = new EntityFieldQuery();

  $entities_query = new EntityFieldQuery();
  
  // https://www.drupal.org/docs/7/creating-custom-modules/howtos/how-to-use-entityfieldquery-for-drupal-7
  $count_query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_book')
    ->propertyCondition('language', $requestedLang)
    ->propertyCondition('status', NODE_PUBLISHED);

  if ($cnid) {
    $count_query->fieldCondition('field_collection', 'nid', $cnid, 'IN');
  }

  if ($filter) {
    // Equal to "starts with"
    // $count_query->fieldCondition('field_identifier', 'value', db_like($filter) . '%', 'LIKE');
    // Equal to "contains"
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
    // Equal to "starts with"
    // $entities_query->fieldCondition('field_identifier', 'value', db_like($filter) . '%', 'LIKE');
    // Equal to "contains"
    $entities_query->fieldCondition('field_identifier', 'value', '%' . db_like($filter) . '%', 'like');
  }

  $entities = $entities_query->range($start, $length)
    ->addMetaData('account', user_load(0))
    ->execute();

  // try to mimic Apache Solr response
  $response = array(
    'response' => array(
      'numFound' => $count,
      'start' => $start,
      'docs' => array(),
    ),
  );

  foreach ($entities['node'] as $node) {
    $entity = node_load('node', $node->nid);
    $book = entity_metadata_wrapper('node', $entity);    
    $response['response']['docs'][] = array(
      'title' => trim($entity->title),
      'identifier' => $book->field_identifier->value(),
    );
  }

  return $response;
}

function _dlts_viewer_book_loader($type, $identifier, $reset = false) {

  // get query parameters
  $query_parameters = drupal_get_query_parameters();

  $requestedLang = 'en';

  // need to make sure lang exists
  if (isset($query_parameters['lang'])) {
    $requestedLang = $query_parameters['lang'];
  }

  if (isset($query_parameters['reset'])) {
    $reset = true;
  }

  $realpath = drupal_realpath('public://') . '/datasource/' . $type . '/' . $identifier . '/book.' . $requestedLang . '.json';

  if (file_exists($realpath) && !$reset) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Content-Type: application/json;charset=utf-8');
    echo file_get_contents($realpath);
    exit(0);
  } else {
    return dlts_viewer_api_book_json(
      dlts_book_load($identifier)
    );
  }
}

// not working until we have a server to make request
function _dlts_viewer_book_thumbnails_loader($identifier, $page = 0, $per_page = 10) {

  $items = array();

  return $items;

  $image_server = variable_get('dlts_viewer_image_server', 'http://127.0.0.1:8182');

  $collection_name = 'dlts_books_page';

  // get query parameters
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['page']) && is_numeric($query_parameters['page'])) {
    $page = $query_parameters['page'];
  }

  if (isset($query_parameters['per_page']) && is_numeric($query_parameters['per_page'])) {
    $per_page = $query_parameters['per_page'];
  }
  

  $query = (object) array(
    'isPartOf' => $identifier,
  );

  $cursor = mongodb_collection($collection_name)->find($query);

	// no need to continue if request does not have items.
	$count = $cursor->count();

  if ($cursor->count() > 0) {

		// DLTSVIEWER-27
		// https://docs.mongodb.org/manual/reference/method/cursor.sort/  
    $cursor->sort(
      array(
        'sequence' => 1
      )
    );
    
		$cursor->limit($per_page);
    
    $cursor->skip($per_page * $page);
    
    $thumbnails = $cursor->skip($per_page * $page);

		foreach ($thumbnails as $thumbnail) {
      $url = $image_server . '/iiif/2/' . urlencode(file_create_url($thumbnail['cm']['uri'])) . '/full/150,/0/default.jpg';
      $items[] = array(
        'url' => $url,
        'sequence' => min($thumbnail['sequence']),
      );
    }
  }

  // try to mimic Apache Solr response
  $response = array(
    'response' => array(
      'isPartOf' => $identifier,
      'numFound' => $count,
      'page' => $page,
      'per_page ' => $per_page,
      'docs' => $items,
    ),
  );  

  // $image_metadata_uri = $image_server . '/iiif/2/' . urlencode($representative_image) . '/full/150,/0/default.jpg';

  // foreach ($entities['node'] as $node) {
  //   $entity = node_load('node', $node->nid);
  //   $book = entity_metadata_wrapper('node', $entity);    
  //   $response['response']['docs'][] = array(
  //     'title' => trim($entity->title),
  //     'identifier' => $book->field_identifier->value(),
  //   );
  // }

  // print_r($response);

  // die();

  return $response;

}

// return a book JSON object with it's metadata
// used by:
// - menu_hook: 'api/v1/books/%'
function dlts_viewer_api_book_json($entity, $requestedLang = 'en') {

  drupal_add_http_header('Access-Control-Allow-Methods', 'GET');
  
  // Books to test:
  // http://sites.dlib.nyu.edu/viewer/books/brill_awdl000076/1
  // http://sites.dlib.nyu.edu/viewer/books/columbia_aco001206/1

  // Example of book with multi and series
  // http://sites.dlib.nyu.edu/viewer/books/columbia_aco002306/1
  // vue: http://192.168.0.4:8081/books/columbia_aco002306/1

  module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.book');

  module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.collection');

  $image_server = variable_get('dlts_viewer_image_server', 'http://127.0.0.1:8182');

  $fields = $series = $volumes = $collections = $pages = array();

  // get query parameters
  $query_parameters = drupal_get_query_parameters();

  // need to make sure lang exists
  if (isset($query_parameters['lang'])) {
    $requestedLang = $query_parameters['lang'];
  }

  $availableLanguages = language_list();

  // default to left-to-rigth
  // will set later on using the book field "field_language_code"
  // and the language map from $availableLanguages
  $worldDirection = 'rtl';

  // Entity API wrapper
  $book = entity_metadata_wrapper('node', $entity);

  // book identifier
  $identifier = $book->field_identifier->value();

  $language_code = mapLanguageCode(
    array_pop(
      $book->field_language_code->value()
    )
  );

  foreach ($availableLanguages as $code => $lang) {
    if (
      // MUST check if language is enable
      $availableLanguages[$code]->enabled &&
      // check if this books exists in the given language
      // 2 different strategies to check
      (        
        // 1) check if loaded book language match the language
        $code == $entity->language ||
        // if not, 
        // 2) This book is not the same language as $code,
        // query the book using the identifier and $code
        // if we have a nid, we have a book.
        book_nid($identifier, $code)
      )
    ) {
        $availableLanguages[$code]->direction = ($availableLanguages[$code]->direction == 0) ?  'ltr' : 'rtl';
        $availableLanguages[$code]->default = ($code == $requestedLang) ? 1 : 0;
        // we don't have any use for this properties
        unset($availableLanguages[$code]->enabled);
        unset($availableLanguages[$code]->prefix);
        unset($availableLanguages[$code]->plurals);
        unset($availableLanguages[$code]->formula);
        unset($availableLanguages[$code]->domain);
        unset($availableLanguages[$code]->weight);
        unset($availableLanguages[$code]->javascript);
      } else {
        // language is not enabled
        unset($availableLanguages[$code]);
      }
  }

  // field representative image
  $fri = $book->field_representative_image->value();

  $representative_image = file_create_url($fri['uri']);
  
  // default title of the book
  $title = $entity->title;

  $type = dlts_utilities_content_types_type($entity->type);  

  $isMultivolume = false;

  // check if this books is part of a multi-volume
  $multivolume_book = dlts_viewer_is_multivolume_book($entity);

  // if book is part of multi-volume; append volume value to entity title
  if ($multivolume_book) {
    $isMultivolume = true;
    // wrapp multi-volume entity with Entity API wrapper
    $wrapper = entity_metadata_wrapper('node', $multivolume_book);
    // get volume value
    $volume_number_str = $wrapper->field_volume_number_str->value();
    // change entity title
    $title = t('@title @volume', array(
      '@title' => $multivolume_book->title, 
      '@volume' => $volume_number_str,
      )
    );
    $multivolume_books = dlts_viewer_books_isPartof_multivolume($wrapper->field_multivol->value()->nid);
    foreach ($multivolume_books as $mb) {
      // wrapp multi-volume entity with Entity API wrapper
      $mb_wrapper = entity_metadata_wrapper('node', $mb);
      $volume = $mb_wrapper->field_volume_number->value();
      // the book we map to this multivolume
      $bs_wrapper = entity_metadata_wrapper('node', $mb_wrapper->field_book->value());
      $volumes[$volume] = array(
        'identifier' => $bs_wrapper->field_identifier->value(),
        'selected' => ($bs_wrapper->nid->value() == $entity->nid),
        'title' => t('@title @volume', array(
          '@title' => $mb->title, 
          '@volume' => $mb_wrapper->field_volume_number_str->value(),
          )
        ),           
      );
      unset($mb_wrapper);
    }
    unset($multivolume_books);
    asort($volumes);
  }

  $series_books = dlts_viewer_series_book($entity->nid);

  $isSeries = false;

  if (!empty($series_books)) {
    $isSeries = true;
    foreach ($series_books as $series_book) {
      $series_wrapper = entity_metadata_wrapper('node', $series_book);
      $series_volume_number_str = trim($series_wrapper->field_volume_number_str->value());
      $series_title = t(
        '@title, @volume', 
        array(
          '@title' => trim($series_wrapper->title->value()), 
          '@volume' => $series_volume_number_str,
        )
      );
      $series_book_identifier = $series_wrapper->field_identifier->value();
      $parent = $series_wrapper->field_series->value();
      $parent_wrapper = entity_metadata_wrapper('node', $parent);
      $parent_title = trim($parent_wrapper->title->value());
      $parent_identifier = $parent_wrapper->field_identifier->value();
      $series[] = array(
        'title' => $series_title,
        'identifier' => $series_book_identifier,
        'isPartOf' => array(
          'title' => $parent_title, 
          'identifier' => $parent_identifier,
        ),
      );
    }
    unset($series_volume_number_str);
    unset($series_title);
    unset($parent_series);
    unset($series_wrapper);
    unset($parent_wrapper);
    unset($series_books);
  }

  foreach ($type['fields'] as $field) {
    $name = str_replace('field_', '', $field['field_name']);
    // get the raw value of the field
    $raw_value = $book->$field['field_name']->value();
    $fields[$name] = array(
      'label' => locale($field['label'], NULL, $requestedLang), 
      'value' => null,
    );

    switch ($name) {
      case 'author':
      case 'contributor': // test, empty?
      case 'creator': // test, empty?
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
        $fields[$name]['value'] = array();
        $collections = dlts_viewer_collection_json($raw_value);
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
        // find out how to deal with this
        unset($fields[$name]);
      break;
      
      case 'handle':
        $fields[$name]['value'] = $raw_value['url'];
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
        $partner_value = array();
        foreach ($raw_value as $partner) {
          $partner_wrapper = entity_metadata_wrapper('node', $partner);
          $partner_value[] = array(
            'identifier' => $partner_wrapper->field_identifier->value(),
            'code' => $partner_wrapper->field_code->value(),
            'name' => locale($partner_wrapper->field_name->value(), NULL, $requestedLang),
          );
        }
        $fields[$name]['value'] = $partner_value;
        unset($partner_value);
      break;

      case 'pdf_file':
        $fields[$name]['value'] = array(
          'hi' => array(),
          'lo' => array(),
        );
        foreach ($raw_value as $value) {
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
                $fields[$name]['value']['hi'] = array(
                  'label' => locale('High-resolution', NULL, $requestedLang),
                  'uri' => $data['uri'],
                  'searchable' => false, // for now, will use R* API to get this information
                  'size' => $data['size'], // for now, will use R* API to get this information
                );
              break;
              case 'lo':
                $fields[$name]['value']['lo'] = array(
                  'label' => locale('Low-resolution', NULL, $requestedLang),
                  'uri' => $data['uri'],
                  'searchable' => false, // for now, will use R* API to get this information
                  'size' => $data['size'], // for now, will use R* API to get this information
                );
              break;
            }
          }
        }
      break;
      
      case 'publication_date':
        $fields[$name]['value'] = $raw_value['value'];         
      break;
      
      case 'read_order':
        // [0] => Left to right
        // [1] => Right to left
        $map = array(
          0 => 'ltr',
          1 => 'rtl',
        );
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
        $map = array(
          0 => 'ltr',
          1 => 'rtl',
        );
        $fields[$name]['value'] = $map[$raw_value];
        unset($map);
      break;
      
      case 'sequence_count':
        $fields[$name]['value'] = (int) $raw_value;
      break;
      
      case 'subject':
        $subjects = array();
        foreach ($raw_value as $subject) {
          $subjects[] = array(
            'uuid' => $subject->uuid,
            'name' => $subject->name,
          );
        }
        $fields[$name]['value'] = $subjects;
        unset($subjects);
      break;
      
      case 'title':
        unset($fields[$name]);
      break;
      
      case 'topic':
        $topics = array();
        foreach ($raw_value as $topic) {
          $topics[] = locale($topic, NULL, $requestedLang);
        }
        $fields[$name]['value'] = $topics;
        unset($topics);
      break;
      
      case 'volume':
        $fields['volumes'] = $volumes;
        unset($fields[$name]);
      break;

    }
  }

  $fields['series'] = $series;

  // check if we must include pages in the response
  if (isset($query_parameters['pages'])) {
    $add_pages = true;
  } else {
    $add_pages = false;
  }

  if ($add_pages) {
    $pages_raw = dlts_viewer_mongodb_load_by_item_identifier($identifier, 'dlts_books_page');
    foreach ($pages_raw as $page_raw) {
      $page = array(
        'page' => array(
          'isPartOf' => $identifier,
          'realPageNumber' => $page_raw['realPageNumber'],
          'sequence' => $page_raw['sequence'],
          'cm' => array(
            'uri' => ($page_raw['cm']['uri']),
            'width' => $page_raw['cm']['width'],
            'height' => $page_raw['cm']['height'],
          )
        )
      );
      $pages[] = $page;
    }
  }

  $image_metadata_uri = $image_server . '/iiif/2/' . urlencode($representative_image) . '/full/150,/0/default.jpg';

  $response = array(
    'title' => $title,
    'identifier' => $identifier,
    'worldDirection' => $worldDirection,
    'requestedLanguage' => $availableLanguages[$requestedLang],
    'availableLanguages' => $availableLanguages,
    'status' => (int) $entity->status,
    'isMultivolume' => $isMultivolume,
    'isSeries' => $isSeries,
    'representativeImage' => $representative_image,
    'thumbnail' => $image_metadata_uri,
    'metadata' => $fields,
    'pages' => $pages
  );

  $realpath = drupal_realpath('public://') . '/datasource';

  foreach ($fields['collection']['value'] as $collection) {
    $dir_path = $realpath . '/books/' . $identifier;
    if (!file_exists($dir_path)) {
      mkdir($dir_path, 0755, true);
    }
    file_put_contents($dir_path . '/book.' . $requestedLang . '.json', json_encode($response), LOCK_EX);
  }

  return $response;

}

function dlts_viewer_djakota_book_page_loader($identifier, $sequence) {
  $data = dlts_viewer_mongodb_load_sequence($sequence, $identifier, 'dlts_books_page');
  if (isset($data['cm'])) {
    if (isset($data['cm']['uri'])) {
      /**
       * Load djatoka helper
       */
      module_load_include('inc', 'dlts_viewer', 'inc/djatoka');      
      return dlts_viewer_djatoka_request(
        array(
          'uri' => $data['cm']['uri'],
        )
      );
    }
  }
  exit(1);
}

// e.g., http://localhost:9000/viewer/api/v1/tile?region=0,2048,256,256&level=3&id=http://dlib.nyu.edu/files/books/princeton_aco000320/princeton_aco000320_n000298_d.jp2
function dlts_viewer_djakota_stream_book_page() {

  // get query parameters
  $query_parameters = drupal_get_query_parameters();

  // $id Image URL
  // e.g., http://dlib.nyu.edu/files/books/princeton_aco000320/princeton_aco000320_n000298_d.jp2
  if (isset($query_parameters['id'])) {
    $id = rawurlencode($query_parameters['id']);
  } else {
    die('Request must include id');
  }

  // $level Image level
  // e.g., 3
  if (isset($query_parameters['level'])) {
    $level = $query_parameters['level'];
  } else {
    die('Request must include level');
  }

  // $region Tile region
  // e.g., 0,2048,256,256 or 0 for full image
  $region = false;
  if (isset($query_parameters['region'])) {
    $region = $query_parameters['region'];
  }
  // use variable_get
  $resolver = 'http://dl-img.home.nyu.edu/adore-djatoka/resolver';  
  
  $url_ver = 'Z39.88-2004';
  
  $svc_id = 'info:lanl-repo/svc/getRegion';
  
  $svc_val_fmt = 'info:ofi/fmt:kev:mtx:jpeg2000';

  $url = $resolver . '?url_ver=' . $url_ver . '&rft_id=' . $id . '&svc_id=' . $svc_id . '&svc_val_fmt=' . $svc_val_fmt . '&svc.level=' . $level;

  if ($region) {
    $url = $url . '&svc.region=' . $region;
  }

  $content = file_get_contents($url);

  $requestStatus = substr($http_response_header[0], 9, 3);
  
  $responseType = substr($http_response_header[3], 14);

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

function dlts_viewer_api_v1_dlts_book_objects($source) {
  module_load_include('inc', 'dlts_viewer', 'inc/create.dlts_book');
  $apiVersion = 'v1';
  try {
    if (!user_access('dlts create object')) {
      throw new Exception(__FUNCTION__ . ' user not allowed to run task');
    }
    if ($source['entity_type'] !== 'dlts_book') {
      throw new Exception('Wrong entity type ' . $source['entity_type'] .'.');
    }
    // check if request has all the keys we required.
    if (
      isset($source['entity_type']) &&
      isset($source['identifier']) &&
      isset($source['entity_language']) &&
      isset($source['entity_status']) &&
      isset($source['entity_type']) &&
      isset($source['metadata'])
    ) {
      if (!isset($source['entity_title'])) {
        throw new Exception('Field entity_title can not be empty.');
      }
      if (!isset($source['identifier'])) {
        throw new Exception('Field identifier can not be empty.');
      }
      $entity = create_dlts_book_from_json($source);
      if ($entity) {
        return array(
          'data' => $entity,
        );
      } else {
        throw new Exception('Unable to process entity with identifier ' . $source['identifier'] .'.');
      }
    }
  } catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), array(), WATCHDOG_CRITICAL);
    return array(
      'error' => $e->getMessage(),
    );     
  }

}

function dlts_viewer_api_v1_dlts_photo_set_objects($source) {

  module_load_include('inc', 'dlts_viewer', 'inc/create.dlts_photo_set');

  $apiVersion = 'v1';  

  /** Define metadata fields */
  $partners = array();

  $collections = array();

  $title = NULL;

  $page_count = NULL;
  
  $sequence_count = NULL;
  
  $handle = NULL;

  $metadata = (object) array();

  $expected_keys = array(
    'entity_title',
    'identifier',
    'entity_language',
    'entity_status',
    'entity_type',
    'metadata',
    'pages',
  );

  $nodes = array(
    'photo' => array(),
    'collection' => '',
    'partner' => '',
  );

  try {
    
    if (!user_access('dlts create object')) {
      throw new Exception(__FUNCTION__ . ' user not allowed to run task');
    }

    if ($source['entity_type'] !== 'dlts_photo_set') {
      throw new Exception('Wrong entity type.');
    }

    $keys = array_keys($source);
    // https://stackoverflow.com/questions/9655687/php-check-if-array-contains-all-array-values-from-another-array
    $containsSearch = !array_diff($expected_keys, $keys);
    // check if request has all the keys we required.
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

      /** partners the book belong */
      if (isset($metadata->partner)) {
        foreach ($metadata->partner->value as $value) {
          $partners[] =  array(
            'title' => $value->title,
            'language' => $value->language,
            'identifier' => $value->identifier,
            'code' => $value->code,
            'name' => $value->name,
          );
        }
      }
      /** collections the book belong */
      if (isset($metadata->collection)) {
        foreach ($metadata->collection->value as $value) {
          $collections[] =  array(
            'title' => $value->title,
            'language' => $value->language,
            'identifier' => $value->identifier,
            'code' => $value->code,
            'name' => $value->name,
            'partner' => $value->partner,
          );
        }
      }
      /** change title to string not array */
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
        $handle = $metadata->handle->value[0];
      }
      $node = array(
        'entity_title' => $entity_title,
        'identifier' => $entity_identifier,
        'partners' => $partners,
        'collections' => $collections,
        'title' => $title,
        'page_count' => $page_count,
        'handle' => $handle,
        'sequence_count' => $sequence_count,
      );
      $entity = save_dlts_photo_set($node, $source['entity_language']);
      if ($entity) {
        return array(
          'data' => $node,
        );
      }
    } else {
      throw new Exception('Keys: ' . implode(', ', $keys) . ' do not match the requierement: ' . implode(', ', $expected_keys));
    }
  } catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), array(), WATCHDOG_CRITICAL);
    return array(
      'error' => $e->getMessage(),
    );    
  }
}

function dlts_viewer_api_v1_objects() {
  if (user_access('dlts create object')) { // and allow hosts
    $datasource = array();
    $entity_types = array(
      'dlts_book', 
      'dlts_photo_set',
    );
    $datasource = (array) json_decode(
      file_get_contents('php://input')
    );
    if (in_array($datasource['entity_type'], $entity_types)) {
      switch ($datasource['entity_type']) {
        case 'dlts_book':
          return dlts_viewer_api_v1_dlts_book_objects($datasource);
          break;
        case 'dlts_photo_set':
          return dlts_viewer_api_v1_dlts_photo_set_objects($datasource);
          break;
      }
    }
  }
  return array(
    'error' => 'User not allowed.',
  );
}

// e.g., http://localhost:9000/viewer/api/v1/tile?region=0,2048,256,256&level=3&id=http://dlib.nyu.edu/files/books/princeton_aco000320/princeton_aco000320_n000298_d.jp2
function dlts_viewer_djakota_resolver_stream() {

  // get query parameters
  $query_parameters = drupal_get_query_parameters();

  // $id Image URL
  // e.g., http://dlib.nyu.edu/files/books/princeton_aco000320/princeton_aco000320_n000298_d.jp2
  if (isset($query_parameters['rft_id'])) {
    $id = rawurlencode($query_parameters['rft_id']);
  } else {
    die('Request must include id.');
  }

  // $level Image level
  // e.g., 3
  $level = FALSE;
  if (isset($query_parameters['svc_level'])) {
    $level = $query_parameters['svc_level'];
  } elseif (isset($query_parameters['svc.level'])) {
    $level = $query_parameters['svc.level'];
  }

  // $region Tile region
  // e.g., 0,2048,256,256 or 0 for full image
  $region = FALSE;
  if (isset($query_parameters['svc_region'])) {
    $region = $query_parameters['svc_region'];
  } elseif (isset($query_parameters['svc.region'])) {
    $region = $query_parameters['svc.region'];
  }

  $rotate = 0;
  if (isset($query_parameters['svc_rotate'])) {
    $rotate = $query_parameters['svc_rotate'];
  } elseif (isset($query_parameters['svc.rotate'])) {
    $rotate = $query_parameters['svc.rotate'];
  }

  $scale = FALSE;
  if (isset($query_parameters['svc_scale'])) {
    $scale = $query_parameters['svc_scale'];
  } elseif (isset($query_parameters['svc.scale'])) {
    $scale = $query_parameters['svc.scale'];
  }
  
  $service = variable_get('dlts_viewer_djatoka_service', 'http://dl-img.home.nyu.edu/adore-djatoka');
  
  $resolver = "$service/resolver";
  
  $url_ver = 'Z39.88-2004';
  
  $svc_id = 'info:lanl-repo/svc/getRegion';
  
  $svc_val_fmt = 'info:ofi/fmt:kev:mtx:jpeg2000';

  $url = $resolver . '?url_ver=' . $url_ver . '&rft_id=' . $id . '&svc_id=' . $svc_id . '&svc_val_fmt=' . $svc_val_fmt;

  if ($level) {
    $url = $url . '&svc.level=' . $level;
  }

  if ($region) {
    $url = $url . '&svc.region=' . $region;
  }

  if ($rotate) {
    $url = $url . '&svc.rotate=' . $rotate;
  }

  if ($scale) {
    $url = $url . '&svc.scale=' . $scale;
  }   

  $content = file_get_contents($url);

  $requestStatus = substr($http_response_header[0], 9, 3);
  
  $responseType = substr($http_response_header[3], 14);

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
