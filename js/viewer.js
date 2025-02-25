import fscreen from 'fscreen'

async function ViewerApp(Y) {

  Y.Viewer = null

  Y.isFullyLoaded = false

  Y.seqmap = {}

  Y.nodes = {}

  Y.nodes.body = document.querySelector('body')

  Y.nodes.thumbnails = document.querySelector('#thumbnails')

  Y.nodes.buttonMetadata = document.querySelector('#button-metadata')

  Y.nodes.rotate = document.querySelector('#control-rotate')

  Y.nodes.pagemeta = document.querySelector('#pagemeta')

  Y.nodes.osd = document.querySelector('#openseadragon1')

  Y.nodes.display = document.getElementById('#display')

  Y.nodes.togglePage = document.getElementById('toggle-page')

  Y.nodes.controlZoomOut = document.getElementById('control-zoom-out')

  Y.nodes.controlZoomIn = document.getElementById('control-zoom-in')

  Y.nodes.toggleLanguage = document.querySelector('body .language')

  Y.nodes.next = document.querySelectorAll('.paging.next')

  Y.nodes.previous = document.querySelectorAll('.paging.previous')

  Y.nodes.slider = document.querySelector('#range_weight')

  Y.nodes.slider_value = document.querySelector('#slider_value')

  const { view, sequence, sequenceCount, current, type } = Y.nodes.osd.dataset

  // https://jira.nyu.edu/browse/FADESIGN-486
  if (fscreen.fullscreenEnabled) {
    document.querySelector('.navbar-fullscreen').classList.remove('hidden')
  }

  Y.count = Number(sequenceCount)

  function postMessage(fire, message) {
    const post = JSON.stringify({ fire, message })
    window.top.postMessage(post, '*')
  }

  function toggleview(props) {
    const { view } = props.dataset
    if (view == 'single') {
      props.dataset.view = 'doublepage'
    } else if (view == 'doublepage') {
      props.dataset.view = 'single'
    }
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
    } catch (e) {
      console.log(e)
    }
  }

  function fullscreen_on() {
    if (fscreen.fullscreenEnabled && !fscreen.fullscreenElement) {
      fscreen.requestFullscreen(document.documentElement)
      postMessage('button:button-fullscreen:on', {})
    }
  }

  function fullscreen_off() {
    if (fscreen.fullscreenEnabled && fscreen.fullscreenElement) {
      fscreen.exitFullscreen()
      postMessage('button:button-fullscreen:off', {})
    }
  }

  fscreen.onfullscreenchange = () => {
    if (fscreen.fullscreenEnabled && fscreen.fullscreenElement === null) {
      const button = document.querySelector('#button-fullscreen')
      if (button.classList.contains('on')) {
        button.classList.remove('on')
      }
    }
  }

  async function seqmap(props) {
    const { count, view, sequence } = props
    const sequences = []
    switch (view) {
      case 'doublepage':
        const seq = Math.ceil(Number(count) / 2) + 1
        Array(seq).fill().map((_, index) => {
          sequences.push([ index * 2, index * 2 + 1 ])
        })
        // Remove 0 from first index.
        sequences[0].shift()
        // Make sure last index does not includes outbound sequences.
        if (sequences[sequences.length - 1][1] > count) {
          sequences[sequences.length - 1].pop()
        }
        if (sequences[sequences.length - 1][0] > count) {
          sequences.pop()
        }
        return { sequences, count, view, sequence: sequences.find(value => value.includes(sequence) === true) }

      case 'single':
        Array(Number(count)).fill().map((_, index) => {
          sequences.push([ index + 1])
        })
        return { sequences, count, view, sequence: [ sequences.find(value => Number(value) === Number(sequence)) ] }

    }
  }

  async function load_sequence(e) {
    try {
      const osd = Y.nodes.osd
      const dataset = osd.dataset
      const { operation, to }  = e.detail
      const fire = `viewer:sequence:${operation}`
      switch (operation) {
        case 'increase':
          await increase(osd)
          break
        case 'decrease':
          await decrease(osd)
          break
        case 'change':
          await change(to, osd)
          break
        case 'toggleview':
          toggleview(osd)
          break
      }

      // Configuration for the new sequence.
      const message = {
        id: osd.id,
        title: dataset.title,
        count: Y.count,
        view: dataset.view,
        current: Number(dataset.current),
        sequence: Number(dataset.sequence),
        identifier: dataset.identifier,
        uri: `${dataset.uri}/${dataset.sequence}`,
      }

      Y.seqmap = await seqmap(message)

      postMessage(fire, message)

      const tileSources = await tiles(Y.seqmap, dataset)

      document.querySelector('.current_page').textContent = Y.seqmap.sequence.join(' - ')

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

      // Toggle view of books page icon.
      if (Y.nodes.togglePage) {
        Y.nodes.togglePage.classList.add('active')
        Y.nodes.togglePage.classList.remove('inactive')
      }

      show('#openseadragon1')

      show('#pager')

      Y.Viewer.open(tileSources)

      Y.nodes.body.classList.remove('openlayers-loading')

      Y.isFullyLoaded = true

    } catch (error) {
      console.log(error)
    }
  }

  function on_button_metadata_on() {
    const button = document.querySelector('#button-metadata')
    const element = document.querySelector('#pagemeta')
    element.classList.remove('hidden')
    button.classList.remove('off')
    button.classList.add('on')
    element.closest('.pane-body').classList.remove('pagemeta-hidden')
    postMessage('button:button-metadata:on', {})
  }

  function on_button_metadata_off() {
    const button = document.querySelector('#button-metadata')
    const element = document.querySelector('#pagemeta')
    button.classList.remove('on')
    button.classList.add('off')
    element.classList.add('hidden')
    element.closest('.pane-body').classList.add('pagemeta-hidden')
    postMessage('button:button-metadata:off', {})
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
      postMessage('viewer:loaded', {})
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

  function on_hide_thumbnails_view() {
    const osd = Y.nodes.osd
    const { sequenceCount, sequence } = osd.dataset
    document.querySelector('html').classList.remove('thumbnails-view')
    hide('#thumbnails')

    // Toggle view of books page icon.
    if (Y.nodes.togglePage) {
      Y.nodes.togglePage.classList.remove('inactive')
      Y.nodes.togglePage.classList.add('active')
    }

    Y.nodes.next.forEach(item => {
      if (sequence < sequenceCount) {
        item.classList.remove('inactive')
        item.classList.add('active')
      }
    })

    Y.nodes.previous.forEach(item => {
      if (sequence > 1) {
        item.classList.remove('inactive')
        item.classList.add('active')
      }
    })

  }

  function on_open_thumbnails_view() {

    const { uri, type } = Y.nodes.osd.dataset

    if (type === 'photos') {
      window.location = document.querySelector('#button-thumbnails').href
      return
    }

    const { state } = Y.nodes.thumbnails.dataset

    const width = '230'

    const height = '150'

    document.querySelector('html').classList.add('thumbnails-view')
    const zoomIn = document.querySelector('#control-zoom-in')
    const zoomOut = document.querySelector('#control-zoom-out')

    zoomIn.classList.remove('active')
    zoomIn.classList.add('inactive')
    zoomIn.setAttribute('aria-disabled', 'true')

    zoomOut.classList.remove('active')
    zoomOut.classList.add('inactive')
    zoomOut.setAttribute('aria-disabled', 'true')

    // Toggle view of books page icon.
    if (Y.nodes.togglePage) {
      Y.nodes.togglePage.classList.remove('active')
      Y.nodes.togglePage.classList.add('inactive')
      Y.nodes.togglePage.setAttribute('aria-disabled', 'true')
    }
    Y.nodes.next.forEach(item => {
      item.classList.remove('active')
      item.classList.add('inactive')
      item.setAttribute('aria-disabled', 'true')
    })

    Y.nodes.previous.forEach(item => {
      item.classList.remove('active')
      item.classList.add('inactive')
      item.setAttribute('aria-disabled', 'true')
    })

    if (Number(state) === 0) {
      axios.get(`${uri}/thumbnails?width=${width}&height=${height}`).then(response => {
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
    const buttonThumbnails = document.getElementById('button-thumbnails')
    document.querySelector('html').classList.remove('thumbnails-view')
    if (buttonThumbnails.classList.contains('on')) {
      buttonThumbnails.classList.remove('on')
      buttonThumbnails.classList.add('off')
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
          trigger: 'change',
        }
      })
    )
  }

  async function decrease(props) {
    const to = Math.min(...Y.seqmap.sequence) - 1
    if (to < 1) {
      return to
    } else {
      props.dataset.sequence = to.toString()
      const range_weight = document.querySelector('#range_weight')
      const slider_value = document.querySelector('#slider_value')
      if (range_weight && slider_value) {
        range_weight.value = to
        slider_value.value = to
      }
    }
  }

  async function change(to, props) {
    const { sequenceCount } = props.dataset
    const sequence = Number(to)
    const sequence_count = Number(sequenceCount)
    if (sequence < 1) {
      return 1
    } else if (sequence > sequence_count) {
      return sequence_count
    } else {
      props.dataset.sequence = sequence.toString()
      const range_weight = document.querySelector('#range_weight')
      const slider_value = document.querySelector('#slider_value')
      if (range_weight && slider_value) {
        range_weight.value = to
        slider_value.value = to
      }
    }
  }

  function delegate(selector, eventType, childSelector, eventHandler) {
    const elements = document.querySelectorAll(selector)
    for (let element of elements) {
      element.addEventListener(eventType, eventOnElement => {
        if (eventOnElement.target.matches(childSelector)) {
          eventHandler(eventOnElement)
        }
      })
    }
  }

  function hide(selector) {
    document.querySelectorAll(selector).forEach(elm => {
      elm.style.display = null
      elm.style.visibility = null
      elm.hidden = null
      elm.height = 0
    })
  }

  async function increase(props) {
    const {
      sequenceCount
    } = props.dataset

    const to = Math.max(...Y.seqmap.sequence) + 1

    if (to > Number(sequenceCount)) {
      return sequenceCount
    } else {
      props.dataset.sequence = to.toString()
      const range_weight = document.querySelector('#range_weight')
      const slider_value = document.querySelector('#slider_value')
      if (range_weight && slider_value) {
        range_weight.value = to
        slider_value.value = to
      }
    }
  }

  function show(selector) {
    document.querySelectorAll(selector).forEach(elm => {
      elm.style.display = null
      elm.style.visibility = null
      elm.hidden = null
    })
  }

  async function tiles(seqmap, dataset) {
    if (dataset.dir == 'rtl') {
      seqmap.sequence = seqmap.sequence.reverse()
    }
    return seqmap.sequence.map((sequence, x) => {
      return {
        tileSource: `${dataset.service}/${dataset.type}/${dataset.identifier}/${sequence}/info.json`, x
      }
    })
  }

  postMessage('viewer:init', {})

  postMessage('viewer:contentready', {})

  // Calls tiles loading.
  document.dispatchEvent(
    new CustomEvent('viewer:contentready')
  )

  if (view == 'doublepage') {
    if (Y.nodes.togglePage && Y.nodes.togglePage.classList.contains('page-double')) {
      Y.nodes.togglePage.classList.remove('page-double')
      Y.nodes.togglePage.classList.add('page-single')
    }
  }

  Y.seqmap = await seqmap({ count: Y.count, view, sequence, current })

  document.querySelector('.current_page').textContent =  Y.nodes.osd.dataset.sequence = sequence

  if (Y.nodes.slider) {
    Y.nodes.slider.value = sequence
  }

  if (Y.nodes.slider_value) {
    Y.nodes.slider_value.value = sequence
  }

  document.querySelectorAll('.sequence_count').forEach(item => {
    item.textContent = Y.seqmap.count
  })

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

  const formSequence = document.querySelector('#form-update-sequence')

  if (formSequence && Y.nodes.slider_value) {
    formSequence.onsubmit = (event) => {
      event.preventDefault()
      document.dispatchEvent(
        new CustomEvent('load:sequence', {
          detail: {
            operation: 'change',
            to: Y.nodes.slider_value.value,
            trigger: 'onsubmit',
          }
        })
      )
    }
  }

  // Zoom in click event.
  Y.nodes.controlZoomIn.onclick = (e) => {
    e.preventDefault()
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
  Y.nodes.controlZoomOut.onclick = (e) => {
    e.preventDefault()
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

  if (Y.nodes.togglePage) {
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
      )
    }
  }

  document.querySelectorAll('a.paging').forEach(item => {
    item.addEventListener('click', on_paging_click)
  })

  document.querySelectorAll('a.button').forEach(item => {
    item.addEventListener('click', (event) => {
      event.preventDefault()
      const current_target = event.currentTarget
      let event_prefix = `button:${current_target.id}`
      /** don't waste time if the button is inactive */
      if (current_target.classList.contains('inactive')) {
        return false
      }
      if (current_target.classList.contains('on')) {
        current_target.classList.remove('on')
        current_target.classList.add('off')
        document.dispatchEvent(
          new CustomEvent(`${event_prefix}:off`, event)
        )
      }
      else {
        current_target.classList.add('on')
        current_target.classList.remove('off')
        document.dispatchEvent(
          new CustomEvent(`${event_prefix}:on`, event)
        )
      }
      document.dispatchEvent(
        new CustomEvent(`${event_prefix}:toggle`, event)
      )
    })
  })

  if (Y.nodes.slider) {
    Y.nodes.slider.addEventListener('change', slide_value_change)
  }

  document.addEventListener('load:sequence', load_sequence)

  window.addEventListener('popstate', (e) => {
    document.dispatchEvent(
      new CustomEvent('viewer:popstate', {
        detail: {
          operation: 'change',
          to: history.state.sequence,
          trigger: 'popstate',
        }
      })
    )
  })

  document.addEventListener('button:button-metadata:on', on_button_metadata_on)

  document.addEventListener('button:button-metadata:off', on_button_metadata_off)

  document.addEventListener('button:button-fullscreen:on', fullscreen_on)

  document.addEventListener('button:button-fullscreen:off', fullscreen_off)

  document.addEventListener('viewer:contentready', tiles_loading)

  document.addEventListener('button:button-thumbnails:on', on_open_thumbnails_view)

  document.addEventListener('button:button-thumbnails:off', on_hide_thumbnails_view)

  // Language.
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

  // Volume.
  delegate('body', 'change', '.view-mv select', event => {
    const current_target = event.target
    const value = current_target.value
    const node = document.querySelector('.node-dlts-book')
    const lang = node.dataset.lang
    const url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang
    if (window.self === window.top) {
      window.location.assign(url)
    } else {
      postMessage('change:option:multivolume', url)
    }
  })

}

ViewerApp({ OpenSeadragon: window.OpenSeadragon, axios })
