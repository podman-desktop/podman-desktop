"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[42349],{

/***/ 45017
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_configuration_managed_configuration_md_199_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-configuration-managed-configuration-md-199.json
const site_docs_configuration_managed_configuration_md_199_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"configuration/managed-configuration","title":"Configuring a managed user environment","description":"Using managed configuration to enforce settings in enterprise environments.","source":"@site/docs/configuration/managed-configuration.md","sourceDirName":"configuration","slug":"/configuration/managed-configuration","permalink":"/docs/configuration/managed-configuration","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/configuration/managed-configuration.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"configuration","permalink":"/docs/tags/configuration"},{"inline":true,"label":"enterprise","permalink":"/docs/tags/enterprise"},{"inline":true,"label":"managed","permalink":"/docs/tags/managed"}],"version":"current","sidebarPosition":10,"frontMatter":{"sidebar_position":10,"title":"Configuring a managed user environment","description":"Using managed configuration to enforce settings in enterprise environments.","tags":["podman-desktop","configuration","enterprise","managed"],"keywords":["podman desktop","configuration","managed","enterprise","locked","admin","policy"]},"sidebar":"mySidebar","previous":{"title":"Settings reference","permalink":"/docs/configuration/settings-reference"},"next":{"title":"Managed configuration use cases","permalink":"/docs/configuration/managed-configuration-use-cases"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js + 2 modules
var Tabs = __webpack_require__(78296);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js + 1 modules
var TabItem = __webpack_require__(22491);
;// ./docs/configuration/managed-configuration.md


const frontMatter = {
	sidebar_position: 10,
	title: 'Configuring a managed user environment',
	description: 'Using managed configuration to enforce settings in enterprise environments.',
	tags: [
		'podman-desktop',
		'configuration',
		'enterprise',
		'managed'
	],
	keywords: [
		'podman desktop',
		'configuration',
		'managed',
		'enterprise',
		'locked',
		'admin',
		'policy'
	]
};
const contentTitle = 'Configuring a managed user environment';

const assets = {

};





