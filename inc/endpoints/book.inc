<?php

/**
 * @file
 * Book endpoints.
 */

/**
 * Update book (PUT)
 */
function dlts_viewer_api_v1_update_book($entity) {
  // @todo Also filter by hosts with access
  if (user_access('dlts create object') && $_SERVER['REQUEST_METHOD'] == 'PUT') {
    // curl -b ./cookie -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' --data "@adl0617.en.put.json" http://localhost:9000/api/v1/objects/books/princeton_aco004688
    try {
      $type = dlts_viewer_content_types_type($entity->type);
      $fields = [];
      $edit = [];
      $decoded_input = json_decode(file_get_contents('php://input'));
      if ($decoded_input) {
        $wrapper = entity_metadata_wrapper('node', $entity);
        foreach ($type['fields'] as $field) {
          $fields[] = str_replace('field_', '', $field['field_name']);
        }
        foreach ($decoded_input->fields as $name => $field) {
          if (!in_array($name, $fields)) {
            continue;
          }
          module_load_include('inc', 'dlts_viewer', 'inc/fields/edit_field_' . $name);
          if (function_exists('dlts_viewer_edit_field_' . $name)) {
            call_user_func_array(
              'dlts_viewer_edit_field_' . $name,
              [
                $field,
                &$wrapper,
              ]
            );
          }
        }
        $saved = $wrapper->save();
        if ($saved) {
          return $wrapper->getIdentifier();
        }
        else {
          throw new Exception('Unable to update.');
        }
      }
      else {
        throw new Exception('Unable to read input.');
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
