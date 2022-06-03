/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./js/viewer.js ***!
  \**********************/
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ViewerApp(_x) {
  return _ViewerApp.apply(this, arguments);
}

function _ViewerApp() {
  _ViewerApp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(Y) {
    var _Y$nodes$osd$dataset, view, sequence, sequenceCount, current, type, postMessage, toggleview, on_paging_click, fullscreen_on, fullscreen_off, seqmap, _seqmap, load_sequence, _load_sequence, on_button_metadata_on, on_button_metadata_off, tiles_loading, update_loading_indicator, add_item_handler, are_all_fully_loaded, on_hide_thumbnails_view, on_open_thumbnails_view, onThumbnailsClick, slide_value_change, decrease, _decrease, change, _change, delegate, hide, increase, _increase, show, tiles, _tiles, tileSources, options, formSequence;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _tiles = function _tiles3() {
              _tiles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(seqmap, dataset) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        return _context6.abrupt("return", seqmap.sequence.map(function (sequence, x) {
                          return {
                            tileSource: "".concat(dataset.service, "/").concat(dataset.type, "/").concat(dataset.identifier, "/").concat(sequence, "/info.json"),
                            x: x
                          };
                        }));

                      case 1:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));
              return _tiles.apply(this, arguments);
            };

            tiles = function _tiles2(_x8, _x9) {
              return _tiles.apply(this, arguments);
            };

            show = function _show(selector) {
              document.querySelectorAll(selector).forEach(function (elm) {
                elm.style.display = null;
                elm.style.visibility = null;
                elm.hidden = null;
              });
            };

            _increase = function _increase3() {
              _increase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(props) {
                var sequenceCount, to, range_weight, slider_value;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        sequenceCount = props.dataset.sequenceCount;
                        to = Math.max.apply(Math, _toConsumableArray(Y.seqmap.sequence)) + 1;

                        if (!(to > Number(sequenceCount))) {
                          _context5.next = 6;
                          break;
                        }

                        return _context5.abrupt("return", sequenceCount);

                      case 6:
                        props.dataset.sequence = to.toString();
                        range_weight = document.querySelector('#range_weight');
                        slider_value = document.querySelector('#slider_value');

                        if (range_weight && slider_value) {
                          range_weight.value = to;
                          slider_value.value = to;
                        }

                      case 10:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));
              return _increase.apply(this, arguments);
            };

            increase = function _increase2(_x7) {
              return _increase.apply(this, arguments);
            };

            hide = function _hide(selector) {
              document.querySelectorAll(selector).forEach(function (elm) {
                elm.style.display = null;
                elm.style.visibility = null;
                elm.hidden = null;
                elm.height = 0;
              });
            };

            delegate = function _delegate(selector, eventType, childSelector, eventHandler) {
              var elements = document.querySelectorAll(selector);

              var _iterator = _createForOfIteratorHelper(elements),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var element = _step.value;
                  element.addEventListener(eventType, function (eventOnElement) {
                    if (eventOnElement.target.matches(childSelector)) {
                      eventHandler(eventOnElement);
                    }
                  });
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            };

            _change = function _change3() {
              _change = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(to, props) {
                var sequenceCount, sequence, sequence_count, range_weight, slider_value;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        sequenceCount = props.dataset.sequenceCount;
                        sequence = Number(to);
                        sequence_count = Number(sequenceCount);

                        if (!(sequence < 1)) {
                          _context4.next = 7;
                          break;
                        }

                        return _context4.abrupt("return", 1);

                      case 7:
                        if (!(sequence > sequence_count)) {
                          _context4.next = 11;
                          break;
                        }

                        return _context4.abrupt("return", sequence_count);

                      case 11:
                        props.dataset.sequence = sequence.toString();
                        range_weight = document.querySelector('#range_weight');
                        slider_value = document.querySelector('#slider_value');

                        if (range_weight && slider_value) {
                          range_weight.value = to;
                          slider_value.value = to;
                        }

                      case 15:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));
              return _change.apply(this, arguments);
            };

            change = function _change2(_x5, _x6) {
              return _change.apply(this, arguments);
            };

            _decrease = function _decrease3() {
              _decrease = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(props) {
                var to, range_weight, slider_value;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        to = Math.min.apply(Math, _toConsumableArray(Y.seqmap.sequence)) - 1;

                        if (!(to < 1)) {
                          _context3.next = 5;
                          break;
                        }

                        return _context3.abrupt("return", to);

                      case 5:
                        props.dataset.sequence = to.toString();
                        range_weight = document.querySelector('#range_weight');
                        slider_value = document.querySelector('#slider_value');

                        if (range_weight && slider_value) {
                          range_weight.value = to;
                          slider_value.value = to;
                        }

                      case 9:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));
              return _decrease.apply(this, arguments);
            };

            decrease = function _decrease2(_x4) {
              return _decrease.apply(this, arguments);
            };

            slide_value_change = function _slide_value_change(event) {
              document.dispatchEvent(new CustomEvent('load:sequence', {
                detail: {
                  operation: 'change',
                  to: event.currentTarget.value,
                  trigger: 'change'
                }
              }));
            };

            onThumbnailsClick = function _onThumbnailsClick(event) {
              event.preventDefault();
              var buttonThumbnails = document.getElementById('button-thumbnails');
              document.querySelector('html').classList.remove('thumbnails-view');

              if (buttonThumbnails.classList.contains('on')) {
                buttonThumbnails.classList.remove('on');
                buttonThumbnails.classList.add('off');
              }

              hide('#thumbnails');
              document.dispatchEvent(new CustomEvent('load:sequence', {
                detail: {
                  operation: 'change',
                  to: event.currentTarget.dataset.sequence
                }
              }));
            };

            on_open_thumbnails_view = function _on_open_thumbnails_v() {
              var uri = Y.nodes.osd.dataset.uri;
              var state = Y.nodes.thumbnails.dataset.state;
              var width = '230';
              var height = '150';
              document.querySelector('html').classList.add('thumbnails-view');
              var zoomIn = document.querySelector('#control-zoom-in');
              var zoomOut = document.querySelector('#control-zoom-out');
              zoomIn.classList.remove('active');
              zoomIn.classList.add('inactive');
              zoomIn.setAttribute('aria-disabled', 'true');
              zoomOut.classList.remove('active');
              zoomOut.classList.add('inactive');
              zoomOut.setAttribute('aria-disabled', 'true'); // Toggle view of books page icon.

              if (Y.nodes.togglePage) {
                Y.nodes.togglePage.classList.remove('active');
                Y.nodes.togglePage.classList.add('inactive');
                Y.nodes.togglePage.setAttribute('aria-disabled', 'true');
              }

              Y.nodes.next.forEach(function (item) {
                item.classList.remove('active');
                item.classList.add('inactive');
                item.setAttribute('aria-disabled', 'true');
              });
              Y.nodes.previous.forEach(function (item) {
                item.classList.remove('active');
                item.classList.add('inactive');
                item.setAttribute('aria-disabled', 'true');
              });

              if (Number(state) === 0) {
                axios.get("".concat(uri, "/thumbnails?pjax=true&width=").concat(width, "&height=").concat(height)).then(function (response) {
                  if (response.status === 200) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.data, 'text/html');
                    Y.nodes.thumbnails.appendChild(doc.querySelector('.thumbnails.container'));
                    document.querySelectorAll('.thumbnails.container a').forEach(function (item) {
                      item.addEventListener('click', onThumbnailsClick);
                    });
                    Y.nodes.thumbnails.dataset.state = 1;
                  }

                  show('#thumbnails');
                })["catch"](function (error) {
                  console.log(error);
                });
              }
            };

            on_hide_thumbnails_view = function _on_hide_thumbnails_v() {
              var osd = Y.nodes.osd;
              var _osd$dataset = osd.dataset,
                  sequenceCount = _osd$dataset.sequenceCount,
                  sequence = _osd$dataset.sequence;
              document.querySelector('html').classList.remove('thumbnails-view');
              hide('#thumbnails'); // Toggle view of books page icon.

              if (Y.nodes.togglePage) {
                Y.nodes.togglePage.classList.remove('inactive');
                Y.nodes.togglePage.classList.add('active');
              }

              Y.nodes.next.forEach(function (item) {
                if (sequence < sequenceCount) {
                  item.classList.remove('inactive');
                  item.classList.add('active');
                }
              });
              Y.nodes.previous.forEach(function (item) {
                if (sequence > 1) {
                  item.classList.remove('inactive');
                  item.classList.add('active');
                }
              });
            };

            are_all_fully_loaded = function _are_all_fully_loaded() {
              var count = Y.Viewer.world.getItemCount();

              for (var i = 0; i < count; i++) {
                var tiledImage = Y.Viewer.world.getItemAt(i);

                if (!tiledImage.getFullyLoaded()) {
                  return false;
                }
              }

              return true;
            };

            add_item_handler = function _add_item_handler(event) {
              Y.Viewer.viewport.setRotation(0);
              var tiledImage = event.item;
              tiledImage.addHandler('fully-loaded-change', function () {
                var newFullyLoaded = are_all_fully_loaded();

                if (newFullyLoaded !== Y.isFullyLoaded) {
                  Y.isFullyLoaded = newFullyLoaded;
                  update_loading_indicator();
                }
              });
            };

            update_loading_indicator = function _update_loading_indic() {
              if (Y.isFullyLoaded) {
                Y.nodes.body.classList.remove('openlayers-loading');
                hide('.pane.load');
                postMessage('viewer:loaded', {});
              }
            };

            tiles_loading = function _tiles_loading() {
              if (body.classList.contains('openlayers-loading')) {
                setTimeout(function () {
                  tiles_loading();
                }, 100);
              } else {
                hide('.pane.load');
                Y.nodes.body.classList.remove('openlayers-loading');
              }
            };

            on_button_metadata_off = function _on_button_metadata_o2() {
              var button = document.querySelector('#button-metadata');
              var element = document.querySelector('#pagemeta');
              button.classList.remove('on');
              button.classList.add('off');
              element.classList.add('hidden');
              element.closest('.pane-body').classList.add('pagemeta-hidden');
              postMessage('button:button-metadata:off', {});
            };

            on_button_metadata_on = function _on_button_metadata_o() {
              var button = document.querySelector('#button-metadata');
              var element = document.querySelector('#pagemeta');
              element.classList.remove('hidden');
              button.classList.remove('off');
              button.classList.add('on');
              element.closest('.pane-body').classList.remove('pagemeta-hidden');
              postMessage('button:button-metadata:on', {});
            };

            _load_sequence = function _load_sequence3() {
              _load_sequence = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
                var osd, dataset, _e$detail, operation, to, fire, message, _tileSources;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        osd = Y.nodes.osd;
                        dataset = osd.dataset;
                        _e$detail = e.detail, operation = _e$detail.operation, to = _e$detail.to;
                        fire = "viewer:sequence:".concat(operation);
                        _context2.t0 = operation;
                        _context2.next = _context2.t0 === 'increase' ? 8 : _context2.t0 === 'decrease' ? 11 : _context2.t0 === 'change' ? 14 : _context2.t0 === 'toggleview' ? 17 : 19;
                        break;

                      case 8:
                        _context2.next = 10;
                        return increase(osd);

                      case 10:
                        return _context2.abrupt("break", 19);

                      case 11:
                        _context2.next = 13;
                        return decrease(osd);

                      case 13:
                        return _context2.abrupt("break", 19);

                      case 14:
                        _context2.next = 16;
                        return change(to, osd);

                      case 16:
                        return _context2.abrupt("break", 19);

                      case 17:
                        toggleview(osd);
                        return _context2.abrupt("break", 19);

                      case 19:
                        // Configuration for the new sequence.
                        message = {
                          id: osd.id,
                          title: dataset.title,
                          count: Y.count,
                          view: dataset.view,
                          current: Number(dataset.current),
                          sequence: Number(dataset.sequence),
                          identifier: dataset.identifier,
                          uri: "".concat(dataset.uri, "/").concat(dataset.sequence)
                        };
                        _context2.next = 22;
                        return seqmap(message);

                      case 22:
                        Y.seqmap = _context2.sent;
                        postMessage(fire, message);
                        _context2.next = 26;
                        return tiles(Y.seqmap, dataset);

                      case 26:
                        _tileSources = _context2.sent;
                        document.querySelector('.current_page').textContent = Y.seqmap.sequence.join(' - ');
                        Y.nodes.next.forEach(function (item) {
                          if (dataset.sequence >= Y.seqmap.count) {
                            item.classList.add('inactive');
                          } else {
                            if (item.classList.contains('inactive')) {
                              item.classList.remove('inactive');
                            }
                          }
                        });
                        Y.nodes.previous.forEach(function (item) {
                          if (dataset.sequence <= 1) {
                            item.classList.add('inactive');
                          } else {
                            if (item.classList.contains('inactive')) {
                              item.classList.remove('inactive');
                            }
                          }
                        }); // Toggle view of books page icon.

                        if (Y.nodes.togglePage) {
                          Y.nodes.togglePage.classList.add('active');
                          Y.nodes.togglePage.classList.remove('inactive');
                        }

                        show('#openseadragon1');
                        show('#pager');
                        Y.Viewer.open(_tileSources);
                        Y.nodes.body.classList.remove('openlayers-loading');
                        Y.isFullyLoaded = true;
                        _context2.next = 41;
                        break;

                      case 38:
                        _context2.prev = 38;
                        _context2.t1 = _context2["catch"](0);
                        console.log(_context2.t1);

                      case 41:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 38]]);
              }));
              return _load_sequence.apply(this, arguments);
            };

            load_sequence = function _load_sequence2(_x3) {
              return _load_sequence.apply(this, arguments);
            };

            _seqmap = function _seqmap3() {
              _seqmap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props) {
                var count, view, sequence, sequences, seq;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        count = props.count, view = props.view, sequence = props.sequence;
                        sequences = [];
                        _context.t0 = view;
                        _context.next = _context.t0 === 'doublepage' ? 5 : _context.t0 === 'single' ? 11 : 13;
                        break;

                      case 5:
                        seq = Math.ceil(Number(count) / 2) + 1;
                        Array(seq).fill().map(function (_, index) {
                          sequences.push([index * 2, index * 2 + 1]);
                        }); // Remove 0 from first index.

                        sequences[0].shift(); // Make sure last index does not includes outbound sequences.

                        if (sequences[sequences.length - 1][1] > count) {
                          sequences[sequences.length - 1].pop();
                        }

                        if (sequences[sequences.length - 1][0] > count) {
                          sequences.pop();
                        }

                        return _context.abrupt("return", {
                          sequences: sequences,
                          count: count,
                          view: view,
                          sequence: sequences.find(function (value) {
                            return value.includes(sequence) === true;
                          })
                        });

                      case 11:
                        Array(Number(count)).fill().map(function (_, index) {
                          sequences.push([index + 1]);
                        });
                        return _context.abrupt("return", {
                          sequences: sequences,
                          count: count,
                          view: view,
                          sequence: [sequences.find(function (value) {
                            return Number(value) === Number(sequence);
                          })]
                        });

                      case 13:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _seqmap.apply(this, arguments);
            };

            seqmap = function _seqmap2(_x2) {
              return _seqmap.apply(this, arguments);
            };

            fullscreen_off = function _fullscreen_off() {
              var top = document.querySelector('.top');

              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
              } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
              } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
              }

              if (top) {
                top.classList.remove('hidden');
              }

              postMessage('button:button-fullscreen:off', {});
            };

            fullscreen_on = function _fullscreen_on() {
              var docElm = document.documentElement;
              var top = document.querySelector('.top');
              var button = document.querySelector('#button-metadata');

              if (button) {
                button.classList.remove('on');
              }

              if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
              } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
              } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
              } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
              }

              if (top) {
                button.classList.add('hidden');
              }

              postMessage('button:button-fullscreen:on', {});
            };

            on_paging_click = function _on_paging_click(e) {
              var currentTarget = e.currentTarget;
              e.preventDefault();
              /** test if the target is not active */

              if (currentTarget.classList.contains('inactive')) return false;

              try {
                Y.nodes.body.classList.add('openlayers-loading');
                document.dispatchEvent(new CustomEvent('load:sequence', {
                  detail: {
                    operation: e.currentTarget.dataset.operation
                  }
                }));
              } catch (e) {
                console.log(e);
              }
            };

            toggleview = function _toggleview(props) {
              var view = props.dataset.view;

              if (view == 'single') {
                props.dataset.view = 'doublepage';
              } else if (view == 'doublepage') {
                props.dataset.view = 'single';
              }
            };

            postMessage = function _postMessage(fire, message) {
              var post = JSON.stringify({
                fire: fire,
                message: message
              });
              console.log(post);
              window.top.postMessage(post, '*');
            };

            Y.Viewer = null;
            Y.isFullyLoaded = false;
            Y.seqmap = {};
            Y.nodes = {};
            Y.nodes.body = document.querySelector('body');
            Y.nodes.thumbnails = document.querySelector('#thumbnails');
            Y.nodes.buttonMetadata = document.querySelector('#button-metadata');
            Y.nodes.rotate = document.querySelector('#control-rotate');
            Y.nodes.pagemeta = document.querySelector('#pagemeta');
            Y.nodes.osd = document.querySelector('#openseadragon1');
            Y.nodes.display = document.getElementById('#display');
            Y.nodes.togglePage = document.getElementById('toggle-page');
            Y.nodes.controlZoomOut = document.getElementById('control-zoom-out');
            Y.nodes.controlZoomIn = document.getElementById('control-zoom-in');
            Y.nodes.toggleLanguage = document.querySelector('body .language');
            Y.nodes.next = document.querySelectorAll('.paging.next');
            Y.nodes.previous = document.querySelectorAll('.paging.previous');
            Y.nodes.slider = document.querySelector('#range_weight');
            Y.nodes.slider_value = document.querySelector('#slider_value');
            _Y$nodes$osd$dataset = Y.nodes.osd.dataset, view = _Y$nodes$osd$dataset.view, sequence = _Y$nodes$osd$dataset.sequence, sequenceCount = _Y$nodes$osd$dataset.sequenceCount, current = _Y$nodes$osd$dataset.current, type = _Y$nodes$osd$dataset.type;
            Y.count = Number(sequenceCount);
            postMessage('viewer:init', {});
            postMessage('viewer:contentready', {}); // Calls tiles loading.

            document.dispatchEvent(new CustomEvent('viewer:contentready'));

            if (view == 'doublepage') {
              if (Y.nodes.togglePage && Y.nodes.togglePage.classList.contains('page-double')) {
                Y.nodes.togglePage.classList.remove('page-double');
                Y.nodes.togglePage.classList.add('page-single');
              }
            }

            _context7.next = 57;
            return seqmap({
              count: Y.count,
              view: view,
              sequence: sequence,
              current: current
            });

          case 57:
            Y.seqmap = _context7.sent;
            document.querySelector('.current_page').textContent = Y.nodes.osd.dataset.sequence = sequence;

            if (Y.nodes.slider) {
              Y.nodes.slider.value = sequence;
            }

            if (Y.nodes.slider_value) {
              Y.nodes.slider_value.value = sequence;
            }

            document.querySelectorAll('.sequence_count').forEach(function (item) {
              item.textContent = Y.seqmap.count;
            });
            _context7.next = 64;
            return tiles(Y.seqmap, Y.nodes.osd.dataset);

          case 64:
            tileSources = _context7.sent;
            options = {
              id: Y.nodes.osd.id,
              preserveViewport: true,
              showNavigationControl: false,
              showZoomControl: false,
              showHomeControl: false,
              showFullPageControl: false,
              visibilityRatio: 1,
              minZoomLevel: 0,
              defaultZoomLevel: 0,
              sequenceMode: false,
              tileSources: tileSources
            };

            if (type == 'maps') {
              options.showNavigator = true;
            }

            Y.Viewer = Y.OpenSeadragon(options); // OpenSeadragon event.

            Y.Viewer.world.addHandler('add-item', add_item_handler); // OpenSeadragon event.

            Y.Viewer.addHandler('zoom', function () {
              if (Y.nodes.osd.hidden) return;
              var actualZoom = Y.Viewer.viewport.getZoom();
              var maxZoom = Y.Viewer.viewport.getMaxZoom();
              var minZoom = Y.Viewer.viewport.getMinZoom();

              if (actualZoom < maxZoom && Y.nodes.controlZoomIn.classList.contains('inactive')) {
                Y.nodes.controlZoomIn.classList.remove('inactive');
                Y.nodes.controlZoomIn.classList.add('active');
              }

              if (actualZoom >= maxZoom) {
                Y.nodes.controlZoomIn.classList.add('inactive');
                Y.nodes.controlZoomIn.classList.remove('active');
              }

              if (actualZoom <= minZoom) {
                Y.nodes.controlZoomOut.classList.add('inactive');
                Y.nodes.controlZoomOut.classList.remove('active');
              }

              if (actualZoom > minZoom) {
                Y.nodes.controlZoomOut.classList.remove('inactive');
                Y.nodes.controlZoomOut.classList.add('active');
              }
            });
            formSequence = document.querySelector('#form-update-sequence');

            if (formSequence && Y.nodes.slider_value) {
              formSequence.onsubmit = function (event) {
                event.preventDefault();
                document.dispatchEvent(new CustomEvent('load:sequence', {
                  detail: {
                    operation: 'change',
                    to: Y.nodes.slider_value.value,
                    trigger: 'onsubmit'
                  }
                }));
              };
            } // Zoom in click event.


            Y.nodes.controlZoomIn.onclick = function (e) {
              e.preventDefault();
              var actualZoom = Y.Viewer.viewport.getZoom();
              var maxZoom = Y.Viewer.viewport.getMaxZoom();
              var minZoom = Y.Viewer.viewport.getMinZoom();
              var zoomTo = actualZoom * 2;

              if (actualZoom < maxZoom) {
                Y.Viewer.viewport.zoomTo(zoomTo);
              } // look for event options (OpenSeaDragon zoom end)


              if (zoomTo >= maxZoom) {
                Y.nodes.controlZoomIn.classList.add('inactive');
              }

              if (actualZoom > minZoom) {
                if (Y.nodes.controlZoomOut.classList.contains('inactive')) {
                  Y.nodes.controlZoomOut.classList.remove('inactive');
                }
              }
            }; // Zoom out click event.


            Y.nodes.controlZoomOut.onclick = function (e) {
              e.preventDefault();
              var actualZoom = Y.Viewer.viewport.getZoom();
              var minZoom = Y.Viewer.viewport.getMinZoom();
              var zoom = actualZoom / 2;

              if (zoom >= minZoom) {
                Y.Viewer.viewport.zoomTo(zoom);
              } else {
                if (actualZoom > minZoom) {
                  Y.Viewer.viewport.zoomTo(minZoom);
                }
              }
            }; // Zoom out click event.


            Y.nodes.rotate.onclick = function (e) {
              e.preventDefault();
              Y.Viewer.viewport.setRotation(Y.Viewer.viewport.degrees + 90);
            };

            if (Y.nodes.togglePage) {
              Y.nodes.togglePage.onclick = function (e) {
                e.preventDefault();
                if (e.currentTarget.classList.contains('inactive')) return false;

                if (Y.nodes.togglePage.classList.contains('page-double')) {
                  Y.nodes.togglePage.classList.remove('page-double');
                  Y.nodes.togglePage.classList.add('page-single');
                } else {
                  Y.nodes.togglePage.classList.remove('page-single');
                  Y.nodes.togglePage.classList.add('page-double');
                }

                document.dispatchEvent(new CustomEvent('load:sequence', {
                  detail: {
                    operation: e.currentTarget.dataset.operation
                  }
                }));
              };
            }

            document.querySelectorAll('a.paging').forEach(function (item) {
              item.addEventListener('click', on_paging_click);
            });
            document.querySelectorAll('a.button').forEach(function (item) {
              item.addEventListener('click', function (event) {
                event.preventDefault();
                var current_target = event.currentTarget;
                var event_prefix = "button:".concat(current_target.id);
                /** don't waste time if the button is inactive */

                if (current_target.classList.contains('inactive')) {
                  return false;
                }

                if (current_target.classList.contains('on')) {
                  current_target.classList.remove('on');
                  current_target.classList.add('off');
                  document.dispatchEvent(new CustomEvent("".concat(event_prefix, ":off"), event));
                } else {
                  current_target.classList.add('on');
                  current_target.classList.remove('off');
                  document.dispatchEvent(new CustomEvent("".concat(event_prefix, ":on"), event));
                }

                document.dispatchEvent(new CustomEvent("".concat(event_prefix, ":toggle"), event));
              });
            });

            if (Y.nodes.slider) {
              Y.nodes.slider.addEventListener('change', slide_value_change);
            }

            document.addEventListener('load:sequence', load_sequence);
            window.addEventListener('popstate', function (e) {
              console.log(e);
              document.dispatchEvent(new CustomEvent('viewer:popstate', {
                detail: {
                  operation: 'change',
                  to: history.state.sequence,
                  trigger: 'popstate'
                }
              }));
            });
            document.addEventListener('button:button-metadata:on', on_button_metadata_on);
            document.addEventListener('button:button-metadata:off', on_button_metadata_off);
            document.addEventListener('button:button-fullscreen:on', fullscreen_on);
            document.addEventListener('button:button-fullscreen:off', fullscreen_off);
            document.addEventListener('viewer:contentready', tiles_loading);
            document.addEventListener('button:button-thumbnails:on', on_open_thumbnails_view);
            document.addEventListener('button:button-thumbnails:off', on_hide_thumbnails_view); // Language.

            delegate('body', 'change', '.lang-options select', function (event) {
              var current_target = event.target;
              axios.get(current_target.value).then(function (response) {
                if (response.status === 200) {
                  var parser = new DOMParser();
                  var doc = parser.parseFromString(response.data, 'text/html');
                  var pane = document.querySelector('.view-mode-metadata');
                  var pagemeta = doc.querySelector('.view-mode-metadata');
                  var main = document.querySelector('.pane.main');
                  var html = document.querySelector('html');
                  html.dir = pagemeta.dataset.dir;
                  main.dir = pagemeta.dataset.dir;
                  pane.dir = pagemeta.dataset.dir;
                  pane.innerHTML = pagemeta.innerHTML;
                }
              })["catch"](function (error) {
                console.log(error);
              });
            }); // Volume.

            delegate('body', 'change', '.view-mv select', function (event) {
              var current_target = event.target;
              var value = current_target.value;
              var node = document.querySelector('.node-dlts-book');
              var lang = node.dataset.lang;
              var url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang;

              if (window.self === window.top) {
                window.location.assign(url);
              } else {
                postMessage('change:option:multivolume', url);
              }
            });

          case 90:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _ViewerApp.apply(this, arguments);
}

