"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[7832],{

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

/***/ 84113
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_openshift_developer_sandbox_index_md_fc8_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-openshift-developer-sandbox-index-md-fc8.json
const site_docs_openshift_developer_sandbox_index_md_fc8_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"openshift/developer-sandbox/index","title":"Developer Sandbox","description":"Configuring access to a Developer Sandbox","source":"@site/docs/openshift/developer-sandbox/index.md","sourceDirName":"openshift/developer-sandbox","slug":"/openshift/developer-sandbox/","permalink":"/docs/openshift/developer-sandbox/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/openshift/developer-sandbox/index.md","tags":[{"inline":true,"label":"migrating-to-kubernetes","permalink":"/docs/tags/migrating-to-kubernetes"},{"inline":true,"label":"openshift","permalink":"/docs/tags/openshift"}],"version":"current","sidebarPosition":101,"frontMatter":{"sidebar_position":101,"title":"Developer Sandbox","description":"Configuring access to a Developer Sandbox","keywords":["podman desktop","podman","containers","pods","migrating","kubernetes","openshift"],"tags":["migrating-to-kubernetes","openshift"]},"sidebar":"mySidebar","previous":{"title":"OpenShift","permalink":"/docs/openshift/"},"next":{"title":"OpenShift Local","permalink":"/docs/openshift/openshift-local/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/openshift/developer-sandbox/index.md


const frontMatter = {
	sidebar_position: 101,
	title: 'Developer Sandbox',
	description: 'Configuring access to a Developer Sandbox',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'pods',
		'migrating',
		'kubernetes',
		'openshift'
	],
	tags: [
		'migrating-to-kubernetes',
		'openshift'
	]
};
const contentTitle = 'Configuring access to a Developer Sandbox';

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
    em: "em",
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
        id: "configuring-access-to-a-developer-sandbox",
        children: "Configuring access to a Developer Sandbox"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://developers.redhat.com/developer-sandbox",
        children: "Developer Sandbox"
      }), " is a free, private OpenShift environment including one project and a resource quota of 14 GB RAM, and 40 GB storage.\nIt lasts 30 days."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can configure access to your Developer Sandbox instances."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://developers.redhat.com/register",
          children: "Register a Red Hat account"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Install the ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Developer Sandbox"
        }), " extension: go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Dashboard"
        }), ", and click ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: ["Developer Sandbox ", (0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-download",
            size: "lg"
          })]
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: [(0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-cog",
            size: "lg"
          }), " Settings > Resources"]
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Developer Sandbox"
        }), " tile, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create new"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create a Developer Sandbox"
        }), " screen, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Log into Developer Sandbox"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Open external website"
        }), " dialog, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Yes"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://developers.redhat.com/developer-sandbox",
          children: "Developer Sandbox website"
        }), ":", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Start your sandbox for free"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "If you never used this service, you might get through a verification workflow."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Login with..."
            }), " screen, click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "DevSandbox"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["In your Developer Sandbox Console, click on ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "your login name > Copy login command"
            }), " from the menu."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Login with..."
            }), " screen, click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "DevSandbox"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Display Token"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Copy the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Log in with this token"
            }), " full login command, similar to: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "oc login --token=sha256~<token> --server=https://api.sandbox-m2.<sandbox_id>.openshiftapps.com:6443"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Get back to Podman Desktop ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create a Developer Sandbox"
        }), " screen.", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Context name"
            }), ": Enter a name such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Developer Sandbox"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Login command"
            }), ": Paste the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "oc login"
            }), " command that you copied previously."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Creation"
        }), " screen displays ", (0,jsx_runtime.jsx)(_components.em, {
          children: "Successful operation"
        }), ". Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Go back to Resources"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Resources"]
          }), " screen, your Developer Sandbox is running."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Developer Sandbox is running",
            src: (__webpack_require__(89802)/* ["default"] */ .A) + "",
            width: "510",
            height: "211"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
            children: "Select your Developer Sandbox in the Podman Desktop tray"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run basic tasks such as:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kubernetes/deploying-a-pod-to-kubernetes",
              children: "Deploying a container"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kubernetes/deploying-a-pod-to-kubernetes",
              children: "Deploying a pod"
            })
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ },

/***/ 89802
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/resources-developer-sandbox-running-435054109642f996529ce6a133f1893e.png");

/***/ }

}]);