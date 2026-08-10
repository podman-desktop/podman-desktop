"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[15674],{

/***/ 84458
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_port_forwarding_md_908_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-port-forwarding-md-908.json
const site_docs_kubernetes_port_forwarding_md_908_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/port-forwarding","title":"Configuring port forwarding","description":"Configuring port forwarding for a Kubernetes pod or service","source":"@site/docs/kubernetes/port-forwarding.md","sourceDirName":"kubernetes","slug":"/kubernetes/port-forwarding","permalink":"/docs/kubernetes/port-forwarding","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/port-forwarding.md","tags":[{"inline":true,"label":"Configuring-port-forwarding","permalink":"/docs/tags/configuring-port-forwarding"},{"inline":true,"label":"port-forwarding","permalink":"/docs/tags/port-forwarding"}],"version":"current","sidebarPosition":13,"frontMatter":{"sidebar_position":13,"title":"Configuring port forwarding","description":"Configuring port forwarding for a Kubernetes pod or service","keywords":["podman desktop","podman","port forwarding","objects","kubernetes"],"tags":["Configuring-port-forwarding","port-forwarding"]},"sidebar":"mySidebar","previous":{"title":"Managing objects","permalink":"/docs/kubernetes/configuring-editing-kube-object"},"next":{"title":"Pushing an image","permalink":"/docs/kubernetes/pushing-an-image"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/port-forwarding.md


const frontMatter = {
	sidebar_position: 13,
	title: 'Configuring port forwarding',
	description: 'Configuring port forwarding for a Kubernetes pod or service',
	keywords: [
		'podman desktop',
		'podman',
		'port forwarding',
		'objects',
		'kubernetes'
	],
	tags: [
		'Configuring-port-forwarding',
		'port-forwarding'
	]
};
const contentTitle = 'Configuring port forwarding';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure: Start port forwarding",
  "id": "procedure-start-port-forwarding",
  "level": 4
}, {
  "value": "Procedure: Stop port forwarding",
  "id": "procedure-stop-port-forwarding",
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
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "configuring-port-forwarding",
        children: "Configuring port forwarding"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Within a Kubernetes cluster, you can access an application by its internal IP address. But, if you want to access the application from your local machine, use the port forwarding feature. Using UI, you can forward a local port to a port on the pod that runs your application. This way you can interact with the application running in a Kubernetes cluster from your local machine for debugging and testing purposes."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can use the port forwarding feature for the pods and services running on a Kubernetes cluster. Also, you can perform port forwarding for any exposed ports."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Make sure you have:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A running Kubernetes cluster, such as ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/creating-a-kind-cluster",
          children: "Kind"
        }), " or ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/creating-a-minikube-cluster",
          children: "Minikube"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Connected to the cluster.", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Settings > Kubernetes"
            }), ", and click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Connect"
            }), " in the cluster tile."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Created a YAML configuration file with an exposed port:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: static-web\nspec:\n  containers:\n    - image: nginx\n      name: web\n      ports:\n        - containerPort: 80\n          name: web\n          protocol: TCP\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-start-port-forwarding",
      children: "Procedure: Start port forwarding"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kubernetes > Pods"
          }), " component page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Apply YAML"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select your Kubernetes YAML file, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "pod.yaml"
          }), " from your local machine. A confirmation notification opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "OK"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the created Kubernetes pod on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "view the newly created pod",
            src: (__webpack_require__(84938)/* ["default"] */ .A) + "",
            width: "1716",
            height: "798"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the name of the pod and view the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Summary"
          }), " tab."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Forward..."
          }), " button corresponding to the port you want to use for port forwarding.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "forward button",
            src: (__webpack_require__(93075)/* ["default"] */ .A) + "",
            width: "1380",
            height: "1256"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Open"
          }), " button to view the running application in a web browser.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "open button",
            src: (__webpack_require__(4514)/* ["default"] */ .A) + "",
            width: "1380",
            height: "1226"
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["You can also start port forwarding from the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Kubernetes > Services"
            }), " component page. After creating a service, click the name of the service and configure port forwarding in the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Summary"
            }), " tab."]
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-stop-port-forwarding",
      children: "Procedure: Stop port forwarding"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can stop port forwarding by using one of the following ways:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Use the Pods or Services page"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes > Pods"
        }), " or ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes > Services"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the name of the Kubernetes pod or service for which you want to stop port forwarding."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Remove"
        }), " in the Summary tab. The entry is removed from the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes > Port Forwarding"
        }), " page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "using component page",
          src: (__webpack_require__(9049)/* ["default"] */ .A) + "",
          width: "1650",
          height: "542"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Use the Port Forwarding page"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes > Port Forwarding"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Delete"
        }), " icon corresponding to the pod or service for which you want to stop port forwarding. The entry is removed from the page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "using port forwarding page",
          src: (__webpack_require__(10992)/* ["default"] */ .A) + "",
          width: "1316",
          height: "372"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes > Port Forwarding"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the port forwarding details for Kubernetes pods and services.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "verifying port forwarding details",
          src: (__webpack_require__(26437)/* ["default"] */ .A) + "",
          width: "1304",
          height: "464"
        })]
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

/***/ 10992
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/delete-icon-on-port-forwarding-page-f328772c4833efbdf719a1d5a71e3041.png");

/***/ },

/***/ 93075
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/forward-button-dd1e522f2fd6719c70e87d5213dd48e6.png");

/***/ },

/***/ 84938
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/new-kubernetes-pod-9a6724f0a1302fefb393801bc4b9f726.png");

/***/ },

/***/ 4514
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/open-button-d53c16a3e412e89857480c976ca65142.png");

/***/ },

/***/ 9049
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/stop-port-forwarding-pod-a1cc7fb4542b2ac6777b8cac37a71f85.png");

/***/ },

/***/ 26437
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/verifying-the-port-forwarding-details-d8814fa9d338f9c8da32bd0980c46818.png");

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