<!DOCTYPE html>
<html lang="<?php print $resource_language_code ?>" dir="<?php print $language_dir ?>" class="<?php print $classes ?>">
<head>
    <?php print $head ?>
    <title><?php print $head_title ?></title>
    <?php print $styles ?>
    <?php print $scripts ?>
    <script>
    (function (global) {
      global.DLTS = {};
    }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    </script>
    <!-- Google Tag Manager -->
    <?php // print $google_tag_manager ?>
    <!-- End Google Tag Manager -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base target="content-frame">
</head>
<body class="pane-body openlayers-loading <?php echo $pane_metadata_hidden ?>">
  <?php print $page_top ?>
  <?php print $page ?>
  <?php print $page_bottom ?>
</body>
</html>
