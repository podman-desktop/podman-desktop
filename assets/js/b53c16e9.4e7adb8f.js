"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[62797],{

/***/ 90826
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_06_02_podman_desktop_core_mdx_e1d_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_06_02_podman_desktop_core_mdx_e1d_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37045);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Containers and Kubernetes development with Podman Desktop',
	description: 'A step-by-step guide for your containers and Kubernetes development with Podman Desktop',
	authors: [
		'firewall'
	],
	tags: [
		'podman-desktop',
		'podman',
		'development',
		'container',
		'tools'
	],
	hide_table_of_contents: false
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [];
function _createMdxContent(props) {
  const _components = {
    p: "p",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
    children: "In the world of modern software development, containers and Kubernetes are no longer optional; they are essential. That’s where Podman Desktop comes in, your ultimate tool for building, managing, and deploying containers and Kubernetes clusters with ease and confidence. In this blogpost we will walk through a typical development workflow, creating and building a container and then testing it in a local Kubernetes cluster. Let’s dive in."
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

/***/ 37045
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/2025/06/02/podman-desktop-core","source":"@site/blog/2025-06-02-podman-desktop-core.mdx","title":"Containers and Kubernetes development with Podman Desktop","description":"A step-by-step guide for your containers and Kubernetes development with Podman Desktop","date":"2025-06-02T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"development","permalink":"/blog/tags/development"},{"inline":true,"label":"container","permalink":"/blog/tags/container"},{"inline":true,"label":"tools","permalink":"/blog/tags/tools"}],"readingTime":6,"hasTruncateMarker":true,"authors":[{"name":"Matt Demyttenaere","title":"Product Manager","url":"https://github.com/firewall","imageURL":"https://github.com/firewall.png","key":"firewall","page":null}],"frontMatter":{"title":"Containers and Kubernetes development with Podman Desktop","description":"A step-by-step guide for your containers and Kubernetes development with Podman Desktop","authors":["firewall"],"tags":["podman-desktop","podman","development","container","tools"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.20 Release","permalink":"/blog/podman-desktop-release-1.20"},"nextItem":{"title":"Podman Desktop 1.19 Release","permalink":"/blog/podman-desktop-release-1.19"}}');

/***/ }

}]);