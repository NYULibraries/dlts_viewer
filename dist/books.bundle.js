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
    var _Y$nodes$osd$dataset, view, sequence, sequenceCount, current, postMessage, toggleview, on_paging_click, fullscreen_on, fullscreen_off, seqmap, _seqmap, load_sequence, _load_sequence, on_button_metadata_on, on_button_metadata_off, tiles_loading, update_loading_indicator, add_item_handler, are_all_fully_loaded, on_hide_thumbnails_view, on_open_thumbnails_view, onThumbnailsClick, slide_value_change, decrease, _decrease, change, _change, delegate, hide, increase, _increase, show, tiles, _tiles, tileSources, formSequence;

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
                var _props$dataset3, identifier, type, view, sequenceCount, to, range_weight, slider_value;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _props$dataset3 = props.dataset, identifier = _props$dataset3.identifier, type = _props$dataset3.type, view = _props$dataset3.view, sequenceCount = _props$dataset3.sequenceCount;
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

                        window.history.pushState({
                          view: view,
                          sequence: to,
                          identifier: identifier,
                          type: type
                        }, '', "/".concat(type, "/").concat(identifier, "/").concat(to));

                      case 11:
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
                var _props$dataset2, identifier, type, sequenceCount, sequence, sequence_count, range_weight, slider_value;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _props$dataset2 = props.dataset, identifier = _props$dataset2.identifier, type = _props$dataset2.type, sequenceCount = _props$dataset2.sequenceCount;
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

                        window.history.pushState({
                          view: view,
                          sequence: sequence,
                          identifier: identifier,
                          type: type
                        }, '', "/".concat(type, "/").concat(identifier, "/").concat(sequence));

                      case 16:
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
                var _props$dataset, view, identifier, type, to, range_weight, slider_value;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _props$dataset = props.dataset, view = _props$dataset.view, identifier = _props$dataset.identifier, type = _props$dataset.type;
                        to = Math.min.apply(Math, _toConsumableArray(Y.seqmap.sequence)) - 1;

                        if (!(to < 1)) {
                          _context3.next = 6;
                          break;
                        }

                        return _context3.abrupt("return", to);

                      case 6:
                        props.dataset.sequence = to.toString();
                        range_weight = document.querySelector('#range_weight');
                        slider_value = document.querySelector('#slider_value');

                        if (range_weight && slider_value) {
                          range_weight.value = to;
                          slider_value.value = to;
                        }

                        window.history.pushState({
                          view: view,
                          sequence: to,
                          identifier: identifier,
                          type: type
                        }, '', "/".concat(type, "/").concat(identifier, "/").concat(to));

                      case 11:
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
                  to: event.currentTarget.value
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
              Y.nodes.controlZoomOut.classList.remove('active');
              Y.nodes.controlZoomOut.classList.add('inactive');
              Y.nodes.controlZoomIn.classList.remove('active');
              Y.nodes.controlZoomIn.classList.add('inactive'); // Toggle view of books page icon.

              if (Y.nodes.togglePage) {
                Y.nodes.togglePage.classList.remove('active');
                Y.nodes.togglePage.classList.add('inactive');
              }

              Y.nodes.next.forEach(function (item) {
                item.classList.remove('active');
                item.classList.add('inactive');
              });
              Y.nodes.previous.forEach(function (item) {
                item.classList.remove('active');
                item.classList.add('inactive');
              });

              if (parseInt(state, 10) === 0) {
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
                item.classList.remove('active');
                item.classList.add('inactive');
              });
              Y.nodes.previous.forEach(function (item) {
                if (sequence > 1) {
                  item.classList.remove('inactive');
                  item.classList.add('active');
                }
              });
              Y.nodes.next.forEach(function (item) {
                if (sequence < sequenceCount) {
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
            _Y$nodes$osd$dataset = Y.nodes.osd.dataset, view = _Y$nodes$osd$dataset.view, sequence = _Y$nodes$osd$dataset.sequence, sequenceCount = _Y$nodes$osd$dataset.sequenceCount, current = _Y$nodes$osd$dataset.current;
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
            } // Y.nodes.slider.max = Y.seqmap.count


            document.querySelectorAll('.sequence_count').forEach(function (item) {
              item.textContent = Y.seqmap.count;
            });
            _context7.next = 64;
            return tiles(Y.seqmap, Y.nodes.osd.dataset);

          case 64:
            tileSources = _context7.sent;
            Y.Viewer = Y.OpenSeadragon({
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
            }); // OpenSeadragon event.

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
                    to: Y.nodes.slider_value.value
                  }
                }));
              };
            } // Zoom in click event.


            Y.nodes.controlZoomIn.onclick = function () {
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


            Y.nodes.controlZoomOut.onclick = function () {
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
              console.log(history.state.sequence); // document.dispatchEvent(
              //   new CustomEvent('load:sequence', {
              //     detail: {
              //       operation: 'change',
              //       to: history.state.sequence,
              //     }
              //   })
              // )
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
                postMessage({
                  fire: 'change:option:multivolume',
                  message: {
                    url: url
                  }
                });
              }
            });

          case 88:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUQsQ0FBVCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9qcy92aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gVmlld2VyQXBwKFkpIHtcblxuICBZLlZpZXdlciA9IG51bGxcblxuICBZLmlzRnVsbHlMb2FkZWQgPSBmYWxzZVxuXG4gIFkuc2VxbWFwID0ge31cblxuICBZLm5vZGVzID0ge31cblxuICBZLm5vZGVzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcblxuICBZLm5vZGVzLnRodW1ibmFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGh1bWJuYWlscycpXG5cbiAgWS5ub2Rlcy5idXR0b25NZXRhZGF0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuXG4gIFkubm9kZXMucm90YXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtcm90YXRlJylcblxuICBZLm5vZGVzLnBhZ2VtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcblxuICBZLm5vZGVzLm9zZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgWS5ub2Rlcy5kaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyNkaXNwbGF5JylcblxuICBZLm5vZGVzLnRvZ2dsZVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLXBhZ2UnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbC16b29tLW91dCcpXG5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1pbicpXG5cbiAgWS5ub2Rlcy50b2dnbGVMYW5ndWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgLmxhbmd1YWdlJylcblxuICBZLm5vZGVzLm5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLm5leHQnKVxuXG4gIFkubm9kZXMucHJldmlvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLnByZXZpb3VzJylcblxuICBZLm5vZGVzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuXG4gIFkubm9kZXMuc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpICBcblxuICBjb25zdCB7IFxuICAgIHZpZXcsIFxuICAgIHNlcXVlbmNlLCBcbiAgICBzZXF1ZW5jZUNvdW50LCBcbiAgICBjdXJyZW50IFxuICB9ID0gWS5ub2Rlcy5vc2QuZGF0YXNldFxuXG4gIFkuY291bnQgPSBOdW1iZXIoc2VxdWVuY2VDb3VudClcblxuICBmdW5jdGlvbiBwb3N0TWVzc2FnZShmaXJlLCBtZXNzYWdlKSB7XG4gICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7IGZpcmUsIG1lc3NhZ2UgfSksICcqJylcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZXZpZXcocHJvcHMpIHtcbiAgICBjb25zdCB7IHZpZXcgfSA9IHByb3BzLmRhdGFzZXRcbiAgICBpZiAodmlldyA9PSAnc2luZ2xlJykge1xuICAgICAgcHJvcHMuZGF0YXNldC52aWV3ID0gJ2RvdWJsZXBhZ2UnXG4gICAgfSBlbHNlIGlmICh2aWV3ID09ICdkb3VibGVwYWdlJykge1xuICAgICAgcHJvcHMuZGF0YXNldC52aWV3ID0gJ3NpbmdsZSdcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbl9wYWdpbmdfY2xpY2soZSkge1xuICAgIGNvbnN0IGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXRcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAvKiogdGVzdCBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBhY3RpdmUgKi9cbiAgICBpZiAoY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHJldHVybiBmYWxzZVxuICAgIHRyeSB7XG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LmFkZCgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIG9wZXJhdGlvbjogZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQub3BlcmF0aW9uLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZnVsbHNjcmVlbl9vbigpIHtcbiAgICBjb25zdCBkb2NFbG0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBpZiAoYnV0dG9uKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgIH1cbiAgICBpZiAoZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICBkb2NFbG0ucmVxdWVzdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgZG9jRWxtLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b24nLCB7fSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb2ZmKCkge1xuICAgIGNvbnN0IHRvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3AnKVxuICAgIGlmIChkb2N1bWVudC5leGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBpZiAodG9wKSB7XG4gICAgICB0b3AuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2UoJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvZmYnLCB7fSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHNlcW1hcChwcm9wcykge1xuICAgIGNvbnN0IHsgY291bnQsIHZpZXcsIHNlcXVlbmNlIH0gPSBwcm9wc1xuICAgIGNvbnN0IHNlcXVlbmNlcyA9IFtdXG4gICAgc3dpdGNoICh2aWV3KSB7XG4gICAgICBjYXNlICdkb3VibGVwYWdlJzpcbiAgICAgICAgY29uc3Qgc2VxID0gTWF0aC5jZWlsKE51bWJlcihjb3VudCkgLyAyKSArIDFcbiAgICAgICAgQXJyYXkoc2VxKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKiAyLCBpbmRleCAqIDIgKyAxIF0pXG4gICAgICAgIH0pXG4gICAgICAgIC8vIFJlbW92ZSAwIGZyb20gZmlyc3QgaW5kZXguXG4gICAgICAgIHNlcXVlbmNlc1swXS5zaGlmdCgpXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBsYXN0IGluZGV4IGRvZXMgbm90IGluY2x1ZGVzIG91dGJvdW5kIHNlcXVlbmNlcy5cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMV0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV0ucG9wKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VxdWVuY2VzW3NlcXVlbmNlcy5sZW5ndGggLSAxXVswXSA+IGNvdW50KSB7XG4gICAgICAgICAgc2VxdWVuY2VzLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsXG4gICAgICAgICAgY291bnQsXG4gICAgICAgICAgdmlldywgICAgICAgICAgXG4gICAgICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlcy5maW5kKHZhbHVlID0+IHZhbHVlLmluY2x1ZGVzKHNlcXVlbmNlKSA9PT0gdHJ1ZSksXG4gICAgICAgIH1cbiAgICAgIGNhc2UgJ3NpbmdsZSc6XG4gICAgICAgIEFycmF5KE51bWJlcihjb3VudCkpLmZpbGwoKS5tYXAoKF8sIGluZGV4KSA9PiB7XG4gICAgICAgICAgc2VxdWVuY2VzLnB1c2goWyBpbmRleCArIDFdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNlcXVlbmNlcywgXG4gICAgICAgICAgY291bnQsXG4gICAgICAgICAgdmlldyxcbiAgICAgICAgICBzZXF1ZW5jZTogWyBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiBOdW1iZXIodmFsdWUpID09PSBOdW1iZXIoc2VxdWVuY2UpKSBdLFxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gbG9hZF9zZXF1ZW5jZShlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9zZCA9IFkubm9kZXMub3NkXG4gICAgICBjb25zdCBkYXRhc2V0ID0gb3NkLmRhdGFzZXRcbiAgICAgIGNvbnN0IHsgb3BlcmF0aW9uLCB0byB9ICA9IGUuZGV0YWlsXG4gICAgICBjb25zdCBmaXJlID0gYHZpZXdlcjpzZXF1ZW5jZToke29wZXJhdGlvbn1gXG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlICdpbmNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgaW5jcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RlY3JlYXNlJzpcbiAgICAgICAgICBhd2FpdCBkZWNyZWFzZShvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnY2hhbmdlJzpcbiAgICAgICAgICBhd2FpdCBjaGFuZ2UodG8sIG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd0b2dnbGV2aWV3JzpcbiAgICAgICAgICB0b2dnbGV2aWV3KG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgLy8gQ29uZmlndXJhdGlvbiBmb3IgdGhlIG5ldyBzZXF1ZW5jZS5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGlkOiBvc2QuaWQsXG4gICAgICAgIHRpdGxlOiBkYXRhc2V0LnRpdGxlLFxuICAgICAgICBjb3VudDogWS5jb3VudCxcbiAgICAgICAgdmlldzogZGF0YXNldC52aWV3LFxuICAgICAgICBjdXJyZW50OiBOdW1iZXIoZGF0YXNldC5jdXJyZW50KSxcbiAgICAgICAgc2VxdWVuY2U6IE51bWJlcihkYXRhc2V0LnNlcXVlbmNlKSxcbiAgICAgICAgaWRlbnRpZmllcjogZGF0YXNldC5pZGVudGlmaWVyLFxuICAgICAgICB1cmk6IGAke2RhdGFzZXQudXJpfS8ke2RhdGFzZXQuc2VxdWVuY2V9YCxcbiAgICAgIH1cblxuICAgICAgWS5zZXFtYXAgPSBhd2FpdCBzZXFtYXAobWVzc2FnZSlcblxuICAgICAgcG9zdE1lc3NhZ2UoeyBmaXJlLCBtZXNzYWdlIH0pXG5cbiAgICAgIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIGRhdGFzZXQpXG5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLnNlcXVlbmNlLmpvaW4oJyAtICcpXG5cbiAgICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChkYXRhc2V0LnNlcXVlbmNlID49IFkuc2VxbWFwLmNvdW50KSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA8PSAxKSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG5cbiAgICAgIHNob3coJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgICAgIHNob3coJyNwYWdlcicpXG5cbiAgICAgIFkuVmlld2VyLm9wZW4odGlsZVNvdXJjZXMpXG5cbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuXG4gICAgICBZLmlzRnVsbHlMb2FkZWQgPSB0cnVlXG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29uKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgIGVsZW1lbnQuY2xvc2VzdCgnLnBhbmUtYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2VtZXRhLWhpZGRlbicpXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgZmlyZTogJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b24nLFxuICAgICAgbWVzc2FnZToge31cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29mZigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICBlbGVtZW50LmNsb3Nlc3QoJy5wYW5lLWJvZHknKS5jbGFzc0xpc3QuYWRkKCdwYWdlbWV0YS1oaWRkZW4nKVxuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgIGZpcmU6ICdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsXG4gICAgICBtZXNzYWdlOiB7fVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiB0aWxlc19sb2FkaW5nKCkge1xuICAgIGlmIChib2R5LmNsYXNzTGlzdC5jb250YWlucygnb3BlbmxheWVycy1sb2FkaW5nJykpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aWxlc19sb2FkaW5nKClcbiAgICAgIH0sIDEwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGUoJy5wYW5lLmxvYWQnKVxuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yKCkge1xuICAgIGlmIChZLmlzRnVsbHlMb2FkZWQpIHtcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgICAgaGlkZSgnLnBhbmUubG9hZCcpXG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGZpcmU6ICd2aWV3ZXI6bG9hZGVkJyxcbiAgICAgICAgbWVzc2FnZToge31cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkX2l0ZW1faGFuZGxlcihldmVudCkge1xuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKDApXG4gICAgY29uc3QgdGlsZWRJbWFnZSA9IGV2ZW50Lml0ZW1cbiAgICB0aWxlZEltYWdlLmFkZEhhbmRsZXIoJ2Z1bGx5LWxvYWRlZC1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdGdWxseUxvYWRlZCA9IGFyZV9hbGxfZnVsbHlfbG9hZGVkKClcbiAgICAgIGlmIChuZXdGdWxseUxvYWRlZCAhPT0gWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICAgIFkuaXNGdWxseUxvYWRlZCA9IG5ld0Z1bGx5TG9hZGVkXG4gICAgICAgIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZV9hbGxfZnVsbHlfbG9hZGVkKCkge1xuICAgIGNvbnN0IGNvdW50ID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUNvdW50KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBZLlZpZXdlci53b3JsZC5nZXRJdGVtQXQoaSlcbiAgICAgIGlmICghdGlsZWRJbWFnZS5nZXRGdWxseUxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gb25faGlkZV90aHVtYm5haWxzX3ZpZXcoKSB7XG5cbiAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuXG4gICAgY29uc3QgeyBzZXF1ZW5jZUNvdW50LCBzZXF1ZW5jZSB9ID0gb3NkLmRhdGFzZXRcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuXG4gICAgaGlkZSgnI3RodW1ibmFpbHMnKVxuXG4gICAgLy8gVG9nZ2xlIHZpZXcgb2YgYm9va3MgcGFnZSBpY29uLlxuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoc2VxdWVuY2UgPiAxKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfSlcblxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlIDwgc2VxdWVuY2VDb3VudCkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX29wZW5fdGh1bWJuYWlsc192aWV3KCkge1xuXG4gICAgY29uc3QgeyB1cmkgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IFkubm9kZXMudGh1bWJuYWlscy5kYXRhc2V0XG5cbiAgICBjb25zdCB3aWR0aCA9ICcyMzAnXG5cbiAgICBjb25zdCBoZWlnaHQgPSAnMTUwJ1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3RodW1ibmFpbHMtdmlldycpXG5cbiAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG5cbiAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuXG4gICAgLy8gVG9nZ2xlIHZpZXcgb2YgYm9va3MgcGFnZSBpY29uLlxuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9XG5cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9KVxuXG4gICAgaWYgKHBhcnNlSW50KHN0YXRlLCAxMCkgPT09IDApIHtcbiAgICAgIGF4aW9zLmdldChgJHt1cml9L3RodW1ibmFpbHM/cGpheD10cnVlJndpZHRoPSR7d2lkdGh9JmhlaWdodD0ke2hlaWdodH1gKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpXG4gICAgICAgICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhyZXNwb25zZS5kYXRhLCAndGV4dC9odG1sJylcbiAgICAgICAgICAgWS5ub2Rlcy50aHVtYm5haWxzLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgZG9jLnF1ZXJ5U2VsZWN0b3IoJy50aHVtYm5haWxzLmNvbnRhaW5lcicpXG4gICAgICAgICAgKVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aHVtYm5haWxzLmNvbnRhaW5lciBhJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRodW1ibmFpbHNDbGljaylcbiAgICAgICAgICB9KVxuICAgICAgICAgIFkubm9kZXMudGh1bWJuYWlscy5kYXRhc2V0LnN0YXRlID0gMVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygnI3RodW1ibmFpbHMnKVxuXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGh1bWJuYWlsc0NsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGJ1dHRvblRodW1ibmFpbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXRodW1ibmFpbHMnKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGlmIChidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICBidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgfVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VxdWVuY2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2xpZGVfdmFsdWVfY2hhbmdlKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHsgdmlldywgaWRlbnRpZmllciwgdHlwZSB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGNvbnN0IHRvID0gTWF0aC5taW4oLi4uWS5zZXFtYXAuc2VxdWVuY2UpIC0gMVxuICAgIGlmICh0byA8IDEpIHtcbiAgICAgIHJldHVybiB0b1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyB2aWV3LCBzZXF1ZW5jZTogdG8sIGlkZW50aWZpZXIsIHR5cGUgfSwgJycsIGAvJHt0eXBlfS8ke2lkZW50aWZpZXJ9LyR7dG99YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBjaGFuZ2UodG8sIHByb3BzKSB7XG4gICAgY29uc3QgeyBpZGVudGlmaWVyLCB0eXBlLCBzZXF1ZW5jZUNvdW50IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgY29uc3Qgc2VxdWVuY2UgPSBOdW1iZXIodG8pXG4gICAgY29uc3Qgc2VxdWVuY2VfY291bnQgPSBOdW1iZXIoc2VxdWVuY2VDb3VudClcbiAgICBpZiAoc2VxdWVuY2UgPCAxKSB7XG4gICAgICByZXR1cm4gMVxuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2UgPiBzZXF1ZW5jZV9jb3VudCkge1xuICAgICAgcmV0dXJuIHNlcXVlbmNlX2NvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZS50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IHZpZXcsIHNlcXVlbmNlLCBpZGVudGlmaWVyLCB0eXBlIH0sICcnLCBgLyR7dHlwZX0vJHtpZGVudGlmaWVyfS8ke3NlcXVlbmNlfWApXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50VHlwZSwgY2hpbGRTZWxlY3RvciwgZXZlbnRIYW5kbGVyKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50T25FbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGV2ZW50T25FbGVtZW50LnRhcmdldC5tYXRjaGVzKGNoaWxkU2VsZWN0b3IpKSB7XG4gICAgICAgICAgZXZlbnRIYW5kbGVyKGV2ZW50T25FbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGUoc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICAgIGVsbS5oZWlnaHQgPSAwXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGluY3JlYXNlKHByb3BzKSB7XG4gICAgY29uc3Qge1xuICAgICAgaWRlbnRpZmllciwgXG4gICAgICB0eXBlLCBcbiAgICAgIHZpZXcsIFxuICAgICAgc2VxdWVuY2VDb3VudFxuICAgIH0gPSBwcm9wcy5kYXRhc2V0XG5cbiAgICBjb25zdCB0byA9IE1hdGgubWF4KC4uLlkuc2VxbWFwLnNlcXVlbmNlKSArIDFcbiAgICBcbiAgICBpZiAodG8gPiBOdW1iZXIoc2VxdWVuY2VDb3VudCkpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZUNvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSB0by50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IHZpZXcsIHNlcXVlbmNlOiB0bywgaWRlbnRpZmllciwgdHlwZSB9LCAnJywgYC8ke3R5cGV9LyR7aWRlbnRpZmllcn0vJHt0b31gKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3coc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gdGlsZXMoc2VxbWFwLCBkYXRhc2V0KSB7XG4gICAgcmV0dXJuIHNlcW1hcC5zZXF1ZW5jZS5tYXAoKHNlcXVlbmNlLCB4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aWxlU291cmNlOiBgJHtkYXRhc2V0LnNlcnZpY2V9LyR7ZGF0YXNldC50eXBlfS8ke2RhdGFzZXQuaWRlbnRpZmllcn0vJHtzZXF1ZW5jZX0vaW5mby5qc29uYCwgeFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwb3N0TWVzc2FnZSgndmlld2VyOmluaXQnLCB7fSlcblxuICBwb3N0TWVzc2FnZSgndmlld2VyOmNvbnRlbnRyZWFkeScsIHt9KVxuXG4gIC8vIENhbGxzIHRpbGVzIGxvYWRpbmcuXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50KCd2aWV3ZXI6Y29udGVudHJlYWR5JylcbiAgKVxuXG4gIGlmICh2aWV3ID09ICdkb3VibGVwYWdlJykge1xuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UgJiYgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kb3VibGUnKSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZG91YmxlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLXNpbmdsZScpXG4gICAgfVxuICB9XG5cbiAgWS5zZXFtYXAgPSBhd2FpdCBzZXFtYXAoeyBjb3VudDogWS5jb3VudCwgdmlldywgc2VxdWVuY2UsIGN1cnJlbnQgfSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudF9wYWdlJykudGV4dENvbnRlbnQgPSBcbiAgICBZLm5vZGVzLm9zZC5kYXRhc2V0LnNlcXVlbmNlID0gc2VxdWVuY2VcbiAgXG4gIGlmIChZLm5vZGVzLnNsaWRlcikge1xuICAgIFkubm9kZXMuc2xpZGVyLnZhbHVlID0gc2VxdWVuY2VcbiAgfVxuICBcbiAgaWYgKFkubm9kZXMuc2xpZGVyX3ZhbHVlKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXJfdmFsdWUudmFsdWUgPSBzZXF1ZW5jZVxuICB9XG5cbiAgLy8gWS5ub2Rlcy5zbGlkZXIubWF4ID0gWS5zZXFtYXAuY291bnRcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VxdWVuY2VfY291bnQnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0udGV4dENvbnRlbnQgPSBZLnNlcW1hcC5jb3VudFxuICB9KVxuXG4gIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIFkubm9kZXMub3NkLmRhdGFzZXQpXG5cbiAgWS5WaWV3ZXIgPSBZLk9wZW5TZWFkcmFnb24oe1xuICAgIGlkOiBZLm5vZGVzLm9zZC5pZCxcbiAgICBwcmVzZXJ2ZVZpZXdwb3J0OiB0cnVlLFxuICAgIHNob3dOYXZpZ2F0aW9uQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd1pvb21Db250cm9sOiBmYWxzZSxcbiAgICBzaG93SG9tZUNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dGdWxsUGFnZUNvbnRyb2w6IGZhbHNlLFxuICAgIHZpc2liaWxpdHlSYXRpbzogMSxcbiAgICBtaW5ab29tTGV2ZWw6IDAsXG4gICAgZGVmYXVsdFpvb21MZXZlbDogMCxcbiAgICBzZXF1ZW5jZU1vZGU6IGZhbHNlLFxuICAgIHRpbGVTb3VyY2VzOiB0aWxlU291cmNlcyxcbiAgfSlcblxuICAvLyBPcGVuU2VhZHJhZ29uIGV2ZW50LlxuICBZLlZpZXdlci53b3JsZC5hZGRIYW5kbGVyKCdhZGQtaXRlbScsIGFkZF9pdGVtX2hhbmRsZXIpXG5cbiAgLy8gT3BlblNlYWRyYWdvbiBldmVudC5cbiAgWS5WaWV3ZXIuYWRkSGFuZGxlcignem9vbScsICgpID0+IHtcblxuICAgIGlmIChZLm5vZGVzLm9zZC5oaWRkZW4pIHJldHVyblxuXG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1heFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNYXhab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tIDwgbWF4Wm9vbSAmJlxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPj0gbWF4Wm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPD0gbWluWm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA+IG1pblpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cblxuICB9KVxuXG4gIGNvbnN0IGZvcm1TZXF1ZW5jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmb3JtLXVwZGF0ZS1zZXF1ZW5jZScpXG4gIGlmIChmb3JtU2VxdWVuY2UgJiYgWS5ub2Rlcy5zbGlkZXJfdmFsdWUpIHtcbiAgICBmb3JtU2VxdWVuY2Uub25zdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgICB0bzogWS5ub2Rlcy5zbGlkZXJfdmFsdWUudmFsdWUsXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gaW4gY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21Jbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb21UbyA9IGFjdHVhbFpvb20gKiAyXG4gICAgaWYgKGFjdHVhbFpvb20gPCBtYXhab29tKSB7XG4gICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8oem9vbVRvKVxuICAgIH1cbiAgICAvLyBsb29rIGZvciBldmVudCBvcHRpb25zIChPcGVuU2VhRHJhZ29uIHpvb20gZW5kKVxuICAgIGlmICh6b29tVG8gPj0gbWF4Wm9vbSkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9XG4gICAgaWYgKGFjdHVhbFpvb20gPiBtaW5ab29tKSB7XG4gICAgICBpZiAoWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQub25jbGljayA9ICgpID0+IHtcbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb20gPSBhY3R1YWxab29tIC8gMlxuICAgIGlmICh6b29tID49IG1pblpvb20pIHtcbiAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21Ubyh6b29tKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWN0dWFsWm9vbSA+IG1pblpvb20pIHtcbiAgICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKG1pblpvb20pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMucm90YXRlLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKFkuVmlld2VyLnZpZXdwb3J0LmRlZ3JlZXMgKyA5MClcbiAgfVxuXG4gIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICBZLm5vZGVzLnRvZ2dsZVBhZ2Uub25jbGljayA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRvdWJsZScpKSB7XG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLXNpbmdsZScpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2Utc2luZ2xlJylcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtZG91YmxlJylcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIG9wZXJhdGlvbjogZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQub3BlcmF0aW9uLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLnBhZ2luZycpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX3BhZ2luZ19jbGljaylcbiAgfSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLmJ1dHRvbicpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICBsZXQgZXZlbnRfcHJlZml4ID0gYGJ1dHRvbjoke2N1cnJlbnRfdGFyZ2V0LmlkfWBcbiAgICAgIC8qKiBkb24ndCB3YXN0ZSB0aW1lIGlmIHRoZSBidXR0b24gaXMgaW5hY3RpdmUgKi9cbiAgICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvbicpKSB7XG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTpvZmZgLCBldmVudClcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ29uJylcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJylcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTpvbmAsIGV2ZW50KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTp0b2dnbGVgLCBldmVudClcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIGlmIChZLm5vZGVzLnNsaWRlcikge1xuICAgIFkubm9kZXMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNsaWRlX3ZhbHVlX2NoYW5nZSlcbiAgfSAgXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZDpzZXF1ZW5jZScsIGxvYWRfc2VxdWVuY2UpXG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGUpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGNvbnNvbGUubG9nKGhpc3Rvcnkuc3RhdGUuc2VxdWVuY2UpXG4gICAgLy8gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAvLyAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAvLyAgICAgZGV0YWlsOiB7XG4gICAgLy8gICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAvLyAgICAgICB0bzogaGlzdG9yeS5zdGF0ZS5zZXF1ZW5jZSxcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSlcbiAgICAvLyApXG4gIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywgZnVsbHNjcmVlbl9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywgZnVsbHNjcmVlbl9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld2VyOmNvbnRlbnRyZWFkeScsIHRpbGVzX2xvYWRpbmcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9uJywgb25fb3Blbl90aHVtYm5haWxzX3ZpZXcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9mZicsIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KVxuXG4gIC8vIExhbmd1YWdlLlxuICBkZWxlZ2F0ZSgnYm9keScsICdjaGFuZ2UnLCAnLmxhbmctb3B0aW9ucyBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBheGlvcy5nZXQoY3VycmVudF90YXJnZXQudmFsdWUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICBjb25zdCBwYW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IHBhZ2VtZXRhID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmUubWFpbicpXG4gICAgICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJylcbiAgICAgICAgaHRtbC5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBtYWluLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5pbm5lckhUTUwgPSBwYWdlbWV0YS5pbm5lckhUTUxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZvbHVtZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy52aWV3LW12IHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGNvbnN0IHZhbHVlID0gY3VycmVudF90YXJnZXQudmFsdWVcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vZGUtZGx0cy1ib29rJylcbiAgICBjb25zdCBsYW5nID0gbm9kZS5kYXRhc2V0LmxhbmdcbiAgICBjb25zdCB1cmwgPSB2YWx1ZS5zdWJzdHJpbmcodmFsdWUuaW5kZXhPZignOjonKSArIDIsIHZhbHVlLmxlbmd0aCkgKyAnLzE/bGFuZz0nICsgbGFuZ1xuICAgIGlmICh3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgZmlyZTogJ2NoYW5nZTpvcHRpb246bXVsdGl2b2x1bWUnLFxuICAgICAgICBtZXNzYWdlOiB7IHVybCB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxufVxuXG5WaWV3ZXJBcHAoeyBPcGVuU2VhZHJhZ29uOiB3aW5kb3cuT3BlblNlYWRyYWdvbiwgYXhpb3MgfSlcbiJdLCJuYW1lcyI6WyJWaWV3ZXJBcHAiLCJZIiwicG9zdE1lc3NhZ2UiLCJ0b2dnbGV2aWV3Iiwib25fcGFnaW5nX2NsaWNrIiwiZnVsbHNjcmVlbl9vbiIsImZ1bGxzY3JlZW5fb2ZmIiwic2VxbWFwIiwibG9hZF9zZXF1ZW5jZSIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vbiIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vZmYiLCJ0aWxlc19sb2FkaW5nIiwidXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yIiwiYWRkX2l0ZW1faGFuZGxlciIsImFyZV9hbGxfZnVsbHlfbG9hZGVkIiwib25faGlkZV90aHVtYm5haWxzX3ZpZXciLCJvbl9vcGVuX3RodW1ibmFpbHNfdmlldyIsIm9uVGh1bWJuYWlsc0NsaWNrIiwic2xpZGVfdmFsdWVfY2hhbmdlIiwiZGVjcmVhc2UiLCJjaGFuZ2UiLCJkZWxlZ2F0ZSIsImhpZGUiLCJpbmNyZWFzZSIsInNob3ciLCJ0aWxlcyIsImRhdGFzZXQiLCJzZXF1ZW5jZSIsIm1hcCIsIngiLCJ0aWxlU291cmNlIiwic2VydmljZSIsInR5cGUiLCJpZGVudGlmaWVyIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWxtIiwic3R5bGUiLCJkaXNwbGF5IiwidmlzaWJpbGl0eSIsImhpZGRlbiIsInByb3BzIiwidmlldyIsInNlcXVlbmNlQ291bnQiLCJ0byIsIk1hdGgiLCJtYXgiLCJOdW1iZXIiLCJ0b1N0cmluZyIsInJhbmdlX3dlaWdodCIsInF1ZXJ5U2VsZWN0b3IiLCJzbGlkZXJfdmFsdWUiLCJ2YWx1ZSIsIndpbmRvdyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJoZWlnaHQiLCJldmVudFR5cGUiLCJjaGlsZFNlbGVjdG9yIiwiZXZlbnRIYW5kbGVyIiwiZWxlbWVudHMiLCJlbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50T25FbGVtZW50IiwidGFyZ2V0IiwibWF0Y2hlcyIsInNlcXVlbmNlX2NvdW50IiwibWluIiwiZXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJvcGVyYXRpb24iLCJjdXJyZW50VGFyZ2V0IiwicHJldmVudERlZmF1bHQiLCJidXR0b25UaHVtYm5haWxzIiwiZ2V0RWxlbWVudEJ5SWQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJjb250YWlucyIsImFkZCIsInVyaSIsIm5vZGVzIiwib3NkIiwic3RhdGUiLCJ0aHVtYm5haWxzIiwid2lkdGgiLCJjb250cm9sWm9vbU91dCIsImNvbnRyb2xab29tSW4iLCJ0b2dnbGVQYWdlIiwibmV4dCIsIml0ZW0iLCJwcmV2aW91cyIsInBhcnNlSW50IiwiYXhpb3MiLCJnZXQiLCJ0aGVuIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJwYXJzZXIiLCJET01QYXJzZXIiLCJkb2MiLCJwYXJzZUZyb21TdHJpbmciLCJkYXRhIiwiYXBwZW5kQ2hpbGQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJjb3VudCIsIlZpZXdlciIsIndvcmxkIiwiZ2V0SXRlbUNvdW50IiwiaSIsInRpbGVkSW1hZ2UiLCJnZXRJdGVtQXQiLCJnZXRGdWxseUxvYWRlZCIsInZpZXdwb3J0Iiwic2V0Um90YXRpb24iLCJhZGRIYW5kbGVyIiwibmV3RnVsbHlMb2FkZWQiLCJpc0Z1bGx5TG9hZGVkIiwiYm9keSIsImZpcmUiLCJtZXNzYWdlIiwic2V0VGltZW91dCIsImJ1dHRvbiIsImNsb3Nlc3QiLCJlIiwiaWQiLCJ0aXRsZSIsImN1cnJlbnQiLCJ0aWxlU291cmNlcyIsInRleHRDb250ZW50Iiwiam9pbiIsIm9wZW4iLCJzZXF1ZW5jZXMiLCJzZXEiLCJjZWlsIiwiQXJyYXkiLCJmaWxsIiwiXyIsImluZGV4IiwicHVzaCIsInNoaWZ0IiwibGVuZ3RoIiwicG9wIiwiZmluZCIsImluY2x1ZGVzIiwidG9wIiwiZXhpdEZ1bGxzY3JlZW4iLCJtc0V4aXRGdWxsc2NyZWVuIiwibW96Q2FuY2VsRnVsbFNjcmVlbiIsIndlYmtpdENhbmNlbEZ1bGxTY3JlZW4iLCJkb2NFbG0iLCJkb2N1bWVudEVsZW1lbnQiLCJyZXF1ZXN0RnVsbHNjcmVlbiIsIm1zUmVxdWVzdEZ1bGxzY3JlZW4iLCJtb3pSZXF1ZXN0RnVsbFNjcmVlbiIsIndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIiwiSlNPTiIsInN0cmluZ2lmeSIsImJ1dHRvbk1ldGFkYXRhIiwicm90YXRlIiwicGFnZW1ldGEiLCJ0b2dnbGVMYW5ndWFnZSIsInNsaWRlciIsIk9wZW5TZWFkcmFnb24iLCJwcmVzZXJ2ZVZpZXdwb3J0Iiwic2hvd05hdmlnYXRpb25Db250cm9sIiwic2hvd1pvb21Db250cm9sIiwic2hvd0hvbWVDb250cm9sIiwic2hvd0Z1bGxQYWdlQ29udHJvbCIsInZpc2liaWxpdHlSYXRpbyIsIm1pblpvb21MZXZlbCIsImRlZmF1bHRab29tTGV2ZWwiLCJzZXF1ZW5jZU1vZGUiLCJhY3R1YWxab29tIiwiZ2V0Wm9vbSIsIm1heFpvb20iLCJnZXRNYXhab29tIiwibWluWm9vbSIsImdldE1pblpvb20iLCJmb3JtU2VxdWVuY2UiLCJvbnN1Ym1pdCIsIm9uY2xpY2siLCJ6b29tVG8iLCJ6b29tIiwiZGVncmVlcyIsImN1cnJlbnRfdGFyZ2V0IiwiZXZlbnRfcHJlZml4IiwicGFuZSIsIm1haW4iLCJodG1sIiwiZGlyIiwiaW5uZXJIVE1MIiwibm9kZSIsImxhbmciLCJ1cmwiLCJzdWJzdHJpbmciLCJpbmRleE9mIiwic2VsZiIsImxvY2F0aW9uIiwiYXNzaWduIl0sInNvdXJjZVJvb3QiOiIifQ==