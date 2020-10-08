<?php
/**
 * @file
 * Admin page.
 */
function dlts_viewer_admin($form, &$form_state) {
    include_once 'djatoka.inc' ;
    $djatoka = dlts_viewer_djatoka_request(array('uri' => 'http://memory.loc.gov/gmd/gmd433/g4330/g4330/np000066.jp2'));
    if (isset($djatoka['error'])) {
        drupal_set_message(t('Djatoka: Unable to request metadata from Djakota Jpeg 2000 Image Server. See: @message(code: @code)', array('@message' => $djatoka['message'], '@code' => $djatoka['code'] ) ), 'error' ) ;
    }
    $form['fileServer'] = array(
        '#type' => 'fieldset',
        '#title' => t('File Server'),
        '#collapsed' => FALSE,
        '#collapsible' => TRUE,
    );
    $form['fileServer']['dlts_viewer_fileserver_host'] = array(
        '#type' => 'textfield',
        '#title' => t('Service path'),
        '#default_value' => variable_get('dlts_viewer_fileserver_host', 'http://dl-img.home.nyu.edu/adore-djatoka' ) ,
        '#size' => 60,
        '#maxlength' => 256,
        '#description' => t("Set host name. <acronym title=\"for example\">e.g.</acronym>, http://dlib.nyu.edu/files"),
        '#required' => TRUE,
    );
    $form['djatoka'] = array(
        '#type' => 'fieldset',
        '#title' => t('Djatoka Jpeg 2000 Image Server'),
        '#collapsed' => FALSE,
        '#collapsible' => TRUE,
    );
    $form['djatoka']['dlts_viewer_djatoka_service'] = array(
        '#type' => 'textfield',
        '#title' => t('Service path'),
        '#default_value' => variable_get('dlts_viewer_djatoka_service', 'http://dl-img.home.nyu.edu/adore-djatoka'),
        '#size' => 60,
        '#maxlength' => 256,
        '#description' => t("Set host name. <acronym title=\"for example\">e.g.</acronym>, http://myhost.bobst.nyu.edu:8080/adore-djatoka"),
        '#required' => TRUE,
    );
    $form['openlayers'] = array(
        '#type' => 'fieldset',
        '#title' => t('OpenLayers'),
        '#collapsed' => FALSE,
        '#collapsible' => TRUE,
    );
    $available_files_lib = file_scan_directory(libraries_get_path('openlayers') . '/lib', '/.*\.js$/', array('recurse' => FALSE));
    $available_files_build = file_scan_directory(libraries_get_path('openlayers') . '/build', '/.*\.js$/', array('recurse' => FALSE));
    $available_files = array_merge( (array)$available_files_lib, (array) $available_files_build);
    $js = array();
    foreach ($available_files as $key => $value) {
        $js[$key] = $value->uri;
    }
    $form['openlayers']['dlts_viewer_openlayers_source'] = array(
        '#type' => 'radios',
        '#title' => t('Source filepath'),
        '#default_value' => variable_get('dlts_viewer_openlayers_source', 'sites/all/libraries/openlayers/lib/OpenLayers.js'),
        '#options' => $js,
    );
    $form['#submit'][] = 'dlts_viewer_image_service_admin_settings_submit';
    return system_settings_form($form);
}
/**
 * Form submit handler for dlts_viewer admin settings form.
 */
function dlts_viewer_image_service_admin_settings_submit($form, &$form_state) {
    $form_state['values']['dlts_viewer_djatoka_service'] = rtrim($form_state['values']['dlts_viewer_djatoka_service'], '/');
    $form_state['values']['dlts_viewer_fileserver_host'] = rtrim($form_state['values']['dlts_viewer_fileserver_host'], '/');
}

