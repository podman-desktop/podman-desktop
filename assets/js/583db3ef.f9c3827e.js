"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[96549],{

/***/ 40120
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_index_md_583_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-index-md-583.json
const site_docs_extensions_index_md_583_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/index","title":"Extensions","description":"Installing, developing, or publishing extensions.","source":"@site/docs/extensions/index.md","sourceDirName":"extensions","slug":"/extensions/","permalink":"/docs/extensions/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/index.md","tags":[{"inline":true,"label":"podman-desktop-extensions","permalink":"/docs/tags/podman-desktop-extensions"},{"inline":true,"label":"building-an-extension","permalink":"/docs/tags/building-an-extension"}],"version":"current","sidebarPosition":110,"frontMatter":{"sidebar_position":110,"title":"Extensions","description":"Installing, developing, or publishing extensions.","keywords":["podman desktop","podman","extension"],"tags":["podman-desktop-extensions","building-an-extension"]},"sidebar":"mySidebar","previous":{"title":"MicroShift","permalink":"/docs/openshift/microshift/"},"next":{"title":"Installing","permalink":"/docs/extensions/install/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/index.md


const frontMatter = {
	sidebar_position: 110,
	title: 'Extensions',
	description: 'Installing, developing, or publishing extensions.',
	keywords: [
		'podman desktop',
		'podman',
		'extension'
	],
	tags: [
		'podman-desktop-extensions',
		'building-an-extension'
	]
};
const contentTitle = 'Podman Desktop extensions';

const assets = {

};



const toc = [{
  "value": "Architecture",
  "id": "architecture",
  "level": 2
}, {
  "value": "What can a Podman Desktop extension do?",
  "id": "what-can-a-podman-desktop-extension-do",
  "level": 2
}, {
  "value": "How to build an extension",
  "id": "how-to-build-an-extension",
  "level": 2
}, {
  "value": "Next Steps",
  "id": "next-steps",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    header: "header",
    img: "img",
    li: "li",
    p: "p",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "podman-desktop-extensions",
        children: "Podman Desktop extensions"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Extensions are designed to be modular and easily pluggable into Podman Desktop. They allow you to use and manipulate a wide range of Podman Desktop functionalities ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/api",
        children: "via our API"
      }), ". Not only can you customize every component of Podman Desktop, but you can also extend its functionality with these extensions."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With extensions, you can add:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Support for container engines, such as Podman or Docker."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Virtual machine integrations, such as Lima."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Podman Desktop extension points, including tray icon menus, status bar items, icons, menus, and commands."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Integration with third-party tools, such as Kind or Compose."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can view a complete list of the extensions and their details on the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/extensions",
        children: "website"
      }), " and install them for use."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "architecture",
      children: "Architecture"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Below is an example of the architecture for the \"Podman\" extension that integrates with Podman Desktop:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "architecture",
        src: (__webpack_require__(25164)/* ["default"] */ .A) + "",
        width: "596",
        height: "648"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Each extension is isolated and communicates entirely through the Podman Desktop API, ensuring modularity and extensibility for Podman Desktop."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "what-can-a-podman-desktop-extension-do",
      children: "What can a Podman Desktop extension do?"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Here are some examples of what you can achieve with the Podman Desktop extension API:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/onboarding-workflow",
          children: "Create your own onboarding workflow."
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/commands",
          children: "Add non-native Podman Desktop commands."
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/config",
          children: "Create configuration settings for your extension."
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/menu",
          children: "Add menus to areas, such as pushing images."
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The possibilities are endless. You can leverage ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/api",
        children: "our API"
      }), " to expand your extension's capabilities even further."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "how-to-build-an-extension",
      children: "How to build an extension"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To help you get started, we've provided templates ranging from a minimal \"Hello World\" example to a full web-view extension."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Here are some examples from ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/templates",
        children: "our templates documentation"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/extension-template-minimal",
          children: "Basic \"Hello World\" example"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/extension-template-webview",
          children: "Simple webview template"
        }), ". See the code for the published Podman Desktop extensions that use this template:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/podman-desktop/podman-desktop/tree/main/extensions/kind/src",
              children: "Kind"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/podman-desktop/podman-desktop/tree/main/extensions/compose/src",
              children: "Compose"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/podman-desktop/podman-desktop/tree/main/extensions/registries/src",
              children: "Registries"
            })
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/extension-template-full",
          children: "Full-stack webview template"
        }), ". See the code for the published Podman Desktop extensions that use this template:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/containers/podman-desktop-extension-ai-lab/tree/main/packages",
              children: "Podman AI Lab"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/podman-desktop/extension-bootc/tree/main/packages",
              children: "Bootable Containers"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/podman-desktop/extension-kreate/tree/main/packages",
              children: "Kreate"
            })
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Have questions or need assistance? Join our community on Discord for support!"
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "next-steps",
      children: "Next Steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing",
          children: "Writing a Podman Desktop extension entry point"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/publish",
          children: "Publishing a Podman Desktop extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/install",
          children: "Installing a Podman Desktop extension"
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



/***/ },

/***/ 25164
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/architecture-af9c3dd4fc496284d3e601fa3c61adaa.png");

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