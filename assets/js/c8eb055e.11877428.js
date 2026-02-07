"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[92456],{

/***/ 23764
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_ai_lab_create_playground_md_c8e_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-ai-lab-create-playground-md-c8e.json
const site_docs_ai_lab_create_playground_md_c8e_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"ai-lab/create-playground","title":"Creating a playground","description":"Creating a playground environment for a model.","source":"@site/docs/ai-lab/create-playground.md","sourceDirName":"ai-lab","slug":"/ai-lab/create-playground","permalink":"/docs/ai-lab/create-playground","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/ai-lab/create-playground.md","tags":[{"inline":true,"label":"ai","permalink":"/docs/tags/ai"},{"inline":true,"label":"llm","permalink":"/docs/tags/llm"},{"inline":true,"label":"generative ai","permalink":"/docs/tags/generative-ai"}],"version":"current","sidebarPosition":5,"frontMatter":{"sidebar_position":5,"title":"Creating a playground","description":"Creating a playground environment for a model.","keywords":["podman desktop","podman","ai","llm","generative ai"],"tags":["ai","llm","generative ai"]},"sidebar":"mySidebar","previous":{"title":"Starting an inference server","permalink":"/docs/ai-lab/start-inference-server"},"next":{"title":"Starting a recipe","permalink":"/docs/ai-lab/start-recipe"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/ai-lab/create-playground.md


const frontMatter = {
	sidebar_position: 5,
	title: 'Creating a playground',
	description: 'Creating a playground environment for a model.',
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
const contentTitle = 'Creating a playground';

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
        id: "creating-a-playground",
        children: "Creating a playground"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The integrated playground environments allow for experimenting with available models in a local environment. An intuitive user prompt helps in exploring the capabilities and accuracy of various models and aids in finding the best model for the use case. The playground interface allows for parameterizing models to optimize the settings and attributes of each model."
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
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/ai-lab/start-inference-server",
          children: "An inference server created for a model"
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
          children: "Playgrounds"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "New Playground"
        }), " button at the top right corner of the page."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select an inference runtime for the playground."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the model for which you want to start an inference server from the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Model"
        }), " list."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create playground"
        }), " button.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "create a playground",
          src: (__webpack_require__(35038)/* ["default"] */ .A) + "",
          width: "2076",
          height: "1114"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the created playground on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "playground created",
          src: (__webpack_require__(29976)/* ["default"] */ .A) + "",
          width: "1724",
          height: "308"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the name of the playground to experiment with model settings. The Playground page opens."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Perform any of the following tasks:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Edit the value of the model parameters."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Add a system prompt by clicking the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Edit system prompt"
            }), " icon."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Enter your question in the prompt box and analyze the accuracy of the answer.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "experiment with model settings",
              src: (__webpack_require__(10936)/* ["default"] */ .A) + "",
              width: "2302",
              height: "1676"
            })]
          }), "\n"]
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



/***/ },

/***/ 35038
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/creating-playground-a31ddfbd5b019608d08530994713531f.png");

/***/ },

/***/ 10936
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/playground-settings-21f9ad5577cd77f36f5fa878d8eb61a9.png");

/***/ },

/***/ 29976
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/playground-f6ac2deb6cda30c6aab5cd7e7ebe15a3.png");

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


/***/ }

}]);