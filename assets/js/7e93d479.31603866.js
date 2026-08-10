"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[29099],{

/***/ 27917
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_commands_md_7e9_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-commands-md-7e9.json
const site_docs_extensions_developing_commands_md_7e9_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/commands","title":"Commands","description":"Podman Desktop command reference","source":"@site/docs/extensions/developing/commands.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/commands","permalink":"/docs/extensions/developing/commands","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/commands.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","frontMatter":{"title":"Commands","description":"Podman Desktop command reference","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension"]},"sidebar":"mySidebar","previous":{"title":"Command palette","permalink":"/docs/extensions/developing/command-palette"},"next":{"title":"Configuration","permalink":"/docs/extensions/developing/config"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/commands.md


const frontMatter = {
	title: 'Commands',
	description: 'Podman Desktop command reference',
	tags: [
		'podman-desktop',
		'extension'
	],
	keywords: [
		'podman desktop',
		'extension'
	]
};
const contentTitle = 'Commands';

const assets = {

};



const toc = [{
  "value": "Configuration details",
  "id": "configuration-details",
  "level": 2
}, {
  "value": "<code>package.json</code> Example",
  "id": "packagejson-example",
  "level": 3
}, {
  "value": "JSON Schema",
  "id": "json-schema",
  "level": 3
}, {
  "value": "Additional Resources",
  "id": "additional-resources",
  "level": 3
}, {
  "value": "Verification",
  "id": "verification",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "commands",
        children: "Commands"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "configuration-details",
      children: "Configuration details"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This section describes new commands added to the extension, which enable enhanced interaction and automation within the development environment. These commands can be used programmatically through the API."
    }), "\n", (0,jsx_runtime.jsxs)(_components.h3, {
      id: "packagejson-example",
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " Example"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This example shows how new commands are added to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), ", enabling them for use within the extension. Each command is defined with a unique identifier and a descriptive title that appears in the command palette."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"commands\": [\n      {\n        \"command\": \"extension.exampleCommand\",\n        \"title\": \"Extension: Example Command\"\n      },\n      {\n        \"command\": \"extension.anotherCommand\",\n        \"title\": \"Extension: Another Command\"\n      }\n    ]\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "And within the TypeScript code, you can use the commands like so:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const exampleCommand = extensionApi.commands.registerCommand('extension.exampleCommand', async () => {\n  // Implementation logic here\n  console.log('Executing Example Command');\n});\n\nconst anotherCommand = extensionApi.commands.registerCommand('extension.anotherCommand', () => {\n  // Synchronous logic can be used if async processing is not required\n  console.log('Another Command Executed');\n});\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "json-schema",
      children: "JSON Schema"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"commands\": [\n      {\n        \"command\": \"string\",\n        \"title\": \"string\",\n        \"category\": \"string (optional cateogry for prefix title)\",\n        \"enablement\": \"myProperty === myValue\"\n      }\n    ]\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "additional-resources",
      children: "Additional Resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When you add the command, it will be listed on the command palette. See the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/command-palette",
        children: "command palette"
      }), " for more information."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify that your commands are working as expected:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Install the extension in your development environment."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add a command to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "package.json"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Execute the commands and check for the expected outputs / logging."
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


/***/ }

}]);