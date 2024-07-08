<?php

/**
 * @file
 * API ePubs callbacks.
 */

/**
 * Undocumented function.
 */
function dlts_viewer_api_epubs($version) {

  global $base_url;

  $docs = [];

  $results = db_query('SELECT DISTINCT publisher as identifier FROM dlts_viewer_epubs');

  foreach ($results as $record) {
    if (!empty($record->identifier)) {
      $partner = dlts_partner_load($record->identifier);
      $docs[] = [
        'identifier' => $record->identifier,
        'label' => $partner->title,
        'uri' => "$base_url/api/$version/epubs/$record->identifier",
      ];
    }
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

  $results = db_query('SELECT DISTINCT publisher as identifier FROM dlts_viewer_epubs');

  foreach ($results as $record) {
    if (!empty($record->identifier)) {
      $partner = dlts_partner_load($record->identifier);
      $publishers[] = [
        'label' => l($partner->title, "admin/epubs/$record->identifier", [ 'attributes' => [ 'class' => 'link' ] ]),
      ];
    }
  }

  $output = theme(
    'table',
    [
      'header' => [ 'Label' ],
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
function dlts_viewer_admin_epub($publisher, $epub) {

  $title = $epub['title'];

  $isbn = $epub['isbnEbook'];

  $rows = [];

  foreach ($epub as $key => $item) {
    if ($key == 'subjects') {
      $item = implode(' / ', $item);
    }
    if ($key == 'subjects') {
      if (is_array($item)) {
        $item = implode(' / ', $item);
      }
    }
    if ($key == 'description_html') {
      $item = "<textarea disabled rows='5' style='-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; padding:2px 4px; width: 100%; min-widht: 100%'>$item</textarea>";
    }
    $rows[] = [
      'label' => $key,
      'value' => $item,
    ];
  }

  sort($rows);

  $output= '';
  $output .= "<h1 class='title' style='font-size: 1.3em; margin-bottom: 0; margin-top: 1em;'>$title</h1>";
  $output .= "<p class='subtitle' style='color: gray; font-size: 1em; margin-bottom: 1.5em; margin-top: 0;'>ISBN: $isbn</p>";
  $output .= theme('table', [
    'header' => [ 'Label', 'Value' ],
    'rows' => $rows,
    'attributes' => [
      'class' => [
        'table',
      ],
      'width' => '100%'
    ]
  ]);

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
      'label' => $record->label,
      'identifier' => $record->identifier,
      'modified' => $record->lastModified,
      'status' => ($record->status > 0) ? 'published' : 'not published',
      'operations' => l('view', "admin/epubs/$record->publisher/$record->identifier") . ' | ' . l('index', "api/v1/epubs/$record->publisher/$record->identifier/opt/indexer") . ' | ' . l('delete', "api/v1/epubs/$record->publisher/$record->identifier/opt/delete"),
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
    <div id="add-epub-container" data-api="' . $base_url . '/api/v1/epubs" data-partner="' . $publisher->code . '">
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

  $link = strip_tags(filter_xss($link));

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

function dlts_viewer_api_epubs_publisher_list($version, $publisher) {

  global $base_url;

  $start = 0;

  $epubs = [];

  $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE publisher = :publisher AND status > 0 ORDER BY label ASC', [ ':publisher' => $publisher->code ]);

  foreach ($results as $record) {
    $epubs[$record->identifier] = [
      'label' => $record->label,
      'identifier' => $record->identifier,
      'modified' => $record->lastModified,
      'status' => $record->status,
      'uri' => "$base_url/api/$version/epubs/$publisher->code/$record->identifier",
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

function dlts_viewer_api_epubs_publisher_create($_version, $publisher, $identifier) {

  $identifier = filter_xss($identifier);

  $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier AND publisher = :publisher', [ ':identifier' => $identifier, ':publisher' => $publisher->code ]);

  $record = $results->fetchObject();

  if ($record) {
    return [
      'status' => 'found',
      'message' => "ePub $record->label (ISBN13: $identifier) already published.",
      'data' => dlts_viewer_epubs_metadata_v0(
        dlts_viewer_supafolio_book($identifier, false)
      )
    ];
  }
  else {
    $record = dlts_viewer_supafolio_book($identifier, true);
    if (isset($record->status) && $record->status === 'error') {
      return [
        'status' => 'error',
        'error' => $record->status,
        'message' => "Supafolio API - " . $record->data['errors'][0]['message'],
      ];
    }
    else {
      if ($identifier == $record->isbn13) {
        $metadata = dlts_viewer_epubs_metadata_v1($record);
        db_insert('dlts_viewer_epubs')
          ->fields([
            'label' => $metadata['title'],
            'identifier' => $identifier,
            'publisher' => $publisher->code,
            'status' => 1,
            'lastModified' => date('Y-m-d'),
            'data' => '',
          ])
          ->execute();
        return [
          'status' => 'created',
          'message' => "Supafolio API - ePub $metadata[title] (ISBN13: $identifier) created.",
          'data' => $metadata,
        ];
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

/**
 * Undocumented function.
 * curl -b ./cookie -X POST -H "Content-Type: application/json" -d '{"identifier": "9781479899388"}' https://192.168.0.8/viewer/api/v1/epubs/nyu-press --insecure
 */
function dlts_viewer_api_epubs_publisher($version, $publisher) {

  global $user;

  $uid = $user->uid;

  $name = 'anonymous user';

  if ($uid > 0) {
    $name = "user $user->name";
  }

  $available_proxies = [ 'stage', 'prod', ];

  // get from prod.
  $query_parameters = drupal_get_query_parameters();

  if (isset($query_parameters['proxy']) && in_array(filter_xss($query_parameters['proxy']), $available_proxies)) {
    $proxy = filter_xss($query_parameters['proxy']);

    $proxy_url = "https://sites.dlib.nyu.edu/viewer/api/$version/epubs/$publisher->code";

    $request = drupal_http_request($proxy_url);

    return json_decode($request->data);

  }

  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    return dlts_viewer_api_epubs_publisher_list($version, $publisher);
  }
  elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (user_access('dlts create object')) {
      $raw = file_get_contents('php://input');
      $data = json_decode($raw, true);
      if ($data !== null && isset($data['identifier']) && !empty($data['identifier'])) {
        return dlts_viewer_api_epubs_publisher_create($version, $publisher, $data['identifier']);
      } else {
        return [
          'status' => 'error',
          'message' => "Data is not JSON or error decoding JSON",
        ];
      }
    } else {
      return [
        'status' => 'error',
        'message' => "Action not allowed for $name.",
      ];
    }
  }
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
function dlts_viewer_epubmanager_metadata($_version, $publisher, $identifier) {
  if (user_access('access content')) {
    $reset_cache = false;

    $data = dlts_viewer_supafolio_book($identifier, $reset_cache);

    $metadata = [
      'response' => [
        'draft' => 1,
        'enviorments' => [
          'supafolio' => $data,
          'stage' => [
            'published' => 0,
            'indexed' => 0,
          ],
          'production' => [
            'published' => 0,
            'indexed' => 0,
          ],
        ],
      ],
    ];

    $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier AND publisher = :publisher', [ ':identifier' => $identifier, ':publisher' => $publisher ]);

    $record = $results->fetchObject();

    if ($record) {

      $metadata['response']['draft'] = 0;

      $metadata['response']['enviorments']['production']['published'] = 1;

      // Fix this. Should use conf variable.
      // $discovery = variable_get('opensquare', null);

      $q = "https://discovery1.dlib.nyu.edu/solr/open-square-metadata/select?q=*:*&fq=identifier:$identifier&fl=id&wt=json";

      $response = drupal_http_request($q);

      if ($response->code == '200' && isset($response->data)) {
        $r = json_decode($response->data);
         $metadata['response']['enviorments']['production']['indexed'] = $r->response->numFound;
      }

      $metadata['response']['enviorments']['production']['epub'] = false;
      $epub = get_headers("https://mc.dlib.nyu.edu/files/nyupress/epubs/$identifier.epub", true);
      if ($epub) {
        $metadata['response']['enviorments']['production']['epub'] = [
        'message' => $epub[0],
        'url' => "https://mc.dlib.nyu.edu/files/nyupress/epubs/$identifier.epub",
        ];
      }

      $metadata['response']['enviorments']['production']['pdf'] = false;
      $pdf = get_headers("https://mc.dlib.nyu.edu/files/nyupress/pdfs/$identifier.pdf", true);
      if ($pdf) {
        $metadata['response']['enviorments']['production']['pdf'] = [
          'message' => $pdf[0],
          'url' => "https://mc.dlib.nyu.edu/files/nyupress/pdfs/$identifier.pdf",
        ];
      }

      $metadata['response']['enviorments']['production']['website'] = false;
      $pdf = get_headers("https://opensquare.nyupress.org/books/$identifier", true);
      if ($pdf) {
        $metadata['response']['enviorments']['production']['website'] = [
          'message' => $pdf[0],
          'url' => "https://opensquare.nyupress.org/books/$identifier",
        ];
      }



    }

    return $metadata;
  }

  return [
    'message' => 'Action not allowed.',
    'status' => 'error',
  ];

}

function dlts_viewer_epubs_metadata_v0($data, $reset_cache = false) {

  $author = '';

  $author_sort = '';

  $identifier = $data->isbn13;

  $keywords = [];

  $subjects = [];

  $authors_display = [];

  $series = [];

  $title = $data->title;

  $data->custom = (object) $data->custom;

  $authors = (isset($data->contributors) && !empty($data->contributors)) ? $data->contributors : [];

  usort($authors, function($a, $b) {
    return $a->order <=> $b->order;
  });

  foreach ($authors as $item) {
    $authors_display[] = $item['contributor']['name'];
  }

  if (count($authors_display) > 1) {
    $author = implode(', ', $authors_display);
  } else {
    if (!empty($authors)) {
      $author = $authors[0]['contributor']['name'];
    }
  }

  if (!empty($authors)) {
    if (isset($authors[0]['contributor']['first']) && isset($authors[0]['contributor']['last'])) {
      $author_sort = $authors[0]['contributor']['last'] . ', ' . $authors[0]['contributor']['first'];
    } else {
      $author_sort = explode(' ', $authors[0]['contributor']['name']);
      $lastname = end($author_sort);
      array_pop($author_sort);
      $author_sort = $lastname . ', ' . implode(' ', $author_sort);
    }
  }

  if (!empty($data->categories)) {
    foreach ($data->categories as $item) {
      $list = explode(' / ', $item['category']['name']);
      $subjects[] = $list[0];
    }
  }

  $unique_subjects = array_unique($subjects);

  sort($unique_subjects);

  if (!empty($data->keywords)) {
    $keywords_list = explode('; ', $data->keywords);
    foreach ($keywords_list as $name) {
      $keywords[] = $name;
    }
  }

  $_isbn_date = new DateTime($data->date['date'], new DateTimeZone($data->date['timezone']));

  $primary_format = array_filter($data->formats, function($item) {
    return isset($item['primary_format']) && $item['primary_format'] == 1;
  });

  if (isset($primary_format)) {
    $primary_format = array_shift($primary_format);
    $primary_format = $primary_format['isbn'];
  } else {
    $primary_format = $identifier;
  }

  $license = dlts_viewer_epub_license($data->custom->license_link);

  $publisher = $data->publisher['name'] ? $data->publisher['name'] : 'NYU Press';

  if (isset($data->series) && !empty($data->series)) {
    foreach ($data->series as $_series) {
      if (!empty($_series->series->name)) {
        $series[] = $_series->series->name;
      }
    }
  }

  if (isset($data->custom->open_access_series) && !empty($data->custom->open_access_series)) {
    $series[] = $data->custom->open_access_series;
  }

  $format = $data->pages;

  $metadata = [
    'author' => $author,
    'author_sort' =>  $author_sort,
    'coverHref' => "epub_content/$identifier/ops/images/$identifier.jpg",
    'coverage' => 'New York',
    'date' => $_isbn_date->format('Y'),
    'description' => strip_tags($data->description),
    'description_html' => $data->description,
    'format' => "$format pages",
    'handle' => $data->custom->permanent_url,
    'identifier' => $identifier,
    'isDownloadable' => $data->custom->open_access_is_downloadable,
    'language' => $data->custom->language,
    'license' => $license->label,
    'license_abbreviation' => $license->abbreviation,
    'license_icon' => $license->icon,
    'license_link' => $license->link,
    'nyu_press_website_buy_the_book_url' => "https://nyupress.org/$primary_format",
    'packageUrl' =>  "epub_content/$identifier",
    'permanent_url' => $data->custom->permanent_url,
    'publisher' =>  $publisher,
    'rights' => 'All rights reserved',
    'rootUrl' => "epub_content/$identifier",
    'series_names' => $series,
    'subject' => implode(' / ', $unique_subjects),
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

  $subjects = [];

  $authors_display = [];

  $series = [];

  $reviews = [];

  $title = $data->title;

  $authors = (isset($data->contributors) && !empty($data->contributors)) ? $data->contributors : [];

  usort($authors, function($a, $b) {
    return $a['order'] <=> $b['order'];
  });

  foreach ($authors as $item) {
    $authors_display[] = [
      'contributorName' => $item['contributor']['name'],
      'contributorNameSort' => $item['contributor']['last'] . ', ' . $item['contributor']['first'],
      'contributorRole' => $item['role'],
      'contributorOrder' => $item['order'],
      'contributorBio' => $item['contributor']['bio'],
    ];
  }

  // https://jira.nyu.edu/browse/NYUP-980
  if (!empty($data->categories)) {
    foreach ($data->categories as $item) {
      $list = explode(' / ', $item['category']['name']);
      // Only top-level subjects should appear in Open Square
      $subjects[] = $list[0];
    }
  }

  $unique_subjects = array_unique($subjects);

  sort($unique_subjects);

  $date = (object) $data->date;

  $_isbn_date = new DateTime($date->date, new DateTimeZone($date->timezone));

  foreach ($data->formats as $format) {
    $format = (object) $format;
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

  $custom = (object) $data->custom;

  $license = dlts_viewer_epub_license($custom->license_link);

  $publisher = $data->publisher['name'] ? $data->publisher['name'] : 'NYU Press';

  if (isset($data->series) && !empty($data->series)) {
    foreach ($data->series as $_series) {
      $series[] = $_series['series']['name'];
    }
  }

  if (isset($data->custom->open_access_series) && !empty($data->custom->open_access_series)) {
    $series[] = $data->custom->open_access_series;
  }

  $format = $data->pages;

  if (isset($data->reviews) && !empty($data->reviews)) {
    foreach ($data->reviews as $review) {
      $reviews[] = [
        'reviewer' => $review['review']['reviewer'],
        'review' => $review['review']['description'],
      ];
    }
  }

  $metadata = [
    'publicationPlace' => 'New York',
    'dateBook' => $_isbn_date->format('Y-m-d'),
    'description' => strip_tags($data->description),
    'descriptionHtml' => $data->description,
    'pages' => "$format pages",
    'handle' => $custom->permanent_url,
    'openSquareId' => $identifier,
    'language' => $custom->language,
    'license' => $license->label,
    'licenseAbbreviation' => $license->abbreviation,
    'licenseAbbreviationFacet' => null,
    'licenseIcon' => $license->icon,
    'licenseLink' => $license->link,
    'pressUrl' => "https://nyupress.org/$isbnForPrimaryFormat",
    'publisher' =>  $publisher,
    'series' => $series,
    'subjects' => $unique_subjects,
    'subjectsFacet' => $unique_subjects,
    'subtitle' => $data->subtitle,
    'title' => $title,
    'titleSort' => $data->title_without_prefix,
    'contributors' => $authors_display,
    'doi' => $custom->permanent_url,
    'dateOpenAccess' => '', // need source
    'yearBook' => $_isbn_date->format('Y'),
    'yearOpenAccess' => '', // need source
    // 'seriesOpenAcess' => '', // need source
    'isbnHardcover' => $custom->hardcover,
    'isbnPaperback' => $custom->paperback,
    'isbnEbook' => $custom->ebook,
    'isbnLibrary' => $custom->library,
    'isDownloadable' => $custom->open_access_is_downloadable,
    'hasVideo' => $custom->video,
    'hasHiResImages' => $custom->hi_res_images,
    'reviews' => $reviews,
  ];

  return $metadata;

}

function dlts_viewer_epubs_metadata_dispatch($version = 'v1', $publisher, $metadata) {
  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (user_access('access content')) {
      return $metadata;
    }
    elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
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
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_metadata($version = 'v1', $publisher, $identifier, $reset_cache = false) {

  $version = filter_xss($version);

  $identifier = filter_xss($identifier);

  $publisher = filter_xss($publisher);

  $results = db_query('SELECT * FROM dlts_viewer_epubs WHERE identifier = :identifier AND publisher = :publisher', [ ':identifier' => $identifier, ':publisher' => $publisher ]);

  $record = $results->fetchObject();

  if ($record) {
    $data = dlts_viewer_supafolio_book($identifier, $reset_cache);
    if (isset($data->status) && $data->status === 'error') {
      return [
        'error' => 'error',
        'status' => 'error',
        'message' => $data->data['errors'][0]['message'],
      ];
    }
    else {
      switch ($version) {
        case 'v0':
          return dlts_viewer_epubs_metadata_v0($data, $reset_cache);
        default:
          return dlts_viewer_epubs_metadata_v1($data, $reset_cache);
      }
    }
  }
  else {
    return [
      'error' => 'error',
      'status' => 'error',
      'message' => 'DLTS Viewer - ePub not available.',
    ];
  }
}

function dlts_viewer_epubs_indexer_v1($epub) {

  // Fix this. Should use conf variable.
  $discovery = variable_get('opensquare', null);

  $solrurl = $discovery['solr'];

  $solrurl = 'http://sites_solr:8983/solr/opensquarev2';

  $epub = (object) $epub;

  $epub->id = $epub->openSquareId;

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
function dlts_viewer_epubs_indexer($version, $publisher, $epub) {

  if (!user_access('dlts create object')) {
    return [
      'status' => 'error',
      'message' => "Action not allowed.",
    ];
  }

  $epub = (object) $epub;

  if ($version === 'v1') {
    return dlts_viewer_epubs_indexer_v1($epub);
  }

  // Fix this. Should use conf variable.
  $discovery = variable_get('opensquare', null);

  $solrurl = $discovery['solr'];

  $epub->id = $epub->identifier;

  if (!isset($epub->collection_code)) {
    $epub->collection_code = "oa-books";
  }

  unset($epub->nyu_press_website_buy_the_book_url);

  unset($epub->permanent_url);

  unset($epub->isDownloadable);

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


  $request = drupal_http_request($api, [
    'headers' => [
      'x-apikey' => $apikey
    ],
    'context' => stream_context_create(['ssl' => ['verify_peer' => FALSE, 'verify_peer_name' => FALSE]]),
  ]);

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

  $realpath = drupal_realpath('public://');

  $dir_path = "$realpath/epubs";

  $file_destination = "$dir_path/supafolio.$identifier.json";

  if (!$reset_cache && file_exists($file_destination)) {
    $data = drupal_json_decode(file_get_contents($file_destination));
    return (object) $data['data']['book'][0];
  } else {
    $request = drupal_http_request($api, [
      'headers' => [
        'x-apikey' => $apikey
      ],
      'context' => stream_context_create(['ssl' => ['verify_peer' => FALSE, 'verify_peer_name' => FALSE]]),
    ]);

    if ($request->code == 200) {
      $data = json_decode($request->data, true);
      if (isset($data['data']['book'][0])) {
        if (!is_dir($dir_path)) {
          if (!mkdir($dir_path, 0775, true)) {
            // Log error.
          } else {
            // Log.
            // die('Directory created...');
          }
        }
        if (is_dir($dir_path)) {
          file_put_contents($file_destination, $request->data);
        }
        return (object) $data['data']['book'][0];
      } else {
        if ($data['status'] === 'error') {
          return (object) $data;
        } else {
          return $data;
        }
      }
    } else {
      return $request;
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
