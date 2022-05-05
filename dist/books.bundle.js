/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ "./node_modules/axios/lib/defaults/transitional.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ../core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");
var transitionalDefaults = __webpack_require__(/*! ./transitional */ "./node_modules/axios/lib/defaults/transitional.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ../adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ../adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = {
  "version": "0.26.1"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./js/componets/decrease-sequence.js":
/*!*******************************************!*\
  !*** ./js/componets/decrease-sequence.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decrease": () => (/* binding */ decrease)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function decrease(_x) {
  return _decrease.apply(this, arguments);
}

function _decrease() {
  _decrease = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props) {
    var sequence_current, sequence;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sequence_current = Number(props.dataset.sequence);
            sequence = sequence_current - 1;

            if (!(sequence < 1)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", sequence);

          case 6:
            props.dataset.sequence = sequence.toString();
            document.querySelector('#range_weight').value = sequence;
            document.querySelector('#slider_value').value = sequence;

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _decrease.apply(this, arguments);
}



/***/ }),

/***/ "./js/componets/increase-sequence.js":
/*!*******************************************!*\
  !*** ./js/componets/increase-sequence.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "increase": () => (/* binding */ increase)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function increase(_x) {
  return _increase.apply(this, arguments);
}

function _increase() {
  _increase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props) {
    var sequence_current, sequence_count, sequence;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sequence_current = Number(props.dataset.sequence);
            sequence_count = Number(props.dataset.sequenceCount);
            sequence = sequence_current + 1;

            if (!(sequence > sequence_count)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", sequence_count);

          case 7:
            props.dataset.sequence = sequence.toString();
            document.querySelector('#range_weight').value = sequence;
            document.querySelector('#slider_value').value = sequence;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _increase.apply(this, arguments);
}



/***/ }),

/***/ "./js/componets/tile-sources.js":
/*!**************************************!*\
  !*** ./js/componets/tile-sources.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tiles": () => (/* binding */ tiles)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function tiles(_x, _x2) {
  return _tiles.apply(this, arguments);
}

function _tiles() {
  _tiles = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(seqmap, dataset) {
    var current;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            current = dataset.sequence - 1;
            return _context.abrupt("return", seqmap.sequences[current].map(function (sequence, x) {
              return {
                tileSource: "".concat(dataset.service, "/").concat(dataset.type, "/").concat(dataset.identifier, "/").concat(sequence, "/info.json"),
                x: x
              };
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _tiles.apply(this, arguments);
}



/***/ }),

/***/ "./js/componets/toggleview-sequence.js":
/*!*********************************************!*\
  !*** ./js/componets/toggleview-sequence.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toggleview": () => (/* binding */ toggleview)
/* harmony export */ });
/* harmony import */ var _seqmap_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./seqmap.mjs */ "./js/componets/seqmap.mjs");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function toggleview(_x, _x2) {
  return _toggleview.apply(this, arguments);
}

function _toggleview() {
  _toggleview = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props, _seqmap) {
    var sequence_current, count, view, _;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('toggleview', props, _seqmap);

            if (props.dataset.view == 'single') {
              props.dataset.view = 'doublepage';
            } else {
              props.dataset.view = 'single';
            }

            sequence_current = _seqmap.sequences[Number(props.dataset.sequence) - 1].find(function (e) {
              return true;
            });
            count = props.dataset.sequenceCount;
            view = props.dataset.view;
            _context.next = 7;
            return (0,_seqmap_mjs__WEBPACK_IMPORTED_MODULE_0__.seqmap)({
              count: count,
              view: view
            });

          case 7:
            _ = _context.sent;
            props.dataset.sequence = sequence_current; // props.dataset.sequenceCount = _.count

            document.querySelector('#range_weight').max = _.count;
            document.querySelector('.sequence_count').textContent = _.count;
            document.querySelector('.current_page').textContent = sequence_current;
            document.querySelector('#slider_value').value = sequence_current;
            document.querySelector('#range_weight').value = sequence_current;
            return _context.abrupt("return", _);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _toggleview.apply(this, arguments);
}



/***/ }),

/***/ "./js/componets/change-sequence.mjs":
/*!******************************************!*\
  !*** ./js/componets/change-sequence.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "change": () => (/* binding */ change)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function change(_x, _x2) {
  return _change.apply(this, arguments);
}

function _change() {
  _change = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(to, props) {
    var sequence, sequence_count;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sequence = Number(to);
            sequence_count = Number(props.dataset.sequenceCount);

            if (!(sequence < 1)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", 1);

          case 6:
            if (!(sequence > sequence_count)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", sequence_count);

          case 10:
            props.dataset.sequence = sequence.toString();
            document.querySelector('#range_weight').value = sequence;
            document.querySelector('#slider_value').value = sequence;

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _change.apply(this, arguments);
}



/***/ }),

/***/ "./js/componets/delegate.mjs":
/*!***********************************!*\
  !*** ./js/componets/delegate.mjs ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delegate": () => (/* binding */ delegate)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function delegate(selector, eventType, childSelector, eventHandler) {
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
}



/***/ }),

/***/ "./js/componets/hide.mjs":
/*!*******************************!*\
  !*** ./js/componets/hide.mjs ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hide": () => (/* binding */ hide)
/* harmony export */ });
function hide(selector) {
  document.querySelectorAll(selector).forEach(function (elm) {
    elm.style.display = null;
    elm.style.visibility = null;
    elm.hidden = null;
    elm.height = 0;
  });
}



/***/ }),

/***/ "./js/componets/seqmap.mjs":
/*!*********************************!*\
  !*** ./js/componets/seqmap.mjs ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "seqmap": () => (/* binding */ seqmap)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function singlepage(_x) {
  return _singlepage.apply(this, arguments);
}

function _singlepage() {
  _singlepage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props) {
    var count, sequences;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            count = props.count;
            sequences = [];
            Array(Number(count)).fill().map(function (_, index) {
              sequences.push([index + 1]);
            });
            return _context.abrupt("return", {
              sequences: sequences,
              count: sequences.length
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _singlepage.apply(this, arguments);
}

function doublepage(_x2) {
  return _doublepage.apply(this, arguments);
}

function _doublepage() {
  _doublepage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(props) {
    var count, sequences, seq;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            count = props.count;
            sequences = [];
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

            return _context2.abrupt("return", {
              sequences: sequences,
              count: sequences.length
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _doublepage.apply(this, arguments);
}

function seqmap(_x3) {
  return _seqmap.apply(this, arguments);
}

function _seqmap() {
  _seqmap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(props) {
    var count, view;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('called : function : seqmap : props', props);
            count = props.count, view = props.view;
            _context3.t0 = view;
            _context3.next = _context3.t0 === 'doublepage' ? 5 : 8;
            break;

          case 5:
            _context3.next = 7;
            return doublepage({
              count: count
            });

          case 7:
            return _context3.abrupt("return", _context3.sent);

          case 8:
            _context3.next = 10;
            return singlepage({
              count: count
            });

          case 10:
            return _context3.abrupt("return", _context3.sent);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _seqmap.apply(this, arguments);
}



/***/ }),

/***/ "./js/componets/show.mjs":
/*!*******************************!*\
  !*** ./js/componets/show.mjs ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "show": () => (/* binding */ show)
/* harmony export */ });
function show(selector) {
  document.querySelectorAll(selector).forEach(function (elm) {
    elm.style.display = null;
    elm.style.visibility = null;
    elm.hidden = null;
  });
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./js/viewer.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _componets_seqmap_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./componets/seqmap.mjs */ "./js/componets/seqmap.mjs");
/* harmony import */ var _componets_hide_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./componets/hide.mjs */ "./js/componets/hide.mjs");
/* harmony import */ var _componets_show_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./componets/show.mjs */ "./js/componets/show.mjs");
/* harmony import */ var _componets_delegate_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./componets/delegate.mjs */ "./js/componets/delegate.mjs");
/* harmony import */ var _componets_decrease_sequence_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./componets/decrease-sequence.js */ "./js/componets/decrease-sequence.js");
/* harmony import */ var _componets_increase_sequence_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./componets/increase-sequence.js */ "./js/componets/increase-sequence.js");
/* harmony import */ var _componets_change_sequence_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./componets/change-sequence.mjs */ "./js/componets/change-sequence.mjs");
/* harmony import */ var _componets_tile_sources_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./componets/tile-sources.js */ "./js/componets/tile-sources.js");
/* harmony import */ var _componets_toggleview_sequence_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./componets/toggleview-sequence.js */ "./js/componets/toggleview-sequence.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }












function ViewerApp(_x) {
  return _ViewerApp.apply(this, arguments);
}

