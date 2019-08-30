function onButtonThumbnailsOn (e) {
  e.halt();
  const map = Y.one('.dlts_viewer_map').getData();
  Y.io(map['thumbnails-url'], {
    data: `page=${map['thumbnails-page']}&rows=${map['thumbnails-rows']}&sequence=${map.sequence}`,
    on: {
      start: onButtonThumbnailsOnIOStart,
      complete: onThumbnailsOnSuccess
    }
  });
}

Y.on('button:button-thumbnails:on', onButtonThumbnailsOn);
