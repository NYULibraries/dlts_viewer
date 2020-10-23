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

function dlts_viewer_admin_list_topics($entity, $status = 1, $requestedLang = 'en') {
  /**
   * Include datasource helpers
   */
  module_load_include('inc', 'dlts_viewer', 'inc/datasource');

  drupal_set_title("$entity->title items by published date");
  
  $wrapper = entity_metadata_wrapper('node', $entity);

  $dates = dlts_viewer_batch_days($wrapper->field_code->value());

  $header = array(
    'Date', 
    'CSV',
  );
    
  $rows = array();

  foreach ($dates as $date) {
    $rows[] = array(
      $date,
      l('view', '/admin/list/topics/' . $wrapper->field_code->value() . '/' . $date),
    );
  }
  
  return theme('table', array('header' => $header, 'rows' => $rows));
    
}

// $entity (collection entity) $date to filter by
function dlts_viewer_admin_list_topics_($entity, $date, $requestedLang = 'en') {
  $wrapper = entity_metadata_wrapper('node', $entity);
  $status = 1;
  $sql = "
    SELECT 
      DISTINCT field_identifier.field_identifier_value identifier,
      DATE_FORMAT(
        FROM_UNIXTIME(node.created), 
        '%d-%m-%Y'
      ) date, 
      GROUP_CONCAT(
        DISTINCT topic.field_topic_value 
        SEPARATOR ' |*| '
      ) topic, 
      field_data_field_call_number.field_call_number_value call_number
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
    WHERE node.language = :language 
    AND DATE_FORMAT(FROM_UNIXTIME(node.created), '%d-%m-%Y') = :date
    AND node.status = :status
    GROUP BY field_identifier.field_identifier_value 
    ORDER BY node.created DESC";

  $sql_args = array(
    ':language' => $requestedLang, 
    ':collection_code' => $wrapper->field_code->value(),
    ':status' => $status,
    ':date' => $date,
  );
  
  $results = db_query($sql, $sql_args)->fetchAll();


  // send response headers to the browser
  header( 'Content-Type: text/csv' );
  header( 'Content-Disposition: attachment;filename=' . $date . '.csv');
  
  $fp = fopen('php://output', 'w');
  
  fputs($fp, $bom =( chr(0xEF) . chr(0xBB) . chr(0xBF) ));

  fputcsv($fp, array('Identifier', 'Date', 'Topic', 'Call_number'));
  
  foreach($results as $result) {
    fputcsv($fp, array_values((array) $result), ',');
  }

  fclose($fp);

  exit;

}
