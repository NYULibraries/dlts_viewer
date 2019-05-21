<?php if ($page) : ?>
  <?php if (1 == 2) : ?>
    <?php print $google_tag_manager ?>
  <?php endif; ?>
  <?php print render($page['content']); ?>
<?php endif; ?>
