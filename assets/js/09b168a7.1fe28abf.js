"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[33331],{

/***/ 26307:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_minikube_index_md_09b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-minikube-index-md-09b.json
const site_docs_minikube_index_md_09b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"minikube/index","title":"Minikube","description":"Minikube is one way to get Kubernetes running on your workstation.","source":"@site/docs/minikube/index.md","sourceDirName":"minikube","slug":"/minikube/","permalink":"/docs/minikube/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/minikube/index.md","tags":[{"inline":true,"label":"migrating-to-kubernetes","permalink":"/docs/tags/migrating-to-kubernetes"},{"inline":true,"label":"minikube","permalink":"/docs/tags/minikube"}],"version":"current","sidebarPosition":80,"frontMatter":{"sidebar_position":80,"title":"Minikube","description":"Minikube is one way to get Kubernetes running on your workstation.","keywords":["podman desktop","podman","containers","migrating","kubernetes","minikube"],"tags":["migrating-to-kubernetes","minikube"]},"sidebar":"mySidebar","previous":{"title":"Pushing an image","permalink":"/docs/kind/pushing-an-image-to-kind"},"next":{"title":"Installing the Minikube extension","permalink":"/docs/minikube/installing-extension"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/minikube/index.md


const frontMatter = {
	sidebar_position: 80,
	title: 'Minikube',
	description: 'Minikube is one way to get Kubernetes running on your workstation.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'migrating',
		'kubernetes',
		'minikube'
	],
	tags: [
		'migrating-to-kubernetes',
		'minikube'
	]
};
const contentTitle = 'Running Kubernetes on your workstation with Minikube and Podman';

const assets = {

};



const toc = [{
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "Next steps",
  "id": "next-steps",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h4: "h4",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "running-kubernetes-on-your-workstation-with-minikube-and-podman",
        children: "Running Kubernetes on your workstation with Minikube and Podman"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop can help you run ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://minikube.sigs.k8s.io/",
        children: "Minikube-powered"
      }), " local Kubernetes clusters on a container engine, such as Podman."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsxs)(_components.a, {
          href: "/docs/minikube/installing",
          children: ["Install the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "minikube"
          }), " CLI"]
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/configuring-podman-for-minikube-on-windows",
          children: "On Windows, configure Podman in rootful mode"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/creating-a-minikube-cluster",
          children: "Create a Minikube cluster"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/working-with-your-local-minikube-cluster",
          children: "Set your Kubernetes context to your Minikube cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/building-an-image-and-testing-it-in-minikube",
          children: "Build an image and test it in Minikube"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/pushing-an-image-to-minikube",
          children: "Push an image to Minikube"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/restarting-your-minikube-cluster",
          children: "Restart your Minikube cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/minikube/deleting-your-minikube-cluster",
          children: "Delete your Minikube cluster"
        }), "."]
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