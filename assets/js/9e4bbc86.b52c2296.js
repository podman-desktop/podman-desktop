"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[34088],{

/***/ 84078
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_configuration_managed_configuration_troubleshooting_md_9e4_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-configuration-managed-configuration-troubleshooting-md-9e4.json
const site_docs_configuration_managed_configuration_troubleshooting_md_9e4_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"configuration/managed-configuration-troubleshooting","title":"Troubleshooting managed configurations","description":"Common issues and solutions for managed configuration in enterprise environments.","source":"@site/docs/configuration/managed-configuration-troubleshooting.md","sourceDirName":"configuration","slug":"/configuration/managed-configuration-troubleshooting","permalink":"/docs/configuration/managed-configuration-troubleshooting","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/configuration/managed-configuration-troubleshooting.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"configuration","permalink":"/docs/tags/configuration"},{"inline":true,"label":"enterprise","permalink":"/docs/tags/enterprise"},{"inline":true,"label":"managed","permalink":"/docs/tags/managed"},{"inline":true,"label":"troubleshooting","permalink":"/docs/tags/troubleshooting"}],"version":"current","sidebarPosition":12,"frontMatter":{"sidebar_position":12,"title":"Troubleshooting managed configurations","description":"Common issues and solutions for managed configuration in enterprise environments.","tags":["podman-desktop","configuration","enterprise","managed","troubleshooting"],"keywords":["podman desktop","configuration","managed","enterprise","troubleshooting","issues","problems"]},"sidebar":"mySidebar","previous":{"title":"Managed configuration use cases","permalink":"/docs/configuration/managed-configuration-use-cases"},"next":{"title":"Podman","permalink":"/docs/podman/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/configuration/managed-configuration-troubleshooting.md


const frontMatter = {
	sidebar_position: 12,
	title: 'Troubleshooting managed configurations',
	description: 'Common issues and solutions for managed configuration in enterprise environments.',
	tags: [
		'podman-desktop',
		'configuration',
		'enterprise',
		'managed',
		'troubleshooting'
	],
	keywords: [
		'podman desktop',
		'configuration',
		'managed',
		'enterprise',
		'troubleshooting',
		'issues',
		'problems'
	]
};
const contentTitle = 'Troubleshooting managed configuration';

const assets = {

};



const toc = [{
  "value": "Locked configuration not working",
  "id": "locked-configuration-not-working",
  "level": 2
}, {
  "value": "Settings not being enforced",
  "id": "settings-not-being-enforced",
  "level": 2
}, {
  "value": "Verifying configuration is loaded",
  "id": "verifying-configuration-is-loaded",
  "level": 2
}, {
  "value": "Verifying if a value is locked by the managed-by configuration",
  "id": "verifying-if-a-value-is-locked-by-the-managed-by-configuration",
  "level": 2
}, {
  "value": "File permission issues",
  "id": "file-permission-issues",
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
        id: "troubleshooting-managed-configuration",
        children: "Troubleshooting managed configuration"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When implementing managed configuration in an enterprise environment, you may encounter some common issues often caused by file location, permissions, or syntax errors."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "locked-configuration-not-working",
      children: "Locked configuration not working"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If your locked configuration is not being applied, try the following solutions:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Verify file locations are correct for your operating system."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check file permissions (files must be owned by root/administrator)."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Ensure JSON syntax is valid (use a JSON validator)."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart Podman Desktop after creating configuration files."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "settings-not-being-enforced",
      children: "Settings not being enforced"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If settings appear to be locked but values are not being enforced correctly:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Check that the key name in ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked.json"
        }), " exactly matches the key in ", (0,jsx_runtime.jsx)(_components.code, {
          children: "default-settings.json"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Verify the configuration key uses dot notation (e.g., ", (0,jsx_runtime.jsx)(_components.code, {
          children: "proxy.http"
        }), ", not ", (0,jsx_runtime.jsx)(_components.code, {
          children: "proxy: { http: ... }"
        }), ")."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Check console output for error messages."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verifying-configuration-is-loaded",
      children: "Verifying configuration is loaded"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify that your managed configuration is being loaded correctly:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Open Podman Desktop."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Help > Troubleshooting"
        }), ", and select the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Logs"
        }), " tab to check for messages such as:"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Look for messages in the console like:", "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            children: "[Managed-by]: Loaded managed ...\n[Managed-by]: Applied default settings for: setting.key1, setting.key2\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "If you don't see these messages, the configuration files may not be in the correct location or may have syntax errors."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["The \"Applied default settings\" message only appears when settings are copied from ", (0,jsx_runtime.jsx)(_components.code, {
          children: "default-settings.json"
        }), " to the user's ", (0,jsx_runtime.jsx)(_components.code, {
          children: "settings.json"
        }), ". This occurs once per setting when it doesn't already exist in the user's configuration."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verifying-if-a-value-is-locked-by-the-managed-by-configuration",
      children: "Verifying if a value is locked by the managed-by configuration"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify in the GUI if a value is locked by your managed-by configuration:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Open Podman Desktop."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Preferences"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Find your managed-by value:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "Managed by label",
        src: (__webpack_require__(78029)/* ["default"] */ .A) + "",
        width: "1266",
        height: "548"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "4",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Confirm that it has the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Managed"
        }), " label applied."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "file-permission-issues",
      children: "File permission issues"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "On Linux and macOS, managed configuration files must have appropriate permissions:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Files must be owned by root/administrator"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Files should be readable by all users but writable only by root/administrator"
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Use ", (0,jsx_runtime.jsx)(_components.code, {
          children: "chmod 644"
        }), " for the configuration files on Linux/macOS"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration",
          children: "Configuring a managed user environment"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration-use-cases",
          children: "Managed configuration use cases"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/settings-reference",
          children: "Configuration settings reference"
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

/***/ 78029
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/managed-by-label-a585fee018565d465261df07e97f089a.png");

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