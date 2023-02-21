<?php

/**
 * @file
 * API ePubs callbacks.
 */

/**
 * Undocumented function.
 */
function dlts_viewer_api_v0_epubs() {

  global $base_url;

  $results = db_query('SELECT DISTINCT publisher as identifier, field_data_field_name.field_name_value as label FROM dlts_viewer_epubs LEFT JOIN field_data_field_code on field_data_field_code.field_code_value = dlts_viewer_epubs.publisher LEFT JOIN field_data_field_name ON field_data_field_code.entity_id = field_data_field_name.entity_id');

  $docs = [];

  foreach ($results as $doc) {
    $doc->uri = "$base_url/api/v0/epubs/$doc->identifier";
    $docs = $doc;
  }

  return [
    'response' => [
      'start' => 0,
      'numFound' => count($docs),
      'docs' => $docs,
    ],
  ];
}

/**
 * Undocumented function.
 */
function dlts_viewer_admin_epubs() {

  $publishers = [];
  
  $results = db_query('SELECT DISTINCT publisher as identifier, field_data_field_name.field_name_value as label FROM dlts_viewer_epubs LEFT JOIN field_data_field_code on field_data_field_code.field_code_value = dlts_viewer_epubs.publisher LEFT JOIN field_data_field_name ON field_data_field_code.entity_id = field_data_field_name.entity_id');

  foreach ($results as $record) {
    $publishers[] = [
      'label' => l($record->label, "admin/epubs/$record->identifier", [ 'attributes' => [ 'class' => 'link' ] ]),
      'identifier' => l($record->identifier, "admin/epubs/$record->identifier", [ 'attributes' => [ 'class' => 'link' ] ]),
    ];
  }

  $output = theme(
    'table', 
    [ 
      'header' => [ 'Label', 'Identifier' ], 
      'rows' => $publishers,
      'attributes' => [
        'class' => [ 
          'table',
        ],
        'width' => '100%' 
      ]
    ]
  );

  return $output;

}

/**
 * Undocumented function.
 */
function dlts_viewer_admin_epub($publisher, $record) {
  
  $rows = [];
  
  foreach ($record as $key => $item) {
    if ($key == 'subjects') {
      $item = implode(' / ', $item);
    }
    if ($key == 'description_html') {
      $item = "<textarea disabled rows='5' style='-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; padding:2px 4px; width: 100%; min-widht: 100%'>$item</textarea>";
    }      
    $rows[] = [
      'label' => $key,
      'value' => $item,
    ];
  }

  $output= '';
  
  $output .= "<h1 class='title' style='font-size: 1.3em; margin-bottom: 0; margin-top: 1em;'>" . $record['title'] . "</h1>";
  
  $output .= "<p class='subtitle' style='color: gray; font-size: 1em; margin-bottom: 1.5em; margin-top: 0;'>ISBN: " . $record['isbn'] . "</p>";

  sort($rows);

  $output .= theme(
    'table', 
    [ 
      'header' => [ 'Label', 'Value' ], 
      'rows' => $rows,
      'attributes' => [
        'class' => [ 
          'table',
        ],
        'width' => '100%' 
      ]
    ]
  );

  return $output;

}

function dlts_viewer_admin_partner_epubs($publisher) {

  global $base_url;

  drupal_add_css(
    'https://unpkg.com/@picocss/pico@latest/css/pico.min.css',
    'external',
    [ 
      'weight' => -101,
      'preprocess' => false,
    ]
  );

  $module = drupal_get_path('module', 'dlts_viewer');

  $epubs = [];

  $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE publisher = :publisher', [ ':publisher' => $publisher->code ]);

  foreach ($results as $record) {
    $epubs[] = [
      'label' => l($record->label, "admin/epubs/$record->publisher/$record->identifier"),
      'identifier' => l($record->identifier, "admin/epubs/$record->publisher/$record->identifier"),
      'modified' => $record->lastModified,
      'status' => ($record->status > 0) ? 'published' : 'not published',        
      'operations' => l('edit', '#edit') . ' | ' . l('index', "api/v0/epubs/$record->publisher/$record->identifier/opt/indexer"),
    ];
  }

  $output = theme(
    'table', 
    [ 
      'header' => [ 'Label', 'Identifier', 'Last-Modified', 'Status', 'Operations' ], 
      'rows' => $epubs,
      'attributes' => [
        'class' => [
          'epubs-table',
        ],
        'role' => [ 
          'grid',
        ],
        'width' => '100%' 
      ]
    ]
  );

  $js = file_get_contents("$module/js/epubs.modal.js");

  $x = file_get_contents("https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js");

  $o = '
    <div id="add-epub-container" data-api="' . $base_url . '/api/v0/epubs" data-partner="' . $publisher->code . '">
    <div class="headings">
      <h2 class="title">' . $publisher->label . ' ePubs</h2>
    </div>
    <button class="contrast" id="add-epub">Add ePub</button>
    <script> ' . $x . '</script><script> ' . $js . '</script>
    <br>
    ' . $output . '
    
    <template class="new-item">
      <tr>
        <td class="title"></td>
        <td class="identifier"></td>
        <td class="last-modified"></td>
        <td class="status">Not published</td>
        <td class="operations"><a href="#edit" class="edit-link">edit</a></td>
      </tr>
    </template>
    </div>';

  return $o;

}

