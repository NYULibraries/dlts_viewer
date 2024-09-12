<?php

/**
 * @file
 * API Routes.
 */

/**
 * Check MongoDB server status.
 *
 * @return array
 * ...
 */
function dlts_viewer_api_check_status_mongodb() {
  if (user_access('dlts create object')) {
    // Load helpers.
    module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

    $mongodb = mongodb();

    $result = $mongodb->command(['ping' => 1]);

    // Check the result
    if ($result && $result['ok'] == 1) {
      return [
        'status' => 'available',
        'message' => 'MongoDB server is available.',
        'code' => 200,
      ];
    } else {
      return [
        'status' => 'not available',
        'message' => $result['errmsg'],
        'code' => $result['code'],
      ];
    }
    return [
      'status' => 'error',
      'message' => 'Unknown error.'
    ];
  } else {
    return [
      'status' => 'error',
      'message' => 'Action not allowed.'
    ];
  }
}

/**
 * Update resource (PUT) or delete resource (DELETE).
 */
function dlts_viewer_api_update_resource($resource) {
  // @todo Also filter by hosts with access
  if (user_access('dlts create object')) {
    try {
      if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $entity = node_load($resource);
        $wrapper = entity_metadata_wrapper('node', $entity);
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
            watchdog('dlts_viewer', 'Resource <strong>@identifier</strong> with noid <strong>@noid</strong> has been suscefully deleted.', [ '@noid' => $resource->noid, '@identifier' => $resource->identifier ], WATCHDOG_INFO);
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
        $nid = $resource->nid;
        node_delete($nid);
        db_query('DELETE FROM dlts_viewer_resource WHERE nid = :id', [ ':id' => $nid ])->fetchAll();
        watchdog('dlts_viewer', 'Resource <strong>@identifier</strong> with noid <strong>@noid</strong> has been suscefully deleted.', [ '@noid' => $resource->noid, '@identifier' => $resource->identifier ], WATCHDOG_INFO);
        return [
          "status" => "success",
          "message" => "Resource $resource->identifier with noid $resource->noid has been suscefully deleted."
        ];
        cache_clear_all();
      }
      return [
        'status' => 'error',
        'message' => 'Action not allowed.'
      ];
    } catch (Exception $e) {
      return [ $e->getMessage() ];
    }
  } else {
    return [
      'status' => 'error',
      'message' => 'Action not allowed.'
    ];
  }
}
