<?php if ($page) : ?>
  <?php if (1 == 2) : ?>
    <?php print $googletagmanagernoscript ?>
  <?php endif; ?>
  <div id="page" class="page">
    <?php if (!$is_embed) : ?>
      <?php print $top ?>
    <?php endif; ?>
    <?php print render($page['content']) ?>
  </div>
<?php endif; ?>
