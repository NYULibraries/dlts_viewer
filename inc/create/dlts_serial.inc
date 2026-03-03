<?php

/**
 * @file
 * DLTS Viewer Create Serial.
 */

/**
 * Given a JSON representation of a serial, create a DLTS Serial node.
 *
 * @param array $data
 *   Associative array decoded from the serial's JSON representation.
 *
 * @return mixed
 *   The result of save_dlts_serial(), typically a node object or ID.
 *
 * @throws Exception
 *   If the current user lacks permission, or required fields are missing.
 */
function dlts_viewer_api_v1_serial_objects(array $data) {

  global $user;

  // 1. Permission Check
  if (!user_access('dlts create object')) {
    throw new Exception(
      "Action not allowed for user " . (!empty($user->name) ? $user->name : 'Anonymous') . "."
    );
  }

  // 2. Validate Required Fields
  $required_fields = ['title', 'identifier'];
  foreach ($required_fields as $field) {
    if (empty($data[$field])) {
      throw new Exception("Missing required field: '{$field}'.");
    }
  }

  module_load_include('inc', 'dlts_viewer', 'inc/save/dlts_serial');

  $node = [
    'entity_title' => $data['title'],
    'entity_language' => $data['language'] ?? NULL,
    'identifier' => $data['identifier'],
    'ticket' => isset($data['ticket']) ? trim($data['ticket']) : 'DLTS-0000',
    'noid' => $data['noid'] ?? '',
    'page_count' => $data['page_count'] ?? '0',
    'sequence_count' => $data['sequence_count'] ?? '0',
    'binding_orientation' => $data['binding_orientation'] ?? '0',
    'read_order' => $data['read_order'] ?? '0',
    'scan_order' => $data['scan_order'] ?? '0',
    'partners' => [],
    'collections' => [],
    'pdf_files' => [],
    'ocr_text' => [],
    'representative_image' => [],
    'language_string' => [],
  ];

  $metadata = isset($data['metadata']) && is_object($data['metadata']) ? $data['metadata'] : (object) [];

  $simple_fields = [
    'title',
    'subtitle', 
    'dimensions',
    'handle',
    'number',
    'scan_date',
    'rights',
    'volume',
    'publication_location',
    'publication_date',
    'publication_date_text',
  ];

  foreach ($simple_fields as $field) {
    $node[$field] = isset($metadata->{$field}->value[0]) ? trim($metadata->{$field}->value[0]) : NULL;
  }

  $array_fields = [
    'other_version',
    'isbn',
    'topic',
    'author',
    'creator',
    'contributor',
    'editor',
    'publisher',
    'subject',
    'description',
    'scanning_notes',
    'language_code',
  ];

  foreach ($array_fields as $field) {
    $node[$field] = [];
    if (isset($metadata->{$field}->value) && is_array($metadata->{$field}->value)) {
      foreach ($metadata->{$field}->value as $val) {
        $clean_val = is_string($val) ? trim($val) : $val;
        if ($clean_val !== '') {
          $node[$field][] = $clean_val;
        }
      }
    }
  }

  if (isset($metadata->language) && isset($metadata->language->value)) {
    $node['language_string'] = $metadata->language->value;
  }

  // 6. Partners & Collections
  foreach (['partners', 'collections'] as $field) {
    if (isset($metadata->{$field}->value) && is_array($metadata->{$field}->value)) {
      foreach ($metadata->{$field}->value as $value) {
        if (!is_object($value)) {
          continue;
        }
        $node[$field][] = [
          'title' => $value->label ?? ($value->title ?? ''),
          'language' => $value->language ?? NULL,
          'identifier' => $value->identifier ?? NULL,
          'code' => $value->code ?? NULL,
          'name' => $value->name ?? NULL,
          'partner' => $value->partner ?? NULL,
        ];
      }
    }
  }

  if (isset($data['representative_image'])) {
    $node['representative_image'] =  $data['representative_image'];
  }

  if (isset($metadata->pdfs->value) && is_array($metadata->pdfs->value)) {
    foreach ($metadata->pdfs->value as $pdf) {
      if (!is_object($pdf) || empty($pdf->type) || empty($pdf->uri)) {
        continue;
      }
      $node['pdf_files'][] = [
        'type' => $pdf->type,
        'uri' => $pdf->uri,
        'label' => ($pdf->type === 'hi') ? 'High-resolution' : 'Low-resolution',
        'searchable' => $pdf->searchable ?? FALSE,
        'filesize' => $pdf->filesize   ?? 0,
      ];
    }
  }

  if (isset($metadata->ocr_text->value) && is_array($metadata->ocr_text->value)) {
    foreach ($metadata->ocr_text->value as $ocr) {
      if (is_object($ocr) && isset($ocr->fileserver)) {
        $node['ocr_text'][] = $ocr->fileserver;
      }
    }
  }

  return save_dlts_serial($node);

}
