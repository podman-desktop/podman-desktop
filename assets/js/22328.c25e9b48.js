"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[22328],{

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

/***/ 22328
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47776);
/* harmony import */ var _chunk_VAUOI2AC_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28029);
/* harmony import */ var _chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(86924);
/* harmony import */ var _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(79773);
/* harmony import */ var _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16055);
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(54681);
/* harmony import */ var _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5165);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(47777);







// src/diagrams/pie/pieParser.ts


// src/diagrams/pie/pieDb.ts
var DEFAULT_PIE_CONFIG = _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .defaultConfig_default */ .UI.pie;
var DEFAULT_PIE_DB = {
  sections: /* @__PURE__ */ new Map(),
  showData: false,
  config: DEFAULT_PIE_CONFIG
};
var sections = DEFAULT_PIE_DB.sections;
var showData = DEFAULT_PIE_DB.showData;
var config = structuredClone(DEFAULT_PIE_CONFIG);
var getConfig2 = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)(() => structuredClone(config), "getConfig");
var clear2 = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)(() => {
  sections = /* @__PURE__ */ new Map();
  showData = DEFAULT_PIE_DB.showData;
  (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .clear */ .IU)();
}, "clear");
var addSection = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)(({ label, value }) => {
  if (value < 0) {
    throw new Error(
      `"${label}" has invalid value: ${value}. Negative values are not allowed in pie charts. All slice values must be >= 0.`
    );
  }
  if (!sections.has(label)) {
    sections.set(label, value);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug(`added new section: ${label}, with value: ${value}`);
  }
}, "addSection");
var getSections = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)(() => sections, "getSections");
var setShowData = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((toggle) => {
  showData = toggle;
}, "setShowData");
var getShowData = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)(() => showData, "getShowData");
var db = {
  getConfig: getConfig2,
  clear: clear2,
  setDiagramTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .setDiagramTitle */ .ke,
  getDiagramTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .getDiagramTitle */ .ab,
  setAccTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .setAccTitle */ .SV,
  getAccTitle: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .getAccTitle */ .iN,
  setAccDescription: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .setAccDescription */ .EI,
  getAccDescription: _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .getAccDescription */ .m7,
  addSection,
  getSections,
  setShowData,
  getShowData
};

// src/diagrams/pie/pieParser.ts
var populateDb = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((ast, db2) => {
  (0,_chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_0__/* .populateCommonDb */ .S)(ast, db2);
  db2.setShowData(ast.showData);
  ast.sections.map(db2.addSection);
}, "populateDb");
var parser = {
  parse: /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)(async (input) => {
    const ast = await (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .parse */ .qg)("pie", input);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug(ast);
    populateDb(ast, db);
  }, "parse")
};

// src/diagrams/pie/pieStyles.ts
var getStyles = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((options) => `
  .pieCircle{
    stroke: ${options.pieStrokeColor};
    stroke-width : ${options.pieStrokeWidth};
    opacity : ${options.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${options.pieOuterStrokeColor};
    stroke-width: ${options.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${options.pieTitleTextSize};
    fill: ${options.pieTitleTextColor};
    font-family: ${options.fontFamily};
  }
  .slice {
    font-family: ${options.fontFamily};
    fill: ${options.pieSectionTextColor};
    font-size:${options.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${options.pieLegendTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.pieLegendTextSize};
  }
`, "getStyles");
var pieStyles_default = getStyles;

// src/diagrams/pie/pieRenderer.ts

