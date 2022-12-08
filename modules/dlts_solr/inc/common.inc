<?php

/**
 * @file
 * Solr common.
 */

/**
 * Index collection.
 */
 function dlts_solr_index_collection($collections, &$document, &$entity, &$searchableFields) {
  $language = $entity->language;
  $prefix = '';
  if ($language != 'en') {
    $prefix = $language . '_';
  }
  foreach ($collections as $collection) {
    $collection_wrapper = entity_metadata_wrapper('node', $collection);
    // Sigle-value.
    $collections_code = $collection_wrapper->field_code->value();
    if (!empty($collections_code)) {
      $document->addField('sm_' . $prefix . 'collection_code', $collections_code);
    }
    // Sigle-value.
    $collections_identifier = $collection_wrapper->field_identifier->value();
    if (!empty($collections_identifier)) {
      $document->addField('sm_' . $prefix . 'collection_identifier', $collections_identifier);
    }
    // Sigle-value.
    $collections_label = $collection_wrapper->field_name->value();
    if (!empty($collections_label)) {
      $document->addField('sm_' . $prefix . 'collection_label', $collections_label);
    }
    // Multi-value.
    $collections_partner = $collection_wrapper->field_partner->value();
    if ($collections_partner) {
      foreach ($collections_partner as $partner) {
        $collection_partner_wrapper = entity_metadata_wrapper('node', $partner);
        // Sigle-value.
        $collections_partner_code = $collection_partner_wrapper->field_code->value();
        if (!empty($collections_partner_code)) {
          $document->addField('sm_' . $prefix . 'collection_partner_code', $collections_partner_code);
        }
        // Sigle-value.
        $collections_partner_identifier = $collection_partner_wrapper->field_identifier->value();
        if (!empty($collections_identifier)) {
          $document->addField('sm_' . $prefix . 'collection_partner_identifier', $collections_partner_identifier);
        }
        // Sigle-value.
        $collections_partner_label = $collection_partner_wrapper->field_name->value();
        if (!empty($collections_partner_label)) {
          $searchableFields[] = $collections_partner_label;
          $document->addField('sm_' . $prefix . 'collection_partner_label', $collections_partner_label);
        }
      }
    }
  }
}

/**
 * Index field_partner, aka Provider.
 */
 function dlts_solr_index_partners($items = [], &$document, &$entity, &$searchableFields) {
  $language = $entity->language;
  $label = '';
  $code = '';
  $prefix = '';
  if ($language != 'en') {
    $prefix = $language . '_';
  }
  foreach ($items as $item) {
    $wrapper = entity_metadata_wrapper('node', $item);
    $document->addField('sm_' . $prefix . 'provider_nid', $item->nid);
    // Sigle-value.
    $code = $wrapper->field_code->value();
    if (!empty($code)) {
      $document->addField('sm_' . $prefix . 'provider_code', $code);
    }
    // Sigle-value.
    $identifier = $wrapper->field_identifier->value();
    if (!empty($identifier)) {
      $document->addField('sm_' . $prefix . 'provider_identifier', $identifier);
    }
    // Sigle-value.
    $label = $wrapper->field_name->value();
    if (!empty($label)) {
      $searchableFields[] = $label;
      $document->addField('sm_' . $prefix . 'provider_label', $label);
    }
    if ($language == 'en') {
      $document->addField('sm_sprovider_label', strtolower($label));
      $document->addField('tum_provider_label', $label);
      $document->addField(
        'zm_partner',
        json_encode(
          [
            'name' => $label,
            'code' => $code,
            'nid' => $item->nid,
          ]
        )
      );
      $document->addField(
        'zm_provider',
        json_encode(
          [
            'name' => $label,
            'code' => $code,
            'nid' => $item->nid,
          ]
        )
      );
    }
  }
}

function mbstring_binary_safe_encoding($reset = FALSE) {
  static $encodings = [];
  static $overloaded = NULL;
  if (is_null($overloaded)) {
    $overloaded = function_exists('mb_internal_encoding') && (ini_get('mbstring.func_overload') & 2);
  }
  if (FALSE === $overloaded) {
    return;
  }
  if (!$reset) {
    $encoding = mb_internal_encoding();
    array_push($encodings, $encoding);
    mb_internal_encoding('ISO-8859-1');
  }
  if ($reset && $encodings) {
    $encoding = array_pop($encodings);
    mb_internal_encoding($encoding);
  }
}

function reset_mbstring_encoding() {
  mbstring_binary_safe_encoding(TRUE);
}
