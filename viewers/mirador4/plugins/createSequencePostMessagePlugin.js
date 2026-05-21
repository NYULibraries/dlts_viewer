import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { getCanvasIndex, getCanvases, getWindowIds, setCanvas } from 'mirador'

/**
 * Mirador 4 plugin for use when the viewer is embedded in an <iframe>.
 *
 * Outbound — when the canvas changes, posts a message to the parent frame:
 *   { type: 'dlts:viewer:sequenceChange', identifier, page }
 *
 * Inbound — when the parent posts a message back, Mirador navigates to the
 * requested page:
 *   { type: 'dlts:viewer:setSequence', identifier, page }
 *
 * Usage:
 *   createSequencePostMessagePlugin({ identifier, targetOrigin })
 *
 * `identifier`   – the book identifier, used to scope messages so multiple
 *                  embedded viewers on the same page don't interfere.
 * `targetOrigin` – passed to postMessage() as the targetOrigin. Defaults to
 *                  '*'. Set this to the parent page's origin in production
 *                  for security: e.g. 'https://example.com'.
 */
export default function createSequencePostMessagePlugin({ identifier, targetOrigin = '*' }) {
  if (!identifier) {
    throw new Error(
      `Configuration Error: 'identifier' is required to initialize createSequencePostMessagePlugin.`
    )
  }

  const OUTBOUND_TYPE = 'dlts:viewer:sequenceChange'
  const INBOUND_TYPE  = 'dlts:viewer:setSequence'

  const SequencePostMessagePlugin = ({ canvasIndex, canvases, isFirstWindow, windowId, dispatchSetCanvas }) => {
    const currentPageRef = useRef(null)
    const suppressOutboundRef = useRef(false)

    // Notify parent when the canvas changes.
    useEffect(() => {
      if (!isFirstWindow || !windowId) return

      const page = canvasIndex + 1
      if (!Number.isInteger(page) || page < 1 || page === currentPageRef.current) return

      currentPageRef.current = page

      if (suppressOutboundRef.current) {
        // Canvas change was triggered by an inbound message — don't echo it back.
        suppressOutboundRef.current = false
        return
      }

      try {
        window.parent.postMessage({ type: OUTBOUND_TYPE, identifier, page }, targetOrigin)
      } catch (error) {
        console.warn('Failed to post sequence change message to parent.', error)
      }
    })

    // Navigate Mirador when the parent sends a setSequence message.
    useEffect(() => {
      if (!isFirstWindow || !windowId) return

      const handleMessage = (event) => {
        // Ignore messages from unexpected origins when targetOrigin is set.
        if (targetOrigin !== '*' && event.origin !== targetOrigin) return

        const { type, identifier: msgIdentifier, page } = event.data ?? {}

        if (type !== INBOUND_TYPE || msgIdentifier !== identifier) return

        const requestedPage = Number(page)
        if (!Number.isInteger(requestedPage) || requestedPage < 1) return

        const currentPage = (canvasIndex ?? -1) + 1
        if (requestedPage === currentPage) return

        const targetCanvas = canvases[requestedPage - 1]
        if (!targetCanvas?.id) return

        suppressOutboundRef.current = true
        dispatchSetCanvas(windowId, targetCanvas.id)
      }

      window.addEventListener('message', handleMessage)
      return () => window.removeEventListener('message', handleMessage)
    }, [canvasIndex, canvases, dispatchSetCanvas, isFirstWindow, windowId])

    return null
  }

  SequencePostMessagePlugin.propTypes = {
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
    name: `SequencePostMessagePlugin-${identifier}`,
    component: SequencePostMessagePlugin,
    mapStateToProps,
    mapDispatchToProps,
  }
}
