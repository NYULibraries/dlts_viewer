<?php

/**
 * @file
 * DLTS Viewer drush
 */

/**
 * @TODO: Support for fields: publication_date, geographic_coordinates, geographic_subject
 */
function save_dlts_map($node, $language = 'en') {

    // Get the current user
    // --user=uid OR --user=1 for super user
    global $user;

    $node_language = (isset($node['entity_language']) ? $node['entity_language'] : $language);

    /** force EN language */
    if ($node_language == LANGUAGE_NONE) {
        $node_language = 'en';
    }

    $map_exist = map_nid($node['identifier'], $node_language);

    if ($map_exist) {
        // Load the node by NID
        $entity = node_load($map_exist);

        // Wrap it with Entity API
        $ewrapper = entity_metadata_wrapper('node', $entity);
    }
    else {
        // entity_create replaces the procedural steps in the first example of
        // creating a new object $node and setting its 'type' and uid property
        $values = array(
            'type' => 'dlts_map',
            'uid' => $user->uid,
            'status' => 1,
            'comment' => 0,
            'promote' => 0,
        );
        if ($node_language == LANGUAGE_NONE) {
            $node_language = 'en';
        }
        if ($node_language != 'en') {
            // find if the English version of this map exist
            $tnid = map_nid($node['identifier'], 'en');
            if ($tnid) {
                // make sure the language exists
                $enabled_language = dlts_viewer_add_language($node_language);
                // if language does not exists, do not add the map
                if (!$enabled_language) return FALSE;
                // load the source
                $source_node = node_load($tnid);
                // wrap it with Entity API
                $source_node_ewrapper = entity_metadata_wrapper('node', $source_node);
                // set nid as tnid
                $source_node->tnid = $tnid;
                // save source
                $source_node_ewrapper->save();
                // not sure why this is needed
                $values['translate'] = 0;
                // set source nid as the tnid for the translation
                $values['tnid'] = $tnid;
                // English is the default language for the maps object
                $values['source'] = 'en';
            }
            // return as soon as possible
            else {
                drush_log('English version does not exist', 'error');
                return FALSE;
            }
        }
        $values['language'] = $node_language;
        $entity = entity_create('node', $values);
        // The entity is now created, but we have not yet simplified use of it.
        // Now create an entity_metadata_wrapper around the new node entity
        // to make getting and setting values easier
        $ewrapper = entity_metadata_wrapper('node', $entity);
    }
    $collections_nids = $subjects = array();
    if (!empty($node['entity_title'])) {
        $node['entity_title'] = trim($node['entity_title']);
        $substr_title = $node['entity_title'];
        if (strlen($substr_title) > 255) {
            //$substr_title = substr($node['entity_title'], 0, 200);
            $ewrapper->title->set('Title longer that 255 characters');
        }
        $ewrapper->title->set($substr_title);
    }
    else {
        $ewrapper->title->set('Untitled');
    }
    if (!empty($node['identifier'])) {
        $ewrapper->field_identifier->set($node['identifier']);
    }
    else {
        drush_log('Document without identifier', 'error');
        return;
    }
    // We do not translate all the values
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
                // create collection
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
            $ewrapper->field_handle->set(array('url' => $node['handle']));
        }
        if (!empty($node['binding_orientation'])) {
            $ewrapper->field_binding_orientation->set((int)$node['binding_orientation']);
        }
        if (!empty($node['scan_order'])) {
            $ewrapper->field_scan_order->set((int)$node['scan_order']);
        }
        if (!empty($node['page_count'])) {
            $ewrapper->field_page_count->set((int)$node['page_count']);
        }
        if (!empty($node['sequence_count'])) {
            $ewrapper->field_sequence_count->set((int)$node['sequence_count']);
        }
        if (!empty($node['read_order'])) {
            $ewrapper->field_read_order->set((int)$node['read_order']);
        }

        if (!empty($node['call_number'])) {
            $ewrapper->field_call_number->set($node['call_number']);
        }
        if (!empty($node['representative_image'])) {
            $label = (isset($node['representative_image']['label'])) ? $node['representative_image']['label'] : null;
            $serialize_data = serialize(
                array(
                    'label' => $label,
                    'uri' => $node['representative_image']['uri'],
                    'url' => file_create_url($node['representative_image']['uri']),
                    'image_style' => '0x230'
                )
            );
            $representative_image = array(
                'uri' => $node['representative_image']['uri'],
                'label' => $label,
                'data' => $serialize_data,
            );
            $ewrapper->field_representative_image->set($representative_image);
        }
        if (!empty($node['pdf_files'])) {
            foreach ($node['pdf_files'] as $pdf) {
                $label = (isset($pdf['label'])) ? $pdf['label'] : '';
                $serialize_data = serialize(array('label' => $label, 'uri' => $pdf['file'], 'url' => file_create_url($pdf['file'])));
                $field_pdf_file[] = array(
                    'uri' => $pdf['file'],
                    'label' => $label,
                    'data' => $serialize_data,
                );
            }
            $ewrapper->field_pdf_file->set($field_pdf_file);
        }
        if (!empty($node['subject'])) {
            $vid = dlts_viewer_subject_vocabulary_map_vid();
            $node_subjects = array();
            foreach ($node['subject'] as $subject) {
                if (!empty($subject)) {
                    $subject_list = dlts_viewer_subject_tid($subject,$vid);
                    $node_subjects[] = $subject_list[$subject];
                }
            }
            if (!empty($node_subjects)) {
                $ewrapper->field_subject->set($node_subjects);
            }
        }
    }
    // copy value from the source node
    else {
        if (isset($source_node_ewrapper)) {
            // $source_node
            // $source_node_ewrapper = entity_metadata_wrapper('node', $source_node);
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

            $field_call_number = $source_node_ewrapper->field_call_number->value();
            if (!empty($field_call_number)) {
                $ewrapper->field_call_number->set($field_call_number);
            }
            $field_representative_image = $source_node_ewrapper->field_representative_image->value();
            if (!empty($field_representative_image)) {
                $ewrapper->field_representative_image->set($field_representative_image);
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
    if (!empty($node['title_long'])) {
        $ewrapper->field_title->set($node['title_long']);
    }
    elseif(!empty($node['entity_title'])) {
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
        // we need to make sure the object looks like: 1879-01-01T00:00:00
        // YYYY-MM-DDT00:00:00
        // 1879-01-01T00:00:00
        $publication_date = trim($node['publication_date']);
        preg_match('/(^\d{4}-[0-3]{1}[0-9]{1}-[0-9]{2})/', $publication_date, $matches);
        if ($matches && $matches[0]) {
            $publication_date = $matches[0] . 'T00:00:00';
            $ewrapper->field_publication_date->set(array('value' => $publication_date));
        }
        else {
            $matches = null;
            preg_match('/(^\d{4}$)/', $publication_date, $matches);
            $m_value = $matches[0];
            if ($matches && $matches[0]) {
                $publication_date = $m_value . '-01-01T00:00:00';
                $ewrapper->field_publication_date->set(array('value' => $publication_date));
            }
        }
    }
    if (!empty($node['language']) && is_array($node['language'])) {
        $languages = array();
        foreach ($node['language'] as $language) {
            $languages[] = $language;
        }
        $ewrapper->field_language->set($languages);
    }
    if (!empty($node['language_code']) && is_array($node['language_code'])) {
        $language_codes = array();
        foreach ($node['language_code'] as $language_code) {
            $language_codes[] = $language_code;
        }
        $ewrapper->field_language_code->set($language_codes);
    }
    if (!empty($node['rights'])) {
        $ewrapper->field_rights->set($node['rights']);
    }
    if (!empty($node['physical_description'])) {
        $ewrapper->field_physical_description->set($node['physical_description']);
    }
    if (!empty($node['notes'])) {
        $ewrapper->field_notes_field->set($node['notes']);
    }
    $saved = $ewrapper->save();

    return $entity;

}

function create_dlts_map_from_json($maps, $cretePages = FALSE, $legacy = FALSE) {
    $out = array();
    if (!$legacy) $legacy = drush_get_option('legacy', FALSE);
    foreach ($maps as $value) {
        if (!file_exists($value->uri)) continue;
        $json_document = $value->uri;
        $json_filename = $value->filename;
        $dimensions =
        $physical_description =
        $number =
        $scanning_notes =
        $volume =
        $publication_date =
        $scan_date =
        $call_number =
        $description =
        $page_count =
        $subtitle =
        $title = null;
        $pages_array =
        $partners =
        $stitch_page_array =
        $multivols =
        $other_versions =
        $isbns =
        $authors =
        $languages =
        $collections =
        $contributors =
        $creators =
        $editors =
        $publishers =
        $pdf_files =
        $language_codes =
        $ocr_text_files =
        $subjects =
        $notes =
        $series = array();
        $json_string = file_get_contents($value->uri);
        $json_string = str_replace(array('\r', '\n'), '', $json_string);
        $data = json_decode($json_string);
        $entity_title = $data->entity_title;


        drush_log(dt('Importing @title from JSON document @document',array('@title'=>$entity_title, '@document'=>basename ($value->uri))), 'ok');

        $entity_language = $data->entity_language;

        $entity_identifier = $data->identifier;

        if (!isset($data->metadata)) {
            $metadata = (object) array();
        }
        else {
            $metadata = $data->metadata;
        }

        /** partners the map belong */
        if (isset($metadata->partner)) {
            foreach ($metadata->partner->value as $value) {
                $partners[] =  array(
                    'title' => $value->title,
                    'language' => $value->language,
                    'identifier' => $value->identifier,
                    'code' => $value->code,
                    'name' => $value->name,
                );
            }
        }
        /** collections the map belong */
        if (isset($metadata->collection)) {
            foreach ($metadata->collection->value as $value) {
                $collections[] =  array(
                    'title' => $value->title,
                    'language' => $value->language,
                    'identifier' => $value->identifier,
                    'code' => $value->code,
                    'name' => $value->name,
                    'partner' => $value->partner,
                );
            }
        }
        if (isset($metadata->title)) {
            $title = $metadata->title->value[0];
        }
        if (isset($metadata->subtitle) && !empty($metadata->subtitle->value)) {
            $subtitle = $metadata->subtitle->value[0];
        }
        if (isset($metadata->page_count) && !empty($metadata->page_count->value)) {
            $page_count = $metadata->page_count->value[0];
        }
        if (isset($metadata->sequence_count) && !empty($metadata->sequence_count->value)) {
            $sequence_count = $metadata->sequence_count->value[0];
        }
        if (isset($metadata->call_number) && !empty($metadata->call_number->value)) {
            $call_number = $metadata->call_number->value[0];
        }
        if (isset($metadata->description) && !empty($metadata->description->value)) {
            $description = $metadata->description->value[0];
        }
        if (isset($metadata->dimensions) && !empty($metadata->dimensions->value)) {
            $dimensions = $metadata->dimensions->value[0];
        }
        if (isset($metadata->handle) && !empty($metadata->handle->value)) {
            $handle = $metadata->handle->value[0];
        }
        $binding_orientation = 0;
        if (isset($metadata->binding_orientation) && !empty($metadata->binding_orientation->value)) {
            $binding_orientation_raw = $metadata->binding_orientation->value[0];
            if (is_numeric($binding_orientation_raw)) {
                $binding_orientation = $binding_orientation_raw;
            }
            else {
                if ($binding_orientation_raw == 'Right to left') {
                    $binding_orientation = 1;
                }
                else if ($binding_orientation_raw == 'Left to right') {
                    $binding_orientation = 0;
                }
            }
        }
        $read_order = 0;
        if (isset($metadata->read_order) && !empty($metadata->read_order->value)) {
            $read_order_raw = $metadata->read_order->value[0];
            if (is_numeric($read_order_raw)) {
                $read_order = $read_order_raw;
            }
            else {
                if ($read_order_raw == 'Right to left') {
                    $read_order = 1;
                }
                else if ($read_order_raw == 'Left to right') {
                    $read_order = 0;
                }
            }
        }
        $scan_order = 0;
        if (isset($metadata->scan_order) && !empty($metadata->scan_order->value)) {
            $scan_order_raw = $metadata->scan_order->value[0];
            if (is_numeric($scan_order_raw)) {
                $scan_order = $scan_order_raw;
            }
            else {
                if ($read_order_raw == 'Right to left') {
                    $scan_order = 1;
                }
                else if ($read_order_raw == 'Left to right') {
                    $scan_order = 0;
                }
            }
        }
        if (isset($metadata->scanning_notes) && !empty($metadata->scanning_notes->value)) {
            $scanning_notes = $metadata->scanning_notes->value[0];
        }
        if (isset($metadata->scan_date) && !empty($metadata->scan_date->value)) {
            $scan_date = $metadata->scan_date->value[0];
        }
        if (isset($metadata->rights) && !empty($metadata->rights->value)) {
            $rights = trim($metadata->rights->value[0]);
        }
        if (isset($metadata->volume) && !empty($metadata->volume->value)) {
            $volume = $metadata->volume->value[0];
        }
        if (isset($metadata->publication_location) && !empty($metadata->publication_location->value)) {
            $publication_location = $metadata->publication_location->value[0];
        }
        if (isset($metadata->publication_date) && !empty($metadata->publication_date->value)) {
            $publication_date = $metadata->publication_date->value[0];
        }
        if (isset($metadata->publication_date_text) && !empty($metadata->publication_date_text->value)) {
            $publication_date_text = $metadata->publication_date_text->value[0];
        }
        if (isset($metadata->physical_description) && !empty($metadata->physical_description->value)) {
            $physical_description = $metadata->physical_description->value[0];

        }
        if (isset($metadata->representative_image) && !empty($metadata->representative_image)) {
            if (!$legacy) {
                $representative_image = array(
                    'uri' => $metadata->representative_image->cm->uri,
                    'timestamp' => $metadata->representative_image->cm->timestamp,
                );
            }
            else {
                if (isset($metadata->representative_image->value)) {
                    $timestamp = (isset($metadata->representative_image->value->timestamp) ? $metadata->representative_image->value->timestamp : time());
                    $uri = $metadata->representative_image->value->fileserver;
                    $representative_image = array(
                        'uri' => $uri,
                        'timestamp' => $timestamp,
                    );
                }
            }
        }
        if (isset($metadata->other_version)) {
            foreach ($metadata->other_version->value as $other_version) {
                $other_versions[] = $other_version;
            }
        }
        if (isset($metadata->isbn)) {
            foreach ($metadata->isbn->value as $isbn) {
                $isbns[] = $isbn;
            }
        }
        if (isset($metadata->language)) {
            foreach ($metadata->language->value as $language) {
                $languages[] = $language;
            }
        }
        if (isset($metadata->language_code)) {
            foreach ($metadata->language_code->value as $language_code) {
                $language_codes[] = $language_code;
            }
        }
        if (isset($metadata->topic)) {
            foreach ($metadata->topic->value as $topic) {
                $topics[] = $topic;
            }
        }
        if (isset($metadata->author)) {
            foreach ($metadata->author->value as $author) {
                $authors[] = $author;
            }
        }
        if (isset($metadata->creator)) {
            foreach ($metadata->creator->value as $creator) {
                $creators[] = $creator;
            }
        }
        if (isset($metadata->contributor)) {
            foreach ($metadata->contributor->value as $contributor) {
                $contributors[] = $contributor;
            }
        }
        if (isset($metadata->editor)) {
            foreach ($metadata->editor->value as $editor) {
                $editors[] = $editor;
            }
        }
        if (isset($metadata->publisher)) {
            foreach ($metadata->publisher->value as $publisher) {
                $publishers[] = $publisher;
            }
        }
        if (isset($metadata->subject) && !empty($metadata->subject->value)) {
            foreach ($metadata->subject->value as $subject) {
                $subjects[] = $subject;
            }
        }
        if (isset($metadata->notes_field) && !empty($metadata->notes_field->value)) {
            foreach ($metadata->notes_field->value as $note) {
                $notes[] = $note;
            }
        }
        if (isset($metadata->pdf_file)) {
            // deals with JSON new documents
            if (!$legacy) {
                $valid_extensions = array('pdf');
                foreach ($metadata->pdf_file->value as $pdf_file) {
                    $pathinfo = pathinfo($pdf_file);
                    $basename = str_replace('fileserver://', '', $pathinfo['basename']);
                    $ext = pathinfo($pdf_file, PATHINFO_EXTENSION);
                    // check if we have a fileserver scheme
                    if (strpos($pdf_file, 'fileserver://') === false) continue;
                    // check that the URI is not bigger than the allowed MySQL size for varchar with index
                    if (strlen($pdf_file) > 255) continue;
                    // check that the URI contain a file extension
                    if (!$ext) continue;
                    // do we have a valid extension
                    if (!in_array($ext,$valid_extensions)) continue;
                    if (strpos($pdf_file, '_hi')) {
                        $pdf_files[] = array('file' => $pdf_file, 'label' => 'High-resolution');
                    }
                    elseif (strpos($pdf_file, '_lo')) {
                        $pdf_files[] = array('file' => $pdf_file, 'label' => 'Low-resolution');
                    }
                    else {
                        $pdf_files[] = array('file' => $pdf_file);
                    }
                }
            }
            else {
                foreach ($metadata->pdf_file->value as $pdf_file) {
                    $pdf_uri = $pdf_file->fileserver;
                    // check that the URI is not bigger than the allowed MySQL size for varchar with index
                    if (strlen($pdf_uri) > 255) continue;
                    if (strpos($pdf_uri, '_hi')) {
                        $pdf_files[] = array('file' => $pdf_uri, 'label' => 'High-resolution');
                    }
                    elseif (strpos($pdf_uri, '_lo')) {
                        $pdf_files[] = array('file' => $pdf_uri, 'label' => 'Low-resolution');
                    }
                    else {
                        $pdf_files[] = array('file' => $pdf_uri);
                    }
                }
            }
        }
        $node = array(
            'entity_title' => $entity_title,
            'entity_language' => $entity_language,
            'identifier' => $entity_identifier,
            'partners' => $partners,
            'collections' => $collections,
            'title' => $title,
            'subtitle' => $subtitle,
            'page_count' => $page_count,
            'sequence_count' => $sequence_count,
            'binding_orientation' => $binding_orientation,
            'call_number' => $call_number,
            'volume' => $volume,
            'description' => $description,
            'dimensions' => $dimensions,
            'handle' => $handle,
            'language_code' => $language_codes,
            'language' => $languages,
            'number' => $number,
            'read_order' => $read_order,
            'scan_order' => $scan_order,
            'scanning_notes' => $scanning_notes,
            'publication_date' => $publication_date,
            'publication_date_text' => $publication_date_text,
            'publication_location' => $publication_location,
            'scan_date' => $scan_date,
            'representative_image' => $representative_image,
            'ocr_text' => $ocr_text_files,
            'other_version' => $other_versions,
            'rights' => $rights,
            'isbn' => $isbns,
            'author' => $authors,
            'creator' => $creators,
            'contributor' => $contributors,
            'editor' => $editors,
            'publisher' => $publishers,
            'subject' => $subjects,
            'pdf_files' => $pdf_files,
            'notes'=> $notes,
            'physical_description'=> $physical_description
        );

        $created = save_dlts_map($node);

        $filesdir = drupal_realpath('public://') . '/json/' . $json_filename;

        //$record = db_query("SELECT identifier from {dlts_viewer_books_json} WHERE identifier = :identifier LIMIT 1", array(":identifier" => $entity_identifier))->fetchField();

        $dir = drupal_realpath('public://') . '/json';

        //$isdirready = file_prepare_directory($dir, 775);

        $document = file_unmanaged_save_data($json_string, $filesdir);

        if ($created) {
            db_insert('dlts_viewer_books_json')->fields(array(
                    'nid' => $created->nid,
                    'hash' => $created->changed,
                    'identifier' => $entity_identifier,
                    'document'=> $document,
                    'language' => $created->language,
                    'proceed' => 1,
                    'created' => $created->created,
                    'changed' => $created->changed,
                )
            )->execute();
        }

        $out[] = $created;
    }
    return $out;
}

function dlts_viewer_subject_map_tid($subject,$vid) {
    $global_subjects = &drupal_static('global_subjects');
    if (empty($global_subjects)) {
        $global_subjects = array();
    }
    if (!empty($subject)) {
        $this_subject = trim(preg_replace('/\s\s+/', ' ', str_replace("\n", " ", $subject)));
        if (!array_key_exists($this_subject, $global_subjects)) {
            $term = taxonomy_get_term_by_name($this_subject);
            if ($term) {
                $this_term = array_pop($term);
                $tid = $this_term->tid;
            }
            else {
                $tid = create_taxonomy_term($this_subject, $vid);
            }
            $global_subjects[$this_subject] = $tid;
        }
    }
    return $global_subjects;
}

function dlts_viewer_subject_vocabulary_map_vid() {
    $global_vocabulary_vid = &drupal_static('global_vocabulary_vid');
    if (empty($global_vocabulary_vid)) {
        $global_vocabulary_vid = taxonomy_vocabulary_machine_name_load('subjects')->vid;
    }
    return $global_vocabulary_vid;
}
