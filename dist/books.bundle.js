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
    var _Y$nodes$osd$dataset, view, sequence, sequenceCount, current, postMessage, toggleview, on_paging_click, fullscreen_on, fullscreen_off, seqmap, _seqmap, load_sequence, _load_sequence, on_button_metadata_on, on_button_metadata_off, tiles_loading, update_loading_indicator, add_item_handler, are_all_fully_loaded, on_hide_thumbnails_view, on_open_thumbnails_view, onThumbnailsClick, slide_value_change, decrease, _decrease, change, _change, delegate, hide, increase, _increase, show, tiles, _tiles, tileSources;

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
                var _props$dataset3, identifier, type, view, sequenceCount, to;

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
                        document.querySelector('#range_weight').value = to;
                        document.querySelector('#slider_value').value = to;
                        window.history.pushState({
                          view: view,
                          sequence: to,
                          identifier: identifier,
                          type: type
                        }, '', "/".concat(type, "/").concat(identifier, "/").concat(to));

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
                var _props$dataset2, identifier, type, sequenceCount, sequence, sequence_count;

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
                        document.querySelector('#range_weight').value = sequence;
                        document.querySelector('#slider_value').value = sequence;
                        window.history.pushState({
                          view: view,
                          sequence: sequence,
                          identifier: identifier,
                          type: type
                        }, '', "/".concat(type, "/").concat(identifier, "/").concat(sequence));

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
                var _props$dataset, view, identifier, type, to;

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
                        document.querySelector('#range_weight').value = to;
                        document.querySelector('#slider_value').value = to;
                        window.history.pushState({
                          view: view,
                          sequence: to,
                          identifier: identifier,
                          type: type
                        }, '', "/".concat(type, "/").concat(identifier, "/").concat(to));

                      case 10:
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
              Y.nodes.controlZoomIn.classList.add('inactive');
              Y.nodes.togglePage.classList.remove('active');
              Y.nodes.togglePage.classList.add('inactive');
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
              hide('#thumbnails');
              Y.nodes.togglePage.classList.remove('inactive');
              Y.nodes.togglePage.classList.add('active');
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
                        });
                        Y.nodes.togglePage.classList.add('active');
                        Y.nodes.togglePage.classList.remove('inactive');
                        show('#openseadragon1');
                        show('#pager');
                        Y.Viewer.open(_tileSources);
                        Y.nodes.body.classList.remove('openlayers-loading');
                        Y.isFullyLoaded = true;
                        _context2.next = 42;
                        break;

                      case 39:
                        _context2.prev = 39;
                        _context2.t1 = _context2["catch"](0);
                        console.log(_context2.t1);

                      case 42:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 39]]);
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
            Y.seqmap = [];
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
            Y.nodes.slider = document.querySelector('#range_weight');
            Y.nodes.slider_value = document.querySelector('#slider_value');
            Y.nodes.next = document.querySelectorAll('.paging.next');
            Y.nodes.previous = document.querySelectorAll('.paging.previous');
            _Y$nodes$osd$dataset = Y.nodes.osd.dataset, view = _Y$nodes$osd$dataset.view, sequence = _Y$nodes$osd$dataset.sequence, sequenceCount = _Y$nodes$osd$dataset.sequenceCount, current = _Y$nodes$osd$dataset.current;
            Y.count = Number(sequenceCount);
            postMessage('viewer:init', {});
            postMessage('viewer:contentready', {}); // Calls tiles loading.

            document.dispatchEvent(new CustomEvent('viewer:contentready'));

            if (view == 'doublepage') {
              if (Y.nodes.togglePage.classList.contains('page-double')) {
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
            document.querySelector('.current_page').textContent = Y.nodes.osd.dataset.sequence = Y.nodes.slider.value = Y.nodes.slider_value.value = sequence;
            Y.nodes.slider.max = Y.seqmap.count;
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

            document.querySelector('#form-update-sequence').onsubmit = function (event) {
              event.preventDefault();
              document.dispatchEvent(new CustomEvent('load:sequence', {
                detail: {
                  operation: 'change',
                  to: Y.nodes.slider_value.value
                }
              }));
            }; // Zoom in click event.


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
            Y.nodes.slider.addEventListener('change', slide_value_change);
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

          case 87:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFBTSxDQUFDa0gsYUFBeEI7QUFBdUN6RSxFQUFBQSxLQUFLLEVBQUxBO0FBQXZDLENBQUQsQ0FBVCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9qcy92aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gVmlld2VyQXBwKFkpIHtcblxuICBjb25zb2xlLmxvZygnVmlld2VyQXBwJylcblxuICBZLlZpZXdlciA9IG51bGxcblxuICBZLmlzRnVsbHlMb2FkZWQgPSBmYWxzZVxuXG4gIFkuc2VxbWFwID0gW11cblxuICBZLm5vZGVzID0ge31cblxuICBZLm5vZGVzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcblxuICBZLm5vZGVzLnRodW1ibmFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGh1bWJuYWlscycpXG5cbiAgWS5ub2Rlcy5idXR0b25NZXRhZGF0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuXG4gIFkubm9kZXMucm90YXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtcm90YXRlJylcblxuICBZLm5vZGVzLnBhZ2VtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcblxuICBZLm5vZGVzLm9zZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgWS5ub2Rlcy5kaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyNkaXNwbGF5JylcblxuICBZLm5vZGVzLnRvZ2dsZVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLXBhZ2UnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbC16b29tLW91dCcpXG5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1pbicpXG5cbiAgWS5ub2Rlcy50b2dnbGVMYW5ndWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgLmxhbmd1YWdlJylcblxuICBZLm5vZGVzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuXG4gIFkubm9kZXMuc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG5cbiAgWS5ub2Rlcy5uZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5uZXh0JylcblxuICBZLm5vZGVzLnByZXZpb3VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5wcmV2aW91cycpXG5cbiAgY29uc3QgeyBcbiAgICB2aWV3LCBcbiAgICBzZXF1ZW5jZSwgXG4gICAgc2VxdWVuY2VDb3VudCwgXG4gICAgY3VycmVudCBcbiAgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcblxuICBZLmNvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG5cbiAgZnVuY3Rpb24gcG9zdE1lc3NhZ2UoZmlyZSwgbWVzc2FnZSkge1xuICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBmaXJlLCBtZXNzYWdlIH0pLCAnKicpXG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGV2aWV3KHByb3BzKSB7XG4gICAgY29uc3QgeyB2aWV3IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgaWYgKHZpZXcgPT0gJ3NpbmdsZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdkb3VibGVwYWdlJ1xuICAgIH0gZWxzZSBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdzaW5nbGUnXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fcGFnaW5nX2NsaWNrKGUpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgLyoqIHRlc3QgaWYgdGhlIHRhcmdldCBpcyBub3QgYWN0aXZlICovXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICB0cnkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb24oKSB7XG4gICAgY29uc3QgZG9jRWxtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICB9XG4gICAgaWYgKGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywge30pXG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29mZigpIHtcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgdG9wLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywge30pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzZXFtYXAocHJvcHMpIHtcbiAgICBjb25zdCB7IGNvdW50LCB2aWV3LCBzZXF1ZW5jZSB9ID0gcHJvcHNcbiAgICBjb25zdCBzZXF1ZW5jZXMgPSBbXVxuICAgIHN3aXRjaCAodmlldykge1xuICAgICAgY2FzZSAnZG91YmxlcGFnZSc6XG4gICAgICAgIGNvbnN0IHNlcSA9IE1hdGguY2VpbChOdW1iZXIoY291bnQpIC8gMikgKyAxXG4gICAgICAgIEFycmF5KHNlcSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICogMiwgaW5kZXggKiAyICsgMSBdKVxuICAgICAgICB9KVxuICAgICAgICAvLyBSZW1vdmUgMCBmcm9tIGZpcnN0IGluZGV4LlxuICAgICAgICBzZXF1ZW5jZXNbMF0uc2hpZnQoKVxuICAgICAgICAvLyBNYWtlIHN1cmUgbGFzdCBpbmRleCBkb2VzIG5vdCBpbmNsdWRlcyBvdXRib3VuZCBzZXF1ZW5jZXMuXG4gICAgICAgIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzFdID4gY291bnQpIHtcbiAgICAgICAgICBzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMF0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlcy5wb3AoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VxdWVuY2VzLFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsICAgICAgICAgIFxuICAgICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiB2YWx1ZS5pbmNsdWRlcyhzZXF1ZW5jZSkgPT09IHRydWUpLFxuICAgICAgICB9XG4gICAgICBjYXNlICdzaW5nbGUnOlxuICAgICAgICBBcnJheShOdW1iZXIoY291bnQpKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKyAxXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsIFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsXG4gICAgICAgICAgc2VxdWVuY2U6IFsgc2VxdWVuY2VzLmZpbmQodmFsdWUgPT4gTnVtYmVyKHZhbHVlKSA9PT0gTnVtYmVyKHNlcXVlbmNlKSkgXSxcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRfc2VxdWVuY2UoZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuICAgICAgY29uc3QgZGF0YXNldCA9IG9zZC5kYXRhc2V0XG4gICAgICBjb25zdCB7IG9wZXJhdGlvbiwgdG8gfSAgPSBlLmRldGFpbFxuICAgICAgY29uc3QgZmlyZSA9IGB2aWV3ZXI6c2VxdWVuY2U6JHtvcGVyYXRpb259YFxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSAnaW5jcmVhc2UnOlxuICAgICAgICAgIGF3YWl0IGluY3JlYXNlKG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdkZWNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgZGVjcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgYXdhaXQgY2hhbmdlKHRvLCBvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndG9nZ2xldmlldyc6XG4gICAgICAgICAgdG9nZ2xldmlldyhvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIC8vIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBuZXcgc2VxdWVuY2UuXG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICBpZDogb3NkLmlkLFxuICAgICAgICB0aXRsZTogZGF0YXNldC50aXRsZSxcbiAgICAgICAgY291bnQ6IFkuY291bnQsXG4gICAgICAgIHZpZXc6IGRhdGFzZXQudmlldyxcbiAgICAgICAgY3VycmVudDogTnVtYmVyKGRhdGFzZXQuY3VycmVudCksXG4gICAgICAgIHNlcXVlbmNlOiBOdW1iZXIoZGF0YXNldC5zZXF1ZW5jZSksXG4gICAgICAgIGlkZW50aWZpZXI6IGRhdGFzZXQuaWRlbnRpZmllcixcbiAgICAgICAgdXJpOiBgJHtkYXRhc2V0LnVyaX0vJHtkYXRhc2V0LnNlcXVlbmNlfWAsXG4gICAgICB9XG5cbiAgICAgIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKG1lc3NhZ2UpXG5cbiAgICAgIHBvc3RNZXNzYWdlKHsgZmlyZSwgbWVzc2FnZSB9KVxuXG4gICAgICBjb25zdCB0aWxlU291cmNlcyA9IGF3YWl0IHRpbGVzKFkuc2VxbWFwLCBkYXRhc2V0KVxuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudF9wYWdlJykudGV4dENvbnRlbnQgPSBZLnNlcW1hcC5zZXF1ZW5jZS5qb2luKCcgLSAnKVxuXG4gICAgICBZLm5vZGVzLm5leHQuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA+PSBZLnNlcW1hcC5jb3VudCkge1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGRhdGFzZXQuc2VxdWVuY2UgPD0gMSkge1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcblxuICAgICAgc2hvdygnI29wZW5zZWFkcmFnb24xJylcblxuICAgICAgc2hvdygnI3BhZ2VyJylcblxuICAgICAgWS5WaWV3ZXIub3Blbih0aWxlU291cmNlcylcblxuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG5cbiAgICAgIFkuaXNGdWxseUxvYWRlZCA9IHRydWVcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbl9idXR0b25fbWV0YWRhdGFfb24oKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdvbicpXG4gICAgZWxlbWVudC5jbG9zZXN0KCcucGFuZS1ib2R5JykuY2xhc3NMaXN0LnJlbW92ZSgncGFnZW1ldGEtaGlkZGVuJylcbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICBmaXJlOiAnYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsXG4gICAgICBtZXNzYWdlOiB7fVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBvbl9idXR0b25fbWV0YWRhdGFfb2ZmKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFnZW1ldGEnKVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIGVsZW1lbnQuY2xvc2VzdCgnLnBhbmUtYm9keScpLmNsYXNzTGlzdC5hZGQoJ3BhZ2VtZXRhLWhpZGRlbicpXG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgZmlyZTogJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b2ZmJyxcbiAgICAgIG1lc3NhZ2U6IHt9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbGVzX2xvYWRpbmcoKSB7XG4gICAgaWYgKGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdvcGVubGF5ZXJzLWxvYWRpbmcnKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRpbGVzX2xvYWRpbmcoKVxuICAgICAgfSwgMTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlkZSgnLnBhbmUubG9hZCcpXG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IoKSB7XG4gICAgaWYgKFkuaXNGdWxseUxvYWRlZCkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBoaWRlKCcucGFuZS5sb2FkJylcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgZmlyZTogJ3ZpZXdlcjpsb2FkZWQnLFxuICAgICAgICBtZXNzYWdlOiB7fVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRfaXRlbV9oYW5kbGVyKGV2ZW50KSB7XG4gICAgWS5WaWV3ZXIudmlld3BvcnQuc2V0Um90YXRpb24oMClcbiAgICBjb25zdCB0aWxlZEltYWdlID0gZXZlbnQuaXRlbVxuICAgIHRpbGVkSW1hZ2UuYWRkSGFuZGxlcignZnVsbHktbG9hZGVkLWNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG5ld0Z1bGx5TG9hZGVkID0gYXJlX2FsbF9mdWxseV9sb2FkZWQoKVxuICAgICAgaWYgKG5ld0Z1bGx5TG9hZGVkICE9PSBZLmlzRnVsbHlMb2FkZWQpIHtcbiAgICAgICAgWS5pc0Z1bGx5TG9hZGVkID0gbmV3RnVsbHlMb2FkZWRcbiAgICAgICAgdXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gYXJlX2FsbF9mdWxseV9sb2FkZWQoKSB7XG4gICAgY29uc3QgY291bnQgPSBZLlZpZXdlci53b3JsZC5nZXRJdGVtQ291bnQoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgY29uc3QgdGlsZWRJbWFnZSA9IFkuVmlld2VyLndvcmxkLmdldEl0ZW1BdChpKVxuICAgICAgaWYgKCF0aWxlZEltYWdlLmdldEZ1bGx5TG9hZGVkKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBvbl9oaWRlX3RodW1ibmFpbHNfdmlldygpIHtcblxuICAgIGNvbnN0IG9zZCA9IFkubm9kZXMub3NkXG5cbiAgICBjb25zdCB7IHNlcXVlbmNlQ291bnQsIHNlcXVlbmNlIH0gPSBvc2QuZGF0YXNldFxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3RodW1ibmFpbHMtdmlldycpXG5cbiAgICBoaWRlKCcjdGh1bWJuYWlscycpXG5cbiAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG4gICAgWS5ub2Rlcy5uZXh0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9KVxuXG4gICAgWS5ub2Rlcy5wcmV2aW91cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlID4gMSkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChzZXF1ZW5jZSA8IHNlcXVlbmNlQ291bnQpIHtcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9KVxuXG4gIH1cblxuICBmdW5jdGlvbiBvbl9vcGVuX3RodW1ibmFpbHNfdmlldygpIHtcblxuICAgIGNvbnN0IHsgdXJpIH0gPSBZLm5vZGVzLm9zZC5kYXRhc2V0XG5cbiAgICBjb25zdCB7IHN0YXRlIH0gPSBZLm5vZGVzLnRodW1ibmFpbHMuZGF0YXNldFxuXG4gICAgY29uc3Qgd2lkdGggPSAnMjMwJ1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gJzE1MCdcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QuYWRkKCd0aHVtYm5haWxzLXZpZXcnKVxuXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcblxuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG5cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9KVxuXG4gICAgaWYgKHBhcnNlSW50KHN0YXRlLCAxMCkgPT09IDApIHtcbiAgICAgIGF4aW9zLmdldChgJHt1cml9L3RodW1ibmFpbHM/cGpheD10cnVlJndpZHRoPSR7d2lkdGh9JmhlaWdodD0ke2hlaWdodH1gKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpXG4gICAgICAgICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhyZXNwb25zZS5kYXRhLCAndGV4dC9odG1sJylcbiAgICAgICAgICAgWS5ub2Rlcy50aHVtYm5haWxzLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgZG9jLnF1ZXJ5U2VsZWN0b3IoJy50aHVtYm5haWxzLmNvbnRhaW5lcicpXG4gICAgICAgICAgKVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aHVtYm5haWxzLmNvbnRhaW5lciBhJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRodW1ibmFpbHNDbGljaylcbiAgICAgICAgICB9KVxuICAgICAgICAgIFkubm9kZXMudGh1bWJuYWlscy5kYXRhc2V0LnN0YXRlID0gMVxuICAgICAgICB9XG5cbiAgICAgICAgc2hvdygnI3RodW1ibmFpbHMnKVxuXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVGh1bWJuYWlsc0NsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGJ1dHRvblRodW1ibmFpbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLXRodW1ibmFpbHMnKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCd0aHVtYm5haWxzLXZpZXcnKVxuICAgIGlmIChidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5jb250YWlucygnb24nKSkge1xuICAgICAgYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICBidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgfVxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VxdWVuY2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2xpZGVfdmFsdWVfY2hhbmdlKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWNyZWFzZShwcm9wcykge1xuICAgIGNvbnN0IHsgdmlldywgaWRlbnRpZmllciwgdHlwZSB9ID0gcHJvcHMuZGF0YXNldFxuICAgIGNvbnN0IHRvID0gTWF0aC5taW4oLi4uWS5zZXFtYXAuc2VxdWVuY2UpIC0gMVxuICAgIGlmICh0byA8IDEpIHtcbiAgICAgIHJldHVybiB0b1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gdG8udG9TdHJpbmcoKVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpLnZhbHVlID0gdG9cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKS52YWx1ZSA9IHRvXG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyB2aWV3LCBzZXF1ZW5jZTogdG8sIGlkZW50aWZpZXIsIHR5cGUgfSwgJycsIGAvJHt0eXBlfS8ke2lkZW50aWZpZXJ9LyR7dG99YClcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBjaGFuZ2UodG8sIHByb3BzKSB7XG4gICAgY29uc3QgeyBpZGVudGlmaWVyLCB0eXBlLCBzZXF1ZW5jZUNvdW50IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgY29uc3Qgc2VxdWVuY2UgPSBOdW1iZXIodG8pXG4gICAgY29uc3Qgc2VxdWVuY2VfY291bnQgPSBOdW1iZXIoc2VxdWVuY2VDb3VudClcbiAgICBpZiAoc2VxdWVuY2UgPCAxKSB7XG4gICAgICByZXR1cm4gMVxuICAgIH0gZWxzZSBpZiAoc2VxdWVuY2UgPiBzZXF1ZW5jZV9jb3VudCkge1xuICAgICAgcmV0dXJuIHNlcXVlbmNlX2NvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZS50b1N0cmluZygpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JykudmFsdWUgPSBzZXF1ZW5jZSAgXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyX3ZhbHVlJykudmFsdWUgPSBzZXF1ZW5jZVxuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgdmlldywgc2VxdWVuY2UsIGlkZW50aWZpZXIsIHR5cGUgfSwgJycsIGAvJHt0eXBlfS8ke2lkZW50aWZpZXJ9LyR7c2VxdWVuY2V9YClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZXZlbnRUeXBlLCBjaGlsZFNlbGVjdG9yLCBldmVudEhhbmRsZXIpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRPbkVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoZXZlbnRPbkVsZW1lbnQudGFyZ2V0Lm1hdGNoZXMoY2hpbGRTZWxlY3RvcikpIHtcbiAgICAgICAgICBldmVudEhhbmRsZXIoZXZlbnRPbkVsZW1lbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGlkZShzZWxlY3Rvcikge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goZWxtID0+IHtcbiAgICAgIGVsbS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuICAgICAgZWxtLnN0eWxlLnZpc2liaWxpdHkgPSBudWxsXG4gICAgICBlbG0uaGlkZGVuID0gbnVsbFxuICAgICAgZWxtLmhlaWdodCA9IDBcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gaW5jcmVhc2UocHJvcHMpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZGVudGlmaWVyLCBcbiAgICAgIHR5cGUsIFxuICAgICAgdmlldywgXG4gICAgICBzZXF1ZW5jZUNvdW50IFxuICAgIH0gPSBwcm9wcy5kYXRhc2V0XG5cbiAgICBjb25zdCB0byA9IE1hdGgubWF4KC4uLlkuc2VxbWFwLnNlcXVlbmNlKSArIDFcbiAgICBcbiAgICBpZiAodG8gPiBOdW1iZXIoc2VxdWVuY2VDb3VudCkpIHtcbiAgICAgIHJldHVybiBzZXF1ZW5jZUNvdW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSB0by50b1N0cmluZygpXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JykudmFsdWUgPSB0b1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpLnZhbHVlID0gdG9cbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IHZpZXcsIHNlcXVlbmNlOiB0bywgaWRlbnRpZmllciwgdHlwZSB9LCAnJywgYC8ke3R5cGV9LyR7aWRlbnRpZmllcn0vJHt0b31gKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3coc2VsZWN0b3IpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKGVsbSA9PiB7XG4gICAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgICAgZWxtLmhpZGRlbiA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gdGlsZXMoc2VxbWFwLCBkYXRhc2V0KSB7XG4gICAgcmV0dXJuIHNlcW1hcC5zZXF1ZW5jZS5tYXAoKHNlcXVlbmNlLCB4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aWxlU291cmNlOiBgJHtkYXRhc2V0LnNlcnZpY2V9LyR7ZGF0YXNldC50eXBlfS8ke2RhdGFzZXQuaWRlbnRpZmllcn0vJHtzZXF1ZW5jZX0vaW5mby5qc29uYCwgeFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwb3N0TWVzc2FnZSgndmlld2VyOmluaXQnLCB7fSlcblxuICBwb3N0TWVzc2FnZSgndmlld2VyOmNvbnRlbnRyZWFkeScsIHt9KVxuXG4gIC8vIENhbGxzIHRpbGVzIGxvYWRpbmcuXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50KCd2aWV3ZXI6Y29udGVudHJlYWR5JylcbiAgKVxuXG4gIGlmICh2aWV3ID09ICdkb3VibGVwYWdlJykge1xuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRvdWJsZScpKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1kb3VibGUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utc2luZ2xlJylcbiAgICB9XG4gIH1cblxuICBZLnNlcW1hcCA9IGF3YWl0IHNlcW1hcCh7IFxuICAgIGNvdW50OiBZLmNvdW50LCBcbiAgICB2aWV3LCBcbiAgICBzZXF1ZW5jZSwgXG4gICAgY3VycmVudFxuICB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFxuICAgIFkubm9kZXMub3NkLmRhdGFzZXQuc2VxdWVuY2UgPSBcbiAgICBZLm5vZGVzLnNsaWRlci52YWx1ZSA9IFxuICAgIFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlID0gc2VxdWVuY2VcblxuICBZLm5vZGVzLnNsaWRlci5tYXggPSBZLnNlcW1hcC5jb3VudFxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXF1ZW5jZV9jb3VudCcpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS50ZXh0Q29udGVudCA9IFkuc2VxbWFwLmNvdW50XG4gIH0pXG5cbiAgY29uc3QgdGlsZVNvdXJjZXMgPSBhd2FpdCB0aWxlcyhZLnNlcW1hcCwgWS5ub2Rlcy5vc2QuZGF0YXNldClcblxuICBZLlZpZXdlciA9IFkuT3BlblNlYWRyYWdvbih7XG4gICAgaWQ6IFkubm9kZXMub3NkLmlkLFxuICAgIHByZXNlcnZlVmlld3BvcnQ6IHRydWUsXG4gICAgc2hvd05hdmlnYXRpb25Db250cm9sOiBmYWxzZSxcbiAgICBzaG93Wm9vbUNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dIb21lQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd0Z1bGxQYWdlQ29udHJvbDogZmFsc2UsXG4gICAgdmlzaWJpbGl0eVJhdGlvOiAxLFxuICAgIG1pblpvb21MZXZlbDogMCxcbiAgICBkZWZhdWx0Wm9vbUxldmVsOiAwLFxuICAgIHNlcXVlbmNlTW9kZTogZmFsc2UsXG4gICAgdGlsZVNvdXJjZXM6IHRpbGVTb3VyY2VzLFxuICB9KVxuXG4gIC8vIE9wZW5TZWFkcmFnb24gZXZlbnQuXG4gIFkuVmlld2VyLndvcmxkLmFkZEhhbmRsZXIoJ2FkZC1pdGVtJywgYWRkX2l0ZW1faGFuZGxlcilcblxuICAvLyBPcGVuU2VhZHJhZ29uIGV2ZW50LlxuICBZLlZpZXdlci5hZGRIYW5kbGVyKCd6b29tJywgKCkgPT4ge1xuXG4gICAgaWYgKFkubm9kZXMub3NkLmhpZGRlbikgcmV0dXJuXG5cbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWF4Wm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1heFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPCBtYXhab29tICYmXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA+PSBtYXhab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA8PSBtaW5ab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tID4gbWluWm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuXG4gIH0pXG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Zvcm0tdXBkYXRlLXNlcXVlbmNlJykub25zdWJtaXQgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogWS5ub2Rlcy5zbGlkZXJfdmFsdWUudmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgLy8gWm9vbSBpbiBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1heFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNYXhab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbVRvID0gYWN0dWFsWm9vbSAqIDJcbiAgICBpZiAoYWN0dWFsWm9vbSA8IG1heFpvb20pIHtcbiAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21Ubyh6b29tVG8pXG4gICAgfVxuICAgIC8vIGxvb2sgZm9yIGV2ZW50IG9wdGlvbnMgKE9wZW5TZWFEcmFnb24gem9vbSBlbmQpXG4gICAgaWYgKHpvb21UbyA+PSBtYXhab29tKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH1cbiAgICBpZiAoYWN0dWFsWm9vbSA+IG1pblpvb20pIHtcbiAgICAgIGlmIChZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbSA9IGFjdHVhbFpvb20gLyAyXG4gICAgaWYgKHpvb20gPj0gbWluWm9vbSkge1xuICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKHpvb20pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhY3R1YWxab29tID4gbWluWm9vbSkge1xuICAgICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8obWluWm9vbSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5yb3RhdGUub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgWS5WaWV3ZXIudmlld3BvcnQuc2V0Um90YXRpb24oWS5WaWV3ZXIudmlld3BvcnQuZGVncmVlcyArIDkwKVxuICB9XG5cbiAgWS5ub2Rlcy50b2dnbGVQYWdlLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIChlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5jb250YWlucygncGFnZS1kb3VibGUnKSkge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZG91YmxlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLXNpbmdsZScpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2Utc2luZ2xlJylcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdwYWdlLWRvdWJsZScpXG4gICAgfVxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG9wZXJhdGlvbjogZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQub3BlcmF0aW9uLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EucGFnaW5nJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fcGFnaW5nX2NsaWNrKVxuICB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYnV0dG9uJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgIGxldCBldmVudF9wcmVmaXggPSBgYnV0dG9uOiR7Y3VycmVudF90YXJnZXQuaWR9YFxuICAgICAgLyoqIGRvbid0IHdhc3RlIHRpbWUgaWYgdGhlIGJ1dHRvbiBpcyBpbmFjdGl2ZSAqL1xuICAgICAgaWYgKGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9mZmAsIGV2ZW50KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9uYCwgZXZlbnQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9OnRvZ2dsZWAsIGV2ZW50KVxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgWS5ub2Rlcy5zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2xpZGVfdmFsdWVfY2hhbmdlKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQ6c2VxdWVuY2UnLCBsb2FkX3NlcXVlbmNlKVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb25zb2xlLmxvZyhoaXN0b3J5LnN0YXRlLnNlcXVlbmNlKVxuICAgIC8vIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgLy8gICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgLy8gICAgIGRldGFpbDoge1xuICAgIC8vICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgLy8gICAgICAgdG86IGhpc3Rvcnkuc3RhdGUuc2VxdWVuY2UsXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pXG4gICAgLy8gKVxuICB9KVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tbWV0YWRhdGE6b24nLCBvbl9idXR0b25fbWV0YWRhdGFfb24pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvZmYnLCBvbl9idXR0b25fbWV0YWRhdGFfb2ZmKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvbicsIGZ1bGxzY3JlZW5fb24pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9mZicsIGZ1bGxzY3JlZW5fb2ZmKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3ZpZXdlcjpjb250ZW50cmVhZHknLCB0aWxlc19sb2FkaW5nKVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tdGh1bWJuYWlsczpvbicsIG9uX29wZW5fdGh1bWJuYWlsc192aWV3KVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2J1dHRvbjpidXR0b24tdGh1bWJuYWlsczpvZmYnLCBvbl9oaWRlX3RodW1ibmFpbHNfdmlldylcblxuICAvLyBMYW5ndWFnZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy5sYW5nLW9wdGlvbnMgc2VsZWN0JywgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRfdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gICAgYXhpb3MuZ2V0KGN1cnJlbnRfdGFyZ2V0LnZhbHVlKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcbiAgICAgICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhyZXNwb25zZS5kYXRhLCAndGV4dC9odG1sJylcbiAgICAgICAgY29uc3QgcGFuZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBwYWdlbWV0YSA9IGRvYy5xdWVyeVNlbGVjdG9yKCcudmlldy1tb2RlLW1ldGFkYXRhJylcbiAgICAgICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lLm1haW4nKVxuICAgICAgICBjb25zdCBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpXG4gICAgICAgIGh0bWwuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgbWFpbi5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBwYW5lLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuaW5uZXJIVE1MID0gcGFnZW1ldGEuaW5uZXJIVE1MXG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfSlcbiAgfSlcblxuICAvLyBWb2x1bWUuXG4gIGRlbGVnYXRlKCdib2R5JywgJ2NoYW5nZScsICcudmlldy1tdiBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBjb25zdCB2YWx1ZSA9IGN1cnJlbnRfdGFyZ2V0LnZhbHVlXG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub2RlLWRsdHMtYm9vaycpXG4gICAgY29uc3QgbGFuZyA9IG5vZGUuZGF0YXNldC5sYW5nXG4gICAgY29uc3QgdXJsID0gdmFsdWUuc3Vic3RyaW5nKHZhbHVlLmluZGV4T2YoJzo6JykgKyAyLCB2YWx1ZS5sZW5ndGgpICsgJy8xP2xhbmc9JyArIGxhbmdcbiAgICBpZiAod2luZG93LnNlbGYgPT09IHdpbmRvdy50b3ApIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIGZpcmU6ICdjaGFuZ2U6b3B0aW9uOm11bHRpdm9sdW1lJyxcbiAgICAgICAgbWVzc2FnZTogeyB1cmwgfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbn1cblxuVmlld2VyQXBwKHsgT3BlblNlYWRyYWdvbjogd2luZG93Lk9wZW5TZWFkcmFnb24sIGF4aW9zIH0pXG4iXSwibmFtZXMiOlsiVmlld2VyQXBwIiwiWSIsInBvc3RNZXNzYWdlIiwidG9nZ2xldmlldyIsIm9uX3BhZ2luZ19jbGljayIsImZ1bGxzY3JlZW5fb24iLCJmdWxsc2NyZWVuX29mZiIsInNlcW1hcCIsImxvYWRfc2VxdWVuY2UiLCJvbl9idXR0b25fbWV0YWRhdGFfb24iLCJvbl9idXR0b25fbWV0YWRhdGFfb2ZmIiwidGlsZXNfbG9hZGluZyIsInVwZGF0ZV9sb2FkaW5nX2luZGljYXRvciIsImFkZF9pdGVtX2hhbmRsZXIiLCJhcmVfYWxsX2Z1bGx5X2xvYWRlZCIsIm9uX2hpZGVfdGh1bWJuYWlsc192aWV3Iiwib25fb3Blbl90aHVtYm5haWxzX3ZpZXciLCJvblRodW1ibmFpbHNDbGljayIsInNsaWRlX3ZhbHVlX2NoYW5nZSIsImRlY3JlYXNlIiwiY2hhbmdlIiwiZGVsZWdhdGUiLCJoaWRlIiwiaW5jcmVhc2UiLCJzaG93IiwidGlsZXMiLCJkYXRhc2V0Iiwic2VxdWVuY2UiLCJtYXAiLCJ4IiwidGlsZVNvdXJjZSIsInNlcnZpY2UiLCJ0eXBlIiwiaWRlbnRpZmllciIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImVsbSIsInN0eWxlIiwiZGlzcGxheSIsInZpc2liaWxpdHkiLCJoaWRkZW4iLCJwcm9wcyIsInZpZXciLCJzZXF1ZW5jZUNvdW50IiwidG8iLCJNYXRoIiwibWF4IiwiTnVtYmVyIiwidG9TdHJpbmciLCJxdWVyeVNlbGVjdG9yIiwidmFsdWUiLCJ3aW5kb3ciLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiaGVpZ2h0IiwiZXZlbnRUeXBlIiwiY2hpbGRTZWxlY3RvciIsImV2ZW50SGFuZGxlciIsImVsZW1lbnRzIiwiZWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudE9uRWxlbWVudCIsInRhcmdldCIsIm1hdGNoZXMiLCJzZXF1ZW5jZV9jb3VudCIsIm1pbiIsImV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwib3BlcmF0aW9uIiwiY3VycmVudFRhcmdldCIsInByZXZlbnREZWZhdWx0IiwiYnV0dG9uVGh1bWJuYWlscyIsImdldEVsZW1lbnRCeUlkIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiY29udGFpbnMiLCJhZGQiLCJ1cmkiLCJub2RlcyIsIm9zZCIsInN0YXRlIiwidGh1bWJuYWlscyIsIndpZHRoIiwiY29udHJvbFpvb21PdXQiLCJjb250cm9sWm9vbUluIiwidG9nZ2xlUGFnZSIsIm5leHQiLCJpdGVtIiwicHJldmlvdXMiLCJwYXJzZUludCIsImF4aW9zIiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwic3RhdHVzIiwicGFyc2VyIiwiRE9NUGFyc2VyIiwiZG9jIiwicGFyc2VGcm9tU3RyaW5nIiwiZGF0YSIsImFwcGVuZENoaWxkIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiY291bnQiLCJWaWV3ZXIiLCJ3b3JsZCIsImdldEl0ZW1Db3VudCIsImkiLCJ0aWxlZEltYWdlIiwiZ2V0SXRlbUF0IiwiZ2V0RnVsbHlMb2FkZWQiLCJ2aWV3cG9ydCIsInNldFJvdGF0aW9uIiwiYWRkSGFuZGxlciIsIm5ld0Z1bGx5TG9hZGVkIiwiaXNGdWxseUxvYWRlZCIsImJvZHkiLCJmaXJlIiwibWVzc2FnZSIsInNldFRpbWVvdXQiLCJidXR0b24iLCJjbG9zZXN0IiwiZSIsImlkIiwidGl0bGUiLCJjdXJyZW50IiwidGlsZVNvdXJjZXMiLCJ0ZXh0Q29udGVudCIsImpvaW4iLCJvcGVuIiwic2VxdWVuY2VzIiwic2VxIiwiY2VpbCIsIkFycmF5IiwiZmlsbCIsIl8iLCJpbmRleCIsInB1c2giLCJzaGlmdCIsImxlbmd0aCIsInBvcCIsImZpbmQiLCJpbmNsdWRlcyIsInRvcCIsImV4aXRGdWxsc2NyZWVuIiwibXNFeGl0RnVsbHNjcmVlbiIsIm1vekNhbmNlbEZ1bGxTY3JlZW4iLCJ3ZWJraXRDYW5jZWxGdWxsU2NyZWVuIiwiZG9jRWxtIiwiZG9jdW1lbnRFbGVtZW50IiwicmVxdWVzdEZ1bGxzY3JlZW4iLCJtc1JlcXVlc3RGdWxsc2NyZWVuIiwibW96UmVxdWVzdEZ1bGxTY3JlZW4iLCJ3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJidXR0b25NZXRhZGF0YSIsInJvdGF0ZSIsInBhZ2VtZXRhIiwidG9nZ2xlTGFuZ3VhZ2UiLCJzbGlkZXIiLCJzbGlkZXJfdmFsdWUiLCJPcGVuU2VhZHJhZ29uIiwicHJlc2VydmVWaWV3cG9ydCIsInNob3dOYXZpZ2F0aW9uQ29udHJvbCIsInNob3dab29tQ29udHJvbCIsInNob3dIb21lQ29udHJvbCIsInNob3dGdWxsUGFnZUNvbnRyb2wiLCJ2aXNpYmlsaXR5UmF0aW8iLCJtaW5ab29tTGV2ZWwiLCJkZWZhdWx0Wm9vbUxldmVsIiwic2VxdWVuY2VNb2RlIiwiYWN0dWFsWm9vbSIsImdldFpvb20iLCJtYXhab29tIiwiZ2V0TWF4Wm9vbSIsIm1pblpvb20iLCJnZXRNaW5ab29tIiwib25zdWJtaXQiLCJvbmNsaWNrIiwiem9vbVRvIiwiem9vbSIsImRlZ3JlZXMiLCJjdXJyZW50X3RhcmdldCIsImV2ZW50X3ByZWZpeCIsInBhbmUiLCJtYWluIiwiaHRtbCIsImRpciIsImlubmVySFRNTCIsIm5vZGUiLCJsYW5nIiwidXJsIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInNlbGYiLCJsb2NhdGlvbiIsImFzc2lnbiJdLCJzb3VyY2VSb290IjoiIn0=