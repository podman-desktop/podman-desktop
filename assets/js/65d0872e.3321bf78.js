"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[75736],{

/***/ 89639
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_07_31_intel_mac_podman_6_transition_md_862_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_07_31_intel_mac_podman_6_transition_md_862_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17102);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Intel Mac support in Podman Desktop: What developers need to know',
	description: 'Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.',
	slug: 'intel-mac-podman-6-transition',
	authors: [
		'kyetter'
	],
	tags: [
		'podman-desktop',
		'podman',
		'macos',
		'deprecation'
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
    a: "a",
    p: "p",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
      href: "https://github.com/podman-container-tools/podman/releases/tag/v6.0.0",
      children: "Podman v6.0.0"
    }), " has removed support for Intel-based Macs, and will no longer publish an installer. Podman Desktop is adjusting how we bundle the engine so Apple silicon, Windows, and Linux users can move to Podman 6 without leaving Intel Mac users with a broken install experience. This change shipped with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
      href: "https://podman-desktop.io/blog/podman-desktop-release-1.29",
      children: "Podman Desktop 1.29"
    }), ". Here is what is changing, why, and what to do next."]
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

/***/ 17102
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/intel-mac-podman-6-transition","source":"@site/blog/2026-07-31-intel-mac-podman-6-transition.md","title":"Intel Mac support in Podman Desktop: What developers need to know","description":"Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.","date":"2026-07-31T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"macos","permalink":"/blog/tags/macos"},{"inline":true,"label":"deprecation","permalink":"/blog/tags/deprecation"}],"readingTime":3.06,"hasTruncateMarker":true,"authors":[{"name":"Kathryn Yetter","title":"Product Manager","url":"https://github.com/kyetter","imageURL":"https://github.com/kyetter.png","key":"kyetter","page":null}],"frontMatter":{"title":"Intel Mac support in Podman Desktop: What developers need to know","description":"Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.","slug":"intel-mac-podman-6-transition","authors":["kyetter"],"tags":["podman-desktop","podman","macos","deprecation"],"hide_table_of_contents":false},"unlisted":false,"nextItem":{"title":"Podman Desktop 1.29 Release","permalink":"/blog/podman-desktop-release-1.29"}}');

/***/ }

}]);