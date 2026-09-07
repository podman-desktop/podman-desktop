"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[83071],{

/***/ 46178
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_status_bar_md_f6e_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-status-bar-md-f6e.json
const site_docs_extensions_developing_status_bar_md_f6e_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/status-bar","title":"Status bar","description":"Adding status bar items to Podman Desktop","source":"@site/docs/extensions/developing/status-bar.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/status-bar","permalink":"/docs/extensions/developing/status-bar","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/status-bar.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6,"title":"Status bar","description":"Adding status bar items to Podman Desktop","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension","status bar"]},"sidebar":"mySidebar","previous":{"title":"Adding UI components","permalink":"/docs/extensions/developing/adding-ui-components"},"next":{"title":"Progress tasks","permalink":"/docs/extensions/developing/progress-tasks"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/status-bar.md


const frontMatter = {
	sidebar_position: 6,
	title: 'Status bar',
	description: 'Adding status bar items to Podman Desktop',
	tags: [
		'podman-desktop',
		'extension'
	],
	keywords: [
		'podman desktop',
		'extension',
		'status bar'
	]
};
const contentTitle = 'Status bar';

const assets = {

};



const toc = [{
  "value": "Creating a status bar item",
  "id": "creating-a-status-bar-item",
  "level": 2
}, {
  "value": "Properties",
  "id": "properties",
  "level": 3
}, {
  "value": "Visibility",
  "id": "visibility",
  "level": 3
}, {
  "value": "Updating text dynamically",
  "id": "updating-text-dynamically",
  "level": 2
}, {
  "value": "Controlling visibility from configuration",
  "id": "controlling-visibility-from-configuration",
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
        id: "status-bar",
        children: "Status bar"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Extensions can add items to the Podman Desktop status bar at the bottom of the window. Status bar items display text, respond to clicks by executing a command, and can be updated dynamically at runtime."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-status-bar-item",
      children: "Creating a status bar item"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionApi.window.createStatusBarItem()"
      }), " to create a new item:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "import * as extensionApi from '@podman-desktop/api';\n\nconst statusBar = extensionApi.window.createStatusBarItem();\nstatusBar.text = 'My Extension';\nstatusBar.command = 'my-extension.openDashboard';\nstatusBar.tooltip = 'Click to open the dashboard';\nstatusBar.show();\n\nextensionContext.subscriptions.push(statusBar);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "properties",
      children: "Properties"
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
              children: "text"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Text displayed in the status bar"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "command"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Command ID executed when the item is clicked"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "tooltip"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Tooltip shown on hover"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "iconClass"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            }), " or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "{ active: string; inactive: string }"
            })]
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "CSS class for an icon"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "enabled"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "boolean"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Whether the item is clickable (default: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "true"
            }), ")"]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "visibility",
      children: "Visibility"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Call ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".show()"
      }), " to make the item visible and ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".hide()"
      }), " to remove it. You can toggle visibility based on extension settings:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "if (settings.showStatusBar) {\n  statusBar.show();\n} else {\n  statusBar.hide();\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "updating-text-dynamically",
      children: "Updating text dynamically"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "setInterval"
      }), " or event listeners to update the status bar text at runtime:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const interval = setInterval(() => {\n  const count = getActiveCount();\n  statusBar.text = count > 0 ? `My Extension (${count} active)` : 'My Extension';\n}, 3000);\n\nextensionContext.subscriptions.push({\n  dispose: () => clearInterval(interval),\n});\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "controlling-visibility-from-configuration",
      children: "Controlling visibility from configuration"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Declare a boolean setting in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " so users can toggle the status bar item:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"configuration\": {\n      \"title\": \"My Extension\",\n      \"properties\": {\n        \"my-extension.showStatusBar\": {\n          \"type\": \"boolean\",\n          \"default\": true,\n          \"description\": \"Show the status bar indicator.\"\n        }\n      }\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Then read the setting at startup and react to changes:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const config = extensionApi.configuration.getConfiguration('my-extension');\nconst showStatusBar = config.get<boolean>('showStatusBar') ?? true;\n\nif (showStatusBar) {\n  statusBar.show();\n}\n\nextensionApi.configuration.onDidChangeConfiguration(e => {\n  if (e.affectsConfiguration('my-extension')) {\n    const updated = extensionApi.configuration.getConfiguration('my-extension');\n    if (updated.get<boolean>('showStatusBar')) {\n      statusBar.show();\n    } else {\n      statusBar.hide();\n    }\n  }\n});\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Build and load your extension."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check that the status bar item appears at the bottom of the Podman Desktop window."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the item and verify the linked command executes."
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