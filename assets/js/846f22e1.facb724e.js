"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[1381],{

/***/ 3459
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/button-component-47215d5030f968dcd4d52b13394c9366.png");

/***/ },

/***/ 21946
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_adding_ui_components_md_846_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-adding-ui-components-md-846.json
const site_docs_extensions_developing_adding_ui_components_md_846_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/adding-ui-components","title":"Adding UI components","description":"Adding different components in UI","source":"@site/docs/extensions/developing/adding-ui-components.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/adding-ui-components","permalink":"/docs/extensions/developing/adding-ui-components","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/adding-ui-components.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"writing","permalink":"/docs/tags/writing"},{"inline":true,"label":"web-components","permalink":"/docs/tags/web-components"}],"version":"current","sidebarPosition":5,"frontMatter":{"sidebar_position":5,"title":"Adding UI components","description":"Adding different components in UI","tags":["podman-desktop","extension","writing","web-components"],"keywords":["podman desktop","extension","writing","web-components"]},"sidebar":"mySidebar","previous":{"title":"Adding icons","permalink":"/docs/extensions/developing/adding-icons"},"next":{"title":"Command palette","permalink":"/docs/extensions/developing/command-palette"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/adding-ui-components.md


const frontMatter = {
	sidebar_position: 5,
	title: 'Adding UI components',
	description: 'Adding different components in UI',
	tags: [
		'podman-desktop',
		'extension',
		'writing',
		'web-components'
	],
	keywords: [
		'podman desktop',
		'extension',
		'writing',
		'web-components'
	]
};
const contentTitle = 'Adding UI components';

const assets = {

};



const toc = [{
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
    admonition: "admonition",
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
        id: "adding-ui-components",
        children: "Adding UI components"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can create your own customized extension and add different UI components to your application front-end page. For example, you can add a new UI component of the type ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Button"
      }), " . If you have your own template, you can use the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://podman-desktop.io/storybook?id=button--docs",
        children: "ready-to-use code"
      }), " to add primary, secondary, loading, or other types of buttons."]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["If you do not have hands-on experience and want to explore, use the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/templates",
          children: "minimal, webview, or full template"
        }), " to create a Podman Desktop extension."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "@podman-desktop/ui-svelte"
        }), " package to your application source code."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Open the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/storybook",
          children: "storybook link"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Docs"
        }), " and copy the code for a particular UI component.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "UI component",
          src: (__webpack_require__(3459)/* ["default"] */ .A) + "",
          width: "1023",
          height: "343"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Paste it in your UI source configuration file, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "UIextension.svelte"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Save the configuration changes."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Run your extension and debug it if required."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check that the UI component is added in the webview of your extension."
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