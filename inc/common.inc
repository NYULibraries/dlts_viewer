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
