"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[58085],{

/***/ 30675:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ react_react_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
;// ../node_modules/tiktok-video-element/dist/tiktok-video-element.js
const EMBED_BASE = "https://www.tiktok.com/player/v1";
const MATCH_SRC = /tiktok\.com\/(?:player\/v1\/|share\/video\/|@[^/]+\/video\/)([0-9]+)/;
const PlayerState = { INIT: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 };
const EventMap = {
  [PlayerState.INIT]: "emptied",
  [PlayerState.PAUSED]: "pause",
  [PlayerState.ENDED]: "ended",
  [PlayerState.PLAYING]: "play",
  [PlayerState.BUFFERING]: "waiting"
};
function getTemplateHTML(attrs, props = {}) {
  const iframeAttrs = {
    src: serializeIframeUrl(attrs, props),
    frameborder: 0,
    width: "100%",
    height: "100%",
    allow: "accelerometer; autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture"
  };
  if (props.config) {
    iframeAttrs["data-config"] = JSON.stringify(props.config);
  }
  return (
    /*html*/
    `
    <style>
      :host {
        display:inline-block;
        min-width: 300px;
        min-height: 150px;
        position: relative;
      }
      iframe {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        border:0;
      }
    </style>
    <iframe ${serializeAttributes(iframeAttrs)} title="TikTok video"></iframe>
  `
  );
}
function serializeIframeUrl(attrs, props = {}) {
  if (!attrs.src) return;
  const matches = attrs.src.match(MATCH_SRC);
  const srcId = matches && matches[1];
  const params = {
    controls: attrs.controls === "" ? null : 0,
    autoplay: attrs.autoplay,
    muted: attrs.muted,
    loop: attrs.loop,
    rel: 0,
    ...props.config
  };
  return `${EMBED_BASE}/${srcId}?${serialize(params)}`;
}
class TikTokVideoElement extends (globalThis.HTMLElement ?? class {
}) {
  static getTemplateHTML = getTemplateHTML;
  static shadowRootOptions = { mode: "open" };
  static get observedAttributes() {
    return ["src", "controls", "loop", "autoplay", "muted"];
  }
  loadComplete = new PublicPromise();
  #loadRequested;
  #hasLoaded;
  #muted = false;
  #currentTime = 0;
  #paused = true;
  #config = null;
  #volume = 100;
  #duration = 0;
  #iframe;
  constructor() {
    super();
    this.#upgradeProperty("config");
  }
  async load() {
    if (this.#loadRequested) return;
    if (!this.shadowRoot) {
      this.attachShadow(TikTokVideoElement.shadowRootOptions);
    }
    const isFirstLoad = !this.#hasLoaded;
    if (this.#hasLoaded) {
      this.loadComplete = new PublicPromise();
    }
    this.#hasLoaded = true;
    await (this.#loadRequested = Promise.resolve());
    this.#loadRequested = null;
    this.#currentTime = 0;
    this.#muted = false;
    this.#paused = true;
    if (!this.src) {
      this.shadowRoot.innerHTML = "";
      globalThis.removeEventListener("message", this.#onMessage);
      return;
    }
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
  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attrName) {
      case "muted": {
        await this.loadComplete;
        this.muted = newValue != null;
        break;
      }
      case "autoplay":
      case "controls":
      case "loop":
      case "src": {
        this.load();
        return;
      }
    }
  }
  get config() {
    return this.#config;
  }
  set config(value) {
    this.#config = value;
  }
  #onMessage = (event) => {
    var _a;
    if (event.source !== ((_a = this.#iframe) == null ? void 0 : _a.contentWindow)) return;
    const msg = event.data;
    if (!(msg == null ? void 0 : msg["x-tiktok-player"])) return;
    switch (msg.type) {
      case "onPlayerReady":
        this.loadComplete.resolve();
        break;
      case "onStateChange": {
        this.#paused = [PlayerState.INIT, PlayerState.PAUSED, PlayerState.ENDED].includes(msg.value);
        const eventType = EventMap[msg.value];
        if (eventType) this.dispatchEvent(new Event(eventType));
        break;
      }
      case "onCurrentTime":
        this.#currentTime = msg.value.currentTime;
        this.#duration = msg.value.duration;
        this.dispatchEvent(new Event("durationchange"));
        this.dispatchEvent(new Event("timeupdate"));
        break;
      case "onVolumeChange":
        this.#volume = msg.value;
        this.dispatchEvent(new Event("volumechange"));
        break;
      case "onMute":
        this.#muted = msg.value ? true : false;
        this.#volume = msg.value ? 0 : this.#volume;
        this.dispatchEvent(new Event("volumechange"));
        break;
      case "onError":
        this.dispatchEvent(new Event("error"));
        break;
      default:
        console.warn("Unhandled TikTok player message:", msg);
        break;
    }
  };
  #post(type, value) {
    var _a;
    if (!((_a = this.#iframe) == null ? void 0 : _a.contentWindow)) return;
    const message = { "x-tiktok-player": true, type, ...value !== void 0 ? { value } : {} };
    this.#iframe.contentWindow.postMessage(message, "*");
  }
  async play() {
    await this.loadComplete;
    this.#post("play");
  }
  async pause() {
    await this.loadComplete;
    this.#post("pause");
  }
  async #seekTo(sec) {
    await this.loadComplete;
    this.#post("seekTo", Number(sec));
  }
  async #mute() {
    await this.loadComplete;
    this.#post("mute");
  }
  async #unMute() {
    await this.loadComplete;
    this.#post("unMute");
  }
  get volume() {
    return this.#volume / 100;
  }
  set volume(_val) {
    console.warn("Volume control is not supported for TikTok videos.");
  }
  get currentTime() {
    return this.#currentTime;
  }
  set currentTime(val) {
    this.#seekTo(val);
  }
  get muted() {
    return this.#muted;
  }
  set muted(val) {
    this.#muted = val;
    val ? this.#mute() : this.#unMute();
  }
  get defaultMuted() {
    return this.hasAttribute("muted");
  }
  set defaultMuted(val) {
    this.toggleAttribute("muted", !!val);
  }
  get paused() {
    return this.#paused;
  }
  get duration() {
    return this.#duration;
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(val) {
    this.setAttribute("src", val ?? "");
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
function namedNodeMapToObject(namedNodeMap) {
  let obj = {};
  for (let attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
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
function serialize(props) {
  return String(new URLSearchParams(boolToBinary(props)));
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
if (globalThis.customElements && !globalThis.customElements.get("tiktok-video")) {
  globalThis.customElements.define("tiktok-video", TikTokVideoElement);
}
var tiktok_video_element_default = TikTokVideoElement;


;// ../node_modules/tiktok-video-element/dist/react.js
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
  tagName: "tiktok-video",
  elementClass: tiktok_video_element_default,
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