"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[21407],{

/***/ 67320:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_minikube_configuring_podman_for_minikube_on_windows_md_724_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-minikube-configuring-podman-for-minikube-on-windows-md-724.json
const site_docs_minikube_configuring_podman_for_minikube_on_windows_md_724_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"minikube/configuring-podman-for-minikube-on-windows","title":"Configuring Podman","description":"Configuring Podman for Minikube on Windows Subsystem for Linux (WSL).","source":"@site/docs/minikube/configuring-podman-for-minikube-on-windows.md","sourceDirName":"minikube","slug":"/minikube/configuring-podman-for-minikube-on-windows","permalink":"/docs/minikube/configuring-podman-for-minikube-on-windows","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/minikube/configuring-podman-for-minikube-on-windows.md","tags":[{"inline":true,"label":"configuring-podman-for-minikube","permalink":"/docs/tags/configuring-podman-for-minikube"},{"inline":true,"label":"minikube","permalink":"/docs/tags/minikube"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"Configuring Podman","description":"Configuring Podman for Minikube on Windows Subsystem for Linux (WSL).","keywords":["podman desktop","podman","containers","migrating","kubernetes","minikube"],"tags":["configuring-podman-for-minikube","minikube"]},"sidebar":"mySidebar","previous":{"title":"Installing the CLI","permalink":"/docs/minikube/installing"},"next":{"title":"Creating a cluster","permalink":"/docs/minikube/creating-a-minikube-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/minikube/configuring-podman-for-minikube-on-windows.md


const frontMatter = {
	sidebar_position: 3,
	title: 'Configuring Podman',
	description: 'Configuring Podman for Minikube on Windows Subsystem for Linux (WSL).',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'migrating',
		'kubernetes',
		'minikube'
	],
	tags: [
		'configuring-podman-for-minikube',
		'minikube'
	]
};
const contentTitle = 'Configuring Podman for Minikube on Windows Subsystem for Linux (WSL)';

const assets = {

};



const toc = [{
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h1: "h1",
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
        id: "configuring-podman-for-minikube-on-windows-subsystem-for-linux-wsl",
        children: "Configuring Podman for Minikube on Windows Subsystem for Linux (WSL)"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When you create a Podman machine, Podman creates the machine in rootless mode."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With a Podman machine running on WSL, Minikube:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Requires a rootful machine."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Therefore, set the Podman machine to rootful mode."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Stop the Podman machine:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ podman machine stop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Set the Podman machine in rooful mode:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ podman machine set --rootful\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Start the Podman machine:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ podman machine start\n"
          })
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