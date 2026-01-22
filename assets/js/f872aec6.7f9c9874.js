"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[19475],{

/***/ 40073
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_pushing_an_image_md_f87_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-pushing-an-image-md-f87.json
const site_docs_kubernetes_pushing_an_image_md_f87_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/pushing-an-image","title":"Pushing an image","description":"Pushing an image to a cluster","source":"@site/docs/kubernetes/pushing-an-image.md","sourceDirName":"kubernetes","slug":"/kubernetes/pushing-an-image","permalink":"/docs/kubernetes/pushing-an-image","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/pushing-an-image.md","tags":[{"inline":true,"label":"pushing-an-image","permalink":"/docs/tags/pushing-an-image"},{"inline":true,"label":"Lima","permalink":"/docs/tags/lima"},{"inline":true,"label":"Minikube","permalink":"/docs/tags/minikube"},{"inline":true,"label":"Kind","permalink":"/docs/tags/kind"}],"version":"current","sidebarPosition":14,"frontMatter":{"sidebar_position":14,"title":"Pushing an image","description":"Pushing an image to a cluster","keywords":["podman desktop","podman","pushing an image","kubernetes"],"tags":["pushing-an-image","Lima","Minikube","Kind"]},"sidebar":"mySidebar","previous":{"title":"Configuring port forwarding","permalink":"/docs/kubernetes/port-forwarding"},"next":{"title":"Podman AI Lab","permalink":"/docs/ai-lab/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/pushing-an-image.md


const frontMatter = {
	sidebar_position: 14,
	title: 'Pushing an image',
	description: 'Pushing an image to a cluster',
	keywords: [
		'podman desktop',
		'podman',
		'pushing an image',
		'kubernetes'
	],
	tags: [
		'pushing-an-image',
		'Lima',
		'Minikube',
		'Kind'
	]
};
const contentTitle = 'Pushing an image to a cluster';

const assets = {

};



const toc = [{
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h4: "h4",
    header: "header",
    li: "li",
    p: "p",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "pushing-an-image-to-a-cluster",
        children: "Pushing an image to a cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can push an image to a Kubernetes cluster, such as Kind, MiniKube, or Lima. After building the image with your container engine, you can test it in your Kubernetes cluster and verify the created pod."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "See the procedural details in the following sections:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/pushing-an-image-to-kind",
          children: "Pushing an image to Kind"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/pushing-an-image-to-minikube",
          children: "Pushing an image to Minikube"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/pushing-an-image-to-lima",
          children: "Pushing an image to Lima"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/building-an-image-and-testing-it-in-kind",
          children: "Building an image and testing it in Kind"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/building-an-image-and-testing-it-in-minikube",
          children: "Building an image and testing it in Minikube"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/building-an-image-and-testing-it-in-lima",
          children: "Building an image and testing it in Lima"
        })
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


/***/ }

}]);