ViewerApp({
  OpenSeadragon: window.OpenSeadragon,
  axios: axios
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFdBQVcsQ0FBQywyQkFBRCxFQUE4QjBNLEdBQTlCLENBQVg7Y0FDRDtZQUNGLENBWE8sQ0FBUjs7VUE3d0JGO1VBQUE7WUFBQTtRQUFBO01BQUE7SUFBQTtFQUFBOzs7O0FBNHhCQTVNLFNBQVMsQ0FBQztFQUFFcUwsYUFBYSxFQUFFbkIsTUFBTSxDQUFDbUIsYUFBeEI7RUFBdUN4RixLQUFLLEVBQUxBO0FBQXZDLENBQUQsQ0FBVCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9qcy92aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gVmlld2VyQXBwKFkpIHtcblxuICBZLlZpZXdlciA9IG51bGxcblxuICBZLmlzRnVsbHlMb2FkZWQgPSBmYWxzZVxuXG4gIFkuc2VxbWFwID0ge31cblxuICBZLm5vZGVzID0ge31cblxuICBZLm5vZGVzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcblxuICBZLm5vZGVzLnRodW1ibmFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGh1bWJuYWlscycpXG5cbiAgWS5ub2Rlcy5idXR0b25NZXRhZGF0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuXG4gIFkubm9kZXMucm90YXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtcm90YXRlJylcblxuICBZLm5vZGVzLnBhZ2VtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcblxuICBZLm5vZGVzLm9zZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgWS5ub2Rlcy5kaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyNkaXNwbGF5JylcblxuICBZLm5vZGVzLnRvZ2dsZVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLXBhZ2UnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbC16b29tLW91dCcpXG5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1pbicpXG5cbiAgWS5ub2Rlcy50b2dnbGVMYW5ndWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgLmxhbmd1YWdlJylcblxuICBZLm5vZGVzLm5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLm5leHQnKVxuXG4gIFkubm9kZXMucHJldmlvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLnByZXZpb3VzJylcblxuICBZLm5vZGVzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuXG4gIFkubm9kZXMuc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpICBcblxuICBjb25zdCB7XG4gICAgdmlldywgXG4gICAgc2VxdWVuY2UsIFxuICAgIHNlcXVlbmNlQ291bnQsIFxuICAgIGN1cnJlbnQsXG4gICAgdHlwZVxuICB9ID0gWS5ub2Rlcy5vc2QuZGF0YXNldFxuXG4gIFkuY291bnQgPSBOdW1iZXIoc2VxdWVuY2VDb3VudClcblxuICBmdW5jdGlvbiBwb3N0TWVzc2FnZShmaXJlLCBtZXNzYWdlKSB7XG4gICAgY29uc3QgcG9zdCA9IEpTT04uc3RyaW5naWZ5KHsgZmlyZSwgbWVzc2FnZSB9KVxuICAgIGNvbnNvbGUubG9nKHBvc3QpXG4gICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZShwb3N0LCAnKicpXG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGV2aWV3KHByb3BzKSB7XG4gICAgY29uc3QgeyB2aWV3IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgaWYgKHZpZXcgPT0gJ3NpbmdsZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdkb3VibGVwYWdlJ1xuICAgIH0gZWxzZSBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdzaW5nbGUnXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fcGFnaW5nX2NsaWNrKGUpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgLyoqIHRlc3QgaWYgdGhlIHRhcmdldCBpcyBub3QgYWN0aXZlICovXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICB0cnkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb24oKSB7XG4gICAgY29uc3QgZG9jRWxtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICB9XG4gICAgaWYgKGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywge30pXG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29mZigpIHtcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgdG9wLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywge30pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzZXFtYXAocHJvcHMpIHtcbiAgICBjb25zdCB7IGNvdW50LCB2aWV3LCBzZXF1ZW5jZSB9ID0gcHJvcHNcbiAgICBjb25zdCBzZXF1ZW5jZXMgPSBbXVxuICAgIHN3aXRjaCAodmlldykge1xuICAgICAgY2FzZSAnZG91YmxlcGFnZSc6XG4gICAgICAgIGNvbnN0IHNlcSA9IE1hdGguY2VpbChOdW1iZXIoY291bnQpIC8gMikgKyAxXG4gICAgICAgIEFycmF5KHNlcSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICogMiwgaW5kZXggKiAyICsgMSBdKVxuICAgICAgICB9KVxuICAgICAgICAvLyBSZW1vdmUgMCBmcm9tIGZpcnN0IGluZGV4LlxuICAgICAgICBzZXF1ZW5jZXNbMF0uc2hpZnQoKVxuICAgICAgICAvLyBNYWtlIHN1cmUgbGFzdCBpbmRleCBkb2VzIG5vdCBpbmNsdWRlcyBvdXRib3VuZCBzZXF1ZW5jZXMuXG4gICAgICAgIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzFdID4gY291bnQpIHtcbiAgICAgICAgICBzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMF0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlcy5wb3AoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VxdWVuY2VzLFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsICAgICAgICAgIFxuICAgICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiB2YWx1ZS5pbmNsdWRlcyhzZXF1ZW5jZSkgPT09IHRydWUpLFxuICAgICAgICB9XG4gICAgICBjYXNlICdzaW5nbGUnOlxuICAgICAgICBBcnJheShOdW1iZXIoY291bnQpKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKyAxXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsIFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsXG4gICAgICAgICAgc2VxdWVuY2U6IFsgc2VxdWVuY2VzLmZpbmQodmFsdWUgPT4gTnVtYmVyKHZhbHVlKSA9PT0gTnVtYmVyKHNlcXVlbmNlKSkgXSxcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRfc2VxdWVuY2UoZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuICAgICAgY29uc3QgZGF0YXNldCA9IG9zZC5kYXRhc2V0XG4gICAgICBjb25zdCB7IG9wZXJhdGlvbiwgdG8gfSAgPSBlLmRldGFpbFxuICAgICAgY29uc3QgZmlyZSA9IGB2aWV3ZXI6c2VxdWVuY2U6JHtvcGVyYXRpb259YFxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSAnaW5jcmVhc2UnOlxuICAgICAgICAgIGF3YWl0IGluY3JlYXNlKG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdkZWNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgZGVjcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgYXdhaXQgY2hhbmdlKHRvLCBvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndG9nZ2xldmlldyc6XG4gICAgICAgICAgdG9nZ2xldmlldyhvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIC8vIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBuZXcgc2VxdWVuY2UuXG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICBpZDogb3NkLmlkLFxuICAgICAgICB0aXRsZTogZGF0YXNldC50aXRsZSxcbiAgICAgICAgY291bnQ6IFkuY291bnQsXG4gICAgICAgIHZpZXc6IGRhdGFzZXQudmlldyxcbiAgICAgICAgY3VycmVudDogTnVtYmVyKGRhdGFzZXQuY3VycmVudCksXG4gICAgICAgIHNlcXVlbmNlOiBOdW1iZXIoZGF0YXNldC5zZXF1ZW5jZSksXG4gICAgICAgIGlkZW50aWZpZXI6IGRhdGFzZXQuaWRlbnRpZmllcixcbiAgICAgICAgdXJpOiBgJHtkYXRhc2V0LnVyaX0vJHtkYXRhc2V0LnNlcXVlbmNlfWAsXG4gICAgICB9XG5cbiAgICAgIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKG1lc3NhZ2UpXG5cbiAgICAgIHBvc3RNZXNzYWdlKGZpcmUsIG1lc3NhZ2UpXG5cbiAgICAgIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIGRhdGFzZXQpXG5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLnNlcXVlbmNlLmpvaW4oJyAtICcpXG5cbiAgICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChkYXRhc2V0LnNlcXVlbmNlID49IFkuc2VxbWFwLmNvdW50KSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA8PSAxKSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG5cbiAgICAgIHNob3coJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgICAgIHNob3coJyNwYWdlcicpXG5cbiAgICAgIFkuVmlld2VyLm9wZW4odGlsZVNvdXJjZXMpXG5cbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuXG4gICAgICBZLmlzRnVsbHlMb2FkZWQgPSB0cnVlXG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29uKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgIGVsZW1lbnQuY2xvc2VzdCgnLnBhbmUtYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2VtZXRhLWhpZGRlbicpXG4gICAgcG9zdE1lc3NhZ2UoJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b24nLCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgZWxlbWVudC5jbG9zZXN0KCcucGFuZS1ib2R5JykuY2xhc3NMaXN0LmFkZCgncGFnZW1ldGEtaGlkZGVuJylcbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvZmYnLCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbGVzX2xvYWRpbmcoKSB7XG4gICAgaWYgKGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVubGF5ZXJzLWxvYWRpbmcnKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbGVzX2xvYWRpbmcoKVxuICAgICAgfSwgMTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlkZSgnLnBhbmUubG9hZCcpXG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IoKSB7XG4gICAgaWYgKFkuaXNGdWxseUxvYWRlZCkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBoaWRlKCcucGFuZS5sb2FkJylcbiAgICAgIHBvc3RNZXNzYWdlKCd2aWV3ZXI6bG9hZGVkJywge30pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkX2l0ZW1faGFuZGxlcihldmVudCkge1xuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKDApXG4gICAgY29uc3QgdGlsZWRJbWFnZSA9IGV2ZW50Lml0ZW1cbiAgICB0aWxlZEltYWdlLmFkZEhhbmRsZXIoJ2Z1bGx5LWxvYWRlZC1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdGdWxseUxvYWRlZCA9IGFyZV9hbGxfZnVsbHlfbG9hZGVkKClcbiAgICAgIGlmIChuZXdGdWxseUxvYWRlZCAhPT0gWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICAgIFkuaXNGdWxseUxvYWRlZCA9IG5ld0Z1bGx5TG9hZGVkXG4gICAgICAgIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZV9hbGxfZnVsbHlfbG9hZGVkKCkge1xuICAgIGNvbnN0IGNvdW50ID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUNvdW50KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBZLlZpZXdlci53b3JsZC5nZXRJdGVtQXQoaSlcbiAgICAgIGlmICghdGlsZWRJbWFnZS5nZXRGdWxseUxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gb25faGlkZV90aHVtYm5haWxzX3ZpZXcoKSB7XG4gICAgY29uc3Qgb3NkID0gWS5ub2Rlcy5vc2RcbiAgICBjb25zdCB7IHNlcXVlbmNlQ291bnQsIHNlcXVlbmNlIH0gPSBvc2QuZGF0YXNldFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcblxuICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuICAgIFxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlIDwgc2VxdWVuY2VDb3VudCkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoc2VxdWVuY2UgPiAxKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfSlcblxuICB9XG5cbiAgZnVuY3Rpb24gb25fb3Blbl90aHVtYm5haWxzX3ZpZXcoKSB7XG4gICAgY29uc3QgeyB1cmkgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldFxuICAgIGNvbnN0IHdpZHRoID0gJzIzMCdcbiAgICBjb25zdCBoZWlnaHQgPSAnMTUwJ1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3RodW1ibmFpbHMtdmlldycpXG4gICAgY29uc3Qgem9vbUluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtem9vbS1pbicpXG4gICAgY29uc3Qgem9vbU91dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sLXpvb20tb3V0JylcblxuICAgIHpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIHpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgem9vbUluLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICd0cnVlJylcblxuICAgIHpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB6b29tT3V0LmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB6b29tT3V0LnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICd0cnVlJylcblxuICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH1cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGlmIChOdW1iZXIoc3RhdGUpID09PSAwKSB7XG4gICAgICBheGlvcy5nZXQoYCR7dXJpfS90aHVtYm5haWxzP3BqYXg9dHJ1ZSZ3aWR0aD0ke3dpZHRofSZoZWlnaHQ9JHtoZWlnaHR9YCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVzcG9uc2UuZGF0YSwgJ3RleHQvaHRtbCcpXG4gICAgICAgICAgIFkubm9kZXMudGh1bWJuYWlscy5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGRvYy5xdWVyeVNlbGVjdG9yKCcudGh1bWJuYWlscy5jb250YWluZXInKVxuICAgICAgICAgIClcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGh1bWJuYWlscy5jb250YWluZXIgYScpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25UaHVtYm5haWxzQ2xpY2spXG4gICAgICAgICAgfSlcbiAgICAgICAgICBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldC5zdGF0ZSA9IDFcbiAgICAgICAgfVxuICAgICAgICBzaG93KCcjdGh1bWJuYWlscycpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGh1bWJuYWlsc0NsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGJ1dHRvblRodW1ibmFpbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXRodW1ibmFpbHMnKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGlmIChidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICBidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgfVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VxdWVuY2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2xpZGVfdmFsdWVfY2hhbmdlKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcbiAgICAgICAgICB0cmlnZ2VyOiAnY2hhbmdlJyxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHRvID0gTWF0aC5taW4oLi4uWS5zZXFtYXAuc2VxdWVuY2UpIC0gMVxuICAgIGlmICh0byA8IDEpIHtcbiAgICAgIHJldHVybiB0b1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gY2hhbmdlKHRvLCBwcm9wcykge1xuICAgIGNvbnN0IHsgc2VxdWVuY2VDb3VudCB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGNvbnN0IHNlcXVlbmNlID0gTnVtYmVyKHRvKVxuICAgIGNvbnN0IHNlcXVlbmNlX2NvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG4gICAgaWYgKHNlcXVlbmNlIDwgMSkge1xuICAgICAgcmV0dXJuIDFcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlID4gc2VxdWVuY2VfY291bnQpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZV9jb3VudFxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gc2VxdWVuY2UudG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50VHlwZSwgY2hpbGRTZWxlY3RvciwgZXZlbnRIYW5kbGVyKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50T25FbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGV2ZW50T25FbGVtZW50LnRhcmdldC5tYXRjaGVzKGNoaWxkU2VsZWN0b3IpKSB7XG4gICAgICAgICAgZXZlbnRIYW5kbGVyKGV2ZW50T25FbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGUoc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICAgIGVsbS5oZWlnaHQgPSAwXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGluY3JlYXNlKHByb3BzKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2VxdWVuY2VDb3VudFxuICAgIH0gPSBwcm9wcy5kYXRhc2V0XG5cbiAgICBjb25zdCB0byA9IE1hdGgubWF4KC4uLlkuc2VxbWFwLnNlcXVlbmNlKSArIDFcbiAgICBcbiAgICBpZiAodG8gPiBOdW1iZXIoc2VxdWVuY2VDb3VudCkpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZUNvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSB0by50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzaG93KHNlbGVjdG9yKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaChlbG0gPT4ge1xuICAgICAgZWxtLnN0eWxlLmRpc3BsYXkgPSBudWxsXG4gICAgICBlbG0uc3R5bGUudmlzaWJpbGl0eSA9IG51bGxcbiAgICAgIGVsbS5oaWRkZW4gPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHRpbGVzKHNlcW1hcCwgZGF0YXNldCkge1xuICAgIHJldHVybiBzZXFtYXAuc2VxdWVuY2UubWFwKChzZXF1ZW5jZSwgeCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGlsZVNvdXJjZTogYCR7ZGF0YXNldC5zZXJ2aWNlfS8ke2RhdGFzZXQudHlwZX0vJHtkYXRhc2V0LmlkZW50aWZpZXJ9LyR7c2VxdWVuY2V9L2luZm8uanNvbmAsIHhcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoJ3ZpZXdlcjppbml0Jywge30pXG5cbiAgcG9zdE1lc3NhZ2UoJ3ZpZXdlcjpjb250ZW50cmVhZHknLCB7fSlcblxuICAvLyBDYWxscyB0aWxlcyBsb2FkaW5nLlxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBDdXN0b21FdmVudCgndmlld2VyOmNvbnRlbnRyZWFkeScpXG4gIClcblxuICBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlICYmIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgIH1cbiAgfVxuXG4gIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKHsgY291bnQ6IFkuY291bnQsIHZpZXcsIHNlcXVlbmNlLCBjdXJyZW50IH0pXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnRfcGFnZScpLnRleHRDb250ZW50ID0gIFkubm9kZXMub3NkLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZVxuXG4gIGlmIChZLm5vZGVzLnNsaWRlcikge1xuICAgIFkubm9kZXMuc2xpZGVyLnZhbHVlID0gc2VxdWVuY2VcbiAgfVxuXG4gIGlmIChZLm5vZGVzLnNsaWRlcl92YWx1ZSkge1xuICAgIFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlID0gc2VxdWVuY2VcbiAgfVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXF1ZW5jZV9jb3VudCcpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLmNvdW50XG4gIH0pXG5cbiAgY29uc3QgdGlsZVNvdXJjZXMgPSBhd2FpdCB0aWxlcyhZLnNlcW1hcCwgWS5ub2Rlcy5vc2QuZGF0YXNldClcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiBZLm5vZGVzLm9zZC5pZCxcbiAgICBwcmVzZXJ2ZVZpZXdwb3J0OiB0cnVlLFxuICAgIHNob3dOYXZpZ2F0aW9uQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd1pvb21Db250cm9sOiBmYWxzZSxcbiAgICBzaG93SG9tZUNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dGdWxsUGFnZUNvbnRyb2w6IGZhbHNlLFxuICAgIHZpc2liaWxpdHlSYXRpbzogMSxcbiAgICBtaW5ab29tTGV2ZWw6IDAsXG4gICAgZGVmYXVsdFpvb21MZXZlbDogMCxcbiAgICBzZXF1ZW5jZU1vZGU6IGZhbHNlLFxuICAgIHRpbGVTb3VyY2VzOiB0aWxlU291cmNlcyxcbiAgfVxuXG4gIGlmICh0eXBlID09ICdtYXBzJykge1xuICAgIG9wdGlvbnMuc2hvd05hdmlnYXRvciA9IHRydWVcbiAgfVxuXG4gIFkuVmlld2VyID0gWS5PcGVuU2VhZHJhZ29uKG9wdGlvbnMpXG5cbiAgLy8gT3BlblNlYWRyYWdvbiBldmVudC5cbiAgWS5WaWV3ZXIud29ybGQuYWRkSGFuZGxlcignYWRkLWl0ZW0nLCBhZGRfaXRlbV9oYW5kbGVyKVxuXG4gIC8vIE9wZW5TZWFkcmFnb24gZXZlbnQuXG4gIFkuVmlld2VyLmFkZEhhbmRsZXIoJ3pvb20nLCAoKSA9PiB7XG5cbiAgICBpZiAoWS5ub2Rlcy5vc2QuaGlkZGVuKSByZXR1cm5cblxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA8IG1heFpvb20gJiZcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJylcbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tID49IG1heFpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tIDw9IG1pblpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPiBtaW5ab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgfSlcblxuICBjb25zdCBmb3JtU2VxdWVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZm9ybS11cGRhdGUtc2VxdWVuY2UnKVxuICBpZiAoZm9ybVNlcXVlbmNlICYmIFkubm9kZXMuc2xpZGVyX3ZhbHVlKSB7XG4gICAgZm9ybVNlcXVlbmNlLm9uc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgICAgdG86IFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlLFxuICAgICAgICAgICAgdHJpZ2dlcjogJ29uc3VibWl0JyxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBpbiBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb21UbyA9IGFjdHVhbFpvb20gKiAyXG4gICAgaWYgKGFjdHVhbFpvb20gPCBtYXhab29tKSB7XG4gICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8oem9vbVRvKVxuICAgIH1cbiAgICAvLyBsb29rIGZvciBldmVudCBvcHRpb25zIChPcGVuU2VhRHJhZ29uIHpvb20gZW5kKVxuICAgIGlmICh6b29tVG8gPj0gbWF4Wm9vbSkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9XG4gICAgaWYgKGFjdHVhbFpvb20gPiBtaW5ab29tKSB7XG4gICAgICBpZiAoWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcbiAgICBjb25zdCB6b29tID0gYWN0dWFsWm9vbSAvIDJcbiAgICBpZiAoem9vbSA+PSBtaW5ab29tKSB7XG4gICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8oem9vbSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGFjdHVhbFpvb20gPiBtaW5ab29tKSB7XG4gICAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21UbyhtaW5ab29tKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gb3V0IGNsaWNrIGV2ZW50LlxuICBZLm5vZGVzLnJvdGF0ZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBZLlZpZXdlci52aWV3cG9ydC5zZXRSb3RhdGlvbihZLlZpZXdlci52aWV3cG9ydC5kZWdyZWVzICsgOTApXG4gIH1cblxuICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgWS5ub2Rlcy50b2dnbGVQYWdlLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kb3VibGUnKSkge1xuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1kb3VibGUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLXNpbmdsZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLWRvdWJsZScpXG4gICAgICB9XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYS5wYWdpbmcnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbl9wYWdpbmdfY2xpY2spXG4gIH0pXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYS5idXR0b24nKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGNvbnN0IGN1cnJlbnRfdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgbGV0IGV2ZW50X3ByZWZpeCA9IGBidXR0b246JHtjdXJyZW50X3RhcmdldC5pZH1gXG4gICAgICAvKiogZG9uJ3Qgd2FzdGUgdGltZSBpZiB0aGUgYnV0dG9uIGlzIGluYWN0aXZlICovXG4gICAgICBpZiAoY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGAke2V2ZW50X3ByZWZpeH06b2ZmYCwgZXZlbnQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvbicpXG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ29mZicpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGAke2V2ZW50X3ByZWZpeH06b25gLCBldmVudClcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGAke2V2ZW50X3ByZWZpeH06dG9nZ2xlYCwgZXZlbnQpXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICBpZiAoWS5ub2Rlcy5zbGlkZXIpIHtcbiAgICBZLm5vZGVzLnNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzbGlkZV92YWx1ZV9jaGFuZ2UpXG4gIH0gIFxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQ6c2VxdWVuY2UnLCBsb2FkX3NlcXVlbmNlKVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCd2aWV3ZXI6cG9wc3RhdGUnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgdG86IGhpc3Rvcnkuc3RhdGUuc2VxdWVuY2UsXG4gICAgICAgICAgdHJpZ2dlcjogJ3BvcHN0YXRlJyxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywgZnVsbHNjcmVlbl9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywgZnVsbHNjcmVlbl9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld2VyOmNvbnRlbnRyZWFkeScsIHRpbGVzX2xvYWRpbmcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9uJywgb25fb3Blbl90aHVtYm5haWxzX3ZpZXcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9mZicsIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KVxuXG4gIC8vIExhbmd1YWdlLlxuICBkZWxlZ2F0ZSgnYm9keScsICdjaGFuZ2UnLCAnLmxhbmctb3B0aW9ucyBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBheGlvcy5nZXQoY3VycmVudF90YXJnZXQudmFsdWUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICBjb25zdCBwYW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IHBhZ2VtZXRhID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmUubWFpbicpXG4gICAgICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJylcbiAgICAgICAgaHRtbC5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBtYWluLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5pbm5lckhUTUwgPSBwYWdlbWV0YS5pbm5lckhUTUxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZvbHVtZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy52aWV3LW12IHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGNvbnN0IHZhbHVlID0gY3VycmVudF90YXJnZXQudmFsdWVcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vZGUtZGx0cy1ib29rJylcbiAgICBjb25zdCBsYW5nID0gbm9kZS5kYXRhc2V0LmxhbmdcbiAgICBjb25zdCB1cmwgPSB2YWx1ZS5zdWJzdHJpbmcodmFsdWUuaW5kZXhPZignOjonKSArIDIsIHZhbHVlLmxlbmd0aCkgKyAnLzE/bGFuZz0nICsgbGFuZ1xuICAgIGlmICh3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3RNZXNzYWdlKCdjaGFuZ2U6b3B0aW9uOm11bHRpdm9sdW1lJywgdXJsKVxuICAgIH1cbiAgfSlcblxufVxuXG5WaWV3ZXJBcHAoeyBPcGVuU2VhZHJhZ29uOiB3aW5kb3cuT3BlblNlYWRyYWdvbiwgYXhpb3MgfSlcbiJdLCJuYW1lcyI6WyJWaWV3ZXJBcHAiLCJZIiwicG9zdE1lc3NhZ2UiLCJ0b2dnbGV2aWV3Iiwib25fcGFnaW5nX2NsaWNrIiwiZnVsbHNjcmVlbl9vbiIsImZ1bGxzY3JlZW5fb2ZmIiwic2VxbWFwIiwibG9hZF9zZXF1ZW5jZSIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vbiIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vZmYiLCJ0aWxlc19sb2FkaW5nIiwidXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yIiwiYWRkX2l0ZW1faGFuZGxlciIsImFyZV9hbGxfZnVsbHlfbG9hZGVkIiwib25faGlkZV90aHVtYm5haWxzX3ZpZXciLCJvbl9vcGVuX3RodW1ibmFpbHNfdmlldyIsIm9uVGh1bWJuYWlsc0NsaWNrIiwic2xpZGVfdmFsdWVfY2hhbmdlIiwiZGVjcmVhc2UiLCJjaGFuZ2UiLCJkZWxlZ2F0ZSIsImhpZGUiLCJpbmNyZWFzZSIsInNob3ciLCJ0aWxlcyIsImRhdGFzZXQiLCJzZXF1ZW5jZSIsIm1hcCIsIngiLCJ0aWxlU291cmNlIiwic2VydmljZSIsInR5cGUiLCJpZGVudGlmaWVyIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWxtIiwic3R5bGUiLCJkaXNwbGF5IiwidmlzaWJpbGl0eSIsImhpZGRlbiIsInByb3BzIiwic2VxdWVuY2VDb3VudCIsInRvIiwiTWF0aCIsIm1heCIsIk51bWJlciIsInRvU3RyaW5nIiwicmFuZ2Vfd2VpZ2h0IiwicXVlcnlTZWxlY3RvciIsInNsaWRlcl92YWx1ZSIsInZhbHVlIiwiaGVpZ2h0IiwiZXZlbnRUeXBlIiwiY2hpbGRTZWxlY3RvciIsImV2ZW50SGFuZGxlciIsImVsZW1lbnRzIiwiZWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudE9uRWxlbWVudCIsInRhcmdldCIsIm1hdGNoZXMiLCJzZXF1ZW5jZV9jb3VudCIsIm1pbiIsImV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwib3BlcmF0aW9uIiwiY3VycmVudFRhcmdldCIsInRyaWdnZXIiLCJwcmV2ZW50RGVmYXVsdCIsImJ1dHRvblRodW1ibmFpbHMiLCJnZXRFbGVtZW50QnlJZCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImNvbnRhaW5zIiwiYWRkIiwidXJpIiwibm9kZXMiLCJvc2QiLCJzdGF0ZSIsInRodW1ibmFpbHMiLCJ3aWR0aCIsInpvb21JbiIsInpvb21PdXQiLCJzZXRBdHRyaWJ1dGUiLCJ0b2dnbGVQYWdlIiwibmV4dCIsIml0ZW0iLCJwcmV2aW91cyIsImF4aW9zIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwic3RhdHVzIiwicGFyc2VyIiwiRE9NUGFyc2VyIiwiZG9jIiwicGFyc2VGcm9tU3RyaW5nIiwiZGF0YSIsImFwcGVuZENoaWxkIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiY291bnQiLCJWaWV3ZXIiLCJ3b3JsZCIsImdldEl0ZW1Db3VudCIsImkiLCJ0aWxlZEltYWdlIiwiZ2V0SXRlbUF0IiwiZ2V0RnVsbHlMb2FkZWQiLCJ2aWV3cG9ydCIsInNldFJvdGF0aW9uIiwiYWRkSGFuZGxlciIsIm5ld0Z1bGx5TG9hZGVkIiwiaXNGdWxseUxvYWRlZCIsImJvZHkiLCJzZXRUaW1lb3V0IiwiYnV0dG9uIiwiY2xvc2VzdCIsImUiLCJmaXJlIiwibWVzc2FnZSIsImlkIiwidGl0bGUiLCJ2aWV3IiwiY3VycmVudCIsInRpbGVTb3VyY2VzIiwidGV4dENvbnRlbnQiLCJqb2luIiwib3BlbiIsInNlcXVlbmNlcyIsInNlcSIsImNlaWwiLCJBcnJheSIsImZpbGwiLCJfIiwiaW5kZXgiLCJwdXNoIiwic2hpZnQiLCJsZW5ndGgiLCJwb3AiLCJmaW5kIiwiaW5jbHVkZXMiLCJ0b3AiLCJleGl0RnVsbHNjcmVlbiIsIm1zRXhpdEZ1bGxzY3JlZW4iLCJtb3pDYW5jZWxGdWxsU2NyZWVuIiwid2Via2l0Q2FuY2VsRnVsbFNjcmVlbiIsImRvY0VsbSIsImRvY3VtZW50RWxlbWVudCIsInJlcXVlc3RGdWxsc2NyZWVuIiwibXNSZXF1ZXN0RnVsbHNjcmVlbiIsIm1velJlcXVlc3RGdWxsU2NyZWVuIiwid2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4iLCJwb3N0IiwiSlNPTiIsInN0cmluZ2lmeSIsIndpbmRvdyIsImJ1dHRvbk1ldGFkYXRhIiwicm90YXRlIiwicGFnZW1ldGEiLCJjb250cm9sWm9vbU91dCIsImNvbnRyb2xab29tSW4iLCJ0b2dnbGVMYW5ndWFnZSIsInNsaWRlciIsIm9wdGlvbnMiLCJwcmVzZXJ2ZVZpZXdwb3J0Iiwic2hvd05hdmlnYXRpb25Db250cm9sIiwic2hvd1pvb21Db250cm9sIiwic2hvd0hvbWVDb250cm9sIiwic2hvd0Z1bGxQYWdlQ29udHJvbCIsInZpc2liaWxpdHlSYXRpbyIsIm1pblpvb21MZXZlbCIsImRlZmF1bHRab29tTGV2ZWwiLCJzZXF1ZW5jZU1vZGUiLCJzaG93TmF2aWdhdG9yIiwiT3BlblNlYWRyYWdvbiIsImFjdHVhbFpvb20iLCJnZXRab29tIiwibWF4Wm9vbSIsImdldE1heFpvb20iLCJtaW5ab29tIiwiZ2V0TWluWm9vbSIsImZvcm1TZXF1ZW5jZSIsIm9uc3VibWl0Iiwib25jbGljayIsInpvb21UbyIsInpvb20iLCJkZWdyZWVzIiwiY3VycmVudF90YXJnZXQiLCJldmVudF9wcmVmaXgiLCJoaXN0b3J5IiwicGFuZSIsIm1haW4iLCJodG1sIiwiZGlyIiwiaW5uZXJIVE1MIiwibm9kZSIsImxhbmciLCJ1cmwiLCJzdWJzdHJpbmciLCJpbmRleE9mIiwic2VsZiIsImxvY2F0aW9uIiwiYXNzaWduIl0sInNvdXJjZVJvb3QiOiIifQ==