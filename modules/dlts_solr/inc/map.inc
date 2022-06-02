<?php

/**
 * @file
 * Map Solr callbacks.
 */

/**
 * Index Map.
 */
 function dlts_solr_index_map(&$document, &$entity, $entity_type, $env_id) {
  global $base_url;
  // Datasource.
  module_load_include('inc', 'dlts_viewer', 'inc/datasource');
  // Add image server helper.
  module_load_include('inc', 'dlts_viewer', 'inc/djatoka');
  $language = $entity->language;
  $wrapper = entity_metadata_wrapper('node', $entity);
  // Single-value field.
  $identifier = $wrapper->field_identifier->value();
  // Should have a identifier.
  if (!$identifier) {
    return;
  }
  $document->addField('ss_identifier', $identifier);
  $document->addField('ss_uri', url("maps/$identifier/1", array('absolute' => TRUE)));
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
   * Multi-value field.
   */
  dlts_solr_index_partners($wrapper->field_partner->value(), $document, $entity, $searchableFields);

  /*
   * Permanent Link (field_handle)
   * single-value field.
   */
  $handle = $wrapper->field_handle->value();

  if (!empty($handle)) {
    $document->addField('ss_handle', $handle['url']);
    $noid = explode('/', $handle['url']);
    $document->addField('ss_noid', $noid[count($noid) - 1]);    
  }

  $document->addField('ss_manifest', "$base_url/api/presentation/maps/$identifier/manifest.json");

  /*
   * Title (field_title)
   * single-value field
   */
  $title_long = $wrapper->field_title->value();

  if (!empty($title_long)) {
    $field_title = trim($title_long);
  }

  $document->addField('ss_title_long', $field_title);

  $searchableFields[] = dlts_solr_remove_accents($field_title);

  /*
   * Subtitle (field_subtitle)
   * single-value field
   */
  $subtitle = $wrapper->field_subtitle->value();
  if (!empty($subtitle)) {
    $searchableFields[] = $subtitle;
    $document->addField('ss_subtitle', $subtitle);
  }

  /*
   * Description (field_description)
   * single-value field
   */
  $description = $wrapper->field_description->value();
  if (!empty($description)) {
    $searchableFields[] = $description;
    $document->addField('ss_description', $description);
  }

  /*
   * Call number (field_call_number)
   * single-value field
   */
  $call_number = $wrapper->field_call_number->value();
  if (!empty($call_number)) {
    $document->addField('ss_call_number', $call_number);
    $searchableFields[] = $call_number;
  }

  /*
   * Representative image (field_representative_image)
   * single-value field
   * @todo fix
   */
  $representative_image = $wrapper->field_representative_image->value();

  if (!empty($representative_image)) {
    $pathinfo = pathinfo($representative_image['uri']);

    /** load Image Server util */
    $ri = '';
    if ($pathinfo['extension'] == 'jpg') {
      $ri = file_create_url($representative_image['uri']);
    }
    elseif ($pathinfo['extension'] == 'jp2') {
      $ri = dlts_viewer_djatoka_url($representative_image, false, true);
    }

    $dirname = $pathinfo['dirname'];
    $dir_path = pathinfo($dirname);
    $basename = $dir_path['basename'];
    $site_image = $basename . '/' . $pathinfo['filename'];
    $document->addField('ss_representative_image', $ri);
    $document->addField('ss_site_image', $site_image);
  }

  /*
   * Author (field_author)
   * multi-value field
   */
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

  /*
   * Creator (field_creator)
   * multi-value field
   */
  $creators = $wrapper->field_creator->value();
  if (!empty($creators)) {
    foreach ($creators as $creator) {
      $document->addField('sm_creator', $creator);
      $searchableFields[] = $creator;
    }
  }

  /*
   * Editor (field_editor)
   * multi-value field
   */
  $editors = $wrapper->field_editor->value();
  if (!empty($editors)) {
    foreach ($editors as $editor) {
      $document->addField('sm_editor', $editor);
      $searchableFields[] = $editor;
    }
  }

  /*
   * Contributor (field_contributor)
   * multi-value field
   */
  $contributors = $wrapper->field_contributor->value();
  if (!empty($contributors)) {
    foreach ($contributors as $contributor) {
      $document->addField('sm_contributor', $contributor);
      $searchableFields[] = $contributor;
    }
  }

  /*
   * Publisher (field_publisher)
   * multi-value field
   */
  $publishers = $wrapper->field_publisher->value();
  if (!empty($publishers)) {
    foreach ($publishers as $publisher) {
      $document->addField('sm_publisher',  $publisher);
      $searchableFields[] = $publisher;
    }
  }

  /*
   * Publication date (field_publication_date).
   */
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
    }
    else {
      if (!empty($publication_date_text)) {
        $publication_date_text_norm = preg_replace('(u|?)','0',$publication_date_text);
        preg_match_all('\b\d{4}\b', $publication_date_text_norm, $years);
        if (!empty($years)) {
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

  if (!empty($publication_date_text)) {
    $document->addField('ss_publication_date_text', $publication_date_text);
    $document->addField('ss_pubdate', $publication_date_text);
    $document->addField('ss_spubdate', strtolower($publication_date_text));
  }

  // Publication location (field_publication_location).
  $publication_location = $wrapper->field_publication_location->value();
  if (!empty($publication_location)) {
    $searchableFields[] = $publication_location;
    $document->addField('ss_publication_location', $publication_location);
  }

  /** Subject (field_subject) */
  $subjects = $wrapper->field_subject->value();
  if (!empty($subjects)) {
    foreach ($subjects as $index => $subject) {
      $document->addField('sm_subject_label', $subject->name);
      $searchableFields[] = $subject->name;
    if ($index == 0) {
      $document->addField('iass_subject', $subject->name);
    }
      $document->addField('zm_subject',json_encode(array('name'=>$subject->name,'tid' => $subject->tid, 'vid' => $subject->vid)));
    }
  }

  /*
   * PDF
   * @link DLTSACO-775
   */
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
      // Label.
      if (isset( $pdf['label'])) {
        $pdfs[$pdf_kind]['label'] = $pdf['label'];
      }
      // URL.
      if (isset($pdf['uri'])) {
        $pdfs[$pdf_kind]['uri'] = file_create_url($pdf['uri']);
      }
      // Filezise.
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
      // No $data.
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

  $topics = $wrapper->field_topic->value();
  if (!empty($topics)) {
    foreach ($topics as $topic) {
      $topic = trim($topic);
      $searchableFields[] = $topic;
      $document->addField('sm_topic', $topic);
      $document->addField('tkm_topic', $topic);
      $document->addField('tum_topic', str_replace('.', '', $topic));
      $document->addField('tm_topic', str_replace('.', '', $topic));
    }
  }

  // Language code (field_language_code).
  $language_codes = $wrapper->field_language_code->value();
  if (!empty($language_codes)) {
    foreach ($language_codes as $language_code) {
      $document->addField('sm_language_code', $language_code);
    }
  }

  // Language (field_language).
  $field_language = $wrapper->field_language->value();
  if (!empty($field_language)) {
    foreach ($field_language as $language) {
      $document->addField('sm_language', $language);
    }
  }

  // Single value fields.
  $document->addField('ss_title', $field_title);

  // Strip HTML Tags.
  $title_sort = strip_tags($field_title);

  // Trim the string of leading/trailing space.
  $title_sort = trim($title_sort);

  $title_sort = dlts_solr_remove_accents($title_sort);

  // Clean up things like &amp;.
  $title_sort = html_entity_decode($title_sort);

  // Strip out any url-encoded stuff.
  $title_sort = urldecode($title_sort);

  // Replace Multiple spaces with single space.
  $title_sort = preg_replace('/ +/', ' ', $title_sort);

  // To lower-case.
  $title_sort = strtolower($title_sort);

  // Sort fields.
  $document->addField('ss_longlabel', $title_sort);
  $document->addField('iass_longlabel', $title_sort);
  unset($document->content);
  $document->addField('content', implode($searchableFields, ' '));

}
