<?php

function type_load($type) {
  $types = array(
    'books',
    'maps',
    'photos',
    'postcards',
  );
  if (in_array($type, $types)) {
    return $type;
  }
  return FALSE;
}
