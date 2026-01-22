"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[77631],{

/***/ 3844
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/defining-a-system-prompt-8671ce78a8b33a2a3a8eb03a750a2c7a.png");

/***/ },

/***/ 4866
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/ai-lab-sections-53a2ded771c22be04918ceb6951e514f.png");

/***/ },

/***/ 9828
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-new-model-service-ea8c2365c8c0bd53be04353d4bbbadbe.png");

/***/ },

/***/ 14232
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/model-downloaded-03a51521057096a8dad9065976d0a3c5.png");

/***/ },

/***/ 19472
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/more-details-of-recipe-87e213378a5d5bd15ac31eabe446f883.png");

/***/ },

/***/ 22038
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/interacted-with-chatbot-application-e44958a60f1560c05f4b993289e36c58.png");

/***/ },

/***/ 25053
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/open-ai-application-bc696ad523aa59a78734fee241d23b64.png");

/***/ },

/***/ 35899
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-a-service-fe22540049e76cdd058004bc3abaa195.png");

/***/ },

/***/ 39635
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-a-playground-377253262a226e3eec4440bcc405f77c.png");

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

/***/ 44764
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/open-service-details-74e703c418efbc20f7ec65e9a14acb8e.png");

/***/ },

/***/ 47823
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/service-details-page-5bf76b576980f49e6c8cfa45583e2735.png");

/***/ },

/***/ 49868
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/active-ai-lab-ext-with-ai-lab-icon-7879e595432375422e69a33c16ead14c.png");

/***/ },

/***/ 50629
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/update-machine-config-169e3fa45ac02ad207b99caaf0124408.png");

/***/ },

/***/ 56430
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/editing-model-parameters-4e74800edfc96ddc871e30d5043a820c.png");

/***/ },

/***/ 57946
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-recipe-56960ceaed7f915626207923de65b4a9.png");

/***/ },

/***/ 63180
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-chatbot-recipe-2563c94d79b9668908ce96141fbbe54d.png");

/***/ },

/***/ 63400
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_running_an_ai_application_md_107_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-running-an-ai-application-md-107.json
const site_tutorial_running_an_ai_application_md_107_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"running-an-ai-application","title":"Running an AI application","description":"Running an AI application using the UI.","source":"@site/tutorial/running-an-ai-application.md","sourceDirName":".","slug":"/running-an-ai-application","permalink":"/tutorial/running-an-ai-application","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"running-an-ai-application","permalink":"/tutorial/tags/running-an-ai-application"}],"version":"current","sidebarPosition":7,"frontMatter":{"sidebar_position":7,"title":"Running an AI application","description":"Running an AI application using the UI.","keywords":["podman desktop","podman","AI application"],"tags":["podman-desktop","running-an-ai-application"]},"sidebar":"defaultSidebar","previous":{"title":"Managing your application resources","permalink":"/tutorial/managing-your-application-resources"},"next":{"title":"Creating an extension","permalink":"/tutorial/creating-an-extension"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/running-an-ai-application.md


