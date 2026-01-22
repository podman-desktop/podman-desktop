"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[3332],{

/***/ 27399
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_debugging_an_extension_md_f7d_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-debugging-an-extension-md-f7d.json
const site_docs_extensions_debugging_an_extension_md_f7d_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/debugging-an-extension","title":"Debugging","description":"Debugging a local extension","source":"@site/docs/extensions/debugging-an-extension.md","sourceDirName":"extensions","slug":"/extensions/debugging-an-extension","permalink":"/docs/extensions/debugging-an-extension","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/debugging-an-extension.md","tags":[{"inline":true,"label":"debugging-an-extension","permalink":"/docs/tags/debugging-an-extension"},{"inline":true,"label":"testing-an-extension","permalink":"/docs/tags/testing-an-extension"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"Debugging","description":"Debugging a local extension","keywords":["podman desktop","podman","debugging an extension","extension"],"tags":["debugging-an-extension","testing-an-extension"]},"sidebar":"mySidebar","previous":{"title":"API Reference","permalink":"/docs/extensions/api/"},"next":{"title":"Publishing","permalink":"/docs/extensions/publish/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/debugging-an-extension.md


const frontMatter = {
	sidebar_position: 3,
	title: 'Debugging',
	description: 'Debugging a local extension',
	keywords: [
		'podman desktop',
		'podman',
		'debugging an extension',
		'extension'
	],
	tags: [
		'debugging-an-extension',
		'testing-an-extension'
	]
};
const contentTitle = 'Debugging a local extension';

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
        id: "debugging-a-local-extension",
        children: "Debugging a local extension"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "After developing an extension, you can start and debug the extension from the UI. This reduces the time spent identifying and fixing issues within the extension's code before it is deployed. When you add a local folder that contains your extension to the UI, Podman Desktop watches the folder, loads the extension, and keeps track of it. You can also stop or untrack the extension."
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
        children: ["You have ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing",
          children: "developed an extension"
        }), " locally."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Preferences > Extensions"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the toggle button to enable the development mode."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Extensions"
        }), " and select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Local Extensions"
        }), " tab."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Add a local folder extension..."
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select the folder that contains your extension."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Check the extension is in the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "started"
        }), " state on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "debugging an extension",
          src: (__webpack_require__(73377)/* ["default"] */ .A) + "",
          width: "2132",
          height: "712"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Extensions"
        }), ", search for the local extension, and confirm that it is ", (0,jsx_runtime.jsx)(_components.code, {
          children: "ACTIVE"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check your extension's functionality in the UI."
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

/***/ 73377
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/debugging-an-extension-a9eb5aa76606ba2f3a026b7b58f30522.png");

/***/ }

}]);