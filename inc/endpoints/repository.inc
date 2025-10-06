<?php

/**
 * @file
 * API Search callbacks.
 */

/**
 * Type alias.
 */
function dlts_viewer_rsbe_types_alias_map($type) {
  $alias = [
    'dlts_photo_set' => 'image_set',
    'dlts_collection' => 'collection',
    'dlts_partner' => 'partner',
    'dlts_book' => 'book',
  ];
  return $alias[$type];
}

function dlts_viewer_search_repository_partner_code($code) {
  $partners = dlts_viewer_search_repository_partner();
  $found_key = array_search($code, array_column($partners, 'code'));
  $expand_partner = FALSE;
  if ($found_key) {
    if (!$expand_partner) {
      return $partners[$found_key];
    }
    // Username for the repository challange.
    $user = variable_get('repository_user', NULL);
    // Password for repository challange.
    $pass = variable_get('repository_pass', NULL);
    // Repository URL.
    $endpoint = variable_get('repository_endpoint', NULL);
    // We need this values to continue.
    if ($user && $pass && $endpoint) {
      /*
       * Not available. Search repository. NoId will not be set to null.
       */
      $endpoint = parse_url($partners[$found_key]->url);
      $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'] . $endpoint['path'] . '/colls';
      $request = drupal_http_request($endpoint);
      if ($request->code == '200') {
        $data = json_decode($request->data);
        unset($partners[$found_key]->created_at);
        unset($partners[$found_key]->updated_at);
        unset($partners[$found_key]->url);
        $collections = [];
        foreach ($data as $col) {
          $collections[] = [
            'id' => $col->id,
            'code' => $col->code,
            'name' => $col->name,
          ];
        }
        $partners[$found_key]->collections = $collections;
        return $partners[$found_key];
      } else {
        throw new Exception('Request failed with status code ' . $request->code . '.');
      }
    }
  } else {
    return [
      'error' => "Partners with code $code not found."
    ];
  }
}

function dlts_viewer_search_repository_collection_ses($partner, $collection) {
  $partners = dlts_viewer_search_repository_partner();
  $found_key = array_search($partner, array_column($partners, 'code'));
  $expand_se = FALSE;
  if ($found_key) {
    // Username for the repository challange.
    $user = variable_get('repository_user', NULL);
    // Password for repository challange.
    $pass = variable_get('repository_pass', NULL);
    // Repository URL.
    $endpoint = variable_get('repository_endpoint', NULL);
    // We need this values to continue.
    if ($user && $pass && $endpoint) {
      /*
       * Not available. Search repository. NoId will not be set to null.
       */
      $endpoint = parse_url($partners[$found_key]->url);
      $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'] . $endpoint['path'] . '/colls';
      $request = drupal_http_request($endpoint);
      if ($request->code == '200') {
        $data = json_decode($request->data);
        unset($partners[$found_key]->created_at);
        unset($partners[$found_key]->updated_at);
        unset($partners[$found_key]->url);
        $found_col = array_search($collection, array_column($data, 'code'));
        $partners[$found_key]->collection = $data[$found_col];
        unset($partners[$found_key]->collection->partner_id);
        unset($partners[$found_key]->collection->coll_type);
        unset($partners[$found_key]->collection->created_at);
        unset($partners[$found_key]->collection->updated_at);
        unset($partners[$found_key]->collection->url);
        unset($partners[$found_key]->collection->partner_url);
        if ($expand_se) {
          $endpoint = parse_url($partners[$found_key]->collection->url);
          $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'] . $endpoint['path'] . '/ses';
          $request = drupal_http_request($endpoint);
          $ses = [];
          if ($request->code == '200') {
            $data = json_decode($request->data);
            foreach ($data as $se) {
              $ses[] = [
                'id' => $se->id,
                'digi_id' => $se->digi_id,
                'type' => $se->do_type,
              ];
            }
            $partners[$found_key]->collection->ses = $ses;
            return $partners[$found_key];
          }
        } else {
          return $partners[$found_key];
        }
      } else {
        throw new Exception('Request failed with status code ' . $request->code . '.');
      }
    }
  } else {
    return [
      'error' => "Partners with code $code not found."
    ];
  }
}

/**
 * Search using Solr.
 * @link /api/v1/repository/partners
 */
