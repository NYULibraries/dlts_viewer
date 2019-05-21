<div class="dlts_viewer node pjax" data-identifier="<?php print $identifier ?>">
    <?php if (isset($button_previous)) : ?>
        <?php print $button_previous ?>
    <?php endif; ?>
    <div id="<?php print $fid ?>"
         class="dlts_viewer_map"
         data-iiif="<?php print $iiif ?>"
         data-pageView="<?php print $pageView ?>"
         data-sequenceCount="<?php print $sequence_count ?>"
         data-sequence="<?php print $sequence ?>"
         data-title="<?php print $title ?>"
         data-thumbnails-url="<?php print $thumbnailsURL ?>"
         data-thumbnails-rows="<?php print $thumbnailsRows ?>"
         data-thumbnails-page="<?php print $thumbnailsPage ?>">
    </div>
    <?php if (isset($button_next)) : ?>
        <?php print $button_next ?>
    <?php endif; ?>
    <?php if (isset($button_togglepage)) : ?>
        <?php print $button_togglepage ?>
    <?php endif; ?>
</div>
