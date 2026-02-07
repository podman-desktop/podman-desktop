"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[27262],{

/***/ 68311
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_kind_building_an_image_and_testing_it_in_kind_md_fb5_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-kind-building-an-image-and-testing-it-in-kind-md-fb5.json
const site_docs_kind_building_an_image_and_testing_it_in_kind_md_fb5_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"kind/building-an-image-and-testing-it-in-kind","title":"Building and testing an image","description":"Building an image and testing it in Kind","source":"@site/docs/kind/building-an-image-and-testing-it-in-kind.md","sourceDirName":"kind","slug":"/kind/building-an-image-and-testing-it-in-kind","permalink":"/docs/kind/building-an-image-and-testing-it-in-kind","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/kind/building-an-image-and-testing-it-in-kind.md","tags":[{"inline":true,"label":"building-an-image","permalink":"/docs/tags/building-an-image"},{"inline":true,"label":"testing-an-image-on-kind","permalink":"/docs/tags/testing-an-image-on-kind"}],"version":"current","sidebarPosition":10,"frontMatter":{"sidebar_position":10,"title":"Building and testing an image","description":"Building an image and testing it in Kind","keywords":["podman desktop","podman","containers","pods","building an image","kubernetes","kind"],"tags":["building-an-image","testing-an-image-on-kind"]},"sidebar":"mySidebar","previous":{"title":"Deleting a cluster","permalink":"/docs/kind/deleting-your-kind-cluster"},"next":{"title":"Pushing an image","permalink":"/docs/kind/pushing-an-image-to-kind"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/kind/building-an-image-and-testing-it-in-kind.md


const frontMatter = {
	sidebar_position: 10,
	title: 'Building and testing an image',
	description: 'Building an image and testing it in Kind',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'pods',
		'building an image',
		'kubernetes',
		'kind'
	],
	tags: [
		'building-an-image',
		'testing-an-image-on-kind'
	]
};
const contentTitle = 'Building an image and testing it in Kind';

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
        id: "building-an-image-and-testing-it-in-kind",
        children: "Building an image and testing it in Kind"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can build an image with your container engine, and test it in your local Kind-powered Kubernetes cluster."
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
          href: "/docs/kind",
          children: "You onboarded a Kind cluster"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kind/working-with-your-local-kind-cluster",
          children: "You have set your Kubernetes context to your local Kind-powered Kubernetes cluster"
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
              src: (__webpack_require__(58980)/* ["default"] */ .A) + "",
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
          children: "Push your image to your Kind cluster:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "overflow menu"
            }), " icon corresponding to ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-custom-image"
            }), " and select ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Push image to Kind cluster"
            }), ". A successful operation notification opens.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "pushing an image to Kind",
              src: (__webpack_require__(23532)/* ["default"] */ .A) + "",
              width: "1798",
              height: "828"
            })]
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
              src: (__webpack_require__(44074)/* ["default"] */ .A) + "",
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
              src: (__webpack_require__(85425)/* ["default"] */ .A) + "",
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
          children: "Test your image and container on your Kind cluster:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click the overflow menu icon corresponding to the container and select ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Deploy to Kubernetes"
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "deploying to Kubernetes",
              src: (__webpack_require__(38209)/* ["default"] */ .A) + "",
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
            }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "deploy button",
              src: (__webpack_require__(9703)/* ["default"] */ .A) + "",
              width: "1906",
              height: "1564"
            })]
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
          src: (__webpack_require__(90175)/* ["default"] */ .A) + "",
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

/***/ 58980
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/build-image-from-containerfile-72be83023fda42c8e140a35d91f1025b.png");

/***/ },

/***/ 9703
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/deploy-button-22611ed1179d69500f2e72c1f6c16546.png");

/***/ },

/***/ 38209
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/deploying-to-kubernetes-e1424b92957d6714c3da13e6589eafc0.png");

/***/ },

/***/ 90175
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/my-custom-image-container-pod-5a8642764cbaa75ba4ffbfa3e3bc4740.png");

/***/ },

/***/ 23532
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pushing-an-image-to-kind-ed9486da9047ec4b5af8c3cdf22a8121.png");

/***/ },

/***/ 44074
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/running-an-image-f411efaf9a6010eb68805d203d0b549c.png");

/***/ },

/***/ 85425
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-container-af821886398d2e3a27c54155ea883d8d.png");

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