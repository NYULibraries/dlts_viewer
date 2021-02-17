<?php

/**
 * @file
 * DLTS Viewer Create Book API.
 */

/**
 * Given a JSON representation of a book, create DLTS Books.
 *
 *  @example curl -b ./cookie -X POST  --data "$(curl http://stage-sites.dlib.nyu.edu/viewer/api/v1/books/ifa_egypt000132)" http://localhost:9000/api/v1.0.1/objects
 */
function create_dlts_book_from_json_v1_0_1($data) {

  module_load_include('inc', 'dlts_viewer', 'inc/save/dlts_book.1.0.1');

  $dimensions = NULL;

  $number = NULL;

  $scanning_notes = NULL;

  $volume = NULL;

  $publication_date = NULL;

  $scan_date = NULL;

  $call_number = NULL;

  $description = NULL;

  $page_count = NULL;

  $subtitle = NULL;

  $title = NULL;

  $pages_array = array();

  $partners = array();

  $multivols = array();

  $other_versions = array();

  $isbns = array();

  $authors = array();

  $topics = array();

  $languages = array();

  $collections = array();

  $contributors = array();

  $creators = array();

  $editors = array();

  $publishers = array();

  $pdf_files = array();

  $language_codes = array();

  $ocr_text_files = array();

  $subjects = array();

  $read_order = array();

  $scan_order = array();

  $binding_orientation = array();

  $series = array();

  $entity_title = $data['title'];

  $entity_language = $data['requestedLanguage']->language;

  $entity_identifier = $data['identifier'];

  $ocr_text_files = [];

  if (!isset($data['metadata'])) {
    $metadata = array();
  }
  else {
    $metadata = $data['metadata'];
  }

  $multivolume = array();
  if ($data['isMultivolume']) {
    $multivolume = $metadata->multivolume;
  }

  $series = array();
  if ($data['isSeries']) {
    $series = $metadata->series;
  }

  // Partners the book belong.
  if (isset($metadata->partner)) {
    foreach ($metadata->partner->value as $value) {
      $partners[] = array(
        'title' => !empty($value->title) ? $value->title : $value->name,
        'language' => !empty($value->language) ? $value->language : LANGUAGE_NONE,
        'identifier' => $value->identifier,
        'code' => $value->code,
        'name' => $value->name,
      );
    }
  }

  $value = NULL;

  // Collections the book belong.
  if (isset($metadata->collection)) {
    foreach ($metadata->collection->value as $value) {
      $collections[] = array(
        'title' => !empty($value->title) ? $value->title : $value->name,
        'language' => !empty($value->language) ? $value->language : LANGUAGE_NONE,
        'identifier' => $value->identifier,
        'code' => $value->code,
        'name' => $value->name,
        'partner' => [
          'title' => !empty($value->partner->title) ? $value->partner->title : $value->partner->name,
          'language' => !empty($value->partner->language) ? $value->partner->language : LANGUAGE_NONE,
          'identifier' => $value->partner->identifier,
          'code' => $value->partner->code,
          'name' => $value->partner->name,
        ],
      );
    }
  }

  if (isset($entity_title)) {
    $title = trim($entity_title);
  }

  if (isset($metadata->subtitle) && !empty($metadata->subtitle->value)) {
    $subtitle = $metadata->subtitle->value;
  }

  if (isset($metadata->page_count) && !empty($metadata->page_count->value)) {
    $page_count = $metadata->page_count->value;
  }

  if (isset($metadata->sequence_count) && !empty($metadata->sequence_count->value)) {
    $sequence_count = $metadata->sequence_count->value;
  }

  if (isset($metadata->call_number) && !empty($metadata->call_number->value)) {
    $call_number = $metadata->call_number->value;
  }

  if (isset($metadata->description) && !empty($metadata->description->value)) {
    $description = $metadata->description->value;
  }

  if (isset($metadata->dimensions) && !empty($metadata->dimensions->value)) {
    $dimensions = $metadata->dimensions->value;
  }

  if (isset($metadata->handle) && !empty($metadata->handle->value)) {
    $handle = $metadata->handle->value;
  }

  if (isset($metadata->number) && !empty($metadata->number->value)) {
    $number = $metadata->number->value;
  }

  // Only one value, why the [] for $binding_orientation?
  if (isset($metadata->binding_orientation) && !empty($metadata->binding_orientation->value)) {
    $binding_orientation_raw = $metadata->binding_orientation->value;
    if ($binding_orientation_raw == 'Horizontal' || $binding_orientation_raw == '1') {
      $binding_orientation[] = 1;
    }
    elseif ($binding_orientation_raw == 'Vertical' || $binding_orientation_raw == '0') {
      $binding_orientation[] = 0;
    }
  }

  // Only one value, why the [] for $read_order?
  if (isset($metadata->read_order) && !empty($metadata->read_order->value)) {
    $read_order_raw = $metadata->read_order->value;
    if ($read_order_raw == 'rtl' || $read_order_raw == 'Right to left' || $read_order_raw == '1') {
      $read_order[] = 1;
    }
    elseif ($read_order_raw == 'ltr' || $read_order_raw == 'Left to right' || $read_order_raw == '0') {
      $read_order[] = 0;
    }
  }

  // Only one value, why the [] for $scan_order?
  if (isset($metadata->scan_order) && !empty($metadata->scan_order->value)) {
    $scan_order_raw = $metadata->scan_order->value[0];
    if ($read_order_raw == 'rtl' || $scan_order_raw == 'Right to left' || $scan_order_raw == '1') {
      $scan_order[] = 1;
    }
    elseif ($read_order_raw == 'ltr' || $scan_order_raw == 'Left to right' || $scan_order_raw == '0') {
      $scan_order[] = 0;
    }
  }

  if (isset($metadata->scanning_notes) && !empty($metadata->scanning_notes->value)) {
    $scanning_notes = $metadata->scanning_notes->value;
  }

  if (isset($metadata->scan_date) && !empty($metadata->scan_date->value)) {
    $scan_date = $metadata->scan_date->value;
  }

  if (isset($metadata->rights) && !empty($metadata->rights->value)) {
    $rights = trim($metadata->rights->value);
  }

  if (isset($metadata->volume) && !empty($metadata->volume->value)) {
    $volume = $metadata->volume->value;
  }

  if (isset($metadata->publication_location) && !empty($metadata->publication_location->value)) {
    $publication_location = $metadata->publication_location->value;
  }

  if (isset($metadata->publication_date) && !empty($metadata->publication_date->value)) {
    $publication_date = $metadata->publication_date->value;
  }

  if (isset($metadata->publication_date_text) && !empty($metadata->publication_date_text->value)) {
    $publication_date_text = $metadata->publication_date_text->value;
  }

  if (isset($data['representativeImage'])) {
    $representative_image = array(
      'uri' => str_replace(file_create_url('fileserver://'), '', 'fileserver://' . $data['representativeImage']),
      'timestamp' => time(),
    );
  }

  if (isset($metadata->other_version)) {
    foreach ($metadata->other_version->value as $other_version) {
      $other_versions[] = [
        'title' => $other_version->title,
        'url' => $other_version->url,
      ];
    }
  }

  if (isset($metadata->isbn) && isset($metadata->isbn->value)) {
    foreach ($metadata->isbn->value as $isbn) {
      $isbns[] = $isbn;
    }
  }

  if (isset($metadata->language)) {
    $languages[] = $metadata->language->value;
  }

  if (isset($metadata->language_code)) {
    $language_codes[] = $metadata->language_code->value;
  }

  if (isset($metadata->topic) && isset($metadata->topic->value) && is_array($metadata->topic->value)) {
    foreach ($metadata->topic->value as $topic) {
      $topics[] = $topic;
    }
  }

  if (isset($metadata->author)) {
    foreach ($metadata->author->value as $author) {
      $authors[] = $author;
    }
  }

  if (isset($metadata->creator)) {
    foreach ($metadata->creator->value as $creator) {
      $creators[] = $creator;
    }
  }

  if (isset($metadata->contributor)) {
    foreach ($metadata->contributor->value as $contributor) {
      $contributors[] = $contributor;
    }
  }

  if (isset($metadata->editor)) {
    foreach ($metadata->editor->value as $editor) {
      $editors[] = $editor;
    }
  }

  if (isset($metadata->publisher)) {
    foreach ($metadata->publisher->value as $publisher) {
      $publishers[] = $publisher;
    }
  }

  if (isset($metadata->subject) && !empty($metadata->subject->value)) {
    foreach ($metadata->subject->value as $subject) {
      if (!empty($subject)) {
        $subjects[] = $subject;
      }
    }
  }

  if (isset($metadata->pdf_file) && isset($metadata->pdf_file->value)) {
    foreach ((array) $metadata->pdf_file->value as $pdf) {
      if (strstr($pdf->uri, 'http://') || strstr($pdf->uri, 'https://')) {
        $parsedUrl = parse_url($pdf->uri);
        if (strstr($parsedUrl['path'], '/files/')) {
          $pdf->uri = str_replace('/files/', 'pdfserver://', $parsedUrl['path']);
          $pdf_files[] = $pdf;
        }
      }
      elseif (strstr($pdf->uri, 'pdfserver://')) {
        $pdf_files[] = $pdf;
      }
    }
  }

  if (isset($metadata->ocr_text) && isset($metadata->ocr_text->value)) {
    $ocr_text_files = $metadata->ocr_text->value;
  }

  $node = array(
    'entity_title' => $entity_title,
    'entity_language' => $entity_language,
    'identifier' => $entity_identifier,
    'partners' => $partners,
    'collections' => $collections,
    'title' => $title,
    'subtitle' => $subtitle,
    'page_count' => $page_count,
    'sequence_count' => $sequence_count,
    'binding_orientation' => $binding_orientation,
    'call_number' => $call_number,
    'volume' => $volume,
    'description' => $description,
    'dimensions' => $dimensions,
    'handle' => $handle,
    'language_code' => $language_codes,
    'language' => $languages,
    'number' => $number,
    'read_order' => $read_order,
    'scan_order' => $scan_order,
    'scanning_notes' => $scanning_notes,
    'publication_date' => $publication_date,
    'publication_date_text' => $publication_date_text,
    'publication_location' => $publication_location,
    'scan_date' => $scan_date,
    'representative_image' => $representative_image,
    'ocr_text' => $ocr_text_files,
    'other_version' => $other_versions,
    'rights' => $rights,
    'isbn' => $isbns,
    'author' => $authors,
    'topic' => $topics,
    'creator' => $creators,
    'contributor' => $contributors,
    'editor' => $editors,
    'publisher' => $publishers,
    'subject' => $subjects,
    'pdf_files' => $pdf_files,
    'pages' => $pages_array,
    'multivol' => $multivols,
    'multivolume' => $multivolume,
    'series' => $series,
  );

  return save_dlts_book_v1_0_1($node, $entity_language);

}
