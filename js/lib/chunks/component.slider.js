/** callback for changes in the value of the slider */
function slideValueChange (e) {
  /** slider event */
  if (!Y.Lang.isValue(DLTS.slider.triggerBy)) {
    Y.one('#slider_value').set('value', e.newVal);
  } else { /** event was triggered by reference */
    DLTS.slider.triggerBy = undefined;
  }
}

/**
 * Callback for the slide end event
 */
function slideEnd (e) {

  e.preventDefault();

  const slider = DLTS.slider;

  const pjax = DLTS.pjax;

  const target = e.target;

  const map = Y.one('.dlts_viewer_map');

  const data = map.getData();

  const request = bookUrl + '/' + target.getValue() + '?page_view=' + data.pageview;

  if (!Y.Lang.isValue(slider.triggerBy)) {

    Y.one('.current_page').set('text', target.getValue());

    pjax.navigate(request);

    /**
     * slider set focus to the slider rail, blur as soon
     * as possible so that user can use the keyboard to
     * read the book
     */
    Y.soon(function () {
      slider.thumb.blur();
    });

  } else { /** event was triggered by reference */
    slider.triggerBy = undefined;
  }

}

DLTS.slider = new Y.Slider({
  axis: 'x',
  min: 1,
  dir: getPageLanguageDirection(),
  clickableRail: false,
  max: getSequenceCount(),
  value: getSequence(),
  length: (Y.one('#pager').get('offsetWidth') - 120) + 'px'
});

DLTS.slider.render('#slider');

DLTS.slider.after('valueChange', slideValueChange);

DLTS.slider.after('slideEnd', slideEnd);
