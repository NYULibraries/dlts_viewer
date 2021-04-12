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
    // Response/Return value.
    $entity = [];
    // Holds array of collection + partner.
    $isPartOf = [];
    // Username for the repository challange.
    $user = variable_get('repository_user', NULL);
    // Password for repository challange.
    $pass = variable_get('repository_pass', NULL);
    // Repository URL.
    $endpoint = variable_get('repository_endpoint', NULL);
    // We need this values to continue.
    if ($user && $pass && $endpoint) {
      // @todo Cache response.
      $cache = md5($_SERVER['QUERY_STRING']);
      // Path to public directory.
      // @todo Migth want to use private instead of public.
      $realpath = drupal_realpath('public://') . '/datasource';
      // Path to use to cache response/return value.
      $dir_path = $realpath . '/rsbe';
      // Get query.
      // @todo Should we use Drupal's method?
      parse_str(
        parse_url(
          $_SERVER['REQUEST_URI'],
          PHP_URL_QUERY
        ),
        $args
      );
      // No digi_id, no go.
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

      // Entity language.
      $language = 'en';
      if (isset($args['en'])) {
        $language = filter_var(
          $args['en'],
          FILTER_SANITIZE_STRING,
          FILTER_FLAG_STRIP_LOW
        );
      }

      /*
       * Test if content is available. If not
       * search repository.
       */
      $query = new EntityFieldQuery();

      $entity['digi_id'] = filter_xss($digi_id);

      $result = $query->entityCondition('entity_type', 'node')
        ->propertyCondition('status', 1)
        ->propertyCondition('language', $language)
        ->fieldCondition('field_identifier', 'value', $entity['digi_id'], '=')
        ->execute();

      if (!empty($result['node'])) {
        $keys = array_keys($result['node']);
        $nid = array_pop($keys);
        $node = node_load($nid);
        $wrapper = entity_metadata_wrapper('node', $node);
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
        $entity['noid'] = $handle[count($handle) - 1];
        $entity['type'] = str_replace('dlts_', '', $wrapper->getBundle());
        $entity['isPartOf'] = $isPartOf;
      }
      /*
       * Not available. Search repository. NoId will not be set to null.
       */
      else {
        $scope = 'ses';

        $endpoint = parse_url($endpoint);

        $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'];

        $requestUrl = $endpoint . '/api/v0/search?scope=' . $scope . '&digi_id=' . $digi_id;

        $request = drupal_http_request($requestUrl);

        if ($request->code == '200') {
          $data = json_decode($request->data);
          if ($data->response->numFound > 0) {
            // Found URL for Record.
            $partOf = [];
            $digi_url = parse_url($data->response->docs[0]->url);
            $digi_url = $endpoint . $digi_url['path'];
            $request = drupal_http_request($digi_url);
            if ($request->code == '200') {
              $digi_data = json_decode($request->data);
              $entity['type'] = $digi_data->do_type;
              $partOf['coll_uuid'] = $digi_data->coll_id;
              $coll_url = parse_url($digi_data->coll_url);
              $coll_url = $endpoint . $coll_url['path'];
              $request = drupal_http_request($coll_url);
              if ($request->code == '200') {
                $coll_data = json_decode($request->data);
                $partOf['coll_code'] = $coll_data->code;
                $partOf['partner_uuid'] = $coll_data->partner_id;
                $partner_url = parse_url($coll_data->partner_url);
                $partner_url = $endpoint . $partner_url['path'];
                $request = drupal_http_request($partner_url);
                if ($request->code == '200') {
                  $partner_data = json_decode($request->data);
                  $partOf['partner_code'] = $partner_data->code;
                }
                else {
                  throw new Exception('Unable to request partner data. Reqeust failed with status code ' . $request->code . '.');
                }
              }
              else {
                throw new Exception('Unable to request collection data. Reqeust failed with status code ' . $request->code . '.');
              }
            }
            $entity['isPartOf'] = $partOf;
          }
          else {
            throw new Exception("Record with digi_id $digi_id not found.");
          }
        }
        else {
          throw new Exception('Request failed with status code ' . $request->code . '.');
        }
      }
    }
    else {
      throw new Exception('Incorrect configuration.');
    }
    return $entity;
  }
  catch (Exception $e) {
    return [
      'error' => $e->getMessage(),
    ];
  }
}
