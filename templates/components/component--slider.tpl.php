<span 
  id="<?php print $id ?>" 
  aria-hidden="true">
    <input 
      id="range_weight"
      type="range" 
      min="<?php print $min ?>" 
      max="<?php print $max ?>" 
      value="<?php print $sequence ?>" 
      class="slider" 
      style="width: 90%; vertical-align: middle;"
      oninput="slider_value.value = range_weight.value"
    >
</span> 
<span role="navigation">
  <form id="form-update-sequence">
    <input id="slider_value" value="<?php print $sequence ?>" aria-label="Page to jump to">
  </form>
  <span>/</span> 
  <span class="sequence_count"><?php print $count ?></span>
</span>
