"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[99340],{

/***/ 78733:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ react_react_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
;// ../node_modules/super-media-element/super-media-element.js
/**
 * Super Media Element
 * Based on https://github.com/muxinc/custom-video-element - Mux - MIT License
 *
 * The goal is to create an element that works just like the video element
 * but can be extended/sub-classed, because native elements cannot be
 * extended today across browsers. Support for extending async loaded video
 * like API's. e.g. video players.
 */

// The onevent like props are weirdly set on the HTMLElement prototype with other
// generic events making it impossible to pick these specific to HTMLMediaElement.
const Events = [
  'abort',
  'canplay',
  'canplaythrough',
  'durationchange',
  'emptied',
  'encrypted',
  'ended',
  'error',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting',
  'waitingforkey',
  'resize',
  'enterpictureinpicture',
  'leavepictureinpicture',
  'webkitbeginfullscreen',
  'webkitendfullscreen',
  'webkitpresentationmodechanged',
];

const template = globalThis.document?.createElement('template');

if (template) {
  template.innerHTML = /*html*/`
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video,
      audio {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
      }
    </style>
    <slot></slot>
  `;
}

/**
 * @see https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 */
const SuperMediaMixin = (superclass, { tag, is }) => {

  const nativeElTest = globalThis.document?.createElement(tag, { is });
  const nativeElProps = nativeElTest ? getNativeElProps(nativeElTest) : [];

  return class SuperMedia extends superclass {
    static Events = Events;
    static template = template;
    static skipAttributes = [];
    static #isDefined;

    static get observedAttributes() {
      SuperMedia.#define();

      // Include any attributes from the custom built-in.
      const natAttrs = nativeElTest?.constructor?.observedAttributes ?? [];

      return [
        ...natAttrs,
        'autopictureinpicture',
        'disablepictureinpicture',
        'disableremoteplayback',
        'autoplay',
        'controls',
        'controlslist',
        'crossorigin',
        'loop',
        'muted',
        'playsinline',
        'poster',
        'preload',
        'src',
      ];
    }

    static #define() {
      if (this.#isDefined) return;
      this.#isDefined = true;

      const propsToAttrs = new Set(this.observedAttributes);
      // defaultMuted maps to the muted attribute, handled manually below.
      propsToAttrs.delete('muted');

      // Passthrough native el functions from the custom el to the native el
      for (let prop of nativeElProps) {
        if (prop in this.prototype) continue;

        const type = typeof nativeElTest[prop];
        if (type == 'function') {
          // Function
          this.prototype[prop] = function (...args) {
            this.#init();

            const fn = () => {
              if (this.call) return this.call(prop, ...args);
              return this.nativeEl[prop].apply(this.nativeEl, args);
            };

            if (this.loadComplete && !this.isLoaded) {
              return this.loadComplete.then(fn);
            }
            return fn();
          };
        } else {
          // Some properties like src, preload, defaultMuted are handled manually.

          // Getter
          let config = {
            get() {
              this.#init();

              let attr = prop.toLowerCase();
              if (propsToAttrs.has(attr)) {
                const val = this.getAttribute(attr);
                return val === null ? false : val === '' ? true : val;
              }

              return this.get?.(prop) ?? this.nativeEl?.[prop] ?? this.#standinEl[prop];
            },
          };

          if (prop !== prop.toUpperCase()) {
            // Setter (not a CONSTANT)
            config.set = async function (val) {
              this.#init();

              let attr = prop.toLowerCase();
              if (propsToAttrs.has(attr)) {
                if (val === true || val === false || val == null) {
                  this.toggleAttribute(attr, Boolean(val));
                } else {
                  this.setAttribute(attr, val);
                }
                return;
              }

              if (this.loadComplete && !this.isLoaded) await this.loadComplete;

              if (this.set) {
                this.set(prop, val);
                return;
              }

              this.nativeEl[prop] = val;
            };
          }

          Object.defineProperty(this.prototype, prop, config);
        }
      }
    }

    #isInit;
    #loadComplete;
    #hasLoaded = false;
    #isLoaded = false;
    #nativeEl;
    #standinEl;

    constructor() {
      super();

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(this.constructor.template.content.cloneNode(true));
      }

      // If a load method is provided in the child class create a load promise.
      if (this.load !== SuperMedia.prototype.load) {
        this.loadComplete = new PublicPromise();
      }

      // If the custom element is defined before the custom element's HTML is parsed
      // no attributes will be available in the constructor (construction process).
      // Wait until initializing in the attributeChangedCallback or
      // connectedCallback or accessing any properties.
    }

    get loadComplete() {
      return this.#loadComplete;
    }

    set loadComplete(promise) {
      this.#isLoaded = false;
      this.#loadComplete = promise;
      promise?.then(() => {
        this.#isLoaded = true;
      });
    }

    get isLoaded() {
      return this.#isLoaded;
    }

    get nativeEl() {
      return this.#nativeEl
        ?? this.shadowRoot.querySelector(tag)
        ?? this.querySelector(tag);
    }

    set nativeEl(val) {
      this.#nativeEl = val;
    }

    get defaultMuted() {
      return this.hasAttribute('muted');
    }

    set defaultMuted(val) {
      this.toggleAttribute('muted', Boolean(val));
    }

    get src() {
      return this.getAttribute('src');
    }

    set src(val) {
      this.setAttribute('src', `${val}`);
    }

    get preload() {
      return this.getAttribute('preload') ?? this.nativeEl?.preload;
    }

    set preload(val) {
      this.setAttribute('preload', `${val}`);
    }

    async #init() {
      if (this.#isInit) return;
      this.#isInit = true;

      this.#initStandinEl();
      this.#initNativeEl();

      for (let prop of nativeElProps)
        this.#upgradeProperty(prop);

      // Keep some native child elements like track and source in sync.
      const childMap = new Map();
      // An unnamed <slot> will be filled with all of the custom element's
      // top-level child nodes that do not have the slot attribute.
      const slotEl = this.shadowRoot.querySelector('slot:not([name])');
      slotEl?.addEventListener('slotchange', () => {
        const removeNativeChildren = new Map(childMap);
        slotEl
          .assignedElements()
          .filter((el) => ['track', 'source'].includes(el.localName))
          .forEach(async (el) => {
            // If the source or track is still in the assigned elements keep it.
            removeNativeChildren.delete(el);
            // Re-use clones if possible.
            let clone = childMap.get(el);
            if (!clone) {
              clone = el.cloneNode();
              childMap.set(el, clone);
            }
            if (this.loadComplete && !this.isLoaded) await this.loadComplete;
            this.nativeEl.append?.(clone);
          });
        removeNativeChildren.forEach((el) => el.remove());
      });

      // The video events are dispatched on the SuperMediaElement instance.
      // This makes it possible to add event listeners before the element is upgraded.
      for (let type of this.constructor.Events) {
        this.shadowRoot.addEventListener?.(type, (evt) => {
          if (evt.target !== this.nativeEl) return;
          this.dispatchEvent(new CustomEvent(evt.type, { detail: evt.detail }));
        }, true);
      }
    }

    #upgradeProperty(prop) {
      // Sets properties that are set before the custom element is upgraded.
      // https://web.dev/custom-elements-best-practices/#make-properties-lazy
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = this[prop];
        // Delete the set property from this instance.
        delete this[prop];
        // Set the value again via the (prototype) setter on this class.
        this[prop] = value;
      }
    }

    #initStandinEl() {
      // Neither Chrome or Firefox support setting the muted attribute
      // after using document.createElement.
      // Get around this by setting the muted property manually.
      const dummyEl = document.createElement(tag, { is });
      dummyEl.muted = this.hasAttribute('muted');

      for (let { name, value } of this.attributes) {
        dummyEl.setAttribute(name, value);
      }

      this.#standinEl = {};
      for (let name of getNativeElProps(dummyEl)) {
        this.#standinEl[name] = dummyEl[name];
      }

      // unload dummy video element
      dummyEl.removeAttribute('src');
      dummyEl.load();
    }

    async #initNativeEl() {
      if (this.loadComplete && !this.isLoaded) await this.loadComplete;

      // If there is no nativeEl by now, create it our bloody selves.
      if (!this.nativeEl) {
        const nativeEl = document.createElement(tag, { is });
        nativeEl.part = tag;
        this.shadowRoot.append(nativeEl);
      }

      // Neither Chrome or Firefox support setting the muted attribute
      // after using document.createElement.
      // Get around this by setting the muted property manually.
      this.nativeEl.muted = this.hasAttribute('muted');
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      // Initialize right after construction when the attributes become available.
      this.#init();

      // Only call loadSrc when the super class has a load method.
      if (attrName === 'src' && this.load !== SuperMedia.prototype.load) {
        this.#loadSrc();
      }

      this.#forwardAttribute(attrName, oldValue, newValue);
    }

    async #loadSrc() {
      // The first time we use the Promise created in the constructor.
      if (this.#hasLoaded) this.loadComplete = new PublicPromise();
      this.#hasLoaded = true;

      // Wait 1 tick to allow other attributes to be set.
      await Promise.resolve();
      await this.load();

      this.loadComplete?.resolve();
      await this.loadComplete;
    }

    async #forwardAttribute(attrName, oldValue, newValue) {
      if (this.loadComplete && !this.isLoaded) await this.loadComplete;

      // Ignore a few that don't need to be passed & skipped attributes.
      // e.g. src: native element is using MSE and has a blob url as src attribute.
      if (['id', 'class', ...this.constructor.skipAttributes].includes(attrName)) {
        return;
      }

      if (newValue === null) {
        this.nativeEl.removeAttribute?.(attrName);
      } else {
        this.nativeEl.setAttribute?.(attrName, newValue);
      }
    }

    connectedCallback() {
      this.#init();
    }
  };
};

