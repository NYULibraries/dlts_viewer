<?php if ($page) : ?>
  <?php if (1 == 2) : ?>
    <?php print $googletagmanagernoscript ?>
  <?php endif; ?>
  <div id="page" class="page">
    <?php print render($page['content']) ?>
  </div>
<?php endif; ?>
