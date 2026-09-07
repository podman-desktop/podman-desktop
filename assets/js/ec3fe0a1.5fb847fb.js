"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[78165],{

/***/ 23777
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_tray_menu_md_ec3_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-tray-menu-md-ec3.json
const site_docs_extensions_developing_tray_menu_md_ec3_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/tray-menu","title":"Tray menu","description":"Adding items to the system tray menu","source":"@site/docs/extensions/developing/tray-menu.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/tray-menu","permalink":"/docs/extensions/developing/tray-menu","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/tray-menu.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","sidebarPosition":8,"frontMatter":{"sidebar_position":8,"title":"Tray menu","description":"Adding items to the system tray menu","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension","tray","menu"]},"sidebar":"mySidebar","previous":{"title":"Progress tasks","permalink":"/docs/extensions/developing/progress-tasks"},"next":{"title":"CLI tools","permalink":"/docs/extensions/developing/cli-tools"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/tray-menu.md


const frontMatter = {
	sidebar_position: 8,
	title: 'Tray menu',
	description: 'Adding items to the system tray menu',
	tags: [
		'podman-desktop',
		'extension'
	],
	keywords: [
		'podman desktop',
		'extension',
		'tray',
		'menu'
	]
};
const contentTitle = 'Tray menu';

const assets = {

};



const toc = [{
  "value": "Registering a menu item",
  "id": "registering-a-menu-item",
  "level": 2
}, {
  "value": "Creating a submenu",
  "id": "creating-a-submenu",
  "level": 2
}, {
  "value": "Menu item properties",
  "id": "menu-item-properties",
  "level": 3
}, {
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 2
}, {
  "value": "Verification",
  "id": "verification",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "tray-menu",
        children: "Tray menu"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Extensions can add items and submenus to the Podman Desktop system tray icon menu, giving users quick access to extension commands without opening the main window."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "registering-a-menu-item",
      children: "Registering a menu item"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionApi.tray.registerMenuItem()"
      }), " to add an entry. The item's ", (0,jsx_runtime.jsx)(_components.code, {
        children: "id"
      }), " must match a registered command:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "import * as extensionApi from '@podman-desktop/api';\n\nconst trayItem = extensionApi.tray.registerMenuItem({\n  id: 'my-extension.openDashboard',\n  label: 'Open Dashboard',\n  type: 'normal',\n});\nextensionContext.subscriptions.push(trayItem);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When the user clicks the tray entry, Podman Desktop invokes the command with the matching ", (0,jsx_runtime.jsx)(_components.code, {
        children: "id"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-submenu",
      children: "Creating a submenu"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Group related actions under a single submenu using ", (0,jsx_runtime.jsx)(_components.code, {
        children: "type: 'submenu'"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const traySubmenu = extensionApi.tray.registerMenuItem({\n  id: 'my-extension.tray',\n  type: 'submenu',\n  label: 'My Extension',\n  submenu: [\n    { id: 'my-extension.openDashboard', label: 'Open Dashboard', type: 'normal' },\n    { id: 'my-extension.stopAll', label: 'Stop All', type: 'normal' },\n  ],\n});\nextensionContext.subscriptions.push(traySubmenu);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "menu-item-properties",
      children: "Menu item properties"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Property"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Type"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Description"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "id"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Command ID to execute on click (must be a registered command)"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "label"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Text displayed in the tray menu"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "type"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "'normal'"
            }), " or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "'submenu'"
            })]
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Whether this is a clickable item or a submenu container"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "submenu"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "MenuItem[]"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Child items (only when ", (0,jsx_runtime.jsx)(_components.code, {
              children: "type"
            }), " is ", (0,jsx_runtime.jsx)(_components.code, {
              children: "'submenu'"
            }), ")"]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The commands referenced by tray menu ", (0,jsx_runtime.jsx)(_components.code, {
        children: "id"
      }), " fields must be registered before the tray item is created:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "extensionContext.subscriptions.push(\n  extensionApi.commands.registerCommand('my-extension.openDashboard', () => {\n    panel.reveal();\n  }),\n);\n\nextensionContext.subscriptions.push(\n  extensionApi.commands.registerCommand('my-extension.stopAll', async () => {\n    await stopAllOperations();\n    extensionApi.window.showInformationMessage('All operations stopped.');\n  }),\n);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Build and load your extension."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Right-click (or click, depending on OS) the Podman Desktop tray icon."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Verify your menu items or submenu appear and execute the correct commands."
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