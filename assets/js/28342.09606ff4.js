"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[28342],{

/***/ 78169
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ populateCommonDb)
/* harmony export */ });
/* harmony import */ var _chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2155);


// src/diagrams/common/populateCommonDb.ts
function populateCommonDb(ast, db) {
  if (ast.accDescr) {
    db.setAccDescription?.(ast.accDescr);
  }
  if (ast.accTitle) {
    db.setAccTitle?.(ast.accTitle);
  }
  if (ast.title) {
    db.setDiagramTitle?.(ast.title);
  }
}
(0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K2)(populateCommonDb, "populateCommonDb");




/***/ },

/***/ 45740
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ ImperativeState)
/* harmony export */ });
/* harmony import */ var _chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2155);


// src/utils/imperativeState.ts
var ImperativeState = class {
  /**
   * @param init - Function that creates the default state.
   */
  constructor(init) {
    this.init = init;
    this.records = this.init();
  }
  static {
    (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K2)(this, "ImperativeState");
  }
  reset() {
    this.records = this.init();
  }
};




/***/ },

/***/ 28342
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _chunk_WU5MYG2G_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(77444);
/* harmony import */ var _chunk_4BX2VUAB_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78169);
/* harmony import */ var _chunk_QZHKN3VN_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(45740);
/* harmony import */ var _chunk_5ZQYHXKU_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(29377);
/* harmony import */ var _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(21612);
/* harmony import */ var _chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2155);
/* harmony import */ var _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5165);







// src/diagrams/treeView/db.ts
var state = new _chunk_QZHKN3VN_mjs__WEBPACK_IMPORTED_MODULE_2__/* .ImperativeState */ .m(() => ({
  cnt: 1,
  stack: [
    {
      id: 0,
      level: -1,
      name: "/",
      children: []
    }
  ]
}));
var clear2 = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)(() => {
  state.reset();
  (0,_chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .clear */ .IU)();
}, "clear");
var getRoot = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)(() => {
  return state.records.stack[0];
}, "getRoot");
var getCount = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)(() => state.records.cnt, "getCount");
var defaultConfig = _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .defaultConfig_default */ .UI.treeView;
var getConfig2 = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)(() => {
  return (0,_chunk_5ZQYHXKU_mjs__WEBPACK_IMPORTED_MODULE_3__/* .cleanAndMerge */ .$t)(defaultConfig, (0,_chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getConfig */ .zj)().treeView);
}, "getConfig");
var addNode = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((level, name) => {
  while (level <= state.records.stack[state.records.stack.length - 1].level) {
    state.records.stack.pop();
  }
  const node = {
    id: state.records.cnt++,
    level,
    name,
    children: []
  };
  state.records.stack[state.records.stack.length - 1].children.push(node);
  state.records.stack.push(node);
}, "addNode");
var db = {
  clear: clear2,
  addNode,
  getRoot,
  getCount,
  getConfig: getConfig2,
  getAccTitle: _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getAccTitle */ .iN,
  getAccDescription: _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getAccDescription */ .m7,
  getDiagramTitle: _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .getDiagramTitle */ .ab,
  setAccDescription: _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .setAccDescription */ .EI,
  setAccTitle: _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .setAccTitle */ .SV,
  setDiagramTitle: _chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .setDiagramTitle */ .ke
};
var db_default = db;

// src/diagrams/treeView/parser.ts

var populate = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((ast) => {
  (0,_chunk_4BX2VUAB_mjs__WEBPACK_IMPORTED_MODULE_1__/* .populateCommonDb */ .S)(ast, db_default);
  ast.nodes.map((node) => db_default.addNode(node.indent ? parseInt(node.indent) : 0, node.name));
}, "populate");
var parser = {
  parse: /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)(async (input) => {
    const ast = await (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .parse */ .qg)("treeView", input);
    _chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .log */ .Rm.debug(ast);
    populate(ast);
  }, "parse")
};

