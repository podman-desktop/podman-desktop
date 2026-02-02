"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[82060],{

/***/ 92403:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_minikube_restarting_your_minikube_cluster_md_94f_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-minikube-restarting-your-minikube-cluster-md-94f.json
const site_docs_minikube_restarting_your_minikube_cluster_md_94f_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"minikube/restarting-your-minikube-cluster","title":"Restarting a cluster","description":"Restarting your local Minikube-powered Kubernetes cluster.","source":"@site/docs/minikube/restarting-your-minikube-cluster.md","sourceDirName":"minikube","slug":"/minikube/restarting-your-minikube-cluster","permalink":"/docs/minikube/restarting-your-minikube-cluster","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/minikube/restarting-your-minikube-cluster.md","tags":[{"inline":true,"label":"restarting-a-cluster","permalink":"/docs/tags/restarting-a-cluster"},{"inline":true,"label":"minikube","permalink":"/docs/tags/minikube"}],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6,"title":"Restarting a cluster","description":"Restarting your local Minikube-powered Kubernetes cluster.","keywords":["podman desktop","podman","containers","restarting","kubernetes","minikube"],"tags":["restarting-a-cluster","minikube"]},"sidebar":"mySidebar","previous":{"title":"Working with a cluster","permalink":"/docs/minikube/working-with-your-local-minikube-cluster"},"next":{"title":"Deleting a cluster","permalink":"/docs/minikube/deleting-your-minikube-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/minikube/restarting-your-minikube-cluster.md


const frontMatter = {
	sidebar_position: 6,
	title: 'Restarting a cluster',
	description: 'Restarting your local Minikube-powered Kubernetes cluster.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'restarting',
		'kubernetes',
		'minikube'
	],
	tags: [
		'restarting-a-cluster',
		'minikube'
	]
};
const contentTitle = 'Restarting your local Minikube-powered Kubernetes cluster';

const assets = {

};



const toc = [{
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Workaround",
  "id": "workaround",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
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
        id: "restarting-your-local-minikube-powered-kubernetes-cluster",
        children: "Restarting your local Minikube-powered Kubernetes cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can restart your local Minikube-powered Kubernetes cluster."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Perform one of the following steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Restart using the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings"
          }), " page"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Open ", (0,jsx_runtime.jsxs)(_components.strong, {
              children: [(0,jsx_runtime.jsx)(Icon, {
                icon: "fa-solid fa-cog",
                size: "lg"
              }), " Settings > Resources"]
            }), "."]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Find the Minikube cluster to restart."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Restart"
            }), " icon.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "restart using the settings page",
              src: (__webpack_require__(82519)/* ["default"] */ .A) + "",
              width: "1076",
              height: "370"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Restart using the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " page:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Containers"
            }), " from the left navigation pane."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "overflow menu"
            }), " icon corresponding to the Minikube cluster container and select ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Restart Container"
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "restart using the Containers page",
              src: (__webpack_require__(29110)/* ["default"] */ .A) + "",
              width: "2112",
              height: "1148"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Containers"
        }), " from the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Find the Minikube cluster that restarted. The cluster ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Age"
        }), " is consistent with the restart time."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Pods"
        }), " from the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Find the pods that are running on your Minikube cluster."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Minikube has no command to restart a cluster.\nTherefore, Podman Desktop stops the Minikube cluster, and starts it again.\nThe Minikube cluster might not restart successfully.\nIn that case:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Consider replacing Minikube with a local Kubernetes cluster that you can restart, such as ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://developers.redhat.com/products/openshift-local/",
          children: "OpenShift Local"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Consider ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/deleting-your-minikube-cluster",
          children: "deleting your Minikube cluster"
        }), ", and ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/creating-a-minikube-cluster",
          children: "creating a Minikube cluster"
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ }),

/***/ 29110:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/restart-using-the-containers-page-4cdad6ef95efa795c75664f33cc97936.png");

/***/ }),

/***/ 82519:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/restart-using-the-settings-page-6a4bfce3db10f8ce9a810e498e7417ec.png");

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