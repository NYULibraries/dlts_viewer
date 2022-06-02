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
            }); // up arrow (or i) - nudge up

            Y.keyboardJS.bind(['i', 'up'], function () {
              console.log(['i', 'up']);
            }); // down arrow (or m) - nudge down

            Y.keyboardJS.bind(['m', 'down'], function () {
              console.log(['m', 'down']);
            }); // right arrow (or k) - nudge right

            Y.keyboardJS.bind(['k', 'right'], function () {
              console.log(['k', 'right']);
            }); // left arrow (or j) - nudge left

            Y.keyboardJS.bind(['j', 'left'], function () {
              console.log(['j', 'left']);
            }); // shift + right (or shift + k) - load page to the right of this one (previous or next depending13 on language)

            Y.keyboardJS.bind(['shift + right', 'shift + k'], function () {
              console.log(['shift + right', 'shift + k']);
            }); // shift + left (or shift + j) - load page to the left of this one (previous or next depending on language)

            Y.keyboardJS.bind(['shift + left', 'shift + j'], function () {
              console.log(['shift + left', 'shift + j']);
            }); // shift + up arrow (or shift + i) - zoom in one level

            Y.keyboardJS.bind(['shift + up', 'shift + i'], function () {
              console.log(['shift + up', 'shift + i']);
            }); // shift + down (or shift + m) - zoom out one level

            Y.keyboardJS.bind(['shift + down', 'shift + m'], function () {
              console.log(['shift + down', 'shift + m']);
            }); // 1 - zoom to fit in window

            Y.keyboardJS.bind(['1'], function () {
              console.log(['1']);
            }); // / or ? - show/hide help

            Y.keyboardJS.bind(['/', '?'], function () {
              console.log(['/', '?']);
            }); // / spacebar - show/hide metadata panel  

            Y.keyboardJS.bind(['spacebar'], function () {
              console.log('spacebar');
            });

          case 100:
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
  axios: axios,
  keyboardJS: keyboardJS
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFELENBQVQsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RsdHNfdmlld2VyLy4vanMvdmlld2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIFZpZXdlckFwcChZKSB7XG5cbiAgWS5WaWV3ZXIgPSBudWxsXG5cbiAgWS5pc0Z1bGx5TG9hZGVkID0gZmFsc2VcblxuICBZLnNlcW1hcCA9IHt9XG5cbiAgWS5ub2RlcyA9IHt9XG5cbiAgWS5ub2Rlcy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXG5cbiAgWS5ub2Rlcy50aHVtYm5haWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RodW1ibmFpbHMnKVxuXG4gIFkubm9kZXMuYnV0dG9uTWV0YWRhdGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcblxuICBZLm5vZGVzLnJvdGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sLXJvdGF0ZScpXG5cbiAgWS5ub2Rlcy5wYWdlbWV0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG5cbiAgWS5ub2Rlcy5vc2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3BlbnNlYWRyYWdvbjEnKVxuXG4gIFkubm9kZXMuZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcjZGlzcGxheScpXG5cbiAgWS5ub2Rlcy50b2dnbGVQYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1wYWdlJylcblxuICBZLm5vZGVzLmNvbnRyb2xab29tT3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1vdXQnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21JbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250cm9sLXpvb20taW4nKVxuXG4gIFkubm9kZXMudG9nZ2xlTGFuZ3VhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5IC5sYW5ndWFnZScpXG5cbiAgWS5ub2Rlcy5uZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5uZXh0JylcblxuICBZLm5vZGVzLnByZXZpb3VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5wcmV2aW91cycpXG5cbiAgWS5ub2Rlcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcblxuICBZLm5vZGVzLnNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKSAgXG5cbiAgY29uc3Qge1xuICAgIHZpZXcsIFxuICAgIHNlcXVlbmNlLCBcbiAgICBzZXF1ZW5jZUNvdW50LCBcbiAgICBjdXJyZW50LFxuICAgIHR5cGVcbiAgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcblxuICBZLmNvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG5cbiAgZnVuY3Rpb24gcG9zdE1lc3NhZ2UoZmlyZSwgbWVzc2FnZSkge1xuICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBmaXJlLCBtZXNzYWdlIH0pLCAnKicpXG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGV2aWV3KHByb3BzKSB7XG4gICAgY29uc3QgeyB2aWV3IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgaWYgKHZpZXcgPT0gJ3NpbmdsZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdkb3VibGVwYWdlJ1xuICAgIH0gZWxzZSBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdzaW5nbGUnXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fcGFnaW5nX2NsaWNrKGUpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgLyoqIHRlc3QgaWYgdGhlIHRhcmdldCBpcyBub3QgYWN0aXZlICovXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICB0cnkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb24oKSB7XG4gICAgY29uc3QgZG9jRWxtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICB9XG4gICAgaWYgKGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywge30pXG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29mZigpIHtcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgdG9wLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywge30pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzZXFtYXAocHJvcHMpIHtcbiAgICBjb25zdCB7IGNvdW50LCB2aWV3LCBzZXF1ZW5jZSB9ID0gcHJvcHNcbiAgICBjb25zdCBzZXF1ZW5jZXMgPSBbXVxuICAgIHN3aXRjaCAodmlldykge1xuICAgICAgY2FzZSAnZG91YmxlcGFnZSc6XG4gICAgICAgIGNvbnN0IHNlcSA9IE1hdGguY2VpbChOdW1iZXIoY291bnQpIC8gMikgKyAxXG4gICAgICAgIEFycmF5KHNlcSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICogMiwgaW5kZXggKiAyICsgMSBdKVxuICAgICAgICB9KVxuICAgICAgICAvLyBSZW1vdmUgMCBmcm9tIGZpcnN0IGluZGV4LlxuICAgICAgICBzZXF1ZW5jZXNbMF0uc2hpZnQoKVxuICAgICAgICAvLyBNYWtlIHN1cmUgbGFzdCBpbmRleCBkb2VzIG5vdCBpbmNsdWRlcyBvdXRib3VuZCBzZXF1ZW5jZXMuXG4gICAgICAgIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzFdID4gY291bnQpIHtcbiAgICAgICAgICBzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMF0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlcy5wb3AoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VxdWVuY2VzLFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsICAgICAgICAgIFxuICAgICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiB2YWx1ZS5pbmNsdWRlcyhzZXF1ZW5jZSkgPT09IHRydWUpLFxuICAgICAgICB9XG4gICAgICBjYXNlICdzaW5nbGUnOlxuICAgICAgICBBcnJheShOdW1iZXIoY291bnQpKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKyAxXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsIFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsXG4gICAgICAgICAgc2VxdWVuY2U6IFsgc2VxdWVuY2VzLmZpbmQodmFsdWUgPT4gTnVtYmVyKHZhbHVlKSA9PT0gTnVtYmVyKHNlcXVlbmNlKSkgXSxcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRfc2VxdWVuY2UoZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuICAgICAgY29uc3QgZGF0YXNldCA9IG9zZC5kYXRhc2V0XG4gICAgICBjb25zdCB7IG9wZXJhdGlvbiwgdG8gfSAgPSBlLmRldGFpbFxuICAgICAgY29uc3QgZmlyZSA9IGB2aWV3ZXI6c2VxdWVuY2U6JHtvcGVyYXRpb259YFxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSAnaW5jcmVhc2UnOlxuICAgICAgICAgIGF3YWl0IGluY3JlYXNlKG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdkZWNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgZGVjcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgYXdhaXQgY2hhbmdlKHRvLCBvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndG9nZ2xldmlldyc6XG4gICAgICAgICAgdG9nZ2xldmlldyhvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIC8vIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBuZXcgc2VxdWVuY2UuXG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICBpZDogb3NkLmlkLFxuICAgICAgICB0aXRsZTogZGF0YXNldC50aXRsZSxcbiAgICAgICAgY291bnQ6IFkuY291bnQsXG4gICAgICAgIHZpZXc6IGRhdGFzZXQudmlldyxcbiAgICAgICAgY3VycmVudDogTnVtYmVyKGRhdGFzZXQuY3VycmVudCksXG4gICAgICAgIHNlcXVlbmNlOiBOdW1iZXIoZGF0YXNldC5zZXF1ZW5jZSksXG4gICAgICAgIGlkZW50aWZpZXI6IGRhdGFzZXQuaWRlbnRpZmllcixcbiAgICAgICAgdXJpOiBgJHtkYXRhc2V0LnVyaX0vJHtkYXRhc2V0LnNlcXVlbmNlfWAsXG4gICAgICB9XG5cbiAgICAgIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKG1lc3NhZ2UpXG5cbiAgICAgIHBvc3RNZXNzYWdlKHsgZmlyZSwgbWVzc2FnZSB9KVxuXG4gICAgICBjb25zdCB0aWxlU291cmNlcyA9IGF3YWl0IHRpbGVzKFkuc2VxbWFwLCBkYXRhc2V0KVxuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudF9wYWdlJykudGV4dENvbnRlbnQgPSBZLnNlcW1hcC5zZXF1ZW5jZS5qb2luKCcgLSAnKVxuXG4gICAgICBZLm5vZGVzLm5leHQuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA+PSBZLnNlcW1hcC5jb3VudCkge1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGRhdGFzZXQuc2VxdWVuY2UgPD0gMSkge1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBUb2dnbGUgdmlldyBvZiBib29rcyBwYWdlIGljb24uXG4gICAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICBzaG93KCcjb3BlbnNlYWRyYWdvbjEnKVxuXG4gICAgICBzaG93KCcjcGFnZXInKVxuXG4gICAgICBZLlZpZXdlci5vcGVuKHRpbGVTb3VyY2VzKVxuXG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcblxuICAgICAgWS5pc0Z1bGx5TG9hZGVkID0gdHJ1ZVxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vbigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29mZicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29uJylcbiAgICBlbGVtZW50LmNsb3Nlc3QoJy5wYW5lLWJvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlbWV0YS1oaWRkZW4nKVxuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgIGZpcmU6ICdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9uJyxcbiAgICAgIG1lc3NhZ2U6IHt9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgZWxlbWVudC5jbG9zZXN0KCcucGFuZS1ib2R5JykuY2xhc3NMaXN0LmFkZCgncGFnZW1ldGEtaGlkZGVuJylcbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICBmaXJlOiAnYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvZmYnLFxuICAgICAgbWVzc2FnZToge31cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gdGlsZXNfbG9hZGluZygpIHtcbiAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW5sYXllcnMtbG9hZGluZycpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGlsZXNfbG9hZGluZygpXG4gICAgICB9LCAxMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWRlKCcucGFuZS5sb2FkJylcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpIHtcbiAgICBpZiAoWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICAgIGhpZGUoJy5wYW5lLmxvYWQnKVxuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBmaXJlOiAndmlld2VyOmxvYWRlZCcsXG4gICAgICAgIG1lc3NhZ2U6IHt9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZF9pdGVtX2hhbmRsZXIoZXZlbnQpIHtcbiAgICBZLlZpZXdlci52aWV3cG9ydC5zZXRSb3RhdGlvbigwKVxuICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBldmVudC5pdGVtXG4gICAgdGlsZWRJbWFnZS5hZGRIYW5kbGVyKCdmdWxseS1sb2FkZWQtY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbmV3RnVsbHlMb2FkZWQgPSBhcmVfYWxsX2Z1bGx5X2xvYWRlZCgpXG4gICAgICBpZiAobmV3RnVsbHlMb2FkZWQgIT09IFkuaXNGdWxseUxvYWRlZCkge1xuICAgICAgICBZLmlzRnVsbHlMb2FkZWQgPSBuZXdGdWxseUxvYWRlZFxuICAgICAgICB1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBhcmVfYWxsX2Z1bGx5X2xvYWRlZCgpIHtcbiAgICBjb25zdCBjb3VudCA9IFkuVmlld2VyLndvcmxkLmdldEl0ZW1Db3VudCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCB0aWxlZEltYWdlID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUF0KGkpXG4gICAgICBpZiAoIXRpbGVkSW1hZ2UuZ2V0RnVsbHlMb2FkZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KCkge1xuICAgIGNvbnN0IG9zZCA9IFkubm9kZXMub3NkXG4gICAgY29uc3QgeyBzZXF1ZW5jZUNvdW50LCBzZXF1ZW5jZSB9ID0gb3NkLmRhdGFzZXRcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LnJlbW92ZSgndGh1bWJuYWlscy12aWV3JylcbiAgICBoaWRlKCcjdGh1bWJuYWlscycpXG5cbiAgICAvLyBUb2dnbGUgdmlldyBvZiBib29rcyBwYWdlIGljb24uXG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cbiAgICBcbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChzZXF1ZW5jZSA8IHNlcXVlbmNlQ291bnQpIHtcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgWS5ub2Rlcy5wcmV2aW91cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlID4gMSkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX29wZW5fdGh1bWJuYWlsc192aWV3KCkge1xuICAgIGNvbnN0IHsgdXJpIH0gPSBZLm5vZGVzLm9zZC5kYXRhc2V0XG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gWS5ub2Rlcy50aHVtYm5haWxzLmRhdGFzZXRcbiAgICBjb25zdCB3aWR0aCA9ICcyMzAnXG4gICAgY29uc3QgaGVpZ2h0ID0gJzE1MCdcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QuYWRkKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGNvbnN0IHpvb21JbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sLXpvb20taW4nKVxuICAgIGNvbnN0IHpvb21PdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udHJvbC16b29tLW91dCcpXG5cbiAgICB6b29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB6b29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIHpvb21Jbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG5cbiAgICB6b29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgem9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgem9vbU91dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG5cbiAgICAvLyBUb2dnbGUgdmlldyBvZiBib29rcyBwYWdlIGljb24uXG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICd0cnVlJylcbiAgICB9XG4gICAgWS5ub2Rlcy5uZXh0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpZiAoTnVtYmVyKHN0YXRlKSA9PT0gMCkge1xuICAgICAgYXhpb3MuZ2V0KGAke3VyaX0vdGh1bWJuYWlscz9wamF4PXRydWUmd2lkdGg9JHt3aWR0aH0maGVpZ2h0PSR7aGVpZ2h0fWApLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcbiAgICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICAgICBZLm5vZGVzLnRodW1ibmFpbHMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBkb2MucXVlcnlTZWxlY3RvcignLnRodW1ibmFpbHMuY29udGFpbmVyJylcbiAgICAgICAgICApXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRodW1ibmFpbHMuY29udGFpbmVyIGEnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVGh1bWJuYWlsc0NsaWNrKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgWS5ub2Rlcy50aHVtYm5haWxzLmRhdGFzZXQuc3RhdGUgPSAxXG4gICAgICAgIH1cbiAgICAgICAgc2hvdygnI3RodW1ibmFpbHMnKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblRodW1ibmFpbHNDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zdCBidXR0b25UaHVtYm5haWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi10aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LnJlbW92ZSgndGh1bWJuYWlscy12aWV3JylcbiAgICBpZiAoYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgIGJ1dHRvblRodW1ibmFpbHMuY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgIH1cbiAgICBoaWRlKCcjdGh1bWJuYWlscycpXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnNlcXVlbmNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNsaWRlX3ZhbHVlX2NoYW5nZShldmVudCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgdG86IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUsXG4gICAgICAgICAgdHJpZ2dlcjogJ2NoYW5nZScsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGVjcmVhc2UocHJvcHMpIHtcbiAgICBjb25zdCB0byA9IE1hdGgubWluKC4uLlkuc2VxbWFwLnNlcXVlbmNlKSAtIDFcbiAgICBpZiAodG8gPCAxKSB7XG4gICAgICByZXR1cm4gdG9cbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcHMuZGF0YXNldC5zZXF1ZW5jZSA9IHRvLnRvU3RyaW5nKClcbiAgICAgIGNvbnN0IHJhbmdlX3dlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuICAgICAgY29uc3Qgc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG4gICAgICBpZiAocmFuZ2Vfd2VpZ2h0ICYmIHNsaWRlcl92YWx1ZSkge1xuICAgICAgICByYW5nZV93ZWlnaHQudmFsdWUgPSB0b1xuICAgICAgICBzbGlkZXJfdmFsdWUudmFsdWUgPSB0b1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNoYW5nZSh0bywgcHJvcHMpIHtcbiAgICBjb25zdCB7IHNlcXVlbmNlQ291bnQgfSA9IHByb3BzLmRhdGFzZXRcbiAgICBjb25zdCBzZXF1ZW5jZSA9IE51bWJlcih0bylcbiAgICBjb25zdCBzZXF1ZW5jZV9jb3VudCA9IE51bWJlcihzZXF1ZW5jZUNvdW50KVxuICAgIGlmIChzZXF1ZW5jZSA8IDEpIHtcbiAgICAgIHJldHVybiAxXG4gICAgfSBlbHNlIGlmIChzZXF1ZW5jZSA+IHNlcXVlbmNlX2NvdW50KSB7XG4gICAgICByZXR1cm4gc2VxdWVuY2VfY291bnRcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcHMuZGF0YXNldC5zZXF1ZW5jZSA9IHNlcXVlbmNlLnRvU3RyaW5nKClcbiAgICAgIGNvbnN0IHJhbmdlX3dlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuICAgICAgY29uc3Qgc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG4gICAgICBpZiAocmFuZ2Vfd2VpZ2h0ICYmIHNsaWRlcl92YWx1ZSkge1xuICAgICAgICByYW5nZV93ZWlnaHQudmFsdWUgPSB0b1xuICAgICAgICBzbGlkZXJfdmFsdWUudmFsdWUgPSB0b1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBldmVudFR5cGUsIGNoaWxkU2VsZWN0b3IsIGV2ZW50SGFuZGxlcikge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudE9uRWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChldmVudE9uRWxlbWVudC50YXJnZXQubWF0Y2hlcyhjaGlsZFNlbGVjdG9yKSkge1xuICAgICAgICAgIGV2ZW50SGFuZGxlcihldmVudE9uRWxlbWVudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoaWRlKHNlbGVjdG9yKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaChlbG0gPT4ge1xuICAgICAgZWxtLnN0eWxlLmRpc3BsYXkgPSBudWxsXG4gICAgICBlbG0uc3R5bGUudmlzaWJpbGl0eSA9IG51bGxcbiAgICAgIGVsbS5oaWRkZW4gPSBudWxsXG4gICAgICBlbG0uaGVpZ2h0ID0gMFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBpbmNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHNlcXVlbmNlQ291bnRcbiAgICB9ID0gcHJvcHMuZGF0YXNldFxuXG4gICAgY29uc3QgdG8gPSBNYXRoLm1heCguLi5ZLnNlcW1hcC5zZXF1ZW5jZSkgKyAxXG4gICAgXG4gICAgaWYgKHRvID4gTnVtYmVyKHNlcXVlbmNlQ291bnQpKSB7XG4gICAgICByZXR1cm4gc2VxdWVuY2VDb3VudFxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2hvdyhzZWxlY3Rvcikge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goZWxtID0+IHtcbiAgICAgIGVsbS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuICAgICAgZWxtLnN0eWxlLnZpc2liaWxpdHkgPSBudWxsXG4gICAgICBlbG0uaGlkZGVuID0gbnVsbFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiB0aWxlcyhzZXFtYXAsIGRhdGFzZXQpIHtcbiAgICByZXR1cm4gc2VxbWFwLnNlcXVlbmNlLm1hcCgoc2VxdWVuY2UsIHgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpbGVTb3VyY2U6IGAke2RhdGFzZXQuc2VydmljZX0vJHtkYXRhc2V0LnR5cGV9LyR7ZGF0YXNldC5pZGVudGlmaWVyfS8ke3NlcXVlbmNlfS9pbmZvLmpzb25gLCB4XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHBvc3RNZXNzYWdlKCd2aWV3ZXI6aW5pdCcsIHt9KVxuXG4gIHBvc3RNZXNzYWdlKCd2aWV3ZXI6Y29udGVudHJlYWR5Jywge30pXG5cbiAgLy8gQ2FsbHMgdGlsZXMgbG9hZGluZy5cbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQoJ3ZpZXdlcjpjb250ZW50cmVhZHknKVxuICApXG5cbiAgaWYgKHZpZXcgPT0gJ2RvdWJsZXBhZ2UnKSB7XG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSAmJiBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRvdWJsZScpKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1kb3VibGUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utc2luZ2xlJylcbiAgICB9XG4gIH1cblxuICBZLnNlcW1hcCA9IGF3YWl0IHNlcW1hcCh7IGNvdW50OiBZLmNvdW50LCB2aWV3LCBzZXF1ZW5jZSwgY3VycmVudCB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFxuICAgIFkubm9kZXMub3NkLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZVxuICBcbiAgaWYgKFkubm9kZXMuc2xpZGVyKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXIudmFsdWUgPSBzZXF1ZW5jZVxuICB9XG4gIFxuICBpZiAoWS5ub2Rlcy5zbGlkZXJfdmFsdWUpIHtcbiAgICBZLm5vZGVzLnNsaWRlcl92YWx1ZS52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VxdWVuY2VfY291bnQnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0udGV4dENvbnRlbnQgPSBZLnNlcW1hcC5jb3VudFxuICB9KVxuXG4gIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIFkubm9kZXMub3NkLmRhdGFzZXQpXG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogWS5ub2Rlcy5vc2QuaWQsXG4gICAgcHJlc2VydmVWaWV3cG9ydDogdHJ1ZSxcbiAgICBzaG93TmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dab29tQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd0hvbWVDb250cm9sOiBmYWxzZSxcbiAgICBzaG93RnVsbFBhZ2VDb250cm9sOiBmYWxzZSxcbiAgICB2aXNpYmlsaXR5UmF0aW86IDEsXG4gICAgbWluWm9vbUxldmVsOiAwLFxuICAgIGRlZmF1bHRab29tTGV2ZWw6IDAsXG4gICAgc2VxdWVuY2VNb2RlOiBmYWxzZSxcbiAgICB0aWxlU291cmNlczogdGlsZVNvdXJjZXMsXG4gIH1cblxuICBpZiAodHlwZSA9PSAnbWFwcycpIHtcbiAgICBvcHRpb25zLnNob3dOYXZpZ2F0b3IgPSB0cnVlXG4gIH1cblxuICBZLlZpZXdlciA9IFkuT3BlblNlYWRyYWdvbihvcHRpb25zKVxuXG4gIC8vIE9wZW5TZWFkcmFnb24gZXZlbnQuXG4gIFkuVmlld2VyLndvcmxkLmFkZEhhbmRsZXIoJ2FkZC1pdGVtJywgYWRkX2l0ZW1faGFuZGxlcilcblxuICAvLyBPcGVuU2VhZHJhZ29uIGV2ZW50LlxuICBZLlZpZXdlci5hZGRIYW5kbGVyKCd6b29tJywgKCkgPT4ge1xuXG4gICAgaWYgKFkubm9kZXMub3NkLmhpZGRlbikgcmV0dXJuXG5cbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWF4Wm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1heFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPCBtYXhab29tICYmXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA+PSBtYXhab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA8PSBtaW5ab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tID4gbWluWm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuXG4gIH0pXG5cbiAgY29uc3QgZm9ybVNlcXVlbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Zvcm0tdXBkYXRlLXNlcXVlbmNlJylcbiAgaWYgKGZvcm1TZXF1ZW5jZSAmJiBZLm5vZGVzLnNsaWRlcl92YWx1ZSkge1xuICAgIGZvcm1TZXF1ZW5jZS5vbnN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICAgIHRvOiBZLm5vZGVzLnNsaWRlcl92YWx1ZS52YWx1ZSxcbiAgICAgICAgICAgIHRyaWdnZXI6ICdvbnN1Ym1pdCcsXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gaW4gY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21Jbi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWF4Wm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1heFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcbiAgICBjb25zdCB6b29tVG8gPSBhY3R1YWxab29tICogMlxuICAgIGlmIChhY3R1YWxab29tIDwgbWF4Wm9vbSkge1xuICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKHpvb21UbylcbiAgICB9XG4gICAgLy8gbG9vayBmb3IgZXZlbnQgb3B0aW9ucyAoT3BlblNlYURyYWdvbiB6b29tIGVuZClcbiAgICBpZiAoem9vbVRvID49IG1heFpvb20pIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfVxuICAgIGlmIChhY3R1YWxab29tID4gbWluWm9vbSkge1xuICAgICAgaWYgKFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gb3V0IGNsaWNrIGV2ZW50LlxuICBZLm5vZGVzLmNvbnRyb2xab29tT3V0Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbSA9IGFjdHVhbFpvb20gLyAyXG4gICAgaWYgKHpvb20gPj0gbWluWm9vbSkge1xuICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKHpvb20pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhY3R1YWxab29tID4gbWluWm9vbSkge1xuICAgICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8obWluWm9vbSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5yb3RhdGUub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgWS5WaWV3ZXIudmlld3BvcnQuc2V0Um90YXRpb24oWS5WaWV3ZXIudmlld3BvcnQuZGVncmVlcyArIDkwKVxuICB9XG5cbiAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZG91YmxlJylcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utc2luZ2xlJylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1zaW5nbGUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1kb3VibGUnKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5vcGVyYXRpb24sXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EucGFnaW5nJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fcGFnaW5nX2NsaWNrKVxuICB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYnV0dG9uJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgIGxldCBldmVudF9wcmVmaXggPSBgYnV0dG9uOiR7Y3VycmVudF90YXJnZXQuaWR9YFxuICAgICAgLyoqIGRvbid0IHdhc3RlIHRpbWUgaWYgdGhlIGJ1dHRvbiBpcyBpbmFjdGl2ZSAqL1xuICAgICAgaWYgKGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9mZmAsIGV2ZW50KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9uYCwgZXZlbnQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9OnRvZ2dsZWAsIGV2ZW50KVxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgaWYgKFkubm9kZXMuc2xpZGVyKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2xpZGVfdmFsdWVfY2hhbmdlKVxuICB9ICBcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkOnNlcXVlbmNlJywgbG9hZF9zZXF1ZW5jZSlcblxuICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZSkgPT4ge1xuICAgIC8vIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgLy8gICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgLy8gICAgIGRldGFpbDoge1xuICAgIC8vICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgLy8gICAgICAgdG86IGhpc3Rvcnkuc3RhdGUuc2VxdWVuY2UsXG4gICAgLy8gICAgICAgdHJpZ2dlcjogJ3BvcHN0YXRlJyxcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSlcbiAgICAvLyApXG4gIC8vIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywgZnVsbHNjcmVlbl9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywgZnVsbHNjcmVlbl9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld2VyOmNvbnRlbnRyZWFkeScsIHRpbGVzX2xvYWRpbmcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9uJywgb25fb3Blbl90aHVtYm5haWxzX3ZpZXcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9mZicsIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KVxuXG4gIC8vIExhbmd1YWdlLlxuICBkZWxlZ2F0ZSgnYm9keScsICdjaGFuZ2UnLCAnLmxhbmctb3B0aW9ucyBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBheGlvcy5nZXQoY3VycmVudF90YXJnZXQudmFsdWUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICBjb25zdCBwYW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IHBhZ2VtZXRhID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmUubWFpbicpXG4gICAgICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJylcbiAgICAgICAgaHRtbC5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBtYWluLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5pbm5lckhUTUwgPSBwYWdlbWV0YS5pbm5lckhUTUxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZvbHVtZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy52aWV3LW12IHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGNvbnN0IHZhbHVlID0gY3VycmVudF90YXJnZXQudmFsdWVcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vZGUtZGx0cy1ib29rJylcbiAgICBjb25zdCBsYW5nID0gbm9kZS5kYXRhc2V0LmxhbmdcbiAgICBjb25zdCB1cmwgPSB2YWx1ZS5zdWJzdHJpbmcodmFsdWUuaW5kZXhPZignOjonKSArIDIsIHZhbHVlLmxlbmd0aCkgKyAnLzE/bGFuZz0nICsgbGFuZ1xuICAgIGlmICh3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgZmlyZTogJ2NoYW5nZTpvcHRpb246bXVsdGl2b2x1bWUnLFxuICAgICAgICBtZXNzYWdlOiB7IHVybCB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICAvLyB1cCBhcnJvdyAob3IgaSkgLSBudWRnZSB1cFxuICBZLmtleWJvYXJkSlMuYmluZChbJ2knLCAndXAnXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnaScsICd1cCddKVxuICB9KVxuXG4gIC8vIGRvd24gYXJyb3cgKG9yIG0pIC0gbnVkZ2UgZG93blxuICBZLmtleWJvYXJkSlMuYmluZChbJ20nLCAnZG93biddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydtJywgJ2Rvd24nXSlcbiAgfSlcblxuICAvLyByaWdodCBhcnJvdyAob3IgaykgLSBudWRnZSByaWdodFxuICBZLmtleWJvYXJkSlMuYmluZChbJ2snLCAncmlnaHQnXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnaycsICdyaWdodCddKVxuICB9KVxuXG4gIC8vIGxlZnQgYXJyb3cgKG9yIGopIC0gbnVkZ2UgbGVmdFxuICBZLmtleWJvYXJkSlMuYmluZChbJ2onLCAnbGVmdCddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydqJywgJ2xlZnQnXSlcbiAgfSlcblxuICAvLyBzaGlmdCArIHJpZ2h0IChvciBzaGlmdCArIGspIC0gbG9hZCBwYWdlIHRvIHRoZSByaWdodCBvZiB0aGlzIG9uZSAocHJldmlvdXMgb3IgbmV4dCBkZXBlbmRpbmcxMyBvbiBsYW5ndWFnZSlcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIHJpZ2h0JywgJ3NoaWZ0ICsgayddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydzaGlmdCArIHJpZ2h0JywgJ3NoaWZ0ICsgayddKVxuICB9KVxuICBcbiAgLy8gc2hpZnQgKyBsZWZ0IChvciBzaGlmdCArIGopIC0gbG9hZCBwYWdlIHRvIHRoZSBsZWZ0IG9mIHRoaXMgb25lIChwcmV2aW91cyBvciBuZXh0IGRlcGVuZGluZyBvbiBsYW5ndWFnZSlcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIGxlZnQnLCAnc2hpZnQgKyBqJ10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJ3NoaWZ0ICsgbGVmdCcsICdzaGlmdCArIGonXSlcbiAgfSlcblxuICAvLyBzaGlmdCArIHVwIGFycm93IChvciBzaGlmdCArIGkpIC0gem9vbSBpbiBvbmUgbGV2ZWxcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIHVwJywgJ3NoaWZ0ICsgaSddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydzaGlmdCArIHVwJywgJ3NoaWZ0ICsgaSddKVxuICB9KVxuXG4gIC8vIHNoaWZ0ICsgZG93biAob3Igc2hpZnQgKyBtKSAtIHpvb20gb3V0IG9uZSBsZXZlbFxuICBZLmtleWJvYXJkSlMuYmluZChbJ3NoaWZ0ICsgZG93bicsICdzaGlmdCArIG0nXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnc2hpZnQgKyBkb3duJywgJ3NoaWZ0ICsgbSddKVxuICB9KVxuXG4gIC8vIDEgLSB6b29tIHRvIGZpdCBpbiB3aW5kb3dcbiAgWS5rZXlib2FyZEpTLmJpbmQoWycxJ10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJzEnXSlcbiAgfSlcblxuICAvLyAvIG9yID8gLSBzaG93L2hpZGUgaGVscFxuICBZLmtleWJvYXJkSlMuYmluZChbJy8nLCAnPyddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWycvJywgJz8nXSlcbiAgfSlcblxuICAvLyAvIHNwYWNlYmFyIC0gc2hvdy9oaWRlIG1ldGFkYXRhIHBhbmVsICBcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzcGFjZWJhciddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NwYWNlYmFyJylcbiAgfSlcblxufVxuXG5WaWV3ZXJBcHAoeyBPcGVuU2VhZHJhZ29uOiB3aW5kb3cuT3BlblNlYWRyYWdvbiwgYXhpb3MsIGtleWJvYXJkSlMgfSlcbiJdLCJuYW1lcyI6WyJWaWV3ZXJBcHAiLCJZIiwicG9zdE1lc3NhZ2UiLCJ0b2dnbGV2aWV3Iiwib25fcGFnaW5nX2NsaWNrIiwiZnVsbHNjcmVlbl9vbiIsImZ1bGxzY3JlZW5fb2ZmIiwic2VxbWFwIiwibG9hZF9zZXF1ZW5jZSIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vbiIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vZmYiLCJ0aWxlc19sb2FkaW5nIiwidXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yIiwiYWRkX2l0ZW1faGFuZGxlciIsImFyZV9hbGxfZnVsbHlfbG9hZGVkIiwib25faGlkZV90aHVtYm5haWxzX3ZpZXciLCJvbl9vcGVuX3RodW1ibmFpbHNfdmlldyIsIm9uVGh1bWJuYWlsc0NsaWNrIiwic2xpZGVfdmFsdWVfY2hhbmdlIiwiZGVjcmVhc2UiLCJjaGFuZ2UiLCJkZWxlZ2F0ZSIsImhpZGUiLCJpbmNyZWFzZSIsInNob3ciLCJ0aWxlcyIsImRhdGFzZXQiLCJzZXF1ZW5jZSIsIm1hcCIsIngiLCJ0aWxlU291cmNlIiwic2VydmljZSIsInR5cGUiLCJpZGVudGlmaWVyIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWxtIiwic3R5bGUiLCJkaXNwbGF5IiwidmlzaWJpbGl0eSIsImhpZGRlbiIsInByb3BzIiwic2VxdWVuY2VDb3VudCIsInRvIiwiTWF0aCIsIm1heCIsIk51bWJlciIsInRvU3RyaW5nIiwicmFuZ2Vfd2VpZ2h0IiwicXVlcnlTZWxlY3RvciIsInNsaWRlcl92YWx1ZSIsInZhbHVlIiwiaGVpZ2h0IiwiZXZlbnRUeXBlIiwiY2hpbGRTZWxlY3RvciIsImV2ZW50SGFuZGxlciIsImVsZW1lbnRzIiwiZWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudE9uRWxlbWVudCIsInRhcmdldCIsIm1hdGNoZXMiLCJzZXF1ZW5jZV9jb3VudCIsIm1pbiIsImV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwib3BlcmF0aW9uIiwiY3VycmVudFRhcmdldCIsInRyaWdnZXIiLCJwcmV2ZW50RGVmYXVsdCIsImJ1dHRvblRodW1ibmFpbHMiLCJnZXRFbGVtZW50QnlJZCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImNvbnRhaW5zIiwiYWRkIiwidXJpIiwibm9kZXMiLCJvc2QiLCJzdGF0ZSIsInRodW1ibmFpbHMiLCJ3aWR0aCIsInpvb21JbiIsInpvb21PdXQiLCJzZXRBdHRyaWJ1dGUiLCJ0b2dnbGVQYWdlIiwibmV4dCIsIml0ZW0iLCJwcmV2aW91cyIsImF4aW9zIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwic3RhdHVzIiwicGFyc2VyIiwiRE9NUGFyc2VyIiwiZG9jIiwicGFyc2VGcm9tU3RyaW5nIiwiZGF0YSIsImFwcGVuZENoaWxkIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiY291bnQiLCJWaWV3ZXIiLCJ3b3JsZCIsImdldEl0ZW1Db3VudCIsImkiLCJ0aWxlZEltYWdlIiwiZ2V0SXRlbUF0IiwiZ2V0RnVsbHlMb2FkZWQiLCJ2aWV3cG9ydCIsInNldFJvdGF0aW9uIiwiYWRkSGFuZGxlciIsIm5ld0Z1bGx5TG9hZGVkIiwiaXNGdWxseUxvYWRlZCIsImJvZHkiLCJmaXJlIiwibWVzc2FnZSIsInNldFRpbWVvdXQiLCJidXR0b24iLCJjbG9zZXN0IiwiZSIsImlkIiwidGl0bGUiLCJ2aWV3IiwiY3VycmVudCIsInRpbGVTb3VyY2VzIiwidGV4dENvbnRlbnQiLCJqb2luIiwib3BlbiIsInNlcXVlbmNlcyIsInNlcSIsImNlaWwiLCJBcnJheSIsImZpbGwiLCJfIiwiaW5kZXgiLCJwdXNoIiwic2hpZnQiLCJsZW5ndGgiLCJwb3AiLCJmaW5kIiwiaW5jbHVkZXMiLCJ0b3AiLCJleGl0RnVsbHNjcmVlbiIsIm1zRXhpdEZ1bGxzY3JlZW4iLCJtb3pDYW5jZWxGdWxsU2NyZWVuIiwid2Via2l0Q2FuY2VsRnVsbFNjcmVlbiIsImRvY0VsbSIsImRvY3VtZW50RWxlbWVudCIsInJlcXVlc3RGdWxsc2NyZWVuIiwibXNSZXF1ZXN0RnVsbHNjcmVlbiIsIm1velJlcXVlc3RGdWxsU2NyZWVuIiwid2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4iLCJ3aW5kb3ciLCJKU09OIiwic3RyaW5naWZ5IiwiYnV0dG9uTWV0YWRhdGEiLCJyb3RhdGUiLCJwYWdlbWV0YSIsImNvbnRyb2xab29tT3V0IiwiY29udHJvbFpvb21JbiIsInRvZ2dsZUxhbmd1YWdlIiwic2xpZGVyIiwib3B0aW9ucyIsInByZXNlcnZlVmlld3BvcnQiLCJzaG93TmF2aWdhdGlvbkNvbnRyb2wiLCJzaG93Wm9vbUNvbnRyb2wiLCJzaG93SG9tZUNvbnRyb2wiLCJzaG93RnVsbFBhZ2VDb250cm9sIiwidmlzaWJpbGl0eVJhdGlvIiwibWluWm9vbUxldmVsIiwiZGVmYXVsdFpvb21MZXZlbCIsInNlcXVlbmNlTW9kZSIsInNob3dOYXZpZ2F0b3IiLCJPcGVuU2VhZHJhZ29uIiwiYWN0dWFsWm9vbSIsImdldFpvb20iLCJtYXhab29tIiwiZ2V0TWF4Wm9vbSIsIm1pblpvb20iLCJnZXRNaW5ab29tIiwiZm9ybVNlcXVlbmNlIiwib25zdWJtaXQiLCJvbmNsaWNrIiwiem9vbVRvIiwiem9vbSIsImRlZ3JlZXMiLCJjdXJyZW50X3RhcmdldCIsImV2ZW50X3ByZWZpeCIsInBhbmUiLCJtYWluIiwiaHRtbCIsImRpciIsImlubmVySFRNTCIsIm5vZGUiLCJsYW5nIiwidXJsIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInNlbGYiLCJsb2NhdGlvbiIsImFzc2lnbiIsImtleWJvYXJkSlMiLCJiaW5kIl0sInNvdXJjZVJvb3QiOiIifQ==