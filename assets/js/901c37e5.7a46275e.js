"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[32500],{

/***/ 46357:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_minikube_working_with_your_local_minikube_cluster_md_901_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-minikube-working-with-your-local-minikube-cluster-md-901.json
const site_docs_minikube_working_with_your_local_minikube_cluster_md_901_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"minikube/working-with-your-local-minikube-cluster","title":"Working with a cluster","description":"Working with your local Minikube-powered Kubernetes cluster.","source":"@site/docs/minikube/working-with-your-local-minikube-cluster.md","sourceDirName":"minikube","slug":"/minikube/working-with-your-local-minikube-cluster","permalink":"/docs/minikube/working-with-your-local-minikube-cluster","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/minikube/working-with-your-local-minikube-cluster.md","tags":[{"inline":true,"label":"working-with-a-minikube-cluster","permalink":"/docs/tags/working-with-a-minikube-cluster"},{"inline":true,"label":"minikube","permalink":"/docs/tags/minikube"}],"version":"current","sidebarPosition":5,"frontMatter":{"sidebar_position":5,"title":"Working with a cluster","description":"Working with your local Minikube-powered Kubernetes cluster.","keywords":["podman desktop","podman","containers","setting context","kubernetes","minikube"],"tags":["working-with-a-minikube-cluster","minikube"]},"sidebar":"mySidebar","previous":{"title":"Creating a cluster","permalink":"/docs/minikube/creating-a-minikube-cluster"},"next":{"title":"Restarting a cluster","permalink":"/docs/minikube/restarting-your-minikube-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/minikube/working-with-your-local-minikube-cluster.md


const frontMatter = {
	sidebar_position: 5,
	title: 'Working with a cluster',
	description: 'Working with your local Minikube-powered Kubernetes cluster.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'setting context',
		'kubernetes',
		'minikube'
	],
	tags: [
		'working-with-a-minikube-cluster',
		'minikube'
	]
};
const contentTitle = 'Working with your local Minikube-powered Kubernetes cluster';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    h1: "h1",
    h4: "h4",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "working-with-your-local-minikube-powered-kubernetes-cluster",
        children: "Working with your local Minikube-powered Kubernetes cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Set your Kubernetes context to your local Minikube-powered Kubernetes cluster."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/installing",
          children: "You onboarded a Minikube cluster"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Open the Podman Desktop tray."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the Kubernetes context named ", (0,jsx_runtime.jsx)(_components.code, {
          children: "minikube"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["Alternatively, use the status bar or the Podman Desktop ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings"
        }), " to set your Kubernetes context. For more details, see ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
          children: "Viewing and selecting the current Kubernetes context"
        }), "."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The Kubernetes CLI reports that the current context is your cluster with the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "minikube"
          }), " name:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ kubectl config current-context\n"
          })
        }), "\n"]
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