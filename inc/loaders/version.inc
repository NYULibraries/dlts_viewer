<?php

/**
 * @file
 * NoId load.
 */

/**
 * A wildcard loader for dlts_version.
 *
 * @parameter string $version
 *  The value of noid.
 */
function dlts_version_load($version) {
  $versions = [ 'v0', 'v1'];
  $version = filter_xss($version);
  if (in_array($version, $versions)) {
    return $version;
  } else {
    return FALSE;
  }
}
