"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[80185],{

/***/ 65236
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_configuration_managed_configuration_troubleshooting_mdx_35d_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-configuration-managed-configuration-troubleshooting-mdx-35d.json
const site_docs_configuration_managed_configuration_troubleshooting_mdx_35d_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"configuration/managed-configuration-troubleshooting","title":"Troubleshooting managed configurations","description":"Common issues and solutions for managed configuration in enterprise environments.","source":"@site/docs/configuration/managed-configuration-troubleshooting.mdx","sourceDirName":"configuration","slug":"/configuration/managed-configuration-troubleshooting","permalink":"/docs/configuration/managed-configuration-troubleshooting","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/configuration/managed-configuration-troubleshooting.mdx","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"configuration","permalink":"/docs/tags/configuration"},{"inline":true,"label":"enterprise","permalink":"/docs/tags/enterprise"},{"inline":true,"label":"managed","permalink":"/docs/tags/managed"},{"inline":true,"label":"troubleshooting","permalink":"/docs/tags/troubleshooting"}],"version":"current","sidebarPosition":12,"frontMatter":{"sidebar_position":12,"title":"Troubleshooting managed configurations","description":"Common issues and solutions for managed configuration in enterprise environments.","tags":["podman-desktop","configuration","enterprise","managed","troubleshooting"],"keywords":["podman desktop","configuration","managed","enterprise","troubleshooting","issues","problems"]},"sidebar":"mySidebar","previous":{"title":"Managed configuration use cases","permalink":"/docs/configuration/managed-configuration-use-cases"},"next":{"title":"Podman","permalink":"/docs/podman/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/configuration/managed-configuration-troubleshooting.mdx


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
  "value": "macOS MDM preferences",
  "id": "macos-mdm-preferences",
  "level": 2
}, {
  "value": "A profile is installed, but the settings do not appear",
  "id": "a-profile-is-installed-but-the-settings-do-not-appear",
  "level": 3
}, {
  "value": "Log messages",
  "id": "log-messages",
  "level": 3
}, {
  "value": "A value loads, but does not stay locked",
  "id": "a-value-loads-but-does-not-stay-locked",
  "level": 3
}, {
  "value": "A changed or removed policy leaves the old value",
  "id": "a-changed-or-removed-policy-leaves-the-old-value",
  "level": 3
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
    h3: "h3",
    header: "header",
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
      id: "macos-mdm-preferences",
      children: "macOS MDM preferences"
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "a-profile-is-installed-but-the-settings-do-not-appear",
      children: "A profile is installed, but the settings do not appear"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Make sure that the preference domain is ", (0,jsx_runtime.jsx)(_components.code, {
            children: "io.podman_desktop.PodmanDesktop"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Make sure that the file exists at the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/configuration/managed-configuration-macos#preference-domain-and-locations",
            children: "device or per-user path"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a per-user file, make sure that the directory name matches the account's short name."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run this command as the affected user:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell",
            children: "/usr/bin/plutil -convert json -o - \"/Library/Managed Preferences/io.podman_desktop.PodmanDesktop.plist\"\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a per-user policy, use that user's plist path instead."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Make sure that the command succeeds without ", (0,jsx_runtime.jsx)(_components.code, {
            children: "sudo"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Make sure that the output contains top-level dotted keys, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "telemetry.enabled"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Make sure that the file contains the application settings dictionary without a configuration profile wrapper."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Restart Podman Desktop."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Help > Troubleshooting > Logs"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Find the messages that start with ", (0,jsx_runtime.jsx)(_components.code, {
            children: "[Managed-by]:"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "log-messages",
      children: "Log messages"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Message"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Meaning"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "Loaded managed preferences from:"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "The reader accepted the plist at the displayed path. This does not establish that every setting is valid or locked."
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "Failed to read managed preferences from"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "The reader ignored the file. The accompanying error identifies the read, conversion, or format failure."
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "Managed preferences must contain a dictionary"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "The plist does not contain a settings dictionary at its root."
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "Managed preference locks must contain an array of strings"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
              children: "locked"
            }), " value is invalid. The reader ignores the entire file, including its other settings."]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Applied default settings for:"
      }), " message lists defaults that fill missing user values.\nIt does not report per-user overrides or every enforced value.\nPodman Desktop can load a valid policy without this message.\nA missing plist does not produce a log message."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "a-value-loads-but-does-not-stay-locked",
      children: "A value loads, but does not stay locked"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Put the key in the device plist's ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked"
        }), " array or in ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked.json"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Supply its managed value in the device plist or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "default-settings.json"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Make sure that the key names match exactly, including capitalization and dots."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Make sure that the value type matches the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/settings-reference",
          children: "settings reference"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart Podman Desktop."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "A per-user plist cannot add locks. Unlocked device defaults do not replace existing user values.\nA lock without a managed value does not enforce a value, even if the UI displays a lock."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "a-changed-or-removed-policy-leaves-the-old-value",
      children: "A changed or removed policy leaves the old value"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart Podman Desktop after the policy change."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Compare the active sources with the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration-macos#configuration-precedence",
          children: "configuration precedence rules"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["To remove a lock, remove the key from the device plist's ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked"
        }), " array and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked.json"
        }), ", where applicable."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "After policy removal, update any unwanted value that remains in the user's preferences."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Policy removal does not erase saved user values. An empty device lock list does not clear JSON locks."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration-macos",
          children: "Manage macOS settings with MDM"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
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