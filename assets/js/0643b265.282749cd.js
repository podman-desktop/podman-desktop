"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[22213],{

/***/ 42132:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_08_25_podman_desktop_availability_on_rhel_10_md_064_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_08_25_podman_desktop_availability_on_rhel_10_md_064_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7000);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Simplifying container and AI development on RHEL 10',
	description: 'Simplifying container and AI development on RHEL 10 with Podman Desktop',
	slug: 'podman-desktop-availability-on-rhel10',
	authors: [
		'shipsing'
	],
	tags: [
		'podman-desktop',
		'podman',
		'rhel10',
		'installation'
	],
	hide_table_of_contents: false
};
const contentTitle = 'Simplifying container and AI development on RHEL 10';

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Podman: The foundation",
  "id": "podman-the-foundation",
  "level": 2
}, {
  "value": "Podman Desktop: A crucial component for developers on RHEL",
  "id": "podman-desktop-a-crucial-component-for-developers-on-rhel",
  "level": 2
}, {
  "value": "Podman AI Lab: Simplifying the AI developer workflow on RHEL",
  "id": "podman-ai-lab-simplifying-the-ai-developer-workflow-on-rhel",
  "level": 2
}, {
  "value": "Availability and installation on RHEL 10",
  "id": "availability-and-installation-on-rhel-10",
  "level": 2
}, {
  "value": "Important note on support",
  "id": "important-note-on-support",
  "level": 3
}, {
  "value": "Get involved: Your feedback matters!",
  "id": "get-involved-your-feedback-matters",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    em: "em",
    h2: "h2",
    h3: "h3",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In the ever-evolving world of containerization and AI, developers require tools that are designed for seamless integration into their daily workflows. Podman and its graphical tool, Podman Desktop, have emerged as promising tools for building applications on different platforms, including Red Hat Enterprise Linux (RHEL) 10."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "podman-the-foundation",
      children: "Podman: The foundation"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman offers an efficient way to interact with containers and Kubernetes. It is fast and light-weight and operates with a daemonless architecture. Podman supports rootless containers, allowing you to restrict privileges without compromising functionality. Developers can pull, build, and push images, run and debug containers, and efficiently work with Kubernetes. Podman integrates smoothly with systemd, offering basic container orchestration capabilities like pod management and Quadlet systemd generation."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "podman-desktop-a-crucial-component-for-developers-on-rhel",
      children: "Podman Desktop: A crucial component for developers on RHEL"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman Desktop significantly enhances the Podman experience by providing a user-friendly interface that simplifies container and Kubernetes management. It provides a streamlined experience for building, running, and managing containers and pods. It also offers robust Kubernetes integration, enabling you to create local clusters with tools like Kind and Minikube.\nPodman Desktop simplifies the local development environment by tackling challenges like complexity, skill gaps, and inconsistencies between local and production deployments. It provides a simple onboarding process, guiding developers to move from individual applications to containers, pods, and finally to Kubernetes."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop provides the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/docs/migrating-from-docker",
        children: "Docker compatibility"
      }), " feature to support Dockerfiles and Compose, which minimizes the need for configuration changes. It allows for easy migration from Docker to Podman and even lets you run ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "docker"
      }), " commands that Podman interprets.\nPodman is included with a RHEL subscription. When you install Podman Desktop from the RHEL extensions repository, Podman Desktop detects Podman and runs it to provide a simplified integration between these two tools. For developers building applications on RHEL, the integration is beneficial in providing:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Standardized container environment: Use a consistent set of tools and practices, simplifying management and deployment of containers in production."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Cross-platform consistency: Enjoy a familiar experience across Windows, macOS, and RHEL."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Support for several RHEL extensions: A variety of extensions available within Podman Desktop to enhance RHEL developer workflows with key functionalities:", "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
          children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
            children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://github.com/podman-desktop/extension-bootc",
              children: "Bootable Container"
            }), ": Create bootable container images for bare metal, AWS, and other environments. For more details, refer to this ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://developers.redhat.com/learn/rhel/build-and-run-bootable-container-image-image-mode-rhel-and-podman-desktop",
              children: "learning path"
            }), "."]
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
            children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://github.com/redhat-developer/podman-desktop-rhel-ext",
              children: "RHEL VMs"
            }), ": Easily run and manage RHEL VMs from a macOS or Windows environment."]
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
            children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://github.com/redhat-developer/podman-desktop-redhat-lightspeed-ext",
              children: "RHEL Lightspeed"
            }), ": An AI assistant that simplifies Linux administration and management. It enables interaction with RHEL using plain language and provides recommendations for troubleshooting and tuning."]
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
            children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://github.com/redhat-developer/podman-desktop-redhat-account-ext",
              children: "Red Hat Authentication"
            }), ": Streamline authentication to Red Hat, access the Red Hat container registry, and register Linux VMs, often through a no-cost Red Hat developer subscription."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "podman-ai-lab-simplifying-the-ai-developer-workflow-on-rhel",
      children: "Podman AI Lab: Simplifying the AI developer workflow on RHEL"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The Podman AI Lab extension is helpful for AI developers working within the RHEL ecosystem. It empowers you to run Large Language Models (LLMs) locally, simplifying the development and debugging of AI-enabled applications directly on your machine. This approach offers several benefits, including data privacy, cost control, and the ability to test and debug applications in a local environment. The extension simplifies the AI application development workflow by providing:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "A curated catalog of open-source models available for downloading."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "A playground environment for experimenting with models and customizing prompts."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "A recipe catalog with sample AI use cases."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "An integration with LlamaStack from your local environment, run containerized distributions, and access LlamaStack APIs."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Code snippets for various languages and frameworks, simplifying the infusion of AI into your applications."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "An inference server to serve models locally with an OpenAI-compatible API."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This enables developers to easily get started with generative AI and integrate models into their applications."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "availability-and-installation-on-rhel-10",
      children: "Availability and installation on RHEL 10"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["With Podman Desktop availability in the RHEL extensions repository channel, you can easily download and use it. This repository is a curated collection of modern developer tools, open-source libraries, and specialized utilities, ensuring reliable, up-to-date, and Red Hat-signed software.\nFor installation, you need a RHEL 10 machine that is registered with the subscription manager using either your ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/getting_started_with_rhel_system_registration/basic-reg-rhel-cli#proc-reg-rhel-rhc-username_",
        children: "account details"
      }), " or an ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/getting_started_with_rhel_system_registration/basic-reg-rhel-cli#proc-reg-rhel-rhc-act-key_",
        children: "activation key"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The installation and verification procedure includes:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Open a terminal, and enable the RHEL extensions repository:"
        }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            className: "language-sh",
            children: "$ sudo subscription-manager repos --enable rhel-10-for-$(arch)-extensions-rpms\n"
          })
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Enter your password when prompted."
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Install Podman Desktop:"
        }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            className: "language-sh",
            children: "$ sudo dnf install podman-desktop\n"
          })
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Enter ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "y"
          }), " to confirm the installed size."]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Enter ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "y"
          }), " to import the GPG key and complete the installation."]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Enter Podman Desktop in the search box at the top of your home screen, and click the application to open it."
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Follow the prompts to complete a quick onboarding process with the application.\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
            alt: "Screenshot of Podman Desktop on RHEL 10",
            src: (__webpack_require__(3401)/* ["default"] */ .A) + "",
            width: "2272",
            height: "1362"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Run basic tasks, such as:"
        }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
          children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
            children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "/docs/containers/starting-a-container",
              children: "Start a container"
            })
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
            children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "/docs/kubernetes/creating-a-kube-cluster",
              children: "Create a Kubernetes cluster"
            })
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "important-note-on-support",
      children: "Important note on support"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop is an open-source community project. While Podman itself has supported options on RHEL, the support model for Podman Desktop for Red Hat customers falls under ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://source.redhat.com/groups/public/cooperative_community_support",
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "Cooperative Community Support"
        })
      }), ". This means it is intended for non-production support and only offers benefits from community contributions, though with no or limited Service Level Agreements (SLAs). Entitled customers can use this level of support to raise non-production queries and open tickets for more complex issues."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "get-involved-your-feedback-matters",
      children: "Get involved: Your feedback matters!"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman Desktop is an evolving project, and your feedback is crucial for its continued development and improvement. We encourage you to:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Provide feedback: Share your experiences and suggestions for shaping the future of the project. Use the Share your feedback icon in the taskbar to give quick feedback."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Create issues: If you encounter a bug or have a feature request, please create an issue on the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/podman-desktop/issues",
          children: "GitHub repository"
        }), "."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Join the community: Engage with fellow developers and maintainers, ask questions, and share your knowledge. You can find us on ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/podman-desktop",
          children: "GitHub"
        }), " and contribute to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://podman-desktop.io/community",
          children: "community discussions"
        }), "."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["For more information, visit ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman.io",
        children: "Podman"
      }), " and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/",
        children: "Podman Desktop"
      }), ". Dive in, explore, and help us continue to build a robust and user-friendly experience for container and AI development on RHEL 10!"]
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return MDXLayout ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout, {
    ...props,
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}



