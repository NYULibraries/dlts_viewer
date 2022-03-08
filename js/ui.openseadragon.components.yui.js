function ViewerApp(Y) {

  Y.OpenSeadragon = OpenSeadragon

  Y.Viewer = null

  Y.isFullyLoaded = false

  Y.nodes = {}

  function on_button_click(e) {
    console.log('on_button_click', e, e.currentTarget);
    e.preventDefault();
    const current_target = e.currentTarget;
    let event_prefix, event_id, node_target, data_target;
    /** don't waste time if the button is inactive */
    if (current_target.classList.contains('inactive')) return;
    /** if current target has target, get target from data-target */
    if (current_target.classList.contains('target')) {
      // data_target = self.getAttribute('data-target');
      // event_prefix = 'button:' + data_target;
      /** look-up for the main target */
      // node_target = Y.all('#' + data_target);
      console.log('@TODO: Has target')
    }
    /** current target is the main target */
    else {
      event_id = current_target.id;
      event_prefix = 'button:' + event_id;
      /** find possible reference targets to this target */
      // node_target = Y.all('a[data-target=' + event_id + ']');
      console.log('@TODO: Find all targets')
    }
    if (current_target.classList.contains('on')) {
      current_target.classList.remove('on');
      console.log('@TODO: Remove all class')
      // if (Y.Lang.isObject(node_target)) {
      //   node_target.each((node) => {
      //     node.removeClass('on');
      //   });
      // }
      console.log(`${event_prefix}:off`)
      document.dispatchEvent(
        new CustomEvent(`${event_prefix}:off`, e)
      );
    }
    else {
      current_target.classList.remove('on');
      // if (Y.Lang.isObject(node_target)) {
      //   node_target.each((node) => {
      //     node.addClass('on');
      //   });
      // }
      console.log(`${event_prefix}:on`)
      document.dispatchEvent(
        new CustomEvent(`${event_prefix}:on`, e)
      );
    }
    console.log(`${event_prefix}:toggle`)
    document.dispatchEvent(
      new CustomEvent(`${event_prefix}:toggle`, e)
    );
  }

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

      const osd = Y.nodes.osd;

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

      if (operation == 'change') {
        items[0] = sequence;  
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
    const button = document.querySelector('#button-metadata');
    const element = document.querySelector('#pagemeta');
    element.classList.remove('hidden');
    button.classList.remove('off');
    button.classList.add('on');
    element.closest('.pane-body').classList.remove('pagemeta-hidden');
    // Y.CrossFrame.postMessage('parent', JSON.stringify({
    //   fire: 'button:button-metadata:on'
    // }));
  }

  function onButtonMetadataOff() {
    const button = document.querySelector('#button-metadata');
    const element = document.querySelector('#pagemeta');
    button.classList.remove('on');
    button.classList.add('off');    
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
    const body = Y.nodes.body;
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

  // Y.on('pjax:change|openlayers:next|openlayers:previous', pjax_callback);  
  
  // https://javascript.info/event-delegation

  Y.delegate = (selector, eventType, childSelector, eventHandler) => {
    const elements = document.querySelectorAll(selector)
    for (element of elements) {
      element.addEventListener(eventType, eventOnElement => {
        if (eventOnElement.target.matches(childSelector)) {
          eventHandler(eventOnElement)
        }
      })
    }
  }

  function updateLoadingIndicator() {
    if (Y.isFullyLoaded) { 
      Y.nodes.body.classList.remove('openlayers-loading');
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


  function onOpenThumbnailsView() {
    
    Y.nodes.html.style.overflow = 'initial'

    hide('#openseadragon1')
    hide('#pager')
    hide('#pagemeta')

    Y.nodes.thumbnails.classList.remove('hidden')

    Y.nodes.thumbnails.innerHTML = '<div class="thumbnails container"></div>';

    const container = Y.nodes.thumbnails.querySelector('.thumbnails.container')
    const count = parseInt(Y.nodes.osd.dataset.sequenceCount, 10)
    const identifier = Y.nodes.osd.dataset.identifier
    const type = Y.nodes.osd.dataset.type
    const service = 'https://sites.dlib.nyu.edu/viewer/api/image'
    const viewerEndpoint = 'https://sites.dlib.nyu.edu/viewer'
    let item = 0;
    while (item <= count) {

      item++;

      const elm_div = document.createElement('div')
            elm_div.className = 'thumbnails item'

      const elm_a = document.createElement('a')
            elm_a.onclick = onThumbnailsClick
            elm_a.className = 'thumbnails sequence'
            elm_a.setAttribute('href', `${viewerEndpoint}/${type}/${identifier}/${item}`)
            elm_a.setAttribute('data-sequence', item)

      const elm_img = document.createElement('img');
            elm_img.setAttribute('src', `${service}/${type}/${identifier}/${item}/full/150,/0/default.jpg`)
            elm_img.setAttribute('alt', '')
            elm_img.setAttribute('loading', 'lazy')

      elm_div.appendChild(elm_a)
      elm_a.appendChild(elm_img)
      container.appendChild(elm_div)
    }
  }

  function onThumbnailsClick(event) {
    event.preventDefault()
    const current_target = event.currentTarget
    Y.nodes.osd.dataset.sequence = current_target.dataset.sequence
    
    Y.nodes.html.style.overflow = 'hidden'

    show('#openseadragon1')
    
    show('#pager')
    
    show('#pagemeta')
    
    hide('#thumbnails')

    document.dispatchEvent(
      new CustomEvent('sequence:available', {
        detail: {
          operation: 'change',
        }
      })
    );    
  }
 
  window.addEventListener('load', () => {

    Y.nodes.html = document.querySelector('html')

    Y.nodes.body = document.querySelector('body')
    
    Y.nodes.thumbnails = document.querySelector('#thumbnails')

    Y.nodes.buttonMetadata = document.querySelector('#button-metadata')

    Y.nodes.pagemeta = document.querySelector('#pagemeta')

    Y.nodes.osd = document.querySelector('#openseadragon1')

    Y.nodes.display = document.getElementById('#display')

    Y.nodes.togglePage = document.getElementById('toggle-page')

    Y.nodes.controlZoomOut = document.getElementById('control-zoom-out')

    Y.nodes.controlZoomIn = document.getElementById('control-zoom-in')

    Y.nodes.toggleLanguage = document.querySelector('body .language')

    document.dispatchEvent(
      new CustomEvent('viewer:contentready')
    )

    const tileSources = Y.nodes.osd.dataset.manifest.split(',').map((manifest, x) => {
      return {
        tileSource: manifest,
        x: x
      }
    })

    Y.Viewer = Y.OpenSeadragon({
      id: Y.nodes.osd.id,
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
    })

    Y.Viewer.world.addHandler('add-item', addItemHandler)

    Y.nodes.controlZoomIn.onclick = () => {
      const actualZoom = Y.Viewer.viewport.getZoom()
      const maxZoom = Y.Viewer.viewport.getMaxZoom()
      if (actualZoom < maxZoom) {
        Y.Viewer.viewport.zoomTo(actualZoom * 2)
      }    
    }

    // Zoom out event.
    Y.nodes.controlZoomOut.onclick = () => {
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

    Y.nodes.togglePage.onclick = (e) => {
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
    })

    document.querySelectorAll('a.paging').forEach(item => {
      item.addEventListener('click', pjax_callback, false)
    })
    
    document.querySelectorAll('a.button').forEach(item => {
      item.addEventListener('click', on_button_click, false)
    })

    document.addEventListener('sequence:available', change_page, false)

    document.addEventListener('button:button-metadata:on', onButtonMetadataOn, false)
    
    document.addEventListener('button:button-metadata:off', onButtonMetadataOff, false)
  
    document.addEventListener('button:button-fullscreen:on', fullscreenOn, false)
  
    document.addEventListener('button:button-fullscreen:off', fullscreenOff, false)
  
    document.addEventListener('pjax:load:available', onPjaxLoadAvailable, false)
  
    document.addEventListener('viewer:contentready', tilesLoading, false)

    document.addEventListener('button:button-thumbnails:on', onOpenThumbnailsView, false)
    
    Y.delegate('body', 'change', 'select', event => {
      const current_target = event.target      
      axios.get(current_target.value).then(response => {
        if (response.status === 200) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.data, 'text/html')
          const pane = document.querySelector('.view-mode-metadata')
          const pagemeta = doc.querySelector('.view-mode-metadata')          
          const main = document.querySelector('.pane.main')
          const html = document.querySelector('html')
          html.dir = pagemeta.dataset.dir
          main.dir = pagemeta.dataset.dir
          pane.dir = pagemeta.dataset.dir
          pane.innerHTML = pagemeta.innerHTML;
          // document.title = node.one('.field-name-title h2').get('innerText');
          // if (titlebar) {
          //   titlebar.set('dir', dir);
          // }
          // if (pagetitle) {
          //   pagetitle.set('innerHTML', document.title);
          // }
        }
      })
      .catch(error => {
        console.log(error);
      })
    })

    // Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'display:load', data: { osd: osd.dataset} }));

  });
}

ViewerApp({})
