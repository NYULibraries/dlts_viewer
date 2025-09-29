<style>
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/versions/bulma-no-dark-mode.min.css";

head, body {
  width: 1240px;
  max-width: 1240px;
}

#branding, #navigation, .breadcrumb, .page-title {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
}

.hero {
  margin-top: 2em;
}

.hero.is-info {
  background-color: #3298dc;
  color: #fff;
}

.hero p {
  color: #fff;
}

a:hover {
  text-decoration: underline;
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

.json-container {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto; /* For long JSON strings */
  font-family: monospace, monospace; /* Use a monospaced font */
  font-size: 0.9em;
  line-height: 1.4;
}

.json-key {
  color: #c00; /* Example color for keys */
  font-weight: bold;
}

.json-value {
  color: #00f; /* Example color for string values */
}

.json-number {
  color: #098658; /* Example color for numbers */
}

.json-boolean {
  color: #ca7832; /* Example color for booleans */
  font-weight: bold;
}

.json-null {
  color: #5e5e5e; /* Example color for null */
  font-style: italic;
}

.json-punctuation {
  color: #333; /* Example color for brackets, braces, commas, colons */
}

.not-logged-in #page-title {
  display: none;
  visibility: hidden;
}

.not-logged-in .hero {
  margin-top: 1em;
}

#branding, #navigation, .breadcrumb, .page-title, #skip-link {
  display: none;
  visibility: hidden;
}
</style>

<template>
  <style>
    button {
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      outline: none;
      width: 40px;
      height: 40px;
      float: left;
    }
    #audio-player-container {
      position: relative;
      margin: 2.5% 2.5% auto 2.5%;
      width: 95%;
      max-width: 500px;
      height: 132px;
      background: #fff;
      font-family: Arial, Helvetica, sans-serif;
      --seek-before-width: 0%;
      --volume-before-width: 100%;
      --buffered-width: 0%;
      letter-spacing: -0.5px;
    }

    p {
      position: absolute;
      top: -18px;
      right: 5%;
      padding: 0 5px;
      margin: 0;
      font-size: 1em;
      background: #fff;
    }
    #play-icon {
      margin: 20px 2.5% 10px 2.5%;
    }
    path {
      stroke: #007db5;
    }
    .time {
      display: inline-block;
      width: 37px;
      text-align: center;
      font-size: 14px;
      margin: 28.5px 0 18.5px 0;
      float: left;
    }
    output {
      display: inline-block;
      width: 32px;
      text-align: center;
      font-size: 14px;
      margin: 10px 2.5% 0 5%;
      float: left;
      clear: left;
    }
    #volume-slider {
      margin: 10px 2.5%;
      width: 58%;
    }
    #volume-slider::-webkit-slider-runnable-track {
      background: rgba(0, 125, 181, 0.6);
    }
    #volume-slider::-moz-range-track {
      background: rgba(0, 125, 181, 0.6);
    }
    #volume-slider::-ms-fill-upper {
      background: rgba(0, 125, 181, 0.6);
    }
    #volume-slider::before {
      width: var(--volume-before-width);
    }
    #mute-icon {
      margin: 0 2.5%;
    }
    input[type="range"] {
      position: relative;
      -webkit-appearance: none;
      width: 48%;
      margin: 0;
      padding: 0;
      height: 19px;
      margin: 30px 2.5% 20px 2.5%;
      float: left;
      outline: none;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      background: linear-gradient(to right, rgba(0, 125, 181, 0.6) var(--buffered-width), rgba(0, 125, 181, 0.2) var(--buffered-width));
    }
    input[type="range"]::before {
      position: absolute;
      content: "";
      top: 8px;
      left: 0;
      width: var(--seek-before-width);
      height: 3px;
      background-color: #007db5;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
      position: relative;
      -webkit-appearance: none;
      box-sizing: content-box;
      border: 1px solid #007db5;
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
      margin: -7px 0 0 0;
    }
    input[type="range"]:active::-webkit-slider-thumb {
      transform: scale(1.2);
      background: #007db5;
    }
    input[type="range"]::-moz-range-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      background: linear-gradient(to right, rgba(0, 125, 181, 0.6) var(--buffered-width), rgba(0, 125, 181, 0.2) var(--buffered-width));
    }
    input[type="range"]::-moz-range-progress {
      background-color: #007db5;
    }
    input[type="range"]::-moz-focus-outer {
      border: 0;
    }
    input[type="range"]::-moz-range-thumb {
      box-sizing: content-box;
      border: 1px solid #007db5;
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
    }
    input[type="range"]:active::-moz-range-thumb {
      transform: scale(1.2);
      background: #007db5;
    }
    input[type="range"]::-ms-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      background: transparent;
      border: solid transparent;
      color: transparent;
    }
    input[type="range"]::-ms-fill-lower {
      background-color: #007db5;
    }
    input[type="range"]::-ms-fill-upper {
      background: linear-gradient(to right, rgba(0, 125, 181, 0.6) var(--buffered-width), rgba(0, 125, 181, 0.2) var(--buffered-width));
    }
    input[type="range"]::-ms-thumb {
      box-sizing: content-box;
      border: 1px solid #007db5;
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
    }
    input[type="range"]:active::-ms-thumb {
      transform: scale(1.2);
      background: #007db5;
    }
    </style>
    <div id="audio-player-container">
      <audio src="" preload="metadata" loop></audio>
      <button id="play-icon"></button>
      <span id="current-time" class="time">0:00</span>
      <input type="range" id="seek-slider" max="100" value="0">
      <span id="duration" class="time">0:00</span>
      <output id="volume-output">100</output>
      <input type="range" id="volume-slider" max="100" value="100">
      <button id="mute-icon"></button>
    </div>
  </template>

