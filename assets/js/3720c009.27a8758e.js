"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[84787],{

/***/ 45756:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DocTagsListPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11750);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(18586);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(53237);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(75482);
/* harmony import */ var _theme_TagsListByLetter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74207);
/* harmony import */ var _theme_SearchMetadata__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(689);
/* harmony import */ var _theme_Heading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81381);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocTagsListPageMetadata({title}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment,{children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_5__/* .PageMetadata */ .be,{title:title}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_theme_SearchMetadata__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{tag:"doc_tags_list"})]});}function DocTagsListPageContent({tags,title}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_5__/* .HtmlClassNameProvider */ .e3,{className:(0,clsx__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_7__/* .ThemeClassNames */ .G.page.docsTagsListPage),children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div",{className:"container margin-vert--lg",children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div",{className:"row",children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("main",{className:"col col--8 col--offset-2",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_theme_Heading__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,{as:"h1",children:title}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_theme_TagsListByLetter__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{tags:tags})]})})})});}function DocTagsListPage(props){const title=(0,_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_8__/* .translateTagsPageTitle */ .b)();return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment,{children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(DocTagsListPageMetadata,{...props,title:title}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(DocTagsListPageContent,{...props,title:title})]});}

/***/ }),

/***/ 32515:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Tag)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(45968);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Tag/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tag":"tag_otG2","tagRegular":"tagRegular_s0E1","tagWithCount":"tagWithCount_PGyn"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Tag/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function Tag({permalink,label,count,description}){return/*#__PURE__*/(0,jsx_runtime.jsxs)(Link/* default */.A,{rel:"tag",href:permalink,title:description,className:(0,clsx/* default */.A)(styles_module.tag,count?styles_module.tagWithCount:styles_module.tagRegular),children:[label,count&&/*#__PURE__*/(0,jsx_runtime.jsx)("span",{children:count})]});}

/***/ }),

/***/ 74207:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TagsListByLetter)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/tagsUtils.js
var tagsUtils = __webpack_require__(75482);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Tag/index.js + 1 modules
var Tag = __webpack_require__(32515);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Heading/index.js + 1 modules
var Heading = __webpack_require__(81381);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/TagsListByLetter/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tag":"tag_FHL6"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/TagsListByLetter/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function TagLetterEntryItem({letterEntry}){return/*#__PURE__*/(0,jsx_runtime.jsxs)("article",{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(Heading/* default */.A,{as:"h2",id:letterEntry.letter,children:letterEntry.letter}),/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{className:"padding--none",children:letterEntry.tags.map(tag=>/*#__PURE__*/(0,jsx_runtime.jsx)("li",{className:styles_module.tag,children:/*#__PURE__*/(0,jsx_runtime.jsx)(Tag/* default */.A,{...tag})},tag.permalink))}),/*#__PURE__*/(0,jsx_runtime.jsx)("hr",{})]});}function TagsListByLetter({tags}){const letterList=(0,tagsUtils/* listTagsByLetters */.Q)(tags);return/*#__PURE__*/(0,jsx_runtime.jsx)("section",{className:"margin-vert--lg",children:letterList.map(letterEntry=>/*#__PURE__*/(0,jsx_runtime.jsx)(TagLetterEntryItem,{letterEntry:letterEntry},letterEntry.letter))});}

/***/ }),

/***/ 75482:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ listTagsByLetters),
/* harmony export */   b: () => (/* binding */ translateTagsPageTitle)
/* harmony export */ });
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6590);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const translateTagsPageTitle=()=>(0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_0__/* .translate */ .T)({id:'theme.tags.tagsPageTitle',message:'Tags',description:'The title of the tag list page'});function getTagLetter(tag){return tag[0].toUpperCase();}/**
 * Takes a list of tags (as provided by the content plugins), and groups them by
 * their initials.
 */function listTagsByLetters(tags){const groups={};Object.values(tags).forEach(tag=>{const initial=getTagLetter(tag.label);groups[initial]??=[];groups[initial].push(tag);});return Object.entries(groups)// Sort letters
.sort(([letter1],[letter2])=>letter1.localeCompare(letter2)).map(([letter,letterTags])=>{// Sort tags inside a letter
const sortedTags=letterTags.sort((tag1,tag2)=>tag1.label.localeCompare(tag2.label));return{letter,tags:sortedTags};});}

/***/ })

}]);