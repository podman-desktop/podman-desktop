"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[79483],{

/***/ 21269
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_08_24_5_million_lessons_learned_mdx_8ad_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_08_24_5_million_lessons_learned_mdx_8ad_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82697);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: '5 Lessons Learned After 5 Million Downloads',
	description: 'Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.',
	slug: '5-million-lessons-learned',
	authors: [
		'kyetter',
		'slemeur'
	],
	tags: [
		'podman-desktop',
		'5-million',
		'downloads',
		'celebrate',
		'community'
	],
	image: '/img/blog/5million/banner.jpg'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined, undefined],
};



const toc = [{
  "value": "Wooohooo 🎉",
  "id": "wooohooo-",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h2: "h2",
    img: "img",
    p: "p",
    strong: "strong",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Banner announcing 5 million downloads",
        src: (__webpack_require__(34678)/* ["default"] */ .A) + "",
        width: "1200",
        height: "630"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "wooohooo-",
      children: "Wooohooo 🎉"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop just crossed ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "5,000,000 downloads"
      }), "! Less than a year ago we were celebrating ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/blog/3-million",
        children: "3 million"
      }), ", and now we're humbled to be at 5 million. That kind of growth doesn't happen without a community pushing us, challenging us, and choosing us. Thank you."]
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

/***/ 34678
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/banner-d5797627269f7b4e2f6a2482e4aca936.jpg");

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

/***/ 82697
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/5-million-lessons-learned","source":"@site/blog/2026-08-24-5-million-lessons-learned.mdx","title":"5 Lessons Learned After 5 Million Downloads","description":"Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.","date":"2026-08-24T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"5-million","permalink":"/blog/tags/5-million"},{"inline":true,"label":"downloads","permalink":"/blog/tags/downloads"},{"inline":true,"label":"celebrate","permalink":"/blog/tags/celebrate"},{"inline":true,"label":"community","permalink":"/blog/tags/community"}],"readingTime":6.57,"hasTruncateMarker":true,"authors":[{"name":"Kathryn Yetter","title":"Product Manager","url":"https://github.com/kyetter","imageURL":"https://github.com/kyetter.png","key":"kyetter","page":null},{"name":"Stevan Le Meur","title":"Product Manager","url":"https://github.com/slemeur","imageURL":"https://github.com/slemeur.png","key":"slemeur","page":null}],"frontMatter":{"title":"5 Lessons Learned After 5 Million Downloads","description":"Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.","slug":"5-million-lessons-learned","authors":["kyetter","slemeur"],"tags":["podman-desktop","5-million","downloads","celebrate","community"],"image":"/img/blog/5million/banner.jpg"},"unlisted":false,"prevItem":{"title":"Podman: from Docker networks to pods, kube play, and going rootless","permalink":"/blog/networks-pods-kube-play-going-rootless"},"nextItem":{"title":"Intel Mac support in Podman Desktop: What developers need to know","permalink":"/blog/intel-mac-podman-6-transition"}}');

/***/ }

}]);