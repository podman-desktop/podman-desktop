"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[95740],{

/***/ 30184
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ ImperativeState)
/* harmony export */ });
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54681);


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
    (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(this, "ImperativeState");
  }
  reset() {
    this.records = this.init();
  }
};




/***/ },

/***/ 47776
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ populateCommonDb)
/* harmony export */ });
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54681);


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
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(populateCommonDb, "populateCommonDb");




/***/ },

/***/ 95740
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _chunk_2Q5K7J3B_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30184);
/* harmony import */ var _chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(47776);
/* harmony import */ var _chunk_VAUOI2AC_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28029);
/* harmony import */ var _chunk_HOUHSVGY_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67119);
/* harmony import */ var _chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(86924);
/* harmony import */ var _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(79773);
/* harmony import */ var _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(16055);
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(54681);
/* harmony import */ var _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5165);









// src/diagrams/treeView/parser.ts


// src/diagrams/treeView/boxDrawingPreprocessor.ts
var ALL_BOX_CHARS = /[─━│┃└┗├┣]/;
var BRANCH_CHAR = /[└┗├┣]/;
var DASH_CHAR = /[─━]/;
var DECORATION_ONLY = /^[\s│┃]+$/;
var METADATA_LINE = /^\s*(title[\t ]|accTitle[\t ]*:|accDescr[\t ]*[:{])/;
var COMMENT_LINE = /^\s*%%/;
var INDENT_UNIT = "    ";
function isBoxDrawingFormat(lines) {
  return lines.some((line) => ALL_BOX_CHARS.test(line));
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(isBoxDrawingFormat, "isBoxDrawingFormat");
function inferSegmentWidth(contentLines) {
  for (const line of contentLines) {
    const match = BRANCH_CHAR.exec(line);
    if (match?.index && match.index > 0) {
      return match.index;
    }
  }
  return 4;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(inferSegmentWidth, "inferSegmentWidth");
function remapErrorLines(message, lineMap) {
  return message.replace(/\bline\s+(\d+)\b/gi, (match, lineStr) => {
    const line = parseInt(lineStr, 10);
    const original = lineMap.get(line);
    return original ? `line ${original}` : match;
  });
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(remapErrorLines, "remapErrorLines");
function preprocessBoxDrawing(input) {
  const lines = input.split("\n");
  const lineMap = /* @__PURE__ */ new Map();
  let keywordIdx = -1;
  for (const [i, line] of lines.entries()) {
    if (line.trim() === "treeView-beta") {
      keywordIdx = i;
      break;
    }
  }
  if (keywordIdx === -1) {
    return { text: input, lineMap };
  }
  const contentLineTexts = [];
  for (let i = keywordIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === "" || COMMENT_LINE.test(line) || METADATA_LINE.test(line)) {
      continue;
    }
    if (DECORATION_ONLY.test(line)) {
      continue;
    }
    contentLineTexts.push(line.replace(/\t/g, "    "));
  }
  if (!isBoxDrawingFormat(contentLineTexts)) {
    return { text: input, lineMap };
  }
  const segmentWidth = inferSegmentWidth(contentLineTexts);
  const outputLines = [];
  let outLineNo = 0;
  for (let i = 0; i <= keywordIdx; i++) {
    outputLines.push(lines[i]);
    outLineNo++;
    lineMap.set(outLineNo, i + 1);
  }
  for (let i = keywordIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const origLineNo = i + 1;
    if (trimmed === "") {
      outputLines.push(line);
      outLineNo++;
      lineMap.set(outLineNo, origLineNo);
      continue;
    }
    if (COMMENT_LINE.test(line)) {
      outputLines.push(line);
      outLineNo++;
      lineMap.set(outLineNo, origLineNo);
      continue;
    }
    if (METADATA_LINE.test(line)) {
      outputLines.push(line);
      outLineNo++;
      lineMap.set(outLineNo, origLineNo);
      continue;
    }
    if (DECORATION_ONLY.test(line)) {
      continue;
    }
    const normalized = line.replace(/\t/g, "    ");
    const branchMatch = BRANCH_CHAR.exec(normalized);
    if (branchMatch?.index !== void 0) {
      const branchCol = branchMatch.index;
      const depth = Math.round(branchCol / segmentWidth) + 1;
      let pos = branchCol + 1;
      while (pos < normalized.length && DASH_CHAR.test(normalized[pos])) {
        pos++;
      }
      while (pos < normalized.length && normalized[pos] === " ") {
        pos++;
      }
      const content = normalized.slice(pos).trimEnd();
      if (!content) {
        throw new Error(
          `Line ${origLineNo}: Empty node \u2014 expected a filename or directory name after the box-drawing prefix`
        );
      }
      const indent = INDENT_UNIT.repeat(depth);
      outputLines.push(indent + content);
      outLineNo++;
      lineMap.set(outLineNo, origLineNo);
    } else if (/^[\s─━│┃└┗├┣]+$/.test(normalized)) {
      continue;
    } else if (ALL_BOX_CHARS.test(normalized)) {
      outputLines.push(line);
      outLineNo++;
      lineMap.set(outLineNo, origLineNo);
    } else if (/^\s+/.test(normalized)) {
      throw new Error(
        `Line ${origLineNo}: Unexpected indentation without box-drawing characters. In box-drawing format, use \u251C\u2500\u2500 or \u2514\u2500\u2500 prefixes for indented nodes.`
      );
    } else {
      outputLines.push(line);
      outLineNo++;
      lineMap.set(outLineNo, origLineNo);
    }
  }
  return { text: outputLines.join("\n"), lineMap };
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(preprocessBoxDrawing, "preprocessBoxDrawing");

// src/diagrams/treeView/db.ts
var state = new _chunk_2Q5K7J3B_mjs__WEBPACK_IMPORTED_MODULE_0__/* .ImperativeState */ .m(() => ({
  cnt: 1,
  stack: [
    {
      id: 0,
      level: -1,
      name: "/",
      nodeType: "directory",
      children: []
    }
  ]
}));
var clear2 = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(() => {
  state.reset();
  (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .clear */ .IU)();
}, "clear");
var getRoot = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(() => {
  return state.records.stack[0];
}, "getRoot");
var getCount = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(() => state.records.cnt, "getCount");
var defaultConfig = _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .defaultConfig_default */ .UI.treeView;
var getConfig2 = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(() => {
  return (0,_chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_4__/* .cleanAndMerge */ .$t)(defaultConfig, (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .getConfig */ .zj)().treeView);
}, "getConfig");
var addNode = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((level, name, nodeType, cssClass, icon, description) => {
  while (level <= state.records.stack[state.records.stack.length - 1].level) {
    state.records.stack.pop();
  }
  const node = {
    id: state.records.cnt++,
    level,
    name,
    nodeType,
    icon,
    cssClass,
    description,
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
  getAccTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .getAccTitle */ .iN,
  getAccDescription: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .getAccDescription */ .m7,
  getDiagramTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .getDiagramTitle */ .ab,
  setAccDescription: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .setAccDescription */ .EI,
  setAccTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .setAccTitle */ .SV,
  setDiagramTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .setDiagramTitle */ .ke
};
var db_default = db;

// src/diagrams/treeView/parser.ts
var populate = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((ast) => {
  (0,_chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_1__/* .populateCommonDb */ .S)(ast, db_default);
  for (const node of ast.nodes) {
    const level = typeof node.indent === "number" ? node.indent : 0;
    let name = node.name;
    const isDirectory = name.endsWith("/");
    if (isDirectory) {
      name = name.slice(0, -1);
    }
    const nodeType = isDirectory ? "directory" : "file";
    const cssClass = node.classAnnotation || void 0;
    const rawIcon = node.iconAnnotation;
    const icon = rawIcon !== void 0 ? rawIcon || "none" : void 0;
    const rawDesc = node.descAnnotation || void 0;
    const description = rawDesc ? (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .sanitizeText */ .jZ)(rawDesc, (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .getConfig */ .zj)()) : void 0;
    db_default.addNode(level, name, nodeType, cssClass, icon, description);
  }
}, "populate");
var parser = {
  parse: /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(async (input) => {
    const { text, lineMap } = preprocessBoxDrawing(input);
    try {
      const ast = await (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_8__/* .parse */ .qg)("treeView", text);
      _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_6__/* .log */ .R.debug(ast);
      populate(ast);
    } catch (error) {
      if (lineMap.size > 0 && error instanceof Error) {
        error.message = remapErrorLines(error.message, lineMap);
      }
      throw error;
    }
  }, "parse")
};

// src/diagrams/treeView/icons.ts
var treeViewIcons = {
  prefix: "mermaid-treeview",
  height: 24,
  width: 24,
  icons: {
    folder: {
      body: '<path fill="currentColor" d="M10.59 4.59A2 2 0 0 0 9.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.17z"/>'
    },
    file: {
      body: '<path fill="currentColor" fill-rule="evenodd" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.42l-4.82-4.82A2 2 0 0 0 13.17 2H6Zm7.5 1.9l4.6 4.6h-3.6a1 1 0 0 1-1-1V3.9Z" clip-rule="evenodd"/>'
    }
  }
};
function detectIcon(name, config) {
  const filenameIcon = config?.filenameIcons?.[name];
  if (filenameIcon) {
    return filenameIcon;
  }
  const dotIdx = name.lastIndexOf(".");
  if (dotIdx > 0) {
    const ext = name.substring(dotIdx).toLowerCase();
    const extensionIcons = config?.extensionIcons;
    return extensionIcons?.[ext] ?? extensionIcons?.[ext.slice(1)];
  }
  return void 0;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(detectIcon, "detectIcon");
function qualifyIcon(icon, defaultIconPack) {
  if (icon.includes(":")) {
    return icon;
  }
  if (icon in treeViewIcons.icons || !defaultIconPack) {
    return `${treeViewIcons.prefix}:${icon}`;
  }
  return `${defaultIconPack}:${icon}`;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(qualifyIcon, "qualifyIcon");
function getNodeIcon(node, config) {
  if (node.icon === "none") {
    return void 0;
  }
  if (node.icon) {
    return qualifyIcon(node.icon, config.defaultIconPack);
  }
  if (!config.showIcons) {
    return void 0;
  }
  if (node.nodeType === "file") {
    const detected = detectIcon(node.name, config);
    if (detected === "none") {
      return void 0;
    }
    if (detected) {
      return qualifyIcon(detected, config.defaultIconPack);
    }
  }
  return `${treeViewIcons.prefix}:${node.nodeType === "directory" ? "folder" : "file"}`;
}
(0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(getNodeIcon, "getNodeIcon");

// src/diagrams/treeView/renderer.ts
(0,_chunk_HOUHSVGY_mjs__WEBPACK_IMPORTED_MODULE_3__/* .registerIconPacks */ .pC)([
  {
    name: treeViewIcons.prefix,
    icons: treeViewIcons
  }
]);
var ICON_SIZE = 14;
var ICON_GAP = 4;
var DESC_GAP = 16;
var iconSymbolId = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((diagramId, icon) => `tv-icon-${diagramId}-${icon.replace(/[^\w-]/g, "-")}`, "iconSymbolId");
var injectIconDefs = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(async (svg, root, config, diagramId) => {
  const usedIcons = /* @__PURE__ */ new Set();
  const collect = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((node) => {
    const icon = getNodeIcon(node, config);
    if (icon) {
      usedIcons.add(icon);
    }
    node.children.forEach(collect);
  }, "collect");
  collect(root);
  if (usedIcons.size === 0) {
    return;
  }
  const iconSVGs = await Promise.all(
    [...usedIcons].map(async (icon) => ({
      icon,
      svg: await (0,_chunk_HOUHSVGY_mjs__WEBPACK_IMPORTED_MODULE_3__/* .getIconSVG */ .WY)(icon, {
        height: ICON_SIZE,
        width: ICON_SIZE
      })
    }))
  );
  const defs = svg.append("defs");
  for (const { icon, svg: iconSVG } of iconSVGs) {
    defs.append("g").attr("id", iconSymbolId(diagramId, icon)).html(iconSVG);
  }
}, "injectIconDefs");
var positionLabel = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((x, y, node, domElem, config, diagramId) => {
  const nodeGroup = domElem.append("g");
  let cssClasses = "treeView-node-label";
  if (node.nodeType === "directory") {
    cssClasses += " treeView-node-dir";
  }
  if (node.cssClass) {
    cssClasses += ` ${node.cssClass}`;
  }
  const iconOffset = ICON_SIZE + ICON_GAP;
  const icon = getNodeIcon(node, config);
  const showIcon = icon !== void 0;
  if (icon) {
    nodeGroup.append("use").attr("xlink:href", `#${iconSymbolId(diagramId, icon)}`).attr("x", x + config.paddingX).attr("y", y + config.paddingY).attr("class", "treeView-node-icon");
  }
  const label = nodeGroup.append("text").text(node.name).attr("dominant-baseline", "middle").attr("class", cssClasses);
  const { height: labelHeight, width: labelWidth } = label.node().getBBox();
  const height = labelHeight + config.paddingY * 2;
  const labelX = x + config.paddingX + (showIcon ? iconOffset : 0);
  label.attr("x", labelX);
  label.attr("y", y + height / 2);
  const labelRightEdge = labelX + labelWidth;
  const width = labelWidth + config.paddingX * 2 + (showIcon ? iconOffset : 0);
  node.BBox = { x, y, width, height };
  if (node.cssClass?.split(/\s+/).includes("highlight")) {
    nodeGroup.insert("rect", ":first-child").attr("x", x).attr("y", y + 1).attr("width", 0).attr("height", height - 2).attr("rx", 3).attr("class", "treeView-highlight-bg");
  }
  return { node, nodeGroup, labelRightEdge, centerY: y + height / 2 };
}, "positionLabel");
var positionLine = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((domElem, x1, y1, x2, y2, lineThickness) => {
  return domElem.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke-width", lineThickness).attr("class", "treeView-node-line");
}, "positionLine");
var drawTree = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((elem, root, config, diagramId) => {
  let totalHeight = 0;
  let totalWidth = 0;
  const renderInfos = [];
  const drawNode = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((elem2, node, config2, depth) => {
    const indent = depth * (config2.rowIndent + config2.paddingX);
    const info = positionLabel(indent, totalHeight, node, elem2, config2, diagramId);
    renderInfos.push(info);
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
  const processNode = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)((node, depth = 0) => {
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
  const nodesWithDesc = renderInfos.filter((ri) => ri.node.description);
  if (nodesWithDesc.length > 0) {
    const maxLabelRight = Math.max(...renderInfos.map((ri) => ri.labelRightEdge));
    const descX = maxLabelRight + DESC_GAP;
    for (const ri of nodesWithDesc) {
      const desc = ri.nodeGroup.append("text").text(ri.node.description).attr("dominant-baseline", "middle").attr("class", "treeView-node-description").attr("x", descX).attr("y", ri.centerY);
      const descBBox = desc.node().getBBox();
      totalWidth = Math.max(totalWidth, descX + descBBox.width + config.paddingX);
    }
  }
  for (const ri of renderInfos) {
    if (ri.node.cssClass?.split(/\s+/).includes("highlight")) {
      const rect = ri.nodeGroup.select(".treeView-highlight-bg");
      if (!rect.empty()) {
        const rectWidth = totalWidth - ri.node.BBox.x + 8;
        rect.attr("width", rectWidth);
        totalWidth = Math.max(totalWidth, ri.node.BBox.x + rectWidth + 2);
      }
    }
  }
  return { totalHeight, totalWidth };
}, "drawTree");
var draw = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(async (text, id, _ver, diagObj) => {
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_6__/* .log */ .R.debug("Rendering treeView diagram\n" + text);
  const db2 = diagObj.db;
  const root = db2.getRoot();
  const config = db2.getConfig();
  const svg = (0,_chunk_VAUOI2AC_mjs__WEBPACK_IMPORTED_MODULE_2__/* .selectSvgElement */ .D)(id);
  await injectIconDefs(svg, root, config, id);
  const treeElem = svg.append("g");
  treeElem.attr("class", "tree-view");
  const { totalHeight, totalWidth } = drawTree(treeElem, root, config, id);
  svg.attr("viewBox", `-${config.lineThickness / 2} 0 ${totalWidth} ${totalHeight}`);
  (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_5__/* .configureSvgSize */ .a$)(svg, totalHeight, totalWidth, config.useMaxWidth);
}, "draw");
var renderer = {
  draw
};
var renderer_default = renderer;

// src/diagrams/treeView/styles.ts
var defaultTreeViewDiagramStyles = {
  labelFontSize: "16px",
  labelColor: "black",
  lineColor: "black",
  iconColor: "#546e7a",
  descriptionColor: "#6a9955",
  highlightBg: "rgba(255, 193, 7, 0.15)",
  highlightStroke: "#ffc107"
};
var styles = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_7__/* .__name */ .K)(({
  treeView
}) => {
  const {
    labelFontSize,
    labelColor,
    lineColor,
    iconColor,
    descriptionColor,
    highlightBg,
    highlightStroke
  } = (0,_chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_4__/* .cleanAndMerge */ .$t)(defaultTreeViewDiagramStyles, treeView);
  return `
    .treeView-node-label {
        font-size: ${labelFontSize};
        fill: ${labelColor};
        white-space: pre;
    }
    .treeView-node-dir {
        font-weight: bold;
    }
    .treeView-node-line {
        stroke: ${lineColor};
    }
    .treeView-node-icon {
        color: ${iconColor};
    }
    .treeView-node-description {
        font-size: ${labelFontSize};
        fill: ${descriptionColor};
        font-style: italic;
        white-space: pre;
    }
    .treeView-highlight-bg {
        fill: ${highlightBg};
        stroke: ${highlightStroke};
        stroke-width: 1;
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