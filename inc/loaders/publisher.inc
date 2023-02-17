<?php

/**
 * @file
 * Wildcard loaders.
 */

 /**
 * A wildcard loader for dlts_epub, using the ePub edition ISBN13.
 *
 * @parameter $identifier
 *  The value of ePub edition ISBN13.
 *
 * @return object
 */
function dlts_publisher_load($identifier) {

  $identifier = filter_xss($identifier);

  $results = db_query('SELECT field_data_field_code.field_code_value as code, field_data_field_name.field_name_value as label FROM field_data_field_code LEFT JOIN field_data_field_name on field_data_field_name.entity_id = field_data_field_code.entity_id WHERE field_data_field_code.field_code_value = :identifier', [ ':identifier' => $identifier ])->fetchObject();

  if (!empty($results->code)) {
    return $results;
  }
  return FALSE;
}
