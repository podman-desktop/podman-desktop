"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[24279],{

/***/ 73603:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Admonition)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-common/lib/utils/admonitionUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children){const items=react.Children.toArray(children);const mdxAdmonitionTitleWrapper=items.find(item=>/*#__PURE__*/react.isValidElement(item)&&item.type==='mdxAdmonitionTitle');const rest=items.filter(item=>item!==mdxAdmonitionTitleWrapper);const mdxAdmonitionTitle=mdxAdmonitionTitleWrapper?.props.children;return{mdxAdmonitionTitle,rest:rest.length>0?/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:rest}):null};}function processAdmonitionProps(props){const{mdxAdmonitionTitle,rest}=extractMDXAdmonitionTitle(props.children);const title=props.title??mdxAdmonitionTitle;return{...props,// Do not return "title: undefined" prop
// this might create unwanted props overrides when merging props
// For example: {...default,...props}
...(title&&{title}),children:rest};}
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(6590);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(53237);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Layout/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"admonition":"admonition_WCGJ","admonitionHeading":"admonitionHeading_GCBg","admonitionIcon":"admonitionIcon_L39b","admonitionContent":"admonitionContent_pbrs"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Layout/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionContainer({type,className,children}){return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.common.admonition,ThemeClassNames/* ThemeClassNames */.G.common.admonitionType(type),styles_module.admonition,className),children:children});}function AdmonitionHeading({icon,title}){return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:styles_module.admonitionHeading,children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:styles_module.admonitionIcon,children:icon}),title]});}function AdmonitionContent({children}){return children?/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:styles_module.admonitionContent,children:children}):null;}function AdmonitionLayout(props){const{type,icon,title,children,className}=props;return/*#__PURE__*/(0,jsx_runtime.jsxs)(AdmonitionContainer,{type:type,className:className,children:[title||icon?/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionHeading,{title:title,icon:icon}):null,/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionContent,{children:children})]});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Note.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconNote(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 14 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Note.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const infimaClassName='alert alert--secondary';const defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconNote,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)",children:"note"})};function AdmonitionTypeNote(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...defaultProps,...props,className:(0,clsx/* default */.A)(infimaClassName,props.className),children:props.children});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Tip.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconTip(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 12 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Tip.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Tip_infimaClassName='alert alert--success';const Tip_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconTip,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)",children:"tip"})};function AdmonitionTypeTip(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Tip_defaultProps,...props,className:(0,clsx/* default */.A)(Tip_infimaClassName,props.className),children:props.children});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Info.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconInfo(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 14 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Info.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Info_infimaClassName='alert alert--info';const Info_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconInfo,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)",children:"info"})};function AdmonitionTypeInfo(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Info_defaultProps,...props,className:(0,clsx/* default */.A)(Info_infimaClassName,props.className),children:props.children});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Warning.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconCaution(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 16 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Warning.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Warning_infimaClassName='alert alert--warning';const Warning_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconCaution,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.warning",description:"The default label used for the Warning admonition (:::warning)",children:"warning"})};function AdmonitionTypeWarning(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Warning_defaultProps,...props,className:(0,clsx/* default */.A)(Warning_infimaClassName,props.className),children:props.children});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Danger.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconDanger(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 12 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Danger.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Danger_infimaClassName='alert alert--danger';const Danger_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconDanger,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)",children:"danger"})};function AdmonitionTypeDanger(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Danger_defaultProps,...props,className:(0,clsx/* default */.A)(Danger_infimaClassName,props.className),children:props.children});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Caution.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Caution_infimaClassName='alert alert--warning';const Caution_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconCaution,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)",children:"caution"})};// TODO remove before v4: Caution replaced by Warning
// see https://github.com/facebook/docusaurus/issues/7558
function AdmonitionTypeCaution(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Caution_defaultProps,...props,className:(0,clsx/* default */.A)(Caution_infimaClassName,props.className),children:props.children});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Types.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const admonitionTypes={note:AdmonitionTypeNote,tip:AdmonitionTypeTip,info:AdmonitionTypeInfo,warning:AdmonitionTypeWarning,danger:AdmonitionTypeDanger};// Undocumented legacy admonition type aliases
// Provide hardcoded/untranslated retrocompatible label
// See also https://github.com/facebook/docusaurus/issues/7767
const admonitionAliases={secondary:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeNote,{title:"secondary",...props}),important:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeInfo,{title:"important",...props}),success:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeTip,{title:"success",...props}),caution:AdmonitionTypeCaution};/* harmony default export */ const Types = ({...admonitionTypes,...admonitionAliases});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Admonition/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function getAdmonitionTypeComponent(type){const component=Types[type];if(component){return component;}console.warn(`No admonition component found for admonition type "${type}". Using Info as fallback.`);return Types.info;}function Admonition(unprocessedProps){const props=processAdmonitionProps(unprocessedProps);const AdmonitionTypeComponent=getAdmonitionTypeComponent(props.type);return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeComponent,{...props});}

