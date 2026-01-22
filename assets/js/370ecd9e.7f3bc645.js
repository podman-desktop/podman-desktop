"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[61791],{

/***/ 20528
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_openshift_microshift_index_md_370_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-openshift-microshift-index-md-370.json
const site_docs_openshift_microshift_index_md_370_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"openshift/microshift/index","title":"MicroShift","description":"Create a MicroShift cluster with Podman Desktop","source":"@site/docs/openshift/microshift/index.md","sourceDirName":"openshift/microshift","slug":"/openshift/microshift/","permalink":"/docs/openshift/microshift/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/openshift/microshift/index.md","tags":[{"inline":true,"label":"install-minc-extension","permalink":"/docs/tags/install-minc-extension"},{"inline":true,"label":"create-a-microshift-cluster","permalink":"/docs/tags/create-a-microshift-cluster"}],"version":"current","sidebarPosition":104,"frontMatter":{"sidebar_position":104,"title":"MicroShift","description":"Create a MicroShift cluster with Podman Desktop","keywords":["podman desktop","podman","minc extension","microshift"],"tags":["install-minc-extension","create-a-microshift-cluster"]},"sidebar":"mySidebar","previous":{"title":"OpenShift Local","permalink":"/docs/openshift/openshift-local/"},"next":{"title":"Extensions","permalink":"/docs/extensions/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/openshift/microshift/index.md


const frontMatter = {
	sidebar_position: 104,
	title: 'MicroShift',
	description: 'Create a MicroShift cluster with Podman Desktop',
	keywords: [
		'podman desktop',
		'podman',
		'minc extension',
		'microshift'
	],
	tags: [
		'install-minc-extension',
		'create-a-microshift-cluster'
	]
};
const contentTitle = 'Creating a MicroShift cluster';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure: Create a MicroShift cluster",
  "id": "procedure-create-a-microshift-cluster",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
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
        id: "creating-a-microshift-cluster",
        children: "Creating a MicroShift cluster"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can use the MicroShift in a Container (MINC) extension to create a lightweight OpenShift Kubernetes cluster that runs on minimal resources, such as CPU, RAM, and storage. The cluster is deployed as a container within your Podman environment and resembles a miniaturized version of OpenShift. After setting up a MicroShift cluster, you can:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Develop OpenShift applications in a resource-constrained environment."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Provision lightweight OpenShift control planes."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Run your OpenShift workloads at the edge or even in network-constrained situations, such as low connectivity or node access issues."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Access the images built with Podman from your cluster."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Have a consistent development and management experience with an OpenShift cluster."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A running ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "Podman machine"
        }), " with root privileges."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/install",
          children: "Install the MINC extension"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["On Windows: ", (0,jsx_runtime.jsxs)(_components.a, {
          href: "https://learn.microsoft.com/en-us/windows/wsl/wsl-config",
          children: ["Enable the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "cgroup v2"
          }), " kernel feature"]
        }), " in the Windows Subsystem for Linux (WSL).", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Open the ", (0,jsx_runtime.jsx)(_components.code, {
              children: ".wslconfig"
            }), " file located in the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "%UserProfile%"
            }), " directory."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Append the kernel command-line argument ", (0,jsx_runtime.jsx)(_components.code, {
              children: "cgroup_no_v1=all"
            }), " to the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "kernelCommandLine"
            }), " key under the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "[wsl2]"
            }), " section."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-create-a-microshift-cluster",
      children: "Procedure: Create a MicroShift cluster"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the MicroShift tile, click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create new ..."
        }), " button.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "creating a microshift cluster",
          src: (__webpack_require__(62601)/* ["default"] */ .A) + "",
          width: "1652",
          height: "532"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Optional: Edit the port number for the routes."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "creation with custom ports",
          src: (__webpack_require__(93709)/* ["default"] */ .A) + "",
          width: "1816",
          height: "802"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Show Logs"
        }), " button to view the logs."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["After successful creation, click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Go back to resources"
        }), " button."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), " page, your MicroShift instance is running.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "microshift instance running",
          src: (__webpack_require__(48146)/* ["default"] */ .A) + "",
          width: "1648",
          height: "422"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
          children: "Set your current context"
        }), " to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "microshift"
        }), " for Kubernetes development."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run basic tasks, such as ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes/deploying-a-pod-to-kubernetes",
          children: "deploying a pod or container"
        }), " to Kubernetes."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/minc-org/minc-extension",
          children: "minc-extension repository"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/blog/iterate-quickly-inner-loop-with-a-kubernetes-cluster",
          children: "MINC blog"
        })
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


/***/ },

/***/ 48146
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/microshift-instance-running-e9e1f1cc329e5f173d206ffa21bba9c7.png");

/***/ },

/***/ 62601
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/creating-a-microshift-cluster-5f5615d1c10e72ed390d29fcfd012a49.png");

/***/ },

/***/ 93709
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/cluster-creation-with-custom-port-129ab0b8d340c4ca10d85e955a69f798.png");

/***/ }

}]);