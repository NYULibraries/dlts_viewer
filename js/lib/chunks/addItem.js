function areAllFullyLoaded () {
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
