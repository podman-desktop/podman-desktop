"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[54642],{

/***/ 19323:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_install_index_md_9e8_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-install-index-md-9e8.json
const site_docs_extensions_install_index_md_9e8_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/install/index","title":"Installing","description":"Install Podman Desktop extension","source":"@site/docs/extensions/install/index.md","sourceDirName":"extensions/install","slug":"/extensions/install/","permalink":"/docs/extensions/install/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/install/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"publishing","permalink":"/docs/tags/publishing"}],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"title":"Installing","description":"Install Podman Desktop extension","tags":["podman-desktop","extension","publishing"],"keywords":["podman desktop","extension","installing-an-extension"]},"sidebar":"mySidebar","previous":{"title":"Extensions","permalink":"/docs/extensions/"},"next":{"title":"Usage","permalink":"/docs/extensions/install/using-extension"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/install/index.md


const frontMatter = {
	sidebar_position: 1,
	title: 'Installing',
	description: 'Install Podman Desktop extension',
	tags: [
		'podman-desktop',
		'extension',
		'publishing'
	],
	keywords: [
		'podman desktop',
		'extension',
		'installing-an-extension'
	]
};
const contentTitle = 'Installing a Podman Desktop extension';

const assets = {

};



const toc = [{
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h4: "h4",
    header: "header",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "installing-a-podman-desktop-extension",
        children: "Installing a Podman Desktop extension"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Installing an extension is a great way to expand the capabilities of Podman Desktop. You have the option to install an extension from the catalog or a custom extension of your choice."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Extensions"
          }), " button. "]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Extension Screenshot",
            src: (__webpack_require__(76985)/* ["default"] */ .A) + "",
            width: "2142",
            height: "1144"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Perform one of the following steps:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Browse the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Catalog"
              }), " and install the required extension. "]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.img, {
                alt: "Catalog Screenshot",
                src: (__webpack_require__(43869)/* ["default"] */ .A) + "",
                width: "1758",
                height: "818"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Install custom..."
              }), " button to install an extension from a container image: "]
            }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Go to any registry, such as Docker Hub, GitHub, or any other registry."
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Find your extension."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Copy the OCI image name of the extension, such as ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "redhatdeveloper/openshift-dd-ext:0.0.1-100"
                }), ", and paste it into the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "OCI Image"
                }), " field.\n", (0,jsx_runtime.jsx)(_components.img, {
                  alt: "Install Custom Extension Dialoge",
                  src: (__webpack_require__(13110)/* ["default"] */ .A) + "",
                  width: "1922",
                  height: "996"
                })]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Install"
                }), ". A successful operation notification opens.\n", (0,jsx_runtime.jsx)(_components.img, {
                  alt: "install a custom extension",
                  src: (__webpack_require__(43564)/* ["default"] */ .A) + "",
                  width: "887",
                  height: "456"
                })]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Done"
                }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
                  alt: "extension installed successfully",
                  src: (__webpack_require__(31729)/* ["default"] */ .A) + "",
                  width: "887",
                  height: "463"
                })]
              }), "\n"]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Verify the extension by checking the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Installed"
          }), " tab on the Extensions page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Depending on the extension, items can appear in the status bar, tray menu, or other areas of Podman Desktop."
        }), "\n"]
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

/***/ 43869:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/browse-catalog-218a13ae0a7a931c3da41119d5da894f.png");

/***/ }),

/***/ 31729:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-installed-successfully-d1f1302a916bde9f1a5f4ce8e5be9b7a.png");

/***/ }),

/***/ 76985:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extensions-icon-cd70b0fa6dfcc3aa6e84232fa936d04f.png");

/***/ }),

/***/ 43564:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/install-a-custom-extension-9985667bcde354eb676c3eb188e8d944.png");

/***/ }),

/***/ 13110:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/install-custom-9fca3818ee87fbb7984965df4f6bb433.png");

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