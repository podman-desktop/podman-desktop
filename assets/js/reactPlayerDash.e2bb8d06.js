"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[6395],{

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

/***/ 20090:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ react_react_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/custom-media-element/dist/custom-media-element.js
var custom_media_element = __webpack_require__(12495);
;// ../node_modules/dash-video-element/dist/dash-video-element.js

class DashVideoElement extends custom_media_element/* CustomVideoElement */.lB {
  static shadowRootOptions = { ...custom_media_element/* CustomVideoElement */.lB.shadowRootOptions };
  static getTemplateHTML = (attrs) => {
    const { src, ...rest } = attrs;
    return custom_media_element/* CustomVideoElement */.lB.getTemplateHTML(rest);
  };
  #apiInit;
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName !== "src") {
      super.attributeChangedCallback(attrName, oldValue, newValue);
    }
    if (attrName === "src" && oldValue != newValue) {
      this.load();
    }
  }
  async load() {
    if (!this.#apiInit) {
      this.#apiInit = true;
      const Dash = await __webpack_require__.e(/* import() */ 59149).then(__webpack_require__.bind(__webpack_require__, 59149));
      this.api = Dash.MediaPlayer().create();
      this.api.initialize(this.nativeEl, this.src, this.autoplay);
    } else {
      this.api.attachSource(this.src);
    }
  }
}
if (globalThis.customElements && !globalThis.customElements.get("dash-video")) {
  globalThis.customElements.define("dash-video", DashVideoElement);
}
var dash_video_element_default = DashVideoElement;


;// ../node_modules/dash-video-element/dist/react.js
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
      if (k in elementClass.prototype && !(k in (((_a = globalThis.HTMLElement) == null ? void 0 : _a.prototype) ?? {})) && !((_b = elementClass.observedAttributes) == null ? void 0 : _b.some((attr) => attr === attrName))) {
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
  tagName: "dash-video",
  elementClass: dash_video_element_default,
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