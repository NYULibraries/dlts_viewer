<?php
/**
 * @file
 * Books
 */
// function dlts_viewer_process_node_dlts_book(&$vars) {}
/**
 * Implements "a version" template_preprocess_node().
 * https://api.drupal.org/api/drupal/modules%21node%21node.module/function/template_preprocess_node/7
 * THIS is not a default Drupal hook
 */
function dlts_viewer_preprocess_node_dlts_map(&$vars) {
    /** We don't render a DLTS Book object, redirect to a "Book page" */
    if ($vars['view_mode'] == 'full') {
        $wrapper = entity_metadata_wrapper('node', $vars['node']);
        $identifier = $wrapper->field_identifier->value();
        drupal_goto('maps/' . $identifier . '/1');
    }
    $vars['language_dir'] = dlts_viewer_viewer_language($vars);
    if ($vars['view_mode'] == 'metadata') {
        $args = arg();
        $count = count($args);
        if ($count === 3 && $args[2] == 'display') {
            $vars['theme_hook_suggestions'][] = 'node__display';
        }

        if (dlts_viewer_is_pjax()) {
            $vars['theme_hook_suggestions'][] = 'page__viewer_pjax';
        }

    }
}

function dlts_viewer_full_map_view(&$entity) {
    $module_path = drupal_get_path('module', 'dlts_viewer');
    $js_common_config = array('type' => 'file', 'scope' => 'footer');
    $css_common_config = array('group' => CSS_DEFAULT, 'every_page' => TRUE);
    drupal_add_css($module_path . '/css/dlts_viewer.css', $css_common_config);
    drupal_add_js('http://yui.yahooapis.com/3.18.1/build/yui/yui-min.js', 'external', array('group' => JS_LIBRARY, 'weight' => -100));
    drupal_add_js($module_path . '/js/crossframe.js', $js_common_config);
    drupal_add_js($module_path . '/js/ui.keyboard.yui.js', $js_common_config);
    drupal_add_js($module_path . '/js/ui.map.components.yui.js', $js_common_config);
    drupal_add_js(variable_get('dlts_viewer_openlayers_source', 'sites/all/libraries/openlayers/build/OpenLayers.js'), array('group' => JS_LIBRARY));
    return node_view($entity , 'metadata', $entity->language);
}

function dlts_viewer_map_metadata_view($entity) {
    $element = node_view($entity, 'metadata');
    return drupal_render($element);
}

function dlts_viewer_pjax_map_view(&$entity) {
    $vars = array(
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
    );
    return theme('viewer_page', $vars);
}

function dlts_viewer_map_dispatcher($entity, $arg) {
    // check for mobile devices
    $is_mobile = dlts_viewer_is_mobile();    
    // check request type
    $is_pjax = dlts_viewer_is_pjax();
    drupal_set_title($entity->title);
    // wrapp map entity with Entity API wrapper
    $book_wrapper = entity_metadata_wrapper('node', $entity);
    // map identifier
    $identifier = $book_wrapper->field_identifier->value();
    // set $identifier so that .tpl.php can use it
    $entity->identifier = $identifier;
    //  URL
    $book_url = url('node/' . $entity->nid , array('absolute' => TRUE));
    // set $url so that .tpl.php can use it
    $entity->url = $book_url;
    // check for type of request: 1) map page or 2) display pane
    if (!is_array($arg) && $arg == 'display') {
        // type of request
        $display_type = 'map_metadata';
        if ($is_pjax) {
            $display_type = 'map_metadata_pjax';
        }
    }
    else {
        // type of reque
        $display_type = 'map_page';
        if ($is_pjax) {
            $display_type = 'map_page_pjax';
        }
        $button_metadata_options = array(
            'title' => t('Metadata'),
            'path' => 'node/' . $entity->nid,
            'attributes' => array(
                'data-title' => t('Metadata'),
                'title' => t('Show/hide metadata'),
                'class' => array('button', 'metadata', 'on'),
                'id' => array('button-metadata')
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
                'id' => array('button-fullscreen')
            ),
            'fragment' => 'fullscreen',
        );

        /** fullscreen button */
        $button_fullscreen = theme('dlts_viewer_navbar_item', $button_fullscreen_options);
        /** Metadata button */
        $button_metadata = theme('dlts_viewer_navbar_item', $button_metadata_options);

        $controlpanel_button = theme('dlts_viewer_controlpanel');
        /** map page sequence number */
        $entity->book_page_sequence_number = 1;
        $navbar_options = array(
            'nav_buttons_left' => array($button_metadata),
            'nav_buttons_right' => array($button_fullscreen),
            'control_panel' => $controlpanel_button,
        );
        $loading_options = array('sequence_number' =>1);
        $entity->navbar = theme('dlts_viewer_navbar', $navbar_options);
        $entity->book_page_data = $arg;
        $entity->button_metadata = $button_metadata;
        $entity->loading = theme('dlts_viewer_loading', $loading_options);
        $entity->pane_metadata_hidden = $is_mobile;
        $entity->sequence = 1;
        $entity->sequence_count = 1;
        $entity->pageView = 'single';
        $arg['pageView'] = $entity->pageView;
        $book_page_options = array(
            'file' => $arg
        );
        $entity->book_page = theme('dlts_viewer_openlayers_image', $book_page_options);
    }
    // types of returns
    switch ($display_type) {
        case 'map_page':
            return dlts_viewer_full_map_view($entity);
            break;
        case 'map_page_pjax':
            return dlts_viewer_pjax_map_view($entity);
            break;
        case 'map_metadata':
            return dlts_viewer_full_map_view($entity);
            break;
        case 'map_metadata_pjax':
            return dlts_viewer_map_metadata_view($entity);
            break;
    }
}
/**
 * Route callback for books edit page
 * http://{site}/books/{identifier}/edit
 */
