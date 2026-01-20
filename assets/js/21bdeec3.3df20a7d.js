"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[72610],{

/***/ 35099:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_configuration_managed_configuration_use_cases_md_21b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-configuration-managed-configuration-use-cases-md-21b.json
const site_docs_configuration_managed_configuration_use_cases_md_21b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"configuration/managed-configuration-use-cases","title":"Managed configuration use cases","description":"Common use cases and examples for enterprise managed configuration.","source":"@site/docs/configuration/managed-configuration-use-cases.md","sourceDirName":"configuration","slug":"/configuration/managed-configuration-use-cases","permalink":"/docs/configuration/managed-configuration-use-cases","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/configuration/managed-configuration-use-cases.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"configuration","permalink":"/docs/tags/configuration"},{"inline":true,"label":"enterprise","permalink":"/docs/tags/enterprise"},{"inline":true,"label":"managed","permalink":"/docs/tags/managed"},{"inline":true,"label":"use-cases","permalink":"/docs/tags/use-cases"}],"version":"current","sidebarPosition":11,"frontMatter":{"sidebar_position":11,"title":"Managed configuration use cases","description":"Common use cases and examples for enterprise managed configuration.","tags":["podman-desktop","configuration","enterprise","managed","use-cases"],"keywords":["podman desktop","configuration","managed","enterprise","examples","use cases"]},"sidebar":"mySidebar","previous":{"title":"Configuring a managed user environment","permalink":"/docs/configuration/managed-configuration"},"next":{"title":"Troubleshooting managed configurations","permalink":"/docs/configuration/managed-configuration-troubleshooting"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/configuration/managed-configuration-use-cases.md


const frontMatter = {
	sidebar_position: 11,
	title: 'Managed configuration use cases',
	description: 'Common use cases and examples for enterprise managed configuration.',
	tags: [
		'podman-desktop',
		'configuration',
		'enterprise',
		'managed',
		'use-cases'
	],
	keywords: [
		'podman desktop',
		'configuration',
		'managed',
		'enterprise',
		'examples',
		'use cases'
	]
};
const contentTitle = 'Managed configuration use cases';

const assets = {

};



const toc = [{
  "value": "Enforcing proxy settings",
  "id": "enforcing-proxy-settings",
  "level": 2
}, {
  "value": "Managing telemetry",
  "id": "managing-telemetry",
  "level": 2
}, {
  "value": "Configuring default registries and mirrors",
  "id": "configuring-default-registries-and-mirrors",
  "level": 2
}, {
  "value": "Registry properties",
  "id": "registry-properties",
  "level": 3
}, {
  "value": "Mirror properties",
  "id": "mirror-properties",
  "level": 3
}, {
  "value": "Example: Configure a registry with a mirror",
  "id": "example-configure-a-registry-with-a-mirror",
  "level": 3
}, {
  "value": "Example: Block a registry",
  "id": "example-block-a-registry",
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
    li: "li",
    p: "p",
    pre: "pre",
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
        id: "managed-configuration-use-cases",
        children: "Managed configuration use cases"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "As an administrator, you can use managed configuration to enforce specific settings for all users in your organization. Below are some common use cases with example configurations."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "enforcing-proxy-settings",
      children: "Enforcing proxy settings"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Lock proxy configuration to ensure all users route traffic through corporate proxy servers."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"default-settings.json\"",
        children: "{\n  \"proxy.http\": \"http://corp-proxy.example.com:8080\"\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"locked.json\"",
        children: "{\n  \"locked\": [\"proxy.http\"]\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "managing-telemetry",
      children: "Managing telemetry"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Control telemetry settings for compliance or privacy requirements."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"default-settings.json\"",
        children: "{\n  \"telemetry.enabled\": false\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"locked.json\"",
        children: "{\n  \"locked\": [\"telemetry.enabled\"]\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "configuring-default-registries-and-mirrors",
      children: "Configuring default registries and mirrors"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Configure default container registries with optional mirrors for your organization. This is useful for directing image pulls through internal registry mirrors or blocking access to specific registries."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Each entry in the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "registries.defaults"
      }), " array can be either a registry definition or a mirror. Mirrors must follow immediately after the registry they belong to."]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["This configuration maps to the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md",
          children: "registries.conf"
        }), " format used by Podman. For advanced configuration options and detailed documentation, refer to the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md#example",
          children: "upstream specification"
        }), " on how to setup your ", (0,jsx_runtime.jsx)(_components.code, {
          children: "registries.conf"
        }), " and how Podman Desktop reads/writes to it."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "registry-properties",
      children: "Registry properties"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Property"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Type"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Required"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Description"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "prefix"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "string"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Yes"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["The registry prefix to match (e.g., ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io"
            }), ")"]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "location"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "string"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Yes"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "The registry URL or location"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "insecure"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "boolean"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "No"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Allow insecure connections (default: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "false"
            }), ")"]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "blocked"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "boolean"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "No"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Block pulls (default: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "false"
            }), ")"]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "mirror-properties",
      children: "Mirror properties"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Property"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Type"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Required"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Description"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "location"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "string"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "Yes"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "The mirror URL"
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "insecure"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "boolean"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "No"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Allow insecure connections (default: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "false"
            }), ")"]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "example-configure-a-registry-with-a-mirror",
      children: "Example: Configure a registry with a mirror"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"default-settings.json\"",
        children: "{\n  \"registries.defaults\": [\n    {\n      \"registry\": {\n        \"prefix\": \"quay.io\",\n        \"location\": \"quay.io\"\n      }\n    },\n    {\n      \"registry.mirror\": {\n        \"location\": \"mirror.example.com\"\n      }\n    }\n  ]\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "example-block-a-registry",
      children: "Example: Block a registry"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"default-settings.json\"",
        children: "{\n  \"registries.defaults\": [\n    {\n      \"registry\": {\n        \"prefix\": \"untrusted.example.com\",\n        \"location\": \"untrusted.example.com\",\n        \"blocked\": true\n      }\n    }\n  ]\n}\n"
      })
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
          href: "/docs/configuration/settings-reference",
          children: "Configuration settings reference"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md",
          children: "Podman upstream registry settings reference"
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