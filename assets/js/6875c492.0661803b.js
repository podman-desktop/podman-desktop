"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[84813],{

/***/ 70523:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BlogListPaginator)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _theme_PaginatorNavLink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(65780);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogListPaginator(props){const{metadata}=props;const{previousPage,nextPage}=metadata;return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("nav",{className:"pagination-nav","aria-label":(0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* .translate */ .T)({id:'theme.blog.paginator.navAriaLabel',message:'Blog list page navigation',description:'The ARIA label for the blog pagination'}),children:[previousPage&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_theme_PaginatorNavLink__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{permalink:previousPage,title:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),nextPage&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_theme_PaginatorNavLink__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{permalink:nextPage,title:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:true})]});}

/***/ }),

/***/ 73425:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ BlogPostItem)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/plugin-content-blog/lib/client/index.js + 3 modules
var client = __webpack_require__(86526);
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Container/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogPostItemContainer({children,className}){return/*#__PURE__*/(0,jsx_runtime.jsx)("article",{className:className,children:children});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(45968);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/Title/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"title":"title_Kdtz"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/Title/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogPostItemHeaderTitle({className}){const{metadata,isBlogPostPage}=(0,client/* useBlogPost */.e7)();const{permalink,title}=metadata;const TitleHeading=isBlogPostPage?'h1':'h2';return/*#__PURE__*/(0,jsx_runtime.jsx)(TitleHeading,{className:(0,clsx/* default */.A)(styles_module.title,className),children:isBlogPostPage?title:/*#__PURE__*/(0,jsx_runtime.jsx)(Link/* default */.A,{to:permalink,children:title})});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(6590);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/usePluralForm.js
var usePluralForm = __webpack_require__(32815);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/IntlUtils.js
var IntlUtils = __webpack_require__(51636);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/Info/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Info_styles_module = ({"container":"container_iZB2"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/Info/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Very simple pluralization: probably good enough for now
function useReadingTimePlural(){const{selectMessage}=(0,usePluralForm/* usePluralForm */.W)();return readingTimeFloat=>{const readingTime=Math.ceil(readingTimeFloat);return selectMessage(readingTime,(0,Translate/* translate */.T)({id:'theme.blog.post.readingTime.plurals',description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:'One min read|{readingTime} min read'},{readingTime}));};}function ReadingTime({readingTime}){const readingTimePlural=useReadingTimePlural();return/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:readingTimePlural(readingTime)});}function DateTime({date,formattedDate}){return/*#__PURE__*/(0,jsx_runtime.jsx)("time",{dateTime:date,children:formattedDate});}function Spacer(){return/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:' · '});}function BlogPostItemHeaderInfo({className}){const{metadata}=(0,client/* useBlogPost */.e7)();const{date,readingTime}=metadata;const dateTimeFormat=(0,IntlUtils/* useDateTimeFormat */.i)({day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});const formatDate=blogDate=>dateTimeFormat.format(new Date(blogDate));return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)(Info_styles_module.container,'margin-vert--md',className),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(DateTime,{date:date,formattedDate:formatDate(date)}),typeof readingTime!=='undefined'&&/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(Spacer,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(ReadingTime,{readingTime:readingTime})]})]});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Blog/Components/Author/index.js + 22 modules
var Author = __webpack_require__(24945);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/Authors/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Authors_styles_module = ({"authorCol":"authorCol_v1VX","imageOnlyAuthorRow":"imageOnlyAuthorRow_RxZ1","imageOnlyAuthorCol":"imageOnlyAuthorCol_iWtj"});
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/Authors/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Component responsible for the authors layout
function BlogPostItemHeaderAuthors({className}){const{metadata:{authors},assets}=(0,client/* useBlogPost */.e7)();const authorsCount=authors.length;if(authorsCount===0){return null;}const imageOnly=authors.every(({name})=>!name);const singleAuthor=authors.length===1;return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)('margin-top--md margin-bottom--sm',imageOnly?Authors_styles_module.imageOnlyAuthorRow:'row',className),children:authors.map((author,idx)=>/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)(!imageOnly&&(singleAuthor?'col col--12':'col col--6'),imageOnly?Authors_styles_module.imageOnlyAuthorCol:Authors_styles_module.authorCol),children:/*#__PURE__*/(0,jsx_runtime.jsx)(Author/* default */.A,{author:{...author,// Handle author images using relative paths
imageURL:assets.authorsImageUrls[idx]??author.imageURL}})},idx))});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Header/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogPostItemHeader(){return/*#__PURE__*/(0,jsx_runtime.jsxs)("header",{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemHeaderTitle,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemHeaderInfo,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemHeaderAuthors,{})]});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/utils-common/lib/index.js
var lib = __webpack_require__(75994);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/MDXContent/index.js
var MDXContent = __webpack_require__(500);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Content/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogPostItemContent({children,className}){const{isBlogPostPage}=(0,client/* useBlogPost */.e7)();return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{// This ID is used for the feed generation to locate the main content
id:isBlogPostPage?lib/* blogPostContainerID */.LU:undefined,className:(0,clsx/* default */.A)('markdown',className),children:/*#__PURE__*/(0,jsx_runtime.jsx)(MDXContent/* default */.A,{children:children})});}
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(53237);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/EditMetaRow/index.js + 5 modules
var EditMetaRow = __webpack_require__(48762);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/TagsListInline/index.js + 1 modules
var TagsListInline = __webpack_require__(71279);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Footer/ReadMoreLink/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function ReadMoreLabel(){return/*#__PURE__*/(0,jsx_runtime.jsx)("b",{children:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})});}function BlogPostItemFooterReadMoreLink(props){const{blogPostTitle,...linkProps}=props;return/*#__PURE__*/(0,jsx_runtime.jsx)(Link/* default */.A,{"aria-label":(0,Translate/* translate */.T)({message:'Read more about {title}',id:'theme.blog.post.readMoreLabel',description:'The ARIA label for the link to full blog posts from excerpts'},{title:blogPostTitle}),...linkProps,children:/*#__PURE__*/(0,jsx_runtime.jsx)(ReadMoreLabel,{})});}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/Footer/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogPostItemFooter(){const{metadata,isBlogPostPage}=(0,client/* useBlogPost */.e7)();const{tags,title,editUrl,hasTruncateMarker,lastUpdatedBy,lastUpdatedAt}=metadata;// A post is truncated if it's in the "list view" and it has a truncate marker
const truncatedPost=!isBlogPostPage&&hasTruncateMarker;const tagsExists=tags.length>0;const renderFooter=tagsExists||truncatedPost||editUrl;if(!renderFooter){return null;}// BlogPost footer - details view
if(isBlogPostPage){const canDisplayEditMetaRow=!!(editUrl||lastUpdatedAt||lastUpdatedBy);return/*#__PURE__*/(0,jsx_runtime.jsxs)("footer",{className:"docusaurus-mt-lg",children:[tagsExists&&/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)('row','margin-top--sm',ThemeClassNames/* ThemeClassNames */.G.blog.blogFooterEditMetaRow),children:/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"col",children:/*#__PURE__*/(0,jsx_runtime.jsx)(TagsListInline/* default */.A,{tags:tags})})}),canDisplayEditMetaRow&&/*#__PURE__*/(0,jsx_runtime.jsx)(EditMetaRow/* default */.A,{className:(0,clsx/* default */.A)('margin-top--sm',ThemeClassNames/* ThemeClassNames */.G.blog.blogFooterEditMetaRow),editUrl:editUrl,lastUpdatedAt:lastUpdatedAt,lastUpdatedBy:lastUpdatedBy})]});}// BlogPost footer - list view
else{return/*#__PURE__*/(0,jsx_runtime.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[tagsExists&&/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)('col',{'col--9':truncatedPost}),children:/*#__PURE__*/(0,jsx_runtime.jsx)(TagsListInline/* default */.A,{tags:tags})}),truncatedPost&&/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)('col text--right',{'col--3':tagsExists}),children:/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemFooterReadMoreLink,{blogPostTitle:title,to:metadata.permalink})})]});}}
;// ../node_modules/@docusaurus/theme-classic/lib/theme/BlogPostItem/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// apply a bottom margin in list view
function useContainerClassName(){const{isBlogPostPage}=(0,client/* useBlogPost */.e7)();return!isBlogPostPage?'margin-bottom--xl':undefined;}function BlogPostItem({children,className}){const containerClassName=useContainerClassName();return/*#__PURE__*/(0,jsx_runtime.jsxs)(BlogPostItemContainer,{className:(0,clsx/* default */.A)(containerClassName,className),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemHeader,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemContent,{children:children}),/*#__PURE__*/(0,jsx_runtime.jsx)(BlogPostItemFooter,{})]});}