function getNativeElProps(nativeElTest) {
  // Map all native element properties to the custom element
  // so that they're applied to the native element.
  // Skipping HTMLElement because of things like "attachShadow"
  // causing issues. Most of those props still need to apply to
  // the custom element.
  let nativeElProps = [];

  // Walk the prototype chain up to HTMLElement.
  // This will grab all super class props in between.
  // i.e. VideoElement and MediaElement
  for (
    let proto = Object.getPrototypeOf(nativeElTest);
    proto && proto !== HTMLElement.prototype;
    proto = Object.getPrototypeOf(proto)
  ) {
    nativeElProps.push(...Object.getOwnPropertyNames(proto));
  }

  return nativeElProps;
}

/**
 * A utility to create Promises with convenient public resolve and reject methods.
 * @return {Promise}
 */
class PublicPromise extends Promise {
  constructor(executor = () => {}) {
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

const SuperVideoElement = globalThis.document ? SuperMediaMixin(HTMLElement, { tag: 'video' }) : class {};

const SuperAudioElement = globalThis.document ? SuperMediaMixin(HTMLElement, { tag: 'audio' }) : class {};

;// ../node_modules/wistia-video-element/dist/wistia-video-element.js
var _a, _b;

const templateLightDOM = (_a = globalThis.document) == null ? void 0 : _a.createElement("template");
if (templateLightDOM) {
  templateLightDOM.innerHTML = /*html*/
  `
  <div class="wistia_embed"></div>
  `;
}
const templateShadowDOM = (_b = globalThis.document) == null ? void 0 : _b.createElement("template");
if (templateShadowDOM) {
  templateShadowDOM.innerHTML = /*html*/
  `
  <style>
    :host {
      display: inline-block;
      min-width: 300px;
      min-height: 150px;
      position: relative;
    }
    ::slotted(.wistia_embed) {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  </style>
  <slot></slot>
  `;
}
class WistiaVideoElement extends SuperVideoElement {
  static template = templateShadowDOM;
  static skipAttributes = ["src"];
  get nativeEl() {
    var _a2;
    return ((_a2 = this.api) == null ? void 0 : _a2.elem()) ?? this.querySelector("video");
  }
  async load() {
    var _a2;
    (_a2 = this.querySelector(".wistia_embed")) == null ? void 0 : _a2.remove();
    if (!this.src) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
    const MATCH_SRC = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/i;
    const id = this.src.match(MATCH_SRC)[1];
    const options = {
      autoPlay: this.autoplay,
      preload: this.preload ?? "metadata",
      playsinline: this.playsInline,
      endVideoBehavior: this.loop && "loop",
      chromeless: !this.controls,
      playButton: this.controls,
      muted: this.defaultMuted
    };
    this.append(templateLightDOM.content.cloneNode(true));
    const div = this.querySelector(".wistia_embed");
    if (!div.id) div.id = uniqueId(id);
    div.classList.add(`wistia_async_${id}`);
    const scriptUrl = "https://fast.wistia.com/assets/external/E-v1.js";
    await loadScript(scriptUrl, "Wistia");
    this.api = await new Promise((onReady) => {
      globalThis._wq.push({
        id: div.id,
        onReady,
        options
      });
    });
  }
  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === "controls") {
      await this.loadComplete;
      switch (attrName) {
        case "controls":
          this.api.bigPlayButtonEnabled(this.controls);
          this.controls ? this.api.releaseChromeless() : this.api.requestChromeless();
          break;
      }
      return;
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
  // Override some methods w/ defaults if the video element is not ready yet when called.
  // Some methods require the Wistia API instead of the native video element API.
  get duration() {
    var _a2;
    return (_a2 = this.api) == null ? void 0 : _a2.duration();
  }
  async play() {
    await this.loadComplete;
    this.api.play();
    return new Promise((resolve) => this.addEventListener("playing", resolve));
  }
}
const loadScriptCache = {};
async function loadScript(src, globalName) {
  if (!globalName) return import(
    /* webpackIgnore: true */
    src
  );
  if (loadScriptCache[src]) return loadScriptCache[src];
  if (self[globalName]) return self[globalName];
  return loadScriptCache[src] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.defer = true;
    script.src = src;
    script.onload = () => resolve(self[globalName]);
    script.onerror = reject;
    document.head.append(script);
  });
}
let idCounter = 0;
function uniqueId(prefix) {
  const id = ++idCounter;
  return `${prefix}${id}`;
}
if (globalThis.customElements && !globalThis.customElements.get("wistia-video")) {
  globalThis.customElements.define("wistia-video", WistiaVideoElement);
}
var wistia_video_element_default = WistiaVideoElement;


;// ../node_modules/wistia-video-element/dist/react.js
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
  tagName: "wistia-video",
  elementClass: wistia_video_element_default,
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