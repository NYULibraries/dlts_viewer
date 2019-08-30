/**
 * pjax callback can be call by clicking a pjax
 * enable link or by reference with data-url
 */
function pjaxCallback (e) {

  let url;

  let target;

  e.preventDefault();

  // test if the target is not active
  if (e.currentTarget.hasClass('inactive')) {
    return false;
  }

  // if event has referenceTarget, then event was trigger by reference
  if (Y.Lang.isObject(e.referenceTarget, true)) {
    url = new URL(e.referenceTarget.getAttribute('data-url'));
  } else { // trigger by a pjax enable link
    url = new URL(e.currentTarget.get('href'));
  }

  target = url.pathname.split('/');

  // update sequence
  DLTS.Proxy.sequence = target[target.length - 1];

}

// Y.on('pjax:change|openlayers:next|openlayers:previous', pjaxCallback);

Y.delegate('click', pjaxCallback, 'body', 'a.paging');
