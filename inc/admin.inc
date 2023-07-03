<?php

/**
 * @file
 * Admin page.
 */
function dlts_viewer_admin($form, &$form_state) {
  
  $form['fileserver'] = [
    '#type' => 'fieldset',
    '#title' => t('File Server'),
    '#collapsed' => FALSE,
    '#collapsible' => TRUE,
  ];

  $form['fileserver']['dlts_viewer_fileserver_host'] = [
    '#type' => 'textfield',
    '#title' => t('Service path'),
    '#default_value' => variable_get('dlts_viewer_fileserver_host', 'https://dlib.nyu.edu/files'),
    '#size' => 60,
    '#maxlength' => 256,
    '#description' => t("Set host name. <acronym title='for example'>e.g.</acronym>, https://dlib.nyu.edu/files"),
    '#required' => TRUE,
  ];

  $form['imageserver'] = [
    '#type' => 'fieldset',
    '#title' => t('IIIF Image Server'),
    '#collapsed' => FALSE,
    '#collapsible' => TRUE,
  ];
    
  $form['imageserver']['dlts_viewer_image_service'] = [
    '#type' => 'textfield',
    '#title' => t('Service path'),
    '#default_value' => variable_get('dlts_viewer_image_service', 'https://image1.dlib.nyu.edu:8183'),
    '#size' => 60,
    '#maxlength' => 256,
    '#description' => t("Set host name. <acronym title='for example'>e.g.</acronym>, http://HOST/iiif"),
    '#required' => TRUE,
  ];

  $form['openseadragon'] = [
    '#type' => 'fieldset',
    '#title' => t('OpenSeadragon'),
    '#collapsed' => FALSE,
    '#collapsible' => TRUE,
  ];

  $form['openseadragon']['dlts_viewer_openseadragon_cdn_code'] = [
    '#type' => 'textfield',
    '#title' => t('Code'),
    '#default_value' => variable_get('dlts_viewer_openseadragon_cdn_code', 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/openseadragon.min.js'),
    '#required' => TRUE,
    '#size' => 256,
    '#maxlength' => 2048 ,    
  ];

  $form['openseadragon']['dlts_viewer_openseadragon_cdn_images'] = [
    '#type' => 'textfield',
    '#title' => t('Images'),
    '#default_value' => variable_get('dlts_viewer_openseadragon_cdn_images', 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/'),
    '#required' => TRUE,
    '#size' => 256,
    '#maxlength' => 2048 ,    
  ];  

  $form['#submit'][] = 'dlts_viewer_image_service_admin_settings_submit';

  return system_settings_form($form);

}

/**
 * Form submit handler for dlts_viewer admin settings form.
 */
function dlts_viewer_image_service_admin_settings_submit($form, &$form_state) {
  $form_state['values']['dlts_viewer_image_service'] = rtrim($form_state['values']['dlts_viewer_image_service'], '/');
  $form_state['values']['dlts_viewer_fileserver_host'] = rtrim($form_state['values']['dlts_viewer_fileserver_host'], '/');
}