var createPieArcs = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((sections2) => {
  const sum = [...sections2.values()].reduce((acc, val) => acc + val, 0);
  const pieData = [...sections2.entries()].map(([label, value]) => ({ label, value })).filter((d) => d.value / sum * 100 >= 1);
  const pie = (0,d3__WEBPACK_IMPORTED_MODULE_7__/* .pie */ .rLf)().value((d) => d.value).sort(null);
  return pie(pieData);
}, "createPieArcs");
var draw = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((text, id, _version, diagObj) => {
  _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("rendering pie chart\n" + text);
  const db2 = diagObj.db;
  const globalConfig = (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .getConfig2 */ .D7)();
  const pieConfig = (0,_chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_2__/* .cleanAndMerge */ .$t)(db2.getConfig(), globalConfig.pie);
  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 18;
  const LEGEND_SPACING = 4;
  const height = 450;
  const pieWidth = height;
  const svg = (0,_chunk_VAUOI2AC_mjs__WEBPACK_IMPORTED_MODULE_1__/* .selectSvgElement */ .D)(id);
  const group = svg.append("g");
  group.attr("transform", "translate(" + pieWidth / 2 + "," + height / 2 + ")");
  const { themeVariables } = globalConfig;
  let [outerStrokeWidth] = (0,_chunk_ICXQ74PX_mjs__WEBPACK_IMPORTED_MODULE_2__/* .parseFontSize */ .I5)(themeVariables.pieOuterStrokeWidth);
  outerStrokeWidth ??= 2;
  const legendPosition = pieConfig.legendPosition;
  const textPosition = pieConfig.textPosition;
  const innerHole = pieConfig.donutHole > 0 && pieConfig.donutHole <= 0.9 ? pieConfig.donutHole : 0;
  const radius = Math.min(pieWidth, height) / 2 - MARGIN;
  const arcGenerator = (0,d3__WEBPACK_IMPORTED_MODULE_7__/* .arc */ .JLW)().innerRadius(innerHole * radius).outerRadius(radius);
  const labelArcGenerator = (0,d3__WEBPACK_IMPORTED_MODULE_7__/* .arc */ .JLW)().innerRadius(radius * textPosition).outerRadius(radius * textPosition);
  const pie = group.append("g");
  pie.append("circle").attr("cx", 0).attr("cy", 0).attr("r", radius + outerStrokeWidth / 2).attr("class", "pieOuterCircle");
  const sections2 = db2.getSections();
  const arcs = createPieArcs(sections2);
  const myGeneratedColors = [
    themeVariables.pie1,
    themeVariables.pie2,
    themeVariables.pie3,
    themeVariables.pie4,
    themeVariables.pie5,
    themeVariables.pie6,
    themeVariables.pie7,
    themeVariables.pie8,
    themeVariables.pie9,
    themeVariables.pie10,
    themeVariables.pie11,
    themeVariables.pie12
  ];
  let sum = 0;
  sections2.forEach((section) => {
    sum += section;
  });
  const filteredArcs = arcs.filter((datum) => (datum.data.value / sum * 100).toFixed(0) !== "0");
  const color = (0,d3__WEBPACK_IMPORTED_MODULE_7__/* .scaleOrdinal */ .UMr)(myGeneratedColors).domain([
    ...sections2.keys()
  ]);
  pie.selectAll("mySlices").data(filteredArcs).enter().append("path").attr("d", arcGenerator).attr("fill", (datum) => {
    return color(datum.data.label);
  }).attr("class", (datum) => {
    let className = "pieCircle";
    if (pieConfig.highlightSlice === "hover") {
      className += " highlightedOnHover";
    } else if (pieConfig.highlightSlice === datum.data.label) {
      className += " highlighted";
    }
    return className;
  });
  pie.selectAll("mySlices").data(filteredArcs).enter().append("text").text((datum) => {
    return (datum.data.value / sum * 100).toFixed(0) + "%";
  }).attr("transform", (datum) => {
    return "translate(" + labelArcGenerator.centroid(datum) + ")";
  }).style("text-anchor", "middle").attr("class", "slice");
  const titleText = group.append("text").text(db2.getDiagramTitle()).attr("x", 0).attr("y", -(height - 50) / 2).attr("class", "pieTitleText");
  const allSectionData = [...sections2.entries()].map(([label, value]) => ({
    label,
    value
  }));
  const legend = group.selectAll(".legend").data(allSectionData).enter().append("g").attr("class", "legend");
  legend.append("rect").attr("width", LEGEND_RECT_SIZE).attr("height", LEGEND_RECT_SIZE).style("fill", (d) => color(d.label)).style("stroke", (d) => color(d.label));
  legend.append("text").attr("x", LEGEND_RECT_SIZE + LEGEND_SPACING).attr("y", LEGEND_RECT_SIZE - LEGEND_SPACING).text((d) => {
    if (db2.getShowData()) {
      return `${d.label} [${d.value}]`;
    }
    return d.label;
  });
  const longestTextWidth = Math.max(
    ...legend.selectAll("text").nodes().map((node) => node?.getBoundingClientRect().width ?? 0)
  );
  let chartAndLegendHeight = height;
  let chartAndLegendWidth = pieWidth + MARGIN;
  const legendHeight = LEGEND_RECT_SIZE + LEGEND_SPACING;
  const totalLegendHeight = allSectionData.length * legendHeight;
  switch (legendPosition) {
    case "center":
      legend.attr("transform", (_datum, index) => {
        const offset = legendHeight * allSectionData.length / 2;
        const horizontal = -longestTextWidth / 2 - (LEGEND_RECT_SIZE + LEGEND_SPACING);
        const vertical = index * legendHeight - offset;
        return "translate(" + horizontal + "," + vertical + ")";
      });
      break;
    case "top":
      chartAndLegendHeight += totalLegendHeight;
      legend.attr("transform", (_datum, index) => {
        const offset = radius;
        const horizontal = -longestTextWidth / 2 - (LEGEND_RECT_SIZE + LEGEND_SPACING);
        const vertical = index * legendHeight - offset;
        return `translate(${horizontal}, ${vertical})`;
      });
      pie.attr("transform", () => {
        return `translate(0, ${totalLegendHeight + legendHeight})`;
      });
      break;
    case "bottom":
      chartAndLegendHeight += totalLegendHeight;
      legend.attr("transform", (_datum, index) => {
        const offset = -radius - legendHeight;
        const horizontal = -longestTextWidth / 2 - (LEGEND_RECT_SIZE + LEGEND_SPACING);
        const vertical = index * legendHeight - offset;
        return "translate(" + horizontal + "," + vertical + ")";
      });
      break;
    case "left":
      chartAndLegendWidth += LEGEND_RECT_SIZE + LEGEND_SPACING + longestTextWidth;
      legend.attr("transform", (_datum, index) => {
        const offset = legendHeight * allSectionData.length / 2;
        const horizontal = -radius - (LEGEND_RECT_SIZE + LEGEND_SPACING);
        const vertical = index * legendHeight - offset;
        return "translate(" + horizontal + "," + vertical + ")";
      });
      pie.attr("transform", () => {
        return `translate(${longestTextWidth + LEGEND_RECT_SIZE + LEGEND_SPACING}, 0)`;
      });
      break;
    case "right":
    default:
      chartAndLegendWidth += LEGEND_RECT_SIZE + LEGEND_SPACING + longestTextWidth;
      legend.attr("transform", (_datum, index) => {
        const offset = legendHeight * allSectionData.length / 2;
        const horizontal = 12 * LEGEND_RECT_SIZE;
        const vertical = index * legendHeight - offset;
        return "translate(" + horizontal + "," + vertical + ")";
      });
      break;
  }
  const titleWidth = titleText.node()?.getBoundingClientRect().width ?? 0;
  const titleLeft = pieWidth / 2 - titleWidth / 2;
  const titleRight = pieWidth / 2 + titleWidth / 2;
  const viewBoxX = Math.min(0, titleLeft);
  const viewBoxRight = Math.max(chartAndLegendWidth, titleRight);
  const totalWidth = viewBoxRight - viewBoxX;
  svg.attr("viewBox", `${viewBoxX} 0 ${totalWidth} ${chartAndLegendHeight}`);
  (0,_chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__/* .configureSvgSize */ .a$)(svg, chartAndLegendHeight, totalWidth, pieConfig.useMaxWidth);
}, "draw");
var renderer = { draw };

// src/diagrams/pie/pieDiagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles: pieStyles_default
};



/***/ }

}]);