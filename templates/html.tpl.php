<!DOCTYPE html>
<html lang="<?php print $resource_language_code ?>" dir="<?php print $language_dir ?>" class="<?php print $resource_language_code ?> <?php print $classes ?>">
<head>
  <?php print $head ?>
  <title><?php print $head_title ?></title>
  <?php print $styles ?>
  <?php print $scripts ?>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base target="content-frame">
</head>
<body class="pane-body openlayers-loading <?php if (isset($pane_metadata_hidden)) : print $pane_metadata_hidden; endif; ?>">
  <?php if (isset($page_top)) : print $page_top; endif; ?>
  <?php if (isset($page)) : print $page; endif; ?>
  <?php if (isset($page_bottom)) : print $page_bottom; endif; ?>
</body>
</html>
