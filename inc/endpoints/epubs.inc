<?php

use SebastianBergmann\Diff\Differ;

/**
 * @file
 * API ePubs callbacks.
 */

/**
 * Undocumented function.
 */
function dlts_viewer_epubs($partner) {
  global $base_url;
  $start = 0;
  $files = [];
  $realpath = drupal_realpath('public://') . '/epubs';
  foreach (glob("$realpath/*") as $filename) {
    $partner = basename($filename);
    $files[] = [
      'identifier' => $partner,
      'uri' => "$base_url/api/v0/epubs/$partner",
    ];    
  }
  return [
    'response' => [
      'start' => $start,
      'numFound' => count($files),
      'docs' => $files,
    ],
  ];
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_partner($partner) {
  global $base_url;
  $start = 0;
  $files = [];
  $realpath = drupal_realpath('public://') . '/epubs';
  foreach (glob("$realpath/$partner/*/intake-descriptive.json") as $filename) {
    $rawdata = file_get_contents($filename);
    $data = json_decode(
      file_get_contents($filename)
    );
    $files[] = [
      'identifier' => $data->identifier,
      'uri' => "$base_url/api/v0/epubs/$partner/$data->identifier",
      'title' => $data->title,
      'partner' => $partner,
      'doi' => $data->permanent_url,
    ];
  }
  return [
    'response' => [
      'start' => $start,
      'numFound' => count($files),
      'docs' => $files,
    ],
  ];
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_metadata($partner, $identifier) {
  $realpath = drupal_realpath('public://') . '/epubs';
  $metadata = "$realpath/$partner/$identifier/intake-descriptive.json";
  if (!isset($_GET['reset']) && file_exists($metadata)) {
    drupal_add_http_header('Cached-File', "$partner/$identifier/intake-descriptive.json");
    return json_decode(file_get_contents($metadata));
  }
  return [ __FUNCTION__ ];
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_indexer($partner, $identifier = []) {
  $discovery = "http://stagediscovery.dlib.nyu.edu:8983/solr/open-square-metadata";
  $realpath = drupal_realpath('public://') . '/epubs';
  $entities = [ $identifier ];
  $docs = [];
  foreach ($entities as $entity) {
    $metadata = "$realpath/$partner/$entity/intake-descriptive.json";
    if (file_exists($metadata)) {
      $data = json_decode(file_get_contents($metadata));
      $data->id = $data->identifier;
      if (!isset($data->collection_code)) {
        $data->collection_code = "oa-books";
      }
      if (!isset($data->handle)) {
        $data->handle = $data->identifier;
      }
      unset($data->nyu_press_website_buy_the_book_url);
      unset($data->permanent_url);
      unset($data->rootUrl);
      $docs[] = $data;
    }
  }

  $res = json_encode($docs);

  $options = [
    'method' => 'POST',
    'data' => $res,
  ];

  $response = drupal_http_request("$discovery/update/json?commit=true", $options);

  if ($response->code == '200' && isset($response->data)) {
    $r = json_decode($response->data);
    $r->status_message = 'Successful request';
    $r->message = [ 'docs' => $docs ];
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
function dlts_viewer_epubs_versions($partner, $identifier) {
  $differ = new Differ;
  $realpath = drupal_realpath('public://') . "/epubs/$partner/$identifier";
  $metadata = "$realpath/intake-descriptive.json";
  $start = 0;
  $versions = [];
  if (file_exists($metadata)) {
    $raw = file_get_contents($metadata);
    $data = json_decode($raw);
    $data->id = $data->identifier;

    if (!isset($data->collection_code)) {
      $data->collection_code = "oa-books";
    }

    if (!isset($data->handle)) {
      $data->handle = $data->identifier;
    }

    foreach (glob("$realpath/states/*.json") as $filename) {
      $basename = basename($filename);
      $filemtime = filemtime($filename);
      preg_match('/intake-descriptive.(.*).json/', $basename, $matches);
      $hash = $matches[1];

      $dirty = json_decode(
        file_get_contents($filename)
      );

      $dirty->id = $dirty->identifier;

      if (!isset($dirty->collection_code)) {
        $dirty->collection_code = 'oa-books';
      }
  
      if (!isset($dirty->handle)) {
        $dirty->handle = $dirty->identifier;
      }      

      $versions[$hash] = [
        'hash' => $hash,
        'filename' => $basename,
        'modified' => $filemtime,
        'time' => date('F d Y H:i:s', $filemtime),
        'data' => $dirty,
      ];
    }

    return [
      'response' => [
        'title' => $data->title,
        'id' => $data->id,
        'doi' => $data->permanent_url,
        'versions' => [
          'start' => $start,
          'numFound' => count($versions),
          'docs' => $versions,
          'data' => $data,
        ],
      ],
    ];
  }
}

function dlts_viewer_epubs_versions_hash($partner, $identifier, $hash) {
  $realpath = drupal_realpath('public://') . "/epubs/$partner/$identifier";
  if ($hash == 'latest') {
    $metadata = "$realpath/intake-descriptive.json";
    if (file_exists($metadata)) {
      $raw = file_get_contents($metadata);
      $data = json_decode($raw);
      $data->id = $data->identifier;  
      if (!isset($data->collection_code)) {
        $data->collection_code = "oa-books";
      }
      if (!isset($data->handle)) {
        $data->handle = $data->identifier;
      }
      if (!isset($data->subjects)) {
        $data->subjects =  explode(' / ', $data->subject);
      }
      if (!isset($data->series)) {
        if (isset($data->series_names)) {
          $data->series =  explode(' / ', $data->series_names);
        } else {
          $data->series = [];
        }
      }
      if (isset($data->date)) {
        $data->bookpubdate = $data->date = $data->date . '-01-01';
      }
      if (isset($data->permanent_url)) {
        $data->citation_link = $data->permanent_url;
      }
      return $data;
    }
  } else {
    return false;
  }
  die();
}

/**
 * Undocumented function.
 */
function dlts_viewer_admin_epubs() {
  global $base_url;
  $realpath = drupal_realpath('public://') . '/epubs';
  $start = 0;
  $partners = [];
  if (file_exists($realpath)) {
    foreach (glob("$realpath/*") as $filename) {
      $partner = basename($filename);
      $partners[] = [
        'identifier' => $partner,
        'epubs' => l(url("epubs/$partner", [ 'absolute' => true, 'alias' => false  ]), "epubs/$partner", [ 'attributes' => [ 'class' => 'link' ] ]),
        'api' => l(url("api/v0/epubs/$partner", [ 'absolute' => true, 'alias' => false  ]), "api/v0/epubs/$partner", [ 'attributes' => [ 'class' => 'link' ] ]),
      ];
    }
  }
  $output = theme(
    'table', 
    [ 
      'header' => [ 'identifier', 'records', 'api' ], 
      'rows' => $partners,
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
function dlts_viewer_admin_epubs_partner($partnercode) {
  global $base_url;
  $start = 0;
  $realpath = drupal_realpath('public://') . "/epubs/$partnercode";
  $partners = [];
  if (file_exists($realpath)) {
    foreach (glob("$realpath/*") as $filename) {
      $identifier = basename($filename);
      $data = json_decode(
        file_get_contents(
          "$filename/intake-descriptive.json"
        )
      );
      $partners[] = [
        'title' => l($data->title, "epubs/$partnercode/$identifier", [ 'attributes' => [ 'class' => 'link' ] ] ),
        'identifier' => $identifier,
        'code' => $data->collection_code,
      ];
    }
  }
  $count = count($partners);
  $partner = partner_by_code($partnercode);
  drupal_set_title("Epubs - $partner->title ($count items)");
  $output = theme(
    'table', 
    [ 
      'header' => [ 
        'title',
        'identifier',
        'code'
      ], 
      'rows' => $partners,
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
function dlts_viewer_admin_epubs_partner_item($partner, $identifier) { 
  $realpath = drupal_realpath('public://') . "/epubs/$partner/$identifier";  
  if (file_exists($realpath)) {
    $data = json_decode(file_get_contents("$realpath/intake-descriptive.json"));
    $metadata = theme('table', [
      'header' => [ 'label', 'value' ], 
      'rows' => [
        [
          'label' => 'Title',
          'value' => $data->title,
        ],
        [
          'label' => 'Subtitle',
          'value' => $data->subtitle,
        ],
        [
          'label' => 'Author',
          'value' => $data->author,
        ],
        [
          'label' => 'Author sort',
          'value' => $data->author_sort,
        ],
        [
          'label' => 'coverHref',
          'value' => $data->coverHref,
        ],
        [
          'label' => 'Coverage',
          'value' => $data->coverage,
        ],
        [
          'label' => 'Date',
          'value' => $data->date,
        ],
        [
          'label' => 'Description',
          'value' => $data->description,
        ],
        [
          'label' => 'Format',
          'value' => $data->format,
        ],
        [
          'label' => 'Identifier',
          'value' => $data->identifier,
        ],
        [
          'label' => 'Language',
          'value' => $data->language,
        ],
        [
          'label' => 'License',
          'value' => $data->license,
        ],
        [
          'label' => 'License abbreviation',
          'value' => $data->license_abbreviation,
        ],
        [
          'label' => 'license icon',
          'value' => $data->license_icon,
        ],
        [
          'label' => 'License link',
          'value' => $data->license_link,
        ],
        [
          'label' => 'NYU Press Website - Buy the book Url',
          'value' => $data->nyu_press_website_buy_the_book_url,
        ],
        [
          'label' => 'Package Url',
          'value' => $data->packageUrl,
        ],
        [
          'label' => 'Permanent Url',
          'value' => $data->permanent_url,
        ],
        [
          'label' => 'Publisher',
          'value' => $data->publisher,
        ],
        [
          'label' => 'Rights',
          'value' => $data->rights,
        ],
        [
          'label' => 'Root Url',
          'value' => $data->rootUrl,
        ],
        [
          'label' => 'Subject',
          'value' => $data->subject,
        ],
        [
          'label' => 'thumbHref',
          'value' => $data->thumbHref,
        ],
        [
          'label' => 'type',
          'value' => $data->type,
        ],
        [
          'label' => 'Collection code',
          'value' => $data->collection_code,
        ],
      ],
      'attributes' => [
        'class' => [ 
          'table',
        ],
      ]
    ]
  );

  $versions = [];

  foreach (glob("$realpath/states/*.json") as $filename) {
    $basename = basename($filename);    
    $filemtime = filemtime($filename);
    preg_match('/intake-descriptive.(.*).json/', $basename, $matches);
    $hash = $matches[1];
    $dirty = json_decode(
      file_get_contents($filename)
    );
    $dirty->id = $dirty->identifier;
    if (!isset($dirty->collection_code)) {
      $dirty->collection_code = 'oa-books';
    }
    if (!isset($dirty->handle)) {
      $dirty->handle = $dirty->identifier;
    }
    $versions[] = [
      'hash' => $hash,
      'filename' => $basename,
      'modified' => $filemtime,
      'time' => date('F d Y H:i:s', $filemtime),
      'data' => $dirty,
    ];
  }

  return theme('viewer_epubs_page', [
    'title' => $data->title,
    'subtitle' => $data->subtitle,
    'metadata' => $metadata,
    'versions' => $versions,
  ]);

  }
}

// https://developer.supadu.com/supafolio.html
function dlts_viewer_supafolio() {
  $realpath = drupal_realpath('public://') . "/epubs/supafolio.json";  
  // Make sure cache directory exists.
  if (!file_exists($realpath)) {
    $rows = 1;    
    $api = "http://api.supafolio.com/v2/search?amount=$rows&keyword=";    
    $request = drupal_http_request($api, [
      'headers' => [
        "x-apikey" => variable_get('supafolioApiKey', NULL),
      ]
    ]);    
    if ($request->code == 200) {
      $data = json_decode($request->data, true);
      file_put_contents($realpath, json_encode($data), LOCK_EX);
    } else {
      die('error');
    }
  } else {
    $data = json_decode(file_get_contents($realpath));
  }
  return $data;  
}

function dlts_viewer_supafolio_item($item) {
  // https://developer.supadu.com/supafolio.html
  $api = "http://api.supafolio.com/v2/book/$item";

  $key = variable_get('supafolioApiKey', NULL);

  $request = drupal_http_request($api, [
    'headers' => [
      "x-apikey" => $key,
    ]
  ]);
  
  $data = json_decode($request->data, true);
  print '<pre>';
  print_r($data);
  print '</pre>';
  
}
