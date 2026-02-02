"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[81563],{

/***/ 51577:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_interacting_with_a_database_server_md_14d_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-interacting-with-a-database-server-md-14d.json
const site_tutorial_interacting_with_a_database_server_md_14d_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"interacting-with-a-database-server","title":"Interacting with a database server","description":"Interacting with databases from the Podman Desktop application","source":"@site/tutorial/interacting-with-a-database-server.md","sourceDirName":".","slug":"/interacting-with-a-database-server","permalink":"/tutorial/interacting-with-a-database-server","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"interacting-with-databases","permalink":"/tutorial/tags/interacting-with-databases"}],"version":"current","sidebarPosition":5,"frontMatter":{"sidebar_position":5,"title":"Interacting with a database server","description":"Interacting with databases from the Podman Desktop application","keywords":["podman desktop","podman","databases"],"tags":["podman-desktop","interacting-with-databases"]},"sidebar":"defaultSidebar","previous":{"title":"Deploying a Kubernetes application","permalink":"/tutorial/deploying-a-kubernetes-application"},"next":{"title":"Managing your application resources","permalink":"/tutorial/managing-your-application-resources"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/interacting-with-a-database-server.md


const frontMatter = {
	sidebar_position: 5,
	title: 'Interacting with a database server',
	description: 'Interacting with databases from the Podman Desktop application',
	keywords: [
		'podman desktop',
		'podman',
		'databases'
	],
	tags: [
		'podman-desktop',
		'interacting-with-databases'
	]
};
const contentTitle = 'Interacting with a database server';

const assets = {

};



const toc = [{
  "value": "Before you begin",
  "id": "before-you-begin",
  "level": 2
}, {
  "value": "Pulling a PostgreSQL server image",
  "id": "pulling-a-postgresql-server-image",
  "level": 2
}, {
  "value": "Creating a PostgreSQL server instance",
  "id": "creating-a-postgresql-server-instance",
  "level": 2
}, {
  "value": "Accessing the instance from terminal",
  "id": "accessing-the-instance-from-terminal",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    em: "em",
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
        id: "interacting-with-a-database-server",
        children: "Interacting with a database server"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial covers the following end-to-end tasks required to interact with a database server from within the Podman Desktop UI:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Pulling a database server image"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Creating a database server instance"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Accessing the instance from terminal"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For creating a database instance, you can use one of the following options:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/containers/images/building-an-image",
          children: "Build a database server image using a container or docker file"
        })
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/managing-your-application-resources#managing-images",
          children: "Import a database server image from your local machine"
        }), " using the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Import"
        }), " button on the ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Images"
        }), " component page"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Pull a database server image from a registry (covered in this tutorial)"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This tutorial focuses on creating a PostgreSQL server instance by pulling the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "quay.io/fedora/postgresql-16"
      }), " image from the ", (0,jsx_runtime.jsx)(_components.em, {
        children: "quay.io"
      }), " registry."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "before-you-begin",
      children: "Before you begin"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Make sure you have:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/installation",
          children: "Installed Podman Desktop"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A developer role."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "pulling-a-postgresql-server-image",
      children: "Pulling a PostgreSQL server image"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Images"
        }), " in the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Pull"
        }), " button.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "pulling an image",
          src: (__webpack_require__(9761)/* ["default"] */ .A) + "",
          width: "983",
          height: "187"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Enter the name of the image to pull from the registry."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Pull image"
        }), ". A download complete notification opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "clicking the pull button",
          src: (__webpack_require__(92151)/* ["default"] */ .A) + "",
          width: "981",
          height: "546"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Done"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "image pulled successfully",
          src: (__webpack_require__(66361)/* ["default"] */ .A) + "",
          width: "979",
          height: "316"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the newly created ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/fedora/postgresql-16"
        }), " image on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "image added on the page",
          src: (__webpack_require__(73560)/* ["default"] */ .A) + "",
          width: "996",
          height: "177"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-postgresql-server-instance",
      children: "Creating a PostgreSQL server instance"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Images"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Run Image"
          }), " icon corresponding to the PostgreSQL server image you want to run.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running an image",
            src: (__webpack_require__(88528)/* ["default"] */ .A) + "",
            width: "991",
            height: "185"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Configure the basic details, such as container name, port mapping, and environment variables for the PostgreSQL server instance."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Start Container"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "starting a container",
            src: (__webpack_require__(31916)/* ["default"] */ .A) + "",
            width: "994",
            height: "622"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the successful operation notification in the ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Tty"
          }), " tab of the ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Container Details"
          }), " page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "sql server started",
            src: (__webpack_require__(56841)/* ["default"] */ .A) + "",
            width: "1005",
            height: "574"
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["You can also check the ", (0,jsx_runtime.jsx)(_components.em, {
              children: "Logs"
            }), " tab for the same notification."]
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "close"
          }), " icon on the right hand side of the page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the newly created PostgreSQL server container on the page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "database container created",
            src: (__webpack_require__(34517)/* ["default"] */ .A) + "",
            width: "994",
            height: "393"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "accessing-the-instance-from-terminal",
      children: "Accessing the instance from terminal"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the created ", (0,jsx_runtime.jsx)(_components.code, {
            children: "postgresql-database"
          }), " container. The ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Container Details"
          }), " page opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "database container",
            src: (__webpack_require__(34517)/* ["default"] */ .A) + "",
            width: "994",
            height: "393"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Terminal"
          }), " tab."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "psql"
          }), " command to connect to the database server. The prompt changes to ", (0,jsx_runtime.jsx)(_components.code, {
            children: "postgres=#"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "connect to the PostgreSQL server instance",
            src: (__webpack_require__(73384)/* ["default"] */ .A) + "",
            width: "1007",
            height: "201"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Interact with the database server by running any PostgreSQL commands, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "\\list"
          }), ":\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "interact with the database",
            src: (__webpack_require__(68499)/* ["default"] */ .A) + "",
            width: "1002",
            height: "305"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["To access this database server instance from inside a running application container, use the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman exec -it postgresql-database /bin/bash"
        }), " command."]
      })
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

/***/ 92151:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/click-pull-image-020dee62bb11f3d9e9f3b62c2482cbb0.png");

/***/ }),

/***/ 73384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/connect-to-postgresql-f1e17c026240963edac51b465d8ecfe4.png");

/***/ }),

/***/ 34517:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/database-container-created-96d3e084032be89d60aff3fe735e29d6.png");

/***/ }),

/***/ 66361:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/image-successfully-pulled-13e3d2c1b3dd2cf2b2176b9b90ece773.png");

/***/ }),

/***/ 68499:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/interacted-with-database-5a2cd6462083643891b88f15dcfc5b0d.png");

/***/ }),

/***/ 73560:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/new-image-added-30bcc973e8ac784a28895b18d9655371.png");

/***/ }),

/***/ 56841:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/postgresql-server-started-d473dead665265b5e300cf1a879d9240.png");

/***/ }),

/***/ 9761:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pull-button-b61a933a48870abeefb656425505cdf1.png");

/***/ }),

/***/ 88528:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/run-image-icon-7bbf95c413596d1a899d3af1d30e7460.png");

/***/ }),

/***/ 31916:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/starting-a-postgresql-container-eaf09f815af6044b5c3b1fba5882fcd8.png");

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