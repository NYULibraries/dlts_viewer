<?php

function dlts_viewer_search_mongo_record ($isPartOf = null, $sequence = 1) {
  /**
   * Load MongoDB helper
   */
  module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

  $collection_name = 'dlts_books_page';

  $isPartOf = 'fales_io_book000009';

  $sequence = 1;

  $result = dlts_viewer_mongodb_load_sequence($sequence, $isPartOf, $collection_name);

}

