<?php

function dlts_partner_load($code) {
  $query = new EntityFieldQuery();
  $code = filter_xss($code);
  $result = $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_partner')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_code', 'value', $code, '=')
    ->execute();
  if (!empty($result['node'])) {
    $keys = array_keys($result['node']);
    $nid = array_pop($keys);
    return node_load($nid);
  }
  return FALSE;
}
