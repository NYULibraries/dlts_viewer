<div id="book-navbar" class="book-navbar-photos">
  <?php if (isset($pager)) : ?>
    <?php print $pager ?>
  <?php endif; ?>
</div>
<div class="views-g thumbnails-container photoset-thumbs" id="display">
  <?php if (isset($resources)) : ?>
    <?php foreach ($resources as $resource) : ?>
      <div class="thumbHolder" data-manifest="<?php print $resource['manifest'] ?>" data-sequence="<?php print $resource['sequence'] ?>">
        <a href="<?php print $resource['path'] ?>" target="_self">
          <img class="thumbItem" src="<?php print $resource['url'] ?>"  />
        </a>              
      </div>
    <?php endforeach ?>
  <?php endif ?>
</div>
