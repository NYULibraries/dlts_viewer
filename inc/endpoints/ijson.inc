<?php

// https://jira.nyu.edu/browse/RSTAR-545
// https://localhost/viewer/api/v1/ijson/akkasah/ad_mc_002
function dlts_viewer_ijson_dispatcher($partner, $collection) {
  drupal_register_shutdown_function('dlts_viewer_shutdown_log_api_requests', []);
  // Username for the repository challange.
  $user = variable_get('publisher_user', NULL);
  // Password for repository challange.
  $pass = variable_get('publisher_pass', NULL);
  // Repository URL.
  $publisher = variable_get('publisher_endpoint', NULL);
  if ($user && $pass && $publisher) {
    // Parse the URL.
    $endpoint = parse_url($publisher);
    // https://dev-ead-publisher.dlib.nyu.edu/findingaids/<partner>/<collection code>/<collection code>.json
    $endpoint = $endpoint['scheme'] . '://' . $user . ':' . $pass . '@' . $endpoint['host'] . $endpoint['path'] . "/preview/ijson/$partner/$collection/$collection.json";  
    $request = drupal_http_request($endpoint);
    if ($request->code == '200') {
      // unset($request->data->runinfo);
      return json_decode($request->data);
    }
  }
}
