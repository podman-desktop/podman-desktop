"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[5297],{

/***/ 10724:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_configuring_editing_kube_object_md_ad7_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-configuring-editing-kube-object-md-ad7.json
const site_docs_kubernetes_configuring_editing_kube_object_md_ad7_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/configuring-editing-kube-object","title":"Managing objects","description":"Creating and updating a kubernetes object","source":"@site/docs/kubernetes/configuring-editing-kube-object.md","sourceDirName":"kubernetes","slug":"/kubernetes/configuring-editing-kube-object","permalink":"/docs/kubernetes/configuring-editing-kube-object","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/configuring-editing-kube-object.md","tags":[{"inline":true,"label":"managing-kubernetes","permalink":"/docs/tags/managing-kubernetes"},{"inline":true,"label":"objects","permalink":"/docs/tags/objects"}],"version":"current","sidebarPosition":12,"frontMatter":{"sidebar_position":12,"title":"Managing objects","description":"Creating and updating a kubernetes object","keywords":["podman desktop","podman","deploying","objects","kubernetes"],"tags":["managing-kubernetes","objects"]},"sidebar":"mySidebar","previous":{"title":"Applying a YAML manifest","permalink":"/docs/kubernetes/applying-a-yaml-manifest"},"next":{"title":"Configuring port forwarding","permalink":"/docs/kubernetes/port-forwarding"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/configuring-editing-kube-object.md


const frontMatter = {
	sidebar_position: 12,
	title: 'Managing objects',
	description: 'Creating and updating a kubernetes object',
	keywords: [
		'podman desktop',
		'podman',
		'deploying',
		'objects',
		'kubernetes'
	],
	tags: [
		'managing-kubernetes',
		'objects'
	]
};
const contentTitle = 'Managing Kubernetes objects';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure: Creating an object",
  "id": "procedure-creating-an-object",
  "level": 4
}, {
  "value": "Procedure: Updating an existing object",
  "id": "procedure-updating-an-existing-object",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
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
        id: "managing-kubernetes-objects",
        children: "Managing Kubernetes objects"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can easily transition from containers to Kubernetes and deploy a local Kubernetes environment with necessary objects. As a developer, you have the ability to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Manage your application resources visually."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Configure the following Kubernetes objects:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Node"
            }), ": Use this object to set up a node on which the necessary pods can run within a kubernetes cluster."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Deployment"
            }), ": Use this object to create necessary pods for execution and scale the number of pods."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Pod"
            }), ": Use this object to create a set of one or more containers with shared storage and network resources."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Service"
            }), ": Use this object to expose your application to users and define policies for application access."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Ingress"
            }), ": Use this object to define routing rules and manage user access to the services running in a Kubernetes cluster."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "PersistentVolumeClaim"
            }), ": Use this object to request ", (0,jsx_runtime.jsx)(_components.code, {
              children: "PersistentVolume"
            }), " resources for storage and define volume access modes within your Kubernetes cluster."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "ConfigMap"
            }), ": Use this object to define non-sensitive configuration data for initializing or executing your application."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Secret"
            }), ": Use this object to store and manage sensitive data, such as passwords, OAuth tokens, and SSH keys for your application."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "Jobs"
            }), ": Use this object to create one or more pods and run them in parallel."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "CronJob"
            }), ": Use this object to run a job, such as backup and report generation periodically on a given schedule."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "View and analyze real-time information about the connection status of the resources configured within the cluster."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "View the dashboard for analyzing object metrics and reading Kubernetes articles and blog posts."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Get resource details using the ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Summary"
        }), " and ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Inspect"
        }), " tabs."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Edit and apply configuration changes directly using the ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Kube"
        }), " tab."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select multiple configuration files and apply them to your cluster in a single step."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Configure port forwarding for a Kubernetes service and view the port forwarding details."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A valid ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
          children: "Kubernetes context and connection"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A pod creation example for reference:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-pod\nspec:\n  containers:\n    - name: my-container\n      image: nginx:1.14.2\n      ports:\n        - containerPort: 80\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-creating-an-object",
      children: "Procedure: Creating an object"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kubernetes"
          }), " component page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Click one of the options to open the object page."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "kube objects",
            src: (__webpack_require__(32907)/* ["default"] */ .A) + "",
            width: "190",
            height: "468"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Apply YAML"
          }), " button and select an object configuration file. A confirmation notification opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "configuring a node",
            src: (__webpack_require__(65653)/* ["default"] */ .A) + "",
            width: "1070",
            height: "236"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Ok"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-updating-an-existing-object",
      children: "Procedure: Updating an existing object"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes"
        }), " component page."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click one of the options to open the object page."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the name of the object."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kube"
        }), " tab and edit the configuration file.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "editing a node",
          src: (__webpack_require__(27323)/* ["default"] */ .A) + "",
          width: "1060",
          height: "710"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Apply changes to cluster"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "View the created object:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["View the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Pod"
            }), " object on the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Kubernetes > Pods"
            }), " object page."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["View other Kubernetes objects on the related object page. For example, if you have created a ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Node"
            }), " object, you can view it on the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Kubernetes > Nodes"
            }), " page."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Click the name of the object to view its detailed summary.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "summary tab",
            src: (__webpack_require__(79629)/* ["default"] */ .A) + "",
            width: "1060",
            height: "608"
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

/***/ 65653:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/example-config-node-440b14b85181f928e0a15d6e827c663f.png");

/***/ }),

/***/ 27323:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/example-edit-node-82c6b5b3d7ce59d32d52a48bcdfb2121.png");

/***/ }),

/***/ 32907:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kube-objects-ed4a6f27eef7034efc93f6dda0ca91aa.png");

/***/ }),

/***/ 79629:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/summary-tab-57a47c6b2f5ce733c28758c4a3be2f10.png");

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