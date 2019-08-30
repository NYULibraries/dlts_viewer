<?php

function dlts_viewer_add_json_documents_to_queue ($files) {
  foreach ($files as $hash => $languages) {
    foreach ($languages as $language => $documents) {
      foreach ($documents as $document) {
      	if (file_exists($document)) {
          db_insert('dlts_viewer_books_json')->fields(array('nid' => null, 'hash' => $hash, 'document'=> $document, 'language' => $language, 'proceed' => 0, 'created' => time()))->execute();
      	}
      }
    }
  }
}