<section class="hero is-info">
  <div class="hero-body">
    <p class="title">DLTS Viewer</p>
    <p class="subtitle">Endpoints documentation</p>
  </div>
</section>

<div class="content">
  <section class="section">
    <div class="columns">
      <div class="column">
        <h3 class="title" id="toc">Table of Contents</h3>
        <ul>
          <li><a href="#collections-endpoint">DLTS Collections</a></li>
          <li><a href="#dlts-resources">DLTS Resources</a></li>
          <li><a href="#apache-solr-proxy">Apache Solr Search</a></li>
          <li><a href="#discovery-api">DLTS Discovery API</a></li>
          <li><a href="#iiif-presentation">IIIF Presentation API 3.0</a></li>
          <li><a href="#iiif-image">IIIF Image API 2.1.1</a></li>
          <li><a href="#open-access-books">Open Access books</a></li>
          <li><a href="#contact-us">How can we help?</a></li>
        </ul>
      </div>
      <div class="column is-narrow">
        <div class="card" style="width: 400px">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="http://sites.dlib.nyu.edu/viewer/sites/default/files/boutique/podcast.png" alt="DLTS Podcast" />
            </figure>
          </div>
          <div class="card-content" style="padding: 0;">
            <audio-player data-src="http://sites.dlib.nyu.edu/viewer/sites/default/files/boutique/podcast.mp3"></audio-player>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <article class="content">
    <h3 id="collections-endpoint" class="title">DLTS Collections</h3>
      <p>This endpoint retrieves a list of all collections currently available in the system. The response is formatted as a JSON object containing metadata about the collections. This endpoint does not accept any request parameters.</p>
      <p><strong>Endpoint:</strong> <a href="<?php echo $base_url ?>/api/v1/collections" target="_blank"><?php echo $base_url ?>/api/v1/collections</a></p>
      <p>The <strong>response format</strong> is a JSON object with the following structure.</p>
      <p><strong>Response:</strong> application/json</p>
