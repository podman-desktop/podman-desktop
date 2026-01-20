"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[79048],{

/***/ 33699
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ IconArrow)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function IconArrow(props){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{width:"20",height:"20","aria-hidden":"true",...props,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("g",{fill:"#7a7a7a",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})]})});}

/***/ },

/***/ 39701
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ DocSidebar)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/hooks/useWindowSize.js
var useWindowSize = __webpack_require__(92575);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/useThemeConfig.js
var useThemeConfig = __webpack_require__(27412);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Logo/index.js
var Logo = __webpack_require__(20699);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(6590);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Icon/Arrow/index.js
var Arrow = __webpack_require__(33699);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/CollapseButton/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"collapseSidebarButton":"collapseSidebarButton_oTwn","collapseSidebarButtonIcon":"collapseSidebarButtonIcon_pMEX"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/CollapseButton/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function CollapseButton({onClick}){return/*#__PURE__*/(0,jsx_runtime.jsx)("button",{type:"button",title:(0,Translate/* translate */.T)({id:'theme.docs.sidebar.collapseButtonTitle',message:'Collapse sidebar',description:'The title attribute for collapse button of doc sidebar'}),"aria-label":(0,Translate/* translate */.T)({id:'theme.docs.sidebar.collapseButtonAriaLabel',message:'Collapse sidebar',description:'The title attribute for collapse button of doc sidebar'}),className:(0,clsx/* default */.A)('button button--secondary button--outline',styles_module.collapseSidebarButton),onClick:onClick,children:/*#__PURE__*/(0,jsx_runtime.jsx)(Arrow/* default */.A,{className:styles_module.collapseSidebarButtonIcon})});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(53237);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/contexts/announcementBar.js
var announcementBar = __webpack_require__(43043);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/scrollUtils.js
var scrollUtils = __webpack_require__(90766);
// EXTERNAL MODULE: ../node_modules/@docusaurus/plugin-content-docs/lib/client/docsUtils.js
var docsUtils = __webpack_require__(22454);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/reactUtils.js
var reactUtils = __webpack_require__(15198);
;// ../node_modules/@docusaurus/plugin-content-docs/lib/client/docSidebarItemsExpandedState.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const EmptyContext=Symbol('EmptyContext');const Context=/*#__PURE__*/react.createContext(EmptyContext);/**
 * Should be used to wrap one sidebar category level. This provider syncs the
 * expanded states of all sibling categories, and categories can choose to
 * collapse itself if another one is expanded.
 */function DocSidebarItemsExpandedStateProvider({children}){const[expandedItem,setExpandedItem]=(0,react.useState)(null);const contextValue=(0,react.useMemo)(()=>({expandedItem,setExpandedItem}),[expandedItem]);return/*#__PURE__*/(0,jsx_runtime.jsx)(Context.Provider,{value:contextValue,children:children});}function useDocSidebarItemsExpandedState(){const value=(0,react.useContext)(Context);if(value===EmptyContext){throw new reactUtils/* ReactContextError */.dV('DocSidebarItemsExpandedStateProvider');}return value;}
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/components/Collapsible/index.js
var Collapsible = __webpack_require__(32432);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/routesUtils.js
var routesUtils = __webpack_require__(34379);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(45968);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useIsBrowser.js
var useIsBrowser = __webpack_require__(86681);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/isInternalUrl.js
var isInternalUrl = __webpack_require__(52616);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Icon/ExternalLink/index.js + 1 modules
var ExternalLink = __webpack_require__(79016);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Link/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Link_styles_module = ({"menuExternalLink":"menuExternalLink_BiEj","linkLabel":"linkLabel_fEdy"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Link/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function LinkLabel({label}){return/*#__PURE__*/(0,jsx_runtime.jsx)("span",{title:label,className:Link_styles_module.linkLabel,children:label});}function DocSidebarItemLink({item,onItemClick,activePath,level,index,...props}){const{href,label,className,autoAddBaseUrl}=item;const isActive=(0,docsUtils/* isActiveSidebarItem */.w8)(item,activePath);const isInternalLink=(0,isInternalUrl/* default */.A)(href);return/*#__PURE__*/(0,jsx_runtime.jsx)("li",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarItemLink,ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarItemLinkLevel(level),'menu__list-item',className),children:/*#__PURE__*/(0,jsx_runtime.jsxs)(Link/* default */.A,{className:(0,clsx/* default */.A)('menu__link',!isInternalLink&&Link_styles_module.menuExternalLink,{'menu__link--active':isActive}),autoAddBaseUrl:autoAddBaseUrl,"aria-current":isActive?'page':undefined,to:href,...(isInternalLink&&{onClick:onItemClick?()=>onItemClick(item):undefined}),...props,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(LinkLabel,{label:label}),!isInternalLink&&/*#__PURE__*/(0,jsx_runtime.jsx)(ExternalLink/* default */.A,{})]})},label);}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Category/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Category_styles_module = ({"categoryLink":"categoryLink_ROYx","categoryLinkLabel":"categoryLinkLabel_ufhF"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Category/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// If we navigate to a category and it becomes active, it should automatically
// expand itself
function useAutoExpandActiveCategory({isActive,collapsed,updateCollapsed,activePath}){const wasActive=(0,reactUtils/* usePrevious */.ZC)(isActive);const previousActivePath=(0,reactUtils/* usePrevious */.ZC)(activePath);(0,react.useEffect)(()=>{const justBecameActive=isActive&&!wasActive;const stillActiveButPathChanged=isActive&&wasActive&&activePath!==previousActivePath;if((justBecameActive||stillActiveButPathChanged)&&collapsed){updateCollapsed(false);}},[isActive,wasActive,collapsed,updateCollapsed,activePath,previousActivePath]);}/**
 * When a collapsible category has no link, we still link it to its first child
 * during SSR as a temporary fallback. This allows to be able to navigate inside
 * the category even when JS fails to load, is delayed or simply disabled
 * React hydration becomes an optional progressive enhancement
 * see https://github.com/facebookincubator/infima/issues/36#issuecomment-772543188
 * see https://github.com/facebook/docusaurus/issues/3030
 */function useCategoryHrefWithSSRFallback(item){const isBrowser=(0,useIsBrowser/* default */.A)();return (0,react.useMemo)(()=>{if(item.href&&!item.linkUnlisted){return item.href;}// In these cases, it's not necessary to render a fallback
// We skip the "findFirstCategoryLink" computation
if(isBrowser||!item.collapsible){return undefined;}return (0,docsUtils/* findFirstSidebarItemLink */.Nr)(item);},[item,isBrowser]);}function Category_CollapseButton({collapsed,categoryLabel,onClick}){return/*#__PURE__*/(0,jsx_runtime.jsx)("button",{"aria-label":collapsed?(0,Translate/* translate */.T)({id:'theme.DocSidebarItem.expandCategoryAriaLabel',message:"Expand sidebar category '{label}'",description:'The ARIA label to expand the sidebar category'},{label:categoryLabel}):(0,Translate/* translate */.T)({id:'theme.DocSidebarItem.collapseCategoryAriaLabel',message:"Collapse sidebar category '{label}'",description:'The ARIA label to collapse the sidebar category'},{label:categoryLabel}),"aria-expanded":!collapsed,type:"button",className:"clean-btn menu__caret",onClick:onClick});}function CategoryLinkLabel({label}){return/*#__PURE__*/(0,jsx_runtime.jsx)("span",{title:label,className:Category_styles_module.categoryLinkLabel,children:label});}function DocSidebarItemCategory(props){const visibleChildren=(0,docsUtils/* useVisibleSidebarItems */.Y)(props.item.items,props.activePath);if(visibleChildren.length===0){return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemCategoryEmpty,{...props});}else{return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemCategoryCollapsible,{...props});}}function isCategoryWithHref(category){return typeof category.href==='string';}// If a category doesn't have any visible children, we render it as a link
function DocSidebarItemCategoryEmpty({item,...props}){// If the category has no link, we don't render anything
// It's not super useful to render a category you can't open nor click
if(!isCategoryWithHref(item)){return null;}// We remove props that don't make sense for a link and forward the rest
const{type,collapsed,collapsible,items,linkUnlisted,...forwardableProps}=item;const linkItem={type:'link',...forwardableProps};return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemLink,{item:linkItem,...props});}function DocSidebarItemCategoryCollapsible({item,onItemClick,activePath,level,index,...props}){const{items,label,collapsible,className,href}=item;const{docs:{sidebar:{autoCollapseCategories}}}=(0,useThemeConfig/* useThemeConfig */.p)();const hrefWithSSRFallback=useCategoryHrefWithSSRFallback(item);const isActive=(0,docsUtils/* isActiveSidebarItem */.w8)(item,activePath);const isCurrentPage=(0,routesUtils/* isSamePath */.ys)(href,activePath);const{collapsed,setCollapsed}=(0,Collapsible/* useCollapsible */.u)({// Active categories are always initialized as expanded. The default
// (`item.collapsed`) is only used for non-active categories.
initialState:()=>{if(!collapsible){return false;}return isActive?false:item.collapsed;}});const{expandedItem,setExpandedItem}=useDocSidebarItemsExpandedState();// Use this instead of `setCollapsed`, because it is also reactive
const updateCollapsed=(toCollapsed=!collapsed)=>{setExpandedItem(toCollapsed?null:index);setCollapsed(toCollapsed);};useAutoExpandActiveCategory({isActive,collapsed,updateCollapsed,activePath});(0,react.useEffect)(()=>{if(collapsible&&expandedItem!=null&&expandedItem!==index&&autoCollapseCategories){setCollapsed(true);}},[collapsible,expandedItem,index,setCollapsed,autoCollapseCategories]);const handleItemClick=e=>{onItemClick?.(item);if(collapsible){if(href){// When already on the category's page, we collapse it
// We don't use "isActive" because it would collapse the
// category even when we browse a children element
// See https://github.com/facebook/docusaurus/issues/11213
if(isCurrentPage){e.preventDefault();updateCollapsed();}else{// When navigating to a new category, we always expand
// see https://github.com/facebook/docusaurus/issues/10854#issuecomment-2609616182
updateCollapsed(false);}}else{e.preventDefault();updateCollapsed();}}};return/*#__PURE__*/(0,jsx_runtime.jsxs)("li",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarItemCategory,ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarItemCategoryLevel(level),'menu__list-item',{'menu__list-item--collapsed':collapsed},className),children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)('menu__list-item-collapsible',{'menu__list-item-collapsible--active':isCurrentPage}),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(Link/* default */.A,{className:(0,clsx/* default */.A)(Category_styles_module.categoryLink,'menu__link',{'menu__link--sublist':collapsible,'menu__link--sublist-caret':!href&&collapsible,'menu__link--active':isActive}),onClick:handleItemClick,"aria-current":isCurrentPage?'page':undefined,role:collapsible&&!href?'button':undefined,"aria-expanded":collapsible&&!href?!collapsed:undefined,href:collapsible?hrefWithSSRFallback??'#':hrefWithSSRFallback,...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)(CategoryLinkLabel,{label:label})}),href&&collapsible&&/*#__PURE__*/(0,jsx_runtime.jsx)(Category_CollapseButton,{collapsed:collapsed,categoryLabel:label,onClick:e=>{e.preventDefault();updateCollapsed();}})]}),/*#__PURE__*/(0,jsx_runtime.jsx)(Collapsible/* Collapsible */.N,{lazy:true,as:"ul",className:"menu__list",collapsed:collapsed,children:/*#__PURE__*/(0,jsx_runtime.jsx)(theme_DocSidebarItems,{items:items,tabIndex:collapsed?-1:0,onItemClick:onItemClick,activePath:activePath,level:level+1})})]});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Html/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Html_styles_module = ({"menuHtmlItem":"menuHtmlItem_OniL"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/Html/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocSidebarItemHtml({item,level,index}){const{value,defaultStyle,className}=item;return/*#__PURE__*/(0,jsx_runtime.jsx)("li",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarItemLink,ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarItemLinkLevel(level),defaultStyle&&[Html_styles_module.menuHtmlItem,'menu__list-item'],className),// eslint-disable-next-line react/no-danger
dangerouslySetInnerHTML:{__html:value}},index);}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItem/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocSidebarItem({item,...props}){switch(item.type){case'category':return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemCategory,{item:item,...props});case'html':return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemHtml,{item:item,...props});case'link':default:return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemLink,{item:item,...props});}}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebarItems/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocSidebarItems({items,...props}){const visibleItems=(0,docsUtils/* useVisibleSidebarItems */.Y)(items,props.activePath);return/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItemsExpandedStateProvider,{children:visibleItems.map((item,index)=>/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarItem,{item:item,index:index,...props},index))});}// Optimize sidebar at each "level"
/* harmony default export */ const theme_DocSidebarItems = (/*#__PURE__*/(0,react.memo)(DocSidebarItems));
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/Content/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Content_styles_module = ({"menu":"menu_jmj1","menuWithAnnouncementBar":"menuWithAnnouncementBar_YufC"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/Content/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function useShowAnnouncementBar(){const{isActive}=(0,announcementBar/* useAnnouncementBar */.M)();const[showAnnouncementBar,setShowAnnouncementBar]=(0,react.useState)(isActive);(0,scrollUtils/* useScrollPosition */.Mq)(({scrollY})=>{if(isActive){setShowAnnouncementBar(scrollY===0);}},[isActive]);return isActive&&showAnnouncementBar;}function DocSidebarDesktopContent({path,sidebar,className}){const showAnnouncementBar=useShowAnnouncementBar();return/*#__PURE__*/(0,jsx_runtime.jsx)("nav",{"aria-label":(0,Translate/* translate */.T)({id:'theme.docs.sidebar.navAriaLabel',message:'Docs sidebar',description:'The ARIA label for the sidebar navigation'}),className:(0,clsx/* default */.A)('menu thin-scrollbar',Content_styles_module.menu,showAnnouncementBar&&Content_styles_module.menuWithAnnouncementBar,className),children:/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarMenu,'menu__list'),children:/*#__PURE__*/(0,jsx_runtime.jsx)(theme_DocSidebarItems,{items:sidebar,activePath:path,level:1})})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Desktop_styles_module = ({"sidebar":"sidebar_CUen","sidebarWithHideableNavbar":"sidebarWithHideableNavbar_w4KB","sidebarHidden":"sidebarHidden_k6VE","sidebarLogo":"sidebarLogo_CYvI"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocSidebarDesktop({path,sidebar,onCollapse,isHidden}){const{navbar:{hideOnScroll},docs:{sidebar:{hideable}}}=(0,useThemeConfig/* useThemeConfig */.p)();return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)(Desktop_styles_module.sidebar,hideOnScroll&&Desktop_styles_module.sidebarWithHideableNavbar,isHidden&&Desktop_styles_module.sidebarHidden),children:[hideOnScroll&&/*#__PURE__*/(0,jsx_runtime.jsx)(Logo/* default */.A,{tabIndex:-1,className:Desktop_styles_module.sidebarLogo}),/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebarDesktopContent,{path:path,sidebar:sidebar}),hideable&&/*#__PURE__*/(0,jsx_runtime.jsx)(CollapseButton,{onClick:onCollapse})]});}/* harmony default export */ const Desktop = (/*#__PURE__*/react.memo(DocSidebarDesktop));
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/contexts/navbarSecondaryMenu/content.js
var content = __webpack_require__(65454);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/contexts/navbarMobileSidebar.js
var navbarMobileSidebar = __webpack_require__(59539);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/Mobile/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu=({sidebar,path})=>{const mobileSidebar=(0,navbarMobileSidebar/* useNavbarMobileSidebar */.M)();return/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarMenu,'menu__list'),children:/*#__PURE__*/(0,jsx_runtime.jsx)(theme_DocSidebarItems,{items:sidebar,activePath:path,onItemClick:item=>{// Mobile sidebar should only be closed if the category has a link
if(item.type==='category'&&item.href){mobileSidebar.toggle();}if(item.type==='link'){mobileSidebar.toggle();}},level:1})});};function DocSidebarMobile(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(content/* NavbarSecondaryMenuFiller */.GX,{component:DocSidebarMobileSecondaryMenu,props:props});}/* harmony default export */ const Mobile = (/*#__PURE__*/react.memo(DocSidebarMobile));
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocSidebar(props){const windowSize=(0,useWindowSize/* useWindowSize */.l)();// Desktop sidebar visible on hydration: need SSR rendering
const shouldRenderSidebarDesktop=windowSize==='desktop'||windowSize==='ssr';// Mobile sidebar not visible on hydration: can avoid SSR rendering
const shouldRenderSidebarMobile=windowSize==='mobile';return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[shouldRenderSidebarDesktop&&/*#__PURE__*/(0,jsx_runtime.jsx)(Desktop,{...props}),shouldRenderSidebarMobile&&/*#__PURE__*/(0,jsx_runtime.jsx)(Mobile,{...props})]});}

