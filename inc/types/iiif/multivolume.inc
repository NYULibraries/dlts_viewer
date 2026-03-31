<?php

/**
 * @file
 * IIIF Presentation API v3 manifest generation for multivolume resources.
 */

function dlts_viewer_iiif_multivolume_list_manifest($multivolume) {

  global $base_url;

  $manifest = [
    '@context' => 'http://iiif.io/api/presentation/3/context.json',
    'id' => "$base_url/api/presentation/multivolume/{$multivolume['identifier']}/manifest.json",
    'type' => 'Collection',
    'label' => ['en' => [trim($multivolume['title'])]],
    'items' => [],
  ];

  foreach ($multivolume['items'] as $item) {
    $manifest['items'][] = [
      'id' => "$base_url/api/presentation/{$item['type']}/{$item['identifier']}/manifest.json",
      'type' => 'Manifest',
      'label' => ['en' => [ trim($item['title'])]],
    ];
  }

  return $manifest;
}
