"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[83363],{

/***/ 55529:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_10_29_creating_an_extension_md_252_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_10_29_creating_an_extension_md_252_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6850);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Introduction to Podman Desktop extensions',
	description: 'Learn how to create and customize your own extension for Podman Desktop',
	slug: 'extensions-introduction',
	authors: [
		'cdrage'
	],
	tags: [
		'podman-desktop',
		'release',
		'podman',
		'extension',
		'plugin'
	],
	hide_table_of_contents: false
};
const contentTitle = 'How to create your first extension';

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Introduction to extensions",
  "id": "introduction-to-extensions",
  "level": 2
}, {
  "value": "Getting started with your project",
  "id": "getting-started-with-your-project",
  "level": 2
}, {
  "value": "Adding UI components",
  "id": "adding-ui-components",
  "level": 2
}, {
  "value": "Working with icons",
  "id": "working-with-icons",
  "level": 3
}, {
  "value": "Menus and navigation",
  "id": "menus-and-navigation",
  "level": 3
}, {
  "value": "Adding and configuring commands",
  "id": "adding-and-configuring-commands",
  "level": 2
}, {
  "value": "Setting up onboarding workflows",
  "id": "setting-up-onboarding-workflows",
  "level": 2
}, {
  "value": "Configuration settings",
  "id": "configuration-settings",
  "level": 2
}, {
  "value": "Publishing your extension",
  "id": "publishing-your-extension",
  "level": 2
}, {
  "value": "Conclusion",
  "id": "conclusion",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h2: "h2",
    h3: "h3",
    img: "img",
    p: "p",
    strong: "strong",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "programming",
        src: (__webpack_require__(15144)/* ["default"] */ .A) + "",
        width: "1216",
        height: "832"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Extensions are a powerful tool to customize and extend the functionality of Podman Desktop. Whether you want to add new container management features, streamline current workflows, or create custom UI elements specific to your tech stack, building extensions allows you to tailor the Podman Desktop experience to your specific needs."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In this guide, we'll introduce how you can build your own Podman Desktop extension, with links to detailed documentation that covers each part of the process."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "introduction-to-extensions",
      children: "Introduction to extensions"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Extensions are abundant in Podman Desktop and can be found in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Extensions -> Catalog"
      }), " section."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "extension catalog",
        src: (__webpack_require__(48094)/* ["default"] */ .A) + "",
        width: "1162",
        height: "812"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Each extension expands on Podman Desktop, such as providing ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-minikube",
        children: "Kubernetes development clusters with Minikube"
      }), " or even ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-layers-explorer",
        children: "analyzing your image layers"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Below is an example of the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-layers-explorer",
        children: "layers explorer extension"
      }), " and how it integrates into Podman Desktop:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "layers_explorer",
        src: (__webpack_require__(7423)/* ["default"] */ .A) + "",
        width: "1101",
        height: "746"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "getting-started-with-your-project",
      children: "Getting started with your project"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The first step in creating your extension is setting up the project environment. To learn how to configure the project and add basic components, check out the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/templates",
          children: "Templates for creating an extension"
        })
      }), " guide, which walks you through initializing your project from an official template."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "adding-ui-components",
      children: "Adding UI components"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["One of the most common tasks when creating an extension is adding a user interface. Whether it’s adding buttons, panels, or icons, UI components help make your extension more interactive and accessible. Adding a UI component is totally optional and an extension can be ran without UI components. Learn more about this in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/adding-ui-components",
          children: "Adding UI components"
        })
      }), " documentation, where you’ll find instructions on creating and integrating components into the application’s UI."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "working-with-icons",
      children: "Working with icons"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Icons are a great way to make your extension more visually unique. You can learn how to add and style custom icons by following the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/adding-icons",
          children: "Adding icons"
        })
      }), " documentation."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Below is an example of how the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-bootc",
        children: "bootc extension"
      }), " added icons to the image list within Podman Desktop:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "icons",
        src: (__webpack_require__(99701)/* ["default"] */ .A) + "",
        width: "650",
        height: "303"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "menus-and-navigation",
      children: "Menus and navigation"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Extensions often integrate with existing menus and navigation to offer users easy access to new commands and features. If you want to add items to the context menu, explore the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/menu",
          children: "Menu configuration"
        })
      }), " documentation, which explains how to add commands to menus and control when they are displayed using When Clauses."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Below is an example of how the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-bootc",
        children: "bootc extension"
      }), " added a new menu command to image list:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "menus",
        src: (__webpack_require__(67123)/* ["default"] */ .A) + "",
        width: "338",
        height: "335"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "adding-and-configuring-commands",
      children: "Adding and configuring commands"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Commands are the backbone of most extensions, allowing users to interact with the application and trigger specific actions."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["If you need to define and register custom commands, the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/commands",
          children: "Commands"
        })
      }), " guide will show you how to create commands that respond to user actions or input, and tie them into your extension’s workflow."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["You can also configure these commands to appear in different contexts. Check out the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/when-clause-context",
          children: "When clause Contexts"
        })
      }), " documentation to learn more about restricting commands to specific scenarios."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Commands are heavily influenced by ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://code.visualstudio.com/api/extension-guides/command",
        children: "VS Code commands"
      }), " and can be configured similarly. See our ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/docs/extensions/developing/commands",
        children: "commands guide"
      }), " for more information."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "setting-up-onboarding-workflows",
      children: "Setting up onboarding workflows"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Creating a smooth onboarding experience is essential to help users get started with your extension. This includes steps for CLI binary installations or other initial setup values."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["You can provide guidance, tutorials, or initial setup steps using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/onboarding-workflow",
          children: "Onboarding workflow"
        })
      }), " guide."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Below is an example of how the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/tree/main/extensions/compose",
        children: "built-in compose extension"
      }), " adds onboarding for the compose CLI binary installation:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "compose",
        src: (__webpack_require__(41235)/* ["default"] */ .A) + "",
        width: "1089",
        height: "732"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "configuration-settings",
      children: "Configuration settings"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Once you’ve built your components and commands, you may want to setup configuration settings for advanced usage of your extension."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/developing/config",
          children: "Configuration"
        })
      }), " documentation outlines the configuration file structure and how to link everything together to use user-specific values."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "publishing-your-extension",
      children: "Publishing your extension"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Publishing enables users to install your extension, you can compile your extension into a container image for users to easily consume. Follow the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/extensions/publish",
          children: "Publishing"
        })
      }), " guide to learn how to distribute your extension."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Creating an extension opens up endless possibilities to customize Podman Desktop to your specific needs."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "It is also easy to package and publish your extension for others to use."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Have fun exploring our documentation on how to create an extension and happy coding!"
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

