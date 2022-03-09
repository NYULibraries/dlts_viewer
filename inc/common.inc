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
