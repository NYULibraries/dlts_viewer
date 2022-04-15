import OpenSeaDragon from 'openseadragon'
import axios from 'axios'
import { seqmap } from './componets/seqmap.mjs'
import { hide } from './componets/hide.mjs'
import { show } from './componets/show.mjs'
import { delegate } from './componets/delegate.mjs'
import { decrease } from './componets/decrease-sequence.js'
import { increase } from './componets/increase-sequence.js'
import { change } from './componets/change-sequence.mjs'
import { tiles }  from './componets/tile-sources.js'
import { toggleview } from './componets/toggleview-sequence.js'

function ViewerApp(Y) {
  
  Y.OpenSeadragon = OpenSeaDragon

  Y.Viewer = null

  Y.isFullyLoaded = false

  Y.seqmap = []

  function on_button_click(e) {
    console.log('on_button_click', e, e.currentTarget)
    e.preventDefault();
    const current_target = e.currentTarget
    let event_prefix, event_id
    /** don't waste time if the button is inactive */
    if (current_target.classList.contains('inactive')) return
    /** current target is the main target */
    else {
      event_id = current_target.id
      event_prefix = 'button:' + event_id
    }
    if (current_target.classList.contains('on')) {
      current_target.classList.remove('on')
      current_target.classList.add('off')
      console.log(`${event_prefix}:off`)
      document.dispatchEvent(
        new CustomEvent(`${event_prefix}:off`, e)
      );
    }
    else {
      current_target.classList.add('on')
      current_target.classList.remove('off')
      console.log(`${event_prefix}:on`)
      document.dispatchEvent(
        new CustomEvent(`${event_prefix}:on`, e)
      )
    }
    document.dispatchEvent(
      new CustomEvent(`${event_prefix}:toggle`, e)
    )
  }

  function on_paging_click(e) {
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

  function fullscreen_on() {
    const docElm = document.documentElement
    const top = document.querySelector('.top')
    const button = document.querySelector('#button-metadata')
    if (button) {
      button.classList.remove('on')
    }
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    }
    else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen()
    }
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen()
    }
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen()
    }
    if (top) {
      button.classList.add('hidden')
    }
  }

  function fullscreen_off() {
    const top = document.querySelector('.top')
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    }
    if (top) {
      top.classList.remove('hidden')
    }
  }

  async function load_sequence(e) {

    try {

      let items = []

      const osd = Y.nodes.osd

      const dataset = osd.dataset

      switch (e.detail.operation) {
        case 'increase':
          await increase(osd)
          break

        case 'decrease':
          await decrease(osd)
          break

        case 'change':
          await change(e.detail.to, osd)
          break

        case 'toggleview':          
          Y.seqmap = await toggleview(osd, Y.seqmap)
          break
      }

      const tileSources = await tiles(Y.seqmap, dataset)

      Y.nodes.loadingMsg.textContent = items.join(' - ')

      Y.nodes.next.forEach((item) => {
        if (dataset.sequence >= Y.seqmap.count) {
          item.classList.add('inactive')
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive')
          }
        }
      })

      Y.nodes.previous.forEach((item) => {
        if (dataset.sequence <= 1) {
          item.classList.add('inactive')
        } else {
          if (item.classList.contains('inactive')) {
            item.classList.remove('inactive')
          }
        }
      })

      Y.nodes.togglePage.classList.add('active')
      
      Y.nodes.togglePage.classList.remove('inactive')

      show('#openseadragon1')

      show('#pager')

      Y.Viewer.open(tileSources)

      Y.nodes.body.classList.remove('openlayers-loading')

      Y.isFullyLoaded = true

    } catch(e) {
      console.log(e)
    }
  }

  function on_button_metadata_on() {
    const button = document.querySelector('#button-metadata')
    const element = document.querySelector('#pagemeta')
    element.classList.remove('hidden')
    button.classList.remove('off')
    button.classList.add('on')
    element.closest('.pane-body').classList.remove('pagemeta-hidden')
  }

  function on_button_metadata_off() {
    const button = document.querySelector('#button-metadata')
    const element = document.querySelector('#pagemeta')
    button.classList.remove('on')
    button.classList.add('off')
    element.classList.add('hidden')
    element.closest('.pane-body').classList.add('pagemeta-hidden')
    // Y.CrossFrame.postMessage("parent", JSON.stringify({fire: 'button:button-metadata:off'}));
  }

  function tiles_loading() {
    if (body.classList.contains('openlayers-loading')) {
      setTimeout(() => {
        tiles_loading()
      }, 100);
    } else {
      hide('.pane.load')
      Y.nodes.body.classList.remove('openlayers-loading')
    }
  }
 
  function update_loading_indicator() {
    if (Y.isFullyLoaded) {
      Y.nodes.body.classList.remove('openlayers-loading')
      hide('.pane.load')
      // Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'viewer:isFullyLoaded', data: {} }));
    }
  }

  function add_item_handler(event) {
    const tiledImage = event.item
    tiledImage.addHandler('fully-loaded-change', () => {
      const newFullyLoaded = are_all_fully_loaded()
      if (newFullyLoaded !== Y.isFullyLoaded) {
        Y.isFullyLoaded = newFullyLoaded
        update_loading_indicator()
      }
    })
  }
  
  function are_all_fully_loaded() {
    const count = Y.Viewer.world.getItemCount()
    for (let i = 0; i < count; i++) {
      const tiledImage = Y.Viewer.world.getItemAt(i)
      if (!tiledImage.getFullyLoaded()) {
        return false
      }
    }
    return true
  }

  function on_hide_thumbnails_view() {

    const osd = Y.nodes.osd

    const { sequenceCount, sequence } = osd.dataset

    Y.nodes.html.classList.remove('thumbnails-view')

    hide('#thumbnails')

    Y.nodes.togglePage.classList.remove('inactive')
    Y.nodes.togglePage.classList.add('active')    

    Y.nodes.next.forEach(item => {
      item.classList.remove('active')
      item.classList.add('inactive')
    })

    Y.nodes.previous.forEach(item => {
      if (sequence > 1) {
        item.classList.remove('inactive')
        item.classList.add('active')
      }
    })

    Y.nodes.next.forEach(item => {
      if (sequence < sequenceCount) {
        item.classList.remove('inactive')
        item.classList.add('active')
      }
    })

  }

  function on_open_thumbnails_view() {

    const { uri } = Y.nodes.osd.dataset

    const { state } = Y.nodes.thumbnails.dataset

    const width = '230'

    const height = '150'

    Y.nodes.html.classList.add('thumbnails-view')

    Y.nodes.controlZoomOut.classList.remove('active')
    Y.nodes.controlZoomOut.classList.add('inactive')

    Y.nodes.controlZoomIn.classList.remove('active')
    Y.nodes.controlZoomIn.classList.add('inactive')

    Y.nodes.togglePage.classList.remove('active')
    Y.nodes.togglePage.classList.add('inactive')
    
    Y.nodes.next.forEach(item => {
      item.classList.remove('active')
      item.classList.add('inactive')
    })

    Y.nodes.previous.forEach(item => {
      item.classList.remove('active')
      item.classList.add('inactive')
    })

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
        
        show('#thumbnails')

      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  function onThumbnailsClick(event) {
    event.preventDefault()
    Y.nodes.html.classList.remove('thumbnails-view')
    if (Y.nodes.buttonThumbnails.classList.contains('on')) {
      Y.nodes.buttonThumbnails.classList.remove('on')
      Y.nodes.buttonThumbnails.classList.add('off')
    }

    hide('#thumbnails')

    document.dispatchEvent(
      new CustomEvent('load:sequence', {
        detail: {
          operation: 'change',
          to: event.currentTarget.dataset.sequence
        }
      })
    );    
  }

  function slide_value_change(event) {
    document.dispatchEvent(
      new CustomEvent('load:sequence', {
        detail: {
          operation: 'change',
          to: event.currentTarget.value,
        }
      })
    )
  }
 
  window.addEventListener('load', async () => {
    Y.nodes = {
      html: document.querySelector('html'),
      body: document.querySelector('body'),
      thumbnails: document.querySelector('#thumbnails'),
      buttonMetadata: document.querySelector('#button-metadata'),
      rotate: document.querySelector('#control-rotate'),
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

    const { sequenceCount } = Y.nodes.osd.dataset

    const params = new URLSearchParams(window.location.search)

    const view = params.get('view')

    let req_sequence = params.get('sequence')

    if (!req_sequence) {
      req_sequence = 1
    }

    Y.seqmap = await seqmap({ count: sequenceCount, view })

    if (view) {
      Y.nodes.osd.dataset.view = view // 'singlepage', 'doublepage'
      if (view == 'doublepage') {
        if (Y.nodes.togglePage.classList.contains('page-double')) {
          Y.nodes.togglePage.classList.remove('page-double')
          Y.nodes.togglePage.classList.add('page-single')
        }
      }
    }
    
    document.querySelector('.current_page').textContent = Y.nodes.osd.dataset.sequence = Y.nodes.slider.value = Y.nodes.slider_value.value = req_sequence
    
    Y.nodes.slider.max = Y.seqmap.count

    document.querySelectorAll('.sequence_count').forEach(item => {
      item.textContent = Y.seqmap.count
    })

    document.dispatchEvent(
      new CustomEvent('viewer:contentready')
    )

    const tileSources = await tiles(Y.seqmap, Y.nodes.osd.dataset)

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

    // OpenSeadragon event.
    Y.Viewer.world.addHandler('add-item', add_item_handler)

    // OpenSeadragon event.
    Y.Viewer.addHandler('zoom', () => {

      if (Y.nodes.osd.hidden) return

      const actualZoom = Y.Viewer.viewport.getZoom()
      const maxZoom = Y.Viewer.viewport.getMaxZoom()
      const minZoom = Y.Viewer.viewport.getMinZoom()      

      if (
        actualZoom < maxZoom && 
        Y.nodes.controlZoomIn.classList.contains('inactive')
      ) {
        Y.nodes.controlZoomIn.classList.remove('inactive')
        Y.nodes.controlZoomIn.classList.add('active')
      }

      if (
        actualZoom >= maxZoom
      ) {
        Y.nodes.controlZoomIn.classList.add('inactive')
        Y.nodes.controlZoomIn.classList.remove('active')
      }

      if (
        actualZoom <= minZoom
      ) {
        Y.nodes.controlZoomOut.classList.add('inactive')
        Y.nodes.controlZoomOut.classList.remove('active')
      }

      if (
        actualZoom > minZoom
      ) {
        Y.nodes.controlZoomOut.classList.remove('inactive')
        Y.nodes.controlZoomOut.classList.add('active')
      }

    })

    // Zoom in click event.
    Y.nodes.controlZoomIn.onclick = () => {
      const actualZoom = Y.Viewer.viewport.getZoom()
      const maxZoom = Y.Viewer.viewport.getMaxZoom()
      const minZoom = Y.Viewer.viewport.getMinZoom()
      const zoomTo = actualZoom * 2
      if (actualZoom < maxZoom) {
        Y.Viewer.viewport.zoomTo(zoomTo)
      }
      // look for event options (OpenSeaDragon zoom end)
      if (zoomTo >= maxZoom) {
        Y.nodes.controlZoomIn.classList.add('inactive')
      }
      if (actualZoom > minZoom) {
        if (Y.nodes.controlZoomOut.classList.contains('inactive')) {
          Y.nodes.controlZoomOut.classList.remove('inactive')
        }
      }
    }

    // Zoom out click event.
    Y.nodes.controlZoomOut.onclick = () => {
      const actualZoom = Y.Viewer.viewport.getZoom()
      const minZoom = Y.Viewer.viewport.getMinZoom()
      const zoom = actualZoom / 2
      if (zoom >= minZoom) {
        Y.Viewer.viewport.zoomTo(zoom)
      } else {
        if (actualZoom > minZoom) {
          Y.Viewer.viewport.zoomTo(minZoom)
        }
      }
    }

    // Zoom out click event.
    Y.nodes.rotate.onclick = (e) => {
      e.preventDefault()
      console.log(Y.Viewer.viewport)
      Y.Viewer.viewport.setRotation(Y.Viewer.viewport.degrees + 90);
    }

    Y.nodes.togglePage.onclick = (e) => {
      e.preventDefault()
      if (e.currentTarget.classList.contains('inactive')) return false
      if (Y.nodes.togglePage.classList.contains('page-double')) {
        Y.nodes.togglePage.classList.remove('page-double')
        Y.nodes.togglePage.classList.add('page-single')
      }
      else {
        Y.nodes.togglePage.classList.remove('page-single')
        Y.nodes.togglePage.classList.add('page-double')
      }
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

    document.addEventListener('load:sequence', load_sequence)

    document.addEventListener('button:button-metadata:on', on_button_metadata_on)

    document.addEventListener('button:button-metadata:off', on_button_metadata_off)

    document.addEventListener('button:button-fullscreen:on', fullscreen_on)

    document.addEventListener('button:button-fullscreen:off', fullscreen_off)

    document.addEventListener('viewer:contentready', tiles_loading)

    document.addEventListener('button:button-thumbnails:on', on_open_thumbnails_view)

    document.addEventListener('button:button-thumbnails:off', on_hide_thumbnails_view)

    // Language
    delegate('body', 'change', '.lang-options select', event => {
      const current_target = event.target
      axios.get(current_target.value).then(response => {
        if (response.status === 200) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(response.data, 'text/html')
          const pane = document.querySelector('.view-mode-metadata')
          const pagemeta = doc.querySelector('.view-mode-metadata')          
          const main = document.querySelector('.pane.main')
          const html = document.querySelector('html')
          html.dir = pagemeta.dataset.dir
          main.dir = pagemeta.dataset.dir
          pane.dir = pagemeta.dataset.dir
          pane.innerHTML = pagemeta.innerHTML
        }
      })
      .catch(error => {
        console.log(error)
      })
    })

    // Volume
    delegate('body', 'change', '.view-mv select', event => {
      const current_target = event.target
      const value = current_target.value
      const node = document.querySelector('.node-dlts-book')
      const lang = node.dataset.lang
      const url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang
      if (window.self === window.top) {
        window.location.assign(url)
      }
    })

  })

}

ViewerApp({})