/***/ }),

/***/ 24134:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BlogPostItems)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var _docusaurus_plugin_content_blog_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(86526);
/* harmony import */ var _theme_BlogPostItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73425);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogPostItems({items,component:BlogPostItemComponent=_theme_BlogPostItem__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A}){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment,{children:items.map(({content:BlogPostContent})=>/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_docusaurus_plugin_content_blog_client__WEBPACK_IMPORTED_MODULE_1__/* .BlogPostProvider */ ["in"],{content:BlogPostContent,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(BlogPostItemComponent,{children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(BlogPostContent,{})})},BlogPostContent.metadata.permalink))});}

/***/ }),

/***/ 66139:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlogTagsPostsPage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(11750);
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(18586);
/* harmony import */ var _docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(53237);
/* harmony import */ var _docusaurus_theme_common_internal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(72719);
/* harmony import */ var _docusaurus_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(45968);
/* harmony import */ var _theme_BlogLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8109);
/* harmony import */ var _theme_BlogListPaginator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(70523);
/* harmony import */ var _theme_SearchMetadata__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(689);
/* harmony import */ var _theme_BlogPostItems__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(24134);
/* harmony import */ var _theme_ContentVisibility_Unlisted__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(40840);
/* harmony import */ var _theme_Heading__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(81381);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function BlogTagsPostsPageMetadata({tag}){const title=(0,_docusaurus_theme_common_internal__WEBPACK_IMPORTED_MODULE_10__/* .useBlogTagsPostsPageTitle */ .ZD)(tag);return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment,{children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_11__/* .PageMetadata */ .be,{title:title,description:tag.description}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_theme_SearchMetadata__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A,{tag:"blog_tags_posts"})]});}function BlogTagsPostsPageContent({tag,items,sidebar,listMetadata}){const title=(0,_docusaurus_theme_common_internal__WEBPACK_IMPORTED_MODULE_10__/* .useBlogTagsPostsPageTitle */ .ZD)(tag);return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_theme_BlogLayout__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,{sidebar:sidebar,children:[tag.unlisted&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_theme_ContentVisibility_Unlisted__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A,{}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("header",{className:"margin-bottom--xl",children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_theme_Heading__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A,{as:"h1",children:title}),tag.description&&/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p",{children:tag.description}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_docusaurus_Link__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,{href:tag.allTagsPath,children:/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View All Tags"})})]}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_theme_BlogPostItems__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A,{items:items}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_theme_BlogListPaginator__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A,{metadata:listMetadata})]});}function BlogTagsPostsPage(props){return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_11__/* .HtmlClassNameProvider */ .e3,{className:(0,clsx__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .A)(_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_13__/* .ThemeClassNames */ .G.wrapper.blogPages,_docusaurus_theme_common__WEBPACK_IMPORTED_MODULE_13__/* .ThemeClassNames */ .G.page.blogTagPostListPage),children:[/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlogTagsPostsPageMetadata,{...props}),/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlogTagsPostsPageContent,{...props})]});}

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

