function show(selector) {
  document.querySelectorAll(selector).forEach(elm => {
    elm.style.display = null
    elm.style.visibility = null
    elm.hidden = null
  })
}
    
export { show }
