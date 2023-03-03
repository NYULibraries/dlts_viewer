<!doctype html>
<html lang="<?php echo $language ?>">
  <head>
    <meta charset="utf-8" />
    <title><?php echo $title ?></title>
  </head>
  <body>
    <div 
      id="<?php echo $appid ?>"
      data-language="<?php echo $language ?>" 
      data-endpoint="<?php echo $endpoint ?>" 
      data-type="<?php echo $type ?>" 
      data-sequence="<?php echo $sequence ?>" 
      data-languages="<?php echo $languages ?>"
      data-identifier="<?php echo $identifier ?>">
    </div>
    <script src="<?php echo $script ?>"></script>
  </body>
</html>
