"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[93629],{

/***/ 93629
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







// src/diagrams/railroad/parser/abnfParser.ts

var langiumParser = (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .createRailroadAbnfServices */ .sB)().RailroadAbnf.parser.LangiumParser;
var transformAlternation = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((alt) => {
  const alternatives = alt.alternatives.map(transformConcatenation);
  if (alternatives.length === 1) {
    return alternatives[0];
  }
  return {
    type: "choice",
    alternatives
  };
}, "transformAlternation");
var transformConcatenation = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((concat) => {
  const elements = concat.elements.map(transformElement);
  if (elements.length === 1) {
    return elements[0];
  }
  return {
    type: "sequence",
    elements
  };
}, "transformConcatenation");
var parseRepeat = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((repeat) => {
  if (repeat.includes("*")) {
    const [minStr, maxStr] = repeat.split("*");
    const min = minStr ? parseInt(minStr, 10) : 0;
    const max = maxStr ? parseInt(maxStr, 10) : Infinity;
    return { min, max };
  }
  const exact = parseInt(repeat, 10);
  return { min: exact, max: exact };
}, "parseRepeat");
var transformElement = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((element) => {
  const inner = transformPrimary(element.primary);
  if (!element.repeat) {
    return inner;
  }
  const { min, max } = parseRepeat(element.repeat);
  if (min === 0 && max === 1) {
    return { type: "optional", element: inner };
  }
  return {
    type: "repetition",
    element: inner,
    min,
    max
  };
}, "transformElement");
var transformPrimary = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((primary) => {
  switch (primary.$type) {
    case "AbnfStringLiteral":
      return {
        type: "terminal",
        value: primary.value
      };
    case "AbnfNumVal":
      return {
        type: "terminal",
        value: primary.value
      };
    case "AbnfRuleName":
      return {
        type: "nonterminal",
        name: primary.name
      };
    case "AbnfGroup":
      return transformAlternation(primary.element);
    case "AbnfOptionalGroup":
      return {
        type: "optional",
        element: transformAlternation(primary.element)
      };
    default:
      throw new Error(`Unsupported ABNF primary node: ${primary.$type}`);
  }
}, "transformPrimary");
var transformRule = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((rule) => {
  return {
    name: rule.name,
    definition: transformAlternation(rule.definition)
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
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[ABNF Parser] Starting Langium parse");
    const result = langiumParser.parse(input);
    if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
      throw new _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .MermaidParseError */ .zg(result);
    }
    const ast = result.value;
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[ABNF Parser] Parsed rules:", ast.rules.length);
    populateDb(ast);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[ABNF Parser] Parse complete");
  }, "parse"),
  parser: {
    yy: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db
  }
};

// src/diagrams/railroad/abnfDiagram.ts
var diagram = {
  parser,
  db: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db,
  renderer: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .renderer */ .U,
  styles: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .getStyles */ .$
};



/***/ }

}]);