<?php

/**
 * @file
 * Book Solr callbacks.
 */

/**
 * Index Series.
 */
function dlts_solr_index_book_series($document, $entity, $searchableFields) {
  $language = $entity->language;
  $prefix = '';
  if ($language != 'en') {
    $prefix = $language . '_';
  }
  /*
   * Pass entity as reference and check if this books is part of a series.
   * If book belong to a series, populat isSeriesBook.
   */

  dlts_viewer_is_series_book($entity);
  if ($entity->isSeriesBook) {
    /*
     * Book is part of a series.
     */
    $document->addField('is_ispartofseries', 1);
    foreach ($entity->seriesBook as $series) {
      $searchableFields[] = $series['series'];
      $searchableFields[] = $series['volume_label'];
      $searchableFields[] = $series['collection_label'];
      $document->addField('sm_' . $prefix . 'series_identifier', $series['series_identifier']);
      $document->addField('sm_' . $prefix . 'series', $series['series']);
      $document->addField('sm_' . $prefix . 'series_volume_label', $series['volume_label']);
      $document->addField('sm_' . $prefix . 'series_collection_label', $series['collection_label']);
      $document->addField('sm_' . $prefix . 'series_collection_code', $series['collection_code']);
      $series['label'] = $series['series'];
      $document->addField('zm_' . $prefix . 'series_data', json_encode($series));
    }
  }
  $m = array();
  $bundle = 'dlts_series_book';

  // Let's find out if this one have a Series books.
  // @link https://jira.nyu.edu/jira/browse/AWDL-211
  $nodes_dlts_series_book = dlts_viewer_series_book($entity->nid);

  if (!$nodes_dlts_series_book) return;

  foreach ($nodes_dlts_series_book as $node_dlts_series_book) {
    $__wrapper_dlts_series_book = entity_metadata_wrapper('node', $node_dlts_series_book);
    $___wrapper = entity_metadata_wrapper('node', $__wrapper_dlts_series_book->field_series->value());
    $_series = $__wrapper_dlts_series_book->field_series->value();
    if ($_series) {
      $series_node = node_load($_series->nid);
      $series_wrapper = entity_metadata_wrapper('node', $series_node);
      $series_book_collections = array();
      $series_book_collection = $__wrapper_dlts_series_book->field_collection->value();
      foreach ($series_book_collection as $value) {
        $collection_wrapper = entity_metadata_wrapper('node', $value);
        $series_book_collections[] = array(
          'label' => $value->title,
          'code' => $collection_wrapper->field_code->value(),
          'name' => $collection_wrapper->field_name->value(),
          'identifier' => $collection_wrapper->field_identifier->value(),
        );
      }
      $m[] = array(
        'series_book_nid' => $node_dlts_series_book->nid,
        'series_book_label' => $node_dlts_series_book->title,
        'series_book_identifier' => $__wrapper_dlts_series_book->field_identifier->value(),
        'series_book_volume_number' =>  $__wrapper_dlts_series_book->field_volume_number->value(),
        'series_book_volume_number_str' => $__wrapper_dlts_series_book->field_volume_number_str->value(),
        'series_book_collections' => $series_book_collections,
        'series_nid' => $_series->nid,
        'series_identifier' => $series_wrapper->field_identifier->value(),
        'series_label' => $series_node->title,
      );
    }
  }

  $document->addField('zm_series_data_x', json_encode($m));

  foreach ($m as $b) {
    foreach (array_keys($b) as $c) {
      if (is_array($b[$c])) {
        foreach ($b[$c] as $d) {
          foreach (array_keys($d) as $e) {
            if (!empty($d[$e])) {
              $document->addField('sm_' . $prefix . $c . '_' . $e, $d[$e]);
            }
          }
        }
      }
      else {
        if (!empty($b[$c])) {
          $document->addField('sm_' . $prefix . $c, $b[$c]);
        }
      }
    }
  }
}

/**
 * Index Book.
 */