/***/ 41235:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/compose-cdb352311ae2e5b0a11abed0c453cad0.png");

/***/ }),

/***/ 99701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/icons-028efaf19e6ee9bd9d80663291e769d2.png");

/***/ }),

/***/ 7423:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/layers_explorer-77d579b2b326abd827d0a4b387c81eaf.png");

/***/ }),

/***/ 67123:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/menus-5ad42625f5a4db388f5132fa7f80191d.png");

/***/ }),

/***/ 15144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/programming-1923c2fcee3941601e7ed222868ca6e2.png");

/***/ }),

/***/ 48094:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-catalog-8deddd045f1962b11c4940adb67075a8.png");

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

/***/ 6850:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/extensions-introduction","source":"@site/blog/2024-10-29-creating-an-extension.md","title":"Introduction to Podman Desktop extensions","description":"Learn how to create and customize your own extension for Podman Desktop","date":"2024-10-29T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"release","permalink":"/blog/tags/release"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"extension","permalink":"/blog/tags/extension"},{"inline":true,"label":"plugin","permalink":"/blog/tags/plugin"}],"readingTime":4,"hasTruncateMarker":false,"authors":[{"name":"Charlie Drage","title":"Software Engineer","url":"https://github.com/cdrage","imageURL":"https://github.com/cdrage.png","key":"cdrage","page":null}],"frontMatter":{"title":"Introduction to Podman Desktop extensions","description":"Learn how to create and customize your own extension for Podman Desktop","slug":"extensions-introduction","authors":["cdrage"],"tags":["podman-desktop","release","podman","extension","plugin"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.14 Release","permalink":"/blog/podman-desktop-release-1.14"},"nextItem":{"title":"Podman Desktop 1.13 Release","permalink":"/blog/podman-desktop-release-1.13"}}');

/***/ })

}]);