/**
 * Undocumented function.
 */
function dlts_viewer_epub_license($link) {

  $licenses = [
    'https://creativecommons.org/licenses/by/4.0/' => [
      'id' => '1',
      'link' => $link,
      'abbreviation' => 'CC BY',
      'icon' => 'https://i.creativecommons.org/l/by/4.0/80x15.png',
      'label' => 'Creative Commons Attribution 4.0 International License',
    ],
    'https://creativecommons.org/licenses/by-sa/4.0/' => [
      'id' => '2',
      'link' => $link,
      'abbreviation' => 'CC BY-SA',
      'icon' => 'https://i.creativecommons.org/l/by-sa/4.0/80x15.png',
      'label' => 'Creative Commons Attribution-ShareAlike 4.0 International License',
    ],
    'https://creativecommons.org/licenses/by-nd/4.0/' => [
      'id' => '3',
      'link' => $link,
      'abbreviation' => 'CC BY-ND',
      'icon' => 'https://i.creativecommons.org/l/by-nd/4.0/80x15.png',
      'label' => 'Creative Commons Attribution-NoDerivatives 4.0 International License',
    ],
    'https://creativecommons.org/licenses/by-nc/4.0/' => [
      'id' => '4',
      'link' => $link,
      'abbreviation' => 'CC BY-NC',
      'icon' => 'https://i.creativecommons.org/l/by-nc/4.0/80x15.png',
      'label' => 'Creative Commons Attribution-NonCommercial 4.0 International License',
    ],
    'https://creativecommons.org/licenses/by-nc-sa/4.0/' => [
      'id' => '5',
      'link' => $link,
      'icon' => 'https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png',
      'abbreviation' => 'CC BY-NC-SA',
      'label' => 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License',
    ],
    'https://creativecommons.org/licenses/by-nc-nd/4.0/' => [
      'id' => '6',
      'link' => $link,
      'icon' => 'https://i.creativecommons.org/l/by-nc-nd/4.0/80x15.png',
      'abbreviation' => 'CC BY-NC-ND',
      'label' => 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License',
    ],
  ];

  return (object) $licenses[$link];

}

/**
 * Undocumented function.
 */
