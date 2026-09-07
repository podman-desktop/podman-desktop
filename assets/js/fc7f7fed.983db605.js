"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[99577],{

/***/ 25978
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_writing_custom_extensions_md_fc7_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-writing-custom-extensions-md-fc7.json
const site_tutorial_writing_custom_extensions_md_fc7_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"writing-custom-extensions","title":"Writing custom extensions","description":"A step-by-step guide to building a Podman Desktop extension, from progress tasks to CI/CD -- based on the DevConf.CZ 2026 workshop.","source":"@site/tutorial/writing-custom-extensions.md","sourceDirName":".","slug":"/writing-custom-extensions","permalink":"/tutorial/writing-custom-extensions","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"writing-custom-extensions","permalink":"/tutorial/tags/writing-custom-extensions"}],"version":"current","sidebarPosition":9,"frontMatter":{"sidebar_position":9,"title":"Writing custom extensions","description":"A step-by-step guide to building a Podman Desktop extension, from progress tasks to CI/CD -- based on the DevConf.CZ 2026 workshop.","keywords":["podman-desktop","extension","tutorial","devconf"],"tags":["podman-desktop","writing-custom-extensions"]},"sidebar":"defaultSidebar","previous":{"title":"Compose to Kubernetes with Podman Kube Play","permalink":"/tutorial/compose-to-kubernetes-with-podman-kube-play"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/writing-custom-extensions.md


