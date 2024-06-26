<?php

/**
 * @file
 * All things related to Postcards.
 */

/**
 * Implements "a version" template_preprocess_node().
 * @link https://api.drupal.org/api/drupal/modules%21node%21node.module/function/template_preprocess_node/7
 */
function dlts_viewer_preprocess_node_dlts_postcard(&$vars) {
  // We don't render a DLTS Book object, redirect to a "Book page".
  if ($vars['view_mode'] == 'full') {
    $wrapper = entity_metadata_wrapper('node', $vars['node']);
    $identifier = $wrapper->field_identifier->value();
    drupal_goto('books/' . $identifier . '/1');
  }
  $vars['language_dir'] = dlts_viewer_viewer_language($vars);
  if ($vars['view_mode'] == 'metadata') {
    $args = arg();
    $count = count($args);
    if ($count === 3 && $args[2] == 'display') {
      $vars['theme_hook_suggestions'][] = 'node__display';
    }
  }
}

/**
 * Render full view.
 *
 * @param object $entity
 *   Entity to render.
 */
function dlts_viewer_full_postcard_view(&$entity) {
  $module_path = drupal_get_path('module', 'dlts_viewer');
  $js_common_config = array('type' => 'file', 'scope' => 'footer');
  $css_common_config = array('group' => CSS_DEFAULT, 'every_page' => TRUE);
  drupal_add_css($module_path . '/css/dlts_viewer.css', $css_common_config);
  drupal_add_js(
    'https://yui-s.yahooapis.com/3.18.1/build/yui/yui-min.js', 'external',
    array(
      'group' => JS_LIBRARY,
      'weight' => -100,
    )
  );
  drupal_add_js(
    'https://yui-s.yahooapis.com/combo?gallery-2014.07.31-18-26/build/gallery-soon/gallery-soon-min.js',
    'external',
    array(
      'group' => JS_LIBRARY,
      'weight' => -101,
    )
  );
  drupal_add_js($module_path . '/js/crossframe.js', $js_common_config);
  drupal_add_js($module_path . '/js/modules/slider-base.js', $js_common_config);
  drupal_add_js($module_path . '/js/ui.keyboard.yui.js', $js_common_config);
  drupal_add_js($module_path . '/js/ui.components.yui.js', $js_common_config);
  drupal_add_js(variable_get('dlts_viewer_openlayers_source', 'sites/all/libraries/openlayers/build/OpenLayers.js'), array('group' => JS_LIBRARY));
  return node_view($entity, 'metadata', $entity->language);
}

/**
 * Render metadata view.
 *
 * @param object $entity
 *   Entity to render.
 */
function dlts_viewer_postcard_metadata_view($entity) {
  $element = node_view($entity, 'metadata', $entity->language);
  return drupal_render($element);
}

/**
 * Render metadata view.
 *
 * @param object $entity
 *   Entity to render.
 */
function dlts_viewer_postcard_metadata_display($entity) {
  return node_view($entity, 'metadata', $entity->language);
}

/**
 * Implements process_node_hook.
 */
function dlts_viewer_process_node_postcard_book(&$vars) {
  $args = arg();
  $count = count($args);
  // Set the correct template for this view.
  if ($count === 3 && $args[2] == 'display') {
    $vars['theme_hook_suggestions'][] = 'node__display';
  }
}

/**
 * Postcard dispatcher.
 *
 * @param object $entity
 *   Entity.
 * @param object $arg
 *   Mongo.
 */
