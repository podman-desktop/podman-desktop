"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[69327],{

/***/ 77335
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81283);
/* harmony import */ var _color_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(112);
/* IMPORT */


/* MAIN */
const channel = (color, channel) => {
    return _utils_index_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.lang.round(_color_index_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.parse(color)[channel]);
};
/* EXPORT */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (channel);


/***/ },

/***/ 69327
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  diagram: () => (/* binding */ diagram)
});

// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-5VM5RSS4.mjs
var chunk_5VM5RSS4 = __webpack_require__(92672);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-R7TYR2AO.mjs
var chunk_R7TYR2AO = __webpack_require__(62555);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-OBVCFTLP.mjs
var chunk_OBVCFTLP = __webpack_require__(49131);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-TEH6E4GO.mjs
var chunk_TEH6E4GO = __webpack_require__(82081);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-P2QGCYS3.mjs
var chunk_P2QGCYS3 = __webpack_require__(3079);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-GMAD6QVW.mjs + 1 modules
var chunk_GMAD6QVW = __webpack_require__(67789);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-PWAF6VOD.mjs + 12 modules
var chunk_PWAF6VOD = __webpack_require__(97584);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs + 13 modules
var chunk_75Z2AOVW = __webpack_require__(72605);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs + 3 modules
var chunk_DU6HZSFF = __webpack_require__(4299);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs
var chunk_X3CZISLH = __webpack_require__(16055);
// EXTERNAL MODULE: ../node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs
var chunk_Y2CYZVJY = __webpack_require__(54681);
// EXTERNAL MODULE: ../node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
var isPrimitive = __webpack_require__(94980);
// EXTERNAL MODULE: ../node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
var getTag = __webpack_require__(96579);
// EXTERNAL MODULE: ../node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var tags = __webpack_require__(48168);
;// ../node_modules/es-toolkit/dist/compat/predicate/isArray.mjs
//#region src/compat/predicate/isArray.ts
/**
* Checks if the given value is an array.
*
* This function tests whether the provided value is an array or not.
* It returns `true` if the value is an array, and `false` otherwise.
*
* This function can also serve as a type predicate in TypeScript, narrowing the type of the argument to an array.
*
* @param value - The value to test if it is an array.
* @returns `true` if the value is an array, `false` otherwise.
*
* @example
* const value1 = [1, 2, 3];
* const value2 = 'abc';
* const value3 = () => {};
*
* console.log(isArray(value1)); // true
* console.log(isArray(value2)); // false
* console.log(isArray(value3)); // false
*/
function isArray(value) {
	return Array.isArray(value);
}
//#endregion


// EXTERNAL MODULE: ../node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs
var isTypedArray = __webpack_require__(98153);
;// ../node_modules/es-toolkit/dist/compat/object/clone.mjs





//#region src/compat/object/clone.ts
/**
* Creates a shallow clone of the given object.
*
* @template T - The type of the object.
* @param obj - The object to clone.
* @returns A shallow clone of the given object.
*
* @example
* // Clone a primitive object
* const num = 29;
* const clonedNum = clone(num);
* console.log(clonedNum); // 29
* console.log(clonedNum === num); // true
*
* @example
* // Clone an array
* const arr = [1, 2, 3];
* const clonedArr = clone(arr);
* console.log(clonedArr); // [1, 2, 3]
* console.log(clonedArr === arr); // false
*
* @example
* // Clone an object
* const obj = { a: 1, b: 'es-toolkit', c: [1, 2, 3] };
* const clonedObj = clone(obj);
* console.log(clonedObj); // { a: 1, b: 'es-toolkit', c: [1, 2, 3] }
* console.log(clonedObj === obj); // false
*/
function clone(obj) {
	if ((0,isPrimitive/* isPrimitive */.s)(obj)) return obj;
	const tag = (0,getTag/* getTag */.b)(obj);
	if (!isCloneableObject(obj)) return {};
	if (isArray(obj)) {
		const result = Array.from(obj);
		if (obj.length > 0 && typeof obj[0] === "string" && Object.hasOwn(obj, "index")) {
			result.index = obj.index;
			result.input = obj.input;
		}
		return result;
	}
	if ((0,isTypedArray/* isTypedArray */.i)(obj)) {
		const typedArray = obj;
		const Ctor = typedArray.constructor;
		return new Ctor(typedArray.buffer, typedArray.byteOffset, typedArray.length);
	}
	if (tag === "[object ArrayBuffer]") return new ArrayBuffer(obj.byteLength);
	if (tag === "[object DataView]") {
		const dataView = obj;
		const buffer = dataView.buffer;
		const byteOffset = dataView.byteOffset;
		const byteLength = dataView.byteLength;
		const clonedBuffer = new ArrayBuffer(byteLength);
		const srcView = new Uint8Array(buffer, byteOffset, byteLength);
		new Uint8Array(clonedBuffer).set(srcView);
		return new DataView(clonedBuffer);
	}
	if (tag === "[object Boolean]" || tag === "[object Number]" || tag === "[object String]") {
		const Ctor = obj.constructor;
		const clone = new Ctor(obj.valueOf());
		if (tag === "[object String]") cloneStringObjectProperties(clone, obj);
		else copyOwnProperties(clone, obj);
		return clone;
	}
	if (tag === "[object Date]") return new Date(Number(obj));
	if (tag === "[object RegExp]") {
		const regExp = obj;
		const clone = new RegExp(regExp.source, regExp.flags);
		clone.lastIndex = regExp.lastIndex;
		return clone;
	}
	if (tag === "[object Symbol]") return Object(Symbol.prototype.valueOf.call(obj));
	if (tag === "[object Map]") {
		const map = obj;
		const result = /* @__PURE__ */ new Map();
		map.forEach((obj, key) => {
			result.set(key, obj);
		});
		return result;
	}
	if (tag === "[object Set]") {
		const set = obj;
		const result = /* @__PURE__ */ new Set();
		set.forEach((obj) => {
			result.add(obj);
		});
		return result;
	}
	if (tag === "[object Arguments]") {
		const args = obj;
		const result = {};
		copyOwnProperties(result, args);
		result.length = args.length;
		result[Symbol.iterator] = args[Symbol.iterator];
		return result;
	}
	const result = {};
	copyPrototype(result, obj);
	copyOwnProperties(result, obj);
	copySymbolProperties(result, obj);
	return result;
}
function isCloneableObject(object) {
	switch ((0,getTag/* getTag */.b)(object)) {
		case tags/* argumentsTag */.R_:
		case tags/* arrayTag */.Uw:
		case tags/* arrayBufferTag */.cT:
		case tags/* dataViewTag */.iq:
		case tags/* booleanTag */.$V:
		case tags/* dateTag */.vC:
		case tags/* float32ArrayTag */.ri:
		case tags/* float64ArrayTag */.ML:
		case tags/* int8ArrayTag */.XZ:
		case tags/* int16ArrayTag */.i1:
		case tags/* int32ArrayTag */._u:
		case tags/* mapTag */.pj:
		case tags/* numberTag */.kj:
		case tags/* objectTag */.GX:
		case tags/* regexpTag */.Av:
		case tags/* setTag */.NA:
		case tags/* stringTag */.OG:
		case tags/* symbolTag */.VP:
		case tags/* uint8ArrayTag */.Qb:
		case tags/* uint8ClampedArrayTag */.q:
		case tags/* uint16ArrayTag */.x6:
		case tags/* uint32ArrayTag */.ZR: return true;
		default: return false;
	}
}
function copyOwnProperties(target, source) {
	for (const key in source) if (Object.hasOwn(source, key)) target[key] = source[key];
}
function copySymbolProperties(target, source) {
	const symbols = Object.getOwnPropertySymbols(source);
	for (let i = 0; i < symbols.length; i++) {
		const symbol = symbols[i];
		if (Object.prototype.propertyIsEnumerable.call(source, symbol)) target[symbol] = source[symbol];
	}
}
function cloneStringObjectProperties(target, source) {
	const stringLength = source.valueOf().length;
	for (const key in source) if (Object.hasOwn(source, key) && (Number.isNaN(Number(key)) || Number(key) >= stringLength)) target[key] = source[key];
}
function copyPrototype(target, source) {
	const proto = Object.getPrototypeOf(source);
	if (proto !== null) {
		if (typeof source.constructor === "function") Object.setPrototypeOf(target, proto);
	}
}
//#endregion


// EXTERNAL MODULE: ../node_modules/khroma/dist/methods/channel.js
var channel = __webpack_require__(77335);
// EXTERNAL MODULE: ../node_modules/khroma/dist/methods/rgba.js
var rgba = __webpack_require__(18448);
// EXTERNAL MODULE: ../node_modules/d3/src/index.js + 216 modules
var src = __webpack_require__(47777);
// EXTERNAL MODULE: ../node_modules/dagre-d3-es/src/graphlib/index.js
var graphlib = __webpack_require__(62499);
;// ../node_modules/mermaid/dist/chunks/mermaid.core/blockDiagram-NRAW4CY4.mjs












