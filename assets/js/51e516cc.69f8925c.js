"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[96420],{

/***/ 20604
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-pod-button-c569216c6b99a9d08e7ab53612e7a908.png");

/***/ },

/***/ 22774
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/selecting-containers-5eb2f932c691177deeca4af2f1bdd436.png");

/***/ },

/***/ 35524
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/open-browser-icon-8117484218826f499fd19f030ed7161b.png");

/***/ },

/***/ 37487
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pod-created-successfully-5ff0893c0dd4524870832aafa5269435.png");

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


/***/ },

/***/ 92296
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_creating_a_pod_md_51e_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-creating-a-pod-md-51e.json
const site_docs_containers_creating_a_pod_md_51e_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/creating-a-pod","title":"Create a pod","description":"Creating a pod from selected containers.","source":"@site/docs/containers/creating-a-pod.md","sourceDirName":"containers","slug":"/containers/creating-a-pod","permalink":"/docs/containers/creating-a-pod","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/creating-a-pod.md","tags":[{"inline":true,"label":"create-a-pod","permalink":"/docs/tags/create-a-pod"}],"version":"current","sidebarPosition":40,"frontMatter":{"sidebar_position":40,"title":"Create a pod","description":"Creating a pod from selected containers.","keywords":["podman desktop","podman","containers","pods"],"tags":["create-a-pod"]},"sidebar":"mySidebar","previous":{"title":"View the logs","permalink":"/docs/containers/viewing-container-logs"},"next":{"title":"Compose","permalink":"/docs/compose/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/creating-a-pod.md


const frontMatter = {
	sidebar_position: 40,
	title: 'Create a pod',
	description: 'Creating a pod from selected containers.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'pods'
	],
	tags: [
		'create-a-pod'
	]
};
const contentTitle = 'Creating a pod from selected containers';

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
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
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
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "creating-a-pod-from-selected-containers",
        children: "Creating a pod from selected containers"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can create a pod from your selected containers and run it on the Podman container engine."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Consider running containers in a pod to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Expose your ", (0,jsx_runtime.jsx)(_components.code, {
          children: "frontend"
        }), " application to the public network."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Protect your ", (0,jsx_runtime.jsx)(_components.code, {
          children: "database"
        }), " container in a private network."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "You are using the Podman container engine."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Your containers, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "database"
        }), " and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "frontend"
        }), ", running or stopped, are available on the Containers page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
          children: "frontend"
        }), " container is configured to access the service exposed by the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "database"
        }), " container on localhost, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "localhost:5000"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Containers"
        }), " from the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the containers, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "database"
        }), " and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "frontend"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "selecting containers",
          src: (__webpack_require__(22774)/* ["default"] */ .A) + "",
          width: "1770",
          height: "636"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create Pod"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Edit the name of the pod. The default name is ", (0,jsx_runtime.jsx)(_components.code, {
          children: "my-pod"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check that the correct ports are exposed."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create Pod"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "create pod button",
          src: (__webpack_require__(20604)/* ["default"] */ .A) + "",
          width: "1576",
          height: "1070"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the newly created pod on the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Pods"
        }), " component page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "pod created successfully",
          src: (__webpack_require__(37487)/* ["default"] */ .A) + "",
          width: "1640",
          height: "506"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the name of the pod to view its logs."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Open Browser"
        }), " icon. Your browser opens the service exposed by your ", (0,jsx_runtime.jsx)(_components.code, {
          children: "frontend-podified"
        }), " container.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "open browser icon",
          src: (__webpack_require__(35524)/* ["default"] */ .A) + "",
          width: "1640",
          height: "1128"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/blog/2024/10/05/kubernetes-blog#creating-a-pod",
          children: "Blog- Creating a pod"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/tutorial/managing-your-application-resources#managing-containers-and-pods",
          children: "Managing containers and pods"
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



/***/ }

}]);