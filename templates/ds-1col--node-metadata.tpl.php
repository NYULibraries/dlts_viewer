<div id="navbar" class="pane navbar" role="navigation">
  <?php print $navbar ?>
</div>
<div role="main" id="main" class="pane main" dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>">
  <div id="pagemeta" class="pane pagemeta <?php echo ($pane_metadata_hidden) ? 'hidden' : '' ?>">
    <div class="container">
      <<?php print $ds_content_wrapper; print $layout_attributes; ?> class="<?php print $classes ?> " dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" data-dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" data-lang="<?php print isset($lang_language) ? $lang_language : "und" ?>">
      <?php if (isset($lang_options)) : ?>
        <div class="metapane-dropdowns">
          <div class="lang-options"><?php print locale('Available languages', NULL, $lang_language) ?>: <?php print render($lang_options) ; ?></div>
        </div>
      <?php endif; ?>
      <?php print $ds_content ?>
      <div dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" class="field field-name-field-handle field-type-link-field field-label-inline clearfix">
        <div dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" class="field-label">Manifest:&nbsp;</div>
        <div dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" class="field-items">
          <div dir="<?php print isset($lang_dir) ? $lang_dir : "ltr" ?>" class="field-item even">
            <?php print $presentation ?>
          </div>
        </div>
      </div>
      </<?php print $ds_content_wrapper ?>>
      <?php if (!empty($drupal_render_children)) : print $drupal_render_children; endif; ?>
    </div>
  </div>
  <div role="presentation" id="display" class="pane display">
    <?php print $book_page ?>
    <?php if (isset($button_previous)) print $button_previous ?>
    <?php if (isset($button_next)) print $button_next ?>
    <div
      id="thumbnails" 
      role="presentation"
      class="views-g pane thumbnails" 
      style="display: none; visibility: hidden;"
      data-state="0"
      aria-hidden="true" 
      hidden="true">
    </div>
  </div>
  <div class="pane load loading" role="presentation" aria-hidden="true">
    <div id="squaresWaveG">
      <span id="squaresWaveG_1" class="squaresWaveG"></span>
      <span id="squaresWaveG_2" class="squaresWaveG"></span>
      <span id="squaresWaveG_3" class="squaresWaveG"></span>
      <span id="squaresWaveG_4" class="squaresWaveG"></span>
      <span id="squaresWaveG_5" class="squaresWaveG"></span>
      <span id="squaresWaveG_6" class="squaresWaveG"></span>
      <span id="squaresWaveG_7" class="squaresWaveG"></span>
      <span id="squaresWaveG_8" class="squaresWaveG"></span>
    </div>
    <p><?php print t('Loading Page') ?> <span class="current_page"><?php print $sequence ?></span> of <span class="sequence_count"><?php print (isset($count) ? $count : 0 ) ?></span></p>
  </div>
</div>

<?php if (isset($read_order)) : ?>
<div id="pager" role="navigation" aria-label="<?php print t('Select image in sequence') ?>" class="pane pager" dir="<?php print $read_order ?>">
  <?php if (isset($slider)) : ?>
    <?php print $slider ?>
  <?php endif ?>
</div>
<?php endif ?>
