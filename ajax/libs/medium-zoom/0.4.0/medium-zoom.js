/*
 * medium-zoom v0.4.0
 * Medium zoom on your images in vanilla JavaScript
 * Copyright 2018 Francois Chalifour
 * https://github.com/francoischalifour/medium-zoom
 * MIT License
 */
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.mediumZoom = factory();
})(this, function() {
  "use strict";
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  var SUPPORTED_FORMATS = [ "IMG" ];
  var KEY_ESC = 27;
  var KEY_Q = 81;
  var CANCEL_KEYS = [ KEY_ESC, KEY_Q ];
  var isSupported = function isSupported(img) {
    return SUPPORTED_FORMATS.indexOf(img.tagName) > -1;
  };
  var isScaled = function isScaled(img) {
    return img.naturalWidth !== img.width;
  };
  var isListOrCollection = function isListOrCollection(selector) {
    return NodeList.prototype.isPrototypeOf(selector) || HTMLCollection.prototype.isPrototypeOf(selector);
  };
  var isNode = function isNode(selector) {
    return selector && selector.nodeType === 1;
  };
  /**
 * Attaches a zoom effect on a selection of images.
 *
 * @param {(string|Element[])} selector The selector to target the images to attach the zoom to
 * @param {object} options The options of the zoom
 * @param {number} [options.margin=0] The space outside the zoomed image
 * @param {string} [options.background="#fff"] The color of the overlay
 * @param {number} [options.scrollOffset=48] The number of pixels to scroll to dismiss the zoom
 * @param {boolean} [options.metaClick=true] A boolean to enable the default action on meta click
 * @param {(string|Element|object)} [options.container] The element to render the zoom in or a viewport object
 * @param {(string|Element)} [options.template] The template element to show on zoom
 * @return The zoom object
 */  var mediumZoom = function mediumZoom(selector) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, _ref$margin = _ref.margin, margin = _ref$margin === undefined ? 0 : _ref$margin, _ref$background = _ref.background, background = _ref$background === undefined ? "#fff" : _ref$background, _ref$scrollOffset = _ref.scrollOffset, scrollOffset = _ref$scrollOffset === undefined ? 48 : _ref$scrollOffset, _ref$metaClick = _ref.metaClick, metaClick = _ref$metaClick === undefined ? true : _ref$metaClick, container = _ref.container, template = _ref.template;
    var selectImages = function selectImages(selector) {
      try {
        return Array.isArray(selector) ? selector.filter(isSupported) : isListOrCollection(selector) ? Array.apply(null, selector).filter(isSupported) : isNode(selector) ? [ selector ].filter(isSupported) : typeof selector === "string" ? Array.apply(null, document.querySelectorAll(selector)).filter(isSupported) : Array.apply(null, document.querySelectorAll(SUPPORTED_FORMATS.map(function(attr) {
          return attr.toLowerCase();
        }).join(","))).filter(isScaled);
      } catch (err) {
        throw new TypeError("The provided selector is invalid.\n" + "Expects a CSS selector, a Node element, a NodeList, an HTMLCollection or an array.\n" + "See: https://github.com/francoischalifour/medium-zoom");
      }
    };
    var createOverlay = function createOverlay(background) {
      var overlay = document.createElement("div");
      overlay.classList.add("medium-zoom-overlay");
      overlay.style.backgroundColor = background;
      return overlay;
    };
    var cloneTarget = function cloneTarget(template) {
      var _template$getBounding = template.getBoundingClientRect(), top = _template$getBounding.top, left = _template$getBounding.left, width = _template$getBounding.width, height = _template$getBounding.height;
      var clone = template.cloneNode();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
      clone.removeAttribute("id");
      clone.style.position = "absolute";
      clone.style.top = top + scrollTop + "px";
      clone.style.left = left + scrollLeft + "px";
      clone.style.width = width + "px";
      clone.style.height = height + "px";
      clone.style.transform = "";
      return clone;
    };
    var createCustomEvent = function createCustomEvent(event) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      if (typeof window.CustomEvent === "function") {
        return new CustomEvent(event, params);
      } else {
        var customEvent = document.createEvent("CustomEvent");
        customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return customEvent;
      }
    };
    var zoom = function zoom() {
      if (!target.original) return;
      target.original.dispatchEvent(createCustomEvent("show"));
      scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      isAnimating = true;
      target.zoomed = cloneTarget(target.original);
      document.body.appendChild(overlay);
      if (options.template) {
        var _template = isNode(options.template) ? options.template : document.querySelector(options.template);
        target.template = document.createElement("div");
        target.template.appendChild(_template.content.cloneNode(true));
        document.body.appendChild(target.template);
      }
      document.body.appendChild(target.zoomed);
      requestAnimationFrame(function() {
        document.body.classList.add("medium-zoom--open");
      });
      target.original.style.visibility = "hidden";
      target.zoomed.classList.add("medium-zoom-image--open");
      target.zoomed.addEventListener("click", zoomOut);
      target.zoomed.addEventListener("transitionend", onZoomEnd);
      if (target.original.getAttribute("data-zoom-target")) {
        target.zoomedHd = target.zoomed.cloneNode();
        target.zoomedHd.src = target.zoomed.getAttribute("data-zoom-target");
        target.zoomedHd.onerror = function() {
          clearInterval(getZoomTargetSize);
          console.error("Unable to reach the zoom image target " + target.zoomedHd.src);
          target.zoomedHd = null;
          animateTarget();
        };
        // We need to access the natural size of the full HD
        // target as fast as possible to compute the animation.
                var getZoomTargetSize = setInterval(function() {
          if (target.zoomedHd.naturalWidth) {
            clearInterval(getZoomTargetSize);
            target.zoomedHd.classList.add("medium-zoom-image--open");
            target.zoomedHd.addEventListener("click", zoomOut);
            document.body.appendChild(target.zoomedHd);
            animateTarget();
          }
        }, 10);
      } else {
        animateTarget();
      }
    };
    var zoomOut = function zoomOut() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var doZoomOut = function doZoomOut() {
        if (isAnimating || !target.original) return;
        target.original.dispatchEvent(createCustomEvent("hide"));
        isAnimating = true;
        document.body.classList.remove("medium-zoom--open");
        target.zoomed.style.transform = "";
        if (target.zoomedHd) {
          target.zoomedHd.style.transform = "";
          target.zoomedHd.removeEventListener("click", zoomOut);
        }
        // Fade out the template so it's not too abrupt
                if (target.template) {
          target.template.style.transition = "opacity 150ms";
          target.template.style.opacity = 0;
        }
        target.zoomed.removeEventListener("click", zoomOut);
        target.zoomed.addEventListener("transitionend", onZoomOutEnd);
      };
      timeout > 0 ? setTimeout(doZoomOut, timeout) : doZoomOut();
    };
    var triggerZoom = function triggerZoom(event) {
      if (event && event.target) {
        // The zoom was triggered manually via a click
        target.original = event.target;
        zoom();
      } else if (!target.original) {
        // The zoom was triggered programmatically, select the first image in the list
        target.original = images[0];
        zoom();
      } else {
        zoomOut();
      }
    };
    var update = function update() {
      var newOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      newOptions.background && (overlay.style.backgroundColor = newOptions.background);
      if (newOptions.container && newOptions.container instanceof Object) {
        newOptions.container = _extends({}, options.container, newOptions.container);
      }
      return _extends(options, newOptions);
    };
    var addEventListeners = function addEventListeners(type, listener) {
      images.forEach(function(image) {
        image.addEventListener(type, listener);
      });
    };
    var detach = function detach() {
      target.zoomed && zoomOut();
      var event = createCustomEvent("detach");
      images.forEach(function(image) {
        image.classList.remove("medium-zoom-image");
        image.removeEventListener("click", onClick);
        image.dispatchEvent(event);
      });
      images.splice(0, images.length);
      overlay.removeEventListener("click", zoomOut);
      document.removeEventListener("scroll", onScroll);
      document.removeEventListener("keyup", onDismiss);
      window.removeEventListener("resize", zoomOut);
    };
    var onClick = function onClick(event) {
      if (event.metaKey || event.ctrlKey) {
        if (options.metaClick) {
          return window.open(event.target.getAttribute("data-original") || event.target.parentNode.href || event.target.src, "_blank");
        }
      }
      event.preventDefault();
      triggerZoom(event);
    };
    var onZoomEnd = function onZoomEnd() {
      isAnimating = false;
      target.zoomed.removeEventListener("transitionend", onZoomEnd);
      target.original.dispatchEvent(createCustomEvent("shown"));
    };
    var onZoomOutEnd = function onZoomOutEnd() {
      if (!target.original) return;
      target.original.style.visibility = "";
      document.body.removeChild(target.zoomed);
      target.zoomedHd && document.body.removeChild(target.zoomedHd);
      document.body.removeChild(overlay);
      target.zoomed.classList.remove("medium-zoom-image--open");
      target.template && document.body.removeChild(target.template);
      isAnimating = false;
      target.zoomed.removeEventListener("transitionend", onZoomOutEnd);
      target.original.dispatchEvent(createCustomEvent("hidden"));
      target.original = null;
      target.zoomed = null;
      target.zoomedHd = null;
      target.template = null;
    };
    var onScroll = function onScroll() {
      if (isAnimating || !target.original) return;
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (Math.abs(scrollTop - currentScroll) > options.scrollOffset) {
        zoomOut(150);
      }
    };
    var onDismiss = function onDismiss(event) {
      if (CANCEL_KEYS.indexOf(event.keyCode || event.which) > -1) {
        zoomOut();
      }
    };
    var animateTarget = function animateTarget() {
      if (!target.original) return;
      var container = {
        width: window.innerWidth,
        height: window.innerHeight,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
      var viewportWidth = void 0;
      var viewportHeight = void 0;
      if (options.container) {
        if (options.container instanceof Object) {
          // The container is given as an object with properties like width, height, left, top
          _extends(container, options.container);
          // We need to adjust custom options like container.right or container.bottom
                    viewportWidth = container.width - container.left - container.right - options.margin * 2;
          viewportHeight = container.height - container.top - container.bottom - options.margin * 2;
        } else {
          // The container is given as an element
          var zoomContainer = isNode(options.container) ? options.container : document.querySelector(options.container);
          var _zoomContainer$getBou = zoomContainer.getBoundingClientRect(), _width = _zoomContainer$getBou.width, _height = _zoomContainer$getBou.height, _left = _zoomContainer$getBou.left, _top = _zoomContainer$getBou.top;
          _extends(container, {
            width: _width,
            height: _height,
            left: _left,
            top: _top
          });
        }
      }
      viewportWidth = viewportWidth || container.width - options.margin * 2;
      viewportHeight = viewportHeight || container.height - options.margin * 2;
      var zoomTarget = target.zoomedHd || target.original;
      var _zoomTarget$naturalWi = zoomTarget.naturalWidth, naturalWidth = _zoomTarget$naturalWi === undefined ? viewportWidth : _zoomTarget$naturalWi, _zoomTarget$naturalHe = zoomTarget.naturalHeight, naturalHeight = _zoomTarget$naturalHe === undefined ? viewportHeight : _zoomTarget$naturalHe;
      var _zoomTarget$getBoundi = zoomTarget.getBoundingClientRect(), top = _zoomTarget$getBoundi.top, left = _zoomTarget$getBoundi.left, width = _zoomTarget$getBoundi.width, height = _zoomTarget$getBoundi.height;
      var scaleX = Math.min(naturalWidth, viewportWidth) / width;
      var scaleY = Math.min(naturalHeight, viewportHeight) / height;
      var scale = Math.min(scaleX, scaleY) || 1;
      var translateX = (-left + (viewportWidth - width) / 2 + options.margin + container.left) / scale;
      var translateY = (-top + (viewportHeight - height) / 2 + options.margin + container.top) / scale;
      var transform = "scale(" + scale + ") translate3d(" + translateX + "px, " + translateY + "px, 0)";
      target.zoomed.style.transform = transform;
      target.zoomedHd && (target.zoomedHd.style.transform = transform);
    };
    var options = {
      margin: margin,
      background: background,
      scrollOffset: scrollOffset,
      metaClick: metaClick,
      container: container,
      template: template
    };
    if (selector instanceof Object) {
      _extends(options, selector);
    }
    var images = selectImages(selector);
    var overlay = createOverlay(options.background);
    var target = {
      original: null,
      zoomed: null,
      zoomedHd: null,
      template: null
    };
    var scrollTop = 0;
    var isAnimating = false;
    images.forEach(function(elem) {
      elem.classList.add("medium-zoom-image");
      elem.addEventListener("click", onClick);
    });
    overlay.addEventListener("click", zoomOut);
    document.addEventListener("scroll", onScroll);
    document.addEventListener("keyup", onDismiss);
    window.addEventListener("resize", zoomOut);
    return {
      show: triggerZoom,
      hide: zoomOut,
      toggle: triggerZoom,
      update: update,
      addEventListeners: addEventListeners,
      detach: detach,
      images: images,
      options: options
    };
  };
  var mediumZoom$1 = Object.freeze({
    default: mediumZoom
  });
  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
    if (!css || typeof document === "undefined") {
      return;
    }
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    if (insertAt === "top") {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }
  var css = ".medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--open .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s}.medium-zoom-image--open{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}";
  styleInject(css);
  var mediumZoom$2 = mediumZoom$1 && mediumZoom || mediumZoom$1;
  var src = mediumZoom$2;
  return src;
});
