"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[87785],{

/***/ 92878:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_running_a_kubernetes_cluster_md_872_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-running-a-kubernetes-cluster-md-872.json
const site_tutorial_running_a_kubernetes_cluster_md_872_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"running-a-kubernetes-cluster","title":"Running a Kubernetes cluster","description":"Running a Kubernetes cluster","source":"@site/tutorial/running-a-kubernetes-cluster.md","sourceDirName":".","slug":"/running-a-kubernetes-cluster","permalink":"/tutorial/running-a-kubernetes-cluster","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"running-a-kubernetes-cluster","permalink":"/tutorial/tags/running-a-kubernetes-cluster"},{"inline":true,"label":"set-up-a-cluster","permalink":"/tutorial/tags/set-up-a-cluster"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"Running a Kubernetes cluster","description":"Running a Kubernetes cluster","keywords":["podman desktop","podman","Kubernetes"],"tags":["podman-desktop","running-a-kubernetes-cluster","set-up-a-cluster"]},"sidebar":"defaultSidebar","previous":{"title":"Running a pod using a container or docker file","permalink":"/tutorial/running-a-pod-using-a-container-docker-file"},"next":{"title":"Deploying a Kubernetes application","permalink":"/tutorial/deploying-a-kubernetes-application"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/running-a-kubernetes-cluster.md


const frontMatter = {
	sidebar_position: 3,
	title: 'Running a Kubernetes cluster',
	description: 'Running a Kubernetes cluster',
	keywords: [
		'podman desktop',
		'podman',
		'Kubernetes'
	],
	tags: [
		'podman-desktop',
		'running-a-kubernetes-cluster',
		'set-up-a-cluster'
	]
};
const contentTitle = 'Running a Kubernetes cluster';

const assets = {

};



const toc = [{
  "value": "Before you begin",
  "id": "before-you-begin",
  "level": 2
}, {
  "value": "Installing the extension",
  "id": "installing-the-extension",
  "level": 2
}, {
  "value": "Installing CLI on your local machine",
  "id": "installing-cli-on-your-local-machine",
  "level": 2
}, {
  "value": "Applicable on Windows: Configure Podman on WSL",
  "id": "applicable-on-windows-configure-podman-on-wsl",
  "level": 2
}, {
  "value": "Creating and running a Kubernetes cluster",
  "id": "creating-and-running-a-kubernetes-cluster",
  "level": 2
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
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
        id: "running-a-kubernetes-cluster",
        children: "Running a Kubernetes cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial covers the following end-to-end tasks required to run a Kubernetes cluster with the help of an extension:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Installing the extension"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Installing CLI on your local machine"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Applicable on Windows: Configure Podman on WSL"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Creating and running a Kubernetes cluster"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can use extensions, such as Kind and Minikube to start a local Kubernetes development cluster. When you have a running Kubernetes cluster, you can easily develop and test Kubernetes applications before deploying them to production. This tutorial focuses on creating a Kubernetes cluster using the Minikube extension."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "before-you-begin",
      children: "Before you begin"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Make sure you have:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/installation",
          children: "Installed Podman Desktop"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A developer role."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-the-extension",
      children: "Installing the extension"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Extensions > Catalog"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Find the Minikube extension using the search box."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Install"
          }), " icon.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "install the extension",
            src: (__webpack_require__(82438)/* ["default"] */ .A) + "",
            width: "1932",
            height: "824"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Installed"
          }), " tab to check the Minikube extension is active.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "extension enabled",
            src: (__webpack_require__(25352)/* ["default"] */ .A) + "",
            width: "1952",
            height: "622"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-cli-on-your-local-machine",
      children: "Installing CLI on your local machine"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Minikube not found on your system"
          }), " icon in the status bar.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "binary not available",
            src: (__webpack_require__(69981)/* ["default"] */ .A) + "",
            width: "1862",
            height: "1126"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Yes"
          }), " to download the Minikube binary."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Yes"
          }), " to install the binary system-wide for accessibility on the command line."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Enter your system password, if prompted. A notification of successful operation opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "binary successfully installed",
            src: (__webpack_require__(80037)/* ["default"] */ .A) + "",
            width: "949",
            height: "294"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "OK"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Check the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Minikube not found on your system"
          }), " icon disappears from the status bar."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "applicable-on-windows-configure-podman-on-wsl",
      children: "Applicable on Windows: Configure Podman on WSL"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To use the Minikube tool on Windows, you must have a Podman machine running in rootful mode."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["By default, the Podman Desktop ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings"
          }), " enable you to create a Podman machine that runs in rootful mode."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "root mode enabled",
            src: (__webpack_require__(46991)/* ["default"] */ .A) + "",
            width: "1524",
            height: "1176"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-and-running-a-kubernetes-cluster",
      children: "Creating and running a Kubernetes cluster"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings > Resources"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Minikube tile, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create new"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create a new cluster",
            src: (__webpack_require__(84509)/* ["default"] */ .A) + "",
            width: "1356",
            height: "998"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Edit the cluster configuration, if required.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "cluster configuration",
            src: (__webpack_require__(8113)/* ["default"] */ .A) + "",
            width: "1213",
            height: "1226"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create"
          }), ". A notification of successful operation opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Go back to resources"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View that your Minikube cluster is running and a new minikube context is added in the status bar.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "Kube context added",
            src: (__webpack_require__(69250)/* ["default"] */ .A) + "",
            width: "2096",
            height: "1280"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind",
          children: "Working with a Kind cluster"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube",
          children: "Working with a Minikube cluster"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima",
          children: "Working with a Lima cluster"
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

/***/ 80037:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/binary-installed-2b88d5efe2686d814814e57ea0ba829f.png");

/***/ }),

/***/ 8113:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/configure-minikube-cluster-a0cbdc60d286e1f8dee3e5b31666c8e1.png");

/***/ }),

/***/ 84509:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-a-new-cluster-c9f37bec1d8c7cdac2e44a4bd851ca5f.png");

/***/ }),

/***/ 25352:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-enabled-3828cc9a4506c3827bb1ce3317a4b7c0.png");

/***/ }),

/***/ 82438:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/install-icon-ac8689a04f3541884916596ed74c9d95.png");

/***/ }),

/***/ 69981:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/minikube-binary-not-available-ae2c917f0ec44b8046ffee34978837dd.png");

/***/ }),

/***/ 69250:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/new-context-added-6acfe0ac9c75399ce8332d1d0ece3ec8.png");

/***/ }),

/***/ 46991:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/root-mode-enabled-562cea955abb21390b0af1b5ec932f10.png");

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