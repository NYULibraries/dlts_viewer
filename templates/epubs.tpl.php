<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
<nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/epubs">ePubs</a></li>
    <li><a href="/epubs/nyupress">New York University Press</a></li>
    <li class="is-active"><a aria-current="page"><?php print $title ?></a></li>
  </ul>
</nav>  
<div class="content">
  <article class="content">
    <?php print $metadata ?>
  </article>
</div>