const toc = [{
  "value": "How it works",
  "id": "how-it-works",
  "level": 2
}, {
  "value": "Default settings",
  "id": "default-settings",
  "level": 3
}, {
  "value": "Locked settings",
  "id": "locked-settings",
  "level": 3
}, {
  "value": "Configuration priority",
  "id": "configuration-priority",
  "level": 3
}, {
  "value": "File locations",
  "id": "file-locations",
  "level": 2
}, {
  "value": "Example: Enforcing corporate proxy and telemetry settings",
  "id": "example-enforcing-corporate-proxy-and-telemetry-settings",
  "level": 2
}, {
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "User Configuration",
  "id": "user-configuration",
  "level": 3
}, {
  "value": "Managed Defaults Configuration",
  "id": "managed-defaults-configuration",
  "level": 3
}, {
  "value": "Locked Configuration",
  "id": "locked-configuration",
  "level": 3
}, {
  "value": "Result",
  "id": "result",
  "level": 3
}, {
  "value": "Deploying a managed configuration",
  "id": "deploying-a-managed-configuration",
  "level": 2
}, {
  "value": "Procedure",
  "id": "procedure-1",
  "level": 4
}, {
  "value": "Locked configuration impact on users",
  "id": "locked-configuration-impact-on-users",
  "level": 2
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 2
}, {
  "value": "Next steps",
  "id": "next-steps",
  "level": 2
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
        id: "configuring-a-managed-user-environment",
        children: "Configuring a managed user environment"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "In enterprise environments, administrators can enforce specific configuration values that users are unable to override. This capability allows them to manage configurations, such as proxy servers, telemetry policies, and security policies, ensuring users operate within a controlled environment. Administrators can review and edit the configurations in the user settings file before applying the changes globally to all enterprise users."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "how-it-works",
      children: "How it works"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop stores values for the following types of configuration in three separate JSON files:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "User configuration"
        }), " - Editable user-enforced values for Podman Desktop customization."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Managed defaults configuration"
        }), " - Read-only administrator-enforced default values that cannot be edited by the user."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Locked configuration"
        }), " - Read-only administrator-enforced list of keys that must use managed values."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "default-settings",
      children: "Default settings"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["On startup, Podman Desktop checks ", (0,jsx_runtime.jsx)(_components.code, {
        children: "default-settings.json"
      }), " and applies any settings that don't already exist in the user's ", (0,jsx_runtime.jsx)(_components.code, {
        children: "settings.json"
      }), ". This is a one-time copy per setting:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Settings already in the user's ", (0,jsx_runtime.jsx)(_components.code, {
          children: "settings.json"
        }), " are not overwritten"]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Settings that match the built-in schema default are not copied (to avoid unnecessary entries)"
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Only settings that differ from the schema default are persisted to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "settings.json"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This allows administrators to pre-configure settings for new users while respecting existing user preferences."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "locked-settings",
      children: "Locked settings"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Settings listed in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked.json"
      }), " are enforced on every read and cannot be changed by the user:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["The value is always read from ", (0,jsx_runtime.jsx)(_components.code, {
          children: "default-settings.json"
        }), ", ignoring the user's ", (0,jsx_runtime.jsx)(_components.code, {
          children: "settings.json"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "The setting displays a lock icon in the UI"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "User changes to locked keys are ignored"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Use locked settings when you need to enforce compliance, such as proxy servers or telemetry policies."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "configuration-priority",
      children: "Configuration priority"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When a configuration changes, Podman Desktop returns a value after checking the user configuration files in the following priority order:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Locked keys"
        }), " - Return a value from the managed defaults configuration file, which is of highest priority"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Unlocked keys"
        }), " - Return a value from the user configuration file"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Default value"
        }), " - Returns the default value built into Podman Desktop"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "file-locations",
      children: "File locations"
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      groupId: "operating-systems",
      children: [(0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "User configuration"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "~/.local/share/containers/podman-desktop/configuration/settings.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: User read/write"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: Normal user settings configured through the UI"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Managed defaults"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "/usr/share/podman-desktop/default-settings.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: Root only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: Administrator-enforced configuration values"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Locked configuration"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "/usr/share/podman-desktop/locked.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: Root only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: List of configuration keys that are locked by an administrator"
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "mac",
        label: "macOS",
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "User configuration"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "~/.local/share/containers/podman-desktop/configuration/settings.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: User read/write"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: Normal user settings configured through the UI"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Managed defaults"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "/Library/Application Support/io.podman_desktop.PodmanDesktop/default-settings.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: Administrator only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: Administrator-enforced configuration values"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Locked configuration"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "/Library/Application Support/io.podman_desktop.PodmanDesktop/locked.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: Administrator only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: List of configuration keys that are locked by an administrator"
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "User configuration"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "%USERPROFILE%\\.local\\share\\containers\\podman-desktop\\configuration\\settings.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: User read/write"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: Normal user settings configured through the UI"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Managed defaults"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "%PROGRAMDATA%\\Podman Desktop\\default-settings.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: Administrator only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: Administrator-enforced configuration values"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Locked configuration"
          })
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Location: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "%PROGRAMDATA%\\Podman Desktop\\locked.json"
            })]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Permissions: Administrator only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Purpose: List of configuration keys that are locked by an administrator"
          }), "\n"]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "example-enforcing-corporate-proxy-and-telemetry-settings",
      children: "Example: Enforcing corporate proxy and telemetry settings"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This example demonstrates how an administrator can lock the proxy and telemetry configuration to enforce corporate policy."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Create a managed defaults file with corporate settings."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Create a locked configuration file to enforce the corporate settings."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Deploy both files to the appropriate system location."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart Podman Desktop, the managed values will override user-configured values and enforce compliance."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "user-configuration",
      children: "User Configuration"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The user has configured a local proxy in their settings:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        metastring: "title=\"~/.local/share/containers/podman-desktop/configuration/settings.json\"",
        children: "{\n  \"proxy.http\": \"https://127.0.0.1:8081\",\n  \"telemetry.enabled\": true\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "managed-defaults-configuration",
      children: "Managed Defaults Configuration"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The administrator creates a managed defaults file with corporate settings:"
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      groupId: "operating-systems",
      children: [(0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        children: (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/usr/share/podman-desktop/default-settings.json\"",
            children: "{\n  \"proxy.http\": \"http://corp-proxy.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
          })
        })
      }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "mac",
        label: "macOS",
        children: (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/Library/Application Support/io.podman_desktop.PodmanDesktop/default-settings.json\"",
            children: "{\n  \"proxy.http\": \"http://corp-proxy.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
          })
        })
      }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        children: (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"%PROGRAMDATA%\\Podman Desktop\\default-settings.json\"",
            children: "{\n  \"proxy.http\": \"http://corp-proxy.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
          })
        })
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "locked-configuration",
      children: "Locked Configuration"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The administrator creates a locked configuration file to enforce these settings:"
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      groupId: "operating-systems",
      children: [(0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        children: (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/usr/share/podman-desktop/locked.json\"",
            children: "{\n  \"locked\": [\"proxy.http\", \"telemetry.enabled\"]\n}\n"
          })
        })
      }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "mac",
        label: "macOS",
        children: (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/Library/Application Support/io.podman_desktop.PodmanDesktop/locked.json\"",
            children: "{\n  \"locked\": [\"proxy.http\", \"telemetry.enabled\"]\n}\n"
          })
        })
      }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        children: (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"%PROGRAMDATA%\\Podman Desktop\\locked.json\"",
            children: "{\n  \"locked\": [\"proxy.http\", \"telemetry.enabled\"]\n}\n"
          })
        })
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "result",
      children: "Result"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With this configuration in place, Podman Desktop returns:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"proxy.http\": \"http://corp-proxy.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: "Key observations:"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "proxy.http"
        }), " - Returns managed value, user's local proxy is ignored"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "telemetry.enabled"
        }), " - Returns managed value, user cannot enable telemetry (set to false)"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "tip",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["As an administrator, you can implement several use cases to customize user settings based on your enterprise needs and apply those changes globally across your enterprise. For a comprehensive list of common use cases and examples, see ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration-use-cases",
          children: "Managed configuration use cases"
        }), "."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "deploying-a-managed-configuration",
      children: "Deploying a managed configuration"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-1",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      groupId: "operating-systems",
      children: [(0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 1: Create configuration files"
          })
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Save the following files at ", (0,jsx_runtime.jsx)(_components.code, {
            children: "/usr/share/podman-desktop/"
          }), ":"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Managed defaults file:"
          })
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/usr/share/podman-desktop/default-settings.json\"",
            children: "{\n  \"proxy.http\": \"http://proxy.corp.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Locked configuration file:"
          })
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/usr/share/podman-desktop/locked.json\"",
            children: "{\n  \"locked\": [\"proxy.http\", \"telemetry.enabled\"]\n}\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 2: Deploy using a deployment tool"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Choose a deployment tool: Ansible, Puppet, Chef, Salt, RPM/DEB packages, or shell scripts."
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 3: Verify the deployment"
          })
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Restart Podman Desktop."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Help > Troubleshooting"
              }), ", and select the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Logs"
              }), " tab to check for messages such as:"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                children: "[Managed-by]: Loaded managed ...\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Verify that locked settings cannot be changed through the UI."
            }), "\n"]
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "mac",
        label: "macOS",
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 1: Create configuration files"
          })
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Save the following files at ", (0,jsx_runtime.jsx)(_components.code, {
            children: "/Library/Application Support/io.podman_desktop.PodmanDesktop/"
          }), ":"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Managed defaults file:"
          })
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/Library/Application Support/io.podman_desktop.PodmanDesktop/default-settings.json\"",
            children: "{\n  \"proxy.http\": \"http://proxy.corp.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Locked configuration file:"
          })
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"/Library/Application Support/io.podman_desktop.PodmanDesktop/locked.json\"",
            children: "{\n  \"locked\": [\"proxy.http\", \"telemetry.enabled\"]\n}\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 2: Deploy using a deployment tool"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Choose a deployment tool: Jamf Pro, Microsoft Intune, Kandji, SimpleMDM, Ansible, or PKG installers."
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 3: Verify the deployment"
          })
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Restart Podman Desktop."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Help > Troubleshooting"
              }), ", and select the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Logs"
              }), " tab to check for messages such as:"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                children: "[Managed-by]: Loaded managed ...\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Verify that locked settings cannot be changed through the UI."
            }), "\n"]
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 1: Create configuration files"
          })
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Save the following files at ", (0,jsx_runtime.jsx)(_components.code, {
            children: "%PROGRAMDATA%\\Podman Desktop\\"
          }), ":"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Managed defaults file:"
          })
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"%PROGRAMDATA%\\Podman Desktop\\default-settings.json\"",
            children: "{\n  \"proxy.http\": \"http://proxy.corp.example.com:8080\",\n  \"telemetry.enabled\": false\n}\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "Locked configuration file:"
          })
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"%PROGRAMDATA%\\Podman Desktop\\locked.json\"",
            children: "{\n  \"locked\": [\"proxy.http\", \"telemetry.enabled\"]\n}\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 2: Deploy using a deployment tool"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Choose a deployment tool: Group Policy, Microsoft Intune, SCCM, Ansible, or PowerShell scripts."
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Step 3: Verify the deployment"
          })
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Restart Podman Desktop."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Help > Troubleshooting"
              }), ", and select the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Logs"
              }), " tab to check for messages such as:"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                children: "[Managed-by]: Loaded managed ...\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Verify that locked settings cannot be changed through the UI."
            }), "\n"]
          }), "\n"]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "locked-configuration-impact-on-users",
      children: "Locked configuration impact on users"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When a setting is locked:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "In the UI"
        }), ": The setting appears grayed out or displays a lock icon"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Editing settings.json"
        }), ": Changes to locked keys in the user's file are ignored"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "Console output"
        }), ": Log messages indicate when locked values are being used"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsx)(_components.p, {
        children: "Users are notified when settings are managed by administrators, ensuring transparency about which settings they can and cannot control."
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/configuration/managed-configuration-troubleshooting",
            children: "Troubleshooting managed configuration"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/configuration/managed-configuration-use-cases",
            children: "Managed configuration use cases"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/configuration/settings-reference",
            children: "Configuration settings reference"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "/api",
            children: "Configuration API Documentation"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/extensions/developing/config",
            children: "Extension Configuration Guide"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/proxy",
          children: "Configure proxy settings"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/extensions",
          children: "Manage extensions"
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

/***/ 22491
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TabItem)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tabItem":"tabItem_wHwb"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function TabItem({children,hidden,className}){return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{role:"tabpanel",className:(0,clsx/* default */.A)(styles_module.tabItem,className),hidden,children:children});}

/***/ },

