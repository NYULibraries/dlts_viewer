<?php

/**
 * @file
 * DLTS Viewer Create Postcard API.
 */

/**
 * Given a JSON representation of a postcard, create DLTS Postcard.
 */
function create_dlts_postcard_from_json($data) {
  
  return $data['metadata'];

  module_load_include('inc', 'dlts_viewer', 'inc/save/postcard');
  $entity_title = $data['entity_title'];
  $entity_language = $data['entity_language'];
  $entity_identifier = $data['identifier'];

  if (!isset($data['metadata'])) {
    $metadata = array();
  }
  else {
    $metadata = $data['metadata'];
  }

  // Partners the object belong.
  $partners = [];
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
    $value = NULL;
  }

  // Collections the book belong.
  $collections = [];
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
    $value = NULL;
  }

  $title = '';
  if (isset($entity_title)) {
    $title = trim($entity_title);
  }

  $subtitle = NULL;
  if (isset($metadata->subtitle) && !empty($metadata->subtitle->value)) {
    $subtitle = $metadata->subtitle->value[0];
  }

  $page_count = 0;
  if (isset($metadata->page_count) && !empty($metadata->page_count->value)) {
    $page_count = (int) $metadata->page_count->value[0];
  }

  $sequence_count = 0;
  if (isset($metadata->sequence_count) && !empty($metadata->sequence_count->value)) {
    $sequence_count = (int) $metadata->sequence_count->value[0];
  }

  $call_number = NULL;
  if (isset($metadata->call_number) && !empty($metadata->call_number->value)) {
    $call_number = $metadata->call_number->value;
  }

  $description = NULL;
  if (isset($metadata->description) && !empty($metadata->description->value)) {
    $description = $metadata->description->value[0];
  }

  $dimensions = NULL;
  if (isset($metadata->dimensions) && !empty($metadata->dimensions->value)) {
    $dimensions = $metadata->dimensions->value;
  }

  $handle = NULL;
  if (isset($metadata->handle) && !empty($metadata->handle->value[0])) {
    $handle = $metadata->handle->value[0];
  }

  $number = NULL;
  if (isset($metadata->number) && !empty($metadata->number->value)) {
    $number = $metadata->number->value;
  }

  if (isset($metadata->binding_orientation) && !empty($metadata->binding_orientation->value)) {
    $binding_orientation = (int) $metadata->binding_orientation->value[0];
  }

  // Only one value, why the [] for $read_order?
  $read_order = 0;
  if (isset($metadata->read_order) && !empty($metadata->read_order->value)) {
    $read_order = $metadata->read_order->value;
  }

  $scan_order = 0;
  if (isset($metadata->scan_order) && !empty($metadata->scan_order->value)) {
    $scan_order = $metadata->scan_order->value;
  }

  $scanning_notes = NULL;
  if (isset($metadata->scanning_notes) && !empty($metadata->scanning_notes->value)) {
    $scanning_notes = $metadata->scanning_notes->value;
  }

  $scan_date = NULL;
  if (isset($metadata->scan_date) && !empty($metadata->scan_date->value)) {
    $scan_date = $metadata->scan_date->value;
  }

  $rights = NULL;
  if (isset($metadata->rights) && !empty($metadata->rights->value)) {
    $rights = trim($metadata->rights->value);
  }

  $volume = NULL;
  if (isset($metadata->volume) && !empty($metadata->volume->value)) {
    $volume = $metadata->volume->value;
  }

  $publication_location = NULL;
  if (isset($metadata->publication_location) && !empty($metadata->publication_location->value[0])) {
    $publication_location = $metadata->publication_location->value[0];
  }

  $publication_date = NULL;
  if (isset($metadata->publication_date) && !empty($metadata->publication_date->value[0])) {
    $publication_date = $metadata->publication_date->value[0];
  }

  $publication_date_text = NULL;
  if (isset($metadata->publication_date_text) && !empty($metadata->publication_date_text->value[0])) {
    $publication_date_text = $metadata->publication_date_text->value[0];
  }

  $other_versions = [];
  if (isset($metadata->other_version)) {
    foreach ($metadata->other_version->value as $other_version) {
      $other_versions[] = [
        'title' => $other_version->title,
        'url' => $other_version->url,
      ];
    }
  }

  $isbns = [];
  if (isset($metadata->isbn) && isset($metadata->isbn->value)) {
    foreach ($metadata->isbn->value as $isbn) {
      $isbns[] = $isbn;
    }
  }

  $languages = [];
  if (isset($metadata->language)) {
    $languages[] = $metadata->language->value;
  }

  $language_codes = [];
  if (isset($metadata->language_code)) {
    $language_codes[] = $metadata->language_code->value;
  }

  $topics = [];
  if (isset($metadata->topic) && isset($metadata->topic->value) && is_array($metadata->topic->value)) {
    foreach ($metadata->topic->value as $topic) {
      $topics[] = $topic;
    }
  }

  $authors = [];
  if (isset($metadata->author)) {
    foreach ($metadata->author->value as $author) {
      $authors[] = $author;
    }
  }

  $creators = [];
  if (isset($metadata->creator)) {
    foreach ($metadata->creator->value as $creator) {
      $creators[] = $creator;
    }
  }

  $contributors = [];
  if (isset($metadata->contributor)) {
    foreach ($metadata->contributor->value as $contributor) {
      $contributors[] = $contributor;
    }
  }

  $editors = [];
  if (isset($metadata->editor)) {
    foreach ($metadata->editor->value as $editor) {
      $editors[] = $editor;
    }
  }

  $publishers = [];
  if (isset($metadata->publisher)) {
    foreach ($metadata->publisher->value as $publisher) {
      $publishers[] = $publisher;
    }
  }

  $subjects = [];
  if (isset($metadata->subject) && !empty($metadata->subject->value)) {
    foreach ($metadata->subject->value as $subject) {
      if (!empty($subject)) {
        $subjects[] = $subject;
      }
    }
  }

  $pdf_files = [];

  if (isset($metadata->pdf_file) && isset($metadata->pdf_file->value)) {
    foreach ((array) $metadata->pdf_file->value as $pdf) {
      if (strstr($pdf, 'http://') || strstr($pdf, 'https://')) {
        $parsedUrl = parse_url($pdf);
        if (strstr($parsedUrl['path'], '/files/')) {
          $pdf = str_replace('/files/', 'pdfserver://', $parsedUrl['path']);
          $pdf_files[] = $pdf;
        }
      }
      elseif (strstr($pdf, 'pdfserver://')) {
        $pdf_files[] = $pdf;
      }
      elseif (strstr($pdf, 'fileserver://')) {
        $pdf_files[] = str_replace('fileserver://', 'pdfserver://', $pdf);
      }
    }
  }

  $ocr_text_files = NULL;
  if (isset($metadata->ocr_text) && isset($metadata->ocr_text->value)) {
    $ocr_text_files = $metadata->ocr_text->value[0];
  }

  $node = array(
    'entity_title' => trim($entity_title),
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
  );
  return save_dlts_postcard($node);
}
