<?php

/**
 * @file
 * API Photos endpoint.
 */

// https://[HOST]/viewer/api/iiif/photos/5tb2rnch/1/full/250,/0/default.jpg
/**
 * IIIF Photo Sequence Image callback.
 *
 * Retrieves an image sequence for photo entities from the IIIF server, applies
 * HTTP caching headers, and streams the raw binary response directly to the client.
 *
 * @param object $entity
 *   The photo node object.
 * @param array $sequence
 *   Array containing image sequence metadata and target URI.
 * @param string $region
 *   IIIF region string. Defaults to 'full'.
 * @param string $size
 *   IIIF size string. Defaults to 'max'.
 * @param int $rotation
 *   IIIF rotation value. Defaults to 0.
 * @param string $quality
 *   IIIF quality and format string. Defaults to 'default.jpg'.
 */
function dlts_viewer_dlts_photo_sequence_image_iiif($entity, array $sequence, $region = 'full', $size = 'max', $rotation = 0, $quality = 'default.jpg') {

  $image_server = variable_get('dlts_image_server', 'http://127.0.0.1:8182');

  if (!empty($sequence['cm']['uri'])) {
    $static_source = variable_get('dlts_image_static_source', 'FilesystemSource');

    switch ($static_source) {
      case 'FilesystemSource':
        $image_id = str_replace('fileserver://', '', $sequence['cm']['uri']);
        break;

      case 'HttpSource':
      default:
        $image_id = file_create_url($sequence['cm']['uri']);
        break;
    }

    $uri = urlencode($image_id);
    $image_url = "$image_server/iiif/2/$uri/$region/$size/$rotation/$quality";
    $original_image_source = file_create_url($sequence['cm']['uri']);

    // Fetch image from IIIF image server
    $options = [
      'method' => 'GET',
      'timeout' => 15,
    ];

    $response = drupal_http_request($image_url, $options);

    // Handle Successful Response
    if ($response && $response->code == '200' && !empty($response->data)) {
      $etag = '"' . md5($response->data) . '"';
      $max_age = 31536000; // 1 year
      $request_time = isset($_SERVER['REQUEST_TIME']) ? $_SERVER['REQUEST_TIME'] : time();

      // 1. Mark cacheable in Drupal
      drupal_page_is_cacheable(TRUE);

      // 2. Set HTTP response headers
      drupal_add_http_header('Content-Type', 'image/jpeg');
      drupal_add_http_header('ETag', $etag);
      drupal_add_http_header('Cache-Control', 'public, max-age=' . $max_age);
      drupal_add_http_header('Expires', gmdate('D, d M Y H:i:s', $request_time + $max_age) . ' GMT');
      drupal_add_http_header('Access-Control-Allow-Origin', '*');
      drupal_add_http_header('Access-Control-Allow-Methods', 'GET');
      drupal_add_http_header('Content-Transfer-Encoding', 'binary');

      // Custom context headers
      drupal_add_http_header('Master-Image', $original_image_source);
      drupal_add_http_header('Image-Server-Url', $image_url);

      // 3. Handle 304 Not Modified revalidation
      if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        drupal_add_http_header('Status', '304 Not Modified');
        drupal_exit();
      }

      // 4. Output image binary and exit
      echo $response->data;
      drupal_exit();
    }

    // Handle Gateway Timeout / Server Down
    if (!$response || (isset($response->code) && $response->code == -1)) {
      drupal_add_http_header('Status', '504 Gateway Timeout');
      drupal_json_output([
        'error' => [
          'message' => 'IIIF image server connection timed out.',
          'imageSource' => $original_image_source,
          'request' => $image_url,
          'entity' => [
            'nid' => isset($entity->nid) ? $entity->nid : NULL,
          ],
        ],
      ]);
      drupal_exit();
    }

    // Handle HTTP Error Response from Cantaloupe
    $status_code = isset($response->code) ? $response->code : 400;
    drupal_add_http_header('Status', $status_code . ' Bad Request');
    drupal_json_output([
      'response' => [
        'message' => isset($response->status_message) ? $response->status_message : 'Image processing error.',
        'error' => isset($response->error) ? $response->error : 'Bad Request',
        'imageSource' => $original_image_source,
        'request' => $image_url,
        'entity' => [
          'nid' => isset($entity->nid) ? $entity->nid : NULL,
        ],
      ],
    ]);
    drupal_exit();
  }
}
