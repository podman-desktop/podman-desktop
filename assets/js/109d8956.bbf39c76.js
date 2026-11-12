"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[63471],{

/***/ 98947
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_install_updating_extensions_mdx_109_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-install-updating-extensions-mdx-109.json
const site_docs_extensions_install_updating_extensions_mdx_109_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/install/updating-extensions","title":"Updating","description":"Keep your Podman Desktop extensions up to date","source":"@site/docs/extensions/install/updating-extensions.mdx","sourceDirName":"extensions/install","slug":"/extensions/install/updating-extensions","permalink":"/docs/extensions/install/updating-extensions","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/install/updating-extensions.mdx","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"updating","permalink":"/docs/tags/updating"}],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"title":"Updating","description":"Keep your Podman Desktop extensions up to date","tags":["podman-desktop","extension","updating"],"keywords":["podman desktop","extension","update","automatic updates"]},"sidebar":"mySidebar","previous":{"title":"Installing","permalink":"/docs/extensions/install/"},"next":{"title":"Usage","permalink":"/docs/extensions/install/using-extension"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/ThemedImage/index.js + 2 modules
var ThemedImage = __webpack_require__(90448);
;// ./docs/extensions/install/updating-extensions.mdx


const frontMatter = {
	sidebar_position: 2,
	title: 'Updating',
	description: 'Keep your Podman Desktop extensions up to date',
	tags: [
		'podman-desktop',
		'extension',
		'updating'
	],
	keywords: [
		'podman desktop',
		'extension',
		'update',
		'automatic updates'
	]
};
const contentTitle = 'Updating a Podman Desktop extension';

const assets = {

};




const toc = [{
  "value": "How updates work",
  "id": "how-updates-work",
  "level": 2
}, {
  "value": "Configuring automatic updates",
  "id": "configuring-automatic-updates",
  "level": 2
}, {
  "value": "Turning off automatic updates for one extension",
  "id": "turning-off-automatic-updates-for-one-extension",
  "level": 2
}, {
  "value": "Updating an extension manually",
  "id": "updating-an-extension-manually",
  "level": 2
}, {
  "value": "Following an update",
  "id": "following-an-update",
  "level": 2
}, {
  "value": "Verification",
  "id": "verification",
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
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "updating-a-podman-desktop-extension",
        children: "Updating a Podman Desktop extension"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop checks the extension catalog for newer versions of your extensions, and installs them automatically by default. You can turn off automatic updates for all extensions or for one extension, and update an extension manually when you are ready."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "how-updates-work",
      children: "How updates work"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Podman Desktop checks for updates at startup, and then every 12 hours."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["An extension is checked when its ID matches an extension in the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions/catalog",
          children: "extension catalog"
        }), ", even if you installed it from another image. Docker Desktop extensions and extensions loaded from a local folder are not updated."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Podman Desktop compares the installed version with the latest version of the extension in the catalog that is compatible with your Podman Desktop version. Preview versions are never installed by an update."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Updating an extension removes the installed version and installs the new one from its image."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Extensions bundled with Podman Desktop are also updated from the catalog. The new version replaces the bundled one. To go back to the bundled version, uninstall the extension, then ", (0,jsx_runtime.jsx)(_components.a, {
          href: "#turning-off-automatic-updates-for-one-extension",
          children: "disable its automatic updates"
        }), ". Otherwise, the next check updates it again."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "configuring-automatic-updates",
      children: "Configuring automatic updates"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Two settings control updates for all extensions. Both are enabled by default."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings > Preferences"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Extensions"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Configure the settings:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Auto Update"
            }), ": check for extension updates, and download and install them automatically."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Auto Check Updates"
            }), ": when ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Auto Update"
            }), " is disabled, still check for extension updates, and show an ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Update available"
            }), " link when a newer version exists, so you can update manually."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
          alt: "Extensions preferences with the Auto Check Updates and Auto Update settings",
          sources: {
            light: (__webpack_require__(52965)/* ["default"] */ .A),
            dark: (__webpack_require__(13999)/* ["default"] */ .A)
          }
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When both settings are disabled, Podman Desktop does not check for updates. Enabling one of them runs a check right away."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The settings are stored as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensions.autoCheckUpdates"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "extensions.autoUpdate"
      }), " in the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/configuration/settings-reference",
        children: "settings file"
      }), ". Your administrator can lock them with a ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/configuration/managed-configuration",
        children: "managed configuration"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "turning-off-automatic-updates-for-one-extension",
      children: "Turning off automatic updates for one extension"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can keep automatic updates for all extensions, and pin one extension to its installed version."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Extensions"
          }), " button."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Installed"
          }), " tab, click the name of the extension to open its details."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Next to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Auto-update"
          }), ", click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Disable"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
          alt: "Extension details with the Auto-update entry",
          sources: {
            light: (__webpack_require__(80557)/* ["default"] */ .A),
            dark: (__webpack_require__(20199)/* ["default"] */ .A)
          }
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop still checks this extension for updates, and shows the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Update available"
      }), " link when a newer version exists. Click ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Enable"
      }), " to turn automatic updates back on. Uninstalling the extension also turns them back on."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "updating-an-extension-manually",
      children: "Updating an extension manually"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When automatic updates are disabled for this extension, or when ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Auto Update"
      }), " is disabled and ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Auto Check Updates"
      }), " is enabled, update the extension yourself:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Extensions"
          }), " button."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Installed"
          }), " tab, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Update available"
          }), " next to the extension version. Hover the link to see the version that will be installed. The link is also next to the version on the details page of the extension."]
        }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
          alt: "Installed extensions list with an Update available link",
          sources: {
            light: (__webpack_require__(12791)/* ["default"] */ .A),
            dark: (__webpack_require__(43481)/* ["default"] */ .A)
          }
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "following-an-update",
      children: "Following an update"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Each update, automatic or manual, runs as a task named ", (0,jsx_runtime.jsxs)(_components.strong, {
        children: ["Updating ", (0,jsx_runtime.jsx)(_components.em, {
          children: "extension"
        }), " to v", (0,jsx_runtime.jsx)(_components.em, {
          children: "version"
        })]
      }), ". A notification and the status bar show its progress. While it runs, the extension is not listed in the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Installed"
      }), " tab."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To see the update tasks, click the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Tasks"
      }), " bell icon in the status bar."]
    }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
      alt: "Task manager showing an extension update",
      sources: {
        light: (__webpack_require__(85119)/* ["default"] */ .A),
        dark: (__webpack_require__(76081)/* ["default"] */ .A)
      }
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Installed"
        }), " tab of the Extensions page, the extension shows the new version, and the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Update available"
        }), " link is gone."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "If the update fails, the task shows the error."
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

/***/ 20199
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-auto-update-dark-882c79baddccfe5dcfe4b4cbef735cac.webp");

/***/ },

/***/ 80557
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-auto-update-light-b9ad039c0aa2ef663b3c4d1b76e57984.webp");

/***/ },

/***/ 43481
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-update-available-dark-198aa05063c38576bd2241d8b5600265.webp");

/***/ },

/***/ 12791
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extension-update-available-light-5f2624ab890e958c1337eaa6fc66a12f.webp");

/***/ },

/***/ 76081
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/webp;base64,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");

/***/ },

/***/ 85119
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/webp;base64,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");

/***/ },

/***/ 13999
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extensions-preferences-dark-73af6feee09c47219cf4df8019dd5428.webp");

/***/ },

/***/ 52965
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/extensions-preferences-light-325d37bf138cd8675e9a4d5ef01551ca.webp");

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