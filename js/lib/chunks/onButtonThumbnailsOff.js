function onButtonThumbnailsOff (e) {

  const thumbnails = Y.one('#thumbnails');

  const button = Y.one('#button-thumbnails');

  let currentPage = false;

  // in case event was triggered by other means
  if (button.hasClass('on')) {
    button.removeClass('on');
  }

  if (thumbnails) {
    thumbnails.addClass('hidden');
    currentPage = thumbnails.one('.current-page');
    if (currentPage) {
      currentPage.removeClass('current-page');
    }
  }

}

Y.on('button:button-thumbnails:off', onButtonThumbnailsOff);
