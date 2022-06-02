<form id="form-update-sequence">
  <input title="<?php print t('Slide to select change sequence') ?>" aria-label="<?php print t('Slide to select change sequence') ?>" id="range_weight" type="range" min="<?php print $min ?>" max="<?php print $max ?>" value="<?php print $sequence ?>" class="slider" oninput="slider_value.value = range_weight.value">
  <input title="<?php print t('Page to jump to') ?>" aria-label="<?php print t('Page to jump to') ?>" id="slider_value" value="<?php print $sequence ?>">
</form>
<span>/</span> 
<span class="sequence_count"><?php print $count ?></span>
