"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[99795],{

/***/ 8739:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_api_index_md_5fb_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-api-index-md-5fb.json
const site_docs_extensions_api_index_md_5fb_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/api/index","title":"API Reference","description":"API Reference","source":"@site/docs/extensions/api/index.md","sourceDirName":"extensions/api","slug":"/extensions/api/","permalink":"/docs/extensions/api/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/api/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"api","permalink":"/docs/tags/api"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"API Reference","description":"API Reference","tags":["podman-desktop","extension","api"],"keywords":["podman desktop","extension","api"]},"sidebar":"mySidebar","previous":{"title":"Menus","permalink":"/docs/extensions/developing/menu"},"next":{"title":"Debugging","permalink":"/docs/extensions/debugging-an-extension"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/api/index.md


const frontMatter = {
	sidebar_position: 3,
	title: 'API Reference',
	description: 'API Reference',
	tags: [
		'podman-desktop',
		'extension',
		'api'
	],
	keywords: [
		'podman desktop',
		'extension',
		'api'
	]
};
const contentTitle = undefined;

const assets = {

};



const toc = [];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    li: "li",
    p: "p",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsxs)(_components.p, {
      children: ["The extension API reference is located ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/api",
        children: "here"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Based on your use cases, you can add these common capabilities to your extension:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Create a new CLI tool instance and register it with Podman Desktop, see the details ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/api/@podman-desktop/namespaces/cli/functions/createCliTool",
          children: "here"
        }), ". You can add the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "createCliTool()"
        }), " function with relevant parameters in your ", (0,jsx_runtime.jsx)(_components.code, {
          children: "src/extension.ts"
        }), " file.", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Register the state of a CLI tool, see the ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/api/type-aliases/CliToolState",
              children: "resource"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add operations related to a container engine, see the usage of the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/api/@podman-desktop/namespaces/containerEngine",
          children: "containerEngine"
        }), " API."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add a new Kubernetes provider connection, use the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/api/interfaces/KubernetesProviderConnection",
          children: (0,jsx_runtime.jsx)(_components.code, {
            children: "KubernetesProviderConnection"
          })
        }), " interface."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Enable navigation to a CLI tool page, use the function ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/api/@podman-desktop/namespaces/navigation/functions/navigateToCliTools",
          children: (0,jsx_runtime.jsx)(_components.code, {
            children: "navigateToCliTools()"
          })
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Enable navigation to a specific page in the UI, refer to the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/api/@podman-desktop/namespaces/navigation",
          children: "navigation APIs"
        }), " category."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Create and show a new webview panel in the UI, use the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/api/@podman-desktop/namespaces/window/functions/createWebviewPanel",
          children: (0,jsx_runtime.jsx)(_components.code, {
            children: "createWebviewPanel()"
          })
        }), " function."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add options for running a command, use the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/api/interfaces/RunOptions",
          children: (0,jsx_runtime.jsx)(_components.code, {
            children: "RunOptions"
          })
        }), " interface."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can also create your own custom extensions and add them to the catalog for others to use. For more details, see ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing",
        children: "Developing an extension"
      }), " and ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/publish",
        children: "Packaging and publishing an extension"
      }), "."]
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