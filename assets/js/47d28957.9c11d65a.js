"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[17427],{

/***/ 19953
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_07_10_see_your_docker_containers_in_podman_desktop_md_47d_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_07_10_see_your_docker_containers_in_podman_desktop_md_47d_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76331);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);
/* harmony import */ var _theme_ThemedImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(90448);


const frontMatter = {
	title: 'See your Docker containers inside Podman Desktop',
	description: 'Install Podman Desktop alongside Docker Desktop and immediately browse your Docker containers, images, and volumes, no migration, no configuration.',
	slug: 'see-docker-containers-in-podman-desktop',
	authors: [
		'simonrey1'
	],
	tags: [
		'podman-desktop',
		'docker',
		'migrating'
	],
	hide_table_of_contents: false
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};




const toc = [{
  "value": "How it works",
  "id": "how-it-works",
  "level": 2
}, {
  "value": "What you need",
  "id": "what-you-need",
  "level": 2
}, {
  "value": "Step 1: Install and open Podman Desktop",
  "id": "step-1-install-and-open-podman-desktop",
  "level": 2
}, {
  "value": "Step 2: Check that Docker is detected",
  "id": "step-2-check-that-docker-is-detected",
  "level": 2
}, {
  "value": "Step 3: Browse your Docker containers",
  "id": "step-3-browse-your-docker-containers",
  "level": 2
}, {
  "value": "Step 4: Browse your Docker images",
  "id": "step-4-browse-your-docker-images",
  "level": 2
}, {
  "value": "What you get from this",
  "id": "what-you-get-from-this",
  "level": 2
}, {
  "value": "Running Docker and Podman side by side",
  "id": "running-docker-and-podman-side-by-side",
  "level": 2
}, {
  "value": "What&#39;s next?",
  "id": "whats-next",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Thinking about switching from Docker Desktop to Podman Desktop? You don't have to commit to anything yet. Podman Desktop ships with a built-in Docker extension that automatically detects your running Docker engine and displays all your Docker containers, images, and volumes right inside the Podman Desktop UI."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "No configuration. No migration. Just install and open."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "how-it-works",
      children: "How it works"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop is a multi-engine container management tool. Unlike Docker Desktop, which only manages Docker, Podman Desktop can connect to multiple container engines at the same time: Podman, Docker, and even ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/blog/apple-container-extension",
        children: "Apple Container"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The built-in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Docker extension"
      }), " monitors the standard Docker socket (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/run/docker.sock"
      }), " on macOS/Linux, named pipe on Windows). When it detects a running Docker daemon, it automatically registers it as a provider. From that point on, every Docker container, image, and volume appears in Podman Desktop alongside any Podman resources you might have."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "There is nothing to configure: if Docker Desktop is running, Podman Desktop sees it."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "what-you-need",
      children: "What you need"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Docker Desktop"
        }), " running with some containers or images."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Podman Desktop"
        }), ": ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://podman-desktop.io/downloads",
          children: "Download here"
        }), " for macOS, Windows, or Linux."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "That's it. You don't need Podman installed. You don't need a Podman machine. You don't need to change any settings."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "step-1-install-and-open-podman-desktop",
      children: "Step 1: Install and open Podman Desktop"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Download and install ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/downloads",
        children: "Podman Desktop"
      }), ". Launch it."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "If Podman Desktop offers to set up a Podman machine on first launch, you can skip it for now (we're only looking at Docker containers in this tutorial)."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "step-2-check-that-docker-is-detected",
      children: "Step 2: Check that Docker is detected"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Navigate to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Settings > Resources"
      }), ". You should see a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Docker"
      }), " provider listed with a \"running\" status."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_theme_ThemedImage__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      alt: "Settings > Resources showing Docker provider running",
      sources: {
        light: (__webpack_require__(2149)/* ["default"] */ .A),
        dark: (__webpack_require__(66909)/* ["default"] */ .A)
      }
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "If Docker doesn't appear, make sure Docker Desktop is running and that the Docker socket is accessible."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "step-3-browse-your-docker-containers",
      children: "Step 3: Browse your Docker containers"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Go to the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Containers"
      }), " tab. You will see all containers running in Docker, the same ones you see in Docker Desktop or with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "docker ps"
      }), ". You can:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "View container details, environment variables, and ports."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Read container logs in real time."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Open a terminal session inside a running container."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Stop, restart, or delete containers."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_theme_ThemedImage__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      alt: "Containers tab showing Docker containers",
      sources: {
        light: (__webpack_require__(4951)/* ["default"] */ .A),
        dark: (__webpack_require__(50455)/* ["default"] */ .A)
      }
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Every operation you perform here goes through the Docker engine. Podman Desktop is acting as an alternative UI for your existing Docker setup."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "step-4-browse-your-docker-images",
      children: "Step 4: Browse your Docker images"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Go to the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Images"
      }), " tab. All images pulled or built by Docker are listed. You can:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Inspect image layers and metadata."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Run a new container from any image."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Delete images you no longer need."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_theme_ThemedImage__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      alt: "Images tab showing Docker images",
      sources: {
        light: (__webpack_require__(79038)/* ["default"] */ .A),
        dark: (__webpack_require__(92116)/* ["default"] */ .A)
      }
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "what-you-get-from-this",
      children: "What you get from this"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "At this point you haven't changed anything about your Docker workflow. Docker Desktop is still your engine. But you now have:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Centralized container management"
        }), ": Podman Desktop gives you one place to view and manage containers across engines, so you can work with Docker today and Podman tomorrow without switching tools."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "A way to compare"
        }), ": When you're ready to try Podman, you can create a Podman machine and see Docker and Podman containers side by side in the same UI. This makes it easy to validate that workloads behave the same way on both engines."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "An integrated path to Kubernetes"
        }), ": As you migrate, you can move from local containers toward Kubernetes workflows in the same tool using Podman Desktop features like Kube Play."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "running-docker-and-podman-side-by-side",
      children: "Running Docker and Podman side by side"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Once you're comfortable, you can set up Podman alongside Docker:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["In Podman Desktop, go to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), " and create a Podman machine."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Pull the same image on both engines."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Both sets of containers appear in the same ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Containers"
        }), " tab, labeled by their engine."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This lets you migrate workloads one at a time, no big-bang switch required."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "whats-next",
      children: "What's next?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This was the zero-commitment first step: see your Docker world inside Podman Desktop. In upcoming posts, we'll cover:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Running your Docker Compose files with Podman"
        }), ": Use your existing ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
          children: "docker-compose.yml"
        }), " on the Podman engine."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "From Compose to Kubernetes with Podman Kube Play"
        }), ": Generate real Kubernetes manifests from your running containers and test them locally without a cluster."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Common migration gotchas"
        }), ": Rootless permissions, privileged ports, and networking differences explained with fixes."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Questions or feedback? Start a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/discussions",
        children: "discussion on GitHub"
      }), " or read the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/docs/migrating-from-docker",
        children: "migration documentation"
      }), "."]
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



