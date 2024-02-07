<!doctype html>
<html lang="<?php echo $language ?>">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title><?php echo $title ?></title>
    <style>
      <?php echo $style ?>
    </style>
    <style>
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
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
      class="uv"
      dir="<?php echo $direction ?>"
      data-language="<?php echo $language ?>" 
      data-endpoint="<?php echo $endpoint ?>" 
      data-type="<?php echo $type ?>" 
      data-sequence="<?php echo $sequence ?>" 
      data-identifier="<?php echo $identifier ?>"
    >
    <script>

      <?php echo $script ?>

      var urlAdaptor = new UV.URLAdaptor(true);

      const data = urlAdaptor.getInitialData({
        embedded: true
      });

      uv = UV.init("<?php echo $appid ?>", data);

      document.addEventListener("DOMContentLoaded", function () {
        var $UV = document.getElementById("uv");

        function resize() {
          $UV.setAttribute("style", "width:" + window.innerWidth + "px");
          $UV.setAttribute("style", "height:" + window.innerHeight + "px");
        }

        document.addEventListener("resize", function () {
          resize();
        });

        resize();
      });

    </script>
    </div>
  </body>
</html>


