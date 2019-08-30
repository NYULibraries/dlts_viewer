function onThumbnailsPagePagerClick (e) {

  var url;

  e.preventDefault();

  /** test if the target is not active */
  if (e.currentTarget.hasClass('inactive')) {
    return false;
  }

  if (e.currentTarget.hasClass('close')) {
    Y.fire('button:button-thumbnails:off', e);
    return false;
  }

  /** if event has referenceTarget, then event was trigger by reference */
  if (Y.Lang.isObject(e.referenceTarget, true)) {
    url = e.referenceTarget.getAttribute('data-url');
  }
  /** trigger by a pjax enable link */
  else {
    url = this.get('href');
  }

  /** request new page */
  Y.io(url, {
    on: {
      start: onThumbnailsPageStart,
      end: onThumbnailsPageEnd,
      complete: onThumbnailsPageComplete,
      success: onThumbnailsPageSuccess,
      failure: onThumbnailsPageFailure
    }
  });

}

Y.delegate('click', onThumbnailsPagePagerClick, '#thumbnails', '#thumbnails .pager a');
