<?php

/**
 * @file
 * Djatoka.
 */

/**
 * Djatoka request.
 */
function dlts_viewer_djatoka_request($file) {
  $file = (object) $file;
  $service_url = variable_get('dlts_viewer_djatoka_service', 'http://dl-img.home.nyu.edu/adore-djatoka');
  $rft_id = file_create_url($file->uri);
  if (!empty($service_url)) {
    $request = url(
      "$service_url/resolver",
      [
        'absolute' => TRUE,
        'query' => [
          'url_ver' => 'Z39.88-2004',
          'svc_id' => 'info:lanl-repo/svc/getMetadata',
          'rft_id' => $rft_id,
        ],
      ],
    );
    $response = drupal_http_request($request);
    if ($response->code == '200' && isset($response->data)) {
      return drupal_json_decode($response->data);
    }
    else {
      drupal_set_message(
        t('Djatoka Image Server: Error requesting image metadata from Djakota service. @url.',
        [
          '@url' => $rft_id,
        ]
        ),
        'error'
      );
      watchdog(
        'dlts_viewer',
        'Error requesting @url. @message(error code @code).',
        [
          '@message' => $response->error,
          '@code' => $response->code,
          '@url' => $request,
        ],
        WATCHDOG_ERROR
      );
      return [
        'message' => isset($response->status_message) ? $response->status_message : $response->error,
        'error' => $response->error,
        'code' => $response->code,
      ];
    }
  }
  else {
    drupal_set_message(
      t('<em>Djatoka Image Server</em>: Error requesting image metadata from Djakota service. @url.',
      [
        '@url' => $rft_id,
      ]
    ), 'error');
    watchdog(
      'dlts_viewer',
      'Error requesting image metadata from Djakota service. Please configure Djatoka Jpeg 2000 Image Server.',
      [],
      WATCHDOG_ERROR
    );
    return [
      'message' => 'Page not found',
      'error' => 404,
      'code' => 404,
    ];
  }
}

function dlts_viewer_djatoka_url($file, $embeded_tumb = FALSE, $solr_index = FALSE) {
  $service = $GLOBALS['base_url'] . '/api/v1/image';
  $arguments = [
    'url_ver' => 'Z39.88-2004',
    'svc_id' => 'info:lanl-repo/svc/getRegion',
    'svc_val_fmt' => 'info:ofi/fmt:kev:mtx:jpeg2000',
    'svc.format' => 'image/jpeg',
    'rft_id' => file_create_url($file['uri']),
  ];
  if ($embeded_tumb) {
    $arguments['svc.scale'] = '100';
  }
  else {
    // Added for https://jira.nyu.edu/jira/browse/DLTSBOOKS-208 and DLTSACO-627.
    // Needed for better sites generation.
    if ($solr_index) {
      $arguments['svc.level'] = '1';
    }
    else {
      if (isset($file['image_style'])) {
        $dimmensions = explode('x', $file['image_style']);
        if (count($dimmensions) == 2 && is_numeric($dimmensions[1])) {
          $arguments['svc.scale'] = $dimmensions[1];
        }
      }
      else {
        $arguments['svc.scale'] = '230';
      }
    }
  }
  return url(
    "$service/resolver",
    [
      'external' => TRUE,
      'query' => $arguments,
    ]
  );
}
