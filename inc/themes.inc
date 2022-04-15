<?php

/**
 * @file
 * Themes.
 */

/**
 * Implements hook_theme().
 * @link http://api.drupal.org/api/drupal/modules--system--system.api.php/function/hook_custom_theme/7
 */
function dlts_viewer_theme() {
  return array(
    'dlts_viewer_pager_button' => [
      'variables' => [],
    ],
    'dlts_viewer_field__field_pdf_file' => array(
      'variables' => [],
      'render element' => 'content',
      'base hook' => 'node',
    ),
    'field__field_pdf_file' => array(
      'variables' => [],
    ),
    'thumbnails_pager' => array(
      'variables' => array(
        'tags' => [],
        'limit' => 10,
        'element' => 0,
        'parameters' => [],
        'quantity' => 9,
      ),
    ),
    'thumbnails_photo_pager' => array(
      'variables' => array(
        'tags' => [],
        'limit' => 10,
        'element' => 0,
        'current_page' => 0,
        'parameters' => [],
        'quantity' => 9,
      ),
    ),
    'dlts_viewer_openseadragon_image' => array(
      'variables' => [],
    ),
    'dlts_viewer_navbar_item' => array(
      'variables' => [],
    ),
    'dlts_viewer_loading' => array(
      'template' => 'templates/components/component--loading',
      'variables' => array(
        'sequence_number' => 0,
      ),
    ),
    'dlts_viewer_slider' => array(
      'template' => 'templates/components/component--slider',
      'variables' => array(
        'slider_id' => 'slider',
        'uri' => base_path(),
        'lang_dir' => 'rtl',
        'sequence_number' => 0,
        'sequence_count' => 0,
      ),
    ),
    'dlts_viewer_navbar' => array(
      'template' => 'templates/components/component--navbar',
      'variables' => [],
    ),
    'dlts_viewer_thumbnails' => array(
      'template' => 'templates/components/component--thumbnails',
      'variables' => [],
    ),
    'dlts_viewer_set' => array(
      'template' => 'templates/set',
      'variables' => [],
    ),
    'viewer' => array(
      'template' => 'templates/components/component--viewer',
      'variables' => [],
    ),
    'photo' => array(
      'template' => 'templates/components/component--photo',
      'variables' => [],
    ),
    'viewer_page' => array(
      'template' => 'templates/components/component--bookpage',
      'variables' => [],
    ),
    'viewer_map' => array(
      'template' => 'templates/components/component--map',
      'variables' => [],
    ),
    'viewer_display' => array(
      'template' => 'templates/components/component--display',
      'variables' => [],
    ),
    'dlts_viewer_oembed' => array(
      'template' => 'templates/components/component--oembed',
      'variables' => [],
    ),
    'dlts_viewer_top' => array(
      'template' => 'templates/components/component--top',
      'variables' => [],
    ),
    'html__viewer' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/html',
    ),
    'html__viewer_pjax' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/html.pjax',
    ),
    'page__viewer' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/page',
    ),
    'page__viewer_pjax' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/page.pjax',
    ),
    'ds_1col__node_metadata' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/ds-1col--node-metadata',
    ),
    'node__display' => array(
      'render element' => 'content',
      'base hook' => 'node',
      'template' => 'templates/display',
    ),
    'block__content' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/block',
    ),
    'region__content' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/region',
    ),
    'node__dlts_book' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/node',
    ),
    'node__dlts_book_pjax' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/node.pjax',
    ),
    'node__dlts_map' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/node',
    ),
    'node__dlts_map_pjax' => array(
      'render element' => 'content',
      'base hook' => 'page',
      'template' => 'templates/node.pjax',
    ),
    'viewer_documentation_page' => array(
      'template' => 'templates/documentation',
      'variables' => [],
    ),
  );
}

function dlts_viewer_theme_registry_alter(&$theme_registry) {
  if (!empty($theme_registry['field'])) {
    $theme_registry['field']['function'] = 'dlts_viewer_theme_field';
  }
}

