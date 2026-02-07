"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[51594],{

/***/ 67161
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_onboarding_md_59a_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-onboarding-md-59a.json
const site_docs_containers_onboarding_md_59a_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/onboarding","title":"Onboarding for containers","description":"To run container workloads with Podman Desktop, set up at least one container engine.","source":"@site/docs/containers/onboarding.md","sourceDirName":"containers","slug":"/containers/onboarding","permalink":"/docs/containers/onboarding","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/onboarding.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"onboarding","permalink":"/docs/tags/onboarding"}],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"title":"Onboarding for containers","description":"To run container workloads with Podman Desktop, set up at least one container engine.","tags":["podman-desktop","onboarding"],"keywords":["podman desktop","containers","podman","onboarding"]},"sidebar":"mySidebar","previous":{"title":"Containers","permalink":"/docs/containers/"},"next":{"title":"Registries","permalink":"/docs/containers/registries/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/onboarding.md


const frontMatter = {
	sidebar_position: 2,
	title: 'Onboarding for containers',
	description: 'To run container workloads with Podman Desktop, set up at least one container engine.',
	tags: [
		'podman-desktop',
		'onboarding'
	],
	keywords: [
		'podman desktop',
		'containers',
		'podman',
		'onboarding'
	]
};
const contentTitle = 'Onboarding for container workloads';

const assets = {

};



const toc = [{
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h4: "h4",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
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
        id: "onboarding-for-container-workloads",
        children: "Onboarding for container workloads"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To run container workloads, set up at least one container engine."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop does not automatically set up container engine resources that you might not need."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select a container engine supporting your workload."
        }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
          children: [(0,jsx_runtime.jsx)(_components.thead, {
            children: (0,jsx_runtime.jsxs)(_components.tr, {
              children: [(0,jsx_runtime.jsx)(_components.th, {
                style: {
                  textAlign: "left"
                },
                children: "Workload"
              }), (0,jsx_runtime.jsx)(_components.th, {
                style: {
                  textAlign: "center"
                },
                children: "Podman"
              }), (0,jsx_runtime.jsx)(_components.th, {
                style: {
                  textAlign: "center"
                },
                children: "Native Docker"
              }), (0,jsx_runtime.jsx)(_components.th, {
                style: {
                  textAlign: "center"
                },
                children: "Docker Desktop"
              })]
            })
          }), (0,jsx_runtime.jsxs)(_components.tbody, {
            children: [(0,jsx_runtime.jsxs)(_components.tr, {
              children: [(0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "left"
                },
                children: "Rootless containers"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "❌ no"
              })]
            }), (0,jsx_runtime.jsxs)(_components.tr, {
              children: [(0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "left"
                },
                children: "Rootful containers"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              })]
            }), (0,jsx_runtime.jsxs)(_components.tr, {
              children: [(0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "left"
                },
                children: "Compose"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              })]
            }), (0,jsx_runtime.jsxs)(_components.tr, {
              children: [(0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "left"
                },
                children: "Pods"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "✅ yes"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "❌ no"
              }), (0,jsx_runtime.jsx)(_components.td, {
                style: {
                  textAlign: "center"
                },
                children: "❌ no"
              })]
            })]
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Podman supports rootless container and pods, in addition to rootful containers and Compose."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select an execution environment supporting your container engine and your operating system."
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Select a Podman execution environment:"
            }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
              children: [(0,jsx_runtime.jsx)(_components.thead, {
                children: (0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "left"
                    },
                    children: "Host operating system"
                  }), (0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "center"
                    },
                    children: "Native containers"
                  }), (0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "center"
                    },
                    children: "Podman Machine"
                  }), (0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "center"
                    },
                    children: "Lima instance"
                  })]
                })
              }), (0,jsx_runtime.jsxs)(_components.tbody, {
                children: [(0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "left"
                    },
                    children: "Windows"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ no"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ experimental"
                  })]
                }), (0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "left"
                    },
                    children: "macOS"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ no"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  })]
                }), (0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "left"
                    },
                    children: "Linux"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ experimental"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  })]
                })]
              })]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Select a Docker execution environment:"
            }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
              children: [(0,jsx_runtime.jsx)(_components.thead, {
                children: (0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "left"
                    },
                    children: "Host operating system"
                  }), (0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "center"
                    },
                    children: "Native containers"
                  }), (0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "center"
                    },
                    children: "Docker Desktop"
                  }), (0,jsx_runtime.jsx)(_components.th, {
                    style: {
                      textAlign: "center"
                    },
                    children: "Lima instance"
                  })]
                })
              }), (0,jsx_runtime.jsxs)(_components.tbody, {
                children: [(0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "left"
                    },
                    children: "Windows"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ no"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ experimental"
                  })]
                }), (0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "left"
                    },
                    children: "macOS"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "❌ no"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  })]
                }), (0,jsx_runtime.jsxs)(_components.tr, {
                  children: [(0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "left"
                    },
                    children: "Linux"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  }), (0,jsx_runtime.jsx)(_components.td, {
                    style: {
                      textAlign: "center"
                    },
                    children: "✅ yes"
                  })]
                })]
              })]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Setup your container engine."
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Podman Desktop assists you to set up Podman and Podman machines on Windows and macOS."
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.a, {
                  href: "/docs/installation",
                  children: "Installing Podman"
                }), "."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.a, {
                  href: "/docs/podman/creating-a-podman-machine",
                  children: "Creating a Podman machine with Podman Desktop"
                }), "."]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Podman Desktop consumes your native containers, Lima instance or Docker setup."
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.a, {
                  href: "/docs/lima/creating-a-lima-instance",
                  children: "Creating a Lima instance"
                }), "."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.a, {
                  href: "https://podman.io/docs/installation#installing-on-linux",
                  children: "Installing Podman on Linux"
                }), "."]
              }), "\n"]
            }), "\n"]
          }), "\n"]
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