/***/ },

/***/ 41078
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ DocRoot)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/metadataUtils.js
var metadataUtils = __webpack_require__(18586);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(53237);
// EXTERNAL MODULE: ../node_modules/@docusaurus/plugin-content-docs/lib/client/docsUtils.js
var docsUtils = __webpack_require__(22454);
// EXTERNAL MODULE: ../node_modules/@docusaurus/plugin-content-docs/lib/client/docsSidebar.js
var docsSidebar = __webpack_require__(72827);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(6590);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/scrollUtils.js
var scrollUtils = __webpack_require__(90766);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/useLocationChange.js
var useLocationChange = __webpack_require__(22432);
;// ../node_modules/@docusaurus/theme-common/lib/hooks/useBackToTopButton.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *//** Wires the logic for the back to top button. */function useBackToTopButton({threshold}){const[shown,setShown]=(0,react.useState)(false);const isFocusedAnchor=(0,react.useRef)(false);const{startScroll,cancelScroll}=(0,scrollUtils/* useSmoothScrollTo */.gk)();(0,scrollUtils/* useScrollPosition */.Mq)(({scrollY:scrollTop},lastPosition)=>{const lastScrollTop=lastPosition?.scrollY;// Component is just being mounted. Not really a scroll event from the user.
// Ignore it.
if(!lastScrollTop){return;}if(isFocusedAnchor.current){// This scroll position change is triggered by navigating to an anchor.
// Ignore it.
isFocusedAnchor.current=false;}else if(scrollTop>=lastScrollTop){// The user has scrolled down to "fight against" the animation. Cancel any
// animation under progress.
cancelScroll();setShown(false);}else if(scrollTop<threshold){// Scrolled to the minimum position; hide the button.
setShown(false);}else if(scrollTop+window.innerHeight<document.documentElement.scrollHeight){setShown(true);}});(0,useLocationChange/* useLocationChange */.$)(locationChangeEvent=>{if(locationChangeEvent.location.hash){isFocusedAnchor.current=true;setShown(false);}});return{shown,scrollToTop:()=>startScroll(0)};}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BackToTopButton/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"backToTopButton":"backToTopButton_iEvu","backToTopButtonShow":"backToTopButtonShow_DO8w"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BackToTopButton/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BackToTopButton(){const{shown,scrollToTop}=useBackToTopButton({threshold:300});return/*#__PURE__*/(0,jsx_runtime.jsx)("button",{"aria-label":(0,Translate/* translate */.T)({id:'theme.BackToTopButton.buttonAriaLabel',message:'Scroll back to top',description:'The ARIA label for the back to top button'}),className:(0,clsx/* default */.A)('clean-btn',ThemeClassNames/* ThemeClassNames */.G.common.backToTopButton,styles_module.backToTopButton,shown&&styles_module.backToTopButtonShow),type:"button",onClick:scrollToTop});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/accessibilityUtils.js
var accessibilityUtils = __webpack_require__(67683);
// EXTERNAL MODULE: ../node_modules/react-router/esm/react-router.js
var react_router = __webpack_require__(49519);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/DocSidebar/index.js + 16 modules
var DocSidebar = __webpack_require__(39701);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Icon/Arrow/index.js
var Arrow = __webpack_require__(33699);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Sidebar/ExpandButton/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const ExpandButton_styles_module = ({"expandButton":"expandButton_pLDq","expandButtonIcon":"expandButtonIcon_X5ff"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Sidebar/ExpandButton/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocRootLayoutSidebarExpandButton({toggleSidebar}){return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:ExpandButton_styles_module.expandButton,title:(0,Translate/* translate */.T)({id:'theme.docs.sidebar.expandButtonTitle',message:'Expand sidebar',description:'The ARIA label and title attribute for expand button of doc sidebar'}),"aria-label":(0,Translate/* translate */.T)({id:'theme.docs.sidebar.expandButtonAriaLabel',message:'Expand sidebar',description:'The ARIA label and title attribute for expand button of doc sidebar'}),tabIndex:0,role:"button",onKeyDown:toggleSidebar,onClick:toggleSidebar,children:/*#__PURE__*/(0,jsx_runtime.jsx)(Arrow/* default */.A,{className:ExpandButton_styles_module.expandButtonIcon})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Sidebar/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Sidebar_styles_module = ({"docSidebarContainer":"docSidebarContainer_c7NB","docSidebarContainerHidden":"docSidebarContainerHidden_P3S_","sidebarViewport":"sidebarViewport_KYo0"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Sidebar/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({children}){const sidebar=(0,docsSidebar/* useDocsSidebar */.t)();return/*#__PURE__*/(0,jsx_runtime.jsx)(react.Fragment,{children:children},sidebar?.name??'noSidebar');}function DocRootLayoutSidebar({sidebar,hiddenSidebarContainer,setHiddenSidebarContainer}){const{pathname}=(0,react_router/* useLocation */.zy)();const[hiddenSidebar,setHiddenSidebar]=(0,react.useState)(false);const toggleSidebar=(0,react.useCallback)(()=>{if(hiddenSidebar){setHiddenSidebar(false);}// onTransitionEnd won't fire when sidebar animation is disabled
// fixes https://github.com/facebook/docusaurus/issues/8918
if(!hiddenSidebar&&(0,accessibilityUtils/* prefersReducedMotion */.O)()){setHiddenSidebar(true);}setHiddenSidebarContainer(value=>!value);},[setHiddenSidebarContainer,hiddenSidebar]);return/*#__PURE__*/(0,jsx_runtime.jsx)("aside",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.docs.docSidebarContainer,Sidebar_styles_module.docSidebarContainer,hiddenSidebarContainer&&Sidebar_styles_module.docSidebarContainerHidden),onTransitionEnd:e=>{if(!e.currentTarget.classList.contains(Sidebar_styles_module.docSidebarContainer)){return;}if(hiddenSidebarContainer){setHiddenSidebar(true);}},children:/*#__PURE__*/(0,jsx_runtime.jsx)(ResetOnSidebarChange,{children:/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)(Sidebar_styles_module.sidebarViewport,hiddenSidebar&&Sidebar_styles_module.sidebarViewportHidden),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(DocSidebar/* default */.A,{sidebar:sidebar,path:pathname,onCollapse:toggleSidebar,isHidden:hiddenSidebar}),hiddenSidebar&&/*#__PURE__*/(0,jsx_runtime.jsx)(DocRootLayoutSidebarExpandButton,{toggleSidebar:toggleSidebar})]})})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Main/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Main_styles_module = ({"docMainContainer":"docMainContainer_a9sJ","docMainContainerEnhanced":"docMainContainerEnhanced_grEJ","docItemWrapperEnhanced":"docItemWrapperEnhanced_VqDq"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/Main/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocRootLayoutMain({hiddenSidebarContainer,children}){const sidebar=(0,docsSidebar/* useDocsSidebar */.t)();return/*#__PURE__*/(0,jsx_runtime.jsx)("main",{className:(0,clsx/* default */.A)(Main_styles_module.docMainContainer,(hiddenSidebarContainer||!sidebar)&&Main_styles_module.docMainContainerEnhanced),children:/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)('container padding-top--md padding-bottom--lg',Main_styles_module.docItemWrapper,hiddenSidebarContainer&&Main_styles_module.docItemWrapperEnhanced),children:children})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Layout_styles_module = ({"docRoot":"docRoot_DfVB","docsWrapper":"docsWrapper__sE8"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/Layout/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocRootLayout({children}){const sidebar=(0,docsSidebar/* useDocsSidebar */.t)();const[hiddenSidebarContainer,setHiddenSidebarContainer]=(0,react.useState)(false);return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:Layout_styles_module.docsWrapper,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(BackToTopButton,{}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:Layout_styles_module.docRoot,children:[sidebar&&/*#__PURE__*/(0,jsx_runtime.jsx)(DocRootLayoutSidebar,{sidebar:sidebar.items,hiddenSidebarContainer:hiddenSidebarContainer,setHiddenSidebarContainer:setHiddenSidebarContainer}),/*#__PURE__*/(0,jsx_runtime.jsx)(DocRootLayoutMain,{hiddenSidebarContainer:hiddenSidebarContainer,children:children})]})]});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/NotFound/Content/index.js
var Content = __webpack_require__(70569);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/DocRoot/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function DocRoot(props){const currentDocRouteMetadata=(0,docsUtils/* useDocRootMetadata */.B5)(props);if(!currentDocRouteMetadata){// We only render the not found content to avoid a double layout
// see https://github.com/facebook/docusaurus/pull/7966#pullrequestreview-1077276692
return/*#__PURE__*/(0,jsx_runtime.jsx)(Content/* default */.A,{});}const{docElement,sidebarName,sidebarItems}=currentDocRouteMetadata;return/*#__PURE__*/(0,jsx_runtime.jsx)(metadataUtils/* HtmlClassNameProvider */.e3,{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.page.docsDocPage),children:/*#__PURE__*/(0,jsx_runtime.jsx)(docsSidebar/* DocsSidebarProvider */.V,{name:sidebarName,items:sidebarItems,children:/*#__PURE__*/(0,jsx_runtime.jsx)(DocRootLayout,{children:docElement})})});}

/***/ },

/***/ 70569
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ NotFoundContent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11750);
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6590);
/* harmony import */ var _theme_Heading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81381);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function NotFoundContent({className}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("main",{className:(0,clsx__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)('container margin-vert--xl',className),children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div",{className:"row",children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div",{className:"col col--6 col--offset-3",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_theme_Heading__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,{as:"h1",className:"hero__title",children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{id:"theme.NotFound.title",description:"The title of the 404 page",children:"Page Not Found"})}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p",{children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page",children:"We could not find what you were looking for."})}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p",{children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page",children:"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."})})]})})});}

/***/ }

}]);