function _ViewerApp() {
  _ViewerApp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(Y) {
    var on_button_click, on_paging_click, fullscreen_on, fullscreen_off, load_sequence, _load_sequence, on_button_metadata_on, on_button_metadata_off, tiles_loading, update_loading_indicator, add_item_handler, are_all_fully_loaded, on_hide_thumbnails_view, on_open_thumbnails_view, onThumbnailsClick, slide_value_change, _Y$nodes$osd$dataset, view, sequence, sequenceCount, params, req_sequence, tileSources;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
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
              Y.nodes.html.classList.remove('thumbnails-view');

              if (Y.nodes.buttonThumbnails.classList.contains('on')) {
                Y.nodes.buttonThumbnails.classList.remove('on');
                Y.nodes.buttonThumbnails.classList.add('off');
              }

              (0,_componets_hide_mjs__WEBPACK_IMPORTED_MODULE_1__.hide)('#thumbnails');
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
              Y.nodes.html.classList.add('thumbnails-view');
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
                (0,axios__WEBPACK_IMPORTED_MODULE_0__.get)("".concat(uri, "/thumbnails?pjax=true&width=").concat(width, "&height=").concat(height)).then(function (response) {
                  if (response.status === 200) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.data, 'text/html');
                    Y.nodes.thumbnails.appendChild(doc.querySelector('.thumbnails.container'));
                    document.querySelectorAll('.thumbnails.container a').forEach(function (item) {
                      item.addEventListener('click', onThumbnailsClick);
                    });
                    Y.nodes.thumbnails.dataset.state = 1;
                  }

                  (0,_componets_show_mjs__WEBPACK_IMPORTED_MODULE_2__.show)('#thumbnails');
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
              Y.nodes.html.classList.remove('thumbnails-view');
              (0,_componets_hide_mjs__WEBPACK_IMPORTED_MODULE_1__.hide)('#thumbnails');
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
                (0,_componets_hide_mjs__WEBPACK_IMPORTED_MODULE_1__.hide)('.pane.load');
                window.top.postMessage(JSON.stringify({
                  fire: 'viewer:loaded',
                  message: {}
                }), '*');
              }
            };

            tiles_loading = function _tiles_loading() {
              if (body.classList.contains('openlayers-loading')) {
                setTimeout(function () {
                  tiles_loading();
                }, 100);
              } else {
                (0,_componets_hide_mjs__WEBPACK_IMPORTED_MODULE_1__.hide)('.pane.load');
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
              window.top.postMessage(JSON.stringify({
                fire: 'button:button-metadata:off',
                message: {}
              }), '*');
            };

            on_button_metadata_on = function _on_button_metadata_o() {
              var button = document.querySelector('#button-metadata');
              var element = document.querySelector('#pagemeta');
              element.classList.remove('hidden');
              button.classList.remove('off');
              button.classList.add('on');
              element.closest('.pane-body').classList.remove('pagemeta-hidden');
              window.top.postMessage(JSON.stringify({
                fire: 'button:button-metadata:on',
                message: {}
              }), '*');
            };

            _load_sequence = function _load_sequence3() {
              _load_sequence = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                var items, osd, dataset, config, _tileSources;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        items = [];
                        osd = Y.nodes.osd;
                        dataset = osd.dataset;
                        _context.t0 = e.detail.operation;
                        _context.next = _context.t0 === 'increase' ? 7 : _context.t0 === 'decrease' ? 10 : _context.t0 === 'change' ? 13 : _context.t0 === 'toggleview' ? 16 : 20;
                        break;

                      case 7:
                        _context.next = 9;
                        return (0,_componets_increase_sequence_js__WEBPACK_IMPORTED_MODULE_3__.increase)(osd);

                      case 9:
                        return _context.abrupt("break", 20);

                      case 10:
                        _context.next = 12;
                        return (0,_componets_decrease_sequence_js__WEBPACK_IMPORTED_MODULE_4__.decrease)(osd);

                      case 12:
                        return _context.abrupt("break", 20);

                      case 13:
                        _context.next = 15;
                        return (0,_componets_change_sequence_mjs__WEBPACK_IMPORTED_MODULE_5__.change)(e.detail.to, osd);

                      case 15:
                        return _context.abrupt("break", 20);

                      case 16:
                        _context.next = 18;
                        return (0,_componets_toggleview_sequence_js__WEBPACK_IMPORTED_MODULE_6__.toggleview)(osd, Y.seqmap);

                      case 18:
                        Y.seqmap = _context.sent;
                        return _context.abrupt("break", 20);

                      case 20:
                        /** Configuration for the new book page */
                        config = {
                          id: osd.id,
                          title: osd.dataset.title,
                          sequence: osd.dataset.sequence,
                          sequenceCount: Y.seqmap.count,
                          uri: osd.dataset.uri
                        };
                        window.top.postMessage(JSON.stringify({
                          fire: 'viewer:sequence:change',
                          message: config
                        }), '*');
                        _context.next = 24;
                        return (0,_componets_tile_sources_js__WEBPACK_IMPORTED_MODULE_7__.tiles)(Y.seqmap, dataset);

                      case 24:
                        _tileSources = _context.sent;
                        Y.nodes.loadingMsg.textContent = items.join(' - ');
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
                        (0,_componets_show_mjs__WEBPACK_IMPORTED_MODULE_2__.show)('#openseadragon1');
                        (0,_componets_show_mjs__WEBPACK_IMPORTED_MODULE_2__.show)('#pager');
                        Y.Viewer.open(_tileSources);
                        Y.nodes.body.classList.remove('openlayers-loading');
                        Y.isFullyLoaded = true;
                        _context.next = 40;
                        break;

                      case 37:
                        _context.prev = 37;
                        _context.t1 = _context["catch"](0);
                        console.log(_context.t1);

                      case 40:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 37]]);
              }));
              return _load_sequence.apply(this, arguments);
            };

            load_sequence = function _load_sequence2(_x2) {
              return _load_sequence.apply(this, arguments);
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

              window.top.postMessage(JSON.stringify({
                fire: 'button:button-fullscreen:off',
                message: {}
              }), '*');
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

              window.top.postMessage(JSON.stringify({
                fire: 'button:button-fullscreen:on',
                message: {}
              }), '*');
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

            on_button_click = function _on_button_click(e) {
              e.preventDefault();
              var current_target = e.currentTarget;
              var event_prefix, event_id;
              /** don't waste time if the button is inactive */

              if (current_target.classList.contains('inactive')) return;
              /** current target is the main target */
              else {
                event_id = current_target.id;
                event_prefix = 'button:' + event_id;
              }

              if (current_target.classList.contains('on')) {
                current_target.classList.remove('on');
                current_target.classList.add('off');
                console.log("".concat(event_prefix, ":off"));
                document.dispatchEvent(new CustomEvent("".concat(event_prefix, ":off"), e));
              } else {
                current_target.classList.add('on');
                current_target.classList.remove('off');
                console.log("".concat(event_prefix, ":on"));
                document.dispatchEvent(new CustomEvent("".concat(event_prefix, ":on"), e));
              }

              document.dispatchEvent(new CustomEvent("".concat(event_prefix, ":toggle"), e));
            };

            window.top.postMessage(JSON.stringify({
              fire: 'viewer:init',
              message: {}
            }), '*');
            Y.Viewer = null;
            Y.isFullyLoaded = false;
            Y.seqmap = [];
            Y.nodes = {};
            Y.nodes.html = document.querySelector('html');
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
            Y.nodes.loadingMsg = document.querySelector('.current_page');
            Y.nodes.buttonThumbnails = document.getElementById('button-thumbnails');
            Y.nodes.next = document.querySelectorAll('.paging.next');
            Y.nodes.previous = document.querySelectorAll('.paging.previous');
            _Y$nodes$osd$dataset = Y.nodes.osd.dataset, view = _Y$nodes$osd$dataset.view, sequence = _Y$nodes$osd$dataset.sequence, sequenceCount = _Y$nodes$osd$dataset.sequenceCount;
            params = new URLSearchParams(window.location.search);
            req_sequence = params.get('sequence');

            if (!req_sequence) {
              req_sequence = sequence;
            }

            if (view == 'doublepage') {
              if (Y.nodes.togglePage.classList.contains('page-double')) {
                Y.nodes.togglePage.classList.remove('page-double');
                Y.nodes.togglePage.classList.add('page-single');
              }
            }

            _context2.next = 46;
            return (0,_componets_seqmap_mjs__WEBPACK_IMPORTED_MODULE_8__.seqmap)({
              count: sequenceCount,
              view: view
            });

          case 46:
            Y.seqmap = _context2.sent;
            document.querySelector('.current_page').textContent = Y.nodes.osd.dataset.sequence = Y.nodes.slider.value = Y.nodes.slider_value.value = req_sequence;
            Y.nodes.slider.max = Y.seqmap.count;
            document.querySelectorAll('.sequence_count').forEach(function (item) {
              item.textContent = Y.seqmap.count;
            });
            _context2.next = 52;
            return (0,_componets_tile_sources_js__WEBPACK_IMPORTED_MODULE_7__.tiles)(Y.seqmap, Y.nodes.osd.dataset);

          case 52:
            tileSources = _context2.sent;
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
            }); // Calls tiles loading

            document.dispatchEvent(new CustomEvent('viewer:contentready')); // OpenSeadragon event.

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
              item.addEventListener('click', on_button_click);
            });
            Y.nodes.slider.addEventListener('change', slide_value_change);
            document.addEventListener('load:sequence', load_sequence);
            document.addEventListener('button:button-metadata:on', on_button_metadata_on);
            document.addEventListener('button:button-metadata:off', on_button_metadata_off);
            document.addEventListener('button:button-fullscreen:on', fullscreen_on);
            document.addEventListener('button:button-fullscreen:off', fullscreen_off);
            document.addEventListener('viewer:contentready', tiles_loading);
            document.addEventListener('button:button-thumbnails:on', on_open_thumbnails_view);
            document.addEventListener('button:button-thumbnails:off', on_hide_thumbnails_view); // Language

            (0,_componets_delegate_mjs__WEBPACK_IMPORTED_MODULE_9__.delegate)('body', 'change', '.lang-options select', function (event) {
              var current_target = event.target;
              (0,axios__WEBPACK_IMPORTED_MODULE_0__.get)(current_target.value).then(function (response) {
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
            }); // Volume

            (0,_componets_delegate_mjs__WEBPACK_IMPORTED_MODULE_9__.delegate)('body', 'change', '.view-mv select', function (event) {
              var current_target = event.target;
              var value = current_target.value;
              var node = document.querySelector('.node-dlts-book');
              var lang = node.dataset.lang;
              var url = value.substring(value.indexOf('::') + 2, value.length) + '/1?lang=' + lang;

              if (window.self === window.top) {
                window.location.assign(url);
              }
            });

          case 75:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ViewerApp.apply(this, arguments);
}

ViewerApp({
  OpenSeadragon: window.OpenSeadragon
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va3MuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDRGQUF1Qzs7Ozs7Ozs7Ozs7QUNBMUI7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFEQUFZO0FBQ2hDLGFBQWEsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDdkMsY0FBYyxtQkFBTyxDQUFDLHlFQUFzQjtBQUM1QyxlQUFlLG1CQUFPLENBQUMsMkVBQXVCO0FBQzlDLG9CQUFvQixtQkFBTyxDQUFDLDZFQUF1QjtBQUNuRCxtQkFBbUIsbUJBQU8sQ0FBQyxtRkFBMkI7QUFDdEQsc0JBQXNCLG1CQUFPLENBQUMseUZBQThCO0FBQzVELGtCQUFrQixtQkFBTyxDQUFDLHlFQUFxQjtBQUMvQywyQkFBMkIsbUJBQU8sQ0FBQyxtRkFBMEI7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLG1FQUFrQjs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2Q0FBNkM7QUFDN0M7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7OztBQ25OYTs7QUFFYixZQUFZLG1CQUFPLENBQUMsa0RBQVM7QUFDN0IsV0FBVyxtQkFBTyxDQUFDLGdFQUFnQjtBQUNuQyxZQUFZLG1CQUFPLENBQUMsNERBQWM7QUFDbEMsa0JBQWtCLG1CQUFPLENBQUMsd0VBQW9CO0FBQzlDLGVBQWUsbUJBQU8sQ0FBQyw4REFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLG1CQUFPLENBQUMsa0VBQWlCO0FBQ3hDLG9CQUFvQixtQkFBTyxDQUFDLDRFQUFzQjtBQUNsRCxpQkFBaUIsbUJBQU8sQ0FBQyxzRUFBbUI7QUFDNUMsZ0JBQWdCLHVGQUE2Qjs7QUFFN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsb0VBQWtCOztBQUV6QztBQUNBLHFCQUFxQixtQkFBTyxDQUFDLGdGQUF3Qjs7QUFFckQ7O0FBRUE7QUFDQSx5QkFBc0I7Ozs7Ozs7Ozs7OztBQ3hEVDs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7OztBQ2xCYTs7QUFFYixhQUFhLG1CQUFPLENBQUMsMkRBQVU7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3RIYTs7QUFFYjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0phOztBQUViLFlBQVksbUJBQU8sQ0FBQyxxREFBWTtBQUNoQyxlQUFlLG1CQUFPLENBQUMseUVBQXFCO0FBQzVDLHlCQUF5QixtQkFBTyxDQUFDLGlGQUFzQjtBQUN2RCxzQkFBc0IsbUJBQU8sQ0FBQywyRUFBbUI7QUFDakQsa0JBQWtCLG1CQUFPLENBQUMsbUVBQWU7QUFDekMsZ0JBQWdCLG1CQUFPLENBQUMsMkVBQXNCOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixLQUFLO0FBQ0w7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7QUNuSmE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFEQUFZOztBQUVoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQjtBQUNBLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7Ozs7Ozs7Ozs7O0FDckRhOztBQUViLG9CQUFvQixtQkFBTyxDQUFDLG1GQUEwQjtBQUN0RCxrQkFBa0IsbUJBQU8sQ0FBQywrRUFBd0I7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkJhOztBQUViLG1CQUFtQixtQkFBTyxDQUFDLHFFQUFnQjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakJhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxxREFBWTtBQUNoQyxvQkFBb0IsbUJBQU8sQ0FBQyx1RUFBaUI7QUFDN0MsZUFBZSxtQkFBTyxDQUFDLHVFQUFvQjtBQUMzQyxlQUFlLG1CQUFPLENBQUMsK0RBQWE7QUFDcEMsYUFBYSxtQkFBTyxDQUFDLG1FQUFrQjs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CLHVDQUF1QztBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7OztBQ3RGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDMUNhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxtREFBVTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTiwyQkFBMkI7QUFDM0IsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEdhOztBQUViLGtCQUFrQixtQkFBTyxDQUFDLG1FQUFlOztBQUV6QztBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEJhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxxREFBWTtBQUNoQyxlQUFlLG1CQUFPLENBQUMsK0RBQWE7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZUFBZTtBQUMxQixXQUFXLE9BQU87QUFDbEIsV0FBVyxnQkFBZ0I7QUFDM0IsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7Ozs7Ozs7Ozs7O0FDckJhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxtREFBVTtBQUM5QiwwQkFBMEIsbUJBQU8sQ0FBQywrRkFBZ0M7QUFDbEUsbUJBQW1CLG1CQUFPLENBQUMsMkVBQXNCO0FBQ2pELDJCQUEyQixtQkFBTyxDQUFDLHlFQUFnQjs7QUFFbkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG1CQUFPLENBQUMsaUVBQWlCO0FBQ3ZDLElBQUk7QUFDSjtBQUNBLGNBQWMsbUJBQU8sQ0FBQyxrRUFBa0I7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7Ozs7QUNsSWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNWYTs7QUFFYixZQUFZLG1CQUFPLENBQUMscURBQVk7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDckVhOztBQUViO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDYmE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFEQUFZOztBQUVoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMkNBQTJDO0FBQzNDLFNBQVM7O0FBRVQ7QUFDQSw0REFBNEQsd0JBQXdCO0FBQ3BGO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDLGdDQUFnQyxjQUFjO0FBQzlDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7OztBQ3BEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNiYTs7QUFFYixZQUFZLG1CQUFPLENBQUMscURBQVk7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDWmE7O0FBRWIsWUFBWSxtQkFBTyxDQUFDLHFEQUFZOztBQUVoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7O0FDbkVhOztBQUViLFlBQVksbUJBQU8sQ0FBQyxtREFBVTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7QUNYYTs7QUFFYixZQUFZLG1CQUFPLENBQUMscURBQVk7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDMUJhOztBQUViLGNBQWMsd0ZBQThCOztBQUU1Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxtQkFBbUI7QUFDOUIsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsU0FBUztBQUNwQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pGYTs7QUFFYixXQUFXLG1CQUFPLENBQUMsZ0VBQWdCOztBQUVuQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVMsR0FBRyxTQUFTO0FBQzVDLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sNEJBQTRCO0FBQzVCLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUEsd0NBQXdDLE9BQU87QUFDL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQzVWZUE7Ozs7O3NFQUFmLGlCQUF3QkMsS0FBeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1FDLFlBQUFBLGdCQURSLEdBQzJCQyxNQUFNLENBQUNGLEtBQUssQ0FBQ0csT0FBTixDQUFjQyxRQUFmLENBRGpDO0FBRVFBLFlBQUFBLFFBRlIsR0FFbUJILGdCQUFnQixHQUFHLENBRnRDOztBQUFBLGtCQUdNRyxRQUFRLEdBQUcsQ0FIakI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBSVdBLFFBSlg7O0FBQUE7QUFNSUosWUFBQUEsS0FBSyxDQUFDRyxPQUFOLENBQWNDLFFBQWQsR0FBeUJBLFFBQVEsQ0FBQ0MsUUFBVCxFQUF6QjtBQUNBQyxZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0NDLEtBQXhDLEdBQWdESixRQUFoRDtBQUNBRSxZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0NDLEtBQXhDLEdBQWdESixRQUFoRDs7QUFSSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0NBZUs7Ozs7O3NFQUFmLGlCQUF3QlQsS0FBeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1FDLFlBQUFBLGdCQURSLEdBQzJCQyxNQUFNLENBQUNGLEtBQUssQ0FBQ0csT0FBTixDQUFjQyxRQUFmLENBRGpDO0FBRVFNLFlBQUFBLGNBRlIsR0FFeUJSLE1BQU0sQ0FBQ0YsS0FBSyxDQUFDRyxPQUFOLENBQWNRLGFBQWYsQ0FGL0I7QUFHUVAsWUFBQUEsUUFIUixHQUdtQkgsZ0JBQWdCLEdBQUcsQ0FIdEM7O0FBQUEsa0JBSU1HLFFBQVEsR0FBR00sY0FKakI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBS1dBLGNBTFg7O0FBQUE7QUFPSVYsWUFBQUEsS0FBSyxDQUFDRyxPQUFOLENBQWNDLFFBQWQsR0FBeUJBLFFBQVEsQ0FBQ0MsUUFBVCxFQUF6QjtBQUNBQyxZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0NDLEtBQXhDLEdBQWdESixRQUFoRDtBQUNBRSxZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0NDLEtBQXhDLEdBQWdESixRQUFoRDs7QUFUSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0NBZVE7Ozs7O21FQUFmLGlCQUFxQkMsTUFBckIsRUFBNkJWLE9BQTdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNRVyxZQUFBQSxPQURSLEdBQ2tCWCxPQUFPLENBQUNDLFFBQVIsR0FBbUIsQ0FEckM7QUFBQSw2Q0FFU1MsTUFBTSxDQUFDRSxTQUFQLENBQWlCRCxPQUFqQixFQUEwQkUsR0FBMUIsQ0FBOEIsVUFBQ1osUUFBRCxFQUFXYSxDQUFYLEVBQWlCO0FBQ3BELHFCQUFPO0FBQ0xDLGdCQUFBQSxVQUFVLFlBQUtmLE9BQU8sQ0FBQ2dCLE9BQWIsY0FBd0JoQixPQUFPLENBQUNpQixJQUFoQyxjQUF3Q2pCLE9BQU8sQ0FBQ2tCLFVBQWhELGNBQThEakIsUUFBOUQsZUFETDtBQUVMYSxnQkFBQUEsQ0FBQyxFQUFFQTtBQUZFLGVBQVA7QUFJRCxhQUxNLENBRlQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBOztTQUVlSzs7Ozs7d0VBQWYsaUJBQTBCdEIsS0FBMUIsRUFBaUN1QixPQUFqQztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUVDLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFlBQVosRUFBMEJ6QixLQUExQixFQUFpQ3VCLE9BQWpDOztBQUVBLGdCQUFJdkIsS0FBSyxDQUFDRyxPQUFOLENBQWN1QixJQUFkLElBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDMUIsY0FBQUEsS0FBSyxDQUFDRyxPQUFOLENBQWN1QixJQUFkLEdBQXFCLFlBQXJCO0FBQ0QsYUFGRCxNQUVPO0FBQ0wxQixjQUFBQSxLQUFLLENBQUNHLE9BQU4sQ0FBY3VCLElBQWQsR0FBcUIsUUFBckI7QUFDRDs7QUFFS3pCLFlBQUFBLGdCQVZSLEdBVTJCc0IsT0FBTyxDQUFDUixTQUFSLENBQWtCYixNQUFNLENBQUNGLEtBQUssQ0FBQ0csT0FBTixDQUFjQyxRQUFmLENBQU4sR0FBaUMsQ0FBbkQsRUFBc0R1QixJQUF0RCxDQUEyRCxVQUFBQyxDQUFDO0FBQUEscUJBQUksSUFBSjtBQUFBLGFBQTVELENBVjNCO0FBWVFDLFlBQUFBLEtBWlIsR0FZZ0I3QixLQUFLLENBQUNHLE9BQU4sQ0FBY1EsYUFaOUI7QUFjUWUsWUFBQUEsSUFkUixHQWNlMUIsS0FBSyxDQUFDRyxPQUFOLENBQWN1QixJQWQ3QjtBQUFBO0FBQUEsbUJBZ0JrQmIsbURBQU0sQ0FBQztBQUFFZ0IsY0FBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNILGNBQUFBLElBQUksRUFBSkE7QUFBVCxhQUFELENBaEJ4Qjs7QUFBQTtBQWdCUUksWUFBQUEsQ0FoQlI7QUFrQkU5QixZQUFBQSxLQUFLLENBQUNHLE9BQU4sQ0FBY0MsUUFBZCxHQUF5QkgsZ0JBQXpCLENBbEJGLENBb0JFOztBQUVBSyxZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0N3QixHQUF4QyxHQUE4Q0QsQ0FBQyxDQUFDRCxLQUFoRDtBQUVBdkIsWUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLGlCQUF2QixFQUEwQ3lCLFdBQTFDLEdBQXdERixDQUFDLENBQUNELEtBQTFEO0FBRUF2QixZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0N5QixXQUF4QyxHQUFzRC9CLGdCQUF0RDtBQUVBSyxZQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0NDLEtBQXhDLEdBQWdEUCxnQkFBaEQ7QUFFQUssWUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDQyxLQUF4QyxHQUFnRFAsZ0JBQWhEO0FBOUJGLDZDQWdDUzZCLENBaENUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQ0ZlRzs7Ozs7b0VBQWYsaUJBQXNCQyxFQUF0QixFQUEwQmxDLEtBQTFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNRSSxZQUFBQSxRQURSLEdBQ21CRixNQUFNLENBQUNnQyxFQUFELENBRHpCO0FBRVF4QixZQUFBQSxjQUZSLEdBRXlCUixNQUFNLENBQUNGLEtBQUssQ0FBQ0csT0FBTixDQUFjUSxhQUFmLENBRi9COztBQUFBLGtCQUdNUCxRQUFRLEdBQUcsQ0FIakI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsNkNBSVcsQ0FKWDs7QUFBQTtBQUFBLGtCQUthQSxRQUFRLEdBQUdNLGNBTHhCO0FBQUE7QUFBQTtBQUFBOztBQUFBLDZDQU1XQSxjQU5YOztBQUFBO0FBUUlWLFlBQUFBLEtBQUssQ0FBQ0csT0FBTixDQUFjQyxRQUFkLEdBQXlCQSxRQUFRLENBQUNDLFFBQVQsRUFBekI7QUFDQUMsWUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDQyxLQUF4QyxHQUFnREosUUFBaEQ7QUFDQUUsWUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDQyxLQUF4QyxHQUFnREosUUFBaEQ7O0FBVko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxTQUFTK0IsUUFBVCxDQUFrQkMsUUFBbEIsRUFBNEJDLFNBQTVCLEVBQXVDQyxhQUF2QyxFQUFzREMsWUFBdEQsRUFBb0U7QUFDbEUsTUFBTUMsUUFBUSxHQUFHbEMsUUFBUSxDQUFDbUMsZ0JBQVQsQ0FBMEJMLFFBQTFCLENBQWpCOztBQURrRSw2Q0FFOUNJLFFBRjhDO0FBQUE7O0FBQUE7QUFFbEUsd0RBQThCO0FBQUEsVUFBckJFLE9BQXFCO0FBQzVCQSxNQUFBQSxPQUFPLENBQUNDLGdCQUFSLENBQXlCTixTQUF6QixFQUFvQyxVQUFBTyxjQUFjLEVBQUk7QUFDcEQsWUFBSUEsY0FBYyxDQUFDQyxNQUFmLENBQXNCQyxPQUF0QixDQUE4QlIsYUFBOUIsQ0FBSixFQUFrRDtBQUNoREMsVUFBQUEsWUFBWSxDQUFDSyxjQUFELENBQVo7QUFDRDtBQUNGLE9BSkQ7QUFLRDtBQVJpRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU25FOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1RELFNBQVNHLElBQVQsQ0FBY1gsUUFBZCxFQUF3QjtBQUN0QjlCLEVBQUFBLFFBQVEsQ0FBQ21DLGdCQUFULENBQTBCTCxRQUExQixFQUFvQ1ksT0FBcEMsQ0FBNEMsVUFBQUMsR0FBRyxFQUFJO0FBQ2pEQSxJQUFBQSxHQUFHLENBQUNDLEtBQUosQ0FBVUMsT0FBVixHQUFvQixJQUFwQjtBQUNBRixJQUFBQSxHQUFHLENBQUNDLEtBQUosQ0FBVUUsVUFBVixHQUF1QixJQUF2QjtBQUNBSCxJQUFBQSxHQUFHLENBQUNJLE1BQUosR0FBYSxJQUFiO0FBQ0FKLElBQUFBLEdBQUcsQ0FBQ0ssTUFBSixHQUFhLENBQWI7QUFDRCxHQUxEO0FBTUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQ1BjQzs7Ozs7d0VBQWYsaUJBQTBCdkQsS0FBMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1U2QixZQUFBQSxLQURWLEdBQ29CN0IsS0FEcEIsQ0FDVTZCLEtBRFY7QUFFUWQsWUFBQUEsU0FGUixHQUVvQixFQUZwQjtBQUdFeUMsWUFBQUEsS0FBSyxDQUFDdEQsTUFBTSxDQUFDMkIsS0FBRCxDQUFQLENBQUwsQ0FBcUI0QixJQUFyQixHQUE0QnpDLEdBQTVCLENBQWdDLFVBQUNjLENBQUQsRUFBSTRCLEtBQUosRUFBYztBQUM1QzNDLGNBQUFBLFNBQVMsQ0FBQzRDLElBQVYsQ0FBZSxDQUFFRCxLQUFLLEdBQUcsQ0FBVixDQUFmO0FBQ0QsYUFGRDtBQUhGLDZDQU1TO0FBQUUzQyxjQUFBQSxTQUFTLEVBQVRBLFNBQUY7QUFBYWMsY0FBQUEsS0FBSyxFQUFFZCxTQUFTLENBQUM2QztBQUE5QixhQU5UOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O1NBU2VDOzs7Ozt3RUFBZixrQkFBMEI3RCxLQUExQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDVTZCLFlBQUFBLEtBRFYsR0FDb0I3QixLQURwQixDQUNVNkIsS0FEVjtBQUVRZCxZQUFBQSxTQUZSLEdBRW9CLEVBRnBCO0FBR1ErQyxZQUFBQSxHQUhSLEdBR2NDLElBQUksQ0FBQ0MsSUFBTCxDQUFVOUQsTUFBTSxDQUFDMkIsS0FBRCxDQUFOLEdBQWdCLENBQTFCLElBQStCLENBSDdDO0FBSUUyQixZQUFBQSxLQUFLLENBQUNNLEdBQUQsQ0FBTCxDQUFXTCxJQUFYLEdBQWtCekMsR0FBbEIsQ0FBc0IsVUFBQ2MsQ0FBRCxFQUFJNEIsS0FBSixFQUFjO0FBQ2xDM0MsY0FBQUEsU0FBUyxDQUFDNEMsSUFBVixDQUFlLENBQUVELEtBQUssR0FBRyxDQUFWLEVBQWFBLEtBQUssR0FBRyxDQUFSLEdBQVksQ0FBekIsQ0FBZjtBQUNELGFBRkQsRUFKRixDQU9FOztBQUNBM0MsWUFBQUEsU0FBUyxDQUFDLENBQUQsQ0FBVCxDQUFha0QsS0FBYixHQVJGLENBU0U7O0FBQ0EsZ0JBQUlsRCxTQUFTLENBQUNBLFNBQVMsQ0FBQzZDLE1BQVYsR0FBbUIsQ0FBcEIsQ0FBVCxDQUFnQyxDQUFoQyxJQUFxQy9CLEtBQXpDLEVBQWdEO0FBQzlDZCxjQUFBQSxTQUFTLENBQUNBLFNBQVMsQ0FBQzZDLE1BQVYsR0FBbUIsQ0FBcEIsQ0FBVCxDQUFnQ00sR0FBaEM7QUFDRDs7QUFDRCxnQkFBSW5ELFNBQVMsQ0FBQ0EsU0FBUyxDQUFDNkMsTUFBVixHQUFtQixDQUFwQixDQUFULENBQWdDLENBQWhDLElBQXFDL0IsS0FBekMsRUFBZ0Q7QUFDOUNkLGNBQUFBLFNBQVMsQ0FBQ21ELEdBQVY7QUFDRDs7QUFmSCw4Q0FnQlM7QUFBRW5ELGNBQUFBLFNBQVMsRUFBVEEsU0FBRjtBQUFhYyxjQUFBQSxLQUFLLEVBQUVkLFNBQVMsQ0FBQzZDO0FBQTlCLGFBaEJUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O1NBbUJlL0M7Ozs7O29FQUFmLGtCQUFzQmIsS0FBdEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0V3QixZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvQ0FBWixFQUFrRHpCLEtBQWxEO0FBQ1E2QixZQUFBQSxLQUZWLEdBRTBCN0IsS0FGMUIsQ0FFVTZCLEtBRlYsRUFFaUJILElBRmpCLEdBRTBCMUIsS0FGMUIsQ0FFaUIwQixJQUZqQjtBQUFBLDJCQUdVQSxJQUhWO0FBQUEsOENBSVMsWUFKVDtBQUFBOztBQUFBO0FBQUE7QUFBQSxtQkFLbUJtQyxVQUFVLENBQUM7QUFBQ2hDLGNBQUFBLEtBQUssRUFBTEE7QUFBRCxhQUFELENBTDdCOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1CQU9tQjBCLFVBQVUsQ0FBQztBQUFDMUIsY0FBQUEsS0FBSyxFQUFMQTtBQUFELGFBQUQsQ0FQN0I7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCQSxTQUFTc0MsSUFBVCxDQUFjL0IsUUFBZCxFQUF3QjtBQUN0QjlCLEVBQUFBLFFBQVEsQ0FBQ21DLGdCQUFULENBQTBCTCxRQUExQixFQUFvQ1ksT0FBcEMsQ0FBNEMsVUFBQUMsR0FBRyxFQUFJO0FBQ2pEQSxJQUFBQSxHQUFHLENBQUNDLEtBQUosQ0FBVUMsT0FBVixHQUFvQixJQUFwQjtBQUNBRixJQUFBQSxHQUFHLENBQUNDLEtBQUosQ0FBVUUsVUFBVixHQUF1QixJQUF2QjtBQUNBSCxJQUFBQSxHQUFHLENBQUNJLE1BQUosR0FBYSxJQUFiO0FBQ0QsR0FKRDtBQUtEOzs7Ozs7OztVQ05EO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7U0FFZWdCOzs7Ozt1RUFBZixrQkFBeUJDLENBQXpCO0FBQUEsUUFVV0MsZUFWWCxFQTBDV0MsZUExQ1gsRUE2RFdDLGFBN0RYLEVBc0ZXQyxjQXRGWCxFQTBHaUJDLGFBMUdqQixrQkFxTFdDLHFCQXJMWCxFQXVNV0Msc0JBdk1YLEVBeU5XQyxhQXpOWCxFQW9PV0Msd0JBcE9YLEVBb1BXQyxnQkFwUFgsRUFnUVdDLG9CQWhRWCxFQTJRV0MsdUJBM1FYLEVBNlNXQyx1QkE3U1gsRUFtV1dDLGlCQW5XWCxFQXVYV0Msa0JBdlhYOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdVhXQSxZQUFBQSxrQkF2WFgsZ0NBdVg4QkMsS0F2WDlCLEVBdVhxQztBQUNqQ2hGLGNBQUFBLFFBQVEsQ0FBQ2lGLGFBQVQsQ0FDRSxJQUFJQyxXQUFKLENBQWdCLGVBQWhCLEVBQWlDO0FBQy9CQyxnQkFBQUEsTUFBTSxFQUFFO0FBQ05DLGtCQUFBQSxTQUFTLEVBQUUsUUFETDtBQUVOeEQsa0JBQUFBLEVBQUUsRUFBRW9ELEtBQUssQ0FBQ0ssYUFBTixDQUFvQm5GO0FBRmxCO0FBRHVCLGVBQWpDLENBREY7QUFRRCxhQWhZSDs7QUFtV1c0RSxZQUFBQSxpQkFuV1gsK0JBbVc2QkUsS0FuVzdCLEVBbVdvQztBQUNoQ0EsY0FBQUEsS0FBSyxDQUFDTSxjQUFOO0FBQ0F0QixjQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFDLElBQVIsQ0FBYUMsU0FBYixDQUF1QkMsTUFBdkIsQ0FBOEIsaUJBQTlCOztBQUNBLGtCQUFJMUIsQ0FBQyxDQUFDdUIsS0FBRixDQUFRSSxnQkFBUixDQUF5QkYsU0FBekIsQ0FBbUNHLFFBQW5DLENBQTRDLElBQTVDLENBQUosRUFBdUQ7QUFDckQ1QixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRSSxnQkFBUixDQUF5QkYsU0FBekIsQ0FBbUNDLE1BQW5DLENBQTBDLElBQTFDO0FBQ0ExQixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRSSxnQkFBUixDQUF5QkYsU0FBekIsQ0FBbUNJLEdBQW5DLENBQXVDLEtBQXZDO0FBQ0Q7O0FBRURwRCxjQUFBQSx5REFBSSxDQUFDLGFBQUQsQ0FBSjtBQUVBekMsY0FBQUEsUUFBUSxDQUFDaUYsYUFBVCxDQUNFLElBQUlDLFdBQUosQ0FBZ0IsZUFBaEIsRUFBaUM7QUFDL0JDLGdCQUFBQSxNQUFNLEVBQUU7QUFDTkMsa0JBQUFBLFNBQVMsRUFBRSxRQURMO0FBRU54RCxrQkFBQUEsRUFBRSxFQUFFb0QsS0FBSyxDQUFDSyxhQUFOLENBQW9CeEYsT0FBcEIsQ0FBNEJDO0FBRjFCO0FBRHVCLGVBQWpDLENBREY7QUFRRCxhQXJYSDs7QUE2U1crRSxZQUFBQSx1QkE3U1gsb0NBNlNxQztBQUVqQyxrQkFBUWlCLEdBQVIsR0FBZ0I5QixDQUFDLENBQUN1QixLQUFGLENBQVFRLEdBQVIsQ0FBWWxHLE9BQTVCLENBQVFpRyxHQUFSO0FBRUEsa0JBQVFFLEtBQVIsR0FBa0JoQyxDQUFDLENBQUN1QixLQUFGLENBQVFVLFVBQVIsQ0FBbUJwRyxPQUFyQyxDQUFRbUcsS0FBUjtBQUVBLGtCQUFNRSxLQUFLLEdBQUcsS0FBZDtBQUVBLGtCQUFNbEQsTUFBTSxHQUFHLEtBQWY7QUFFQWdCLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUUMsSUFBUixDQUFhQyxTQUFiLENBQXVCSSxHQUF2QixDQUEyQixpQkFBM0I7QUFFQTdCLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVksY0FBUixDQUF1QlYsU0FBdkIsQ0FBaUNDLE1BQWpDLENBQXdDLFFBQXhDO0FBQ0ExQixjQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFZLGNBQVIsQ0FBdUJWLFNBQXZCLENBQWlDSSxHQUFqQyxDQUFxQyxVQUFyQztBQUVBN0IsY0FBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYSxhQUFSLENBQXNCWCxTQUF0QixDQUFnQ0MsTUFBaEMsQ0FBdUMsUUFBdkM7QUFDQTFCLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWEsYUFBUixDQUFzQlgsU0FBdEIsQ0FBZ0NJLEdBQWhDLENBQW9DLFVBQXBDO0FBRUE3QixjQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFjLFVBQVIsQ0FBbUJaLFNBQW5CLENBQTZCQyxNQUE3QixDQUFvQyxRQUFwQztBQUNBMUIsY0FBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYyxVQUFSLENBQW1CWixTQUFuQixDQUE2QkksR0FBN0IsQ0FBaUMsVUFBakM7QUFFQTdCLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWUsSUFBUixDQUFhNUQsT0FBYixDQUFxQixVQUFBNkQsSUFBSSxFQUFJO0FBQzNCQSxnQkFBQUEsSUFBSSxDQUFDZCxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsUUFBdEI7QUFDQWEsZ0JBQUFBLElBQUksQ0FBQ2QsU0FBTCxDQUFlSSxHQUFmLENBQW1CLFVBQW5CO0FBQ0QsZUFIRDtBQUtBN0IsY0FBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRaUIsUUFBUixDQUFpQjlELE9BQWpCLENBQXlCLFVBQUE2RCxJQUFJLEVBQUk7QUFDL0JBLGdCQUFBQSxJQUFJLENBQUNkLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixRQUF0QjtBQUNBYSxnQkFBQUEsSUFBSSxDQUFDZCxTQUFMLENBQWVJLEdBQWYsQ0FBbUIsVUFBbkI7QUFDRCxlQUhEOztBQUtBLGtCQUFJWSxRQUFRLENBQUNULEtBQUQsRUFBUSxFQUFSLENBQVIsS0FBd0IsQ0FBNUIsRUFBK0I7QUFDN0JsQyxnQkFBQUEsMENBQUcsV0FBSWdDLEdBQUoseUNBQXNDSSxLQUF0QyxxQkFBc0RsRCxNQUF0RCxFQUFILENBQW1FMEQsSUFBbkUsQ0FBd0UsVUFBQUMsUUFBUSxFQUFJO0FBQ2xGLHNCQUFJQSxRQUFRLENBQUNDLE1BQVQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0Isd0JBQU1DLE1BQU0sR0FBRyxJQUFJQyxTQUFKLEVBQWY7QUFDQSx3QkFBTUMsR0FBRyxHQUFHRixNQUFNLENBQUNHLGVBQVAsQ0FBdUJMLFFBQVEsQ0FBQ00sSUFBaEMsRUFBc0MsV0FBdEMsQ0FBWjtBQUNDakQsb0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVUsVUFBUixDQUFtQmlCLFdBQW5CLENBQ0NILEdBQUcsQ0FBQzlHLGFBQUosQ0FBa0IsdUJBQWxCLENBREQ7QUFHREQsb0JBQUFBLFFBQVEsQ0FBQ21DLGdCQUFULENBQTBCLHlCQUExQixFQUFxRE8sT0FBckQsQ0FBNkQsVUFBQTZELElBQUksRUFBSTtBQUNuRUEsc0JBQUFBLElBQUksQ0FBQ2xFLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCeUMsaUJBQS9CO0FBQ0QscUJBRkQ7QUFHQWQsb0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVUsVUFBUixDQUFtQnBHLE9BQW5CLENBQTJCbUcsS0FBM0IsR0FBbUMsQ0FBbkM7QUFDRDs7QUFFRG5DLGtCQUFBQSx5REFBSSxDQUFDLGFBQUQsQ0FBSjtBQUVELGlCQWZELFdBZ0JPLFVBQUFzRCxLQUFLLEVBQUk7QUFDZGpHLGtCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWWdHLEtBQVo7QUFDRCxpQkFsQkQ7QUFtQkQ7QUFDRixhQWpXSDs7QUEyUVd2QyxZQUFBQSx1QkEzUVgsb0NBMlFxQztBQUVqQyxrQkFBTW1CLEdBQUcsR0FBRy9CLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVEsR0FBcEI7QUFFQSxpQ0FBb0NBLEdBQUcsQ0FBQ2xHLE9BQXhDO0FBQUEsa0JBQVFRLGFBQVIsZ0JBQVFBLGFBQVI7QUFBQSxrQkFBdUJQLFFBQXZCLGdCQUF1QkEsUUFBdkI7QUFFQWtFLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUUMsSUFBUixDQUFhQyxTQUFiLENBQXVCQyxNQUF2QixDQUE4QixpQkFBOUI7QUFFQWpELGNBQUFBLHlEQUFJLENBQUMsYUFBRCxDQUFKO0FBRUF1QixjQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFjLFVBQVIsQ0FBbUJaLFNBQW5CLENBQTZCQyxNQUE3QixDQUFvQyxVQUFwQztBQUNBMUIsY0FBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYyxVQUFSLENBQW1CWixTQUFuQixDQUE2QkksR0FBN0IsQ0FBaUMsUUFBakM7QUFFQTdCLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWUsSUFBUixDQUFhNUQsT0FBYixDQUFxQixVQUFBNkQsSUFBSSxFQUFJO0FBQzNCQSxnQkFBQUEsSUFBSSxDQUFDZCxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsUUFBdEI7QUFDQWEsZ0JBQUFBLElBQUksQ0FBQ2QsU0FBTCxDQUFlSSxHQUFmLENBQW1CLFVBQW5CO0FBQ0QsZUFIRDtBQUtBN0IsY0FBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRaUIsUUFBUixDQUFpQjlELE9BQWpCLENBQXlCLFVBQUE2RCxJQUFJLEVBQUk7QUFDL0Isb0JBQUl6RyxRQUFRLEdBQUcsQ0FBZixFQUFrQjtBQUNoQnlHLGtCQUFBQSxJQUFJLENBQUNkLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixVQUF0QjtBQUNBYSxrQkFBQUEsSUFBSSxDQUFDZCxTQUFMLENBQWVJLEdBQWYsQ0FBbUIsUUFBbkI7QUFDRDtBQUNGLGVBTEQ7QUFPQTdCLGNBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWUsSUFBUixDQUFhNUQsT0FBYixDQUFxQixVQUFBNkQsSUFBSSxFQUFJO0FBQzNCLG9CQUFJekcsUUFBUSxHQUFHTyxhQUFmLEVBQThCO0FBQzVCa0csa0JBQUFBLElBQUksQ0FBQ2QsU0FBTCxDQUFlQyxNQUFmLENBQXNCLFVBQXRCO0FBQ0FhLGtCQUFBQSxJQUFJLENBQUNkLFNBQUwsQ0FBZUksR0FBZixDQUFtQixRQUFuQjtBQUNEO0FBQ0YsZUFMRDtBQU9ELGFBM1NIOztBQWdRV2xCLFlBQUFBLG9CQWhRWCxvQ0FnUWtDO0FBQzlCLGtCQUFNcEQsS0FBSyxHQUFHeUMsQ0FBQyxDQUFDb0QsTUFBRixDQUFTQyxLQUFULENBQWVDLFlBQWYsRUFBZDs7QUFDQSxtQkFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHaEcsS0FBcEIsRUFBMkJnRyxDQUFDLEVBQTVCLEVBQWdDO0FBQzlCLG9CQUFNQyxVQUFVLEdBQUd4RCxDQUFDLENBQUNvRCxNQUFGLENBQVNDLEtBQVQsQ0FBZUksU0FBZixDQUF5QkYsQ0FBekIsQ0FBbkI7O0FBQ0Esb0JBQUksQ0FBQ0MsVUFBVSxDQUFDRSxjQUFYLEVBQUwsRUFBa0M7QUFDaEMseUJBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBQ0QscUJBQU8sSUFBUDtBQUNELGFBelFIOztBQW9QV2hELFlBQUFBLGdCQXBQWCw4QkFvUDRCTSxLQXBQNUIsRUFvUG1DO0FBQy9CaEIsY0FBQUEsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCQyxXQUFsQixDQUE4QixDQUE5QjtBQUNBLGtCQUFNSixVQUFVLEdBQUd4QyxLQUFLLENBQUN1QixJQUF6QjtBQUNBaUIsY0FBQUEsVUFBVSxDQUFDSyxVQUFYLENBQXNCLHFCQUF0QixFQUE2QyxZQUFNO0FBQ2pELG9CQUFNQyxjQUFjLEdBQUduRCxvQkFBb0IsRUFBM0M7O0FBQ0Esb0JBQUltRCxjQUFjLEtBQUs5RCxDQUFDLENBQUMrRCxhQUF6QixFQUF3QztBQUN0Qy9ELGtCQUFBQSxDQUFDLENBQUMrRCxhQUFGLEdBQWtCRCxjQUFsQjtBQUNBckQsa0JBQUFBLHdCQUF3QjtBQUN6QjtBQUNGLGVBTkQ7QUFPRCxhQTlQSDs7QUFvT1dBLFlBQUFBLHdCQXBPWCxvQ0FvT3NDO0FBQ2xDLGtCQUFJVCxDQUFDLENBQUMrRCxhQUFOLEVBQXFCO0FBQ25CL0QsZ0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUXlDLElBQVIsQ0FBYXZDLFNBQWIsQ0FBdUJDLE1BQXZCLENBQThCLG9CQUE5QjtBQUNBakQsZ0JBQUFBLHlEQUFJLENBQUMsWUFBRCxDQUFKO0FBQ0F3RixnQkFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVdDLFdBQVgsQ0FDRUMsSUFBSSxDQUFDQyxTQUFMLENBQ0U7QUFDRUMsa0JBQUFBLElBQUksRUFBRSxlQURSO0FBRUVDLGtCQUFBQSxPQUFPLEVBQUU7QUFGWCxpQkFERixDQURGLEVBT0UsR0FQRjtBQVNEO0FBQ0YsYUFsUEg7O0FBeU5XL0QsWUFBQUEsYUF6TlgsNkJBeU4yQjtBQUN2QixrQkFBSXdELElBQUksQ0FBQ3ZDLFNBQUwsQ0FBZUcsUUFBZixDQUF3QixvQkFBeEIsQ0FBSixFQUFtRDtBQUNqRDRDLGdCQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNmaEUsa0JBQUFBLGFBQWE7QUFDZCxpQkFGUyxFQUVQLEdBRk8sQ0FBVjtBQUdELGVBSkQsTUFJTztBQUNML0IsZ0JBQUFBLHlEQUFJLENBQUMsWUFBRCxDQUFKO0FBQ0F1QixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFReUMsSUFBUixDQUFhdkMsU0FBYixDQUF1QkMsTUFBdkIsQ0FBOEIsb0JBQTlCO0FBQ0Q7QUFDRixhQWxPSDs7QUF1TVduQixZQUFBQSxzQkF2TVgscUNBdU1vQztBQUNoQyxrQkFBTWtFLE1BQU0sR0FBR3pJLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixrQkFBdkIsQ0FBZjtBQUNBLGtCQUFNbUMsT0FBTyxHQUFHcEMsUUFBUSxDQUFDQyxhQUFULENBQXVCLFdBQXZCLENBQWhCO0FBQ0F3SSxjQUFBQSxNQUFNLENBQUNoRCxTQUFQLENBQWlCQyxNQUFqQixDQUF3QixJQUF4QjtBQUNBK0MsY0FBQUEsTUFBTSxDQUFDaEQsU0FBUCxDQUFpQkksR0FBakIsQ0FBcUIsS0FBckI7QUFDQXpELGNBQUFBLE9BQU8sQ0FBQ3FELFNBQVIsQ0FBa0JJLEdBQWxCLENBQXNCLFFBQXRCO0FBQ0F6RCxjQUFBQSxPQUFPLENBQUNzRyxPQUFSLENBQWdCLFlBQWhCLEVBQThCakQsU0FBOUIsQ0FBd0NJLEdBQXhDLENBQTRDLGlCQUE1QztBQUNBb0MsY0FBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVdDLFdBQVgsQ0FDRUMsSUFBSSxDQUFDQyxTQUFMLENBQ0U7QUFDRUMsZ0JBQUFBLElBQUksRUFBRSw0QkFEUjtBQUVFQyxnQkFBQUEsT0FBTyxFQUFFO0FBRlgsZUFERixDQURGLEVBT0UsR0FQRjtBQVNELGFBdk5IOztBQXFMV2pFLFlBQUFBLHFCQXJMWCxvQ0FxTG1DO0FBQy9CLGtCQUFNbUUsTUFBTSxHQUFHekksUUFBUSxDQUFDQyxhQUFULENBQXVCLGtCQUF2QixDQUFmO0FBQ0Esa0JBQU1tQyxPQUFPLEdBQUdwQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsV0FBdkIsQ0FBaEI7QUFDQW1DLGNBQUFBLE9BQU8sQ0FBQ3FELFNBQVIsQ0FBa0JDLE1BQWxCLENBQXlCLFFBQXpCO0FBQ0ErQyxjQUFBQSxNQUFNLENBQUNoRCxTQUFQLENBQWlCQyxNQUFqQixDQUF3QixLQUF4QjtBQUNBK0MsY0FBQUEsTUFBTSxDQUFDaEQsU0FBUCxDQUFpQkksR0FBakIsQ0FBcUIsSUFBckI7QUFDQXpELGNBQUFBLE9BQU8sQ0FBQ3NHLE9BQVIsQ0FBZ0IsWUFBaEIsRUFBOEJqRCxTQUE5QixDQUF3Q0MsTUFBeEMsQ0FBK0MsaUJBQS9DO0FBQ0F1QyxjQUFBQSxNQUFNLENBQUNDLEdBQVAsQ0FBV0MsV0FBWCxDQUNFQyxJQUFJLENBQUNDLFNBQUwsQ0FDRTtBQUNFQyxnQkFBQUEsSUFBSSxFQUFFLDJCQURSO0FBRUVDLGdCQUFBQSxPQUFPLEVBQUU7QUFGWCxlQURGLENBREYsRUFPRSxHQVBGO0FBU0QsYUFyTUg7O0FBQUE7QUFBQSx1RkEwR0UsaUJBQTZCakgsQ0FBN0I7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRVFxSCx3QkFBQUEsS0FGUixHQUVnQixFQUZoQjtBQUdVNUMsd0JBQUFBLEdBSFYsR0FHZ0IvQixDQUFDLENBQUN1QixLQUFGLENBQVFRLEdBSHhCO0FBSVVsRyx3QkFBQUEsT0FKVixHQUlvQmtHLEdBQUcsQ0FBQ2xHLE9BSnhCO0FBQUEsc0NBTVl5QixDQUFDLENBQUM2RCxNQUFGLENBQVNDLFNBTnJCO0FBQUEsd0RBT1csVUFQWCx1QkFVVyxVQVZYLHdCQWFXLFFBYlgsd0JBZ0JXLFlBaEJYO0FBQUE7O0FBQUE7QUFBQTtBQUFBLCtCQVFjakYseUVBQVEsQ0FBQzRGLEdBQUQsQ0FSdEI7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsK0JBV2N0Ryx5RUFBUSxDQUFDc0csR0FBRCxDQVh0Qjs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFjY3BFLHNFQUFNLENBQUNMLENBQUMsQ0FBQzZELE1BQUYsQ0FBU3ZELEVBQVYsRUFBY21FLEdBQWQsQ0FkcEI7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsK0JBaUJ5Qi9FLDZFQUFVLENBQUMrRSxHQUFELEVBQU0vQixDQUFDLENBQUN6RCxNQUFSLENBakJuQzs7QUFBQTtBQWlCUXlELHdCQUFBQSxDQUFDLENBQUN6RCxNQWpCVjtBQUFBOztBQUFBO0FBcUJJO0FBQ01xSSx3QkFBQUEsTUF0QlYsR0FzQm1CO0FBQ2JDLDBCQUFBQSxFQUFFLEVBQUU5QyxHQUFHLENBQUM4QyxFQURLO0FBRWJDLDBCQUFBQSxLQUFLLEVBQUUvQyxHQUFHLENBQUNsRyxPQUFKLENBQVlpSixLQUZOO0FBR2JoSiwwQkFBQUEsUUFBUSxFQUFFaUcsR0FBRyxDQUFDbEcsT0FBSixDQUFZQyxRQUhUO0FBSWJPLDBCQUFBQSxhQUFhLEVBQUUyRCxDQUFDLENBQUN6RCxNQUFGLENBQVNnQixLQUpYO0FBS2J1RSwwQkFBQUEsR0FBRyxFQUFFQyxHQUFHLENBQUNsRyxPQUFKLENBQVlpRztBQUxKLHlCQXRCbkI7QUE4QkdtQyx3QkFBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVdDLFdBQVgsQ0FBdUJDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUVDLDBCQUFBQSxJQUFJLEVBQUUsd0JBQVI7QUFBa0NDLDBCQUFBQSxPQUFPLEVBQUVLO0FBQTNDLHlCQUFmLENBQXZCLEVBQTRGLEdBQTVGO0FBOUJIO0FBQUEsK0JBZ0M0QnRJLGlFQUFLLENBQUMwRCxDQUFDLENBQUN6RCxNQUFILEVBQVdWLE9BQVgsQ0FoQ2pDOztBQUFBO0FBZ0NRa0osd0JBQUFBLFlBaENSO0FBa0NFL0Usd0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUXlELFVBQVIsQ0FBbUJ0SCxXQUFuQixHQUFpQ2lILEtBQUssQ0FBQ00sSUFBTixDQUFXLEtBQVgsQ0FBakM7QUFFQWpGLHdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFlLElBQVIsQ0FBYTVELE9BQWIsQ0FBcUIsVUFBQzZELElBQUQsRUFBVTtBQUM3Qiw4QkFBSTFHLE9BQU8sQ0FBQ0MsUUFBUixJQUFvQmtFLENBQUMsQ0FBQ3pELE1BQUYsQ0FBU2dCLEtBQWpDLEVBQXdDO0FBQ3RDZ0YsNEJBQUFBLElBQUksQ0FBQ2QsU0FBTCxDQUFlSSxHQUFmLENBQW1CLFVBQW5CO0FBQ0QsMkJBRkQsTUFFTztBQUNMLGdDQUFJVSxJQUFJLENBQUNkLFNBQUwsQ0FBZUcsUUFBZixDQUF3QixVQUF4QixDQUFKLEVBQXlDO0FBQ3ZDVyw4QkFBQUEsSUFBSSxDQUFDZCxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsVUFBdEI7QUFDRDtBQUNGO0FBQ0YseUJBUkQ7QUFVQTFCLHdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFpQixRQUFSLENBQWlCOUQsT0FBakIsQ0FBeUIsVUFBQzZELElBQUQsRUFBVTtBQUNqQyw4QkFBSTFHLE9BQU8sQ0FBQ0MsUUFBUixJQUFvQixDQUF4QixFQUEyQjtBQUN6QnlHLDRCQUFBQSxJQUFJLENBQUNkLFNBQUwsQ0FBZUksR0FBZixDQUFtQixVQUFuQjtBQUNELDJCQUZELE1BRU87QUFDTCxnQ0FBSVUsSUFBSSxDQUFDZCxTQUFMLENBQWVHLFFBQWYsQ0FBd0IsVUFBeEIsQ0FBSixFQUF5QztBQUN2Q1csOEJBQUFBLElBQUksQ0FBQ2QsU0FBTCxDQUFlQyxNQUFmLENBQXNCLFVBQXRCO0FBQ0Q7QUFDRjtBQUNGLHlCQVJEO0FBVUUxQix3QkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYyxVQUFSLENBQW1CWixTQUFuQixDQUE2QkksR0FBN0IsQ0FBaUMsUUFBakM7QUFFQTdCLHdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFjLFVBQVIsQ0FBbUJaLFNBQW5CLENBQTZCQyxNQUE3QixDQUFvQyxVQUFwQztBQUVBN0Isd0JBQUFBLHlEQUFJLENBQUMsaUJBQUQsQ0FBSjtBQUVBQSx3QkFBQUEseURBQUksQ0FBQyxRQUFELENBQUo7QUFFQUcsd0JBQUFBLENBQUMsQ0FBQ29ELE1BQUYsQ0FBUzhCLElBQVQsQ0FBY0gsWUFBZDtBQUVBL0Usd0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUXlDLElBQVIsQ0FBYXZDLFNBQWIsQ0FBdUJDLE1BQXZCLENBQThCLG9CQUE5QjtBQUVBMUIsd0JBQUFBLENBQUMsQ0FBQytELGFBQUYsR0FBa0IsSUFBbEI7QUFwRUo7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUF1RUk3Ryx3QkFBQUEsT0FBTyxDQUFDQyxHQUFSOztBQXZFSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQTFHRjtBQUFBO0FBQUE7O0FBMEdpQmtELFlBQUFBLGFBMUdqQjtBQUFBO0FBQUE7O0FBc0ZXRCxZQUFBQSxjQXRGWCw4QkFzRjRCO0FBQ3hCLGtCQUFNOEQsR0FBRyxHQUFHbEksUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQVo7O0FBQ0Esa0JBQUlELFFBQVEsQ0FBQ21KLGNBQWIsRUFBNkI7QUFDM0JuSixnQkFBQUEsUUFBUSxDQUFDbUosY0FBVDtBQUNELGVBRkQsTUFHSyxJQUFJbkosUUFBUSxDQUFDb0osZ0JBQWIsRUFBK0I7QUFDbENwSixnQkFBQUEsUUFBUSxDQUFDb0osZ0JBQVQ7QUFDRCxlQUZJLE1BR0EsSUFBSXBKLFFBQVEsQ0FBQ3FKLG1CQUFiLEVBQWtDO0FBQ3JDckosZ0JBQUFBLFFBQVEsQ0FBQ3FKLG1CQUFUO0FBQ0QsZUFGSSxNQUdBLElBQUlySixRQUFRLENBQUNzSixzQkFBYixFQUFxQztBQUN4Q3RKLGdCQUFBQSxRQUFRLENBQUNzSixzQkFBVDtBQUNEOztBQUNELGtCQUFJcEIsR0FBSixFQUFTO0FBQ1BBLGdCQUFBQSxHQUFHLENBQUN6QyxTQUFKLENBQWNDLE1BQWQsQ0FBcUIsUUFBckI7QUFDRDs7QUFDRHVDLGNBQUFBLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXQyxXQUFYLENBQXVCQyxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUFFQyxnQkFBQUEsSUFBSSxFQUFFLDhCQUFSO0FBQXdDQyxnQkFBQUEsT0FBTyxFQUFFO0FBQWpELGVBQWYsQ0FBdkIsRUFBOEYsR0FBOUY7QUFDRCxhQXhHSDs7QUE2RFdwRSxZQUFBQSxhQTdEWCw2QkE2RDJCO0FBQ3ZCLGtCQUFNb0YsTUFBTSxHQUFHdkosUUFBUSxDQUFDd0osZUFBeEI7QUFDQSxrQkFBTXRCLEdBQUcsR0FBR2xJLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixNQUF2QixDQUFaO0FBQ0Esa0JBQU13SSxNQUFNLEdBQUd6SSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsa0JBQXZCLENBQWY7O0FBQ0Esa0JBQUl3SSxNQUFKLEVBQVk7QUFDVkEsZ0JBQUFBLE1BQU0sQ0FBQ2hELFNBQVAsQ0FBaUJDLE1BQWpCLENBQXdCLElBQXhCO0FBQ0Q7O0FBQ0Qsa0JBQUk2RCxNQUFNLENBQUNFLGlCQUFYLEVBQThCO0FBQzVCRixnQkFBQUEsTUFBTSxDQUFDRSxpQkFBUDtBQUNELGVBRkQsTUFHSyxJQUFJRixNQUFNLENBQUNHLG1CQUFYLEVBQWdDO0FBQ25DSCxnQkFBQUEsTUFBTSxDQUFDRyxtQkFBUDtBQUNELGVBRkksTUFHQSxJQUFJSCxNQUFNLENBQUNJLG9CQUFYLEVBQWlDO0FBQ3BDSixnQkFBQUEsTUFBTSxDQUFDSSxvQkFBUDtBQUNELGVBRkksTUFHQSxJQUFJSixNQUFNLENBQUNLLHVCQUFYLEVBQW9DO0FBQ3ZDTCxnQkFBQUEsTUFBTSxDQUFDSyx1QkFBUDtBQUNEOztBQUNELGtCQUFJMUIsR0FBSixFQUFTO0FBQ1BPLGdCQUFBQSxNQUFNLENBQUNoRCxTQUFQLENBQWlCSSxHQUFqQixDQUFxQixRQUFyQjtBQUNEOztBQUNEb0MsY0FBQUEsTUFBTSxDQUFDQyxHQUFQLENBQVdDLFdBQVgsQ0FBdUJDLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUVDLGdCQUFBQSxJQUFJLEVBQUUsNkJBQVI7QUFBdUNDLGdCQUFBQSxPQUFPLEVBQUU7QUFBaEQsZUFBZixDQUF2QixFQUE2RixHQUE3RjtBQUNELGFBcEZIOztBQTBDV3JFLFlBQUFBLGVBMUNYLDZCQTBDMkI1QyxDQTFDM0IsRUEwQzhCO0FBQzFCLGtCQUFNK0QsYUFBYSxHQUFHL0QsQ0FBQyxDQUFDK0QsYUFBeEI7QUFDQS9ELGNBQUFBLENBQUMsQ0FBQ2dFLGNBQUY7QUFDQTs7QUFDQSxrQkFBSUQsYUFBYSxDQUFDSSxTQUFkLENBQXdCRyxRQUF4QixDQUFpQyxVQUFqQyxDQUFKLEVBQWtELE9BQU8sS0FBUDs7QUFDbEQsa0JBQUk7QUFDRjVCLGdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVF5QyxJQUFSLENBQWF2QyxTQUFiLENBQXVCSSxHQUF2QixDQUEyQixvQkFBM0I7QUFDQTdGLGdCQUFBQSxRQUFRLENBQUNpRixhQUFULENBQ0UsSUFBSUMsV0FBSixDQUFnQixlQUFoQixFQUFpQztBQUMvQkMsa0JBQUFBLE1BQU0sRUFBRTtBQUNOQyxvQkFBQUEsU0FBUyxFQUFFOUQsQ0FBQyxDQUFDK0QsYUFBRixDQUFnQnhGLE9BQWhCLENBQXdCdUY7QUFEN0I7QUFEdUIsaUJBQWpDLENBREY7QUFPRCxlQVRELENBU0UsT0FBTTlELENBQU4sRUFBUztBQUNUSixnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlHLENBQVo7QUFDRDtBQUNGLGFBM0RIOztBQVVXMkMsWUFBQUEsZUFWWCw2QkFVMkIzQyxDQVYzQixFQVU4QjtBQUMxQkEsY0FBQUEsQ0FBQyxDQUFDZ0UsY0FBRjtBQUNBLGtCQUFNdUUsY0FBYyxHQUFHdkksQ0FBQyxDQUFDK0QsYUFBekI7QUFDQSxrQkFBSXlFLFlBQUosRUFBa0JDLFFBQWxCO0FBQ0E7O0FBQ0Esa0JBQUlGLGNBQWMsQ0FBQ3BFLFNBQWYsQ0FBeUJHLFFBQXpCLENBQWtDLFVBQWxDLENBQUosRUFBbUQ7QUFDbkQ7QUFEQSxtQkFFSztBQUNIbUUsZ0JBQUFBLFFBQVEsR0FBR0YsY0FBYyxDQUFDaEIsRUFBMUI7QUFDQWlCLGdCQUFBQSxZQUFZLEdBQUcsWUFBWUMsUUFBM0I7QUFDRDs7QUFDRCxrQkFBSUYsY0FBYyxDQUFDcEUsU0FBZixDQUF5QkcsUUFBekIsQ0FBa0MsSUFBbEMsQ0FBSixFQUE2QztBQUMzQ2lFLGdCQUFBQSxjQUFjLENBQUNwRSxTQUFmLENBQXlCQyxNQUF6QixDQUFnQyxJQUFoQztBQUNBbUUsZ0JBQUFBLGNBQWMsQ0FBQ3BFLFNBQWYsQ0FBeUJJLEdBQXpCLENBQTZCLEtBQTdCO0FBQ0EzRSxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLFdBQWUySSxZQUFmO0FBQ0E5SixnQkFBQUEsUUFBUSxDQUFDaUYsYUFBVCxDQUNFLElBQUlDLFdBQUosV0FBbUI0RSxZQUFuQixXQUF1Q3hJLENBQXZDLENBREY7QUFHRCxlQVBELE1BUUs7QUFDSHVJLGdCQUFBQSxjQUFjLENBQUNwRSxTQUFmLENBQXlCSSxHQUF6QixDQUE2QixJQUE3QjtBQUNBZ0UsZ0JBQUFBLGNBQWMsQ0FBQ3BFLFNBQWYsQ0FBeUJDLE1BQXpCLENBQWdDLEtBQWhDO0FBQ0F4RSxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLFdBQWUySSxZQUFmO0FBQ0E5SixnQkFBQUEsUUFBUSxDQUFDaUYsYUFBVCxDQUNFLElBQUlDLFdBQUosV0FBbUI0RSxZQUFuQixVQUFzQ3hJLENBQXRDLENBREY7QUFHRDs7QUFDRHRCLGNBQUFBLFFBQVEsQ0FBQ2lGLGFBQVQsQ0FDRSxJQUFJQyxXQUFKLFdBQW1CNEUsWUFBbkIsY0FBMEN4SSxDQUExQyxDQURGO0FBR0QsYUF4Q0g7O0FBRUUyRyxZQUFBQSxNQUFNLENBQUNDLEdBQVAsQ0FBV0MsV0FBWCxDQUF1QkMsSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFBRUMsY0FBQUEsSUFBSSxFQUFFLGFBQVI7QUFBdUJDLGNBQUFBLE9BQU8sRUFBRTtBQUFoQyxhQUFmLENBQXZCLEVBQTZFLEdBQTdFO0FBRUF2RSxZQUFBQSxDQUFDLENBQUNvRCxNQUFGLEdBQVcsSUFBWDtBQUVBcEQsWUFBQUEsQ0FBQyxDQUFDK0QsYUFBRixHQUFrQixLQUFsQjtBQUVBL0QsWUFBQUEsQ0FBQyxDQUFDekQsTUFBRixHQUFXLEVBQVg7QUEwWEF5RCxZQUFBQSxDQUFDLENBQUN1QixLQUFGLEdBQVUsRUFBVjtBQUVBdkIsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRQyxJQUFSLEdBQWV4RixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBZjtBQUVBK0QsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFReUMsSUFBUixHQUFlaEksUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQWY7QUFFQStELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVUsVUFBUixHQUFxQmpHLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixhQUF2QixDQUFyQjtBQUVBK0QsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFReUUsY0FBUixHQUF5QmhLLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixrQkFBdkIsQ0FBekI7QUFFQStELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUTBFLE1BQVIsR0FBaUJqSyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWpCO0FBRUErRCxZQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVEyRSxRQUFSLEdBQW1CbEssUUFBUSxDQUFDQyxhQUFULENBQXVCLFdBQXZCLENBQW5CO0FBRUErRCxZQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFRLEdBQVIsR0FBYy9GLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixpQkFBdkIsQ0FBZDtBQUVBK0QsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRMUMsT0FBUixHQUFrQjdDLFFBQVEsQ0FBQ21LLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBbEI7QUFFQW5HLFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWMsVUFBUixHQUFxQnJHLFFBQVEsQ0FBQ21LLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBckI7QUFFQW5HLFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVksY0FBUixHQUF5Qm5HLFFBQVEsQ0FBQ21LLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXpCO0FBRUFuRyxZQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFhLGFBQVIsR0FBd0JwRyxRQUFRLENBQUNtSyxjQUFULENBQXdCLGlCQUF4QixDQUF4QjtBQUVBbkcsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRNkUsY0FBUixHQUF5QnBLLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixnQkFBdkIsQ0FBekI7QUFFQStELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUThFLE1BQVIsR0FBaUJySyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBakI7QUFFQStELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUStFLFlBQVIsR0FBdUJ0SyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBdkI7QUFFQStELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUXlELFVBQVIsR0FBcUJoSixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBckI7QUFFQStELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUUksZ0JBQVIsR0FBMkIzRixRQUFRLENBQUNtSyxjQUFULENBQXdCLG1CQUF4QixDQUEzQjtBQUVBbkcsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRZSxJQUFSLEdBQWV0RyxRQUFRLENBQUNtQyxnQkFBVCxDQUEwQixjQUExQixDQUFmO0FBRUE2QixZQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFpQixRQUFSLEdBQW1CeEcsUUFBUSxDQUFDbUMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5CO0FBdGFGLG1DQXdhNEM2QixDQUFDLENBQUN1QixLQUFGLENBQVFRLEdBQVIsQ0FBWWxHLE9BeGF4RCxFQXdhVXVCLElBeGFWLHdCQXdhVUEsSUF4YVYsRUF3YWdCdEIsUUF4YWhCLHdCQXdhZ0JBLFFBeGFoQixFQXdhMEJPLGFBeGExQix3QkF3YTBCQSxhQXhhMUI7QUEwYVFrSyxZQUFBQSxNQTFhUixHQTBhaUIsSUFBSUMsZUFBSixDQUFvQnZDLE1BQU0sQ0FBQ3dDLFFBQVAsQ0FBZ0JDLE1BQXBDLENBMWFqQjtBQTRhTUMsWUFBQUEsWUE1YU4sR0E0YXFCSixNQUFNLENBQUN6RyxHQUFQLENBQVcsVUFBWCxDQTVhckI7O0FBOGFFLGdCQUFJLENBQUM2RyxZQUFMLEVBQW1CO0FBQ2pCQSxjQUFBQSxZQUFZLEdBQUc3SyxRQUFmO0FBQ0Q7O0FBRUQsZ0JBQUlzQixJQUFJLElBQUksWUFBWixFQUEwQjtBQUN4QixrQkFBSTRDLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWMsVUFBUixDQUFtQlosU0FBbkIsQ0FBNkJHLFFBQTdCLENBQXNDLGFBQXRDLENBQUosRUFBMEQ7QUFDeEQ1QixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYyxVQUFSLENBQW1CWixTQUFuQixDQUE2QkMsTUFBN0IsQ0FBb0MsYUFBcEM7QUFDQTFCLGdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFjLFVBQVIsQ0FBbUJaLFNBQW5CLENBQTZCSSxHQUE3QixDQUFpQyxhQUFqQztBQUNEO0FBQ0Y7O0FBdmJIO0FBQUEsbUJBeWJtQnRGLDZEQUFNLENBQUM7QUFBRWdCLGNBQUFBLEtBQUssRUFBRWxCLGFBQVQ7QUFBd0JlLGNBQUFBLElBQUksRUFBSkE7QUFBeEIsYUFBRCxDQXpiekI7O0FBQUE7QUF5YkU0QyxZQUFBQSxDQUFDLENBQUN6RCxNQXpiSjtBQTJiRVAsWUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDeUIsV0FBeEMsR0FBc0RzQyxDQUFDLENBQUN1QixLQUFGLENBQVFRLEdBQVIsQ0FBWWxHLE9BQVosQ0FBb0JDLFFBQXBCLEdBQStCa0UsQ0FBQyxDQUFDdUIsS0FBRixDQUFROEUsTUFBUixDQUFlbkssS0FBZixHQUF1QjhELENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUStFLFlBQVIsQ0FBcUJwSyxLQUFyQixHQUE2QnlLLFlBQXpJO0FBRUEzRyxZQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVE4RSxNQUFSLENBQWU1SSxHQUFmLEdBQXFCdUMsQ0FBQyxDQUFDekQsTUFBRixDQUFTZ0IsS0FBOUI7QUFFQXZCLFlBQUFBLFFBQVEsQ0FBQ21DLGdCQUFULENBQTBCLGlCQUExQixFQUE2Q08sT0FBN0MsQ0FBcUQsVUFBQTZELElBQUksRUFBSTtBQUMzREEsY0FBQUEsSUFBSSxDQUFDN0UsV0FBTCxHQUFtQnNDLENBQUMsQ0FBQ3pELE1BQUYsQ0FBU2dCLEtBQTVCO0FBQ0QsYUFGRDtBQS9iRjtBQUFBLG1CQW1jNEJqQixpRUFBSyxDQUFDMEQsQ0FBQyxDQUFDekQsTUFBSCxFQUFXeUQsQ0FBQyxDQUFDdUIsS0FBRixDQUFRUSxHQUFSLENBQVlsRyxPQUF2QixDQW5jakM7O0FBQUE7QUFtY1FrSixZQUFBQSxXQW5jUjtBQXFjRS9FLFlBQUFBLENBQUMsQ0FBQ29ELE1BQUYsR0FBV3BELENBQUMsQ0FBQzRHLGFBQUYsQ0FBZ0I7QUFDekIvQixjQUFBQSxFQUFFLEVBQUU3RSxDQUFDLENBQUN1QixLQUFGLENBQVFRLEdBQVIsQ0FBWThDLEVBRFM7QUFFekJnQyxjQUFBQSxnQkFBZ0IsRUFBRSxJQUZPO0FBR3pCQyxjQUFBQSxxQkFBcUIsRUFBRSxLQUhFO0FBSXpCQyxjQUFBQSxlQUFlLEVBQUUsS0FKUTtBQUt6QkMsY0FBQUEsZUFBZSxFQUFFLEtBTFE7QUFNekJDLGNBQUFBLG1CQUFtQixFQUFFLEtBTkk7QUFPekJDLGNBQUFBLGVBQWUsRUFBRSxDQVBRO0FBUXpCQyxjQUFBQSxZQUFZLEVBQUUsQ0FSVztBQVN6QkMsY0FBQUEsZ0JBQWdCLEVBQUUsQ0FUTztBQVV6QkMsY0FBQUEsWUFBWSxFQUFFLEtBVlc7QUFXekJ0QyxjQUFBQSxXQUFXLEVBQUVBO0FBWFksYUFBaEIsQ0FBWCxDQXJjRixDQW1kRTs7QUFDQS9JLFlBQUFBLFFBQVEsQ0FBQ2lGLGFBQVQsQ0FDRSxJQUFJQyxXQUFKLENBQWdCLHFCQUFoQixDQURGLEVBcGRGLENBd2RFOztBQUNBbEIsWUFBQUEsQ0FBQyxDQUFDb0QsTUFBRixDQUFTQyxLQUFULENBQWVRLFVBQWYsQ0FBMEIsVUFBMUIsRUFBc0NuRCxnQkFBdEMsRUF6ZEYsQ0EyZEU7O0FBQ0FWLFlBQUFBLENBQUMsQ0FBQ29ELE1BQUYsQ0FBU1MsVUFBVCxDQUFvQixNQUFwQixFQUE0QixZQUFNO0FBRWhDLGtCQUFJN0QsQ0FBQyxDQUFDdUIsS0FBRixDQUFRUSxHQUFSLENBQVloRCxNQUFoQixFQUF3QjtBQUV4QixrQkFBTXVJLFVBQVUsR0FBR3RILENBQUMsQ0FBQ29ELE1BQUYsQ0FBU08sUUFBVCxDQUFrQjRELE9BQWxCLEVBQW5CO0FBQ0Esa0JBQU1DLE9BQU8sR0FBR3hILENBQUMsQ0FBQ29ELE1BQUYsQ0FBU08sUUFBVCxDQUFrQjhELFVBQWxCLEVBQWhCO0FBQ0Esa0JBQU1DLE9BQU8sR0FBRzFILENBQUMsQ0FBQ29ELE1BQUYsQ0FBU08sUUFBVCxDQUFrQmdFLFVBQWxCLEVBQWhCOztBQUVBLGtCQUNFTCxVQUFVLEdBQUdFLE9BQWIsSUFDQXhILENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWEsYUFBUixDQUFzQlgsU0FBdEIsQ0FBZ0NHLFFBQWhDLENBQXlDLFVBQXpDLENBRkYsRUFHRTtBQUNBNUIsZ0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWEsYUFBUixDQUFzQlgsU0FBdEIsQ0FBZ0NDLE1BQWhDLENBQXVDLFVBQXZDO0FBQ0ExQixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYSxhQUFSLENBQXNCWCxTQUF0QixDQUFnQ0ksR0FBaEMsQ0FBb0MsUUFBcEM7QUFDRDs7QUFFRCxrQkFDRXlGLFVBQVUsSUFBSUUsT0FEaEIsRUFFRTtBQUNBeEgsZ0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWEsYUFBUixDQUFzQlgsU0FBdEIsQ0FBZ0NJLEdBQWhDLENBQW9DLFVBQXBDO0FBQ0E3QixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYSxhQUFSLENBQXNCWCxTQUF0QixDQUFnQ0MsTUFBaEMsQ0FBdUMsUUFBdkM7QUFDRDs7QUFFRCxrQkFDRTRGLFVBQVUsSUFBSUksT0FEaEIsRUFFRTtBQUNBMUgsZ0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVksY0FBUixDQUF1QlYsU0FBdkIsQ0FBaUNJLEdBQWpDLENBQXFDLFVBQXJDO0FBQ0E3QixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRWSxjQUFSLENBQXVCVixTQUF2QixDQUFpQ0MsTUFBakMsQ0FBd0MsUUFBeEM7QUFDRDs7QUFFRCxrQkFDRTRGLFVBQVUsR0FBR0ksT0FEZixFQUVFO0FBQ0ExSCxnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRWSxjQUFSLENBQXVCVixTQUF2QixDQUFpQ0MsTUFBakMsQ0FBd0MsVUFBeEM7QUFDQTFCLGdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFZLGNBQVIsQ0FBdUJWLFNBQXZCLENBQWlDSSxHQUFqQyxDQUFxQyxRQUFyQztBQUNEO0FBRUYsYUFyQ0Q7O0FBdUNBN0YsWUFBQUEsUUFBUSxDQUFDQyxhQUFULENBQXVCLHVCQUF2QixFQUFnRDJMLFFBQWhELEdBQTJELFVBQUM1RyxLQUFELEVBQVc7QUFDcEVBLGNBQUFBLEtBQUssQ0FBQ00sY0FBTjtBQUNBdEYsY0FBQUEsUUFBUSxDQUFDaUYsYUFBVCxDQUNFLElBQUlDLFdBQUosQ0FBZ0IsZUFBaEIsRUFBaUM7QUFDL0JDLGdCQUFBQSxNQUFNLEVBQUU7QUFDTkMsa0JBQUFBLFNBQVMsRUFBRSxRQURMO0FBRU54RCxrQkFBQUEsRUFBRSxFQUFFb0MsQ0FBQyxDQUFDdUIsS0FBRixDQUFRK0UsWUFBUixDQUFxQnBLO0FBRm5CO0FBRHVCLGVBQWpDLENBREY7QUFRRCxhQVZELENBbmdCRixDQStnQkU7OztBQUNBOEQsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYSxhQUFSLENBQXNCeUYsT0FBdEIsR0FBZ0MsWUFBTTtBQUNwQyxrQkFBTVAsVUFBVSxHQUFHdEgsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCNEQsT0FBbEIsRUFBbkI7QUFDQSxrQkFBTUMsT0FBTyxHQUFHeEgsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCOEQsVUFBbEIsRUFBaEI7QUFDQSxrQkFBTUMsT0FBTyxHQUFHMUgsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCZ0UsVUFBbEIsRUFBaEI7QUFDQSxrQkFBTUcsTUFBTSxHQUFHUixVQUFVLEdBQUcsQ0FBNUI7O0FBQ0Esa0JBQUlBLFVBQVUsR0FBR0UsT0FBakIsRUFBMEI7QUFDeEJ4SCxnQkFBQUEsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCbUUsTUFBbEIsQ0FBeUJBLE1BQXpCO0FBQ0QsZUFQbUMsQ0FRcEM7OztBQUNBLGtCQUFJQSxNQUFNLElBQUlOLE9BQWQsRUFBdUI7QUFDckJ4SCxnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYSxhQUFSLENBQXNCWCxTQUF0QixDQUFnQ0ksR0FBaEMsQ0FBb0MsVUFBcEM7QUFDRDs7QUFDRCxrQkFBSXlGLFVBQVUsR0FBR0ksT0FBakIsRUFBMEI7QUFDeEIsb0JBQUkxSCxDQUFDLENBQUN1QixLQUFGLENBQVFZLGNBQVIsQ0FBdUJWLFNBQXZCLENBQWlDRyxRQUFqQyxDQUEwQyxVQUExQyxDQUFKLEVBQTJEO0FBQ3pENUIsa0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUVksY0FBUixDQUF1QlYsU0FBdkIsQ0FBaUNDLE1BQWpDLENBQXdDLFVBQXhDO0FBQ0Q7QUFDRjtBQUNGLGFBakJELENBaGhCRixDQW1pQkU7OztBQUNBMUIsWUFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRWSxjQUFSLENBQXVCMEYsT0FBdkIsR0FBaUMsWUFBTTtBQUNyQyxrQkFBTVAsVUFBVSxHQUFHdEgsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCNEQsT0FBbEIsRUFBbkI7QUFDQSxrQkFBTUcsT0FBTyxHQUFHMUgsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCZ0UsVUFBbEIsRUFBaEI7QUFDQSxrQkFBTUksSUFBSSxHQUFHVCxVQUFVLEdBQUcsQ0FBMUI7O0FBQ0Esa0JBQUlTLElBQUksSUFBSUwsT0FBWixFQUFxQjtBQUNuQjFILGdCQUFBQSxDQUFDLENBQUNvRCxNQUFGLENBQVNPLFFBQVQsQ0FBa0JtRSxNQUFsQixDQUF5QkMsSUFBekI7QUFDRCxlQUZELE1BRU87QUFDTCxvQkFBSVQsVUFBVSxHQUFHSSxPQUFqQixFQUEwQjtBQUN4QjFILGtCQUFBQSxDQUFDLENBQUNvRCxNQUFGLENBQVNPLFFBQVQsQ0FBa0JtRSxNQUFsQixDQUF5QkosT0FBekI7QUFDRDtBQUNGO0FBQ0YsYUFYRCxDQXBpQkYsQ0FpakJFOzs7QUFDQTFILFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUTBFLE1BQVIsQ0FBZTRCLE9BQWYsR0FBeUIsVUFBQ3ZLLENBQUQsRUFBTztBQUM5QkEsY0FBQUEsQ0FBQyxDQUFDZ0UsY0FBRjtBQUNBdEIsY0FBQUEsQ0FBQyxDQUFDb0QsTUFBRixDQUFTTyxRQUFULENBQWtCQyxXQUFsQixDQUE4QjVELENBQUMsQ0FBQ29ELE1BQUYsQ0FBU08sUUFBVCxDQUFrQnFFLE9BQWxCLEdBQTRCLEVBQTFEO0FBQ0QsYUFIRDs7QUFLQWhJLFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWMsVUFBUixDQUFtQndGLE9BQW5CLEdBQTZCLFVBQUN2SyxDQUFELEVBQU87QUFDbENBLGNBQUFBLENBQUMsQ0FBQ2dFLGNBQUY7QUFDQSxrQkFBSWhFLENBQUMsQ0FBQytELGFBQUYsQ0FBZ0JJLFNBQWhCLENBQTBCRyxRQUExQixDQUFtQyxVQUFuQyxDQUFKLEVBQW9ELE9BQU8sS0FBUDs7QUFDcEQsa0JBQUk1QixDQUFDLENBQUN1QixLQUFGLENBQVFjLFVBQVIsQ0FBbUJaLFNBQW5CLENBQTZCRyxRQUE3QixDQUFzQyxhQUF0QyxDQUFKLEVBQTBEO0FBQ3hENUIsZ0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWMsVUFBUixDQUFtQlosU0FBbkIsQ0FBNkJDLE1BQTdCLENBQW9DLGFBQXBDO0FBQ0ExQixnQkFBQUEsQ0FBQyxDQUFDdUIsS0FBRixDQUFRYyxVQUFSLENBQW1CWixTQUFuQixDQUE2QkksR0FBN0IsQ0FBaUMsYUFBakM7QUFDRCxlQUhELE1BSUs7QUFDSDdCLGdCQUFBQSxDQUFDLENBQUN1QixLQUFGLENBQVFjLFVBQVIsQ0FBbUJaLFNBQW5CLENBQTZCQyxNQUE3QixDQUFvQyxhQUFwQztBQUNBMUIsZ0JBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUWMsVUFBUixDQUFtQlosU0FBbkIsQ0FBNkJJLEdBQTdCLENBQWlDLGFBQWpDO0FBQ0Q7O0FBQ0Q3RixjQUFBQSxRQUFRLENBQUNpRixhQUFULENBQ0UsSUFBSUMsV0FBSixDQUFnQixlQUFoQixFQUFpQztBQUMvQkMsZ0JBQUFBLE1BQU0sRUFBRTtBQUNOQyxrQkFBQUEsU0FBUyxFQUFFOUQsQ0FBQyxDQUFDK0QsYUFBRixDQUFnQnhGLE9BQWhCLENBQXdCdUY7QUFEN0I7QUFEdUIsZUFBakMsQ0FERjtBQU9ELGFBbEJEOztBQW9CQXBGLFlBQUFBLFFBQVEsQ0FBQ21DLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDTyxPQUF0QyxDQUE4QyxVQUFBNkQsSUFBSSxFQUFJO0FBQ3BEQSxjQUFBQSxJQUFJLENBQUNsRSxnQkFBTCxDQUFzQixPQUF0QixFQUErQjZCLGVBQS9CO0FBQ0QsYUFGRDtBQUlBbEUsWUFBQUEsUUFBUSxDQUFDbUMsZ0JBQVQsQ0FBMEIsVUFBMUIsRUFBc0NPLE9BQXRDLENBQThDLFVBQUE2RCxJQUFJLEVBQUk7QUFDcERBLGNBQUFBLElBQUksQ0FBQ2xFLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCNEIsZUFBL0I7QUFDRCxhQUZEO0FBSUFELFlBQUFBLENBQUMsQ0FBQ3VCLEtBQUYsQ0FBUThFLE1BQVIsQ0FBZWhJLGdCQUFmLENBQWdDLFFBQWhDLEVBQTBDMEMsa0JBQTFDO0FBRUEvRSxZQUFBQSxRQUFRLENBQUNxQyxnQkFBVCxDQUEwQixlQUExQixFQUEyQ2dDLGFBQTNDO0FBRUFyRSxZQUFBQSxRQUFRLENBQUNxQyxnQkFBVCxDQUEwQiwyQkFBMUIsRUFBdURpQyxxQkFBdkQ7QUFFQXRFLFlBQUFBLFFBQVEsQ0FBQ3FDLGdCQUFULENBQTBCLDRCQUExQixFQUF3RGtDLHNCQUF4RDtBQUVBdkUsWUFBQUEsUUFBUSxDQUFDcUMsZ0JBQVQsQ0FBMEIsNkJBQTFCLEVBQXlEOEIsYUFBekQ7QUFFQW5FLFlBQUFBLFFBQVEsQ0FBQ3FDLGdCQUFULENBQTBCLDhCQUExQixFQUEwRCtCLGNBQTFEO0FBRUFwRSxZQUFBQSxRQUFRLENBQUNxQyxnQkFBVCxDQUEwQixxQkFBMUIsRUFBaURtQyxhQUFqRDtBQUVBeEUsWUFBQUEsUUFBUSxDQUFDcUMsZ0JBQVQsQ0FBMEIsNkJBQTFCLEVBQXlEd0MsdUJBQXpEO0FBRUE3RSxZQUFBQSxRQUFRLENBQUNxQyxnQkFBVCxDQUEwQiw4QkFBMUIsRUFBMER1Qyx1QkFBMUQsRUFubUJGLENBcW1CRTs7QUFDQS9DLFlBQUFBLGlFQUFRLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsc0JBQW5CLEVBQTJDLFVBQUFtRCxLQUFLLEVBQUk7QUFDMUQsa0JBQU02RSxjQUFjLEdBQUc3RSxLQUFLLENBQUN6QyxNQUE3QjtBQUNBdUIsY0FBQUEsMENBQUcsQ0FBQytGLGNBQWMsQ0FBQzNKLEtBQWhCLENBQUgsQ0FBMEJ3RyxJQUExQixDQUErQixVQUFBQyxRQUFRLEVBQUk7QUFDekMsb0JBQUlBLFFBQVEsQ0FBQ0MsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixzQkFBTUMsTUFBTSxHQUFHLElBQUlDLFNBQUosRUFBZjtBQUNBLHNCQUFNQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0csZUFBUCxDQUF1QkwsUUFBUSxDQUFDTSxJQUFoQyxFQUFzQyxXQUF0QyxDQUFaO0FBQ0Esc0JBQU1nRixJQUFJLEdBQUdqTSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIscUJBQXZCLENBQWI7QUFDQSxzQkFBTWlLLFFBQVEsR0FBR25ELEdBQUcsQ0FBQzlHLGFBQUosQ0FBa0IscUJBQWxCLENBQWpCO0FBQ0Esc0JBQU1pTSxJQUFJLEdBQUdsTSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBYjtBQUNBLHNCQUFNdUYsSUFBSSxHQUFHeEYsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQWI7QUFDQXVGLGtCQUFBQSxJQUFJLENBQUMyRyxHQUFMLEdBQVdqQyxRQUFRLENBQUNySyxPQUFULENBQWlCc00sR0FBNUI7QUFDQUQsa0JBQUFBLElBQUksQ0FBQ0MsR0FBTCxHQUFXakMsUUFBUSxDQUFDckssT0FBVCxDQUFpQnNNLEdBQTVCO0FBQ0FGLGtCQUFBQSxJQUFJLENBQUNFLEdBQUwsR0FBV2pDLFFBQVEsQ0FBQ3JLLE9BQVQsQ0FBaUJzTSxHQUE1QjtBQUNBRixrQkFBQUEsSUFBSSxDQUFDRyxTQUFMLEdBQWlCbEMsUUFBUSxDQUFDa0MsU0FBMUI7QUFDRDtBQUNGLGVBYkQsV0FjTyxVQUFBakYsS0FBSyxFQUFJO0FBQ2RqRyxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlnRyxLQUFaO0FBQ0QsZUFoQkQ7QUFpQkQsYUFuQk8sQ0FBUixDQXRtQkYsQ0EybkJFOztBQUNBdEYsWUFBQUEsaUVBQVEsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixpQkFBbkIsRUFBc0MsVUFBQW1ELEtBQUssRUFBSTtBQUNyRCxrQkFBTTZFLGNBQWMsR0FBRzdFLEtBQUssQ0FBQ3pDLE1BQTdCO0FBQ0Esa0JBQU1yQyxLQUFLLEdBQUcySixjQUFjLENBQUMzSixLQUE3QjtBQUNBLGtCQUFNbU0sSUFBSSxHQUFHck0sUUFBUSxDQUFDQyxhQUFULENBQXVCLGlCQUF2QixDQUFiO0FBQ0Esa0JBQU1xTSxJQUFJLEdBQUdELElBQUksQ0FBQ3hNLE9BQUwsQ0FBYXlNLElBQTFCO0FBQ0Esa0JBQU1DLEdBQUcsR0FBR3JNLEtBQUssQ0FBQ3NNLFNBQU4sQ0FBZ0J0TSxLQUFLLENBQUN1TSxPQUFOLENBQWMsSUFBZCxJQUFzQixDQUF0QyxFQUF5Q3ZNLEtBQUssQ0FBQ29ELE1BQS9DLElBQXlELFVBQXpELEdBQXNFZ0osSUFBbEY7O0FBQ0Esa0JBQUlyRSxNQUFNLENBQUN5RSxJQUFQLEtBQWdCekUsTUFBTSxDQUFDQyxHQUEzQixFQUFnQztBQUM5QkQsZ0JBQUFBLE1BQU0sQ0FBQ3dDLFFBQVAsQ0FBZ0JrQyxNQUFoQixDQUF1QkosR0FBdkI7QUFDRDtBQUNGLGFBVE8sQ0FBUjs7QUE1bkJGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBeW9CQXhJLFNBQVMsQ0FBQztBQUFFNkcsRUFBQUEsYUFBYSxFQUFFM0MsTUFBTSxDQUFDMkM7QUFBeEIsQ0FBRCxDQUFULEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZW52L2RhdGEuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL2NvbXBvbmV0cy9kZWNyZWFzZS1zZXF1ZW5jZS5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL2NvbXBvbmV0cy9pbmNyZWFzZS1zZXF1ZW5jZS5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL2NvbXBvbmV0cy90aWxlLXNvdXJjZXMuanMiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9qcy9jb21wb25ldHMvdG9nZ2xldmlldy1zZXF1ZW5jZS5qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL2NvbXBvbmV0cy9jaGFuZ2Utc2VxdWVuY2UubWpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vanMvY29tcG9uZXRzL2RlbGVnYXRlLm1qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL2NvbXBvbmV0cy9oaWRlLm1qcyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci8uL2pzL2NvbXBvbmV0cy9zZXFtYXAubWpzIiwid2VicGFjazovL2RsdHNfdmlld2VyLy4vanMvY29tcG9uZXRzL3Nob3cubWpzIiwid2VicGFjazovL2RsdHNfdmlld2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RsdHNfdmlld2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RsdHNfdmlld2VyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kbHRzX3ZpZXdlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RsdHNfdmlld2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGx0c192aWV3ZXIvLi9qcy92aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xudmFyIHRyYW5zaXRpb25hbERlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMvdHJhbnNpdGlvbmFsJyk7XG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG4gICAgdmFyIHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgdmFyIG9uQ2FuY2VsZWQ7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICBjb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICBmdW5jdGlvbiBvbmxvYWRlbmQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhcmVzcG9uc2VUeXBlIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/ICdFVElNRURPVVQnIDogJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAocmVzcG9uc2VUeXBlICYmIHJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbiB8fCBjb25maWcuc2lnbmFsKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgb25DYW5jZWxlZCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgKGNhbmNlbCAmJiBjYW5jZWwudHlwZSkgPyBuZXcgQ2FuY2VsKCdjYW5jZWxlZCcpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbiAmJiBjb25maWcuY2FuY2VsVG9rZW4uc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgY29uZmlnLnNpZ25hbC5hYm9ydGVkID8gb25DYW5jZWxlZCgpIDogY29uZmlnLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbiAgaW5zdGFuY2UuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGRlZmF1bHRDb25maWcsIGluc3RhbmNlQ29uZmlnKSk7XG4gIH07XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuYXhpb3MuVkVSU0lPTiA9IHJlcXVpcmUoJy4vZW52L2RhdGEnKS52ZXJzaW9uO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4oZnVuY3Rpb24oY2FuY2VsKSB7XG4gICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKSByZXR1cm47XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgbCA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgIH1cbiAgICB0b2tlbi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbihvbmZ1bGZpbGxlZCkge1xuICAgIHZhciBfcmVzb2x2ZTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pLnRoZW4ob25mdWxmaWxsZWQpO1xuXG4gICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICB0b2tlbi51bnN1YnNjcmliZShfcmVzb2x2ZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byB0aGUgY2FuY2VsIHNpZ25hbFxuICovXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxuLyoqXG4gKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gKi9cblxuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gdW5zdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdmFsaWRhdG9yJyk7XG5cbnZhciB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBjb25maWdPclVybDtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWdPclVybCB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWw7XG5cbiAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICBzaWxlbnRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgdmFyIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHZhciBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBpZiAodHlwZW9mIGludGVyY2VwdG9yLnJ1bldoZW4gPT09ICdmdW5jdGlvbicgJiYgaW50ZXJjZXB0b3IucnVuV2hlbihjb25maWcpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyAmJiBpbnRlcmNlcHRvci5zeW5jaHJvbm91cztcblxuICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2U7XG5cbiAgaWYgKCFzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMpIHtcbiAgICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICBjaGFpbiA9IGNoYWluLmNvbmNhdChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG4gIHZhciBuZXdDb25maWcgPSBjb25maWc7XG4gIHdoaWxlIChyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICB2YXIgb25GdWxmaWxsZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHZhciBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB0cnkge1xuICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgb25SZWplY3RlZChlcnJvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QobmV3Q29uZmlnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgd2hpbGUgKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZCxcbiAgICBzeW5jaHJvbm91czogb3B0aW9ucyA/IG9wdGlvbnMuc3luY2hyb25vdXMgOiBmYWxzZSxcbiAgICBydW5XaGVuOiBvcHRpb25zID8gb3B0aW9ucy5ydW5XaGVuIDogbnVsbFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9DYW5jZWwnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxuXG4gIGlmIChjb25maWcuc2lnbmFsICYmIGNvbmZpZy5zaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IG5ldyBDYW5jZWwoJ2NhbmNlbGVkJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgY29uZmlnLFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzdGF0dXM6IHRoaXMucmVzcG9uc2UgJiYgdGhpcy5yZXNwb25zZS5zdGF0dXMgPyB0aGlzLnJlc3BvbnNlLnN0YXR1cyA6IG51bGxcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWVyZ2VNYXAgPSB7XG4gICAgJ3VybCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ21ldGhvZCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2RhdGEnOiB2YWx1ZUZyb21Db25maWcyLFxuICAgICdiYXNlVVJMJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVxdWVzdCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zZm9ybVJlc3BvbnNlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAncGFyYW1zU2VyaWFsaXplcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0aW1lb3V0TWVzc2FnZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3dpdGhDcmVkZW50aWFscyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2FkYXB0ZXInOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZVR5cGUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd4c3JmQ29va2llTmFtZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25VcGxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ29uRG93bmxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2RlY29tcHJlc3MnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnbWF4Qm9keUxlbmd0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zcG9ydCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBBZ2VudCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBzQWdlbnQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdjYW5jZWxUb2tlbic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3NvY2tldFBhdGgnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZUVuY29kaW5nJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndmFsaWRhdGVTdGF0dXMnOiBtZXJnZURpcmVjdEtleXNcbiAgfTtcblxuICB1dGlscy5mb3JFYWNoKE9iamVjdC5rZXlzKGNvbmZpZzEpLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgdmFyIG1lcmdlID0gbWVyZ2VNYXBbcHJvcF0gfHwgbWVyZ2VEZWVwUHJvcGVydGllcztcbiAgICB2YXIgY29uZmlnVmFsdWUgPSBtZXJnZShwcm9wKTtcbiAgICAodXRpbHMuaXNVbmRlZmluZWQoY29uZmlnVmFsdWUpICYmIG1lcmdlICE9PSBtZXJnZURpcmVjdEtleXMpIHx8IChjb25maWdbcHJvcF0gPSBjb25maWdWYWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICB2YXIgY29udGV4dCA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuLmNhbGwoY29udGV4dCwgZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9lbmhhbmNlRXJyb3InKTtcbnZhciB0cmFuc2l0aW9uYWxEZWZhdWx0cyA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbmFsJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4uL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuXG4gIHRyYW5zaXRpb25hbDogdHJhbnNpdGlvbmFsRGVmYXVsdHMsXG5cbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSB8fCAoaGVhZGVycyAmJiBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2FmZWx5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgdmFyIHRyYW5zaXRpb25hbCA9IHRoaXMudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICB2YXIgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgIHZhciBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgdmFyIHN0cmljdEpTT05QYXJzaW5nID0gIXNpbGVudEpTT05QYXJzaW5nICYmIHRoaXMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cbiAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcgfHwgKGZvcmNlZEpTT05QYXJzaW5nICYmIHV0aWxzLmlzU3RyaW5nKGRhdGEpICYmIGRhdGEubGVuZ3RoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IGVuaGFuY2VFcnJvcihlLCB0aGlzLCAnRV9KU09OX1BBUlNFJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH0sXG5cbiAgaGVhZGVyczoge1xuICAgIGNvbW1vbjoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gICAgfVxuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcInZlcnNpb25cIjogXCIwLjI2LjFcIlxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZCtcXC0uXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdXRpbHMuaXNPYmplY3QocGF5bG9hZCkgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9lbnYvZGF0YScpLnZlcnNpb247XG5cbnZhciB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlLCBpKSB7XG4gIHZhbGlkYXRvcnNbdHlwZV0gPSBmdW5jdGlvbiB2YWxpZGF0b3IodGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8ICdhJyArIChpIDwgMSA/ICduICcgOiAnICcpICsgdHlwZTtcbiAgfTtcbn0pO1xuXG52YXIgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbj99IHZhbGlkYXRvciAtIHNldCB0byBmYWxzZSBpZiB0aGUgdHJhbnNpdGlvbmFsIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkXG4gKiBAcGFyYW0ge3N0cmluZz99IHZlcnNpb24gLSBkZXByZWNhdGVkIHZlcnNpb24gLyByZW1vdmVkIHNpbmNlIHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nP30gbWVzc2FnZSAtIHNvbWUgbWVzc2FnZSB3aXRoIGFkZGl0aW9uYWwgaW5mb1xuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvcHQsIG9wdHMpIHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQnICsgKHZlcnNpb24gPyAnIGluICcgKyB2ZXJzaW9uIDogJycpKSk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGFsbG93VW5rbm93blxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIHZhciBvcHQgPSBrZXlzW2ldO1xuICAgIHZhciB2YWxpZGF0b3IgPSBzY2hlbWFbb3B0XTtcbiAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICB2YXIgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IEVycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0KTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2VydE9wdGlvbnM6IGFzc2VydE9wdGlvbnMsXG4gIHZhbGlkYXRvcnM6IHZhbGlkYXRvcnNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGb3JtRGF0YV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgVVJMU2VhcmNoUGFyYW1zXSc7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci50cmltID8gc3RyLnRyaW0oKSA6IHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCJhc3luYyBmdW5jdGlvbiBkZWNyZWFzZShwcm9wcykge1xuICBjb25zdCBzZXF1ZW5jZV9jdXJyZW50ID0gTnVtYmVyKHByb3BzLmRhdGFzZXQuc2VxdWVuY2UpXG4gIGNvbnN0IHNlcXVlbmNlID0gc2VxdWVuY2VfY3VycmVudCAtIDFcbiAgaWYgKHNlcXVlbmNlIDwgMSkge1xuICAgIHJldHVybiBzZXF1ZW5jZVxuICB9IGVsc2Uge1xuICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZS50b1N0cmluZygpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpLnZhbHVlID0gc2VxdWVuY2UgIFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKS52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cbn1cblxuZXhwb3J0IHsgZGVjcmVhc2UgfVxuIiwiYXN5bmMgZnVuY3Rpb24gaW5jcmVhc2UocHJvcHMpIHtcbiAgY29uc3Qgc2VxdWVuY2VfY3VycmVudCA9IE51bWJlcihwcm9wcy5kYXRhc2V0LnNlcXVlbmNlKVxuICBjb25zdCBzZXF1ZW5jZV9jb3VudCA9IE51bWJlcihwcm9wcy5kYXRhc2V0LnNlcXVlbmNlQ291bnQpXG4gIGNvbnN0IHNlcXVlbmNlID0gc2VxdWVuY2VfY3VycmVudCArIDEgIFxuICBpZiAoc2VxdWVuY2UgPiBzZXF1ZW5jZV9jb3VudCkge1xuICAgIHJldHVybiBzZXF1ZW5jZV9jb3VudFxuICB9IGVsc2Uge1xuICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZS50b1N0cmluZygpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpLnZhbHVlID0gc2VxdWVuY2UgIFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKS52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cbn1cblxuZXhwb3J0IHsgaW5jcmVhc2UgfVxuIiwiYXN5bmMgZnVuY3Rpb24gdGlsZXMoc2VxbWFwLCBkYXRhc2V0KSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBkYXRhc2V0LnNlcXVlbmNlIC0gMVxuICByZXR1cm4gc2VxbWFwLnNlcXVlbmNlc1tjdXJyZW50XS5tYXAoKHNlcXVlbmNlLCB4KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbGVTb3VyY2U6IGAke2RhdGFzZXQuc2VydmljZX0vJHtkYXRhc2V0LnR5cGV9LyR7ZGF0YXNldC5pZGVudGlmaWVyfS8ke3NlcXVlbmNlfS9pbmZvLmpzb25gLFxuICAgICAgeDogeFxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IHsgdGlsZXMgfVxuIiwiaW1wb3J0IHsgc2VxbWFwIH0gZnJvbSAnLi9zZXFtYXAubWpzJ1xuXG5hc3luYyBmdW5jdGlvbiB0b2dnbGV2aWV3KHByb3BzLCBfc2VxbWFwKSB7XG5cbiAgY29uc29sZS5sb2coJ3RvZ2dsZXZpZXcnLCBwcm9wcywgX3NlcW1hcClcblxuICBpZiAocHJvcHMuZGF0YXNldC52aWV3ID09ICdzaW5nbGUnKSB7XG4gICAgcHJvcHMuZGF0YXNldC52aWV3ID0gJ2RvdWJsZXBhZ2UnXG4gIH0gZWxzZSB7XG4gICAgcHJvcHMuZGF0YXNldC52aWV3ID0gJ3NpbmdsZSdcbiAgfVxuXG4gIGNvbnN0IHNlcXVlbmNlX2N1cnJlbnQgPSBfc2VxbWFwLnNlcXVlbmNlc1tOdW1iZXIocHJvcHMuZGF0YXNldC5zZXF1ZW5jZSkgLSAxXS5maW5kKGUgPT4gdHJ1ZSlcblxuICBjb25zdCBjb3VudCA9IHByb3BzLmRhdGFzZXQuc2VxdWVuY2VDb3VudFxuXG4gIGNvbnN0IHZpZXcgPSBwcm9wcy5kYXRhc2V0LnZpZXdcblxuICBjb25zdCBfID0gYXdhaXQgc2VxbWFwKHsgY291bnQsIHZpZXcgfSlcblxuICBwcm9wcy5kYXRhc2V0LnNlcXVlbmNlID0gc2VxdWVuY2VfY3VycmVudFxuXG4gIC8vIHByb3BzLmRhdGFzZXQuc2VxdWVuY2VDb3VudCA9IF8uY291bnRcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JykubWF4ID0gXy5jb3VudFxuICBcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlcXVlbmNlX2NvdW50JykudGV4dENvbnRlbnQgPSBfLmNvdW50XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnRfcGFnZScpLnRleHRDb250ZW50ID0gc2VxdWVuY2VfY3VycmVudFxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKS52YWx1ZSA9IHNlcXVlbmNlX2N1cnJlbnRcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZ2Vfd2VpZ2h0JykudmFsdWUgPSBzZXF1ZW5jZV9jdXJyZW50XG5cbiAgcmV0dXJuIF9cblxufVxuXG5leHBvcnQgeyB0b2dnbGV2aWV3IH1cbiIsImFzeW5jIGZ1bmN0aW9uIGNoYW5nZSh0bywgcHJvcHMpIHtcbiAgY29uc3Qgc2VxdWVuY2UgPSBOdW1iZXIodG8pXG4gIGNvbnN0IHNlcXVlbmNlX2NvdW50ID0gTnVtYmVyKHByb3BzLmRhdGFzZXQuc2VxdWVuY2VDb3VudClcbiAgaWYgKHNlcXVlbmNlIDwgMSkge1xuICAgIHJldHVybiAxXG4gIH0gZWxzZSBpZiAoc2VxdWVuY2UgPiBzZXF1ZW5jZV9jb3VudCkge1xuICAgIHJldHVybiBzZXF1ZW5jZV9jb3VudFxuICB9IGVsc2Uge1xuICAgIHByb3BzLmRhdGFzZXQuc2VxdWVuY2UgPSBzZXF1ZW5jZS50b1N0cmluZygpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhbmdlX3dlaWdodCcpLnZhbHVlID0gc2VxdWVuY2UgIFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXJfdmFsdWUnKS52YWx1ZSA9IHNlcXVlbmNlXG4gIH1cbn1cblxuZXhwb3J0IHsgY2hhbmdlIH1cbiIsImZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBldmVudFR5cGUsIGNoaWxkU2VsZWN0b3IsIGV2ZW50SGFuZGxlcikge1xuICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudE9uRWxlbWVudCA9PiB7XG4gICAgICBpZiAoZXZlbnRPbkVsZW1lbnQudGFyZ2V0Lm1hdGNoZXMoY2hpbGRTZWxlY3RvcikpIHtcbiAgICAgICAgZXZlbnRIYW5kbGVyKGV2ZW50T25FbGVtZW50KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiAgICAgXG5leHBvcnQgeyBkZWxlZ2F0ZSB9XG4gICIsImZ1bmN0aW9uIGhpZGUoc2VsZWN0b3IpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaChlbG0gPT4ge1xuICAgIGVsbS5zdHlsZS5kaXNwbGF5ID0gbnVsbFxuICAgIGVsbS5zdHlsZS52aXNpYmlsaXR5ID0gbnVsbFxuICAgIGVsbS5oaWRkZW4gPSBudWxsXG4gICAgZWxtLmhlaWdodCA9IDBcbiAgfSlcbn1cbiAgXG5leHBvcnQgeyBoaWRlIH1cbiIsImFzeW5jIGZ1bmN0aW9uIHNpbmdsZXBhZ2UocHJvcHMpIHtcbiAgY29uc3QgeyBjb3VudCB9ID0gcHJvcHNcbiAgY29uc3Qgc2VxdWVuY2VzID0gW11cbiAgQXJyYXkoTnVtYmVyKGNvdW50KSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICsgMV0pXG4gIH0pXG4gIHJldHVybiB7IHNlcXVlbmNlcywgY291bnQ6IHNlcXVlbmNlcy5sZW5ndGggfVxufVxuXG5hc3luYyBmdW5jdGlvbiBkb3VibGVwYWdlKHByb3BzKSB7XG4gIGNvbnN0IHsgY291bnQgfSA9IHByb3BzXG4gIGNvbnN0IHNlcXVlbmNlcyA9IFtdXG4gIGNvbnN0IHNlcSA9IE1hdGguY2VpbChOdW1iZXIoY291bnQpIC8gMikgKyAxXG4gIEFycmF5KHNlcSkuZmlsbCgpLm1hcCgoXywgaW5kZXgpID0+IHtcbiAgICBzZXF1ZW5jZXMucHVzaChbIGluZGV4ICogMiwgaW5kZXggKiAyICsgMSBdKVxuICB9KVxuICAvLyBSZW1vdmUgMCBmcm9tIGZpcnN0IGluZGV4LlxuICBzZXF1ZW5jZXNbMF0uc2hpZnQoKVxuICAvLyBNYWtlIHN1cmUgbGFzdCBpbmRleCBkb2VzIG5vdCBpbmNsdWRlcyBvdXRib3VuZCBzZXF1ZW5jZXMuXG4gIGlmIChzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdWzFdID4gY291bnQpIHtcbiAgICBzZXF1ZW5jZXNbc2VxdWVuY2VzLmxlbmd0aCAtIDFdLnBvcCgpXG4gIH1cbiAgaWYgKHNlcXVlbmNlc1tzZXF1ZW5jZXMubGVuZ3RoIC0gMV1bMF0gPiBjb3VudCkge1xuICAgIHNlcXVlbmNlcy5wb3AoKVxuICB9XG4gIHJldHVybiB7IHNlcXVlbmNlcywgY291bnQ6IHNlcXVlbmNlcy5sZW5ndGggfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzZXFtYXAocHJvcHMpIHtcbiAgY29uc29sZS5sb2coJ2NhbGxlZCA6IGZ1bmN0aW9uIDogc2VxbWFwIDogcHJvcHMnLCBwcm9wcylcbiAgY29uc3QgeyBjb3VudCwgdmlldyB9ID0gcHJvcHNcbiAgc3dpdGNoICh2aWV3KSB7XG4gICAgY2FzZSAnZG91YmxlcGFnZSc6XG4gICAgICByZXR1cm4gYXdhaXQgZG91YmxlcGFnZSh7Y291bnR9KVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYXdhaXQgc2luZ2xlcGFnZSh7Y291bnR9KVxuICB9XG59XG5cbmV4cG9ydCB7IHNlcW1hcCB9XG4iLCJmdW5jdGlvbiBzaG93KHNlbGVjdG9yKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goZWxtID0+IHtcbiAgICBlbG0uc3R5bGUuZGlzcGxheSA9IG51bGxcbiAgICBlbG0uc3R5bGUudmlzaWJpbGl0eSA9IG51bGxcbiAgICBlbG0uaGlkZGVuID0gbnVsbFxuICB9KVxufVxuICAgIFxuZXhwb3J0IHsgc2hvdyB9XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZ2V0IH0gZnJvbSAnYXhpb3MnXG5pbXBvcnQgeyBzZXFtYXAgfSBmcm9tICcuL2NvbXBvbmV0cy9zZXFtYXAubWpzJ1xuaW1wb3J0IHsgaGlkZSB9IGZyb20gJy4vY29tcG9uZXRzL2hpZGUubWpzJ1xuaW1wb3J0IHsgc2hvdyB9IGZyb20gJy4vY29tcG9uZXRzL3Nob3cubWpzJ1xuaW1wb3J0IHsgZGVsZWdhdGUgfSBmcm9tICcuL2NvbXBvbmV0cy9kZWxlZ2F0ZS5tanMnXG5pbXBvcnQgeyBkZWNyZWFzZSB9IGZyb20gJy4vY29tcG9uZXRzL2RlY3JlYXNlLXNlcXVlbmNlLmpzJ1xuaW1wb3J0IHsgaW5jcmVhc2UgfSBmcm9tICcuL2NvbXBvbmV0cy9pbmNyZWFzZS1zZXF1ZW5jZS5qcydcbmltcG9ydCB7IGNoYW5nZSB9IGZyb20gJy4vY29tcG9uZXRzL2NoYW5nZS1zZXF1ZW5jZS5tanMnXG5pbXBvcnQgeyB0aWxlcyB9ICBmcm9tICcuL2NvbXBvbmV0cy90aWxlLXNvdXJjZXMuanMnXG5pbXBvcnQgeyB0b2dnbGV2aWV3IH0gZnJvbSAnLi9jb21wb25ldHMvdG9nZ2xldmlldy1zZXF1ZW5jZS5qcydcblxuYXN5bmMgZnVuY3Rpb24gVmlld2VyQXBwKFkpIHtcblxuICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgZmlyZTogJ3ZpZXdlcjppbml0JywgbWVzc2FnZToge30gfSksICcqJylcblxuICBZLlZpZXdlciA9IG51bGxcblxuICBZLmlzRnVsbHlMb2FkZWQgPSBmYWxzZVxuXG4gIFkuc2VxbWFwID0gW11cblxuICBmdW5jdGlvbiBvbl9idXR0b25fY2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGUuY3VycmVudFRhcmdldFxuICAgIGxldCBldmVudF9wcmVmaXgsIGV2ZW50X2lkXG4gICAgLyoqIGRvbid0IHdhc3RlIHRpbWUgaWYgdGhlIGJ1dHRvbiBpcyBpbmFjdGl2ZSAqL1xuICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHJldHVyblxuICAgIC8qKiBjdXJyZW50IHRhcmdldCBpcyB0aGUgbWFpbiB0YXJnZXQgKi9cbiAgICBlbHNlIHtcbiAgICAgIGV2ZW50X2lkID0gY3VycmVudF90YXJnZXQuaWRcbiAgICAgIGV2ZW50X3ByZWZpeCA9ICdidXR0b246JyArIGV2ZW50X2lkXG4gICAgfVxuICAgIGlmIChjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICAgIGN1cnJlbnRfdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ29mZicpXG4gICAgICBjb25zb2xlLmxvZyhgJHtldmVudF9wcmVmaXh9Om9mZmApXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTpvZmZgLCBlKVxuICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QuYWRkKCdvbicpXG4gICAgICBjdXJyZW50X3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdvZmYnKVxuICAgICAgY29uc29sZS5sb2coYCR7ZXZlbnRfcHJlZml4fTpvbmApXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTpvbmAsIGUpXG4gICAgICApXG4gICAgfVxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoYCR7ZXZlbnRfcHJlZml4fTp0b2dnbGVgLCBlKVxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX3BhZ2luZ19jbGljayhlKSB7XG4gICAgY29uc3QgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldFxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIC8qKiB0ZXN0IGlmIHRoZSB0YXJnZXQgaXMgbm90IGFjdGl2ZSAqL1xuICAgIGlmIChjdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkgcmV0dXJuIGZhbHNlXG4gICAgdHJ5IHtcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QuYWRkKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgb3BlcmF0aW9uOiBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5vcGVyYXRpb24sXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5sb2coZSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBmdWxsc2NyZWVuX29uKCkge1xuICAgIGNvbnN0IGRvY0VsbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgIGNvbnN0IHRvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3AnKVxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuICAgIGlmIChidXR0b24pIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgfVxuICAgIGlmIChkb2NFbG0ucmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY0VsbS5yZXF1ZXN0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY0VsbS5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICBkb2NFbG0ubXNSZXF1ZXN0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY0VsbS5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgZG9jRWxtLm1velJlcXVlc3RGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jRWxtLndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICBkb2NFbG0ud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oKVxuICAgIH1cbiAgICBpZiAodG9wKSB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB9XG4gICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7IGZpcmU6ICdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b24nLCBtZXNzYWdlOiB7fSB9KSwgJyonKVxuICB9XG5cbiAgZnVuY3Rpb24gZnVsbHNjcmVlbl9vZmYoKSB7XG4gICAgY29uc3QgdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpXG4gICAgfVxuICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgIGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKVxuICAgIH1cbiAgICBlbHNlIGlmIChkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKClcbiAgICB9XG4gICAgZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpXG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIHRvcC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICAgIH1cbiAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgZmlyZTogJ2J1dHRvbjpidXR0b24tZnVsbHNjcmVlbjpvZmYnLCBtZXNzYWdlOiB7fSB9KSwgJyonKVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gbG9hZF9zZXF1ZW5jZShlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBpdGVtcyA9IFtdXG4gICAgICBjb25zdCBvc2QgPSBZLm5vZGVzLm9zZFxuICAgICAgY29uc3QgZGF0YXNldCA9IG9zZC5kYXRhc2V0XG5cbiAgICAgIHN3aXRjaCAoZS5kZXRhaWwub3BlcmF0aW9uKSB7XG4gICAgICAgIGNhc2UgJ2luY3JlYXNlJzpcbiAgICAgICAgICBhd2FpdCBpbmNyZWFzZShvc2QpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnZGVjcmVhc2UnOlxuICAgICAgICAgIGF3YWl0IGRlY3JlYXNlKG9zZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdjaGFuZ2UnOlxuICAgICAgICAgIGF3YWl0IGNoYW5nZShlLmRldGFpbC50bywgb3NkKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3RvZ2dsZXZpZXcnOlxuICAgICAgICAgIFkuc2VxbWFwID0gYXdhaXQgdG9nZ2xldmlldyhvc2QsIFkuc2VxbWFwKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8qKiBDb25maWd1cmF0aW9uIGZvciB0aGUgbmV3IGJvb2sgcGFnZSAqL1xuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBpZDogb3NkLmlkLFxuICAgICAgICB0aXRsZTogb3NkLmRhdGFzZXQudGl0bGUsXG4gICAgICAgIHNlcXVlbmNlOiBvc2QuZGF0YXNldC5zZXF1ZW5jZSxcbiAgICAgICAgc2VxdWVuY2VDb3VudDogWS5zZXFtYXAuY291bnQsXG4gICAgICAgIHVyaTogb3NkLmRhdGFzZXQudXJpLFxuICAgICAgfVxuXG4gICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBmaXJlOiAndmlld2VyOnNlcXVlbmNlOmNoYW5nZScsIG1lc3NhZ2U6IGNvbmZpZyB9KSwgJyonKVxuXG4gICAgY29uc3QgdGlsZVNvdXJjZXMgPSBhd2FpdCB0aWxlcyhZLnNlcW1hcCwgZGF0YXNldClcblxuICAgIFkubm9kZXMubG9hZGluZ01zZy50ZXh0Q29udGVudCA9IGl0ZW1zLmpvaW4oJyAtICcpXG5cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGRhdGFzZXQuc2VxdWVuY2UgPj0gWS5zZXFtYXAuY291bnQpIHtcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGlmIChkYXRhc2V0LnNlcXVlbmNlIDw9IDEpIHtcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuXG4gICAgICBzaG93KCcjb3BlbnNlYWRyYWdvbjEnKVxuXG4gICAgICBzaG93KCcjcGFnZXInKVxuXG4gICAgICBZLlZpZXdlci5vcGVuKHRpbGVTb3VyY2VzKVxuXG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcblxuICAgICAgWS5pc0Z1bGx5TG9hZGVkID0gdHJ1ZVxuXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vbigpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uLW1ldGFkYXRhJylcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29mZicpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ29uJylcbiAgICBlbGVtZW50LmNsb3Nlc3QoJy5wYW5lLWJvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlbWV0YS1oaWRkZW4nKVxuICAgIHdpbmRvdy50b3AucG9zdE1lc3NhZ2UoXG4gICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAge1xuICAgICAgICAgIGZpcmU6ICdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9uJyAsXG4gICAgICAgICAgbWVzc2FnZToge31cbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgICcqJ1xuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbi1tZXRhZGF0YScpXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwYWdlbWV0YScpXG4gICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ29uJylcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgZWxlbWVudC5jbG9zZXN0KCcucGFuZS1ib2R5JykuY2xhc3NMaXN0LmFkZCgncGFnZW1ldGEtaGlkZGVuJylcbiAgICB3aW5kb3cudG9wLnBvc3RNZXNzYWdlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIHtcbiAgICAgICAgICBmaXJlOiAnYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvZmYnICxcbiAgICAgICAgICBtZXNzYWdlOiB7fVxuICAgICAgICB9XG4gICAgICApLFxuICAgICAgJyonXG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gdGlsZXNfbG9hZGluZygpIHtcbiAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW5sYXllcnMtbG9hZGluZycpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGlsZXNfbG9hZGluZygpXG4gICAgICB9LCAxMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWRlKCcucGFuZS5sb2FkJylcbiAgICAgIFkubm9kZXMuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVubGF5ZXJzLWxvYWRpbmcnKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZV9sb2FkaW5nX2luZGljYXRvcigpIHtcbiAgICBpZiAoWS5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICBZLm5vZGVzLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmxheWVycy1sb2FkaW5nJylcbiAgICAgIGhpZGUoJy5wYW5lLmxvYWQnKVxuICAgICAgd2luZG93LnRvcC5wb3N0TWVzc2FnZShcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmlyZTogJ3ZpZXdlcjpsb2FkZWQnLFxuICAgICAgICAgICAgbWVzc2FnZToge31cbiAgICAgICAgICB9XG4gICAgICAgICksXG4gICAgICAgICcqJ1xuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZF9pdGVtX2hhbmRsZXIoZXZlbnQpIHtcbiAgICBZLlZpZXdlci52aWV3cG9ydC5zZXRSb3RhdGlvbigwKVxuICAgIGNvbnN0IHRpbGVkSW1hZ2UgPSBldmVudC5pdGVtXG4gICAgdGlsZWRJbWFnZS5hZGRIYW5kbGVyKCdmdWxseS1sb2FkZWQtY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbmV3RnVsbHlMb2FkZWQgPSBhcmVfYWxsX2Z1bGx5X2xvYWRlZCgpXG4gICAgICBpZiAobmV3RnVsbHlMb2FkZWQgIT09IFkuaXNGdWxseUxvYWRlZCkge1xuICAgICAgICBZLmlzRnVsbHlMb2FkZWQgPSBuZXdGdWxseUxvYWRlZFxuICAgICAgICB1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBhcmVfYWxsX2Z1bGx5X2xvYWRlZCgpIHtcbiAgICBjb25zdCBjb3VudCA9IFkuVmlld2VyLndvcmxkLmdldEl0ZW1Db3VudCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCB0aWxlZEltYWdlID0gWS5WaWV3ZXIud29ybGQuZ2V0SXRlbUF0KGkpXG4gICAgICBpZiAoIXRpbGVkSW1hZ2UuZ2V0RnVsbHlMb2FkZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KCkge1xuXG4gICAgY29uc3Qgb3NkID0gWS5ub2Rlcy5vc2RcblxuICAgIGNvbnN0IHsgc2VxdWVuY2VDb3VudCwgc2VxdWVuY2UgfSA9IG9zZC5kYXRhc2V0XG5cbiAgICBZLm5vZGVzLmh0bWwuY2xhc3NMaXN0LnJlbW92ZSgndGh1bWJuYWlscy12aWV3JylcblxuICAgIGhpZGUoJyN0aHVtYm5haWxzJylcblxuICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cbiAgICBZLm5vZGVzLm5leHQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG5cbiAgICBZLm5vZGVzLnByZXZpb3VzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoc2VxdWVuY2UgPiAxKSB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfSlcblxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKHNlcXVlbmNlIDwgc2VxdWVuY2VDb3VudCkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uX29wZW5fdGh1bWJuYWlsc192aWV3KCkge1xuXG4gICAgY29uc3QgeyB1cmkgfSA9IFkubm9kZXMub3NkLmRhdGFzZXRcblxuICAgIGNvbnN0IHsgc3RhdGUgfSA9IFkubm9kZXMudGh1bWJuYWlscy5kYXRhc2V0XG5cbiAgICBjb25zdCB3aWR0aCA9ICcyMzAnXG5cbiAgICBjb25zdCBoZWlnaHQgPSAnMTUwJ1xuXG4gICAgWS5ub2Rlcy5odG1sLmNsYXNzTGlzdC5hZGQoJ3RodW1ibmFpbHMtdmlldycpXG5cbiAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG5cbiAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICBZLm5vZGVzLmNvbnRyb2xab29tSW4uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuXG4gICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgWS5ub2Rlcy50b2dnbGVQYWdlLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcblxuICAgIFkubm9kZXMubmV4dC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgfSlcblxuICAgIFkubm9kZXMucHJldmlvdXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaW5hY3RpdmUnKVxuICAgIH0pXG5cbiAgICBpZiAocGFyc2VJbnQoc3RhdGUsIDEwKSA9PT0gMCkge1xuICAgICAgZ2V0KGAke3VyaX0vdGh1bWJuYWlscz9wamF4PXRydWUmd2lkdGg9JHt3aWR0aH0maGVpZ2h0PSR7aGVpZ2h0fWApLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKClcbiAgICAgICAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLmRhdGEsICd0ZXh0L2h0bWwnKVxuICAgICAgICAgICBZLm5vZGVzLnRodW1ibmFpbHMuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBkb2MucXVlcnlTZWxlY3RvcignLnRodW1ibmFpbHMuY29udGFpbmVyJylcbiAgICAgICAgICApXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRodW1ibmFpbHMuY29udGFpbmVyIGEnKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVGh1bWJuYWlsc0NsaWNrKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgWS5ub2Rlcy50aHVtYm5haWxzLmRhdGFzZXQuc3RhdGUgPSAxXG4gICAgICAgIH1cblxuICAgICAgICBzaG93KCcjdGh1bWJuYWlscycpXG5cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25UaHVtYm5haWxzQ2xpY2soZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgWS5ub2Rlcy5odG1sLmNsYXNzTGlzdC5yZW1vdmUoJ3RodW1ibmFpbHMtdmlldycpXG4gICAgaWYgKFkubm9kZXMuYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QuY29udGFpbnMoJ29uJykpIHtcbiAgICAgIFkubm9kZXMuYnV0dG9uVGh1bWJuYWlscy5jbGFzc0xpc3QucmVtb3ZlKCdvbicpXG4gICAgICBZLm5vZGVzLmJ1dHRvblRodW1ibmFpbHMuY2xhc3NMaXN0LmFkZCgnb2ZmJylcbiAgICB9XG5cbiAgICBoaWRlKCcjdGh1bWJuYWlscycpXG5cbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246ICdjaGFuZ2UnLFxuICAgICAgICAgIHRvOiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VxdWVuY2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2xpZGVfdmFsdWVfY2hhbmdlKGV2ZW50KSB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnbG9hZDpzZXF1ZW5jZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgb3BlcmF0aW9uOiAnY2hhbmdlJyxcbiAgICAgICAgICB0bzogZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBZLm5vZGVzID0ge31cblxuICBZLm5vZGVzLmh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJylcblxuICBZLm5vZGVzLmJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JylcblxuICBZLm5vZGVzLnRodW1ibmFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGh1bWJuYWlscycpXG5cbiAgWS5ub2Rlcy5idXR0b25NZXRhZGF0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24tbWV0YWRhdGEnKVxuXG4gIFkubm9kZXMucm90YXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtcm90YXRlJylcblxuICBZLm5vZGVzLnBhZ2VtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BhZ2VtZXRhJylcblxuICBZLm5vZGVzLm9zZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcGVuc2VhZHJhZ29uMScpXG5cbiAgWS5ub2Rlcy5kaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyNkaXNwbGF5JylcblxuICBZLm5vZGVzLnRvZ2dsZVBhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLXBhZ2UnKVxuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udHJvbC16b29tLW91dCcpXG5cbiAgWS5ub2Rlcy5jb250cm9sWm9vbUluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2wtem9vbS1pbicpXG5cbiAgWS5ub2Rlcy50b2dnbGVMYW5ndWFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgLmxhbmd1YWdlJylcblxuICBZLm5vZGVzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYW5nZV93ZWlnaHQnKVxuXG4gIFkubm9kZXMuc2xpZGVyX3ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlcl92YWx1ZScpXG5cbiAgWS5ub2Rlcy5sb2FkaW5nTXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnRfcGFnZScpXG5cbiAgWS5ub2Rlcy5idXR0b25UaHVtYm5haWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi10aHVtYm5haWxzJylcblxuICBZLm5vZGVzLm5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLm5leHQnKVxuXG4gIFkubm9kZXMucHJldmlvdXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5nLnByZXZpb3VzJylcblxuICBjb25zdCB7IHZpZXcsIHNlcXVlbmNlLCBzZXF1ZW5jZUNvdW50IH0gPSBZLm5vZGVzLm9zZC5kYXRhc2V0XG5cbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuXG4gIGxldCByZXFfc2VxdWVuY2UgPSBwYXJhbXMuZ2V0KCdzZXF1ZW5jZScpXG5cbiAgaWYgKCFyZXFfc2VxdWVuY2UpIHtcbiAgICByZXFfc2VxdWVuY2UgPSBzZXF1ZW5jZVxuICB9XG5cbiAgaWYgKHZpZXcgPT0gJ2RvdWJsZXBhZ2UnKSB7XG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgIH1cbiAgfVxuXG4gIFkuc2VxbWFwID0gYXdhaXQgc2VxbWFwKHsgY291bnQ6IHNlcXVlbmNlQ291bnQsIHZpZXcgfSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudF9wYWdlJykudGV4dENvbnRlbnQgPSBZLm5vZGVzLm9zZC5kYXRhc2V0LnNlcXVlbmNlID0gWS5ub2Rlcy5zbGlkZXIudmFsdWUgPSBZLm5vZGVzLnNsaWRlcl92YWx1ZS52YWx1ZSA9IHJlcV9zZXF1ZW5jZVxuXG4gIFkubm9kZXMuc2xpZGVyLm1heCA9IFkuc2VxbWFwLmNvdW50XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlcXVlbmNlX2NvdW50JykuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpdGVtLnRleHRDb250ZW50ID0gWS5zZXFtYXAuY291bnRcbiAgfSlcblxuICBjb25zdCB0aWxlU291cmNlcyA9IGF3YWl0IHRpbGVzKFkuc2VxbWFwLCBZLm5vZGVzLm9zZC5kYXRhc2V0KVxuXG4gIFkuVmlld2VyID0gWS5PcGVuU2VhZHJhZ29uKHtcbiAgICBpZDogWS5ub2Rlcy5vc2QuaWQsXG4gICAgcHJlc2VydmVWaWV3cG9ydDogdHJ1ZSxcbiAgICBzaG93TmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxuICAgIHNob3dab29tQ29udHJvbDogZmFsc2UsXG4gICAgc2hvd0hvbWVDb250cm9sOiBmYWxzZSxcbiAgICBzaG93RnVsbFBhZ2VDb250cm9sOiBmYWxzZSxcbiAgICB2aXNpYmlsaXR5UmF0aW86IDEsXG4gICAgbWluWm9vbUxldmVsOiAwLFxuICAgIGRlZmF1bHRab29tTGV2ZWw6IDAsXG4gICAgc2VxdWVuY2VNb2RlOiBmYWxzZSxcbiAgICB0aWxlU291cmNlczogdGlsZVNvdXJjZXMsXG4gIH0pXG5cbiAgLy8gQ2FsbHMgdGlsZXMgbG9hZGluZ1xuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBDdXN0b21FdmVudCgndmlld2VyOmNvbnRlbnRyZWFkeScpXG4gIClcblxuICAvLyBPcGVuU2VhZHJhZ29uIGV2ZW50LlxuICBZLlZpZXdlci53b3JsZC5hZGRIYW5kbGVyKCdhZGQtaXRlbScsIGFkZF9pdGVtX2hhbmRsZXIpXG5cbiAgLy8gT3BlblNlYWRyYWdvbiBldmVudC5cbiAgWS5WaWV3ZXIuYWRkSGFuZGxlcignem9vbScsICgpID0+IHtcblxuICAgIGlmIChZLm5vZGVzLm9zZC5oaWRkZW4pIHJldHVyblxuXG4gICAgY29uc3QgYWN0dWFsWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldFpvb20oKVxuICAgIGNvbnN0IG1heFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRNYXhab29tKClcbiAgICBjb25zdCBtaW5ab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWluWm9vbSgpXG5cbiAgICBpZiAoXG4gICAgICBhY3R1YWxab29tIDwgbWF4Wm9vbSAmJlxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPj0gbWF4Wm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21Jbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGFjdHVhbFpvb20gPD0gbWluWm9vbVxuICAgICkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdpbmFjdGl2ZScpXG4gICAgICBZLm5vZGVzLmNvbnRyb2xab29tT3V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0dWFsWm9vbSA+IG1pblpvb21cbiAgICApIHtcbiAgICAgIFkubm9kZXMuY29udHJvbFpvb21PdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5hY3RpdmUnKVxuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH1cblxuICB9KVxuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmb3JtLXVwZGF0ZS1zZXF1ZW5jZScpLm9uc3VibWl0ID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2xvYWQ6c2VxdWVuY2UnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG9wZXJhdGlvbjogJ2NoYW5nZScsXG4gICAgICAgICAgdG86IFkubm9kZXMuc2xpZGVyX3ZhbHVlLnZhbHVlLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIC8vIFpvb20gaW4gY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21Jbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGNvbnN0IGFjdHVhbFpvb20gPSBZLlZpZXdlci52aWV3cG9ydC5nZXRab29tKClcbiAgICBjb25zdCBtYXhab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0TWF4Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb21UbyA9IGFjdHVhbFpvb20gKiAyXG4gICAgaWYgKGFjdHVhbFpvb20gPCBtYXhab29tKSB7XG4gICAgICBZLlZpZXdlci52aWV3cG9ydC56b29tVG8oem9vbVRvKVxuICAgIH1cbiAgICAvLyBsb29rIGZvciBldmVudCBvcHRpb25zIChPcGVuU2VhRHJhZ29uIHpvb20gZW5kKVxuICAgIGlmICh6b29tVG8gPj0gbWF4Wm9vbSkge1xuICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbUluLmNsYXNzTGlzdC5hZGQoJ2luYWN0aXZlJylcbiAgICB9XG4gICAgaWYgKGFjdHVhbFpvb20gPiBtaW5ab29tKSB7XG4gICAgICBpZiAoWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QuY29udGFpbnMoJ2luYWN0aXZlJykpIHtcbiAgICAgICAgWS5ub2Rlcy5jb250cm9sWm9vbU91dC5jbGFzc0xpc3QucmVtb3ZlKCdpbmFjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMuY29udHJvbFpvb21PdXQub25jbGljayA9ICgpID0+IHtcbiAgICBjb25zdCBhY3R1YWxab29tID0gWS5WaWV3ZXIudmlld3BvcnQuZ2V0Wm9vbSgpXG4gICAgY29uc3QgbWluWm9vbSA9IFkuVmlld2VyLnZpZXdwb3J0LmdldE1pblpvb20oKVxuICAgIGNvbnN0IHpvb20gPSBhY3R1YWxab29tIC8gMlxuICAgIGlmICh6b29tID49IG1pblpvb20pIHtcbiAgICAgIFkuVmlld2VyLnZpZXdwb3J0Lnpvb21Ubyh6b29tKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWN0dWFsWm9vbSA+IG1pblpvb20pIHtcbiAgICAgICAgWS5WaWV3ZXIudmlld3BvcnQuem9vbVRvKG1pblpvb20pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gWm9vbSBvdXQgY2xpY2sgZXZlbnQuXG4gIFkubm9kZXMucm90YXRlLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFkuVmlld2VyLnZpZXdwb3J0LnNldFJvdGF0aW9uKFkuVmlld2VyLnZpZXdwb3J0LmRlZ3JlZXMgKyA5MClcbiAgfVxuXG4gIFkubm9kZXMudG9nZ2xlUGFnZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiAoZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaW5hY3RpdmUnKSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ3BhZ2UtZG91YmxlJykpIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWRvdWJsZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1zaW5nbGUnKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIFkubm9kZXMudG9nZ2xlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLXNpbmdsZScpXG4gICAgICBZLm5vZGVzLnRvZ2dsZVBhZ2UuY2xhc3NMaXN0LmFkZCgncGFnZS1kb3VibGUnKVxuICAgIH1cbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdsb2FkOnNlcXVlbmNlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBvcGVyYXRpb246IGUuY3VycmVudFRhcmdldC5kYXRhc2V0Lm9wZXJhdGlvbixcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLnBhZ2luZycpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX3BhZ2luZ19jbGljaylcbiAgfSlcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLmJ1dHRvbicpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uX2J1dHRvbl9jbGljaylcbiAgfSlcblxuICBZLm5vZGVzLnNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzbGlkZV92YWx1ZV9jaGFuZ2UpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZDpzZXF1ZW5jZScsIGxvYWRfc2VxdWVuY2UpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1tZXRhZGF0YTpvbicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLW1ldGFkYXRhOm9mZicsIG9uX2J1dHRvbl9tZXRhZGF0YV9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi1mdWxsc2NyZWVuOm9uJywgZnVsbHNjcmVlbl9vbilcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdidXR0b246YnV0dG9uLWZ1bGxzY3JlZW46b2ZmJywgZnVsbHNjcmVlbl9vZmYpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlld2VyOmNvbnRlbnRyZWFkeScsIHRpbGVzX2xvYWRpbmcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9uJywgb25fb3Blbl90aHVtYm5haWxzX3ZpZXcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uOmJ1dHRvbi10aHVtYm5haWxzOm9mZicsIG9uX2hpZGVfdGh1bWJuYWlsc192aWV3KVxuXG4gIC8vIExhbmd1YWdlXG4gIGRlbGVnYXRlKCdib2R5JywgJ2NoYW5nZScsICcubGFuZy1vcHRpb25zIHNlbGVjdCcsIGV2ZW50ID0+IHtcbiAgICBjb25zdCBjdXJyZW50X3RhcmdldCA9IGV2ZW50LnRhcmdldFxuICAgIGdldChjdXJyZW50X3RhcmdldC52YWx1ZSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpXG4gICAgICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVzcG9uc2UuZGF0YSwgJ3RleHQvaHRtbCcpXG4gICAgICAgIGNvbnN0IHBhbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlldy1tb2RlLW1ldGFkYXRhJylcbiAgICAgICAgY29uc3QgcGFnZW1ldGEgPSBkb2MucXVlcnlTZWxlY3RvcignLnZpZXctbW9kZS1tZXRhZGF0YScpXG4gICAgICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZS5tYWluJylcbiAgICAgICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKVxuICAgICAgICBodG1sLmRpciA9IHBhZ2VtZXRhLmRhdGFzZXQuZGlyXG4gICAgICAgIG1haW4uZGlyID0gcGFnZW1ldGEuZGF0YXNldC5kaXJcbiAgICAgICAgcGFuZS5kaXIgPSBwYWdlbWV0YS5kYXRhc2V0LmRpclxuICAgICAgICBwYW5lLmlubmVySFRNTCA9IHBhZ2VtZXRhLmlubmVySFRNTFxuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVm9sdW1lXG4gIGRlbGVnYXRlKCdib2R5JywgJ2NoYW5nZScsICcudmlldy1tdiBzZWxlY3QnLCBldmVudCA9PiB7XG4gICAgY29uc3QgY3VycmVudF90YXJnZXQgPSBldmVudC50YXJnZXRcbiAgICBjb25zdCB2YWx1ZSA9IGN1cnJlbnRfdGFyZ2V0LnZhbHVlXG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub2RlLWRsdHMtYm9vaycpXG4gICAgY29uc3QgbGFuZyA9IG5vZGUuZGF0YXNldC5sYW5nXG4gICAgY29uc3QgdXJsID0gdmFsdWUuc3Vic3RyaW5nKHZhbHVlLmluZGV4T2YoJzo6JykgKyAyLCB2YWx1ZS5sZW5ndGgpICsgJy8xP2xhbmc9JyArIGxhbmdcbiAgICBpZiAod2luZG93LnNlbGYgPT09IHdpbmRvdy50b3ApIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKVxuICAgIH1cbiAgfSlcblxufVxuXG5WaWV3ZXJBcHAoeyBPcGVuU2VhZHJhZ29uOiB3aW5kb3cuT3BlblNlYWRyYWdvbn0pXG4iXSwibmFtZXMiOlsiZGVjcmVhc2UiLCJwcm9wcyIsInNlcXVlbmNlX2N1cnJlbnQiLCJOdW1iZXIiLCJkYXRhc2V0Iiwic2VxdWVuY2UiLCJ0b1N0cmluZyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInZhbHVlIiwiaW5jcmVhc2UiLCJzZXF1ZW5jZV9jb3VudCIsInNlcXVlbmNlQ291bnQiLCJ0aWxlcyIsInNlcW1hcCIsImN1cnJlbnQiLCJzZXF1ZW5jZXMiLCJtYXAiLCJ4IiwidGlsZVNvdXJjZSIsInNlcnZpY2UiLCJ0eXBlIiwiaWRlbnRpZmllciIsInRvZ2dsZXZpZXciLCJfc2VxbWFwIiwiY29uc29sZSIsImxvZyIsInZpZXciLCJmaW5kIiwiZSIsImNvdW50IiwiXyIsIm1heCIsInRleHRDb250ZW50IiwiY2hhbmdlIiwidG8iLCJkZWxlZ2F0ZSIsInNlbGVjdG9yIiwiZXZlbnRUeXBlIiwiY2hpbGRTZWxlY3RvciIsImV2ZW50SGFuZGxlciIsImVsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnRPbkVsZW1lbnQiLCJ0YXJnZXQiLCJtYXRjaGVzIiwiaGlkZSIsImZvckVhY2giLCJlbG0iLCJzdHlsZSIsImRpc3BsYXkiLCJ2aXNpYmlsaXR5IiwiaGlkZGVuIiwiaGVpZ2h0Iiwic2luZ2xlcGFnZSIsIkFycmF5IiwiZmlsbCIsImluZGV4IiwicHVzaCIsImxlbmd0aCIsImRvdWJsZXBhZ2UiLCJzZXEiLCJNYXRoIiwiY2VpbCIsInNoaWZ0IiwicG9wIiwic2hvdyIsImdldCIsIlZpZXdlckFwcCIsIlkiLCJvbl9idXR0b25fY2xpY2siLCJvbl9wYWdpbmdfY2xpY2siLCJmdWxsc2NyZWVuX29uIiwiZnVsbHNjcmVlbl9vZmYiLCJsb2FkX3NlcXVlbmNlIiwib25fYnV0dG9uX21ldGFkYXRhX29uIiwib25fYnV0dG9uX21ldGFkYXRhX29mZiIsInRpbGVzX2xvYWRpbmciLCJ1cGRhdGVfbG9hZGluZ19pbmRpY2F0b3IiLCJhZGRfaXRlbV9oYW5kbGVyIiwiYXJlX2FsbF9mdWxseV9sb2FkZWQiLCJvbl9oaWRlX3RodW1ibmFpbHNfdmlldyIsIm9uX29wZW5fdGh1bWJuYWlsc192aWV3Iiwib25UaHVtYm5haWxzQ2xpY2siLCJzbGlkZV92YWx1ZV9jaGFuZ2UiLCJldmVudCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsIm9wZXJhdGlvbiIsImN1cnJlbnRUYXJnZXQiLCJwcmV2ZW50RGVmYXVsdCIsIm5vZGVzIiwiaHRtbCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImJ1dHRvblRodW1ibmFpbHMiLCJjb250YWlucyIsImFkZCIsInVyaSIsIm9zZCIsInN0YXRlIiwidGh1bWJuYWlscyIsIndpZHRoIiwiY29udHJvbFpvb21PdXQiLCJjb250cm9sWm9vbUluIiwidG9nZ2xlUGFnZSIsIm5leHQiLCJpdGVtIiwicHJldmlvdXMiLCJwYXJzZUludCIsInRoZW4iLCJyZXNwb25zZSIsInN0YXR1cyIsInBhcnNlciIsIkRPTVBhcnNlciIsImRvYyIsInBhcnNlRnJvbVN0cmluZyIsImRhdGEiLCJhcHBlbmRDaGlsZCIsImVycm9yIiwiVmlld2VyIiwid29ybGQiLCJnZXRJdGVtQ291bnQiLCJpIiwidGlsZWRJbWFnZSIsImdldEl0ZW1BdCIsImdldEZ1bGx5TG9hZGVkIiwidmlld3BvcnQiLCJzZXRSb3RhdGlvbiIsImFkZEhhbmRsZXIiLCJuZXdGdWxseUxvYWRlZCIsImlzRnVsbHlMb2FkZWQiLCJib2R5Iiwid2luZG93IiwidG9wIiwicG9zdE1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZmlyZSIsIm1lc3NhZ2UiLCJzZXRUaW1lb3V0IiwiYnV0dG9uIiwiY2xvc2VzdCIsIml0ZW1zIiwiY29uZmlnIiwiaWQiLCJ0aXRsZSIsInRpbGVTb3VyY2VzIiwibG9hZGluZ01zZyIsImpvaW4iLCJvcGVuIiwiZXhpdEZ1bGxzY3JlZW4iLCJtc0V4aXRGdWxsc2NyZWVuIiwibW96Q2FuY2VsRnVsbFNjcmVlbiIsIndlYmtpdENhbmNlbEZ1bGxTY3JlZW4iLCJkb2NFbG0iLCJkb2N1bWVudEVsZW1lbnQiLCJyZXF1ZXN0RnVsbHNjcmVlbiIsIm1zUmVxdWVzdEZ1bGxzY3JlZW4iLCJtb3pSZXF1ZXN0RnVsbFNjcmVlbiIsIndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIiwiY3VycmVudF90YXJnZXQiLCJldmVudF9wcmVmaXgiLCJldmVudF9pZCIsImJ1dHRvbk1ldGFkYXRhIiwicm90YXRlIiwicGFnZW1ldGEiLCJnZXRFbGVtZW50QnlJZCIsInRvZ2dsZUxhbmd1YWdlIiwic2xpZGVyIiwic2xpZGVyX3ZhbHVlIiwicGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwibG9jYXRpb24iLCJzZWFyY2giLCJyZXFfc2VxdWVuY2UiLCJPcGVuU2VhZHJhZ29uIiwicHJlc2VydmVWaWV3cG9ydCIsInNob3dOYXZpZ2F0aW9uQ29udHJvbCIsInNob3dab29tQ29udHJvbCIsInNob3dIb21lQ29udHJvbCIsInNob3dGdWxsUGFnZUNvbnRyb2wiLCJ2aXNpYmlsaXR5UmF0aW8iLCJtaW5ab29tTGV2ZWwiLCJkZWZhdWx0Wm9vbUxldmVsIiwic2VxdWVuY2VNb2RlIiwiYWN0dWFsWm9vbSIsImdldFpvb20iLCJtYXhab29tIiwiZ2V0TWF4Wm9vbSIsIm1pblpvb20iLCJnZXRNaW5ab29tIiwib25zdWJtaXQiLCJvbmNsaWNrIiwiem9vbVRvIiwiem9vbSIsImRlZ3JlZXMiLCJwYW5lIiwibWFpbiIsImRpciIsImlubmVySFRNTCIsIm5vZGUiLCJsYW5nIiwidXJsIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInNlbGYiLCJhc3NpZ24iXSwic291cmNlUm9vdCI6IiJ9