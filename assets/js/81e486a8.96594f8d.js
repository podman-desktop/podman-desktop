"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[74260],{

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

/***/ 44354
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kind_restarting_your_kind_cluster_md_81e_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kind-restarting-your-kind-cluster-md-81e.json
const site_docs_kind_restarting_your_kind_cluster_md_81e_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kind/restarting-your-kind-cluster","title":"Restarting a cluster","description":"Restarting your local Kind-powered Kubernetes cluster.","source":"@site/docs/kind/restarting-your-kind-cluster.md","sourceDirName":"kind","slug":"/kind/restarting-your-kind-cluster","permalink":"/docs/kind/restarting-your-kind-cluster","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kind/restarting-your-kind-cluster.md","tags":[{"inline":true,"label":"restarting-a-cluster","permalink":"/docs/tags/restarting-a-cluster"},{"inline":true,"label":"kind","permalink":"/docs/tags/kind"}],"version":"current","sidebarPosition":5,"frontMatter":{"sidebar_position":5,"title":"Restarting a cluster","description":"Restarting your local Kind-powered Kubernetes cluster.","keywords":["podman desktop","podman","containers","restarting","kubernetes","kind"],"tags":["restarting-a-cluster","kind"]},"sidebar":"mySidebar","previous":{"title":"Creating a cluster","permalink":"/docs/kind/creating-a-kind-cluster"},"next":{"title":"Working with a cluster","permalink":"/docs/kind/working-with-your-local-kind-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kind/restarting-your-kind-cluster.md


const frontMatter = {
	sidebar_position: 5,
	title: 'Restarting a cluster',
	description: 'Restarting your local Kind-powered Kubernetes cluster.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'restarting',
		'kubernetes',
		'kind'
	],
	tags: [
		'restarting-a-cluster',
		'kind'
	]
};
const contentTitle = 'Restarting your local Kind-powered Kubernetes cluster';

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
        id: "restarting-your-local-kind-powered-kubernetes-cluster",
        children: "Restarting your local Kind-powered Kubernetes cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can restart your local Kind-powered Kubernetes cluster."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Perform one of the following steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Restart using the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings"
        }), " page", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Open ", (0,jsx_runtime.jsxs)(_components.strong, {
              children: [(0,jsx_runtime.jsx)(Icon, {
                icon: "fa-solid fa-cog",
                size: "lg"
              }), " Settings > Resources"]
            }), "."]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Find the Kind cluster to restart."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Restart"
            }), " icon.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "restart using the settings page",
              src: (__webpack_require__(72607)/* ["default"] */ .A) + "",
              width: "1416",
              height: "340"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Restart using the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Containers"
        }), " page:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Containers"
            }), " from the left navigation pane."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "overflow menu"
            }), " icon corresponding to the Kind cluster container and select ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Restart Container"
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "restart using the Containers page",
              src: (__webpack_require__(92478)/* ["default"] */ .A) + "",
              width: "2094",
              height: "994"
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
        children: ["Find the Kind cluster that restarted. The cluster ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Age"
        }), " is consistent with the restart time."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Pods"
        }), " from the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Find the pods that are running on your Kind cluster."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Kind has no command to restart a cluster.\nTherefore, Podman Desktop stops the Kind cluster, starts it again, and hopes for the best.\nThe Kind cluster might not restart successfully.\nIn that case:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Consider replacing Kind with a local Kubernetes cluster that you can restart, such as ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://developers.redhat.com/products/openshift-local/",
          children: "OpenShift Local"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Consider ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/deleting-your-kind-cluster",
          children: "deleting your Kind cluster"
        }), ", and ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/creating-a-kind-cluster",
          children: "creating a Kind cluster"
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



/***/ },

/***/ 72607
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/restart-using-the-settings-page-4021e1a2298b44d85cf216d33ebdc626.png");

/***/ },

/***/ 92478
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/restart-using-the-containers-page-12f6fee87b2bee11917d9492a3a91bcf.png");

/***/ }

}]);