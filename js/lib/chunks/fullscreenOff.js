function fullscreenOff (e) {

  e.preventDefault();

  const fullscreenButton = Y.one('a.fullscreen');

  console.log(document.querySelector('a.fullscreen'));

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
  if (fullscreenButton) {
    fullscreenButton.blur();
  }

  Y.CrossFrame.postMessage('parent', JSON.stringify({fire: 'button:button-fullscreen:off'}));

}

Y.on('button:button-fullscreen:off', fullscreenOff);
