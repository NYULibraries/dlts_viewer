<?php

function dlts_viewer_eads_dispatcher($noid) {

  $module = DRUPAL_ROOT . '/' . drupal_get_path('module', 'dlts_viewer') . '/fales_mss208_cuid1200.json';

  $data = json_decode(file_get_contents($module), true);

  unset($data['runinfo']);

  unset($data['pubinfo']);

  return $data;

}