function dlts_viewer_postcard_dispatcher($entity, $arg) {
  // Check if this collection has searchable PDFs.
  $pdf_is_searchable = dlts_viewer_pdf_is_searchable($entity);
  // Test if resource.
  $is_resource = dlts_viewer_is_resource();

  if ($is_resource) {
    dlts_viewer_resource_language_code($entity);
  }

  // Wrapp book entity with Entity API wrapper.
  $book_wrapper = entity_metadata_wrapper('node', $entity);

  $entity->title = $book_wrapper->field_title->value();

  // Check for mobile devices.
  $is_mobile = dlts_viewer_is_mobile();
  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();
  // Check if this books is part of a multi-volume.
  $multivolume_book = dlts_viewer_is_multivolume_book($entity);
  // If book is part of multi-volume; use append volume value to entity title.
  if ($multivolume_book) {
    $wrapper = entity_metadata_wrapper('node', $multivolume_book);
    // Get volume value.
    $volume_number_str = $wrapper->field_volume_number_str->value();
    // Change entity title.
    $entity->title = t(
      '@title @volume',
      array(
        '@title' => $multivolume_book->title,
        '@volume' => $volume_number_str,
      )
    );
  }

  // Set entity title.
  drupal_set_title($entity->title);

  // Book identifier.
  $identifier = $book_wrapper->field_identifier->value();
  // Set $identifier so that .tpl.php can use it.
  $entity->identifier = $identifier;
  // Book URL.
  $book_url = url('node/' . $entity->nid, array('absolute' => TRUE));
  // Set $url so that .tpl.php can use it.
  $entity->url = $book_url;
  // Set language.
  _language_field($entity);
  // Check for type of request: 1) book page or 2) display pane.
  if (!is_array($arg) && $arg == 'display') {
    // Type of request.
    $display_type = 'book_metadata';
  }
  else {
    // Type of request.
    $display_type = 'book_page';
    // Default single page view.
    $is_single_page = TRUE;
    $thumbnails_rows_per_page = 10;
    $sequence = $arg['sequence'];
    if (isset($query_parameters['rows'])) {
      $thumbnails_rows_per_page = filter_xss($query_parameters['rows']);
    }
    if (is_array($sequence)) {
      // Get the first page of the requested sequence.
      $page = min($sequence);
      $sequence_max = max($sequence);
      $sequence_min = min($sequence);
      // Check if this is a double page view.
      if (count($sequence) > 1) {
        $is_single_page = FALSE;
      }
    }
    else {
      // Get the first page of the requested sequence.
      $page = $sequence_max = $sequence_min = $sequence;
      $is_single_page = TRUE;
    }
    $sequence_count = $book_wrapper->field_sequence_count->value();
    $int_read_order = 0;
    if (isset($book_wrapper->field_read_order)) {
      $int_read_order = $book_wrapper->field_read_order->value();
    }
    $entity->read_order = ($int_read_order == 1) ? 'rtl' : 'ltr';
    $next_page = $sequence_max + 1;
    $previous_page = $sequence_min - 1;
    $previous_page_active = TRUE;
    $next_page_active = TRUE;
    if ($previous_page < 1) {
      $previous_page = 1;
    }
    if ($next_page > $sequence_count) {
      $next_page = $sequence_count;
      $next_page_active = FALSE;
    }
    if ($sequence_max == 1) {
      $previous_page_active = FALSE;
    }
    // Next page.
    $next_pager_side = ($entity->read_order === 'ltr') ? 'pager-right' : 'pager-left';
    // Prev page.
    $previous_pager_side = ($entity->read_order === 'ltr') ? 'pager-left' : 'pager-right';

    $button_previous_options = array(
      'id' => 'previous-page',
      'type' => 'dlts_book_page',
      'text' => t('Go to previous page'),
      'url' => $book_url . '/' . $previous_page . ((!$is_single_page) ? '?page_view=double' : ''),
      'classes' => array(
        'previous', $previous_pager_side,
        ($previous_page_active ? 'active' : 'inactive'),
      ),
    );

    $button_next_options = array(
      'id' => 'next-page',
      'text' => t('Go to next page'),
      'url' => $book_url . '/' . $next_page . ((!$is_single_page) ? '?page_view=double' : ''),
      'classes' => array(
        'next',
        $next_pager_side,
        ($next_page_active ? 'active' : 'inactive'),
      ),
    );

    $button_togglepage_options = array(
      'id' => 'toggle-page',
      'type' => 'dlts_book_page',
      'text' => t('Toggle between single or double page'),
      'url' => $book_url . '/' . $sequence_min . (($is_single_page) ? '?page_view=double' : ''),
      'classes' => array(
        'toggle',
        'active',
        ($is_single_page) ? 'page-double' : 'page-single',
      ),
    );

    $button_metadata_options = array(
      'title' => t('Metadata'),
      'path' => 'node/' . $entity->nid,
      'attributes' => array(
        'data-title' => t('Metadata'),
        'title' => t('Show/hide metadata'),
        'class' => array('button', 'metadata', (($is_mobile) ? 'off' : 'on')),
        'id' => array(
          'button-metadata',
        ),
      ),
      'fragment' => 'metadata',
    );

    $button_fullscreen_options = array(
      'title' => t('Toggle fullscreen'),
      'path' => 'node/' . $entity->nid,
      'attributes' => array(
        'data-title' => t('Toggle fullscreen'),
        'title' => t('Toggle fullscreen'),
        'class' => array('button', 'fullscreen', 'off'),
        'id' => array(
          'button-fullscreen',
        ),
      ),
      'fragment' => 'fullscreen',
    );

    $button_thumbnails_options = array(
      'title' => t('Pages'),
      'path' => 'node/' . $entity->nid,
      'attributes' => array(
        'data-title' => t('Select page'),
        'title' => t('Select page'),
        'class' => array('button', 'thumbnails', 'off'),
        'id' => array(
          'button-thumbnails',
        ),
      ),
      'fragment' => 'thumbnails',
    );

    $button_previous = theme('dlts_viewer_pager_button', $button_previous_options);

    $button_next = theme('dlts_viewer_pager_button', $button_next_options);

    // Fullscreen button.
    $button_fullscreen = theme('dlts_viewer_navbar_item', $button_fullscreen_options);
    // Metadata button.
    $button_metadata = theme('dlts_viewer_navbar_item', $button_metadata_options);
    // Thumbnails button.
    $button_thumbnails = theme('dlts_viewer_navbar_item', $button_thumbnails_options);
    // Toggle between Single and Double page button.
    $button_togglepage = theme('dlts_viewer_pager_button', $button_togglepage_options);
    $controlpanel_button = theme('dlts_viewer_controlpanel');
    // Book page sequence number.
    $entity->book_page_sequence_number = $page;
    // Set navbar pager buttons according to read direction.
    $nav_pager_button_left_arrow = $button_previous;
    $nav_pager_button_right_arrow = $button_next;
    if ($entity->read_order == 'rtl') {
      $nav_pager_button_left_arrow = $button_next;
      $nav_pager_button_right_arrow = $button_previous;
    }
    $nav_pager_button_left_arrow = '<li class="navbar-item navbar-pager-left">' . $nav_pager_button_left_arrow . '</li>';
    $nav_pager_button_right_arrow = '<li class="navbar-item navbar-pager-right">' . $nav_pager_button_right_arrow . '</li>';
    $button_togglepage = '<li class="navbar-item">' . $button_togglepage . '</li>';
    $navbar_options = array(
      'nav_buttons_left' => array(
        $button_metadata,
        $button_togglepage,
        $button_thumbnails,
      ),
      'nav_buttons_right' => array($button_fullscreen),
      'nav_buttons_arrows' => array($button_previous, $button_next),
      'nav_buttons_pager_left_arrow' => $nav_pager_button_left_arrow,
      'nav_buttons_pager_right_arrow' => $nav_pager_button_right_arrow,
      'control_panel' => $controlpanel_button,
    );
    $loading_options = array('sequence_number' => $page);
    $entity->navbar = theme('dlts_viewer_navbar', $navbar_options);
    $entity->book_page_data = $arg;
    $entity->button_metadata = $button_metadata;
    $entity->button_next = $button_next;
    $entity->button_previous = $button_previous;
    $entity->button_togglepage = $button_togglepage;
    $entity->loading = theme('dlts_viewer_loading', $loading_options);
    $entity->pane_metadata_hidden = $is_mobile;
    $entity->sequence = $page;
    $entity->sequence_count = $sequence_count;
    $slider_options = array(
      'slider_id' => 'slider',
      'uri' => $book_url,
      'lang_dir' => $entity->read_order,
      'sequence_number' => $page,
      'sequence_count' => $sequence_count,
    );
    $entity->thumbnailsPage = ceil($page / $thumbnails_rows_per_page) - 1;
    $entity->thumbnailsRows = $thumbnails_rows_per_page;
    $entity->thumbnailsURL = $book_url . '/thumbnails';
    $entity->pageView = ($is_single_page) ? 'single' : 'double';
    $arg['pageView'] = $entity->pageView;
    $arg['thumbnailsUrl'] = $entity->thumbnailsURL;
    $arg['thumbnailsRows'] = $entity->thumbnailsRows;
    $arg['thumbnailsPage'] = $entity->thumbnailsPage;
    $book_page_options = array(
      'file' => $arg,
    );
    $entity->book_page = theme('dlts_viewer_openlayers_image', $book_page_options);
    $entity->slider = theme('dlts_viewer_slider', $slider_options);
  }

  // Types of returns.
  switch ($display_type) {
    case 'book_page':
      return dlts_viewer_full_book_view($entity);

    case 'book_page_pjax':
      return dlts_viewer_pjax_book_view($entity);

    case 'book_metadata':
      return dlts_viewer_full_book_view($entity);

    case 'book_metadata_pjax':
      return dlts_viewer_book_metadata_view($entity);
  }
}

/**
 * Route callback for postcards edit page.
 * @link http://localhost:9000/postcards/{identifier}/edit
 */
function _dlts_viewer_postcard_edit_redirect($node) {
  if (is_object($node)) {
    $wrapper = entity_metadata_wrapper('node', $node);
    $identifier = $wrapper->field_identifier->value();
    if ($identifier) {
      $path = drupal_lookup_path('source', 'postcards/' . $identifier);
      if ($path) {
        drupal_goto($path . '/edit');
      }
    }
  }
  drupal_not_found();
}
