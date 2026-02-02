"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[30784],{

/***/ 54636:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_index_md_cd3_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-index-md-cd3.json
const site_docs_extensions_developing_index_md_cd3_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/index","title":"Developing","description":"Developing a Podman Desktop extension","source":"@site/docs/extensions/developing/index.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/","permalink":"/docs/extensions/developing/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"writing","permalink":"/docs/tags/writing"}],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"title":"Developing","description":"Developing a Podman Desktop extension","tags":["podman-desktop","extension","writing"],"keywords":["podman desktop","extension","writing"]},"sidebar":"mySidebar","previous":{"title":"Templates","permalink":"/docs/extensions/templates/"},"next":{"title":"Onboarding workflow","permalink":"/docs/extensions/developing/onboarding-workflow"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/index.md


const frontMatter = {
	sidebar_position: 2,
	title: 'Developing',
	description: 'Developing a Podman Desktop extension',
	tags: [
		'podman-desktop',
		'extension',
		'writing'
	],
	keywords: [
		'podman desktop',
		'extension',
		'writing'
	]
};
const contentTitle = 'Developing a Podman Desktop extension';

const assets = {

};



const toc = [{
  "value": "Overview of creating a new extension",
  "id": "overview-of-creating-a-new-extension",
  "level": 2
}, {
  "value": "Activating",
  "id": "activating",
  "level": 3
}, {
  "value": "Deactivating",
  "id": "deactivating",
  "level": 3
}, {
  "value": "Example boilerplate code",
  "id": "example-boilerplate-code",
  "level": 3
}, {
  "value": "Interacting with the UI",
  "id": "interacting-with-the-ui",
  "level": 3
}, {
  "value": "Creating and running your extension",
  "id": "creating-and-running-your-extension",
  "level": 2
}, {
  "value": "Expanding your extension",
  "id": "expanding-your-extension",
  "level": 2
}, {
  "value": "Using <code>ProviderStatus</code>",
  "id": "using-providerstatus",
  "level": 3
}, {
  "value": "Using <code>ProviderConnectionStatus</code>",
  "id": "using-providerconnectionstatus",
  "level": 3
}, {
  "value": "Adding commands",
  "id": "adding-commands",
  "level": 3
}, {
  "value": "Commands",
  "id": "commands",
  "level": 2
}, {
  "value": "Expanding the <code>extension-api</code> API",
  "id": "expanding-the-extension-api-api",
  "level": 3
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 2
}, {
  "value": "Next steps",
  "id": "next-steps",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    header: "header",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "developing-a-podman-desktop-extension",
        children: "Developing a Podman Desktop extension"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop is organized so that you can modularly add new functionality in the form of \"extensions\" as well as the corresponding extension-api. This allows you to communicate with Podman Desktop without having to know the internal workings. You look for the API call and Podman Desktop will do the rest."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["It is recommended that an extension be written in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "TypeScript"
      }), " for type checking, but extensions can be written in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "JavaScript"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Most extensions are externally loaded; however, we also dogfood our own API by loading them as ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/tree/main/extensions",
        children: "internal extensions"
      }), " that use the same API. These internally maintained extensions can be used as an example and basis for how to build an externally loaded extension."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "overview-of-creating-a-new-extension",
      children: "Overview of creating a new extension"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["We try to simplify extension creation as much as possible by utilizing ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " and by keeping activations simple within the extension, providing only two entrypoints: ", (0,jsx_runtime.jsx)(_components.code, {
        children: "activate()"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "deactivate()"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["All Podman Desktop functionalities are communicated entirely through the API. The extension you create interacts with the Podman Desktop API through the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "@podman-desktop/api"
      }), " package. The API code is located ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/main/packages/extension-api/src/extension-api.d.ts",
        children: "here"
      }), ", while the website representation of the code can be found ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://podman-desktop.io/api",
        children: "here"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "activating",
      children: "Activating"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When activating an extension, Podman Desktop will:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Search and load the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "JavaScript"
        }), " file specified in ", (0,jsx_runtime.jsx)(_components.code, {
          children: "main"
        }), " entry of the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "package.json"
        }), " file in the extension directory (typically ", (0,jsx_runtime.jsx)(_components.code, {
          children: "extension.js"
        }), ")."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the exported ", (0,jsx_runtime.jsx)(_components.code, {
          children: "activate"
        }), " function."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "deactivating",
      children: "Deactivating"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When deactivating an extension, Podman Desktop will:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the optionally exported ", (0,jsx_runtime.jsx)(_components.code, {
          children: "deactivate"
        }), " function."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Dispose of any resources that have been added to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "extensionContext.subscriptions"
        }), ", see ", (0,jsx_runtime.jsx)(_components.code, {
          children: "deactivateExtension"
        }), " in ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/podman-desktop/blob/main/packages/main/src/plugin/extension-loader.ts",
          children: "extension-loader.ts"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "example-boilerplate-code",
      children: "Example boilerplate code"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This is an example ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensions/foobar/src/extensions.ts"
      }), " file with the basic ", (0,jsx_runtime.jsx)(_components.code, {
        children: "activate"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "deactivate"
      }), " functionalities, provided that you already have a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " created as well:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "import * as extensionApi from '@podman-desktop/api';\n\n// Activate the extension asynchronously\nexport async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {\n  // Create a provider with an example name, ID and icon\n  const provider = extensionApi.provider.createProvider({\n    name: 'FooBar',\n    id: 'foobar',\n    status: 'unknown',\n    images: {\n      icon: './icon.png',\n      logo: './icon.png',\n    },\n  });\n\n  // Push the new provider to Podman Desktop\n  extensionContext.subscriptions.push(provider);\n}\n\n// Deactivate the extension\nexport function deactivate(): void {\n  console.log('stopping FooBar extension');\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "interacting-with-the-ui",
      children: "Interacting with the UI"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The extension \"hooks\" into the Podman Desktop UI by various means, which include:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Registering the extension as a specific provider (authentication, registry, Kubernetes, containers, CLI tools, or others)."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Registering to specific events (with functions starting with ", (0,jsx_runtime.jsx)(_components.code, {
          children: "onDid..."
        }), ")."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Adding entries to menus (tray menu, status bar, and other types of menus)."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Adding fields to the configuration panel."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Watching files in the filesystem."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When the extension code is accessed through these different registrations, the extension can use utility functions provided by the API to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Get values of configuration fields."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Interact with the user through input boxes and quick picks."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Display information, warnings, error messages, and notifications to the user."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Get information about the environment (OS, telemetry, system clipboard)."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Execute the process in the system."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Send data to the telemetry."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Set data in the context, which is propagated in the UI."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-and-running-your-extension",
      children: "Creating and running your extension"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can create and run an extension by performing the following end-to-end tasks:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#initializing-an-extension",
          children: "Initializing an extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#writing-the-extension-entry-point",
          children: "Writing the extension's features"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#build-dependencies",
          children: "Build dependencies"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#running-the-extension",
          children: "Running the extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#verifying-the-extensions-features",
          children: "Verifying the extension's features"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "expanding-your-extension",
      children: "Expanding your extension"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Below is documentation and/or \"boiler-plate\" code that can help expand your extension."
    }), "\n", (0,jsx_runtime.jsxs)(_components.h3, {
      id: "using-providerstatus",
      children: ["Using ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ProviderStatus"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop runs each provider via series of statuses from ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/main/packages/extension-api/src/extension-api.d.ts",
        children: "extension-api"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "export type ProviderStatus =\n  | 'not-installed'\n  | 'installed'\n  | 'configured'\n  | 'ready'\n  | 'started'\n  | 'stopped'\n  | 'starting'\n  | 'stopping'\n  | 'error'\n  | 'unknown';\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "ProviderStatus"
      }), " supplies information to the main Provider page detailing whether or not that Provider is installed, ready, started, stopped, etc."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This can be updated throughout your extension by calling for example: ", (0,jsx_runtime.jsx)(_components.code, {
        children: "provider.updateStatus('installed')"
      }), ". Podman Desktop will show the status on the main screen."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "NOTE:"
          })
        }), " ProviderStatus is for information purposes only and can be used from within the extension to keep track if ", (0,jsx_runtime.jsx)(_components.code, {
          children: "activate()"
        }), " and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "deactivate()"
        }), " are working correctly."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.h3, {
      id: "using-providerconnectionstatus",
      children: ["Using ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ProviderConnectionStatus"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "export type ProviderConnectionStatus = 'started' | 'stopped' | 'starting' | 'stopping' | 'unknown';\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "NOTE:"
          })
        }), " The ", (0,jsx_runtime.jsx)(_components.code, {
          children: "unknown"
        }), " status is unique as it will not show in the extension section of Podman Desktop, it will also not be accessible via API calls. Unknown statuses typically happen when Podman Desktop is unable to load the extension."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "ProviderConnectionStatus"
      }), " is the main \"Lifecycle\" of your extension. The status is updated automatically by Podman Desktop and reflected within the provider."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Upon a successful start up via the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "activate"
      }), " function within your extension, ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ProviderConnectionStatus"
      }), " will be reflected as 'started'."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "ProviderConnectionStatus"
      }), " statuses are used in two areas, ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/main/packages/main/src/plugin/extension-loader.ts",
        children: "extension-loader.ts"
      }), " and ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/main/packages/main/src/tray-menu.ts",
        children: "tray-menu.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "extension-loader.ts"
        }), ": Attempts to load the extension and sets the status accordingly (either ", (0,jsx_runtime.jsx)(_components.code, {
          children: "started"
        }), ", ", (0,jsx_runtime.jsx)(_components.code, {
          children: "stopped"
        }), ", ", (0,jsx_runtime.jsx)(_components.code, {
          children: "starting"
        }), " or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "stopping"
        }), "). If an unknown error has occurred, the status is set to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "unknown"
        }), ". ", (0,jsx_runtime.jsx)(_components.code, {
          children: "extension-loader.ts"
        }), " also sends an API call to Podman Desktop to update the UI of the extension."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "tray-menu.ts"
        }), ": If ", (0,jsx_runtime.jsx)(_components.code, {
          children: "extensionApi.tray.registerMenuItem(item);"
        }), " API call has been used, a tray menu of the extension will be created. When created, Podman Desktop will use the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "ProviderConnectionStatus"
        }), " to indicate the status within the tray menu."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "adding-commands",
      children: "Adding commands"
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "commands",
      children: "Commands"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Declare commands using ", (0,jsx_runtime.jsx)(_components.code, {
        children: "contributes"
      }), " section of package.json file."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: " \"contributes\": {\n    \"commands\": [\n      {\n        \"command\": \"my.command\",\n        \"title\": \"This is my command\",\n        \"category\": \"Optional category to prefix title\",\n        \"enablement\": \"myProperty === myValue\"\n      },\n    ],\n }\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["If optional ", (0,jsx_runtime.jsx)(_components.code, {
        children: "enablement"
      }), " property evaluates to false, command palette will not display this command."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To register the callback of the command, use the following code:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "import * as extensionApi from '@podman-desktop/api';\n\nextensionContext.subscriptions.push(extensionApi.commands.registerCommand('my.command', async () => {\n    // callback of your command\n    await extensionApi.window.showInformationMessage('Clicked on my command');\n});\n);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.h3, {
      id: "expanding-the-extension-api-api",
      children: ["Expanding the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extension-api"
      }), " API"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Sometimes you'll need to add new functionality to the API in order to make an internal change within Podman Desktop. An example would be a new UI/UX component that happens within the renderer, you'd need to expand the API in order to make that change to Podman Desktop's inner-workings."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Please note that an API contribution is ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "subject to approval"
      }), " as we want to maintain sustainability / consistency in the API. A discussion within an issue would be beneficial before writing code."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "In this example, we'll add a new function to simply display: \"hello world\" in the console."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add the new function to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "/packages/extension-api/src/extension-api.d.ts"
        }), ", under a namespace. This will make it accessible within the API when it's being called within your extension:"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "export namespace foobar {\n  // ...\n  export function hello(input: string): void;\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "2",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
          children: "packages/main/src/plugin/extension-loader.ts"
        }), " acts as an extension loader that defines all the actions needed by the API. Modify it to add the main functionality of ", (0,jsx_runtime.jsx)(_components.code, {
          children: "hello()"
        }), " under the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "foobar"
        }), " namespace const: "]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "// It's recommended you define a class that you retrieve from a separate file\n// see Podman and Kubernetes examples for implementation.\n\n// Add the class to the constructor of the extension loader\nimport type { FoobarClient } from './foobar';\n\nexport class ExtensionLoader {\n  // ...\n  constructor(\n    private foobarClient: FoobarClient,\n    // ...\n  ) {}\n// ..\n}\n\n// Initialize the 'foobar' client\nconst foobarClient = this.foobarClient;\n\n// The \"containerDesktopAPI.foobar\" call is the namespace you previously defined within `extension-api.d.ts`\nconst foobar: typeof containerDesktopAPI.foobar = {\n\n  // Define the function that you are implementing and call the function from the class you created.\n  hello(input: string): void => {\n    return foobarClient.hello(input);\n  },\n};\n\n// Add 'foobar' to the list of configurations being returned by `return <typeof containerDesktopAPI>`\nreturn <typeof containerDesktopAPI>{\n  foobar\n};\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "3",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The above code won't work until we've created the class! So let's create a ", (0,jsx_runtime.jsx)(_components.code, {
          children: "packages/main/src/plugin/foobar-client.ts"
        }), " file with the functionality: "]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "export class FoobarClient {\n  hello(input: string) {\n    console.log('hello ' + input);\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "4",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["An instance of this class needs to be created and passed to the constructor of the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "ExtensionLoader"
        }), ", in ", (0,jsx_runtime.jsx)(_components.code, {
          children: "packages/main/src/plugin/index.ts"
        }), ": "]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "const foobarClient = new FoobarClient();\nthis.extensionLoader = new ExtensionLoader(\n  /* ... */\n  foobarClient,\n);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "5",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "In package.json you can register some setting through the configuration settings property "
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For example if you contribute a property named ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman.binary.path"
      }), " it will display ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Path"
      }), " in Podman Desktop UI setting, and if you change it to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman.binary.pathToBinary"
      }), " it becomes ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Path To Binary"
      }), " in the title."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "\n    \"configuration\": {\n      \"title\": \"Podman\",\n      \"properties\": {\n        \"podman.binary.path\": {\n          \"name\": \"Path to Podman Binary\",\n          \"type\": \"string\",\n          \"format\": \"file\",\n          \"default\": \"\",\n          \"description\": \"Custom path to Podman binary (Default is blank)\"\n        },\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "6",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Last step! Call the new API call to the extension you are implementing from your extension: "
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-ts",
        children: "export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<void> {\n  // Define the provider\n  const provider = extensionApi.provider.createProvider({\n    name: 'FooBar',\n    id: 'foobar',\n    status: 'unknown',\n    images: {\n      icon: './icon.png',\n      logo: './icon.png',\n    },\n  });\n\n  // Push the new provider to Podman Desktop\n  extensionContext.subscriptions.push(provider);\n\n  // Call the \"hello world\" function that'll output to the console\n  extensionContext.foobar.hello('world');\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Consider a packer such as ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://rollupjs.org",
          children: "Rollup"
        }), " or ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://webpack.js.org",
          children: "Webpack"
        }), " to shrink the size of the artifact."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/publish",
          children: "Publishing a Podman Desktop extension"
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


/***/ })

}]);