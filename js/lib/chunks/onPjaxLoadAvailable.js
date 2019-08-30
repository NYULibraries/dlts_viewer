function onPjaxLoadAvailable (conf) {

  const title = Y.one('#page-title');
  // var thumbnails = Y.one('.view-book-thumbnails');
  const sequence = conf.sequence;
  var thumbnails = false;
  let currentPage = false;
  let node = false;

  if (title) {
    title.set('text', conf.title);
  }

  DLTS.slider.triggerBy = 'pjax:load:available';

  DLTS.slider.set('value', parseInt(sequence, 10));

  Y.one('#slider_value').set('value', sequence);

  if (thumbnails) {
    currentPage = thumbnails.one('.current-page');
    if (currentPage) {
      currentPage.removeClass('current-page');
    }
    node = thumbnails.one('[data-sequence="' + sequence + '"]');
    if (node) {
      node.addClass('current-page');
    }
  }

}

Y.on('pjax:load:available', onPjaxLoadAvailable);