/***/ },

/***/ 50455
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/docker-container-running-dark-1f7390eb17d1b0a7b8253d6787c2ff4d.png");

/***/ },

/***/ 4951
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/docker-container-running-light-6c0e08bc6bad21e80daa20c4e5fe3eeb.png");

/***/ },

/***/ 92116
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/docker-images-dark-f073bf5dc279711cfbde0bc694bda95a.png");

/***/ },

/***/ 79038
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/docker-images-light-fcd1a124ed0ff91c29998816b6832209.png");

/***/ },

/***/ 66909
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/docker-provider-running-dark-eb24502815c8a26618a3ce08c6684359.png");

/***/ },

/***/ 2149
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/docker-provider-running-light-e4e8eb028b3047e93b3918125585d038.png");

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

/***/ 76331
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/see-docker-containers-in-podman-desktop","source":"@site/blog/2026-07-10-see-your-docker-containers-in-podman-desktop.md","title":"See your Docker containers inside Podman Desktop","description":"Install Podman Desktop alongside Docker Desktop and immediately browse your Docker containers, images, and volumes, no migration, no configuration.","date":"2026-07-10T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"docker","permalink":"/blog/tags/docker"},{"inline":true,"label":"migrating","permalink":"/blog/tags/migrating"}],"readingTime":4.06,"hasTruncateMarker":true,"authors":[{"name":"Simon Rey","title":"Senior Software Engineer","url":"https://github.com/simonrey1","imageURL":"https://github.com/simonrey1.png","key":"simonrey1","page":null}],"frontMatter":{"title":"See your Docker containers inside Podman Desktop","description":"Install Podman Desktop alongside Docker Desktop and immediately browse your Docker containers, images, and volumes, no migration, no configuration.","slug":"see-docker-containers-in-podman-desktop","authors":["simonrey1"],"tags":["podman-desktop","docker","migrating"],"hide_table_of_contents":false},"unlisted":false,"nextItem":{"title":"Podman Desktop 1.28 Release","permalink":"/blog/podman-desktop-release-1.28"}}');

/***/ }

}]);