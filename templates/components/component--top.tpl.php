<?php if ($is_admin && $messages) : ?>
<div id="top" class="pane top" role="banner">
  <div class="views-u-1">
    <?php if ($is_admin && $messages) : ?>
      <?php print $messages ?>
    <?php endif ?>
    <?php if ($tabs) : ?>
      <div class="tabs"><?php print $tabs ?></div>
    <?php endif ?>
    <?php print $help ?>
    <?php if ($action_links) : ?>
      <ul class="action-links"><?php  print $action_links ?></ul>
    <?php endif ?>
  </div>
</div>
<?php endif ?>