// src/diagrams/block/parser/block.jison
var parser = (function() {
  var o = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v) ;
    return o2;
  }, "o"), $V0 = [1, 15], $V1 = [1, 7], $V2 = [1, 13], $V3 = [1, 14], $V4 = [1, 19], $V5 = [1, 16], $V6 = [1, 17], $V7 = [1, 18], $V8 = [8, 30], $V9 = [8, 10, 21, 28, 29, 30, 31, 39, 43, 46], $Va = [1, 23], $Vb = [1, 24], $Vc = [8, 10, 15, 16, 21, 28, 29, 30, 31, 39, 43, 46], $Vd = [8, 10, 15, 16, 21, 27, 28, 29, 30, 31, 39, 43, 46], $Ve = [1, 49];
  var parser2 = {
    trace: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function trace() {
    }, "trace"),
    yy: {},
    symbols_: { "error": 2, "spaceLines": 3, "SPACELINE": 4, "NL": 5, "separator": 6, "SPACE": 7, "EOF": 8, "start": 9, "BLOCK_DIAGRAM_KEY": 10, "document": 11, "stop": 12, "statement": 13, "link": 14, "LINK": 15, "START_LINK": 16, "LINK_LABEL": 17, "STR": 18, "nodeStatement": 19, "columnsStatement": 20, "SPACE_BLOCK": 21, "blockStatement": 22, "classDefStatement": 23, "cssClassStatement": 24, "styleStatement": 25, "node": 26, "SIZE": 27, "COLUMNS": 28, "id-block": 29, "end": 30, "NODE_ID": 31, "nodeShapeNLabel": 32, "dirList": 33, "DIR": 34, "NODE_DSTART": 35, "NODE_DEND": 36, "BLOCK_ARROW_START": 37, "BLOCK_ARROW_END": 38, "classDef": 39, "CLASSDEF_ID": 40, "CLASSDEF_STYLEOPTS": 41, "DEFAULT": 42, "class": 43, "CLASSENTITY_IDS": 44, "STYLECLASS": 45, "style": 46, "STYLE_ENTITY_IDS": 47, "STYLE_DEFINITION_DATA": 48, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 4: "SPACELINE", 5: "NL", 7: "SPACE", 8: "EOF", 10: "BLOCK_DIAGRAM_KEY", 15: "LINK", 16: "START_LINK", 17: "LINK_LABEL", 18: "STR", 21: "SPACE_BLOCK", 27: "SIZE", 28: "COLUMNS", 29: "id-block", 30: "end", 31: "NODE_ID", 34: "DIR", 35: "NODE_DSTART", 36: "NODE_DEND", 37: "BLOCK_ARROW_START", 38: "BLOCK_ARROW_END", 39: "classDef", 40: "CLASSDEF_ID", 41: "CLASSDEF_STYLEOPTS", 42: "DEFAULT", 43: "class", 44: "CLASSENTITY_IDS", 45: "STYLECLASS", 46: "style", 47: "STYLE_ENTITY_IDS", 48: "STYLE_DEFINITION_DATA" },
    productions_: [0, [3, 1], [3, 2], [3, 2], [6, 1], [6, 1], [6, 1], [9, 3], [12, 1], [12, 1], [12, 2], [12, 2], [11, 1], [11, 2], [14, 1], [14, 4], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [19, 3], [19, 2], [19, 1], [20, 1], [22, 4], [22, 3], [26, 1], [26, 2], [33, 1], [33, 2], [32, 3], [32, 4], [23, 3], [23, 3], [24, 3], [25, 3]],
    performAction: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 4:
          yy.getLogger().debug("Rule: separator (NL) ");
          break;
        case 5:
          yy.getLogger().debug("Rule: separator (Space) ");
          break;
        case 6:
          yy.getLogger().debug("Rule: separator (EOF) ");
          break;
        case 7:
          yy.getLogger().debug("Rule: hierarchy: ", $$[$0 - 1]);
          yy.setHierarchy($$[$0 - 1]);
          break;
        case 8:
          yy.getLogger().debug("Stop NL ");
          break;
        case 9:
          yy.getLogger().debug("Stop EOF ");
          break;
        case 10:
          yy.getLogger().debug("Stop NL2 ");
          break;
        case 11:
          yy.getLogger().debug("Stop EOF2 ");
          break;
        case 12:
          yy.getLogger().debug("Rule: statement: ", $$[$0]);
          typeof $$[$0].length === "number" ? this.$ = $$[$0] : this.$ = [$$[$0]];
          break;
        case 13:
          yy.getLogger().debug("Rule: statement #2: ", $$[$0 - 1]);
          this.$ = [$$[$0 - 1]].concat($$[$0]);
          break;
        case 14:
          yy.getLogger().debug("Rule: link: ", $$[$0], yytext);
          this.$ = { edgeTypeStr: $$[$0], label: "" };
          break;
        case 15:
          yy.getLogger().debug("Rule: LABEL link: ", $$[$0 - 3], $$[$0 - 1], $$[$0]);
          this.$ = { edgeTypeStr: $$[$0], label: $$[$0 - 1] };
          break;
        case 18:
          const num = parseInt($$[$0]);
          const spaceId = yy.generateId();
          this.$ = { id: spaceId, type: "space", label: "", width: num, children: [] };
          break;
        case 23:
          yy.getLogger().debug("Rule: (nodeStatement link node) ", $$[$0 - 2], $$[$0 - 1], $$[$0], " typestr: ", $$[$0 - 1].edgeTypeStr);
          const edgeData = yy.edgeStrToEdgeData($$[$0 - 1].edgeTypeStr);
          const startEdgeData = yy.edgeStrToEdgeStartData($$[$0 - 1].edgeTypeStr);
          const lineThickness = yy.edgeStrToThickness($$[$0 - 1].edgeTypeStr);
          const linePattern = yy.edgeStrToPattern($$[$0 - 1].edgeTypeStr);
          this.$ = [
            { id: $$[$0 - 2].id, label: $$[$0 - 2].label, type: $$[$0 - 2].type, directions: $$[$0 - 2].directions },
            { id: $$[$0 - 2].id + "-" + $$[$0].id, start: $$[$0 - 2].id, end: $$[$0].id, label: $$[$0 - 1].label, type: "edge", thickness: lineThickness, pattern: linePattern, directions: $$[$0].directions, arrowTypeEnd: edgeData, arrowTypeStart: startEdgeData },
            { id: $$[$0].id, label: $$[$0].label, type: yy.typeStr2Type($$[$0].typeStr), directions: $$[$0].directions }
          ];
          break;
        case 24:
          yy.getLogger().debug("Rule: nodeStatement (abc88 node size) ", $$[$0 - 1], $$[$0]);
          this.$ = { id: $$[$0 - 1].id, label: $$[$0 - 1].label, type: yy.typeStr2Type($$[$0 - 1].typeStr), directions: $$[$0 - 1].directions, widthInColumns: parseInt($$[$0], 10) };
          break;
        case 25:
          yy.getLogger().debug("Rule: nodeStatement (node) ", $$[$0]);
          this.$ = { id: $$[$0].id, label: $$[$0].label, type: yy.typeStr2Type($$[$0].typeStr), directions: $$[$0].directions, widthInColumns: 1 };
          break;
        case 26:
          yy.getLogger().debug("APA123", this ? this : "na");
          yy.getLogger().debug("COLUMNS: ", $$[$0]);
          this.$ = { type: "column-setting", columns: $$[$0] === "auto" ? -1 : parseInt($$[$0]) };
          break;
        case 27:
          yy.getLogger().debug("Rule: id-block statement : ", $$[$0 - 2], $$[$0 - 1]);
          const id2 = yy.generateId();
          this.$ = { ...$$[$0 - 2], type: "composite", children: $$[$0 - 1] };
          break;
        case 28:
          yy.getLogger().debug("Rule: blockStatement : ", $$[$0 - 2], $$[$0 - 1], $$[$0]);
          const id = yy.generateId();
          this.$ = { id, type: "composite", label: "", children: $$[$0 - 1] };
          break;
        case 29:
          yy.getLogger().debug("Rule: node (NODE_ID separator): ", $$[$0]);
          this.$ = { id: $$[$0] };
          break;
        case 30:
          yy.getLogger().debug("Rule: node (NODE_ID nodeShapeNLabel separator): ", $$[$0 - 1], $$[$0]);
          this.$ = { id: $$[$0 - 1], label: $$[$0].label, typeStr: $$[$0].typeStr, directions: $$[$0].directions };
          break;
        case 31:
          yy.getLogger().debug("Rule: dirList: ", $$[$0]);
          this.$ = [$$[$0]];
          break;
        case 32:
          yy.getLogger().debug("Rule: dirList: ", $$[$0 - 1], $$[$0]);
          this.$ = [$$[$0 - 1]].concat($$[$0]);
          break;
        case 33:
          yy.getLogger().debug("Rule: nodeShapeNLabel: ", $$[$0 - 2], $$[$0 - 1], $$[$0]);
          this.$ = { typeStr: $$[$0 - 2] + $$[$0], label: $$[$0 - 1] };
          break;
        case 34:
          yy.getLogger().debug("Rule: BLOCK_ARROW nodeShapeNLabel: ", $$[$0 - 3], $$[$0 - 2], " #3:", $$[$0 - 1], $$[$0]);
          this.$ = { typeStr: $$[$0 - 3] + $$[$0], label: $$[$0 - 2], directions: $$[$0 - 1] };
          break;
        case 35:
        case 36:
          this.$ = { type: "classDef", id: $$[$0 - 1].trim(), css: $$[$0].trim() };
          break;
        case 37:
          this.$ = { type: "applyClass", id: $$[$0 - 1].trim(), styleClass: $$[$0].trim() };
          break;
        case 38:
          this.$ = { type: "applyStyles", id: $$[$0 - 1].trim(), stylesStr: $$[$0].trim() };
          break;
      }
    }, "anonymous"),
    table: [{ 9: 1, 10: [1, 2] }, { 1: [3] }, { 10: $V0, 11: 3, 13: 4, 19: 5, 20: 6, 21: $V1, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 28: $V2, 29: $V3, 31: $V4, 39: $V5, 43: $V6, 46: $V7 }, { 8: [1, 20] }, o($V8, [2, 12], { 13: 4, 19: 5, 20: 6, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 11: 21, 10: $V0, 21: $V1, 28: $V2, 29: $V3, 31: $V4, 39: $V5, 43: $V6, 46: $V7 }), o($V9, [2, 16], { 14: 22, 15: $Va, 16: $Vb }), o($V9, [2, 17]), o($V9, [2, 18]), o($V9, [2, 19]), o($V9, [2, 20]), o($V9, [2, 21]), o($V9, [2, 22]), o($Vc, [2, 25], { 27: [1, 25] }), o($V9, [2, 26]), { 19: 26, 26: 12, 31: $V4 }, { 10: $V0, 11: 27, 13: 4, 19: 5, 20: 6, 21: $V1, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 28: $V2, 29: $V3, 31: $V4, 39: $V5, 43: $V6, 46: $V7 }, { 40: [1, 28], 42: [1, 29] }, { 44: [1, 30] }, { 47: [1, 31] }, o($Vd, [2, 29], { 32: 32, 35: [1, 33], 37: [1, 34] }), { 1: [2, 7] }, o($V8, [2, 13]), { 26: 35, 31: $V4 }, { 31: [2, 14] }, { 17: [1, 36] }, o($Vc, [2, 24]), { 10: $V0, 11: 37, 13: 4, 14: 22, 15: $Va, 16: $Vb, 19: 5, 20: 6, 21: $V1, 22: 8, 23: 9, 24: 10, 25: 11, 26: 12, 28: $V2, 29: $V3, 31: $V4, 39: $V5, 43: $V6, 46: $V7 }, { 30: [1, 38] }, { 41: [1, 39] }, { 41: [1, 40] }, { 45: [1, 41] }, { 48: [1, 42] }, o($Vd, [2, 30]), { 18: [1, 43] }, { 18: [1, 44] }, o($Vc, [2, 23]), { 18: [1, 45] }, { 30: [1, 46] }, o($V9, [2, 28]), o($V9, [2, 35]), o($V9, [2, 36]), o($V9, [2, 37]), o($V9, [2, 38]), { 36: [1, 47] }, { 33: 48, 34: $Ve }, { 15: [1, 50] }, o($V9, [2, 27]), o($Vd, [2, 33]), { 38: [1, 51] }, { 33: 52, 34: $Ve, 38: [2, 31] }, { 31: [2, 15] }, o($Vd, [2, 34]), { 38: [2, 32] }],
    defaultActions: { 20: [2, 7], 23: [2, 14], 50: [2, 15], 52: [2, 32] },
    parseError: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    }, "parseError"),
    parse: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
      }
      (0,chunk_Y2CYZVJY/* __name */.K)(popStack, "popStack");
      function lex() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      (0,chunk_Y2CYZVJY/* __name */.K)(lex, "lex");
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
              if (recovering > 0) {
                recovering--;
              }
            } else {
              symbol = preErrorSymbol;
              preErrorSymbol = null;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }, "parse")
  };
  var lexer = /* @__PURE__ */ (function() {
    var lexer2 = {
      EOF: 1,
      parseError: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      }, "parseError"),
      // resets the lexer, sets new input
      setInput: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      }, "setInput"),
      // consumes and returns one char from the input
      input: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      }, "input"),
      // unshifts one char (or a string) into the input
      unput: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      }, "unput"),
      // When called from action, caches matched text and appends it on next action
      more: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        this._more = true;
        return this;
      }, "more"),
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      }, "reject"),
      // retain first n characters of the match
      less: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(n) {
        this.unput(this.match.slice(n));
      }, "less"),
      // displays already matched input, i.e. for error messages
      pastInput: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      }, "pastInput"),
      // displays upcoming input, i.e. for error messages
      upcomingInput: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      }, "upcomingInput"),
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      }, "showPosition"),
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      }, "test_match"),
      // return next match in input
      next: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      }, "next"),
      // return next match that has a token
      lex: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      }, "lex"),
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function begin(condition) {
        this.conditionStack.push(condition);
      }, "begin"),
      // pop the previously active lexer condition state off the condition stack
      popState: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      }, "popState"),
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      }, "_currentRules"),
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      }, "topState"),
      // alias for begin(condition)
      pushState: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function pushState(condition) {
        this.begin(condition);
      }, "pushState"),
      // return the number of states currently on the stack
      stateStackSize: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function stateStackSize() {
        return this.conditionStack.length;
      }, "stateStackSize"),
      options: {},
      performAction: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        var YYSTATE = YY_START;
        switch ($avoiding_name_collisions) {
          case 0:
            yy.getLogger().debug("Found block-beta");
            return 10;
            // removed by dead control flow

          case 1:
            yy.getLogger().debug("Found id-block");
            return 29;
            // removed by dead control flow

          case 2:
            yy.getLogger().debug("Found block");
            return 10;
            // removed by dead control flow

          case 3:
            yy.getLogger().debug(".", yy_.yytext);
            break;
          case 4:
            yy.getLogger().debug("_", yy_.yytext);
            break;
          case 5:
            return 5;
            // removed by dead control flow

          case 6:
            yy_.yytext = -1;
            return 28;
            // removed by dead control flow

          case 7:
            yy_.yytext = yy_.yytext.replace(/columns\s+/, "");
            yy.getLogger().debug("COLUMNS (LEX)", yy_.yytext);
            return 28;
            // removed by dead control flow

          case 8:
            this.pushState("md_string");
            break;
          case 9:
            return "MD_STR";
            // removed by dead control flow

          case 10:
            this.popState();
            break;
          case 11:
            this.pushState("string");
            break;
          case 12:
            yy.getLogger().debug("LEX: POPPING STR:", yy_.yytext);
            this.popState();
            break;
          case 13:
            yy.getLogger().debug("LEX: STR end:", yy_.yytext);
            return "STR";
            // removed by dead control flow

          case 14:
            yy_.yytext = yy_.yytext.replace(/space\:/, "");
            yy.getLogger().debug("SPACE NUM (LEX)", yy_.yytext);
            return 21;
            // removed by dead control flow

          case 15:
            yy_.yytext = "1";
            yy.getLogger().debug("COLUMNS (LEX)", yy_.yytext);
            return 21;
            // removed by dead control flow

          case 16:
            return 42;
            // removed by dead control flow

          case 17:
            return "LINKSTYLE";
            // removed by dead control flow

          case 18:
            return "INTERPOLATE";
            // removed by dead control flow

          case 19:
            this.pushState("CLASSDEF");
            return 39;
            // removed by dead control flow

          case 20:
            this.popState();
            this.pushState("CLASSDEFID");
            return "DEFAULT_CLASSDEF_ID";
            // removed by dead control flow

          case 21:
            this.popState();
            this.pushState("CLASSDEFID");
            return 40;
            // removed by dead control flow

          case 22:
            this.popState();
            return 41;
            // removed by dead control flow

          case 23:
            this.pushState("CLASS");
            return 43;
            // removed by dead control flow

          case 24:
            this.popState();
            this.pushState("CLASS_STYLE");
            return 44;
            // removed by dead control flow

          case 25:
            this.popState();
            return 45;
            // removed by dead control flow

          case 26:
            this.pushState("STYLE_STMNT");
            return 46;
            // removed by dead control flow

          case 27:
            this.popState();
            this.pushState("STYLE_DEFINITION");
            return 47;
            // removed by dead control flow

          case 28:
            this.popState();
            return 48;
            // removed by dead control flow

          case 29:
            this.pushState("acc_title");
            return "acc_title";
            // removed by dead control flow

          case 30:
            this.popState();
            return "acc_title_value";
            // removed by dead control flow

          case 31:
            this.pushState("acc_descr");
            return "acc_descr";
            // removed by dead control flow

          case 32:
            this.popState();
            return "acc_descr_value";
            // removed by dead control flow

          case 33:
            this.pushState("acc_descr_multiline");
            break;
          case 34:
            this.popState();
            break;
          case 35:
            return "acc_descr_multiline_value";
            // removed by dead control flow

          case 36:
            return 30;
            // removed by dead control flow

          case 37:
            this.popState();
            yy.getLogger().debug("Lex: ((");
            return "NODE_DEND";
            // removed by dead control flow

          case 38:
            this.popState();
            yy.getLogger().debug("Lex: ((");
            return "NODE_DEND";
            // removed by dead control flow

          case 39:
            this.popState();
            yy.getLogger().debug("Lex: ))");
            return "NODE_DEND";
            // removed by dead control flow

          case 40:
            this.popState();
            yy.getLogger().debug("Lex: ((");
            return "NODE_DEND";
            // removed by dead control flow

          case 41:
            this.popState();
            yy.getLogger().debug("Lex: ((");
            return "NODE_DEND";
            // removed by dead control flow

          case 42:
            this.popState();
            yy.getLogger().debug("Lex: (-");
            return "NODE_DEND";
            // removed by dead control flow

          case 43:
            this.popState();
            yy.getLogger().debug("Lex: -)");
            return "NODE_DEND";
            // removed by dead control flow

          case 44:
            this.popState();
            yy.getLogger().debug("Lex: ((");
            return "NODE_DEND";
            // removed by dead control flow

          case 45:
            this.popState();
            yy.getLogger().debug("Lex: ]]");
            return "NODE_DEND";
            // removed by dead control flow

          case 46:
            this.popState();
            yy.getLogger().debug("Lex: (");
            return "NODE_DEND";
            // removed by dead control flow

          case 47:
            this.popState();
            yy.getLogger().debug("Lex: ])");
            return "NODE_DEND";
            // removed by dead control flow

          case 48:
            this.popState();
            yy.getLogger().debug("Lex: /]");
            return "NODE_DEND";
            // removed by dead control flow

          case 49:
            this.popState();
            yy.getLogger().debug("Lex: /]");
            return "NODE_DEND";
            // removed by dead control flow

          case 50:
            this.popState();
            yy.getLogger().debug("Lex: )]");
            return "NODE_DEND";
            // removed by dead control flow

          case 51:
            this.popState();
            yy.getLogger().debug("Lex: )");
            return "NODE_DEND";
            // removed by dead control flow

          case 52:
            this.popState();
            yy.getLogger().debug("Lex: ]>");
            return "NODE_DEND";
            // removed by dead control flow

          case 53:
            this.popState();
            yy.getLogger().debug("Lex: ]");
            return "NODE_DEND";
            // removed by dead control flow

          case 54:
            yy.getLogger().debug("Lexa: -)");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 55:
            yy.getLogger().debug("Lexa: (-");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 56:
            yy.getLogger().debug("Lexa: ))");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 57:
            yy.getLogger().debug("Lexa: )");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 58:
            yy.getLogger().debug("Lex: (((");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 59:
            yy.getLogger().debug("Lexa: )");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 60:
            yy.getLogger().debug("Lexa: )");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 61:
            yy.getLogger().debug("Lexa: )");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 62:
            yy.getLogger().debug("Lexc: >");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 63:
            yy.getLogger().debug("Lexa: ([");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 64:
            yy.getLogger().debug("Lexa: )");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 65:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 66:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 67:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 68:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 69:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 70:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 71:
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 72:
            yy.getLogger().debug("Lexa: [");
            this.pushState("NODE");
            return 35;
            // removed by dead control flow

          case 73:
            this.pushState("BLOCK_ARROW");
            yy.getLogger().debug("LEX ARR START");
            return 37;
            // removed by dead control flow

          case 74:
            yy.getLogger().debug("Lex: NODE_ID", yy_.yytext);
            return 31;
            // removed by dead control flow

          case 75:
            yy.getLogger().debug("Lex: EOF", yy_.yytext);
            return 8;
            // removed by dead control flow

          case 76:
            this.pushState("md_string");
            break;
          case 77:
            this.pushState("md_string");
            break;
          case 78:
            return "NODE_DESCR";
            // removed by dead control flow

          case 79:
            this.popState();
            break;
          case 80:
            yy.getLogger().debug("Lex: Starting string");
            this.pushState("string");
            break;
          case 81:
            yy.getLogger().debug("LEX ARR: Starting string");
            this.pushState("string");
            break;
          case 82:
            yy.getLogger().debug("LEX: NODE_DESCR:", yy_.yytext);
            return "NODE_DESCR";
            // removed by dead control flow

          case 83:
            yy.getLogger().debug("LEX POPPING");
            this.popState();
            break;
          case 84:
            yy.getLogger().debug("Lex: =>BAE");
            this.pushState("ARROW_DIR");
            break;
          case 85:
            yy_.yytext = yy_.yytext.replace(/^,\s*/, "");
            yy.getLogger().debug("Lex (right): dir:", yy_.yytext);
            return "DIR";
            // removed by dead control flow

          case 86:
            yy_.yytext = yy_.yytext.replace(/^,\s*/, "");
            yy.getLogger().debug("Lex (left):", yy_.yytext);
            return "DIR";
            // removed by dead control flow

          case 87:
            yy_.yytext = yy_.yytext.replace(/^,\s*/, "");
            yy.getLogger().debug("Lex (x):", yy_.yytext);
            return "DIR";
            // removed by dead control flow

          case 88:
            yy_.yytext = yy_.yytext.replace(/^,\s*/, "");
            yy.getLogger().debug("Lex (y):", yy_.yytext);
            return "DIR";
            // removed by dead control flow

          case 89:
            yy_.yytext = yy_.yytext.replace(/^,\s*/, "");
            yy.getLogger().debug("Lex (up):", yy_.yytext);
            return "DIR";
            // removed by dead control flow

          case 90:
            yy_.yytext = yy_.yytext.replace(/^,\s*/, "");
            yy.getLogger().debug("Lex (down):", yy_.yytext);
            return "DIR";
            // removed by dead control flow

          case 91:
            yy_.yytext = "]>";
            yy.getLogger().debug("Lex (ARROW_DIR end):", yy_.yytext);
            this.popState();
            this.popState();
            return "BLOCK_ARROW_END";
            // removed by dead control flow

          case 92:
            yy.getLogger().debug("Lex: LINK", "#" + yy_.yytext + "#");
            return 15;
            // removed by dead control flow

          case 93:
            yy.getLogger().debug("Lex: LINK", yy_.yytext);
            return 15;
            // removed by dead control flow

          case 94:
            yy.getLogger().debug("Lex: LINK", yy_.yytext);
            return 15;
            // removed by dead control flow

          case 95:
            yy.getLogger().debug("Lex: LINK", yy_.yytext);
            return 15;
            // removed by dead control flow

          case 96:
            yy.getLogger().debug("Lex: START_LINK", yy_.yytext);
            this.pushState("LLABEL");
            return 16;
            // removed by dead control flow

          case 97:
            yy.getLogger().debug("Lex: START_LINK", yy_.yytext);
            this.pushState("LLABEL");
            return 16;
            // removed by dead control flow

          case 98:
            yy.getLogger().debug("Lex: START_LINK", yy_.yytext);
            this.pushState("LLABEL");
            return 16;
            // removed by dead control flow

          case 99:
            this.pushState("md_string");
            break;
          case 100:
            yy.getLogger().debug("Lex: Starting string");
            this.pushState("string");
            return "LINK_LABEL";
            // removed by dead control flow

          case 101:
            this.popState();
            yy.getLogger().debug("Lex: LINK", "#" + yy_.yytext + "#");
            return 15;
            // removed by dead control flow

          case 102:
            this.popState();
            yy.getLogger().debug("Lex: LINK", yy_.yytext);
            return 15;
            // removed by dead control flow

          case 103:
            this.popState();
            yy.getLogger().debug("Lex: LINK", yy_.yytext);
            return 15;
            // removed by dead control flow

          case 104:
            yy.getLogger().debug("Lex: COLON", yy_.yytext);
            yy_.yytext = yy_.yytext.slice(1);
            return 27;
            // removed by dead control flow

        }
      }, "anonymous"),
      rules: [/^(?:block-beta\b)/, /^(?:block:)/, /^(?:block\b)/, /^(?:[\s]+)/, /^(?:[\n]+)/, /^(?:((\u000D\u000A)|(\u000A)))/, /^(?:columns\s+auto\b)/, /^(?:columns\s+[\d]+)/, /^(?:["][`])/, /^(?:[^`"]+)/, /^(?:[`]["])/, /^(?:["])/, /^(?:["])/, /^(?:[^"]*)/, /^(?:space[:]\d+)/, /^(?:space\b)/, /^(?:default\b)/, /^(?:linkStyle\b)/, /^(?:interpolate\b)/, /^(?:classDef\s+)/, /^(?:DEFAULT\s+)/, /^(?:\w+\s+)/, /^(?:[^\n]*)/, /^(?:class\s+)/, /^(?:(\w+)+((,\s*\w+)*))/, /^(?:[^\n]*)/, /^(?:style\s+)/, /^(?:(\w+)+((,\s*\w+)*))/, /^(?:[^\n]*)/, /^(?:accTitle\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*:\s*)/, /^(?:(?!\n||)*[^\n]*)/, /^(?:accDescr\s*\{\s*)/, /^(?:[\}])/, /^(?:[^\}]*)/, /^(?:end\b\s*)/, /^(?:\(\(\()/, /^(?:\)\)\))/, /^(?:[\)]\))/, /^(?:\}\})/, /^(?:\})/, /^(?:\(-)/, /^(?:-\))/, /^(?:\(\()/, /^(?:\]\])/, /^(?:\()/, /^(?:\]\))/, /^(?:\\\])/, /^(?:\/\])/, /^(?:\)\])/, /^(?:[\)])/, /^(?:\]>)/, /^(?:[\]])/, /^(?:-\))/, /^(?:\(-)/, /^(?:\)\))/, /^(?:\))/, /^(?:\(\(\()/, /^(?:\(\()/, /^(?:\{\{)/, /^(?:\{)/, /^(?:>)/, /^(?:\(\[)/, /^(?:\()/, /^(?:\[\[)/, /^(?:\[\|)/, /^(?:\[\()/, /^(?:\)\)\))/, /^(?:\[\\)/, /^(?:\[\/)/, /^(?:\[\\)/, /^(?:\[)/, /^(?:<\[)/, /^(?:[^\(\[\n\-\)\{\}\s\<\>:=]+)/, /^(?:$)/, /^(?:["][`])/, /^(?:["][`])/, /^(?:[^`"]+)/, /^(?:[`]["])/, /^(?:["])/, /^(?:["])/, /^(?:[^"]+)/, /^(?:["])/, /^(?:\]>\s*\()/, /^(?:,?\s*right\s*)/, /^(?:,?\s*left\s*)/, /^(?:,?\s*x\s*)/, /^(?:,?\s*y\s*)/, /^(?:,?\s*up\s*)/, /^(?:,?\s*down\s*)/, /^(?:\)\s*)/, /^(?:\s*[xo<]?--+[-xo>]\s*)/, /^(?:\s*[xo<]?==+[=xo>]\s*)/, /^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/, /^(?:\s*~~[\~]+\s*)/, /^(?:\s*[xo<]?--\s*)/, /^(?:\s*[xo<]?==\s*)/, /^(?:\s*[xo<]?-\.\s*)/, /^(?:["][`])/, /^(?:["])/, /^(?:\s*[xo<]?--+[-xo>]\s*)/, /^(?:\s*[xo<]?==+[=xo>]\s*)/, /^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/, /^(?::\d+)/],
      conditions: { "STYLE_DEFINITION": { "rules": [28], "inclusive": false }, "STYLE_STMNT": { "rules": [27], "inclusive": false }, "CLASSDEFID": { "rules": [22], "inclusive": false }, "CLASSDEF": { "rules": [20, 21], "inclusive": false }, "CLASS_STYLE": { "rules": [25], "inclusive": false }, "CLASS": { "rules": [24], "inclusive": false }, "LLABEL": { "rules": [99, 100, 101, 102, 103], "inclusive": false }, "ARROW_DIR": { "rules": [85, 86, 87, 88, 89, 90, 91], "inclusive": false }, "BLOCK_ARROW": { "rules": [76, 81, 84], "inclusive": false }, "NODE": { "rules": [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 77, 80], "inclusive": false }, "md_string": { "rules": [9, 10, 78, 79], "inclusive": false }, "space": { "rules": [], "inclusive": false }, "string": { "rules": [12, 13, 82, 83], "inclusive": false }, "acc_descr_multiline": { "rules": [34, 35], "inclusive": false }, "acc_descr": { "rules": [32], "inclusive": false }, "acc_title": { "rules": [30], "inclusive": false }, "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 14, 15, 16, 17, 18, 19, 23, 26, 29, 31, 33, 36, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 92, 93, 94, 95, 96, 97, 98, 104], "inclusive": true } }
    };
    return lexer2;
  })();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  (0,chunk_Y2CYZVJY/* __name */.K)(Parser, "Parser");
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
})();
parser.parser = parser;
var block_default = parser;

