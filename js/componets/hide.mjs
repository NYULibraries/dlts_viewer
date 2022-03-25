function hide(selector) {
  document.querySelectorAll(selector).forEach(elm => {
    elm.style.display = null
    elm.style.visibility = null
    elm.hidden = null
    elm.height = 0
  })
}
  
export { hide }
