<?php

/**
 * @file
 * API Search callbacks.
 */

/**
 * Search using Solr.
 * @link http://localhost:9000/api/v1/repository?digi_id=princeton_aco002112
 */
function dlts_viewer_search_repository() {
  try {

    if (!user_access('access dlts repository')) {
      throw new Exception('User not allowed.');
    }

    $user = variable_get('repository_user', NULL);

    $pass = variable_get('repository_pass', NULL);

    $endpoint = variable_get('repository_endpoint', NULL);

    if ($user && $pass && $endpoint) {
      $cache = md5($_SERVER['QUERY_STRING']);

      $realpath = drupal_realpath('public://') . '/datasource';

      $dir_path = $realpath . '/rsbe';

      parse_str(
        parse_url(
          $_SERVER['REQUEST_URI'],
          PHP_URL_QUERY
        ),
        $args
      );

      if (isset($args['digi_id'])) {
        $digi_id = filter_var(
          $args['digi_id'],
          FILTER_SANITIZE_STRING,
          FILTER_FLAG_STRIP_LOW
        );
      }
      else {
        throw new Exception('No param digi_id in request.');
      }

      $query = new EntityFieldQuery();

      $identifier = filter_xss($digi_id);

      $result = $query->entityCondition('entity_type', 'node')
        ->propertyCondition('status', 1)
        ->propertyCondition('language', 'en')
        ->fieldCondition('field_identifier', 'value', $digi_id, '=')
        ->execute();

      if (!empty($result['node'])) {
        $keys = array_keys($result['node']);
        $nid = array_pop($keys);
        $node = node_load($nid);
        $wrapper = entity_metadata_wrapper('node', $node);
        $isPartOf = [];
        $collections = [];
        $partners = [];
        $handle_raw = $wrapper->field_handle->value();
        $handle = explode('/', $handle_raw['url']);
        foreach ($wrapper->field_collection->value() as $collection) {
          $collection_wrapper = entity_metadata_wrapper('node', $collection);
          $field_partner = $collection_wrapper->field_partner->value();
          $partner_wrapper = entity_metadata_wrapper('node', $field_partner[0]);
          $isPartOf[] = [
            'coll_uuid' => $collection_wrapper->field_identifier->value(),
            'coll_code' => $collection_wrapper->field_code->value(),
            'partner_uuid' => $partner_wrapper->field_identifier->value(),
            'partner_code' => $partner_wrapper->field_code->value(),
          ];
        }
        return [
          'noid' => $handle[count($handle) - 1],
          'digi_id' => $wrapper->field_identifier->value(),
          'type' => str_replace('dlts_', '', $wrapper->getBundle()),
          'isPartOf' => $isPartOf,
        ];
      }
      else {
        $scope = 'ses';

        $endpoint = parse_url($endpoint);

        $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'];

        $requestUrl = $endpoint . '/api/v0/search?scope=' . $scope . '&digi_id=' . $digi_id;

        $request = drupal_http_request($requestUrl);

        $entity = [];

        $entity['digi_id'] = $digi_id;

        if ($request->code == '200') {
          $data = json_decode($request->data);
          if ($data->response->numFound > 0) {
            // Found URL for Record.
            $digi_url = parse_url($data->response->docs[0]->url);
            $digi_url = $endpoint . $digi_url['path'];
            $request = drupal_http_request($digi_url);
            if ($request->code == '200') {
              $digi_data = json_decode($request->data);
              $entity['digi_uuid'] = $digi_data->id;
              $entity['coll_uuid'] = $digi_data->coll_id;
              $entity['type'] = $digi_data->do_type;
              $coll_url = parse_url($digi_data->coll_url);
              $coll_url = $endpoint . $coll_url['path'];
              $request = drupal_http_request($coll_url);
              if ($request->code == '200') {
                $coll_data = json_decode($request->data);
                $entity['coll_code'] = $coll_data->code;
                $entity['coll_name'] = $coll_data->name;
                $entity['partner_id'] = $coll_data->partner_id;
                $partner_url = parse_url($coll_data->partner_url);
                $partner_url = $endpoint . $partner_url['path'];
                $request = drupal_http_request($partner_url);
                if ($request->code == '200') {
                  $partner_data = json_decode($request->data);
                  $entity['partner_code'] = $partner_data->code;
                  $entity['partner_name'] = $partner_data->name;
                }
                else {
                  throw new Exception('Unable to request partner data. Reqeust failed with status code ' . $request->code . '.');
                }
              }
              else {
                throw new Exception('Unable to request collection data. Reqeust failed with status code ' . $request->code . '.');
              }
            }
          }
          else {
            throw new Exception("Record with digi_id $digi_id not found.");
          }
        }
        else {
          throw new Exception('Request failed with status code ' . $request->code . '.');
        }
        return $entity;
      }
    }
    else {
      throw new Exception('Incorrect configuration.');
    }
  }
  catch (Exception $e) {
    return [
      'error' => $e->getMessage(),
    ];
  }
}
