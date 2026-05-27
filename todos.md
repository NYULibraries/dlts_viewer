- https://sites.dlib.nyu.edu/viewer/api/v1/objects
Warning: implode(): Invalid arguments passed in save_dlts_book() (line 318 of /www/sites/viewer/builds/viewer/sites/all/modules/dlts_viewer/inc/save/dlts_book.inc).

- https://sites.dlib.nyu.edu/viewer/books/aub_aco004373/display?lang=ar
Warning: strpos(): Empty needle in dlts_viewer_views_pre_render() (line 44 of /www/sites/viewer/builds/viewer/sites/all/modules/dlts_viewer/inc/views.inc).

- https://sites.dlib.nyu.edu/viewer/books/aub_aco004373/display?lang=ar
Warning: strpos(): Empty needle in dlts_viewer_views_pre_render() (line 44 of /www/sites/viewer/builds/viewer/sites/all/modules/dlts_viewer/inc/views.inc).

Notice: Undefined variable: template in dlts_viewer_embed_dispatcher() (line 224 of /var/www/html/viewer/sites/all/modules/dlts_viewer/inc/types/embed.inc).

Notice: Undefined variable: opts in dlts_viewer_embed_dispatcher() (line 224 of /var/www/html/viewer/sites/all/modules/dlts_viewer/inc/types/embed.inc).

pubdlib migth not be creating multivolumes for books.

pubdlib: Error for books:

    "handle": {
      "label": "Permanent Link",
      "value": [
        "https://hdl.handle.net/"
      ]
    },

I need a ticket to consolidate all the views how how the resources should look

Notice: Undefined variable: is_embed in include() (line 3 of /var/www/html/viewer/sites/all/modules/dlts_viewer/templates/page.tpl.php).
Notice: Undefined variable: top in include() (line 4 of /var/www/html/viewer/sites/all/modules/dlts_viewer/templates/page.tpl.php).
Notice: Undefined variable: resource_language_code in include() (line 2 of /var/www/html/viewer/sites/all/modules/dlts_viewer/templates/html.tpl.php).
Notice: Undefined variable: language_dir in include() (line 2 of /var/www/html/viewer/sites/all/modules/dlts_viewer/templates/html.tpl.php).
Notice: Undefined variable: resource_language_code in include() (line 2 of /var/www/html/viewer/sites/all/modules/dlts_viewer/templates html.tpl.php).
Notice: Undefined variable: pane_metadata_hidden in include() (line 11 of /var/www/html/viewer/sites/all/modules/dlts_viewer/templates html.tpl.php).

Serial:
- https://stage-sites.dlib.nyu.edu/viewer/api/embed/fales_ear000001
-- Make the handle url clickable
Image set:
- http://stage-sites.dlib.nyu.edu/viewer/api/embed/woj_mss092_ref14

--  I need to remove the title from the metadata.

Books:
- https://stage-sites.dlib.nyu.edu/viewer/api/embed/ifa_frdl_book000067/1
- https://stage-sites.dlib.nyu.edu/viewer/api/embed/aub_aco000056 (this one has the multivolume and available language plugins)


Update thumbnail: {{ with $thumbnailurl := urls.JoinPath $iiifpath $item.identifier "/1/full/,400/0/default.jpg" }}
https://stage-sites.dlib.nyu.edu/viewer/api/image/books/fales_earwest000001/1/full/!400,400/0/default.jpg


https://stage-sites.dlib.nyu.edu/viewer/api/v1/objects?collection=firework&rows=1000


Warning: strpos(): Empty needle in dlts_viewer_views_pre_render() (line 44 of /www/sites/viewer/builds/viewer/sites/all/modules/dlts_viewer/inc/views.inc).

https://localhost/viewer/api/v1/objects?collection=io&rows=1000

book: https://localhost/viewer/api/v1/objects?start=0&rows=5&searchTerm=fales_io_book000042
map: https://localhost/viewer/api/v1/objects?start=0&rows=5&searchTerm=fales_io_map000129

http://localhost:1234/book/woj_mss092_ref14/1

https://localhost/viewer/api/v1/objects?type=dlts_map


