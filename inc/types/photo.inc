<?php

/**
 * @file
 * photo.inc
 */

/**
 * Photo view.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_full_photo_view(&$entity) {

  $module_path = drupal_get_path('module', 'dlts_viewer');

  $js_common_config = array(
    'type' => 'file',
    'scope' => 'footer',
  );

  drupal_add_css(
    "$module_path/css/dlts_viewer.css",
    array(
      'group' => CSS_DEFAULT,
      'every_page' => TRUE,
    )
  );

  drupal_add_js(
    'https://yui-s.yahooapis.com/3.18.1/build/yui/yui-min.js',
    'external',
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

  drupal_add_js("$module_path/js/crossframe.js", $js_common_config);

  drupal_add_js("$module_path/js/ui.keyboard.yui.js", $js_common_config);

  drupal_add_js("$module_path/js/ui.photo.components.yui.js", $js_common_config);

  drupal_add_js(
    variable_get(
      'dlts_viewer_openlayers_source',
      'sites/all/libraries/openlayers/build/OpenLayers.js'
    ),
    array(
      'group' => JS_LIBRARY,
    )
  );

  $data_attributes = array(
    'uri' => $entity->book_page_data['uri'],
    'pageView' => 'single',
    'sequenceCount' => $entity->sequence_count,
    'sequence' => $entity->sequence,
    'title' => $entity->title,
    'width' => $entity->book_page_data['width'],
    'height' => $entity->book_page_data['height'],
    'levels' => $entity->book_page_data['levels'],
    'dwtLevels' => $entity->book_page_data['dwtLevels'],
    'compositingLayerCount' => $entity->book_page_data['compositingLayerCount'],
    'thumbnails-url' => $entity->thumbnailsURL,
    'thumbnails-rows' => $entity->thumbnailsRows,
    'thumbnails-page' => $entity->thumbnailsPage,
  );

  $vars = array(
    'compositingLayerCount' => $entity->book_page_data['compositingLayerCount'],
    'dwtLevels' => $entity->book_page_data['dwtLevels'],
    'fid' => $entity->identifier,
    'height' => $entity->book_page_data['height'],
    'identifier' => $entity->identifier,
    'levels' => $entity->book_page_data['levels'],
    'title' => $entity->title,
    'uri' => $entity->book_page_data['uri'],
    'width' => $entity->book_page_data['width'],
    'pageView' => 'single',
    'data_attributes' => $data_attributes,
  );

  $viewer = array(
    'book_page' => $entity->map,
    'map' => theme('viewer_map', $vars),
    'language_dir' => "ltr",
    'pagemeta' => NULL,
    'navbar' => $entity->navbar,
    'url' => $entity->url,
    'identifier' => $entity->identifier,
    'title' => $entity->title,
    'loading' => $entity->loading,
  );
  return theme('viewer', $viewer);

}

/**
 * Photo AJAX view.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_pjax_photo_view($entity) {
  return theme(
    'viewer_page',
    array(
      'button_next' => $entity->button_next,
      'button_previous' => $entity->button_previous,
      'compositingLayerCount' => $entity->book_page_data['compositingLayerCount'],
      'dwtLevels' => $entity->book_page_data['dwtLevels'],
      'fid' => $entity->book_page_data['fid'],
      'height' => $entity->book_page_data['height'],
      'identifier' => $entity->identifier,
      'levels' => $entity->book_page_data['levels'],
      'sequence' => $entity->sequence,
      'sequence_count' => $entity->sequence_count,
      'title' => $entity->title,
      'uri' => $entity->book_page_data['uri'],
      'width' => $entity->book_page_data['width'],
      'pageView' => $entity->pageView,
    )
  );
}

/**
 * Photo set view.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_photo_set_view($entity) {

  $module_path = drupal_get_path('module', 'dlts_viewer');

  $js_common_config = array(
    'type' => 'file',
    'scope' => 'footer',
  );

  drupal_add_css(
    "$module_path/css/dlts_viewer.css",
    array(
      'group' => CSS_DEFAULT,
      'every_page' => TRUE,
    )
  );

  drupal_add_js(
    'https://yui-s.yahooapis.com/3.18.1/build/yui/yui-min.js',
    'external',
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

  drupal_add_js("$module_path/js/crossframe.js", $js_common_config);

  drupal_add_js("$module_path/js/ui.keyboard.yui.js", $js_common_config);

  drupal_add_js("$module_path/js/ui.photo.components.yui.js", $js_common_config);

  drupal_set_title($entity->title);

  // Count of thumbnails.
  $count = $entity->count;

  // Items, splited in rows.
  $rows = $entity->rows;

  $per_page = $entity->per_page;

  $thumbnails_row_per_page = $entity->thumbnailsRows;

  // Initialise the pager.
  $current_page = pager_default_initialize($count, $per_page);

  // Pager.
  $set_parameters = array(
    'current_page' => $current_page,
    'rows' => $rows,
  );

  if (($count / $thumbnails_row_per_page) > 1) {
    $pager = theme(
      'thumbnails_photo_pager',
      array(
        'quantity' => $count,
        'current_page' => $current_page,
      )
    );
    $set_parameters['pager'] = $pager;
  }

  return theme('dlts_viewer_set', $set_parameters);

}

/**
 * Photo dispatcher.
 *
 * @param object $entity
 *   Node.
 */
