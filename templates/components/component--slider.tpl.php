<form id="form-update-sequence" role="navigation">
  <input id="range_weight" type="range" min="<?php print $min ?>" max="<?php print $max ?>" value="<?php print $sequence ?>" class="slider" oninput="slider_value.value = range_weight.value">
  <input id="slider_value" value="<?php print $sequence ?>" aria-label="Page to jump to">
</form>
<span>/</span> 
<span class="sequence_count"><?php print $count ?></span>
