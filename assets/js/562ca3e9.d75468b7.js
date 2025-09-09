"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[37709],{

/***/ 29562:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kind_creating_a_kind_cluster_md_562_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kind-creating-a-kind-cluster-md-562.json
const site_docs_kind_creating_a_kind_cluster_md_562_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kind/creating-a-kind-cluster","title":"Creating a cluster","description":"Creating a local Kind-powered Kubernetes cluster.","source":"@site/docs/kind/creating-a-kind-cluster.md","sourceDirName":"kind","slug":"/kind/creating-a-kind-cluster","permalink":"/docs/kind/creating-a-kind-cluster","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kind/creating-a-kind-cluster.md","tags":[{"inline":true,"label":"creating-a-kind-cluster","permalink":"/docs/tags/creating-a-kind-cluster"},{"inline":true,"label":"kind","permalink":"/docs/tags/kind"}],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Creating a cluster","description":"Creating a local Kind-powered Kubernetes cluster.","keywords":["podman desktop","podman","containers","creating a cluster","kubernetes","kind"],"tags":["creating-a-kind-cluster","kind"]},"sidebar":"mySidebar","previous":{"title":"Configuring Podman","permalink":"/docs/kind/configuring-podman-for-kind-on-windows"},"next":{"title":"Restarting a cluster","permalink":"/docs/kind/restarting-your-kind-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kind/creating-a-kind-cluster.md


const frontMatter = {
	sidebar_position: 4,
	title: 'Creating a cluster',
	description: 'Creating a local Kind-powered Kubernetes cluster.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'creating a cluster',
		'kubernetes',
		'kind'
	],
	tags: [
		'creating-a-kind-cluster',
		'kind'
	]
};
const contentTitle = 'Creating a local Kind-powered Kubernetes cluster';

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
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "creating-a-local-kind-powered-kubernetes-cluster",
        children: "Creating a local Kind-powered Kubernetes cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can create multiple local Kind-powered Kubernetes clusters."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kind/configuring-podman-for-kind-on-windows",
            children: "On Windows, you configured Podman"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kind/installing",
            children: "You installed Kind"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "If you have not installed the Kind CLI, you will be prompted to install it when you create a Kind cluster."
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Resources"]
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Kind tile, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create new ..."
          }), " button."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Perform one of the following steps:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Create a Kind cluster with a ", (0,jsx_runtime.jsx)(_components.em, {
                children: "customized"
              }), " configuration by providing a path to the configuration file. The Kind cluster is created based on the values specified in the configuration file.\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "creating a Kind cluster with custom configuration",
                src: (__webpack_require__(62956)/* ["default"] */ .A) + "",
                width: "1216",
                height: "1458"
              })]
            }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
              type: "note",
              children: (0,jsx_runtime.jsx)(_components.p, {
                children: "When you provide the configuration file, the values specified in that file take precedence over the default values."
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Create a Kind cluster with the ", (0,jsx_runtime.jsx)(_components.em, {
                children: "default"
              }), " configuration. However, you can edit the default configuration, if needed. For example, you can edit the port number or any other configuration details.\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "creating a Kind cluster with default configuration",
                src: (__webpack_require__(11300)/* ["default"] */ .A) + "",
                width: "1246",
                height: "1464"
              })]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create"
          }), " button."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Show logs"
          }), " button to view the logs."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["After successful creation, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Go back to resources"
          }), " button."]
        }), "\n"]
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
            children: "<kind-cluster>"
          }), " instance in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kind"
          }), " tile.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running Kind cluster instance",
            src: (__webpack_require__(96060)/* ["default"] */ .A) + "",
            width: "1416",
            height: "340"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Podman Desktop tray, select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Kubernetes"
          }), " menu; you can set the context to your Kind cluster: ", (0,jsx_runtime.jsx)(_components.code, {
            children: "kind-<kind-cluster>"
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

/***/ 96060:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kind-cluster-running-c33337d4c7789e38d78778b0739d4353.png");

/***/ }),

/***/ 62956:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kind-cluster-with-custom-configuration-99825896bccdb3c5c7f45714111b8ce0.png");

/***/ }),

/***/ 11300:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kind-cluster-with-default-configuration-6d30e07c2f27eba341b8d9e894cc0302.png");

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