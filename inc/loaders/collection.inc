<?php

function dlts_collection_load($code) {

  $query = new EntityFieldQuery();

  $code = filter_xss($code);

  $parts = explode(':', $code);

  $collection_code = $parts[0];

  $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_code', 'value', $collection_code, '=');

  if (isset($parts[1])) {
    $partner = partner_by_code($parts[1]);
    if (!empty($partner)) {
      $query->fieldCondition('field_partner', 'nid', $partner->nid, '=');
    } else {
      return FALSE;
    }
  }

  $result = $query->addTag('node_access')->execute();

  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    return node_load_multiple($keys);
  }

  unset($query);

  $query = new EntityFieldQuery();

  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_collection')
    ->fieldCondition('field_identifier', 'value', $code, '=')
    ->addTag('node_access')
    ->execute();

  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    $nid = array_pop($keys);
    return node_load($nid);
  }

  return FALSE;

}
