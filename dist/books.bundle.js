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
                        } // window.history.pushState({ view, sequence: to, identifier, type }, '', `/${type}/${identifier}/${to}`)


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
                        } // window.history.pushState({ view, sequence, identifier, type }, '', `/${type}/${identifier}/${sequence}`)


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
                        } // window.history.pushState({ view, sequence: to, identifier, type }, '', `/${type}/${identifier}/${to}`)


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0QsQ0FGRDs7VUFqMUJGO1VBQUE7WUFBQTtRQUFBO01BQUE7SUFBQTtFQUFBOzs7O0FBdTFCQTNHLFNBQVMsQ0FBQztFQUFFa0wsYUFBYSxFQUFFbkIsTUFBTSxDQUFDbUIsYUFBeEI7RUFBdUNwRixLQUFLLEVBQUxBLEtBQXZDO0VBQThDZ0gsVUFBVSxFQUFWQTtBQUE5QyxDQUFELENBQVQsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RsdHNfdmlld2VyLy4vanMvdmlld2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIFZpZXdlckFwcChZKSB7XG5cbiAgWS5WaWV3ZXIgPSBudWxsXG5cbiAgWS5pc0Z1bGx5TG9hZGVkID0gZmFsc2VcblxuICBZLnNlcW1hcCA9IHt9XG5cbiAgWS5ub2RlcyA9IHt9XG5cbiAgWS5ub2Rlcy5ib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpXG5cbiAgWS5ub2Rlcy50aHVtYm5haWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RodW1ibmFpbHMnKVxuXG4gIFkubm9kZXMuYnV0dG9uTWV0YWRhdGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcblxuICBZLm5vZGVzLnJvdGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250cm9sLXJvdGF0ZScpXG5cbiAgWS5ub2Rlcy5wYWdlbWV0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG5cbiAgWS5ub2Rlcy5vc2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3BlbnNlYWRyYWdvbjEnKVxuXG4gIFkubm9kZXMuZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcjZGlzcGxheScpXG5cbiAgWS5ub2Rlcy50b2dnbGVQYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1wYWdlJylcblxuICBZLm5vZGVzLmNvbnRyb2xab29tT3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1vdXQnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21JbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250cm9sLXpvb20taW4nKVxuXG4gIFkubm9kZXMudG9nZ2xlTGFuZ3VhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5IC5sYW5ndWFnZScpXG5cbiAgWS5ub2Rlcy5uZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5uZXh0JylcblxuICBZLm5vZGVzLnByZXZpb3VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2luZy5wcmV2aW91cycpXG5cbiAgWS5ub2Rlcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcblxuICBZLm5vZGVzLnNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKSAgXG5cbiAgY29uc3Qge1xuICAgIHZpZXcsIFxuICAgIHNlcXVlbmNlLCBcbiAgICBzZXF1ZW5jZUNvdW50LCBcbiAgICBjdXJyZW50LFxuICAgIHR5cGVcbiAgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcblxuICBZLmNvdW50ID0gTnVtYmVyKHNlcXVlbmNlQ291bnQpXG5cbiAgZnVuY3Rpb24gcG9zdE1lc3NhZ2UoZmlyZSwgbWVzc2FnZSkge1xuICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBmaXJlLCBtZXNzYWdlIH0pLCAnKicpXG4gIH1cblxuICBmdW5jdGlvbiB0b2dnbGV2aWV3KHByb3BzKSB7XG4gICAgY29uc3QgeyB2aWV3IH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgaWYgKHZpZXcgPT0gJ3NpbmdsZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdkb3VibGVwYWdlJ1xuICAgIH0gZWxzZSBpZiAodmlldyA9PSAnZG91YmxlcGFnZScpIHtcbiAgICAgIHByb3BzLmRhdGFzZXQudmlldyA9ICdzaW5nbGUnXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25fcGFnaW5nX2NsaWNrKGUpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgLyoqIHRlc3QgaWYgdGhlIHRhcmdldCBpcyBub3QgYWN0aXZlICovXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSByZXR1cm4gZmFsc2VcbiAgICB0cnkge1xuICAgICAgWS5ub2Rlcy5ib2R5LmNsYXNzTGlzdC5hZGQoJ29wZW5sYXllcnMtbG9hZGluZycpXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW5fb24oKSB7XG4gICAgY29uc3QgZG9jRWxtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICB9XG4gICAgaWYgKGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgZG9jRWxtLnJlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubW96UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY0VsbS53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgICBwb3N0TWVzc2FnZSgnYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywge30pXG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29mZigpIHtcbiAgICBjb25zdCB0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBpZiAoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgdG9wLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgfVxuICAgIHBvc3RNZXNzYWdlKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywge30pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzZXFtYXAocHJvcHMpIHtcbiAgICBjb25zdCB7IGNvdW50LCB2aWV3LCBzZXF1ZW5jZSB9ID0gcHJvcHNcbiAgICBjb25zdCBzZXF1ZW5jZXMgPSBbXVxuICAgIHN3aXRjaCAodmlldykge1xuICAgICAgY2FzZSAnZG91YmxlcGFnZSc6XG4gICAgICAgIGNvbnN0IHNlcSA9IE1hdGguY2VpbChOdW1iZXIoY291bnQpIC8gMikgKyAxXG4gICAgICAgIEFycmF5KHNlcSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICogMiwgaW5kZXggKiAyICsgMSBdKVxuICAgICAgICB9KVxuICAgICAgICAvLyBSZW1vdmUgMCBmcm9tIGZpcnN0IGluZGV4LlxuICAgICAgICBzZXF1ZW5jZXNbMF0uc2hpZnQoKVxuICAgICAgICAvLyBNYWtlIHN1cmUgbGFzdCBpbmRleCBkb2VzIG5vdCBpbmNsdWRlcyBvdXRib3VuZCBzZXF1ZW5jZXMuXG4gICAgICAgIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzFdID4gY291bnQpIHtcbiAgICAgICAgICBzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdLnBvcCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMF0gPiBjb3VudCkge1xuICAgICAgICAgIHNlcXVlbmNlcy5wb3AoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2VxdWVuY2VzLFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsICAgICAgICAgIFxuICAgICAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZXMuZmluZCh2YWx1ZSA9PiB2YWx1ZS5pbmNsdWRlcyhzZXF1ZW5jZSkgPT09IHRydWUpLFxuICAgICAgICB9XG4gICAgICBjYXNlICdzaW5nbGUnOlxuICAgICAgICBBcnJheShOdW1iZXIoY291bnQpKS5maWxsKCkubWFwKChfLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlcy5wdXNoKFsgaW5kZXggKyAxXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXF1ZW5jZXMsIFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIHZpZXcsXG4gICAgICAgICAgc2VxdWVuY2U6IFsgc2VxdWVuY2VzLmZpbmQodmFsdWUgPT4gTnVtYmVyKHZhbHVlKSA9PT0gTnVtYmVyKHNlcXVlbmNlKSkgXSxcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGxvYWRfc2VxdWVuY2UoZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuICAgICAgY29uc3QgZGF0YXNldCA9IG9zZC5kYXRhc2V0XG4gICAgICBjb25zdCB7IG9wZXJhdGlvbiwgdG8gfSAgPSBlLmRldGFpbFxuICAgICAgY29uc3QgZmlyZSA9IGB2aWV3ZXI6c2VxdWVuY2U6JHtvcGVyYXRpb259YFxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSAnaW5jcmVhc2UnOlxuICAgICAgICAgIGF3YWl0IGluY3JlYXNlKG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdkZWNyZWFzZSc6XG4gICAgICAgICAgYXdhaXQgZGVjcmVhc2Uob3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2NoYW5nZSc6XG4gICAgICAgICAgYXdhaXQgY2hhbmdlKHRvLCBvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndG9nZ2xldmlldyc6XG4gICAgICAgICAgdG9nZ2xldmlldyhvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIC8vIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBuZXcgc2VxdWVuY2UuXG4gICAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgICBpZDogb3NkLmlkLFxuICAgICAgICB0aXRsZTogZGF0YXNldC50aXRsZSxcbiAgICAgICAgY291bnQ6IFkuY291bnQsXG4gICAgICAgIHZpZXc6IGRhdGFzZXQudmlldyxcbiAgICAgICAgY3VycmVudDogTnVtYmVyKGRhdGFzZXQuY3VycmVudCksXG4gICAgICAgIHNlcXVlbmNlOiBOdW1iZXIoZGF0YXNldC5zZXF1ZW5jZSksXG4gICAgICAgIGlkZW50aWZpZXI6IGRhdGFzZXQuaWRlbnRpZmllcixcbiAgICAgICAgdXJpOiBgJHtkYXRhc2V0LnVyaX0vJHtkYXRhc2V0LnNlcXVlbmNlfWAsXG4gICAgICB9XG5cbiAgICAgIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKG1lc3NhZ2UpXG5cbiAgICAgIHBvc3RNZXNzYWdlKHsgZmlyZSwgbWVzc2FnZSB9KVxuXG4gICAgICBjb25zdCB0aWxlU291cmNlcyA9IGF3YWl0IHRpbGVzKFkuc2VxbWFwLCBkYXRhc2V0KVxuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudF9wYWdlJykudGV4dENvbnRlbnQgPSBZLnNlcW1hcC5zZXF1ZW5jZS5qb2luKCcgLSAnKVxuXG4gICAgICBZLm5vZGVzLm5leHQuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoZGF0YXNldC5zZXF1ZW5jZSA+PSBZLnNlcW1hcC5jb3VudCkge1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGRhdGFzZXQuc2VxdWVuY2UgPD0gMSkge1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBUb2dnbGUgdmlldyBvZiBib29rcyBwYWdlIGljb24uXG4gICAgICBpZiAoWS5ub2Rlcy50b2dnbGVQYWdlKSB7XG4gICAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICBzaG93KCcjb3BlbnNlYWRyYWdvbjEnKVxuXG4gICAgICBzaG93KCcjcGFnZXInKVxuXG4gICAgICBZLlZpZXdlci5vcGVuKHRpbGVTb3VyY2VzKVxuXG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcblxuICAgICAgWS5pc0Z1bGx5TG9hZGVkID0gdHJ1ZVxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vbigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29mZicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29uJylcbiAgICBlbGVtZW50LmNsb3Nlc3QoJy5wYW5lLWJvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlbWV0YS1oaWRkZW4nKVxuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgIGZpcmU6ICdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9uJyxcbiAgICAgIG1lc3NhZ2U6IHt9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgZWxlbWVudC5jbG9zZXN0KCcucGFuZS1ib2R5JykuY2xhc3NMaXN0LmFkZCgncGFnZW1ldGEtaGlkZGVuJylcbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICBmaXJlOiAnYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvZmYnLFxuICAgICAgbWVzc2FnZToge31cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gdGlsZXNfbG9hZGluZygpIHtcbiAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW5sYXllcnMtbG9hZGluZycpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGlsZXNfbG9hZGluZygpXG4gICAgICB9LCAxMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWRlKCcucGFuZS5sb2FkJylcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpIHtcbiAgICBpZiAoWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICAgIGhpZGUoJy5wYW5lLmxvYWQnKVxuICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICBmaXJlOiAndmlld2VyOmxvYWRlZCcsXG4gICAgICAgIG1lc3NhZ2U6IHt9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZF9pdGVtX2hhbmRsZXIoZXZlbnQpIHtcbiAgICBZLlZpZXdlci52aWV3cG9ydC5zZXRSb3RhdGlvbigwKVxuICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBldmVudC5pdGVtXG4gICAgdGlsZWRJbWFnZS5hZGRIYW5kbGVyKCdmdWxseS1sb2FkZWQtY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbmV3RnVsbHlMb2FkZWQgPSBhcmVfYWxsX2Z1bGx5X2xvYWRlZCgpXG4gICAgICBpZiAobmV3RnVsbHlMb2FkZWQgIT09IFkuaXNGdWxseUxvYWRlZCkge1xuICAgICAgICBZLmlzRnVsbHlMb2FkZWQgPSBuZXdGdWxseUxvYWRlZFxuICAgICAgICB1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBhcmVfYWxsX2Z1bGx5X2xvYWRlZCgpIHtcbiAgICBjb25zdCBjb3VudCA9IFkuVmlld2VyLndvcmxkLmdldEl0ZW1Db3VudCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCB0aWxlZEltYWdlID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUF0KGkpXG4gICAgICBpZiAoIXRpbGVkSW1hZ2UuZ2V0RnVsbHlMb2FkZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KCkge1xuICAgIGNvbnN0IG9zZCA9IFkubm9kZXMub3NkXG4gICAgY29uc3QgeyBzZXF1ZW5jZUNvdW50LCBzZXF1ZW5jZSB9ID0gb3NkLmRhdGFzZXRcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LnJlbW92ZSgndGh1bWJuYWlscy12aWV3JylcbiAgICBoaWRlKCcjdGh1bWJuYWlscycpXG4gICAgLy8gVG9nZ2xlIHZpZXcgb2YgYm9va3MgcGFnZSBpY29uLlxuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9XG4gICAgWS5ub2Rlcy5uZXh0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9KVxuICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChzZXF1ZW5jZSA+IDEpIHtcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9KVxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlIDwgc2VxdWVuY2VDb3VudCkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBvbl9vcGVuX3RodW1ibmFpbHNfdmlldygpIHtcbiAgICBjb25zdCB7IHVyaSB9ID0gWS5ub2Rlcy5vc2QuZGF0YXNldFxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IFkubm9kZXMudGh1bWJuYWlscy5kYXRhc2V0XG4gICAgY29uc3Qgd2lkdGggPSAnMjMwJ1xuICAgIGNvbnN0IGhlaWdodCA9ICcxNTAnXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5hZGQoJ3RodW1ibmFpbHMtdmlldycpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgLy8gVG9nZ2xlIHZpZXcgb2YgYm9va3MgcGFnZSBpY29uLlxuICAgIGlmIChZLm5vZGVzLnRvZ2dsZVBhZ2UpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9XG4gICAgWS5ub2Rlcy5uZXh0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9KVxuICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG4gICAgaWYgKHBhcnNlSW50KHN0YXRlLCAxMCkgPT09IDApIHtcbiAgICAgIGF4aW9zLmdldChgJHt1cml9L3RodW1ibmFpbHM/cGpheD10cnVlJndpZHRoPSR7d2lkdGh9JmhlaWdodD0ke2hlaWdodH1gKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpXG4gICAgICAgICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhyZXNwb25zZS5kYXRhLCAndGV4dC9odG1sJylcbiAgICAgICAgICAgWS5ub2Rlcy50aHVtYm5haWxzLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgZG9jLnF1ZXJ5U2VsZWN0b3IoJy50aHVtYm5haWxzLmNvbnRhaW5lcicpXG4gICAgICAgICAgKVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aHVtYm5haWxzLmNvbnRhaW5lciBhJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRodW1ibmFpbHNDbGljaylcbiAgICAgICAgICB9KVxuICAgICAgICAgIFkubm9kZXMudGh1bWJuYWlscy5kYXRhc2V0LnN0YXRlID0gMVxuICAgICAgICB9XG4gICAgICAgIHNob3coJyN0aHVtYm5haWxzJylcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25UaHVtYm5haWxzQ2xpY2soZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgYnV0dG9uVGh1bWJuYWlscyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tdGh1bWJuYWlscycpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpLmNsYXNzTGlzdC5yZW1vdmUoJ3RodW1ibmFpbHMtdmlldycpXG4gICAgaWYgKGJ1dHRvblRodW1ibmFpbHMuY2xhc3NMaXN0LmNvbnRhaW5zKCdvbicpKSB7XG4gICAgICBidXR0b25UaHVtYm5haWxzLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICAgIGJ1dHRvblRodW1ibmFpbHMuY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICB9XG4gICAgaGlkZSgnI3RodW1ibmFpbHMnKVxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgdG86IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5zZXF1ZW5jZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBzbGlkZV92YWx1ZV9jaGFuZ2UoZXZlbnQpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLFxuICAgICAgICAgIHRyaWdnZXI6ICdjaGFuZ2UnLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRlY3JlYXNlKHByb3BzKSB7XG4gICAgY29uc3QgeyB2aWV3LCBpZGVudGlmaWVyLCB0eXBlIH0gPSBwcm9wcy5kYXRhc2V0XG4gICAgY29uc3QgdG8gPSBNYXRoLm1pbiguLi5ZLnNlcW1hcC5zZXF1ZW5jZSkgLSAxXG4gICAgaWYgKHRvIDwgMSkge1xuICAgICAgcmV0dXJuIHRvXG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSB0by50b1N0cmluZygpXG4gICAgICBjb25zdCByYW5nZV93ZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JylcbiAgICAgIGNvbnN0IHNsaWRlcl92YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKVxuICAgICAgaWYgKHJhbmdlX3dlaWdodCAmJiBzbGlkZXJfdmFsdWUpIHtcbiAgICAgICAgcmFuZ2Vfd2VpZ2h0LnZhbHVlID0gdG9cbiAgICAgICAgc2xpZGVyX3ZhbHVlLnZhbHVlID0gdG9cbiAgICAgIH1cbiAgICAgIC8vIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IHZpZXcsIHNlcXVlbmNlOiB0bywgaWRlbnRpZmllciwgdHlwZSB9LCAnJywgYC8ke3R5cGV9LyR7aWRlbnRpZmllcn0vJHt0b31gKVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNoYW5nZSh0bywgcHJvcHMpIHtcbiAgICBjb25zdCB7IGlkZW50aWZpZXIsIHR5cGUsIHNlcXVlbmNlQ291bnQgfSA9IHByb3BzLmRhdGFzZXRcbiAgICBjb25zdCBzZXF1ZW5jZSA9IE51bWJlcih0bylcbiAgICBjb25zdCBzZXF1ZW5jZV9jb3VudCA9IE51bWJlcihzZXF1ZW5jZUNvdW50KVxuICAgIGlmIChzZXF1ZW5jZSA8IDEpIHtcbiAgICAgIHJldHVybiAxXG4gICAgfSBlbHNlIGlmIChzZXF1ZW5jZSA+IHNlcXVlbmNlX2NvdW50KSB7XG4gICAgICByZXR1cm4gc2VxdWVuY2VfY291bnRcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcHMuZGF0YXNldC5zZXF1ZW5jZSA9IHNlcXVlbmNlLnRvU3RyaW5nKClcbiAgICAgIGNvbnN0IHJhbmdlX3dlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuICAgICAgY29uc3Qgc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG4gICAgICBpZiAocmFuZ2Vfd2VpZ2h0ICYmIHNsaWRlcl92YWx1ZSkge1xuICAgICAgICByYW5nZV93ZWlnaHQudmFsdWUgPSB0b1xuICAgICAgICBzbGlkZXJfdmFsdWUudmFsdWUgPSB0b1xuICAgICAgfVxuICAgICAgLy8gd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgdmlldywgc2VxdWVuY2UsIGlkZW50aWZpZXIsIHR5cGUgfSwgJycsIGAvJHt0eXBlfS8ke2lkZW50aWZpZXJ9LyR7c2VxdWVuY2V9YClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZXZlbnRUeXBlLCBjaGlsZFNlbGVjdG9yLCBldmVudEhhbmRsZXIpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRPbkVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoZXZlbnRPbkVsZW1lbnQudGFyZ2V0Lm1hdGNoZXMoY2hpbGRTZWxlY3RvcikpIHtcbiAgICAgICAgICBldmVudEhhbmRsZXIoZXZlbnRPbkVsZW1lbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGlkZShzZWxlY3Rvcikge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goZWxtID0+IHtcbiAgICAgIGVsbS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuICAgICAgZWxtLnN0eWxlLnZpc2liaWxpdHkgPSBudWxsXG4gICAgICBlbG0uaGlkZGVuID0gbnVsbFxuICAgICAgZWxtLmhlaWdodCA9IDBcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gaW5jcmVhc2UocHJvcHMpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZGVudGlmaWVyLCBcbiAgICAgIHR5cGUsIFxuICAgICAgdmlldywgXG4gICAgICBzZXF1ZW5jZUNvdW50XG4gICAgfSA9IHByb3BzLmRhdGFzZXRcblxuICAgIGNvbnN0IHRvID0gTWF0aC5tYXgoLi4uWS5zZXFtYXAuc2VxdWVuY2UpICsgMVxuICAgIFxuICAgIGlmICh0byA+IE51bWJlcihzZXF1ZW5jZUNvdW50KSkge1xuICAgICAgcmV0dXJuIHNlcXVlbmNlQ291bnRcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcHMuZGF0YXNldC5zZXF1ZW5jZSA9IHRvLnRvU3RyaW5nKClcbiAgICAgIGNvbnN0IHJhbmdlX3dlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuICAgICAgY29uc3Qgc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG4gICAgICBpZiAocmFuZ2Vfd2VpZ2h0ICYmIHNsaWRlcl92YWx1ZSkge1xuICAgICAgICByYW5nZV93ZWlnaHQudmFsdWUgPSB0b1xuICAgICAgICBzbGlkZXJfdmFsdWUudmFsdWUgPSB0b1xuICAgICAgfVxuICAgICAgLy8gd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgdmlldywgc2VxdWVuY2U6IHRvLCBpZGVudGlmaWVyLCB0eXBlIH0sICcnLCBgLyR7dHlwZX0vJHtpZGVudGlmaWVyfS8ke3RvfWApXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2hvdyhzZWxlY3Rvcikge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goZWxtID0+IHtcbiAgICAgIGVsbS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuICAgICAgZWxtLnN0eWxlLnZpc2liaWxpdHkgPSBudWxsXG4gICAgICBlbG0uaGlkZGVuID0gbnVsbFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiB0aWxlcyhzZXFtYXAsIGRhdGFzZXQpIHtcbiAgICByZXR1cm4gc2VxbWFwLnNlcXVlbmNlLm1hcCgoc2VxdWVuY2UsIHgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpbGVTb3VyY2U6IGAke2RhdGFzZXQuc2VydmljZX0vJHtkYXRhc2V0LnR5cGV9LyR7ZGF0YXNldC5pZGVudGlmaWVyfS8ke3NlcXVlbmNlfS9pbmZvLmpzb25gLCB4XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHBvc3RNZXNzYWdlKCd2aWV3ZXI6aW5pdCcsIHt9KVxuXG4gIHBvc3RNZXNzYWdlKCd2aWV3ZXI6Y29udGVudHJlYWR5Jywge30pXG5cbiAgLy8gQ2FsbHMgdGlsZXMgbG9hZGluZy5cbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQoJ3ZpZXdlcjpjb250ZW50cmVhZHknKVxuICApXG5cbiAgaWYgKHZpZXcgPT0gJ2RvdWJsZXBhZ2UnKSB7XG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSAmJiBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYWdlLWRvdWJsZScpKSB7XG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1kb3VibGUnKVxuICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utc2luZ2xlJylcbiAgICB9XG4gIH1cblxuICBZLnNlcW1hcCA9IGF3YWl0IHNlcW1hcCh7IGNvdW50OiBZLmNvdW50LCB2aWV3LCBzZXF1ZW5jZSwgY3VycmVudCB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50X3BhZ2UnKS50ZXh0Q29udGVudCA9IFxuICAgIFkubm9kZXMub3NkLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZVxuICBcbiAgaWYgKFkubm9kZXMuc2xpZGVyKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXIudmFsdWUgPSBzZXF1ZW5jZVxuICB9XG4gIFxuICBpZiAoWS5ub2Rlcy5zbGlkZXJfdmFsdWUpIHtcbiAgICBZLm5vZGVzLnNsaWRlcl92YWx1ZS52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VxdWVuY2VfY291bnQnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0udGV4dENvbnRlbnQgPSBZLnNlcW1hcC5jb3VudFxuICB9KVxuXG4gIGNvbnN0IHRpbGVTb3VyY2VzID0gYXdhaXQgdGlsZXMoWS5zZXFtYXAsIFkubm9kZXMub3NkLmRhdGFzZXQpXG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBpZDogWS5ub2Rlcy5vc2QuaWQsXG4gICAgcHJlc2VydmVWaWV3cG9ydDogdHJ1ZSxcbiAgICBzaG93TmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dab29tQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd0hvbWVDb250cm9sOiBmYWxzZSxcbiAgICBzaG93RnVsbFBhZ2VDb250cm9sOiBmYWxzZSxcbiAgICB2aXNpYmlsaXR5UmF0aW86IDEsXG4gICAgbWluWm9vbUxldmVsOiAwLFxuICAgIGRlZmF1bHRab29tTGV2ZWw6IDAsXG4gICAgc2VxdWVuY2VNb2RlOiBmYWxzZSxcbiAgICB0aWxlU291cmNlczogdGlsZVNvdXJjZXMsXG4gIH1cblxuICBpZiAodHlwZSA9PSAnbWFwcycpIHtcbiAgICBvcHRpb25zLnNob3dOYXZpZ2F0b3IgPSB0cnVlXG4gIH1cblxuICBZLlZpZXdlciA9IFkuT3BlblNlYWRyYWdvbihvcHRpb25zKVxuXG4gIC8vIE9wZW5TZWFkcmFnb24gZXZlbnQuXG4gIFkuVmlld2VyLndvcmxkLmFkZEhhbmRsZXIoJ2FkZC1pdGVtJywgYWRkX2l0ZW1faGFuZGxlcilcblxuICAvLyBPcGVuU2VhZHJhZ29uIGV2ZW50LlxuICBZLlZpZXdlci5hZGRIYW5kbGVyKCd6b29tJywgKCkgPT4ge1xuXG4gICAgaWYgKFkubm9kZXMub3NkLmhpZGRlbikgcmV0dXJuXG5cbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWF4Wm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1heFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPCBtYXhab29tICYmXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA+PSBtYXhab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA8PSBtaW5ab29tXG4gICAgKSB7XG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tID4gbWluWm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfVxuXG4gIH0pXG5cbiAgY29uc3QgZm9ybVNlcXVlbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Zvcm0tdXBkYXRlLXNlcXVlbmNlJylcbiAgaWYgKGZvcm1TZXF1ZW5jZSAmJiBZLm5vZGVzLnNsaWRlcl92YWx1ZSkge1xuICAgIGZvcm1TZXF1ZW5jZS5vbnN1Ym1pdCA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICAgIHRvOiBZLm5vZGVzLnNsaWRlcl92YWx1ZS52YWx1ZSxcbiAgICAgICAgICAgIHRyaWdnZXI6ICdvbnN1Ym1pdCcsXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gaW4gY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21Jbi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWF4Wm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1heFpvb20oKVxuICAgIGNvbnN0IG1pblpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNaW5ab29tKClcbiAgICBjb25zdCB6b29tVG8gPSBhY3R1YWxab29tICogMlxuICAgIGlmIChhY3R1YWxab29tIDwgbWF4Wm9vbSkge1xuICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKHpvb21UbylcbiAgICB9XG4gICAgLy8gbG9vayBmb3IgZXZlbnQgb3B0aW9ucyAoT3BlblNlYURyYWdvbiB6b29tIGVuZClcbiAgICBpZiAoem9vbVRvID49IG1heFpvb20pIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfVxuICAgIGlmIChhY3R1YWxab29tID4gbWluWm9vbSkge1xuICAgICAgaWYgKFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmFjdGl2ZScpKSB7XG4gICAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFpvb20gb3V0IGNsaWNrIGV2ZW50LlxuICBZLm5vZGVzLmNvbnRyb2xab29tT3V0Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG4gICAgY29uc3Qgem9vbSA9IGFjdHVhbFpvb20gLyAyXG4gICAgaWYgKHpvb20gPj0gbWluWm9vbSkge1xuICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKHpvb20pXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhY3R1YWxab29tID4gbWluWm9vbSkge1xuICAgICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8obWluWm9vbSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBab29tIG91dCBjbGljayBldmVudC5cbiAgWS5ub2Rlcy5yb3RhdGUub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgWS5WaWV3ZXIudmlld3BvcnQuc2V0Um90YXRpb24oWS5WaWV3ZXIudmlld3BvcnQuZGVncmVlcyArIDkwKVxuICB9XG5cbiAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZSkge1xuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtZG91YmxlJylcbiAgICAgICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ3BhZ2Utc2luZ2xlJylcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1zaW5nbGUnKVxuICAgICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1kb3VibGUnKVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5vcGVyYXRpb24sXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EucGFnaW5nJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25fcGFnaW5nX2NsaWNrKVxuICB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYnV0dG9uJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXRcbiAgICAgIGxldCBldmVudF9wcmVmaXggPSBgYnV0dG9uOiR7Y3VycmVudF90YXJnZXQuaWR9YFxuICAgICAgLyoqIGRvbid0IHdhc3RlIHRpbWUgaWYgdGhlIGJ1dHRvbiBpcyBpbmFjdGl2ZSAqL1xuICAgICAgaWYgKGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9mZmAsIGV2ZW50KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY3VycmVudF90YXJnZXQuY2xhc3NMaXN0LmFkZCgnb24nKVxuICAgICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9Om9uYCwgZXZlbnQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChgJHtldmVudF9wcmVmaXh9OnRvZ2dsZWAsIGV2ZW50KVxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgaWYgKFkubm9kZXMuc2xpZGVyKSB7XG4gICAgWS5ub2Rlcy5zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2xpZGVfdmFsdWVfY2hhbmdlKVxuICB9ICBcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkOnNlcXVlbmNlJywgbG9hZF9zZXF1ZW5jZSlcblxuICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZSkgPT4ge1xuICAgIC8vIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgLy8gICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgLy8gICAgIGRldGFpbDoge1xuICAgIC8vICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgLy8gICAgICAgdG86IGhpc3Rvcnkuc3RhdGUuc2VxdWVuY2UsXG4gICAgLy8gICAgICAgdHJpZ2dlcjogJ3BvcHN0YXRlJyxcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSlcbiAgICAvLyApXG4gIC8vIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywgZnVsbHNjcmVlbl9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywgZnVsbHNjcmVlbl9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld2VyOmNvbnRlbnRyZWFkeScsIHRpbGVzX2xvYWRpbmcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9uJywgb25fb3Blbl90aHVtYm5haWxzX3ZpZXcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9mZicsIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KVxuXG4gIC8vIExhbmd1YWdlLlxuICBkZWxlZ2F0ZSgnYm9keScsICdjaGFuZ2UnLCAnLmxhbmctb3B0aW9ucyBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBheGlvcy5nZXQoY3VycmVudF90YXJnZXQudmFsdWUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICBjb25zdCBwYW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IHBhZ2VtZXRhID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy52aWV3LW1vZGUtbWV0YWRhdGEnKVxuICAgICAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmUubWFpbicpXG4gICAgICAgIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJylcbiAgICAgICAgaHRtbC5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBtYWluLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIHBhbmUuZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5pbm5lckhUTUwgPSBwYWdlbWV0YS5pbm5lckhUTUxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZvbHVtZS5cbiAgZGVsZWdhdGUoJ2JvZHknLCAnY2hhbmdlJywgJy52aWV3LW12IHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGNvbnN0IHZhbHVlID0gY3VycmVudF90YXJnZXQudmFsdWVcbiAgICBjb25zdCBub2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vZGUtZGx0cy1ib29rJylcbiAgICBjb25zdCBsYW5nID0gbm9kZS5kYXRhc2V0LmxhbmdcbiAgICBjb25zdCB1cmwgPSB2YWx1ZS5zdWJzdHJpbmcodmFsdWUuaW5kZXhPZignOjonKSArIDIsIHZhbHVlLmxlbmd0aCkgKyAnLzE/bGFuZz0nICsgbGFuZ1xuICAgIGlmICh3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgZmlyZTogJ2NoYW5nZTpvcHRpb246bXVsdGl2b2x1bWUnLFxuICAgICAgICBtZXNzYWdlOiB7IHVybCB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICAvLyB1cCBhcnJvdyAob3IgaSkgLSBudWRnZSB1cFxuICBZLmtleWJvYXJkSlMuYmluZChbJ2knLCAndXAnXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnaScsICd1cCddKVxuICB9KVxuXG4gIC8vIGRvd24gYXJyb3cgKG9yIG0pIC0gbnVkZ2UgZG93blxuICBZLmtleWJvYXJkSlMuYmluZChbJ20nLCAnZG93biddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydtJywgJ2Rvd24nXSlcbiAgfSlcblxuICAvLyByaWdodCBhcnJvdyAob3IgaykgLSBudWRnZSByaWdodFxuICBZLmtleWJvYXJkSlMuYmluZChbJ2snLCAncmlnaHQnXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnaycsICdyaWdodCddKVxuICB9KVxuXG4gIC8vIGxlZnQgYXJyb3cgKG9yIGopIC0gbnVkZ2UgbGVmdFxuICBZLmtleWJvYXJkSlMuYmluZChbJ2onLCAnbGVmdCddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydqJywgJ2xlZnQnXSlcbiAgfSlcblxuICAvLyBzaGlmdCArIHJpZ2h0IChvciBzaGlmdCArIGspIC0gbG9hZCBwYWdlIHRvIHRoZSByaWdodCBvZiB0aGlzIG9uZSAocHJldmlvdXMgb3IgbmV4dCBkZXBlbmRpbmcxMyBvbiBsYW5ndWFnZSlcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIHJpZ2h0JywgJ3NoaWZ0ICsgayddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydzaGlmdCArIHJpZ2h0JywgJ3NoaWZ0ICsgayddKVxuICB9KVxuICBcbiAgLy8gc2hpZnQgKyBsZWZ0IChvciBzaGlmdCArIGopIC0gbG9hZCBwYWdlIHRvIHRoZSBsZWZ0IG9mIHRoaXMgb25lIChwcmV2aW91cyBvciBuZXh0IGRlcGVuZGluZyBvbiBsYW5ndWFnZSlcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIGxlZnQnLCAnc2hpZnQgKyBqJ10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJ3NoaWZ0ICsgbGVmdCcsICdzaGlmdCArIGonXSlcbiAgfSlcblxuICAvLyBzaGlmdCArIHVwIGFycm93IChvciBzaGlmdCArIGkpIC0gem9vbSBpbiBvbmUgbGV2ZWxcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzaGlmdCArIHVwJywgJ3NoaWZ0ICsgaSddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWydzaGlmdCArIHVwJywgJ3NoaWZ0ICsgaSddKVxuICB9KVxuXG4gIC8vIHNoaWZ0ICsgZG93biAob3Igc2hpZnQgKyBtKSAtIHpvb20gb3V0IG9uZSBsZXZlbFxuICBZLmtleWJvYXJkSlMuYmluZChbJ3NoaWZ0ICsgZG93bicsICdzaGlmdCArIG0nXSwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFsnc2hpZnQgKyBkb3duJywgJ3NoaWZ0ICsgbSddKVxuICB9KVxuXG4gIC8vIDEgLSB6b29tIHRvIGZpdCBpbiB3aW5kb3dcbiAgWS5rZXlib2FyZEpTLmJpbmQoWycxJ10sICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhbJzEnXSlcbiAgfSlcblxuICAvLyAvIG9yID8gLSBzaG93L2hpZGUgaGVscFxuICBZLmtleWJvYXJkSlMuYmluZChbJy8nLCAnPyddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coWycvJywgJz8nXSlcbiAgfSlcblxuICAvLyAvIHNwYWNlYmFyIC0gc2hvdy9oaWRlIG1ldGFkYXRhIHBhbmVsICBcbiAgWS5rZXlib2FyZEpTLmJpbmQoWydzcGFjZWJhciddLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NwYWNlYmFyJylcbiAgfSlcblxufVxuXG5WaWV3ZXJBcHAoeyBPcGVuU2VhZHJhZ29uOiB3aW5kb3cuT3BlblNlYWRyYWdvbiwgYXhpb3MsIGtleWJvYXJkSlMgfSlcbiJdLCJuYW1lcyI6WyJWaWV3ZXJBcHAiLCJZIiwicG9zdE1lc3NhZ2UiLCJ0b2dnbGV2aWV3Iiwib25fcGFnaW5nX2NsaWNrIiwiZnVsbHNjcmVlbl9vbiIsImZ1bGxzY3JlZW5fb2ZmIiwic2VxbWFwIiwibG9hZF9zZXF1ZW5jZSIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vbiIsIm9uX2J1dHRvbl9tZXRhZGF0YV9vZmYiLCJ0aWxlc19sb2FkaW5nIiwidXBkYXRlX2xvYWRpbmdfaW5kaWNhdG9yIiwiYWRkX2l0ZW1faGFuZGxlciIsImFyZV9hbGxfZnVsbHlfbG9hZGVkIiwib25faGlkZV90aHVtYm5haWxzX3ZpZXciLCJvbl9vcGVuX3RodW1ibmFpbHNfdmlldyIsIm9uVGh1bWJuYWlsc0NsaWNrIiwic2xpZGVfdmFsdWVfY2hhbmdlIiwiZGVjcmVhc2UiLCJjaGFuZ2UiLCJkZWxlZ2F0ZSIsImhpZGUiLCJpbmNyZWFzZSIsInNob3ciLCJ0aWxlcyIsImRhdGFzZXQiLCJzZXF1ZW5jZSIsIm1hcCIsIngiLCJ0aWxlU291cmNlIiwic2VydmljZSIsInR5cGUiLCJpZGVudGlmaWVyIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWxtIiwic3R5bGUiLCJkaXNwbGF5IiwidmlzaWJpbGl0eSIsImhpZGRlbiIsInByb3BzIiwidmlldyIsInNlcXVlbmNlQ291bnQiLCJ0byIsIk1hdGgiLCJtYXgiLCJOdW1iZXIiLCJ0b1N0cmluZyIsInJhbmdlX3dlaWdodCIsInF1ZXJ5U2VsZWN0b3IiLCJzbGlkZXJfdmFsdWUiLCJ2YWx1ZSIsImhlaWdodCIsImV2ZW50VHlwZSIsImNoaWxkU2VsZWN0b3IiLCJldmVudEhhbmRsZXIiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnRPbkVsZW1lbnQiLCJ0YXJnZXQiLCJtYXRjaGVzIiwic2VxdWVuY2VfY291bnQiLCJtaW4iLCJldmVudCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIm9wZXJhdGlvbiIsImN1cnJlbnRUYXJnZXQiLCJ0cmlnZ2VyIiwicHJldmVudERlZmF1bHQiLCJidXR0b25UaHVtYm5haWxzIiwiZ2V0RWxlbWVudEJ5SWQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJjb250YWlucyIsImFkZCIsInVyaSIsIm5vZGVzIiwib3NkIiwic3RhdGUiLCJ0aHVtYm5haWxzIiwid2lkdGgiLCJjb250cm9sWm9vbU91dCIsImNvbnRyb2xab29tSW4iLCJ0b2dnbGVQYWdlIiwibmV4dCIsIml0ZW0iLCJwcmV2aW91cyIsInBhcnNlSW50IiwiYXhpb3MiLCJnZXQiLCJ0aGVuIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJwYXJzZXIiLCJET01QYXJzZXIiLCJkb2MiLCJwYXJzZUZyb21TdHJpbmciLCJkYXRhIiwiYXBwZW5kQ2hpbGQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJjb3VudCIsIlZpZXdlciIsIndvcmxkIiwiZ2V0SXRlbUNvdW50IiwiaSIsInRpbGVkSW1hZ2UiLCJnZXRJdGVtQXQiLCJnZXRGdWxseUxvYWRlZCIsInZpZXdwb3J0Iiwic2V0Um90YXRpb24iLCJhZGRIYW5kbGVyIiwibmV3RnVsbHlMb2FkZWQiLCJpc0Z1bGx5TG9hZGVkIiwiYm9keSIsImZpcmUiLCJtZXNzYWdlIiwic2V0VGltZW91dCIsImJ1dHRvbiIsImNsb3Nlc3QiLCJlIiwiaWQiLCJ0aXRsZSIsImN1cnJlbnQiLCJ0aWxlU291cmNlcyIsInRleHRDb250ZW50Iiwiam9pbiIsIm9wZW4iLCJzZXF1ZW5jZXMiLCJzZXEiLCJjZWlsIiwiQXJyYXkiLCJmaWxsIiwiXyIsImluZGV4IiwicHVzaCIsInNoaWZ0IiwibGVuZ3RoIiwicG9wIiwiZmluZCIsImluY2x1ZGVzIiwidG9wIiwiZXhpdEZ1bGxzY3JlZW4iLCJtc0V4aXRGdWxsc2NyZWVuIiwibW96Q2FuY2VsRnVsbFNjcmVlbiIsIndlYmtpdENhbmNlbEZ1bGxTY3JlZW4iLCJkb2NFbG0iLCJkb2N1bWVudEVsZW1lbnQiLCJyZXF1ZXN0RnVsbHNjcmVlbiIsIm1zUmVxdWVzdEZ1bGxzY3JlZW4iLCJtb3pSZXF1ZXN0RnVsbFNjcmVlbiIsIndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIiwid2luZG93IiwiSlNPTiIsInN0cmluZ2lmeSIsImJ1dHRvbk1ldGFkYXRhIiwicm90YXRlIiwicGFnZW1ldGEiLCJ0b2dnbGVMYW5ndWFnZSIsInNsaWRlciIsIm9wdGlvbnMiLCJwcmVzZXJ2ZVZpZXdwb3J0Iiwic2hvd05hdmlnYXRpb25Db250cm9sIiwic2hvd1pvb21Db250cm9sIiwic2hvd0hvbWVDb250cm9sIiwic2hvd0Z1bGxQYWdlQ29udHJvbCIsInZpc2liaWxpdHlSYXRpbyIsIm1pblpvb21MZXZlbCIsImRlZmF1bHRab29tTGV2ZWwiLCJzZXF1ZW5jZU1vZGUiLCJzaG93TmF2aWdhdG9yIiwiT3BlblNlYWRyYWdvbiIsImFjdHVhbFpvb20iLCJnZXRab29tIiwibWF4Wm9vbSIsImdldE1heFpvb20iLCJtaW5ab29tIiwiZ2V0TWluWm9vbSIsImZvcm1TZXF1ZW5jZSIsIm9uc3VibWl0Iiwib25jbGljayIsInpvb21UbyIsInpvb20iLCJkZWdyZWVzIiwiY3VycmVudF90YXJnZXQiLCJldmVudF9wcmVmaXgiLCJwYW5lIiwibWFpbiIsImh0bWwiLCJkaXIiLCJpbm5lckhUTUwiLCJub2RlIiwibGFuZyIsInVybCIsInN1YnN0cmluZyIsImluZGV4T2YiLCJzZWxmIiwibG9jYXRpb24iLCJhc3NpZ24iLCJrZXlib2FyZEpTIiwiYmluZCJdLCJzb3VyY2VSb290IjoiIn0=