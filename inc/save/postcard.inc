<?php

/**
 * @file
 * Save callbacks.
 */

/**
 * Save Postcard.
 */
function save_dlts_postcard($node, $language = 'en') {
  module_load_include('inc', 'node', 'node.pages');
  module_load_include('inc', 'dlts_viewer', 'inc/common');
  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_partner');
  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_collection');
  module_load_include('inc', 'dlts_viewer', 'inc/create/taxonomy');
  // Get the current user.
  $resource_type = 'dlts_postcard';
  global $base_url;
  global $user;
  $username = $user->name;
  $is_new = TRUE;
  try {
    if (!user_access('dlts create object')) {
      throw new Exception(__FUNCTION__ . " user not allowed to run task $username");
    }
    if (empty($node['identifier'])) {
      throw new Exception('Document without identifier');
    }
    $identifier = trim($node['identifier']);
    if (!empty($node['title'])) {
      $entity_title = trim($node['title']);
      if (strlen($entity_title) > 255) {
        $entity_title = $identifier;
      }
    }
    else {
      throw new Exception("Title for $identifier can not be empty.");
    }
    $collections_nids = array();
    $node_language = (isset($node['entity_language']) ? $node['entity_language'] : $language);
    // Make sure the language exists.
    $enabled_language = dlts_viewer_add_language($node_language);
    // If language does not exists, do not add the book.
    if (!$enabled_language) {
      throw new Exception("Fail to run the script, language $language does not exists .");
    }
    // Force EN language.
    if ($node_language === LANGUAGE_NONE) {
      $node_language = 'en';
    }
    $exist = nid_by_identifier($identifier, $node_language);
    if ($exist) {
      $is_new = FALSE;
      // Load the node by NID.
      $entity = node_load($exist);
      // Wrap it with Entity API.
      $ewrapper = entity_metadata_wrapper('node', $entity);
      // Check if this is a translation.
      if ($node_language != 'en') {
        // Find if the English version.
        $tnid = nid_by_identifier($identifier, 'en');
        if ($tnid) {
          // Load the source.
          $source_node = node_load($tnid);
          // Wrap it with Entity API.
          $source_node_ewrapper = entity_metadata_wrapper('node', $source_node);
        } else {
          throw new Exception("English version $identifier does not exist.");
        }
      }
    } else {
      $new_node = new stdClass();
      $new_node->type = $resource_type;
      $new_node->is_new = TRUE;
      node_object_prepare($new_node);
      $new_node->language = $node_language;
      $new_node->status = 1;
      $new_node->comment = 0;
      $new_node->promote = 0;
      $new_node->title = $entity_title;
      node_save($new_node);
      if ($node_language != 'en') {
        // Find if the English version of this book exist.
        $tnid = book_nid($identifier, 'en');
        if ($tnid) {
          // Load the source.
          $source_node = node_load($tnid);
          // Wrap it with Entity API.
          $source_node_ewrapper = entity_metadata_wrapper('node', $source_node);
          // Set nid as tnid.
          $source_node->tnid = $tnid;
          node_save($source_node);
          // Not sure why this is needed.
          $new_node->translate = 0;
          // Set source nid as the tnid for the translation.
          $new_node->tnid = $tnid;
          // English is the default language for the object.
          $new_node->source = 'en';
        } else {
          throw new Exception("English version $identifier does not exist.");
        }
      }
      // Load the new node.
      $entity = node_load($new_node->nid);
      // Unset the node source.
      unset($new_node);
      $ewrapper = entity_metadata_wrapper('node', $entity);
    }

    $ewrapper->title->set($entity_title);

    $ewrapper->field_identifier->set($identifier);

    // We do not translalete all the values.
    if ($node_language == 'en') {
      if (!empty($node['partners']) && is_array($node['partners']) && count($node['partners']) > 0) {
        foreach ($node['partners'] as $partner) {
          $partner_entity = NULL;
          $nid = partner_nid($partner['identifier']);
          if (!$nid) {
            $partner_entity = create_dlts_partner($partner);
            if ($partner_entity) {
              $nid = $partner_entity->nid;
            }
          }
          if ($nid) {
            $partners_nids[] = $nid;
          }
        }
      }
      if (!empty($node['collections']) && is_array($node['collections']) && count($node['collections']) > 0) {
        foreach ($node['collections'] as $collection) {
          $collection_entity = NULL;
          $nid = collection_nid($collection['identifier']);
          // Create collection.
          if (!$nid) {
            $collection_entity = create_dlts_collection($collection);
            if ($collection_entity) {
              $nid = $collection_entity->nid;
            }
          }
          if ($nid) {
            $collections_nids[] = $nid;
          }
        }
      }

      if (!empty($partners_nids)) {
        $ewrapper->field_partner->set($partners_nids);
      }

      if (!empty($collections_nids)) {
        $ewrapper->field_collection->set($collections_nids);
      }

      if (!empty($node['handle'])) {
        $ewrapper->field_handle->set([ 'url' => $node['handle'] ]);
      }

      if (!empty($node['binding_orientation'])) {
        $ewrapper->field_binding_orientation->set($node['binding_orientation'][0]);
      }

      if (!empty($node['scan_order'])) {
        $ewrapper->field_scan_order->set($node['scan_order'][0]);
      }

      if (!empty($node['page_count'])) {
        $ewrapper->field_page_count->set((int) $node['page_count']);
      }

      if (!empty($node['sequence_count'])) {
        $ewrapper->field_sequence_count->set((int) $node['sequence_count']);
      }

      if (!empty($node['read_order'])) {
        $ewrapper->field_read_order->set($node['read_order'][0]);
      }

      if (!empty($node['number'])) {
        $ewrapper->field_number->set($node['number']);
      }

      if (!empty($node['volume'])) {
        $ewrapper->field_volume->set($node['volume']);
      }

      if (!empty($node['call_number'][0])) {
        $ewrapper->field_call_number->set($node['call_number'][0]);
      }

      $field_pdf_file = [];
      if (!empty($node['pdf_files'])) {
        foreach ($node['pdf_files'] as $pdf) {
          $label = (isset($pdf['label'])) ? $pdf['label'] : '';
          $field_pdf_file[] = [
            'uri' => $pdf['uri'],
            'label' => $label,
            'data' => serialize(
              [
                'label' => $label,
                'uri' => $pdf['uri'],
                'filesize' => $pdf['filesize'],
                'searchable' => (isset($pdf['searchable']) && $pdf['searchable']) ? $pdf['searchable'] : FALSE,
              ]
            ),
          ];
          unset($label);
        }
        $ewrapper->field_pdf_file->set($field_pdf_file);
      }
      unset($field_pdf_file);
      if (!empty($node['subject'])) {
        $vid = dlts_viewer_subject_vocabulary_vid();
        $node_subjects = [];
        foreach ($node['subject'] as $subject) {
          if (!empty($subject)) {
            $subject_list = dlts_viewer_subject_tid($subject, $vid);
            $node_subjects[] = $subject_list[$subject];
          }
        }
        if (!empty($node_subjects)) {
          $ewrapper->field_subject->set($node_subjects);
        }
      }
    } else {
      // Copy value from the source node.
      if ($source_node_ewrapper) {
        $field_partner = $source_node_ewrapper->field_partner->value();
        if (!empty($field_partner)) {
          $ewrapper->field_partner->set($field_partner);
        }
        $field_collection = $source_node_ewrapper->field_collection->value();
        if (!empty($field_collection)) {
          $ewrapper->field_collection->set($field_collection);
        }
        $field_handle = $source_node_ewrapper->field_handle->value();
        if (!empty($field_handle)) {
          $ewrapper->field_handle->set($field_handle);
        }
        $field_binding_orientation = $source_node_ewrapper->field_binding_orientation->value();
        if (!empty($field_binding_orientation)) {
          $ewrapper->field_binding_orientation->set($field_binding_orientation);
        }
        $field_scan_order = $source_node_ewrapper->field_scan_order->value();
        if (!empty($field_scan_order)) {
          $ewrapper->field_scan_order->set($field_scan_order);
        }
        $field_page_count = $source_node_ewrapper->field_page_count->value();
        if (!empty($field_page_count)) {
          $ewrapper->field_page_count->set($field_page_count);
        }
        $field_sequence_count = $source_node_ewrapper->field_sequence_count->value();
        if (!empty($field_sequence_count)) {
          $ewrapper->field_sequence_count->set($field_sequence_count);
        }
        $field_read_order = $source_node_ewrapper->field_read_order->value();
        if (!empty($field_read_order)) {
          $ewrapper->field_read_order->set($field_read_order);
        }
        $field_number = $source_node_ewrapper->field_number->value();
        if (!empty($field_number)) {
          $ewrapper->field_number->set($field_number);
        }
        $field_volume = $source_node_ewrapper->field_volume->value();
        if (!empty($field_volume)) {
          $ewrapper->field_volume->set($field_volume);
        }
        $field_call_number = $source_node_ewrapper->field_call_number->value();
        if (!empty($field_call_number)) {
          $ewrapper->field_call_number->set($field_call_number);
        }
        $field_pdf_file = $source_node_ewrapper->field_pdf_file->value();
        if (!empty($field_pdf_file)) {
          $ewrapper->field_pdf_file->set($field_pdf_file);
        }
        $field_subject = $source_node_ewrapper->field_subject->value();
        if (!empty($field_subject)) {
          $ewrapper->field_subject->set($field_subject);
        }
      }
    }
    if (!empty($node['isbn'])) {
      $ewrapper->field_isbn->set($node['isbn']);
    }
    if (!empty($node['title'])) {
      $ewrapper->field_title->set($node['title']);
    }
    elseif (!empty($node['entity_title'])) {
      $ewrapper->field_title->set($node['entity_title']);
    }
    if (!empty($node['subtitle'])) {
      $ewrapper->field_subtitle->set($node['subtitle']);
    }
    if (!empty($node['description'])) {
      $ewrapper->field_description->set($node['description']);
    }
    if (!empty($node['editor'])) {
      $ewrapper->field_editor->set($node['editor']);
    }
    if (!empty($node['creator'])) {
      $ewrapper->field_creator->set($node['creator']);
    }
    if (!empty($node['author'])) {
      $ewrapper->field_author->set($node['author']);
    }
    if (!empty($node['topic'])) {
      $ewrapper->field_topic->set($node['topic']);
    }
    if (!empty($node['publisher'])) {
      $ewrapper->field_publisher->set($node['publisher']);
    }
    if (!empty($node['contributor'])) {
      $ewrapper->field_contributor->set($node['contributor']);
    }
    if (!empty($node['dimensions'])) {
      $ewrapper->field_dimensions->set($node['dimensions']);
    }
    if (!empty($node['volume'])) {
      $ewrapper->field_volume->set($node['volume']);
    }
    if (!empty($node['other_version'])) {
      $ewrapper->field_other_version->set($node['other_version']);
    }
    if (!empty($node['publication_location'])) {
      $ewrapper->field_publication_location->set($node['publication_location']);
    }
    if (!empty($node['publisher'])) {
      $ewrapper->field_publisher->set($node['publisher']);
    }
    if (!empty($node['publication_date_text'])) {
      $ewrapper->field_publication_date_text->set($node['publication_date_text']);
    }
    if (!empty($node['publication_date'])) {
      /*
       * we need to make sure the object looks like:
       * 1879-01-01T00:00:00
       * YYYY-MM-DDT00:00:00
       * 1879-01-01T00:00:01T00
       */
      $publication_date = trim($node['publication_date']);
      preg_match('/(^\d{4}-[0-3]{1}[0-9]{1}-[0-9]{2})/', $publication_date, $matches);
      if ($matches && $matches[0]) {
        $publication_date = $matches[0] . 'T00:00:00';
        $ewrapper->field_publication_date->set([ 'value' => $publication_date ]);
      } else {
        $matches = NULL;
        preg_match('/(^\d{4}$)/', $publication_date, $matches);
        $m_value = $matches[0];
        if ($matches && $matches[0]) {
          $publication_date = $m_value . '-01-01T00:00:00';
          $ewrapper->field_publication_date->set([ 'value' => $publication_date ]);
        }
      }
    }
    if (!empty($node['language']) && is_array($node['language'])) {
      $languages = [];
      foreach ($node['language'] as $language) {
        $languages[] = $language;
      }
      $ewrapper->field_language->set($languages);
    }
    if (!empty($node['language_code']) && is_array($node['language_code'])) {
      $language_codes = [];
      foreach ($node['language_code'] as $language_code) {
        $language_codes[] = $language_code;
      }
      $ewrapper->field_language_code->set($language_codes);
    }
    if (!empty($node['rights'])) {
      $ewrapper->field_rights->set($node['rights']);
    }
    $saved = $ewrapper->save();
    if ($saved) {
      return $entity;
    } else {
      throw new Exception("Fail to import $identifier.");
    }
  } catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), [], WATCHDOG_CRITICAL);
    return [
      'error' => $e->getMessage(),
    ];
  }
}