function dlts_viewer_admin_list_topics($start = 0, $length = 25, $requestedLang = 'en') {
  
    drupal_set_title('List of Arabic Collections Online books');
  
    $request_uri = drupal_parse_url(request_uri());
    
    $filter_date = '0';
    
    if (isset($request_uri['query'])) {
      if (isset($request_uri['query']['date'])) {
        $filter_date = filter_xss($request_uri['query']['date']);
      }
    }  
    
    $status = 1;
  
    $collection_code = 'aco';
  
    $sql_count = "
      SELECT 
      COUNT(node.nid) as count
      FROM node
      LEFT JOIN field_data_field_collection collection ON node.nid = collection.entity_id
      INNER JOIN field_data_field_code code ON collection.field_collection_nid = code.entity_id AND code.field_code_value = :collection_code
      WHERE node.language = :language " .
      (($filter_date != 0) ? "AND DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') = :date" : "")     
      . " AND node.status = :status
      GROUP BY node.nid";
  
    $sql_dates = "
      SELECT 
      DISTINCT DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') created
      FROM node
      LEFT JOIN field_data_field_collection collection ON node.nid = collection.entity_id
      INNER JOIN field_data_field_code code ON collection.field_collection_nid = code.entity_id AND code.field_code_value = :collection_code
      WHERE node.language = :language
      AND node.status = :status
      ORDER BY node.created DESC";
  
    $sql = "
      SELECT 
        DISTINCT node.nid, 
        field_identifier.field_identifier_value identifier, 
        node.title, 
        node.created, 
        DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') date, 
        GROUP_CONCAT(DISTINCT topic.field_topic_value SEPARATOR ' |*| ') topic, 
        field_data_field_call_number.field_call_number_value,
        collection.field_collection_nid,
        code.field_code_value code
      FROM node
      LEFT JOIN field_data_field_identifier field_identifier
        ON node.nid = field_identifier.entity_id
      LEFT JOIN field_data_field_topic topic 
        ON node.nid = topic.entity_id
      LEFT JOIN field_data_field_call_number 
        ON node.nid = field_data_field_call_number.entity_id
      LEFT JOIN field_data_field_collection collection 
        ON node.nid = collection.entity_id
      INNER JOIN field_data_field_code code 
        ON collection.field_collection_nid = code.entity_id 
        AND code.field_code_value = :collection_code
      WHERE node.language = :language " . 
      (($filter_date != 0) ? "AND DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') = :date" : "") 
      . " AND node.status = :status
      GROUP BY field_identifier.field_identifier_value 
      ORDER BY node.created DESC";

    $sql_args = array(
      ':language' => $requestedLang, 
      ':collection_code' => $collection_code,
      ':status' => $status,
    );
  
    if ($filter_date != 0) {
      $sql_args[':date'] = $filter_date;
    }
  
    $countnode = db_query($sql_count, $sql_args)->fetchAll();
  
    $dates = db_query($sql_dates, array(
      ':language' => $requestedLang, 
      ':collection_code' => $collection_code, 
      ':status' => $status
      )
    )->fetchAll();
  
    $selected = 0;
  
    $filter_dates = array();
  
    $filter_dates['0'] = '-- include all --';
  
    foreach ($dates as $date) {
      $filter_dates[$date->created] = $date->created;
      if ($date->created == $filter_date) {
        $selected = $filter_date;
      }
    }

    $render_array = array(
      '#id' => 'date-selection',
      '#theme' => 'select',
      '#options' => $filter_dates,
      '#value' => $selected,
    );
  
    $output = '<strong>Filter by date</strong> ' . drupal_render($render_array);
  
    $output .= '<br/><br/>';
  
    $nodes_count = count($countnode);
  
    $output .= "<h4><strong><em>$nodes_count</em> books found</strong></h4>";
  
    $output .= '<br/>';
  
    // Initialize the pager
    $current_page = pager_default_initialize($nodes_count, $length);
  
    $results = db_query_range($sql, $current_page * $length, $length, $sql_args)->fetchAll();
  
    $header = array(
      'Identifier', 
      'Topic',
      'Call number',
      // 'Code',
      'Modified',
    );
    
    $rows = array();
  
    foreach ($results as $result) {
      $rows[] = array(
        l($result->identifier, "books/$result->identifier/1"),
        $result->topic,
        $result->field_call_number_value,
        date('F jS, Y', $result->created),
      );
    }
  
    drupal_add_js('jQuery(document).ready(function () { 
      jQuery("#date-selection").change(
        function() {
          location.replace(`${location.origin}${location.pathname}?date=${jQuery(this).val()}`)
        }
      )
     });', array(
      'type' => 'inline',
      'scope' => 'footer',
      'weight' => 5,
    ));
  
    // Show the appropriate items from the list
    $output .= theme('table', array('header' => $header, 'rows' => $rows));
    // Show the pager
    $output .= theme('pager', array('quantity', count($countnode)));
  
    return $output;
    
  }
