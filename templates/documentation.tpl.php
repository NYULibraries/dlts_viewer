<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
<style>
#branding, #navigation, .breadcrumb, .page-title {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
}

.hero {
  margin-top: 2em;
}

section.section {
  padding: 2rem 1.5rem 0 1.5rem;
}

ul li {
  list-style: inherit;
}

ol li {
  list-style: decimal;
}

.content ul {
  list-style: disc inside;
  margin-left: initial;
}
</style>

<section class="hero is-info">
  <div class="hero-body">
    <p class="title">DLTS Viewer</p>
    <p class="subtitle">Endpoints documentation</p>
  </div>
</section>
<div class="content">
<section class="section">
  <ul>
    <li><a href="#apache-solr-proxy">Apache Solr Search</a></li>
    <li><a href="#dlts-resources">DLTS Resources</a></li>
    <li><a href="#discovery">DLTS Discovery API</a></li>
    <li><a href="#iiif-presentation">IIIF Presentation API 3.0</a></li>
    <li><a href="#iiif-image">IIIF Image API 2.1.1</a></li>
  </ul>
</section>
<section class="section">
  <article class="content">
    <h3 class="title" id="apache-solr-proxy">Apache Solr Search</h3>
    <p>DLTS Viewer uses Apache Solr to make its content searchable (JSON output format only). DLTS Viewer content can be search with knowledge of <a href="https://solr.apache.org/guide/6_6/common-query-parameters.html#common-query-parameters">Common Query Parameters</a> (NOTE: This endpoint use <em>query</em> as the query term instead of <em>q</em>). URI for DLTS Viewer Discovery:</p>
      <article class="message is-info">
      <div class="message-body">
        <a href="<?php echo $base_url ?>/api/v1/search" target="_blank"><?php echo $base_url ?>/api/v1/search</a>
      </div>
    </article>
    <h5 class="title">Sample URL</h5>
    <ul>
      <li><a href="<?php echo $base_url ?>/api/v1/search?query=monkey" target="_blank"><?php echo $base_url ?>/api/v1/search?query=monkey</a></li>
    </ul>
    <p>For more information on how to use this endpoint, refer to <a href="https://solr.apache.org/guide/6_6/index.html">Apache Solr Reference Guide</a>.</p>
  </article>
  <article class="content">
    <h3 class="title" id="dlts-resources">DLTS Resources</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Machine name</th>
          <th>Alias</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Book</th>
          <td>dlts_book</td>
          <td>books</td>
        </tr>
        <tr>
          <th>Map</th>
          <td>dlts_map</td>
          <td>maps</td>
        </tr>
        <tr>
          <th>Photo Set</th>
          <td>dlts_photo_set</td>
          <td>photos</td>
        </tr>
        <tr>
          <th>Postcard</th>
          <td>dlts_postcard</td>
          <td>postcards</td>
        </tr>
      </tbody>
    </table>
  </article>
  <article class="content">
    <h3 class="title">DLTS Discovery API</h3>
    <p>DLTS Discovery API can be use to find and filter by resource type, noid, identifier and others. <em>The following resource are available:</em></p>
    <ul>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_book">Book</a></a></li>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_photo_set">Photo set</a></li>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_map">Map</a></li>
      <li><strike>Postcard</strike></li>
    </ul>
    <h5 class="title">Query parameters, which are supported by the DLTS Discovery API</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>start</th>
          <td>Specifies an offset (by default, 0) into the responses at which Discovery should begin displaying content.</td>
        </tr>
        <tr>
          <th>rows</th>
          <td>Controls how many rows of responses are displayed at a time (default value: 10)</td>
        </tr>
        <tr>
          <th>collection</th>
          <td>Applies a filter to query by collection code to the search results.</td>
        </tr>
        <tr>
          <th>partner</th>
          <td>Applies a filter to query by partner code to the search results.</td>
        </tr>
        <tr>
          <th>type</th>
          <td>Applies a filter to query by resource type to the search results. Available types: <em>dlts_book</em>, <em>dlts_photo_set</em>, <em>dlts_map</em></td>
        </tr>
        <tr>
          <th>searchTerm</th>
          <td>Query argument to search by resource title, noid or identifier.</td>
        </tr>
      </tbody>
    </table>
    <h5 class="title">Sample URL</h5>
    <ul>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?collection=io"><?php echo $base_url ?>/api/v1/objects?collection=io</a></li>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_book"><?php echo $base_url ?>/api/v1/objects?type=dlts_book</a></li>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?start=5&rows=5&searchTerm=AD-MC-016"><?php echo $base_url ?>/api/v1/objects?start=5&rows=5&searchTerm=AD-MC-016</a></li>
    </ul>
  </article>
  <article class="content">
    <h3 class="title" id="iiif-presentation">IIIF Presentation API 3.0</h3>
    <p>DLTS Viewer resources are available as <a href="https://iiif.io/api/presentation/3.0/">IIIF Presentation API 3.0</a> manifest via URI paths. URIs for DLTS Viewer API resource have the following structure.</p>
    <article class="message is-info">
      <div class="message-header">
        <p>Manifest URI structure</p>
      </div>
      <div class="message-body">
        <em><?php echo $base_url ?>/api/presentation/resource-type/resource-identifier/manifest.json</em>
      </div>
    </article>
    <h5 class="title">Sample URL</h5>
    <ul>
      <li><a href="<?php echo $base_url ?>/api/presentation/books/tamwag_palante000011/manifest.json"><?php echo $base_url ?>/api/presentation/books/tamwag_palante000011/manifest.json</a></li>
      <li><a href="<?php echo $base_url ?>/api/presentation/photos/AD-MC-016_ref52/manifest.json"><?php echo $base_url ?>/api/presentation/photos/AD-MC-016_ref52/manifest.json</a></li>
      <li><a href="<?php echo $base_url ?>/api/presentation/maps/fales_io_map000031/manifest.json"><?php echo $base_url ?>/api/presentation/maps/fales_io_map000031/manifest.json</a></li>
    </ul>
  </article>
  <article class="content">
    <h3 class="title" id="iiif-image">IIIF Image API 2.1.1</h3>
    <p>DLTS Viewer rely on <a href="https://cantaloupe-project.github.io/" title="A high-performance dynamic image server in Java">Cantaloupe</a> as it's image server.</p>
    <p>The IIIF Image API can be called in two ways:</p>
    <p>1. Request information about the image, including characteristics, functionality available, and related services.</p>
    <article class="message is-info">
      <div class="message-body">
        <em><?php echo $base_url ?>/api/image/resource-type/resource-identifier/resource-sequence/info.json</em>
      </div>
    </article>
    <h5 class="title">Sample URL</h5>
    <ul>
      <li><a href="<?php echo $base_url ?>/api/image/books/tamwag_palante000011/1/info.json"><?php echo $base_url ?>/api/image/books/tamwag_palante000011/1/info.json</a></li>
      <li><a href="<?php echo $base_url ?>/api/image/photos/AD-MC-016_ref52/1/info.json"><?php echo $base_url ?>/api/image/photos/AD-MC-016_ref52/1/info.json</a></li>
      <li><a href="<?php echo $base_url ?>/api/image/maps/fales_io_map000031/1/info.json"><?php echo $base_url ?>/api/image/maps/fales_io_map000031/1/info.json</a></li>
    </ul>
    <p>2. Request an image, which may be part of a larger image.</p>
    <article class="message is-info">
      <div class="message-body">
        <em><?php echo $base_url ?>/api/image/resource-type/resource-identifier/resource-sequence/{resource-region}/{resource-size}/{resource-rotation}/{resource-quality}.{resource-format}</em>
      </div>
    </article>
    <table class="table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Canonical value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>resource-region</td>
          <td>“full” if the whole image is requested, (including a “square” region of a square image)<br>otherwise the <code class="highlighter-rouge">x,y,w,h</code> syntax.</td>
        </tr>
        <tr>
          <td>resource-size</td>
          <td>“full” if the default size is requested,<br>the <code class="highlighter-rouge">w,</code> syntax for images that should be scaled maintaining the aspect ratio,<br>and the <code class="highlighter-rouge">w,h</code> syntax for explicit sizes that change the aspect ratio. <br><strong>Note:</strong> The size keyword “full” will be replaced with “max” in version 3.0.</td>
        </tr>
        <tr>
          <td>resource-rotation</td>
          <td>”!” if the image is mirrored, followed by an integer if possible, and trimming any trailing zeros in a decimal value, and a leading 0 if the value is below 1.</td>
        </tr>
        <tr>
          <td>resource-quality</td>
          <td>“default” if the server’s default quality is requested,<br>otherwise the quality string.</td>
        </tr>
        <tr>
          <td>resource-format</td>
          <td>The explicit format string is always required.</td>
        </tr>
      </tbody>
    </table>
    <h5 class="title">Sample URL</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><img src="<?php echo $base_url ?>/api/image/books/tamwag_palante000011/1/full/150,/0/default.jpg"/></td>
          <td><?php echo $base_url ?>/api/image/books/tamwag_palante000011/1/full/150,/0/default.jpg</td>
        </tr>
        <tr>
          <td><img src="<?php echo $base_url ?>/api/image/photos/AD-MC-016_ref52/1/full/150,/0/default.jpg"/></td>
          <td><?php echo $base_url ?>/api/image/photos/AD-MC-016_ref52/1/full/150,/0/default.jpg</td>
        </tr>
        <tr>
          <td><img src="<?php echo $base_url ?>/api/image/maps/fales_io_map000031/1/full/150,/0/default.jpg"></td>
          <td><?php echo $base_url ?>/api/image/maps/fales_io_map000031/1/full/150,/0/default.jpg</td>
        </tr>
      </tbody>
    </table>
    <p>For more information about URI syntax and others, please refer to <a href="https://iiif.io/api/image/2.1">IIIF Image API 2.1.1</a></p>
  </article>
</section>
</div>
<footer class="footer">
  <div class="content has-text-centered">
    <p>
      <strong>DLTS Viewer</strong> by <a href="https://dlib.nyu.edu/dlts/">NYU Digital Library Technology Services</a>.
    </p>
  </div>
</footer>