const frontMatter = {
	sidebar_position: 9,
	title: 'Writing custom extensions',
	description: 'A step-by-step guide to building a Podman Desktop extension, from progress tasks to CI/CD -- based on the DevConf.CZ 2026 workshop.',
	keywords: [
		'podman-desktop',
		'extension',
		'tutorial',
		'devconf'
	],
	tags: [
		'podman-desktop',
		'writing-custom-extensions'
	]
};
const contentTitle = 'Writing custom extensions for Podman Desktop';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 2
}, {
  "value": "Podman Desktop Extension features",
  "id": "podman-desktop-extension-features",
  "level": 2
}, {
  "value": "Project setup",
  "id": "project-setup",
  "level": 2
}, {
  "value": "Loading the extension in Podman Desktop for development",
  "id": "loading-the-extension-in-podman-desktop-for-development",
  "level": 3
}, {
  "value": "How the workshop branches work",
  "id": "how-the-workshop-branches-work",
  "level": 3
}, {
  "value": "Before each step you should have some kind of container &#39;attack&#39; running, e.g. resource limiting.",
  "id": "before-each-step-you-should-have-some-kind-of-container-attack-running-eg-resource-limiting",
  "level": 2
}, {
  "value": "Step 1 -- Progress tasks",
  "id": "step-1----progress-tasks",
  "level": 2
}, {
  "value": "Steps 2--3 -- Status bar",
  "id": "steps-2--3----status-bar",
  "level": 2
}, {
  "value": "Creating a static status bar item",
  "id": "creating-a-static-status-bar-item",
  "level": 3
}, {
  "value": "Dynamically updating the text",
  "id": "dynamically-updating-the-text",
  "level": 3
}, {
  "value": "Steps 4--5 -- Commands",
  "id": "steps-4--5----commands",
  "level": 2
}, {
  "value": "&quot;Stop All Chaos&quot; command",
  "id": "stop-all-chaos-command",
  "level": 3
}, {
  "value": "&quot;Open Dashboard&quot; command",
  "id": "open-dashboard-command",
  "level": 3
}, {
  "value": "Step 6 -- Webview messaging",
  "id": "step-6----webview-messaging",
  "level": 2
}, {
  "value": "Step 7 -- Tray menu",
  "id": "step-7----tray-menu",
  "level": 2
}, {
  "value": "Steps 8--9 -- Configuration",
  "id": "steps-8--9----configuration",
  "level": 2
}, {
  "value": "Declaring configuration in package.json",
  "id": "declaring-configuration-in-packagejson",
  "level": 3
}, {
  "value": "Listening for changes",
  "id": "listening-for-changes",
  "level": 3
}, {
  "value": "Reading configuration values",
  "id": "reading-configuration-values",
  "level": 3
}, {
  "value": "Steps 10--11 -- Provider and connection factory",
  "id": "steps-10--11----provider-and-connection-factory",
  "level": 2
}, {
  "value": "Creating the provider",
  "id": "creating-the-provider",
  "level": 3
}, {
  "value": "Setting up the connection factory",
  "id": "setting-up-the-connection-factory",
  "level": 3
}, {
  "value": "Step 12 -- CI/CD workflows",
  "id": "step-12----cicd-workflows",
  "level": 2
}, {
  "value": "Packaging as an OCI image",
  "id": "packaging-as-an-oci-image",
  "level": 3
}, {
  "value": "PR check workflow",
  "id": "pr-check-workflow",
  "level": 3
}, {
  "value": "Nightly build",
  "id": "nightly-build",
  "level": 3
}, {
  "value": "Step 13 -- Onboarding",
  "id": "step-13----onboarding",
  "level": 2
}, {
  "value": "Declarative onboarding in package.json",
  "id": "declarative-onboarding-in-packagejson",
  "level": 3
}, {
  "value": "Setting context values from code",
  "id": "setting-context-values-from-code",
  "level": 3
}, {
  "value": "Resetting onboarding for repeated testing",
  "id": "resetting-onboarding-for-repeated-testing",
  "level": 3
}, {
  "value": "Step 14 -- CLI tool",
  "id": "step-14----cli-tool",
  "level": 2
}, {
  "value": "Packaging and distribution",
  "id": "packaging-and-distribution",
  "level": 2
}, {
  "value": "Building the OCI image locally",
  "id": "building-the-oci-image-locally",
  "level": 3
}, {
  "value": "Installing from a local image",
  "id": "installing-from-a-local-image",
  "level": 3
}, {
  "value": "Installing a published image",
  "id": "installing-a-published-image",
  "level": 3
}, {
  "value": "Testing with a custom catalog",
  "id": "testing-with-a-custom-catalog",
  "level": 3
}, {
  "value": "Conclusion",
  "id": "conclusion",
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
    hr: "hr",
    img: "img",
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
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "writing-custom-extensions-for-podman-desktop",
        children: "Writing custom extensions for Podman Desktop"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Extensions let you add custom features to Podman Desktop -- new commands, status bar indicators, tray menus, webview dashboards, configuration panels, providers, onboarding workflows, and more. In this tutorial we walk through building a real extension from scratch, covering the most important APIs along the way."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The content is based on the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://pretalx.devconf.info/devconf-cz-2026/talk/WQULVZ/",
        children: "DevConf.CZ 2026 workshop"
      }), " ", (0,jsx_runtime.jsx)(_components.em, {
        children: "\"Podman Desktop -- Creating extensions to simplify container workflows\""
      }), ". The companion repository provides 14 progressive branches, each introducing one API concept with a numbered placeholder comment you fill in yourself."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Podman Desktop"
        }), " 1.17 or later (", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/downloads",
          children: "download"
        }), ")"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Node.js"
        }), " 24+ and ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "npm"
        }), " 11+"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A running ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Podman"
        }), " machine (macOS / Windows) or Podman installed natively (Linux)"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A container to experiment with -- ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman run -d fedora sleep infinity"
        }), " is enough"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "NOTE:"
          })
        }), " this workshop is built on top of a POC extension, so keep in mind that some of the features might not work as expected or might not work at all. Target this extension at containers that can tolerate some pressure -- don't point it at anything you care about."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "podman-desktop-extension-features",
      children: "Podman Desktop Extension features"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "These guides cover the most frequently used APIs when building an extension:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/commands",
          children: "Commands"
        }), " -- register actions users can invoke from the command palette and menus"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/config",
          children: "Configuration"
        }), " -- declare settings in ", (0,jsx_runtime.jsx)(_components.code, {
          children: "package.json"
        }), " and read them at runtime"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/menu",
          children: "Menus"
        }), " -- add items to context menus"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/status-bar",
          children: "Status bar"
        }), " -- add clickable indicators to the bottom bar"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/progress-tasks",
          children: "Progress tasks"
        }), " -- show progress in the task widget during long operations"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/tray-menu",
          children: "Tray menu"
        }), " -- add items to the system tray icon menu"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/cli-tools",
          children: "CLI tools"
        }), " -- register CLI tools in the Settings page"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/onboarding-workflow",
          children: "Onboarding workflow"
        }), " -- guide users through first-time setup"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/webview-messaging",
          children: "Webview messaging"
        }), " -- communicate between the extension and its webview panel"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/adding-ui-components",
          children: "Adding UI components"
        }), " -- use the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "@podman-desktop/ui-svelte"
        }), " library in webviews"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/developing/adding-icons",
          children: "Adding icons"
        }), " -- customize your extension's icons"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["If you want to learn more about the internals of the extension check ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://podman-desktop.io/docs/extensions/developing",
        children: "Developing a Podman Desktop extension"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "project-setup",
      children: "Project setup"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Clone the workshop repository and check out the first branch:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "git clone https://github.com/gastoner/extension-template-full\ncd extension-template-full\ngit checkout workshop/01-progress-task\nnpm install && npm run build\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The repository is a monorepo with three packages:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Package"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Role"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "packages/backend"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Extension entry point (", (0,jsx_runtime.jsx)(_components.code, {
              children: "activate"
            }), " / ", (0,jsx_runtime.jsx)(_components.code, {
              children: "deactivate"
            }), "), Podman API calls, chaos engine"]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "packages/frontend"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Svelte 5 + Tailwind CSS dashboard with ", (0,jsx_runtime.jsx)(_components.code, {
              children: "@podman-desktop/ui-svelte"
            })]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "packages/shared"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "RPC types and message proxy connecting frontend and backend"
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The extension can use ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://www.npmjs.com/package/@podman-desktop/ui-svelte?activeTab=code",
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "@podman-desktop/ui-svelte"
        })
      }), " UI package with basic UI components to help you build your extension. For building the feature set of your extension you can use ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://www.npmjs.com/package/@podman-desktop/api?activeTab=code",
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "@podman-desktop/api"
        })
      }), " to do so."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "loading-the-extension-in-podman-desktop-for-development",
      children: "Loading the extension in Podman Desktop for development"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Preferences"
        }), " and enable ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Development Mode"
        }), ", ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Status Bar"
        }), " and ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Toast"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(36933)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "2",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Navigate to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Extensions > Local Extensions"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Add a local folder..."
        }), " and select the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "packages/backend"
        }), " folder."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The extension appears in the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Installed"
        }), " tab and a ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Chaos Lab"
        }), " entry shows up in the navigation bar."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "IMPORTANT:"
          })
        }), " After each rebuild (", (0,jsx_runtime.jsx)(_components.code, {
          children: "npm run build"
        }), ") you need to disable and re-enable the extension in Podman Desktop, or you can use ", (0,jsx_runtime.jsx)(_components.code, {
          children: "npm run watch"
        }), " in the extension to automatically build it, you still need to re-enable the extension though."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(28157)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "NOTE:"
          })
        }), " If you clone the Podman Desktop repository and you run it using ", (0,jsx_runtime.jsx)(_components.code, {
          children: "pnpm watch --extension-folder ../relative_path_to_the_extension/packages/backend"
        }), ", the extension will be updated automatically."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(49678)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "how-the-workshop-branches-work",
      children: "How the workshop branches work"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Each branch (", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/01-progress-task"
      }), " through ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/14-cli-tool"
      }), ") contains a numbered placeholder comment in the source code. Your task is to replace the placeholder with real code. The next branch always contains the solution for the previous step, and the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "dev_conf"
      }), " branch has everything completed."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/01-progress-task   →  #1  (withProgress)\nworkshop/02-status-bar      →  #2  (createStatusBarItem)\nworkshop/03-status-bar-dynamic → #3 (dynamic status bar)\n...\nworkshop/14-cli-tool        →  #14 (createCliTool)\ndev_conf                    →  all placeholders completed\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "before-each-step-you-should-have-some-kind-of-container-attack-running-eg-resource-limiting",
      children: "Before each step you should have some kind of container 'attack' running, e.g. resource limiting."
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(21610)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-1----progress-tasks",
      children: "Step 1 -- Progress tasks"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/01-progress-task"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos/chaos-api-impl.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/progress-tasks",
        children: "Progress tasks"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "withProgress"
      }), " API shows a task in the Podman Desktop task widget with a title, message, and progress bar."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos/chaos-api-impl.ts"
      }), ", the placeholder comment above the call to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "this.engine.stopAll()"
      }), " describes what to implement:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "async stopAllChaos(): Promise<void> {\n  // -------------------------------------------------------------------------\n  // #1: Show a progress task while stopping all chaos\n  // Wrap the call to this.engine.stopAll() inside extensionApi.window.withProgress():\n  //   - location: extensionApi.ProgressLocation.TASK_WIDGET\n  //   - title: 'Stop All Chaos'\n  // Inside the callback, use progress.report({ message }) to show status,\n  // then call this.engine.stopAll(), then report completion with increment: 100.\n  // Bonus: use increment (0-100) in progress.report() to show intermediate progress steps.\n  // Hint: extensionApi.window.withProgress({ location, title }, async (progress) => { ... })\n  // -------------------------------------------------------------------------\n  await this.engine.stopAll();\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Replace it with a progress-reporting version:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "async stopAllChaos(): Promise<void> {\n  await extensionApi.window.withProgress(\n    { location: extensionApi.ProgressLocation.TASK_WIDGET, title: 'Stop All Chaos' },\n    async progress => {\n      progress.report({ increment: 0, message: 'Stopping all chaos operations...' });\n      await new Promise(resolve => setTimeout(resolve, 1500));\n      progress.report({ increment: 50, message: 'Hacking NASA in meantime...' });\n      await new Promise(resolve => setTimeout(resolve, 1500));\n      await this.engine.stopAll();\n      progress.report({ increment: 100, message: 'All chaos operations stopped' });\n    },\n  );\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "progress.report()"
      }), " accepts ", (0,jsx_runtime.jsx)(_components.code, {
        children: "message"
      }), " (text shown under the title) and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "increment"
      }), " (0--100 progress bar value)."]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(41763)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "steps-2--3----status-bar",
      children: "Steps 2--3 -- Status bar"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/02-status-bar"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/03-status-bar-dynamic"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/status-bar",
        children: "Status bar"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "creating-a-static-status-bar-item",
      children: "Creating a static status bar item"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "createStatusBarItem()"
      }), " adds a clickable item to the bottom bar. Set its ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".text"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".command"
      }), ", and call ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".show()"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const chaosStatusBar = extensionApi.window.createStatusBarItem();\nchaosStatusBar.text = 'Chaos Lab';\nchaosStatusBar.command = 'chaos-lab.openChaos';\nif (settings.showStatusBarChaos) {\n  chaosStatusBar.show();\n}\nextensionContext.subscriptions.push(chaosStatusBar);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "dynamically-updating-the-text",
      children: "Dynamically updating the text"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Still in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ", use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "setInterval"
      }), " to poll ", (0,jsx_runtime.jsx)(_components.code, {
        children: "chaosEngine.getState()"
      }), " and reflect the number of active attacks:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "statusBarUpdateInterval = setInterval(() => {\n  const state = chaosEngine?.getState();\n  if (state && state.runningAttacks > 0) {\n    chaosStatusBar.text = `Chaos Lab (${state.runningAttacks} active)`;\n  } else {\n    chaosStatusBar.text = 'Chaos Lab';\n  }\n}, 3000);\nextensionContext.subscriptions.push({\n  dispose: () => {\n    if (statusBarUpdateInterval) {\n      clearInterval(statusBarUpdateInterval);\n      statusBarUpdateInterval = undefined;\n    }\n  },\n});\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Always push disposables to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionContext.subscriptions"
      }), " so they are cleaned up when the extension deactivates."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Static status bar item:"
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(29506)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Dynamic updates reflecting active attacks:"
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(54113)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "steps-4--5----commands",
      children: "Steps 4--5 -- Commands"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/04-command-stop-all"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/05-command-open-dashboard"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/commands",
        children: "Commands"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Commands are registered with ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensionApi.commands.registerCommand(id, callback)"
      }), ". The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "id"
      }), " must match entries in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " under ", (0,jsx_runtime.jsx)(_components.code, {
        children: "contributes.commands"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "stop-all-chaos-command",
      children: "\"Stop All Chaos\" command"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Registered in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const stopAllCommand = extensionApi.commands.registerCommand('chaos-lab.stopAll', async () => {\n  await chaosApiImpl.stopAllChaos();\n  await extensionApi.window.showInformationMessage('All chaos operations have been stopped and rolled back.');\n});\nextensionContext.subscriptions.push(stopAllCommand);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "showInformationMessage"
      }), " displays a toast notification in the UI."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "open-dashboard-command",
      children: "\"Open Dashboard\" command"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Also in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const openChaosCommand = extensionApi.commands.registerCommand('chaos-lab.openChaos', () => {\n  panel.reveal();\n});\nextensionContext.subscriptions.push(openChaosCommand);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Make sure to also declare the command in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/package.json"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"commands\": [\n      { \"command\": \"chaos-lab.stopAll\", \"title\": \"Chaos Lab: Stop All Chaos\" },\n      { \"command\": \"chaos-lab.openChaos\", \"title\": \"Chaos Lab: Open Dashboard\" }\n    ]\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "\"Stop All Chaos\" command with toast notification:"
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(44912)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "\"Open Dashboard\" command revealing the extension's Chaos Lab tab:"
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(14431)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-6----webview-messaging",
      children: "Step 6 -- Webview messaging"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/06-command-view-container"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/webview-messaging",
        children: "Webview messaging"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ", extensions communicate with their webview via ", (0,jsx_runtime.jsx)(_components.code, {
        children: "postMessage"
      }), ". This command receives a container object from a context menu, opens the dashboard, and tells the frontend to navigate to that container's detail page:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const viewContainerCommand = extensionApi.commands.registerCommand(\n  'chaos-lab.viewContainerUsage',\n  async (container: { id?: string; Id?: string }) => {\n    const containerId = container?.id ?? container?.Id;\n    panel.reveal();\n    await new Promise(resolve => setTimeout(resolve, 200));\n    await panel.webview.postMessage({\n      type: 'navigate',\n      url: `/chaos/container/${containerId}`,\n    });\n  },\n);\nextensionContext.subscriptions.push(viewContainerCommand);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The short delay gives the webview time to become visible before receiving the message. On the frontend side, a message listener in Svelte picks up ", (0,jsx_runtime.jsx)(_components.code, {
        children: "{ type: 'navigate' }"
      }), " and routes accordingly."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The context menu entry is declared in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/package.json"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"menus\": {\n      \"dashboard/container\": [{ \"command\": \"chaos-lab.viewContainerUsage\", \"title\": \"View Container (Chaos Lab)\" }]\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(48766)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-7----tray-menu",
      children: "Step 7 -- Tray menu"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/07-tray-menu"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/tray-menu",
        children: "Tray menu"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ", register a submenu in the system tray that groups related commands:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const trayItem = extensionApi.tray.registerMenuItem({\n  id: 'chaos-lab.tray',\n  type: 'submenu',\n  label: 'Chaos Lab',\n  submenu: [\n    { id: 'chaos-lab.openChaos', label: 'Open Dashboard', type: 'normal' },\n    { id: 'chaos-lab.stopAll', label: 'Stop All Chaos', type: 'normal' },\n  ],\n});\nextensionContext.subscriptions.push(trayItem);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Each submenu item's ", (0,jsx_runtime.jsx)(_components.code, {
        children: "id"
      }), " must match a registered command. When the user clicks a tray entry, Podman Desktop invokes the corresponding command."]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(73757)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "steps-8--9----configuration",
      children: "Steps 8--9 -- Configuration"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/08-config-change-listener"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/09-config-read-values"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/settings-manager.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/config",
        children: "Configuration"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Configuration properties are declared in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " under ", (0,jsx_runtime.jsx)(_components.code, {
        children: "contributes.configuration"
      }), ". The extension reads them at startup and reacts to changes."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "declaring-configuration-in-packagejson",
      children: "Declaring configuration in package.json"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Add this under ", (0,jsx_runtime.jsx)(_components.code, {
        children: "contributes.configuration"
      }), " in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/package.json"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"configuration\": {\n      \"title\": \"Chaos Lab\",\n      \"properties\": {\n        \"chaos-lab.chaosSafeContainers\": {\n          \"type\": \"string\",\n          \"default\": \"\",\n          \"description\": \"Comma-separated container name patterns that should never be targeted by chaos or isolation (supports * wildcards). Example: 'postgres*,redis-prod'.\"\n        },\n        \"chaos-lab.showStatusBarChaos\": {\n          \"type\": \"boolean\",\n          \"default\": true,\n          \"description\": \"Show the Chaos mode indicator in the status bar.\"\n        }\n      }\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "listening-for-changes",
      children: "Listening for changes"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/settings-manager.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "load(): void {\n  this.readConfig();\n\n  this.disposable = extensionApi.configuration.onDidChangeConfiguration(e => {\n    if (e.affectsConfiguration(CONFIG_SECTION)) {\n      this.readConfig();\n      for (const listener of this.changeListeners) {\n        listener(this.current);\n      }\n    }\n  });\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "reading-configuration-values",
      children: "Reading configuration values"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Still in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/settings-manager.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "private readConfig(): void {\n  const config = extensionApi.configuration.getConfiguration(CONFIG_SECTION);\n\n  this.current = {\n    chaosSafeContainers: this.parseSafeContainers(\n      config.get<string>('chaosSafeContainers') ?? '',\n    ),\n    showStatusBarChaos:\n      config.get<boolean>('showStatusBarChaos') ?? DEFAULT_SETTINGS.showStatusBarChaos,\n  };\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "getConfiguration(section)"
      }), " returns a config reader scoped to your extension. Use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "config.get<T>(key)"
      }), " with a fallback to handle missing values."]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(80011)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "steps-10--11----provider-and-connection-factory",
      children: "Steps 10--11 -- Provider and connection factory"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/10-create-provider"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/11-connection-factory"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos-provider.ts"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Providers appear in the Podman Desktop ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Resources"
      }), " page and can manage connections (machines, engines)."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "creating-the-provider",
      children: "Creating the provider"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos-provider.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "providerInstance = extensionApi.provider.createProvider({\n  id: 'chaos',\n  name: 'Chaos',\n  status: 'installed',\n  version: '1.0.0',\n  images: {\n    icon: './icon.png',\n    logo: { dark: './icon.png', light: './icon.png' },\n  },\n  emptyConnectionMarkdownDescription: 'No Chaos machines running. Click **Create** to spin up a new Chaos machine.',\n});\nextensionContext.subscriptions.push(providerInstance);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "setting-up-the-connection-factory",
      children: "Setting up the connection factory"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Still in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos-provider.ts"
      }), ", the connection factory lets users create new \"machines\" from the Resources page:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "providerInstance.setContainerProviderConnectionFactory({\n  creationDisplayName: 'Chaos Machine',\n  creationButtonTitle: 'Create Chaos Machine',\n\n  create: async (params, logger, _token) => {\n    const machineName = (params['chaos.factory.machine.name'] as string) || `chaos-${Date.now()}`;\n    const cpus = Number(params['chaos.factory.machine.cpus']) || DEFAULT_CONFIG.cpus;\n    const memoryBytes = Number(params['chaos.factory.machine.memory']) || DEFAULT_CONFIG.memoryMb * 1024 * 1024;\n    const diskBytes = Number(params['chaos.factory.machine.diskSize']) || DEFAULT_CONFIG.diskGb * 1024 * 1024 * 1024;\n\n    const memoryMb = Math.round(memoryBytes / (1024 * 1024));\n    const diskGb = Math.round(diskBytes / (1024 * 1024 * 1024));\n    const config: MachineConfig = { cpus, memoryMb, diskGb };\n\n    logger?.log(`Creating Chaos machine '${machineName}' (${cpus} CPUs, ${memoryMb} MB RAM, ${diskGb} GB disk)...`);\n    registerMachineConnection(machineName, config);\n    providerInstance?.updateStatus('ready');\n    logger?.log(`Chaos machine '${machineName}' created and running`);\n  },\n});\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "params"
      }), " object contains values from configuration properties scoped to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ContainerProviderConnectionFactory"
      }), ". The factory parameters (name, CPUs, memory, disk) are declared in the same ", (0,jsx_runtime.jsx)(_components.code, {
        children: "contributes.configuration"
      }), " section of ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " with ", (0,jsx_runtime.jsx)(_components.code, {
        children: "\"scope\": \"ContainerProviderConnectionFactory\""
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The Chaos provider on the Resources page:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "Chaos provider on the Resources page",
        src: (__webpack_require__(48617)/* ["default"] */ .A) + "",
        width: "2314",
        height: "1726"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Creating a Chaos Machine via the connection factory:"
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(70960)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-12----cicd-workflows",
      children: "Step 12 -- CI/CD workflows"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/12-ci-workflows"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Files:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Containerfile"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".github/workflows/pr-check.yaml"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".github/workflows/build-next.yaml"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "packaging-as-an-oci-image",
      children: "Packaging as an OCI image"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The repository-root ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Containerfile"
      }), " uses a multistage build: the first stage installs and builds, the second copies only the built artifacts into a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "scratch"
      }), " image:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-dockerfile",
        children: "FROM node:24-slim AS builder\nENV PNPM_HOME=\"/pnpm\"\nENV PATH=\"$PNPM_HOME:$PATH\"\n\nCOPY . /app\nWORKDIR /app\nRUN npm install --frozen-lockfile\nRUN npm run build\n\nFROM scratch\n\nCOPY --from=builder /app/packages/backend/dist/ /extension/dist\nCOPY --from=builder /app/packages/backend/package.json /extension/\nCOPY --from=builder /app/packages/backend/media/ /extension/media\nCOPY --from=builder /app/LICENSE /extension/\nCOPY --from=builder /app/packages/backend/icon.png /extension/\nCOPY --from=builder /app/README.md /extension/\n\nLABEL org.opencontainers.image.title=\"Podman Desktop Chaos Lab Extension\" \\\n  org.opencontainers.image.description=\"Containers durability harness tool\" \\\n  org.opencontainers.image.vendor=\"DevConf Podman Desktop / Extension demo\" \\\n  io.podman-desktop.api.version=\">= 1.22.0\"\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "io.podman-desktop.api.version"
      }), " label tells Podman Desktop which API version the extension requires."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "pr-check-workflow",
      children: "PR check workflow"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".github/workflows/pr-check.yaml"
      }), " workflow runs lint, format, typecheck, tests, and builds the extension image on every pull request:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "name: pr-check\non: [pull_request]\n\njobs:\n  lint-format-unit:\n    runs-on: ubuntu-24.04\n    steps:\n      - uses: actions/checkout@v6\n      - uses: actions/setup-node@v6\n        with:\n          node-version: 24\n          cache: 'npm'\n      - run: npm install\n      - run: npm run lint:check\n      - run: npm run format:check\n      - run: npm run test\n      - run: npm run typecheck\n      - run: npm run build\n\n  build-container:\n    runs-on: ubuntu-24.04\n    steps:\n      - uses: actions/checkout@v6\n      - run: |\n          podman build -t local_image ./\n          CONTAINER_ID=$(podman create localhost/local_image --entrypoint \"\")\n          mkdir -p output/plugins\n          podman export $CONTAINER_ID | tar -x -C output/plugins/\n          podman rm -f $CONTAINER_ID\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "nightly-build",
      children: "Nightly build"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".github/workflows/build-next.yaml"
      }), " workflow pushes the extension image to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ghcr.io"
      }), " on every merge to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "main"
      }), " or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "dev_conf"
      }), ", tagged with both ", (0,jsx_runtime.jsx)(_components.code, {
        children: "nightly"
      }), " and the commit SHA:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "name: Build and Push\non:\n  push:\n    branches: ['main', 'dev_conf']\n  workflow_dispatch:\n\njobs:\n  build:\n    runs-on: ubuntu-24.04\n    steps:\n      - uses: actions/checkout@v6\n      - name: Login to ghcr.io\n        run: echo \"${{ secrets.GITHUB_TOKEN }}\" | podman login --username ${{ github.repository_owner }} --password-stdin ghcr.io\n      - name: Publish Image\n        run: |\n          IMAGE_NAME=ghcr.io/${{ github.repository_owner }}/podman-desktop-extension-chaos-lab\n          podman build -t ${IMAGE_NAME}:nightly .\n          podman push ${IMAGE_NAME}:nightly\n          podman tag ${IMAGE_NAME}:nightly ${IMAGE_NAME}:${GITHUB_SHA}\n          podman push ${IMAGE_NAME}:${GITHUB_SHA}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-13----onboarding",
      children: "Step 13 -- Onboarding"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/13-onboarding"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos-provider.ts"
      }), " + ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/package.json"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/onboarding-workflow",
        children: "Onboarding workflow"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Onboarding workflows guide first-time users through setup. The UI is declared in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "package.json"
      }), " and Podman Desktop renders it automatically -- your code just sets context values. This flow has five steps: checking for an existing provider, a welcome/info screen, creating a Chaos Machine, handling creation failures, and a success screen."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "declarative-onboarding-in-packagejson",
      children: "Declarative onboarding in package.json"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/package.json"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"contributes\": {\n    \"onboarding\": {\n      \"title\": \"Chaos Lab Setup\",\n      \"enablement\": \"!onboardingContext:chaosProviderReady\",\n      \"steps\": [\n        {\n          \"id\": \"checkProviderCommand\",\n          \"label\": \"Check Provider\",\n          \"title\": \"Checking for Chaos provider\",\n          \"command\": \"chaos-lab.onboarding.checkProvider\",\n          \"completionEvents\": [\"onCommand:chaos-lab.onboarding.checkProvider\"]\n        },\n        {\n          \"id\": \"welcomeView\",\n          \"label\": \"Setup\",\n          \"title\": \"Chaos Lab Setup\",\n          \"when\": \"!onboardingContext:chaosProviderReady\",\n          \"content\": [\n            [{ \"value\": \"Chaos Lab needs a Chaos Machine to run chaos experiments against your containers.\" }],\n            [\n              {\n                \"value\": \"The next step will create a Chaos Machine using the provider's connection factory. You can customize CPU, memory, and disk settings.\",\n                \"highlight\": true\n              }\n            ]\n          ]\n        },\n        {\n          \"id\": \"createMachineView\",\n          \"label\": \"Create Machine\",\n          \"title\": \"Create a Chaos Machine\",\n          \"when\": \"!onboardingContext:chaosProviderReady\",\n          \"component\": \"createContainerProviderConnection\",\n          \"completionEvents\": [\"onboardingContext:chaosProviderReady\"]\n        },\n        {\n          \"id\": \"createMachineFailure\",\n          \"title\": \"Failed creating Chaos Machine\",\n          \"when\": \"onboardingContext:chaosMachineCreationFailed\",\n          \"state\": \"failed\",\n          \"content\": [\n            [\n              {\n                \"value\": \"Failed to create the Chaos Machine. :button[Retry setup]{command=chaos-lab.onboarding.checkProvider}\"\n              }\n            ]\n          ]\n        },\n        {\n          \"id\": \"setupSuccess\",\n          \"title\": \"Chaos Lab is ready\",\n          \"when\": \"onboardingContext:chaosProviderReady\",\n          \"state\": \"completed\",\n          \"content\": [\n            [\n              {\n                \"value\": \"#### Chaos Lab is ready!\\nYour Chaos Machine has been created. Open the **Chaos Lab Dashboard** to start running chaos experiments.\\n\\n:button[Open Dashboard]{command=chaos-lab.openChaos}\",\n                \"highlight\": true\n              }\n            ]\n          ]\n        }\n      ]\n    }\n  }\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "setting-context-values-from-code",
      children: "Setting context values from code"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos-provider.ts"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const checkProviderDisposable = extensionApi.commands.registerCommand(\n  'chaos-lab.onboarding.checkProvider',\n  async () => {\n    const ready = machines.size > 0;\n    extensionApi.context.setValue('chaosProviderReady', ready, 'onboarding');\n  },\n);\nextensionContext.subscriptions.push(checkProviderDisposable);\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In the connection factory ", (0,jsx_runtime.jsx)(_components.code, {
        children: "create"
      }), " callback (", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/chaos-provider.ts"
      }), "), set the context on success or failure:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "try {\n  registerMachineConnection(machineName, config);\n  providerInstance?.updateStatus('ready');\n  logger?.log(`Chaos machine '${machineName}' created and running`);\n  extensionApi.context.setValue('chaosProviderReady', true, 'onboarding');\n} catch (err) {\n  extensionApi.context.setValue('chaosMachineCreationFailed', true, 'onboarding');\n  throw err;\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The third argument ", (0,jsx_runtime.jsx)(_components.code, {
        children: "'onboarding'"
      }), " scopes the value so the onboarding UI's ", (0,jsx_runtime.jsx)(_components.code, {
        children: "when"
      }), " clauses can react to it."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "resetting-onboarding-for-repeated-testing",
      children: "Resetting onboarding for repeated testing"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["While iterating on this step you'll likely complete the onboarding once and then want to see it again. In both cases below, first delete the Chaos Machine from the Resources page so ", (0,jsx_runtime.jsx)(_components.code, {
        children: "checkProviderCommand"
      }), " sees ", (0,jsx_runtime.jsx)(_components.code, {
        children: "machines.size === 0"
      }), " again -- the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "chaosProviderReady"
      }), " / ", (0,jsx_runtime.jsx)(_components.code, {
        children: "chaosMachineCreationFailed"
      }), " context values above live in memory rather than on disk, so they need ", (0,jsx_runtime.jsx)(_components.code, {
        children: "machines.size === 0"
      }), " to be re-evaluated. Then reset with either:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Reset Onboarding"
        }), " button inside the Chaos Lab extension -- the onboarding Setup button reappears immediately, no restart required."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(9172)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "2",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["If you also want to reset Podman Desktop's own general \"Welcome\" screen (the first-run splash, unrelated to this extension, tracked via a ", (0,jsx_runtime.jsx)(_components.code, {
          children: "\"welcome.version\""
        }), " entry in your local ", (0,jsx_runtime.jsx)(_components.code, {
          children: "settings.json"
        }), "): remove that entry, install the extension from the published GitHub image instead of a local folder (see ", (0,jsx_runtime.jsx)(_components.a, {
          href: "#packaging-and-distribution",
          children: "Packaging and distribution"
        }), " below), and restart Podman Desktop."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "\"welcome.version\": \"initial\"\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["By default ", (0,jsx_runtime.jsx)(_components.code, {
        children: "settings.json"
      }), " lives at ", (0,jsx_runtime.jsx)(_components.code, {
        children: "~/.local/share/containers/podman-desktop/configuration/settings.json"
      }), " (macOS, Windows, and most Linux installs); on newer Linux installs following the XDG Base Directory spec without a pre-existing legacy config, it's instead at ", (0,jsx_runtime.jsx)(_components.code, {
        children: "~/.config/containers/podman-desktop/settings.json"
      }), ". See ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/main/CONTRIBUTING.md",
        children: "CONTRIBUTING.md"
      }), " for details."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "NOTE:"
          })
        }), " if your extension is still loaded as a ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "local folder"
        }), " (Extensions > Local Extensions > Add a local folder...), it will not survive this restart and you'll need to add it again -- installing from the published image avoids that."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)("video", {
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      width: "100%",
      children: (0,jsx_runtime.jsx)("source", {
        src: (__webpack_require__(60414)/* ["default"] */ .A),
        type: "video/webm"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-14----cli-tool",
      children: "Step 14 -- CLI tool"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Branch:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "workshop/14-cli-tool"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "File:"
      }), " ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), " | ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Docs:"
      }), " ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/cli-tools",
        children: "CLI tools"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["In ", (0,jsx_runtime.jsx)(_components.code, {
        children: "packages/backend/src/extension.ts"
      }), ", register a CLI tool so it appears in the Podman Desktop CLI tools settings:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-typescript",
        children: "const chaosCli = extensionApi.cli.createCliTool({\n  name: 'chaos-cli',\n  displayName: 'Chaos CLI',\n  markdownDescription: 'CLI for managing chaos experiments from the terminal',\n  images: { icon: './icon.png' },\n  version: '0.1.0',\n  path: '/usr/local/bin/chaos-cli',\n});\nextensionContext.subscriptions.push(chaosCli);\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The chaos-cli registered in the CLI Tools settings:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "CLI Tools page showing chaos-cli",
        src: (__webpack_require__(65037)/* ["default"] */ .A) + "",
        width: "2728",
        height: "2128"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This step only registers the tool so it's visible on the CLI Tools page. If you want to further enhance the CLI tool settings see ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/extensions/developing/cli-tools",
        children: "CLI tools"
      }), " for how to wire up install and update actions."]
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "packaging-and-distribution",
      children: "Packaging and distribution"
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "building-the-oci-image-locally",
      children: "Building the OCI image locally"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "podman build -t chaos-lab .\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "installing-from-a-local-image",
      children: "Installing from a local image"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Extract the image filesystem into the Podman Desktop plugins directory:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "pluginsFolder=~/.local/share/containers/podman-desktop/plugins/\nmkdir -p $pluginsFolder\n\nCONTAINER_ID=$(podman create localhost/chaos-lab --entrypoint \"\")\npodman export $CONTAINER_ID | tar -x -C $pluginsFolder\nmv $pluginsFolder/extension $pluginsFolder/chaoslab-extension\n\npodman rm -f $CONTAINER_ID\npodman rmi -f localhost/chaos-lab:latest\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Restart Podman Desktop and the extension appears automatically."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "installing-a-published-image",
      children: "Installing a published image"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Once an extension image is published to a registry, users can install it from ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Extensions > Install Custom..."
      }), " using the image reference -- no need to build anything locally. This applies even if you cloned the workshop repository to follow along: you don't have to build an image yourself unless you've made changes you want to keep. There are two ways to get a published image reference:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: "Option A -- use the pre-built image from GitHub Container Registry"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Just following along without modifying the code? Since the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/gastoner/extension-template-full",
        children: "companion repository"
      }), " lives on GitHub, its ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Build and Push"
      }), " workflow builds and publishes the extension image to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ghcr.io"
      }), " on every push to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "main"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "dev_conf"
      }), ", tagged with both ", (0,jsx_runtime.jsx)(_components.code, {
        children: "nightly"
      }), " and the commit SHA -- so you can install a working build without touching your local clone at all:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        children: "ghcr.io/gastoner/podman-desktop-extension-chaos-lab:72801bd25586393e1476489cad2475b8b5d510f0\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Use the SHA tag above to install that exact commit, or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "ghcr.io/gastoner/podman-desktop-extension-chaos-lab:nightly"
      }), " for the latest build."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: "Option B -- build and publish your own image"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Made your own changes to the cloned repository? Build and publish your version instead:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "podman build -t quay.io/myusername/chaos-lab .\npodman login quay.io\npodman push quay.io/myusername/chaos-lab\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Then use ", (0,jsx_runtime.jsx)(_components.code, {
        children: "quay.io/myusername/chaos-lab"
      }), " as the image reference."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "Install Custom Extension dialog",
        src: (__webpack_require__(30228)/* ["default"] */ .A) + "",
        width: "2668",
        height: "1836"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "testing-with-a-custom-catalog",
      children: "Testing with a custom catalog"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To test catalog integration locally, create an ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensions.json"
      }), " file based on the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop-catalog/blob/main/static/api/extensions.json",
        children: "official catalog"
      }), ", add your extension entry, serve it with a local HTTP server, and point Podman Desktop to it."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Add an entry to the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensions"
      }), " array following the catalog schema:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"publisher\": { \"publisherName\": \"your-namespace\", \"displayName\": \"Your Name\" },\n  \"extensionName\": \"chaos-lab\",\n  \"displayName\": \"Chaos Lab\",\n  \"shortDescription\": \"Chaos engineering toolkit for containers\",\n  \"categories\": [\"Other\"],\n  \"versions\": [\n    {\n      \"version\": \"0.1.0\",\n      \"preview\": true,\n      \"lastUpdated\": \"2026-07-15T00:00:00Z\",\n      \"ociUri\": \"ghcr.io/gastoner/podman-desktop-extension-chaos-lab:nightly\"\n    }\n  ]\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Then serve the file with a local HTTP server:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "python -m http.server 8080\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Add to your ", (0,jsx_runtime.jsx)(_components.code, {
        children: "settings.json"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"extensions.registryUrl\": \"http://localhost:8080/extensions.json\"\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Extensions > Catalog"
      }), " and your extension appears alongside the official ones."]
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "In this walkthrough we covered the core Podman Desktop extension APIs:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "API"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "What it does"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "window.withProgress"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Show progress tasks in the task widget"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "window.createStatusBarItem"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Add indicators to the status bar"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "commands.registerCommand"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Register clickable actions"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "window.showInformationMessage"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Display toast notifications"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "webview.postMessage"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Communicate with webview panels"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "tray.registerMenuItem"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Add items to the system tray"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "configuration.getConfiguration"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Read user settings"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "configuration.onDidChangeConfiguration"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "React to setting changes"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "provider.createProvider"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Register a provider on the Resources page"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "setContainerProviderConnectionFactory"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Let users create connections"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "context.setValue"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Drive onboarding workflows"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "cli.createCliTool"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Register CLI tools"
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The full workshop repository with all 14 progressive branches is available at ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/gastoner/extension-template-full",
        children: "gastoner/extension-template-full"
      }), ". Check out the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "dev_conf"
      }), " branch for the completed solution."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For more details, see:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://www.npmjs.com/package/@podman-desktop/api",
          children: "Extension API reference"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions",
          children: "Extension documentation"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://www.npmjs.com/package/@podman-desktop/ui-svelte",
          children: "UI component library"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/templates",
          children: "Extension templates"
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

