"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[23],{

/***/ 23
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







// src/diagrams/railroad/parser/ebnfParser.ts

var langiumParser = (0,_mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .createRailroadEbnfServices */ .WG)().RailroadEbnf.parser.LangiumParser;
var transformChoice = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((choice) => {
  const alternatives = choice.alternatives.map(transformSequence);
  if (alternatives.length === 1) {
    return alternatives[0];
  }
  return {
    type: "choice",
    alternatives
  };
}, "transformChoice");
var transformSequence = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((sequence) => {
  const elements = sequence.elements.map(transformTerm);
  if (elements.length === 1) {
    return elements[0];
  }
  return {
    type: "sequence",
    elements
  };
}, "transformSequence");
var transformPrimary = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((primary) => {
  switch (primary.$type) {
    case "EbnfTerminal":
      return {
        type: "terminal",
        value: primary.value
      };
    case "EbnfNonTerminal":
      return {
        type: "nonterminal",
        name: primary.name
      };
    case "EbnfSpecial":
      return {
        type: "special",
        text: primary.text
      };
    case "EbnfGroup":
      return transformChoice(primary.element);
    case "EbnfOptional":
      return {
        type: "optional",
        element: transformChoice(primary.element)
      };
    case "EbnfRepetition":
      return {
        type: "repetition",
        element: transformChoice(primary.element),
        min: 0,
        max: Infinity
      };
    default:
      throw new Error(`Unsupported EBNF primary node: ${primary.$type}`);
  }
}, "transformPrimary");
var transformPostfix = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((node, postfix) => {
  switch (postfix.$type) {
    case "EbnfOptionalPostfix":
      return {
        type: "optional",
        element: node
      };
    case "EbnfZeroOrMorePostfix":
      return {
        type: "repetition",
        element: node,
        min: 0,
        max: Infinity
      };
    case "EbnfOneOrMorePostfix":
      return {
        type: "repetition",
        element: node,
        min: 1,
        max: Infinity
      };
    case "EbnfExceptionPostfix":
      return {
        type: "sequence",
        elements: [
          node,
          { type: "terminal", value: "-" },
          transformPrimary(postfix.except)
        ]
      };
    default:
      throw new Error(`Unsupported EBNF postfix node: ${postfix.$type}`);
  }
}, "transformPostfix");
var transformTerm = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((term) => {
  return term.postfixes.reduce((currentNode, postfix) => {
    return transformPostfix(currentNode, postfix);
  }, transformPrimary(term.base));
}, "transformTerm");
var transformRule = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_5__/* .__name */ .K)((rule) => {
  return {
    name: rule.name,
    definition: transformChoice(rule.definition)
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
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[EBNF Parser] Starting Langium parse");
    const result = langiumParser.parse(input);
    if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
      throw new _mermaid_js_parser__WEBPACK_IMPORTED_MODULE_6__/* .MermaidParseError */ .zg(result);
    }
    const ast = result.value;
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[EBNF Parser] Parsed rules:", ast.rules.length);
    populateDb(ast);
    _chunk_X3CZISLH_mjs__WEBPACK_IMPORTED_MODULE_4__/* .log */ .R.debug("[EBNF Parser] Parse complete");
  }, "parse"),
  parser: {
    yy: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db
  }
};

// src/diagrams/railroad/ebnfDiagram.ts
var diagram = {
  parser,
  db: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__.db,
  renderer: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .renderer */ .U,
  styles: _chunk_MOJQB5TN_mjs__WEBPACK_IMPORTED_MODULE_0__/* .getStyles */ .$
};



/***/ }

}]);