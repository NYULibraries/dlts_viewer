<?php

/**
 * @file
 * API Search callbacks.
 */

/**
 * Search using Solr.
 * @link http://localhost:9000/api/v1/search?query=*&wt=json&fl=ss_representative_image,ss_title_long,ss_ar_title_long,ss_book_identifier,sm_author,ss_uri,sm_publisher,ss_pubdate,iass_pubyear,sm_collection_partner_label,sm_field_topic,ss_call_number,zm_subject,zm_partner,ss_publocation,ss_ar_title,sm_ar_author,sm_ar_publisher,sm_ar_publication_date,sm_ar_partner,sm_ar_subject,ss_ar_sauthor,ss_longlabel,ss_sauthor,sm_ar_sauthor,ss_ar_publocation,ss_ar_publication_location,sm_ar_topic,ds_created,zm_pdf_lo,zm_pdf_hi,score&fq=bundle:dlts_book&fq=sm_collection_code:aco&fq=ss_language:en&rows=10&start=0&sort=ds_created%20desc
 */
function dlts_viewer_search_json() {

  global $base_url;

  $index_name = 'viewer';

  $_e = variable_get('env', 'stage');

  $discovery = variable_get('discovery', []);

  if (empty($discovery)) {
    return [
      'error' => "Discovery configuration error.",
    ];
  }

  if (!empty($discovery) && isset($discovery[$index_name]) && isset($discovery[$index_name][$_e])) {
    $solrurl = $discovery[$index_name][$_e]['url'];
  }

  $query_parameters = explode('&', $_SERVER['QUERY_STRING']);

  $queryArray = [];

  $queryArray[] = 'wt=json';

  $omitHeader = true;

  foreach ($query_parameters as $parameters) {
    $explodeParameters = explode('=', $parameters);
    if (is_array($explodeParameters) && count($explodeParameters) == 2) {
      if ($explodeParameters[0] == 'query') {
        $queryArray[] = 'q=' . $explodeParameters[1];
      } elseif ($explodeParameters[0] == 'wt') {
        continue;
      } elseif ($explodeParameters[0] == 'omitHeader' && $explodeParameters[1] == 'false') {
        $omitHeader = false;
        continue;
      } elseif ($explodeParameters[0] == 'index') {
        $param = filter_xss($explodeParameters[1]);
        if (isset($discovery[$param]) && isset($discovery[$param][$_e])) {
          $solrurl = $discovery[$param][$_e]['url'];
        } else {
          return [
            'error' => "Solr \"$param\" does not exists.",
          ];
        }
        continue;
      } else {
        $queryArray[] = $explodeParameters[0] . '=' . $explodeParameters[1];
      }
    }
  }

  $queryArray[] = 'omitHeader=false';

  $queryString = implode('&', $queryArray);

  $requestUrl = $solrurl . '/select?' . $queryString;

  $request = drupal_http_request($requestUrl, [ 'timeout' => 15.0, 'method' => 'GET', 'headers' => [ 'User-Agent' => 'DLTS Viewer (+' . $base_url . ')' ] ]);

  if ($request->code != '200') {
    return [
      'error' => 'Solr request failed.',
      'request' => $request,
    ];
  }

  $data = json_decode($request->data);

  foreach ($data->response->docs as $doc) {
    if (isset($doc->zs_data)) {
      $zs_data = json_decode('[' . $doc->zs_data . ']');
      $doc->zs_data = $zs_data[0];
    }
    if (isset($doc->zm_partner)) {
      $zm_partners = [];
      foreach ($doc->zm_partner as $zm_partner) {
        $zm_partners[] = json_decode($zm_partner);
      }
      $doc->zm_partner = $zm_partners;
    }
    if (isset($doc->zm_pdf_hi)) {
      $zm_pdf_his = [];
      foreach ($doc->zm_pdf_hi as $zm_pdf_hi) {
        $zm_pdf_hi_decoded = json_decode($zm_pdf_hi);
        if (isset($zm_pdf_hi_decoded->filesize)) {
          $zm_pdf_hi_decoded->filesizeHuman = field_fileserver_human_filesize($zm_pdf_hi_decoded->filesize);
          $zm_pdf_his[] = $zm_pdf_hi_decoded;
        }
      }
      $doc->zm_pdf_hi = $zm_pdf_his;
    }
    if (isset($doc->zm_pdf_lo)) {
      $zm_pdf_los = [];
      foreach ($doc->zm_pdf_lo as $zm_pdf_lo) {
        $zm_pdf_lo_decoded = json_decode($zm_pdf_lo);
        if (isset($zm_pdf_lo_decoded->filesize)) {
          $zm_pdf_lo_decoded->filesizeHuman = field_fileserver_human_filesize($zm_pdf_lo_decoded->filesize);
          $zm_pdf_los[] = $zm_pdf_lo_decoded;
        }
      }
      $doc->zm_pdf_lo = $zm_pdf_los;
    }
    if (isset($doc->zm_provider)) {
      $zm_providers = [];
      foreach ($doc->zm_provider as $zm_provider) {
        $zm_providers[] = json_decode($zm_provider);
      }
      $doc->zm_provider = $zm_providers;
    }
    if (isset($doc->zm_subject)) {
      $zm_subjects = [];
      foreach ($doc->zm_subject as $zm_subject) {
        $zm_subjects[] = json_decode($zm_subject);
      }
      $doc->zm_subject = $zm_subjects;
    }
    if (isset($doc->contributors)) {
      $contributors = [];
      foreach ($doc->contributors as $contributor) {
        $contributors[] = json_decode($contributor);
      }
      $doc->contributors = $contributors;
    }
    if (isset($doc->reviews)) {
      $reviews = [];
      foreach ($doc->reviews as $review) {
        $reviews[] = json_decode($review);
      }
      $doc->reviews = $contributors;
    }
    if (isset($doc->_version_)) {
      unset($doc->_version_);
    }
  }

  if ($omitHeader) {
    return $data->response;
  } else {
    return $data;
  }

}
