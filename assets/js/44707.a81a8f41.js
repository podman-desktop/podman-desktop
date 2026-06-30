"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[44707],{

/***/ 44707
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureNodeSizes: () => (/* binding */ captureNodeSizes)
/* harmony export */ });
/* unused harmony export shouldCaptureSizes */
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54681);


// src/rendering-util/layout-algorithms/ddlt/captureContract.ts
var DDLT_SIZE_CAPTURE_VERSION = 1;

// src/rendering-util/layout-algorithms/ddlt/sizeCapture.ts
function getCaptureGlobal() {
  if (typeof globalThis === "undefined") {
    return void 0;
  }
  return globalThis;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(getCaptureGlobal, "getCaptureGlobal");
function shouldCaptureSizes() {
  return Boolean(getCaptureGlobal()?.mermaidCaptureSizes);
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(shouldCaptureSizes, "shouldCaptureSizes");
function capturedFromLocation() {
  if (typeof location === "undefined") {
    return "browser-dev";
  }
  return `${location.pathname}${location.search}`;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(capturedFromLocation, "capturedFromLocation");
function emitCapturedSizes(captured, element) {
  const g = getCaptureGlobal();
  if (!g) {
    return;
  }
  const domNode = element.node();
  const ownerSvg = (domNode && "ownerSVGElement" in domNode ? domNode.ownerSVGElement : null) ?? domNode;
  const svgId = ownerSvg?.id ?? "(unknown)";
  g.mermaidCapturedSizes ??= [];
  const entry = { svgId, sizes: captured };
  g.mermaidCapturedSizes.push(entry);
  g.mermaidLastCapturedSizes = entry;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(emitCapturedSizes, "emitCapturedSizes");
function captureNodeSizes(element, data4Layout) {
  const nodes = [];
  for (const node of data4Layout.nodes) {
    if (node.isGroup) {
      continue;
    }
    nodes.push({ id: node.id, width: node.width ?? 0, height: node.height ?? 0 });
  }
  if (nodes.length === 0) {
    return;
  }
  emitCapturedSizes(
    {
      metadata: {
        captureVersion: DDLT_SIZE_CAPTURE_VERSION,
        capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
        capturedFrom: capturedFromLocation()
      },
      nodes
    },
    element
  );
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(captureNodeSizes, "captureNodeSizes");



/***/ }

}]);