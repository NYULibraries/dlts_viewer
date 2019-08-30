<?php

function dlts_viewer_json_documents ($language = 'en', $limit = 100) {
  $query = db_select('dlts_viewer_books_json', 'b')
	  ->fields('b', array(
	    'document',
	    'legacy',
	    'identifier'
	  ))
	  ->condition('proceed', '0')
	  ->condition('language', $language)
    ->orderBy('created', 'DESC')
    ->range(0,$limit);
  return $query->execute()->fetchAll();
}


