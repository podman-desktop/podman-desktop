"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[51901],{

/***/ 74253:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_index_md_a58_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-index-md-a58.json
const site_tutorial_index_md_a58_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"index","title":"Introduction","description":"Introduction to the tutorials section","source":"@site/tutorial/index.md","sourceDirName":".","slug":"/","permalink":"/tutorial/","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"tutorial","permalink":"/tutorial/tags/tutorial"}],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"title":"Introduction","description":"Introduction to the tutorials section","keywords":["podman desktop","podman","tutorial"],"tags":["podman-desktop","tutorial"]},"sidebar":"defaultSidebar","next":{"title":"Running a pod using a container or docker file","permalink":"/tutorial/running-a-pod-using-a-container-docker-file"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/index.md


const frontMatter = {
	sidebar_position: 1,
	title: 'Introduction',
	description: 'Introduction to the tutorials section',
	keywords: [
		'podman desktop',
		'podman',
		'tutorial'
	],
	tags: [
		'podman-desktop',
		'tutorial'
	]
};
const contentTitle = 'Introduction';

const assets = {

};



const toc = [{
  "value": "List of tutorials",
  "id": "list-of-tutorials",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
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
        id: "introduction",
        children: "Introduction"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "These tutorials cover end-to-end tasks that you must perform to accomplish a goal while working with the Podman Desktop application. Each task is a procedure that contains a sequence of steps to follow."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Before going through each tutorial, familiarize yourself with the key UI components of the Podman Desktop application:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "UI components",
        src: (__webpack_require__(7599)/* ["default"] */ .A) + "",
        width: "2100",
        height: "1374"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.strong, {
            children: "Left navigation pane"
          }), ": Helps in accessing the dashboard and managing containers, images, pods, volumes, Kubernetes resources, and extensions. You can apply different actions from each component page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.strong, {
            children: "Accounts"
          }), ": Provides easy access to the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Authentication"
          }), " settings. You can add an authentication provider using the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Red Hat Authentication"
          }), " extension."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings"
          }), ": Helps you to:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Create resources for your development environment"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure proxy URLs"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure a registry for secure storage and distribution of containers and cloud-native artifacts"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure an authentication provider"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure a CLI tool"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure a Kubernetes context"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure the application appearance, extensions, the terminal size and line height, and the telemetry feature."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Configure a Docker-compatible environment"
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.strong, {
            children: "Status bar"
          }), ": Provides the following capabilities:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Set your Kubernetes context"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Share your feedback"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Troubleshoot your container connections and view logs"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "View notifications and additional help resources"
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "list-of-tutorials",
      children: "List of tutorials"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/running-a-pod-using-a-container-docker-file",
          children: "Running a pod using a container or docker file"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/running-a-kubernetes-cluster",
          children: "Running a Kubernetes cluster"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/deploying-a-kubernetes-application",
          children: "Deploying a Kubernetes application"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/interacting-with-a-database-server",
          children: "Interacting with a database server"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/managing-your-application-resources",
          children: "Managing your application resources"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/running-an-ai-application",
          children: "Running an AI application"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension",
          children: "Creating an extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/getting-started-with-compose",
          children: "Getting started with Compose"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/testcontainers-with-podman",
          children: "Testcontainers with Podman"
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



/***/ }),

/***/ 7599:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-desktop-ui-components-7f2583a7a969bc2d3604854e81da8ca5.png");

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