function _dlts_viewer_map_edit_redirect($node) {
    if (is_object($node)) {
        $wrapper = entity_metadata_wrapper('node', $node);
        $identifier = $wrapper->field_identifier->value();
        if ($identifier) {
            $path = drupal_lookup_path('source', 'maps/' . $identifier);
            if ($path) {
                drupal_goto($path . '/edit');
            }
        }
    }
    drupal_not_found();
}
function dlts_viewer_map_metadata_display($node) {
    return node_view($node , 'metadata' , $node->language);
}

function _dlts_viewer_map_json ($entity) {

    header("Access-Control-Allow-Origin: *");

    header('Content-Type: application/json;charset=utf-8');

    module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.book');

    module_load_include('inc', 'dlts_utilities', 'inc/dlts_utilities.collection');

    // wrapp book entity with Entity API wrapper
    $map = entity_metadata_wrapper('node', $entity);

    // book identifier
    $identifier = $map->field_identifier->value();

    $title = $entity->title;

    $type = dlts_utilities_content_types_type($entity->type);

    $fields = array();

    foreach ($type['fields'] as $field) {
        $name = str_replace('field_', '', $field['field_name']);
        $raw_value = $map->$field['field_name']->value();
        if ($field['label'] != 'Representative Image') {
            if ($field['type'] == 'options_buttons') {
                $value = $field['settings']['allowed_values'][$raw_value];
            } elseif ($field['type'] == 'link_field' && isset($raw_value['url'])) {
                $value = $raw_value['url'];
            } elseif ($field['type'] == 'file_generic') {
                $value = array();
                foreach ((array)$raw_value as $pdf_file) {
                    $value[] = file_create_url($pdf_file['uri']);
                }
            } elseif ($field['type'] == 'date_text') {
                $raw_value['value'];
            } elseif ($field['type'] == 'taxonomy_autocomplete') {
                $value = array();
                foreach ($raw_value as $taxonomy) {
                    $value[] = $taxonomy->name;
                }
            } elseif ($field['label'] == 'Collection') {
                $value = array();

                foreach ($raw_value as $collection) {
                  $partner_id=$collection->field_partner['und'][0]['nid'];
                  $col_partner=node_load($partner_id);
                  $value[] =array('title'=>$collection->title,
                                   'identifier'=>$collection->field_identifier['und'][0]['value'],
                                   'code'=>$collection->field_code['und'][0]['value'],
                                   'name'=>$collection->field_name['und'][0]['value'],
                                   'type' => 'dlts_collection',
                                   'language'=> 'und',
                                   'partner' => array('title'=>$col_partner->title,
                                       'type'=>'dlts_partner',
                                       'language'=>'und',
                                       'identifier'=> $col_partner->field_identifier['und'][0]['value'],
                                       'code'=>$col_partner->field_code['und'][0]['value'],
                                       'name'=>$col_partner->field_name['und'][0]['value']));

                  }
            } elseif ($field['label'] == 'Provider') {
                $value = array();
                foreach ($raw_value as $partner) {
                    $value[] =array('title'=>$partner->title,
                        'identifier'=>$partner->field_identifier['und'][0]['value'],
                        'code'=>$partner->field_code['und'][0]['value'],
                        'name'=>$partner->field_name['und'][0]['value'],
                        'type' => 'dlts_partner',
                        'language'=> 'und');

                }
            } else {
                $value = $raw_value;
            }
            $fields[$name] = array('label' => $field['label'], 'value' => (array)$value);
        } else {
            $fields[$name]= array( 'isPartOf' => $identifier,
                'sequence' => array(1),
                'realPageNumber' => 1,
                'cm' => array( 'uri' =>$raw_value['uri']));
        }
    }

    echo json_encode(array(
        'entity_title' => !empty($title) ? $title : $entity->title,
        'identifier' => $fields['identifier']['value'][0],
        'entity_path' => url('maps/' . $identifier . '/1', array('absolute' => TRUE)),
        'base_url' => url('', array('absolute' => TRUE)),
        'entity_language' => $entity->language,
        'entity_status' => $map->status,
        'entity_type' => $map->type,
        'metadata' => $fields,
    ));

}