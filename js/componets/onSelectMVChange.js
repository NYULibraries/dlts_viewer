// function onSelectMVChange(e) {
//   e.halt();
//   const currentTarget = e.currentTarget;
//   const value = currentTarget.one(':checked').get('value');
//   const lang = Y.one('.node-dlts-book').getAttribute('data-lang');
//   const url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang;
//   const data = { url : url };
//   if (window.self === window.top) {
//     window.location.assign(url)
//   }
//   else {
//     Y.CrossFrame.postMessage('parent', JSON.stringify({ fire: 'change:option:multivolume', data }));
//   }
// }

// https://javascript.info/event-delegation
// Y.delegate('change', onSelectMVChange, 'body', '.field-name-mv-2016 form')