// src/diagrams/block/blockDB.ts

var blockDatabase = /* @__PURE__ */ new Map();
var edgeList = [];
var edgeCount = /* @__PURE__ */ new Map();
var COLOR_KEYWORD = "color";
var FILL_KEYWORD = "fill";
var BG_FILL = "bgFill";
var STYLECLASS_SEP = ",";
var classes = /* @__PURE__ */ new Map();
var diagramId = "";
var sanitizeText = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((txt) => chunk_DU6HZSFF/* common_default */.Y2.sanitizeText(txt, (0,chunk_DU6HZSFF/* getConfig2 */.D7)()), "sanitizeText");
var addStyleClass = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(id, styleAttributes = "") {
  let foundClass = classes.get(id);
  if (!foundClass) {
    foundClass = { id, styles: [], textStyles: [] };
    classes.set(id, foundClass);
  }
  if (styleAttributes !== void 0 && styleAttributes !== null) {
    styleAttributes.split(STYLECLASS_SEP).forEach((attrib) => {
      const fixedAttrib = attrib.replace(/([^;]*);/, "$1").trim();
      if (RegExp(COLOR_KEYWORD).exec(attrib)) {
        const newStyle1 = fixedAttrib.replace(FILL_KEYWORD, BG_FILL);
        const newStyle2 = newStyle1.replace(COLOR_KEYWORD, FILL_KEYWORD);
        foundClass.textStyles.push(newStyle2);
      }
      foundClass.styles.push(fixedAttrib);
    });
  }
}, "addStyleClass");
var addStyle2Node = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(id, styles = "") {
  const foundBlock = blockDatabase.get(id);
  if (styles !== void 0 && styles !== null) {
    foundBlock.styles = styles.split(STYLECLASS_SEP);
  }
}, "addStyle2Node");
var setCssClass = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(itemIds, cssClassName) {
  itemIds.split(",").forEach(function(id) {
    let foundBlock = blockDatabase.get(id);
    if (foundBlock === void 0) {
      const trimmedId = id.trim();
      foundBlock = { id: trimmedId, type: "na", children: [] };
      blockDatabase.set(trimmedId, foundBlock);
    }
    if (!foundBlock.classes) {
      foundBlock.classes = [];
    }
    foundBlock.classes.push(cssClassName);
  });
}, "setCssClass");
var populateBlockDatabase = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((_blockList, parent) => {
  const blockList = _blockList.flat();
  const children = [];
  const columnSettingBlock = blockList.find((b) => b?.type === "column-setting");
  const column = columnSettingBlock?.columns ?? -1;
  for (const block of blockList) {
    if (typeof column === "number" && column > 0 && block.type !== "column-setting" && typeof block.widthInColumns === "number" && block.widthInColumns > column) {
      chunk_X3CZISLH/* log */.R.warn(
        `Block ${block.id} width ${block.widthInColumns} exceeds configured column width ${column}`
      );
    }
    if (block.label) {
      block.label = sanitizeText(block.label);
    }
    if (block.type === "classDef") {
      addStyleClass(block.id, block.css);
      continue;
    }
    if (block.type === "applyClass") {
      setCssClass(block.id, block?.styleClass ?? "");
      continue;
    }
    if (block.type === "applyStyles") {
      if (block?.stylesStr) {
        addStyle2Node(block.id, block?.stylesStr);
      }
      continue;
    }
    if (block.type === "column-setting") {
      parent.columns = block.columns ?? -1;
    } else if (block.type === "edge") {
      const count = (edgeCount.get(block.id) ?? 0) + 1;
      edgeCount.set(block.id, count);
      block.id = count + "-" + block.id;
      edgeList.push(block);
    } else {
      if (!block.label) {
        if (block.type === "composite") {
          block.label = "";
        } else {
          block.label = block.id;
        }
      }
      const existingBlock = blockDatabase.get(block.id);
      if (existingBlock === void 0) {
        blockDatabase.set(block.id, block);
      } else {
        if (block.type !== "na") {
          existingBlock.type = block.type;
        }
        if (block.label !== block.id) {
          existingBlock.label = block.label;
        }
      }
      if (block.children) {
        populateBlockDatabase(block.children, block);
      }
      if (block.type === "space") {
        const w = block.width ?? 1;
        for (let j = 0; j < w; j++) {
          const newBlock = clone(block);
          newBlock.id = newBlock.id + "-" + j;
          blockDatabase.set(newBlock.id, newBlock);
          children.push(newBlock);
        }
      } else if (existingBlock === void 0) {
        children.push(block);
      }
    }
  }
  parent.children = children;
}, "populateBlockDatabase");
var blocks = [];
var rootBlock = { id: "root", type: "composite", children: [], columns: -1 };
var clear2 = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => {
  chunk_X3CZISLH/* log */.R.debug("Clear called");
  (0,chunk_DU6HZSFF/* clear */.IU)();
  rootBlock = { id: "root", type: "composite", children: [], columns: -1 };
  blockDatabase = /* @__PURE__ */ new Map([["root", rootBlock]]);
  blocks = [];
  classes = /* @__PURE__ */ new Map();
  edgeList = [];
  edgeCount = /* @__PURE__ */ new Map();
  diagramId = "";
}, "clear");
function typeStr2Type(typeStr) {
  chunk_X3CZISLH/* log */.R.debug("typeStr2Type", typeStr);
  switch (typeStr) {
    case "[]":
      return "square";
    case "()":
      chunk_X3CZISLH/* log */.R.debug("we have a round");
      return "round";
    case "(())":
      return "circle";
    case ">]":
      return "rect_left_inv_arrow";
    case "{}":
      return "diamond";
    case "{{}}":
      return "hexagon";
    case "([])":
      return "stadium";
    case "[[]]":
      return "subroutine";
    case "[()]":
      return "cylinder";
    case "((()))":
      return "doublecircle";
    case "[//]":
      return "lean_right";
    case "[\\\\]":
      return "lean_left";
    case "[/\\]":
      return "trapezoid";
    case "[\\/]":
      return "inv_trapezoid";
    case "<[]>":
      return "block_arrow";
    default:
      return "na";
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(typeStr2Type, "typeStr2Type");
function edgeTypeStr2Type(typeStr) {
  chunk_X3CZISLH/* log */.R.debug("typeStr2Type", typeStr);
  switch (typeStr) {
    case "==":
      return "thick";
    default:
      return "normal";
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(edgeTypeStr2Type, "edgeTypeStr2Type");
function edgeStrToEdgeData(typeStr) {
  const lastChar = typeStr.trim().slice(-1);
  switch (lastChar) {
    case "x":
      return "arrow_cross";
    case "o":
      return "arrow_circle";
    case ">":
      return "arrow_point";
    default:
      return "";
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(edgeStrToEdgeData, "edgeStrToEdgeData");
function edgeStrToEdgeStartData(typeStr) {
  const firstChar = typeStr.trim().charAt(0);
  switch (firstChar) {
    case "x":
      return "arrow_cross";
    case "o":
      return "arrow_circle";
    case "<":
      return "arrow_point";
    default:
      return "arrow_open";
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(edgeStrToEdgeStartData, "edgeStrToEdgeStartData");
function edgeStrToThickness(typeStr) {
  return typeStr.includes("==") ? "thick" : "normal";
}
(0,chunk_Y2CYZVJY/* __name */.K)(edgeStrToThickness, "edgeStrToThickness");
function edgeStrToPattern(typeStr) {
  if (typeStr.includes(".-")) {
    return "dotted";
  }
  return "solid";
}
(0,chunk_Y2CYZVJY/* __name */.K)(edgeStrToPattern, "edgeStrToPattern");
var cnt = 0;
var generateId = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => {
  cnt++;
  return "id-" + Math.random().toString(36).substr(2, 12) + "-" + cnt;
}, "generateId");
var setHierarchy = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((block) => {
  rootBlock.children = block;
  populateBlockDatabase(block, rootBlock);
  blocks = rootBlock.children;
}, "setHierarchy");
var getColumns = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((blockId) => {
  const block = blockDatabase.get(blockId);
  if (!block) {
    return -1;
  }
  if (block.columns) {
    return block.columns;
  }
  if (!block.children) {
    return -1;
  }
  return block.children.length;
}, "getColumns");
var getBlocksFlat = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => {
  return [...blockDatabase.values()];
}, "getBlocksFlat");
var getBlocks = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => {
  return blocks || [];
}, "getBlocks");
var getEdges = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => {
  return edgeList;
}, "getEdges");
var getBlock = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((id) => {
  return blockDatabase.get(id);
}, "getBlock");
var setBlock = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((block) => {
  blockDatabase.set(block.id, block);
}, "setBlock");
var setDiagramId = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((id) => {
  diagramId = id;
}, "setDiagramId");
var getDiagramId = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => diagramId, "getDiagramId");
var getLogger = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => chunk_X3CZISLH/* log */.R, "getLogger");
var getClasses = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function() {
  return classes;
}, "getClasses");
var db = {
  getConfig: /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(() => (0,chunk_DU6HZSFF/* getConfig */.zj)().block, "getConfig"),
  typeStr2Type,
  edgeTypeStr2Type,
  edgeStrToEdgeData,
  edgeStrToEdgeStartData,
  edgeStrToThickness,
  edgeStrToPattern,
  getLogger,
  getBlocksFlat,
  getBlocks,
  getEdges,
  setHierarchy,
  getBlock,
  setBlock,
  getColumns,
  getClasses,
  clear: clear2,
  generateId,
  setDiagramId,
  getDiagramId
};
var blockDB_default = db;

// src/diagrams/block/styles.ts

var fade = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((color, opacity) => {
  const channel2 = channel/* default */.A;
  const r = channel2(color, "r");
  const g = channel2(color, "g");
  const b = channel2(color, "b");
  return rgba/* default */.A(r, g, b, opacity);
}, "fade");
var getStyles = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((options) => `.label {
    font-family: ${options.fontFamily};
    color: ${options.nodeTextColor || options.textColor};
  }
  .cluster-label text {
    fill: ${options.titleColor};
  }
  .cluster-label span {
    color: ${options.titleColor};
  }



  .label text,span {
    fill: ${options.nodeTextColor || options.textColor};
    color: ${options.nodeTextColor || options.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${options.mainBkg};
    stroke: ${options.nodeBorder};
    stroke-width: 1px;
  }
  .flowchart-label text {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${options.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${options.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${options.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${options.edgeLabelBackground};
    /*
     * This is for backward compatibility with existing code that didn't
     * add a \`<p>\` around edge labels.
     *
     * TODO: We should probably remove this in a future release.
     */
    p {
      margin: 0;
      padding: 0;
      display: inline;
    }
    rect {
      opacity: 0.5;
      background-color: ${options.edgeLabelBackground};
      fill: ${options.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${options.edgeLabelBackground};
  }

  .node .cluster {
    // fill: ${fade(options.mainBkg, 0.5)};
    fill: ${fade(options.clusterBkg, 0.5)};
    stroke: ${fade(options.clusterBorder, 0.2)};
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${options.titleColor};
  }

  .cluster span {
    color: ${options.titleColor};
  }
  /* .cluster div {
    color: ${options.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${options.fontFamily};
    font-size: 12px;
    background: ${options.tertiaryColor};
    border: 1px solid ${options.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${options.textColor};
  }
  ${(0,chunk_5VM5RSS4/* getIconStyles */.o)()}
`, "getStyles");
var styles_default = getStyles;

// src/diagrams/block/blockRenderer.ts


// src/diagrams/block/layout.ts
function calculateBlockPosition(columns, position) {
  if (columns === 0 || !Number.isInteger(columns)) {
    throw new Error("Columns must be an integer !== 0.");
  }
  if (position < 0 || !Number.isInteger(position)) {
    throw new Error("Position must be a non-negative integer." + position);
  }
  if (columns < 0) {
    return { px: position, py: 0 };
  }
  if (columns === 1) {
    return { px: 0, py: position };
  }
  const px = position % columns;
  const py = Math.floor(position / columns);
  return { px, py };
}
(0,chunk_Y2CYZVJY/* __name */.K)(calculateBlockPosition, "calculateBlockPosition");
var getMaxChildSize = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)((block) => {
  let maxWidth = 0;
  let maxHeight = 0;
  for (const child of block.children) {
    const { width, height, x, y } = child.size ?? { width: 0, height: 0, x: 0, y: 0 };
    chunk_X3CZISLH/* log */.R.debug(
      "getMaxChildSize abc95 child:",
      child.id,
      "width:",
      width,
      "height:",
      height,
      "x:",
      x,
      "y:",
      y,
      child.type
    );
    if (child.type === "space") {
      continue;
    }
    const normalizedWidth = width / (child.widthInColumns ?? 1);
    if (normalizedWidth > maxWidth) {
      maxWidth = normalizedWidth;
    }
    if (height > maxHeight) {
      maxHeight = height;
    }
  }
  return { width: maxWidth, height: maxHeight };
}, "getMaxChildSize");
function setBlockSizes(block, db2, siblingWidth = 0, siblingHeight = 0, padding = 8) {
  chunk_X3CZISLH/* log */.R.debug(
    "setBlockSizes abc95 (start)",
    block.id,
    block?.size?.x,
    "block width =",
    block?.size,
    "siblingWidth",
    siblingWidth
  );
  if (!block?.size?.width) {
    block.size = {
      width: siblingWidth,
      height: siblingHeight,
      x: 0,
      y: 0
    };
  }
  let maxWidth = 0;
  let maxHeight = 0;
  if (block.children?.length > 0) {
    for (const child of block.children) {
      setBlockSizes(child, db2, 0, 0, padding);
    }
    const childSize = getMaxChildSize(block);
    maxWidth = childSize.width;
    maxHeight = childSize.height;
    chunk_X3CZISLH/* log */.R.debug("setBlockSizes abc95 maxWidth of", block.id, ":s children is ", maxWidth, maxHeight);
    for (const child of block.children) {
      if (child.size) {
        chunk_X3CZISLH/* log */.R.debug(
          `abc95 Setting size of children of ${block.id} id=${child.id} ${maxWidth} ${maxHeight} ${JSON.stringify(child.size)}`
        );
        child.size.width = maxWidth * (child.widthInColumns ?? 1) + padding * ((child.widthInColumns ?? 1) - 1);
        child.size.height = maxHeight;
        child.size.x = 0;
        child.size.y = 0;
        chunk_X3CZISLH/* log */.R.debug(
          `abc95 updating size of ${block.id} children child:${child.id} maxWidth:${maxWidth} maxHeight:${maxHeight}`
        );
      }
    }
    for (const child of block.children) {
      setBlockSizes(child, db2, maxWidth, maxHeight, padding);
    }
    const columns = block.columns ?? -1;
    let numItems = 0;
    for (const child of block.children) {
      numItems += child.widthInColumns ?? 1;
    }
    let xSize = block.children.length;
    if (columns > 0 && columns < numItems) {
      xSize = columns;
    }
    const ySize = Math.ceil(numItems / xSize);
    let width = xSize * (maxWidth + padding) + padding;
    let height = ySize * (maxHeight + padding) + padding;
    if (width < siblingWidth) {
      chunk_X3CZISLH/* log */.R.debug(
        `Detected to small sibling: abc95 ${block.id} siblingWidth ${siblingWidth} siblingHeight ${siblingHeight} width ${width}`
      );
      width = siblingWidth;
      height = siblingHeight;
      const childWidth = (siblingWidth - xSize * padding - padding) / xSize;
      const childHeight = (siblingHeight - ySize * padding - padding) / ySize;
      chunk_X3CZISLH/* log */.R.debug("Size indata abc88", block.id, "childWidth", childWidth, "maxWidth", maxWidth);
      chunk_X3CZISLH/* log */.R.debug("Size indata abc88", block.id, "childHeight", childHeight, "maxHeight", maxHeight);
      chunk_X3CZISLH/* log */.R.debug("Size indata abc88 xSize", xSize, "padding", padding);
      for (const child of block.children) {
        if (child.size) {
          child.size.width = childWidth;
          child.size.height = childHeight;
          child.size.x = 0;
          child.size.y = 0;
        }
      }
    }
    chunk_X3CZISLH/* log */.R.debug(
      `abc95 (finale calc) ${block.id} xSize ${xSize} ySize ${ySize} columns ${columns}${block.children.length} width=${Math.max(width, block.size?.width || 0)}`
    );
    if (width < (block?.size?.width || 0)) {
      width = block?.size?.width || 0;
      const num = columns > 0 ? Math.min(block.children.length, columns) : block.children.length;
      if (num > 0) {
        const childWidth = (width - num * padding - padding) / num;
        chunk_X3CZISLH/* log */.R.debug("abc95 (growing to fit) width", block.id, width, block.size?.width, childWidth);
        for (const child of block.children) {
          if (child.size) {
            child.size.width = childWidth;
          }
        }
      }
    }
    block.size = {
      width,
      height,
      x: 0,
      y: 0
    };
  }
  chunk_X3CZISLH/* log */.R.debug(
    "setBlockSizes abc94 (done)",
    block.id,
    block?.size?.x,
    block?.size?.width,
    block?.size?.y,
    block?.size?.height
  );
}
(0,chunk_Y2CYZVJY/* __name */.K)(setBlockSizes, "setBlockSizes");
function layoutBlocks(block, db2, padding = 8) {
  chunk_X3CZISLH/* log */.R.debug(
    `abc85 layout blocks (=>layoutBlocks) ${block.id} x: ${block?.size?.x} y: ${block?.size?.y} width: ${block?.size?.width}`
  );
  const columns = block.columns ?? -1;
  chunk_X3CZISLH/* log */.R.debug("layoutBlocks columns abc95", block.id, "=>", columns, block);
  if (block.children && // find max width of children
  block.children.length > 0) {
    const width = block?.children[0]?.size?.width ?? 0;
    const widthOfChildren = block.children.length * width + (block.children.length - 1) * padding;
    chunk_X3CZISLH/* log */.R.debug("widthOfChildren 88", widthOfChildren, "posX");
    const rowHeights = /* @__PURE__ */ new Map();
    {
      let colPos = 0;
      for (const child of block.children) {
        if (!child.size) {
          continue;
        }
        const { py } = calculateBlockPosition(columns, colPos);
        const currentMax = rowHeights.get(py) ?? 0;
        if (child.size.height > currentMax) {
          rowHeights.set(py, child.size.height);
        }
        let filled = child?.widthInColumns ?? 1;
        if (columns > 0) {
          filled = Math.min(filled, columns - colPos % columns);
        }
        colPos += filled;
      }
    }
    const rowYOffsets = /* @__PURE__ */ new Map();
    {
      let offset = 0;
      const rows = [...rowHeights.keys()].sort((a, b) => a - b);
      for (const row of rows) {
        rowYOffsets.set(row, offset);
        offset += (rowHeights.get(row) ?? 0) + padding;
      }
    }
    let columnPos = 0;
    chunk_X3CZISLH/* log */.R.debug("abc91 block?.size?.x", block.id, block?.size?.x);
    let startingPosX = block?.size?.x ? block?.size?.x + (-block?.size?.width / 2 || 0) : -padding;
    let rowPos = 0;
    for (const child of block.children) {
      const parent = block;
      if (!child.size) {
        continue;
      }
      const { width: width2, height } = child.size;
      const { px, py } = calculateBlockPosition(columns, columnPos);
      if (py != rowPos) {
        rowPos = py;
        startingPosX = block?.size?.x ? block?.size?.x + (-block?.size?.width / 2 || 0) : -padding;
        chunk_X3CZISLH/* log */.R.debug("New row in layout for block", block.id, " and child ", child.id, rowPos);
      }
      chunk_X3CZISLH/* log */.R.debug(
        `abc89 layout blocks (child) id: ${child.id} Pos: ${columnPos} (px, py) ${px},${py} (${parent?.size?.x},${parent?.size?.y}) parent: ${parent.id} width: ${width2}${padding}`
      );
      if (parent.size) {
        const halfWidth = width2 / 2;
        child.size.x = startingPosX + padding + halfWidth;
        chunk_X3CZISLH/* log */.R.debug(
          `abc91 layout blocks (calc) px, pyid:${child.id} startingPos=X${startingPosX} new startingPosX${child.size.x} ${halfWidth} padding=${padding} width=${width2} halfWidth=${halfWidth} => x:${child.size.x} y:${child.size.y} ${child.widthInColumns} (width * (child?.w || 1)) / 2 ${width2 * (child?.widthInColumns ?? 1) / 2}`
        );
        startingPosX = child.size.x + halfWidth;
        const rowYOffset = rowYOffsets.get(py) ?? 0;
        const rowHeight = rowHeights.get(py) ?? height;
        child.size.y = parent.size.y - parent.size.height / 2 + rowYOffset + rowHeight / 2 + padding;
        chunk_X3CZISLH/* log */.R.debug(
          `abc88 layout blocks (calc) px, pyid:${child.id}startingPosX${startingPosX}${padding}${halfWidth}=>x:${child.size.x}y:${child.size.y}${child.widthInColumns}(width * (child?.w || 1)) / 2${width2 * (child?.widthInColumns ?? 1) / 2}`
        );
      }
      if (child.children) {
        layoutBlocks(child, db2, padding);
      }
      let columnsFilled = child?.widthInColumns ?? 1;
      if (columns > 0) {
        columnsFilled = Math.min(columnsFilled, columns - columnPos % columns);
      }
      columnPos += columnsFilled;
      chunk_X3CZISLH/* log */.R.debug("abc88 columnsPos", child, columnPos);
    }
  }
  chunk_X3CZISLH/* log */.R.debug(
    `layout blocks (<==layoutBlocks) ${block.id} x: ${block?.size?.x} y: ${block?.size?.y} width: ${block?.size?.width}`
  );
}
(0,chunk_Y2CYZVJY/* __name */.K)(layoutBlocks, "layoutBlocks");
function findBounds(block, { minX, minY, maxX, maxY } = { minX: 0, minY: 0, maxX: 0, maxY: 0 }) {
  if (block.size && block.id !== "root") {
    const { x, y, width, height } = block.size;
    if (x - width / 2 < minX) {
      minX = x - width / 2;
    }
    if (y - height / 2 < minY) {
      minY = y - height / 2;
    }
    if (x + width / 2 > maxX) {
      maxX = x + width / 2;
    }
    if (y + height / 2 > maxY) {
      maxY = y + height / 2;
    }
  }
  if (block.children) {
    for (const child of block.children) {
      ({ minX, minY, maxX, maxY } = findBounds(child, { minX, minY, maxX, maxY }));
    }
  }
  return { minX, minY, maxX, maxY };
}
(0,chunk_Y2CYZVJY/* __name */.K)(findBounds, "findBounds");
function layout(db2) {
  const root = db2.getBlock("root");
  if (!root) {
    return;
  }
  const padding = (0,chunk_DU6HZSFF/* getConfig2 */.D7)()?.block?.padding ?? 8;
  setBlockSizes(root, db2, 0, 0, padding);
  layoutBlocks(root, db2, padding);
  chunk_X3CZISLH/* log */.R.debug("getBlocks", JSON.stringify(root, null, 2));
  const { minX, minY, maxX, maxY } = findBounds(root);
  const height = maxY - minY;
  const width = maxX - minX;
  return { x: minX, y: minY, width, height };
}
(0,chunk_Y2CYZVJY/* __name */.K)(layout, "layout");

