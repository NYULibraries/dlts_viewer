<?php

/**
 * Create a taxonomy term and return the tid.
 */
function create_taxonomy_term($name, $vid, $parent_id = 0) {
  $term = new stdClass();
  $term->name = $name;
  $term->vid = $vid;
  $term->parent = [ $parent_id ];
  taxonomy_term_save($term);
  return $term->tid;
}
