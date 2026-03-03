<?php

/**
 * Drupal 7 Content Type Cloner Script
 * ./vendor/bin/drush scr sites/all/modules/dlts_viewer/drush/create.serials.type.inc
 */

$source_type = 'dlts_book';
$target_type = 'dlts_serial';
$target_name = 'Serial';

// 1. Load Source and Create Target Content Type
$info = node_type_get_type($source_type);

if (!$info) {
  die("Error: Source content type '$source_type' not found.\n");
}

$new_type = clone $info;
$new_type->type = $target_type;
$new_type->name = $target_name;
$new_type->base = 'node_content';
$new_type->custom = 1;
$new_type->modified = 1;

node_type_save($new_type);
node_types_rebuild();
drupal_set_message("Base content type '$target_type' created.");

// 2. Clone Field Instances & Display Settings
$instances = field_info_instances('node', $source_type);
foreach ($instances as $field_name => $instance) {
  if (!field_info_instance('node', $field_name, $target_type)) {
    $instance['bundle'] = $target_type;
    field_create_instance($instance);
    drupal_set_message("Field '$field_name' cloned to $target_type.");
  }
}

// 3. Clone Variables
$variables = db_select('variable', 'v')
  ->fields('v', array('name'))
  ->condition('name', '%' . db_like($source_type) . '%', 'LIKE')
  ->execute()
  ->fetchCol();

foreach ($variables as $var_name) {
  $new_var_name = str_replace($source_type, $target_type, $var_name);
  
  // Skip the source pathauto pattern if it exists in the loop
  if ($var_name === "pathauto_node_{$source_type}_pattern") {
    continue; 
  }
  
  variable_set($new_var_name, variable_get($var_name));
}

// Manually set your new path pattern for the target type
variable_set("pathauto_node_{$target_type}_pattern", '');
variable_set("pathauto_node_{$target_type}_und_pattern", '');
variable_set("pathauto_node_{$target_type}_und_pattern", '');
variable_set("pathauto_node_{$target_type}_en_pattern", '');
variable_set("pathauto_node_{$target_type}_status", 0);

drupal_set_message("System variables cloned.");

// 4. Clone Permissions
$permissions_list = array(
  "create $source_type content",
  "edit own $source_type content",
  "edit any $source_type content",
  "delete own $source_type content",
  "delete any $source_type content",
);

$roles = user_roles();
foreach ($roles as $rid => $role_name) {
  $perms = user_role_permissions(array($rid => $role_name));
  $new_perms = array();
  
  foreach ($permissions_list as $perm) {
    if (!empty($perms[$rid][$perm])) {
      $new_perm_name = str_replace($source_type, $target_type, $perm);
      $new_perms[$new_perm_name] = TRUE;
    }
  }
  
  if (!empty($new_perms)) {
    user_role_change_permissions($rid, $new_perms);
  }
}

drupal_set_message("Permissions cloned for all roles.");

// Final Cleanup
drupal_flush_all_caches();

drupal_set_message("Cloning complete. Caches cleared.");

