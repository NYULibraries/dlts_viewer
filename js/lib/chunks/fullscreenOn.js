function fullscreenOn (e) {

  const docElm = document.documentElement;

  const button = Y.one('#button-metadata');

  if (button) {
    button.removeClass('on');
  }

  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
  Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'button:button-fullscreen:on'}));
}

Y.on('button:button-fullscreen:on', fullscreenOn);
