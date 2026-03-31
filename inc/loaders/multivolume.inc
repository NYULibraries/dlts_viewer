<?php

/**
 * Loads a multi-volume set of books identified by a NOID or identifier.
 *
 * @param string $id
 *   The NOID or identifier for the book.
 *
 * @return array|false
 *   An associative array with keys 'title', 'type', and 'items', or FALSE
 *   if no matching set is found.
 */
function dlts_multivolume_load($id) {
  $object = dlts_noid_load($id);

  if (empty($object)) {
    return FALSE;
  }

  $book_nid = $object->nid;

  $query  = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol_book', '=')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_book', 'nid', $book_nid, '=')
    ->execute();

  if (empty($result['node'])) {
    return FALSE;
  }

  $keys = array_keys($result['node']);

  $set_nid = array_pop($keys);

  $set_node = node_load($set_nid);

  if (!$set_node) {
    watchdog('dlts', 'node_load() failed for set node %nid.', [ '%nid' => $set_nid, ], WATCHDOG_ERROR);
    return FALSE;
  }

  $set_wrapper = entity_metadata_wrapper('node', $set_node);

  $set_entity  = $set_wrapper->field_multivol->value();

  if (empty($set_entity)) {
    watchdog('dlts', 'field_multivol is empty on set node %nid.', [ '%nid' => $set_nid, ], WATCHDOG_WARNING);
    return FALSE;
  }

  $objects = [
    'title' => $set_node->title,
    'type'  => 'set',
    'items' => [],
  ];

  $set_query  = new EntityFieldQuery();
  $set_result = $set_query
    ->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'dlts_multivol_book', '=')
    ->propertyCondition('status', 1)
    ->fieldCondition('field_multivol', 'nid', $set_entity->nid, '=')
    ->execute();

  if (empty($set_result['node'])) {
    return $objects;
  }

  $nodes = node_load_multiple(array_keys($set_result['node']));
  if ($nodes === FALSE) {
    watchdog('dlts', 'node_load_multiple() failed for set node %nid.', [ '%nid' => $set_nid, ], WATCHDOG_ERROR);
    return FALSE;
  }

  foreach ($nodes as $node) {

    $wrapper = entity_metadata_wrapper('node', $node);
    
    $book = $wrapper->field_book->value();

    if (empty($book)) {
      watchdog('dlts', 'field_book is empty on node %nid; skipping.', [ '%nid' => $node->nid, ], WATCHDOG_WARNING);
      continue;
    }

    $book_wrapper = entity_metadata_wrapper('node', $book);
    $identifier = $book_wrapper->field_identifier->value();
    $number_string = $wrapper->field_volume_number_str->value();
    $number = $wrapper->field_volume_number->value();

    if (empty($number) && !empty($number_string)) {
      preg_match('/\d+/', $number_string, $matches);
      $number = !empty($matches) ? (int) $matches[0] : 0;
    }
    $objects['items'][$node->nid] = [
      'title' => $node->title . ' ' . $number_string,
      'identifier' => $identifier,
      'number' => $number,
      'type' => 'books',
    ];
  }

  // Sort items by volume number ascending.
  if (!empty($objects['items'])) {
    uasort($objects['items'], function ($a, $b) {
      return $a['number'] <=> $b['number'];
    });
  }

  return $objects;
}