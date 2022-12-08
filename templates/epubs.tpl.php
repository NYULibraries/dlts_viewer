<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
<div class="content">
  <article class="content">
    <h5><a href="/admin/epubs">Epubs</a> - <a href="/admin/epubs/nyupress">New York University Press</a> - <?php print $title ?></h5>
    <div class="field is-horizontal">
      <div class="field-label is-normal" style="text-align: left;">
        <label class="label">Choose version</label>
      </div>
      <div class="field-body">
        <div class="select">
          <select name="versions" id="versions">
            <?php foreach ($versions as $version): ?>
              <?php echo "<option value=$version[hash]>$version[time]</option>" ?>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
    </div>
    <?php print $metadata ?>
  </article>
</div>
