<?php

/**
 * Returns the value of the field first item.
 */
function dlts_utilities_field_get_first_item($entity_type, $entity, $field_name, $index = 0, $langcode = NULL) {
  $field = field_get_items($entity_type, $entity, $field_name, $langcode);
  return $field[$index];
}

/**
 * Returns a unique hash.
 */
function dlts_utilities_unique_hash($name = '') {
  global $base_url;
  return substr(base_convert(sha1(uniqid($base_url . $name, TRUE)), 16, 36), 0, 6);
}

/**
 * Returns a list of node ids of nodes that matche a field label/value pair.
 */
function dlts_utilities_get_nid_by_field($field_label, $field_value) {
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node', '=')->fieldCondition($field_label, 'value', $field_value, '=');
  $result = $query->execute();
  $nodeids = array();
  if (array_key_exists('node', $result) && count($result['node'] > 0)) {
    foreach ($result['node'] as $node) {
      $nodeids[] = $node->nid;
    }
  }
  else {
    watchdog('dlts_utilities', 'No results when trying to look up nodes by field value.');
  }
  return $nodeids;
}

function dlts_utilities_is_pjax() {
  $is_pjax = &drupal_static(__FUNCTION__);
  if (!isset($is_pjax) && function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['X-Pjax']) || isset($headers['X-PJAX'])) {
      drupal_add_http_header('uri', request_uri());
      $is_pjax = TRUE;
    }
    else {
      $params = drupal_get_query_parameters();
      if (isset($params['pjax']) && $params['pjax'] == 1) {
        drupal_add_http_header('uri', base_path() . $_SERVER['REQUEST_URI']);
        $is_pjax = TRUE;
      }
      else {
        $is_pjax = FALSE;
      }
    }
  }
  return $is_pjax;
}

function dlts_utilities_discovery_enviorment() {
  $discovery = array();
  if (module_exists('apachesolr')) {
    $environment = apachesolr_default_environment();
    $environments = apachesolr_load_all_environments();
    $discovery = array(
      'name' => $environments[$environment]['name'],
      'url' => $environments[$environment]['url'] . '/select',
    );
  }
  return $discovery;
}

function dlts_utilities_content_by_field($field_name) {
  $out = array();
  $field_name = filter_xss($field_name);
  $info = field_info_field($field_name);
  if ($info) {
    $m = array_keys($info['storage']['details']['sql']['FIELD_LOAD_CURRENT']);
    $table = $m[0];
    $c = array_keys($info['columns']);
    $columns = $c[0];
    if ($columns == 'fid') {
      return array();
    }
    $seek = $field_name . '_' . $columns;
    $table = 'field_data_' . $field_name;
    $query = 'SELECT DISTINCT ' . $seek . ' AS value FROM {' . $table . '}';
    $result = db_query($query);
    foreach ($result as $record) {
      if ($columns == 'nid') {
        $node = node_load($record->value);
        $raw_value = $record->value;
        $value = $node->title;
      }
      elseif ($columns == 'tid') {
        $term = taxonomy_term_load($record->value);
        $raw_value = $record->value;
        $value = $term->name;
      }
      else {
        $raw_value = $value = $record->value;
      }
      $out[] = array(
        'value' => $value,
        'raw_value' => $raw_value,
      );
    }
  }
  return $out;
}

function dlts_utilities_content_types_type($type) {
  $content_type = node_type_get_type($type);
  if (!$content_type) {
    return;
  }
  $out = $fields = array();
  $field_info_instances = field_info_instances('node', $content_type->type);
  foreach ($field_info_instances as $field_name => $field_info_instance) {
    $info = field_info_field($field_name);
    $fields[] = array(
      'label' => $field_info_instance['label'],
      'field_name' => $field_info_instance['field_name'],
      'type' => $field_info_instance['widget']['type'],
      'cardinality' => (string) $info['cardinality'],
      'settings' => array(
        'allowed_values' => isset($info['settings']['allowed_values']) ? $info['settings']['allowed_values'] : NULL,
      ),
    );
  }
  return array(
    'typeInfo' => $content_type,
    'fields' => $fields,
  );
}

function dlts_utilities_content_types() {
  $out = array();
  $fields = array();
  $types = node_type_get_types();
  foreach ($types as $bundle_name => $entity_type) {
    $field_info_instances = field_info_instances('node', $bundle_name);
    foreach ($field_info_instances as $field_name => $field_info_instance) {
      $info = field_info_field($field_name);
      $fields[] = array(
        'label' => $field_info_instance['label'],
        'field_name' => $field_info_instance['field_name'],
        'type' => $field_info_instance['widget']['type'],
        'cardinality' => (string) $info['cardinality'],
        'settings' => array(
          'allowed_values' => isset($info['settings']['allowed_values']) ? $info['settings']['allowed_values'] : NULL,
        ),
      );
    }
    $out['types'][$bundle_name] = array(
      'name' => $entity_type->name,
      'type' => $entity_type->type,
    );
  }
  $out['fields'] = $fields;
  return $out;
}