// src/diagrams/block/renderHelpers.ts

function getNodeFromBlock(block, db2, positioned = false) {
  const vertex = block;
  let classStr = "default";
  if ((vertex?.classes?.length || 0) > 0) {
    classStr = (vertex?.classes ?? []).join(" ");
  }
  classStr = classStr + " flowchart-label";
  const cssCompiledStyles = (vertex?.classes ?? []).flatMap(
    (className) => db2.getClasses().get(className)?.styles ?? []
  );
  let radius = 0;
  let shape = "rect";
  let padding;
  switch (vertex.type) {
    case "round":
      radius = 5;
      shape = "rect";
      break;
    case "composite":
      radius = 0;
      shape = "composite";
      padding = 0;
      break;
    case "square":
      shape = "rect";
      break;
    case "diamond":
      shape = "question";
      break;
    case "hexagon":
      shape = "hexagon";
      break;
    case "block_arrow":
      shape = "block_arrow";
      break;
    case "odd":
      shape = "rect_left_inv_arrow";
      break;
    case "lean_right":
      shape = "lean_right";
      break;
    case "lean_left":
      shape = "lean_left";
      break;
    case "trapezoid":
      shape = "trapezoid";
      break;
    case "inv_trapezoid":
      shape = "inv_trapezoid";
      break;
    case "rect_left_inv_arrow":
      shape = "rect_left_inv_arrow";
      break;
    case "circle":
      shape = "circle";
      break;
    case "ellipse":
      shape = "ellipse";
      break;
    case "stadium":
      shape = "stadium";
      break;
    case "subroutine":
      shape = "subroutine";
      break;
    case "cylinder":
      shape = "cylinder";
      break;
    case "group":
      shape = "rect";
      break;
    case "doublecircle":
      shape = "doublecircle";
      break;
    default:
      shape = "rect";
  }
  const styles = (0,chunk_75Z2AOVW/* getStylesFromArray */.sM)(vertex?.styles ?? []);
  const vertexText = vertex.label;
  const bounds = vertex.size ?? { width: 0, height: 0, x: 0, y: 0 };
  const dbDiagramId = db2.getDiagramId();
  const node = {
    labelStyle: styles.labelStyle,
    shape,
    label: vertexText,
    labelText: vertexText,
    rx: radius,
    ry: radius,
    class: classStr,
    cssClasses: classStr,
    cssStyles: vertex?.styles ?? [],
    cssCompiledStyles,
    style: styles.style,
    id: vertex.id,
    domId: dbDiagramId ? `${dbDiagramId}-${vertex.id}` : vertex.id,
    isGroup: false,
    directions: vertex.directions,
    width: bounds.width || void 0,
    height: bounds.height || void 0,
    wrappingWidth: bounds.width || Number.POSITIVE_INFINITY,
    x: bounds.x,
    y: bounds.y,
    positioned,
    intersect: void 0,
    padding: padding ?? (0,chunk_DU6HZSFF/* getConfig */.zj)()?.block?.padding ?? 0,
    widthInColumns: vertex.widthInColumns ?? 1
  };
  return node;
}
(0,chunk_Y2CYZVJY/* __name */.K)(getNodeFromBlock, "getNodeFromBlock");
async function calculateBlockSize(elem, block, db2) {
  const node = getNodeFromBlock(block, db2, false);
  if (block.type === "group") {
    return;
  }
  const config = (0,chunk_DU6HZSFF/* getConfig */.zj)();
  const nodeEl = await (0,chunk_OBVCFTLP/* insertNode */.on)(elem, node, { config });
  const boundingBox = nodeEl.node()?.getBBox() ?? { width: 0, height: 0 };
  const obj = db2.getBlock(node.id);
  obj.size = { width: boundingBox.width, height: boundingBox.height, x: 0, y: 0, node: nodeEl };
  db2.setBlock(obj);
  nodeEl.remove();
}
(0,chunk_Y2CYZVJY/* __name */.K)(calculateBlockSize, "calculateBlockSize");
async function insertBlockPositioned(elem, block, db2) {
  const node = getNodeFromBlock(block, db2, true);
  const obj = db2.getBlock(node.id);
  if (obj.type !== "space") {
    const config = (0,chunk_DU6HZSFF/* getConfig */.zj)();
    await (0,chunk_OBVCFTLP/* insertNode */.on)(elem, node, { config });
    block.intersect = node?.intersect;
    (0,chunk_OBVCFTLP/* positionNode */.U_)(node);
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(insertBlockPositioned, "insertBlockPositioned");
async function performOperations(elem, blocks2, db2, operation) {
  for (const block of blocks2) {
    await operation(elem, block, db2);
    if (block.children) {
      await performOperations(elem, block.children, db2, operation);
    }
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(performOperations, "performOperations");
async function calculateBlockSizes(elem, blocks2, db2) {
  await performOperations(elem, blocks2, db2, calculateBlockSize);
}
(0,chunk_Y2CYZVJY/* __name */.K)(calculateBlockSizes, "calculateBlockSizes");
async function insertBlocks(elem, blocks2, db2) {
  await performOperations(elem, blocks2, db2, insertBlockPositioned);
}
(0,chunk_Y2CYZVJY/* __name */.K)(insertBlocks, "insertBlocks");
async function insertEdges(elem, edges, blocks2, db2, id) {
  const g = new graphlib/* Graph */.T({
    multigraph: true,
    compound: true
  });
  g.setGraph({
    rankdir: "TB",
    nodesep: 10,
    ranksep: 10,
    marginx: 8,
    marginy: 8
  });
  for (const block of blocks2) {
    if (block.size) {
      g.setNode(block.id, {
        width: block.size.width,
        height: block.size.height,
        intersect: block.intersect
      });
    }
  }
  for (const edge of edges) {
    if (edge.start && edge.end) {
      const startBlock = db2.getBlock(edge.start);
      const endBlock = db2.getBlock(edge.end);
      if (startBlock?.size && endBlock?.size) {
        const start = startBlock.size;
        const end = endBlock.size;
        const points = [
          { x: start.x, y: start.y },
          { x: start.x + (end.x - start.x) / 2, y: start.y + (end.y - start.y) / 2 },
          { x: end.x, y: end.y }
        ];
        const prefixedEdgeId = id ? `${id}-${edge.id}` : edge.id;
        const thicknessClass = edge.thickness === "thick" ? "edge-thickness-thick" : "edge-thickness-normal";
        const patternClass = edge.pattern === "dotted" ? "edge-pattern-dotted" : "edge-pattern-solid";
        const dynamicClasses = `${thicknessClass} ${patternClass} flowchart-link LS-a1 LE-b1`;
        (0,chunk_R7TYR2AO/* insertEdge */.Jo)(
          elem,
          {
            ...edge,
            id: prefixedEdgeId,
            arrowTypeEnd: edge.arrowTypeEnd,
            arrowTypeStart: edge.arrowTypeStart,
            points,
            classes: dynamicClasses
          },
          {},
          "block",
          g.node(edge.start),
          g.node(edge.end),
          id
        );
        if (edge.label) {
          await (0,chunk_R7TYR2AO/* insertEdgeLabel */.jP)(elem, {
            ...edge,
            label: edge.label,
            labelStyle: "stroke: #333; stroke-width: 1.5px;fill:none;",
            arrowTypeEnd: edge.arrowTypeEnd,
            arrowTypeStart: edge.arrowTypeStart,
            points,
            classes: dynamicClasses
          });
          (0,chunk_R7TYR2AO/* positionEdgeLabel */.T_)(
            { ...edge, x: points[1].x, y: points[1].y },
            {
              originalPath: points
            }
          );
        }
      }
    }
  }
}
(0,chunk_Y2CYZVJY/* __name */.K)(insertEdges, "insertEdges");

// src/diagrams/block/blockRenderer.ts
var getClasses2 = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(function(text, diagObj) {
  return diagObj.db.getClasses();
}, "getClasses");
var draw = /* @__PURE__ */ (0,chunk_Y2CYZVJY/* __name */.K)(async function(text, id, _version, diagObj) {
  const { securityLevel, block: conf } = (0,chunk_DU6HZSFF/* getConfig */.zj)();
  const db2 = diagObj.db;
  db2.setDiagramId(id);
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = (0,src/* select */.Ltv)("#i" + id);
  }
  const root = securityLevel === "sandbox" ? (0,src/* select */.Ltv)(sandboxElement.nodes()[0].contentDocument.body) : (0,src/* select */.Ltv)("body");
  const svg = securityLevel === "sandbox" ? root.select(`[id="${id}"]`) : (0,src/* select */.Ltv)(`[id="${id}"]`);
  const markers = ["point", "circle", "cross"];
  (0,chunk_R7TYR2AO/* markers_default */.g0)(svg, markers, diagObj.type, id);
  const bl = db2.getBlocks();
  const blArr = db2.getBlocksFlat();
  const edges = db2.getEdges();
  const nodes = svg.insert("g").attr("class", "block");
  await calculateBlockSizes(nodes, bl, db2);
  const bounds = layout(db2);
  await insertBlocks(nodes, bl, db2);
  await insertEdges(nodes, edges, blArr, db2, id);
  const renderedBounds = nodes.node()?.getBBox();
  const bounds2 = renderedBounds && Number.isFinite(renderedBounds.width) && Number.isFinite(renderedBounds.height) ? renderedBounds : bounds;
  if (bounds2) {
    const magicFactor = Math.max(1, Math.round(0.125 * (bounds2.width / bounds2.height)));
    const height = bounds2.height + magicFactor + 10;
    const width = bounds2.width + 10;
    const { useMaxWidth } = conf;
    (0,chunk_DU6HZSFF/* configureSvgSize */.a$)(svg, height, width, !!useMaxWidth);
    chunk_X3CZISLH/* log */.R.debug("Here Bounds", bounds, bounds2);
    svg.attr(
      "viewBox",
      `${bounds2.x - 5} ${bounds2.y - 5} ${bounds2.width + 10} ${bounds2.height + 10}`
    );
  }
}, "draw");
var blockRenderer_default = {
  draw,
  getClasses: getClasses2
};

// src/diagrams/block/blockDiagram.ts
var diagram = {
  parser: block_default,
  db: blockDB_default,
  renderer: blockRenderer_default,
  styles: styles_default
};



/***/ },

/***/ 92672
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ getIconStyles)
/* harmony export */ });
/* harmony import */ var _chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54681);


// src/diagrams/globalStyles.ts
var getIconStyles = /* @__PURE__ */ (0,_chunk_Y2CYZVJY_mjs__WEBPACK_IMPORTED_MODULE_0__/* .__name */ .K)(() => `
  /* Font Awesome icon styling - consolidated */
  .label-icon {
    display: inline-block;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
  }
  
  .node .label-icon path {
    fill: currentColor;
    stroke: revert;
    stroke-width: revert;
  }
`, "getIconStyles");




/***/ }

}]);