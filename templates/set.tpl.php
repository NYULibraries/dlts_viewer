<?php if (isset($title)) : ?>
  <div id="top" class="pane top" role="banner">
    <div class="views-u-1">
      <div id="titlebar">
        <h1 id="page-title"><?php echo $title ?></h1>
      </div>
    </div>
  </div>
<?php endif ?>
<div class="views-g thumbnails-container photoset-thumbs" id="display">
  <?php if (isset($resources)) : ?>
    <?php foreach ($resources as $resource) : ?>
      <div class="thumbHolder" data-manifest="<?php print $resource['manifest'] ?>" data-sequence="<?php print $resource['sequence'] ?>">
        <a target="_self" href="<?php print $resource['path'] ?>">
          <img class="thumbItem" src="<?php print $resource['url'] ?>" alt="Sequence <?php print $resource['sequence'] ?>" loading="lazy" />
        </a>              
      </div>
    <?php endforeach ?>
  <?php endif ?>
</div>
