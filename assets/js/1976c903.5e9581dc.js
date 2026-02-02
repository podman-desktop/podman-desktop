"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[39385],{

/***/ 95523:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kubernetes_applying_a_yaml_manifest_md_197_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kubernetes-applying-a-yaml-manifest-md-197.json
const site_docs_kubernetes_applying_a_yaml_manifest_md_197_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kubernetes/applying-a-yaml-manifest","title":"Applying a YAML manifest","description":"How to apply a YAML manifest to create a kubernetes object","source":"@site/docs/kubernetes/applying-a-yaml-manifest.md","sourceDirName":"kubernetes","slug":"/kubernetes/applying-a-yaml-manifest","permalink":"/docs/kubernetes/applying-a-yaml-manifest","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kubernetes/applying-a-yaml-manifest.md","tags":[{"inline":true,"label":"applying-a-yaml-manifest","permalink":"/docs/tags/applying-a-yaml-manifest"},{"inline":true,"label":"creating-an-object","permalink":"/docs/tags/creating-an-object"}],"version":"current","sidebarPosition":12,"frontMatter":{"sidebar_position":12,"title":"Applying a YAML manifest","description":"How to apply a YAML manifest to create a kubernetes object","keywords":["podman desktop","podman","objects","kubernetes"],"tags":["applying-a-yaml-manifest","creating-an-object"]},"sidebar":"mySidebar","previous":{"title":"Creating a Kubernetes cluster","permalink":"/docs/kubernetes/creating-a-kube-cluster"},"next":{"title":"Managing objects","permalink":"/docs/kubernetes/configuring-editing-kube-object"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kubernetes/applying-a-yaml-manifest.md


const frontMatter = {
	sidebar_position: 12,
	title: 'Applying a YAML manifest',
	description: 'How to apply a YAML manifest to create a kubernetes object',
	keywords: [
		'podman desktop',
		'podman',
		'objects',
		'kubernetes'
	],
	tags: [
		'applying-a-yaml-manifest',
		'creating-an-object'
	]
};
const contentTitle = 'Applying a YAML manifest';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure: Applying a YAML manifest to create a <code>Deployment</code> object",
  "id": "procedure-applying-a-yaml-manifest-to-create-a-deployment-object",
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
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "applying-a-yaml-manifest",
        children: "Applying a YAML manifest"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can deploy a YAML manifest to create a Kubernetes object, such as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Node"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Deployment"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Service"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "PersistentVolumeClaim"
      }), ", and others. For example, a Kubernetes deployment that requires sensitive data storage, you can apply a YAML manifest to create a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Secret"
      }), " object."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Make sure you have:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/creating-a-kind-cluster",
          children: "A running Kubernetes cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Created a YAML manifest file using the following code, if you do not have one on your machine:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-nginx\nspec:\n  selector:\n    matchLabels:\n      run: my-nginx\n  replicas: 3\n  template:\n    metadata:\n      labels:\n        run: my-nginx\n    spec:\n      containers:\n        - name: my-nginx\n          image: nginx\n          ports:\n            - containerPort: 80\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This YAML manifest creates three pods that run the NGINX web server."
    }), "\n", (0,jsx_runtime.jsxs)(_components.h4, {
      id: "procedure-applying-a-yaml-manifest-to-create-a-deployment-object",
      children: ["Procedure: Applying a YAML manifest to create a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Deployment"
      }), " object"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes"
        }), " component page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Deployments"
        }), " in the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select a namespace in which you want to create the object."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Apply YAML"
        }), " and select the YAML manifest file. A confirmation notification opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "applying a yaml manifest",
          src: (__webpack_require__(90667)/* ["default"] */ .A) + "",
          width: "1676",
          height: "402"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "OK"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "confirmation notification",
          src: (__webpack_require__(18466)/* ["default"] */ .A) + "",
          width: "1204",
          height: "416"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the created ", (0,jsx_runtime.jsx)(_components.code, {
            children: "my-nginx"
          }), " deployment on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "nginx deployment",
            src: (__webpack_require__(21656)/* ["default"] */ .A) + "",
            width: "1482",
            height: "438"
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The deployment might take some time to make pods available for use."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Pods"
          }), " in the Kubernetes explorer to view three instances of the NGINX web server running.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "nginx pods running",
            src: (__webpack_require__(4020)/* ["default"] */ .A) + "",
            width: "1672",
            height: "668"
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "When you apply any other YAML manifest, you can view the created object on the corresponding object page."
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

/***/ 90667:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/applying-a-yaml-manifest-a18eeaeaeb5dd8c28dc50938e5e98af1.png");

/***/ }),

/***/ 18466:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/confirmation-notification-d7e8799d8d528b850b975f03d5fd1c90.png");

/***/ }),

/***/ 21656:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/my-nginx-deployment-a033a72515f2e5e4e40c4c9bfcdccef4.png");

/***/ }),

/***/ 4020:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/nginx-pods-running-361bc28c5dd9409f6485979a249dab5f.png");

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