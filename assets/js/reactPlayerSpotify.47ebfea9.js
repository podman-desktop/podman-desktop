"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[32771],{

/***/ 13408:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ react_react_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
;// ../node_modules/spotify-audio-element/dist/spotify-audio-element.js
const EMBED_BASE = "https://open.spotify.com";
const MATCH_SRC = /open\.spotify\.com\/(\w+)\/(\w+)/i;
const API_URL = "https://open.spotify.com/embed-podcast/iframe-api/v1";
const API_GLOBAL = "SpotifyIframeApi";
const API_GLOBAL_READY = "onSpotifyIframeApiReady";
function getTemplateHTML(attrs, props = {}) {
  const iframeAttrs = {
    src: serializeIframeUrl(attrs, props),
    scrolling: "no",
    frameborder: 0,
    width: "100%",
    height: "100%",
    allow: "accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
  };
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-block;
        min-width: 160px;
        min-height: 80px;
        position: relative;
      }
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      :host(:not([controls])) {
        display: none !important;
      }
    </style>
    <iframe${serializeAttributes(iframeAttrs)}></iframe>
  `
  );
}
function serializeIframeUrl(attrs, props) {
  var _a, _b, _c;
  if (!attrs.src) return;
  const matches = attrs.src.match(MATCH_SRC);
  const type = matches && matches[1];
  const metaId = matches && matches[2];
  const params = {
    t: (_a = props.config) == null ? void 0 : _a.startAt,
    theme: ((_b = props.config) == null ? void 0 : _b.theme) === "dark" ? "0" : null
  };
  const videoPath = ((_c = props.config) == null ? void 0 : _c.preferVideo) ? "/video" : "";
  return `${EMBED_BASE}/embed/${type}/${metaId}${videoPath}?${serialize(params)}`;
}
class SpotifyAudioElement extends (globalThis.HTMLElement ?? class {
}) {
  static getTemplateHTML = getTemplateHTML;
  static shadowRootOptions = { mode: "open" };
  static observedAttributes = [
    "controls",
    "loop",
    "src"
  ];
  loadComplete = new PublicPromise();
  #loadRequested;
  #hasLoaded;
  #isInit;
  #isWaiting = false;
  #closeToEnded = false;
  #paused = true;
  #currentTime = 0;
  #duration = NaN;
  #seeking = false;
  #config = null;
  constructor() {
    super();
    this.#upgradeProperty("config");
  }
  async load() {
    var _a, _b, _c;
    if (this.#loadRequested) return;
    if (this.#hasLoaded) this.loadComplete = new PublicPromise();
    this.#hasLoaded = true;
    await (this.#loadRequested = Promise.resolve());
    this.#loadRequested = null;
    this.#isWaiting = false;
    this.#closeToEnded = false;
    this.#currentTime = 0;
    this.#duration = NaN;
    this.#seeking = false;
    this.dispatchEvent(new Event("emptied"));
    let oldApi = this.api;
    this.api = null;
    if (!this.src) {
      return;
    }
    this.dispatchEvent(new Event("loadstart"));
    const options = {
      t: (_a = this.config) == null ? void 0 : _a.startAt,
      theme: ((_b = this.config) == null ? void 0 : _b.theme) === "dark" ? "0" : null,
      preferVideo: (_c = this.config) == null ? void 0 : _c.preferVideo
    };
    if (this.#isInit) {
      this.api = oldApi;
      this.api.iframeElement.src = serializeIframeUrl(namedNodeMapToObject(this.attributes), this);
    } else {
      this.#isInit = true;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = getTemplateHTML(namedNodeMapToObject(this.attributes), this);
      }
      let iframe = this.shadowRoot.querySelector("iframe");
      const Spotify = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
      this.api = await new Promise((resolve) => Spotify.createController(iframe, options, resolve));
      this.api.iframeElement = iframe;
      this.api.addListener("ready", () => {
        this.dispatchEvent(new Event("loadedmetadata"));
        this.dispatchEvent(new Event("durationchange"));
        this.dispatchEvent(new Event("volumechange"));
      });
      this.api.addListener("playback_update", (event) => {
        if (this.#closeToEnded && this.#paused && (event.data.isBuffering || !event.data.isPaused)) {
          this.#closeToEnded = false;
          this.currentTime = 1;
          return;
        }
        if (event.data.duration / 1e3 !== this.#duration) {
          this.#closeToEnded = false;
          this.#duration = event.data.duration / 1e3;
          this.dispatchEvent(new Event("durationchange"));
        }
        if (event.data.position / 1e3 !== this.#currentTime) {
          this.#seeking = false;
          this.#closeToEnded = false;
          this.#currentTime = event.data.position / 1e3;
          this.dispatchEvent(new Event("timeupdate"));
        }
        if (!this.#isWaiting && !this.#paused && event.data.isPaused) {
          this.#paused = true;
          this.dispatchEvent(new Event("pause"));
          return;
        }
        if (this.#paused && (event.data.isBuffering || !event.data.isPaused)) {
          this.#paused = false;
          this.dispatchEvent(new Event("play"));
          this.#isWaiting = event.data.isBuffering;
          if (this.#isWaiting) {
            this.dispatchEvent(new Event("waiting"));
          } else {
            this.dispatchEvent(new Event("playing"));
          }
          return;
        }
        if (this.#isWaiting && !event.data.isPaused) {
          this.#isWaiting = false;
          this.dispatchEvent(new Event("playing"));
          return;
        }
        if (!this.paused && !this.seeking && !this.#closeToEnded && Math.ceil(this.currentTime) >= this.duration) {
          this.#closeToEnded = true;
          if (this.loop) {
            this.currentTime = 1;
            return;
          }
          if (!this.continuous) {
            this.pause();
            this.dispatchEvent(new Event("ended"));
          }
          return;
        }
      });
    }
    this.loadComplete.resolve();
    await this.loadComplete;
  }
  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attrName) {
      case "src": {
        this.load();
        return;
      }
    }
  }
  async play() {
    var _a;
    this.#paused = false;
    this.#isWaiting = true;
    this.dispatchEvent(new Event("play"));
    await this.loadComplete;
    return (_a = this.api) == null ? void 0 : _a.resume();
  }
  async pause() {
    var _a;
    await this.loadComplete;
    return (_a = this.api) == null ? void 0 : _a.pause();
  }
  get config() {
    return this.#config;
  }
  set config(value) {
    this.#config = value;
  }
  get paused() {
    return this.#paused ?? true;
  }
  get muted() {
    return false;
  }
  set muted(val) {
  }
  get volume() {
    return 1;
  }
  set volume(val) {
  }
  get ended() {
    return Math.ceil(this.currentTime) >= this.duration;
  }
  get seeking() {
    return this.#seeking;
  }
  get loop() {
    return this.hasAttribute("loop");
  }
  set loop(val) {
    if (this.loop == val) return;
    this.toggleAttribute("loop", Boolean(val));
  }
  get currentTime() {
    return this.#currentTime;
  }
  set currentTime(val) {
    if (this.currentTime == val) return;
    this.#seeking = true;
    let oldTime = this.#currentTime;
    this.#currentTime = val;
    this.dispatchEvent(new Event("timeupdate"));
    this.#currentTime = oldTime;
    this.loadComplete.then(() => {
      var _a;
      (_a = this.api) == null ? void 0 : _a.seek(val);
    });
  }
  get duration() {
    return this.#duration;
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(val) {
    this.setAttribute("src", `${val}`);
  }
  // This is a pattern to update property values that are set before
  // the custom element is upgraded.
  // https://web.dev/custom-elements-best-practices/#make-properties-lazy
  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}
function serializeAttributes(attrs) {
  let html = "";
  for (const key in attrs) {
    const value = attrs[key];
    if (value === "") html += ` ${key}`;
    else html += ` ${key}="${value}"`;
  }
  return html;
}
function serialize(props) {
  return String(new URLSearchParams(boolToBinary(props)));
}
function boolToBinary(props) {
  let p = {};
  for (let key in props) {
    let val = props[key];
    if (val === true || val === "") p[key] = 1;
    else if (val === false) p[key] = 0;
    else if (val != null) p[key] = val;
  }
  return p;
}
function namedNodeMapToObject(namedNodeMap) {
  let obj = {};
  for (let attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}
const loadScriptCache = {};
async function loadScript(src, globalName, readyFnName) {
  if (loadScriptCache[src]) return loadScriptCache[src];
  if (globalName && self[globalName]) {
    return Promise.resolve(self[globalName]);
  }
  return loadScriptCache[src] = new Promise(function(resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    const ready = (api) => resolve(api);
    if (readyFnName) self[readyFnName] = ready;
    script.onload = () => !readyFnName && ready();
    script.onerror = reject;
    document.head.append(script);
  });
}
class PublicPromise extends Promise {
  constructor(executor = () => {
  }) {
    let res, rej;
    super((resolve, reject) => {
      executor(resolve, reject);
      res = resolve;
      rej = reject;
    });
    this.resolve = res;
    this.reject = rej;
  }
}
if (globalThis.customElements && !globalThis.customElements.get("spotify-audio")) {
  globalThis.customElements.define("spotify-audio", SpotifyAudioElement);
}
var spotify_audio_element_default = SpotifyAudioElement;


;// ../node_modules/spotify-audio-element/dist/react.js
"use client";

// dist/react.ts



// ../../node_modules/ce-la-react/dist/ce-la-react.js
var reservedReactProps = /* @__PURE__ */ new Set([
  "style",
  "children",
  "ref",
  "key",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "dangerouslySetInnerHTML"
]);
var reactPropToAttrNameMap = {
  className: "class",
  htmlFor: "for"
};
function defaultToAttributeName(propName) {
  return propName.toLowerCase();
}
function defaultToAttributeValue(propValue) {
  if (typeof propValue === "boolean") return propValue ? "" : void 0;
  if (typeof propValue === "function") return void 0;
  if (typeof propValue === "object" && propValue !== null) return void 0;
  return propValue;
}
function createComponent({
  react: React2,
  tagName,
  elementClass,
  events,
  displayName,
  defaultProps,
  toAttributeName = defaultToAttributeName,
  toAttributeValue = defaultToAttributeValue
}) {
  const IS_REACT_19_OR_NEWER = Number.parseInt(React2.version) >= 19;
  const ReactComponent = React2.forwardRef((props, ref) => {
    var _a, _b;
    const elementRef = React2.useRef(null);
    const prevElemPropsRef = React2.useRef(/* @__PURE__ */ new Map());
    const eventProps = {};
    const attrs = {};
    const reactProps = {};
    const elementProps = {};
    for (const [k, v] of Object.entries(props)) {
      if (reservedReactProps.has(k)) {
        reactProps[k] = v;
        continue;
      }
      const attrName = toAttributeName(reactPropToAttrNameMap[k] ?? k);
      if (elementClass.prototype && k in elementClass.prototype && !(k in (((_a = globalThis.HTMLElement) == null ? void 0 : _a.prototype) ?? {})) && !((_b = elementClass.observedAttributes) == null ? void 0 : _b.some((attr) => attr === attrName))) {
        elementProps[k] = v;
        continue;
      }
      if (k.startsWith("on")) {
        eventProps[k] = v;
        continue;
      }
      const attrValue = toAttributeValue(v);
      if (attrName && attrValue != null) {
        attrs[attrName] = String(attrValue);
        if (!IS_REACT_19_OR_NEWER) {
          reactProps[attrName] = attrValue;
        }
      }
      if (attrName && IS_REACT_19_OR_NEWER) {
        const attrValueFromDefault = defaultToAttributeValue(v);
        if (attrValue !== attrValueFromDefault) {
          reactProps[attrName] = attrValue;
        } else {
          reactProps[attrName] = v;
        }
      }
    }
    if (typeof window !== "undefined") {
      for (const propName in eventProps) {
        const callback = eventProps[propName];
        const useCapture = propName.endsWith("Capture");
        const eventName = ((events == null ? void 0 : events[propName]) ?? propName.slice(2).toLowerCase()).slice(
          0,
          useCapture ? -7 : void 0
        );
        React2.useLayoutEffect(() => {
          const eventTarget = elementRef == null ? void 0 : elementRef.current;
          if (!eventTarget || typeof callback !== "function") return;
          eventTarget.addEventListener(eventName, callback, useCapture);
          return () => {
            eventTarget.removeEventListener(eventName, callback, useCapture);
          };
        }, [elementRef == null ? void 0 : elementRef.current, callback]);
      }
      React2.useLayoutEffect(() => {
        if (elementRef.current === null) return;
        const newElemProps = /* @__PURE__ */ new Map();
        for (const key in elementProps) {
          setProperty(elementRef.current, key, elementProps[key]);
          prevElemPropsRef.current.delete(key);
          newElemProps.set(key, elementProps[key]);
        }
        for (const [key, _value] of prevElemPropsRef.current) {
          setProperty(elementRef.current, key, void 0);
        }
        prevElemPropsRef.current = newElemProps;
      });
    }
    if (typeof window === "undefined" && (elementClass == null ? void 0 : elementClass.getTemplateHTML) && (elementClass == null ? void 0 : elementClass.shadowRootOptions)) {
      const { mode, delegatesFocus } = elementClass.shadowRootOptions;
      const templateShadowRoot = React2.createElement("template", {
        shadowrootmode: mode,
        shadowrootdelegatesfocus: delegatesFocus,
        dangerouslySetInnerHTML: {
          __html: elementClass.getTemplateHTML(attrs, props)
        }
      });
      reactProps.children = [templateShadowRoot, reactProps.children];
    }
    return React2.createElement(tagName, {
      ...defaultProps,
      ...reactProps,
      ref: React2.useCallback(
        (node) => {
          elementRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref !== null) {
            ref.current = node;
          }
        },
        [ref]
      )
    });
  });
  ReactComponent.displayName = displayName ?? elementClass.name;
  return ReactComponent;
}
function setProperty(node, name, value) {
  var _a;
  node[name] = value;
  if (value == null && name in (((_a = globalThis.HTMLElement) == null ? void 0 : _a.prototype) ?? {})) {
    node.removeAttribute(name);
  }
}

// dist/react.ts
var react_react_default = createComponent({
  react: react,
  tagName: "spotify-audio",
  elementClass: spotify_audio_element_default,
  toAttributeName(propName) {
    if (propName === "muted") return "";
    if (propName === "defaultMuted") return "muted";
    return defaultToAttributeName(propName);
  }
});

/*! Bundled license information:

ce-la-react/dist/ce-la-react.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *
   * Modified version of `@lit/react` for vanilla custom elements with support for SSR.
   *)
*/


/***/ })

}]);