const frontMatter = {
	sidebar_position: 7,
	title: 'Running an AI application',
	description: 'Running an AI application using the UI.',
	keywords: [
		'podman desktop',
		'podman',
		'AI application'
	],
	tags: [
		'podman-desktop',
		'running-an-ai-application'
	]
};
const contentTitle = 'Running an AI application';

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
  "value": "Downloading a model",
  "id": "downloading-a-model",
  "level": 2
}, {
  "value": "Creating a service",
  "id": "creating-a-service",
  "level": 2
}, {
  "value": "Optional: Creating a playground",
  "id": "optional-creating-a-playground",
  "level": 2
}, {
  "value": "Running a recipe: ChatBot AI application",
  "id": "running-a-recipe-chatbot-ai-application",
  "level": 2
}, {
  "value": "Verifying the AI application",
  "id": "verifying-the-ai-application",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
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
        id: "running-an-ai-application",
        children: "Running an AI application"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial covers the following end-to-end tasks required to run and verify an Artificial Intelligence (AI) application on your local machine:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Installing the extension"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Downloading a model"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Creating a service"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Optional: Creating a playground"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Running a recipe"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Verifying the AI application"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Before going through this tutorial, familiarize yourself with the usage of the following sections on the AI Lab page:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "AI lab sections",
        src: (__webpack_require__(4866)/* ["default"] */ .A) + "",
        width: "202",
        height: "310"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Catalog"
        }), ": Helps in downloading or importing a model."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Services"
        }), ": Helps in creating an inference server that runs in a container to serve a large language model (LLM) using an OpenAI-compatible API. After creating a service, you can access its details and generate its client code in any programming languages to integrate your application."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Playgrounds"
        }), ": Helps in experimenting with model parameters and accuracy to identify the best model and parameters for your use case. Each playground denotes a customized environment to experiment with a model."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Recipes Catalog"
        }), ": Helps in accessing a catalog of recipes, such as ChatBot, audio-to-text, code generation, and summarizer. Each recipe denotes an AI application catering to a specific use case. You can use a recipe to start an AI application. You can also clone a recipe to your local machine for editing purposes."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Running"
        }), ": Helps in accessing all running AI applications."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial focuses on running a ChatBot AI application."
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
        }), " with at least 6 GB memory. If the Podman machine does not have enough memory, you get a notification to update its memory configuration while downloading a model or running a recipe:\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "notification to update podman machine configuration",
          src: (__webpack_require__(50629)/* ["default"] */ .A) + "",
          width: "1272",
          height: "409"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A developer role."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-the-extension",
      children: "Installing the extension"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Extensions > Catalog"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Find the Podman AI Lab extension using the search box."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Install"
        }), " icon to install the extension.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "install the extension",
          src: (__webpack_require__(80424)/* ["default"] */ .A) + "",
          width: "1962",
          height: "634"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Installed"
        }), " tab to check the extension is active, and check that a new AI Lab component is added in the left navigation pane.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "extension enabled",
          src: (__webpack_require__(49868)/* ["default"] */ .A) + "",
          width: "1768",
          height: "930"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "downloading-a-model",
      children: "Downloading a model"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "AI Lab"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Catalog section, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Download"
          }), " icon corresponding to the model you want to use.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "extension enabled",
            src: (__webpack_require__(76189)/* ["default"] */ .A) + "",
            width: "1536",
            height: "454"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the downloaded model on the same page after the download completes.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "extension enabled",
            src: (__webpack_require__(14232)/* ["default"] */ .A) + "",
            width: "1536",
            height: "454"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-service",
      children: "Creating a service"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "AI Lab"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Services section, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "New Model Service"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create a new model service",
            src: (__webpack_require__(9828)/* ["default"] */ .A) + "",
            width: "1086",
            height: "750"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select the model from the dropdown list."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Optional: Edit the port number of the container that is created for the service."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create service"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create a new model service",
            src: (__webpack_require__(35899)/* ["default"] */ .A) + "",
            width: "1536",
            height: "630"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Open service details"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create a new model service",
            src: (__webpack_require__(44764)/* ["default"] */ .A) + "",
            width: "1536",
            height: "1024"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the service details, such as model name, server address, and client code.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "service details page",
            src: (__webpack_require__(47823)/* ["default"] */ .A) + "",
            width: "1536",
            height: "1230"
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "By default, you view the client code in the cURL programming language. You can customize the client code based on your needs."
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Optional: In the Client code section, select the programming language or framework from the dropdown list to view the updated code."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Close"
          }), " icon on the right side of the page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the newly created service on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "new service on the page",
            src: (__webpack_require__(64853)/* ["default"] */ .A) + "",
            width: "1536",
            height: "266"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: View the service container by opening the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " page from the left navigation pane.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "new service container",
            src: (__webpack_require__(74662)/* ["default"] */ .A) + "",
            width: "1982",
            height: "506"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "optional-creating-a-playground",
      children: "Optional: Creating a playground"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Perform this task only if you want to experiment with the model before using it to start your AI application."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "AI Lab"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Playgrounds section, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "New Playground"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create a new playground",
            src: (__webpack_require__(68099)/* ["default"] */ .A) + "",
            width: "1086",
            height: "728"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Optional: Enter the name of the playground."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select an inference runtime for the playground."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select a model from the dropdown list."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create playground"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "create playground button",
            src: (__webpack_require__(39635)/* ["default"] */ .A) + "",
            width: "2076",
            height: "1114"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the newly created playground on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "newly created playground",
            src: (__webpack_require__(77881)/* ["default"] */ .A) + "",
            width: "1268",
            height: "276"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Click the name of the playground to edit the model settings for experiment:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Edit the value of the model parameters.\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "editing model parameters",
                src: (__webpack_require__(56430)/* ["default"] */ .A) + "",
                width: "1572",
                height: "792"
              })]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Edit system prompt"
              }), " icon to add a system prompt and save it.\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "edit system prompt icon",
                src: (__webpack_require__(83830)/* ["default"] */ .A) + "",
                width: "1304",
                height: "379"
              })]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Enter your question in the prompt box and analyze the accuracy of the answer.\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "defining a system prompt",
                src: (__webpack_require__(3844)/* ["default"] */ .A) + "",
                width: "1572",
                height: "1292"
              })]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "running-a-recipe-chatbot-ai-application",
      children: "Running a recipe: ChatBot AI application"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "AI Lab"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the Recipes Catalog section, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "More details"
          }), " in the ChatBot recipe tile. The recipe summary page opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "more details of a recipe",
            src: (__webpack_require__(19472)/* ["default"] */ .A) + "",
            width: "2248",
            height: "1178"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Start"
          }), ". The Start recipe page opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "starting a recipe",
            src: (__webpack_require__(57946)/* ["default"] */ .A) + "",
            width: "1724",
            height: "650"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select a model from the dropdown list."
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "The models listed with a star are recommended to use with the recipe."
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Start ChatBot recipe"
          }), ". This step might take some time to pull the recipe, copy the model to your Podman machine, start the inference server, load configurations, and create the application.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "starting a chatbot recipe",
            src: (__webpack_require__(63180)/* ["default"] */ .A) + "",
            width: "1268",
            height: "652"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Open details"
          }), " after the processing completes.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "open-recipe-details",
            src: (__webpack_require__(81957)/* ["default"] */ .A) + "",
            width: "1250",
            height: "1142"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the running AI application in the Running tab.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running tab",
            src: (__webpack_require__(92228)/* ["default"] */ .A) + "",
            width: "1290",
            height: "414"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: View the running AI application pod by opening the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Pods"
          }), " page from the left navigation pane.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "pod running AI app",
            src: (__webpack_require__(77303)/* ["default"] */ .A) + "",
            width: "1732",
            height: "424"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verifying-the-ai-application",
      children: "Verifying the AI application"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "AI Lab > Running"
          }), " using the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Open AI App"
          }), " icon to open the ChatBot application locally in a browser.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "opening the AI application",
            src: (__webpack_require__(25053)/* ["default"] */ .A) + "",
            width: "1542",
            height: "306"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Enter your question in the chat box and analyze the accuracy of the answer.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "interacted with chatbot application",
            src: (__webpack_require__(22038)/* ["default"] */ .A) + "",
            width: "1368",
            height: "936"
          })]
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

/***/ 64853
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/newly-created-service-226100da3e06b054b4355ff0c1ee9be1.png");

/***/ },

/***/ 68099
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/new-playground-f7f1112477f363057fb96e4f6a9b81b8.png");

/***/ },

/***/ 74662
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/running-service-in-a-container-59d98e3e8c667f91e4e54c97fea80616.png");

/***/ },

/***/ 76189
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/download-a-model-eccce875984828f2b606d97efd82310a.png");

/***/ },

/***/ 77303
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pod-running-ai-app-a9d36d4bd79935ea6ba153d5d80efebb.png");

/***/ },

/***/ 77881
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/newly-created-playground-4f6f926a0c0ab6e09417233df7902d25.png");

/***/ },

/***/ 80424
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/downloading-ai-lab-ext-299b7c850bce2fd8bbbc2ab6b3270e7a.png");

/***/ },

/***/ 81957
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/open-recipe-details-abc9e86a1324c6f164547f8ddba0c234.png");

/***/ },

/***/ 83830
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/edit-system-prompt-icon-4fd921890f57cb4f68f4d69e9e3d92d0.png");

/***/ },

/***/ 92228
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/running-tab-6b8c97c088956655bf3a2405df35844e.png");

/***/ }

}]);