<pre class="json-container">
<code id="json-output">
{
  "response": {
    "numFound": "100",
    "start": 0,
    "docs": [
      {
        "title": "Arabic Collections Online",
        "code": "aco",
        "partners": [
          {
            "name": "New York University Libraries",
            "code": "nyu"
          }
        ],
        "iiif": {
          "presentation": "<?php echo $base_url ?>/api/presentation/collections/aco:nyu/manifest.json"
        },
        "uri": "<?php echo $base_url ?>/api/v1/collections/aco:nyu"
      },
      ...
    ]
  }
}
</code>
</pre>
   <p><strong>Notes:</strong>
    <ol>
      <li>The <strong>numFound</strong> field indicates the total number of collections available.</li>
      <li>The <strong>start</strong> field is always 0 for this endpoint as it returns all results in a single response.</li>
      <li>A <strong>collection</strong> can be associated with <strong>multiple</strong> partner organizations.</li>
      <li>The <strong>code</strong> field is not guaranteed to be unique across all collections. Collections with the same code will have different unique partner associations.</li>
    </ol>
  </article>
  <article class="content">
    <h3 class="title" id="dlts-collection-resources">DLTS Collection Resources</h3>
    <p>This endpoint retrieves detailed information about a specific collection, including the resources (items) it contains. You can use the uri value from the DLTS Collections endpoint to access this information.</p>
    <p><strong>Endpoint:</strong> The uri field returned in the DLTS Collections endpoint provides the specific endpoint for each collection. Following the example:</p>
    <article class="message is-info">
      <div class="message-body">
        <em><?php echo $base_url ?>/api/v1/collections/{collection_code}:{partner_code}</em>
      </div>
    </article>
    <p><strong>Path Parameters:</strong></p>
    <ol>
      <li><strong>collection_code</strong>: The code identifying the collection (e.g., aco). Note that this code is not guaranteed to be unique across all collections and should be used in conjunction with the <strong>partner_code</strong>.</li>
      <li><strong>partner_code</strong>: The unique code identifying the partner organization associated with the collection (e.g., nyu). This helps to disambiguate collections with the same <strong>collection_code</strong>.</li>
    </ol>
    <p><strong>Example Request:</strong>
    <p>To retrieve information about the "Arabic Collections Online" from "New York University Libraries", you would use the following endpoint (taken from the uri field in the example response):</p>
    <article class="message is-info">
      <div class="message-body">
        <em><?php echo $base_url ?>/api/v1/collections/aco:nyu?rows=25&start=0</em>
      </div>
    </article>
    <p><strong>Response:</strong></p>
    <p>The response format is a JSON object containing metadata about the specific collection and a list of the resources within it. The exact structure of this response will vary depending on the collection, but you can expect to find information such as the collection's title, and an array of the items it contains.</p>