◐ Now I have a complete picture of the file. Let me analyze the issues systematically.

  The file is ~3075 lines, ~89.8 KB. Let me catalogue issues:

  1. Massive code duplication (biggest issue)

  The `switch` block for field processing is almost identical in 3+ functions:
  - `dlts_viewer_api_v1_map()` (lines ~1332-1520) 
  - `dlts_viewer_api_serial_json()` (lines ~1857-2049)
  - `dlts_viewer_api_book_json()` (lines ~2333-2525)


  - And the same pattern repeats in `dlts_viewer_api_photo_json()` as well

  All three have nearly identical `foreach` loops iterating through fields with the same `switch` cases for handling different field types. This entire block should be extracted into a helper function to eliminate the duplication.

  The `availableLanguages` filtering logic is also repeated across multiple functions, and the PDF file handling block appears in at least three places as well.

  Looking at the bugs now, there's a statement on line 109 that computes a value but doesn't assign it to anything — it should be storing the result in `$value`. Line 126 has an undefined variable issue where `$title` is checked but never defined, so the conditional will always fall back to `$node->title`. The `node_load()` calls on lines 577, 841, and 1016 are passing the wrong arguments — they're including the entity type when `node_load()` only takes the nid parameter.

  Continuing through the list, there's a potential notice on line 593 if the `$partners` array is empty when accessing the first element. Line 337 has `$viewerUrl` that might not be set depending on the `$result_type` value. The placeholder key in the database query around lines 700-701 is missing the colon prefix — it should be `:status` instead of `status`. There's a duplicate call to `$cursor->skip()` on lines 1220 and 1218. Line 2318 tries to unset a variable that was never initialized. And the `implode()` function on line 2787 has its arguments in the wrong order for newer PHP versions.

  Looking further, line 2756 references `$node['ticket']` but that variable is actually defined later at line 2768, so it's undefined at that point. There's also a return type inconsistency where a function documented to return `json|array` is returning `false` instead. I'm also seeing commented-out code blocks that should be cleaned up, particularly in the switch statement around lines 2818-2828 where there are old cases for handling different datasource types that are no longer being used.

  Beyond the syntax issues, there are several functions marked with `@todo` comments that need attention — one function is flagged as "not working" and relies on MongoDB which might be dead code, another is completely undocumented and needs proper documentation, and there's a geographic subject case that has an unresolved todo about how to handle it properly.

  I'm also noticing some other code quality issues: there are functions that depend on MongoDB operations that may no longer be active, inconsistent use of old `array()` syntax versus modern `[]` syntax scattered throughout, and some functions have excessive blank line spacing that makes them harder to read. There's also a hardcoded collection code value buried in one of the API functions, and the thinking cuts off while discussing security concerns.

  Looking at the security issues more closely, I see `filter_xss()` being applied to numeric values where type casting would be more appropriate, and `unserialize()` calls that lack the recommended validation whitelist for PHP 7+. Some loader functions are also bypassing Drupal's output pipeline entirely by directly echoing content and calling `exit(0)`, which should instead return proper responses through Drupal's delivery mechanisms. There appear to be duplicate SQL queries as well that could be consolidated.

  I'm also noticing some potential redundancy between the metadata functions—`dlts_viewer_book_metadata()` and `dlts_viewer_book()` seem to provide an older format compared to `dlts_viewer_api_book_json()`, so it's unclear if both are still necessary. Additionally, there's an issue in `dlts_viewer_api_photo_json()` where `$items` is being used without being initialized first.

