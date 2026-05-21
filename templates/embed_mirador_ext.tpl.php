<!doctype html>
<html lang="<?php echo $language ?>">
  <head>
    <meta charset="utf-8" />
    <title><?php echo $title ?></title>
    <?php if (isset($analytics) && $analytics['enabled']): ?>
      <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $analytics['code'] ?>"></script>
      <script>
        window.dataLayer = window.dataLayer || []
        function gtag() {
          dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', '<?php echo $analytics['code'] ?>')
      </script>
    <?php endif; ?>
    <link rel="stylesheet" href="<?php echo $css_url ?>">
  </head>
  <body>
    <div
      id="<?php echo $appid ?>"
      dir="<?php echo $direction ?>"
      data-language="<?php echo $language ?>"
      data-endpoint="<?php echo $endpoint ?>"
      data-type="<?php echo $type ?>"
      data-sequence="<?php echo $sequence ?>"
      data-identifier="<?php echo $identifier ?>"
      data-show-canvas-info="<?php echo $show_canvas_info ?>"
      data-show-collection="<?php echo $show_collection ?>"
      data-multivolume="<?php echo $is_multivolume ?>"
      data-workspace-view="<?php echo $workspace_view ?>" 
      data-view-type="<?php echo $view_type ?>" 
      data-embeded="<?php echo $embeded ?>" 
      data-history="<?php echo $enable_history ?>"
      data-image-tools="<?php echo $show_image_tools ?>"
    >
    </div>
    <script type="module" src="<?php echo $js_url ?>"></script>
  </body>
</html>
