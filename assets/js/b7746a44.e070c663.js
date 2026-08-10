"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[95904],{

/***/ 53774
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_adding_icons_md_b77_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-adding-icons-md-b77.json
const site_docs_extensions_developing_adding_icons_md_b77_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/adding-icons","title":"Adding icons","description":"Podman Desktop and resources icons","source":"@site/docs/extensions/developing/adding-icons.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/adding-icons","permalink":"/docs/extensions/developing/adding-icons","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/adding-icons.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"writing","permalink":"/docs/tags/writing"},{"inline":true,"label":"icons","permalink":"/docs/tags/icons"}],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Adding icons","description":"Podman Desktop and resources icons","tags":["podman-desktop","extension","writing","icons"],"keywords":["podman desktop","extension","writing","icons"]},"sidebar":"mySidebar","previous":{"title":"When clause contexts","permalink":"/docs/extensions/developing/when-clause-context"},"next":{"title":"Adding UI components","permalink":"/docs/extensions/developing/adding-ui-components"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/adding-icons.md


const frontMatter = {
	sidebar_position: 4,
	title: 'Adding icons',
	description: 'Podman Desktop and resources icons',
	tags: [
		'podman-desktop',
		'extension',
		'writing',
		'icons'
	],
	keywords: [
		'podman desktop',
		'extension',
		'writing',
		'icons'
	]
};
const contentTitle = 'Adding icons';

const assets = {

};



const toc = [{
  "value": "Creating a .woff2 file",
  "id": "creating-a-woff2-file",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    h1: "h1",
    h3: "h3",
    header: "header",
    p: "p",
    pre: "pre",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "adding-icons",
        children: "Adding icons"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop allows extensions to register custom icons that can be used for resources based on certain condition defined by a ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/when-clause-context",
        children: "when clause"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For example, the Kind extension register a custom icons by using the following instruction."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "\"icons\": {\n  \"kind-icon\": {\n    \"description\": \"Kind icon\",\n    \"default\": {\n      \"fontPath\": \"kind-icon.woff2\",\n      \"fontCharacter\": \"\\\\EA01\"\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["We restrict the format to the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://www.w3.org/TR/WOFF2/",
        children: "Web Open Font Format 2 (aka woff2)"
      }), " to use icons as text, to keep consistency across the UI, as the color and size is managed by Podman-Desktop."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "creating-a-woff2-file",
      children: "Creating a .woff2 file"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You probably have an existing ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".svg"
      }), " file that you want to use, to make it possible you can use the tool ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://nfroidure.github.io/svgiconfont/",
        children: "svgiconfont"
      }), " made by ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://twitter.com/nfroidure",
        children: "@nfroidure"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To ensure the produced ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".woff2"
      }), " file contains the expected characters you created from your svg file(s). You can use the tool ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://fontforge.org/",
        children: "fontforge.org"
      }), " to visualize it."]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "info",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["To find the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "fontCharacter"
        }), " where your icons has been saved, you can search inside the FontForge tool by the name of the svg file you used."]
      })
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