<?php

/**
 * @file
 * IIIF Presentation API v3 manifest generation for sets resources.
 */

function dlts_viewer_iiif_sets_list_manifest($set) {

  global $base_url;

  $manifest = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/sets/manifest.json",
    'type' => 'Collection',
    'label' => ['en' => [trim($set['title'])]],
    'items' => [],
  ];

  foreach ($set['items'] as $item) {
    $manifest['items'][] = [
      'id' => "$base_url/api/presentation/{$item['type']}/{$item['identifier']}/manifest.json",
      'type' => 'Manifest',
      'label' => ['en' => [ trim($item['title'])]],
    ];
  }

  return $manifest;    
}
