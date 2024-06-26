<!doctype html>
<html lang="<?php echo $language ?>">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title><?php echo $title ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/universalviewer@4.0.0/dist/uv.css" />
    <style>
      body, #uv {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/universalviewer@4.0.0/dist/umd/UV.js"></script>
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
    <div class="uv" id="uv"></div>
    <script>
      function setDynamicHeight() {
        document.getElementById('uv').style.height = `${window.innerHeight}px`
      }
      window.addEventListener('DOMContentLoaded', () => {
        setDynamicHeight()
        let data = {
          manifest: '<?php echo $manifest ?>',
          embedded: true // needed for codesandbox frame
        }
        let uv = UV.init('uv', data)
      })
      window.addEventListener('resize', setDynamicHeight)
    </script>
  </body>
</html>


