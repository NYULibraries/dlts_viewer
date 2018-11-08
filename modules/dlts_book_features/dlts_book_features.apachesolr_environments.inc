<?php
/**
 * @file
 * dlts_book_features.apachesolr_environments.inc
 */

/**
 * Implements hook_apachesolr_environments().
 */
function dlts_book_features_apachesolr_environments() {
  $export = array();

  $environment = new stdClass();
  $environment->api_version = 1;
  $environment->env_id = 'solr';
  $environment->name = 'Discovery Apache Solr 6.x server';
  $environment->url = 'http://stagediscovery.dlib.nyu.edu:8983/solr/viewer';
  $environment->service_class = '';
  $environment->conf = array(
    'apachesolr_direct_commit' => 0,
    'apachesolr_read_only' => '0',
    'apachesolr_soft_commit' => 0,
  );
  $environment->index_bundles = array(
    'node' => array(
      0 => 'dlts_book',
      1 => 'dlts_collection',
      2 => 'dlts_map',
      3 => 'dlts_multivol',
      4 => 'dlts_multivol_book',
      5 => 'dlts_partner',
      6 => 'dlts_photo_set',
      7 => 'dlts_series',
      8 => 'dlts_series_book',
    ),
  );
  $export['solr'] = $environment;

  return $export;
}