<pre class="json-container">
<code id="json-output">{
  "response": {
    "numFound": 3669,
    "start": 0,
    "rows": 10,
    "collection": {
      "title": "Arabic Collections Online",
      "code": "aco",
      "partners": [
        {
          "name": "New York University Libraries",
          "code": "nyu"
        }
      ],
    },
    "docs": [
      {
        "nid": "530",
        "noid": "hdr7sv1z",
        "type": "book",
        "identifier": "nyu_aco000511",
        "title": "Madrasat al-shayṭān",
        "collections": {
          "code": "aco",
          "name": "Arabic Collections Online"
        },
        "partners": [
          {
            "code": "nyu",
            "name": "New York University Libraries"
          }
        ],
        "iiif": {
          "presentation": "<?php echo $base_url ?>/api/presentation/books/nyu_aco000511/manifest.json"
        },
        "uri": "<?php echo $base_url ?>/api/v1/books/nyu_aco000511"
      },
    ]
  }
}</code>
</pre>
      <p><strong>Notes:</strong></p>
      <ol>
        <li>The <strong>docs</strong> array in this response lists the individual resources (items) that belong to the specified collection.</li>
        <li>Each resource within the <strong>docs</strong> array may have its own metadata, including a unique identifier, type, and a <strong>uri</strong> for further details about that specific resource.</li>
        <li>The <strong>numFound</strong> field in this response indicates the total number of resources within the collection.</li>
        <li>The <strong>start</strong> Specifies an offset (by default, 0) into the responses at which should begin displaying content.</li>
        <li>The <strong>rows</strong> Controls how many rows of responses are displayed at a time (default value: 10).</li>
      </ol>
    </article>
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
      <table class="table is-bordered is-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Alias</th>
          <th>Machine name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Book</td>
          <td>books</td>
          <td>dlts_book</td>
        </tr>
        <tr>
          <td>Map</td>
          <td>maps</td>
          <td>dlts_map</td>
        </tr>
        <tr>
          <td>Photo Set</td>
          <td>photos</td>
          <td>dlts_photo_set</td>
        </tr>
        <tr>
          <td>Collection</td>
          <td>collections</td>
          <td>dlts_collection</td>
        </tr>
        <tr>
          <td>Partner</td>
          <td>partners</td>
          <td>dlts_partner</td>
        </tr>
      </tbody>
    </table>
  </article>
  <article class="content">
    <h3 id="discovery-api" class="title">DLTS Discovery API</h3>
    <p>DLTS Discovery API can be use to find and filter by resource type, noid, identifier and others. <em>The following resource are available:</em></p>
    <ul>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_book" target="_blank">Book</a></a></li>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_photo_set" target="_blank">Photo set</a></li>
      <li><a href="<?php echo $base_url ?>/api/v1/objects?type=dlts_map" target="_blank">Map</a></li>
    </ul>
    <h5 class="title">Query parameters, which are supported by the DLTS Discovery API</h5>
    <table class="table is-bordered is-striped">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>start</td>
          <td>Specifies an offset (by default, 0) into the responses at which Discovery should begin displaying content.</td>
        </tr>
        <tr>
          <td>rows</td>
          <td>Controls how many rows of responses are displayed at a time (default value: 10)</td>
        </tr>
        <tr>
          <td>collection</td>
          <td>Applies a filter to query by collection code to the search results.</td>
        </tr>
        <tr>
          <td>partner</td>
          <td>Applies a filter to query by partner code to the search results.</td>
        </tr>
        <tr>
          <td>type</td>
          <td>Applies a filter to query by resource type to the search results. Available types: <em>dlts_book</em>, <em>dlts_photo_set</em>, <em>dlts_map</em></td>
        </tr>
        <tr>
          <td>searchTerm</td>
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
      <div class="message-body">
        <em><?php echo $base_url ?>/api/presentation/{resource-type}/{resource-identifier}/manifest.json</em>
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
        <em><?php echo $base_url ?>/api/image/{resource-type}/{resource-identifier}/{resource-sequence}/info.json</em>
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
        <em><?php echo $base_url ?>/api/image/{resource-type}/{resource-identifier}/{resource-sequence}/{resource-region}/{resource-size}/{resource-rotation}/{resource-quality}.{resource-format}</em>
      </div>
    </article>
    <table class="table is-bordered is-striped">
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
          <td>The explicit format string is always required. The format of the returned image is expressed as an extension at the end of the URI.</td>
        </tr>
      </tbody>
    </table>
    <h5 class="title">Resource format</h5>
    <table class="api-table">
      <thead>
        <tr>
          <th>Extension</th>
          <th>MIME Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>jpg</td>
          <td>image/jpeg</td>
        </tr>
        <tr>
          <td>tif</td>
          <td>image/tiff</td>
        </tr>
        <tr>
          <td>png</td>
          <td>image/png</td>
        </tr>
        <tr>
          <td>gif</td>
          <td>image/gif</td>
        </tr>
        <tr>
          <td>jp2</td>
          <td>image/jp2</td>
        </tr>
        <tr>
          <td>pdf</td>
          <td>application/pdf</td>
        </tr>
        <tr>
          <td>webp</td>
          <td>image/webp</td>
        </tr>
      </tbody>
    </table>
    <h5 class="title">Sample URL</h5>
    <table class="table is-bordered is-striped">
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
  <article class="content" id="open-access-books">
    <h5 class="title">Open Access Books API</h5>
    <p>This API allows users to retrieve information about open access books, including lists of publishers, books by a specific publisher, and detailed metadata for a specific book.</p>
    <h6 class="title">1. List All Publishers</h6>
    <p><strong>Endpoint:</strong> <a href="<?php echo $base_url ?>/api/v1/epubs" target="_blank"><?php echo $base_url ?>/api/v1/epubs</a></p>
    <p><strong>HTTP Method:</strong> GET</p>
    <p><strong>Description:</strong></p>
    <p>This endpoint retrieves a list of all publishers that have open access books available through this API.</p>
    <p><strong>Request:</strong> No request body is required.</p>
    <p><strong>Response:</strong> application/json</p>
<pre class="json-container">
<code id="json-output">
{
  "response": {
    "start": 0,
    "numFound": 1,
    "docs": [
      {
        "identifier": "nyu-press",
        "label": "New York University Press",
        "uri": "<?php echo $base_url ?>/api/v1/epubs/nyu-press"
      }
    ]
  }
}
</code>
</pre>
    <h6 class="title">2. List Books by Publisher</h6>
    <p><strong>Endpoint:</strong> <?php echo $base_url ?>/api/v1/epubs/:publisher</p>
    <p><strong>Example:</strong> <a href="<?php echo $base_url ?>/api/v1/epubs/nyu-press" target="_blank"><?php echo $base_url ?>/api/v1/epubs/nyu-press</a></p>
    <p><strong>HTTP Method:</strong> GET</p>
    <p><strong>Description:</strong></p>
    <p>This endpoint retrieves a list of all open access books published by a specific publisher. The publisher is identified by the :publisher path parameter.</p>
    <p><strong>Path Parameters:</strong></p>
    <ol>
      <li style="list-style-type: none;"><p><strong>:publisher</strong> (string, required): The name or identifier of the publisher. The exact format of this identifier should be consistent with how publishers are listed in the /epubs endpoint (e.g., the name field).</p></li>
    </ol>
    <p><strong>Request:</strong> No request body is required.</p>
    <p><strong>Response:</strong> application/json</p>
