"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[84874],{

/***/ 45459:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_deploying_a_pod_to_kubernetes_md_545_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-deploying-a-pod-to-kubernetes-md-545.json
const site_docs_kubernetes_deploying_a_pod_to_kubernetes_md_545_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/deploying-a-pod-to-kubernetes","title":"Deploying a pod or container","description":"Deploying a pod or container to Kubernetes","source":"@site/docs/kubernetes/deploying-a-pod-to-kubernetes.md","sourceDirName":"kubernetes","slug":"/kubernetes/deploying-a-pod-to-kubernetes","permalink":"/docs/kubernetes/deploying-a-pod-to-kubernetes","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/deploying-a-pod-to-kubernetes.md","tags":[{"inline":true,"label":"migrating-to-kubernetes","permalink":"/docs/tags/migrating-to-kubernetes"},{"inline":true,"label":"deploying-a-pod","permalink":"/docs/tags/deploying-a-pod"},{"inline":true,"label":"deploying-a-container","permalink":"/docs/tags/deploying-a-container"}],"version":"current","sidebarPosition":10,"frontMatter":{"sidebar_position":10,"title":"Deploying a pod or container","description":"Deploying a pod or container to Kubernetes","keywords":["podman desktop","podman","containers","pods","migrating","kubernetes"],"tags":["migrating-to-kubernetes","deploying-a-pod","deploying-a-container"]},"sidebar":"mySidebar","previous":{"title":"Managing a context","permalink":"/docs/kubernetes/managing-a-kube-context"},"next":{"title":"Creating a Kubernetes cluster","permalink":"/docs/kubernetes/creating-a-kube-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/deploying-a-pod-to-kubernetes.md


const frontMatter = {
	sidebar_position: 10,
	title: 'Deploying a pod or container',
	description: 'Deploying a pod or container to Kubernetes',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'pods',
		'migrating',
		'kubernetes'
	],
	tags: [
		'migrating-to-kubernetes',
		'deploying-a-pod',
		'deploying-a-container'
	]
};
const contentTitle = 'Deploying a pod or container to Kubernetes';

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
    em: "em",
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
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "deploying-a-pod-or-container-to-kubernetes",
        children: "Deploying a pod or container to Kubernetes"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can deploy a pod to your Kubernetes cluster with an active connection. Any container that is part of a pod is also deployable to your cluster."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "You are using the Podman container engine."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Your pod, running or stopped, is available on the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Pods"
        }), " page: ", (0,jsx_runtime.jsx)(_components.em, {
          children: "<your_pod>"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["You registered the Kubernetes cluster in your kubeconfig file: ", (0,jsx_runtime.jsx)(_components.em, {
          children: "<your_kubernetes_cluster>"
        }), ". For example, ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/creating-a-kind-cluster",
          children: "Creating a kind cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The cluster is reachable.", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Settings > Kubernetes"
            }), ", and click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Connect"
            }), " in the cluster tile."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "The Kubernetes namespace to deploy to already exists."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Your container has a port that is exposed correctly to generate a service."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select your ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
            children: "Kubernetes context"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Pods"
          }), " or ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " component page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the overflow menu icon corresponding to the pod or container.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "overflow menu icon",
            src: (__webpack_require__(81451)/* ["default"] */ .A) + "",
            width: "1574",
            height: "638"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Deploy to Kubernetes"
          }), " option from the dropdown list."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select the checkbox to expose the service locally by using the default ingress controller.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "expose the service locally",
            src: (__webpack_require__(41032)/* ["default"] */ .A) + "",
            width: "1566",
            height: "1192"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Conditional: When you configure custom port mapping while running an image, you have the option to select an Ingress host port from the dropdown list.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "ingress-host-port",
            src: (__webpack_require__(75135)/* ["default"] */ .A) + "",
            width: "1604",
            height: "180"
          }), "\nOtherwise, you do not see the option."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Optional: Select a namespace from the dropdown list."
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["By default, your pod or container is deployed to the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "default"
            }), " namespace."]
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Deploy"
          }), " and then ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Done"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Deploy generated pod to Kubernetes"
          }), " screen, the created pod status is ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Phase: Running"
          }), "\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "Deploying a pod",
            src: (__webpack_require__(97160)/* ["default"] */ .A) + "",
            width: "1554",
            height: "1180"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kubernetes > Pods"
          }), ": your Kubernetes pod is in the list.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "kube pod in the list",
            src: (__webpack_require__(49813)/* ["default"] */ .A) + "",
            width: "2102",
            height: "938"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Check the running service on the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kubernetes > Services"
          }), " page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running service",
            src: (__webpack_require__(16600)/* ["default"] */ .A) + "",
            width: "1684",
            height: "460"
          })]
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

/***/ 97160:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/deploying-a-pod-7dc0d90b7d92376f4fb784e3a2601b98.png");

/***/ }),

/***/ 41032:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/expose-the-service-locally-c0f9ff42272180112432dd0dc98eda5e.png");

/***/ }),

/***/ 75135:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/ingress-host-port-add5711cd5105afc5d53138e02d0a380.png");

/***/ }),

/***/ 49813:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kube-pod-in-the-list-bc30fb9b01e9183bcb2cdc1aa253276b.png");

/***/ }),

/***/ 81451:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/overflow-menu-icon-d4b2789f34e65233c6e3df4e59b5a127.png");

/***/ }),

/***/ 16600:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/running-service-a16b178cf56849dc0a465432be2ceb35.png");

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