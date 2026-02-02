"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[88526],{

/***/ 86649:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_creating_an_extension_md_3f1_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-creating-an-extension-md-3f1.json
const site_tutorial_creating_an_extension_md_3f1_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"creating-an-extension","title":"Creating an extension","description":"Creating a Podman Desktop extension","source":"@site/tutorial/creating-an-extension.md","sourceDirName":".","slug":"/creating-an-extension","permalink":"/tutorial/creating-an-extension","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"creating-an-extension","permalink":"/tutorial/tags/creating-an-extension"}],"version":"current","sidebarPosition":8,"frontMatter":{"sidebar_position":8,"title":"Creating an extension","description":"Creating a Podman Desktop extension","keywords":["podman desktop","podman","extension"],"tags":["podman-desktop","creating-an-extension"]},"sidebar":"defaultSidebar","previous":{"title":"Running an AI application","permalink":"/tutorial/running-an-ai-application"},"next":{"title":"Getting started with Compose","permalink":"/tutorial/getting-started-with-compose"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/creating-an-extension.md


const frontMatter = {
	sidebar_position: 8,
	title: 'Creating an extension',
	description: 'Creating a Podman Desktop extension',
	keywords: [
		'podman desktop',
		'podman',
		'extension'
	],
	tags: [
		'podman-desktop',
		'creating-an-extension'
	]
};
const contentTitle = 'Creating a Podman Desktop extension';

const assets = {

};



