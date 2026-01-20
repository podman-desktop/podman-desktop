"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[68144],{

/***/ 9306
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/more-details-link-8b6c9a3a32d4b0e93c5ab1bd07965a59.png");

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

/***/ 48891
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_install_using_extension_md_fe4_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-install-using-extension-md-fe4.json
const site_docs_extensions_install_using_extension_md_fe4_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/install/using-extension","title":"Usage","description":"Use extensions for daily development tasks","source":"@site/docs/extensions/install/using-extension.md","sourceDirName":"extensions/install","slug":"/extensions/install/using-extension","permalink":"/docs/extensions/install/using-extension","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/install/using-extension.md","tags":[{"inline":true,"label":"using-extensions-for-development-tasks","permalink":"/docs/tags/using-extensions-for-development-tasks"}],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"title":"Usage","description":"Use extensions for daily development tasks","keywords":["podman desktop","podman","extensions"],"tags":["using-extensions-for-development-tasks"]},"sidebar":"mySidebar","previous":{"title":"Installing","permalink":"/docs/extensions/install/"},"next":{"title":"Templates","permalink":"/docs/extensions/templates/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/install/using-extension.md


const frontMatter = {
	sidebar_position: 2,
	title: 'Usage',
	description: 'Use extensions for daily development tasks',
	keywords: [
		'podman desktop',
		'podman',
		'extensions'
	],
	tags: [
		'using-extensions-for-development-tasks'
	]
};
const contentTitle = 'Using extensions for development tasks';

const assets = {

};



const toc = [];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    em: "em",
    h1: "h1",
    header: "header",
    img: "img",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "using-extensions-for-development-tasks",
        children: "Using extensions for development tasks"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop provides a wide range of extensions that can be used to integrate your local tools with the UI. By installing extensions, you can customize your development capabilities based on your needs. For example, if you want to run a Minikube cluster, you can install the Minikube extension. List of extensions available:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Engine extensions"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Podman: Handles creation and monitoring of Podman machines. It connects to the Podman socket so that you can see containers, images, volumes, and other resources in the Podman Desktop UI. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/podman",
            children: "Podman"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Docker: Auto-registers the socket to Podman Desktop if any Docker engine is running on your machine. After registeration, you can monitor containers, images, volumes, and other resources from the UI. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/migrating-from-docker",
            children: "Migrating from Docker"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Kubernetes extensions"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Kind: Enables creating a Kubernetes cluster that you can run on a Podman engine. As a prerequisite, you must install the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "kind"
          }), " binary before using the extension. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kind",
            children: "Kind"
          }), " and ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/tutorial/deploying-a-kubernetes-application",
            children: "Tutorial- Deploying a Kubernetes application"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Minikube: Enables creating a Kubernetes cluster that you can run on a Podman engine. As a prerequisite, you must install the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "minikube"
          }), " binary before using the extension. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/minikube",
            children: "Minikube"
          }), " and ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/tutorial/running-a-kubernetes-cluster",
            children: "Tutorial- Running a Kubernetes cluster"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Lima: Enables creating a Lima virtual machine that you can run on a Podman engine. As a prerequisite, you must install the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "lima"
          }), " binary before using the extension. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/lima",
            children: "Lima"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Kube Context: Enables viewing and changing the current kubernetes context. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
            children: "Viewing and selecting Kubernetes context"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Headlamp: Enables creating an extensible Kubernetes web UI. For more details, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "More details"
          }), " link in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Catalog"
          }), " tab of the Extensions page."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "more details link",
            src: (__webpack_require__(9306)/* ["default"] */ .A) + "",
            width: "1404",
            height: "544"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "CLI extensions"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Compose: Enables setting up ", (0,jsx_runtime.jsx)(_components.code, {
            children: "compose"
          }), " binary so that you can run ", (0,jsx_runtime.jsx)(_components.code, {
            children: "podman compose"
          }), " commands. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/compose",
            children: "Compose"
          }), " and ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/tutorial/getting-started-with-compose",
            children: "Getting started with Compose"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Kubectl CLI: Enables setting up ", (0,jsx_runtime.jsx)(_components.code, {
            children: "kubectl"
          }), " binary so that you can run ", (0,jsx_runtime.jsx)(_components.code, {
            children: "kubectl"
          }), " commands. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/tutorial/managing-your-application-resources#managing-other-resources",
            children: "Managing your CLI tools"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Red Hat extensions"
        })
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Red Hat extension pack is a set of the following extensions that a developer can use for authentication and development purposes:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Podman AI Lab: Enables working and experimenting with Large Language Models (LLMs) in your local development environment. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/ai-lab",
            children: "Running LLMs locally"
          }), " and ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/tutorial/running-an-ai-application",
            children: "Tutorial- Running an AI application"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Bootable containers: Enables building a bootable disk image from your container image. For more details, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "More details"
          }), " link in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Catalog"
          }), " tab of the Extensions page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Red Hat Account Extension: Enables you to sign in with Red Hat Single Sign-On (SSO). You can consume Red Hat content, such as RHEL container images and RPM packages without any cost. For more details, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "More details"
          }), " link in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Catalog"
          }), " tab of the Extensions page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["OpenShift Local: Enables running a Red Hat OpenShift Local cluster. You can manage the cluster configuration and run an application on the cluster from the UI. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/openshift/openshift-local",
            children: "Creating an OpenShift Local instance"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Developer Sandbox: Enables deploying your application to a shared-OpenShift Container Platform (OCP) cluster for 30 days without any cost. After configuring a sandbox environment, you can switch to the developer sandbox context and perform tasks, such as deploying a pod or container from the UI. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/openshift/developer-sandbox",
            children: "Configuring access to a developer sandbox"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["OpenShift Checker: Analyzes a Containerfile and highlights the directives and commands that could cause an unexpected behavior when you run it on an OCP cluster. After identifying issues, you can update your Containerfile to make it OpenShift-compliant. For more details, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "More details"
          }), " link in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Catalog"
          }), " tab of the Extensions page."]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "You can also install the above extensions individually from the catalog rather than installing the entire pack."
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Other extensions"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Registries: Provides some default registries so that you can connect to them with your credentials. See ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/containers/registries",
            children: "Managing registries"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Image Layers Explorer: Use this extension to explore and analyze different layers of the container image. For more details, click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "More details"
          }), " link in the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Catalog"
          }), " tab of the Extensions page."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Custom extensions"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can also create your own customized extension using ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/templates",
        children: "these templates"
      }), ". For more details, see ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing",
        children: "Developing a Podman Desktop extension"
      }), " and ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/publish",
        children: "Publishing a Podman Desktop extension"
      }), "."]
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



/***/ }

}]);