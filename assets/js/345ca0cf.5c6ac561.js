"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[62718],{

/***/ 74284:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_managing_a_kube_context_md_345_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-managing-a-kube-context-md-345.json
const site_docs_kubernetes_managing_a_kube_context_md_345_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/managing-a-kube-context","title":"Managing a context","description":"Covers the procedure to manage a Kubernetes context","source":"@site/docs/kubernetes/managing-a-kube-context.md","sourceDirName":"kubernetes","slug":"/kubernetes/managing-a-kube-context","permalink":"/docs/kubernetes/managing-a-kube-context","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/managing-a-kube-context.md","tags":[{"inline":true,"label":"editing-a-kubernetes-context","permalink":"/docs/tags/editing-a-kubernetes-context"},{"inline":true,"label":"managing-a-context","permalink":"/docs/tags/managing-a-context"},{"inline":true,"label":"duplicate-a-context","permalink":"/docs/tags/duplicate-a-context"},{"inline":true,"label":"import-contexts","permalink":"/docs/tags/import-contexts"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"Managing a context","description":"Covers the procedure to manage a Kubernetes context","keywords":["podman desktop","podman","manage kubernetes contexts"],"tags":["editing-a-kubernetes-context","managing-a-context","duplicate-a-context","import-contexts"]},"sidebar":"mySidebar","previous":{"title":"Selecting a context","permalink":"/docs/kubernetes/viewing-and-selecting-current-kubernetes-context"},"next":{"title":"Deploying a pod or container","permalink":"/docs/kubernetes/deploying-a-pod-to-kubernetes"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/managing-a-kube-context.md


const frontMatter = {
	sidebar_position: 3,
	title: 'Managing a context',
	description: 'Covers the procedure to manage a Kubernetes context',
	keywords: [
		'podman desktop',
		'podman',
		'manage kubernetes contexts'
	],
	tags: [
		'editing-a-kubernetes-context',
		'managing-a-context',
		'duplicate-a-context',
		'import-contexts'
	]
};
const contentTitle = 'Managing a Kubernetes context';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure: Edit a context",
  "id": "procedure-edit-a-context",
  "level": 4
}, {
  "value": "Procedure: Duplicate a context",
  "id": "procedure-duplicate-a-context",
  "level": 4
}, {
  "value": "Procedure: Import contexts",
  "id": "procedure-import-contexts",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
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
        id: "managing-a-kubernetes-context",
        children: "Managing a Kubernetes context"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Within Kubernetes, a context is useful to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Manage multiple development, testing, and production environments."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Simplify your interaction when working with multiple clusters, users, and namespaces."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can use the UI to edit or duplicate a context, or import a Kubernetes configuration file that contains multiple contexts. These tasks help in defining contexts with different configurations, enabling easy switching between environments during development."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes/creating-a-kube-cluster",
          children: "A Kubernetes cluster"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-edit-a-context",
      children: "Procedure: Edit a context"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Kubernetes"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Edit Context"
        }), " icon. The Edit Context popup window opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "edit context icon",
          src: (__webpack_require__(32631)/* ["default"] */ .A) + "",
          width: "1486",
          height: "594"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Edit any of the following context details:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Name"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Cluster"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "User"
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Namespace\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "edit context window",
              src: (__webpack_require__(50896)/* ["default"] */ .A) + "",
              width: "1302",
              height: "998"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Save"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-duplicate-a-context",
      children: "Procedure: Duplicate a context"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Kubernetes"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Duplicate Context"
        }), " icon."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-import-contexts",
      children: "Procedure: Import contexts"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Kubernetes"
        }), ", and click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Import"
        }), " button.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "Import button on the Kubernetes settings page",
          src: (__webpack_require__(84707)/* ["default"] */ .A) + "",
          width: "1638",
          height: "716"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Perform one of the following steps:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Drag and drop a Kubernetes configuration file."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Choose file"
            }), ":", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "select a Kubernetes configuration file from your machine."
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Edit the display name if needed."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Import Config"
                }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
                  alt: "import configurations button",
                  src: (__webpack_require__(18677)/* ["default"] */ .A) + "",
                  width: "1530",
                  height: "772"
                })]
              }), "\n"]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Review the contexts to import, and click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Import contexts"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "import contexts button",
          src: (__webpack_require__(17167)/* ["default"] */ .A) + "",
          width: "2350",
          height: "988"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.em, {
          children: "Edit a context"
        }), ": View the updated context details on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "updated context details",
          src: (__webpack_require__(90487)/* ["default"] */ .A) + "",
          width: "1484",
          height: "514"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.em, {
          children: "Duplicate a context"
        }), ": View the duplicated context on the same page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.em, {
          children: "Import contexts"
        }), ": View the added Kubernetes contexts on the same page."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
          children: "Viewing and selecting the current Kubernetes context"
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



/***/ }),

/***/ 90487:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/context-details-15f4969f3b22f2aa3f0e1b66a23f342a.png");

/***/ }),

/***/ 32631:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/edit-context-icon-edce13103b0c9fb15916dac6eeafa23b.png");

/***/ }),

/***/ 50896:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/edit-context-window-c77fe92ad29063d631c9db4f4fdedac9.png");

/***/ }),

/***/ 84707:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/import-button-e03b4f5e7c34742e1c6046d8963521da.png");

/***/ }),

/***/ 18677:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/import-config-44d28e4f32c108ce4cf85ede307e691d.png");

/***/ }),

/***/ 17167:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/import-contexts-a1ef4ffc5ead7ea9442656df9e560a62.png");

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