const toc = [{
  "value": "Before you begin",
  "id": "before-you-begin",
  "level": 2
}, {
  "value": "Initializing an extension",
  "id": "initializing-an-extension",
  "level": 2
}, {
  "value": "Writing the extension entry point",
  "id": "writing-the-extension-entry-point",
  "level": 2
}, {
  "value": "Build dependencies",
  "id": "build-dependencies",
  "level": 2
}, {
  "value": "Running the extension",
  "id": "running-the-extension",
  "level": 2
}, {
  "value": "Verifying the extension&#39;s features",
  "id": "verifying-the-extensions-features",
  "level": 2
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    header: "header",
    img: "img",
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
        id: "creating-a-podman-desktop-extension",
        children: "Creating a Podman Desktop extension"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial covers the following end-to-end tasks required to create and run a Podman Desktop extension:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#initializing-an-extension",
          children: "Initializing an extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/creating-an-extension#writing-the-extension-entry-point",
          children: "Writing the extension entry point"
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
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can write an extension in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "TypeScript"
      }), " or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "JavaScript"
      }), ". You can simplify extension creation by specifying two entry points: ", (0,jsx_runtime.jsx)(_components.code, {
        children: "activate()"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "deactivate()"
      }), " from within the extension."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["All Podman Desktop functionalities are communicated entirely through the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://podman-desktop.io/api",
        children: "API"
      }), ". The extension you create interacts with the Podman Desktop API through the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "@podman-desktop/api"
      }), " package. The type definition of the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "@podman-desktop/api"
      }), " API is hosted as part of the ", (0,jsx_runtime.jsxs)(_components.a, {
        href: "https://www.npmjs.com/package/@podman-desktop/api",
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "npm"
        }), " package"]
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "before-you-begin",
      children: "Before you begin"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Make sure you have:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/installation",
          children: "Installed Podman Desktop"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A developer role."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Installed ", (0,jsx_runtime.jsx)(_components.code, {
          children: "JavaScript"
        }), " or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "TypeScript"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A clone of the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/podman-desktop",
          children: "Podman Desktop"
        }), " repository on your local machine."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "initializing-an-extension",
      children: "Initializing an extension"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Create a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " file to initialize your extension."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Create a subdirectory, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "foobar"
          }), " in the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "extensions"
          }), " directory of the Podman Desktop repository."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Initialize a ", (0,jsx_runtime.jsx)(_components.code, {
            children: "package.json"
          }), " file and add it to the subdirectory."]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            children: "{}\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Add ", (0,jsx_runtime.jsx)(_components.code, {
            children: "TypeScript"
          }), " and the Podman Desktop API to the development dependencies:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "lines",
            children: " \"devDependencies\": {\n   \"@podman-desktop/api\": \"latest\",\n   \"typescript\": \"latest\",\n   \"vite\": \"latest\"\n },\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Add the required metadata:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "lines",
            children: "  \"name\": \"my-extension\",\n  \"displayName\": \"My Hello World extension\",\n  \"description\": \"How to write my first extension\",\n  \"version\": \"0.0.1\",\n  \"icon\": \"icon.png\",\n  \"publisher\": \"benoitf\",\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Add the Podman Desktop version to run the extension:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "lines",
            children: "  \"engines\": {\n    \"podman-desktop\": \"latest\"\n  },\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Add the main entry point:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "lines",
            children: " \"main\": \"./dist/extension.js\"\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Add a ", (0,jsx_runtime.jsx)(_components.code, {
            children: "Hello World"
          }), " command contribution:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "lines",
            children: "  \"contributes\": {\n    \"commands\": [\n     {\n       \"command\": \"my.first.command\",\n       \"title\": \"My First Extension: Hello World\"\n     }\n   ]\n  }\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Validate the complete ", (0,jsx_runtime.jsx)(_components.code, {
            children: "package.json"
          }), " file manually:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: (0,jsx_runtime.jsxs)(_components.em, {
              children: ["Example: The complete ", (0,jsx_runtime.jsx)(_components.code, {
                children: "package.json"
              }), " file"]
            })
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            children: "{\n  \"devDependencies\": {\n    \"@podman-desktop/api\": \"latest\",\n    \"typescript\": \"latest\",\n    \"vite\": \"latest\"\n  },\n  \"name\": \"my-extension\",\n  \"displayName\": \"My Hello World extension\",\n  \"description\": \"How to write my first extension\",\n  \"version\": \"0.0.1\",\n  \"icon\": \"icon.png\",\n  \"publisher\": \"benoitf\",\n  \"engines\": {\n    \"podman-desktop\": \"latest\"\n  },\n  \"scripts\": {\n    \"build\": \"vite build\",\n    \"test\": \"vitest run --coverage\",\n    \"test:watch\": \"vitest watch --coverage\",\n    \"watch\": \"vite build --watch\"\n  },\n  \"main\": \"./dist/extension.js\",\n  \"contributes\": {\n    \"commands\": [\n      {\n        \"command\": \"my.first.command\",\n        \"title\": \"My First Extension: Hello World\"\n      }\n    ]\n  }\n}\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Add an ", (0,jsx_runtime.jsx)(_components.code, {
            children: "icon.png"
          }), " file to the subdirectory."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "writing-the-extension-entry-point",
      children: "Writing the extension entry point"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Create a ", (0,jsx_runtime.jsx)(_components.code, {
            children: "src/extension.ts"
          }), " file in the subdirectory."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Import the Podman Desktop API into the file:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-typescript",
            children: "import * as podmanDesktopAPI from '@podman-desktop/api';\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Use one of the following ways to expose the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "activate"
          }), " function:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Synchronous (sequential execution of tasks)"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-typescript",
                children: "export function activate(): void;\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Asynchronous (parallel execution of tasks)"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-typescript",
                children: "export async function activate(): Promise<void>;\n"
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Add an extension context to the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "activate"
          }), " function by enabling the extension to register disposable resources:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-typescript",
            children: "export async function activate(extensionContext: podmanDesktopAPI.ExtensionContext): Promise<void> {}\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Add the features of the extension to the file. This sample extension:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Registers the command referenced in the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "package.json"
            }), " file."]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Displays an option for the user to select values from the dropdown list."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Displays a pop-up message with the values selected by the user."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Creates an item in the status bar to run the command."
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-typescript",
            children: "import * as podmanDesktopAPI from '@podman-desktop/api';\nexport async function activate(extensionContext: podmanDesktopAPI.ExtensionContext): Promise<void> {\n  // register the command referenced in package.json file\n  const myFirstCommand = podmanDesktopAPI.commands.registerCommand('my.first.command', async () => {\n    // display a choice to the user for selecting some values\n    const result = await podmanDesktopAPI.window.showQuickPick(['un', 'deux', 'trois'], {\n      canPickMany: true, // user can select more than one choice\n    });\n\n    // display an information message with the user choice\n    await podmanDesktopAPI.window.showInformationMessage(`The choice was: ${result}`);\n  });\n\n  // create an item in the status bar to run our command\n  // it will stick on the left of the status bar\n  const item = podmanDesktopAPI.window.createStatusBarItem(podmanDesktopAPI.StatusBarAlignLeft, 100);\n  item.text = 'My first command';\n  item.command = 'my.first.command';\n  item.show();\n\n  // register disposable resources to it's removed when you deactivte the extension\n  extensionContext.subscriptions.push(myFirstCommand);\n  extensionContext.subscriptions.push(item);\n}\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Use one of the following ways to expose the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "deactivate"
          }), " function:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Synchronous"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-typescript",
                children: "export function deactivate(): void;\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Asynchronous"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-typescript",
                children: "export async function deactivate(): Promise<void>;\n"
              })
            }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
              type: "note",
              children: (0,jsx_runtime.jsxs)(_components.p, {
                children: ["The above example is not a full representation of every functionality an extension can be used for. You can expand the internal Podman Desktop functionalities, such as creating a new provider and adding new commands. See our ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://podman-desktop.io/api",
                  children: "API documentation"
                }), " for more information."]
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "build-dependencies",
      children: "Build dependencies"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can build this extension by configuring ", (0,jsx_runtime.jsx)(_components.code, {
        children: "TypeScript"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Vite"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Create a file named ", (0,jsx_runtime.jsx)(_components.code, {
          children: "tsconfig.json"
        }), " with the following content in the subdirectory:"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"compilerOptions\": {\n    \"module\": \"esnext\",\n    \"lib\": [\"ES2017\"],\n    \"sourceMap\": true,\n    \"rootDir\": \"src\",\n    \"outDir\": \"dist\",\n    \"target\": \"esnext\",\n    \"moduleResolution\": \"Node\",\n    \"allowSyntheticDefaultImports\": true,\n    \"resolveJsonModule\": true,\n    \"skipLibCheck\": true,\n    \"types\": [\"node\"]\n  },\n  \"include\": [\"src\", \"types/*.d.ts\"]\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "2",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Create a file named ", (0,jsx_runtime.jsx)(_components.code, {
          children: "vite.config.js"
        }), " with the following content in the subdirectory:"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-javascript",
        children: "/**********************************************************************\n * Copyright (C) 2023 Red Hat, Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n * SPDX-License-Identifier: Apache-2.0\n ***********************************************************************/\n\nimport { join } from 'path';\nimport { builtinModules } from 'module';\n\nconst PACKAGE_ROOT = __dirname;\n\n/**\n * @type {import('vite').UserConfig}\n * @see https://vitejs.dev/config/\n */\nconst config = {\n  mode: process.env.MODE,\n  root: PACKAGE_ROOT,\n  envDir: process.cwd(),\n  resolve: {\n    alias: {\n      '/@/': join(PACKAGE_ROOT, 'src') + '/',\n    },\n  },\n  build: {\n    sourcemap: 'inline',\n    target: 'esnext',\n    outDir: 'dist',\n    assetsDir: '.',\n    minify: process.env.MODE === 'production' ? 'esbuild' : false,\n    lib: {\n      entry: 'src/extension.ts',\n      formats: ['cjs'],\n    },\n    rollupOptions: {\n      external: ['@podman-desktop/api', ...builtinModules.flatMap(p => [p, `node:${p}`])],\n      output: {\n        entryFileNames: '[name].js',\n      },\n    },\n    emptyOutDir: true,\n    reportCompressedSize: false,\n  },\n};\n\nexport default config;\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "running-the-extension",
      children: "Running the extension"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Stop the Podman Desktop application if it runs in the background."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following command from your clone of the Podman Desktop repository:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell",
            children: "pnpm watch --extension-folder <path-to-your-extension>\n"
          })
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The extension compiles and generates the output in the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "dist"
          }), " folder of the subdirectory.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "output in the dist folder",
            src: (__webpack_require__(3154)/* ["default"] */ .A) + "",
            width: "167",
            height: "250"
          })]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["You can also ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/extensions/debugging-an-extension",
              children: "run and verify the extension"
            }), " directly from the Podman Desktop UI."]
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verifying-the-extensions-features",
      children: "Verifying the extension's features"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Extensions"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Search the created ", (0,jsx_runtime.jsx)(_components.code, {
            children: "My Hello World"
          }), " extension in the list. The extension is ", (0,jsx_runtime.jsx)(_components.code, {
            children: "ACTIVE"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "hello world extension in the list",
            src: (__webpack_require__(2977)/* ["default"] */ .A) + "",
            width: "1924",
            height: "636"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Verify the features of the extension:"
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "My first command"
          }), " item in the status bar. A dropdown list opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Select a value from the dropdown list."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "OK"
          }), ". A pop-up notifying the selected value opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "dropdown list",
            src: (__webpack_require__(92060)/* ["default"] */ .A) + "",
            width: "1208",
            height: "284"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "OK"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "a pop-up message",
            src: (__webpack_require__(6096)/* ["default"] */ .A) + "",
            width: "1196",
            height: "406"
          })]
        }), "\n", (0,jsx_runtime.jsxs)(_components.admonition, {
          type: "note",
          children: [(0,jsx_runtime.jsx)(_components.p, {
            children: "If you have created a webview extension, you can access the console of the extension:"
          }), (0,jsx_runtime.jsxs)(_components.ol, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
              children: "Right-click the extension icon in the left navigation pane."
            }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
              children: ["Select ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Open Devtools of the webview"
              }), "."]
            }), "\n"]
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/podman-desktop/blob/main/packages/extension-api/src/extension-api.d.ts",
          children: "Podman Desktop API code"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/api",
          children: "Podman Desktop API documentation"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing#overview-of-creating-a-new-extension",
          children: "Overview - Creating an extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing#expanding-your-extension",
          children: "Expanding your extension"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
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

/***/ 3154:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dist-folder-4da5ca7e197631d33d970b42fca540c5.png");

/***/ }),

/***/ 2977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/my-hello-world-extension-5d44542abafb01d2f2cd888bc6eb933f.png");

/***/ }),

/***/ 6096:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pop-up-message-6e291058d07dede1d25557dc3aeb6f44.png");

/***/ }),

/***/ 92060:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/selecting-a-value-from-dropdown-963aaed72f2d29adf84df1e17ab8db9c.png");

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