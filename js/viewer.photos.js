import OpenSeaDragon from 'openseadragon'
import axios from 'axios'
import { seqmap } from './componets/seqmap.mjs'
import { hide } from './componets/hide.mjs'
import { show } from './componets/show.mjs'
import { tiles }  from './componets/tile-sources.js'

// import { decrease } from './componets/decrease-sequence.js'
// import { change } from './componets/change-sequence.mjs'
// import { toggleview } from './componets/toggleview-sequence.js'

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

  async function increase(props) {
    const sequence_current = Number(props.dataset.sequence)
    const sequence_count = Number(props.dataset.sequenceCount)
    const sequence = sequence_current + 1
    if (sequence > sequence_count) {
      return sequence_count
    } else {
      props.dataset.sequence = sequence.toString()
    }
  }

  async function decrease(props) {
    const sequence_current = Number(props.dataset.sequence)
    const sequence = sequence_current - 1
    if (sequence < 1) {
      return sequence
    } else {
      props.dataset.sequence = sequence.toString()
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
    Y.Viewer.viewport.setRotation(0)
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

  window.addEventListener('load', async () => {
    Y.nodes = {
      html: document.querySelector('html'),
      body: document.querySelector('body'),
      rotate: document.querySelector('#control-rotate'),
      pagemeta: document.querySelector('#pagemeta'),
      osd: document.querySelector('#openseadragon1'),
      display: document.getElementById('#display'),
      controlZoomOut: document.getElementById('control-zoom-out'),
      controlZoomIn: document.getElementById('control-zoom-in'),
      loadingMsg: document.querySelector('.current_page'),
      next: document.querySelectorAll('.paging.next'),
      previous: document.querySelectorAll('.paging.previous')
    }

    const { sequenceCount, sequence, type } = Y.nodes.osd.dataset

    const params = new URLSearchParams(window.location.search)

    const view = params.get('view')

    let req_sequence = params.get('sequence')

    if (!req_sequence) {
      req_sequence = sequence
    }

    Y.seqmap = await seqmap({ count: sequenceCount, view })
   
    document.querySelector('.current_page').textContent =  Y.nodes.osd.dataset.sequence = req_sequence
    
    document.querySelector('.sequence_count').textContent = Y.seqmap.count

    document.dispatchEvent(
      new CustomEvent('viewer:contentready')
    )

    const tileSources = await tiles(Y.seqmap, Y.nodes.osd.dataset)

    const options = {
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
    }

    if (type == 'maps') {
      options.showNavigator = true
    }

    Y.Viewer = Y.OpenSeadragon(options)

    // OpenSeadragon event.
    Y.Viewer.world.addHandler('add-item', add_item_handler)

    Y.Viewer.addHandler('page', (e) => {
      console.log('page event')
    })

    Y.Viewer.world.addHandler('item-index-change', (e) => {
      console.log('item-index-change event')
    })

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
      Y.Viewer.viewport.setRotation(Y.Viewer.viewport.degrees + 90)
    }

    document.querySelectorAll('a.paging').forEach(item => {
      item.addEventListener('click', on_paging_click)
    })
    
    document.querySelectorAll('a.button').forEach(item => {
      item.addEventListener('click', on_button_click)
    })

    document.addEventListener('load:sequence', load_sequence)

    document.addEventListener('button:button-metadata:on', on_button_metadata_on)

    document.addEventListener('button:button-metadata:off', on_button_metadata_off)

    document.addEventListener('button:button-fullscreen:on', fullscreen_on)

    document.addEventListener('button:button-fullscreen:off', fullscreen_off)

    document.addEventListener('viewer:contentready', tiles_loading)

  })

}

ViewerApp({})
