"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[96831],{

/***/ 87479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_minikube_creating_a_minikube_cluster_md_256_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-minikube-creating-a-minikube-cluster-md-256.json
const site_docs_minikube_creating_a_minikube_cluster_md_256_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"minikube/creating-a-minikube-cluster","title":"Creating a cluster","description":"Creating a local Minikube-powered Kubernetes cluster.","source":"@site/docs/minikube/creating-a-minikube-cluster.md","sourceDirName":"minikube","slug":"/minikube/creating-a-minikube-cluster","permalink":"/docs/minikube/creating-a-minikube-cluster","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/minikube/creating-a-minikube-cluster.md","tags":[{"inline":true,"label":"creating-a-cluster","permalink":"/docs/tags/creating-a-cluster"},{"inline":true,"label":"minikube","permalink":"/docs/tags/minikube"}],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Creating a cluster","description":"Creating a local Minikube-powered Kubernetes cluster.","keywords":["podman desktop","podman","containers","kubernetes","minikube"],"tags":["creating-a-cluster","minikube"]},"sidebar":"mySidebar","previous":{"title":"Configuring Podman","permalink":"/docs/minikube/configuring-podman-for-minikube-on-windows"},"next":{"title":"Working with a cluster","permalink":"/docs/minikube/working-with-your-local-minikube-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/minikube/creating-a-minikube-cluster.md


const frontMatter = {
	sidebar_position: 4,
	title: 'Creating a cluster',
	description: 'Creating a local Minikube-powered Kubernetes cluster.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'kubernetes',
		'minikube'
	],
	tags: [
		'creating-a-cluster',
		'minikube'
	]
};
const contentTitle = 'Creating a local Minikube-powered Kubernetes cluster';

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
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "creating-a-local-minikube-powered-kubernetes-cluster",
        children: "Creating a local Minikube-powered Kubernetes cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can create multiple local Minikube-powered Kubernetes clusters."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/installing",
          children: "You installed Minikube"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/configuring-podman-for-minikube-on-windows",
          children: "On Windows, you configured Podman"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: [(0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-cog",
            size: "lg"
          }), " Settings > Resources"]
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the Minikube tile, click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create new ..."
        }), " button."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Edit the default configuration, if needed."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create"
        }), " button.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "creating a Minikiube cluster",
          src: (__webpack_require__(55382)/* ["default"] */ .A) + "",
          width: "1682",
          height: "1526"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Show logs"
        }), " button to view the logs."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["After successful creation, click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Go back to resources"
        }), " button."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Resources"]
          }), ", and view your running ", (0,jsx_runtime.jsx)(_components.code, {
            children: "<minikube>"
          }), " instance in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Minikube"
          }), " tile.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running a Minikube cluster instance",
            src: (__webpack_require__(42312)/* ["default"] */ .A) + "",
            width: "988",
            height: "370"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Podman Desktop tray, select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kubernetes"
          }), " menu; you can set the context to your Minikube cluster: ", (0,jsx_runtime.jsx)(_components.code, {
            children: "minikube"
          }), "."]
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ }),

/***/ 55382:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/creating-a-minikube-cluster-6910015e3cc794ee2d3cacc8af200fa3.png");

/***/ }),

/***/ 42312:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/minikube-cluster-running-40fa5e959a24eae80f5ee0f05e687457.png");

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