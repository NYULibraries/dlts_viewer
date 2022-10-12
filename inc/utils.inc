<?php

/**
 * @file
 * Utils.
 */

/**
 * Set JSON-LD header with IIIF Presentation profile.
 * @link https://iiif.io/api/presentation/3.0/#63-responses
 */
function dlts_viewer_ldjson_iiif_presentation_3_output($var = NULL) {
  // We are returning JSON, so tell the browser.
  drupal_add_http_header('Content-Type', 'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json"');
  if (isset($var)) {
    echo drupal_json_encode($var);
  }
}

/**
 * Check if PDFs associated with resource are searchable.
 *
 * @return bool
 *   Return a boolean indicating whether the PDFs associated
 *   with resource are searchable.
 */
function dlts_viewer_pdf_is_searchable($entity = NULL) {
  $is_searchable = &drupal_static('is_searchable');
  if (!isset($is_searchable)) {
    $is_searchable = FALSE;
    if (!$entity) {
      return $is_searchable;
    }
    try {
      $wrapper = entity_metadata_wrapper('node', $entity);
      foreach ($wrapper->field_collection->value() as $node) {
        $cw = entity_metadata_wrapper('node', $node);
        if ($cw->field_searchable_pdf->value()) {
          $is_searchable = TRUE;
        }
      }
    }
    catch (Exception $e) {
      watchdog_exception('dlts_viewer', $e);
    }
  }
  return $is_searchable;
}

/**
 * Content by field.
 *
 * @return array
 *   Return content by field.
 */
function dlts_viewer_content_by_field($field_name) {
  $out = array();
  $field_name = filter_xss($field_name);
  $info = field_info_field($field_name);
  $query_parameters = drupal_get_query_parameters();
  if ($info) {
    $m = array_keys($info['storage']['details']['sql']['FIELD_LOAD_CURRENT']);
    $table = $m[0];
    $c = array_keys($info['columns']);
    $columns = $c[0];
    if ($columns == 'fid') {
      return array();
    }
    $seek = $field_name . '_' . $columns;
    $table = 'field_data_' . $field_name;
    $query = 'SELECT DISTINCT ' . $seek . ' AS value FROM {' . $table . '}';
    $result = db_query($query);
    foreach ($result as $record) {
      if ($columns == 'nid') {
        $node = node_load($record->value);
        $raw_value = $record->value;
        $value = $node->title;
      }
      elseif ($columns == 'tid') {
        $term = taxonomy_term_load($record->value);
        $raw_value = $record->value;
        $value = $term->name;
      }
      else {
        $raw_value = $value = $record->value;
      }
      $out[] = array(
        'value' => $value,
        'raw_value' => $raw_value,
      );
    }
  }
  return $out;
}

/**
 * List objects type.
 *
 * @return array
 *   Return Objects list that map the object type to it's route.
 */
function dlts_viewer_object_types() {
  return array(
    'book' => 'books',
    'photo' => 'photos',
    'map' => 'maps',
  );
}

/**
 * List objects type.
 *
 * @return array
 *   Return Objects list that map the object type to it's route.
 */
function dlts_viewer_resource_type($type = NULL) {
  $resources = [
    'dlts_book' => 'books',
    'dlts_photo_set' => 'photos',
    'dlts_photo' => 'photos',
    'dlts_map' => 'maps',
  ];
  if (isset($resources[$type])) {
    return $resources[$type];
  }
  return $resources;
}

/**
 * Check if DLTS Vierwer will render object.
 *
 * @return bool
 *   Return a boolean indicating whether object can be render.
 */
function dlts_viewer_is_resource() {
  $is_resource = &drupal_static('is_resource');
  if (!isset($is_resource)) {
    $route_argument = arg(0);
    // Get a list of objects that DLTS Vierwer render.
    $object_types = dlts_viewer_object_types();
    // We use arguments in the URL to detect object type request
    // dlts_viewer_object_types return a Objects list that map the object type
    // to it's route. Get the route values as array.
    $types = array_values($object_types);
    // Check if DLTS Vierwer render the object requested.
    if (in_array($route_argument, $types)) {
      $is_resource = $route_argument;
    }
  }
  return $is_resource;
}

