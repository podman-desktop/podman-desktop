"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[82219],{

/***/ 28322:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
  "value": "Installing Podman Desktop on macOS using .dmg file",
  "id": "installing-podman-desktop-on-macos-using-dmg-file",
  "level": 2
}, {
  "value": "Installing Podman Desktop on macOS using Homebrew",
  "id": "installing-podman-desktop-on-macos-using-homebrew",
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
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This page contains information regarding installation of Podman Desktop on MacOS."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can install Podman Desktop on macOS:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Using the .dmg file"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Using Homebrew"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      title: "Prerequisite",
      type: "info",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["Podman Desktop requires ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://docs.podman.io/en/latest/index.html",
          children: "Podman Engine"
        }), ". If you don't have Podman Engine installed, Podman Desktop will prompt you to do so at a later stage."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop-on-macos-using-dmg-file",
      children: "Installing Podman Desktop on macOS using .dmg file"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Download the ", (0,jsx_runtime.jsx)(_components.code, {
            children: ".dmg"
          }), " file from the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/downloads/macos",
            children: "Downloads"
          }), " section of this website."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "While we recommend getting the \"universal\" binary file which will work irrespective of the chip architecture your Mac possesses, you also have the option to get the applicable .dmg file depending on your Mac Hardware Architecture (that is Intel or Apple M1)."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Locate the downloaded file, and double-click on it. (Usually, you will find the downloaded file in the Downloads folder)"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "img0",
            src: (__webpack_require__(91528)/* ["default"] */ .A) + "",
            width: "1594",
            height: "786"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Drag Podman Desktop icon to the Applications folder."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "img1",
            src: (__webpack_require__(92612)/* ["default"] */ .A) + "",
            width: "1037",
            height: "703"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Start Podman Desktop from the 'Launchpad' or Mac's ", (0,jsx_runtime.jsx)(_components.code, {
            children: "Applications"
          }), " directory."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "img2",
            src: (__webpack_require__(27373)/* ["default"] */ .A) + "",
            width: "674",
            height: "714"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Install Podman from Podman Desktop, if not yet installed."
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["When you open Podman Desktop for the first time, click on the \"View detection checks\" button to scan if all the prerequisites to use Podman Desktop are met. If it says ", (0,jsx_runtime.jsx)(_components.code, {
            children: "❌ podman cli was not found in the PATH"
          }), ", then you need to install the Podman CLI/Engine which can be done within the application."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "img3",
            src: (__webpack_require__(29681)/* ["default"] */ .A) + "",
            width: "2880",
            height: "1800"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Click on the \"Install\" button next to the \"View detection checks\" button, and follow the instructions on screen."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "You will be redirected to the Podman Installer. Follow the instructions on screen and enter your system password when asked."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "img4",
            src: (__webpack_require__(94932)/* ["default"] */ .A) + "",
            width: "1265",
            height: "1149"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "After the installation is complete, close the installation program. Podman Engine has been installed and you are now ready to use Podman Desktop."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop-on-macos-using-homebrew",
      children: "Installing Podman Desktop on macOS using Homebrew"
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
          children: "Run the command mentioned below."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "brew install --cask podman-desktop\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Homebrew will also install the Podman Engine along with the Podman Desktop application, in case you don't have it installed yet."
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



/***/ }),

/***/ 92612:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/click-and-drag-862777e1ab1bfcafc559dd59f71a77e8.png");

/***/ }),

/***/ 91528:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/download-dmg-a847cf16a9f16dfddba0e46a4dbb3c2b.png");

/***/ }),

/***/ 29681:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pd-before-podman-22ea6273dc67b3521d8836ce6fa717ec.png");

/***/ }),

/***/ 27373:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-desktop-app-9ea27077f1d767753acfb5c574657f27.png");

/***/ }),

/***/ 94932:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/system-pass-563b1bc0979f040e796c2e2eec40f11b.png");

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