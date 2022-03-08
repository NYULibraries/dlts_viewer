/* jshint laxcomma: true, laxbreak: true, unused: false */
YUI().use('node', 'event', 'event-custom', 'transition', 'widget-anim', 'crossframe', 'slider', function(Y) {
    // https://www.npmjs.com/package/delegated-events
    Y.Viewer = null;
    Y.OpenSeadragon = OpenSeadragon;
    Y.isFullyLoaded = false;
  
    var display = Y.one('#display');
    var displayData = display.getData();
    var sequence = parseInt(displayData['sequence'] , 10);
    var sequenceCount = parseInt(displayData['sequence-count'] , 10);
    var pager = Y.one('#pager');
    var lang_dir = pager.get('dir');
    const slider_datasource = Y.one('#slider_value');
  
    /** slider object */
    const slider = new Y.Slider({
      axis: 'x',
      min: 1,
      dir: lang_dir,
      clickableRail: false,
      max: sequenceCount,
      value: sequence,
      length:(Y.one('#pager').get('offsetWidth') - 120) + 'px'
    });

  /** callback for the slide end event */
  function slide_end(e) {
    console.log('slide_end')
    return;
    e.preventDefault();
    if (!Y.Lang.isValue(slider.triggerBy)) {
      try {
        const currentTarget = Y.one('.paging');
        const config = {
          operation: currentTarget.getAttribute('data-operation'),
        };
        Y.one('.current_page').set('text', e.target.getValue());
        document.dispatchEvent(
          new CustomEvent('sequence:available', config)
        );
        // Y.soon(function() {
        //   slider.thumb.blur();
        // });
      } catch(e) {
        console.log(e);
      }
    }
    /** event was triggered by reference */
    else {
      slider.triggerBy = undefined;
    }
  }

  /** callback for changes in the value of the slider */
  function slide_value_change(e) {
    console.log('slide_value_change', e.newVal);
    /** slider event */
    if (!Y.Lang.isValue(slider.triggerBy)) {
      slider_datasource.set('value', e.newVal);
    }
    /** event was triggered by reference */
    else {
      slider.triggerBy = undefined;
    }
  }

  /** TODO: I don't like this, find a more elegant solution */
  function pager_form(e) {
    e.preventDefault();
    var value = this.get('value');
    var css_class;
    if (value.match(/\D/)) {
      css_class = 'error';
    }
    else {
      value = parseInt(value, 10);
      if (value !== current && (value > 0 && value <= sequenceCount)) {
        css_class = 'ok';
        Y.one('.current_page').set('text', value);
        console.log(value)
      }
      else {
        if (value !== current) {
          css_class = 'error';
        }
        else {
          css_class = 'warning';
        }
      }
    }
    this.addClass(css_class).transition({
      duration: 1,
      easing: 'ease-in',
      opacity: 0.9
    }, function() {
      this.removeClass(css_class);
    });
  }  

    slider.render('#slider');

    slider.after('valueChange', slide_value_change);
  
    slider.after('slideEnd', slide_end, slider);

});
