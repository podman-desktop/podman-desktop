"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[77930],{

/***/ 77930
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95613);
/* harmony import */ var _chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(47776);
/* harmony import */ var _chunk_VAUOI2AC_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28029);
/* harmony import */ var _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(79773);
/* harmony import */ var _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16055);
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(54681);
/* harmony import */ var _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5165);







// src/diagrams/railroad/parser/pegParser.ts

var langiumParser = (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .createRailroadPegServices */ .Pz)().RailroadPeg.parser.LangiumParser;
var transformOrderedChoice = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((choice) => {
  const alternatives = choice.alternatives.map(transformSequence);
  if (alternatives.length === 1) {
    return alternatives[0];
  }
  return {
    type: "choice",
    alternatives
  };
}, "transformOrderedChoice");
var transformSequence = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((sequence) => {
  const elements = sequence.elements.map(transformPrefix);
  if (elements.length === 1) {
    return elements[0];
  }
  return {
    type: "sequence",
    elements
  };
}, "transformSequence");
var transformPrefix = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((prefix) => {
  const inner = transformSuffix(prefix.suffix);
  if (!prefix.operator) {
    return inner;
  }
  const label = prefix.operator === "&" ? `&${nodeToLabel(inner)}` : `!${nodeToLabel(inner)}`;
  return {
    type: "special",
    text: label
  };
}, "transformPrefix");
var nodeToLabel = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((node) => {
  switch (node.type) {
    case "terminal":
      return `"${node.value}"`;
    case "nonterminal":
      return node.name;
    case "special":
      return node.text;
    default:
      return "(...)";
  }
}, "nodeToLabel");
var transformSuffix = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((suffix) => {
  const inner = transformPrimary(suffix.primary);
  if (!suffix.operator) {
    return inner;
  }
  switch (suffix.operator) {
    case "?":
      return { type: "optional", element: inner };
    case "*":
      return { type: "repetition", element: inner, min: 0, max: Infinity };
    case "+":
      return { type: "repetition", element: inner, min: 1, max: Infinity };
    default:
      throw new Error(`Unsupported PEG suffix operator: ${suffix.operator}`);
  }
}, "transformSuffix");
var transformPrimary = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((primary) => {
  switch (primary.$type) {
    case "PegLiteral":
      return {
        type: "terminal",
        value: primary.value
      };
    case "PegIdentifier":
      return {
        type: "nonterminal",
        name: primary.name
      };
    case "PegGroup":
      return transformOrderedChoice(primary.element);
    case "PegAny":
      return {
        type: "special",
        text: primary.dot
      };
    default:
      throw new Error(`Unsupported PEG primary node: ${primary.$type}`);
  }
}, "transformPrimary");
var transformRule = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((rule) => {
  return {
    name: rule.name,
    definition: transformOrderedChoice(rule.definition)
  };
}, "transformRule");
var populateDb = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((ast) => {
  (0,_chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_1__/* .populateCommonDb */ .S)(ast, _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db);
  if (ast.title) {
    _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db.setTitle(ast.title);
  }
  ast.rules.map((rule) => _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db.addRule(transformRule(rule)));
}, "populateDb");
var parser = {
  parse: /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((input) => {
    _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db.clear();
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[PEG Parser] Starting Langium parse");
    const result = langiumParser.parse(input);
    if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
      throw new _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .MermaidParseError */ .zg(result);
    }
    const ast = result.value;
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[PEG Parser] Parsed rules:", ast.rules.length);
    populateDb(ast);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[PEG Parser] Parse complete");
  }, "parse"),
  parser: {
    yy: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db
  }
};

// src/diagrams/railroad/pegDiagram.ts
var diagram = {
  parser,
  db: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db,
  renderer: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .renderer */ .U,
  styles: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .getStyles */ .$
};



/***/ }

}]);