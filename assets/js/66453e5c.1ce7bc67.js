"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[95006],{

/***/ 48419:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16655);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63696);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62540);
function TailWindThemeSelector(){function updadeTailwindDarkTheme(){if(!document?.documentElement){return;}const html=document.documentElement;if(html.dataset?.theme==='dark'){html.classList.add('dark');setTimeout(()=>{html.classList.add('dark');},100);}else{html.classList.remove('dark');setTimeout(()=>{html.classList.remove('dark');},100);}}(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{if(_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM){updadeTailwindDarkTheme();}},[_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM]);// monitor the attribute managed by docusaurus
(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{if(!_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM){return;}const mutationObserver=new MutationObserver(mutations=>{mutations.forEach(mutation=>{if(mutation.type==='attributes'&&(mutation.attributeName==='data-rh'||mutation.attributeName==='data-theme')){updadeTailwindDarkTheme();}});});mutationObserver.observe(document.documentElement,{attributes:true,childList:false,subtree:false});return()=>{mutationObserver.disconnect();};},[_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM]);return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{});}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TailWindThemeSelector);

/***/ }),

/***/ 11283:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Extensions)
/* harmony export */ });
/* harmony import */ var _docusaurus_useDocusaurusContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67032);
/* harmony import */ var _site_src_components_TailWindThemeSelector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(48419);
/* harmony import */ var _theme_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16805);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62540);
function ExtensionListFromIframe(){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("iframe",{title:"Extensions Catalog",src:"https://registry.podman-desktop.io/",className:"w-full min-h-[2000px] h-full"});}function Extensions(){const{siteConfig}=(0,_docusaurus_useDocusaurusContext__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)();return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_theme_Layout__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{title:siteConfig.title,description:"Extensions",wrapperClassName:"h-full",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_site_src_components_TailWindThemeSelector__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(ExtensionListFromIframe,{})]});}

/***/ })

}]);