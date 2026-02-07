"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[55259],{

/***/ 5056
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_lima_creating_a_kubernetes_instance_md_aaa_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-lima-creating-a-kubernetes-instance-md-aaa.json
const site_docs_lima_creating_a_kubernetes_instance_md_aaa_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"lima/creating-a-kubernetes-instance","title":"Lima instance for Kubernetes","description":"Podman Desktop can assist you to create a custom Lima instance on Linux and macOS.","source":"@site/docs/lima/creating-a-kubernetes-instance.md","sourceDirName":"lima","slug":"/lima/creating-a-kubernetes-instance","permalink":"/docs/lima/creating-a-kubernetes-instance","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/lima/creating-a-kubernetes-instance.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"kubernetes","permalink":"/docs/tags/kubernetes"},{"inline":true,"label":"onboarding","permalink":"/docs/tags/onboarding"},{"inline":true,"label":"linux","permalink":"/docs/tags/linux"},{"inline":true,"label":"macOS","permalink":"/docs/tags/mac-os"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"Lima instance for Kubernetes","description":"Podman Desktop can assist you to create a custom Lima instance on Linux and macOS.","tags":["podman-desktop","kubernetes","onboarding","linux","macOS"],"keywords":["podman desktop","kubernetes","lima","onboarding","linux","macos"]},"sidebar":"mySidebar","previous":{"title":"Lima instance for containers","permalink":"/docs/lima/creating-a-lima-instance"},"next":{"title":"Customizing Lima instance","permalink":"/docs/lima/customizing"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/lima/creating-a-kubernetes-instance.md


const frontMatter = {
	sidebar_position: 3,
	title: 'Lima instance for Kubernetes',
	description: 'Podman Desktop can assist you to create a custom Lima instance on Linux and macOS.',
	tags: [
		'podman-desktop',
		'kubernetes',
		'onboarding',
		'linux',
		'macOS'
	],
	keywords: [
		'podman desktop',
		'kubernetes',
		'lima',
		'onboarding',
		'linux',
		'macos'
	]
};
const contentTitle = 'Creating a Lima instance for Kubernetes workloads with Podman Desktop';

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
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "creating-a-lima-instance-for-kubernetes-workloads-with-podman-desktop",
        children: "Creating a Lima instance for Kubernetes workloads with Podman Desktop"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To use the Lima provider you need a Lima instance running a Linux machine."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "In the future, Podman Desktop might be able to create Lima instances."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Consider creating a custom Lima instance to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Control the assigned resources: CPUs, memory, and disk size."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Control which Kubernetes distribution (", (0,jsx_runtime.jsx)(_components.code, {
          children: "template"
        }), ") to install."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsxs)(_components.a, {
          href: "/docs/lima/installing",
          children: ["Install the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "lima"
          }), " CLI"]
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "In a terminal, create the Lima instance."
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["To create a single-node Kubernetes cluster running ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://k3s.io/",
                children: "k3s"
              }), ":"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ limactl start template://k3s\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["To create a single-node Kubernetes cluster running ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://k8s.io/",
                children: "k8s"
              }), ":"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ limactl start template://k8s\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["To select the number of CPUs, the memory, and the disk size, add the options to the ", (0,jsx_runtime.jsx)(_components.code, {
                children: "limactl start"
              }), " command:"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "--cpus=4 --memory=4 --disk=100\n"
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Wait for the instance to start, and restart the Lima extension."
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
                children: [(0,jsx_runtime.jsx)(Icon, {
                  icon: "fa-solid fa-cog",
                  size: "lg"
                }), " Settings > Preferences > Extension: Lima"]
              }), " to change the instance name and type."]
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                  children: "k3s"
                }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Type: kubernetes"
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["Name: k3s\n", (0,jsx_runtime.jsx)(_components.img, {
                      alt: "Lima preferences k3s",
                      src: (__webpack_require__(98730)/* ["default"] */ .A) + "",
                      width: "633",
                      height: "211"
                    })]
                  }), "\n"]
                }), "\n"]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                  children: "k8s"
                }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Type: kubernetes"
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["Name: k8s\n", (0,jsx_runtime.jsx)(_components.img, {
                      alt: "Lima preferences k8s",
                      src: (__webpack_require__(67503)/* ["default"] */ .A) + "",
                      width: "637",
                      height: "205"
                    })]
                  }), "\n"]
                }), "\n"]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
                children: [(0,jsx_runtime.jsx)(Icon, {
                  icon: "fa-solid fa-cog",
                  size: "lg"
                }), " Settings > Extensions > Lima"]
              }), " to disable or enable the extension after changes."]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["When the installation is done, the location of the KUBECONFIG file is printed. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kubernetes/existing-kubernetes",
            children: "Configuring access to a Kubernetes cluster"
          }), "."]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
              children: [(0,jsx_runtime.jsx)(Icon, {
                icon: "fa-solid fa-cog",
                size: "lg"
              }), " Settings > Preferences > Kubernetes"]
            }), " to set the path of the file."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Use the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "kubectl.lima"
          }), " wrapper script to connect to the cluster:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ kubectl.lima version\n"
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ },

/***/ 98730
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/lima-preferences-k3s-f3a4e45ffed36f9745abbcb886be432e.png");

/***/ },

/***/ 67503
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/lima-preferences-k8s-57f8cf79ea9d3cad25160eac58b78484.png");

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