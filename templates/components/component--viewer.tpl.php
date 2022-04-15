<?php if (isset($navbar)) : ?>
  <div id="navbar" class="pane navbar">
    <?php print $navbar ?>
  </div>
<?php endif ?>
  <div id="main" class="pane main" dir="<?php print $language_dir ?>">
    <?php if ($pagemeta) : ?>
      <div id="pagemeta" class="pane pagemeta">
        <div class="container">
          <?php print $pagemeta ?>
        </div>
      </div>
    <?php endif ?>
    <div id="display" class="pane display">
      <?php if (isset($book_page)) : ?>
        <?php print $book_page ?>
      <?php endif ?>
      <?php if (isset($thumbnails)) : ?>
        <div 
          id="thumbnails" 
          class="views-g pane thumbnails" 
          style="display: none; visibility: hidden;" 
          aria-hidden="true" 
          hidden="true">
          <?php print $thumbnails ?>
        </div>
      <?php endif ?>
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
      <p><?php print t('Loading Page') ?> <span class="current_page"><?php print $sequence; ?></span> of <span class="sequence_count"><?php print $count; ?></span></p>
    </div>
  </div>
<?php if (isset($slider) && !isset($off)) : ?>
  <div id="pager" dir="<?php print $language_dir ?>" class="pane pager">
    <?php print $slider ?>
  </div>
<?php endif ?>