<pre class="json-container">
<code id="json-output">
{
  "response": {
    "start": 0,
    "numFound": 272,
    "docs": {
      "9781479842865": {
        "label": "Undisciplined",
        "identifier": "9781479842865",
        "modified": "2024-12-05",
        "status": "1",
        "uri": "<?php echo $base_url ?>/api/v1/epubs/nyu-press/9781479842865",
        "tid": ""
      },
      "9781479871247": {
        "label": "The Sex Offender Housing Dilemma",
        "identifier": "9781479871247",
        "modified": "2024-12-05",
        "status": "1",
        "uri": "<?php echo $base_url ?>/api/v1/epubs/nyu-press/9781479871247",
        "tid": ""
      },
      ...
    }
  }
}
</code>
</pre>
  <p><strong>Response Codes:</strong></p>
  <ol>
    <li><strong>200 OK:</strong> A list of books by the specified publisher is successfully returned.</li>
    <li><strong>404 Not Found:</strong> No publisher with the provided identifier was found.</li>
    <li><strong>500 Internal Server Error:</strong> An unexpected error occurred on the server.</li>
  </ol>
  <p><strong>Note:</strong> Ensure that the publisher name in the URL is URL-encoded if it contains spaces or special characters.</p>

  <h6 class="title">3. Get Book Metadata by publisher and library ISBN-13</h6>
  <p><strong>Endpoint:</strong> <?php echo $base_url ?>/api/v1/epubs/:publisher/:isbn13</p>
  <p><strong>Example:</strong> <a href="<?php echo $base_url ?>/api/v1/epubs/nyu-press/9781479842865" target="_blank"><?php echo $base_url ?>/api/v1/epubs/nyu-press/9781479842865</a></p>
  <p><strong>HTTP Method:</strong> GET</p>
  <p><strong>Description:</strong></p>
  <p>This endpoint retrieves the complete metadata for a specific open access book, identified by its ISBN-13.</p>
    <p><strong>Path Parameters:</strong></p>
    <ol>
      <li style="list-style-type: none;"><p><strong>:publisher</strong> (string, required): The name or identifier of the publisher. The exact format of this identifier should be consistent with how publishers are listed in the /epubs endpoint (e.g., the name field).</p></li>
      <li style="list-style-type: none;"><p><strong>:isbn13</strong> (string, required): The 13-digit ISBN of the book.</p></li>
    </ol>
    <p><strong>Request:</strong> No request body is required.</p>
    <p><strong>Response:</strong> application/json</p>
