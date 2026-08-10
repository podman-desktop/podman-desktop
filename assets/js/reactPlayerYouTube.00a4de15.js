"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[18446],{

/***/ 2648
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ react_react_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
;// ../node_modules/youtube-video-element/dist/youtube-video-element.js
const EMBED_BASE = "https://www.youtube.com/embed";
const EMBED_BASE_NOCOOKIE = "https://www.youtube-nocookie.com/embed";
const API_URL = "https://www.youtube.com/iframe_api";
const API_GLOBAL = "YT";
const API_GLOBAL_READY = "onYouTubeIframeAPIReady";
const VIDEO_MATCH_SRC = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})/;
const PLAYLIST_MATCH_SRC = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/.*?[?&]list=)([\w_-]+)/;
function getTemplateHTML(attrs, props = {}) {
  var _a;
  const iframeAttrs = {
    src: serializeIframeUrl(attrs, props),
    frameborder: 0,
    width: "100%",
    height: "100%",
    allow: "accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
  };
  if ((_a = props.config) == null ? void 0 : _a.referrerpolicy) {
    iframeAttrs.referrerpolicy = props.config.referrerpolicy;
  }
  if (props.config) {
    iframeAttrs["data-config"] = JSON.stringify(props.config);
  }
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-block;
        line-height: 0;
        position: relative;
        min-width: 300px;
        min-height: 150px;
      }
      iframe {
        position: absolute;
        top: 0;
        left: 0;
      }
    </style>
    <iframe${serializeAttributes(iframeAttrs)}></iframe>
  `
  );
}
function serializeIframeUrl(attrs, props) {
  if (!attrs.src) return;
  const embedBase = attrs.src.includes("-nocookie") ? EMBED_BASE_NOCOOKIE : EMBED_BASE;
  const params = {
    // ?controls=true is enabled by default in the iframe
    controls: attrs.controls === "" ? null : 0,
    autoplay: attrs.autoplay,
    loop: attrs.loop,
    mute: attrs.muted,
    playsinline: attrs.playsinline,
    preload: attrs.preload ?? "metadata",
    // https://developers.google.com/youtube/player_parameters#Parameters
    // origin: globalThis.location?.origin,
    enablejsapi: 1,
    cc_load_policy: 1,
    showinfo: 0,
    rel: 0,
    iv_load_policy: 3,
    modestbranding: 1,
    ...props.config
  };
  if (VIDEO_MATCH_SRC.test(attrs.src)) {
    const matches2 = attrs.src.match(VIDEO_MATCH_SRC);
    const srcId = matches2 && matches2[1];
    return `${embedBase}/${srcId}?${serialize(params)}`;
  }
  const matches = attrs.src.match(PLAYLIST_MATCH_SRC);
  const playlistId = matches && matches[1];
  const extendedParams = {
    listType: "playlist",
    list: playlistId,
    ...params
  };
  return `${embedBase}?${serialize(extendedParams)}`;
}
class YoutubeVideoElement extends (globalThis.HTMLElement ?? class {
}) {
  static getTemplateHTML = getTemplateHTML;
  static shadowRootOptions = { mode: "open" };
  static observedAttributes = [
    "autoplay",
    "controls",
    "crossorigin",
    "loop",
    "muted",
    "playsinline",
    "poster",
    "preload",
    "src"
  ];
  loadComplete = new PublicPromise();
  #loadRequested;
  #hasLoaded;
  #readyState = 0;
  #seeking = false;
  #seekComplete;
  isLoaded = false;
  #error = null;
  #config = null;
  #textTracksVideo = null;
  #initialVolume = 1;
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
      this.isLoaded = false;
    }
    this.#hasLoaded = true;
    await (this.#loadRequested = Promise.resolve());
    this.#loadRequested = null;
    this.#readyState = 0;
    this.dispatchEvent(new Event("emptied"));
    let oldApi = this.api;
    this.api = null;
    if (!this.src) {
      oldApi == null ? void 0 : oldApi.destroy();
      return;
    }
    this.#textTracksVideo = document.createElement("video");
    this.textTracks = this.#textTracksVideo.textTracks;
    this.textTracks.addEventListener("change", () => {
      var _a;
      const active = Array.from(this.textTracks).find((t) => t.mode === "showing");
      (_a = this.api) == null ? void 0 : _a.setOption("captions", "track", active ? { languageCode: active.language } : {});
    });
    this.dispatchEvent(new Event("loadstart"));
    let iframe = this.shadowRoot.querySelector("iframe");
    let attrs = namedNodeMapToObject(this.attributes);
    if (isFirstLoad && iframe) {
      this.#config = JSON.parse(iframe.getAttribute("data-config") || "{}");
    }
    if (!(iframe == null ? void 0 : iframe.src) || iframe.src !== serializeIframeUrl(attrs, this)) {
      this.shadowRoot.innerHTML = getTemplateHTML(attrs, this);
      iframe = this.shadowRoot.querySelector("iframe");
    }
    const YT = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
    this.api = new YT.Player(iframe, {
      events: {
        onReady: () => {
          var _a;
          this.#readyState = 1;
          this.dispatchEvent(new Event("loadedmetadata"));
          this.dispatchEvent(new Event("durationchange"));
          if (this.#initialVolume !== 1) {
            (_a = this.api) == null ? void 0 : _a.setVolume(this.#initialVolume * 100);
          }
          this.dispatchEvent(new Event("volumechange"));
          this.dispatchEvent(new Event("loadcomplete"));
          this.isLoaded = true;
          this.loadComplete.resolve();
        },
        onError: (error) => {
          console.error(error);
          this.#error = {
            code: error.data,
            message: `YouTube iframe player error #${error.data}; visit https://developers.google.com/youtube/iframe_api_reference#onError for the full error message.`
          };
          this.dispatchEvent(new Event("error"));
        }
      }
    });
    let playFired = false;
    this.api.addEventListener("onStateChange", (event) => {
      var _a;
      const state = event.data;
      if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
        if (!playFired) {
          playFired = true;
          this.dispatchEvent(new Event("play"));
        }
        const captionList = this.api.getOption("captions", "tracklist") || [];
        captionList.forEach((t) => {
          if (![...this.textTracks].some((tt) => tt.language === t.languageCode)) {
            this.#textTracksVideo.addTextTrack("subtitles", t.displayName, t.languageCode);
          }
          this.textTracks = this.#textTracksVideo.textTracks;
        });
        this.dispatchEvent(new Event("loadstart"));
      }
      if (state === YT.PlayerState.PLAYING) {
        if (this.seeking) {
          this.#seeking = false;
          (_a = this.#seekComplete) == null ? void 0 : _a.resolve();
          this.dispatchEvent(new Event("seeked"));
        }
        this.#readyState = 3;
        this.dispatchEvent(new Event("playing"));
      } else if (state === YT.PlayerState.PAUSED) {
        const diff = Math.abs(this.currentTime - lastCurrentTime);
        if (!this.seeking && diff > 0.1) {
          this.#seeking = true;
          this.dispatchEvent(new Event("seeking"));
        }
        playFired = false;
        this.dispatchEvent(new Event("pause"));
      }
      if (state === YT.PlayerState.ENDED) {
        playFired = false;
        this.dispatchEvent(new Event("pause"));
        this.dispatchEvent(new Event("ended"));
        if (this.loop) {
          this.play();
        }
      }
    });
    this.api.addEventListener("onPlaybackRateChange", () => {
      this.dispatchEvent(new Event("ratechange"));
    });
    this.api.addEventListener("onVolumeChange", () => {
      var _a;
      const apiVolume = ((_a = this.api) == null ? void 0 : _a.getVolume()) / 100;
      this.#initialVolume = apiVolume;
      this.dispatchEvent(new Event("volumechange"));
    });
    this.api.addEventListener("onVideoProgress", () => {
      this.dispatchEvent(new Event("timeupdate"));
    });
    await this.loadComplete;
    let lastCurrentTime = 0;
    setInterval(() => {
      var _a;
      const diff = Math.abs(this.currentTime - lastCurrentTime);
      const bufferedEnd = this.buffered.end(this.buffered.length - 1);
      if (this.seeking && bufferedEnd > 0.1) {
        this.#seeking = false;
        (_a = this.#seekComplete) == null ? void 0 : _a.resolve();
        this.dispatchEvent(new Event("seeked"));
      } else if (!this.seeking && diff > 0.1) {
        this.#seeking = true;
        this.dispatchEvent(new Event("seeking"));
      }
      lastCurrentTime = this.currentTime;
    }, 50);
    let lastBufferedEnd;
    const progressInterval = setInterval(() => {
      const bufferedEnd = this.buffered.end(this.buffered.length - 1);
      if (bufferedEnd >= this.duration) {
        clearInterval(progressInterval);
        this.#readyState = 4;
      }
      if (lastBufferedEnd != bufferedEnd) {
        lastBufferedEnd = bufferedEnd;
        this.dispatchEvent(new Event("progress"));
      }
    }, 100);
  }
  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (attrName) {
      case "src":
      case "autoplay":
      case "controls":
      case "loop":
      case "playsinline": {
        this.load();
      }
    }
  }
  async play() {
    var _a;
    this.#seekComplete = null;
    await this.loadComplete;
    (_a = this.api) == null ? void 0 : _a.playVideo();
    return createPlayPromise(this);
  }
  async pause() {
    var _a;
    await this.loadComplete;
    return (_a = this.api) == null ? void 0 : _a.pauseVideo();
  }
  get seeking() {
    return this.#seeking;
  }
  get readyState() {
    return this.#readyState;
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(val) {
    if (this.src == val) return;
    this.setAttribute("src", val);
  }
  get error() {
    return this.#error;
  }
  /* onStateChange
    -1 (unstarted)
    0 (ended)
    1 (playing)
    2 (paused)
    3 (buffering)
    5 (video cued).
  */
  get paused() {
    var _a, _b;
    if (!this.isLoaded) return !this.autoplay;
    return [-1, 0, 2, 5].includes((_b = (_a = this.api) == null ? void 0 : _a.getPlayerState) == null ? void 0 : _b.call(_a));
  }
  get duration() {
    var _a, _b;
    return ((_b = (_a = this.api) == null ? void 0 : _a.getDuration) == null ? void 0 : _b.call(_a)) ?? NaN;
  }
  get autoplay() {
    return this.hasAttribute("autoplay");
  }
  set autoplay(val) {
    if (this.autoplay == val) return;
    this.toggleAttribute("autoplay", Boolean(val));
  }
  get buffered() {
    var _a, _b;
    if (!this.isLoaded) return createTimeRanges();
    const progress = ((_a = this.api) == null ? void 0 : _a.getVideoLoadedFraction()) * ((_b = this.api) == null ? void 0 : _b.getDuration());
    if (progress > 0) {
      return createTimeRanges(0, progress);
    }
    return createTimeRanges();
  }
  get controls() {
    return this.hasAttribute("controls");
  }
  set controls(val) {
    if (this.controls == val) return;
    this.toggleAttribute("controls", Boolean(val));
  }
  get currentTime() {
    var _a, _b;
    return ((_b = (_a = this.api) == null ? void 0 : _a.getCurrentTime) == null ? void 0 : _b.call(_a)) ?? 0;
  }
  set currentTime(val) {
    if (this.currentTime == val) return;
    this.#seekComplete = new PublicPromise();
    this.loadComplete.then(() => {
      var _a, _b;
      (_a = this.api) == null ? void 0 : _a.seekTo(val, true);
      if (this.paused) {
        (_b = this.#seekComplete) == null ? void 0 : _b.then(() => {
          var _a2;
          if (!this.#seekComplete) return;
          (_a2 = this.api) == null ? void 0 : _a2.pauseVideo();
        });
      }
    });
  }
  set defaultMuted(val) {
    if (this.defaultMuted == val) return;
    this.toggleAttribute("muted", Boolean(val));
  }
  get defaultMuted() {
    return this.hasAttribute("muted");
  }
  get loop() {
    return this.hasAttribute("loop");
  }
  set loop(val) {
    if (this.loop == val) return;
    this.toggleAttribute("loop", Boolean(val));
  }
  set muted(val) {
    if (this.muted == val) return;
    this.loadComplete.then(() => {
      var _a, _b;
      val ? (_a = this.api) == null ? void 0 : _a.mute() : (_b = this.api) == null ? void 0 : _b.unMute();
    });
  }
  get muted() {
    var _a, _b;
    if (!this.isLoaded) return this.defaultMuted;
    return (_b = (_a = this.api) == null ? void 0 : _a.isMuted) == null ? void 0 : _b.call(_a);
  }
  get playbackRate() {
    var _a, _b;
    return ((_b = (_a = this.api) == null ? void 0 : _a.getPlaybackRate) == null ? void 0 : _b.call(_a)) ?? 1;
  }
  set playbackRate(val) {
    if (this.playbackRate == val) return;
    this.loadComplete.then(() => {
      var _a;
      (_a = this.api) == null ? void 0 : _a.setPlaybackRate(val);
    });
  }
  get playsInline() {
    return this.hasAttribute("playsinline");
  }
  set playsInline(val) {
    if (this.playsInline == val) return;
    this.toggleAttribute("playsinline", Boolean(val));
  }
  get poster() {
    return this.getAttribute("poster");
  }
  set poster(val) {
    if (this.poster == val) return;
    this.setAttribute("poster", `${val}`);
  }
  set volume(val) {
    if (this.volume == val) return;
    this.#initialVolume = val;
    this.loadComplete.then(() => {
      var _a;
      (_a = this.api) == null ? void 0 : _a.setVolume(val * 100);
    });
  }
  get volume() {
    var _a;
    if (!this.isLoaded) {
      return this.#initialVolume;
    }
    return ((_a = this.api) == null ? void 0 : _a.getVolume()) / 100;
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
    if (value === "") html += ` ${escapeHtml(key)}`;
    else html += ` ${escapeHtml(key)}="${escapeHtml(`${value}`)}"`;
  }
  return html;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/`/g, "&#x60;");
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
    await delay(0);
    return self[globalName];
  }
  return loadScriptCache[src] = new Promise(function(resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    const ready = () => resolve(self[globalName]);
    if (readyFnName) self[readyFnName] = ready;
    script.onload = () => !readyFnName && ready();
    script.onerror = reject;
    document.head.append(script);
  });
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function promisify(fn) {
  return (...args) => new Promise((resolve) => {
    fn(...args, (...res) => {
      if (res.length > 1) resolve(res);
      else resolve(res[0]);
    });
  });
}
function createPlayPromise(player) {
  return promisify((event, cb) => {
    let fn;
    player.addEventListener(
      event,
      fn = () => {
        player.removeEventListener(event, fn);
        cb();
      }
    );
  })("playing");
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
if (globalThis.customElements && !globalThis.customElements.get("youtube-video")) {
  globalThis.customElements.define("youtube-video", YoutubeVideoElement);
}
var youtube_video_element_default = YoutubeVideoElement;


;// ../node_modules/youtube-video-element/dist/react.js
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
  tagName: "youtube-video",
  elementClass: youtube_video_element_default,
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