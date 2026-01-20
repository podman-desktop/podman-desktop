"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[82219],{

/***/ 19375
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-installed-successfully-888b099b4ab5da13cd44d1d692b43d16.png");

/***/ },

/***/ 28322
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_installation_macos_install_md_b98_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-installation-macos-install-md-b98.json
const site_docs_installation_macos_install_md_b98_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"installation/macos-install","title":"macOS","description":"How to install Podman Desktop and Podman on macOS.","source":"@site/docs/installation/macos-install.md","sourceDirName":"installation","slug":"/installation/macos-install","permalink":"/docs/installation/macos-install","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/installation/macos-install.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"installing","permalink":"/docs/tags/installing"},{"inline":true,"label":"macOS","permalink":"/docs/tags/mac-os"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"macOS","description":"How to install Podman Desktop and Podman on macOS.","tags":["podman-desktop","installing","macOS"],"keywords":["podman desktop","containers","podman","installing","installation","macOS"]},"sidebar":"mySidebar","previous":{"title":"Windows","permalink":"/docs/installation/windows-install/"},"next":{"title":"Linux","permalink":"/docs/installation/linux-install/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/installation/macos-install.md


const frontMatter = {
	sidebar_position: 3,
	title: 'macOS',
	description: 'How to install Podman Desktop and Podman on macOS.',
	tags: [
		'podman-desktop',
		'installing',
		'macOS'
	],
	keywords: [
		'podman desktop',
		'containers',
		'podman',
		'installing',
		'installation',
		'macOS'
	]
};
const contentTitle = 'MacOS';

const assets = {

};



const toc = [{
  "value": "Installing Podman Desktop using the .dmg file: Recommended",
  "id": "installing-podman-desktop-using-the-dmg-file-recommended",
  "level": 2
}, {
  "value": "Installing Podman Desktop using Homebrew: Not recommended",
  "id": "installing-podman-desktop-using-homebrew-not-recommended",
  "level": 2
}, {
  "value": "Installation steps",
  "id": "installation-steps",
  "level": 3
}, {
  "value": "Getting Started",
  "id": "getting-started",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
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
        id: "macos",
        children: "MacOS"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      title: "Prerequisite",
      type: "info",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["Podman Desktop requires the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://docs.podman.io/en/latest/index.html",
          children: "Podman engine"
        }), ". If you do not have the Podman engine installed, Podman Desktop will prompt you to do so when you open it."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can install Podman Desktop on macOS by using:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The .dmg installer file: This is the recommended way to install Podman Desktop, Podman, and Podman CLI smoothly."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Homebrew: This is an alternative way, but it is not recommended, as there is no guarantee of the stability of Brew installs of Podman and Podman Desktop."
        }), "\n", (0,jsx_runtime.jsxs)(_components.admonition, {
          type: "note",
          children: [(0,jsx_runtime.jsx)(_components.p, {
            children: "If you have already installed Podman using Homebrew, perform one of the following steps to avoid any unexpected results when using Podman Desktop:"
          }), (0,jsx_runtime.jsxs)(_components.ul, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
              children: "Uninstall Podman through Homebrew before using the recommended .dmg installer."
            }), "\n", (0,jsx_runtime.jsx)(_components.li, {
              children: "Do not use the .dmg installer to install Podman Desktop. Instead, use Homebrew only."
            }), "\n"]
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop-using-the-dmg-file-recommended",
      children: "Installing Podman Desktop using the .dmg file: Recommended"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Download the ", (0,jsx_runtime.jsx)(_components.code, {
            children: ".dmg"
          }), " file from the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/downloads/macos",
            children: "Downloads"
          }), " section of the website."]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "While we recommend getting the \"universal\" binary file, which will work irrespective of the chip architecture your Mac possesses, you also have the option to download the applicable .dmg file depending on your Mac hardware architecture (that is, Intel or Apple M1)."
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Locate the downloaded file, and double-click on it. Usually, you will find the downloaded file in the Downloads folder."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Drag the Podman Desktop application and drop it to the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "Applications"
          }), " folder."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "drag and drop the Podman Desktop application",
            src: (__webpack_require__(92612)/* ["default"] */ .A) + "",
            width: "843",
            height: "590"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Start Podman Desktop from the 'Launchpad' or Mac's ", (0,jsx_runtime.jsx)(_components.code, {
            children: "Applications"
          }), " directory. The Dashboard page opens with a notification to set up Podman."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Set up"
          }), " to install Podman from Podman Desktop.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "set up button",
            src: (__webpack_require__(43976)/* ["default"] */ .A) + "",
            width: "1316",
            height: "357"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Next"
          }), ". A confirmation notification to install Podman opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Yes"
          }), ". The Podman Installer screen opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Follow the instructions on the screen, enter your system password when prompted, and click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Install Software"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "system password to install Podman",
            src: (__webpack_require__(64836)/* ["default"] */ .A) + "",
            width: "1016",
            height: "806"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Close"
          }), " on the screen. A page notifying that Podman has been set up correctly opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Next"
          }), ". A page notifying you to create a Podman machine opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "podman installed correctly notification",
            src: (__webpack_require__(19375)/* ["default"] */ .A) + "",
            width: "1128",
            height: "1022"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Next"
          }), ", and then click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "notification to create a podman machine",
            src: (__webpack_require__(59579)/* ["default"] */ .A) + "",
            width: "1139",
            height: "1022"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Next"
          }), " to navigate back to the Dashboard page."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop installation is now complete. The Podman engine is installed, and the Podman machine is created. You are ready to use the application."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop-using-homebrew-not-recommended",
      children: "Installing Podman Desktop using Homebrew: Not recommended"
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      title: "Prerequisite",
      type: "info",
      children: (0,jsx_runtime.jsxs)(_components.ul, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "https://brew.sh/",
            children: "Homebrew"
          })
        }), "\n"]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "installation-steps",
      children: "Installation steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Open a terminal on your Mac."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following command:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "brew install --cask podman-desktop\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Homebrew will also install the Podman engine along with the Podman Desktop application in case you do not have it installed."
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["After the command is executed, you can find the Podman Desktop application in the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "Applications"
          }), " directory of macOS."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "getting-started",
      children: "Getting Started"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Learn more on how to get started with Podman Desktop by clicking ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/containers",
        children: "here"
      }), "."]
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


/***/ },

/***/ 43976
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-set-up-button-c8a23f530b8730833879d0981af22cae.png");

/***/ },

/***/ 59579
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/notification-to-create-podman-machine-ca7dedfa6fe6172d6bf5c821dbde633b.png");

/***/ },

/***/ 64836
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/system-password-31a209293b94ed724ccaf50b1dd2130e.png");

/***/ },

/***/ 92612
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/click-and-drag-5d76d30e2c48a81289b30e677c8c0f06.png");

/***/ }

}]);