/**
 * Check if the client is mobile.
 *
 * @return bool
 *   Return a boolean indicating whether this client is using a mobile device.
 */
function dlts_viewer_is_mobile() {
  $is_mobile = &drupal_static('is_mobile');
  if (!isset($is_mobile)) {
    // Default to desktop version.
    $is_mobile = FALSE;
    try {
      $detect = dlts_viewer_mobile_detect();
      if ($detect->isMobile()) {
        $is_mobile = TRUE;
      }
    }
    catch (Exception $e) {
      watchdog_exception('dlts_viewer', $e);
    }
  }
  return $is_mobile;
}

/**
 * Detects mobile clients using Mobile_Detect library.
 *
 * @link http://mobiledetect.net/.
 */
function dlts_viewer_mobile_detect() {
  try {
    require_once libraries_get_path('Mobile_Detect') . '/Mobile_Detect.php';
    return new Mobile_Detect();
  }
  catch (Exception $e) {
    watchdog_exception('dlts_viewer', $e);
  }
}

/**
 * Check if the client requested a embeded view.
 *
 * @return bool
 *   Return a boolean indicating whether this is a embeded view request.
 */
function dlts_viewer_is_embed() {
  $is_embed = TRUE;
}

/**
 * Return language code of the resource (if available).
 */
function dlts_viewer_resource_language_code($vars = NULL) {
  $resource_language_code = &drupal_static('resource_language_code');
  if (!isset($resource_language_code)) {
    if (!empty($vars) && gettype($vars) == 'object') {
      // As of today, books are the only resource with the
      // field `field_language_code`.
      if ($vars->type == 'dlts_book') {
        $wrapper = entity_metadata_wrapper('node', $vars);
        $field_language_code = $wrapper->field_language_code->value();
        if ($field_language_code) {
          // @todo Field allows unlimited number of values. This seem wrong. Shifts the first value.
          // of the array off and returns it.
          // Field allows unlimited number of values. This seem wrong.
          // Shifts the first value of the array off and returns it.
          // @link admin/structure/types/manage/dlts-book/fields/field_language_code
          $code = array_shift($field_language_code);
          $resource_language_code = dlts_viewer_map_language_code($code);
        }
      }
    }
  }
  return $resource_language_code;
}

/**
 * Return language direction of the resource.
 */
function dlts_viewer_viewer_language($vars = NULL) {
  $viewer_language = &drupal_static('viewer_language');
  if (!isset($viewer_language)) {
    if (!empty($vars) && isset($vars['type'])) {
      $obj_language = $vars['language'];
      if ($obj_language === LANGUAGE_NONE) {
        $viewer_language = 'ltr';
      }
      else {
        $language_list = language_list('enabled');
        $enabled_languages = array_pop($language_list);
        if (isset($enabled_languages[$obj_language])) {
          if ($enabled_languages[$obj_language]->direction) {
            $viewer_language = 'rtl';
          }
          else {
            $viewer_language = 'ltr';
          }
        }
        else {
          $viewer_language = 'rtl';
        }
      }
    }
    else {
      $viewer_language = 'ltr';
    }
  }
  return $viewer_language;
}

/**
 * MAP ISO 639-2 to ISO 639-1 as described in the standard.
 * @link http://www.loc.gov/standards/iso639-2/php/code_list.php
 *
 * @param string $lang
 *   ISO 639-2 string.
 *
 * @return string
 *   ISO 639-1 string.
 */
