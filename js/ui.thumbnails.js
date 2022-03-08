  function onButtonThumbnailsOnIOStart(e) {
    var thumbnails = Y.one('#thumbnails');
    if (thumbnails) {
      thumbnails.removeClass('hidden');
    }
  }

  function onButtonThumbnailsOn(e) {
    // e.halt();
    // var map = Y.one('.dlts_viewer_map').getData();
    // Y.io(map['thumbnails-url'], {
    //   data: 'page=' + map['thumbnails-page'] + '&rows=' + map['thumbnails-rows'] + '&sequence=' + map['sequence'],
    //   on: {
    //     start: onButtonThumbnailsOnIOStart,
    //     complete: onThumbnailsOnSuccess }
    //   }
    // );
  }

  function onButtonThumbnailsOff(e) {
    var thumbnails = Y.one('#thumbnails');
    var button = Y.one('#button-thumbnails');
    var currentPage = false;
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

  function onThumbnailsContainerPagerClick(e) {
    e.preventDefault();
    // pjax.navigate(e.currentTarget.get('href'));
  }

  function onThumbnailsPagePagerClick(e) {
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
    // Y.io(url, { on : {
    //   start: onThumbnailsPageStart,
    //   end: onThumbnailsPageEnd,
    //   complete: onThumbnailsPageComplete,
    //   success: onThumbnailsPageSuccess
    // }
    // });
  }

  // remove content
  function onThumbnailsPageComplete() {
    Y.one('.thumbnails-container').empty();
  }

  // add loading effect
  function onThumbnailsPageStart() {
    Y.one('.thumbnails-container').addClass('io-loading');
  }

  // remove loading effect
  function onThumbnailsPageEnd() {
    Y.one('.thumbnails-container').removeClass('io-loading');
  }

  function onThumbnailsPageSuccess(_id, response) {
    Y.one('.thumbnails-container').set('innerHTML', response.response);
  }

  function onThumbnailsOnSuccess(_id, request) {
    var node = Y.one('#thumbnails');
    if (node) {
      node.set('innerHTML', request.response);
      node.addClass('active');
    }
  }
/** Thumbnails related events */
  Y.on('button:button-thumbnails:on', onButtonThumbnailsOn);

  Y.on('button:button-thumbnails:off', onButtonThumbnailsOff);

  // https://javascript.info/event-delegation
  Y.delegate('click', onThumbnailsContainerPagerClick, 'body', '.thumbnails .views-row a');

  Y.one('body').delegate('click', onThumbnailsPagePagerClick, '#thumbnails .pager a');
