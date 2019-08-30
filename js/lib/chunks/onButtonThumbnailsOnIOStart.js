function onButtonThumbnailsOnIOStart (e) {
  const thumbnails = Y.one('#thumbnails');
  if (thumbnails) {
    thumbnails.removeClass('hidden');
  }
}
