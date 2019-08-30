function pjaxLoad (data) {

  try {

    const node = Y.Node.create(data);

    /** check if request include a map object */
    const map = node.one('.dlts_viewer_map');

    if (map) {

      const toggle = Y.one('.navbar-item .toggle');

      const next = Y.one('.paging.next');

      const previous = Y.one('.paging.previous');

      /** if "toggle" navbar item is available, replace it with this request link */
      if (toggle) {
        toggle.replace(node.one('.toggle').cloneNode(true));
      }

      /** if "next" navbar item is available, replace it with this request link */
      if (next) {
        next.replace(node.one('.next').cloneNode(true));
      }

      /** if "previous" navbar item is available, replace it with this request link */
      if (previous) {
        previous.replace(node.one('.previous').cloneNode(true));
      }

      DLTS.map.addTiledImage({
        tileSource: JSON.parse(map.getAttribute('data-iiif'))
      });

    } else {
      throw new Error(data);
    }
  }
  catch (e) {
    console.log(e);
  }
}