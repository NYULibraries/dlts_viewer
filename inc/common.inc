<?php

/**
 * Render language selection for metadata view.
 *
 * @param object $entity
 *   Entity.
 */
function _language_field(&$entity) {
  $languages = language_list('enabled');
  $languages = $languages[1];
  $entity->lang_dir = (!isset($languages[$entity->language]->direction) || isset($languages[$entity->language]->direction) && $languages[$entity->language]->direction == 0) ? 'ltr' : 'rtl';
  $entity->lang_language = isset($languages[$entity->language]->language) ? $languages[$entity->language]->language : 'en';
  $entity->lang_name = isset($languages[$entity->language]->name) ? $languages[$entity->language]->name : t('English');
  $translations = dlts_viewer_list_translation($entity->identifier);
  if (count($translations) > 1) {
    $entity->lang_options = array(
      '#type' => 'markup',
      '#prefix' => '<select class="language" aria-label="' . t('Choose Language for Metadata') . '">',
      '#suffix' => '</select>',
      '#markup' => '',
    );
    foreach ($translations as $key => $index) {
      $url = url(
        'books/' . $entity->identifier . '/display',
        array(
          'absolute' => TRUE,
          'query' => array(
            'lang' => $key,
          ),
        )
      );
      $markup = array(
        '#tag' => 'option',
        '#theme' => 'html_tag',
        '#attributes' => array(
          'data-title' => t('@lang', array('@lang' => $languages[$key]->native)),
          'data-language' => $key,
          'title' => t('@lang', array('@lang' => $languages[$key]->native)),
          'class' => array('language', $key),
           'data-url' => $url,
          'value' => $url,
        ),
        '#value' => t('@lang', array('@lang' => $languages[$key]->native)),
      );
      if ($entity->lang_language == $key) {
        $markup['#attributes']['selected'] = 'selected';
      }
      $entity->lang_options['#markup'] .= theme('html_tag', $markup);
    }
  }
}

function dlts_viewer_add_language($requested_language) {
  $list_enabled_languages = locale_language_list();
  $enabled_languages = array_keys($list_enabled_languages);
  if (in_array($requested_language, $enabled_languages)) {
    return TRUE;
  }
  require_once DRUPAL_ROOT . '/includes/iso.inc';
  // https://api.drupal.org/api/drupal/includes%21iso.inc/function/_locale_get_predefined_list/7
  $predefined_list = _locale_get_predefined_list();
  // https://api.drupal.org/api/drupal/includes%21locale.inc/function/locale_add_language/7    
  $language_to_install = $predefined_list[$requested_language];
  if (!$language_to_install) {
    drush_log(t('At this moment there is only support for auto-install languages defined by Drupal iso.inc' ), 'error');
    return FALSE;
  }
  locale_add_language($requested_language);
  return TRUE;
}

/**
 * Fetches locale translations for a set of source strings in one query.
 *
 * Returns an associative array of source => translation. Sources with no
 * translation row are absent from the result so callers can fall back
 * gracefully via isset().
 *
 * @param string   $language  Drupal language code (e.g. 'en', 'ar').
 * @param string[] $sources   Raw source strings to look up.
 *
 * @return string[]
 */
function _dlts_fetch_translations($language, array $sources) {
  if (empty($sources)) {
    return [];
  }

  return db_query(
    'SELECT source, translation
       FROM {dlts_viewer_locale}
      WHERE language = :language
        AND source IN (:sources)
        AND translation <> \'\'',
    [':language' => $language, ':sources' => $sources]
  )->fetchAllKeyed();
}

/**
 * Translates an array of arbitrary string values in a single query.
 *
 * Returns an ordered array of translated strings, falling back to the
 * original value when no translation is found.
 *
 * @param string   $language
 * @param string[] $values   Raw values to translate.
 *
 * @return string[]
 */
function _dlts_translate_values($language, array $values) {
  if (empty($values)) {
    return [];
  }

  $translations = _dlts_fetch_translations($language, $values);

  return array_map(
    function ($v) use ($translations) {
      return isset($translations[$v]) ? $translations[$v] : $v;
    },
    $values
  );
}

/**
 * Resolves human-readable field labels for every field on a bundle.
 *
 * Labels are looked up in {dlts_viewer_locale} first; any that are missing
 * fall back to Drupal's locale() function. A single bulk query is used so
 * that label resolution never triggers per-field database round-trips.
 *
 * @param array  $field_info_instances  Output of field_info_instances().
 * @param string $language
 *
 * @return string[] Keyed by field name.
 */
function _dlts_resolve_field_labels(array $field_info_instances, $language) {
  $raw_labels = array_map(
    function ($instance) { return $instance['label']; },
    $field_info_instances
  );

  $translations = _dlts_fetch_translations($language, array_values($raw_labels));

  $labels = [];
  foreach ($field_info_instances as $field_name => $instance) {
    $source = $instance['label'];
    $labels[$field_name] = isset($translations[$source])
      ? $translations[$source]
      : locale($source, NULL, $language);
  }

  return $labels;
}

/**
 * Returns a metadata entry array or NULL when the field has no value.
 *
 * @param string $label
 * @param mixed  $value  Scalar or array; empty values yield NULL.
 *
 * @return array|null
 */
function _dlts_metadata_entry($label, $value) {
  $values = is_array($value) ? array_filter($value, 'strlen') : [$value];
  if (empty($values)) {
    return NULL;
  }

  return ['label' => $label, 'value' => array_values($values)];
}