/***/ 41763
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop1-8d6bafa65c49843689986b92f57281bf.webm");

/***/ },

/***/ 70960
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop11-7ccddc35f0afb607ad36abdedaba6234.webm");

/***/ },

/***/ 60414
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop13-f08e34d86fda94a93a7f8267f1d68e58.webm");

/***/ },

/***/ 29506
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop2-6c527f044f5cc0600bb45921f4e472c5.webm");

/***/ },

/***/ 54113
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop3-dceb51c3453980d16587c286191c5402.webm");

/***/ },

/***/ 44912
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop4-bf11246f8911cd857a550676d9798451.webm");

/***/ },

/***/ 14431
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop5-fd929f714189940bac593383bd01fbf6.webm");

/***/ },

/***/ 48766
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop6-aacb7fcac6d13e44bfbb9121756b3ffe.webm");

/***/ },

/***/ 73757
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop7-dbb20ce4b5cb59ed1646201109df2d1f.webm");

/***/ },

/***/ 80011
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshop9-51c1d2bc65e21d7038678eafa999d910.webm");

/***/ },

/***/ 49678
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshopAutomaticReloadOfExtension-2bc448a6f8e46feb4ce083d4e922174a.webm");

/***/ },

/***/ 9172
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshopOnboardingPrep-4d4220a6a1bf243b6e9fdf819f8ddafc.webm");

/***/ },

/***/ 36933
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshopPrep-5313ee049bff27765a38d0636491c678.webm");

/***/ },

/***/ 28157
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshopReloadOfExtension-e9edb225d009f1c762c9dc8eee015113.webm");

/***/ },

/***/ 21610
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/medias/workshopStartChaos-0384dff5b1c89780d2eb4298ca19e796.webm");

/***/ },

/***/ 30228
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/custom_install-478acc70559f9c5616cd65214c6be0f8.png");

/***/ },

/***/ 48617
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/workshop10-ab0b640623a8489fa019ae2fc4cf511d.png");

/***/ },

/***/ 65037
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/workshop14-f11f4bcaf2cfc2f07a106aa32e1c0aeb.png");

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