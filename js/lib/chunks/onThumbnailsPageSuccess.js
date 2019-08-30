function onThumbnailsPageSuccess(id, response) {
  Y.one('.thumbnails-container').set('innerHTML', response.response);
}
