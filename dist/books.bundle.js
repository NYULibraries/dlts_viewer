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
                postMessage({
                  fire: 'viewer:loaded',
                  message: {}
                });
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
              postMessage({
                fire: 'button:button-metadata:off',
                message: {}
              });
            };

            on_button_metadata_on = function _on_button_metadata_o() {
              var button = document.querySelector('#button-metadata');
              var element = document.querySelector('#pagemeta');
              element.classList.remove('hidden');
              button.classList.remove('off');
              button.classList.add('on');
              element.closest('.pane-body').classList.remove('pagemeta-hidden');
              postMessage({
                fire: 'button:button-metadata:on',
                message: {}
              });
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
                        postMessage({
                          fire: fire,
                          message: message
                        });
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
              window.top.postMessage(JSON.stringify({
                fire: fire,
                message: message
              }), '*');
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

            document.addEventListener('load:sequence', load_sequence); // window.addEventListener('popstate', (e) => {
            // document.dispatchEvent(
            //   new CustomEvent('load:sequence', {
            //     detail: {
            //       operation: 'change',
            //       to: history.state.sequence,
            //       trigger: 'popstate',
            //     }
            //   })
            // )
            // })

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
                postMessage({
                  fire: 'change:option:multivolume',
                  message: {
                    url: url
                  }
                });
              }
            });

          case 89:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7O0FBc3lCQTFNLFNBQVMsQ0FBQztFQUFFb0wsYUFBYSxFQUFFckIsTUFBTSxDQUFDcUIsYUFBeEI7RUFBdUN2RixLQUFLLEVBQUxBO0FBQXZDLENBQUQsQ0FBVCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9qcy92aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gVmlld2VyQXBwKFkpIHtcblxuICBZLlZpZXdlciA9IG51bGxcblxuICBZLmlzRnVsbHlMb2FkZWQgPSBmYWxzZVxuXG4gIFkuc2VxbWFwID0ge31cblxuICBZLm5vZGVzID0ge31cblxuICBZLm5vZGVzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcblxuICBZLm5vZGVzLnRodW1ibmFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGh1bWJuYWlscycpXG5cbiAgWS5ub2Rlcy5idXR0b25NZXRhZGF0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuXG4gIFkubm9kZXMucm90YXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtcm90YXRlJylcblxuICBZLm5vZGVzLnBhZ2VtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcblxuICBZLm5vZGVzLm9zZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgWS5ub2Rlcy5kaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyNkaXNwbGF5JylcblxuICBZLm5vZGVzLnRvZ2dsZVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLXBhZ2UnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbC16b29tLW91dCcpXG5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1pbicpXG5cbiAgWS5ub2Rlcy50b2dnbGVMYW5ndWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgLmxhbmd1YWdlJylcblxuICBZLm5vZGVzLm5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLm5leHQnKVxuXG4gIFkubm9kZXMucHJldmlvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLnByZXZpb3VzJylcblxuICBZLm5vZGVzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuXG4gIFkubm9kZXMuc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpICBcblxuICBjb25zdCB7XG4gICAgdmlldywgXG4gICAgc2VxdWVuY2UsIFxuICAgIHNlcXVlbmNlQ291bnQsIFxuICAgIGN1cnJlbnQsXG4gICAgdHlwZVxuICB9ID0gWS5ub2Rlcy5vc2QuZGF0YXNldFxuXG4gIFkuY291bnQgPSBOdW1iZXIoc2VxdWVuY2VDb3VudClcblxuICBmdW5jdGlvbiBwb3N0TWVzc2FnZShmaXJlLCBtZXNzYWdlKSB7XG4gICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7IGZpcmUsIG1lc3NhZ2UgfSksICcqJylcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZXZpZXcocHJvcHMpIHtcbiAgICBjb25zdCB7IHZpZXcgfSA9IHByb3BzLmRhdGFzZXRcbiAgICBpZiAodmlldyA9PSAnc2luZ2xlJykge1xuICAgICAgcHJvcHMuZGF0YXNldC52aWV3ID0gJ2RvdWJsZXBhZ2UnXG4gICAgfSBlbHNlIGlmICh2aWV3ID09ICdkb3VibGVwYWdlJykge1xuICAgICAgcHJvcHMuZGF0YXNldC52aWV3ID0gJ3NpbmdsZSdcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbl9wYWdpbmdfY2xpY2soZSkge1xuICAgIGNvbnN0IGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXRcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAvKiogdGVzdCBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBhY3RpdmUgKi9cbiAgICBpZiAoY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHJldHVybiBmYWxzZVxuICAgIHRyeSB7XG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LmFkZCgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIG9wZXJhdGlvbjogZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQub3BlcmF0aW9uLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZnVsbHNjcmVlbl9vbigpIHtcbiAgICBjb25zdCBkb2NFbG0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBpZiAoYnV0dG9uKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgIH1cbiAgICBpZiAoZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICBkb2NFbG0ucmVxdWVzdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgZG9jRWxtLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b24nLCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb2ZmKCkge1xuICAgIGNvbnN0IHRvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3AnKVxuICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBpZiAodG9wKSB7XG4gICAgICB0b3AuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2UoJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvZmYnLCB7fSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHNlcW1hcChwcm9wcykge1xuICAgIGNvbnN0IHsgY291bnQsIHZpZXcsIHNlcXVlbmNlIH0gPSBwcm9wc1xuICAgIGNvbnN0IHNlcXVlbmNlcyA9IFtdXG4gICAgc3dpdGNoICh2aWV3KSB7XG4gICAgICBjYXNlICdkb3VibGVwYWdlJzpcbiAgICAgICAgY29uc3Qgc2VxID0gTWF0aC5jZWlsKE51bWJlcihjb3VudCkgLyAyKSArIDFcbiAgICAgICAgQXJyYXkoc2VxKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKiAyLCBpbmRleCAqIDIgKyAxIF0pXG4gICAgICAgIH0pXG4gICAgICAgIC8vIFJlbW92ZSAwIGZyb20gZmlyc3QgaW5kZXguXG4gICAgICAgIHNlcXVlbmNlc1swXS5zaGlmdCgpXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBsYXN0IGluZGV4IGRvZXMgbm90IGluY2x1ZGVzIG91dGJvdW5kIHNlcXVlbmNlcy5cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMV0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV0ucG9wKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VxdWVuY2VzW3NlcXVlbmNlcy5sZW5ndGggLSAxXVswXSA+IGNvdW50KSB7XG4gICAgICAgICAgc2VxdWVuY2VzLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsXG4gICAgICAgICAgY291bnQsXG4gICAgICAgICAgdmlldywgICAgICAgICAgXG4gICAgICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlcy5maW5kKHZhbHVlID0+IHZhbHVlLmluY2x1ZGVzKHNlcXVlbmNlKSA9PT0gdHJ1ZSksXG4gICAgICAgIH1cbiAgICAgIGNhc2UgJ3NpbmdsZSc6XG4gICAgICAgIEFycmF5KE51bWJlcihjb3VudCkpLmZpbGwoKS5tYXAoKF8sIGluZGV4KSA9PiB7XG4gICAgICAgICAgc2VxdWVuY2VzLnB1c2goWyBpbmRleCArIDFdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNlcXVlbmNlcywgXG4gICAgICAgICAgY291bnQsXG4gICAgICAgICAgdmlldyxcbiAgICAgICAgICBzZXF1ZW5jZTogWyBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiBOdW1iZXIodmFsdWUpID09PSBOdW1iZXIoc2VxdWVuY2UpKSBdLFxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gbG9hZF9zZXF1ZW5jZShlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9zZCA9IFkubm9kZXMub3NkXG4gICAgICBjb25zdCBkYXRhc2V0ID0gb3NkLmRhdGFzZXRcbiAgICAgIGNvbnN0IHsgb3BlcmF0aW9uLCB0byB9ICA9IGUuZGV0YWlsXG4gICAgICBjb25zdCBmaXJlID0gYHZpZXdlcjpzZXF1ZW5jZToke29wZXJhdGlvbn1gXG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlICdpbmNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgaW5jcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RlY3JlYXNlJzpcbiAgICAgICAgICBhd2FpdCBkZWNyZWFzZShvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnY2hhbmdlJzpcbiAgICAgICAgICBhd2FpdCBjaGFuZ2UodG8sIG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd0b2dnbGV2aWV3JzpcbiAgICAgICAgICB0b2dnbGV2aWV3KG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgLy8gQ29uZmlndXJhdGlvbiBmb3IgdGhlIG5ldyBzZXF1ZW5jZS5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGlkOiBvc2QuaWQsXG4gICAgICAgIHRpdGxlOiBkYXRhc2V0LnRpdGxlLFxuICAgICAgICBjb3VudDogWS5jb3VudCxcbiAgICAgICAgdmlldzogZGF0YXNldC52aWV3LFxuICAgICAgICBjdXJyZW50OiBOdW1iZXIoZGF0YXNldC5jdXJyZW50KSxcbiAgICAgICAgc2VxdWVuY2U6IE51bWJlcihkYXRhc2V0LnNlcXVlbmNlKSxcbiAgICAgICAgaWRlbnRpZmllcjogZGF0YXNldC5pZGVudGlmaWVyLFxuICAgICAgICB1cmk6IGAke2RhdGFzZXQudXJpfS8ke2RhdGFzZXQuc2VxdWVuY2V9YCxcbiAgICAgIH1cblxuICAgICAgWS5zZXFtYXAgPSBhd2FpdCBzZXFtYXAobWVzc2FnZSlcblxuICAgICAgcG9zdE1lc3NhZ2UoeyBmaXJlLCBtZXNzYWdlIH0pXG5cbiAgICAgIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIGRhdGFzZXQpXG5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLnNlcXVlbmNlLmpvaW4oJyAtICcpXG5cbiAgICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChkYXRhc2V0LnNlcXVlbmNlID49IFkuc2VxbWFwLmNvdW50KSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA8PSAxKSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG5cbiAgICAgIHNob3coJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgICAgIHNob3coJyNwYWdlcicpXG5cbiAgICAgIFkuVmlld2VyLm9wZW4odGlsZVNvdXJjZXMpXG5cbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuXG4gICAgICBZLmlzRnVsbHlMb2FkZWQgPSB0cnVlXG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29uKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgIGVsZW1lbnQuY2xvc2VzdCgnLnBhbmUtYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2VtZXRhLWhpZGRlbicpXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgZmlyZTogJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b24nLFxuICAgICAgbWVzc2FnZToge31cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29mZigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICBlbGVtZW50LmNsb3Nlc3QoJy5wYW5lLWJvZHknKS5jbGFzc0xpc3QuYWRkKCdwYWdlbWV0YS1oaWRkZW4nKVxuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgIGZpcmU6ICdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsXG4gICAgICBtZXNzYWdlOiB7fVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiB0aWxlc19sb2FkaW5nKCkge1xuICAgIGlmIChib2R5LmNsYXNzTGlzdC5jb250YWlucygnb3BlbmxheWVycy1sb2FkaW5nJykpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aWxlc19sb2FkaW5nKClcbiAgICAgIH0sIDEwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGUoJy5wYW5lLmxvYWQnKVxuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yKCkge1xuICAgIGlmIChZLmlzRnVsbHlMb2FkZWQpIHtcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgICAgaGlkZSgnLnBhbmUubG9hZCcpXG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGZpcmU6ICd2aWV3ZXI6bG9hZGVkJyxcbiAgICAgICAgbWVzc2FnZToge31cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkX2l0ZW1faGFuZGxlcihldmVudCkge1xuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKDApXG4gICAgY29uc3QgdGlsZWRJbWFnZSA9IGV2ZW50Lml0ZW1cbiAgICB0aWxlZEltYWdlLmFkZEhhbmRsZXIoJ2Z1bGx5LWxvYWRlZC1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdGdWxseUxvYWRlZCA9IGFyZV9hbGxfZnVsbHlfbG9hZGVkKClcbiAgICAgIGlmIChuZXdGdWxseUxvYWRlZCAhPT0gWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICAgIFkuaXNGdWxseUxvYWRlZCA9IG5ld0Z1bGx5TG9hZGVkXG4gICAgICAgIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZV9hbGxfZnVsbHlfbG9hZGVkKCkge1xuICAgIGNvbnN0IGNvdW50ID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUNvdW50KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBZLlZpZXdlci53b3JsZC5nZXRJdGVtQXQoaSlcbiAgICAgIGlmICghdGlsZWRJbWFnZS5nZXRGdWxseUxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gb25faGlkZV90aHVtYm5haWxzX3ZpZXcoKSB7XG4gICAgY29uc3Qgb3NkID0gWS5ub2Rlcy5vc2RcbiAgICBjb25zdCB7IHNlcXVlbmNlQ291bnQsIHNlcXVlbmNlIH0gPSBvc2QuZGF0YXNldFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcblxuICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuICAgIFxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlIDwgc2VxdWVuY2VDb3VudCkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoc2VxdWVuY2UgPiAxKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfSlcblxuICB9XG5cbiAgZnVuY3Rpb24gb25fb3Blbl90aHVtYm5haWxzX3ZpZXcoKSB7XG4gICAgY29uc3QgeyB1cmkgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldFxuICAgIGNvbnN0IHdpZHRoID0gJzIzMCdcbiAgICBjb25zdCBoZWlnaHQgPSAnMTUwJ1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3RodW1ibmFpbHMtdmlldycpXG4gICAgY29uc3Qgem9vbUluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtem9vbS1pbicpXG4gICAgY29uc3Qgem9vbU91dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sLXpvb20tb3V0JylcblxuICAgIHpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIHpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgem9vbUluLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICd0cnVlJylcblxuICAgIHpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB6b29tT3V0LmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB6b29tT3V0LnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICd0cnVlJylcblxuICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2Uuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH1cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGlmIChOdW1iZXIoc3RhdGUpID09PSAwKSB7XG4gICAgICBheGlvcy5nZXQoYCR7dXJpfS90aHVtYm5haWxzP3BqYXg9dHJ1ZSZ3aWR0aD0ke3dpZHRofSZoZWlnaHQ9JHtoZWlnaHR9YCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVzcG9uc2UuZGF0YSwgJ3RleHQvaHRtbCcpXG4gICAgICAgICAgIFkubm9kZXMudGh1bWJuYWlscy5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGRvYy5xdWVyeVNlbGVjdG9yKCcudGh1bWJuYWlscy5jb250YWluZXInKVxuICAgICAgICAgIClcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGh1bWJuYWlscy5jb250YWluZXIgYScpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25UaHVtYm5haWxzQ2xpY2spXG4gICAgICAgICAgfSlcbiAgICAgICAgICBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldC5zdGF0ZSA9IDFcbiAgICAgICAgfVxuICAgICAgICBzaG93KCcjdGh1bWJuYWlscycpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGh1bWJuYWlsc0NsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGJ1dHRvblRodW1ibmFpbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXRodW1ibmFpbHMnKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGlmIChidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICBidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgfVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VxdWVuY2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2xpZGVfdmFsdWVfY2hhbmdlKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcbiAgICAgICAgICB0cmlnZ2VyOiAnY2hhbmdlJyxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHRvID0gTWF0aC5taW4oLi4uWS5zZXFtYXAuc2VxdWVuY2UpIC0gMVxuICAgIGlmICh0byA8IDEpIHtcbiAgICAgIHJldHVybiB0b1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gY2hhbmdlKHRvLCBwcm9wcykge1xuICAgIGNvbnN0IHsgc2VxdWVuY2VDb3VudCB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGNvbnN0IHNlcXVlbmNlID0gTnVtYmVyKHRvKVxuICAgIGNvbnN0IHNlcXVlbmNlX2NvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG4gICAgaWYgKHNlcXVlbmNlIDwgMSkge1xuICAgICAgcmV0dXJuIDFcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlID4gc2VxdWVuY2VfY291bnQpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZV9jb3VudFxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gc2VxdWVuY2UudG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50VHlwZSwgY2hpbGRTZWxlY3RvciwgZXZlbnRIYW5kbGVyKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50T25FbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGV2ZW50T25FbGVtZW50LnRhcmdldC5tYXRjaGVzKGNoaWxkU2VsZWN0b3IpKSB7XG4gICAgICAgICAgZXZlbnRIYW5kbGVyKGV2ZW50T25FbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGUoc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICAgIGVsbS5oZWlnaHQgPSAwXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGluY3JlYXNlKHByb3BzKSB7XG4gICAgY29uc3Qge1xuICAgICAgc2VxdWVuY2VDb3VudFxuICAgIH0gPSBwcm9wcy5kYXRhc2V0XG5cbiAgICBjb25zdCB0byA9IE1hdGgubWF4KC4uLlkuc2VxbWFwLnNlcXVlbmNlKSArIDFcbiAgICBcbiAgICBpZiAodG8gPiBOdW1iZXIoc2VxdWVuY2VDb3VudCkpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZUNvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSB0by50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzaG93KHNlbGVjdG9yKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaChlbG0gPT4ge1xuICAgICAgZWxtLnN0eWxlLmRpc3BsYXkgPSBudWxsXG4gICAgICBlbG0uc3R5bGUudmlzaWJpbGl0eSA9IG51bGxcbiAgICAgIGVsbS5oaWRkZW4gPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHRpbGVzKHNlcW1hcCwgZGF0YXNldCkge1xuICAgIHJldHVybiBzZXFtYXAuc2VxdWVuY2UubWFwKChzZXF1ZW5jZSwgeCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGlsZVNvdXJjZTogYCR7ZGF0YXNldC5zZXJ2aWNlfS8ke2RhdGFzZXQudHlwZX0vJHtkYXRhc2V0LmlkZW50aWZpZXJ9LyR7c2VxdWVuY2V9L2luZm8uanNvbmAsIHhcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoJ3ZpZXdlcjppbml0Jywge30pXG5cbiAgcG9zdE1lc3NhZ2UoJ3ZpZXdlcjpjb250ZW50cmVhZHknLCB7fSlcblxuICAvLyBDYWxscyB0aWxlcyBsb2FkaW5nLlxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBDdXN0b21FdmVudCgndmlld2VyOmNvbnRlbnRyZWFkeScpXG4gIClcblxuICBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlICYmIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgIH1cbiAgfVxuXG4gIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKHsgY291bnQ6IFkuY291bnQsIHZpZXcsIHNlcXVlbmNlLCBjdXJyZW50IH0pXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnRfcGFnZScpLnRleHRDb250ZW50ID0gXG4gICAgWS5ub2Rlcy5vc2QuZGF0YXNldC5zZXF1ZW5jZSA9IHNlcXVlbmNlXG4gIFxuICBpZiAoWS5ub2Rlcy5zbGlkZXIpIHtcbiAgICBZLm5vZGVzLnNsaWRlci52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cbiAgXG4gIGlmIChZLm5vZGVzLnNsaWRlcl92YWx1ZSkge1xuICAgIFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlID0gc2VxdWVuY2VcbiAgfVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXF1ZW5jZV9jb3VudCcpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLmNvdW50XG4gIH0pXG5cbiAgY29uc3QgdGlsZVNvdXJjZXMgPSBhd2FpdCB0aWxlcyhZLnNlcW1hcCwgWS5ub2Rlcy5vc2QuZGF0YXNldClcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGlkOiBZLm5vZGVzLm9zZC5pZCxcbiAgICBwcmVzZXJ2ZVZpZXdwb3J0OiB0cnVlLFxuICAgIHNob3dOYXZpZ2F0aW9uQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd1pvb21Db250cm9sOiBmYWxzZSxcbiAgICBzaG93SG9tZUNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dGdWxsUGFnZUNvbnRyb2w6IGZhbHNlLFxuICAgIHZpc2liaWxpdHlSYXRpbzogMSxcbiAgICBtaW5ab29tTGV2ZWw6IDAsXG4gICAgZGVmYXVsdFpvb21MZXZlbDogMCxcbiAgICBzZXF1ZW5jZU1vZGU6IGZhbHNlLFxuICAgIHRpbGVTb3VyY2VzOiB0aWxlU291cmNlcyxcbiAgfVxuXG4gIGlmICh0eXBlID09ICdtYXBzJykge1xuICAgIG9wdGlvbnMuc2hvd05hdmlnYXRvciA9IHRydWVcbiAgfVxuXG4gIFkuVmlld2VyID0gWS5PcGVuU2VhZHJhZ29uKG9wdGlvbnMpXG5cbiAgLy8gT3BlblNlYWRyYWdvbiBldmVudC5cbiAgWS5WaWV3ZXIud29ybGQuYWRkSGFuZGxlcignYWRkLWl0ZW0nLCBhZGRfaXRlbV9oYW5kbGVyKVxuXG4gIC8vIE9wZW5TZWFkcmFnb24gZXZlbnQuXG4gIFkuVmlld2VyLmFkZEhhbmRsZXIoJ3pvb20nLCAoKSA9PiB7XG5cbiAgICBpZiAoWS5ub2Rlcy5vc2QuaGlkZGVuKSByZXR1cm5cblxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA8IG1heFpvb20gJiZcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJylcbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tID49IG1heFpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tIDw9IG1pblpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPiBtaW5ab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgfSlcblxuICBjb25zdCBmb3JtU2VxdWVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZm9ybS11cGRhdGUtc2VxdWVuY2UnKVxuICBpZiAoZm9ybVNlcXVlbmNlICYmIFkubm9kZXMuc2xpZGVyX3ZhbHVlKSB7XG4gICAgZm9ybVNlcXVlbmNlLm9uc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgICAgdG86IFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlLFxuICAgICAgICAgICAgdHJpZ2dlcjogJ29uc3VibWl0JyxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBpbiBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb21UbyA9IGFjdHVhbFpvb20gKiAyXG4gICAgaWYgKGFjdHVhbFpvb20gPCBtYXhab29tKSB7XG4gICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8oem9vbVRvKVxuICAgIH1cbiAgICAvLyBsb29rIGZvciBldmVudCBvcHRpb25zIChPcGVuU2VhRHJhZ29uIHpvb20gZW5kKVxuICAgIGlmICh6b29tVG8gPj0gbWF4Wm9vbSkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9XG4gICAgaWYgKGFjdHVhbFpvb20gPiBtaW5ab29tKSB7XG4gICAgICBpZiAoWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcbiAgICBjb25zdCB6b29tID0gYWN0dWFsWm9vbSAvIDJcbiAgICBpZiAoem9vbSA+PSBtaW5ab29tKSB7XG4gICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8oem9vbSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGFjdHVhbFpvb20gPiBtaW5ab29tKSB7XG4gICAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21UbyhtaW5ab29tKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gb3V0IGNsaWNrIGV2ZW50LlxuICBZLm5vZGVzLnJvdGF0ZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBZLlZpZXdlci52aWV3cG9ydC5zZXRSb3RhdGlvbihZLlZpZXdlci52aWV3cG9ydC5kZWdyZWVzICsgOTApXG4gIH1cblxuICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgWS5ub2Rlcy50b2dnbGVQYWdlLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBpZiAoZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkgcmV0dXJuIGZhbHNlXG4gICAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kb3VibGUnKSkge1xuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1kb3VibGUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLXNpbmdsZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLWRvdWJsZScpXG4gICAgICB9XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYS5wYWdpbmcnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbl9wYWdpbmdfY2xpY2spXG4gIH0pXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYS5idXR0b24nKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGNvbnN0IGN1cnJlbnRfdGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldFxuICAgICAgbGV0IGV2ZW50X3ByZWZpeCA9IGBidXR0b246JHtjdXJyZW50X3RhcmdldC5pZH1gXG4gICAgICAvKiogZG9uJ3Qgd2FzdGUgdGltZSBpZiB0aGUgYnV0dG9uIGlzIGluYWN0aXZlICovXG4gICAgICBpZiAoY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGAke2V2ZW50X3ByZWZpeH06b2ZmYCwgZXZlbnQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvbicpXG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ29mZicpXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGAke2V2ZW50X3ByZWZpeH06b25gLCBldmVudClcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGAke2V2ZW50X3ByZWZpeH06dG9nZ2xlYCwgZXZlbnQpXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICBpZiAoWS5ub2Rlcy5zbGlkZXIpIHtcbiAgICBZLm5vZGVzLnNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzbGlkZV92YWx1ZV9jaGFuZ2UpXG4gIH0gIFxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQ6c2VxdWVuY2UnLCBsb2FkX3NlcXVlbmNlKVxuXG4gIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKSA9PiB7XG4gICAgLy8gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAvLyAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAvLyAgICAgZGV0YWlsOiB7XG4gICAgLy8gICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAvLyAgICAgICB0bzogaGlzdG9yeS5zdGF0ZS5zZXF1ZW5jZSxcbiAgICAvLyAgICAgICB0cmlnZ2VyOiAncG9wc3RhdGUnLFxuICAgIC8vICAgICB9XG4gICAgLy8gICB9KVxuICAgIC8vIClcbiAgLy8gfSlcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9uJywgb25fYnV0dG9uX21ldGFkYXRhX29uKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b2ZmJywgb25fYnV0dG9uX21ldGFkYXRhX29mZilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b24nLCBmdWxsc2NyZWVuX29uKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvZmYnLCBmdWxsc2NyZWVuX29mZilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aWV3ZXI6Y29udGVudHJlYWR5JywgdGlsZXNfbG9hZGluZylcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLXRodW1ibmFpbHM6b24nLCBvbl9vcGVuX3RodW1ibmFpbHNfdmlldylcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLXRodW1ibmFpbHM6b2ZmJywgb25faGlkZV90aHVtYm5haWxzX3ZpZXcpXG5cbiAgLy8gTGFuZ3VhZ2UuXG4gIGRlbGVnYXRlKCdib2R5JywgJ2NoYW5nZScsICcubGFuZy1vcHRpb25zIHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGF4aW9zLmdldChjdXJyZW50X3RhcmdldC52YWx1ZSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpXG4gICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVzcG9uc2UuZGF0YSwgJ3RleHQvaHRtbCcpXG4gICAgICAgIGNvbnN0IHBhbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlldy1tb2RlLW1ldGFkYXRhJylcbiAgICAgICAgY29uc3QgcGFnZW1ldGEgPSBkb2MucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZS5tYWluJylcbiAgICAgICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKVxuICAgICAgICBodG1sLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIG1haW4uZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBwYW5lLmlubmVySFRNTCA9IHBhZ2VtZXRhLmlubmVySFRNTFxuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVm9sdW1lLlxuICBkZWxlZ2F0ZSgnYm9keScsICdjaGFuZ2UnLCAnLnZpZXctbXYgc2VsZWN0JywgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRfdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gICAgY29uc3QgdmFsdWUgPSBjdXJyZW50X3RhcmdldC52YWx1ZVxuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm9kZS1kbHRzLWJvb2snKVxuICAgIGNvbnN0IGxhbmcgPSBub2RlLmRhdGFzZXQubGFuZ1xuICAgIGNvbnN0IHVybCA9IHZhbHVlLnN1YnN0cmluZyh2YWx1ZS5pbmRleE9mKCc6OicpICsgMiwgdmFsdWUubGVuZ3RoKSArICcvMT9sYW5nPScgKyBsYW5nXG4gICAgaWYgKHdpbmRvdy5zZWxmID09PSB3aW5kb3cudG9wKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVybClcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBmaXJlOiAnY2hhbmdlOm9wdGlvbjptdWx0aXZvbHVtZScsXG4gICAgICAgIG1lc3NhZ2U6IHsgdXJsIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG59XG5cblZpZXdlckFwcCh7IE9wZW5TZWFkcmFnb246IHdpbmRvdy5PcGVuU2VhZHJhZ29uLCBheGlvcyB9KVxuIl0sIm5hbWVzIjpbIlZpZXdlckFwcCIsIlkiLCJwb3N0TWVzc2FnZSIsInRvZ2dsZXZpZXciLCJvbl9wYWdpbmdfY2xpY2siLCJmdWxsc2NyZWVuX29uIiwiZnVsbHNjcmVlbl9vZmYiLCJzZXFtYXAiLCJsb2FkX3NlcXVlbmNlIiwib25fYnV0dG9uX21ldGFkYXRhX29uIiwib25fYnV0dG9uX21ldGFkYXRhX29mZiIsInRpbGVzX2xvYWRpbmciLCJ1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IiLCJhZGRfaXRlbV9oYW5kbGVyIiwiYXJlX2FsbF9mdWxseV9sb2FkZWQiLCJvbl9oaWRlX3RodW1ibmFpbHNfdmlldyIsIm9uX29wZW5fdGh1bWJuYWlsc192aWV3Iiwib25UaHVtYm5haWxzQ2xpY2siLCJzbGlkZV92YWx1ZV9jaGFuZ2UiLCJkZWNyZWFzZSIsImNoYW5nZSIsImRlbGVnYXRlIiwiaGlkZSIsImluY3JlYXNlIiwic2hvdyIsInRpbGVzIiwiZGF0YXNldCIsInNlcXVlbmNlIiwibWFwIiwieCIsInRpbGVTb3VyY2UiLCJzZXJ2aWNlIiwidHlwZSIsImlkZW50aWZpZXIiLCJzZWxlY3RvciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJlbG0iLCJzdHlsZSIsImRpc3BsYXkiLCJ2aXNpYmlsaXR5IiwiaGlkZGVuIiwicHJvcHMiLCJzZXF1ZW5jZUNvdW50IiwidG8iLCJNYXRoIiwibWF4IiwiTnVtYmVyIiwidG9TdHJpbmciLCJyYW5nZV93ZWlnaHQiLCJxdWVyeVNlbGVjdG9yIiwic2xpZGVyX3ZhbHVlIiwidmFsdWUiLCJoZWlnaHQiLCJldmVudFR5cGUiLCJjaGlsZFNlbGVjdG9yIiwiZXZlbnRIYW5kbGVyIiwiZWxlbWVudHMiLCJlbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50T25FbGVtZW50IiwidGFyZ2V0IiwibWF0Y2hlcyIsInNlcXVlbmNlX2NvdW50IiwibWluIiwiZXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJvcGVyYXRpb24iLCJjdXJyZW50VGFyZ2V0IiwidHJpZ2dlciIsInByZXZlbnREZWZhdWx0IiwiYnV0dG9uVGh1bWJuYWlscyIsImdldEVsZW1lbnRCeUlkIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiY29udGFpbnMiLCJhZGQiLCJ1cmkiLCJub2RlcyIsIm9zZCIsInN0YXRlIiwidGh1bWJuYWlscyIsIndpZHRoIiwiem9vbUluIiwiem9vbU91dCIsInNldEF0dHJpYnV0ZSIsInRvZ2dsZVBhZ2UiLCJuZXh0IiwiaXRlbSIsInByZXZpb3VzIiwiYXhpb3MiLCJnZXQiLCJ0aGVuIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJwYXJzZXIiLCJET01QYXJzZXIiLCJkb2MiLCJwYXJzZUZyb21TdHJpbmciLCJkYXRhIiwiYXBwZW5kQ2hpbGQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJjb3VudCIsIlZpZXdlciIsIndvcmxkIiwiZ2V0SXRlbUNvdW50IiwiaSIsInRpbGVkSW1hZ2UiLCJnZXRJdGVtQXQiLCJnZXRGdWxseUxvYWRlZCIsInZpZXdwb3J0Iiwic2V0Um90YXRpb24iLCJhZGRIYW5kbGVyIiwibmV3RnVsbHlMb2FkZWQiLCJpc0Z1bGx5TG9hZGVkIiwiYm9keSIsImZpcmUiLCJtZXNzYWdlIiwic2V0VGltZW91dCIsImJ1dHRvbiIsImNsb3Nlc3QiLCJlIiwiaWQiLCJ0aXRsZSIsInZpZXciLCJjdXJyZW50IiwidGlsZVNvdXJjZXMiLCJ0ZXh0Q29udGVudCIsImpvaW4iLCJvcGVuIiwic2VxdWVuY2VzIiwic2VxIiwiY2VpbCIsIkFycmF5IiwiZmlsbCIsIl8iLCJpbmRleCIsInB1c2giLCJzaGlmdCIsImxlbmd0aCIsInBvcCIsImZpbmQiLCJpbmNsdWRlcyIsInRvcCIsImV4aXRGdWxsc2NyZWVuIiwibXNFeGl0RnVsbHNjcmVlbiIsIm1vekNhbmNlbEZ1bGxTY3JlZW4iLCJ3ZWJraXRDYW5jZWxGdWxsU2NyZWVuIiwiZG9jRWxtIiwiZG9jdW1lbnRFbGVtZW50IiwicmVxdWVzdEZ1bGxzY3JlZW4iLCJtc1JlcXVlc3RGdWxsc2NyZWVuIiwibW96UmVxdWVzdEZ1bGxTY3JlZW4iLCJ3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiIsIndpbmRvdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJidXR0b25NZXRhZGF0YSIsInJvdGF0ZSIsInBhZ2VtZXRhIiwiY29udHJvbFpvb21PdXQiLCJjb250cm9sWm9vbUluIiwidG9nZ2xlTGFuZ3VhZ2UiLCJzbGlkZXIiLCJvcHRpb25zIiwicHJlc2VydmVWaWV3cG9ydCIsInNob3dOYXZpZ2F0aW9uQ29udHJvbCIsInNob3dab29tQ29udHJvbCIsInNob3dIb21lQ29udHJvbCIsInNob3dGdWxsUGFnZUNvbnRyb2wiLCJ2aXNpYmlsaXR5UmF0aW8iLCJtaW5ab29tTGV2ZWwiLCJkZWZhdWx0Wm9vbUxldmVsIiwic2VxdWVuY2VNb2RlIiwic2hvd05hdmlnYXRvciIsIk9wZW5TZWFkcmFnb24iLCJhY3R1YWxab29tIiwiZ2V0Wm9vbSIsIm1heFpvb20iLCJnZXRNYXhab29tIiwibWluWm9vbSIsImdldE1pblpvb20iLCJmb3JtU2VxdWVuY2UiLCJvbnN1Ym1pdCIsIm9uY2xpY2siLCJ6b29tVG8iLCJ6b29tIiwiZGVncmVlcyIsImN1cnJlbnRfdGFyZ2V0IiwiZXZlbnRfcHJlZml4IiwicGFuZSIsIm1haW4iLCJodG1sIiwiZGlyIiwiaW5uZXJIVE1MIiwibm9kZSIsImxhbmciLCJ1cmwiLCJzdWJzdHJpbmciLCJpbmRleE9mIiwic2VsZiIsImxvY2F0aW9uIiwiYXNzaWduIl0sInNvdXJjZVJvb3QiOiIifQ==