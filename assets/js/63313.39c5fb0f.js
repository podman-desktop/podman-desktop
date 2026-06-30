"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[63313],{

/***/ 63313
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* unused harmony export default */
/* harmony import */ var _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95613);
/* harmony import */ var _chunk_JWPE2WC7_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(47776);
/* harmony import */ var _chunk_VAUOI2AC_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28029);
/* harmony import */ var _chunk_WYO6CB5R_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(79773);
/* harmony import */ var _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16055);
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(54681);
/* harmony import */ var _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5165);







// src/diagrams/railroad/parser/railroadParser.ts

var langiumParser = (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .createRailroadServices */ .lz)().Railroad.parser.LangiumParser;
var transformExpression = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((expr) => {
  switch (expr.$type) {
    case "RailroadTerminalExpr":
      return {
        type: "terminal",
        value: expr.value
      };
    case "RailroadNonTerminalExpr":
      return {
        type: "nonterminal",
        name: expr.name
      };
    case "RailroadSpecialExpr":
      return {
        type: "special",
        text: expr.text
      };
    case "RailroadSequenceExpr": {
      const elements = expr.elements.map(transformExpression);
      return elements.length === 1 ? elements[0] : { type: "sequence", elements };
    }
    case "RailroadChoiceExpr": {
      const alternatives = expr.alternatives.map(transformExpression);
      return alternatives.length === 1 ? alternatives[0] : { type: "choice", alternatives };
    }
    case "RailroadOptionalExpr":
      return {
        type: "optional",
        element: transformExpression(expr.element)
      };
    case "RailroadOneOrMoreExpr":
      return {
        type: "repetition",
        element: transformExpression(expr.element),
        min: 1,
        max: Infinity
      };
    case "RailroadZeroOrMoreExpr":
      return {
        type: "repetition",
        element: transformExpression(expr.element),
        min: 0,
        max: Infinity
      };
    default:
      throw new Error(`Unsupported railroad expression: ${expr.$type}`);
  }
}, "transformExpression");
var transformRule = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((rule) => {
  return {
    name: rule.name,
    definition: transformExpression(rule.definition)
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
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[Railroad Parser] Starting Langium parse");
    const result = langiumParser.parse(input);
    if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
      throw new _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .MermaidParseError */ .zg(result);
    }
    const ast = result.value;
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[Railroad Parser] Parsed rules:", ast.rules.length);
    populateDb(ast);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[Railroad Parser] Parse complete");
  }, "parse"),
  parser: {
    yy: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db
  }
};

// src/diagrams/railroad/railroadDiagram.ts
var diagram = {
  parser,
  db: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db,
  renderer: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .renderer */ .U,
  styles: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .getStyles */ .$
};
var railroadDiagram_default = (/* unused pure expression or super */ null && (diagram));



/***/ }

}]);