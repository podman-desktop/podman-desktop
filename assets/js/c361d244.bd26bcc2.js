"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[93520],{

/***/ 46453:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_ai_lab_start_recipe_md_c36_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-ai-lab-start-recipe-md-c36.json
const site_docs_ai_lab_start_recipe_md_c36_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"ai-lab/start-recipe","title":"Starting a recipe","description":"Created a recipe also known as an inference server for interaction with a model.","source":"@site/docs/ai-lab/start-recipe.md","sourceDirName":"ai-lab","slug":"/ai-lab/start-recipe","permalink":"/docs/ai-lab/start-recipe","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/ai-lab/start-recipe.md","tags":[{"inline":true,"label":"ai","permalink":"/docs/tags/ai"},{"inline":true,"label":"llm","permalink":"/docs/tags/llm"},{"inline":true,"label":"generative ai","permalink":"/docs/tags/generative-ai"}],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6,"title":"Starting a recipe","description":"Created a recipe also known as an inference server for interaction with a model.","keywords":["podman desktop","podman","ai","llm","generative ai"],"tags":["ai","llm","generative ai"]},"sidebar":"mySidebar","previous":{"title":"Creating a playground","permalink":"/docs/ai-lab/create-playground"},"next":{"title":"Kind","permalink":"/docs/kind/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/ai-lab/start-recipe.md


const frontMatter = {
	sidebar_position: 6,
	title: 'Starting a recipe',
	description: 'Created a recipe also known as an inference server for interaction with a model.',
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
const contentTitle = 'Starting a recipe (inference server) for a model';

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
        id: "starting-a-recipe-inference-server-for-a-model",
        children: "Starting a recipe (inference server) for a model"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Once an AI model is available through a well known endpoint, it's easy to imagine a new world of applications that will connect and use the AI model. Podman AI Lab support AI applications as a set of containers that are connected together."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman AI Lab includes a Recipes Catalog that helps you navigate several core AI use cases and problem domains, such as chatbots, code generators, and text summarizers. Each recipe includes detailed explanations and sample applications that can be run with various large language models (LLMs). Experimenting with multiple models allows you to find the optimal one for your use case."
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
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the Podman AI Lab icon in the left navigation pane."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the Podman AI Lab navigation bar, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Recipe Catalog"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Optional: Filter the recipe catalog based on the required tool, framework, or programming language."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "More details"
        }), " link for the recipe that you want to start. The recipe summary page opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "More details link",
          src: (__webpack_require__(95148)/* ["default"] */ .A) + "",
          width: "2248",
          height: "1178"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Start"
        }), ". The Start recipe page opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "start a recipe",
          src: (__webpack_require__(73422)/* ["default"] */ .A) + "",
          width: "1724",
          height: "650"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select a model from the dropdown list."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Start ChatBot recipe"
        }), ". This step might take some time to pull the recipe, copy the model to your Podman machine, start the inference server, load configurations, and create the application."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Open details"
        }), " after the processing completes.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "open AI application details",
          src: (__webpack_require__(9627)/* ["default"] */ .A) + "",
          width: "1698",
          height: "1204"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "View the created AI application."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Open AI App"
        }), " icon to view the running application in your browser.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "Open AI App icon",
          src: (__webpack_require__(97178)/* ["default"] */ .A) + "",
          width: "1692",
          height: "354"
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

/***/ 95148:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/more-details-link-87e213378a5d5bd15ac31eabe446f883.png");

/***/ }),

/***/ 97178:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/opening-ai-app-a32ba2396b03ea2012d333bca9417494.png");

/***/ }),

/***/ 9627:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/opening-application-details-442ebc3cd1ddfa0c905f71d3780744d0.png");

/***/ }),

/***/ 73422:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-recipe-56960ceaed7f915626207923de65b4a9.png");

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