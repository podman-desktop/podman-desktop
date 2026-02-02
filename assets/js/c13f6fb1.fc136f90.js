"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[27707],{

/***/ 31520:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_troubleshooting_access_logs_md_c13_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-troubleshooting-access-logs-md-c13.json
const site_docs_troubleshooting_access_logs_md_c13_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"troubleshooting/access-logs","title":"Access logs","description":"Access Podman Desktop logs to troubleshoot","source":"@site/docs/troubleshooting/access-logs.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/access-logs","permalink":"/docs/troubleshooting/access-logs","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/troubleshooting/access-logs.md","tags":[{"inline":true,"label":"acessing-podman-desktop-logs","permalink":"/docs/tags/acessing-podman-desktop-logs"},{"inline":true,"label":"troubleshooting-podman-desktop","permalink":"/docs/tags/troubleshooting-podman-desktop"}],"version":"current","sidebarPosition":10,"frontMatter":{"sidebar_position":10,"title":"Access logs","description":"Access Podman Desktop logs to troubleshoot","keywords":["podman desktop","podman","access logs","troubleshoot"],"tags":["acessing-podman-desktop-logs","troubleshooting-podman-desktop"]},"sidebar":"mySidebar","previous":{"title":"Troubleshooting","permalink":"/docs/troubleshooting/"},"next":{"title":"Podman","permalink":"/docs/troubleshooting/troubleshooting-podman"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/troubleshooting/access-logs.md


const frontMatter = {
	sidebar_position: 10,
	title: 'Access logs',
	description: 'Access Podman Desktop logs to troubleshoot',
	keywords: [
		'podman desktop',
		'podman',
		'access logs',
		'troubleshoot'
	],
	tags: [
		'acessing-podman-desktop-logs',
		'troubleshooting-podman-desktop'
	]
};
const contentTitle = 'Access Podman Desktop logs';

const assets = {

};



const toc = [{
  "value": "Procedure: Access and save logs",
  "id": "procedure-access-and-save-logs",
  "level": 4
}, {
  "value": "Procedure: Resolve connection issues",
  "id": "procedure-resolve-connection-issues",
  "level": 4
}, {
  "value": "Procedure: Resolve event-related issues",
  "id": "procedure-resolve-event-related-issues",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    h4: "h4",
    header: "header",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "access-podman-desktop-logs",
        children: "Access Podman Desktop logs"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When you face any connection issues or any other problems with your task execution, you can access the Podman Desktop logs to troubleshoot. In addition, you can also resolve those issues using the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Repair & Connections"
      }), " and ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Stores"
      }), " tabs."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Stores denote the front-end objects that capture the event logs from the back-end side. For example, if a container is missing from the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Containers"
      }), " component page, click the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "containers"
      }), " store link to check the event that triggered the last refresh. After comparing the number of containers in the store with those on the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Containers"
      }), " page, you can identify whether a recent event is captured. If not, use the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Refresh"
      }), " button to refresh the store data."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you do not want to track the previous event logs, you can remove them from the history of the store."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-access-and-save-logs",
      children: "Procedure: Access and save logs"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Troubleshooting"
        }), " icon in the status bar."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Logs"
        }), " tab to view the logs.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "accessing logs",
          src: (__webpack_require__(43449)/* ["default"] */ .A) + "",
          width: "1542",
          height: "1090"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Gather Logs"
        }), " tab to save all the logs into a .zip file.", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "collect and save logs as .zip"
            }), "."]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Browse the location where you want to save the logs."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Save"
            }), ". You get a successful operation notification."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-resolve-connection-issues",
      children: "Procedure: Resolve connection issues"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Troubleshooting"
        }), " icon in the status bar."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Cleanup/Purge data"
        }), " to delete all resources from the engine.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "Repair &amp; Connections tab",
          src: (__webpack_require__(52110)/* ["default"] */ .A) + "",
          width: "1542",
          height: "1112"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Check container connections:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Ping"
            }), " to view the response time of the container engine."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Check containers"
            }), " to view the response time of the available containers."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Reconnect Providers"
        }), " to reconnect to the container engine socket."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-resolve-event-related-issues",
      children: "Procedure: Resolve event-related issues"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Troubleshooting"
        }), " icon in the status bar."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Stores"
        }), " tab to view the stores associated with Podman Desktop.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "store tab",
          src: (__webpack_require__(74387)/* ["default"] */ .A) + "",
          width: "1516",
          height: "558"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click a store link."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Refresh"
        }), " to refresh the event logs.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "refresh the event logs",
          src: (__webpack_require__(89333)/* ["default"] */ .A) + "",
          width: "1000",
          height: "858"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Clear"
        }), " to delete the event logs."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "OK"
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



/***/ }),

/***/ 43449:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/access-logs-6316c53310b7dc210549b78d2902d80f.png");

/***/ }),

/***/ 89333:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/refresh-event-logs-5f0fe430be49d448a7566a5cf9ec0c24.png");

/***/ }),

/***/ 52110:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/repair-and-connections-tab-77758a14839eebb3b83dfb2b0a285a8b.png");

/***/ }),

/***/ 74387:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/stores-tab-ea90c9ab3dbba85eff9fff2d64ebc304.png");

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