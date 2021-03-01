<?php

/**
 * @file
 * Include wildcard loaders.
 */

/*
 * Find all the loaders inside directory inc/loaders and include them.
 */
foreach (file_scan_directory(drupal_get_path('module', 'dlts_viewer') . '/inc/loaders', '/.*\.inc$/') as $absolute => $file) {
  include_once $absolute;
}
