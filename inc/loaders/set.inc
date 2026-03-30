<?php

function dlts_set_load($id) {

  $object = dlts_noid_load($id);

  if (!empty($object)) {

    $query = new EntityFieldQuery();

    $nid = $object->nid;

    $bundles = [ 'dlts_multivol_book', 'dlts_series_book' ];

    $result = $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle', $bundles, 'IN')
      ->propertyCondition('status', 1)
      ->fieldCondition('field_book', 'nid', $nid, '=')
      ->execute();

    if (!empty($result['node'])) {

      $keys = array_keys($result['node']);

      $nid = array_pop($keys);

      $set_node = node_load($nid);

      // Wrap book entity with Entity API wrapper.
      $wrapper = entity_metadata_wrapper('node', $set_node);

      $objects = [
        'title' => $set_node->title,
        'identifier' => $set_node->type,
        'type' => 'set',
        'items' => [],
      ];

      $set_entity = $wrapper->field_multivol->value();

      $set_query = new EntityFieldQuery();

      $set_result = $set_query->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', $set_node->type, '=')
        ->propertyCondition('status', 1)
        ->fieldCondition('field_multivol', 'nid', $set_entity->nid, '=')
        ->execute();

      if (!empty($set_result['node'])) {

        $nodes = node_load_multiple(array_keys($set_result['node']));

        foreach ($nodes as $node) {

          $wrapper = entity_metadata_wrapper('node', $node);

          $book = $wrapper->field_book->value();

          $book_wrapper = entity_metadata_wrapper('node', $book);

          $identifier = $book_wrapper->field_identifier->value();

          $number = $wrapper->field_volume_number_str->value();

          $objects['items'][$node->nid] = [
            'title' => $node->title . ' ' . $number,
            'identifier' => $identifier,
            'number' => $wrapper->field_volume_number->value(),
            'type' => 'books',
          ];

        }
      }

      if (!empty($objects['items'])) {
        uasort($objects['items'], function($a, $b) {
          if ($a['number'] == $b['number']) {
            return 0;
          }
          return ($a['number'] < $b['number']) ? -1 : 1;
        });
      }

      return $objects;

    } else {
      return FALSE;
    }
  }
  return FALSE;
}
