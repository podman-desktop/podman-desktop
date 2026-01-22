"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[8555],{

/***/ 12495:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lB: () => (/* binding */ CustomVideoElement)
/* harmony export */ });
/* unused harmony exports Attributes, CustomAudioElement, CustomMediaMixin, Events */
const Events = [
  "abort",
  "canplay",
  "canplaythrough",
  "durationchange",
  "emptied",
  "encrypted",
  "ended",
  "error",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "pause",
  "play",
  "playing",
  "progress",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "volumechange",
  "waiting",
  "waitingforkey",
  "resize",
  "enterpictureinpicture",
  "leavepictureinpicture",
  "webkitbeginfullscreen",
  "webkitendfullscreen",
  "webkitpresentationmodechanged"
];
const Attributes = [
  "autopictureinpicture",
  "disablepictureinpicture",
  "disableremoteplayback",
  "autoplay",
  "controls",
  "controlslist",
  "crossorigin",
  "loop",
  "muted",
  "playsinline",
  "poster",
  "preload",
  "src"
];
function getAudioTemplateHTML(attrs) {
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-flex;
        line-height: 0;
        flex-direction: column;
        justify-content: end;
      }

      audio {
        width: 100%;
      }
    </style>
    <slot name="media">
      <audio${serializeAttributes(attrs)}></audio>
    </slot>
    <slot></slot>
  `
  );
}
function getVideoTemplateHTML(attrs) {
  return (
    /*html*/
    `
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, 50% 50%);
      }

      video::-webkit-media-text-track-container {
        transform: var(--media-webkit-text-track-transform);
        transition: var(--media-webkit-text-track-transition);
      }
    </style>
    <slot name="media">
      <video${serializeAttributes(attrs)}></video>
    </slot>
    <slot></slot>
  `
  );
}
function CustomMediaMixin(superclass, { tag, is }) {
  const nativeElTest = globalThis.document?.createElement?.(tag, { is });
  const nativeElProps = nativeElTest ? getNativeElProps(nativeElTest) : [];
  return class CustomMedia extends superclass {
    static getTemplateHTML = tag.endsWith("audio") ? getAudioTemplateHTML : getVideoTemplateHTML;
    static shadowRootOptions = { mode: "open" };
    static Events = Events;
    static #isDefined = false;
    static get observedAttributes() {
      CustomMedia.#define();
      const natAttrs = nativeElTest?.constructor?.observedAttributes ?? [];
      return [
        ...natAttrs,
        ...Attributes
      ];
    }
    static #define() {
      if (this.#isDefined) return;
      this.#isDefined = true;
      const propsToAttrs = new Set(this.observedAttributes);
      propsToAttrs.delete("muted");
      for (const prop of nativeElProps) {
        if (prop in this.prototype) continue;
        if (typeof nativeElTest[prop] === "function") {
          this.prototype[prop] = function(...args) {
            this.#init();
            const fn = () => {
              if (this.call) return this.call(prop, ...args);
              const nativeFn = this.nativeEl?.[prop];
              return nativeFn?.apply(this.nativeEl, args);
            };
            return fn();
          };
        } else {
          const config = {
            get() {
              this.#init();
              const attr = prop.toLowerCase();
              if (propsToAttrs.has(attr)) {
                const val = this.getAttribute(attr);
                return val === null ? false : val === "" ? true : val;
              }
              return this.get?.(prop) ?? this.nativeEl?.[prop];
            }
          };
          if (prop !== prop.toUpperCase()) {
            config.set = function(val) {
              this.#init();
              const attr = prop.toLowerCase();
              if (propsToAttrs.has(attr)) {
                if (val === true || val === false || val == null) {
                  this.toggleAttribute(attr, Boolean(val));
                } else {
                  this.setAttribute(attr, val);
                }
                return;
              }
              if (this.set) {
                this.set(prop, val);
                return;
              }
              if (this.nativeEl) {
                this.nativeEl[prop] = val;
              }
            };
          }
          Object.defineProperty(this.prototype, prop, config);
        }
      }
    }
    // Private fields
    #isInit = false;
    #nativeEl = null;
    #childMap = /* @__PURE__ */ new Map();
    #childObserver;
    get;
    set;
    call;
    // If the custom element is defined before the custom element's HTML is parsed
    // no attributes will be available in the constructor (construction process).
    // Wait until initializing in the attributeChangedCallback or
    // connectedCallback or accessing any properties.
    get nativeEl() {
      this.#init();
      return this.#nativeEl ?? this.querySelector(":scope > [slot=media]") ?? this.querySelector(tag) ?? this.shadowRoot?.querySelector(tag) ?? null;
    }
    set nativeEl(val) {
      this.#nativeEl = val;
    }
    get defaultMuted() {
      return this.hasAttribute("muted");
    }
    set defaultMuted(val) {
      this.toggleAttribute("muted", val);
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(val) {
      this.setAttribute("src", `${val}`);
    }
    get preload() {
      return this.getAttribute("preload") ?? this.nativeEl?.preload;
    }
    set preload(val) {
      this.setAttribute("preload", `${val}`);
    }
    #init() {
      if (this.#isInit) return;
      this.#isInit = true;
      this.init();
    }
    init() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
        const attrs = namedNodeMapToObject(this.attributes);
        if (is) attrs.is = is;
        if (tag) attrs.part = tag;
        this.shadowRoot.innerHTML = this.constructor.getTemplateHTML(attrs);
      }
      this.nativeEl.muted = this.hasAttribute("muted");
      for (const prop of nativeElProps) {
        this.#upgradeProperty(prop);
      }
      this.#childObserver = new MutationObserver(this.#syncMediaChildAttribute.bind(this));
      this.shadowRoot.addEventListener("slotchange", () => this.#syncMediaChildren());
      this.#syncMediaChildren();
      for (const type of this.constructor.Events) {
        this.shadowRoot.addEventListener(type, this, true);
      }
    }
    handleEvent(event) {
      if (event.target === this.nativeEl) {
        this.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
      }
    }
    #syncMediaChildren() {
      const removeNativeChildren = new Map(this.#childMap);
      const defaultSlot = this.shadowRoot?.querySelector("slot:not([name])");
      const mediaChildren = defaultSlot?.assignedElements({ flatten: true }).filter((el) => ["track", "source"].includes(el.localName));
      mediaChildren.forEach((el) => {
        removeNativeChildren.delete(el);
        let clone = this.#childMap.get(el);
        if (!clone) {
          clone = el.cloneNode();
          this.#childMap.set(el, clone);
          this.#childObserver?.observe(el, { attributes: true });
        }
        this.nativeEl?.append(clone);
        this.#enableDefaultTrack(clone);
      });
      removeNativeChildren.forEach((clone, el) => {
        clone.remove();
        this.#childMap.delete(el);
      });
    }
    #syncMediaChildAttribute(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const { target, attributeName } = mutation;
          const clone = this.#childMap.get(target);
          if (clone && attributeName) {
            clone.setAttribute(attributeName, target.getAttribute(attributeName) ?? "");
            this.#enableDefaultTrack(clone);
          }
        }
      }
    }
    #enableDefaultTrack(trackEl) {
      if (trackEl && trackEl.localName === "track" && trackEl.default && (trackEl.kind === "chapters" || trackEl.kind === "metadata") && trackEl.track.mode === "disabled") {
        trackEl.track.mode = "hidden";
      }
    }
    #upgradeProperty(prop) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
      this.#init();
      this.#forwardAttribute(attrName, oldValue, newValue);
    }
    #forwardAttribute(attrName, _oldValue, newValue) {
      if (["id", "class"].includes(attrName)) return;
      if (!CustomMedia.observedAttributes.includes(attrName) && this.constructor.observedAttributes.includes(attrName)) {
        return;
      }
      if (newValue === null) {
        this.nativeEl?.removeAttribute(attrName);
      } else if (this.nativeEl?.getAttribute(attrName) !== newValue) {
        this.nativeEl?.setAttribute(attrName, newValue);
      }
    }
    connectedCallback() {
      this.#init();
    }
  };
}
function getNativeElProps(nativeElTest) {
  const nativeElProps = [];
  for (let proto = Object.getPrototypeOf(nativeElTest); proto && proto !== HTMLElement.prototype; proto = Object.getPrototypeOf(proto)) {
    const props = Object.getOwnPropertyNames(proto);
    nativeElProps.push(...props);
  }
  return nativeElProps;
}
function serializeAttributes(attrs) {
  let html = "";
  for (const key in attrs) {
    if (!Attributes.includes(key)) continue;
    const value = attrs[key];
    if (value === "") html += ` ${key}`;
    else html += ` ${key}="${value}"`;
  }
  return html;
}
function namedNodeMapToObject(namedNodeMap) {
  const obj = {};
  for (const attr of namedNodeMap) {
    obj[attr.name] = attr.value;
  }
  return obj;
}
const CustomVideoElement = CustomMediaMixin(globalThis.HTMLElement ?? class {
}, {
  tag: "video"
});
const CustomAudioElement = CustomMediaMixin(globalThis.HTMLElement ?? class {
}, {
  tag: "audio"
});



/***/ }),

/***/ 39837:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  u6: () => (/* reexport */ MediaTracksMixin)
});

// UNUSED EXPORTS: AudioRendition, AudioRenditionList, AudioTrack, AudioTrackList, RenditionEvent, TrackEvent, VideoRendition, VideoRenditionList, VideoTrack, VideoTrackList

;// ../node_modules/media-tracks/dist/change-event.js
class TrackEvent extends Event {
  track;
  constructor(type, init) {
    super(type);
    this.track = init.track;
  }
}


;// ../node_modules/media-tracks/dist/utils.js
const privateProps = /* @__PURE__ */ new WeakMap();
function getPrivate(instance) {
  return privateProps.get(instance) ?? setPrivate(instance, {});
}
function setPrivate(instance, props) {
  let saved = privateProps.get(instance);
  if (!saved) privateProps.set(instance, saved = {});
  return Object.assign(saved, props);
}


;// ../node_modules/media-tracks/dist/video-track-list.js


function addVideoTrack(media, track) {
  const trackList = media.videoTracks;
  getPrivate(track).media = media;
  if (!getPrivate(track).renditionSet) {
    getPrivate(track).renditionSet = /* @__PURE__ */ new Set();
  }
  const trackSet = getPrivate(trackList).trackSet;
  trackSet.add(track);
  const index = trackSet.size - 1;
  if (!(index in VideoTrackList.prototype)) {
    Object.defineProperty(VideoTrackList.prototype, index, {
      get() {
        return [...getPrivate(this).trackSet][index];
      }
    });
  }
  queueMicrotask(() => {
    trackList.dispatchEvent(new TrackEvent("addtrack", { track }));
  });
}
function removeVideoTrack(track) {
  const trackList = getPrivate(track).media?.videoTracks;
  if (!trackList) return;
  const trackSet = getPrivate(trackList).trackSet;
  trackSet.delete(track);
  queueMicrotask(() => {
    trackList.dispatchEvent(new TrackEvent("removetrack", { track }));
  });
}
function selectedChanged(selected) {
  const trackList = getPrivate(selected).media.videoTracks ?? [];
  let hasUnselected = false;
  for (const track of trackList) {
    if (track === selected) continue;
    track.selected = false;
    hasUnselected = true;
  }
  if (hasUnselected) {
    if (getPrivate(trackList).changeRequested) return;
    getPrivate(trackList).changeRequested = true;
    queueMicrotask(() => {
      delete getPrivate(trackList).changeRequested;
      trackList.dispatchEvent(new Event("change"));
    });
  }
}
class VideoTrackList extends EventTarget {
  #addTrackCallback;
  #removeTrackCallback;
  #changeCallback;
  constructor() {
    super();
    getPrivate(this).trackSet = /* @__PURE__ */ new Set();
  }
  get #tracks() {
    return getPrivate(this).trackSet;
  }
  [Symbol.iterator]() {
    return this.#tracks.values();
  }
  get length() {
    return this.#tracks.size;
  }
  getTrackById(id) {
    return [...this.#tracks].find((track) => track.id === id) ?? null;
  }
  get selectedIndex() {
    return [...this.#tracks].findIndex((track) => track.selected);
  }
  get onaddtrack() {
    return this.#addTrackCallback;
  }
  set onaddtrack(callback) {
    if (this.#addTrackCallback) {
      this.removeEventListener("addtrack", this.#addTrackCallback);
      this.#addTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addTrackCallback = callback;
      this.addEventListener("addtrack", callback);
    }
  }
  get onremovetrack() {
    return this.#removeTrackCallback;
  }
  set onremovetrack(callback) {
    if (this.#removeTrackCallback) {
      this.removeEventListener("removetrack", this.#removeTrackCallback);
      this.#removeTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeTrackCallback = callback;
      this.addEventListener("removetrack", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}


;// ../node_modules/media-tracks/dist/rendition-event.js
class RenditionEvent extends Event {
  rendition;
  constructor(type, init) {
    super(type);
    this.rendition = init.rendition;
  }
}


;// ../node_modules/media-tracks/dist/video-rendition-list.js


function addRendition(track, rendition) {
  const renditionList = getPrivate(track).media.videoRenditions;
  getPrivate(rendition).media = getPrivate(track).media;
  getPrivate(rendition).track = track;
  const renditionSet = getPrivate(track).renditionSet;
  renditionSet.add(rendition);
  const index = renditionSet.size - 1;
  if (!(index in VideoRenditionList.prototype)) {
    Object.defineProperty(VideoRenditionList.prototype, index, {
      get() {
        return getCurrentRenditions(this)[index];
      }
    });
  }
  queueMicrotask(() => {
    if (!track.selected) return;
    renditionList.dispatchEvent(new RenditionEvent("addrendition", { rendition }));
  });
}
function removeRendition(rendition) {
  const renditionList = getPrivate(rendition).media.videoRenditions;
  const track = getPrivate(rendition).track;
  const renditionSet = getPrivate(track).renditionSet;
  renditionSet.delete(rendition);
  queueMicrotask(() => {
    const track2 = getPrivate(rendition).track;
    if (!track2.selected) return;
    renditionList.dispatchEvent(new RenditionEvent("removerendition", { rendition }));
  });
}
function video_rendition_list_selectedChanged(rendition) {
  const renditionList = getPrivate(rendition).media.videoRenditions;
  if (!renditionList || getPrivate(renditionList).changeRequested) return;
  getPrivate(renditionList).changeRequested = true;
  queueMicrotask(() => {
    delete getPrivate(renditionList).changeRequested;
    const track = getPrivate(rendition).track;
    if (!track.selected) return;
    renditionList.dispatchEvent(new Event("change"));
  });
}
function getCurrentRenditions(renditionList) {
  const media = getPrivate(renditionList).media;
  return [...media.videoTracks].filter((track) => track.selected).flatMap((track) => [...getPrivate(track).renditionSet]);
}
class VideoRenditionList extends EventTarget {
  #addRenditionCallback;
  #removeRenditionCallback;
  #changeCallback;
  [Symbol.iterator]() {
    return getCurrentRenditions(this).values();
  }
  get length() {
    return getCurrentRenditions(this).length;
  }
  getRenditionById(id) {
    return getCurrentRenditions(this).find((rendition) => `${rendition.id}` === `${id}`) ?? null;
  }
  get selectedIndex() {
    return getCurrentRenditions(this).findIndex((rendition) => rendition.selected);
  }
  set selectedIndex(index) {
    for (const [i, rendition] of getCurrentRenditions(this).entries()) {
      rendition.selected = i === index;
    }
  }
  get onaddrendition() {
    return this.#addRenditionCallback;
  }
  set onaddrendition(callback) {
    if (this.#addRenditionCallback) {
      this.removeEventListener("addrendition", this.#addRenditionCallback);
      this.#addRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addRenditionCallback = callback;
      this.addEventListener("addrendition", callback);
    }
  }
  get onremoverendition() {
    return this.#removeRenditionCallback;
  }
  set onremoverendition(callback) {
    if (this.#removeRenditionCallback) {
      this.removeEventListener("removerendition", this.#removeRenditionCallback);
      this.#removeRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeRenditionCallback = callback;
      this.addEventListener("removerendition", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}


;// ../node_modules/media-tracks/dist/video-rendition.js

class VideoRendition {
  src;
  id;
  width;
  height;
  bitrate;
  frameRate;
  codec;
  #selected = false;
  get selected() {
    return this.#selected;
  }
  set selected(val) {
    if (this.#selected === val) return;
    this.#selected = val;
    video_rendition_list_selectedChanged(this);
  }
}


;// ../node_modules/media-tracks/dist/video-track.js



const VideoTrackKind = {
  alternative: "alternative",
  captions: "captions",
  main: "main",
  sign: "sign",
  subtitles: "subtitles",
  commentary: "commentary"
};
class VideoTrack {
  id;
  kind;
  label = "";
  language = "";
  sourceBuffer;
  #selected = false;
  addRendition(src, width, height, codec, bitrate, frameRate) {
    const rendition = new VideoRendition();
    rendition.src = src;
    rendition.width = width;
    rendition.height = height;
    rendition.frameRate = frameRate;
    rendition.bitrate = bitrate;
    rendition.codec = codec;
    addRendition(this, rendition);
    return rendition;
  }
  removeRendition(rendition) {
    removeRendition(rendition);
  }
  get selected() {
    return this.#selected;
  }
  set selected(val) {
    if (this.#selected === val) return;
    this.#selected = val;
    if (val !== true) return;
    selectedChanged(this);
  }
}


;// ../node_modules/media-tracks/dist/audio-rendition-list.js


function audio_rendition_list_addRendition(track, rendition) {
  const renditionList = getPrivate(track).media.audioRenditions;
  getPrivate(rendition).media = getPrivate(track).media;
  getPrivate(rendition).track = track;
  const renditionSet = getPrivate(track).renditionSet;
  renditionSet.add(rendition);
  const index = renditionSet.size - 1;
  if (!(index in AudioRenditionList.prototype)) {
    Object.defineProperty(AudioRenditionList.prototype, index, {
      get() {
        return audio_rendition_list_getCurrentRenditions(this)[index];
      }
    });
  }
  queueMicrotask(() => {
    if (!track.enabled) return;
    renditionList.dispatchEvent(new RenditionEvent("addrendition", { rendition }));
  });
}
function audio_rendition_list_removeRendition(rendition) {
  const renditionList = getPrivate(rendition).media.audioRenditions;
  const track = getPrivate(rendition).track;
  const renditionSet = getPrivate(track).renditionSet;
  renditionSet.delete(rendition);
  queueMicrotask(() => {
    const track2 = getPrivate(rendition).track;
    if (!track2.enabled) return;
    renditionList.dispatchEvent(new RenditionEvent("removerendition", { rendition }));
  });
}
function audio_rendition_list_selectedChanged(rendition) {
  const renditionList = getPrivate(rendition).media.audioRenditions;
  if (!renditionList || getPrivate(renditionList).changeRequested) return;
  getPrivate(renditionList).changeRequested = true;
  queueMicrotask(() => {
    delete getPrivate(renditionList).changeRequested;
    const track = getPrivate(rendition).track;
    if (!track.enabled) return;
    renditionList.dispatchEvent(new Event("change"));
  });
}
function audio_rendition_list_getCurrentRenditions(renditionList) {
  const media = getPrivate(renditionList).media;
  return [...media.audioTracks].filter((track) => track.enabled).flatMap((track) => [...getPrivate(track).renditionSet]);
}
class AudioRenditionList extends EventTarget {
  #addRenditionCallback;
  #removeRenditionCallback;
  #changeCallback;
  [Symbol.iterator]() {
    return audio_rendition_list_getCurrentRenditions(this).values();
  }
  get length() {
    return audio_rendition_list_getCurrentRenditions(this).length;
  }
  getRenditionById(id) {
    return audio_rendition_list_getCurrentRenditions(this).find((rendition) => `${rendition.id}` === `${id}`) ?? null;
  }
  get selectedIndex() {
    return audio_rendition_list_getCurrentRenditions(this).findIndex((rendition) => rendition.selected);
  }
  set selectedIndex(index) {
    for (const [i, rendition] of audio_rendition_list_getCurrentRenditions(this).entries()) {
      rendition.selected = i === index;
    }
  }
  get onaddrendition() {
    return this.#addRenditionCallback;
  }
  set onaddrendition(callback) {
    if (this.#addRenditionCallback) {
      this.removeEventListener("addrendition", this.#addRenditionCallback);
      this.#addRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addRenditionCallback = callback;
      this.addEventListener("addrendition", callback);
    }
  }
  get onremoverendition() {
    return this.#removeRenditionCallback;
  }
  set onremoverendition(callback) {
    if (this.#removeRenditionCallback) {
      this.removeEventListener("removerendition", this.#removeRenditionCallback);
      this.#removeRenditionCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeRenditionCallback = callback;
      this.addEventListener("removerendition", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}


;// ../node_modules/media-tracks/dist/audio-rendition.js

class AudioRendition {
  src;
  id;
  bitrate;
  codec;
  #selected = false;
  get selected() {
    return this.#selected;
  }
  set selected(val) {
    if (this.#selected === val) return;
    this.#selected = val;
    audio_rendition_list_selectedChanged(this);
  }
}


;// ../node_modules/media-tracks/dist/audio-track-list.js


function addAudioTrack(media, track) {
  const trackList = media.audioTracks;
  getPrivate(track).media = media;
  if (!getPrivate(track).renditionSet) {
    getPrivate(track).renditionSet = /* @__PURE__ */ new Set();
  }
  const trackSet = getPrivate(trackList).trackSet;
  trackSet.add(track);
  const index = trackSet.size - 1;
  if (!(index in AudioTrackList.prototype)) {
    Object.defineProperty(AudioTrackList.prototype, index, {
      get() {
        return [...getPrivate(this).trackSet][index];
      }
    });
  }
  queueMicrotask(() => {
    trackList.dispatchEvent(new TrackEvent("addtrack", { track }));
  });
}
function removeAudioTrack(track) {
  const trackList = getPrivate(track).media?.audioTracks;
  if (!trackList) return;
  const trackSet = getPrivate(trackList).trackSet;
  trackSet.delete(track);
  queueMicrotask(() => {
    trackList.dispatchEvent(new TrackEvent("removetrack", { track }));
  });
}
function enabledChanged(track) {
  const trackList = getPrivate(track).media.audioTracks;
  if (!trackList || getPrivate(trackList).changeRequested) return;
  getPrivate(trackList).changeRequested = true;
  queueMicrotask(() => {
    delete getPrivate(trackList).changeRequested;
    trackList.dispatchEvent(new Event("change"));
  });
}
class AudioTrackList extends EventTarget {
  #addTrackCallback;
  #removeTrackCallback;
  #changeCallback;
  constructor() {
    super();
    getPrivate(this).trackSet = /* @__PURE__ */ new Set();
  }
  get #tracks() {
    return getPrivate(this).trackSet;
  }
  [Symbol.iterator]() {
    return this.#tracks.values();
  }
  get length() {
    return this.#tracks.size;
  }
  getTrackById(id) {
    return [...this.#tracks].find((track) => track.id === id) ?? null;
  }
  get onaddtrack() {
    return this.#addTrackCallback;
  }
  set onaddtrack(callback) {
    if (this.#addTrackCallback) {
      this.removeEventListener("addtrack", this.#addTrackCallback);
      this.#addTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#addTrackCallback = callback;
      this.addEventListener("addtrack", callback);
    }
  }
  get onremovetrack() {
    return this.#removeTrackCallback;
  }
  set onremovetrack(callback) {
    if (this.#removeTrackCallback) {
      this.removeEventListener("removetrack", this.#removeTrackCallback);
      this.#removeTrackCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#removeTrackCallback = callback;
      this.addEventListener("removetrack", callback);
    }
  }
  get onchange() {
    return this.#changeCallback;
  }
  set onchange(callback) {
    if (this.#changeCallback) {
      this.removeEventListener("change", this.#changeCallback);
      this.#changeCallback = void 0;
    }
    if (typeof callback == "function") {
      this.#changeCallback = callback;
      this.addEventListener("change", callback);
    }
  }
}


;// ../node_modules/media-tracks/dist/audio-track.js



const AudioTrackKind = {
  alternative: "alternative",
  descriptions: "descriptions",
  main: "main",
  "main-desc": "main-desc",
  translation: "translation",
  commentary: "commentary"
};
class AudioTrack {
  id;
  kind;
  label = "";
  language = "";
  sourceBuffer;
  #enabled = false;
  addRendition(src, codec, bitrate) {
    const rendition = new AudioRendition();
    rendition.src = src;
    rendition.codec = codec;
    rendition.bitrate = bitrate;
    audio_rendition_list_addRendition(this, rendition);
    return rendition;
  }
  removeRendition(rendition) {
    audio_rendition_list_removeRendition(rendition);
  }
  get enabled() {
    return this.#enabled;
  }
  set enabled(val) {
    if (this.#enabled === val) return;
    this.#enabled = val;
    enabledChanged(this);
  }
}


;// ../node_modules/media-tracks/dist/mixin.js







const nativeVideoTracksFn = getBaseMediaTracksFn(globalThis.HTMLMediaElement, "video");
const nativeAudioTracksFn = getBaseMediaTracksFn(globalThis.HTMLMediaElement, "audio");
function MediaTracksMixin(MediaElementClass) {
  if (!MediaElementClass?.prototype) return MediaElementClass;
  const videoTracksFn = getBaseMediaTracksFn(MediaElementClass, "video");
  if (!videoTracksFn || `${videoTracksFn}`.includes("[native code]")) {
    Object.defineProperty(MediaElementClass.prototype, "videoTracks", {
      get() {
        return getVideoTracks(this);
      }
    });
  }
  const audioTracksFn = getBaseMediaTracksFn(MediaElementClass, "audio");
  if (!audioTracksFn || `${audioTracksFn}`.includes("[native code]")) {
    Object.defineProperty(MediaElementClass.prototype, "audioTracks", {
      get() {
        return getAudioTracks(this);
      }
    });
  }
  if (!("addVideoTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.addVideoTrack = function(kind, label = "", language = "") {
      const track = new VideoTrack();
      track.kind = kind;
      track.label = label;
      track.language = language;
      addVideoTrack(this, track);
      return track;
    };
  }
  if (!("removeVideoTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.removeVideoTrack = removeVideoTrack;
  }
  if (!("addAudioTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.addAudioTrack = function(kind, label = "", language = "") {
      const track = new AudioTrack();
      track.kind = kind;
      track.label = label;
      track.language = language;
      addAudioTrack(this, track);
      return track;
    };
  }
  if (!("removeAudioTrack" in MediaElementClass.prototype)) {
    MediaElementClass.prototype.removeAudioTrack = removeAudioTrack;
  }
  if (!("videoRenditions" in MediaElementClass.prototype)) {
    Object.defineProperty(MediaElementClass.prototype, "videoRenditions", {
      get() {
        return initVideoRenditions(this);
      }
    });
  }
  const initVideoRenditions = (media) => {
    let renditions = getPrivate(media).videoRenditions;
    if (!renditions) {
      renditions = new VideoRenditionList();
      getPrivate(renditions).media = media;
      getPrivate(media).videoRenditions = renditions;
    }
    return renditions;
  };
  if (!("audioRenditions" in MediaElementClass.prototype)) {
    Object.defineProperty(MediaElementClass.prototype, "audioRenditions", {
      get() {
        return initAudioRenditions(this);
      }
    });
  }
  const initAudioRenditions = (media) => {
    let renditions = getPrivate(media).audioRenditions;
    if (!renditions) {
      renditions = new AudioRenditionList();
      getPrivate(renditions).media = media;
      getPrivate(media).audioRenditions = renditions;
    }
    return renditions;
  };
  return MediaElementClass;
}
function getBaseMediaTracksFn(MediaElementClass, type) {
  if (MediaElementClass?.prototype) {
    return Object.getOwnPropertyDescriptor(MediaElementClass.prototype, `${type}Tracks`)?.get;
  }
}
function getVideoTracks(media) {
  let tracks = getPrivate(media).videoTracks;
  if (!tracks) {
    tracks = new VideoTrackList();
    getPrivate(media).videoTracks = tracks;
    if (nativeVideoTracksFn) {
      const nativeTracks = nativeVideoTracksFn.call(media.nativeEl ?? media);
      for (const nativeTrack of nativeTracks) {
        addVideoTrack(media, nativeTrack);
      }
      nativeTracks.addEventListener("change", () => {
        tracks.dispatchEvent(new Event("change"));
      });
      nativeTracks.addEventListener("addtrack", (event) => {
        if ([...tracks].some((t) => t instanceof VideoTrack)) {
          for (const nativeTrack of nativeTracks) {
            removeVideoTrack(nativeTrack);
          }
          return;
        }
        addVideoTrack(media, event.track);
      });
      nativeTracks.addEventListener("removetrack", (event) => {
        removeVideoTrack(event.track);
      });
    }
  }
  return tracks;
}
function getAudioTracks(media) {
  let tracks = getPrivate(media).audioTracks;
  if (!tracks) {
    tracks = new AudioTrackList();
    getPrivate(media).audioTracks = tracks;
    if (nativeAudioTracksFn) {
      const nativeTracks = nativeAudioTracksFn.call(media.nativeEl ?? media);
      for (const nativeTrack of nativeTracks) {
        addAudioTrack(media, nativeTrack);
      }
      nativeTracks.addEventListener("change", () => {
        tracks.dispatchEvent(new Event("change"));
      });
      nativeTracks.addEventListener("addtrack", (event) => {
        if ([...tracks].some((t) => t instanceof AudioTrack)) {
          for (const nativeTrack of nativeTracks) {
            removeAudioTrack(nativeTrack);
          }
          return;
        }
        addAudioTrack(media, event.track);
      });
      nativeTracks.addEventListener("removetrack", (event) => {
        removeAudioTrack(event.track);
      });
    }
  }
  return tracks;
}


;// ../node_modules/media-tracks/dist/index.js














/***/ })

}]);