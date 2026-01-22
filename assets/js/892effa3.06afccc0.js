"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[53009],{

/***/ 28917:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_15_new_minc_extension_inner_loop_md_50a_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_15_new_minc_extension_inner_loop_md_50a_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87952);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'MINC: Speed Up Local K8s Dev',
	description: 'Speed up your development inner loop using a local Kubernetes cluster powered by MicroShift in a container.',
	slug: 'iterate-quickly-inner-loop-with-a-kubernetes-cluster',
	authors: [
		'benoitf'
	],
	tags: [
		'podman-desktop',
		'podman',
		'images',
		'kubernetes',
		'microshift'
	],
	hide_table_of_contents: false,
	image: '/img/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster/iterate-quickly-inner-loop-with-a-kubernetes-cluster.png'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    img: "img",
    p: "p",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Developers working locally often seek a fast inner loop for coding, building, and testing their OCI images and Kubernetes applications."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["For instance, when testing a new image in a Kubernetes pod, the image must be accessible either by pushing it to a private or public registry or by ensuring it's available on the Kubernetes cluster nodes. This often requires additional commands such as ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "kind load docker-image"
      }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "minikube cache add <image>"
      }), ", or publishing the image to a third-party registry."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["In this blog post, we’ll introduce a new extension called ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "MINC (MicroShift IN Container)"
      }), ", which provides a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/openshift/microshift",
        children: "MicroShift"
      }), " cluster running within an existing Podman Machine environment."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "hero",
        src: (__webpack_require__(77141)/* ["default"] */ .A) + "",
        width: "1216",
        height: "832"
      })
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



/***/ }),

/***/ 77141:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/iterate-quickly-inner-loop-with-a-kubernetes-cluster-fbc83434d514b5621a47049494de94cf.png");

/***/ }),

/***/ 43023:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ 87952:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster","source":"@site/blog/2025-05-15-new-minc-extension-inner-loop.md","title":"MINC: Speed Up Local K8s Dev","description":"Speed up your development inner loop using a local Kubernetes cluster powered by MicroShift in a container.","date":"2025-05-15T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"images","permalink":"/blog/tags/images"},{"inline":true,"label":"kubernetes","permalink":"/blog/tags/kubernetes"},{"inline":true,"label":"microshift","permalink":"/blog/tags/microshift"}],"readingTime":5.38,"hasTruncateMarker":true,"authors":[{"name":"Florent Benoit","title":"Principal Software Engineer","url":"https://github.com/benoitf","imageURL":"https://github.com/benoitf.png","key":"benoitf","page":null}],"frontMatter":{"title":"MINC: Speed Up Local K8s Dev","description":"Speed up your development inner loop using a local Kubernetes cluster powered by MicroShift in a container.","slug":"iterate-quickly-inner-loop-with-a-kubernetes-cluster","authors":["benoitf"],"tags":["podman-desktop","podman","images","kubernetes","microshift"],"hide_table_of_contents":false,"image":"/img/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster/iterate-quickly-inner-loop-with-a-kubernetes-cluster.png"},"unlisted":false,"prevItem":{"title":"Enabling OpenVINO Inference in Podman AI Lab","permalink":"/blog/2025/05/21/podman-ai-lab-openvino"},"nextItem":{"title":"Supercharge Your Container Development in VS Code with Podman and Podman Desktop","permalink":"/blog/2025/05/05/vs-code-with-podman-desktop"}}');

/***/ })

}]);