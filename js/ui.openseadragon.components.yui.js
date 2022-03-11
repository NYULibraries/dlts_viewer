import OpenSeaDragon from 'openseadragon';
import {MDCList} from '@material/list';

// https://www.npmjs.com/package/material-ui-image
// import Image from 'material-ui-image'

function ViewerApp(Y) {

  new MDCList(document.querySelector('.mdc-list'));
  
  Y.OpenSeadragon = OpenSeaDragon

  Y.Viewer = null

  Y.isFullyLoaded = false  

  Y.show = (selector) => {
    document.querySelectorAll(selector).forEach(elm => {
      elm.style.display = null
      elm.style.visibility = null
      elm.hidden = null
    })
  }

  Y.hide = (selector) => {
    document.querySelectorAll(selector).forEach(elm => {
      elm.style.display = 'none'
      elm.style.visibility = 'hidden'
      elm.setAttribute('hidden', true)
    })
  }

  Y.delegate = (selector, eventType, childSelector, eventHandler) => {
    const elements = document.querySelectorAll(selector)
    for (let element of elements) {
      element.addEventListener(eventType, eventOnElement => {
        if (eventOnElement.target.matches(childSelector)) {
          eventHandler(eventOnElement)
        }
      })
    }
  }

  function on_button_click(e) {
    console.log('on_button_click', e, e.currentTarget);
    e.preventDefault();
    const current_target = e.currentTarget;
    let event_prefix, event_id;
    /** don't waste time if the button is inactive */
    if (current_target.classList.contains('inactive')) return;
    /** current target is the main target */
    else {
      event_id = current_target.id;
      event_prefix = 'button:' + event_id;
    }
    if (current_target.classList.contains('on')) {
      current_target.classList.remove('on');
      current_target.classList.add('off');
      console.log(`${event_prefix}:off`)
      document.dispatchEvent(
        new CustomEvent(`${event_prefix}:off`, e)
      );
    }
    else {
      current_target.classList.add('on');
      current_target.classList.remove('off');
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

  function on_paging_click(e) {
    console.log('on_paging_click', e)
    const currentTarget = e.currentTarget
    e.preventDefault()
    /** test if the target is not active */
    if (currentTarget.classList.contains('inactive')) return false
    try {
      Y.nodes.body.classList.add('openlayers-loading')
      document.dispatchEvent(
        new CustomEvent('load:sequence', {
          detail: {
            operation: e.currentTarget.dataset.operation,
          }
        })
      )
    } catch(e) {
      console.log(e)
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

  function loadSequence(e) {
    console.log('loadSequence')
    try {
      const {
        operation
      } = e.detail

      Y.isFullyLoaded = true

      const osd = Y.nodes.osd

      const { type, identifier, view, service } = osd.dataset

      let sequence = parseInt(osd.dataset.sequence, 10)

      const sequenceCount = parseInt(osd.dataset.sequenceCount, 10)

      const items = []

      if (operation == 'decrease') {
        sequence = sequence - 1
        if (sequence < 1) {
          sequence = 1
        }
        items[0] = sequence
        console.log('decrease', sequence)
      }

      if (operation == 'increase') {
        sequence = sequence + 1
        if (sequence > sequenceCount) {
          sequence = sequenceCount
        }
        if (osd.dataset.view == 'single') {
          items[0] = sequence;
        } else {
          if (sequence % 2 === 1) {
            items[0] = sequence
            items[1] = sequence + 1
          } else {
            items[0] = sequence - 1
            items[1] = sequence
          }
        }
      }

      if (operation == 'toggleview') {
        if (osd.dataset.view == 'single') {
          osd.dataset.view = 'doublepage'
          if (sequence % 2 === 1) {
            items[0] = sequence
            items[1] = sequence + 1
          } else {
            items[0] = sequence - 1
            items[1] = sequence
          }
        } else {
          osd.dataset.view = 'single'
          items[0] = sequence
        }
      }

      if (operation == 'change') {
        items[0] = sequence
      }

      osd.dataset.sequence = sequence

      Y.nodes.loadingMsg.textContent = items.join(' - ')

      Y.nodes.slider.value = sequence

      Y.nodes.slider_value.value = sequence

      Y.nodes.slider_value.value = sequence

      const tileSources = items.map((sequence, x) => {
        return {
          tileSource: `${service}/${type}/${identifier}/${sequence}/info.json`,
          x: x
        }
      });

      Y.nodes.next.forEach((item) => {
        if (sequence >= sequenceCount) {
          item.classList.add('inactive')
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive')
          }
        }
      });

      Y.nodes.previous.forEach((item) => {
        if (sequence <= 1) {
          item.classList.add('inactive');
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive')
          }
        }
      });

      window.history.pushState({}, 'some title', items[0].toString())

      Y.show('#openseadragon1')

      Y.show('#pager')

      Y.Viewer.open(tileSources)
      
      Y.nodes.body.classList.remove('openlayers-loading')

      // Let parent know that Viewer is going to paint.
      // Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'viewer:change', data: config }));

    } catch(e) {
      console.log(e)
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

  function tilesLoading() {
    if (body.classList.contains('openlayers-loading')) {
      setTimeout(() => {
        tilesLoading();
      }, 100);
    } else {
      Y.hide('.pane.load');
      Y.nodes.body.classList.remove('openlayers-loading');
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

  // https://javascript.info/event-delegation
  // Y.delegate('change', onSelectMVChange, 'body', '.field-name-mv-2016 form');
 
  function updateLoadingIndicator() {
    if (Y.isFullyLoaded) {
      Y.nodes.body.classList.remove('openlayers-loading')
      Y.hide('.pane.load')
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

  function onHideThumbnailsView() {

    const osd = Y.nodes.osd

    Y.nodes.html.style.overflow = 'initial'

    Y.show(`#${osd.id}`)

    Y.show('#pager')

    Y.hide('#thumbnails')

  }

  function onOpenThumbnailsView() {

    const { id, uri } = Y.nodes.osd.dataset

    const { state } = Y.nodes.thumbnails.dataset

    const width = '230'

    const height = '150'

    Y.hide('#openseadragon1')

    Y.hide('#pager')

    Y.nodes.html.style.overflow = 'initial'

    Y.show('#thumbnails')

    if (parseInt(state, 10) === 0) {
      axios.get(`${uri}/thumbnails?pjax=true&width=${width}&height=${height}`).then(response => {
        if (response.status === 200) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(response.data, 'text/html')
           Y.nodes.thumbnails.appendChild(
            doc.querySelector('.thumbnails.container')
          )
          document.querySelectorAll('.thumbnails.container a').forEach(item => {
            item.addEventListener('click', onThumbnailsClick)
          })
          Y.nodes.thumbnails.dataset.state = 1
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  function onThumbnailsClick(event) {
    event.preventDefault()
    
    const current_target = event.currentTarget
    
    Y.nodes.osd.dataset.sequence = current_target.dataset.sequence
    
    if (Y.nodes.buttonThumbnails.classList.contains('on')) {
      Y.nodes.buttonThumbnails.classList.remove('on')
      Y.nodes.buttonThumbnails.classList.add('off')
    }

    Y.nodes.html.style.overflow = 'hidden'

    Y.hide('#thumbnails')

    document.dispatchEvent(
      new CustomEvent('load:sequence', {
        detail: {
          operation: 'change',
        }
      })
    );    
  }

  function slide_value_change(event) {
    console.log('slide_value_change', event, event.currentTarget.value)
    Y.nodes.osd.dataset.sequence = event.currentTarget.value
    document.dispatchEvent(
      new CustomEvent('load:sequence', {
        detail: {
          operation: 'change',
        }
      })
    )
  }
 
  window.addEventListener('load', () => {

    Y.nodes = {
      html: document.querySelector('html'),
      body: document.querySelector('body'),
      thumbnails: document.querySelector('#thumbnails'),
      buttonMetadata: document.querySelector('#button-metadata'),
      pagemeta: document.querySelector('#pagemeta'),
      osd: document.querySelector('#openseadragon1'),
      display: document.getElementById('#display'),
      togglePage: document.getElementById('toggle-page'),
      controlZoomOut: document.getElementById('control-zoom-out'),
      controlZoomIn: document.getElementById('control-zoom-in'),
      toggleLanguage: document.querySelector('body .language'),
      slider: document.querySelector('#range_weight'),
      slider_value: document.querySelector('#slider_value'),
      loadingMsg: document.querySelector('.current_page'),
      buttonThumbnails: document.getElementById('button-thumbnails'),
      next: document.querySelectorAll('.paging.next'),
      previous: document.querySelectorAll('.paging.previous')
    }

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
        new CustomEvent('load:sequence', {
          detail: {
            operation: e.currentTarget.dataset.operation,
          }
        })
      );
    }

    document.querySelectorAll('a.paging').forEach(item => {
      item.addEventListener('click', on_paging_click)
    })
    
    document.querySelectorAll('a.button').forEach(item => {
      item.addEventListener('click', on_button_click)
    })

    Y.nodes.slider.addEventListener('change', slide_value_change)

    document.addEventListener('load:sequence', loadSequence)

    document.addEventListener('button:button-metadata:on', onButtonMetadataOn)

    document.addEventListener('button:button-metadata:off', onButtonMetadataOff)

    document.addEventListener('button:button-fullscreen:on', fullscreenOn)

    document.addEventListener('button:button-fullscreen:off', fullscreenOff)

    document.addEventListener('pjax:load:available', onPjaxLoadAvailable)

    document.addEventListener('viewer:contentready', tilesLoading)

    document.addEventListener('button:button-thumbnails:on', onOpenThumbnailsView)

    document.addEventListener('button:button-thumbnails:off', onHideThumbnailsView)

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

  })

}

ViewerApp({})
