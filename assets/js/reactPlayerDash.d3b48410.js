"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[6395],{

/***/ 20090
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

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
// EXTERNAL MODULE: ../node_modules/media-tracks/dist/index.js + 12 modules
var dist = __webpack_require__(39837);
;// ../node_modules/dash-video-element/dist/dash-video-element.js


class DashVideoElement extends (0,dist/* MediaTracksMixin */.u6)(custom_media_element/* CustomVideoElement */.lB) {
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
  async _initThumbnails(representation) {
    const generateAllCues = async (totalThumbnails2, thumbnailDuration2) => {
      const promises = [];
      const timescale = representation.timescale || 1;
      const startNumber = representation.startNumber || 1;
      const pto = representation.presentationTimeOffset ? representation.presentationTimeOffset / timescale : 0;
      const tduration = representation.segmentDuration;
      for (let thIndex = 0; thIndex < totalThumbnails2; thIndex++) {
        const startTime = calculateThumbnailStartTime({
          thIndex,
          thduration: thumbnailDuration2,
          ttiles: totalThumbnails2,
          tduration,
          startNumber,
          pto
        });
        const endTime = startTime + thumbnailDuration2;
        const promise = new Promise((resolve, reject) => {
          this.api.provideThumbnail(startTime, ({ url, width, height, x, y }) => {
            try {
              const cue = new VTTCue(
                startTime,
                endTime,
                `${url}#xywh=${x},${y},${width},${height}`
              );
              resolve(cue);
            } catch (err) {
              reject(err);
            }
          });
        });
        promises.push(promise);
      }
      return await Promise.all(promises).catch((e) => console.error("Error processing thumbnails", e));
    };
    const { totalThumbnails, thumbnailDuration } = calculateThumbnailTimes(representation);
    const cues = await generateAllCues(totalThumbnails, thumbnailDuration);
    let track = this.nativeEl.querySelector('track[label="thumbnails"]');
    if (!track) {
      track = createThumbnailTrack();
      this.nativeEl.appendChild(track);
      const vttUrl = cuesToVttBlobUrl(cues);
      track.src = vttUrl;
      track.dispatchEvent(new Event("change"));
    }
  }
  async load() {
    if (this.#apiInit) {
      this.api.attachSource(this.src);
      return;
    }
    this.#apiInit = true;
    const Dash = await __webpack_require__.e(/* import() */ 59149).then(__webpack_require__.bind(__webpack_require__, 59149));
    this.api = Dash.MediaPlayer().create();
    this.api.initialize(this.nativeEl, this.src, this.autoplay);
    this.api.on(Dash.MediaPlayer.events.STREAM_INITIALIZED, () => {
      const bitrateList = this.api.getRepresentationsByType("video");
      let videoTrack = this.videoTracks.getTrackById("main");
      if (!videoTrack) {
        videoTrack = this.addVideoTrack("main");
        videoTrack.id = "main";
        videoTrack.selected = true;
      }
      bitrateList.forEach((rep) => {
        const bitrate = rep.bandwidth ?? rep.bitrate ?? (Number.isFinite(rep.bitrateInKbit) ? rep.bitrateInKbit * 1e3 : void 0);
        const rendition = videoTrack.addRendition(rep.id, rep.width, rep.height, rep.mimeType ?? rep.codec, bitrate);
        rendition.id = rep.id;
      });
      this.videoRenditions.addEventListener("change", () => {
        const selected = this.videoRenditions[this.videoRenditions.selectedIndex];
        if (selected == null ? void 0 : selected.id) {
          this.api.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
          this.api.setRepresentationForTypeById("video", selected.id, true);
        } else {
          this.api.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
        }
      });
      if (!this.api.isDynamic()) {
        const imageReps = this.api.getRepresentationsByType("image");
        imageReps.forEach(async (rep, idx) => {
          if (idx > 0) return;
          this._initThumbnails(rep);
        });
      }
    });
  }
}
function calculateThumbnailTimes(representation) {
  var _a, _b;
  const essentialProp = representation.essentialProperties[0];
  const [htiles, vtiles] = essentialProp.value.split("x").map(Number);
  const ttiles = htiles * vtiles;
  const periodDuration = ((_b = (_a = representation.adaptation) == null ? void 0 : _a.period) == null ? void 0 : _b.duration) || null;
  const tileDuration = representation.segmentDuration;
  const timescale = representation.timescale || 1;
  const tduration = tileDuration / timescale;
  const thduration = tduration / ttiles;
  const totalThumbnails = periodDuration != null ? Math.ceil(periodDuration / thduration) : Math.ceil(tileDuration / thduration);
  return { totalThumbnails, thumbnailDuration: thduration };
}
function calculateThumbnailStartTime({ thIndex, tduration, thduration, ttiles, startNumber, pto }) {
  const tnumber = Math.floor(thIndex / ttiles) + startNumber;
  const thnumber = thIndex % ttiles + 1;
  const tileStartTime = (tnumber - 1) * tduration - pto;
  const thumbnailStartTime = (thnumber - 1) * thduration;
  return tileStartTime + thumbnailStartTime;
}
function createThumbnailTrack() {
  const track = document.createElement("track");
  track.kind = "metadata";
  track.label = "thumbnails";
  track.srclang = "en";
  track.mode = "hidden";
  track.default = true;
  return track;
}
function cuesToVttBlobUrl(cues) {
  let vtt = "WEBVTT\n\n";
  for (const cue of cues) {
    vtt += `${formatTime(cue.startTime)} --> ${formatTime(cue.endTime)}
`;
    vtt += `${cue.text}

`;
  }
  const blob = new Blob([vtt], { type: "text/vtt" });
  return URL.createObjectURL(blob);
  function formatTime(t) {
    const h = String(Math.floor(t / 3600)).padStart(2, "0");
    const m = String(Math.floor(t % 3600 / 60)).padStart(2, "0");
    const s = (t % 60).toFixed(3).padStart(6, "0");
    return `${h}:${m}:${s}`;
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


/***/ }

}]);