  // https://github.com/josephj/yui3-crossframe
  function onSelectMVChange (e) {

    e.halt();

    const value = e.currentTarget.one(':checked').get('value');

    const url = value.substring(value.indexOf('::') + 2, value.length);

    const data = {
      url: url
    };

    if (window.self === window.top) {
      window.location.replace(url);
    } else {
      Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'change:option:multivolume', data }));
    }
  }

  Y.delegate('change', onSelectMVChange, 'body', '.field-name-mv-2016 form');
