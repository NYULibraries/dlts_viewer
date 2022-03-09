<div id="navbar" class="pane navbar" role="navigation">
  <?php print $navbar ?>
</div>
<div role="main" id="main" class="pane main" dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>">
  <div id="pagemeta" class="pane pagemeta <?php echo ($pane_metadata_hidden) ? 'hidden' : '' ?>">
    <div class="container">
      <<?php print $ds_content_wrapper; print $layout_attributes; ?> class="<?php print $classes;?> " dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" data-dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" data-lang="<?php print isset($lang_language) ? $lang_language : "und" ?>">
      <?php if (isset($lang_options)) : ?>
        <div class="metapane-dropdowns">
          <div class="lang-options"><?php print locale('Available languages', NULL, $lang_language) ?>: <?php print render($lang_options) ; ?></div>
        </div>
      <?php endif; ?>
      <?php print $ds_content; ?>
      </<?php print $ds_content_wrapper ?>>
      <?php if (!empty($drupal_render_children)) : print $drupal_render_children; endif; ?>
    </div>
  </div>
  <div 
    role="presentation" 
    aria-hidden="true" 
    id="display" 
    class="pane display"
  >
    <?php print $book_page ?>
    <?php if (isset($button_previous)) print $button_previous; ?>
    <?php if (isset($button_next)) print $button_next;  ?>
    <div 
      id="thumbnails" 
      role="presentation"
      class="views-g pane thumbnails" 
      style="display: none; visibility: hidden;" 
      aria-hidden="true" 
      hidden="true">
    </div>
  </div>
  <div class="pane load loading" role="presentation" aria-hidden="true">
    <?php if (isset($loading)) print $loading ; ?>
  </div>
</div>

<?php if (isset($read_order)) : ?>
<div id="pager" class="pane pager" dir="<?php print $read_order; ?>">
  <?php if (isset($slider)) : print $slider ; endif ; ?>
</div>
<?php endif; ?>
