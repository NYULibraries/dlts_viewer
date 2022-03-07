<?php if ($page) : ?>
  <noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TRVMLPF" height="0" width="0" style="display:none;visibility:hidden"></iframe>
  </noscript>
  <div id="page" class="page">
    <?php if (!$is_embed) : ?>
      <?php print $top ?>
    <?php endif; ?>
    <?php print render($page['content']); ?>
  </div>
<?php endif; ?>
