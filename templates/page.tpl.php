<?php if ($page) : ?>
  <div id="page" class="page">
    <?php if (isset($is_embed) && !$is_embed) : ?>
      <?php if (isset($top)) : print $top; endif; ?>
    <?php endif ?>
    <?php if (isset($page['content'])) : print render($page['content']); endif; ?>
  </div>
<?php endif ?>
