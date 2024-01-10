<?php

/**
 * @file
 * Book endpoints.
 */

/**
 * Update book (PUT) or delete book (DELETE).
 */
function dlts_viewer_api_v1_update_book($entity) {
  // @todo Also filter by hosts with access
  if (user_access('dlts create object')) {
    try {
      $type = dlts_viewer_content_types_type($entity->type);
      $wrapper = entity_metadata_wrapper('node', $entity);      
      // curl -b ./cookie -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' --data "@adl0617.en.put.json" http://localhost:9000/api/v1/objects/books/princeton_aco004688
      if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $fields = [];
        $decoded_input = json_decode(file_get_contents('php://input'));
        if ($decoded_input) {
          foreach ($type['fields'] as $field) {
            $fields[] = str_replace('field_', '', $field['field_name']);
          }
          foreach ($decoded_input->fields as $name => $field) {
            if (!in_array($name, $fields)) {
              continue;
            }
            module_load_include('inc', 'dlts_viewer', 'inc/fields/edit_field_' . $name);
            if (function_exists('dlts_viewer_edit_field_' . $name)) {
              call_user_func_array('dlts_viewer_edit_field_' . $name, [ $field, &$wrapper, ]);
            }
          }
          $saved = $wrapper->save();
          if ($saved) {
            return $wrapper->getIdentifier();
          } else {
            throw new Exception('Unable to update.');
          }
        }
        else {
          throw new Exception('Unable to read input.');
        }
      }
      if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        $wrapper->status = NODE_NOT_PUBLISHED;
        $saved = $wrapper->save();
        if ($saved) {
          cache_clear_all();
          return $wrapper->getIdentifier();
        } else {
          throw new Exception('Unable to delete.');
        }
      }
    } catch (Exception $e) {
      return [ $e->getMessage() ];
    }
  } else {
    // @TODO: I need to test this and return something that
    // makes sense.
    return [ 'Error: Action not allowed.' ];
  }
}
