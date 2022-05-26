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
            }

            document.querySelectorAll('.sequence_count').forEach(function (item) {
              item.textContent = Y.seqmap.count;
            });
            _context7.next = 65;
            return tiles(Y.seqmap, Y.nodes.osd.dataset);

          case 65:
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

          case 101:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O2NBQ25EcEcsT0FBTyxDQUFDQyxHQUFSLENBQVksQ0FBQyxZQUFELEVBQWUsV0FBZixDQUFaO1lBQ0QsQ0FGRCxFQWgwQkYsQ0FvMEJFOztZQUNBN0csQ0FBQyxDQUFDK00sVUFBRixDQUFhQyxJQUFiLENBQWtCLENBQUMsY0FBRCxFQUFpQixXQUFqQixDQUFsQixFQUFpRCxZQUFNO2NBQ3JEcEcsT0FBTyxDQUFDQyxHQUFSLENBQVksQ0FBQyxjQUFELEVBQWlCLFdBQWpCLENBQVo7WUFDRCxDQUZELEVBcjBCRixDQXkwQkU7O1lBQ0E3RyxDQUFDLENBQUMrTSxVQUFGLENBQWFDLElBQWIsQ0FBa0IsQ0FBQyxHQUFELENBQWxCLEVBQXlCLFlBQU07Y0FDN0JwRyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxDQUFDLEdBQUQsQ0FBWjtZQUNELENBRkQsRUExMEJGLENBODBCRTs7WUFDQTdHLENBQUMsQ0FBQytNLFVBQUYsQ0FBYUMsSUFBYixDQUFrQixDQUFDLEdBQUQsRUFBTSxHQUFOLENBQWxCLEVBQThCLFlBQU07Y0FDbENwRyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBQVo7WUFDRCxDQUZELEVBLzBCRixDQW0xQkU7O1lBQ0E3RyxDQUFDLENBQUMrTSxVQUFGLENBQWFDLElBQWIsQ0FBa0IsQ0FBQyxVQUFELENBQWxCLEVBQWdDLFlBQU07Y0FDcENwRyxPQUFPLENBQUNDLEdBQVIsQ0FBWSxVQUFaO1lBQ0QsQ0FGRDs7VUFwMUJGO1VBQUE7WUFBQTtRQUFBO01BQUE7SUFBQTtFQUFBOzs7O0FBMDFCQTlHLFNBQVMsQ0FBQztFQUFFb0wsYUFBYSxFQUFFN0gsTUFBTSxDQUFDNkgsYUFBeEI7RUFBdUNuRixLQUFLLEVBQUxBLEtBQXZDO0VBQThDK0csVUFBVSxFQUFWQTtBQUE5QyxDQUFELENBQVQsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RsdHNfdmlld2VyLy4vanMvdmlld2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIFZpZXdlckFwcChZKSB7XG5cbiAgY29uc29sZS5sb2coJ1ZpZXdlckFwcCcpXG5cbiAgWS5WaWV3ZXIgPSBudWxsXG5cbiAgWS5pc0Z1bGx5TG9hZGVkID0gZmFsc2VcblxuICBZLnNlcW1hcCA9IHt9XG5cbiAgWS5ub2RlcyA9IHt9XG5cbiAgWS5ub2Rlcy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXG5cbiAgWS5ub2Rlcy50aHVtYm5haWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RodW1ibmFpbHMnKVxuXG4gIFkubm9kZXMuYnV0dG9uTWV0YWRhdGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcblxuICBZLm5vZGVzLnJvdGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sLXJvdGF0ZScpXG5cbiAgWS5ub2Rlcy5wYWdlbWV0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG5cbiAgWS5ub2Rlcy5vc2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3BlbnNlYWRyYWdvbjEnKVxuXG4gIFkubm9kZXMuZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcjZGlzcGxheScpXG5cbiAgWS5ub2Rlcy50b2dnbGVQYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1wYWdlJylcblxuICBZLm5vZGVzLmNvbnRyb2xab29tT3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1vdXQnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21JbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250cm9sLXpvb20taW4nKVxuXG4gIFkubm9kZXMudG9nZ2xlTGFuZ3VhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5IC5sYW5ndWFnZScpXG5cbiAgWS5ub2Rlcy5uZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5uZXh0JylcblxuICBZLm5vZGVzLnByZXZpb3VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5wcmV2aW91cycpXG5cbiAgWS5ub2Rlcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcblxuICBZLm5vZGVzLnNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKSAgXG5cbiAgY29uc3Qge1xuICAgIHZpZXcsIFxuICAgIHNlcXVlbmNlLCBcbiAgICBzZXF1ZW5jZUNvdW50LCBcbiAgICBjdXJyZW50LFxuICAgIHR5cGVcbiAgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcblxuICBZLmNvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG5cbiAgZnVuY3Rpb24gcG9zdE1lc3NhZ2UoZmlyZSwgbWVzc2FnZSkge1xuICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBmaXJlLCBtZXNzYWdlIH0pLCAnKicpXG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGV2aWV3KHByb3BzKSB7XG4gICAgY29uc3QgeyB2aWV3IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgaWYgKHZpZXcgPT0gJ3NpbmdsZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdkb3VibGVwYWdlJ1xuICAgIH0gZWxzZSBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdzaW5nbGUnXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fcGFnaW5nX2NsaWNrKGUpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgLyoqIHRlc3QgaWYgdGhlIHRhcmdldCBpcyBub3QgYWN0aXZlICovXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICB0cnkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb24oKSB7XG4gICAgY29uc3QgZG9jRWxtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICB9XG4gICAgaWYgKGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywge30pXG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29mZigpIHtcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgdG9wLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywge30pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzZXFtYXAocHJvcHMpIHtcbiAgICBjb25zdCB7IGNvdW50LCB2aWV3LCBzZXF1ZW5jZSB9ID0gcHJvcHNcbiAgICBjb25zdCBzZXF1ZW5jZXMgPSBbXVxuICAgIHN3aXRjaCAodmlldykge1xuICAgICAgY2FzZSAnZG91YmxlcGFnZSc6XG4gICAgICAgIGNvbnN0IHNlcSA9IE1hdGguY2VpbChOdW1iZXIoY291bnQpIC8gMikgKyAxXG4gICAgICAgIEFycmF5KHNlcSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICogMiwgaW5kZXggKiAyICsgMSBdKVxuICAgICAgICB9KVxuICAgICAgICAvLyBSZW1vdmUgMCBmcm9tIGZpcnN0IGluZGV4LlxuICAgICAgICBzZXF1ZW5jZXNbMF0uc2hpZnQoKVxuICAgICAgICAvLyBNYWtlIHN1cmUgbGFzdCBpbmRleCBkb2VzIG5vdCBpbmNsdWRlcyBvdXRib3VuZCBzZXF1ZW5jZXMuXG4gICAgICAgIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzFdID4gY291bnQpIHtcbiAgICAgICAgICBzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMF0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlcy5wb3AoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VxdWVuY2VzLFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsICAgICAgICAgIFxuICAgICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiB2YWx1ZS5pbmNsdWRlcyhzZXF1ZW5jZSkgPT09IHRydWUpLFxuICAgICAgICB9XG4gICAgICBjYXNlICdzaW5nbGUnOlxuICAgICAgICBBcnJheShOdW1iZXIoY291bnQpKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKyAxXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsIFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsXG4gICAgICAgICAgc2VxdWVuY2U6IFsgc2VxdWVuY2VzLmZpbmQodmFsdWUgPT4gTnVtYmVyKHZhbHVlKSA9PT0gTnVtYmVyKHNlcXVlbmNlKSkgXSxcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRfc2VxdWVuY2UoZSkge1xuICAgIGNvbnNvbGUubG9nKCdsb2FkX3NlcXVlbmNlJywgZSlcbiAgICB0cnkge1xuICAgICAgY29uc3Qgb3NkID0gWS5ub2Rlcy5vc2RcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBvc2QuZGF0YXNldFxuICAgICAgY29uc3QgeyBvcGVyYXRpb24sIHRvIH0gID0gZS5kZXRhaWxcbiAgICAgIGNvbnN0IGZpcmUgPSBgdmlld2VyOnNlcXVlbmNlOiR7b3BlcmF0aW9ufWBcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICAgIGNhc2UgJ2luY3JlYXNlJzpcbiAgICAgICAgICBhd2FpdCBpbmNyZWFzZShvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnZGVjcmVhc2UnOlxuICAgICAgICAgIGF3YWl0IGRlY3JlYXNlKG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdjaGFuZ2UnOlxuICAgICAgICAgIGF3YWl0IGNoYW5nZSh0bywgb3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3RvZ2dsZXZpZXcnOlxuICAgICAgICAgIHRvZ2dsZXZpZXcob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICAvLyBDb25maWd1cmF0aW9uIGZvciB0aGUgbmV3IHNlcXVlbmNlLlxuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgaWQ6IG9zZC5pZCxcbiAgICAgICAgdGl0bGU6IGRhdGFzZXQudGl0bGUsXG4gICAgICAgIGNvdW50OiBZLmNvdW50LFxuICAgICAgICB2aWV3OiBkYXRhc2V0LnZpZXcsXG4gICAgICAgIGN1cnJlbnQ6IE51bWJlcihkYXRhc2V0LmN1cnJlbnQpLFxuICAgICAgICBzZXF1ZW5jZTogTnVtYmVyKGRhdGFzZXQuc2VxdWVuY2UpLFxuICAgICAgICBpZGVudGlmaWVyOiBkYXRhc2V0LmlkZW50aWZpZXIsXG4gICAgICAgIHVyaTogYCR7ZGF0YXNldC51cml9LyR7ZGF0YXNldC5zZXF1ZW5jZX1gLFxuICAgICAgfVxuXG4gICAgICBZLnNlcW1hcCA9IGF3YWl0IHNlcW1hcChtZXNzYWdlKVxuXG4gICAgICBwb3N0TWVzc2FnZSh7IGZpcmUsIG1lc3NhZ2UgfSlcblxuICAgICAgY29uc3QgdGlsZVNvdXJjZXMgPSBhd2FpdCB0aWxlcyhZLnNlcW1hcCwgZGF0YXNldClcblxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnRfcGFnZScpLnRleHRDb250ZW50ID0gWS5zZXFtYXAuc2VxdWVuY2Uuam9pbignIC0gJylcblxuICAgICAgWS5ub2Rlcy5uZXh0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGRhdGFzZXQuc2VxdWVuY2UgPj0gWS5zZXFtYXAuY291bnQpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgWS5ub2Rlcy5wcmV2aW91cy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChkYXRhc2V0LnNlcXVlbmNlIDw9IDEpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gVG9nZ2xlIHZpZXcgb2YgYm9va3MgcGFnZSBpY29uLlxuICAgICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIH1cblxuICAgICAgc2hvdygnI29wZW5zZWFkcmFnb24xJylcblxuICAgICAgc2hvdygnI3BhZ2VyJylcblxuICAgICAgWS5WaWV3ZXIub3Blbih0aWxlU291cmNlcylcblxuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG5cbiAgICAgIFkuaXNGdWxseUxvYWRlZCA9IHRydWVcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbl9idXR0b25fbWV0YWRhdGFfb24oKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvbicpXG4gICAgZWxlbWVudC5jbG9zZXN0KCcucGFuZS1ib2R5JykuY2xhc3NMaXN0LnJlbW92ZSgncGFnZW1ldGEtaGlkZGVuJylcbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICBmaXJlOiAnYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsXG4gICAgICBtZXNzYWdlOiB7fVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBvbl9idXR0b25fbWV0YWRhdGFfb2ZmKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIGVsZW1lbnQuY2xvc2VzdCgnLnBhbmUtYm9keScpLmNsYXNzTGlzdC5hZGQoJ3BhZ2VtZXRhLWhpZGRlbicpXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgZmlyZTogJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b2ZmJyxcbiAgICAgIG1lc3NhZ2U6IHt9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbGVzX2xvYWRpbmcoKSB7XG4gICAgaWYgKGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVubGF5ZXJzLWxvYWRpbmcnKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbGVzX2xvYWRpbmcoKVxuICAgICAgfSwgMTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlkZSgnLnBhbmUubG9hZCcpXG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IoKSB7XG4gICAgaWYgKFkuaXNGdWxseUxvYWRlZCkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBoaWRlKCcucGFuZS5sb2FkJylcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgZmlyZTogJ3ZpZXdlcjpsb2FkZWQnLFxuICAgICAgICBtZXNzYWdlOiB7fVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRfaXRlbV9oYW5kbGVyKGV2ZW50KSB7XG4gICAgWS5WaWV3ZXIudmlld3BvcnQuc2V0Um90YXRpb24oMClcbiAgICBjb25zdCB0aWxlZEltYWdlID0gZXZlbnQuaXRlbVxuICAgIHRpbGVkSW1hZ2UuYWRkSGFuZGxlcignZnVsbHktbG9hZGVkLWNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG5ld0Z1bGx5TG9hZGVkID0gYXJlX2FsbF9mdWxseV9sb2FkZWQoKVxuICAgICAgaWYgKG5ld0Z1bGx5TG9hZGVkICE9PSBZLmlzRnVsbHlMb2FkZWQpIHtcbiAgICAgICAgWS5pc0Z1bGx5TG9hZGVkID0gbmV3RnVsbHlMb2FkZWRcbiAgICAgICAgdXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gYXJlX2FsbF9mdWxseV9sb2FkZWQoKSB7XG4gICAgY29uc3QgY291bnQgPSBZLlZpZXdlci53b3JsZC5nZXRJdGVtQ291bnQoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgY29uc3QgdGlsZWRJbWFnZSA9IFkuVmlld2VyLndvcmxkLmdldEl0ZW1BdChpKVxuICAgICAgaWYgKCF0aWxlZEltYWdlLmdldEZ1bGx5TG9hZGVkKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBvbl9oaWRlX3RodW1ibmFpbHNfdmlldygpIHtcbiAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuICAgIGNvbnN0IHsgc2VxdWVuY2VDb3VudCwgc2VxdWVuY2UgfSA9IG9zZC5kYXRhc2V0XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3RodW1ibmFpbHMtdmlldycpXG4gICAgaGlkZSgnI3RodW1ibmFpbHMnKVxuICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfSlcbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoc2VxdWVuY2UgPiAxKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfSlcbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChzZXF1ZW5jZSA8IHNlcXVlbmNlQ291bnQpIHtcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25fb3Blbl90aHVtYm5haWxzX3ZpZXcoKSB7XG4gICAgY29uc3QgeyB1cmkgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldFxuICAgIGNvbnN0IHdpZHRoID0gJzIzMCdcbiAgICBjb25zdCBoZWlnaHQgPSAnMTUwJ1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QuYWRkKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIC8vIFRvZ2dsZSB2aWV3IG9mIGJvb2tzIHBhZ2UgaWNvbi5cbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfVxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfSlcbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9KVxuICAgIGlmIChwYXJzZUludChzdGF0ZSwgMTApID09PSAwKSB7XG4gICAgICBheGlvcy5nZXQoYCR7dXJpfS90aHVtYm5haWxzP3BqYXg9dHJ1ZSZ3aWR0aD0ke3dpZHRofSZoZWlnaHQ9JHtoZWlnaHR9YCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVzcG9uc2UuZGF0YSwgJ3RleHQvaHRtbCcpXG4gICAgICAgICAgIFkubm9kZXMudGh1bWJuYWlscy5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGRvYy5xdWVyeVNlbGVjdG9yKCcudGh1bWJuYWlscy5jb250YWluZXInKVxuICAgICAgICAgIClcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGh1bWJuYWlscy5jb250YWluZXIgYScpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25UaHVtYm5haWxzQ2xpY2spXG4gICAgICAgICAgfSlcbiAgICAgICAgICBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldC5zdGF0ZSA9IDFcbiAgICAgICAgfVxuICAgICAgICBzaG93KCcjdGh1bWJuYWlscycpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGh1bWJuYWlsc0NsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGJ1dHRvblRodW1ibmFpbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXRodW1ibmFpbHMnKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGlmIChidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICBidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgfVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VxdWVuY2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2xpZGVfdmFsdWVfY2hhbmdlKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcbiAgICAgICAgICB0cmlnZ2VyOiAnY2hhbmdlJyxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHsgdmlldywgaWRlbnRpZmllciwgdHlwZSB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGNvbnN0IHRvID0gTWF0aC5taW4oLi4uWS5zZXFtYXAuc2VxdWVuY2UpIC0gMVxuICAgIGlmICh0byA8IDEpIHtcbiAgICAgIHJldHVybiB0b1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgY29uc3QgcmFuZ2Vfd2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpXG4gICAgICBjb25zdCBzbGlkZXJfdmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJylcbiAgICAgIGlmIChyYW5nZV93ZWlnaHQgJiYgc2xpZGVyX3ZhbHVlKSB7XG4gICAgICAgIHJhbmdlX3dlaWdodC52YWx1ZSA9IHRvXG4gICAgICAgIHNsaWRlcl92YWx1ZS52YWx1ZSA9IHRvXG4gICAgICB9XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyB2aWV3LCBzZXF1ZW5jZTogdG8sIGlkZW50aWZpZXIsIHR5cGUgfSwgJycsIGAvJHt0eXBlfS8ke2lkZW50aWZpZXJ9LyR7dG99YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBjaGFuZ2UodG8sIHByb3BzKSB7XG4gICAgY29uc3QgeyBpZGVudGlmaWVyLCB0eXBlLCBzZXF1ZW5jZUNvdW50IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgY29uc3Qgc2VxdWVuY2UgPSBOdW1iZXIodG8pXG4gICAgY29uc3Qgc2VxdWVuY2VfY291bnQgPSBOdW1iZXIoc2VxdWVuY2VDb3VudClcbiAgICBpZiAoc2VxdWVuY2UgPCAxKSB7XG4gICAgICByZXR1cm4gMVxuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2UgPiBzZXF1ZW5jZV9jb3VudCkge1xuICAgICAgcmV0dXJuIHNlcXVlbmNlX2NvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZS50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IHZpZXcsIHNlcXVlbmNlLCBpZGVudGlmaWVyLCB0eXBlIH0sICcnLCBgLyR7dHlwZX0vJHtpZGVudGlmaWVyfS8ke3NlcXVlbmNlfWApXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGV2ZW50VHlwZSwgY2hpbGRTZWxlY3RvciwgZXZlbnRIYW5kbGVyKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50T25FbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGV2ZW50T25FbGVtZW50LnRhcmdldC5tYXRjaGVzKGNoaWxkU2VsZWN0b3IpKSB7XG4gICAgICAgICAgZXZlbnRIYW5kbGVyKGV2ZW50T25FbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGUoc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICAgIGVsbS5oZWlnaHQgPSAwXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGluY3JlYXNlKHByb3BzKSB7XG4gICAgY29uc3Qge1xuICAgICAgaWRlbnRpZmllciwgXG4gICAgICB0eXBlLCBcbiAgICAgIHZpZXcsIFxuICAgICAgc2VxdWVuY2VDb3VudFxuICAgIH0gPSBwcm9wcy5kYXRhc2V0XG5cbiAgICBjb25zdCB0byA9IE1hdGgubWF4KC4uLlkuc2VxbWFwLnNlcXVlbmNlKSArIDFcbiAgICBcbiAgICBpZiAodG8gPiBOdW1iZXIoc2VxdWVuY2VDb3VudCkpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZUNvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSB0by50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IHZpZXcsIHNlcXVlbmNlOiB0bywgaWRlbnRpZmllciwgdHlwZSB9LCAnJywgYC8ke3R5cGV9LyR7aWRlbnRpZmllcn0vJHt0b31gKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3coc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gdGlsZXMoc2VxbWFwLCBkYXRhc2V0KSB7XG4gICAgcmV0dXJuIHNlcW1hcC5zZXF1ZW5jZS5tYXAoKHNlcXVlbmNlLCB4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aWxlU291cmNlOiBgJHtkYXRhc2V0LnNlcnZpY2V9LyR7ZGF0YXNldC50eXBlfS8ke2RhdGFzZXQuaWRlbnRpZmllcn0vJHtzZXF1ZW5jZX0vaW5mby5qc29uYCwgeFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwb3N0TWVzc2FnZSgndmlld2VyOmluaXQnLCB7fSlcblxuICBwb3N0TWVzc2FnZSgndmlld2VyOmNvbnRlbnRyZWFkeScsIHt9KVxuXG4gIC8vIENhbGxzIHRpbGVzIGxvYWRpbmcuXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50KCd2aWV3ZXI6Y29udGVudHJlYWR5JylcbiAgKVxuXG4gIGlmICh2aWV3ID09ICdkb3VibGVwYWdlJykge1xuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UgJiYgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kb3VibGUnKSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZG91YmxlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLXNpbmdsZScpXG4gICAgfVxuICB9XG5cbiAgWS5zZXFtYXAgPSBhd2FpdCBzZXFtYXAoeyBjb3VudDogWS5jb3VudCwgdmlldywgc2VxdWVuY2UsIGN1cnJlbnQgfSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudF9wYWdlJykudGV4dENvbnRlbnQgPSBcbiAgICBZLm5vZGVzLm9zZC5kYXRhc2V0LnNlcXVlbmNlID0gc2VxdWVuY2VcbiAgXG4gIGlmIChZLm5vZGVzLnNsaWRlcikge1xuICAgIFkubm9kZXMuc2xpZGVyLnZhbHVlID0gc2VxdWVuY2VcbiAgfVxuICBcbiAgaWYgKFkubm9kZXMuc2xpZGVyX3ZhbHVlKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXJfdmFsdWUudmFsdWUgPSBzZXF1ZW5jZVxuICB9XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlcXVlbmNlX2NvdW50JykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLnRleHRDb250ZW50ID0gWS5zZXFtYXAuY291bnRcbiAgfSlcblxuICBjb25zdCB0aWxlU291cmNlcyA9IGF3YWl0IHRpbGVzKFkuc2VxbWFwLCBZLm5vZGVzLm9zZC5kYXRhc2V0KVxuXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaWQ6IFkubm9kZXMub3NkLmlkLFxuICAgIHByZXNlcnZlVmlld3BvcnQ6IHRydWUsXG4gICAgc2hvd05hdmlnYXRpb25Db250cm9sOiBmYWxzZSxcbiAgICBzaG93Wm9vbUNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dIb21lQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd0Z1bGxQYWdlQ29udHJvbDogZmFsc2UsXG4gICAgdmlzaWJpbGl0eVJhdGlvOiAxLFxuICAgIG1pblpvb21MZXZlbDogMCxcbiAgICBkZWZhdWx0Wm9vbUxldmVsOiAwLFxuICAgIHNlcXVlbmNlTW9kZTogZmFsc2UsXG4gICAgdGlsZVNvdXJjZXM6IHRpbGVTb3VyY2VzLFxuICB9XG5cbiAgaWYgKHR5cGUgPT0gJ21hcHMnKSB7XG4gICAgb3B0aW9ucy5zaG93TmF2aWdhdG9yID0gdHJ1ZVxuICB9XG5cbiAgWS5WaWV3ZXIgPSBZLk9wZW5TZWFkcmFnb24ob3B0aW9ucylcblxuICAvLyBPcGVuU2VhZHJhZ29uIGV2ZW50LlxuICBZLlZpZXdlci53b3JsZC5hZGRIYW5kbGVyKCdhZGQtaXRlbScsIGFkZF9pdGVtX2hhbmRsZXIpXG5cbiAgLy8gT3BlblNlYWRyYWdvbiBldmVudC5cbiAgWS5WaWV3ZXIuYWRkSGFuZGxlcignem9vbScsICgpID0+IHtcblxuICAgIGlmIChZLm5vZGVzLm9zZC5oaWRkZW4pIHJldHVyblxuXG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1heFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNYXhab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tIDwgbWF4Wm9vbSAmJlxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPj0gbWF4Wm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPD0gbWluWm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA+IG1pblpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cblxuICB9KVxuXG4gIGNvbnN0IGZvcm1TZXF1ZW5jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmb3JtLXVwZGF0ZS1zZXF1ZW5jZScpXG4gIGlmIChmb3JtU2VxdWVuY2UgJiYgWS5ub2Rlcy5zbGlkZXJfdmFsdWUpIHtcbiAgICBmb3JtU2VxdWVuY2Uub25zdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgICB0bzogWS5ub2Rlcy5zbGlkZXJfdmFsdWUudmFsdWUsXG4gICAgICAgICAgICB0cmlnZ2VyOiAnb25zdWJtaXQnLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICAvLyBab29tIGluIGNsaWNrIGV2ZW50LlxuICBZLm5vZGVzLmNvbnRyb2xab29tSW4ub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1heFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNYXhab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbVRvID0gYWN0dWFsWm9vbSAqIDJcbiAgICBpZiAoYWN0dWFsWm9vbSA8IG1heFpvb20pIHtcbiAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21Ubyh6b29tVG8pXG4gICAgfVxuICAgIC8vIGxvb2sgZm9yIGV2ZW50IG9wdGlvbnMgKE9wZW5TZWFEcmFnb24gem9vbSBlbmQpXG4gICAgaWYgKHpvb21UbyA+PSBtYXhab29tKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH1cbiAgICBpZiAoYWN0dWFsWm9vbSA+IG1pblpvb20pIHtcbiAgICAgIGlmIChZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb20gPSBhY3R1YWxab29tIC8gMlxuICAgIGlmICh6b29tID49IG1pblpvb20pIHtcbiAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21Ubyh6b29tKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWN0dWFsWm9vbSA+IG1pblpvb20pIHtcbiAgICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKG1pblpvb20pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMucm90YXRlLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKFkuVmlld2VyLnZpZXdwb3J0LmRlZ3JlZXMgKyA5MClcbiAgfVxuXG4gIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICBZLm5vZGVzLnRvZ2dsZVBhZ2Uub25jbGljayA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRvdWJsZScpKSB7XG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLXNpbmdsZScpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2Utc2luZ2xlJylcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2UtZG91YmxlJylcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIG9wZXJhdGlvbjogZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQub3BlcmF0aW9uLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLnBhZ2luZycpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX3BhZ2luZ19jbGljaylcbiAgfSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLmJ1dHRvbicpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC5jdXJyZW50VGFyZ2V0XG4gICAgICBsZXQgZXZlbnRfcHJlZml4ID0gYGJ1dHRvbjoke2N1cnJlbnRfdGFyZ2V0LmlkfWBcbiAgICAgIC8qKiBkb24ndCB3YXN0ZSB0aW1lIGlmIHRoZSBidXR0b24gaXMgaW5hY3RpdmUgKi9cbiAgICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvbicpKSB7XG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTpvZmZgLCBldmVudClcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ29uJylcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnb2ZmJylcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTpvbmAsIGV2ZW50KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTp0b2dnbGVgLCBldmVudClcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIGlmIChZLm5vZGVzLnNsaWRlcikge1xuICAgIFkubm9kZXMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNsaWRlX3ZhbHVlX2NoYW5nZSlcbiAgfSAgXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZDpzZXF1ZW5jZScsIGxvYWRfc2VxdWVuY2UpXG5cbiAgLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGUpID0+IHtcbiAgICAvLyBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIC8vICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgIC8vICAgICBkZXRhaWw6IHtcbiAgICAvLyAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgIC8vICAgICAgIHRvOiBoaXN0b3J5LnN0YXRlLnNlcXVlbmNlLFxuICAgIC8vICAgICAgIHRyaWdnZXI6ICdwb3BzdGF0ZScsXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pXG4gICAgLy8gKVxuICAvLyB9KVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b24nLCBvbl9idXR0b25fbWV0YWRhdGFfb24pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvZmYnLCBvbl9idXR0b25fbWV0YWRhdGFfb2ZmKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvbicsIGZ1bGxzY3JlZW5fb24pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9mZicsIGZ1bGxzY3JlZW5fb2ZmKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ZpZXdlcjpjb250ZW50cmVhZHknLCB0aWxlc19sb2FkaW5nKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tdGh1bWJuYWlsczpvbicsIG9uX29wZW5fdGh1bWJuYWlsc192aWV3KVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tdGh1bWJuYWlsczpvZmYnLCBvbl9oaWRlX3RodW1ibmFpbHNfdmlldylcblxuICAvLyBMYW5ndWFnZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy5sYW5nLW9wdGlvbnMgc2VsZWN0JywgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRfdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gICAgYXhpb3MuZ2V0KGN1cnJlbnRfdGFyZ2V0LnZhbHVlKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcbiAgICAgICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhyZXNwb25zZS5kYXRhLCAndGV4dC9odG1sJylcbiAgICAgICAgY29uc3QgcGFuZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBwYWdlbWV0YSA9IGRvYy5xdWVyeVNlbGVjdG9yKCcudmlldy1tb2RlLW1ldGFkYXRhJylcbiAgICAgICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lLm1haW4nKVxuICAgICAgICBjb25zdCBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpXG4gICAgICAgIGh0bWwuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgbWFpbi5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBwYW5lLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuaW5uZXJIVE1MID0gcGFnZW1ldGEuaW5uZXJIVE1MXG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfSlcbiAgfSlcblxuICAvLyBWb2x1bWUuXG4gIGRlbGVnYXRlKCdib2R5JywgJ2NoYW5nZScsICcudmlldy1tdiBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBjb25zdCB2YWx1ZSA9IGN1cnJlbnRfdGFyZ2V0LnZhbHVlXG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub2RlLWRsdHMtYm9vaycpXG4gICAgY29uc3QgbGFuZyA9IG5vZGUuZGF0YXNldC5sYW5nXG4gICAgY29uc3QgdXJsID0gdmFsdWUuc3Vic3RyaW5nKHZhbHVlLmluZGV4T2YoJzo6JykgKyAyLCB2YWx1ZS5sZW5ndGgpICsgJy8xP2xhbmc9JyArIGxhbmdcbiAgICBpZiAod2luZG93LnNlbGYgPT09IHdpbmRvdy50b3ApIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGZpcmU6ICdjaGFuZ2U6b3B0aW9uOm11bHRpdm9sdW1lJyxcbiAgICAgICAgbWVzc2FnZTogeyB1cmwgfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgLy8gdXAgYXJyb3cgKG9yIGkpIC0gbnVkZ2UgdXBcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydpJywgJ3VwJ10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJ2knLCAndXAnXSlcbiAgfSlcblxuICAvLyBkb3duIGFycm93IChvciBtKSAtIG51ZGdlIGRvd25cbiAgWS5rZXlib2FyZEpTLmJpbmQoWydtJywgJ2Rvd24nXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnbScsICdkb3duJ10pXG4gIH0pXG5cbiAgLy8gcmlnaHQgYXJyb3cgKG9yIGspIC0gbnVkZ2UgcmlnaHRcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydrJywgJ3JpZ2h0J10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJ2snLCAncmlnaHQnXSlcbiAgfSlcblxuICAvLyBsZWZ0IGFycm93IChvciBqKSAtIG51ZGdlIGxlZnRcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydqJywgJ2xlZnQnXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnaicsICdsZWZ0J10pXG4gIH0pXG5cbiAgLy8gc2hpZnQgKyByaWdodCAob3Igc2hpZnQgKyBrKSAtIGxvYWQgcGFnZSB0byB0aGUgcmlnaHQgb2YgdGhpcyBvbmUgKHByZXZpb3VzIG9yIG5leHQgZGVwZW5kaW5nMTMgb24gbGFuZ3VhZ2UpXG4gIFkua2V5Ym9hcmRKUy5iaW5kKFsnc2hpZnQgKyByaWdodCcsICdzaGlmdCArIGsnXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnc2hpZnQgKyByaWdodCcsICdzaGlmdCArIGsnXSlcbiAgfSlcbiAgXG4gIC8vIHNoaWZ0ICsgbGVmdCAob3Igc2hpZnQgKyBqKSAtIGxvYWQgcGFnZSB0byB0aGUgbGVmdCBvZiB0aGlzIG9uZSAocHJldmlvdXMgb3IgbmV4dCBkZXBlbmRpbmcgb24gbGFuZ3VhZ2UpXG4gIFkua2V5Ym9hcmRKUy5iaW5kKFsnc2hpZnQgKyBsZWZ0JywgJ3NoaWZ0ICsgaiddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydzaGlmdCArIGxlZnQnLCAnc2hpZnQgKyBqJ10pXG4gIH0pXG5cbiAgLy8gc2hpZnQgKyB1cCBhcnJvdyAob3Igc2hpZnQgKyBpKSAtIHpvb20gaW4gb25lIGxldmVsXG4gIFkua2V5Ym9hcmRKUy5iaW5kKFsnc2hpZnQgKyB1cCcsICdzaGlmdCArIGknXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnc2hpZnQgKyB1cCcsICdzaGlmdCArIGknXSlcbiAgfSlcblxuICAvLyBzaGlmdCArIGRvd24gKG9yIHNoaWZ0ICsgbSkgLSB6b29tIG91dCBvbmUgbGV2ZWxcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIGRvd24nLCAnc2hpZnQgKyBtJ10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJ3NoaWZ0ICsgZG93bicsICdzaGlmdCArIG0nXSlcbiAgfSlcblxuICAvLyAxIC0gem9vbSB0byBmaXQgaW4gd2luZG93XG4gIFkua2V5Ym9hcmRKUy5iaW5kKFsnMSddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWycxJ10pXG4gIH0pXG5cbiAgLy8gLyBvciA/IC0gc2hvdy9oaWRlIGhlbHBcbiAgWS5rZXlib2FyZEpTLmJpbmQoWycvJywgJz8nXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnLycsICc/J10pXG4gIH0pXG5cbiAgLy8gLyBzcGFjZWJhciAtIHNob3cvaGlkZSBtZXRhZGF0YSBwYW5lbCAgXG4gIFkua2V5Ym9hcmRKUy5iaW5kKFsnc3BhY2ViYXInXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdzcGFjZWJhcicpXG4gIH0pXG5cbn1cblxuVmlld2VyQXBwKHsgT3BlblNlYWRyYWdvbjogd2luZG93Lk9wZW5TZWFkcmFnb24sIGF4aW9zLCBrZXlib2FyZEpTIH0pXG4iXSwibmFtZXMiOlsiVmlld2VyQXBwIiwiWSIsInBvc3RNZXNzYWdlIiwidG9nZ2xldmlldyIsIm9uX3BhZ2luZ19jbGljayIsImZ1bGxzY3JlZW5fb24iLCJmdWxsc2NyZWVuX29mZiIsInNlcW1hcCIsImxvYWRfc2VxdWVuY2UiLCJvbl9idXR0b25fbWV0YWRhdGFfb24iLCJvbl9idXR0b25fbWV0YWRhdGFfb2ZmIiwidGlsZXNfbG9hZGluZyIsInVwZGF0ZV9sb2FkaW5nX2luZGljYXRvciIsImFkZF9pdGVtX2hhbmRsZXIiLCJhcmVfYWxsX2Z1bGx5X2xvYWRlZCIsIm9uX2hpZGVfdGh1bWJuYWlsc192aWV3Iiwib25fb3Blbl90aHVtYm5haWxzX3ZpZXciLCJvblRodW1ibmFpbHNDbGljayIsInNsaWRlX3ZhbHVlX2NoYW5nZSIsImRlY3JlYXNlIiwiY2hhbmdlIiwiZGVsZWdhdGUiLCJoaWRlIiwiaW5jcmVhc2UiLCJzaG93IiwidGlsZXMiLCJkYXRhc2V0Iiwic2VxdWVuY2UiLCJtYXAiLCJ4IiwidGlsZVNvdXJjZSIsInNlcnZpY2UiLCJ0eXBlIiwiaWRlbnRpZmllciIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImVsbSIsInN0eWxlIiwiZGlzcGxheSIsInZpc2liaWxpdHkiLCJoaWRkZW4iLCJwcm9wcyIsInZpZXciLCJzZXF1ZW5jZUNvdW50IiwidG8iLCJNYXRoIiwibWF4IiwiTnVtYmVyIiwidG9TdHJpbmciLCJyYW5nZV93ZWlnaHQiLCJxdWVyeVNlbGVjdG9yIiwic2xpZGVyX3ZhbHVlIiwidmFsdWUiLCJ3aW5kb3ciLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiaGVpZ2h0IiwiZXZlbnRUeXBlIiwiY2hpbGRTZWxlY3RvciIsImV2ZW50SGFuZGxlciIsImVsZW1lbnRzIiwiZWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudE9uRWxlbWVudCIsInRhcmdldCIsIm1hdGNoZXMiLCJzZXF1ZW5jZV9jb3VudCIsIm1pbiIsImV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwib3BlcmF0aW9uIiwiY3VycmVudFRhcmdldCIsInRyaWdnZXIiLCJwcmV2ZW50RGVmYXVsdCIsImJ1dHRvblRodW1ibmFpbHMiLCJnZXRFbGVtZW50QnlJZCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImNvbnRhaW5zIiwiYWRkIiwidXJpIiwibm9kZXMiLCJvc2QiLCJzdGF0ZSIsInRodW1ibmFpbHMiLCJ3aWR0aCIsImNvbnRyb2xab29tT3V0IiwiY29udHJvbFpvb21JbiIsInRvZ2dsZVBhZ2UiLCJuZXh0IiwiaXRlbSIsInByZXZpb3VzIiwicGFyc2VJbnQiLCJheGlvcyIsImdldCIsInRoZW4iLCJyZXNwb25zZSIsInN0YXR1cyIsInBhcnNlciIsIkRPTVBhcnNlciIsImRvYyIsInBhcnNlRnJvbVN0cmluZyIsImRhdGEiLCJhcHBlbmRDaGlsZCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImNvdW50IiwiVmlld2VyIiwid29ybGQiLCJnZXRJdGVtQ291bnQiLCJpIiwidGlsZWRJbWFnZSIsImdldEl0ZW1BdCIsImdldEZ1bGx5TG9hZGVkIiwidmlld3BvcnQiLCJzZXRSb3RhdGlvbiIsImFkZEhhbmRsZXIiLCJuZXdGdWxseUxvYWRlZCIsImlzRnVsbHlMb2FkZWQiLCJib2R5IiwiZmlyZSIsIm1lc3NhZ2UiLCJzZXRUaW1lb3V0IiwiYnV0dG9uIiwiY2xvc2VzdCIsImUiLCJpZCIsInRpdGxlIiwiY3VycmVudCIsInRpbGVTb3VyY2VzIiwidGV4dENvbnRlbnQiLCJqb2luIiwib3BlbiIsInNlcXVlbmNlcyIsInNlcSIsImNlaWwiLCJBcnJheSIsImZpbGwiLCJfIiwiaW5kZXgiLCJwdXNoIiwic2hpZnQiLCJsZW5ndGgiLCJwb3AiLCJmaW5kIiwiaW5jbHVkZXMiLCJ0b3AiLCJleGl0RnVsbHNjcmVlbiIsIm1zRXhpdEZ1bGxzY3JlZW4iLCJtb3pDYW5jZWxGdWxsU2NyZWVuIiwid2Via2l0Q2FuY2VsRnVsbFNjcmVlbiIsImRvY0VsbSIsImRvY3VtZW50RWxlbWVudCIsInJlcXVlc3RGdWxsc2NyZWVuIiwibXNSZXF1ZXN0RnVsbHNjcmVlbiIsIm1velJlcXVlc3RGdWxsU2NyZWVuIiwid2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4iLCJKU09OIiwic3RyaW5naWZ5IiwiYnV0dG9uTWV0YWRhdGEiLCJyb3RhdGUiLCJwYWdlbWV0YSIsInRvZ2dsZUxhbmd1YWdlIiwic2xpZGVyIiwib3B0aW9ucyIsInByZXNlcnZlVmlld3BvcnQiLCJzaG93TmF2aWdhdGlvbkNvbnRyb2wiLCJzaG93Wm9vbUNvbnRyb2wiLCJzaG93SG9tZUNvbnRyb2wiLCJzaG93RnVsbFBhZ2VDb250cm9sIiwidmlzaWJpbGl0eVJhdGlvIiwibWluWm9vbUxldmVsIiwiZGVmYXVsdFpvb21MZXZlbCIsInNlcXVlbmNlTW9kZSIsInNob3dOYXZpZ2F0b3IiLCJPcGVuU2VhZHJhZ29uIiwiYWN0dWFsWm9vbSIsImdldFpvb20iLCJtYXhab29tIiwiZ2V0TWF4Wm9vbSIsIm1pblpvb20iLCJnZXRNaW5ab29tIiwiZm9ybVNlcXVlbmNlIiwib25zdWJtaXQiLCJvbmNsaWNrIiwiem9vbVRvIiwiem9vbSIsImRlZ3JlZXMiLCJjdXJyZW50X3RhcmdldCIsImV2ZW50X3ByZWZpeCIsInBhbmUiLCJtYWluIiwiaHRtbCIsImRpciIsImlubmVySFRNTCIsIm5vZGUiLCJsYW5nIiwidXJsIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInNlbGYiLCJsb2NhdGlvbiIsImFzc2lnbiIsImtleWJvYXJkSlMiLCJiaW5kIl0sInNvdXJjZVJvb3QiOiIifQ==