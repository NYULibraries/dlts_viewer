function onToggleLanguage (e) {

  var target = e.currentTarget.get('value');

  e.preventDefault();

  Y.io(target, {
    on: {
      complete: function (id, e) {
        var node = Y.one('#pagemeta');
        var dir;
        var titlebar = Y.one('#titlebar');
        var pagetitle = Y.one('#page-title');
        node.set('innerHTML', e.response);
        dir = node.one('.node-dlts-book').getAttribute('data-dir');
        Y.one('.pane.main').set('dir', dir);
        if (titlebar) {
          titlebar.set('dir', dir);
        }
        if (pagetitle) {
          pagetitle.set('innerHTML', node.one('.field-name-title .field-item').get('text'));
        }
      }
    }
  });

}

Y.delegate('change', onToggleLanguage, 'body', '.language');
