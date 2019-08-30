function displayLoadingMessage () {

  Y.one('body').addClass('openlayers-loading');

  document.querySelectorAll('.pane.load').forEach(pane => {
    pane.classList.add('loading');
    pane.style.display = 'block';
  });

}
