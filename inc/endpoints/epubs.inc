<?php

use SebastianBergmann\Diff\Differ;

/**
 * @file
 * API ePubs callbacks.
 */

/**
 * Undocumented function.
 */
function dlts_viewer_epubs() {
  global $base_url;
  $start = 0;
  $files = [];
  $realpath = drupal_realpath('public://') . '/epubs';
  foreach (glob("$realpath/*") as $filename) {
    $partner = basename($filename);
    // aof1: for now a quick hack
    if ($partner == 'supafolio.json') {
      continue;
    }
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

function dlts_viewer_epubs_metadata_v0($data) {

  $keywords = [];
  
  $subjects = [];

  $authors_display = [];

  $identifier = $data->isbn13;

  $isbnForPrimaryFormat = $data->isbn13;

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
    'format' => "$data->pages pages",
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
    'series' => null,
    'subjects' => $unique_subjects,
    'subtitle' => $data->subtitle,    
    'thumbHref' => "epub_content/$identifier/ops/images/$identifier-th.jpg",
    'title' => $title,
    'title_sort' => $data->title_without_prefix,
  ];
  
  return $metadata;

}

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
function dlts_viewer_epubs_metadata($partner, $identifier) {
  $data = dlts_viewer_supafolio_book($identifier, false);
  return dlts_viewer_epubs_metadata_v0($data);
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_rebuild($partner, $identifier) {
  $data = dlts_viewer_supafolio_book($identifier, true);
  return dlts_viewer_epubs_metadata_v0($data);
}

/**
 * Undocumented function.
 */
function dlts_viewer_epubs_indexer($partner, $identifier = []) {
  // Fix this. Should use conf variable.
  $discovery = "http://stagediscovery.dlib.nyu.edu:8983/solr/open-square-metadata";
  // $discovery = "https://discovery1.dlib.nyu.edu:8983/solr/open-square-metadata";

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
function dlts_viewer_supafolio($keyword = '*:*') {
  
  // Request all items.
  if ($keyword == '*:*') {
    $keyword = '';
  } 

  $apikey = variable_get('supafolioApiKey', null);

  if (!$apikey) {
    die("ERROR: Site configuration error. Supafolio API Key not found.");
  }

  $amount = 500;

  // https://developer.supadu.com/supafolio.html#Preform-a-search
  $api = "http://api.supafolio.com/v2/search?keyword=$keyword&amount=$amount&category_data=1&publisher_data=1&series_data=1";

  $request = drupal_http_request($api, [ 'headers' => [ 'x-apikey' => $apikey ] ]);
  
  if ($request->code == 200) {
    return json_decode($request->data, true);
  } else {
    die('ERROR: Error while contacting API.');
  }

}

/**
 * Undocumented function.
 */
function dlts_viewer_supafolio_book($identifier, $reset_cache = false) {

  $realpath = drupal_realpath('public://') . '/epubs';

  $metadata = "$realpath/supafolio.$identifier.json";
  
  if (!$reset_cache && file_exists($metadata)) {
    return json_decode(
      file_get_contents($metadata)
    );
  }

  $apikey = variable_get('supafolioApiKey', null);

  if (!$apikey) {
    die("ERROR: Site configuration error. Supafolio API Key not found.");
  }

  $api = "http://api.supafolio.com/v2/book/$identifier";
    
  $request = drupal_http_request($api, [ 'headers' => [ 'x-apikey' => $apikey ] ]);

  if ($request->code == 200) {
    $data = json_decode($request->data, true);
    if (isset($data['data']['book'][0])) {      
      $data = json_encode($data['data']['book'][0]);
      file_put_contents($metadata, $data, LOCK_EX);
      return json_decode($data);
    } else {
      die('ERROR');
    }
  }

}