function dlts_solr_index_book(&$document, &$entity, $entity_type, $env_id) {
  global $base_url;
  module_load_include('inc', 'dlts_viewer', 'inc/datasource');
  $language = $entity->language;
  // Skip if entity language is not English.
  if ($language != 'en') {
    return;
  }
  // Add translations helper.
  module_load_include('inc', 'dlts_solr', 'inc/translations');
  // Wrapp multi-volume entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);
  // Single-value field.
  $identifier = $wrapper->field_identifier->value();
  $book_field_title = $entity->title;
  // DLTS book should have a identifier.
  if (!$identifier) {
    return;
  }
  $document->addField('ss_book_identifier', $identifier);
  $document->addField('ss_uri', url('books/' . $identifier . '/1', array('absolute' => TRUE)));
  // Searchable content; dump all you want to be searchable in this array.
  $searchableFields = array($document->content);

  /*
   * content type fields
   */

  /*
   * Collection (field_collection)
   */

  // Multi-value field.
  dlts_solr_index_collection($wrapper->field_collection->value(), $document, $entity, $searchableFields);

  /*
   * Provider (field_partner)
   */

  // Multi-value field.
  dlts_solr_index_partners($wrapper->field_partner->value(), $document, $entity, $searchableFields);

  dlts_solr_index_book_series($document, $entity, $searchableFields);

  /*
   * ISBN (field_isbn)
   */

  // Multi-value field.
  $isbns = $wrapper->field_isbn->value();
  if (!empty($isbns)) {
    foreach ($isbns as $isbn) {
      $document->addField('sm_isbn', $isbn);
    }
  }
  unset($isbns);
  unset($isbn);

  /*
   * Permanent Link (field_handle)
   */

  // single-value field.
  $handle = $wrapper->field_handle->value();

  if (!empty($handle)) {
    $document->addField('ss_handle', $handle['url']);
    $noid = explode('/', $handle['url']);
    $document->addField('ss_noid', $noid[count($noid) - 1]);
  }
  unset($handle);

  // https://dev-sites.dlib.nyu.edu/viewer/api/presentation/books/tamwag_palante000011/manifest.json
  $document->addField('ss_manifest', "$base_url/api/presentation/books/$identifier/manifest.json");  

  /*
   * Title (field_title)
   */

  /*
   * single-value field
   */
  $title_long = $wrapper->field_title->value();

  if (!empty($title_long)) {
    $book_field_title = trim($title_long);
  }
  unset($title_long);

  // Figure out if this is a Multi Volume book.
  $multivolumes = dlts_viewer_multivolume_book_by_book_nid($entity);

  /*
   * @todo Size might be > that 0. For now just deal with 0 and then fix after.
   * we have the other bulk of the work done.
   */
  if (!empty($multivolumes)) {
    $multivolume = $multivolumes[0];
    /*
     * Add reference to entity so that translaletion don't
     * do the same job again.
     */
    $entity->solr_multivolume = $multivolume;
    $volume = '';
    // Field volume_number_str can be empty, if so, try volume_number.
    if (isset($multivolume['volume_number_str']) && !empty($multivolume['volume_number_str'])) {
      $volume = $multivolume['volume_number_str'];
    }
    elseif (isset($multivolume['volume_number']) && !empty($multivolume['volume_number'])) {
      $volume = 'Vol. ' . $multivolume['volume_number'];
    }
    $book_field_title = t(
      '@title @volume',
      array(
        '@title' => $book_field_title,
        '@volume' => $volume,
      )
    );
    $document->addField('is_ispartof_multivol', 1);
    if (!empty($volume)) {
      $document->addField('ss_multivol_number', $volume);
    }
    $document->addField('ss_multivol_label', $book_field_title);
  }
  else {
    $document->addField('is_ispartof_multivol', 0);
  }
  // we need to wait until we figure out if this is a multi volume.
  // by now, we already test for multi volume and title should be the right one.
  $document->addField('ss_title_long', $book_field_title);
  $searchableFields[] = dlts_solr_remove_accents($book_field_title);
  /** Subtitle (field_subtitle) */
  /** single-value field */
  $subtitle = $wrapper->field_subtitle->value();
  if (!empty($subtitle)) {
    $searchableFields[] = $subtitle;
    $document->addField('ss_subtitle', $subtitle);
  }
  unset($subtitle);
  /** Description (field_description) */
  /** single-value field */
  $description = $wrapper->field_description->value();
  if (!empty($description)) {
    $searchableFields[] = $description;
    $document->addField('ss_description', $description);
  }
  unset($description);
  /** Call number (field_call_number) */
  /** single-value field */
  $call_number = $wrapper->field_call_number->value();
  if (!empty($call_number)) {
    $document->addField('ss_call_number', $call_number);
    $searchableFields[] = $call_number;
  }
  unset($call_number);
  /** Volume (field_volume) */
  /** single-value field */
  $volume = $wrapper->field_volume->value();
  if (!empty($volume)) {
    $document->addField('ss_volume', $volume);
  }
  unset($volume);
  /** Number (field_number) */
  /** single-value field */
  $number = $wrapper->field_number->value();
  if (!empty($number)) {
    $document->addField('ss_number', $number);
  }
  unset($number);

  $ri = "$base_url/api/image/books/$identifier/1/full/full/0/default.jpg";

  $document->addField('ss_representative_image', $ri);

  $document->addField('ss_site_image', $ri);


  /** Author (field_author) */
  /** multi-value field */
  $authors = $wrapper->field_author->value();
  if (!empty($authors)) {
    foreach ($authors as $index => $author) {
      $searchableFields[] = $author;
      if ($index == 0) {
        $document->addField('ss_sauthor', strtolower(dlts_solr_remove_accents($author)));
        $document->addField('iass_author', $author);
      }
      $document->addField('sm_author', $author);
    }
  }
  unset($authors);
  unset($author);
  /** Creator (field_creator) */
  /** multi-value field */
  $creators = $wrapper->field_creator->value();
  if (!empty($creators)) {
    foreach ($creators as $creator) {
      $document->addField('sm_creator', $creator);
      $searchableFields[] = $creator;
    }
  }
  unset($creators);
  unset($creator);
  /** Editor (field_editor) */
  /** multi-value field */
  $editors = $wrapper->field_editor->value();
  if (!empty($editors)) {
    foreach ($editors as $editor) {
      $document->addField('sm_editor', $editor);
      $searchableFields[] = $editor;
    }
  }
  unset($editors);
  unset($editor);
  /** Contributor (field_contributor) */
  /** multi-value field */
  $contributors = $wrapper->field_contributor->value();
  if (!empty($contributors)) {
    foreach ($contributors as $contributor) {
      $document->addField('sm_contributor', $contributor);
      $searchableFields[] =  $contributor;
    }
  }
  unset($editors);
  unset($editor);
  /** Publisher (field_publisher) */
  /** multi-value field */
  $publishers = $wrapper->field_publisher->value();
  if (!empty($publishers)) {
    foreach ($publishers as $publisher) {
      $document->addField('sm_publisher',  $publisher);
      $searchableFields[] =  $publisher;
    }
  }
  unset($publishers);
  unset($publisher);
  /** Publication date (field_publication_date) */
  /** single-value field */
  $publication_date = $wrapper->field_publication_date->value();
  $publication_date_text = $wrapper->field_publication_date_text->value();
  if (!empty($publication_date) && !empty($publication_date['value'])) {
    /** convert ISO format into UNIX  timestamp */
    $timestamp = strtotime($publication_date['value']);
    $searchableFields[] = $publication_date['value'];
    /** use date() to get just the year */
    $publication_year = date('Y', $timestamp);
    if ($publication_year) {
      $document->addField('sort_pubyear', $publication_year);
      $document->addField('iass_pubyear', $publication_year);
      $document->addField('iass_timestamp', $timestamp);
                $document->addField('ds_timestamp', date('Y-m-d\TG:i:s\Z', strtotime($publication_date['value'])));
    } else {
        if (!empty($publication_date_text)) {
            $publication_date_text_norm=preg_replace('(u|?)','0',$publication_date_text);
            preg_match_all('\b\d{4}\b', $publication_date_text_norm, $years);
            if(!empty($years)) {
                foreach ($years as $index => $publication_year) {
                    $searchableFields[] = $publication_year;
                    if ($index == 0) {
                        $document->addField('sort_pubyear', $publication_year);
                        $document->addField('iass_pubyear', $publication_year);
                    }
                    $document->addField('dm_pubyear', date('Y-m-d\TG:i:s', strtotime($publication_year)));
                }
            }
        }

      }
  }
  unset($publication_date);
  unset($publication_year);
  /** Publication date (field_publication_date) */
  /** single-value field */

  if (!empty($publication_date_text)) {
    /** @TODO: Find the right field for this field */
    $document->addField('ss_publication_date_text', $publication_date_text);
    $document->addField('ss_pubdate', $publication_date_text); // remove this?
    $document->addField('ss_spubdate', strtolower($publication_date_text));
  } else {

  }
  unset($publication_date_text);
  /** Publication location (field_publication_location) */
  /** single-value field */
  $publication_location = $wrapper->field_publication_location->value();
  if (!empty($publication_location)) {
    $searchableFields[] = $publication_location;
    $document->addField('ss_publication_location', $publication_location);
    $document->addField('ss_publocation', $publication_location); // remove this? @kate- when search options are fixed
  }
  unset($publication_location);
  /** Subject (field_subject) */
  /** multi-value field */
  $subjects = $wrapper->field_subject->value();
  if (!empty($subjects)) {
    foreach ($subjects as $index=>$subject) {
      $document->addField('sm_subject_label', $subject->name);
      $searchableFields[] = $subject->name;
    if ($index == 0) {
      $document->addField('iass_subject', $subject->name);
    }
      $document->addField('zm_subject',json_encode(array('name'=>$subject->name,'tid' => $subject->tid, 'vid' => $subject->vid)));
    }
  }
  unset($subjects);
  unset($subject);
  /** Topic (field_topic) */

  // PDF
  // See: DLTSACO-775
  $pdfs = array();
  $field_pdf = $wrapper->field_pdf_file->value();
  if ($field_pdf && !empty($field_pdf)) {
    foreach ($field_pdf as $key => $pdf) {
      $pdf_identifier = '';
      $pdf_kind = 'und';
      $pdf_pathinfo = pathinfo($pdf['uri']);
      $pdf_basename = $pdf_pathinfo['basename'];
      preg_match('/(.*)_(lo|hi)\.pdf/', $pdf_basename, $pdf_matches);

      if ($pdf_matches && isset($pdf_matches[1]) && isset($pdf_matches[2])) {
        $pdf_identifier = $pdf_matches[1];
        $pdf_kind = $pdf_matches[2];
      }

      $pdfs[$pdf_kind] = array(
        'kind' => $pdf_kind,
      );

      // Label
      if (isset( $pdf['label'])) {
        $pdfs[$pdf_kind]['label'] = $pdf['label'];
      }
      // URL
      if (isset($pdf['uri'])) {
        $pdfs[$pdf_kind]['uri'] = file_create_url($pdf['uri']);
      }

      // Filezise
      if (dlts_viewer_is_serialized($pdf['data'])) {
        $pdf_data = unserialize($pdf['data']);
        if ($pdf_data['filesize'] && $pdf_data['filesize'] > 0) {
          $pdfs[$pdf_kind]['filesize'] = $pdf_data['filesize'];
        } else {
          $pdfs[$pdf_kind]['filesize'] = field_fileserver_get_pdf_filesize(
            array(
              'uri' => $pdfs[$pdf_kind]['uri'],
            )
          );
        }
      }
      // no $data
      else {
        $pdfs[$pdf_kind]['filesize'] = field_fileserver_get_pdf_filesize(
          array(
            'uri' => $pdfs[$pdf_kind]['uri'],
          )
        );
      }

      $_fieldname = 'zm_pdf_' . $pdf_kind;

      $document->addField($_fieldname, json_encode($pdfs[$pdf_kind]));
    }
  }

  unset($pdfs);

  /** multi-value field */
  $topics = $wrapper->field_topic->value();
  if (!empty($topics)) {
    foreach ($topics as $topic) {
      $topic = trim($topic);
      $searchableFields[] =  $topic;
      $document->addField('sm_topic', $topic);
      $document->addField('tkm_topic', $topic);
      $document->addField('tum_topic', str_replace('.', '', $topic));
      $document->addField('tm_topic', str_replace('.', '', $topic));
    }
  }
  unset($topics);
  unset($topic);
  /** Language code (field_language_code) */
  /** multi-value field */
  $language_codes = $wrapper->field_language_code->value();
  if (!empty($language_codes)) {
    foreach ($language_codes as $language_code) {
      $document->addField('sm_language_code', $language_code);
    }
  }
  unset($language_codes);
  unset($language_code);
  /** Language (field_language) */
  /** multi-value field */
  $field_language = $wrapper->field_language->value();
  if (!empty($field_language)) {
    foreach ($field_language as $language) {
      $document->addField('sm_language', $language);
    }
  }
  unset($field_language);
  unset($language);

  /** Single value fields */
  $document->addField('ss_title', $book_field_title);
  // Strip HTML Tags
  $title_sort = strip_tags($book_field_title);
  // Trim the string of leading/trailing space
  $title_sort = trim($title_sort);
  $title_sort = dlts_solr_remove_accents($title_sort);
  // Clean up things like &amp;
  $title_sort = html_entity_decode($title_sort);
  // Strip out any url-encoded stuff
  $title_sort = urldecode($title_sort);
  // Replace Multiple spaces with single space
  $title_sort = preg_replace('/ +/', ' ', $title_sort);
  // To lower-case
  $title_sort = strtolower($title_sort);
  /** Sort fields */
  $document->addField('ss_longlabel', $title_sort);
  $document->addField('iass_longlabel', $title_sort);
  /** add translations */
  dlts_solr_index_book_translations($document, $entity, $entity_type, $env_id, $searchableFields);
  unset($document->content);
  $document->addField('content', implode($searchableFields, ' '));
}
