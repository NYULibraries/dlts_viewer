<!DOCTYPE html>
<html lang="<?php print $resource_language_code ?>" dir="<?php print $language_dir ?>" class="<?php print $classes; ?>">
<head>
    <?php print $head ?>
    <title><?php print $head_title ?></title>
    <?php print $styles ?>
    <?php print $scripts ?>
    <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRVMLPF');</script>
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
