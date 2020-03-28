<?php

function dlts_viewer_pdf_is_searchable ($entity = NULL) {
  $is_searchable = &drupal_static('is_searchable');
  if (!isset($is_searchable)) {
    $is_searchable = FALSE;
    if (!$entity) return $is_searchable;
    try {
      $wrapper = entity_metadata_wrapper('node', $entity);
      foreach ($wrapper->field_collection->value() as $node) {
        $cw = entity_metadata_wrapper('node', $node);
        if ($cw->field_searchable_pdf->value()) {
          $is_searchable = TRUE;
        }
      }
    } catch (Exception $e) {
      watchdog_exception('dlts_viewer', $e);
    }
  }
  return $is_searchable;
}

function dlts_viewer_content_by_field ($field_name) {
    $out = array();
    $field_name = filter_xss($field_name);
    $info = field_info_field($field_name);
    $query_parameters = drupal_get_query_parameters();
    if ($info) {
        $m = array_keys($info['storage']['details']['sql']['FIELD_LOAD_CURRENT']);
        $table = $m[0];
        $c = array_keys( $info['columns'] );
        $columns = $c[0];
        if  ( $columns == 'fid' ) return array();
        $seek = $field_name . '_' . $columns;
        $table = 'field_data_' . $field_name;
        $query = 'SELECT DISTINCT ' . $seek . ' AS value FROM {' . $table . '}';
        $result = db_query($query);
        foreach ( $result as $record ) {
            if ( $columns == 'nid' ) {
                $node = node_load( $record->value );
                $raw_value = $record->value;
                $value = $node->title;
            }
            elseif ( $columns == 'tid' ) {
                $term = taxonomy_term_load( $record->value );
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
 * Package and send page callback as JSON/JSONP.
 * See: http://api.drupal.org/api/drupal/includes--common.inc/function/drupal_deliver_html_page/7
 *
 * @param $page_callback_result
 * A keyed array to be converted into JSON
 */
function dlts_viewer_deliver_json($page_callback_result) {
    /** Send appropriate HTTP-Header for browsers and search engines. */
    global $language;
    drupal_add_http_header('Content-Language', $language->language);
    /** Menu status constants are integers; page content is a string or array. */
    if (is_int($page_callback_result)) {
        switch ($page_callback_result) {
            // 404 response
            case MENU_NOT_FOUND:
                drupal_add_http_header('Status', 'HTTP/1.1 404 Not Found');
                watchdog('Request not found', check_plain($_GET['q']), NULL, WATCHDOG_WARNING);
                $page_callback_result = array('msg' => t('404 Not Found'), 'code' => 404);
                break;
            // 403 response
            case MENU_ACCESS_DENIED:
                drupal_add_http_header('Status', 'HTTP/1.1 403 Forbidden');
                watchdog('dlts_utilities', check_plain($_GET['q']), NULL, WATCHDOG_WARNING);
                $page_callback_result = array('msg' => t('403 Forbidden'), 'code' => 403);
                break;
            // 503 response.
            case MENU_SITE_OFFLINE:
                drupal_add_http_header('Status', 'HTTP/1.1 503 Service unavailable');
                $page_callback_result = array('msg' => t('503 Service unavailable.'), 'code' => 503);
                break;
        }
    }
    // Only add Content-Length if we actually have any content. Some non-standard
    // servers get confused by Content-Length in at least HEAD/GET requests
    $content_length = strlen($data);
    if ($content_length > 0) {
        $defaults['Content-Length'] = 'Content-Length: ' . $content_length;
    }
    if (isset($page_callback_result)) {
        if (array_key_exists('callback', $_GET)) {
            drupal_add_http_header('Content-Type', 'text/javascript; charset=utf-8');
            echo sprintf('%s(%s);', filter_xss($_GET['callback'], array()), drupal_json_encode($page_callback_result));
        }
        else {
            drupal_add_http_header('Content-Type', 'application/json; charset=utf-8');
            echo drupal_json_encode($page_callback_result);
        }
    }
}

/**
 * List objects type
 * @return
 * Return Objects list that map the object type
 * to it's route.
 */
function dlts_viewer_object_types() {
    return array(
      'book' => 'books',
      'photo' => 'photos',
      'map' => 'maps'
    );
  }

/**
 * Check if DLTS Vierwer will render this object request
 *
 * @return
 * Return a boolean indicating whether this object request can be render 
 * by DLTS Vierwer.
 */
function dlts_viewer_is_resource() {
  // cache $is_resource
  $is_resource = &drupal_static('is_resource');
  if (!isset($is_resource)) {
    $route_argument = arg(0);
    // Get a list of objects that DLTS Vierwer render
    $object_types = dlts_viewer_object_types();
    // We use arguments in the URL to detect object type request
    // dlts_viewer_object_types return a Objects list that map the object type
    // to it's route. Get the route values as array
    $types = array_values($object_types);
    // check if DLTS Vierwer render the object requested
    $is_resource = in_array($route_argument, $types);
  }
  return $is_resource;
}

function dlts_viewer_is_mobile() {
  $is_mobile = &drupal_static('is_mobile');
  if (!isset($is_mobile)) {
    // default to desktop version
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
 * See http://mobiledetect.net/ 
 */
function dlts_viewer_mobile_detect() {
  try {
    require_once libraries_get_path('Mobile_Detect') . '/Mobile_Detect.php';
    return new Mobile_Detect;
  }
  catch (Exception $e) {
    watchdog_exception('dlts_viewer', $e);
  }
}

function dlts_viewer_is_pjax() {
    $is_pjax = &drupal_static('is_pjax');
    if (!isset($is_pjax) && function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['X-Pjax']) || isset($headers['X-PJAX'])) {
            drupal_add_http_header('uri', request_uri());
            $is_pjax = TRUE;
        }
        else {
            $params = drupal_get_query_parameters();
            if (isset($params['pjax'])) {
                drupal_add_http_header('uri', base_path() . request_uri());
                $is_pjax = TRUE;
            }
            else {
                $is_pjax = FALSE;
            }
        }
    }
    return $is_pjax;
}

function dlts_viewer_is_embed() {
    $is_embed = &drupal_static('is_embed');
    if (!isset($is_embed)) {
        $params = drupal_get_query_parameters();
        if (isset($params['embed'])) {
            if ($params['embed'] === '1' || $params['embed'] === 'true') {
                $is_embed = TRUE;
            }
            else {
                $is_embed = FALSE;
            }
        }
    }
    return $is_embed;
}

/** 
 * return language code of the resource (if available)
 */
function dlts_viewer_resource_language_code($vars = NULL) {
  $resource_language_code = &drupal_static('resource_language_code');
  if (!isset($resource_language_code)) {
    if (!empty($vars) && gettype($vars) == 'object') {
      // as of today, books are the only resource with the field `field_language_code`
      if ($vars->type == 'dlts_book') {
        $wrapper = entity_metadata_wrapper('node', $vars);
        $field_language_code = $wrapper->field_language_code->value();
        if ($field_language_code) {
           // Field allows unlimited number of values. This seem wrong. Shifts the first value 
           // of the array off and returns it
           // See: admin/structure/types/manage/dlts-book/fields/field_language_code
           $code = array_shift($field_language_code);
           $resource_language_code = mapLanguageCode($code);
        }
      }
    }
  }
  return $resource_language_code;
}

/** 
 * return language direction of the resource
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

function return_nodeid_json($dlts_id, $lang_code = NULL) {
    $langs = $lang_code ? array($lang_code) : array('und', 'en');
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node', '=')
        ->propertyCondition('language', $langs, 'IN')
        ->fieldCondition('field_identifier', 'value', $dlts_id, '=');
    $result = $query->execute();
    $nodeids = array();
    if (isset($result['node'])) {
        foreach ($result['node'] as $node) {
            $nodeids[] = $node->nid;
        }
    }
    echo drupal_json_encode($nodeids);
    die;
}

function return_page_nodeids_json($dlts_id) {
    // @TODO: broken, we no longer have this content types
    return;
    $page_types = array('dlts_book_page', 'dlts_book_stitched_page');
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
        ->propertyCondition('type', $page_types, 'IN')
        ->fieldCondition('field_is_part_of', 'value', $dlts_id, '=');
    $result = $query->execute();
    $nodeids = array();
    if (isset($result['node'])) {
        $nodes = node_load_multiple(array_keys($result['node']));
        foreach ($nodes as $node) {
            if ($node->type == 'dlts_book_page') {
                $sequence_number = field_get_items('node',
                    $node, 'field_sequence_number');
                $key = $sequence_number[0]['value'];
            }
            else {
                $left_seqnum_value = field_get_items('node', $node, 'field_sequence_number_left');
                $right_seqnum_value = field_get_items('node', $node, 'field_sequence_number_right');
                $key = $left_seqnum_value[0]['value'] . "-" . $right_seqnum_value[0]['value'];
            }
            $nodeids[$key] = $node->nid;
        }
    }
    drupal_json_output((object) $nodeids);
    exit;
}

// This is MAP from ISO 639-1 to ISO 639-2/B as described in the standard
// http://www.loc.gov/standards/iso639-2/php/code_list.php
function mapLanguageCode($lang = 'eng') {
    $MAPISO639 = array(
      "aar" => "aa",
      "abk" => "ab",
      "afr" => "af",
      "aka" => "ak",
      "alb" => "sq",
      "amh" => "am",
      "ara" => "ar",
      "arg" => "an",
      "arm" => "hy",
      "asm" => "as",
      "ava" => "av",
      "ave" => "ae",
      "aym" => "ay",
      "aze" => "az",
      "bak" => "ba",
      "bam" => "bm",
      "baq" => "eu",
      "bel" => "be",
      "ben" => "bn",
      "bih" => "bh",
      "bis" => "bi",
      "bos" => "bs",
      "bre" => "br",
      "bul" => "bg",
      "bur" => "my",
      "cat" => "ca",
      "cha" => "ch",
      "che" => "ce",
      "chi" => "zh",
      "chu" => "cu",
      "chv" => "cv",
      "cor" => "kw",
      "cos" => "co",
      "cre" => "cr",
      "cze" => "cs",
      "dan" => "da",
      "div" => "dv",
      "dut" => "nl",
      "dzo" => "dz",
      "eng" => "en",
      "epo" => "eo",
      "est" => "et",
      "ewe" => "ee",
      "fao" => "fo",
      "fij" => "fj",
      "fin" => "fi",
      "fre" => "fr",
      "fry" => "fy",
      "ful" => "ff",
      "geo" => "ka",
      "ger" => "de",
      "gla" => "gd",
      "gle" => "ga",
      "glg" => "gl",
      "glv" => "gv",
      "gre" => "el",
      "grn" => "gn",
      "guj" => "gu",
      "hat" => "ht",
      "hau" => "ha",
      "heb" => "he",
      "her" => "hz",
      "hin" => "hi",
      "hmo" => "ho",
      "hrv" => "hr",
      "hun" => "hu",
      "ibo" => "ig",
      "ice" => "is",
      "ido" => "io",
      "iii" => "ii",
      "iku" => "iu",
      "ile" => "ie",
      "ina" => "ia",
      "ind" => "id",
      "ipk" => "ik",
      "ita" => "it",
      "jav" => "jv",
      "jpn" => "ja",
      "kal" => "kl",
      "kan" => "kn",
      "kas" => "ks",
      "kau" => "kr",
      "kaz" => "kk",
      "khm" => "km",
      "kik" => "ki",
      "kin" => "rw",
      "kir" => "ky",
      "kom" => "kv",
      "kon" => "kg",
      "kor" => "ko",
      "kua" => "kj",
      "kur" => "ku",
      "lao" => "lo",
      "lat" => "la",
      "lav" => "lv",
      "lim" => "li",
      "lin" => "ln",
      "lit" => "lt",
      "ltz" => "lb",
      "lub" => "lu",
      "lug" => "lg",
      "mac" => "mk",
      "mah" => "mh",
      "mal" => "ml",
      "mao" => "mi",
      "mar" => "mr",
      "may" => "ms",
      "mlg" => "mg",
      "mlt" => "mt",
      "mon" => "mn",
      "nau" => "na",
      "nav" => "nv",
      "nbl" => "nr",
      "nde" => "nd",
      "ndo" => "ng",
      "nep" => "ne",
      "nno" => "nn",
      "nob" => "nb",
      "nor" => "no",
      "nya" => "ny",
      "oci" => "oc",
      "oji" => "oj",
      "ori" => "or",
      "orm" => "om",
      "oss" => "os",
      "pan" => "pa",
      "per" => "fa",
      "pli" => "pi",
      "pol" => "pl",
      "por" => "pt",
      "pus" => "ps",
      "que" => "qu",
      "roh" => "rm",
      "rum" => "ro",
      "run" => "rn",
      "rus" => "ru",
      "sag" => "sg",
      "san" => "sa",
      "sin" => "si",
      "slo" => "sk",
      "slv" => "sl",
      "sme" => "se",
      "smo" => "sm",
      "sna" => "sn",
      "snd" => "sd",
      "som" => "so",
      "sot" => "st",
      "spa" => "es",
      "srd" => "sc",
      "srp" => "sr",
      "ssw" => "ss",
      "sun" => "su",
      "swa" => "sw",
      "swe" => "sv",
      "tah" => "ty",
      "tam" => "ta",
      "tat" => "tt",
      "tel" => "te",
      "tgk" => "tg",
      "tgl" => "tl",
      "tha" => "th",
      "tib" => "bo",
      "tir" => "ti",
      "ton" => "to",
      "tsn" => "tn",
      "tso" => "ts",
      "tuk" => "tk",
      "tur" => "tr",
      "twi" => "tw",
      "uig" => "ug",
      "ukr" => "uk",
      "urd" => "ur",
      "uzb" => "uz",
      "ven" => "ve",
      "vie" => "vi",
      "vol" => "vo",
      "wel" => "cy",
      "wln" => "wa",
      "wol" => "wo",
      "xho" => "xh",
      "yid" => "yi",
      "yor" => "yo",
      "zha" => "za",
      "zul" => "zu",
    );
    if (strlen($lang) == 3 && isset($MAPISO639[$lang])) {
      return $MAPISO639[$lang];
    }
    return 'en';
  }