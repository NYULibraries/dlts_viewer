<!doctype html>
<html lang="<?php echo $language ?>">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    >
      <clover-viewer id="<?php echo $manifest ?>" />
    </div>
    <script>
      <?php echo $script ?>
    </script>
  </body>
</html>
