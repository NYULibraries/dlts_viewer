DLTS.pjax = new Y.Pjax({
  container: '.pane.display'
});

DLTS.pjax.on('load', pjaxLoad);

DLTS.pjax.on('navigate', pjaxNavigate);
