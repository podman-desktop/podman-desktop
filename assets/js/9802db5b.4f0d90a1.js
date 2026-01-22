"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[70957],{

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

/***/ 61296
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_api_podman_desktop_namespaces_extensions_index_md_980_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/api/site-api-podman-desktop-namespaces-extensions-index-md-980.json
const site_api_podman_desktop_namespaces_extensions_index_md_980_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"@podman-desktop/namespaces/extensions/index","title":"extensions","description":"Namespace for dealing with installed extensions. Extensions are represented","source":"@site/api/@podman-desktop/namespaces/extensions/index.md","sourceDirName":"@podman-desktop/namespaces/extensions","slug":"/@podman-desktop/namespaces/extensions/","permalink":"/api/@podman-desktop/namespaces/extensions/","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"typedocSidebar","previous":{"title":"openExternal","permalink":"/api/@podman-desktop/namespaces/env/functions/openExternal"},"next":{"title":"all","permalink":"/api/@podman-desktop/namespaces/extensions/variables/all"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./api/@podman-desktop/namespaces/extensions/index.md


const frontMatter = {};
const contentTitle = 'extensions';

const assets = {

};



const toc = [{
  "value": "Variables",
  "id": "variables",
  "level": 2
}, {
  "value": "Functions",
  "id": "functions",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    header: "header",
    li: "li",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "extensions",
        children: "extensions"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Namespace for dealing with installed extensions. Extensions are represented\nby an ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/api/interfaces/Extension",
        children: "Extension"
      }), "-interface which enables reflection on them."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Extension writers can provide APIs to other extensions by returning their API public\nsurface from the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "activate"
      }), "-call."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When depending on the API of another extension add an ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionDependencies"
      }), "-entry\nto ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), ", and use the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/api/@podman-desktop/namespaces/extensions/functions/getExtension",
        children: "getExtension"
      }), "-function\nand the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/api/interfaces/Extension#exports",
        children: "exports"
      }), "-property, like below:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const podmanExtension = extensions.getExtension('podman-desktop.podman');\nconst podmanExtensionAPI = podmanExtension.exports;\n\npodmanExtensionAPI....\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "variables",
      children: "Variables"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/api/@podman-desktop/namespaces/extensions/variables/all",
          children: "all"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/api/@podman-desktop/namespaces/extensions/variables/onDidChange",
          children: "onDidChange"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "functions",
      children: "Functions"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/api/@podman-desktop/namespaces/extensions/functions/getExtension",
          children: "getExtension"
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