function dlts_viewer_api_v0_epubs_publisher($publisher, $reset_cache = false) {

  global $base_url;
  
  $start = 0;

  $epubs = [];

  $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE publisher = :publisher AND status > 0', [ ':publisher' => $publisher->code ]);

  foreach ($results as $record) {
    $epubs[] = [
      'label' => $record->label,
      'identifier' => $record->identifier,
      'modified' => $record->lastModified,
      'status' => $record->status,
      'uri' => "$base_url/api/v0/epubs/$publisher->code/$record->identifier",
    ];
  }
  
  return [
    'response' => [
      'start' => $start,
      'numFound' => count($epubs),
      'docs' => $epubs,
    ],
  ];

}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_identifier($doi) {

  $parseurl = parse_url($doi);

  $pathinfo = explode('/', $parseurl['path']);

  $namespace = end($pathinfo);

  $pathinfo = explode('.', $namespace);

  return $pathinfo[0];

}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_metadata_v0($data) {
  
  // "date":"1997-05-01",
  // "date": "1997",

  // "subject": "African American Studies / Law / Sociology",
  // "subject_facet": "African American Studies / Law / Sociology",    
  
  $identifier = $data->isbn13;

  $keywords = [];
  
  $subjects = [];

  $authors_display = [];

  $series = [];

  $isbnForPrimaryFormat = $identifier;

  $title = $data->title;
  
  $authors = $data->contributors;

  usort($authors, function($a, $b) {
    return $a->order <=> $b->order;
  });

  foreach ($authors as $item) {
    $authors_display[] = $item->contributor->name;
  }

  if (count($authors_display) > 1) {
    $author = implode(', ', $authors_display);
  } else {
    $author = $authors[0]->contributor->name;
  }

  if (isset($authors[0]->contributor->first) && isset($authors[0]->contributor->last)) {
    $author_sort = $authors[0]->contributor->last . ', ' . $authors[0]->contributor->first;
  } else {
    $author_sort = explode(' ', $authors[0]->contributor->name);
    $lastname = end($author_sort);
    array_pop($author_sort);
    $author_sort = $lastname . ', ' . implode(' ', $author_sort);
  }

  if (!empty($data->categories)) {
    foreach ($data->categories as $item) {
      $list = explode(' / ', $item->category->name);
      foreach ($list as $name) {
        $subjects[] = $name;
      }
    }
  }

  if (!empty($data->keywords)) {
    $keywords_list = explode('; ', $data->keywords);
    foreach ($keywords_list as $name) {
      $keywords[] = $name;
    }
  }

  $_isbn_date = new DateTime($data->date->date, new DateTimeZone($data->date->timezone));

  foreach ($data->formats as $format) {
    if (is_object($format->isbn)) {
      if ($format->isbn->primary_format) {
        $isbnForPrimaryFormat = $format->isbn->isbn;
      }
    }
    elseif (is_string($format->isbn) && is_object($format->date)) {
      if ($format->primary_format) {
        $isbnForPrimaryFormat = $format->isbn;
      }
    }
  }

  $license = dlts_viewer_epub_license($data->custom->license_link);

  $unique_subjects = array_unique($subjects);

  sort($unique_subjects);

  $publisher = $data->publisher->name ? $data->publisher->name : 'NYU Press';

  if (isset($data->series) && !empty($data->series)) {
    foreach ($data->series as $_series) {
      $series[] = $_series->series->name;
      // $series[] = (object) [
      //   'isPartOf' => $_series->series->name,
      //   'number' => $_series->number_in_series,
      // ];
    }
  }

  if (isset($data->custom->open_access_series) && !empty($data->custom->open_access_series)) {
    $series[] = $data->custom->open_access_series;
  }
  
  $format = $data->pages;

  $metadata = [
    'author' => $author,
    'author_sort' =>  $author_sort,
    'bookpubdate' => $_isbn_date->format('Y'),
    'citation_link' => $data->custom->permanent_url,
    'coverHref' => "epub_content/$identifier/ops/images/$identifier.jpg",
    'coverage' => 'New York',    
    'date' => $_isbn_date->format('Y-m-d'),
    'description' => strip_tags($data->description),
    'description_html' => $data->description,
    'format' => "$format pages",
    'isDownloadable' => $data->custom->open_access_is_downloadable,
    'isbn' => $identifier,    
    'language' => $data->custom->language,
    'license' => $license->label,
    'license_abbreviation' => $license->abbreviation,
    'license_icon' => $license->icon,
    'license_link' => $license->link,
    'nyu_press_website_buy_the_book_url' => "https://nyupress.org/$isbnForPrimaryFormat",
    'packageUrl' =>  "epub_content/$identifier",
    'publisher' =>  $publisher,
    'rights' => 'All rights reserved',
    'rootUrl' => "epub_content/$identifier",
    'series' => $series,
    'subjects' => $unique_subjects,
    'subtitle' => $data->subtitle,    
    'thumbHref' => "epub_content/$identifier/ops/images/$identifier-th.jpg",
    'title' => $title,
    'title_sort' => $data->title_without_prefix,
    'type' => 'Text',
  ];
  
  return $metadata;

}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_metadata_v1($data) {

  $identifier = $data->isbn13;
  
  $contributors = $data->contributors;

  // $data->custom->paperback

  foreach ($data->formats as $format) {
    // if // $HARCOVER_FORMAT_CODE = 'BB';
    // else

    if ($format->isbn->isbn == $identifier) {
      $date = strtotime($format->isbn->date->date);
      $year =  date('Y', $date);
      $dateBook =  date('Y-m-d', $date);
    }
  }

  // https://docs.google.com/spreadsheets/d/1j0P4WP80sJ-e_umdqDPbLjQZovoduQC_I7fGdI1O4iQ/edit#gid=1597236993
  $metadata = [
    'title' => $data->title,
    'title_sort' =>  '', // old-key: title_sort // getAuthorSortKey(book.authorsForDisplay)
    'subtitle' =>  $data->subtitle,
    'contributorName' => [],
    'contributorNameSort' => '',
    'contributorRole' => '', // From a controlled list
    'contributorOrder' => '',
    'publisher' => $data->publisher->name, // This is always "NYU Press"
    'publicationPlace' => 'New York', // This is always "New York". old-key: coverage
    'language' => $data->custom->language,
    'doi' => $data->custom->permanent_url,
    'dateBook' => $dateBook, // YYYY-MM-DD
    'dateOa' => $dateBook, // YYYY-MM-DD ? Correct?
    'yearBook' => $year, // YYYY
    'yearOa' => $year, // YYYY ? Correct?
    'openSquareId' => $data->isbn13,
    'description' => strip_tags($data->summary),
    'description_html' => $data->description, // HTML
    'pages' => "$data->pages pages",
    'license' => '',
    'licenseAbbreviation' => '',
    'licenseIcon' => '', // URL
    'licenseLink' => $data->custom->license_link,
    'subject' => [], // String[]
    'seriesOpenAccess' => $data->custom->open_access_series,
    'isbnHardcover' => $data->custom->hardcover,
    'isbnPaperback' => $data->custom->paperback,
    'isbnEbook' => $data->custom->ebook,
    'isbnLibrary' => $data->custom->library,
    'isDownloadable' => $data->custom->open_access_is_downloadable,
    'ishiddden' => $data->hide,
    'video' => $data->custom->video,
    'hiResImages' => $data->custom->hi_res_images,
    'thumbnail' => $data->image,
    'genres' => [ $data->type ],
  ];
  
  return $metadata;

}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_metadata($version = 'v0', $publisher, $identifier, $reset_cache = true) {
  global $user;
  $identifier = filter_xss($identifier);
  $publisher = filter_xss($publisher);
  $uid = $user->uid;
  $name = 'anonymous user';  
  if ($uid > 0) {
    $name = "user $user->name";
  }
  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (user_access('access content')) {
      $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier AND publisher = :publisher', [ ':identifier' => $identifier, ':publisher' => $publisher ]);
      $record = $results->fetchObject();
      if ($record) {
        $data = dlts_viewer_supafolio_book($identifier, $reset_cache);
        if (isset($data->status) && $data->status === 'error') {
          return [
            'error' => 'error',
            'message' => $data->data['errors'][0]['message'],
          ];
        } else {
          return dlts_viewer_epubs_metadata_v0($data);
        }
      }
      else {
        return [
          'error' => 'error',
          'message' => 'ePub not available.',
        ];
      }
    } else {
      return [
        'message' => "Action not allowed for $name.",
        'status' => 'error',
      ];
    }
  }
  elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (user_access('dlts create object')) {
      $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier AND publisher = :publisher', [ ':identifier' => $identifier, ':publisher' => $publisher ]);
      $record = $results->fetchObject();
      if ($record) {
        return [
          'error' => 'found',
          'message' => "ePub $record->label already published.",
        ];
      }
      else {
        $record = dlts_viewer_supafolio_book($identifier, true);
        if (isset($record->status) && $record->status === 'error') {          
          return [
            'error' => $record->status,
            'message' => "Supafolio API - " . $record->data['errors'][0]['message'],
          ];
        } else {
          if ($identifier === $record->isbn13) {
            $metadata = dlts_viewer_epubs_metadata_v0($record);
            db_insert('dlts_viewer_epubs')
              ->fields([
                'label' => $record->title,
                'identifier' => $identifier,
                'publisher' => str_replace(' ' ,'-', strtolower($metadata['publisher'])),
                'status' => 1,
                'lastModified' => date('Y-m-d'),
                'data' => ''
              ])
              ->execute();
              return $metadata;
          }
          else {
            return [
              'error' => $record->status,
              'message' => "Supafolio API - No match found for ISBN13 $identifier.",
            ];
          }
        }
      }
    }
    else {
      return [
        'status' => 'error',
        'message' => "Action not allowed for $name.",
      ];
    }
  }
  elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier AND publisher = :publisher', [ ':identifier' => $identifier, ':publisher' => $publisher ]);
    return [
      'status' => 'error',      
      'message' => 'Method not implemented.',
    ];    
  }
  else {
    return [
      'status' => 'error',      
      'message' => "Method not allowed.",
    ];
  }
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_indexer($version = 'v0', $_publisher, $epub) {

  // something wrong with format field.

  // Fix this. Should use conf variable.
  $discovery = variable_get('opensquare', null); 

  $solrurl = $discovery['solr'];

  $epub = (object) $epub;

  $epub->id = $epub->isbn;

  $epub->identifier = $epub->isbn;
  
  // "subject": "Anthropology / History / Sociology",
  $epub->subject = ''; // $epub->subject

  if (!isset($epub->collection_code)) {
    $epub->collection_code = "oa-books";
  }
    
  $epub->handle = $epub->isbn;

  $epub->type = 'Text';

  unset($epub->bookpubdate);

  unset($epub->nyu_press_website_buy_the_book_url);

  unset($epub->citation_link);
  
  unset($epub->permanent_url);

  unset($epub->isDownloadable);

  unset($epub->isbn);

  unset($epub->series);

  unset($epub->subjects);
  
  unset($epub->rootUrl);

  $options = [
    'method' => 'POST',
    'data' => json_encode([$epub]),
  ];

  $response = drupal_http_request("$solrurl/update/json?_=" . time() . "&commit=true&commitWithin=1000&overwrite=true&wt=json", $options);

  if ($response->code == '200' && isset($response->data)) {
    $r = json_decode($response->data);
    $r->status_message = 'Successful request';
    $r->message = [ 'docs' => $epub ];
    $r->status = $response->code;
    return $r;
  } else {
     return [
       'status_message' => $response->status_message,
       'code' => $response->code,
       'error' => $response->error,
       'message' => json_decode($response->data),
     ];
  }
}