/***/ 78296
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Tabs)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(53237);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/scrollUtils.js
var scrollUtils = __webpack_require__(90766);
// EXTERNAL MODULE: ../node_modules/react-router/esm/react-router.js
var react_router = __webpack_require__(49519);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useIsomorphicLayoutEffect.js
var useIsomorphicLayoutEffect = __webpack_require__(14395);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/historyUtils.js
var historyUtils = __webpack_require__(35043);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/jsUtils.js
var jsUtils = __webpack_require__(44544);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/storageUtils.js + 1 modules
var storageUtils = __webpack_require__(94243);
;// ../node_modules/@docusaurus/theme-common/lib/utils/tabsUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// A very rough duck type, but good enough to guard against mistakes while
// allowing customization
function isTabItem(comp){const{props}=comp;return!!props&&typeof props==='object'&&'value'in props;}function sanitizeTabsChildren(children){return react.Children.toArray(children).filter(child=>child!=='\n').map(child=>{if(!child||/*#__PURE__*/(0,react.isValidElement)(child)&&isTabItem(child)){return child;}// child.type.name will give non-sensical values in prod because of
// minification, but we assume it won't throw in prod.
throw new Error(`Docusaurus error: Bad <Tabs> child <${// @ts-expect-error: guarding against unexpected cases
typeof child.type==='string'?child.type:child.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`);})?.filter(Boolean)??[];}function extractChildrenTabValues(children){return sanitizeTabsChildren(children).map(({props:{value,label,attributes,default:isDefault}})=>({value,label,attributes,default:isDefault}));}function ensureNoDuplicateValue(values){const dup=(0,jsUtils/* duplicates */.XI)(values,(a,b)=>a.value===b.value);if(dup.length>0){throw new Error(`Docusaurus error: Duplicate values "${dup.map(a=>a.value).join(', ')}" found in <Tabs>. Every value needs to be unique.`);}}function useTabValues(props){const{values:valuesProp,children}=props;return (0,react.useMemo)(()=>{const values=valuesProp??extractChildrenTabValues(children);ensureNoDuplicateValue(values);return values;},[valuesProp,children]);}function isValidValue({value,tabValues}){return tabValues.some(a=>a.value===value);}function getInitialStateValue({defaultValue,tabValues}){if(tabValues.length===0){throw new Error('Docusaurus error: the <Tabs> component requires at least one <TabItem> children component');}if(defaultValue){// Warn user about passing incorrect defaultValue as prop.
if(!isValidValue({value:defaultValue,tabValues})){throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${defaultValue}" but none of its children has the corresponding value. Available values are: ${tabValues.map(a=>a.value).join(', ')}. If you intend to show no default tab, use defaultValue={null} instead.`);}return defaultValue;}const defaultTabValue=tabValues.find(tabValue=>tabValue.default)??tabValues[0];if(!defaultTabValue){throw new Error('Unexpected error: 0 tabValues');}return defaultTabValue.value;}function getStorageKey(groupId){if(!groupId){return null;}return`docusaurus.tab.${groupId}`;}function getQueryStringKey({queryString=false,groupId}){if(typeof queryString==='string'){return queryString;}if(queryString===false){return null;}if(queryString===true&&!groupId){throw new Error(`Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".`);}return groupId??null;}function useTabQueryString({queryString=false,groupId}){const history=(0,react_router/* useHistory */.W6)();const key=getQueryStringKey({queryString,groupId});const value=(0,historyUtils/* useQueryStringValue */.aZ)(key);const setValue=(0,react.useCallback)(newValue=>{if(!key){return;// no-op
}const searchParams=new URLSearchParams(history.location.search);searchParams.set(key,newValue);history.replace({...history.location,search:searchParams.toString()});},[key,history]);return[value,setValue];}function useTabStorage({groupId}){const key=getStorageKey(groupId);const[value,storageSlot]=(0,storageUtils/* useStorageSlot */.Dv)(key);const setValue=(0,react.useCallback)(newValue=>{if(!key){return;// no-op
}storageSlot.set(newValue);},[key,storageSlot]);return[value,setValue];}function useTabs(props){const{defaultValue,queryString=false,groupId}=props;const tabValues=useTabValues(props);const[selectedValue,setSelectedValue]=(0,react.useState)(()=>getInitialStateValue({defaultValue,tabValues}));const[queryStringValue,setQueryString]=useTabQueryString({queryString,groupId});const[storageValue,setStorageValue]=useTabStorage({groupId});// We sync valid querystring/storage value to state on change + hydration
const valueToSync=(()=>{const value=queryStringValue??storageValue;if(!isValidValue({value,tabValues})){return null;}return value;})();// Sync in a layout/sync effect is important, for useScrollPositionBlocker
// See https://github.com/facebook/docusaurus/issues/8625
(0,useIsomorphicLayoutEffect/* default */.A)(()=>{if(valueToSync){setSelectedValue(valueToSync);}},[valueToSync]);const selectValue=(0,react.useCallback)(newValue=>{if(!isValidValue({value:newValue,tabValues})){throw new Error(`Can't select invalid tab value=${newValue}`);}setSelectedValue(newValue);setQueryString(newValue);setStorageValue(newValue);},[setQueryString,setStorageValue,tabValues]);return{selectedValue,selectValue,tabValues};}
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useIsBrowser.js
var useIsBrowser = __webpack_require__(86681);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tabList":"tabList_J5MA","tabItem":"tabItem_l0OV"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function TabList({className,block,selectedValue,selectValue,tabValues}){const tabRefs=[];const{blockElementScrollPositionUntilNextRender}=(0,scrollUtils/* useScrollPositionBlocker */.a_)();const handleTabChange=event=>{const newTab=event.currentTarget;const newTabIndex=tabRefs.indexOf(newTab);const newTabValue=tabValues[newTabIndex].value;if(newTabValue!==selectedValue){blockElementScrollPositionUntilNextRender(newTab);selectValue(newTabValue);}};const handleKeydown=event=>{let focusElement=null;switch(event.key){case'Enter':{handleTabChange(event);break;}case'ArrowRight':{const nextTab=tabRefs.indexOf(event.currentTarget)+1;focusElement=tabRefs[nextTab]??tabRefs[0];break;}case'ArrowLeft':{const prevTab=tabRefs.indexOf(event.currentTarget)-1;focusElement=tabRefs[prevTab]??tabRefs[tabRefs.length-1];break;}default:break;}focusElement?.focus();};return/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,clsx/* default */.A)('tabs',{'tabs--block':block},className),children:tabValues.map(({value,label,attributes})=>/*#__PURE__*/(0,jsx_runtime.jsx)("li",{// TODO extract TabListItem
role:"tab",tabIndex:selectedValue===value?0:-1,"aria-selected":selectedValue===value,ref:tabControl=>{tabRefs.push(tabControl);},onKeyDown:handleKeydown,onClick:handleTabChange,...attributes,className:(0,clsx/* default */.A)('tabs__item',styles_module.tabItem,attributes?.className,{'tabs__item--active':selectedValue===value}),children:label??value},value))});}function TabContent({lazy,children,selectedValue}){const childTabs=(Array.isArray(children)?children:[children]).filter(Boolean);if(lazy){const selectedTabItem=childTabs.find(tabItem=>tabItem.props.value===selectedValue);if(!selectedTabItem){// fail-safe or fail-fast? not sure what's best here
return null;}return/*#__PURE__*/(0,react.cloneElement)(selectedTabItem,{className:(0,clsx/* default */.A)('margin-top--md',selectedTabItem.props.className)});}return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"margin-top--md",children:childTabs.map((tabItem,i)=>/*#__PURE__*/(0,react.cloneElement)(tabItem,{key:i,hidden:tabItem.props.value!==selectedValue}))});}function TabsComponent(props){const tabs=useTabs(props);return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.tabs.container,// former name kept for backward compatibility
// see https://github.com/facebook/docusaurus/pull/4086
'tabs-container',styles_module.tabList),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(TabList,{...tabs,...props}),/*#__PURE__*/(0,jsx_runtime.jsx)(TabContent,{...tabs,...props})]});}function Tabs(props){const isBrowser=(0,useIsBrowser/* default */.A)();return/*#__PURE__*/(0,jsx_runtime.jsx)(TabsComponent// Remount tabs after hydration
// Temporary fix for https://github.com/facebook/docusaurus/issues/5653
,{...props,children:sanitizeTabsChildren(props.children)},String(isBrowser));}

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