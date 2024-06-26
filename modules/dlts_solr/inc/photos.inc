<?php

/**
 * @file
 * Map Solr callbacks.
 */

/**
 * Index Photos.
 */
 function dlts_solr_index_photos(&$document, &$entity, $entity_type, $env_id) {

  global $base_url;
  // Datasource.
  module_load_include('inc', 'dlts_viewer', 'inc/datasource');

  $language = $entity->language;

  $wrapper = entity_metadata_wrapper('node', $entity);

  // Single-value field.
  $identifier = $wrapper->field_identifier->value();

  $document->addField('ss_identifier', $identifier);

  // Searchable content; dump all you want to be searchable in this array.
  $searchableFields = [ $document->content ];

  // Multi-value field.
  dlts_solr_index_collection($wrapper->field_collection->value(), $document, $entity, $searchableFields);

  /*
   * Provider (field_partner)
   * Multi-value field.
   */
  dlts_solr_index_partners($wrapper->field_partner->value(), $document, $entity, $searchableFields);

  /*
   * Permanent Link (field_handle)
   * single-value field.
   */
  $handle = $wrapper->field_handle->value();

  if (!empty($handle)) {
    $document->addField('ss_handle', $handle['url']);
  }

  $noid = explode('/', $handle['url']);

  $document->addField('ss_noid', $noid[count($noid) - 1]);

  $field_title = $entity->title;

  $document->addField('ss_manifest', "$base_url/api/presentation/photos/$identifier/manifest.json");

  /*
   * Title (field_title)
   * single-value field
   */
  $title_long = $wrapper->field_title->value();

  if (!empty($title_long)) {
    $field_title = trim($title_long);
  }

  $document->addField('ss_title_long', $title_long);

  $searchableFields[] = dlts_solr_remove_accents($field_title);

  // Single value fields.
  $document->addField('ss_title', $field_title);

  // Strip HTML Tags.
  $title_sort = strip_tags($field_title);

  // Trim the string of leading/trailing space.
  $title_sort = trim($title_sort);

  $title_sort = dlts_solr_remove_accents($title_sort);

  // Clean up things like &amp;.
  $title_sort = html_entity_decode($title_sort);

  // Strip out any url-encoded stuff.
  $title_sort = urldecode($title_sort);

  // Replace Multiple spaces with single space.
  $title_sort = preg_replace('/ +/', ' ', $title_sort);

  // To lower-case.
  $title_sort = strtolower($title_sort);

  // Sort fields.
  $document->addField('ss_longlabel', $title_sort);

  $document->addField('iass_longlabel', $title_sort);

  unset($document->content);

  $document->addField('content', implode($searchableFields, ' '));

}
