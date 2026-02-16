"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[12042],{

/***/ 44028
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ react_react_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
;// ../node_modules/twitch-video-element/dist/twitch-video-element.js
const EMBED_BASE = "https://player.twitch.tv";
const MATCH_VIDEO = /(?:www\.|go\.)?twitch\.tv\/(?:videos?\/|\?video=)(\d+)($|\?)/;
const MATCH_CHANNEL = /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/;
const PlaybackState = {
  IDLE: "Idle",
  READY: "Ready",
  BUFFERING: "Buffering",
  PLAYING: "Playing",
  ENDED: "Ended"
};
const PlayerCommands = {
  DISABLE_CAPTIONS: 0,
  ENABLE_CAPTIONS: 1,
  PAUSE: 2,
  PLAY: 3,
  SEEK: 4,
  SET_CHANNEL: 5,
  SET_CHANNEL_ID: 6,
  SET_COLLECTION: 7,
  SET_QUALITY: 8,
  SET_VIDEO: 9,
  SET_MUTED: 10,
  SET_VOLUME: 11
};
function getTemplateHTML(attrs, props = {}) {
  const iframeAttrs = {
    src: serializeIframeUrl(attrs, props),
    frameborder: "0",
    width: "100%",
    height: "100%",
    allow: "accelerometer; fullscreen; autoplay; encrypted-media; picture-in-picture;",
    sandbox: "allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox",
    scrolling: "no"
  };
  if (props.config) {
    iframeAttrs["data-config"] = JSON.stringify(props.config);
  }
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-block;
        min-width: 300px;
        min-height: 150px;
        position: relative;
      }
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      :host(:not([controls])) {
        pointer-events: none;
      }
    </style>
    <iframe${serializeAttributes(iframeAttrs)}></iframe>
  `
  );
}
function serializeIframeUrl(attrs, props) {
  var _a;
  if (!attrs.src) return;
  const videoMatch = attrs.src.match(MATCH_VIDEO);
  const channelMatch = attrs.src.match(MATCH_CHANNEL);
  const params = {
    parent: (_a = globalThis.location) == null ? void 0 : _a.hostname,
    // ?controls=true is enabled by default in the iframe
    controls: attrs.controls === "" ? null : false,
    autoplay: attrs.autoplay === "" ? null : false,
    muted: attrs.muted,
    preload: attrs.preload,
    ...props.config
  };
  if (videoMatch) {
    const videoId = videoMatch[1];
    return `${EMBED_BASE}/?video=v${videoId}&${serialize(params)}`;
  } else if (channelMatch) {
    const channel = channelMatch[1];
    return `${EMBED_BASE}/?channel=${channel}&${serialize(params)}`;
  }
  return "";
}
class TwitchVideoElement extends (globalThis.HTMLElement ?? class {
}) {
  static getTemplateHTML = getTemplateHTML;
  static shadowRootOptions = { mode: "open" };
  static observedAttributes = ["autoplay", "controls", "loop", "muted", "playsinline", "preload", "src"];
  loadComplete = new PublicPromise();
  #loadRequested;
  #hasLoaded;
  #iframe;
  #playerState = {};
  #currentTime = 0;
  #muted = false;
  #volume = 1;
  #paused = !this.autoplay;
  #seeking = false;
  #readyState = 0;
  #config = null;
  constructor() {
    super();
    this.#upgradeProperty("config");
  }
  get config() {
    return this.#config;
  }
  set config(value) {
    this.#config = value;
  }
  async load() {
    if (this.#loadRequested) return;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    const isFirstLoad = !this.#hasLoaded;
    if (this.#hasLoaded) {
      this.loadComplete = new PublicPromise();
    }
    this.#hasLoaded = true;
    await (this.#loadRequested = Promise.resolve());
    this.#loadRequested = null;
    this.#readyState = 0;
    this.dispatchEvent(new Event("emptied"));
    if (!this.src) {
      this.shadowRoot.innerHTML = "";
      globalThis.removeEventListener("message", this.#onMessage);
      return;
    }
    this.dispatchEvent(new Event("loadstart"));
    let iframe = this.shadowRoot.querySelector("iframe");
    const attrs = namedNodeMapToObject(this.attributes);
    if (isFirstLoad && iframe) {
      this.#config = JSON.parse(iframe.getAttribute("data-config") || "{}");
    }
    if (!(iframe == null ? void 0 : iframe.src) || iframe.src !== serializeIframeUrl(attrs, this)) {
      this.shadowRoot.innerHTML = getTemplateHTML(attrs, this);
      iframe = this.shadowRoot.querySelector("iframe");
    }
    this.#iframe = iframe;
    globalThis.addEventListener("message", this.#onMessage);
  }
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attrName) {
      case "src":
      case "controls": {
        this.load();
        break;
      }
    }
  }
  getVideoPlaybackQuality() {
    return this.#playerState.stats.videoStats;
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(value) {
    this.setAttribute("src", value);
  }
  get readyState() {
    return this.#readyState;
  }
  get seeking() {
    return this.#seeking;
  }
  get buffered() {
    var _a, _b;
    return createTimeRanges(0, ((_b = (_a = this.#playerState.stats) == null ? void 0 : _a.videoStats) == null ? void 0 : _b.bufferSize) ?? 0);
  }
  get paused() {
    if (!this.#playerState.playback) return this.#paused;
    return this.#playerState.playback === PlaybackState.IDLE;
  }
  get ended() {
    if (!this.#playerState.playback) return false;
    return this.#playerState.playback === PlaybackState.ENDED;
  }
  get duration() {
    return this.#playerState.duration ?? NaN;
  }
  get autoplay() {
    return this.hasAttribute("autoplay");
  }
  set autoplay(val) {
    if (this.autoplay == val) return;
    this.toggleAttribute("autoplay", Boolean(val));
  }
  get controls() {
    return this.hasAttribute("controls");
  }
  set controls(val) {
    if (this.controls == val) return;
    this.toggleAttribute("controls", Boolean(val));
  }
  get currentTime() {
    if (!this.#playerState.currentTime) return this.#currentTime;
    return this.#playerState.currentTime;
  }
  set currentTime(val) {
    this.#currentTime = val;
    this.loadComplete.then(() => {
      this.#sendCommand(PlayerCommands.SEEK, val);
    });
  }
  get defaultMuted() {
    return this.hasAttribute("muted");
  }
  set defaultMuted(val) {
    this.toggleAttribute("muted", Boolean(val));
  }
  get loop() {
    return this.hasAttribute("loop");
  }
  set loop(val) {
    this.toggleAttribute("loop", Boolean(val));
  }
  get muted() {
    return this.#muted;
  }
  set muted(val) {
    this.#muted = val;
    this.loadComplete.then(() => {
      this.#sendCommand(PlayerCommands.SET_MUTED, val);
    });
  }
  get volume() {
    return this.#volume;
  }
  set volume(val) {
    this.#volume = val;
    this.loadComplete.then(() => {
      this.#sendCommand(PlayerCommands.SET_VOLUME, val);
    });
  }
  get playsInline() {
    return this.hasAttribute("playsinline");
  }
  set playsInline(val) {
    this.toggleAttribute("playsinline", Boolean(val));
  }
  play() {
    this.#paused = false;
    this.#sendCommand(PlayerCommands.PLAY);
  }
  pause() {
    this.#paused = true;
    this.#sendCommand(PlayerCommands.PAUSE);
  }
  #onMessage = async (event) => {
    var _a, _b, _c, _d;
    if (!this.#iframe.contentWindow) return;
    const { data, source } = event;
    const isFromEmbedWindow = source === this.#iframe.contentWindow;
    if (!isFromEmbedWindow) return;
    if (data.namespace === "twitch-embed") {
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (data.eventName === "ready") {
        this.dispatchEvent(new Event("loadcomplete"));
        this.loadComplete.resolve();
        this.#readyState = 1;
        this.dispatchEvent(new Event("loadedmetadata"));
      } else if (data.eventName === "seek") {
        this.#seeking = true;
        this.dispatchEvent(new Event("seeking"));
      } else if (data.eventName === "playing") {
        if (this.#seeking) {
          this.#seeking = false;
          this.dispatchEvent(new Event("seeked"));
        }
        this.#readyState = 3;
        this.dispatchEvent(new Event("playing"));
      } else {
        this.dispatchEvent(new Event(data.eventName));
      }
    } else if (data.namespace === "twitch-embed-player-proxy" && data.eventName === "UPDATE_STATE") {
      const oldDuration = this.#playerState.duration;
      const oldCurrentTime = this.#playerState.currentTime;
      const oldVolume = this.#playerState.volume;
      const oldMuted = this.#playerState.muted;
      const oldBuffered = (_b = (_a = this.#playerState.stats) == null ? void 0 : _a.videoStats) == null ? void 0 : _b.bufferSize;
      this.#playerState = { ...this.#playerState, ...data.params };
      if (oldDuration !== this.#playerState.duration) {
        this.dispatchEvent(new Event("durationchange"));
      }
      if (oldCurrentTime !== this.#playerState.currentTime) {
        this.dispatchEvent(new Event("timeupdate"));
      }
      if (oldVolume !== this.#playerState.volume || oldMuted !== this.#playerState.muted) {
        if (this.#playerState.volume !== void 0) {
          this.#volume = this.#playerState.volume;
        }
        if (this.#playerState.muted !== void 0) {
          this.#muted = this.#playerState.muted;
        }
        this.dispatchEvent(new Event("volumechange"));
      }
      if (oldBuffered !== ((_d = (_c = this.#playerState.stats) == null ? void 0 : _c.videoStats) == null ? void 0 : _d.bufferSize)) {
        this.dispatchEvent(new Event("progress"));
      }
    }
  };
  #sendCommand(command, params) {
    if (!this.#iframe.contentWindow) return;
    const message = {
      eventName: command,
      params,
      namespace: "twitch-embed-player-proxy"
    };
    this.#iframe.contentWindow.postMessage(message, EMBED_BASE);
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
function namedNodeMapToObject(namedNodeMap) {
  let obj = {};
  for (let attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}
function serializeAttributes(attrs) {
  let html = "";
  for (const key in attrs) {
    const value = attrs[key];
    if (value === "") html += ` ${escapeHtml(key)}`;
    else html += ` ${escapeHtml(key)}="${escapeHtml(`${value}`)}"`;
  }
  return html;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/`/g, "&#x60;");
}
function serialize(props) {
  return String(new URLSearchParams(filterParams(props)));
}
function filterParams(props) {
  let p = {};
  for (let key in props) {
    let val = props[key];
    if (val === true || val === "") p[key] = true;
    else if (val === false) p[key] = false;
    else if (val != null) p[key] = val;
  }
  return p;
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
function createTimeRanges(start, end) {
  if (Array.isArray(start)) {
    return createTimeRangesObj(start);
  } else if (start == null || end == null || start === 0 && end === 0) {
    return createTimeRangesObj([[0, 0]]);
  }
  return createTimeRangesObj([[start, end]]);
}
function createTimeRangesObj(ranges) {
  Object.defineProperties(ranges, {
    start: {
      value: (i) => ranges[i][0]
    },
    end: {
      value: (i) => ranges[i][1]
    }
  });
  return ranges;
}
if (globalThis.customElements && !globalThis.customElements.get("twitch-video")) {
  globalThis.customElements.define("twitch-video", TwitchVideoElement);
}
var twitch_video_element_default = TwitchVideoElement;


;// ../node_modules/twitch-video-element/dist/react.js
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
  tagName: "twitch-video",
  elementClass: twitch_video_element_default,
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


/***/ }

}]);