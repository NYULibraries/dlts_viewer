function onButtonMetadataOn (e) {
  const pagemeta = Y.one('.pane.pagemeta');
  pagemeta.removeClass('hidden');
  pagemeta.ancestor('.pane-body').removeClass('pagemeta-hidden');
  // Y.CrossFrame.postMessage("parent", JSON.stringify({fire: 'button:button-metadata:on'}));
}

Y.on('button:button-metadata:on', onButtonMetadataOn);