function dlts_viewer_photo_dispatcher($entity, $arg) {

  // Check request type.
  $is_pjax = dlts_viewer_is_pjax();

  // Get query parameters.
  $query_parameters = drupal_get_query_parameters();

  drupal_set_title($entity->title);

  // Wrapp book entity with Entity API wrapper.
  $set_wrapper = entity_metadata_wrapper('node', $entity);

  // Book identifier.
  $identifier = $set_wrapper->field_identifier->value();

  // Set $identifier so that .tpl.php can use it.
  $entity->identifier = $identifier;

  // Number of thumbnails on photo set view.
  $thumbnails_rows_per_page = 10;

  $entity->thumbnailsRows = $thumbnails_rows_per_page;

  // Book URL.
  $set_url = url("photos/$entity->identifier", array('absolute' => TRUE));

  // Set $url so that .tpl.php can use it.
  $entity->url = $set_url;

  // Check for type of request: 1) photo page or 2) display pane.
  if (!isset($arg) || !is_array($arg)) {

    // Load helpers.
    module_load_include('inc', 'dlts_viewer', 'inc/mongodb');

    $page = 0;

    // Check request type.
    if (array_key_exists('page', $query_parameters)) {
      $page = $query_parameters['page'];
    }

    // Default amount of items to request.
    $per_page = 10;

    // Request thumbnails from MongoDB.
    $thumbnails = dlts_viewer_mongodb_load_thumbnails(
      $identifier,
      $page,
      $per_page,
      'dlts_photo',
      'photos'
    );

    // No need to continue if request does not have items.
    if ($thumbnails) {

      // Count of thumbnails.
      $count = $thumbnails['count'];

      // Items.
      $rows = $thumbnails['items'];

      $entity->count = $count;

      $entity->rows = $rows;

      $entity->per_page = $per_page;

      $entity->page = $page;
    }

    $display_type = 'photo_set';

  }
  else {

    // Type of request.
    $display_type = 'photo_page';

    if ($is_pjax) {
      $display_type = 'photo_page_pjax';
    }

    $sequence = $arg['sequence'];

    if (isset($query_parameters['rows'])) {
      $thumbnails_rows_per_page = filter_xss($query_parameters['rows']);
    }

    if (is_array($sequence)) {

      // Get the first page of the requested sequence.
      $page = min($sequence);

      $sequence_max = max($sequence);

      $sequence_min = min($sequence);

    }
    else {

      // Get the first page of the requested sequence.
      $page = $sequence_max = $sequence_min = $sequence;

    }

    $sequence_count = $set_wrapper->field_sequence_count->value();

    $entity->read_order = 'ltr';

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
    $next_pager_side = 'pager-right';

    // Prev page.
    $previous_pager_side = 'pager-left';

    $button_previous_options = array(
      'id' => 'previous-page',
      'type' => 'dlts_photo',
      'text' => t('Go to previous page'),
      'url' => "$set_url/$previous_page",
      'classes' => array(
        'previous',
        $previous_pager_side,
        ($previous_page_active ? 'active' : 'inactive'),
      ),
    );

    $button_next_options = array(
      'id' => 'next-page',
      'type' => 'dlts_photo',
      'text' => t('Go to next page'),
      'url' => "$set_url/$next_page",
      'classes' => array(
        'next',
        $next_pager_side,
        ($next_page_active ? 'active' : 'inactive'),
      ),
    );

    $button_fullscreen_options = array(
      'title' => t('Toggle fullscreen'),
      'path' => "photos/$entity->identifier/$page",
      'attributes' => array(
        'data-title' => t('Toggle fullscreen'),
        'title' => t('Toggle fullscreen'),
        'class' => array(
          'button',
          'fullscreen',
          'off',
        ),
        'id' => array('button-fullscreen'),
      ),
      'fragment' => 'fullscreen',
    );

    if (dlts_viewer_is_embed()) {
      $thumbnail_path = "photos/$entity->identifier/mode/embed";
    }
    else {
      $thumbnail_path = "photos/$entity->identifier";
    }

    $button_thumbnails_options = array(
      'title' => t('Pages'),
      'path' => $thumbnail_path,
      'attributes' => array(
        'data-title' => t('Select page'),
        'title' => t('Select page'),
        'class' => array(
          'button',
          'thumbnails',
          'off',
        ),
        'id' => array('button-thumbnails'),
      ),
    );

    $button_previous = theme('dlts_viewer_pager_button', $button_previous_options);

    $button_next = theme('dlts_viewer_pager_button', $button_next_options);

    // Fullscreen button.
    $button_fullscreen = theme('dlts_viewer_navbar_item', $button_fullscreen_options);

    // Thumbnails button.
    $button_thumbnails = theme('dlts_viewer_navbar_item', $button_thumbnails_options);

    $controlpanel_button = theme('dlts_viewer_controlpanel');

    // Book page sequence number.
    $entity->sequence = $page;

    // Set navbar pager buttons according to read direction.
    $nav_pager_button_left_arrow = $button_previous;

    $nav_pager_button_right_arrow = $button_next;

    $nav_pager_button_left_arrow = '<li class="navbar-item navbar-pager-left">' . $nav_pager_button_left_arrow . '</li>';

    $nav_pager_button_right_arrow = '<li class="navbar-item navbar-pager-right">' . $nav_pager_button_right_arrow . '</li>';

    $navbar_options = array(
      'nav_buttons_left' => array($button_thumbnails),
      'nav_buttons_right' => array($button_fullscreen),
      'nav_buttons_arrows' => array($button_previous, $button_next),
      'nav_buttons_pager_left_arrow' => $nav_pager_button_left_arrow,
      'nav_buttons_pager_right_arrow' => $nav_pager_button_right_arrow,
      'control_panel' => $controlpanel_button,
    );

    $loading_options = array('sequence_number' => $page);

    $entity->navbar = theme('dlts_viewer_navbar', $navbar_options);

    $entity->book_page_data = $arg;

    $entity->button_next = $button_next;

    $entity->button_previous = $button_previous;

    $entity->loading = theme('dlts_viewer_loading', $loading_options);

    $entity->sequence = $page;

    $entity->sequence_count = $sequence_count;

    $entity->thumbnailsPage = ceil($page / $thumbnails_rows_per_page) - 1;

    $entity->thumbnailsRows = $thumbnails_rows_per_page;

    if (dlts_viewer_is_embed()) {
      $entity->thumbnailsURL = $set_url . '/set/mode/embed';
    }
    else {
      $entity->thumbnailsURL = $set_url . '/set';
    }

    $entity->pageView = 'single';

    $arg['pageView'] = $entity->pageView;

    $arg['thumbnailsUrl'] = $entity->thumbnailsURL;

    $arg['thumbnailsRows'] = $entity->thumbnailsRows;

    $arg['thumbnailsPage'] = $entity->thumbnailsPage;

    $book_page_options = array(
      'file' => $arg,
    );

    $entity->map = theme('dlts_viewer_openlayers_image', $book_page_options);

  }

  // Types of returns.
  switch ($display_type) {
    case 'photo_page':
      return dlts_viewer_full_photo_view($entity);

    case 'photo_page_pjax':
      return dlts_viewer_pjax_photo_view($entity);

    case 'photo_set':
      return dlts_viewer_photo_set_view($entity);

  }
}

