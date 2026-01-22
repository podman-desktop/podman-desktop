"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[57720],{

/***/ 3715
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-container-63a8bbf8e461c6707bf099457e57e13f.png");

/***/ },

/***/ 15429
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_starting_a_container_md_421_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-starting-a-container-md-421.json
const site_docs_containers_starting_a_container_md_421_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/starting-a-container","title":"Start a container","description":"Starting a container on your container engine.","source":"@site/docs/containers/starting-a-container.md","sourceDirName":"containers","slug":"/containers/starting-a-container","permalink":"/docs/containers/starting-a-container","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/starting-a-container.md","tags":[{"inline":true,"label":"starting-a-container","permalink":"/docs/tags/starting-a-container"}],"version":"current","sidebarPosition":30,"frontMatter":{"sidebar_position":30,"title":"Start a container","description":"Starting a container on your container engine.","keywords":["podman desktop","podman","containers","images"],"tags":["starting-a-container"]},"sidebar":"mySidebar","previous":{"title":"Pulling an image","permalink":"/docs/containers/images/pulling-an-image"},"next":{"title":"Access the terminal","permalink":"/docs/containers/accessing-the-terminal"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/starting-a-container.md


const frontMatter = {
	sidebar_position: 30,
	title: 'Start a container',
	description: 'Starting a container on your container engine.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'images'
	],
	tags: [
		'starting-a-container'
	]
};
const contentTitle = 'Starting a container on your container engine';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure",
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
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "starting-a-container-on-your-container-engine",
        children: "Starting a container on your container engine"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can start a container from an image on your container engine.\nYou can interact with the running container by using the terminal or by opening your browser to the exposed ports."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Images"
        }), " list has your image, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/podman/hello"
        }), ". See ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/containers/images/pulling-an-image",
          children: "Pulling an image"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Images"
        }), " component page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Run Image"
        }), " icon corresponding to the image you want to run. For example, ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/podman/hello"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "Run Image icon",
          src: (__webpack_require__(72188)/* ["default"] */ .A) + "",
          width: "1748",
          height: "558"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Review or edit the container configuration details."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Start Container"
        }), ". The Container Details page opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "starting a container",
          src: (__webpack_require__(3715)/* ["default"] */ .A) + "",
          width: "2758",
          height: "1434"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Logs"
        }), " tab to view the program running.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "program running",
          src: (__webpack_require__(68697)/* ["default"] */ .A) + "",
          width: "1534",
          height: "942"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "close"
        }), " icon on the right side of the page."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Containers"
        }), " component page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-search",
            size: "lg"
          })
        }), ": Enter your image name, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/podman/hello"
        }), ", to find your running container."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click your running container name to perform any of the following tasks:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/containers/viewing-container-logs",
              children: "View the logs"
            })
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Inspect the container", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Inspect"
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Click the content area to activate it."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Press ", (0,jsx_runtime.jsx)("kbd", {
                  children: "Ctrl"
                }), " + ", (0,jsx_runtime.jsx)("kbd", {
                  children: "F"
                }), " on Windows and Linux, or ", (0,jsx_runtime.jsx)("kbd", {
                  children: "⌘"
                }), " + ", (0,jsx_runtime.jsx)("kbd", {
                  children: "F"
                }), " on macOS to start searching the content."]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Generate a Kubernetes YAML manifest when your container engine is Podman:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Kube"
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Click the content area to activate it."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Press ", (0,jsx_runtime.jsx)("kbd", {
                  children: "Ctrl"
                }), " + ", (0,jsx_runtime.jsx)("kbd", {
                  children: "F"
                }), " on Windows and Linux, or ", (0,jsx_runtime.jsx)("kbd", {
                  children: "⌘"
                }), " + ", (0,jsx_runtime.jsx)("kbd", {
                  children: "F"
                }), " on macOS to start searching the content."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Optional: Copy the content to a YAML file."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Optional: Reuse this file to create a pod that you can run on a Podman engine or a Kubernetes cluster. See ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://podman-desktop.io/blog/2024/10/05/kubernetes-blog#creating-a-pod",
                  children: "Pod creation with Kubernetes YAML"
                }), "."]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/containers/accessing-the-terminal",
              children: "Access the terminal"
            })
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Access the application by exposing a port:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: (0,jsx_runtime.jsx)(Icon, {
                    icon: "fa-solid fa-external-link",
                    size: "lg"
                  })
                }), "."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["View the running application at ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "localhost:port"
                }), " in your browser."]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kubernetes/deploying-a-pod-to-kubernetes",
              children: "Deploy the container to a Kubernetes cluster"
            })
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/blog/2024/10/05/kubernetes-blog#building-a-containerized-application",
          children: "Building a containerized application"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/running-a-pod-using-a-container-docker-file",
          children: "Running a pod using a container or docker file"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/managing-your-application-resources#managing-containers-and-pods",
          children: "Managing containers and pods"
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
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

/***/ 68697
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/hello-world-program-running-b03069cc28baddeeed6d4b0ae951c6d6.png");

/***/ },

/***/ 72188
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/running-an-image-114be6ea204cbc764b70eb891fcdbb3e.png");

/***/ }

}]);