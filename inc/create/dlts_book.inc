<?php

/**
 * @file
 * DLTS Viewer Create Book API.
 */

/**
 * Given a JSON representation of a book, create DLTS Books.
 */
function create_dlts_book_from_json($data, $cretePages = FALSE, $legacy = FALSE) {

  global $user;

  $username = $user->name;

  if (!user_access('dlts create object')) {
    throw new Exception("Action not allowed for user $username.");
  }

  module_load_include('inc', 'dlts_viewer', 'inc/save/dlts_book');

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

  $pages_array = [];

  $partners = [];

  $multivols = [];

  $other_versions = [];

  $isbns = [];

  $authors = [];

  $topics = [];

  $languages = [];

  $collections = [];

  $contributors = [];

  $creators = [];

  $editors = [];

  $publishers = [];

  $pdf_files = [];

  $language_codes = [];

  $ocr_text_files = [];

  $subjects = [];

  $read_order = [];

  $scan_order = [];

  $binding_orientation = [];

  $series = [];

  $entity_title = $data['entity_title'];

  $entity_language = $data['entity_language'];

  $entity_identifier = $data['identifier'];

  if (!isset($data['metadata'])) {
    $metadata = [];
  }
  else {
    $metadata = $data['metadata'];
  }

  if (!isset($data['multivolume'])) {
    $multivolume = [];
  }
  else {
    $multivolume = $data['multivolume'];
  }

  if (!isset($data['series'])) {
    $series = [];
  }
  else {
    $series = $data['series'];
  }

  // Partners the book belong.
  if (isset($metadata->partner)) {
    foreach ($metadata->partner->value as $value) {
      $partners[] = array(
        'title' => $value->title,
        'language' => $value->language,
        'identifier' => $value->identifier,
        'code' => $value->code,
        'name' => $value->name,
      );
    }
  }

  // Collections the book belong.
  if (isset($metadata->collection)) {
    foreach ($metadata->collection->value as $value) {
      $collections[] = array(
        'title' => $value->title,
        'language' => $value->language,
        'identifier' => $value->identifier,
        'code' => $value->code,
        'name' => $value->name,
        'partner' => $value->partner,
      );
    }
  }

  if (isset($metadata->title)) {
    $title = trim($metadata->title->value[0]);
  }

  if (isset($metadata->subtitle) && !empty($metadata->subtitle->value)) {
    $subtitle = $metadata->subtitle->value[0];
  }

  if (isset($metadata->page_count) && !empty($metadata->page_count->value)) {
    $page_count = $metadata->page_count->value[0];
  }

  if (isset($metadata->sequence_count) && !empty($metadata->sequence_count->value)) {
    $sequence_count = $metadata->sequence_count->value[0];
  }

  if (isset($metadata->call_number) && !empty($metadata->call_number->value)) {
    $call_number = $metadata->call_number->value[0];
  }

  if (isset($metadata->description) && !empty($metadata->description->value)) {
    $description = $metadata->description->value[0];
  }

  if (isset($metadata->dimensions) && !empty($metadata->dimensions->value)) {
    $dimensions = $metadata->dimensions->value[0];
  }

  if (isset($metadata->handle) && !empty($metadata->handle->value)) {
    $handle = $metadata->handle->value[0];
  }

  if (isset($metadata->number) && !empty($metadata->number->value)) {
    $number = $metadata->number->value[0];
  }

  if (isset($metadata->binding_orientation) && !empty($metadata->binding_orientation->value)) {
    $binding_orientation_raw = $metadata->binding_orientation->value[0];
    if ($binding_orientation_raw == 'Horizontal' || $binding_orientation_raw == '1') {
      $binding_orientation[] = 1;
    }
    elseif ($binding_orientation_raw == 'Vertical' || $binding_orientation_raw == '0') {
      $binding_orientation[] = 0;
    }
  }

  if (isset($metadata->read_order) && !empty($metadata->read_order->value)) {
    $read_order_raw = $metadata->read_order->value[0];
    if ($read_order_raw == 'Right to left' || $read_order_raw == '1') {
      $read_order[] = 1;
    }
    elseif ($read_order_raw == 'Left to right' || $read_order_raw == '0') {
      $read_order[] = 0;
    }
  }

  if (isset($metadata->scan_order) && !empty($metadata->scan_order->value)) {
    $scan_order_raw = $metadata->scan_order->value[0];
    if ($scan_order_raw == 'Right to left' || $scan_order_raw == '1') {
      $scan_order[] = 1;
    }
    elseif ($scan_order_raw == 'Left to right' || $scan_order_raw == '0') {
      $scan_order[] = 0;
    }
  }

  if (isset($metadata->scanning_notes) && !empty($metadata->scanning_notes->value)) {
    $scanning_notes = $metadata->scanning_notes->value[0];
  }

  if (isset($metadata->scan_date) && !empty($metadata->scan_date->value)) {
    $scan_date = $metadata->scan_date->value[0];
  }

  if (isset($metadata->rights) && !empty($metadata->rights->value)) {
    $rights = trim($metadata->rights->value[0]);
  }

  if (isset($metadata->volume) && !empty($metadata->volume->value)) {
    $volume = $metadata->volume->value[0];
  }

  if (isset($metadata->publication_location) && !empty($metadata->publication_location->value)) {
    $publication_location = $metadata->publication_location->value[0];
  }

  if (isset($metadata->publication_date) && !empty($metadata->publication_date->value)) {
    $publication_date = $metadata->publication_date->value[0];
  }

  if (isset($metadata->publication_date_text) && !empty($metadata->publication_date_text->value)) {
    $publication_date_text = $metadata->publication_date_text->value[0];
  }

  $representative_image = [];
  if (isset($metadata->representative_image) && !empty($metadata->representative_image)) {
    if (!$legacy) {
      $representative_image = array(
        'uri' => $metadata->representative_image->cm->uri,
        'timestamp' => $metadata->representative_image->cm->timestamp,
      );
    }
    else {
      if (isset($metadata->representative_image->value)) {
        $timestamp = (isset($metadata->representative_image->value->timestamp) ? $metadata->representative_image->value->timestamp : time());
        $uri = $metadata->representative_image->value->fileserver;
        $representative_image = array(
          'uri' => $uri,
          'timestamp' => $timestamp,
        );
      }
    }
  }

  if (isset($metadata->other_version)) {
    foreach ($metadata->other_version->value as $other_version) {
      $other_versions[] = $other_version;
    }
  }

  if (isset($metadata->isbn) && isset($metadata->isbn->value)) {
    foreach ($metadata->isbn->value as $isbn) {
      $isbns[] = $isbn;
    }
  }

  if (isset($metadata->language)) {
    foreach ($metadata->language->value as $language) {
      $languages[] = $language;
    }
  }

  if (isset($metadata->language_code)) {
    foreach ($metadata->language_code->value as $language_code) {
      $language_codes[] = $language_code;
    }
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
      $subject = trim($subject);
      if (!empty($subject)) {
        $subjects[] = $subject;
      }
    }
  }

  if (isset($metadata->pdfs)) {
    foreach ($metadata->pdfs->value as $pdf) {
      $pdf_files[] = array(
        'type' => $pdf->type,
        'uri' => $pdf->uri,
        'label' => $pdf->type == 'hi' ? 'High-resolution' : 'Low-resolution',
        'searchable' => isset($pdf->searchable) ? $pdf->searchable : FALSE,
        'filesize' => $pdf->filesize,
      );
    }
  }
  elseif (isset($metadata->pdf_file)) {
    // Deals with JSON new documents.
    if (!$legacy) {
      foreach ($metadata->pdf_file->value as $pdf_file) {
        $pathinfo = pathinfo($pdf_file);
        $basename = str_replace('fileserver://', '', $pathinfo['basename']);
        $ext = pathinfo($pdf_file, PATHINFO_EXTENSION);
        // Check if we have a fileserver scheme.
        if (strpos($pdf_file, 'fileserver://') === FALSE) {
          continue;
        }
        // Check that the URI is not bigger than the allowed MySQL
        // size for varchar with index.
        if (strlen($pdf_file) > 255) {
          continue;
        }
        // Check that the URI contain a file extension.
        if (!$ext) {
          continue;
        }
        // Do we have a valid extension.
        if (!in_array($ext, array('pdf'))) {
          continue;
        }
        if (strpos($pdf_file, '_hi')) {
          $pdf_files[] = array(
            'file' => $pdf_file,
            'label' => 'High-resolution',
          );
        }
        elseif (strpos($pdf_file, '_lo')) {
          $pdf_files[] = array(
            'file' => $pdf_file,
            'label' => 'Low-resolution',
          );
        }
        else {
          $pdf_files[] = array('file' => $pdf_file);
        }
      }
    }
    else {
      foreach ($metadata->pdf_file->value as $pdf_file) {
        $pdf_uri = $pdf_file->fileserver;
        // Check that the URI is not bigger than the allowed MySQL
        // size for varchar with index.
        if (strlen($pdf_uri) > 255) {
          continue;
        }
        if (strpos($pdf_uri, '_hi')) {
          $pdf_files[] = array(
            'file' => $pdf_uri,
            'label' => 'High-resolution',
          );
        }
        elseif (strpos($pdf_uri, '_lo')) {
          $pdf_files[] = [
            'file' => $pdf_uri,
            'label' => 'Low-resolution',
          ];
        }
        else {
          $pdf_files[] = [
            'file' => $pdf_uri,
          ];
        }
      }
    }
  }

  if (isset($metadata->ocr_text)) {
    foreach ($metadata->ocr_text->value as $ocr_text) {
      $ocr_text_files[] = $ocr_text->fileserver;
    }
  }

  $node = [
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
    'volume' => $volume,
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
  ];

  return save_dlts_book($node);

}

/**
 * Given a JSON representation of a book, create DLTS Books pages.
 */
function dlts_viewer_create_book_page($data) {
  // We only create pages for books with languages English or Undetermined.
  if ($entity_language == 'en' || $entity_language == LANGUAGE_NONE) {
    // Load MongoDB util.
    module_load_include('inc', 'dlts_viewer', 'inc/mongodb');
    // Check if the JSON document include pages.
    if (isset($data->pages->page) && !empty($data->pages->page)) {
      foreach ($data->pages->page as $key => $page) {
        $sequence = $page->sequence;
        if (!is_array($page->sequence)) {
          $sequence = array($page->sequence);
        }
        $page->sequence = $sequence;
        dlts_viewer_mongodb_new_sequence($page, 'dlts_books_page');
      }
    }
    // Check if the JSON document include stitched pages.
    if (isset($data->stitched->page) && !empty($data->stitched->page)) {
      foreach ($data->stitched->page as $key => $page) {
        dlts_viewer_mongodb_new_sequence($page, 'dlts_stitched_books_page');
      }
    }
  }
}
