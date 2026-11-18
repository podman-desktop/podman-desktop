"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[24376],{

/***/ 18406
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_11_26_ai_lab_first_app_mdx_f48_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_11_26_ai_lab_first_app_mdx_f48_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66543);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Podman AI Lab - For developers to build AI Applications with LLMs running locally',
	description: 'Learn how to create your first AI application, by using Podman AI Lab',
	slug: 'podman-ai-lab-create-ai-app-with-llm-running-locally',
	authors: [
		'phmartin'
	],
	tags: [
		'podman-desktop',
		'extension',
		'ai',
		'llm',
		'local'
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
    img: "img",
    p: "p",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "banner",
        src: (__webpack_require__(78357)/* ["default"] */ .A) + "",
        width: "1216",
        height: "832"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Red Hat provides an extension to Podman Desktop, Podman AI Lab, which lets developers discover examples of applications by using large language models (LLMs), and gives them a framework to create their own AI-based applications and share them with their team."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We will discover, through this article, the different steps to create our first AI application, and to add it to the catalog of recipes of Podman AI Lab."
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

/***/ 78357
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/banner-1f24d8fca8ff7163882c09d2d0a667cb.png");

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

/***/ 66543
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/podman-ai-lab-create-ai-app-with-llm-running-locally","source":"@site/blog/2024-11-26-ai-lab-first-app.mdx","title":"Podman AI Lab - For developers to build AI Applications with LLMs running locally","description":"Learn how to create your first AI application, by using Podman AI Lab","date":"2024-11-26T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/blog/tags/extension"},{"inline":true,"label":"ai","permalink":"/blog/tags/ai"},{"inline":true,"label":"llm","permalink":"/blog/tags/llm"},{"inline":true,"label":"local","permalink":"/blog/tags/local"}],"readingTime":9.41,"hasTruncateMarker":true,"authors":[{"name":"Philippe Martin","title":"Principal Software Engineer","url":"https://github.com/feloy","imageURL":"https://github.com/feloy.png","key":"phmartin","page":null}],"frontMatter":{"title":"Podman AI Lab - For developers to build AI Applications with LLMs running locally","description":"Learn how to create your first AI application, by using Podman AI Lab","slug":"podman-ai-lab-create-ai-app-with-llm-running-locally","authors":["phmartin"],"tags":["podman-desktop","extension","ai","llm","local"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.15 Release","permalink":"/blog/podman-desktop-release-1.15"},"nextItem":{"title":"Podman Desktop + CNCF - Community Driven Move","permalink":"/blog/2024/11/14/podman-desktop-cncf"}}');

/***/ }

}]);