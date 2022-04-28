<div id="navbar" class="pane navbar">
  <?php if (isset($navbar)) : ?>
    <?php print $navbar ?>
  <?php endif ?>
</div>
<div id="main" class="pane main" dir="<?php if (isset($lang_dir)) print $lang_dir; else print 'ltr' ?>">
  <div id="pagemeta" class="pane pagemeta">
    <div class="container">
      <?php if (isset($content)) print render($content) ?>
    </div>
  </div>
  <div id="display" class="pane display">
    <?php if (isset($book_page)) : ?>
      <?php print $book_page ?>
    <?php endif ?>
    <?php if (isset($button_previous)) : print $button_previous; endif; ?>
    <?php if (isset($button_previous)) : print $button_next; endif; ?>
    <?php if (isset($thumbnails)) : ?>
      <div 
        id="thumbnails" 
        class="views-g pane thumbnails" 
        style="display: none; visibility: hidden;" 
        aria-hidden="true" 
        hidden="true">
        <?php print $thumbnails ?>
      </div>
    <?php endif; ?>
  </div>
  <div class="pane load loading"><?php if (isset($loading)) print $loading; ?></div>
</div>
<?php if (isset($read_order)) : ?>
  <div dir="<?php if (isset($read_order)) print $read_order; else print 'ltr' ?>" id="pager" class="pane pager">
    <?php if (isset($slider)) : print $slider; endif; ?>
  </div>
<?php endif ?>