/***/ }),

/***/ 3401:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-desktop-availability-on-rhel-10-aba50337caedc54961caf8565cec3fb6.png");

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


/***/ }),

/***/ 7000:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/podman-desktop-availability-on-rhel10","source":"@site/blog/2025-08-25-podman-desktop-availability-on-rhel10.md","title":"Simplifying container and AI development on RHEL 10","description":"Simplifying container and AI development on RHEL 10 with Podman Desktop","date":"2025-08-25T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"rhel10","permalink":"/blog/tags/rhel-10"},{"inline":true,"label":"installation","permalink":"/blog/tags/installation"}],"readingTime":5.75,"hasTruncateMarker":false,"authors":[{"name":"Shipra Singh","title":"Tech writer","url":"https://github.com/shipsing","imageURL":"https://github.com/shipsing.png","key":"shipsing","page":null}],"frontMatter":{"title":"Simplifying container and AI development on RHEL 10","description":"Simplifying container and AI development on RHEL 10 with Podman Desktop","slug":"podman-desktop-availability-on-rhel10","authors":["shipsing"],"tags":["podman-desktop","podman","rhel10","installation"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop Apple Container Extension: List Containers & Images on macOS","permalink":"/blog/apple-container-extension"},"nextItem":{"title":"Podman Desktop 1.21 Release","permalink":"/blog/podman-desktop-release-1.21"}}');

/***/ })

}]);