<pre class="json-container">
<code id="json-output">
{
  "contributors": [
    {
      "bio": "<b>Nihad M. Farooq</b> is Associate Professor of American & Atlantic Studies and Director of Undergraduate Studies in the School of Literature, Media, and Communication at the Georgia Institute of Technology.",
      "name": "Nihad Farooq",
      "nameSort": "Farooq, Nihad",
      "order": 1,
      "role": "By (author)"
    }
  ],
  "dateBook": "2016-07-19",
  "dateOpenAccess": "2022-04-15",
  "description": "In the 19th century, personhood was a term of regulation and discipline in which slaves, criminals, and others, could be “made and unmade.\" Yet it was precisely the fraught, uncontainable nature of personhood that necessitated its constant legislation, wherein its meaning could be both contested and controlled.Examining scientific and literary narratives, Nihad M. Farooq’s Undisciplined encourages an alternative consideration of personhood, one that emerges from evolutionary and ethnographic discourse. Moving chronologically from 1830 to 1940, Farooq explores the scientific and cultural entanglements of Atlantic travelers in and beyond the Darwin era, and invites us to attend more closely to the consequences of mobility and contact on disciplines and persons. Bringing together an innovative group of readings—from field journals, diaries, letters, and testimonies to novels, stage plays, and audio recordings—Farooq advocates for a reconsideration of science, personhood, and the priority of race for the field of American studies.  Whether expressed as narratives of acculturation, or as acts of resistance against the camera, the pen, or the shackle, these stories of the studied subjects of the Atlantic world add a new chapter to debates about personhood and disciplinarity in this era that actively challenged legal, social, and scientific categorizations.",
  "descriptionHtml": "<p>In the 19th century, personhood was a term of regulation and discipline in which slaves, criminals, and others, could be “made and unmade.\" Yet it was precisely the fraught, uncontainable nature of personhood that necessitated its constant legislation, wherein its meaning could be both contested and controlled.<br><br>Examining scientific and literary narratives, Nihad M. Farooq’s Undisciplined encourages an alternative consideration of personhood, one that emerges from evolutionary and ethnographic discourse. Moving chronologically from 1830 to 1940, Farooq explores the scientific and cultural entanglements of Atlantic travelers in and beyond the Darwin era, and invites us to attend more closely to the consequences of mobility and contact on disciplines and persons. Bringing together an innovative group of readings—from field journals, diaries, letters, and testimonies to novels, stage plays, and audio recordings—Farooq advocates for a reconsideration of science, personhood, and the priority of race for the field of American studies.  Whether expressed as narratives of acculturation, or as acts of resistance against the camera, the pen, or the shackle, these stories of the studied subjects of the Atlantic world add a new chapter to debates about personhood and disciplinarity in this era that actively challenged legal, social, and scientific categorizations.</p>",
  "doi": "https://doi.org/10.18574/nyu/9781479842865.001.0001",
  "handle": "https://doi.org/10.18574/nyu/9781479842865.001.0001",
  ...
}
</code>
</pre>
  <p><strong>Response Codes:</strong></p>
  <ol>
    <li><strong>200 OK:</strong> A list of books by the specified publisher is successfully returned.</li>
    <li><strong>400 Bad Request:</strong> The provided ISBN-13 is not in a valid format.</li>
    <li><strong>404 Not Found:</strong> No publisher with the provided identifier was found.</li>
    <li><strong>500 Internal Server Error:</strong> An unexpected error occurred on the server.</li>
  </ol>
  <p><strong>Note:</strong> Ensure that the publisher name in the URL is URL-encoded if it contains spaces or special characters.</p>
  </article>
  <?php if (!empty($routes)) : ?>
    <article class="content">
      <h5 class="title">Routes</h5>
      <table class="table is-bordered is-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($routes as $route): ?>
            <tr>
              <td><?php echo $route['title'] ?></td>
              <td><?php echo $route['path'] ?></td>
            </tr>
          <?php endforeach ?>
        </tbody>
      </table>
    </article>
  <?php endif; ?>
  <article class="content" id="summary">
    <h5 class="title">Summary</h5>
    <p>This document serves as the endpoints documentation for the DLTS Viewer, outlining the various ways users and applications can interact with the digital collections held within. It meticulously details specific API endpoints, categorized by the type of data or functionality they provide, such as listing collections, accessing individual resources, performing searches via Apache Solr, and utilizing IIIF standards for image and presentation data. Furthermore, it includes information on a dedicated Open Access books API, enabling retrieval of publisher and book-specific metadata. The purpose of this documentation is to provide developers with the necessary information to programmatically access and integrate DLTS Viewer content into other systems.</p>
  </article>
  <article class="content" id="contact-us">
    <h5 class="title">How can we help?</h5>
    <p>If you have any questions, feedback, or need support regarding this API, please feel free to reach out through the following channels:</p>
    <p>Maintainer/Developer: <strong>Alberto Ortiz Flores</strong>, Senior Software Developer</p>
    <p>Email: aortiz@nyu.edu, dlts.pa@nyu.edu</p>
    <p>Website: <a href="https://wp.nyu.edu/library-dlts/staff/">https://wp.nyu.edu/library-dlts/staff/</a></p>
    <p>We aim to respond to your inquiries in a timely manner. Thank you for using our API!</p>
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
<script type="module">
import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('template');
        const templateContent = template.content;
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        everything(this);
    }
}

