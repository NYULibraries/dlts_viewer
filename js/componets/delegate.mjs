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
     
export { delegate }
  