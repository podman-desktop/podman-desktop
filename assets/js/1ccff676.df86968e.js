"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[68155],{

/***/ 32827
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_09_22_blog_3_million_mdx_758_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_09_22_blog_3_million_mdx_758_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73677);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: '3,000,000 downloads. Thank you',
	description: 'We reached 3,000,000 Downloads of Podman Desktop. Let\'s celebrate.',
	slug: '3-million',
	authors: [
		'firewall'
	],
	tags: [
		'podman-desktop',
		'3-million',
		'downloads',
		'celebrate'
	],
	hide_table_of_contents: false,
	image: '/img/blog/3million/banner.jpg'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Wooohooo!!",
  "id": "wooohooo",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    em: "em",
    h2: "h2",
    img: "img",
    p: "p",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Banner announcing 3 million downloads",
        src: (__webpack_require__(33092)/* ["default"] */ .A) + "",
        width: "1200",
        height: "630"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "wooohooo",
      children: "Wooohooo!!"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We are extremely excited to share that Podman Desktop just crossed ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
        children: "3,000,000 downloads"
      }), "! This is a huge step for the project and we are incredibly thankful for how each of you has helped! This milestone belongs to you. You file issues, suggest features, build extensions, teach teammates, and nudge us to make the day-to-day better. Thank you for helping turn an idea into a tool people rely on."]
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return MDXLayout ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout, {
    ...props,
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}



/***/ },

/***/ 33092
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/banner-4f4896528393a29779ce087a702c4966.jpg");

/***/ },

/***/ 43023
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ useMDXComponents),
/* harmony export */   x: () => (/* binding */ MDXProvider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/**
 * @import {MDXComponents} from 'mdx/types.js'
 * @import {Component, ReactElement, ReactNode} from 'react'
 */

/**
 * @callback MergeComponents
 *   Custom merge function.
 * @param {Readonly<MDXComponents>} currentComponents
 *   Current components from the context.
 * @returns {MDXComponents}
 *   Additional components.
 *
 * @typedef Props
 *   Configuration for `MDXProvider`.
 * @property {ReactNode | null | undefined} [children]
 *   Children (optional).
 * @property {Readonly<MDXComponents> | MergeComponents | null | undefined} [components]
 *   Additional components to use or a function that creates them (optional).
 * @property {boolean | null | undefined} [disableParentContext=false]
 *   Turn off outer component context (default: `false`).
 */



/** @type {Readonly<MDXComponents>} */
const emptyComponents = {}

const MDXContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(emptyComponents)

/**
 * Get current components from the MDX Context.
 *
 * @param {Readonly<MDXComponents> | MergeComponents | null | undefined} [components]
 *   Additional components to use or a function that creates them (optional).
 * @returns {MDXComponents}
 *   Current components.
 */
function useMDXComponents(components) {
  const contextComponents = react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext)

  // Memoize to avoid unnecessary top-level context changes
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    function () {
      // Custom merge via a function prop
      if (typeof components === 'function') {
        return components(contextComponents)
      }

      return {...contextComponents, ...components}
    },
    [contextComponents, components]
  )
}

/**
 * Provider for MDX context.
 *
 * @param {Readonly<Props>} properties
 *   Properties.
 * @returns {ReactElement}
 *   Element.
 * @satisfies {Component}
 */
function MDXProvider(properties) {
  /** @type {Readonly<MDXComponents>} */
  let allComponents

  if (properties.disableParentContext) {
    allComponents =
      typeof properties.components === 'function'
        ? properties.components(emptyComponents)
        : properties.components || emptyComponents
  } else {
    allComponents = useMDXComponents(properties.components)
  }

  return react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    MDXContext.Provider,
    {value: allComponents},
    properties.children
  )
}


/***/ },

/***/ 73677
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/3-million","source":"@site/blog/2025-09-22-blog-3million.mdx","title":"3,000,000 downloads. Thank you","description":"We reached 3,000,000 Downloads of Podman Desktop. Let\'s celebrate.","date":"2025-09-22T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"3-million","permalink":"/blog/tags/3-million"},{"inline":true,"label":"downloads","permalink":"/blog/tags/downloads"},{"inline":true,"label":"celebrate","permalink":"/blog/tags/celebrate"}],"readingTime":4.09,"hasTruncateMarker":true,"authors":[{"name":"Matt Demyttenaere","title":"Product Manager","url":"https://github.com/firewall","imageURL":"https://github.com/firewall.png","key":"firewall","page":null}],"frontMatter":{"title":"3,000,000 downloads. Thank you","description":"We reached 3,000,000 Downloads of Podman Desktop. Let\'s celebrate.","slug":"3-million","authors":["firewall"],"tags":["podman-desktop","3-million","downloads","celebrate"],"hide_table_of_contents":false,"image":"/img/blog/3million/banner.jpg"},"unlisted":false,"prevItem":{"title":"Hacktoberfest 2025! - Contribute to Podman Desktop","permalink":"/blog/hacktoberfest-2025"},"nextItem":{"title":"Podman Desktop Apple Container Extension: List Containers & Images on macOS","permalink":"/blog/apple-container-extension"}}');

/***/ }

}]);