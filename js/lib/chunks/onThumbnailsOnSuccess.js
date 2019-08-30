function onThumbnailsOnSuccess (id, request) {
  const node = Y.one('#thumbnails');
  if (node) {
    node.set('innerHTML', request.response);
    node.addClass('active');
  }
}