function hideLoadingMessage () {

  const pane = document.querySelector('.pane.load');

  pane.classList.remove('loading');

  pane.style.display = 'none';

  Y.one('body').removeClass('openlayers-loading');

}
