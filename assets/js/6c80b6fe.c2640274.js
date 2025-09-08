"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[13589],{

/***/ 45300:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_troubleshooting_troubleshooting_podman_on_linux_md_6c8_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-troubleshooting-troubleshooting-podman-on-linux-md-6c8.json
const site_docs_troubleshooting_troubleshooting_podman_on_linux_md_6c8_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"troubleshooting/troubleshooting-podman-on-linux","title":"Podman on Linux","description":"How to investigate when Podman does not work as expected.","source":"@site/docs/troubleshooting/troubleshooting-podman-on-linux.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/troubleshooting-podman-on-linux","permalink":"/docs/troubleshooting/troubleshooting-podman-on-linux","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/troubleshooting/troubleshooting-podman-on-linux.md","tags":[],"version":"current","sidebarPosition":40,"frontMatter":{"sidebar_position":40,"title":"Podman on Linux","description":"How to investigate when Podman does not work as expected."},"sidebar":"mySidebar","previous":{"title":"Podman on MacOS","permalink":"/docs/troubleshooting/troubleshooting-podman-on-macos"},"next":{"title":"Podman on OpenShift","permalink":"/docs/troubleshooting/troubleshooting-openshift-local"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/troubleshooting/troubleshooting-podman-on-linux.md


const frontMatter = {
	sidebar_position: 40,
	title: 'Podman on Linux',
	description: 'How to investigate when Podman does not work as expected.'
};
const contentTitle = 'Troubleshooting Podman on Linux';

const assets = {

};



const toc = [{
  "value": "Podman Desktop does not manage native Podman",
  "id": "podman-desktop-does-not-manage-native-podman",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    h2: "h2",
    header: "header",
    p: "p",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "troubleshooting-podman-on-linux",
        children: "Troubleshooting Podman on Linux"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "podman-desktop-does-not-manage-native-podman",
      children: "Podman Desktop does not manage native Podman"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "On Linux, Podman usually runs natively on the host.\nPodman might also run in a virtual machine."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop does only connect to the native rootless podman connection."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop does not manage podman native configuration or podman machine (create, configure, start, stop, delete)."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop might manage configuration relative to connections to registries and proxies."
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return MDXLayout ? (0,jsx_runtime.jsx)(MDXLayout, {
    ...props,
    children: (0,jsx_runtime.jsx)(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}



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


/***/ })

}]);