function dlts_viewer_theme_field($variables) {
  $_value = (array) $variables['element']['#object'];
  $dir = dlts_viewer_viewer_language($_value);
  $output = '';
  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $lang_language = $variables['element']['#object']->language;
    $label = locale($variables['label'], NULL, $lang_language);
    $output .= '<div dir="' . $dir . '" class="field-label"' . $variables['title_attributes'] . '>' . $label . ':&nbsp;</div>';
  }
  // Render the items.
  $output .= '<div dir="' . $dir . '" class="field-items"' . $variables['content_attributes'] . '>';
  foreach ($variables['items'] as $delta => $item) {
    $classes = 'field-item ' . ($delta % 2 ? 'odd' : 'even');
    $output .= '<div dir="' . $dir . '" class="' . $classes . '"' . $variables['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
  }
  $output .= '</div>';
  // Render the top-level DIV.
  $output = '<div dir="' . $dir . '" class="' . $variables['classes'] . '"' . $variables['attributes'] . '>' . $output . '</div>';
  return $output;
}

function theme_dlts_viewer_pager_button($variables) {
  $classes = ['paging'];  
  if (isset($variables['classes'])) {
    $classes = array_merge($classes, $variables['classes']);
  }
  if (dlts_viewer_is_pjax()) {
    $classes[] = 'pjax';
  }

  $attributes = array_merge(
    [
      'title' => $variables['text'],
      'href' => $variables['url'],
      'class' =>  $classes,
    ], 
    $variables['attributes']
  );
  $render_array = [
    'markup' => [
      '#theme' => 'html_tag',
      '#tag' => 'a',
      '#value' => '<span>' . $variables['text'] . '</span>',
      '#attributes' => $attributes,
    ],
  ];
  return drupal_render($render_array);
}

function theme_dlts_viewer_navbar_item($variables) {
  $parts = ['html' => TRUE];
  if (isset($variables['fragment'])) {
        $parts = array_merge($parts, array('fragment' => $variables['fragment']));
  }
  if (isset($variables['attributes'])) {
        $parts = array_merge($parts, array('attributes' => $variables['attributes']));
  }
  if (isset($variables['query'])) {
        $parts = array_merge($parts, array('query' => $variables['query']));
  }
  if (empty($variables['url'])) {
    $url = $variables['path'];
  }
  else {
    $url = $variables['url'];
  }
  return '<li class="navbar-item">' . l(t('<span>@title</span>', array('@title' => $variables['title'])), $url,$parts);
}

/**
 * Override of theme_pager().
 * Easily one of the most obnoxious theming jobs in Drupal core.
 * Goals: consolidate functionality into less than 5 functions and
 * ensure the markup will not conflict with major other styles
 * (theme_item_list() in particular).
 */
function theme_thumbnails_pager($vars) {
  $tags = $vars['tags'];
  $element = $vars['element'];
  $parameters = $vars['parameters'];
  $quantity = $vars['quantity'];
  $pager_list = theme('pager_list', $vars);
  $links = array();
  $links['pager-first'] = theme(
    'pager_first',
    array(
      'text' => (isset($tags[0]) ? $tags[0] : t('First')),
      'element' => $element,
      'parameters' => $parameters,
    )
  );
  $links['pager-previous'] = theme(
    'pager_previous',
    array(
      'text' => (isset($tags[1]) ? $tags[1] : t('Prev')),
      'element' => $element,
      'interval' => 1,
      'parameters' => $parameters,
    )
  );
  $links['pager-next'] = theme('pager_next', array(
    'text' => (isset($tags[3]) ? $tags[3] : t('Next')),
    'element' => $element,
    'interval' => 1,
    'parameters' => $parameters,
  ));
  $links['pager-last'] = theme('pager_last', array(
    'text' => (isset($tags[4]) ? $tags[4] : t('Last')),
    'element' => $element,
    'parameters' => $parameters,
  ));
  $links['close'] = array(
    'title' => t('Close [x]'),
    'href' => '#',
    'attributes'
    => array(
      'class' =>
        array(
          'close',
        ),
    ),
  );
  $links = array_filter($links);
  $pager_links = theme('links', array(
    'links' => $links,
    'attributes' => array(
      'class' => 'links pager pager-links',
    ),
  ));
  if ($pager_list) {
    return '<div class="pager clearfix">' . $pager_list . ' ' . $pager_links . '</div>';
  }
}

