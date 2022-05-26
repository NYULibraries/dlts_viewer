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
              console.log(event);
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
                        console.log('load_sequence', e);
                        _context2.prev = 1;
                        osd = Y.nodes.osd;
                        dataset = osd.dataset;
                        _e$detail = e.detail, operation = _e$detail.operation, to = _e$detail.to;
                        fire = "viewer:sequence:".concat(operation);
                        _context2.t0 = operation;
                        _context2.next = _context2.t0 === 'increase' ? 9 : _context2.t0 === 'decrease' ? 12 : _context2.t0 === 'change' ? 15 : _context2.t0 === 'toggleview' ? 18 : 20;
                        break;

                      case 9:
                        _context2.next = 11;
                        return increase(osd);

                      case 11:
                        return _context2.abrupt("break", 20);

                      case 12:
                        _context2.next = 14;
                        return decrease(osd);

                      case 14:
                        return _context2.abrupt("break", 20);

                      case 15:
                        _context2.next = 17;
                        return change(to, osd);

                      case 17:
                        return _context2.abrupt("break", 20);

                      case 18:
                        toggleview(osd);
                        return _context2.abrupt("break", 20);

                      case 20:
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
                        _context2.next = 23;
                        return seqmap(message);

                      case 23:
                        Y.seqmap = _context2.sent;
                        postMessage({
                          fire: fire,
                          message: message
                        });
                        _context2.next = 27;
                        return tiles(Y.seqmap, dataset);

                      case 27:
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
                        _context2.next = 42;
                        break;

                      case 39:
                        _context2.prev = 39;
                        _context2.t1 = _context2["catch"](1);
                        console.log(_context2.t1);

                      case 42:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[1, 39]]);
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

            console.log('ViewerApp');
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

            _context7.next = 58;
            return seqmap({
              count: Y.count,
              view: view,
              sequence: sequence,
              current: current
            });

          case 58:
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
            _context7.next = 65;
            return tiles(Y.seqmap, Y.nodes.osd.dataset);

          case 65:
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
                    to: Y.nodes.slider_value.value,
                    trigger: 'onsubmit'
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
              console.log(history.state.sequence);
              document.dispatchEvent(new CustomEvent('load:sequence', {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTl3QkY7VUFBQTtZQUFBO1FBQUE7TUFBQTtJQUFBO0VBQUE7Ozs7QUFneUJBeE0sU0FBUyxDQUFDO0VBQUV5SyxhQUFhLEVBQUVsSCxNQUFNLENBQUNrSCxhQUF4QjtFQUF1Q3RFLEtBQUssRUFBTEE7QUFBdkMsQ0FBRCxDQUFULEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL3ZpZXdlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhc3luYyBmdW5jdGlvbiBWaWV3ZXJBcHAoWSkge1xuXG4gIGNvbnNvbGUubG9nKCdWaWV3ZXJBcHAnKVxuXG4gIFkuVmlld2VyID0gbnVsbFxuXG4gIFkuaXNGdWxseUxvYWRlZCA9IGZhbHNlXG5cbiAgWS5zZXFtYXAgPSB7fVxuXG4gIFkubm9kZXMgPSB7fVxuXG4gIFkubm9kZXMuYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKVxuXG4gIFkubm9kZXMudGh1bWJuYWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aHVtYm5haWxzJylcblxuICBZLm5vZGVzLmJ1dHRvbk1ldGFkYXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG5cbiAgWS5ub2Rlcy5yb3RhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udHJvbC1yb3RhdGUnKVxuXG4gIFkubm9kZXMucGFnZW1ldGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuXG4gIFkubm9kZXMub3NkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29wZW5zZWFkcmFnb24xJylcblxuICBZLm5vZGVzLmRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnI2Rpc3BsYXknKVxuXG4gIFkubm9kZXMudG9nZ2xlUGFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtcGFnZScpXG5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbU91dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250cm9sLXpvb20tb3V0JylcblxuICBZLm5vZGVzLmNvbnRyb2xab29tSW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbC16b29tLWluJylcblxuICBZLm5vZGVzLnRvZ2dsZUxhbmd1YWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keSAubGFuZ3VhZ2UnKVxuXG4gIFkubm9kZXMubmV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmcubmV4dCcpXG5cbiAgWS5ub2Rlcy5wcmV2aW91cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmcucHJldmlvdXMnKVxuXG4gIFkubm9kZXMuc2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG5cbiAgWS5ub2Rlcy5zbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJykgIFxuXG4gIGNvbnN0IHsgXG4gICAgdmlldywgXG4gICAgc2VxdWVuY2UsIFxuICAgIHNlcXVlbmNlQ291bnQsIFxuICAgIGN1cnJlbnQgXG4gIH0gPSBZLm5vZGVzLm9zZC5kYXRhc2V0XG5cbiAgWS5jb3VudCA9IE51bWJlcihzZXF1ZW5jZUNvdW50KVxuXG4gIGZ1bmN0aW9uIHBvc3RNZXNzYWdlKGZpcmUsIG1lc3NhZ2UpIHtcbiAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgZmlyZSwgbWVzc2FnZSB9KSwgJyonKVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xldmlldyhwcm9wcykge1xuICAgIGNvbnN0IHsgdmlldyB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGlmICh2aWV3ID09ICdzaW5nbGUnKSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnZpZXcgPSAnZG91YmxlcGFnZSdcbiAgICB9IGVsc2UgaWYgKHZpZXcgPT0gJ2RvdWJsZXBhZ2UnKSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnZpZXcgPSAnc2luZ2xlJ1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX3BhZ2luZ19jbGljayhlKSB7XG4gICAgY29uc3QgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldFxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIC8qKiB0ZXN0IGlmIHRoZSB0YXJnZXQgaXMgbm90IGFjdGl2ZSAqL1xuICAgIGlmIChjdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkgcmV0dXJuIGZhbHNlXG4gICAgdHJ5IHtcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QuYWRkKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5vcGVyYXRpb24sXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29uKCkge1xuICAgIGNvbnN0IGRvY0VsbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgIGNvbnN0IHRvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3AnKVxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGlmIChidXR0b24pIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgfVxuICAgIGlmIChkb2NFbG0ucmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubXNSZXF1ZXN0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY0VsbS5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBpZiAodG9wKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2UoJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvbicsIHt9KVxuICB9XG5cbiAgZnVuY3Rpb24gZnVsbHNjcmVlbl9vZmYoKSB7XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIHRvcC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgIH1cbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9mZicsIHt9KVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gc2VxbWFwKHByb3BzKSB7XG4gICAgY29uc3QgeyBjb3VudCwgdmlldywgc2VxdWVuY2UgfSA9IHByb3BzXG4gICAgY29uc3Qgc2VxdWVuY2VzID0gW11cbiAgICBzd2l0Y2ggKHZpZXcpIHtcbiAgICAgIGNhc2UgJ2RvdWJsZXBhZ2UnOlxuICAgICAgICBjb25zdCBzZXEgPSBNYXRoLmNlaWwoTnVtYmVyKGNvdW50KSAvIDIpICsgMVxuICAgICAgICBBcnJheShzZXEpLmZpbGwoKS5tYXAoKF8sIGluZGV4KSA9PiB7XG4gICAgICAgICAgc2VxdWVuY2VzLnB1c2goWyBpbmRleCAqIDIsIGluZGV4ICogMiArIDEgXSlcbiAgICAgICAgfSlcbiAgICAgICAgLy8gUmVtb3ZlIDAgZnJvbSBmaXJzdCBpbmRleC5cbiAgICAgICAgc2VxdWVuY2VzWzBdLnNoaWZ0KClcbiAgICAgICAgLy8gTWFrZSBzdXJlIGxhc3QgaW5kZXggZG9lcyBub3QgaW5jbHVkZXMgb3V0Ym91bmQgc2VxdWVuY2VzLlxuICAgICAgICBpZiAoc2VxdWVuY2VzW3NlcXVlbmNlcy5sZW5ndGggLSAxXVsxXSA+IGNvdW50KSB7XG4gICAgICAgICAgc2VxdWVuY2VzW3NlcXVlbmNlcy5sZW5ndGggLSAxXS5wb3AoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzBdID4gY291bnQpIHtcbiAgICAgICAgICBzZXF1ZW5jZXMucG9wKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNlcXVlbmNlcyxcbiAgICAgICAgICBjb3VudCxcbiAgICAgICAgICB2aWV3LCAgICAgICAgICBcbiAgICAgICAgICBzZXF1ZW5jZTogc2VxdWVuY2VzLmZpbmQodmFsdWUgPT4gdmFsdWUuaW5jbHVkZXMoc2VxdWVuY2UpID09PSB0cnVlKSxcbiAgICAgICAgfVxuICAgICAgY2FzZSAnc2luZ2xlJzpcbiAgICAgICAgQXJyYXkoTnVtYmVyKGNvdW50KSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICsgMV0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VxdWVuY2VzLCBcbiAgICAgICAgICBjb3VudCxcbiAgICAgICAgICB2aWV3LFxuICAgICAgICAgIHNlcXVlbmNlOiBbIHNlcXVlbmNlcy5maW5kKHZhbHVlID0+IE51bWJlcih2YWx1ZSkgPT09IE51bWJlcihzZXF1ZW5jZSkpIF0sXG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBsb2FkX3NlcXVlbmNlKGUpIHtcbiAgICBjb25zb2xlLmxvZygnbG9hZF9zZXF1ZW5jZScsIGUpXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9zZCA9IFkubm9kZXMub3NkXG4gICAgICBjb25zdCBkYXRhc2V0ID0gb3NkLmRhdGFzZXRcbiAgICAgIGNvbnN0IHsgb3BlcmF0aW9uLCB0byB9ICA9IGUuZGV0YWlsXG4gICAgICBjb25zdCBmaXJlID0gYHZpZXdlcjpzZXF1ZW5jZToke29wZXJhdGlvbn1gXG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlICdpbmNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgaW5jcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2RlY3JlYXNlJzpcbiAgICAgICAgICBhd2FpdCBkZWNyZWFzZShvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnY2hhbmdlJzpcbiAgICAgICAgICBhd2FpdCBjaGFuZ2UodG8sIG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd0b2dnbGV2aWV3JzpcbiAgICAgICAgICB0b2dnbGV2aWV3KG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgLy8gQ29uZmlndXJhdGlvbiBmb3IgdGhlIG5ldyBzZXF1ZW5jZS5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIGlkOiBvc2QuaWQsXG4gICAgICAgIHRpdGxlOiBkYXRhc2V0LnRpdGxlLFxuICAgICAgICBjb3VudDogWS5jb3VudCxcbiAgICAgICAgdmlldzogZGF0YXNldC52aWV3LFxuICAgICAgICBjdXJyZW50OiBOdW1iZXIoZGF0YXNldC5jdXJyZW50KSxcbiAgICAgICAgc2VxdWVuY2U6IE51bWJlcihkYXRhc2V0LnNlcXVlbmNlKSxcbiAgICAgICAgaWRlbnRpZmllcjogZGF0YXNldC5pZGVudGlmaWVyLFxuICAgICAgICB1cmk6IGAke2RhdGFzZXQudXJpfS8ke2RhdGFzZXQuc2VxdWVuY2V9YCxcbiAgICAgIH1cblxuICAgICAgWS5zZXFtYXAgPSBhd2FpdCBzZXFtYXAobWVzc2FnZSlcblxuICAgICAgcG9zdE1lc3NhZ2UoeyBmaXJlLCBtZXNzYWdlIH0pXG5cbiAgICAgIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIGRhdGFzZXQpXG5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLnNlcXVlbmNlLmpvaW4oJyAtICcpXG5cbiAgICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChkYXRhc2V0LnNlcXVlbmNlID49IFkuc2VxbWFwLmNvdW50KSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA8PSAxKSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG5cbiAgICAgIHNob3coJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgICAgIHNob3coJyNwYWdlcicpXG5cbiAgICAgIFkuVmlld2VyLm9wZW4odGlsZVNvdXJjZXMpXG5cbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuXG4gICAgICBZLmlzRnVsbHlMb2FkZWQgPSB0cnVlXG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29uKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgIGVsZW1lbnQuY2xvc2VzdCgnLnBhbmUtYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2VtZXRhLWhpZGRlbicpXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgZmlyZTogJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b24nLFxuICAgICAgbWVzc2FnZToge31cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25fYnV0dG9uX21ldGFkYXRhX29mZigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcbiAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICBlbGVtZW50LmNsb3Nlc3QoJy5wYW5lLWJvZHknKS5jbGFzc0xpc3QuYWRkKCdwYWdlbWV0YS1oaWRkZW4nKVxuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgIGZpcmU6ICdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsXG4gICAgICBtZXNzYWdlOiB7fVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiB0aWxlc19sb2FkaW5nKCkge1xuICAgIGlmIChib2R5LmNsYXNzTGlzdC5jb250YWlucygnb3BlbmxheWVycy1sb2FkaW5nJykpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aWxlc19sb2FkaW5nKClcbiAgICAgIH0sIDEwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGUoJy5wYW5lLmxvYWQnKVxuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yKCkge1xuICAgIGlmIChZLmlzRnVsbHlMb2FkZWQpIHtcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgICAgaGlkZSgnLnBhbmUubG9hZCcpXG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGZpcmU6ICd2aWV3ZXI6bG9hZGVkJyxcbiAgICAgICAgbWVzc2FnZToge31cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkX2l0ZW1faGFuZGxlcihldmVudCkge1xuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKDApXG4gICAgY29uc3QgdGlsZWRJbWFnZSA9IGV2ZW50Lml0ZW1cbiAgICB0aWxlZEltYWdlLmFkZEhhbmRsZXIoJ2Z1bGx5LWxvYWRlZC1jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdGdWxseUxvYWRlZCA9IGFyZV9hbGxfZnVsbHlfbG9hZGVkKClcbiAgICAgIGlmIChuZXdGdWxseUxvYWRlZCAhPT0gWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICAgIFkuaXNGdWxseUxvYWRlZCA9IG5ld0Z1bGx5TG9hZGVkXG4gICAgICAgIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZV9hbGxfZnVsbHlfbG9hZGVkKCkge1xuICAgIGNvbnN0IGNvdW50ID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUNvdW50KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBZLlZpZXdlci53b3JsZC5nZXRJdGVtQXQoaSlcbiAgICAgIGlmICghdGlsZWRJbWFnZS5nZXRGdWxseUxvYWRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gb25faGlkZV90aHVtYm5haWxzX3ZpZXcoKSB7XG4gICAgY29uc3Qgb3NkID0gWS5ub2Rlcy5vc2RcbiAgICBjb25zdCB7IHNlcXVlbmNlQ291bnQsIHNlcXVlbmNlIH0gPSBvc2QuZGF0YXNldFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcbiAgICAvLyBUb2dnbGUgdmlldyBvZiBib29rcyBwYWdlIGljb24uXG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG4gICAgWS5ub2Rlcy5wcmV2aW91cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlID4gMSkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG4gICAgWS5ub2Rlcy5uZXh0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoc2VxdWVuY2UgPCBzZXF1ZW5jZUNvdW50KSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX29wZW5fdGh1bWJuYWlsc192aWV3KCkge1xuICAgIGNvbnN0IHsgdXJpIH0gPSBZLm5vZGVzLm9zZC5kYXRhc2V0XG4gICAgY29uc3QgeyBzdGF0ZSB9ID0gWS5ub2Rlcy50aHVtYm5haWxzLmRhdGFzZXRcbiAgICBjb25zdCB3aWR0aCA9ICcyMzAnXG4gICAgY29uc3QgaGVpZ2h0ID0gJzE1MCdcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LmFkZCgndGh1bWJuYWlscy12aWV3JylcbiAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAvLyBUb2dnbGUgdmlldyBvZiBib29rcyBwYWdlIGljb24uXG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH1cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG4gICAgWS5ub2Rlcy5wcmV2aW91cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfSlcbiAgICBpZiAocGFyc2VJbnQoc3RhdGUsIDEwKSA9PT0gMCkge1xuICAgICAgYXhpb3MuZ2V0KGAke3VyaX0vdGh1bWJuYWlscz9wamF4PXRydWUmd2lkdGg9JHt3aWR0aH0maGVpZ2h0PSR7aGVpZ2h0fWApLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcbiAgICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICAgICBZLm5vZGVzLnRodW1ibmFpbHMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBkb2MucXVlcnlTZWxlY3RvcignLnRodW1ibmFpbHMuY29udGFpbmVyJylcbiAgICAgICAgICApXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRodW1ibmFpbHMuY29udGFpbmVyIGEnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVGh1bWJuYWlsc0NsaWNrKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgWS5ub2Rlcy50aHVtYm5haWxzLmRhdGFzZXQuc3RhdGUgPSAxXG4gICAgICAgIH1cbiAgICAgICAgc2hvdygnI3RodW1ibmFpbHMnKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblRodW1ibmFpbHNDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zdCBidXR0b25UaHVtYm5haWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi10aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LnJlbW92ZSgndGh1bWJuYWlscy12aWV3JylcbiAgICBpZiAoYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgIGJ1dHRvblRodW1ibmFpbHMuY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgIH1cbiAgICBoaWRlKCcjdGh1bWJuYWlscycpXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnNlcXVlbmNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNsaWRlX3ZhbHVlX2NoYW5nZShldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50KVxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgdG86IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUsXG4gICAgICAgICAgdHJpZ2dlcjogJ2NoYW5nZScsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZGVjcmVhc2UocHJvcHMpIHtcbiAgICBjb25zdCB7IHZpZXcsIGlkZW50aWZpZXIsIHR5cGUgfSA9IHByb3BzLmRhdGFzZXRcbiAgICBjb25zdCB0byA9IE1hdGgubWluKC4uLlkuc2VxbWFwLnNlcXVlbmNlKSAtIDFcbiAgICBpZiAodG8gPCAxKSB7XG4gICAgICByZXR1cm4gdG9cbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcHMuZGF0YXNldC5zZXF1ZW5jZSA9IHRvLnRvU3RyaW5nKClcbiAgICAgIGNvbnN0IHJhbmdlX3dlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuICAgICAgY29uc3Qgc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG4gICAgICBpZiAocmFuZ2Vfd2VpZ2h0ICYmIHNsaWRlcl92YWx1ZSkge1xuICAgICAgICByYW5nZV93ZWlnaHQudmFsdWUgPSB0b1xuICAgICAgICBzbGlkZXJfdmFsdWUudmFsdWUgPSB0b1xuICAgICAgfVxuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgdmlldywgc2VxdWVuY2U6IHRvLCBpZGVudGlmaWVyLCB0eXBlIH0sICcnLCBgLyR7dHlwZX0vJHtpZGVudGlmaWVyfS8ke3RvfWApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gY2hhbmdlKHRvLCBwcm9wcykge1xuICAgIGNvbnN0IHsgaWRlbnRpZmllciwgdHlwZSwgc2VxdWVuY2VDb3VudCB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGNvbnN0IHNlcXVlbmNlID0gTnVtYmVyKHRvKVxuICAgIGNvbnN0IHNlcXVlbmNlX2NvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG4gICAgaWYgKHNlcXVlbmNlIDwgMSkge1xuICAgICAgcmV0dXJuIDFcbiAgICB9IGVsc2UgaWYgKHNlcXVlbmNlID4gc2VxdWVuY2VfY291bnQpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZV9jb3VudFxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gc2VxdWVuY2UudG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyB2aWV3LCBzZXF1ZW5jZSwgaWRlbnRpZmllciwgdHlwZSB9LCAnJywgYC8ke3R5cGV9LyR7aWRlbnRpZmllcn0vJHtzZXF1ZW5jZX1gKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBldmVudFR5cGUsIGNoaWxkU2VsZWN0b3IsIGV2ZW50SGFuZGxlcikge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudE9uRWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChldmVudE9uRWxlbWVudC50YXJnZXQubWF0Y2hlcyhjaGlsZFNlbGVjdG9yKSkge1xuICAgICAgICAgIGV2ZW50SGFuZGxlcihldmVudE9uRWxlbWVudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoaWRlKHNlbGVjdG9yKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaChlbG0gPT4ge1xuICAgICAgZWxtLnN0eWxlLmRpc3BsYXkgPSBudWxsXG4gICAgICBlbG0uc3R5bGUudmlzaWJpbGl0eSA9IG51bGxcbiAgICAgIGVsbS5oaWRkZW4gPSBudWxsXG4gICAgICBlbG0uaGVpZ2h0ID0gMFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBpbmNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkZW50aWZpZXIsIFxuICAgICAgdHlwZSwgXG4gICAgICB2aWV3LCBcbiAgICAgIHNlcXVlbmNlQ291bnRcbiAgICB9ID0gcHJvcHMuZGF0YXNldFxuXG4gICAgY29uc3QgdG8gPSBNYXRoLm1heCguLi5ZLnNlcW1hcC5zZXF1ZW5jZSkgKyAxXG4gICAgXG4gICAgaWYgKHRvID4gTnVtYmVyKHNlcXVlbmNlQ291bnQpKSB7XG4gICAgICByZXR1cm4gc2VxdWVuY2VDb3VudFxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyB2aWV3LCBzZXF1ZW5jZTogdG8sIGlkZW50aWZpZXIsIHR5cGUgfSwgJycsIGAvJHt0eXBlfS8ke2lkZW50aWZpZXJ9LyR7dG99YClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzaG93KHNlbGVjdG9yKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaChlbG0gPT4ge1xuICAgICAgZWxtLnN0eWxlLmRpc3BsYXkgPSBudWxsXG4gICAgICBlbG0uc3R5bGUudmlzaWJpbGl0eSA9IG51bGxcbiAgICAgIGVsbS5oaWRkZW4gPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHRpbGVzKHNlcW1hcCwgZGF0YXNldCkge1xuICAgIHJldHVybiBzZXFtYXAuc2VxdWVuY2UubWFwKChzZXF1ZW5jZSwgeCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGlsZVNvdXJjZTogYCR7ZGF0YXNldC5zZXJ2aWNlfS8ke2RhdGFzZXQudHlwZX0vJHtkYXRhc2V0LmlkZW50aWZpZXJ9LyR7c2VxdWVuY2V9L2luZm8uanNvbmAsIHhcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoJ3ZpZXdlcjppbml0Jywge30pXG5cbiAgcG9zdE1lc3NhZ2UoJ3ZpZXdlcjpjb250ZW50cmVhZHknLCB7fSlcblxuICAvLyBDYWxscyB0aWxlcyBsb2FkaW5nLlxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBDdXN0b21FdmVudCgndmlld2VyOmNvbnRlbnRyZWFkeScpXG4gIClcblxuICBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlICYmIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgIH1cbiAgfVxuXG4gIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKHsgY291bnQ6IFkuY291bnQsIHZpZXcsIHNlcXVlbmNlLCBjdXJyZW50IH0pXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnRfcGFnZScpLnRleHRDb250ZW50ID0gXG4gICAgWS5ub2Rlcy5vc2QuZGF0YXNldC5zZXF1ZW5jZSA9IHNlcXVlbmNlXG4gIFxuICBpZiAoWS5ub2Rlcy5zbGlkZXIpIHtcbiAgICBZLm5vZGVzLnNsaWRlci52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cbiAgXG4gIGlmIChZLm5vZGVzLnNsaWRlcl92YWx1ZSkge1xuICAgIFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlID0gc2VxdWVuY2VcbiAgfVxuXG4gIC8vIFkubm9kZXMuc2xpZGVyLm1heCA9IFkuc2VxbWFwLmNvdW50XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlcXVlbmNlX2NvdW50JykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLnRleHRDb250ZW50ID0gWS5zZXFtYXAuY291bnRcbiAgfSlcblxuICBjb25zdCB0aWxlU291cmNlcyA9IGF3YWl0IHRpbGVzKFkuc2VxbWFwLCBZLm5vZGVzLm9zZC5kYXRhc2V0KVxuXG4gIFkuVmlld2VyID0gWS5PcGVuU2VhZHJhZ29uKHtcbiAgICBpZDogWS5ub2Rlcy5vc2QuaWQsXG4gICAgcHJlc2VydmVWaWV3cG9ydDogdHJ1ZSxcbiAgICBzaG93TmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dab29tQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd0hvbWVDb250cm9sOiBmYWxzZSxcbiAgICBzaG93RnVsbFBhZ2VDb250cm9sOiBmYWxzZSxcbiAgICB2aXNpYmlsaXR5UmF0aW86IDEsXG4gICAgbWluWm9vbUxldmVsOiAwLFxuICAgIGRlZmF1bHRab29tTGV2ZWw6IDAsXG4gICAgc2VxdWVuY2VNb2RlOiBmYWxzZSxcbiAgICB0aWxlU291cmNlczogdGlsZVNvdXJjZXMsXG4gIH0pXG5cbiAgLy8gT3BlblNlYWRyYWdvbiBldmVudC5cbiAgWS5WaWV3ZXIud29ybGQuYWRkSGFuZGxlcignYWRkLWl0ZW0nLCBhZGRfaXRlbV9oYW5kbGVyKVxuXG4gIC8vIE9wZW5TZWFkcmFnb24gZXZlbnQuXG4gIFkuVmlld2VyLmFkZEhhbmRsZXIoJ3pvb20nLCAoKSA9PiB7XG5cbiAgICBpZiAoWS5ub2Rlcy5vc2QuaGlkZGVuKSByZXR1cm5cblxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA8IG1heFpvb20gJiZcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJylcbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tID49IG1heFpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tIDw9IG1pblpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPiBtaW5ab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG5cbiAgfSlcblxuICBjb25zdCBmb3JtU2VxdWVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZm9ybS11cGRhdGUtc2VxdWVuY2UnKVxuICBpZiAoZm9ybVNlcXVlbmNlICYmIFkubm9kZXMuc2xpZGVyX3ZhbHVlKSB7XG4gICAgZm9ybVNlcXVlbmNlLm9uc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgICAgdG86IFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlLFxuICAgICAgICAgICAgdHJpZ2dlcjogJ29uc3VibWl0JyxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBpbiBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1heFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNYXhab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbVRvID0gYWN0dWFsWm9vbSAqIDJcbiAgICBpZiAoYWN0dWFsWm9vbSA8IG1heFpvb20pIHtcbiAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21Ubyh6b29tVG8pXG4gICAgfVxuICAgIC8vIGxvb2sgZm9yIGV2ZW50IG9wdGlvbnMgKE9wZW5TZWFEcmFnb24gem9vbSBlbmQpXG4gICAgaWYgKHpvb21UbyA+PSBtYXhab29tKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH1cbiAgICBpZiAoYWN0dWFsWm9vbSA+IG1pblpvb20pIHtcbiAgICAgIGlmIChZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbSA9IGFjdHVhbFpvb20gLyAyXG4gICAgaWYgKHpvb20gPj0gbWluWm9vbSkge1xuICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKHpvb20pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhY3R1YWxab29tID4gbWluWm9vbSkge1xuICAgICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8obWluWm9vbSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5yb3RhdGUub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgWS5WaWV3ZXIudmlld3BvcnQuc2V0Um90YXRpb24oWS5WaWV3ZXIudmlld3BvcnQuZGVncmVlcyArIDkwKVxuICB9XG5cbiAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZG91YmxlJylcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utc2luZ2xlJylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1zaW5nbGUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1kb3VibGUnKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5vcGVyYXRpb24sXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EucGFnaW5nJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fcGFnaW5nX2NsaWNrKVxuICB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYnV0dG9uJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgIGxldCBldmVudF9wcmVmaXggPSBgYnV0dG9uOiR7Y3VycmVudF90YXJnZXQuaWR9YFxuICAgICAgLyoqIGRvbid0IHdhc3RlIHRpbWUgaWYgdGhlIGJ1dHRvbiBpcyBpbmFjdGl2ZSAqL1xuICAgICAgaWYgKGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9mZmAsIGV2ZW50KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9uYCwgZXZlbnQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9OnRvZ2dsZWAsIGV2ZW50KVxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgaWYgKFkubm9kZXMuc2xpZGVyKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2xpZGVfdmFsdWVfY2hhbmdlKVxuICB9ICBcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkOnNlcXVlbmNlJywgbG9hZF9zZXF1ZW5jZSlcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gICAgY29uc29sZS5sb2coaGlzdG9yeS5zdGF0ZS5zZXF1ZW5jZSlcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBoaXN0b3J5LnN0YXRlLnNlcXVlbmNlLFxuICAgICAgICAgIHRyaWdnZXI6ICdwb3BzdGF0ZScsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuXG4gIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywgZnVsbHNjcmVlbl9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywgZnVsbHNjcmVlbl9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld2VyOmNvbnRlbnRyZWFkeScsIHRpbGVzX2xvYWRpbmcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9uJywgb25fb3Blbl90aHVtYm5haWxzX3ZpZXcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9mZicsIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KVxuXG4gIC8vIExhbmd1YWdlLlxuICBkZWxlZ2F0ZSgnYm9keScsICdjaGFuZ2UnLCAnLmxhbmctb3B0aW9ucyBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBheGlvcy5nZXQoY3VycmVudF90YXJnZXQudmFsdWUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICBjb25zdCBwYW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IHBhZ2VtZXRhID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmUubWFpbicpXG4gICAgICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJylcbiAgICAgICAgaHRtbC5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBtYWluLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5pbm5lckhUTUwgPSBwYWdlbWV0YS5pbm5lckhUTUxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZvbHVtZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy52aWV3LW12IHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGNvbnN0IHZhbHVlID0gY3VycmVudF90YXJnZXQudmFsdWVcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vZGUtZGx0cy1ib29rJylcbiAgICBjb25zdCBsYW5nID0gbm9kZS5kYXRhc2V0LmxhbmdcbiAgICBjb25zdCB1cmwgPSB2YWx1ZS5zdWJzdHJpbmcodmFsdWUuaW5kZXhPZignOjonKSArIDIsIHZhbHVlLmxlbmd0aCkgKyAnLzE/bGFuZz0nICsgbGFuZ1xuICAgIGlmICh3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgZmlyZTogJ2NoYW5nZTpvcHRpb246bXVsdGl2b2x1bWUnLFxuICAgICAgICBtZXNzYWdlOiB7IHVybCB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxufVxuXG5WaWV3ZXJBcHAoeyBPcGVuU2VhZHJhZ29uOiB3aW5kb3cuT3BlblNlYWRyYWdvbiwgYXhpb3MgfSlcbiJdLCJuYW1lcyI6WyJWaWV3ZXJBcHAiLCJZIiwicG9zdE1lc3NhZ2UiLCJ0b2dnbGV2aWV3Iiwib25fcGFnaW5nX2NsaWNrIiwiZnVsbHNjcmVlbl9vbiIsImZ1bGxzY3JlZW5fb2ZmIiwic2VxbWFwIiwibG9hZF9zZXF1ZW5jZSIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vbiIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vZmYiLCJ0aWxlc19sb2FkaW5nIiwidXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yIiwiYWRkX2l0ZW1faGFuZGxlciIsImFyZV9hbGxfZnVsbHlfbG9hZGVkIiwib25faGlkZV90aHVtYm5haWxzX3ZpZXciLCJvbl9vcGVuX3RodW1ibmFpbHNfdmlldyIsIm9uVGh1bWJuYWlsc0NsaWNrIiwic2xpZGVfdmFsdWVfY2hhbmdlIiwiZGVjcmVhc2UiLCJjaGFuZ2UiLCJkZWxlZ2F0ZSIsImhpZGUiLCJpbmNyZWFzZSIsInNob3ciLCJ0aWxlcyIsImRhdGFzZXQiLCJzZXF1ZW5jZSIsIm1hcCIsIngiLCJ0aWxlU291cmNlIiwic2VydmljZSIsInR5cGUiLCJpZGVudGlmaWVyIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWxtIiwic3R5bGUiLCJkaXNwbGF5IiwidmlzaWJpbGl0eSIsImhpZGRlbiIsInByb3BzIiwidmlldyIsInNlcXVlbmNlQ291bnQiLCJ0byIsIk1hdGgiLCJtYXgiLCJOdW1iZXIiLCJ0b1N0cmluZyIsInJhbmdlX3dlaWdodCIsInF1ZXJ5U2VsZWN0b3IiLCJzbGlkZXJfdmFsdWUiLCJ2YWx1ZSIsIndpbmRvdyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJoZWlnaHQiLCJldmVudFR5cGUiLCJjaGlsZFNlbGVjdG9yIiwiZXZlbnRIYW5kbGVyIiwiZWxlbWVudHMiLCJlbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50T25FbGVtZW50IiwidGFyZ2V0IiwibWF0Y2hlcyIsInNlcXVlbmNlX2NvdW50IiwibWluIiwiZXZlbnQiLCJjb25zb2xlIiwibG9nIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwib3BlcmF0aW9uIiwiY3VycmVudFRhcmdldCIsInRyaWdnZXIiLCJwcmV2ZW50RGVmYXVsdCIsImJ1dHRvblRodW1ibmFpbHMiLCJnZXRFbGVtZW50QnlJZCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImNvbnRhaW5zIiwiYWRkIiwidXJpIiwibm9kZXMiLCJvc2QiLCJzdGF0ZSIsInRodW1ibmFpbHMiLCJ3aWR0aCIsImNvbnRyb2xab29tT3V0IiwiY29udHJvbFpvb21JbiIsInRvZ2dsZVBhZ2UiLCJuZXh0IiwiaXRlbSIsInByZXZpb3VzIiwicGFyc2VJbnQiLCJheGlvcyIsImdldCIsInRoZW4iLCJyZXNwb25zZSIsInN0YXR1cyIsInBhcnNlciIsIkRPTVBhcnNlciIsImRvYyIsInBhcnNlRnJvbVN0cmluZyIsImRhdGEiLCJhcHBlbmRDaGlsZCIsImVycm9yIiwiY291bnQiLCJWaWV3ZXIiLCJ3b3JsZCIsImdldEl0ZW1Db3VudCIsImkiLCJ0aWxlZEltYWdlIiwiZ2V0SXRlbUF0IiwiZ2V0RnVsbHlMb2FkZWQiLCJ2aWV3cG9ydCIsInNldFJvdGF0aW9uIiwiYWRkSGFuZGxlciIsIm5ld0Z1bGx5TG9hZGVkIiwiaXNGdWxseUxvYWRlZCIsImJvZHkiLCJmaXJlIiwibWVzc2FnZSIsInNldFRpbWVvdXQiLCJidXR0b24iLCJjbG9zZXN0IiwiZSIsImlkIiwidGl0bGUiLCJjdXJyZW50IiwidGlsZVNvdXJjZXMiLCJ0ZXh0Q29udGVudCIsImpvaW4iLCJvcGVuIiwic2VxdWVuY2VzIiwic2VxIiwiY2VpbCIsIkFycmF5IiwiZmlsbCIsIl8iLCJpbmRleCIsInB1c2giLCJzaGlmdCIsImxlbmd0aCIsInBvcCIsImZpbmQiLCJpbmNsdWRlcyIsInRvcCIsImV4aXRGdWxsc2NyZWVuIiwibXNFeGl0RnVsbHNjcmVlbiIsIm1vekNhbmNlbEZ1bGxTY3JlZW4iLCJ3ZWJraXRDYW5jZWxGdWxsU2NyZWVuIiwiZG9jRWxtIiwiZG9jdW1lbnRFbGVtZW50IiwicmVxdWVzdEZ1bGxzY3JlZW4iLCJtc1JlcXVlc3RGdWxsc2NyZWVuIiwibW96UmVxdWVzdEZ1bGxTY3JlZW4iLCJ3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJidXR0b25NZXRhZGF0YSIsInJvdGF0ZSIsInBhZ2VtZXRhIiwidG9nZ2xlTGFuZ3VhZ2UiLCJzbGlkZXIiLCJPcGVuU2VhZHJhZ29uIiwicHJlc2VydmVWaWV3cG9ydCIsInNob3dOYXZpZ2F0aW9uQ29udHJvbCIsInNob3dab29tQ29udHJvbCIsInNob3dIb21lQ29udHJvbCIsInNob3dGdWxsUGFnZUNvbnRyb2wiLCJ2aXNpYmlsaXR5UmF0aW8iLCJtaW5ab29tTGV2ZWwiLCJkZWZhdWx0Wm9vbUxldmVsIiwic2VxdWVuY2VNb2RlIiwiYWN0dWFsWm9vbSIsImdldFpvb20iLCJtYXhab29tIiwiZ2V0TWF4Wm9vbSIsIm1pblpvb20iLCJnZXRNaW5ab29tIiwiZm9ybVNlcXVlbmNlIiwib25zdWJtaXQiLCJvbmNsaWNrIiwiem9vbVRvIiwiem9vbSIsImRlZ3JlZXMiLCJjdXJyZW50X3RhcmdldCIsImV2ZW50X3ByZWZpeCIsInBhbmUiLCJtYWluIiwiaHRtbCIsImRpciIsImlubmVySFRNTCIsIm5vZGUiLCJsYW5nIiwidXJsIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInNlbGYiLCJsb2NhdGlvbiIsImFzc2lnbiJdLCJzb3VyY2VSb290IjoiIn0=