const everything = function(element) {
  const shadow = element.shadowRoot;

    const audioPlayerContainer = shadow.getElementById('audio-player-container');
    const playIconContainer = shadow.getElementById('play-icon');
    const seekSlider = shadow.getElementById('seek-slider');
    const volumeSlider = shadow.getElementById('volume-slider');
    const muteIconContainer = shadow.getElementById('mute-icon');
    const audio = shadow.querySelector('audio');
    const durationContainer = shadow.getElementById('duration');
    const currentTimeContainer = shadow.getElementById('current-time');
    const outputContainer = shadow.getElementById('volume-output');
    let playState = 'play';
    let muteState = 'unmute';
    let raf = null;

    audio.src = element.getAttribute('data-src');

    const playAnimation = lottieWeb.loadAnimation({
        container: playIconContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Play Animation",
    });

    const muteAnimation = lottieWeb.loadAnimation({
        container: muteIconContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Mute Animation",
    });

    playAnimation.goToAndStop(14, true);

    const whilePlaying = () => {
        seekSlider.value = Math.floor(audio.currentTime);
        currentTimeContainer.textContent = calculateTime(seekSlider.value);
        audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
        raf = requestAnimationFrame(whilePlaying);
    }

    const showRangeProgress = (rangeInput) => {
        if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
        else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    }

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }

    const displayDuration = () => {
        durationContainer.textContent = calculateTime(audio.duration);
    }

    const setSliderMax = () => {
        seekSlider.max = Math.floor(audio.duration);
    }


    if (audio.readyState > 0) {
        displayDuration();
        setSliderMax();

    } else {
        audio.addEventListener('loadedmetadata', () => {
            displayDuration();
            setSliderMax();

        });
    }

    playIconContainer.addEventListener('click', () => {
        if(playState === 'play') {
            audio.play();
            playAnimation.playSegments([14, 27], true);
            requestAnimationFrame(whilePlaying);
            playState = 'pause';
        } else {
            audio.pause();
            playAnimation.playSegments([0, 14], true);
            cancelAnimationFrame(raf);
            playState = 'play';
        }
    });

    muteIconContainer.addEventListener('click', () => {
        if(muteState === 'unmute') {
            muteAnimation.playSegments([0, 15], true);
            audio.muted = true;
            muteState = 'mute';
        } else {
            muteAnimation.playSegments([15, 25], true);
            audio.muted = false;
            muteState = 'unmute';
        }
    });



    seekSlider.addEventListener('input', (e) => {
        showRangeProgress(e.target);
        currentTimeContainer.textContent = calculateTime(seekSlider.value);
        if(!audio.paused) {
            cancelAnimationFrame(raf);
        }
    });

    seekSlider.addEventListener('change', () => {
        audio.currentTime = seekSlider.value;
        if(!audio.paused) {
            requestAnimationFrame(whilePlaying);
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        showRangeProgress(e.target);
        outputContainer.textContent = value;
        audio.volume = value / 100;
    });

    if('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Komorebi',
            artist: 'Anitek',
            album: 'MainStay',
            artwork: [
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '96x96', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '128x128', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '192x192', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '256x256', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '384x384', type: 'image/png' },
                { src: 'https://assets.codepen.io/4358584/1.300.jpg', sizes: '512x512', type: 'image/png' }
            ]
        });
        navigator.mediaSession.setActionHandler('play', () => {
            if(playState === 'play') {
                audio.play();
                playAnimation.playSegments([14, 27], true);
                requestAnimationFrame(whilePlaying);
                playState = 'pause';
            } else {
                audio.pause();
                playAnimation.playSegments([0, 14], true);
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if(playState === 'play') {
                audio.play();
                playAnimation.playSegments([14, 27], true);
                requestAnimationFrame(whilePlaying);
                playState = 'pause';
            } else {
                audio.pause();
                playAnimation.playSegments([0, 14], true);
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            audio.currentTime = audio.currentTime - (details.seekOffset || 10);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            audio.currentTime = audio.currentTime + (details.seekOffset || 10);
        });
        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.fastSeek && 'fastSeek' in audio) {
              audio.fastSeek(details.seekTime);
              return;
            }
            audio.currentTime = details.seekTime;
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            audio.currentTime = 0;
            seekSlider.value = 0;
            audioPlayerContainer.style.setProperty('--seek-before-width', '0%');
            currentTimeContainer.textContent = '0:00';
            if(playState === 'pause') {
                playAnimation.playSegments([0, 14], true);
                cancelAnimationFrame(raf);
                playState = 'play';
            }
        });
    }
}

customElements.define('audio-player', AudioPlayer);
</script>
