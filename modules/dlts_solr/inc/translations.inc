<?php

/**
 * @file
 * Solr translations.
 */

/**
 * Index translations.
 */
function dlts_solr_index_book_translations(&$document, &$entity, $entity_type, $env_id, &$searchableFields) {
  $source_wrapper = entity_metadata_wrapper('node', $entity);
  $identifier = $source_wrapper->field_identifier->value();
  $translations = dlts_viewer_get_translations_nid_by_identifier($identifier);
  unset($source_wrapper);
  if (count($translations) > 1) {
    if (($key = array_search($entity->nid, $translations)) !== FALSE) {
      unset($translations[$key]);
    }
    foreach ($translations as $nid) {
      $subjects = [];
      // Load node.
      $node = node_load($nid);
      $language = $node->language;
      $prefix = '_' . $language;
      // Wrapp entity with Entity API wrapper.
      $wrapper = entity_metadata_wrapper('node', $node);
      // Title (field_title).
      $title_long = $wrapper->field_title->value();
      if (!empty($title_long)) {
        if (isset($entity->solr_multivolume)) {
          $multivolume = $entity->solr_multivolume;
          $volume = '';
          // Volume_number_str can be empty, if so, try volume_number.
          if (isset($multivolume['volume_number_str']) && !empty($multivolume['volume_number_str'])) {
            $volume = $multivolume['volume_number_str'];
          }
          elseif (isset($multivolume['volume_number']) && !empty($multivolume['volume_number'])) {
            $volume = t('Vol.') . ' ' . $multivolume['volume_number'];
          }
          $title_long = $title_long . ' ' . $volume;
        }
        $title_long = trim($title_long);
        /*
         * Added temporarily to accomodate search
         * options should be removed later-@ekate.
         */
        $document->addField('ss' . $prefix . '_title', $title_long);
        $document->addField('ss' . $prefix . '_title_long', $title_long);
        $document->addField('iass' . $prefix . '_longlabel', $title_long);
        $searchableFields[] = $title_long;
      }
      unset($title_long);
      dlts_solr_index_collection($wrapper->field_collection->value(), $document, $node, $searchableFields);
      dlts_solr_index_partners($wrapper->field_partner->value(), $document, $node, $searchableFields);
      // Author (field_author).
      $authors = $wrapper->field_author->value();
      if (!empty($authors)) {
        foreach ($authors as $index => $author) {
          $searchableFields[] = $author;
          if ($index == 0) {
            $document->addField('ss' . $prefix . '_sauthor', dlts_solr_remove_accents(strtolower($author)));
            $document->addField('iass' . $prefix . '_author', strtolower(dlts_solr_remove_accents($author)));
          }
          $document->addField('sm' . $prefix . '_author', $author);
        }
      }
      unset($authors);
      unset($author);
      // Creator (field_creator).
      $creators = $wrapper->field_creator->value();
      if (!empty($creators)) {
        foreach ($creators as $creator) {
          $document->addField('sm' . $prefix . '_creator', $creator);
          $searchableFields[] = $creator;
        }
      }
      unset($creators);
      unset($creator);
      // Editor (field_editor).
      $editors = $wrapper->field_editor->value();
      if (!empty($editors)) {
        foreach ($editors as $editor) {
          $document->addField('sm' . $prefix . '_editor', $editor);
          $searchableFields[] = $editor;
        }
      }
      unset($editors);
      unset($editor);
      // Contributor (field_contributor).
      $contributors = $wrapper->field_contributor->value();
      if (!empty($contributors)) {
        foreach ($contributors as $contributor) {
          $document->addField('sm' . $prefix . '_contributor', $contributor);
          $searchableFields[] = $contributor;
        }
      }
      unset($editors);
      unset($editor);
      // Publisher (field_publisher).
      $publishers = $wrapper->field_publisher->value();
      if (!empty($publishers)) {
        foreach ($publishers as $publisher) {
          $document->addField('sm' . $prefix . '_publisher', $publisher);
          $document->addField('sm' . $prefix . '_spublisher', strtolower(dlts_solr_remove_special_cahrs($publisher)));
          $searchableFields[] = $publisher;
        }
      }
      unset($publishers);
      unset($publisher);
      // Publication location (field_publication_location).
      $publication_location = $wrapper->field_publication_location->value();
      if (!empty($publication_location)) {
        $searchableFields[] = $publication_location;
        $document->addField('ss' . $prefix . '_publication_location', $publication_location);
        /*
         * add temporarily to accomodate current search options
         * will remove later- @ekate
         */
        $document->addField('ss' . $prefix . '_publocation', $publication_location);
      }
      unset($publication_location);
      // Topic (field_topic).
      $topics = $wrapper->field_topic->value();
      if (!empty($topics)) {
        foreach ($topics as $topic) {
          $searchableFields[] = $topic;
          $document->addField('sm' . $prefix . '_topic', $topic);
          $document->addField('tkm' . $prefix . '_topic', $topic);
          $document->addField('tumar_topic', $topic);
        }
      }
      unset($topics);
      unset($topic);
    }
  }
}
