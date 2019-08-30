function onButtonMetadataOff (e) {
  const pagemeta = Y.one('.pane.pagemeta');
  pagemeta.addClass('hidden');
  pagemeta.ancestor('.pane-body').addClass('pagemeta-hidden');
  // Y.CrossFrame.postMessage("parent", JSON.stringify({fire: 'button:button-metadata:off'}));
}

Y.on('button:button-metadata:off', onButtonMetadataOff);
