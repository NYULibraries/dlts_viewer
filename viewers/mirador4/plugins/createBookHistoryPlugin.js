import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { getCanvasIndex, getCanvases, getWindowIds, setCanvas } from 'mirador'

/**
 * Mirador 4 plugin that keeps the browser URL in sync with the current
 * canvas/page, and drives Mirador when the user navigates with the browser
 * back/forward buttons.
 *
 * Usage:
 *   createBookHistoryPlugin({ identifier })
 *
 * `identifier` is the book identifier used to build `/book/:identifier/:page` URLs.
 */
export default function createBookHistoryPlugin({ identifier }) {
  if (!identifier) {
    throw new Error(
      `Configuration Error: 'identifier' is required to initialize createBookHistoryPlugin.`
    )
  }

  const historyWindow = window.parent !== window ? window.parent : window

  const BookHistoryPlugin = ({ canvasIndex, canvases, isFirstWindow, windowId, dispatchSetCanvas }) => {
    const currentPageRef = useRef(null)
    const suppressHistoryUpdateRef = useRef(false)

    const buildBookUrl = (page) => {
      const targetUrl = new URL(historyWindow.location.href)
      targetUrl.pathname = `/book/${identifier}/${page}`
      return targetUrl
    }

    // Sync URL → browser history when the canvas changes.
    useEffect(() => {
      if (!isFirstWindow || !windowId) return

      const page = canvasIndex + 1
      if (!Number.isInteger(page) || page < 1 || page === currentPageRef.current) return

      try {
        const targetUrl = buildBookUrl(page)

        if (suppressHistoryUpdateRef.current) {
          historyWindow.history.replaceState(historyWindow.history.state, '', targetUrl)
          suppressHistoryUpdateRef.current = false
        } else if (currentPageRef.current === null) {
          historyWindow.history.replaceState(historyWindow.history.state, '', targetUrl)
        } else {
          historyWindow.history.pushState(historyWindow.history.state, '', targetUrl)
        }

        currentPageRef.current = page
      } catch (error) {
        console.warn('Failed to sync book page URL.', error)
      }
    })

    // Sync Mirador canvas ← browser history when back/forward is pressed.
    useEffect(() => {
      if (!isFirstWindow || !windowId) return

      const syncMiradorPageFromUrl = () => {
        try {
          const match = historyWindow.location.pathname.match(/\/book\/([^/]+)\/(\d+)$/)
          if (!match || match[1] !== identifier) return

          const requestedPage = Number(match[2])
          if (!Number.isInteger(requestedPage) || requestedPage < 1) return

          const currentPage = (canvasIndex ?? -1) + 1
          if (requestedPage === currentPage) return

          const targetCanvas = canvases[requestedPage - 1]
          if (!targetCanvas?.id) return

          suppressHistoryUpdateRef.current = true
          dispatchSetCanvas(windowId, targetCanvas.id)
        } catch (error) {
          console.warn('Failed to sync Mirador page from URL.', error)
        }
      }

      historyWindow.addEventListener('popstate', syncMiradorPageFromUrl)
      return () => historyWindow.removeEventListener('popstate', syncMiradorPageFromUrl)
    }, [canvasIndex, canvases, dispatchSetCanvas, isFirstWindow, windowId])

    return null
  }

  BookHistoryPlugin.propTypes = {
    canvasIndex: PropTypes.number,
    canvases: PropTypes.array,
    dispatchSetCanvas: PropTypes.func,
    isFirstWindow: PropTypes.bool,
    windowId: PropTypes.string,
  }

  const mapStateToProps = (state, { windowId }) => {
    const windowIds = getWindowIds(state)
    const isFirstWindow = windowIds[0] === windowId

    if (!isFirstWindow) return { isFirstWindow: false }

    return {
      canvasIndex: getCanvasIndex(state, { windowId }),
      canvases: getCanvases(state, { windowId }),
      isFirstWindow: true,
      windowId,
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    dispatchSetCanvas: (windowId, canvasId) => dispatch(setCanvas(windowId, canvasId)),
  })

  return {
    target: 'Window',
    mode: 'add',
    name: `BookHistoryPlugin-${identifier}`,
    component: BookHistoryPlugin,
    mapStateToProps,
    mapDispatchToProps,
  }
}
