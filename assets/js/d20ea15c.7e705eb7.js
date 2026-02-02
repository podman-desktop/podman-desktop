"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[6814],{

/***/ 49285:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_creating_a_kube_cluster_md_d20_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-creating-a-kube-cluster-md-d20.json
const site_docs_kubernetes_creating_a_kube_cluster_md_d20_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/creating-a-kube-cluster","title":"Creating a Kubernetes cluster","description":"Creating a Kubernetes cluster","source":"@site/docs/kubernetes/creating-a-kube-cluster.md","sourceDirName":"kubernetes","slug":"/kubernetes/creating-a-kube-cluster","permalink":"/docs/kubernetes/creating-a-kube-cluster","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/creating-a-kube-cluster.md","tags":[{"inline":true,"label":"creating-kubernetes-cluster","permalink":"/docs/tags/creating-kubernetes-cluster"},{"inline":true,"label":"extentions","permalink":"/docs/tags/extentions"}],"version":"current","sidebarPosition":11,"frontMatter":{"sidebar_position":11,"title":"Creating a Kubernetes cluster","description":"Creating a Kubernetes cluster","keywords":["podman desktop","podman","creating","cluster","kubernetes"],"tags":["creating-kubernetes-cluster","extentions"]},"sidebar":"mySidebar","previous":{"title":"Deploying a pod or container","permalink":"/docs/kubernetes/deploying-a-pod-to-kubernetes"},"next":{"title":"Applying a YAML manifest","permalink":"/docs/kubernetes/applying-a-yaml-manifest"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/creating-a-kube-cluster.md


const frontMatter = {
	sidebar_position: 11,
	title: 'Creating a Kubernetes cluster',
	description: 'Creating a Kubernetes cluster',
	keywords: [
		'podman desktop',
		'podman',
		'creating',
		'cluster',
		'kubernetes'
	],
	tags: [
		'creating-kubernetes-cluster',
		'extentions'
	]
};
const contentTitle = 'Creating a Kubernetes cluster using extensions';

const assets = {

};



const toc = [];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    em: "em",
    h1: "h1",
    header: "header",
    p: "p",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "creating-a-kubernetes-cluster-using-extensions",
        children: "Creating a Kubernetes cluster using extensions"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop provides extensions, such as Kind, MiniKube, and others to start a local Kubernetes development cluster. The following table covers the procedural sections for setting up a Kubernetes cluster:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Extension"
          }), (0,jsx_runtime.jsx)(_components.th, {
            style: {
              textAlign: "center"
            },
            children: "Procedural sections to follow"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Kind"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            style: {
              textAlign: "center"
            },
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/extensions/install",
              children: "Install the Kind extension"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kind/installing",
              children: "Install the Kind CLI"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kind/configuring-podman-for-kind-on-windows",
              children: "Configure Podman on WSL"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kind/creating-a-kind-cluster",
              children: "Create a Kind cluster"
            })]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Minikube"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            style: {
              textAlign: "center"
            },
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/extensions/install",
              children: "Install the Minikube extension"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/minikube/installing",
              children: "Install the Minikube CLI"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/minikube/configuring-podman-for-minikube-on-windows",
              children: "Configure Podman on WSL"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/minikube/creating-a-minikube-cluster",
              children: "Create a Minikube cluster"
            })]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Lima"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            style: {
              textAlign: "center"
            },
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/extensions/install",
              children: "Install the Lima extention"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/lima/installing",
              children: "Install the Lima CLI"
            }), " > ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/lima/creating-a-kubernetes-instance",
              children: "Create a Lima instance for Kubernetes"
            })]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["The ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Configure Podman on WSL"
        }), " procedure is applicable only if you have installed the Podman Desktop application on a Windows machine. For MacOS and Linux, you can skip this procedure."]
      })
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