function theme_thumbnails_photo_pager($vars) {
    $tags = $vars['tags'];
    $element = $vars['element'];
    $parameters = $vars['parameters'];
    $quantity = $vars['quantity'];
    $pager_count=ceil($quantity/10);
    $current_page = $vars['current_page'];
    //$url = $vars['path'];
    $links = array();
    for($i=0; $i < $pager_count; $i++) {
      $attributes = array('target'=> '_self');
      if ($i == $current_page) {
        $context_index = $i + 1;
        $links[''.$i] =  array('title' => ''. $context_index);
      }
      else {
          $links['' . $i] = theme('pager_link', array(
              'text' => (isset($tags[0]) ? $tags[0] : t('' . ($i + 1))),
              'element' => $element,
              'parameters' => array('page' => $i),
              'attributes' => $attributes,
              'page_new' => '/'
          ));
      }
    }
    if($current_page>0) {
        $links['pager-first'] = theme('pager_link', array(
            'text' => (isset($tags[0]) ? $tags[0] : t('First')),
            'element' => $element,
            'parameters' => array('page' => 0),
            'attributes' => array('target' => '_self'),
            'page_new' => '/'
        ));
        $links['pager-previous'] = theme('pager_link', array(
            'text' => (isset($tags[1]) ? $tags[1] : t('Prev')),
            'element' => $element,
            'parameters' => array('page' => $current_page - 1),
            'attributes' => array('target' => '_self'),
            'page_new' => '/'
        ));
    }
    if($current_page<$i-1) {
        $links['pager-next'] = theme('pager_link', array(
            'text' => (isset($tags[3]) ? $tags[3] : t('Next')),
            'element' => $element,
            'parameters' => array('page' => $current_page + 1),
            'attributes' => array('target' => '_self'),
            'page_new' => '/'
        ));
        $links['pager-last'] = theme('pager_link', array(
            'text' => (isset($tags[4]) ? $tags[4] : t('Last')),
            'element' => $element,
            'parameters' => array('page' => $i - 1),
            'attributes' => array('target' => '_self'),
            'page_new' => '/'
        ));
    }
    $links = array_filter($links);
    $pager_links = theme('links', array(
        'links' => $links,
        'attributes' => array('class' => 'links pager pager-links')
    ));
    if ($pager_links) {
        return '<div class="pager clearfix">' . $pager_links . '</div>';
    }
}

