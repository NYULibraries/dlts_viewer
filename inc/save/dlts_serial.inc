<?php

/**
 * @file
 * API callbacks.
 */

/**
 * Create or update a DLTS Serial node from a prepared node array.
 *
 * @param array $node
 *   Prepared node data array from create_dlts_serial_from_json().
 * @param string $language
 *   Default language code if not specified in $node. Defaults to 'en'.
 *
 * @return object|array
 *   The saved entity object, or an array with an 'error' key on failure.
 *
 * @todo Support for fields: publication_date, geographic_coordinates, geographic_subject
 */
function save_dlts_serial($node, $language = 'en') {

  module_load_include('inc', 'node', 'node.pages');
  module_load_include('inc', 'dlts_viewer', 'inc/common');
  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_partner');
  module_load_include('inc', 'dlts_viewer', 'inc/create/dlts_collection');
  module_load_include('inc', 'dlts_viewer', 'inc/create/taxonomy');

  global $user;

  try {

    // Permission check. Note: also checked upstream in create_dlts_serial_from_json(),
    // but kept here so save_dlts_serial() is safe to call independently.
    if (!user_access('dlts create object')) {
      throw new Exception(__FUNCTION__ . " user not allowed to run task {$user->name}.");
    }

    if (empty($node['identifier'])) {
      throw new Exception('Document without identifier.');
    }

    $identifier = trim($node['identifier']);

    if (!empty($node['title'])) {
      $entity_title = trim($node['title']);
      if (strlen($entity_title) > 255) {
        $entity_title = $identifier;
      }
    } else {
      throw new Exception("Title for resource $identifier can not be empty.");
    }

    $node_language = !empty($node['language']) ? $node['language'] : $language;

    // Make sure the language exists.
    $enabled_language = dlts_viewer_add_language($node_language);
    if (!$enabled_language) {
      throw new Exception("Fail to run the script, language $node_language does not exist.");
    }

    // Force EN language if language is set to LANGUAGE_NONE.
    if ($node_language === LANGUAGE_NONE) {
      $node_language = 'en';
    }

    $serial_exist = serial_nid($identifier, $node_language);

    if ($serial_exist) {
      $entity  = node_load($serial_exist);
      $ewrapper = entity_metadata_wrapper('node', $entity);
      if ($node_language !== 'en') {
        $tnid = serial_nid($identifier, 'en');
        if ($tnid) {
          $source_node = node_load($tnid);
          $source_node_ewrapper = entity_metadata_wrapper('node', $source_node);
        } else {
          throw new Exception("English version of resource $identifier does not exist.");
        }
      }
    } else {
      $new_node = new stdClass();
      $new_node->type = 'dlts_serial';
      $new_node->is_new = TRUE;
      node_object_prepare($new_node);
      $new_node->language = $node_language;
      $new_node->status   = 1;
      $new_node->comment  = 0;
      $new_node->promote  = 0;
      $new_node->title    = $entity_title;
      node_save($new_node);

      if ($node_language !== 'en') {
        $tnid = serial_nid($identifier, 'en');
        if ($tnid) {
          $source_node = node_load($tnid);
          $source_node_ewrapper = entity_metadata_wrapper('node', $source_node);
          $source_node->tnid = $tnid;
          node_save($source_node);
          $new_node->translate = 0;
          $new_node->tnid = $tnid;
          $new_node->source = 'en';
        } else {
          throw new Exception("English version $identifier does not exist.");
        }
      }

      $entity = node_load($new_node->nid);
      unset($new_node);
      $ewrapper = entity_metadata_wrapper('node', $entity);
    }

    $ewrapper->title->set($entity_title);

    $ewrapper->field_identifier->set($identifier);

    if ($node_language === 'en') {
      // Partners
      $partners_nids = [];
      if (!empty($node['partners']) && is_array($node['partners'])) {
        foreach ($node['partners'] as $partner) {
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

      // Collections
      $collections_nids = [];
      if (!empty($node['collections']) && is_array($node['collections'])) {
        foreach ($node['collections'] as $collection) {
          $nid = collection_nid($collection['identifier']);
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
        $ewrapper->field_handle->set(['url' => $node['handle']]);
      }

      if (isset($node['binding_orientation'])) {
        $ewrapper->field_binding_orientation->set((int)$node['binding_orientation']);
      }

      if (isset($node['scan_order'])) {
        $ewrapper->field_scan_order->set((int)$node['scan_order']);
      }

      if (isset($node['read_order'])) {
        $ewrapper->field_read_order->set((int) $node['read_order']);
      }

      if (!empty($node['page_count'])) {
        $ewrapper->field_page_count->set((int) $node['page_count']);
      }

      if (!empty($node['sequence_count'])) {
        $ewrapper->field_sequence_count->set((int) $node['sequence_count']);
      }

      if (!empty($node['number'])) {
        $ewrapper->field_number->set($node['number']);
      }

      if (!empty($node['volume'])) {
        $ewrapper->field_volume->set($node['volume']);
      }

      if (!empty($node['representative_image'])) {
        $ewrapper->field_representative_image->set([
          'uri' => $node['representative_image']->cm->uri,
          'label' => "{$entity_title} - Representative image",
          'data' => serialize([]),
        ]);
      }

      if (!empty($node['pdf_files'])) {
        $field_pdf_file = [];
        foreach ($node['pdf_files'] as $pdf) {
          $label = $pdf['label'] ?? '';
          $field_pdf_file[] = [
            'uri'   => $pdf['uri'],
            'label' => $label,
            'data'  => serialize([
              'label' => $label,
              'uri' => $pdf['uri'],
              'filesize' => $pdf['filesize'],
              'searchable' => !empty($pdf['searchable']) ? $pdf['searchable'] : FALSE,
            ]),
          ];
        }
        $ewrapper->field_pdf_file->set($field_pdf_file);
      }

      if (!empty($node['subject'])) {
        $vid = dlts_viewer_subject_vocabulary_vid();
        $node_subjects = [];
        foreach ($node['subject'] as $subject) {
          if (!empty($subject)) {
            $subject_list  = dlts_viewer_subject_tid($subject, $vid);
            $node_subjects[] = $subject_list[$subject];
          }
        }
        if (!empty($node_subjects)) {
          $ewrapper->field_subject->set($node_subjects);
        }
      }

    } else {

      // For translations, copy English field values from the source node.
      if (!empty($source_node_ewrapper)) {
        $fields_to_copy = [
          'field_partner', 'field_collection', 'field_handle',
          'field_binding_orientation', 'field_scan_order', 'field_page_count',
          'field_sequence_count', 'field_read_order', 'field_number',
          'field_volume', 'field_representative_image',
          'field_pdf_file', 'field_subject',
        ];
        foreach ($fields_to_copy as $field_name) {
          $value = $source_node_ewrapper->{$field_name}->value();
          if (!empty($value)) {
            $ewrapper->{$field_name}->set($value);
          }
        }
      }

    }

    // Fields set regardless of language.
    if (!empty($node['isbn'])) {
      $ewrapper->field_isbn->set($node['isbn']);
    }

    if (!empty($node['title'])) {
      $ewrapper->field_title->set($node['title']);
    }

    if (!empty($node['subtitle'])) {
      $ewrapper->field_subtitle->set($node['subtitle']);
    }

    if (!empty($node['description'])) {
      $ewrapper->field_description->set(implode('; ', $node['description']));
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

    if (!empty($node['other_version'])) {
      $ewrapper->field_other_version->set($node['other_version']);
    }

    if (!empty($node['publication_location'])) {
      $ewrapper->field_publication_location->set($node['publication_location']);
    }

    if (!empty($node['publication_date_text'])) {
      $ewrapper->field_publication_date_text->set($node['publication_date_text']);
    }

    if (!empty($node['scanning_notes'])) {
      $scanning_notes_paragraphs = array_map(function($line) {
        return trim($line);
      }, $node['scanning_notes']);

      $scanning_notes_paragraphs = implode("\n", $scanning_notes_paragraphs);

      $ewrapper->field_scanning_notes->set($scanning_notes_paragraphs);
    }

    if (!empty($node['publication_date'])) {
      $raw_date = trim($node['publication_date']);
      $date_obj = false;

      // 1. Try common Month/Year or Month-Year formats explicitly
      $formats = ['m/Y', 'n/Y', 'M Y', 'F Y', 'm-Y'];
      foreach ($formats as $format) {
        $date_obj = DateTime::createFromFormat($format, $raw_date);
        if ($date_obj) {
            // Set time to midnight and day to the 1st
            $date_obj->setTime(0, 0, 0);
            $date_obj->setDate($date_obj->format('Y'), $date_obj->format('m'), 1);
            break;
        }
      }

      if (!$date_obj) {
        $timestamp = strtotime($raw_date);
        if ($timestamp) {
            $date_obj = new DateTime();
            $date_obj->setTimestamp($timestamp);
        }
      }

      // 3. Final Check & Save
      if ($date_obj) {
        $formatted = $date_obj->format('Y-m-d\T00:00:00');
        $ewrapper->field_publication_date->set(['value' => $formatted]);
      } else {
        watchdog('date_import', 'Failed to parse: @date', array('@date' => $raw_date), WATCHDOG_WARNING);
      }
    }

    if (!empty($node['language_string']) && is_array($node['language_string'])) {
      $ewrapper->field_language->set($node['language_string']);
    }

    if (!empty($node['language_code']) && is_array($node['language_code'])) {
      $ewrapper->field_language_code->set($node['language_code']);
    }

    if (!empty($node['rights'])) {
      $ewrapper->field_rights->set($node['rights']);
    }

    $saved = $ewrapper->save();

    if (!$saved) {
      throw new Exception("Fail to import $identifier.");
    }

    $nid = $ewrapper->getIdentifier();

    if ($node_language === 'en') {
      $exists = db_query(
        "SELECT nid FROM dlts_viewer_resource WHERE nid = :nid",
        [':nid' => $nid]
      )->fetchAll();

      if (empty($exists)) {
        db_query(
          "INSERT INTO dlts_viewer_resource (nid, noid, identifier, document, proceed) VALUES (:nid, :noid, :identifier, 'serials', '0')",
          [':nid' => $nid, ':noid' => $node['noid'], ':identifier' => $identifier]
        );
      }

    }

  } catch (Exception $e) {
    watchdog('dlts_viewer', $e->getMessage(), [], WATCHDOG_CRITICAL);
    return ['error' => $e->getMessage()];
  }

  return $entity;
}

function formatToMonthYear($dateString) {
    // strtotime() handles "04/1975", "April 1975", "2026-02-15", etc.
    $timestamp = strtotime($dateString);

    if (!$timestamp) {
        return "Invalid Date";
    }

    return date("m/Y", $timestamp);
}