function dlts_viewer_map_language_code($lang = 'eng') {
  $map_iso_636 = array(
    'aar' => 'aa',
    'abk' => 'ab',
    'afr' => 'af',
    'aka' => 'ak',
    'alb' => 'sq',
    'amh' => 'am',
    'ara' => 'ar',
    'arg' => 'an',
    'arm' => 'hy',
    'asm' => 'as',
    'ava' => 'av',
    'ave' => 'ae',
    'aym' => 'ay',
    'aze' => 'az',
    'bak' => 'ba',
    'bam' => 'bm',
    'baq' => 'eu',
    'bel' => 'be',
    'ben' => 'bn',
    'bih' => 'bh',
    'bis' => 'bi',
    'bos' => 'bs',
    'bre' => 'br',
    'bul' => 'bg',
    'bur' => 'my',
    'cat' => 'ca',
    'cha' => 'ch',
    'che' => 'ce',
    'chi' => 'zh',
    'chu' => 'cu',
    'chv' => 'cv',
    'cor' => 'kw',
    'cos' => 'co',
    'cre' => 'cr',
    'cze' => 'cs',
    'dan' => 'da',
    'div' => 'dv',
    'dut' => 'nl',
    'dzo' => 'dz',
    'eng' => 'en',
    'epo' => 'eo',
    'est' => 'et',
    'ewe' => 'ee',
    'fao' => 'fo',
    'fij' => 'fj',
    'fin' => 'fi',
    'fre' => 'fr',
    'fry' => 'fy',
    'ful' => 'ff',
    'geo' => 'ka',
    'ger' => 'de',
    'gla' => 'gd',
    'gle' => 'ga',
    'glg' => 'gl',
    'glv' => 'gv',
    'gre' => 'el',
    'grn' => 'gn',
    'guj' => 'gu',
    'hat' => 'ht',
    'hau' => 'ha',
    'heb' => 'he',
    'her' => 'hz',
    'hin' => 'hi',
    'hmo' => 'ho',
    'hrv' => 'hr',
    'hun' => 'hu',
    'ibo' => 'ig',
    'ice' => 'is',
    'ido' => 'io',
    'iii' => 'ii',
    'iku' => 'iu',
    'ile' => 'ie',
    'ina' => 'ia',
    'ind' => 'id',
    'ipk' => 'ik',
    'ita' => 'it',
    'jav' => 'jv',
    'jpn' => 'ja',
    'kal' => 'kl',
    'kan' => 'kn',
    'kas' => 'ks',
    'kau' => 'kr',
    'kaz' => 'kk',
    'khm' => 'km',
    'kik' => 'ki',
    'kin' => 'rw',
    'kir' => 'ky',
    'kom' => 'kv',
    'kon' => 'kg',
    'kor' => 'ko',
    'kua' => 'kj',
    'kur' => 'ku',
    'lao' => 'lo',
    'lat' => 'la',
    'lav' => 'lv',
    'lim' => 'li',
    'lin' => 'ln',
    'lit' => 'lt',
    'ltz' => 'lb',
    'lub' => 'lu',
    'lug' => 'lg',
    'mac' => 'mk',
    'mah' => 'mh',
    'mal' => 'ml',
    'mao' => 'mi',
    'mar' => 'mr',
    'may' => 'ms',
    'mlg' => 'mg',
    'mlt' => 'mt',
    'mon' => 'mn',
    'nau' => 'na',
    'nav' => 'nv',
    'nbl' => 'nr',
    'nde' => 'nd',
    'ndo' => 'ng',
    'nep' => 'ne',
    'nno' => 'nn',
    'nob' => 'nb',
    'nor' => 'no',
    'nya' => 'ny',
    'oci' => 'oc',
    'oji' => 'oj',
    'ori' => 'or',
    'orm' => 'om',
    'oss' => 'os',
    'pan' => 'pa',
    'per' => 'fa',
    'pli' => 'pi',
    'pol' => 'pl',
    'por' => 'pt',
    'pus' => 'ps',
    'que' => 'qu',
    'roh' => 'rm',
    'rum' => 'ro',
    'run' => 'rn',
    'rus' => 'ru',
    'sag' => 'sg',
    'san' => 'sa',
    'sin' => 'si',
    'slo' => 'sk',
    'slv' => 'sl',
    'sme' => 'se',
    'smo' => 'sm',
    'sna' => 'sn',
    'snd' => 'sd',
    'som' => 'so',
    'sot' => 'st',
    'spa' => 'es',
    'srd' => 'sc',
    'srp' => 'sr',
    'ssw' => 'ss',
    'sun' => 'su',
    'swa' => 'sw',
    'swe' => 'sv',
    'tah' => 'ty',
    'tam' => 'ta',
    'tat' => 'tt',
    'tel' => 'te',
    'tgk' => 'tg',
    'tgl' => 'tl',
    'tha' => 'th',
    'tib' => 'bo',
    'tir' => 'ti',
    'ton' => 'to',
    'tsn' => 'tn',
    'tso' => 'ts',
    'tuk' => 'tk',
    'tur' => 'tr',
    'twi' => 'tw',
    'uig' => 'ug',
    'ukr' => 'uk',
    'urd' => 'ur',
    'uzb' => 'uz',
    'ven' => 've',
    'vie' => 'vi',
    'vol' => 'vo',
    'wel' => 'cy',
    'wln' => 'wa',
    'wol' => 'wo',
    'xho' => 'xh',
    'yid' => 'yi',
    'yor' => 'yo',
    'zha' => 'za',
    'zul' => 'zu',
  );

  if (is_array($lang)) {
    $lang = $lang[0];
  }

  if (strlen($lang) == 3 && isset($map_iso_636[$lang])) {
    return $map_iso_636[$lang];
  }
  return 'en';
}

