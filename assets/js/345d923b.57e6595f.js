"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[35343],{

/***/ 29622:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_lima_building_an_image_and_testing_it_in_lima_md_345_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-lima-building-an-image-and-testing-it-in-lima-md-345.json
const site_docs_lima_building_an_image_and_testing_it_in_lima_md_345_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"lima/building-an-image-and-testing-it-in-lima","title":"Building and testing an image","description":"Building an image and testing it in Lima","source":"@site/docs/lima/building-an-image-and-testing-it-in-lima.md","sourceDirName":"lima","slug":"/lima/building-an-image-and-testing-it-in-lima","permalink":"/docs/lima/building-an-image-and-testing-it-in-lima","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/lima/building-an-image-and-testing-it-in-lima.md","tags":[{"inline":true,"label":"building-an-image","permalink":"/docs/tags/building-an-image"},{"inline":true,"label":"testing-an-image-on-lima","permalink":"/docs/tags/testing-an-image-on-lima"}],"version":"current","sidebarPosition":5,"frontMatter":{"sidebar_position":5,"title":"Building and testing an image","description":"Building an image and testing it in Lima","keywords":["podman desktop","podman","containers","pods","building an image","kubernetes","lima"],"tags":["building-an-image","testing-an-image-on-lima"]},"sidebar":"mySidebar","previous":{"title":"Customizing Lima instance","permalink":"/docs/lima/customizing"},"next":{"title":"Pushing an image","permalink":"/docs/lima/pushing-an-image-to-lima"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/lima/building-an-image-and-testing-it-in-lima.md


const frontMatter = {
	sidebar_position: 5,
	title: 'Building and testing an image',
	description: 'Building an image and testing it in Lima',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'pods',
		'building an image',
		'kubernetes',
		'lima'
	],
	tags: [
		'building-an-image',
		'testing-an-image-on-lima'
	]
};
const contentTitle = 'Building an image and testing it in Lima';

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
    em: "em",
    h1: "h1",
    h4: "h4",
    header: "header",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "building-an-image-and-testing-it-in-lima",
        children: "Building an image and testing it in Lima"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can build an image and test it in your local Lima-powered Kubernetes cluster."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/containers",
          children: "You onboarded a container engine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima",
          children: "You onboarded a Lima cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/creating-a-kubernetes-instance",
          children: "You have set your Kubernetes context to your local Lima-powered Kubernetes cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A container definition file: ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Containerfile"
        }), " or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Dockerfile"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Build your image:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Images"
            }), " from the left navigation pane."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Build"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Provide the relevant details, such as ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Containerfile path"
            }), ", ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Image name"
            }), ", and ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Build arguments"
            }), " to build the image. For example, use the image name ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-custom-image"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Build"
            }), ". Wait for the image build to finish.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "building an image",
              src: (__webpack_require__(74315)/* ["default"] */ .A) + "",
              width: "1534",
              height: "1512"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Done"
            }), " to view the new image on the same page."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Push your image to your Lima cluster (if needed):"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "overflow menu"
            }), " icon corresponding to ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-custom-image"
            }), " and select ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Push image to Lima cluster"
            }), ". A successful operation notification opens."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "OK"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Test your image by creating a container:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Run Image"
            }), " icon corresponding to the image ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-custom-image"
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "running an image",
              src: (__webpack_require__(60969)/* ["default"] */ .A) + "",
              width: "1764",
              height: "426"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Container name"
            }), ": enter ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-custom-image-container"
            }), "."]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Review the parameters that Podman Desktop has detected from your image definition or edit them, if required."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Start Container"
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "starting a container",
              src: (__webpack_require__(2390)/* ["default"] */ .A) + "",
              width: "1586",
              height: "1424"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Summary"
            }), " tab to view the details of the new container."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Close"
            }), " icon."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Test your image and container on your Lima cluster:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the overflow menu icon corresponding to the container and select ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Deploy to Kubernetes"
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "deploying to Kubernetes",
              src: (__webpack_require__(91124)/* ["default"] */ .A) + "",
              width: "2168",
              height: "978"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Provide the following details:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Pod Name"
                }), ": Keep the proposed value ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "my-custom-image-container-pod"
                }), "."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Expose service locally using Kubernetes Ingress"
                }), ": Select the checkbox to expose the service locally using the ingress controller."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Optional: If your container exposes more than one port, select the port to expose from the dropdown list."
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Deploy"
            }), ". Wait for the pod to reach the state: ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Phase: Running"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Done"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Kubernetes > Pods"
        }), " from the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the running ", (0,jsx_runtime.jsx)(_components.code, {
          children: "my-custom-image-container-pod"
        }), " pod.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "running pod",
          src: (__webpack_require__(79262)/* ["default"] */ .A) + "",
          width: "2208",
          height: "454"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the pod name to view its details and logs."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: If your container exposes a port, go to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "http://localhost:<port-number-exposed>"
        }), ": your application is running."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can build and test your image in the ", (0,jsx_runtime.jsx)(_components.em, {
        children: "same"
      }), " Lima instance, you don't need to push it!"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/customizing",
          children: "Customizing the Lima instance"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/lima/creating-a-lima-instance",
          children: "You have set your Docker socket host to your local Lima-powered Kubernetes cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Containers and Kubernetes need to use the same image storage."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "List of common Docker API and Kubernetes CRI sockets that you can install and configure:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Docker API socket"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Kubernetes CRI socket"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "nerdctl.sock"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "containerd.sock"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "docker.sock"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "cri-dockerd.sock"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "podman.sock"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "crio.sock"
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://kubernetes.io/docs/setup/production-environment/container-runtimes/",
          children: "Kubernetes Container Runtimes"
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

/***/ 74315:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/build-image-from-containerfile-72be83023fda42c8e140a35d91f1025b.png");

/***/ }),

/***/ 91124:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/deploying-to-kubernetes-e1424b92957d6714c3da13e6589eafc0.png");

/***/ }),

/***/ 79262:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/my-custom-image-container-pod-5a8642764cbaa75ba4ffbfa3e3bc4740.png");

/***/ }),

/***/ 60969:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/running-an-image-f411efaf9a6010eb68805d203d0b549c.png");

/***/ }),

/***/ 2390:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-container-af821886398d2e3a27c54155ea883d8d.png");

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