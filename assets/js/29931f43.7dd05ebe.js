"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[49606],{

/***/ 7404
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/minimal-78fb3ce74b41ecaede41202665bbebd1.png");

/***/ },

/***/ 12522
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/full-d77c9920d205cb859155d32dbc13463f.png");

/***/ },

/***/ 18793
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_templates_index_md_299_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-templates-index-md-299.json
const site_docs_extensions_templates_index_md_299_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/templates/index","title":"Templates","description":"Templates that you can use for Podman Desktop extension development","source":"@site/docs/extensions/templates/index.md","sourceDirName":"extensions/templates","slug":"/extensions/templates/","permalink":"/docs/extensions/templates/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/templates/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"publishing","permalink":"/docs/tags/publishing"}],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"title":"Templates","description":"Templates that you can use for Podman Desktop extension development","tags":["podman-desktop","extension","publishing"],"keywords":["podman desktop","extension","publishing"]},"sidebar":"mySidebar","previous":{"title":"Usage","permalink":"/docs/extensions/install/using-extension"},"next":{"title":"Developing","permalink":"/docs/extensions/developing/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/templates/index.md


const frontMatter = {
	sidebar_position: 1,
	title: 'Templates',
	description: 'Templates that you can use for Podman Desktop extension development',
	tags: [
		'podman-desktop',
		'extension',
		'publishing'
	],
	keywords: [
		'podman desktop',
		'extension',
		'publishing'
	]
};
const contentTitle = 'Templates for creating an extension';

const assets = {

};



const toc = [{
  "value": "Minimal template",
  "id": "minimal-template",
  "level": 3
}, {
  "value": "Webview template",
  "id": "webview-template",
  "level": 3
}, {
  "value": "Full template",
  "id": "full-template",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h3: "h3",
    header: "header",
    img: "img",
    p: "p",
    strong: "strong",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "templates-for-creating-an-extension",
        children: "Templates for creating an extension"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Below are a list of officially maintained templates to be used for Podman Desktop extension development."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "minimal-template",
      children: "Minimal template"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "minimal",
        src: (__webpack_require__(7404)/* ["default"] */ .A) + "",
        width: "1050",
        height: "700"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Link:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop-extension-minimal-template",
        children: "podman-desktop-extension-minimal-template"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This template provides a minimal template on how to build a Podman Desktop extension. More information can be found on our official extension documentation on how to further expand your extension."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With this template, on activating a \"Hello World!\" dialog will appear."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "webview-template",
      children: "Webview template"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "webview",
        src: (__webpack_require__(29252)/* ["default"] */ .A) + "",
        width: "1060",
        height: "710"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Link:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop-extension-webview-template",
        children: "podman-desktop-extension-webview-template"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This template provides a webview template on how to build a Podman Desktop extension showcasing a frontend."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["More information can be found on our ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://podman-desktop.io/docs/extensions",
        children: "official extension documentation"
      }), " on how to further expand your extension."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With this template, you will see a new button on the navbar that says \"Hello World!\" and provides a frontend.A"
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "full-template",
      children: "Full template"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "full",
        src: (__webpack_require__(12522)/* ["default"] */ .A) + "",
        width: "1050",
        height: "700"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Link:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop-extension-full-template",
        children: "podman-desktop-extension-full-template"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This template provides a \"full\" example of creating an extension with a webview that utilizes multiple packages. Within this template, we use three separate packages to distinguish between the frontend, backend, and shared code that connects the frontend and backend."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The \"full\" template is meant to showcase a full production example which includes multiple frontend and backend technologies such as TypeScript, Svelte and TailwindCSS."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "All backend-related code can be separated into its own package, which improves both security and code organization."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The template offers flexibility in creating a Podman Desktop extension that can use the underlying Podman Desktop API and pre-built UI components via @podman-desktop/ui-svelte."
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

/***/ 29252
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/webview-14cb53e0d61a7c729405e6633b1531a9.png");

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