// See ticker https://jira.nyu.edu/jira/browse/DLTSVIEWER-95
function theme_field__field_pdf_file(&$variables) {
  $out = '';
  $dir = dlts_viewer_viewer_language((array)$variables['element']['#object']);
  if ($variables['element']['#view_mode'] == 'metadata') {
    $out .= '<div dir="' . $dir . '" class="field field-name-field-pdf clearfix">';
    $out .= '<div dir="' . $dir . '" class="field-label">' . locale('Download', NULL, $variables['element']['#object']->language) . ':</div>';
    foreach ($variables['items'] as $key => $item) {
      $filesize = 0;
      $humanFilesizeReadable = null;
      if (
        isset($variables['element']['#items'][$key]['data'])
      ) {
        if (dlts_viewer_is_serialized($variables['element']['#items'][$key]['data'])) {
          $data = unserialize($variables['element']['#items'][$key]['data']);
          if (isset($data['filesize']) && $data['filesize'] > 0) {
            $filesize = $data['filesize'];
            $humanFilesizeReadable = field_fileserver_human_filesize($filesize);
          } else {
            $filesize = field_fileserver_get_pdf_filesize($data);
            if ($filesize > 0) {
              $humanFilesizeReadable = field_fileserver_human_filesize($filesize);
            }
          }
        } else {
          $filesize = field_fileserver_get_pdf_filesize(
            array(
              'uri' => $variables['element']['#items'][$key]['uri']
            )
          );
          $humanFilesizeReadable = field_fileserver_human_filesize($filesize);
        }
      }
      $out .= '<div class="pdf-items" dir="' . $dir . '">';
      $out .= '<div class="pdf-item" dir="' . $dir . '">
      <a data-filesize="' . $filesize . '" href="' . $variables['items'][$key]['#attributes']['href'] . '" class="' . implode(' ', $variables['items'][$key]['#attributes']['class']) . '">';
      $out .= '<span class="icon" aria-hidden="true" role="presentation">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="#9f2226" width="14" height="17" viewBox="0 0 30 40" style="enable-background:new 0 0 30 40;" xml:space="preserve">
            <path d="M14.2,20c-0.4-1.2-0.4-3.7-0.2-3.7C14.7,16.3,14.6,19.2,14.2,20z M14.1,23.7c-0.6,1.6-1.4,3.4-2.2,4.9
                c1.4-0.5,3-1.3,4.9-1.7C15.8,26.1,14.8,25.1,14.1,23.7L14.1,23.7z M6.7,33.4c0,0.1,1-0.4,2.7-3.1C8.9,30.8,7.2,32.2,6.7,33.4z
                M19.4,12.5H30v25.6c0,1-0.8,1.9-1.9,1.9H1.9c-1,0-1.9-0.8-1.9-1.9V1.9C0,0.8,0.8,0,1.9,0h15.6v10.6C17.5,11.7,18.3,12.5,19.4,12.5z
                M18.8,25.9c-1.6-1-2.6-2.3-3.3-4.2c0.4-1.4,0.9-3.6,0.5-5c-0.4-2.3-3.3-2.1-3.7-0.5c-0.4,1.4,0,3.4,0.6,6c-0.9,2.2-2.2,5-3.2,6.7
                c0,0,0,0,0,0c-2.1,1.1-5.7,3.5-4.3,5.3C5.8,34.8,6.6,35,7,35c1.4,0,2.8-1.4,4.8-4.8c2-0.7,4.2-1.5,6.2-1.8c1.7,0.9,3.7,1.5,5,1.5
                c2.3,0,2.4-2.5,1.5-3.4C23.4,25.4,20.3,25.7,18.8,25.9z M29.5,8.2l-7.7-7.7C21.4,0.2,21,0,20.5,0H20v10h10V9.5
                C30,9,29.8,8.6,29.5,8.2z M23.7,28.1c0.3-0.2-0.2-0.9-3.3-0.7C23.2,28.7,23.7,28.1,23.7,28.1z"></path>
            </svg></span>';
      $out .= locale($variables['items'][$key]['#value'], NULL, $variables['element']['#object']->language) . ' ' . locale('PDF', NULL, $variables['element']['#object']->language);
      if ($humanFilesizeReadable) {
        $out .= ' <span class="filesize">' .  $humanFilesizeReadable . '</span>';
      }
      if (dlts_viewer_pdf_is_searchable()) {
        $out .= '  <span class="is-searchable" dir="' . $dir . '">(' . locale('searchable', NULL, $variables['element']['#object']->language) . ')</span>';
      }
      $out .= '</a></div></div>';
    }
    $out .= '</div>';
    return $out;
  }
}

/**
 * Returns HTML for a high-resolution JPEG 2000 image.
 *
 * This function returns the necessary HTML elements, and sets certain
 * JavaScript settings for the file being displayed. The given elements are
 * then replaced by OpenLayers with a zoomable version of the image.
 *
 * @ingroup themable
 */
function theme_dlts_viewer_openseadragon_image($variables) {
  $classList = implode(' ', $variables['classList']);
  return "<div
     id='$variables[id]'
     class='$classList'
     data-type='$variables[type]'
     data-identifier='$variables[identifier]'
     data-sequence='$variables[sequence]'
     data-sequence-count='$variables[count]'
     data-view='$variables[view]'
     data-manifest='$variables[manifest]'
     data-service='$variables[service]'
     data-uri='$variables[uri]'
   ></div>";
}