// src/diagrams/treeView/renderer.ts
var positionLabel = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((x, y, node, domElem, config) => {
  const label = domElem.append("text").text(node.name).attr("dominant-baseline", "middle").attr("class", "treeView-node-label");
  const { height: labelHeight, width: labelWidth } = label.node().getBBox();
  const height = labelHeight + config.paddingY * 2;
  const width = labelWidth + config.paddingX * 2;
  label.attr("x", x + config.paddingX);
  label.attr("y", y + height / 2);
  node.BBox = {
    x,
    y,
    width,
    height
  };
}, "positionLabel");
var positionLine = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((domElem, x1, y1, x2, y2, lineThickness) => {
  return domElem.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke-width", lineThickness).attr("class", "treeView-node-line");
}, "positionLine");
var drawTree = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((elem, root, config) => {
  let totalHeight = 0;
  let totalWidth = 0;
  const drawNode = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((elem2, node, config2, depth) => {
    const indent = depth * (config2.rowIndent + config2.paddingX);
    positionLabel(indent, totalHeight, node, elem2, config2);
    const { height, width } = node.BBox;
    positionLine(
      elem2,
      indent - config2.rowIndent,
      totalHeight + height / 2,
      indent,
      totalHeight + height / 2,
      config2.lineThickness
    );
    totalWidth = Math.max(totalWidth, indent + width);
    totalHeight += height;
  }, "drawNode");
  const processNode = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((node, depth = 0) => {
    drawNode(elem, node, config, depth);
    node.children.forEach((child) => {
      processNode(child, depth + 1);
    });
    const { x, y, height } = node.BBox;
    if (node.children.length) {
      const { y: endY, height: endHeight } = node.children[node.children.length - 1].BBox;
      positionLine(
        elem,
        x + config.paddingX,
        y + height,
        x + config.paddingX,
        endY + endHeight / 2 + config.lineThickness / 2,
        config.lineThickness
      );
    }
  }, "processNode");
  processNode(root);
  return { totalHeight, totalWidth };
}, "drawTree");
var draw = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)((text, id, _ver, diagObj) => {
  _chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .log */ .Rm.debug("Rendering treeView diagram\n" + text);
  const db2 = diagObj.db;
  const root = db2.getRoot();
  const config = db2.getConfig();
  const svg = (0,_chunk_WU5MYG2G_mjs__WEBPACK_IMPORTED_MODULE_0__/* .selectSvgElement */ .D)(id);
  const treeElem = svg.append("g");
  treeElem.attr("class", "tree-view");
  const { totalHeight, totalWidth } = drawTree(treeElem, root, config);
  svg.attr("viewBox", `-${config.lineThickness / 2} 0 ${totalWidth} ${totalHeight}`);
  (0,_chunk_CSCIHK7Q_mjs__WEBPACK_IMPORTED_MODULE_4__/* .configureSvgSize */ .a$)(svg, totalHeight, totalWidth, config.useMaxWidth);
}, "draw");
var renderer = {
  draw
};
var renderer_default = renderer;

// src/diagrams/treeView/styles.ts
var defaultTreeViewDiagramStyles = {
  labelFontSize: "16px",
  labelColor: "black",
  lineColor: "black"
};
var styles = /* @__PURE__ */ (0,_chunk_AGHRB4JF_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K2)(({
  treeView
}) => {
  const { labelFontSize, labelColor, lineColor } = (0,_chunk_5ZQYHXKU_mjs__WEBPACK_IMPORTED_MODULE_3__/* .cleanAndMerge */ .$t)(
    defaultTreeViewDiagramStyles,
    treeView
  );
  return `
    .treeView-node-label {
        font-size: ${labelFontSize};
        fill: ${labelColor};
    }
    .treeView-node-line {
        stroke: ${lineColor};
    }
    `;
}, "styles");
var styles_default = styles;

// src/diagrams/treeView/diagram.ts
var diagram = {
  db: db_default,
  renderer: renderer_default,
  parser,
  styles: styles_default
};



/***/ }

}]);