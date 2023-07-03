<?php

function _dlts_viewer_menu_map() {

  $items = [];

  $items['maps/%dlts_map/display'] = [
    'title' => 'Book metadata display',
    'access arguments' => [ 'access content' ],
    'page callback' => 'dlts_viewer_map_dispatcher',
    'page arguments' => [ 1, 2 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  // Render map pages.
  $items['maps/%dlts_map/%dlts_map_page'] = [
    'title' => 'Map page',
    'access arguments' => ['access content'],
    'page callback' => 'dlts_viewer_map_dispatcher',
    'page arguments' => [ 1, 2 ],
    'delivery callback' => 'drupal_deliver_html_page',
    'type' => MENU_CALLBACK,
  ];

  return $items;

}
