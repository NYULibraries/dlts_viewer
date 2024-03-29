<?php

/**
 * @file
 * Edit fields.
 */

/**
 * Edit field_pdf_file.
 *
 * @parameter $field
 *  The field to edit.
 *
 * @parameter $wrapper
 *  Entity wrapper.
 */
function dlts_viewer_edit_field_pdf_file($field, &$wrapper) {
  $update = [];
  foreach ($field->value as $value) {
    $update[] = [
      'uri' => $value->uri,
      'label' => $value->label,
      'data' => serialize(
        [
          'label' => $value->label,
          'uri' => $value->uri,
          'filesize' => $value->filesize,
          'searchable' => (isset($value->searchable) && $value->searchable) ? $value->searchable : FALSE,
        ]
      ),
    ];
  }
  $wrapper->field_pdf_file->set($update);
}