function dlts_viewer_search_repository_partner() {
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
      /*
       * Not available. Search repository. NoId will not be set to null.
       */
      $endpoint = parse_url($endpoint);
      $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'];

      // Get query.
      // @todo Should we use Drupal's method?
      parse_str(
        parse_url(
          $_SERVER['REQUEST_URI'],
          PHP_URL_QUERY
        ),
        $args
      );
      // Entity language.
      $language = 'en';
      if (isset($args['lang']) && !empty($args['lang'])) {
        $language = filter_var(
          $args['lang'],
          FILTER_SANITIZE_STRING,
          FILTER_FLAG_STRIP_LOW
        );
      }

      // Entity language.
      $collection_uuid = '';
      if (isset($args['collection_uuid']) && !empty($args['collection_uuid']) ) {
        $collection_uuid = filter_var(
          $args['collection_uuid'],
          FILTER_SANITIZE_STRING,
          FILTER_FLAG_STRIP_LOW
        );
      }

      if ($collection_uuid) {
        $partOf = [];
        $requestUrl = $endpoint . '/api/v0/colls/' . $collection_uuid;
        $request = drupal_http_request($requestUrl);
        if ($request->code == '200') {
          $coll_data = json_decode($request->data);
          $partOf['uuid'] = $coll_data->id;
          $partOf['name'] = $coll_data->name;
          $partOf['code'] = $coll_data->code;
          $partOf['type'] = 'collection';
          $partOf['provider'] = [];
          $partOf['provider']['uuid'] = $coll_data->partner_id;
          $partner_url = parse_url($coll_data->partner_url);
          $partner_url = $endpoint . $partner_url['path'];
          $request = drupal_http_request($partner_url);
          if ($request->code == '200') {
            $partner_data = json_decode($request->data);
            $partOf['provider']['code'] = $partner_data->code;
            $partOf['provider']['name'] = $partner_data->name;
            $partOf['provider']['type'] = 'partner';
          }
          return $partOf;
        } else {
          throw new Exception('Request failed with status code ' . $request->code . '.');
        }
      } else {
        $requestUrl = $endpoint . '/api/v0/partners';
        $request = drupal_http_request($requestUrl);
        if ($request->code == '200') {
          $data = json_decode($request->data);
          return $data;
        } else {
          throw new Exception('Request failed with status code ' . $request->code . '.');
        }
      }
      throw new Exception('Fatal error, cause unknow.');
    }
  } catch (Exception $e) {
    return [
      'error' => $e->getMessage(),
    ];
  }
  return [
    'error' => 'Fatal error, cause unknow.',
  ];
}

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
      if (isset($args['digi_id']) && !empty($args['digi_id'])) {
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
      if (isset($args['lang']) && !empty($args['lang'])) {
        $language = filter_var(
          $args['lang'],
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
        $partOf = [];
        foreach ($wrapper->field_collection->value() as $collection) {
          $collection_wrapper = entity_metadata_wrapper('node', $collection);
          $field_partner = $collection_wrapper->field_partner->value();
          $partner_wrapper = entity_metadata_wrapper('node', $field_partner[0]);
          $isPartOf[] = [
            'uuid' => $collection_wrapper->field_identifier->value(),
            'type' => dlts_viewer_rsbe_types_alias_map($collection_wrapper->getBundle()),
            'code' => $collection_wrapper->field_code->value(),
            'name' => $collection_wrapper->field_name->value(),
            'provider' => [
              'uuid' => $partner_wrapper->field_identifier->value(),
              'type' => dlts_viewer_rsbe_types_alias_map($partner_wrapper->getBundle()),
              'code' => $partner_wrapper->field_code->value(),
              'name' => $partner_wrapper->field_name->value(),
            ],
          ];
        }
        $entity['noid'] = $handle[count($handle) - 1];
        $entity['type'] = dlts_viewer_rsbe_types_alias_map($wrapper->getBundle());
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
            $fmds = [];
            $digi_url = parse_url($data->response->docs[0]->url);
            $digi_url = $endpoint . $digi_url['path'];
            $request = drupal_http_request($digi_url);
            if ($request->code == '200') {
              $entity['noid'] = NULL;
              $digi_data = json_decode($request->data);
              if (isset($digi_data->fids) && isset($digi_data->fids->noid)) {
                $entity['noid'] = $digi_data->fids->noid;
              }
              $fmds_url = parse_url($digi_data->fmds_url);
              $fmds_url = $endpoint . $fmds_url['path'];
              $fmds_request = drupal_http_request($fmds_url);
              if ($fmds_request->code == '200') {
                $fmds_data = json_decode($fmds_request->data);
                foreach ($fmds_data as $fmd) {
                  $fmds[] = [
                    'id' => $fmd->id,
                    'name' => $fmd->name,
                    'searchable' => (isset($fmd->data) && isset($fmd->data->searchable) && $fmd->data->searchable) ? TRUE : FALSE,
                    'filesize' => $fmd->size,
                  ];
                }
              }
              $entity['seid'] = $digi_data->id;
              $entity['fmds'] = $fmds;
              $entity['type'] = $digi_data->do_type;
              $partOf['uuid'] = $digi_data->coll_id;
              $coll_url = parse_url($digi_data->coll_url);
              $coll_url = $endpoint . $coll_url['path'];
              $request = drupal_http_request($coll_url);
              if ($request->code == '200') {
                $coll_data = json_decode($request->data);
                $partOf['name'] = $coll_data->name;
                $partOf['code'] = $coll_data->code;
                $partOf['type'] = 'collection';
                $partOf['provider'] = [];
                $partOf['provider']['uuid'] = $coll_data->partner_id;
                $partner_url = parse_url($coll_data->partner_url);
                $partner_url = $endpoint . $partner_url['path'];
                $request = drupal_http_request($partner_url);
                if ($request->code == '200') {
                  $partner_data = json_decode($request->data);
                  $partOf['provider']['code'] = $partner_data->code;
                  $partOf['provider']['name'] = $partner_data->name;
                  $partOf['provider']['type'] = 'partner';
                } else {
                  throw new Exception('Unable to request partner data. Reqeust failed with status code ' . $request->code . '.');
                }
              } else {
                throw new Exception('Unable to request collection data. Reqeust failed with status code ' . $request->code . '.');
              }
            }
            $entity['isPartOf'][] = $partOf;
          } else {
            throw new Exception("Record with digi_id $digi_id not found.");
          }
        } else {
          throw new Exception('Request failed with status code ' . $request->code . '.');
        }
      }
    } else {
      throw new Exception('Incorrect configuration.');
    }
    return $entity;
  } catch (Exception $e) {
    return [
      'error' => $e->getMessage(),
    ];
  }
  return [
    'error' => 'Fatal error, cause unknow.',
  ];
}
