"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[58699],{

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

/***/ 43129
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_menu_md_ed1_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-menu-md-ed1.json
const site_docs_extensions_developing_menu_md_ed1_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/menu","title":"Menus","description":"Podman Desktop menu reference","source":"@site/docs/extensions/developing/menu.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/menu","permalink":"/docs/extensions/developing/menu","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/menu.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","frontMatter":{"title":"Menus","description":"Podman Desktop menu reference","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension","menu"]},"sidebar":"mySidebar","previous":{"title":"Configuration","permalink":"/docs/extensions/developing/config"},"next":{"title":"API Reference","permalink":"/docs/extensions/api/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/menu.md


const frontMatter = {
	title: 'Menus',
	description: 'Podman Desktop menu reference',
	tags: [
		'podman-desktop',
		'extension'
	],
	keywords: [
		'podman desktop',
		'extension',
		'menu'
	]
};
const contentTitle = 'Menus';

const assets = {

};



const toc = [{
  "value": "Menu Details",
  "id": "menu-details",
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
  "value": "MenuContext available",
  "id": "menucontext-available",
  "level": 4
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
    h4: "h4",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "menus",
        children: "Menus"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "menu-details",
      children: "Menu Details"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This section describes how menus are integrated into the extension. These menus are configured to appear in specific parts of the user interface and are tied to commands defined in the extension."
    }), "\n", (0,jsx_runtime.jsxs)(_components.h3, {
      id: "packagejson-example",
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " Example"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This example shows how to integrate a menu into the Podman Desktop extension through the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " file. Here, a menu item is added under the \"dashboard/image\" context. Meaning that the command will appear next to the image when ", (0,jsx_runtime.jsx)(_components.code, {
        children: "selectImageId"
      }), " is not in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "imagePushInProgressToKind"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"menus\": {\n      \"dashboard/image\": [\n        {\n          \"command\": \"kind.image.move\",\n          \"title\": \"Push image to Kind cluster\",\n          \"when\": \"selectedImageId not in imagesPushInProgressToKind\"\n        }\n      ]\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "json-schema",
      children: "JSON Schema"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"menus\": {\n      \"<MenuContext>\": [\n        {\n          \"command\": \"string\",\n          \"title\": \"string\",\n          \"when\": \"string\",\n          \"disabled\": \"boolean\"\n        }\n      ]\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "menucontext-available",
      children: "MenuContext available"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "'dashboard/image': Item menu on image actions"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "'dashboard/container': Item menu on container actions"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "'dashboard/pod': Item menu on pod actions"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "'dashboard/compose': Item menu on compose actions"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify that your menus are functioning correctly:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Navigate to the dashboard within Podman Desktop."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Right-click on an image to see the context menu."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select \"Push image to Kind cluster\" and verify that the action completes successfully, ensuring no errors occur during the operation."
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