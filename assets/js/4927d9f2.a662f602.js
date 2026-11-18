"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[69670],{

/***/ 34697
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_05_vs_code_with_podman_desktop_mdx_752_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_05_vs_code_with_podman_desktop_mdx_752_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29918);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Supercharge Your Container Development in VS Code with Podman and Podman Desktop',
	description: 'How to develop apps with VS Code and Podman Desktop',
	authors: [
		'firewall'
	],
	tags: [
		'podman-desktop',
		'podman',
		'vscode',
		'docker',
		'extension',
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
    children: "Developing containerized applications can sometimes feel complex, but with the right tools, it can be a smooth and efficient process. In this blog post, we'll explore how to leverage the power of Visual Studio Code (VS Code) together with Podman and Podman Desktop to streamline your container development workflow. We'll cover setting up and using two VS Code extensions that integrate with Podman."
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

/***/ 29918
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/2025/05/05/vs-code-with-podman-desktop","source":"@site/blog/2025-05-05-vs-code-with-podman-desktop.mdx","title":"Supercharge Your Container Development in VS Code with Podman and Podman Desktop","description":"How to develop apps with VS Code and Podman Desktop","date":"2025-05-05T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"vscode","permalink":"/blog/tags/vscode"},{"inline":true,"label":"docker","permalink":"/blog/tags/docker"},{"inline":true,"label":"extension","permalink":"/blog/tags/extension"},{"inline":true,"label":"development","permalink":"/blog/tags/development"},{"inline":true,"label":"container","permalink":"/blog/tags/container"},{"inline":true,"label":"tools","permalink":"/blog/tags/tools"}],"readingTime":4.88,"hasTruncateMarker":true,"authors":[{"name":"Matt Demyttenaere","title":"Product Manager","url":"https://github.com/firewall","imageURL":"https://github.com/firewall.png","key":"firewall","page":null}],"frontMatter":{"title":"Supercharge Your Container Development in VS Code with Podman and Podman Desktop","description":"How to develop apps with VS Code and Podman Desktop","authors":["firewall"],"tags":["podman-desktop","podman","vscode","docker","extension","development","container","tools"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"MINC: Speed Up Local K8s Dev","permalink":"/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster"},"nextItem":{"title":"Podman Desktop 1.18 Release","permalink":"/blog/podman-desktop-release-1.18"}}');

/***/ }

}]);