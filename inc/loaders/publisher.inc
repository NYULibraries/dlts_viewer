<?php

/**
 * @file
 * Wildcard loaders.
 */

 /**
 * A wildcard loader for publishers.
 *
 * @parameter $identifier
 *  The value of ePub publisher.
 *
 * @return object
 */
function dlts_publisher_load($identifier) {

  $identifier = filter_xss($identifier);

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  $proxy_request = FALSE;

  if (isset($query_parameters['proxy']) && !empty($query_parameters['proxy'])) {
    $proxy_request = filter_xss($query_parameters['proxy']);
  }

  if ($proxy_request) {
    $proxy_request = dlts_proxy_load($proxy_request);
    $proxy_url = $proxy_request['url'];
    $record = drupal_http_request("$proxy_url/api/v1/epubs/$identifier?reset_cache=true");
    if ($record->code == '200' && isset($record->data)) {
      $data = json_decode($record->data);
      return $data;
    } else {
      return FALSE;
    }
  } else {
    $results = db_query('SELECT field_data_field_code.field_code_value as code, field_data_field_name.field_name_value as label FROM field_data_field_code LEFT JOIN field_data_field_name on field_data_field_name.entity_id = field_data_field_code.entity_id WHERE field_data_field_code.field_code_value = :identifier', [ ':identifier' => $identifier ])->fetchObject();
    if (!empty($results->code)) {
      return $results;
    }
  }
  return FALSE;
}