/**
 * Undocumented function.
 */
function dlts_viewer_preprocess_html_photos(&$vars) {
  dlts_viewer_preprocess_html_photo($vars);
}

/**
 * Undocumented function.
 */
function dlts_viewer_preprocess_html_photo(&$vars) {
  $vars['classes_array'][] = 'photo';
}

/**
 * Undocumented function.
 */
function dlts_viewer_photo_embed_redirect($entity) {
  if (is_object($entity)) {
    $wrapper = entity_metadata_wrapper('node', $entity);
    // Identifier.
    $identifier = $wrapper->field_identifier->value();
    drupal_goto(
      "photos/$identifier",
      array(
        'query' => array(
          'embed' => 'true',
        ),
      )
    );
  }
  return drupal_exit();
}

/**
 * Undocumented function.
 */
function dlts_viewer_photo_thumb($entity, $page) {
  if (is_object($entity)) {

    $set_wrapper = entity_metadata_wrapper('node', $entity);

    // Identifier.
    $identifier = $set_wrapper->field_identifier->value();

    $sequence = $page['sequence'];

    $thumbnails = dlts_viewer_mongodb_load_thumbnails($identifier, reset($sequence) - 1, 1, 'dlts_photo', 'photos', TRUE);

    $items = $thumbnails['items'];

    $image_data = reset($items);

    $image_url = $image_data['imageServeURI'];

    drupal_goto($image_url);

  }
}
