#!/bin/bash -e

# ./sites/all/modules/dlts_viewer/bin/sql.sh

nodes=(
field_data_body
field_data_field_author
field_data_field_binding_orientation
field_data_field_book
field_data_field_call_number
field_data_field_code
field_data_field_collection
field_data_field_contributor
field_data_field_creator
field_data_field_description
field_data_field_dimensions
field_data_field_editor
field_data_field_geographic_coordinates
field_data_field_geographic_subject
field_data_field_handle
field_data_field_identifier
field_data_field_isbn
field_data_field_language
field_data_field_language_code
field_data_field_multivol
field_data_field_name
field_data_field_notes_field
field_data_field_number
field_data_field_ocr_text
field_data_field_other_version
field_data_field_page_count
field_data_field_partner
field_data_field_pdf_file
field_data_field_physical_description
field_data_field_publication_date
field_data_field_publication_date_text
field_data_field_publication_location
field_data_field_publisher
field_data_field_read_order
field_data_field_representative_image
field_data_field_rights
field_data_field_scan_date
field_data_field_scan_order
field_data_field_scanning_notes
field_data_field_searchable_pdf
field_data_field_section_body
field_data_field_section_name
field_data_field_sequence_count
field_data_field_series
field_data_field_subject
field_data_field_subtitle
field_data_field_title
field_data_field_topic
field_data_field_volume
field_data_field_volume_number
field_data_field_volume_number_str
field_revision_body
field_revision_field_author
field_revision_field_binding_orientation
field_revision_field_book
field_revision_field_call_number
field_revision_field_code
field_revision_field_collection
field_revision_field_contributor
field_revision_field_creator
field_revision_field_description
field_revision_field_dimensions
field_revision_field_editor
field_revision_field_geographic_coordinates
field_revision_field_geographic_subject
field_revision_field_handle
field_revision_field_identifier
field_revision_field_isbn
field_revision_field_language
field_revision_field_language_code
field_revision_field_multivol
field_revision_field_name
field_revision_field_notes_field
field_revision_field_number
field_revision_field_ocr_text
field_revision_field_other_version
field_revision_field_page_count
field_revision_field_partner
field_revision_field_pdf_file
field_revision_field_physical_description
field_revision_field_publication_date
field_revision_field_publication_date_text
field_revision_field_publication_location
field_revision_field_publisher
field_revision_field_read_order
field_revision_field_representative_image
field_revision_field_rights
field_revision_field_scan_date
field_revision_field_scan_order
field_revision_field_scanning_notes
field_revision_field_searchable_pdf
field_revision_field_section_body
field_revision_field_section_name
field_revision_field_sequence_count
field_revision_field_series
field_revision_field_subject
field_revision_field_subtitle
field_revision_field_title
field_revision_field_topic
field_revision_field_volume
field_revision_field_volume_number
field_revision_field_volume_number_str
# field_data_field_ticket
# field_data_field_noid
# field_revision_field_ticket
# field_revision_field_noid
)

cache=(
cache
cache_admin_menu
cache_apachesolr
cache_block
cache_bootstrap
cache_features
cache_field
cache_filter
cache_form
cache_image
cache_libraries
cache_menu
cache_page
cache_path
cache_token
cache_update
cache_variable
cache_views
cache_views_data
ctools_css_cache
)

./vendor/bin/drush sql-query "DELETE FROM node WHERE type <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM node_revision WHERE uid <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM dlts_viewer_resource WHERE identifier <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM dlts_viewer_epubs WHERE identifier <> 'deleteme'"

for table in "${nodes[@]}"; do
  echo "Deleting from ${table}"
  ./vendor/bin/drush sql-query "DELETE FROM ${table} WHERE bundle <> 'deleteme'"
done

for entry in "${cache[@]}"; do
  echo "Deleting from ${table}"
  ./vendor/bin/drush sql-query "DELETE FROM ${entry} WHERE cid <> 'deleteme'"
done

# drop if exists
./vendor/bin/drush sql-query "DROP TABLE IF EXISTS dlts_viewer_drush_git_commits"
./vendor/bin/drush sql-query "DROP TABLE IF EXISTS dlts_viewer_books_json"

# isbn, dimensions, creator, editor, contributor, geographic_coordinates, geographic_subject
# volume, other_version, scan_date, scanning_notes, ocr_text

./vendor/bin/drush sql-query "DELETE FROM entity_translation WHERE entity_type <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM entity_translation_revision WHERE entity_type <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM pathauto_state WHERE entity_type <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM ctools_object_cache WHERE sid <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM watchdog WHERE uid <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM batch WHERE bid <> 'deleteme'"
./vendor/bin/drush sql-query "DELETE FROM url_alias WHERE pid <> 'deleteme'"

./vendor/bin/drush cc all

./vendor/bin/drush cron
