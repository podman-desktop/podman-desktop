"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[72456],{

/***/ 18784:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_compose_troubleshooting_md_f26_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-compose-troubleshooting-md-f26.json
const site_docs_compose_troubleshooting_md_f26_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"compose/troubleshooting","title":"Troubleshooting Compose","description":"Troubleshooting compose issues","source":"@site/docs/compose/troubleshooting.md","sourceDirName":"compose","slug":"/compose/troubleshooting","permalink":"/docs/compose/troubleshooting","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/compose/troubleshooting.md","tags":[{"inline":true,"label":"compose","permalink":"/docs/tags/compose"}],"version":"current","sidebarPosition":3,"frontMatter":{"title":"Troubleshooting Compose","description":"Troubleshooting compose issues","sidebar_position":3,"keywords":["compose"],"tags":["compose"]},"sidebar":"mySidebar","previous":{"title":"Running Compose files","permalink":"/docs/compose/running-compose"},"next":{"title":"Kubernetes","permalink":"/docs/kubernetes/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/compose/troubleshooting.md


const frontMatter = {
	title: 'Troubleshooting Compose',
	description: 'Troubleshooting compose issues',
	sidebar_position: 3,
	keywords: [
		'compose'
	],
	tags: [
		'compose'
	]
};
const contentTitle = 'Troubleshooting Compose';

const assets = {

};



const toc = [{
  "value": "Registry authentication issues",
  "id": "registry-authentication-issues",
  "level": 2
}, {
  "value": "Issues encountered",
  "id": "issues-encountered",
  "level": 3
}, {
  "value": "Solution",
  "id": "solution",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h2: "h2",
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
        id: "troubleshooting-compose",
        children: "Troubleshooting Compose"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "registry-authentication-issues",
      children: "Registry authentication issues"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The Compose binary will prioritize the configuration file ", (0,jsx_runtime.jsx)(_components.code, {
        children: "~/.docker/config"
      }), " over Podman credentials."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "issues-encountered",
      children: "Issues encountered"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "docker-credential-desktop"
      }), " missing:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-console",
        children: "docker.credentials.errors.InitializationError: docker-credential-desktop not installed or not available in PATH\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Authentication access:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-console",
        children: "Error response from daemon: {\"message\":\"denied: requested access to the resource is denied\"}\nError: executing /usr/local/bin/docker-compose up: exit status 18\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "solution",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Delete the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "~/.docker/config"
      }), " to clear any errors."]
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