"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[90271],{

/***/ 63366
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_progress_tasks_md_61b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-progress-tasks-md-61b.json
const site_docs_extensions_developing_progress_tasks_md_61b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/progress-tasks","title":"Progress tasks","description":"Showing progress indicators in Podman Desktop","source":"@site/docs/extensions/developing/progress-tasks.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/progress-tasks","permalink":"/docs/extensions/developing/progress-tasks","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/progress-tasks.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","sidebarPosition":7,"frontMatter":{"sidebar_position":7,"title":"Progress tasks","description":"Showing progress indicators in Podman Desktop","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension","progress","task"]},"sidebar":"mySidebar","previous":{"title":"Status bar","permalink":"/docs/extensions/developing/status-bar"},"next":{"title":"Tray menu","permalink":"/docs/extensions/developing/tray-menu"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/progress-tasks.md


const frontMatter = {
	sidebar_position: 7,
	title: 'Progress tasks',
	description: 'Showing progress indicators in Podman Desktop',
	tags: [
		'podman-desktop',
		'extension'
	],
	keywords: [
		'podman desktop',
		'extension',
		'progress',
		'task'
	]
};
const contentTitle = 'Progress tasks';

const assets = {

};



const toc = [{
  "value": "Using <code>withProgress</code>",
  "id": "using-withprogress",
  "level": 2
}, {
  "value": "Parameters",
  "id": "parameters",
  "level": 3
}, {
  "value": "Reporting progress",
  "id": "reporting-progress",
  "level": 3
}, {
  "value": "Indeterminate progress",
  "id": "indeterminate-progress",
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
    strong: "strong",
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
        id: "progress-tasks",
        children: "Progress tasks"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Extensions can show progress indicators in the Podman Desktop task widget while performing long-running operations. This gives users visual feedback with a title, message, and optional progress bar."
    }), "\n", (0,jsx_runtime.jsxs)(_components.h2, {
      id: "using-withprogress",
      children: ["Using ", (0,jsx_runtime.jsx)(_components.code, {
        children: "withProgress"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Wrap any async operation with ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionApi.window.withProgress()"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "import * as extensionApi from '@podman-desktop/api';\n\nawait extensionApi.window.withProgress(\n  { location: extensionApi.ProgressLocation.TASK_WIDGET, title: 'Building image' },\n  async progress => {\n    progress.report({ increment: 0, message: 'Preparing build context...' });\n    await prepareBuildContext();\n\n    progress.report({ increment: 50, message: 'Building layers...' });\n    await buildLayers();\n\n    progress.report({ increment: 100, message: 'Build complete' });\n  },\n);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "parameters",
      children: "Parameters"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The first argument is an options object:"
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
              children: "location"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "ProgressLocation"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Where to show the progress. Use ", (0,jsx_runtime.jsx)(_components.code, {
              children: "ProgressLocation.TASK_WIDGET"
            }), " for the task manager"]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "title"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Title displayed at the top of the task entry"
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "reporting-progress",
      children: "Reporting progress"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Inside the callback, call ", (0,jsx_runtime.jsx)(_components.code, {
        children: "progress.report()"
      }), " with:"]
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
              children: "message"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "string"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Status text shown below the title"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "increment"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "number"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Progress bar value from 0 to 100"
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can call ", (0,jsx_runtime.jsx)(_components.code, {
        children: "progress.report()"
      }), " multiple times to update both the message and the progress bar as work proceeds."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "indeterminate-progress",
      children: "Indeterminate progress"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["If you cannot estimate progress, omit the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "increment"
      }), " field. The task widget will show an indeterminate spinner:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "await extensionApi.window.withProgress(\n  { location: extensionApi.ProgressLocation.TASK_WIDGET, title: 'Scanning containers' },\n  async progress => {\n    progress.report({ message: 'Scanning...' });\n    await scanAllContainers();\n    progress.report({ message: 'Done' });\n  },\n);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Ensure that ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Tasks"
        }), " section visibility is enabled in ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Preferences"
        }), " (Status Bar and Toast)."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Trigger the operation that calls ", (0,jsx_runtime.jsx)(_components.code, {
          children: "withProgress"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check that a task entry appears in the task widget with the correct title and progress updates."
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