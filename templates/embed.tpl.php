<!doctype html>
<html lang="<?php echo $language ?>">
  <head>
    <meta charset="utf-8" />
    <title><?php echo $title ?></title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V9T13P98V7"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-V9T13P98V7');
    </script>
  </head>
  <body>
    <div 
      id="<?php echo $appid ?>"
      dir="<?php echo $direction ?>"
      data-language="<?php echo $language ?>" 
      data-endpoint="<?php echo $endpoint ?>" 
      data-type="<?php echo $type ?>" 
      data-sequence="<?php echo $sequence ?>" 
      data-identifier="<?php echo $identifier ?>">
    </div>
    <script src="<?php echo $script ?>"></script>
  </body>
</html>
