"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[17159],{

/***/ 39747:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_troubleshooting_troubleshooting_podman_on_windows_md_308_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-troubleshooting-troubleshooting-podman-on-windows-md-308.json
const site_docs_troubleshooting_troubleshooting_podman_on_windows_md_308_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"troubleshooting/troubleshooting-podman-on-windows","title":"Podman on Windows","description":"How to investigate when Podman does not work as expected.","source":"@site/docs/troubleshooting/troubleshooting-podman-on-windows.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/troubleshooting-podman-on-windows","permalink":"/docs/troubleshooting/troubleshooting-podman-on-windows","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/troubleshooting/troubleshooting-podman-on-windows.md","tags":[],"version":"current","sidebarPosition":20,"frontMatter":{"sidebar_position":20,"title":"Podman on Windows","description":"How to investigate when Podman does not work as expected."},"sidebar":"mySidebar","previous":{"title":"Podman","permalink":"/docs/troubleshooting/troubleshooting-podman"},"next":{"title":"Podman on MacOS","permalink":"/docs/troubleshooting/troubleshooting-podman-on-macos"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/troubleshooting/troubleshooting-podman-on-windows.md


const frontMatter = {
	sidebar_position: 20,
	title: 'Podman on Windows',
	description: 'How to investigate when Podman does not work as expected.'
};
const contentTitle = 'Troubleshooting Podman on Windows';

const assets = {

};



const toc = [{
  "value": "Deleting a corrupted Podman Machine",
  "id": "deleting-a-corrupted-podman-machine",
  "level": 2
}, {
  "value": "Issue",
  "id": "issue",
  "level": 4
}, {
  "value": "Workaround",
  "id": "workaround",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}, {
  "value": "The terminal session attaches to Podman Desktop when launching it from the command line",
  "id": "the-terminal-session-attaches-to-podman-desktop-when-launching-it-from-the-command-line",
  "level": 2
}, {
  "value": "Issue",
  "id": "issue-1",
  "level": 4
}, {
  "value": "Workaround",
  "id": "workaround-1",
  "level": 4
}, {
  "value": "When the host is behind a VPN, Podman cannot access network resources",
  "id": "when-the-host-is-behind-a-vpn-podman-cannot-access-network-resources",
  "level": 2
}, {
  "value": "Solution",
  "id": "solution",
  "level": 4
}, {
  "value": "Older WSL versions might lead to networking issues",
  "id": "older-wsl-versions-might-lead-to-networking-issues",
  "level": 2
}, {
  "value": "Solution",
  "id": "solution-1",
  "level": 4
}, {
  "value": "Windows 10 Enterprise LTSC version 21H2: Podman Desktop is unable to detect WSL2 machine",
  "id": "windows-10-enterprise-ltsc-version-21h2-podman-desktop-is-unable-to-detect-wsl2-machine",
  "level": 2
}, {
  "value": "Solution: Enable Podman Desktop setup to run smoothly",
  "id": "solution-enable-podman-desktop-setup-to-run-smoothly",
  "level": 4
}, {
  "value": "Unable to install Compose extension 2.33.x on Windows due to certificate signature failure",
  "id": "unable-to-install-compose-extension-233x-on-windows-due-to-certificate-signature-failure",
  "level": 2
}, {
  "value": "Workaround",
  "id": "workaround-2",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    h4: "h4",
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
        id: "troubleshooting-podman-on-windows",
        children: "Troubleshooting Podman on Windows"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can find here troubleshooting help for issues specific to Windows."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "deleting-a-corrupted-podman-machine",
      children: "Deleting a corrupted Podman Machine"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "issue",
      children: "Issue"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "You are not able to stop your Podman Machine."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ podman machine stop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The Logs contain this error:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "Error: Error stopping sysd: exit status 1\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "To display the active Windows Subsystem for Linux (WSL) distribution list: in the terminal, run:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ wsl --list\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The command returns the list of active WSL distributions. Identify your Podman Machine in the list, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "podman-machine-default"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["To stop, and uninstall your Podman Machine: in the terminal, replace ", (0,jsx_runtime.jsx)(_components.code, {
            children: "podman-machine-default"
          }), " by your Podman machine name, and run:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ wsl --unregister podman-machine-default\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://learn.microsoft.com/en-us/windows/wsl/basic-commands#unregister-or-uninstall-a-linux-distribution",
          children: "WSL documentation: Uninstall a Linux distribution"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "the-terminal-session-attaches-to-podman-desktop-when-launching-it-from-the-command-line",
      children: "The terminal session attaches to Podman Desktop when launching it from the command line"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "issue-1",
      children: "Issue"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "When you start Podman Desktop from the command line in Windows the terminal session attaches to it."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "When you quit the terminal, it kills Podman Desktop."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround-1",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Set the environment variable ", (0,jsx_runtime.jsx)(_components.code, {
          children: "ELECTRON_NO_ATTACH_CONSOLE"
        }), " to true before launching Podman Desktop."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "when-the-host-is-behind-a-vpn-podman-cannot-access-network-resources",
      children: "When the host is behind a VPN, Podman cannot access network resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When the host is behind a VPN, Podman might fail to access network resources, and display errors such as ", (0,jsx_runtime.jsx)(_components.em, {
        children: "Temporary failure in name resolution"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["See ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/proxy",
        children: "Accessing resources behind a VPN with Podman on Windows"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "older-wsl-versions-might-lead-to-networking-issues",
      children: "Older WSL versions might lead to networking issues"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Older versions of WSL might cause networking issues, such as the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Get-NetTCPConnection"
      }), " error, indicating that the WSL loopback forwarding facility is not functioning correctly. Recent versions of WSL do not have this issue."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-1",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Update Windows to either the 21H1, 21H2, or 22H2 version of Windows 10, or to the 21H1 version of Windows 11, or greater."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Update WSL:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "wsl --update\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Optionally, delete your Podman machine, and create a new one."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "windows-10-enterprise-ltsc-version-21h2-podman-desktop-is-unable-to-detect-wsl2-machine",
      children: "Windows 10 Enterprise LTSC version 21H2: Podman Desktop is unable to detect WSL2 machine"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["On a Windows 10 LTSC version, running the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "wsl --install --no-distribution"
      }), " command does not work, and the Podman Desktop setup does not run smoothly."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You must install a specific Windows Subsystem for Linux (WSL) distribution to make the Podman Desktop setup run smoothly. After setting up Podman Desktop, you can unintsall the WSL distribution."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-enable-podman-desktop-setup-to-run-smoothly",
      children: "Solution: Enable Podman Desktop setup to run smoothly"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Windows 11 or later version"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "wsl --update"
        }), " command to update the WSL kernel."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "wsl --install --no-distribution"
        }), " command to not install any WSL distribution."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart your machine."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Windows 10 LTSC version"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "wsl --update"
        }), " command."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "wsl --install -d <distro>"
        }), " command to install a specific WSL distribution.", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Replace ", (0,jsx_runtime.jsx)(_components.code, {
              children: "distro"
            }), " with any official WSL distribution, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "ubuntu-24.04"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart your machine."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["(Optional): Run the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "wsl --unregister <distro>"
        }), " to uninstall the WSL distribution."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "unable-to-install-compose-extension-233x-on-windows-due-to-certificate-signature-failure",
      children: "Unable to install Compose extension 2.33.x on Windows due to certificate signature failure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Installing the Compose extension version 2.33.x fails, and you receive an error message: ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Unable to fetch the available extensions: certificate signature failure"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround-2",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The reason for the failure could be that the Windows Certificate Store has been improperly loaded with the corporate certificate chain. Usually, all the certificates are placed in one location, namely TrustedRootCA, which results in the failure to import the certificates into the Podman Desktop application."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To get root CA self-signed certificates to work, you can identify where these certificates have been placed in the Windows Certificate Store. Then, you can ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://learn.microsoft.com/en-us/windows-hardware/drivers/install/trusted-root-certification-authorities-certificate-store",
        children: "clean the Store"
      }), " to ensure those certificates are in their proper locations."]
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