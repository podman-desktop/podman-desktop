"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[69838],{

/***/ 42134:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_installation_windows_install_index_md_a35_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-installation-windows-install-index-md-a35.json
const site_docs_installation_windows_install_index_md_a35_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"installation/windows-install/index","title":"Windows","description":"How to install Podman Desktop and Podman on Windows.","source":"@site/docs/installation/windows-install/index.md","sourceDirName":"installation/windows-install","slug":"/installation/windows-install/","permalink":"/docs/installation/windows-install/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/installation/windows-install/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"installing","permalink":"/docs/tags/installing"},{"inline":true,"label":"windows","permalink":"/docs/tags/windows"}],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"title":"Windows","description":"How to install Podman Desktop and Podman on Windows.","tags":["podman-desktop","installing","windows"],"keywords":["podman desktop","containers","podman","installing","installation","windows"]},"sidebar":"mySidebar","previous":{"title":"Installation","permalink":"/docs/installation/"},"next":{"title":"macOS","permalink":"/docs/installation/macos-install"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/installation/windows-install/index.md


const frontMatter = {
	sidebar_position: 1,
	title: 'Windows',
	description: 'How to install Podman Desktop and Podman on Windows.',
	tags: [
		'podman-desktop',
		'installing',
		'windows'
	],
	keywords: [
		'podman desktop',
		'containers',
		'podman',
		'installing',
		'installation',
		'windows'
	]
};
const contentTitle = 'Installing Podman Desktop and Podman on Windows';

const assets = {

};