/***/ 72719:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZD: () => (/* binding */ useBlogTagsPostsPageTitle),
/* harmony export */   uz: () => (/* binding */ translateBlogAuthorsListPageTitle)
/* harmony export */ });
/* unused harmony exports useBlogAuthorPageTitle, BlogAuthorsListViewAllLabel, BlogAuthorNoPostsLabel */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var _docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6590);
/* harmony import */ var _utils_usePluralForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32815);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Only used locally
function useBlogPostsPlural(){const{selectMessage}=(0,_utils_usePluralForm__WEBPACK_IMPORTED_MODULE_3__/* .usePluralForm */ .W)();return count=>selectMessage(count,(0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* .translate */ .T)({id:'theme.blog.post.plurals',description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:'One post|{count} posts'},{count}));}function useBlogTagsPostsPageTitle(tag){const blogPostsPlural=useBlogPostsPlural();return (0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* .translate */ .T)({id:'theme.blog.tagTitle',description:'The title of the page for a blog tag',message:'{nPosts} tagged with "{tagName}"'},{nPosts:blogPostsPlural(tag.count),tagName:tag.label});}function useBlogAuthorPageTitle(author){const blogPostsPlural=useBlogPostsPlural();return translate({id:'theme.blog.author.pageTitle',description:'The title of the page for a blog author',message:'{authorName} - {nPosts}'},{nPosts:blogPostsPlural(author.count),authorName:author.name||author.key});}const translateBlogAuthorsListPageTitle=()=>(0,_docusaurus_Translate__WEBPACK_IMPORTED_MODULE_1__/* .translate */ .T)({id:'theme.blog.authorsList.pageTitle',message:'Authors',description:'The title of the authors page'});function BlogAuthorsListViewAllLabel(){return/*#__PURE__*/_jsx(Translate,{id:"theme.blog.authorsList.viewAll",description:"The label of the link targeting the blog authors page",children:"View all authors"});}function BlogAuthorNoPostsLabel(){return/*#__PURE__*/_jsx(Translate,{id:"theme.blog.author.noPosts",description:"The text for authors with 0 blog post",children:"This author has not written any posts yet."});}

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

/***/ 46774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80929);
/* harmony import */ var _fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(95601);
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(65958);
/* harmony import */ var _fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(97660);
/* harmony import */ var _theme_original_MDXComponents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(99358);
/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/// Import the original mapper
// Import the library component.
// Import all brands icons.
// Import all solid icons.
// Import the FontAwesomeIcon component.
_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_0__/* .library */ .Yv.add(_fortawesome_free_brands_svg_icons__WEBPACK_IMPORTED_MODULE_3__/* .fab */ .Cvc,_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__/* .fas */ .X7I);// Add all icons to the library so you can use them without importing them individually.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({// Re-use the default mapping
..._theme_original_MDXComponents__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,Icon:_fortawesome_react_fontawesome__WEBPACK_IMPORTED_MODULE_1__/* .FontAwesomeIcon */ .gc// Make the FontAwesomeIcon component available in MDX as <icon />.
});

/***/ })

}]);