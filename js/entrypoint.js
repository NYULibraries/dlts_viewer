// hephastusAddLibOpenSeadragon

// hephastusAddLibYUI3

YUI().use('node', 'event', 'event-custom', 'transition', 'slider', 'pjax', 'gallery-soon', 'widget-anim', 'promise', function (Y) {

  'use strict';

  // hephastusAddFn

  // https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/
  // https://github.com/openseadragon/openseadragon/issues/1272
  // https://github.com/openseadragon/openseadragon/issues/1257

  const id = 'openseadragon';

  const identifier = getIdentifier();

  const type = 'books';

  const sequence = getSequence();

  DLTS.isFullyLoaded = false;

  // http://3.215.124.212:8182
  // https://docs.google.com/document/d/1zul-tbkcAo454eQa6XHYJYC43og54ljiYuXH1zGLalI/edit
  DLTS.iiifEndpoint = 'http://viewer.local/viewer/iiif/2';

  let config = {
    id: id,
    preload: false,
    showNavigator: false,
    showFullPageControl: false,
    showZoomControl: false,
    preserveViewport: true,
    showHomeControl: false,
    constrainDuringPan: true,
    useCanvas: true,
    // immediateRender: true,
    visibilityRatio: 1,
    minZoomLevel: 1,
    defaultZoomLevel: 1,
    sequenceMode: false,
    tileSources: [`${DLTS.iiifEndpoint}/${type}/${identifier}/${sequence}/info.json`]
  };

  DLTS.map = new OpenSeadragon(config);

  function areAllFullyLoaded() {
    var tiledImage;
    var count = DLTS.map.world.getItemCount();
    for (var i = 0; i < count; i++) {
      tiledImage = DLTS.map.world.getItemAt(i);
      if (!tiledImage.getFullyLoaded()) {
        return false;
      }
    }
    return true;
  }

  function fullyLoadedHandler() {
    if (areAllFullyLoaded()) {
      removeFullyLoadedHandlers();
      removeTilesLoadingMessage();
    }
  }

  function removeFullyLoadedHandlers() {
    var tiledImage;
    var count = DLTS.map.world.getItemCount();
    for (var i = 0; i < count; i++) {
      tiledImage = DLTS.map.world.getItemAt(i);
      tiledImage.removeHandler('fully-loaded-change', fullyLoadedHandler);
    }
  }

  DLTS.map.world.addHandler('add-item', function (event) {
    var tiledImage = event.item;
    tiledImage.addHandler('fully-loaded-change', fullyLoadedHandler);
  });

});