/**
 * Check if is_serialized.
 * @link https://developer.wordpress.org/reference/functions/is_serialized/
 */
function dlts_viewer_is_serialized($data, $strict = TRUE) {
  // If it isn't a string, it isn't serialized.
  if (!is_string($data)) {
    return FALSE;
  }
  $data = trim($data);
  if ('N;' == $data) {
    return TRUE;
  }
  if (strlen($data) < 4) {
    return FALSE;
  }
  if (':' !== $data[1]) {
    return FALSE;
  }
  if ($strict) {
    $lastc = substr($data, -1);
    if (';' !== $lastc && '}' !== $lastc) {
      return FALSE;
    }
  }
  else {
    $semicolon = strpos($data, ';');
    $brace     = strpos($data, '}');
    // Either ; or } must exist.
    if (FALSE === $semicolon && FALSE === $brace) {
      return FALSE;
    }
    // But neither must be in the first X characters.
    if (FALSE !== $semicolon && $semicolon < 3) {
      return FALSE;
    }
    if (FALSE !== $brace && $brace < 4) {
      return FALSE;
    }
  }
  $token = $data[0];
  switch ($token) {
    case 's':
      if ($strict) {
        if ('"' !== substr($data, -2, 1)) {
          return FALSE;
        }
      }
      elseif (FALSE === strpos($data, '"')) {
        return FALSE;
      }

    case 'a':
    case 'O':
      return (bool) preg_match("/^{$token}:[0-9]+:/s", $data);

    case 'b':
    case 'i':
    case 'd':
      $end = $strict ? '$' : '';
      return (bool) preg_match("/^{$token}:[0-9.E+-]+;$end/", $data);
  }
  return FALSE;
}

function dlts_viewer_content_types_type($type) {
  $content_type = node_type_get_type($type);
  if (!$content_type) {
    return;
  }
  $out = $fields = array();
  $field_info_instances = field_info_instances('node', $content_type->type);
  foreach ($field_info_instances as $field_name => $field_info_instance) {
    $info = field_info_field($field_name);
    $fields[] = array(
      'label' => $field_info_instance['label'],
      'field_name' => $field_info_instance['field_name'],
      'type' => $field_info_instance['widget']['type'],
      'cardinality' => (string) $info['cardinality'],
      'settings' => array(
        'allowed_values' => isset($info['settings']['allowed_values']) ? $info['settings']['allowed_values'] : NULL,
      ),
    );
  }
  return array(
    'typeInfo' => $content_type,
    'fields' => $fields,
  );
}