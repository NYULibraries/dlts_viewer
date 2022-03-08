function ViewerApp(Y) {
  // https://www.npmjs.com/package/delegated-events
  Y.Viewer = null;
  Y.OpenSeadragon = OpenSeadragon;
  Y.isFullyLoaded = false;

  // https://codepen.io/iangilman/pen/jOmLYvd
  // https://openseadragon.github.io/docs/OpenSeadragon.html#.Options

  function on_toggle_language(e) {
    // var current_target = e.currentTarget;
    // var data_target = current_target.get('value');
    // e.preventDefault();
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

  // function on_button_click(e) {
  //   console.log('on_button_click', e);
  //   e.preventDefault();
  //   const self = this;
  //   const current_target = e.currentTarget;
  //   let event_prefix, event_id, node_target, data_target;
  //   /** don't waste time if the button is inactive */
  //   if (current_target.hasClass('inactive')) return;
  //   /** if current target has target, get target from data-target */
  //   if (current_target.hasClass('target')) {
  //     data_target = self.getAttribute('data-target');
  //     event_prefix = 'button:' + data_target;
  //     /** look-up for the main target */
  //     node_target = Y.all('#' + data_target);
  //   }
  //   /** current target is the main target */
  //   else {
  //     event_id = self.get('id');
  //     event_prefix = 'button:' + event_id;
  //     /** find possible reference targets to this target */
  //     node_target = Y.all('a[data-target=' + event_id + ']');
  //   }
  //   if (self.hasClass('on')) {
  //     self.removeClass('on');
  //     if (Y.Lang.isObject(node_target)) {
  //       node_target.each((node) => {
  //         node.removeClass('on');
  //       });
  //     }
  //     console.log(`${event_prefix}:off`)
  //     document.dispatchEvent(
  //       new CustomEvent(`${event_prefix}:off`, e)
  //     );
  //   }
  //   else {
  //     self.addClass('on');
  //     if (Y.Lang.isObject(node_target)) {
  //       node_target.each((node) => {
  //         node.addClass('on');
  //       });
  //     }
  //     console.log(`${event_prefix}:on`)
  //     document.dispatchEvent(
  //       new CustomEvent(`${event_prefix}:on`, e)
  //     );
  //   }
  //   console.log(`${event_prefix}:toggle`)
  //   document.dispatchEvent(
  //     new CustomEvent(`${event_prefix}:toggle`, e)
  //   );
  // }

  /**
   * pjax callback can be call by clicking a pjax
   * enable link or by reference with data-url
   */
  function pjax_callback(e) {
    const currentTarget = e.currentTarget;
    e.preventDefault();
    /** test if the target is not active */
    if (currentTarget.classList.contains('inactive')) return false;
    try {     
      document.getElementsByTagName('body')[0].classList.add('openlayers-loading');
      document.dispatchEvent(
        new CustomEvent('sequence:available', {
          detail: {
            operation: e.currentTarget.dataset.operation,
          }
        })
      );
    } catch(e) {
      console.log(e);
    }
  }

  function fullscreenOn() {
    const docElm = document.documentElement;
    const top = document.querySelector('.top');
    const button = document.querySelector('#button-metadata');
    if (button) {
      button.classList.remove('on');
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
      button.classList.add('hidden');
    }
    // Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'button:button-fullscreen:on'}));
  }

  function fullscreenOff() {
    const fullscreenButton = document.querySelector('a.fullscreen');
    const top = document.querySelector('.top');
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
    console.log('click fullscreenOff: @todo blur()')
    // figure out how to do this without YUI3
    if (fullscreenButton) {
      // fullscreenButton.blur();
      console.log(fullscreenButton);
    }
    if (top) {
      top.classList.remove('hidden');
    }
    // Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'button:button-fullscreen:off'}));
  }

  function change_page(e) {
    console.log('change_page');
    try {
      const {
        operation
      } = e.detail;
      
      Y.isFullyLoaded = true;

      const osd = document.querySelector('#openseadragon1');

      const { type, identifier, service } = osd.dataset;

      let sequence = parseInt(osd.dataset.sequence, 10);

      const sequenceCount = parseInt(osd.dataset.sequenceCount, 10);

      const items = [];

      if (operation == 'decrease') {
        sequence = sequence - 1;
        if (sequence < 1) {
          sequence = 1;
        }
        items[0] = sequence;
        console.log('decrease', sequence)
      }

      if (operation == 'increase') {
        sequence = sequence + 1;
        if (sequence > sequenceCount) {
          sequence = sequenceCount;
        }
        if (osd.dataset.view == 'single') {
          items[0] = sequence;
        } else {
          if (sequence % 2 === 1) {
            items[0] = sequence;
            items[1] = sequence + 1;
          } else {
            items[0] = sequence - 1;
            items[1] = sequence;
          }
        }
      }

      if (operation == 'toggleview') {
        if (osd.dataset.view == 'single') {
          osd.dataset.view = 'doublepage';
          if (sequence % 2 === 1) {
            items[0] = sequence;
            items[1] = sequence + 1;
          } else {
            items[0] = sequence - 1;
            items[1] = sequence;
          }
        } else {
          osd.dataset.view = 'single';
          items[0] = sequence;
        }
      }

      osd.dataset.sequence = items[0];

      // this.one('.current_page').set('text', to_page);

      // this.addClass('loading').show();

      const tileSources = items.map((sequence, x) => {
        return {
          tileSource: `${service}/${type}/${identifier}/${sequence}/info.json`,
          x: x
        }
      });

      document.querySelectorAll('.paging.next').forEach((item) => {
        if (sequence >= sequenceCount) {
          item.classList.add('inactive');
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive');
          }
        }
      });

      document.querySelectorAll('.paging.previous').forEach((item) => {
        if (sequence <= 1) {
          item.classList.add('inactive');
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive');
          }
        }
      });

      window.history.pushState({}, 'some title', items[0].toString());

      Y.Viewer.open(tileSources);

      // Let parent know that Viewer is going to paint.
      // Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'viewer:change', data: config }));

    } catch(e) {
      console.log(e);
    }
  }

  function onButtonMetadataOn() {
    const element = document.querySelector('#pagemeta');
    element.classList.remove('hidden');
    element.closest('.pane-body').classList.remove('pagemeta-hidden');
    // Y.CrossFrame.postMessage('parent', JSON.stringify({
    //   fire: 'button:button-metadata:on'
    // }));
  }

  function onButtonMetadataOff() {
    const element = document.querySelector('#pagemeta');
    element.classList.add('hidden');
    element.closest('.pane-body').classList.add('pagemeta-hidden');
    // Y.CrossFrame.postMessage("parent", JSON.stringify({fire: 'button:button-metadata:off'}));
  }

  function show(selector) {
    document.querySelectorAll(selector).forEach(elm => {
      elm.style.display = 'initial';
      elm.setAttribute('aria-hidden', false);
      elm.hidden = false;
    });
  }

  function hide(selector) {
    document.querySelectorAll(selector).forEach(elm => {
      elm.style.display = 'none';
      elm.setAttribute('aria-hidden', true);
      elm.hidden = true;
    });
  }

  function tilesLoading() {
    const body = document.querySelector('body');
    if (body.classList.contains('openlayers-loading')) {
      setTimeout(() => {
        tilesLoading();
      }, 100);
    } else {
      hide('.pane.load');
      body.classList.remove('openlayers-loading');
    }
  }

  function onPjaxLoadAvailable(conf) {
    console.log('onPjaxLoadAvailable', conf)
  //   var page_title = Y.one('#page-title') ;
  //   var sequence = conf.sequence;
  //   var thumbnails = false;
  //   var currentPage = false;
  //   var node = false;
  //   if (page_title) {
  //     page_title.set('text', conf.title);
  //   }
  //   slider.triggerBy = 'pjax:load:available';
  //   slider.set('value', parseInt(sequence, 10));
  //   Y.one('#slider_value').set('value', sequence);
  //   var thumbnails = Y.one('.view-book-thumbnails');
  //   if (thumbnails) {
  //     currentPage = thumbnails.one('.current-page');
  //     if (currentPage) {
  //       currentPage.removeClass('current-page');
  //     }
  //     node = thumbnails.one('[data-sequence="'+ sequence +'"]');
  //     if (node) {
  //       node.addClass('current-page');
  //     }
  //   }
  }

  /** events listeners */

  // function onSelectMVChange(e) {
  //   e.halt();
  //   const currentTarget = e.currentTarget;
  //   const value = currentTarget.one(':checked').get('value');
  //   const lang = Y.one('.node-dlts-book').getAttribute('data-lang');
  //   const url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang;
  //   const data = { url : url };
  //   if (window.self === window.top) {
  //     window.location.assign(url)
  //   }
  //   else {
  //     Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'change:option:multivolume', data }));
  //   }
  // }

  // Y.one('.pane.pager').delegate('submit', pager_form, 'form', slider_datasource);  

  // https://javascript.info/event-delegation
  // Y.delegate('change', onSelectMVChange, 'body', '.field-name-mv-2016 form');

  // html.delegate('click', on_button_click, 'a.button');

  // Y.on('pjax:change|openlayers:next|openlayers:previous', pjax_callback);  
  
  // https://javascript.info/event-delegation
  // Y.delegate('change', on_toggle_language, 'body', '.language');

  function updateLoadingIndicator() {
    if (Y.isFullyLoaded) { 
      document.querySelector('body').classList.remove('openlayers-loading');
      // Y.one('.pane.load').hide();
      // Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'viewer:isFullyLoaded', data: {} }));
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
  
  document.querySelectorAll('a.paging').forEach(item => {
    item.addEventListener('click', pjax_callback, false);
  })  

  document.addEventListener('sequence:available', change_page, false);

  document.addEventListener('button:button-metadata:on', onButtonMetadataOn, false);
  
  document.addEventListener('button:button-metadata:off', onButtonMetadataOff, false);

  document.addEventListener('button:button-fullscreen:on', fullscreenOn, false);

  document.addEventListener('button:button-fullscreen:off', fullscreenOff, false);

  document.addEventListener('pjax:load:available', onPjaxLoadAvailable, false);

  document.addEventListener('viewer:contentready', tilesLoading, false);
  
  window.addEventListener('load', () => {

    document.dispatchEvent(
      new CustomEvent('viewer:contentready')
    );    

    const osd = document.querySelector('#openseadragon1');

    const tileSources = osd.dataset.manifest.split(',').map((manifest, x) => {
      return {
        tileSource: manifest,
        x: x
      }
    });

    Y.Viewer = Y.OpenSeadragon({
      id: osd.id,
      preserveViewport: true,
      showNavigationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      visibilityRatio: 1,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: false,
      tileSources: tileSources,
    });

    Y.Viewer.world.addHandler('add-item', addItemHandler);

    // Use to change state of buttons.
    // Y.Viewer.addHandler('zoom', (event) => {});

    document.getElementById('control-zoom-in').onclick = () => {
      const actualZoom = Y.Viewer.viewport.getZoom();
      const maxZoom = Y.Viewer.viewport.getMaxZoom();
      if (actualZoom < maxZoom) {
        Y.Viewer.viewport.zoomTo(actualZoom * 2);
      }
    }

    // Zoom out event.
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

    document.getElementById('toggle-page').onclick = (e) => {
      e.preventDefault();
      document.dispatchEvent(
        new CustomEvent('sequence:available', {
          detail: {
            operation: e.currentTarget.dataset.operation,
          }
        })
      );
    }

    window.addEventListener('resize', () => {
      // slider.set('length' ,(Y.one('#pager').get('offsetWidth') - 120 ));
    });

    // Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'display:load', data: { osd: osd.dataset} }));

  });
}

ViewerApp({});