/***/ }),

/***/ 40840:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Unlisted)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(11750);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3242);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(53237);
/* harmony import */ var _theme_Admonition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73603);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function UnlistedBanner({className}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_theme_Admonition__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{type:"caution",title:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_3__/* .UnlistedBannerTitle */ .Rc,{}),className:(0,clsx__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(className,_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_5__/* .ThemeClassNames */ .G.common.unlistedBanner),children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_3__/* .UnlistedBannerMessage */ .Uh,{})});}function Unlisted(props){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,{children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_3__/* .UnlistedMetadata */ .AE,{}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(UnlistedBanner,{...props})]});}

/***/ }),

/***/ 3255:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DocTagDocListPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(11750);
/* harmony import */ var _docusaurus_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(45968);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(32815);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(18586);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(53237);
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6590);
/* harmony import */ var _theme_SearchMetadata__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(689);
/* harmony import */ var _theme_ContentVisibility_Unlisted__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(40840);
/* harmony import */ var _theme_Heading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(81381);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Very simple pluralization: probably good enough for now
function useNDocsTaggedPlural(){const{selectMessage}=(0,_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_7__/* .usePluralForm */ .W)();return count=>selectMessage(count,(0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .T)({id:'theme.docs.tagDocListPageTitle.nDocsTagged',description:'Pluralized label for "{count} docs tagged". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:'One doc tagged|{count} docs tagged'},{count}));}function usePageTitle(props){const nDocsTaggedPlural=useNDocsTaggedPlural();return (0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .T)({id:'theme.docs.tagDocListPageTitle',description:'The title of the page for a docs tag',message:'{nDocsTagged} with "{tagName}"'},{nDocsTagged:nDocsTaggedPlural(props.tag.count),tagName:props.tag.label});}function DocItem({doc}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("article",{className:"margin-vert--lg",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_docusaurus_Link__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{to:doc.permalink,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_theme_Heading__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A,{as:"h2",children:doc.title})}),doc.description&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p",{children:doc.description})]});}function DocTagDocListPageMetadata({title,tag}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment,{children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_8__/* .PageMetadata */ .be,{title:title,description:tag.description}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_theme_SearchMetadata__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,{tag:"doc_tag_doc_list"})]});}function DocTagDocListPageContent({tag,title}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_8__/* .HtmlClassNameProvider */ .e3,{className:(0,clsx__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_10__/* .ThemeClassNames */ .G.page.docsTagDocListPage),children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div",{className:"container margin-vert--lg",children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div",{className:"row",children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("main",{className:"col col--8 col--offset-2",children:[tag.unlisted&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_theme_ContentVisibility_Unlisted__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A,{}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("header",{className:"margin-bottom--xl",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_theme_Heading__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A,{as:"h1",children:title}),tag.description&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p",{children:tag.description}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_docusaurus_Link__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{href:tag.allTagsPath,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View all tags"})})]}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("section",{className:"margin-vert--lg",children:tag.items.map(doc=>/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(DocItem,{doc:doc},doc.id))})]})})})});}function DocTagDocListPage(props){const title=usePageTitle(props);return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment,{children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(DocTagDocListPageMetadata,{...props,title:title}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(DocTagDocListPageContent,{...props,title:title})]});}

/***/ }),

/***/ 3242:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AE: () => (/* binding */ UnlistedMetadata),
/* harmony export */   Rc: () => (/* binding */ UnlistedBannerTitle),
/* harmony export */   TT: () => (/* binding */ DraftBannerMessage),
/* harmony export */   Uh: () => (/* binding */ UnlistedBannerMessage),
/* harmony export */   Yh: () => (/* binding */ DraftBannerTitle)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _docusaurus_Head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(57854);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function UnlistedBannerTitle(){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"});}function UnlistedBannerMessage(){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."});}// TODO Docusaurus v4 breaking change (since it's v3 public theme-common API :/)
//  Move this to theme/ContentVisibility/Unlisted
function UnlistedMetadata(){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Head__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("meta",{name:"robots",content:"noindex, nofollow"})});}function DraftBannerTitle(){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"});}function DraftBannerMessage(){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."});}

