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

◐ Now I have a comprehensive picture. Let me compile the full updated review and present it clearly.

  Here are all the confirmed issues:

  Bugs:
  1. Line 114: `date_text` branch — `$value` is undefined/stale when `$type == 'date_text'` (commented-out assignment `// $raw_value['value'];`)
  2. Line 433: `$partners[0]` — unchecked empty array crash in `dlts_viewer_list_collections_collection()`; if node has no partner, `$partners` is empty and this crashes
  3. Line 604: (approximate — in `dlts_viewer_list_collections`) — similar `$partners[0]` issue


  4. Line 711: `'status' => $status` — missing colon in the placeholder key for `db_query_range()`, so the status parameter never gets bound to the query
  5. Line 1083: `_dlts_viewer_book_thumbnails_loader()` — `$cursor->skip()` called twice, causing a double-skip bug
  6. Line 1100: `'per_page '` — trailing space in the array key, a typo that will break the expected parameter name
  7. Line 1634: `$items[]` used without initialization in `dlts_viewer_api_photo_json` — if the loop doesn't execute, `$items` is undefined when referenced later
  8. Line 1940: `unset($parent_series)` in `dlts_viewer_api_book_json()` — the variable was never defined, so this is a harmless no-op that should be removed
  9. Line 2178: `$node['ticket']` accessed before `$node` is defined as an array at line 2190, reading from an undefined variable instead
  10. Line 2209: `implode()` called with deprecated argument order — should swap to `implode(', ', $keys)` format, same issue with `$expected_keys`

  There's also dead code scattered throughout: `_dlts_viewer_book_thumbnails_loader()` marked as not working and never called, `dlts_viewer_objects_sequences()` using MongoDB functions with no documentation, and commented-out cases in the sequences API function.

  On the security side, I'm noticing `filter_xss()` being applied to numeric values that should just be cast to integers, and an `unserialize()` call missing the `allowed_classes` whitelist option. For code style, there's inconsistent use of `array()` versus `[]` syntax scattered across multiple functions, and the resource and collection listing functions are building their SQL queries in a way that could be cleaned up.

  I also see some quirks like a hardcoded collection code with no explanation and a trailing space in an array key that's probably unintentional. Let me organize these findings clearly.

● Here's the complete updated issue list for the current state of the file:

  ---------------------------------------------------------------------------------------------------------------------------------

  endpoints.inc — Updated Review

  🐛 Bugs

  ┌───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Line  │ Issue                                                                                                              │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~114  │ date_text branch has // $raw_value['value']; commented out → $value is undefined/stale from previous loop          │
  │       │ iteration                                                                                                          │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼
  │ ~604  │ $partners[0]['code'] in dlts_viewer_list_collections() — same unchecked empty array crash                          │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~711  │ 'status' => $status in dlts_viewer_api_list_topics() — missing : prefix; compare with the correct ':status' at     │
  │       │ line 720. The placeholder is never bound, breaking the status filter                                               │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~1634 │ $items[] in dlts_viewer_api_photo_json() — $items never initialized before the for loop; if $imageCount == 0, loop │
  │       │ never runs and $items is undefined at line 1656                                                                    │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~1940 │ unset($parent_series) in dlts_viewer_api_book_json() — $parent_series is never defined; harmless no-op but dead    │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~2178 │ $node['ticket'] accessed before $node is defined as an array (line ~2190)                                          │
  ├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~2209 │ implode($keys, ', ') — wrong argument order (deprecated in PHP 7.4, fatal in PHP 8+); should be implode(', ',      │
  │       │ $keys)                                                                                                             │
  └───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  💀 Dead Code

  ┌─────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────┐
  │ Location                                │ Issue                                                                            │
  ├─────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ _dlts_viewer_book_thumbnails_loader()   │ Marked @todo not working; uses mongodb_collection() and $cursor->skip() (called  │
  │ (~1039–1107)                            │ twice — double-skip bug at ~1083). Should be removed.                            │
  ├─────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ dlts_viewer_objects_sequences()         │ Uses dlts_viewer_mongodb_load_resource_by_identifier() — MongoDB-dependent, no   │
  │ (~2455–2494)                            │ docblock, effectively dead                                                       │
  ├─────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┤
  │ Lines ~2241–2242                        │ Commented-out case 'dlts_book' in dlts_viewer_api_v1_sequences() — should be     │
  │                                         │ removed or restored                                                              │
  └─────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────┘

  Also: both dead functions have bugs internally (double skip, 'per_page ' typo) that confirm they haven't been touched in a longtime.

  🔐 Security/Safety

  ┌──────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Line     │ Issue                                                                                                           │
  ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~384–388 │ filter_xss() applied to rows/start values already confirmed numeric by is_numeric() — use (int) cast instead    │
  ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ~1284    │ unserialize($value['data']) with no ['allowed_classes' => false] option                                         │
  └──────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  🧹 Style/Cleanup

   - Mixed array() vs [] — dlts_viewer_api_list_topics() uses array() for its placeholders (lines ~707–740); thumbnails loaderalso uses array(). All other code uses [].
   - $collectionCode = 'aco' hardcoded in dlts_viewer_api_list_topics() with no explanation — this function silently only worksfor the ACO collection.
   - Count+results SQL duplication — dlts_viewer_list_resource() and dlts_viewer_list_collections_collection() both run the samequery twice (once for count, once for results). Could use SQL_CALC_FOUND_ROWS or a subquery.
   - dlts_viewer_list_collections_collection() still has @todo document function in its docblock.

  ---------------------------------------------------------------------------------------------------------------------------------

  What's already fixed (since original review): node_load('node', $nid) wrong args ✓, $viewerUrl undefined ✓, $title undefined ✓,major duplication (426 lines removed) ✓

  What would you like to tackle next — the bugs, the dead code removal, or something else?