const toc = [{
  "value": "Installing Podman Desktop",
  "id": "installing-podman-desktop",
  "level": 2
}, {
  "value": "Silent Windows installer",
  "id": "silent-windows-installer",
  "level": 4
}, {
  "value": "Chocolatey",
  "id": "chocolatey",
  "level": 4
}, {
  "value": "Scoop package manager for Windows",
  "id": "scoop-package-manager-for-windows",
  "level": 4
}, {
  "value": "Winget",
  "id": "winget",
  "level": 4
}, {
  "value": "Installing Podman",
  "id": "installing-podman",
  "level": 2
}, {
  "value": "Use WSL2 as machine provider",
  "id": "use-wsl2-as-machine-provider",
  "level": 3
}, {
  "value": "Use Hyper-V as machine provider",
  "id": "use-hyper-v-as-machine-provider",
  "level": 3
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Next steps",
  "id": "next-steps",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
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
  }, {Details, Icon} = _components;
  if (!Details) _missingMdxReference("Details", true);
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "installing-podman-desktop-and-podman-on-windows",
        children: "Installing Podman Desktop and Podman on Windows"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop",
      children: "Installing Podman Desktop"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To install Podman Desktop:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.a, {
            href: "/downloads/windows",
            children: "Download the Windows installer"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "To start the Podman Desktop installer, open the downloaded file."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Podman Desktop Setup installing",
            src: (__webpack_require__(55113)/* ["default"] */ .A) + "",
            width: "479",
            height: "192"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(Details, {
      children: [(0,jsx_runtime.jsxs)("summary", {
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: "Alternate installation methods:"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Silent Windows installer"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Chocolatey"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Scoop"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Winget"
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "silent-windows-installer",
        children: "Silent Windows installer"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "/downloads/windows",
              children: "Download the Windows installer"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: ["To install without user interaction, run the Windows installer with the silent flag ", (0,jsx_runtime.jsx)(_components.code, {
              children: "/S"
            }), " from the Command Prompt:"]
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> podman-desktop-1.6.4-setup-x64.exe /S\n"
            })
          }), "\n"]
        }), "\n"]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "chocolatey",
        children: "Chocolatey"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: ["Install the ", (0,jsx_runtime.jsx)(_components.a, {
              href: "https://chocolatey.org/install",
              children: "Chocolatey package manager"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
            children: "Install from the terminal:"
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> choco install podman-desktop\n"
            })
          }), "\n"]
        }), "\n"]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "scoop-package-manager-for-windows",
        children: "Scoop package manager for Windows"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/ScoopInstaller/Install#readme",
              children: "Install the Scoop package manager"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
            children: "Install from the terminal:"
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> scoop bucket add extras\n> scoop install podman-desktop\n"
            })
          }), "\n"]
        }), "\n"]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "winget",
        children: "Winget"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "https://aka.ms/getwinget",
              children: "Install the Winget Package manager for Windows"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
            children: "Install from the terminal:"
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> winget install -e --id RedHat.Podman-Desktop\n"
            })
          }), "\n"]
        }), "\n"]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman",
      children: "Installing Podman"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "On Windows, running the Podman container engine requires running a Linux distribution on a virtual machine."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "use-wsl2-as-machine-provider",
      children: "Use WSL2 as machine provider"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop creates a ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2",
        children: "Windows Subsystem for Linux version 2 (WSL 2)"
      }), " virtual machine: the Podman Machine."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Main benefits are:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Ease of use."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "WSL 2 native virtualization performance."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Check that your environment has:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "6 GB RAM for the Podman Machine."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Windows Subsystem for Linux version 2 (WSL 2) prerequisites. See ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://docs.microsoft.com/en-us/windows/wsl/install",
          children: "Enabling WSL 2"
        }), ", ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://learn.microsoft.com/en-us/windows/wsl/basic-commands",
          children: "WSL basic commands"
        }), ", and ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://learn.microsoft.com/en-us/windows/wsl/troubleshooting#error-0x80370102-the-virtual-machine-could-not-be-started-because-a-required-feature-is-not-installed",
          children: "Troubleshooting WSL 2"
        }), ":", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "The Windows user has administrator privileges."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Windows 64bit."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Windows 10 Build 19043 or greater, or Windows 11."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["On a virtual machine: ", (0,jsx_runtime.jsx)(_components.a, {
              href: "https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#configure-nested-virtualization",
              children: "Nested Virtualization enabled"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To install the Podman Machine:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "To prepare your system, enable the WSL feature, without installing the default Ubuntu distribution of Linux."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Open the Command Prompt, and run:."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> wsl --update\n> wsl --install --no-distribution\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["If you run the Podman Desktop setup on a Windows 10 LTSC version, you require to install a specific WSL distribution. See ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/troubleshooting/troubleshooting-podman-on-windows#windows-10-enterprise-ltsc-version-21h2-podman-desktop-is-unable-to-detect-wsl2-machine",
              children: "Troubleshooting Podman on Windows"
            })]
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Restart your computer."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), " screen displays: ", (0,jsx_runtime.jsxs)(_components.em, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-info",
              size: "lg"
            }), " Podman needs to be set up"]
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Podman needs set up screen",
            src: (__webpack_require__(46422)/* ["default"] */ .A) + "",
            width: "1920",
            height: "1029"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Set up"
          }), " button."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Review and validate all confirmation screens to set up the Podman machine."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "When necessary, follow the instructions to install system prerequisites."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify that Podman is set up:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), ", the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Podman"
          }), " tile displays ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Podman is running"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Podman is running screen",
            src: (__webpack_require__(76046)/* ["default"] */ .A) + "",
            width: "1920",
            height: "1029"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "use-hyper-v-as-machine-provider",
      children: "Use Hyper-V as machine provider"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["As an administrator, you can set up a Podman machine using Hyper-V as the machine provider type. To do so, select ", (0,jsx_runtime.jsx)(_components.code, {
        children: "hyperv"
      }), " from the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Provider Type"
      }), " dropdown list when ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/podman/creating-a-podman-machine",
        children: "creating a Podman machine"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsx)(_components.p, {
        children: "If you already have a running Podman machine with the WSL provider type, you will be prompted to set the Hyper-V machine as the default machine to avoid CLI errors."
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the created machine in the Podman tile.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "Podman machine with the hyperv provide type",
          src: (__webpack_require__(69939)/* ["default"] */ .A) + "",
          width: "1214",
          height: "476"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/containers",
          children: "Work with containers"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes",
          children: "Work with Kubernetes"
        }), "."]
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
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


/***/ }),

/***/ 46422:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dashboard-podman-needs-set-up-c4b3ae1664f8cd2764af6579522285f5.png");

/***/ }),

/***/ 55113:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-desktop-setup-installing-1364ba0c57da6f44684d0fd8b76e106b.png");

/***/ }),

/***/ 69939:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-machine-hyperv-88aefb583e6a8988ba0edd74f51a4da9.png");

/***/ }),

/***/ 76046:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dashboard-podman-is-running-1c39ff05daf8b1b57c773f1bc33b150b.png");

/***/ })

}]);