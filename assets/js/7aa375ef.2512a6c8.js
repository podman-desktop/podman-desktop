"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[98138],{

/***/ 29009:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_troubleshooting_troubleshooting_extension_issues_md_7aa_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-troubleshooting-troubleshooting-extension-issues-md-7aa.json
const site_docs_troubleshooting_troubleshooting_extension_issues_md_7aa_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"troubleshooting/troubleshooting-extension-issues","title":"Extensions","description":"Troubleshoot extension-related issues","source":"@site/docs/troubleshooting/troubleshooting-extension-issues.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/troubleshooting-extension-issues","permalink":"/docs/troubleshooting/troubleshooting-extension-issues","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/troubleshooting/troubleshooting-extension-issues.md","tags":[{"inline":true,"label":"troubleshooting-extension-issues","permalink":"/docs/tags/troubleshooting-extension-issues"}],"version":"current","sidebarPosition":102,"frontMatter":{"sidebar_position":102,"title":"Extensions","description":"Troubleshoot extension-related issues","keywords":["podman desktop","podman","extensions","troubleshoot"],"tags":["troubleshooting-extension-issues"]},"sidebar":"mySidebar","previous":{"title":"Podman on OpenShift","permalink":"/docs/troubleshooting/troubleshooting-openshift-local"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/troubleshooting/troubleshooting-extension-issues.md


const frontMatter = {
	sidebar_position: 102,
	title: 'Extensions',
	description: 'Troubleshoot extension-related issues',
	keywords: [
		'podman desktop',
		'podman',
		'extensions',
		'troubleshoot'
	],
	tags: [
		'troubleshooting-extension-issues'
	]
};
const contentTitle = 'Troubleshooting extension-related issues';

const assets = {

};



const toc = [{
  "value": "Podman Desktop failed to create a Minikube cluster",
  "id": "podman-desktop-failed-to-create-a-minikube-cluster",
  "level": 2
}, {
  "value": "Issue",
  "id": "issue",
  "level": 4
}, {
  "value": "Solution",
  "id": "solution",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h4: "h4",
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
        id: "troubleshooting-extension-related-issues",
        children: "Troubleshooting extension-related issues"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "podman-desktop-failed-to-create-a-minikube-cluster",
      children: "Podman Desktop failed to create a Minikube cluster"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "issue",
      children: "Issue"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You might get this error message ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Failed to create minikube cluster. E0125 05:58:08.614734 408 cache.go:189] Error downloading kic artifacts: not yet implemented"
      }), " when creating a new Minikube cluster. You get the error due to instability of the Minikube tool itself."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following command to delete the Minikube cluster."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ minikube delete\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Create a new ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/minikube/installing-extension",
            children: "Minikube cluster"
          }), " using the Podman Desktop UI."]
        }), "\n"]
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