function onThumbnailsContainerPagerClick (e) {
  e.preventDefault();
  DLTS.pjax.navigate(e.currentTarget.get('href'));
}

Y.delegate('click', onThumbnailsContainerPagerClick, 'body', '.thumbnails .views-row a');
