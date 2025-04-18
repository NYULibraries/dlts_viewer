<?php

/**
 * @file
 * All things related to Books.
 */

/**
 * Implements "a version" template_preprocess_node().
 * @link https://api.drupal.org/api/drupal/modules%21node%21node.module/function/template_preprocess_node/7
 */
function dlts_viewer_preprocess_node_dlts_book(&$vars) {
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
 * Dispatch thumbnails.
 *
 * @param string $identifier
 *   Resource identifier.
 */
function dlts_viewer_dispatch_thumbnails(object $entity) {

  global $base_url;

  $module = drupal_get_path('module', 'dlts_viewer');

  // Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  $title = $wrapper->field_title->value();

  $int_read_order = 0;

  if (isset($wrapper->field_read_order)) {
    $int_read_order = $wrapper->field_read_order->value();
  }

  $entity->read_order = ($int_read_order == 1) ? 'rtl' : 'ltr';

  // Check for mobile devices.
  // $is_mobile = dlts_viewer_is_mobile();

  $identifier = $wrapper->field_identifier->value();

  $sequence_count = (int) $wrapper->field_sequence_count->value();

  // $placeholder = "$base_url/$module/images/loadhold.png";

  $type = 'books';

  $sequence = 1;

  $service = "$base_url/api/image";

  $height = '230';

  $width = '150';

  $out = '<div class="node">';
  $out .= '<div class="thumbnails container" dir="' . $entity->read_order . '">';
  while (true) {
    $out .= '<div class="thumbnails item">'; // @todo: Set current-page
    $out .= "  <a href='$base_url/$type/$identifier/$sequence' data-sequence='$sequence' class='thumbnails sequence'>";
    $out .= "    <img class='thumbItem' height='$height' width='$width' loading='lazy' alt='' src='$service/$type/$identifier/$sequence/full/$width,/0/default.jpg'>";
    // $out .= "    <img class='thumbItemloader' src='$placeholder' height='$height' width='$width'>";
    // $out .= "    <img class='thumbItembg' src='$placeholder' height='$height' width='$width'>";
    // $out .= "    <span class='page-number'>$sequence</span>";
    $out .= '  </a>';
    $out .= '</div>';
    if ($sequence === $sequence_count) {
      break;
    }
    $sequence++;
  }
  $out .= '</div>';
  $out .= '</div>';

  return $out;
}

/**
 * Render full view.
 *
 * @param object $entity
 *   Entity to render.
 */
function dlts_viewer_full_book_view($entity) {

  $module_path = drupal_get_path('module', 'dlts_viewer');

  $inline = file_get_contents(DRUPAL_ROOT . '/' . $module_path . '/dist/viewer.css');

  drupal_add_css($inline, [ 'type' => 'inline', 'group' => CSS_THEME, 'every_page' => FALSE, ]);

  drupal_add_js(
    'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js',
    'external',
    [
      'group' => JS_LIBRARY,
      'weight' => -101,
    ]
  );

  drupal_add_js(
    'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/openseadragon.min.js',
    'external',
    [
      'group' => JS_LIBRARY,
      'weight' => -101,
    ]
  );

  drupal_add_js($module_path . '/dist/polyfill.bundle.js', [
    'type' => 'file',
    'scope' => 'footer',
  ]);

  drupal_add_js($module_path . '/dist/books.bundle.js', [
    'type' => 'file',
    'scope' => 'footer',
  ]);

  return node_view($entity, 'metadata', $entity->language);

}

/**
 * Render metadata view.
 *
 * @param object $entity
 *   Entity to render.
 */
function dlts_viewer_book_metadata_view($entity) {
  $element = dlts_viewer_book_metadata_display($entity);
  return drupal_render($element);
}

/**
 * Render metadata view.
 *
 * @param object $entity
 *   Entity to render.
 */
function dlts_viewer_book_metadata_display($entity) {
  return node_view($entity, 'metadata', $entity->language);
}

/**
 * Implements process_node_hook.
 */
function dlts_viewer_process_node_dlts_book(&$vars) {
  $args = arg();
  $count = count($args);
  // Set the correct template for this view.
  if ($count === 3 && $args[2] == 'display') {
    $vars['theme_hook_suggestions'][] = 'node__display';
  }
}

/**
 * Book dispatcher.
 *
 * @param object $entity
 *   Entity.
 * @param object $seq
 *   Mongo.
 */
function dlts_viewer_book_dispatcher($entity, $seq) {

  global $base_url;

  $arg = $seq;

  // Check if this collection has searchable PDFs.
  // Once the fn gets called, a global flag gets set
  // so that the template can use it without the
  // $entity context.
  dlts_viewer_pdf_is_searchable($entity);

  // Check for mobile devices.
  $is_mobile = dlts_viewer_is_mobile();

  // Get query parameters.
  // $query_parameters = drupal_get_query_parameters();

  // Test if resource, will return the mapped type of resource (e.g., books).
  $is_resource = dlts_viewer_is_resource();

  if ($is_resource) {
    dlts_viewer_resource_language_code($entity);
  }

  //Wrap book entity with Entity API wrapper.
  $wrapper = entity_metadata_wrapper('node', $entity);

  $entity->title = $wrapper->field_title->value();

  // Check if this book is part of a multi-volume series.
  $multivolume_book = dlts_viewer_is_multivolume_book($entity);

  // If the book is part of a multi-volume set, append volume value to entity title.
  if ($multivolume_book) {
    $multivolume_book_wrapper = entity_metadata_wrapper('node', $multivolume_book);
    // Get volume value.
    $volume_number_str = $multivolume_book_wrapper->field_volume_number_str->value();
    // Change entity title.
    $entity->title = t('@title @volume', [
      '@title' => $entity->title,
      '@volume' => $volume_number_str
    ]);
  }

  $entity->title = html_entity_decode($entity->title, ENT_QUOTES);

  // Set entity title.
  drupal_set_title($entity->title);

  // Set $identifier so that .tpl.php can use it.
  $entity->identifier = $wrapper->field_identifier->value();

  // Set language.
  _language_field($entity);

  // Check for type of request: 1) book page or 2) display pane.
  if (!is_array($arg) && $arg == 'display') {
    // Type of request.
    $display_type = 'book_metadata';
  } else {
    // Type of request.
    $display_type = 'book_page';
    // Default single page view.
    $is_single_page = TRUE;

    $sequence = $arg['sequence'];

    if (is_array($sequence)) {
      // Get the first page of the requested sequence.
      $entity->sequence = min($sequence);
      // $sequence_max = max($sequence);
      // $sequence_min = min($sequence);
      // Check if this is a double-page view.
      if (count($sequence) > 1) {
        $is_single_page = FALSE;
      }
    } else {
      // Get the first page of the requested sequence.
      // $entity->sequence = $sequence_max = $sequence_min = $sequence;
      $entity->sequence = $sequence;
      $is_single_page = TRUE;
    }

    $sequence_count = $wrapper->field_sequence_count->value();

    $int_read_order = 0;

    if (isset($wrapper->field_read_order)) {
      $int_read_order = $wrapper->field_read_order->value();
    }

    $entity->read_order = ($int_read_order == 1) ? 'rtl' : 'ltr';

    $next_page = $entity->sequence + 1;

    $previous_page = $entity->sequence - 1;

    $previous_page_active = TRUE;

    $next_page_active = TRUE;

    if ($previous_page < 1) {
      $previous_page = 1;
    }

    if ($next_page > $sequence_count) {
      $next_page = $sequence_count;
      $next_page_active = FALSE;
    }

    if ($entity->sequence == 1) {
      $previous_page_active = FALSE;
    }

    $button_previous = [
      'label' => t('Go to previous page'),
      'type' => $is_resource,
      'href' => '#previous',
      'identifier' => $entity->identifier,
      'sequence' => $entity->sequence,
      'count' => $sequence_count,
      'operation' => 'decrease',
      'class' => implode(' ', [
        'paging',
        'previous',
        $entity->read_order,
        ($entity->read_order === 'ltr') ? 'pager-left' : 'pager-right',
        ($previous_page_active ? 'active' : 'inactive'),
      ])
    ];

    $button_next = [
      'label' => t('Go to next page'),
      'type' => $is_resource,
      'href' => '#next',
      'identifier' => $entity->identifier,
      'sequence' => $entity->sequence,
      'count' => $sequence_count,
      'operation' => 'increase',
      'class' => implode(' ', [
        'paging',
        'next',
        $entity->read_order,
        ($entity->read_order === 'ltr') ? 'pager-right' : 'pager-left',
        ($next_page_active ? 'active' : 'inactive'),
      ])
    ];

    // Book page sequence number.
    $entity->book_page_sequence_number = $entity->sequence;

    $navbar_options = [
      'next' => $button_next,
      'previous' => $button_previous,
      'thumbnails' => [
        'label' => t('Select page'),
        'type' => $is_resource,
        'href' => '#thumbnails',
        'id' => 'button-thumbnails',
        'identifier' => $entity->identifier,
        'sequence' => $entity->sequence,
        'count' => $sequence_count,
        'operation' => 'increase',
        'class' => implode(' ', [
          'button',
          'thumbnails',
          'off',
        ])
      ],
      'togglepage' => [
        'id' => 'toggle-page',
        'label' => t('Toggle between single or double page'),
        'type' => $is_resource,
        'href' => '#toggle-view',
        'identifier' => $entity->identifier,
        'sequence' => $entity->sequence,
        'count' => $sequence_count,
        'operation' => 'toggleview',
        'class' => implode(' ', [
          'toggle',
          'active',
          ($is_single_page) ? 'page-double' : 'page-single',
        ]),
      ],
      'metadata' => [
        'label' => t('Show/hide metadata'),
        'operation' => 'togglemetadata',
        'href' => '#metadata',
        'class' => implode(' ', [
          'button',
          'metadata',
          (($is_mobile) ? 'off' : 'on')
        ]),
        'id' => 'button-metadata',
      ],
    ];

    $entity->navbar = theme('dlts_viewer_navbar', $navbar_options);

    $entity->pane_metadata_hidden = $is_mobile;

    $entity->sequence_count = $sequence_count;

    $entity->manifest = "$base_url/api/image/$is_resource/$entity->identifier/$entity->sequence/info.json";

    $entity->other_viewers = t('<a href="@url">View in Mirador</a>', [ '@url' => url("$base_url/api/embed/$entity->identifier") ]);

    $entity->presentation = t('<a href="@url">IIIF Presentation</a>', [ '@url' => url("$base_url/api/presentation/$is_resource/$entity->identifier/manifest.json") ]);

    $entity->slider = theme(
      'dlts_viewer_slider',
      [
        'id' => 'slider',
        'max' => $sequence_count,
        'min' => 1,
        'lang_dir' => $entity->read_order,
        'sequence' => $entity->sequence,
        'count' => $sequence_count,
      ]
    );

    $servie_url = "$base_url/api/image";

    $entity->book_page = theme(
      'dlts_viewer_openseadragon_image',
      [
        'id' => 'openseadragon1',
        'view' => 'single',
        'type' => $is_resource,
        'identifier' => $entity->identifier,
        'sequence' => $entity->sequence,
        'count' => $sequence_count,
        'manifest' => $entity->manifest,
        'service' => $servie_url ,
        'uri' => "$base_url/$is_resource/$entity->identifier",
        'dir' => $entity->read_order,
        'classList' => [
          'dlts_image_map',
          'dlts_viewer_map',
        ],
      ]
    );

    $entity->count = $sequence_count;

  }

  // Types of returns.
  switch ($display_type) {
    case 'book_page':
    case 'book_metadata':
      return dlts_viewer_full_book_view($entity);

    case 'book_metadata_pjax':
      return dlts_viewer_book_metadata_view($entity);
  }

}

/**
 * Route callback for the books edit page.
 * @link http://localhost:9000/books/{identifier}/edit
 */
function _dlts_viewer_book_edit_redirect($node) {
  if (is_object($node)) {
    $wrapper = entity_metadata_wrapper('node', $node);
    $identifier = $wrapper->field_identifier->value();
    if ($identifier) {
      $path = drupal_lookup_path('source', 'books/' . $identifier);
      if ($path) {
        drupal_goto($path . '/edit');
      }
    }
  }
  drupal_not_found();
}

function dlts_viewer_dispatch_books_index() {

  $view = views_get_view('books_by_collection');

  $view->set_current_page(1);

  $view->set_items_per_page(50);

  $view->execute();

  return $view->render();


}
