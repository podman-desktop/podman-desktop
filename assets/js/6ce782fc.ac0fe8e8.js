"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[87437],{

/***/ 28541
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/openvino-playground2-36cde0771b0b4c8e1a307c7e9ece2f19.png");

/***/ },

/***/ 30727
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/2025/05/21/podman-ai-lab-openvino","source":"@site/blog/2025-05-21-podman-ai-lab-openvino.md","title":"Enabling OpenVINO Inference in Podman AI Lab","description":"Use Podman AI Lab to run OpenVINO inference workloads locally.","date":"2025-05-21T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"extension","permalink":"/blog/tags/extension"},{"inline":true,"label":"ai","permalink":"/blog/tags/ai"},{"inline":true,"label":"llm","permalink":"/blog/tags/llm"},{"inline":true,"label":"local","permalink":"/blog/tags/local"},{"inline":true,"label":"podman-ai-lab","permalink":"/blog/tags/podman-ai-lab"},{"inline":true,"label":"openvino","permalink":"/blog/tags/openvino"}],"readingTime":3.07,"hasTruncateMarker":false,"authors":[{"name":"Jeff Maury","title":"Engineering Manager","url":"https://github.com/jeffmaury","imageURL":"https://github.com/jeffmaury.png","key":"jeffmaury","page":null}],"frontMatter":{"title":"Enabling OpenVINO Inference in Podman AI Lab","description":"Use Podman AI Lab to run OpenVINO inference workloads locally.","authors":["jeffmaury"],"tags":["podman-desktop","podman","extension","ai","llm","local","podman-ai-lab","openvino"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.19 Release","permalink":"/blog/podman-desktop-release-1.19"},"nextItem":{"title":"MINC: Speed Up Local K8s Dev","permalink":"/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster"}}');

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

/***/ 75190
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/openvino-inference-server-details-9ca98be0f9854a1c21e192638fef4c7e.png");

/***/ },

/***/ 87083
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_21_podman_ai_lab_openvino_md_bc6_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_05_21_podman_ai_lab_openvino_md_bc6_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30727);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Enabling OpenVINO Inference in Podman AI Lab',
	description: 'Use Podman AI Lab to run OpenVINO inference workloads locally.',
	authors: [
		'jeffmaury'
	],
	tags: [
		'podman-desktop',
		'podman',
		'extension',
		'ai',
		'llm',
		'local',
		'podman-ai-lab',
		'openvino'
	],
	hide_table_of_contents: false
};
const contentTitle = 'Enabling OpenVINO Inference in Podman AI Lab';

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Introduction to Podman AI Lab",
  "id": "introduction-to-podman-ai-lab",
  "level": 2
}, {
  "value": "What is OpenVINO?",
  "id": "what-is-openvino",
  "level": 2
}, {
  "value": "Using OpenVINO in Podman AI Lab",
  "id": "using-openvino-in-podman-ai-lab",
  "level": 2
}, {
  "value": "Starting an OpenVINO inference server",
  "id": "starting-an-openvino-inference-server",
  "level": 2
}, {
  "value": "Starting a playground with an OpenVINO compatible model",
  "id": "starting-a-playground-with-an-openvino-compatible-model",
  "level": 2
}, {
  "value": "Consistency with OpenShift AI + OpenVINO",
  "id": "consistency-with-openshift-ai--openvino",
  "level": 2
}, {
  "value": "Conclusion",
  "id": "conclusion",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    admonition: "admonition",
    em: "em",
    h2: "h2",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "introduction-to-podman-ai-lab",
      children: "Introduction to Podman AI Lab"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman AI Lab is an open-source platform designed to simplify the deployment, management, and experimentation of AI workloads using container technology. It provides a user-friendly interface for running, testing, and scaling AI models locally or in the cloud, leveraging the power and flexibility of Podman containers."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "what-is-openvino",
      children: "What is OpenVINO?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "OpenVINO™ (Open Visual Inference and Neural Network Optimization) is an open-source toolkit developed by Intel to accelerate AI inference on a variety of hardware, including CPUs, GPUs, and specialized accelerators. It optimizes deep learning models for fast, efficient inference, making it a popular choice for edge and cloud AI applications."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "using-openvino-in-podman-ai-lab",
      children: "Using OpenVINO in Podman AI Lab"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman AI Lab now supports OpenVINO as an inference provider. This means you can:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Select an OpenVINO compatible model when starting an inference server or playground."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Benefit from hardware-accelerated inference on supported Intel devices."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Easily switch between different inference providers (e.g., llama-cpp, OpenVINO) for benchmarking and compatibility testing."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.admonition, {
      type: "warning",
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
        children: "This feature is only available on Intel based systems, as OpenVINO is optimized for Intel hardware. If you are using a non-Intel system, you will not be able to use OpenVINO as an inference provider."
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "How to use:"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Launch Podman AI Lab and navigate to the model deployment or playground section."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "When configuring your model, choose an OpenVINO compatible model."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Start the inference server or playground."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "starting-an-openvino-inference-server",
      children: "Starting an OpenVINO inference server"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click the Podman AI Lab icon in the navigation bar."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["In the Podman AI Lab navigation bar, click ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Models > Services"
        }), " menu item."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Click the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "New Model Service"
        }), " button on the top right."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Select an OpenVINO compatible model in the list (e.g. OpenVINO/mistral-7B-instruct-v0.2-int4-ov) in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Model"
        }), " list and click the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Create Service"
        }), " button."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["The inference server for the model is being started and after a while, click on the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Open service"
        }), " details button."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "OpenVINO inference server details",
        src: (__webpack_require__(75190)/* ["default"] */ .A) + "",
        width: "1920",
        height: "1140"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Using the terminal shell, execute the given curl command and see the inference result output."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "starting-a-playground-with-an-openvino-compatible-model",
      children: "Starting a playground with an OpenVINO compatible model"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click the Podman AI Lab icon in the navigation bar."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["In the Podman AI Lab navigation bar, click ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Models > Playgrounds"
        }), " menu item."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Click the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "New Playground"
        }), " button on the top right."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Select an OpenVINO compatible model in the list (e.g. OpenVINO/mistral-7B-instruct-v0.2-int4-ov) in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Model"
        }), " list and click the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Create playground"
        }), " button."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "The playground for the model is being started and after a while, a chat interface is displayed."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Initial playground on OpenVINO model",
        src: (__webpack_require__(87302)/* ["default"] */ .A) + "",
        width: "1920",
        height: "1140"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Enter 'What is OpenVINO?' in the prompt and click the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
        children: "Send"
      }), " button. The OpenVINO model will respond with an answer."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "OpenVINO model response in the playground",
        src: (__webpack_require__(28541)/* ["default"] */ .A) + "",
        width: "1920",
        height: "1140"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "consistency-with-openshift-ai--openvino",
      children: "Consistency with OpenShift AI + OpenVINO"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "One of the key advantages of using OpenVINO in Podman AI Lab is the consistency it brings when transitioning workloads to OpenShift AI. Both platforms now support OpenVINO, ensuring that:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Models tested and optimized locally in Podman AI Lab will behave the same way when deployed to OpenShift AI."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "You can maintain a unified workflow from development to production, reducing surprises and integration issues."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Performance optimizations and hardware acceleration are preserved across environments."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "By enabling OpenVINO as an inference provider, Podman AI Lab empowers users to leverage high-performance AI inference both locally and in the cloud, with a consistent experience across platforms like OpenShift AI. This integration streamlines the AI development lifecycle and unlocks new possibilities for deploying efficient, scalable AI solutions."
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return MDXLayout ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout, {
    ...props,
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}



/***/ },

/***/ 87302
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/openvino-playground1-5ffbd4d25a18e6f35d5cb2e2d4f8cd7c.png");

/***/ }

}]);