"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[95576],{

/***/ 8364:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_config_md_aca_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-config-md-aca.json
const site_docs_extensions_developing_config_md_aca_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/config","title":"Configuration","description":"Podman Desktop configuration reference","source":"@site/docs/extensions/developing/config.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/config","permalink":"/docs/extensions/developing/config","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/config.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","frontMatter":{"title":"Configuration","description":"Podman Desktop configuration reference","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension"]},"sidebar":"mySidebar","previous":{"title":"Commands","permalink":"/docs/extensions/developing/commands"},"next":{"title":"Menus","permalink":"/docs/extensions/developing/menu"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/config.md


const frontMatter = {
	title: 'Configuration',
	description: 'Podman Desktop configuration reference',
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
  "value": "Verification",
  "id": "verification",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
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
      children: "This section details the configurable settings introduced by the extension to enhance or modify its behavior. The settings allow users to customize aspects of the extension's functionality. For example a modified path to a binary, or a performance setting."
    }), "\n", (0,jsx_runtime.jsxs)(_components.h3, {
      id: "packagejson-example",
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " Example"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This example illustrates how configuration settings are structured within ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " for the extension. It includes various settings related to the environment and hardware resources that the extension will manage or monitor."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"configuration\": {\n      \"title\": \"Podman\",\n      \"properties\": {\n        \"podman.binary.path\": {\n          \"type\": \"string\",\n          \"format\": \"file\",\n          \"default\": \"\",\n          \"description\": \"Custom path to Podman binary (Default is blank)\"\n        },\n        \"podman.machine.cpus\": {\n          \"type\": \"number\",\n          \"format\": \"cpu\",\n          \"minimum\": 1,\n          \"default\": \"HOST_HALF_CPU_CORES\",\n          \"maximum\": \"HOST_TOTAL_CPU\",\n          \"scope\": \"ContainerConnection\",\n          \"description\": \"CPU(s)\"\n        }\n      }\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "And within the TypeScript code, you can retrieve as well as use the configurations as so:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "// Get configuration for this connection\nconst containerConfiguration = extensionApi.configuration.getConfiguration('podman', containerProviderConnection);\n\n// Set a value\nawait containerConfiguration.update('machine.cpus', machineInfo.cpus);\n\n// Get a value\nawait containerConfiguration.get('machine.cpus');\n\n// Has a value\nawait containerConfiguration.has('machine.cpus');\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "json-schema",
      children: "JSON Schema"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Within the schema, you may add any type of value such as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "\"foo\":\"bar\""
      }), " which can be retrieved similar to the above TypeScript example."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"configuration\": {\n      \"title\": \"string\",\n      \"properties\": {\n        \"string\": {\n          \"type\": \"string\",\n          \"default\": \"integer if type is integer, string if type is string, etc.\",\n          \"format\": \"string\",\n          \"minimum\": \"string or int\",\n          \"maximum\": \"string or int\",\n          \"description\": \"string\",\n          \"scope\": \"string or array, ex. ['DEFAULT', 'ONBOARDING']\",\n          \"hidden\": \"boolean\",\n          \"placeholder\": \"string\",\n          \"markdownDescription\": \"string\",\n          \"readonly\": \"boolean\",\n          \"enum\": \"array\",\n          \"step\": \"number\",\n          \"when\": \"string\"\n        }\n      }\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify that your commands are working as expected:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Adjust the configuration settings within package.json"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart the extension or Podman Desktop"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Verify the change within the Settings page."
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