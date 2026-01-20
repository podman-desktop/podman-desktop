"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[78110],{

/***/ 19964:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_compose_running_compose_md_b10_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-compose-running-compose-md-b10.json
const site_docs_compose_running_compose_md_b10_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"compose/running-compose","title":"Running Compose files","description":"With Podman Desktop, you can manage multi-container applications defined in Compose files.","source":"@site/docs/compose/running-compose.md","sourceDirName":"compose","slug":"/compose/running-compose","permalink":"/docs/compose/running-compose","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/compose/running-compose.md","tags":[{"inline":true,"label":"compose","permalink":"/docs/tags/compose"}],"version":"current","sidebarPosition":3,"frontMatter":{"title":"Running Compose files","description":"With Podman Desktop, you can manage multi-container applications defined in Compose files.","sidebar_position":3,"keywords":["compose"],"tags":["compose"]},"sidebar":"mySidebar","previous":{"title":"Setting up Compose","permalink":"/docs/compose/setting-up-compose"},"next":{"title":"Troubleshooting Compose","permalink":"/docs/compose/troubleshooting"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/compose/running-compose.md


const frontMatter = {
	title: 'Running Compose files',
	description: 'With Podman Desktop, you can manage multi-container applications defined in Compose files.',
	sidebar_position: 3,
	keywords: [
		'compose'
	],
	tags: [
		'compose'
	]
};
const contentTitle = undefined;

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
    h4: "h4",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  }, {Details, Icon} = _components;
  if (!Details) _missingMdxReference("Details", true);
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can manage multi-container applications defined in a Compose file."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Podman 4.7.0 or greater."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/compose/setting-up-compose",
          children: "You have set up Compose"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/compose-spec/compose-spec/blob/master/spec.md#compose-file",
          children: "You have a Compose file"
        }), ", such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "compose.yaml"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the command in a terminal:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ podman compose --file compose.yaml up --detach\n"
          })
        }), "\n", (0,jsx_runtime.jsxs)(Details, {
          children: [(0,jsx_runtime.jsx)("summary", {
            children: (0,jsx_runtime.jsxs)(_components.p, {
              children: ["(Alternatively) With an older Podman version, run ", (0,jsx_runtime.jsx)(_components.code, {
                children: "docker-compose"
              }), ":"]
            })
          }), (0,jsx_runtime.jsxs)(_components.ol, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
              children: [(0,jsx_runtime.jsx)(_components.a, {
                href: "/docs/migrating-from-docker/using-the-docker_host-environment-variable",
                children: "Set the DOCKER_HOST variable"
              }), "."]
            }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
              children: ["Run ", (0,jsx_runtime.jsx)(_components.code, {
                children: "docker-compose"
              }), " rather than ", (0,jsx_runtime.jsx)(_components.code, {
                children: "podman compose"
              }), ":"]
            }), "\n"]
          }), (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "$ docker-compose --file compose.yaml up --detach\n"
            })
          })]
        }), "\n", (0,jsx_runtime.jsxs)(Details, {
          children: [(0,jsx_runtime.jsx)("summary", {
            children: (0,jsx_runtime.jsx)(_components.p, {
              children: "(Optionally) Learn about Compose commands:"
            })
          }), (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "$ podman compose --help\n"
            })
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The Compose engine starts the containers and services, and adds a label to each resource:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Container label: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "com.docker.compose.project"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Service label: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "com.docker.compose.service"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Podman Desktop detects the Compose labels, and displays the container group as a group of containers."
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The Podman Desktop ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cube",
              size: "lg"
            }), " Containers"]
          }), " list displays the containers created by Compose grouped in a container group with a ", (0,jsx_runtime.jsx)(_components.code, {
            children: "(compose)"
          }), " suffix, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "flask-redis (compose)"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "img2",
        src: (__webpack_require__(34848)/* ["default"] */ .A) + "",
        width: "1017",
        height: "742"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/getting-started-with-compose",
          children: "Tutorial: Getting started with Compose"
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ }),

/***/ 34848:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/compose-in-containers-view-b93a1a1667842a10985bf3203a035f3b.png");

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