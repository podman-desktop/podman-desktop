"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[3724],{

/***/ 83044:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_ai_lab_start_inference_server_md_35d_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-ai-lab-start-inference-server-md-35d.json
const site_docs_ai_lab_start_inference_server_md_35d_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"ai-lab/start-inference-server","title":"Starting an inference server","description":"Starting an inference server for a model.","source":"@site/docs/ai-lab/start-inference-server.md","sourceDirName":"ai-lab","slug":"/ai-lab/start-inference-server","permalink":"/docs/ai-lab/start-inference-server","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/ai-lab/start-inference-server.md","tags":[{"inline":true,"label":"ai","permalink":"/docs/tags/ai"},{"inline":true,"label":"llm","permalink":"/docs/tags/llm"},{"inline":true,"label":"generative ai","permalink":"/docs/tags/generative-ai"}],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Starting an inference server","description":"Starting an inference server for a model.","keywords":["podman desktop","podman","ai","llm","generative ai"],"tags":["ai","llm","generative ai"]},"sidebar":"mySidebar","previous":{"title":"Downloading a model","permalink":"/docs/ai-lab/download-model"},"next":{"title":"Creating a playground","permalink":"/docs/ai-lab/create-playground"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/ai-lab/start-inference-server.md


const frontMatter = {
	sidebar_position: 4,
	title: 'Starting an inference server',
	description: 'Starting an inference server for a model.',
	keywords: [
		'podman desktop',
		'podman',
		'ai',
		'llm',
		'generative ai'
	],
	tags: [
		'ai',
		'llm',
		'generative ai'
	]
};
const contentTitle = 'Starting an inference server for a model';

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
        id: "starting-an-inference-server-for-a-model",
        children: "Starting an inference server for a model"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Once a model is downloaded, a model service can be started. A model service is an inference server that runs in a container and exposes the model through the well-known chat API common to many providers."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/ai-lab/installing",
          children: "Podman AI Lab installed"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/ai-lab/download-model",
          children: "Model downloaded"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Click the Podman AI Lab icon in the left navigation pane."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Podman AI Lab navigation bar, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Services"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "New Model Service"
          }), " button at the top right corner of the page. The Creating Model service page opens."]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["On a macOS machine, you get a notification to ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/podman/creating-a-podman-machine",
              children: "create a GPU-enabled Podman machine"
            }), " to run your GPU workloads. Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Create GPU enabled machine"
            }), " button to proceed."]
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select the model for which you want to start an inference server from the dropdown list, and edit the port number if needed."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create service"
          }), ". The inference server for the model is being started, and this requires some time.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create a service",
            src: (__webpack_require__(35126)/* ["default"] */ .A) + "",
            width: "1854",
            height: "1096"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Open service details"
          }), " button."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the details of the inference server.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "inference server details",
          src: (__webpack_require__(56925)/* ["default"] */ .A) + "",
          width: "2280",
          height: "1504"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Customize the client code based on your programming language to access the model through the inference server. For example, set the code language to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Java"
        }), " and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Quarkus Langchain4J"
        }), ", and view the updated code snippet.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "inference server details for Quarkus",
          src: (__webpack_require__(13217)/* ["default"] */ .A) + "",
          width: "2272",
          height: "1294"
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



/***/ }),

/***/ 35126:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/creating-a-service-07b80c94bc434d163a79df46a761c9e1.png");

/***/ }),

/***/ 56925:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/inference-server-curl-bc1c3e27104dea089910823e8d2f53ca.png");

/***/ }),

/***/ 13217:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/inference-server-quarkus-a8eb085e41c5a350036a73e5bc541b21.png");

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