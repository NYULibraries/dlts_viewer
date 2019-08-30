function pagerForm (e) {

  e.preventDefault();

  const node = Y.one('#slider_value');

  const olMap = Y.one('.olMap');

  const olMapData = olMap.getData();

  const current = parseInt(olMapData.sequence, 10);

  let value = node.get('value');

  let css_class;

  if (value.match(/\D/)) {
    css_class = 'error';
  } else {
    value = parseInt(value, 10);
    if (value !== current && (value > 0 && value <= olMapData.sequenceCount)) {
      css_class = 'ok';
      Y.one('.current_page').set('text', value);
      pjax.navigate(`${bookUrl}/${value}`);
    } else {
      if (value !== current) {
        css_class = 'error';
      } else {
        css_class = 'warning';
      }
    }
  }

  node.addClass(css_class).transition({
    duration: 1,
    easing: 'ease-in',
    opacity: 0.9
  }, function () {
    node.removeClass(css_class);
  });

}

Y.delegate('submit', pagerForm, '.pane.pager form');
