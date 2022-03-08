<ul class="navbar navbar-left">
  <li class="navbar-item">
    <a 
      href="<?php echo $metadata['href'] ?>"
      title="<?php echo $metadata['label']; ?>" 
      class="<?php echo $metadata['class']; ?>" 
      data-operation="<?php echo $metadata['operation'] ?>"
      id="<?php echo $metadata['id']; ?>">
      <span><?php echo $metadata['label']; ?></span>
    </a>
  </li>
  <li class="navbar-item">
    <a 
      id="<?php echo $togglepage['id'] ?>"
      title="<?php echo $togglepage['label'] ?>" 
      href="<?php echo $togglepage['href'] ?>"
      data-operation="<?php echo $togglepage['operation'] ?>"
      class="<?php echo $togglepage['class'] ?>">
      <span><?php echo $togglepage['label'] ?></span>
    </a>
  </li>
  <li class="navbar-item">
    <a 
      href="<?php echo $thumbnails['href'] ?>" 
      title="<?php echo $thumbnails['label'] ?>" 
      class="<?php echo $thumbnails['class'] ?>" 
      id="<?php echo $thumbnails['id'] ?>">
      <span><?php echo $thumbnails['label'] ?></span>
    </a>
  </li>
</ul>
<div class="navbar navbar-middle">
  <div id="control-zoom">
    <div class="navbar-item" data-title="<?php echo t('Zoom in'); ?>" title="<?php echo t('Zoom in'); ?>">
      <div id="control-zoom-in" class="olButton olControlDLTSZoomInItemInactive"></div>
    </div>
    <div class="navbar-item" data-title="<?php echo t('Zoom out') ?>" title="<?php echo t('Zoom out') ?>">
      <div id="control-zoom-out" class="olButton olControlDLTSZoomOutItemInactive"></div>
    </div>
  </div>
</div>
<ul class="navbar navbar-arrows">
  <li class="navbar-item navbar-pager-left">
    <a 
      title="<?php echo $previous['label'] ?>" 
      href="<?php echo $previous['href'] ?>"
      class="<?php echo $previous['class']; ?>"
      data-type="<?php echo $previous['type'] ?>" 
      data-identifier="<?php echo $previous['identifier'] ?>" 
      data-sequence="<?php echo $previous['sequence'] ?>" 
      data-sequence-count="<?php echo $previous['count'] ?>" 
      data-operation="<?php echo $previous['operation'] ?>">
      <span><?php echo $previous['label'] ?></span>
    </a>
  </li>
  <li class="navbar-item navbar-pager-right">
    <a 
      title="<?php echo $next['label'] ?>" 
      href="<?php echo $next['href'] ?>" 
      class="<?php echo $next['class']; ?>" 
      data-type="<?php echo $next['type'] ?>" 
      data-identifier="<?php echo $next['identifier'] ?>" 
      data-sequence="<?php echo $next['sequence'] ?>" 
      data-sequence-count="<?php echo $next['count'] ?>" 
      data-operation="<?php echo $next['operation'] ?>">
      <span><?php echo $next['label'] ?></span>
    </a>
  </li>
</ul>
<ul class="navbar-fullscreen">
  <li class="navbar-item">
    <a 
      href="#fullscreen" 
      title="<?php echo t('Toggle fullscreen') ?>" 
      class="button fullscreen off" 
      id="button-fullscreen">
      <span><?php echo t('Toggle fullscreen') ?></span>
    </a>
  </li>
</ul>
