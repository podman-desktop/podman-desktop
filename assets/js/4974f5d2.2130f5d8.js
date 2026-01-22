"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[17242],{

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

/***/ 92998
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_lima_index_md_497_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-lima-index-md-497.json
const site_docs_lima_index_md_497_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"lima/index","title":"Lima","description":"Podman Desktop can assist you to create a custom Lima instance on Linux and macOS.","source":"@site/docs/lima/index.md","sourceDirName":"lima","slug":"/lima/","permalink":"/docs/lima/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/lima/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"containers","permalink":"/docs/tags/containers"},{"inline":true,"label":"kubernetes","permalink":"/docs/tags/kubernetes"},{"inline":true,"label":"onboarding","permalink":"/docs/tags/onboarding"},{"inline":true,"label":"linux","permalink":"/docs/tags/linux"},{"inline":true,"label":"macOS","permalink":"/docs/tags/mac-os"}],"version":"current","sidebarPosition":90,"frontMatter":{"sidebar_position":90,"title":"Lima","description":"Podman Desktop can assist you to create a custom Lima instance on Linux and macOS.","tags":["podman-desktop","containers","kubernetes","onboarding","linux","macOS"],"keywords":["podman desktop","containers","kubernetes","lima","onboarding","linux","macos"]},"sidebar":"mySidebar","previous":{"title":"Pushing an image","permalink":"/docs/minikube/pushing-an-image-to-minikube"},"next":{"title":"Installing the CLI","permalink":"/docs/lima/installing"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/lima/index.md


const frontMatter = {
	sidebar_position: 90,
	title: 'Lima',
	description: 'Podman Desktop can assist you to create a custom Lima instance on Linux and macOS.',
	tags: [
		'podman-desktop',
		'containers',
		'kubernetes',
		'onboarding',
		'linux',
		'macOS'
	],
	keywords: [
		'podman desktop',
		'containers',
		'kubernetes',
		'lima',
		'onboarding',
		'linux',
		'macos'
	]
};
const contentTitle = 'Lima';

const assets = {

};



const toc = [{
  "value": "Next steps",
  "id": "next-steps",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h4: "h4",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "lima",
        children: "Lima"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Lima launches Linux virtual machines with automatic file sharing and port forwarding (similar to WSL2)."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["With Podman Desktop, you can work on ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://lima-vm.io/",
        children: "Lima-powered"
      }), " custom instances or local Kubernetes clusters."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/installing",
          children: "Installing Lima"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/creating-a-lima-instance",
          children: "Create a Lima instance for container workloads"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/creating-a-kubernetes-instance",
          children: "Create a Lima instance for Kubernetes workloads"
        }), "."]
      }), "\n"]
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



/***/ }

}]);