/* jshint laxcomma: true, laxbreak: true, unused: false */
YUI().use('node', 'event', 'event-custom', 'transition', 'gallery-soon', 'widget-anim', 'crossframe', 'slider', function(Y) {
  Y.Viewer = null;
  Y.OpenSeadragon = OpenSeadragon;
  Y.isFullyLoaded = false;
  var html = Y.one('html');
  var pagemeta = Y.one('.pane.pagemeta');
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

  slider.render('#slider');

  slider.after('valueChange', slide_value_change);

  slider.after('slideEnd', slide_end, slider);

  /** callback for the slide end event */
  function slide_end(e) {
    e.preventDefault();
    if (!Y.Lang.isValue(slider.triggerBy)) {
      try {
        const currentTarget = Y.one('.paging');
        const config = {
          identifier: currentTarget.getAttribute('data-identifier'),
          title: 'pjax_callback: title',
          sequence: e.target.getValue(),
          sequenceCount: currentTarget.getAttribute('data-sequence-count'),
          operation: currentTarget.getAttribute('data-operation'),
          type: currentTarget.getAttribute('data-type')
        };
        Y.one('.current_page').set('text', e.target.getValue());
        Y.fire('sequence:available', config);
        Y.soon(function() {
          slider.thumb.blur();
        });
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

  function resizeSlider() {
    slider.set('length' ,(Y.one('#pager').get('offsetWidth') - 120 ));
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

  Y.on('windowresize', resizeSlider);

  Y.one('.pane.pager').delegate('submit', pager_form, 'form', slider_datasource);  

  // https://codepen.io/iangilman/pen/jOmLYvd
  // https://openseadragon.github.io/docs/OpenSeadragon.html#.Options

  function on_toggle_language(e) {
    var current_target = e.currentTarget;
    var data_target = current_target.get('value');
    e.preventDefault();
    // Y.io(data_target, {
    //   on: {
    //     complete: function(_id, e) {
    //       var node = Y.one('#pagemeta');
    //       var dir;
    //       var titlebar = Y.one('#titlebar');
    //       var pagetitle = Y.one('#page-title');
    //       node.set('innerHTML', e.response);
    //       document.title = node.one('.field-name-title h2').get('innerText');
    //       dir = node.one('.node-dlts-book').getAttribute('data-dir');
    //       Y.one('.pane.main').set('dir', dir);
    //       if (titlebar) {
    //         titlebar.set('dir', dir);
    //       }
    //       if (pagetitle) {
    //         pagetitle.set('innerHTML', document.title);
    //       }
    //     }
    //   }
    // });
  }

  function on_button_click(e) {
    e.preventDefault();
    const self = this;
    const current_target = e.currentTarget;
    let event_prefix, event_id, node_target, data_target;
    /** don't waste time if the button is inactive */
    if (current_target.hasClass('inactive')) return;
    /** if current target has target, get target from data-target */
    if (current_target.hasClass('target')) {
      data_target = self.getAttribute('data-target');
      event_prefix = 'button:' + data_target;
      /** look-up for the main target */
      node_target = Y.all('#' + data_target);
    }
    /** current target is the main target */
    else {
      event_id = self.get('id');
      event_prefix = 'button:' + event_id;
      /** find possible reference targets to this target */
      node_target = Y.all('a[data-target=' + event_id + ']');
    }
    if (self.hasClass('on')) {
      self.removeClass('on');
      if (Y.Lang.isObject(node_target)) {
        node_target.each(function(node) {
          node.removeClass('on');
        });
      }
      Y.fire(event_prefix + ':off', e);
    }
    else {
      self.addClass('on');
      if (Y.Lang.isObject(node_target)) {
        node_target.each(function(node) {
          node.addClass('on');
        });
      }
      Y.fire(event_prefix + ':on', e);
    }
    Y.fire(event_prefix + ':toggle', e);
  }

  /**
   * pjax callback can be call by clicking a pjax
   * enable link or by reference with data-url
   */
  function pjax_callback(e) {

    const currentTarget = e.currentTarget;

    e.preventDefault();

    /** test if the target is not active */
    if (currentTarget.hasClass('inactive')) return false;    
    try {
      // if (url.searchParams.get('page_view') === 'double') {
      //   var pdir = to_page % 2;
      //   if (pdir === 1) {
      //     to_page = `${to_page}, ${to_page + 1}`
      //   } else {
      //     to_page = `${to_page - 1}, ${to_page}`
      //   }
      // }
      // this.one('.current_page').set('text', to_page);
      // this.addClass('loading').show();
      document.getElementsByTagName('body')[0].classList.add('openlayers-loading');
      const config = {
        id: currentTarget.get('id'),
        identifier: currentTarget.getAttribute('data-identifier'),
        title: 'pjax_callback: title',
        sequence: currentTarget.getAttribute('data-sequence'),
        sequenceCount: currentTarget.getAttribute('data-sequence-count'),
        operation: currentTarget.getAttribute('data-operation'),
        type: currentTarget.getAttribute('data-type')
      };
      Y.fire('sequence:available', config);
    } catch(e) {
      console.log(e);
    }
  }

  function fullscreenOn() {
    var docElm = document.documentElement;
    var top = Y.one('.top');
    var button = Y.one('#button-metadata');
    if (button) {
    button.removeClass('on');
    }
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }
    else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
    if (top) {
      top.addClass('hidden');
    }
    Y.CrossFrame.postMessage("parent", JSON.stringify({fire: 'button:button-fullscreen:on'}));
  }

  function fullscreenOff() {
    var fullscreenButton = Y.one('a.fullscreen');
    var top = Y.one('.top');
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    if (fullscreenButton) {
      fullscreenButton.blur();
    }
    if (top) {
      top.removeClass('hidden');
    }
    Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'button:button-fullscreen:off'}));
  }

  function change_page(config) {
    try {
      const { sequence, sequenceCount, type, identifier } = config;
      const sequence_req = parseInt(sequence, 10);       
      const sequence_next = sequence_req + 1;
      const sequence_previous = sequence_req - 1;
      const int_sequence_count = parseInt(sequenceCount, 10);
      const image_service = 'https://stage-sites.dlib.nyu.edu/viewer/api/image';

      config.manifest = `${image_service}/${type}/${identifier}/${sequence_req.toString()}/info.json`;

      document.querySelectorAll('.paging.next').forEach((item) => {
        item.dataset.sequence = sequence_next;
        if (sequence_next > int_sequence_count) {
          item.classList.add('inactive');
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive');
          }
        }        
      });

      document.querySelectorAll('.paging.previous').forEach((item) => {
        item.dataset.sequence = sequence_previous;
        if (sequence_req <= 1) {
          item.classList.add('inactive');
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive');
          }
        }
      });

      Y.isFullyLoaded = false;

      window.history.pushState({}, config.title, sequence_req.toString());

      Y.Viewer.open(config.manifest);

      // Let parent know that Viewer is going to paint.
      Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'viewer:change', data: config }));

    } catch(e) {
      console.log(e);
    }
  }

  function onButtonMetadataOn() {
    this.removeClass('hidden');
    this.ancestor('.pane-body').removeClass('pagemeta-hidden');
    Y.CrossFrame.postMessage('parent', JSON.stringify({
      fire: 'button:button-metadata:on'
    }));
  }

  function onButtonMetadataOff(e) {
    this.addClass('hidden');
    this.ancestor('.pane-body').addClass('pagemeta-hidden');
    Y.CrossFrame.postMessage("parent", JSON.stringify({fire: 'button:button-metadata:off'}));
  }

  function openLayersTilesLoading() {
    if (Y.one('body').hasClass('openlayers-loading')) {
      Y.later(200, Y.one('.pane.load'), openLayersTilesLoading);
    }
    else {
      Y.one('.pane.load').hide();
      Y.one('body').removeClass('openlayers-loading');
    }
  }

  function onPjaxLoadAvailable(conf) {
    var page_title = Y.one('#page-title') ;
    var sequence = conf.sequence;
    var thumbnails = false;
    var currentPage = false;
    var node = false;
    if (page_title) {
      page_title.set('text', conf.title);
    }
    slider.triggerBy = 'pjax:load:available';
    slider.set('value', parseInt(sequence, 10));
    Y.one('#slider_value').set('value', sequence);
    var thumbnails = Y.one('.view-book-thumbnails');
    if (thumbnails) {
      currentPage = thumbnails.one('.current-page');
      if (currentPage) {
        currentPage.removeClass('current-page');
      }
      node = thumbnails.one('[data-sequence="'+ sequence +'"]');
      if (node) {
        node.addClass('current-page');
      }
    }
  }

  function onButtonThumbnailsOnIOStart(e) {
    var thumbnails = Y.one('#thumbnails');
    if (thumbnails) {
      thumbnails.removeClass('hidden');
    }
  }

  function onButtonThumbnailsOn(e) {
    e.halt();
    var map = Y.one('.dlts_viewer_map').getData();
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

  /** events listeners */

  function onSelectMVChange(e) {
    e.halt();
    const currentTarget = e.currentTarget;
    const value = currentTarget.one(':checked').get('value');
    const lang = Y.one('.node-dlts-book').getAttribute('data-lang');
    const url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang;
    const data = { url : url };
    if (window.self === window.top) {
      window.location.assign(url)
    }
    else {
      Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'change:option:multivolume', data }));
    }
  }

  // we need to remove all jQuery events for this node (DOM)
  jQuery('.field-name-mv-2016 *').unbind();

  // https://javascript.info/event-delegation
  Y.delegate('change', onSelectMVChange, 'body', '.field-name-mv-2016 form');

  html.delegate('click', on_button_click, 'a.button');

  html.delegate('click', pjax_callback, 'a.paging');

  Y.on('pjax:change|openlayers:next|openlayers:previous', pjax_callback);

  Y.on('button:button-metadata:on', onButtonMetadataOn , pagemeta);

  Y.on('sequence:available', change_page)

  Y.on('button:button-metadata:off', onButtonMetadataOff, pagemeta);

  Y.on('button:button-fullscreen:on', fullscreenOn);

  Y.on('button:button-fullscreen:off', fullscreenOff);

  Y.once('contentready', openLayersTilesLoading, '.dlts_viewer_map');

  /** Thumbnails related events */
  Y.on('button:button-thumbnails:on', onButtonThumbnailsOn);

  Y.on('button:button-thumbnails:off', onButtonThumbnailsOff);

  // https://javascript.info/event-delegation
  Y.delegate('click', onThumbnailsContainerPagerClick, 'body', '.thumbnails .views-row a');

  Y.one('body').delegate('click', onThumbnailsPagePagerClick, '#thumbnails .pager a');

  // https://javascript.info/event-delegation
  Y.delegate('change', on_toggle_language, 'body', '.language');

  Y.on('pjax:load:available', onPjaxLoadAvailable);

  function updateLoadingIndicator() {
    // Note that this function gets called every time isFullyLoaded changes, which it will do as you 
    // zoom and pan around. All we care about is the initial load, though, so we are just hiding the 
    // loading indicator and not showing it again. 
    if (Y.isFullyLoaded) {
      console.log('Y.isFullyLoaded');
      document.querySelector('body').classList.remove('openlayers-loading');
      Y.one('.pane.load').hide();
      Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'viewer:isFullyLoaded', data: {} }));
    }
  }

  function addItemHandler(event) {
    const tiledImage = event.item;
    tiledImage.addHandler('fully-loaded-change', () => {
      const newFullyLoaded = areAllFullyLoaded();
      if (newFullyLoaded !== Y.isFullyLoaded) {
        Y.isFullyLoaded = newFullyLoaded;
        updateLoadingIndicator();
      }
    });
  }    
  
  function areAllFullyLoaded() {
    const count = Y.Viewer.world.getItemCount();
    for (let i = 0; i < count; i++) {
      const tiledImage = Y.Viewer.world.getItemAt(i);
      if (!tiledImage.getFullyLoaded()) {
        return false;
      }
    }
    return true;
  }

  window.addEventListener('load', () => {   
    const id = 'openseadragon1';
    const display = document.querySelector('#display');
    const osd = document.querySelector(`#${id}`);
    Y.Viewer = Y.OpenSeadragon({
      id: id,
      preserveViewport: true,
      showNavigationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      visibilityRatio: 1,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: true,
      tileSources: [
        osd.dataset.manifest,
      ]
    });

    Y.Viewer.world.addHandler('add-item', addItemHandler);

    Y.Viewer.addHandler('zoom', (event) => {
      console.log('Current zoom', event.zoom);
      console.log('MaxZoom', Y.Viewer.viewport.getMaxZoom());
    });

    Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'display:load', data: { display: display.dataset, osd: osd.dataset} }));

    document.getElementById('control-zoom-in').onclick = () => {
      const actualZoom = Y.Viewer.viewport.getZoom();
      const maxZoom = Y.Viewer.viewport.getMaxZoom();
      if (actualZoom < maxZoom) {
        Y.Viewer.viewport.zoomTo(actualZoom * 2);
      }
    }

    document.getElementById('control-zoom-out').onclick = () => {
      const actualZoom = Y.Viewer.viewport.getZoom();
      const minZoom = Y.Viewer.viewport.getMinZoom();
      const zoom = actualZoom / 2;
      if (zoom >= minZoom) {
        Y.Viewer.viewport.zoomTo(zoom);
      } else {
        if (actualZoom > minZoom) {
          Y.Viewer.viewport.zoomTo(minZoom);
        }
      }
    }

  });

});