● Here's a structured review of the issues:

  ---------------------------------------------------------------------------------------------------------------------------------

  inc/endpoints.inc — Code Review

  🐛 Bugs

  ┌────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
  │ Line           │ Issue                                                                                   │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 109            │ $raw_value['value']; — value is never assigned (missing $value =). Dead expression.     │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 126            │ $title is never defined; !empty($title) always falls back to $node->title.              │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 577, 841, 1016 │ node_load('node', $nid) — node_load() only takes a nid, not entity type first.          │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 593            │ $partners[0]['code'] crashes with notice/error if $partners is empty.                   │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 337            │ $viewerUrl is potentially undefined if $result_type is neither book nor map.            │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 700            │ Placeholder key 'status' is missing the colon — should be ':status'.                    │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1218–1220      │ $cursor->skip() called twice in _dlts_viewer_book_thumbnails_loader().                  │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1714           │ $items used but never initialized ($items = []) in dlts_viewer_api_photo_json().        │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2318           │ unset($parent_series) — variable is never defined.                                      │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2756           │ $node['ticket'] accessed before $node is defined (it's defined at line 2768).           │
  ├────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2787           │ implode($keys, ', ') — argument order deprecated; should be implode(', ', $keys).       │
  └────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

  ---------------------------------------------------------------------------------------------------------------------------------

  ♻️ Massive Duplication — Extract Into Helpers

  The field-processing switch block appears nearly identically in 3 functions:

   - dlts_viewer_api_v1_map() (~lines 1332–1520)
   - dlts_viewer_api_serial_json() (~lines 1857–2049)
   - dlts_viewer_api_book_json() (~lines 2333–2525)

  Each contains the same cases: collection, handle, partner, pdf_file, read_order, scan_order, subject, topic, etc. → Extract into _dlts_viewer_process_fields().

  The availableLanguages filtering loop is also duplicated across those three plus dlts_viewer_api_photo_json() → Extract into_dlts_viewer_filter_languages().

  The double SQL query build (count + results with identical JOINs) is duplicated in:

   - dlts_viewer_list_resource() (lines 174–270)
   - dlts_viewer_list_collections_collection() (lines 398–474)

  ---------------------------------------------------------------------------------------------------------------------------------

  🗑️ Dead Code to Remove

  ┌───────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Lines     │ Item                                                                                                         │
  ├───────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1176–1244 │ _dlts_viewer_book_thumbnails_loader() — doc says @todo not working, uses MongoDB mongodb_collection().       │
  ├───────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2818–2828 │ Commented-out case 'dlts_book' and case 'dlts_postcard' in dlts_viewer_api_v1_sequences().                   │
  ├───────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1356–1359 │ Commented-out case 'volume' block in dlts_viewer_api_v1_map().                                               │
  ├───────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 3035–3074 │ dlts_viewer_objects_sequences() — uses dlts_viewer_mongodb_load_resource_by_identifier(), likely dead.       │
  └───────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ---------------------------------------------------------------------------------------------------------------------------------

  ⚠️ @todo / Unresolved Issues

  ┌──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Line             │ Item                                                                                         │
  ├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 356–360          │ dlts_viewer_list_collections_collection() — marked undocumented.                             │
  ├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1382, 1900, 2376 │ case 'geographic_subject' just does unset() with @todo Find out how to deal with this.       │
  ├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 659              │ $collectionCode = 'aco' hardcoded in dlts_viewer_api_list_topics().                          │
  ├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2137, 1786       │ @todo will set later on using field_language_code — never addressed.                         │
  └──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘

  ---------------------------------------------------------------------------------------------------------------------------------

  🔐 Security / Safety

  ┌──────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
  │ Line                 │ Issue                                                                                 │
  ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 377–381              │ filter_xss() used on numeric rows/start params — use (int) cast instead.              │
  ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 1431, 1950           │ unserialize() called without ['allowed_classes' => false] (PHP 7+ best practice).     │
  ├──────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 1062–1067, 1111–1116 │ Loader functions do echo + exit(0) directly, bypassing Drupal's output pipeline.      │
  └──────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘

  ---------------------------------------------------------------------------------------------------------------------------------

  🧹 Style / Consistency

   - Mixed array() vs [] syntax (e.g., lines 692–711 use array(); the rest use []).
   - Excessive blank lines between every statement in some functions.
   - dlts_viewer_book() / dlts_viewer_book_metadata() appear to be an older metadata format vs dlts_viewer_api_book_json() —unclear if both code paths are still active.

  ---------------------------------------------------------------------------------------------------------------------------------

  Top priorities: fix the node_load() bug (affects multiple endpoints), eliminate the 3× duplicated field-processing switch, andremove the MongoDB-dependent dead code. Want me to start on any of these?
