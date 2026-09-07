"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[62176],{

/***/ 66641
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_webview_messaging_md_f0a_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-webview-messaging-md-f0a.json
const site_docs_extensions_developing_webview_messaging_md_f0a_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/webview-messaging","title":"Webview messaging","description":"Communicating between an extension and its webview panel","source":"@site/docs/extensions/developing/webview-messaging.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/webview-messaging","permalink":"/docs/extensions/developing/webview-messaging","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/webview-messaging.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"}],"version":"current","sidebarPosition":10,"frontMatter":{"sidebar_position":10,"title":"Webview messaging","description":"Communicating between an extension and its webview panel","tags":["podman-desktop","extension"],"keywords":["podman desktop","extension","webview","postMessage"]},"sidebar":"mySidebar","previous":{"title":"CLI tools","permalink":"/docs/extensions/developing/cli-tools"},"next":{"title":"Command palette","permalink":"/docs/extensions/developing/command-palette"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/webview-messaging.md


const frontMatter = {
	sidebar_position: 10,
	title: 'Webview messaging',
	description: 'Communicating between an extension and its webview panel',
	tags: [
		'podman-desktop',
		'extension'
	],
	keywords: [
		'podman desktop',
		'extension',
		'webview',
		'postMessage'
	]
};
const contentTitle = 'Webview messaging';

const assets = {

};



const toc = [{
  "value": "Creating a webview panel",
  "id": "creating-a-webview-panel",
  "level": 2
}, {
  "value": "Sending messages to the webview",
  "id": "sending-messages-to-the-webview",
  "level": 2
}, {
  "value": "Receiving messages on the frontend",
  "id": "receiving-messages-on-the-frontend",
  "level": 2
}, {
  "value": "Receiving messages from the webview",
  "id": "receiving-messages-from-the-webview",
  "level": 2
}, {
  "value": "Verification",
  "id": "verification",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    blockquote: "blockquote",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "webview-messaging",
        children: "Webview messaging"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Extensions with a webview panel (a dashboard, custom UI, etc.) communicate with their frontend content through message passing. The extension posts messages to the webview, and the webview can post messages back."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-webview-panel",
      children: "Creating a webview panel"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionApi.window.createWebviewPanel()"
      }), " to create a panel that hosts your frontend, then set its HTML content:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "import * as extensionApi from '@podman-desktop/api';\n\nconst panel = extensionApi.window.createWebviewPanel('my-extension-view', 'My Extension');\npanel.webview.html = getHtml(); // your bundled frontend HTML\n\nextensionContext.subscriptions.push(panel);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "sending-messages-to-the-webview",
      children: "Sending messages to the webview"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Call ", (0,jsx_runtime.jsx)(_components.code, {
        children: "panel.webview.postMessage()"
      }), " with a JSON-serializable payload. This is commonly used from a command handler to tell the frontend to navigate or update its state:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const viewContainerCommand = extensionApi.commands.registerCommand(\n  'my-extension.viewContainerUsage',\n  async (container: { id?: string; Id?: string }) => {\n    const containerId = container?.id ?? container?.Id;\n    panel.reveal();\n    await new Promise(resolve => setTimeout(resolve, 200));\n    await panel.webview.postMessage({\n      type: 'navigate',\n      url: `/container/${containerId}`,\n    });\n  },\n);\nextensionContext.subscriptions.push(viewContainerCommand);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "NOTE:"
          })
        }), " If the panel was just revealed, the webview may not be mounted yet. A short delay (as above) or a \"ready\" handshake from the frontend avoids the message being missed."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "receiving-messages-on-the-frontend",
      children: "Receiving messages on the frontend"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Inside the webview content, add a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "message"
      }), " event listener on ", (0,jsx_runtime.jsx)(_components.code, {
        children: "window"
      }), " to react to messages posted by the extension:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-svelte",
        children: "<script lang=\"ts\">\n  let status = $state('idle');\n\n  window.addEventListener('message', (event: MessageEvent) => {\n    if (event.data?.type === 'navigate') {\n      router.goto(event.data.url);\n    }\n  });\n</script>\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "receiving-messages-from-the-webview",
      children: "Receiving messages from the webview"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The extension can also listen for messages sent from the frontend using ", (0,jsx_runtime.jsx)(_components.code, {
        children: "panel.webview.onDidReceiveMessage"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "panel.webview.onDidReceiveMessage((message: unknown) => {\n  console.log('Received message from webview', message);\n});\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The frontend posts messages back with ", (0,jsx_runtime.jsx)(_components.code, {
        children: "acquirePodmanDesktopApi().postMessage()"
      }), ", which is exposed to the webview content and internally uses the same ", (0,jsx_runtime.jsx)(_components.code, {
        children: "postMessage"
      }), " mechanism."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Build and load your extension, and open its dashboard panel."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Trigger a command that calls ", (0,jsx_runtime.jsx)(_components.code, {
          children: "panel.webview.postMessage()"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check that the frontend reacts to the message (for example, by navigating to a different page)."
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