/**
 * Undocumented function.
 */
function dlts_viewer_supafolio($keyword = '*:*') {
  
  // Request all items.
  if ($keyword == '*:*') {
    $keyword = '';
  } 

  $apikey = variable_get('supafolioApiKey', null);

  if (!$apikey) {
    die("Site configuration error. Supafolio API Key not found.");
  }

  $amount = 500;

  // https://developer.supadu.com/supafolio.html#Preform-a-search
  $api = "http://api.supafolio.com/v2/search?keyword=$keyword&amount=$amount&category_data=1&publisher_data=1&series_data=1";

  $request = drupal_http_request($api, [ 'headers' => [ 'x-apikey' => $apikey ] ]);
  
  if ($request->code == 200) {
    return json_decode($request->data, true);
  } else {
    die('Error while contacting API.');
  }

}

/**
 * Undocumented function.
 */
function dlts_viewer_supafolio_book($identifier, $reset_cache = false) {
  
  $apiUrl = variable_get('supafolioApiUrl', false);

  $apikey = variable_get('supafolioApiKey', false);

  if (!$apiUrl) {
    die("Site configuration error. Supafolio URL not set.");
  }

  if (!$apikey) {
    die("Site configuration error. Supafolio API Key not found.");
  }

  $api = "$apiUrl/v2/book/$identifier";
    
  $request = drupal_http_request($api, [ 'headers' => [ 'x-apikey' => $apikey ] ]);

  if ($request->code == 200) {
    $data = json_decode($request->data, true);
    if (isset($data['data']['book'][0])) {
      $data = json_encode($data['data']['book'][0]);
      return json_decode($data);
    } else {
      if ($data['status'] === 'error') {
        return (object) $data;
      } else {
        return $data;
      }
    }
  }
}

/**
 * Undocumented function.
 */
function admin_epub_publisher_title($publisher) {
  return $publisher->label;
}

/**
 * Undocumented function.
 */
function admin_epub_book_title($epub) {
  return $epub['title'];
}
