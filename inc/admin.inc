<?php
/**
 * @file
 * Admin page.
 */
function dlts_viewer_admin($form, &$form_state) {

    $form['fileServer'] = array(
        '#type' => 'fieldset',
        '#title' => t('File Server'),
        '#collapsed' => FALSE,
        '#collapsible' => TRUE,
    );

    $form['fileServer']['dlts_viewer_fileserver_host'] = array(
        '#type' => 'textfield',
        '#title' => t('Service path'),
        '#default_value' => variable_get('dlts_viewer_fileserver_host', 'http://dl-img.home.nyu.edu/adore-djatoka'),
        '#size' => 60,
        '#maxlength' => 256,
        '#description' => t("Set host name. <acronym title=\"for example\">e.g.</acronym>, http://dlib.nyu.edu/files"),
        '#required' => TRUE,
    );

    $form['#submit'][] = 'dlts_viewer_image_service_admin_settings_submit';

    return system_settings_form($form);

}
/**
 * Form submit handler for dlts_viewer admin settings form.
 */
function dlts_viewer_image_service_admin_settings_submit($form, &$form_state) {
    $form_state['values']['dlts_viewer_fileserver_host'] = rtrim($form_state['values']['dlts_viewer_fileserver_host'], '/');
}