/***/ }),

/***/ 32815:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ usePluralForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var _docusaurus_useDocusaurusContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67032);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// We want to ensurer a stable plural form order in all cases
// It is more convenient and natural to handle "small values" first
// See https://x.com/sebastienlorber/status/1366820663261077510
const OrderedPluralForms=['zero','one','two','few','many','other'];function sortPluralForms(pluralForms){return OrderedPluralForms.filter(pf=>pluralForms.includes(pf));}// Hardcoded english/fallback implementation
const EnglishPluralForms={locale:'en',pluralForms:sortPluralForms(['one','other']),select:count=>count===1?'one':'other'};function createLocalePluralForms(locale){const pluralRules=new Intl.PluralRules(locale);return{locale,pluralForms:sortPluralForms(pluralRules.resolvedOptions().pluralCategories),select:count=>pluralRules.select(count)};}/**
 * Poor man's `PluralSelector` implementation, using an English fallback. We
 * want a lightweight, future-proof and good-enough solution. We don't want a
 * perfect and heavy solution.
 *
 * Docusaurus classic theme has only 2 deeply nested labels requiring complex
 * plural rules. We don't want to use `Intl` + `PluralRules` polyfills + full
 * ICU syntax (react-intl) just for that.
 *
 * Notes:
 * - 2021: 92+% Browsers support `Intl.PluralRules`, and support will increase
 * in the future
 * - NodeJS >= 13 has full ICU support by default
 * - In case of "mismatch" between SSR and Browser ICU support, React keeps
 * working!
 */function useLocalePluralForms(){const{i18n:{currentLocale}}=(0,_docusaurus_useDocusaurusContext__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)();return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>{try{return createLocalePluralForms(currentLocale);}catch(err){console.error(`Failed to use Intl.PluralRules for locale "${currentLocale}".
Docusaurus will fallback to the default (English) implementation.
Error: ${err.message}
`);return EnglishPluralForms;}},[currentLocale]);}function selectPluralMessage(pluralMessages,count,localePluralForms){const separator='|';const parts=pluralMessages.split(separator);if(parts.length===1){return parts[0];}if(parts.length>localePluralForms.pluralForms.length){console.error(`For locale=${localePluralForms.locale}, a maximum of ${localePluralForms.pluralForms.length} plural forms are expected (${localePluralForms.pluralForms.join(',')}), but the message contains ${parts.length}: ${pluralMessages}`);}const pluralForm=localePluralForms.select(count);const pluralFormIndex=localePluralForms.pluralForms.indexOf(pluralForm);// In case of not enough plural form messages, we take the last one (other)
// instead of returning undefined
return parts[Math.min(pluralFormIndex,parts.length-1)];}/**
 * Reads the current locale and returns an interface very similar to
 * `Intl.PluralRules`.
 */function usePluralForm(){const localePluralForm=useLocalePluralForms();return{selectMessage:(count,pluralMessages)=>selectPluralMessage(pluralMessages,count,localePluralForm)};}

/***/ })

}]);