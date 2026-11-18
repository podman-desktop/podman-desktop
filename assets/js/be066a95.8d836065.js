"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[30247],{

/***/ 76949
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_21_podman_ai_lab_openvino_mdx_da0_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_21_podman_ai_lab_openvino_mdx_da0_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88915);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Enabling OpenVINO Inference in Podman AI Lab',
	description: 'Use Podman AI Lab to run OpenVINO inference workloads locally.',
	authors: [
		'jeffmaury'
	],
	tags: [
		'podman-desktop',
		'podman',
		'extension',
		'ai',
		'llm',
		'local',
		'podman-ai-lab',
		'openvino'
	],
	hide_table_of_contents: false
};
const contentTitle = 'Enabling OpenVINO Inference in Podman AI Lab';

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Introduction to Podman AI Lab",
  "id": "introduction-to-podman-ai-lab",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    p: "p",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "introduction-to-podman-ai-lab",
      children: "Introduction to Podman AI Lab"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman AI Lab is an open-source platform designed to simplify the deployment, management, and experimentation of AI workloads using container technology. It provides a user-friendly interface for running, testing, and scaling AI models locally or in the cloud, leveraging the power and flexibility of Podman containers."
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

/***/ 88915
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/2025/05/21/podman-ai-lab-openvino","source":"@site/blog/2025-05-21-podman-ai-lab-openvino.mdx","title":"Enabling OpenVINO Inference in Podman AI Lab","description":"Use Podman AI Lab to run OpenVINO inference workloads locally.","date":"2025-05-21T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"extension","permalink":"/blog/tags/extension"},{"inline":true,"label":"ai","permalink":"/blog/tags/ai"},{"inline":true,"label":"llm","permalink":"/blog/tags/llm"},{"inline":true,"label":"local","permalink":"/blog/tags/local"},{"inline":true,"label":"podman-ai-lab","permalink":"/blog/tags/podman-ai-lab"},{"inline":true,"label":"openvino","permalink":"/blog/tags/openvino"}],"readingTime":3.07,"hasTruncateMarker":true,"authors":[{"name":"Jeff Maury","title":"Engineering Manager","url":"https://github.com/jeffmaury","imageURL":"https://github.com/jeffmaury.png","key":"jeffmaury","page":null}],"frontMatter":{"title":"Enabling OpenVINO Inference in Podman AI Lab","description":"Use Podman AI Lab to run OpenVINO inference workloads locally.","authors":["jeffmaury"],"tags":["podman-desktop","podman","extension","ai","llm","local","podman-ai-lab","openvino"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.19 Release","permalink":"/blog/podman-desktop-release-1.19"},"nextItem":{"title":"MINC: Speed Up Local K8s Dev","permalink":"/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster"}}');

/***/ }

}]);