"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[52694],{

/***/ 87849
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_configuration_managed_configuration_macos_mdx_e28_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-configuration-managed-configuration-macos-mdx-e28.json
const site_docs_configuration_managed_configuration_macos_mdx_e28_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"configuration/managed-configuration-macos","title":"Manage macOS settings with MDM","description":"Deploy macOS managed preferences for Podman Desktop, with device defaults, user values, and enforced settings.","source":"@site/docs/configuration/managed-configuration-macos.mdx","sourceDirName":"configuration","slug":"/configuration/managed-configuration-macos","permalink":"/docs/configuration/managed-configuration-macos","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/configuration/managed-configuration-macos.mdx","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"configuration","permalink":"/docs/tags/configuration"},{"inline":true,"label":"enterprise","permalink":"/docs/tags/enterprise"},{"inline":true,"label":"managed","permalink":"/docs/tags/managed"},{"inline":true,"label":"macos","permalink":"/docs/tags/macos"},{"inline":true,"label":"mdm","permalink":"/docs/tags/mdm"}],"version":"current","sidebarPosition":10.5,"frontMatter":{"sidebar_position":10.5,"title":"Manage macOS settings with MDM","description":"Deploy macOS managed preferences for Podman Desktop, with device defaults, user values, and enforced settings.","tags":["podman-desktop","configuration","enterprise","managed","macos","mdm"],"keywords":["podman desktop","macOS","MDM","plist","managed preferences","locked","policy"]},"sidebar":"mySidebar","previous":{"title":"Configuring a managed user environment","permalink":"/docs/configuration/managed-configuration"},"next":{"title":"Managed configuration use cases","permalink":"/docs/configuration/managed-configuration-use-cases"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/configuration/managed-configuration-macos.mdx


const frontMatter = {
	sidebar_position: 10.5,
	title: 'Manage macOS settings with MDM',
	description: 'Deploy macOS managed preferences for Podman Desktop, with device defaults, user values, and enforced settings.',
	tags: [
		'podman-desktop',
		'configuration',
		'enterprise',
		'managed',
		'macos',
		'mdm'
	],
	keywords: [
		'podman desktop',
		'macOS',
		'MDM',
		'plist',
		'managed preferences',
		'locked',
		'policy'
	]
};
const contentTitle = 'Manage macOS settings with MDM';

const assets = {

};



const toc = [{
  "value": "Preference domain and locations",
  "id": "preference-domain-and-locations",
  "level": 2
}, {
  "value": "Preference keys",
  "id": "preference-keys",
  "level": 2
}, {
  "value": "Configuration keys",
  "id": "configuration-keys",
  "level": 3
}, {
  "value": "Locked keys",
  "id": "locked-keys",
  "level": 3
}, {
  "value": "Device example",
  "id": "device-example",
  "level": 3
}, {
  "value": "Per-user example",
  "id": "per-user-example",
  "level": 3
}, {
  "value": "Configuration precedence",
  "id": "configuration-precedence",
  "level": 2
}, {
  "value": "Deploy through MDM",
  "id": "deploy-through-mdm",
  "level": 2
}, {
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 3
}, {
  "value": "File access",
  "id": "file-access",
  "level": 3
}, {
  "value": "Profile structure",
  "id": "profile-structure",
  "level": 3
}, {
  "value": "Procedure",
  "id": "procedure",
  "level": 3
}, {
  "value": "Policy updates and removal",
  "id": "policy-updates-and-removal",
  "level": 2
}, {
  "value": "Remove enforcement",
  "id": "remove-enforcement",
  "level": 3
}, {
  "value": "Load failures",
  "id": "load-failures",
  "level": 2
}, {
  "value": "Related documentation",
  "id": "related-documentation",
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
        id: "manage-macos-settings-with-mdm",
        children: "Manage macOS settings with MDM"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Mobile device management (MDM) lets administrators distribute application settings to managed macOS devices.\nPodman Desktop reads macOS managed preference files at startup and combines them with its existing JSON configuration."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Device preferences supply initial values or enforce values with locks.\nPer-user preferences supply values for one macOS account. They cannot add locks."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "preference-domain-and-locations",
      children: "Preference domain and locations"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The preference domain is ", (0,jsx_runtime.jsx)(_components.code, {
        children: "io.podman_desktop.PodmanDesktop"
      }), ".\nThe filename is this domain plus ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".plist"
      }), ". Custom builds use the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "appId"
      }), " from ", (0,jsx_runtime.jsx)(_components.code, {
        children: "product.json"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Scope"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "File"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Purpose"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Device"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "/Library/Managed Preferences/io.podman_desktop.PodmanDesktop.plist"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Managed defaults and a ", (0,jsx_runtime.jsx)(_components.code, {
              children: "locked"
            }), " array for all users."]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "User"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "/Library/Managed Preferences/<username>/io.podman_desktop.PodmanDesktop.plist"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "User values for the account that runs Podman Desktop."
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "<username>"
      }), " is the short macOS account name, not the display name or home directory path.\nEither file can exist without the other."]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["Podman Desktop reads these files directly. It does not read ", (0,jsx_runtime.jsx)(_components.code, {
          children: ".mobileconfig"
        }), " files, query ", (0,jsx_runtime.jsx)(_components.code, {
          children: "CFPreferences"
        }), ", or inspect installed profiles.\nIt does not read preferences from ", (0,jsx_runtime.jsx)(_components.code, {
          children: "/Library/Preferences"
        }), " or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "~/Library/Preferences"
        }), ".\nAn MDM deployment must produce the expected dictionary at one of the paths above."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "preference-keys",
      children: "Preference keys"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop supports XML and binary plists.\nFor the file format and editor, see ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://developer.apple.com/documentation/xcode/editing-property-list-files",
        children: "Apple's property list documentation"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "configuration-keys",
      children: "Configuration keys"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Configuration keys, such as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "telemetry.enabled"
      }), " or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "preferences.appearance"
      }), ", define values in the plist's top-level dictionary.\nThey use the same dotted names and value types as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "settings.json"
      }), ", as listed in the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "/docs/configuration/settings-reference",
        children: "settings reference"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Device values are initial defaults unless the device policy or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked.json"
      }), " locks the key.\nPer-user values override local user settings at startup but cannot override locked values."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "locked-keys",
      children: "Locked keys"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The optional ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " array lists the configuration keys that users cannot override.\nIt contains key names as strings. The configuration values remain separate entries in the same top-level dictionary.\nEach listed key requires a managed value in the device plist or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "default-settings.json"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Only the device plist can add locks. A ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " array in a per-user plist has no effect."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "device-example",
      children: "Device example"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This device plist disables telemetry and locks that setting. It also supplies an unlocked dark theme as an initial value."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-xml",
        metastring: "title=\"/Library/Managed Preferences/io.podman_desktop.PodmanDesktop.plist\"",
        children: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n  <dict>\n    <key>telemetry.enabled</key>\n    <false/>\n    <key>preferences.appearance</key>\n    <string>dark</string>\n    <key>locked</key>\n    <array>\n      <string>telemetry.enabled</string>\n    </array>\n  </dict>\n</plist>\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The device plist combines the roles of ", (0,jsx_runtime.jsx)(_components.code, {
        children: "default-settings.json"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked.json"
      }), ".\nIt does not require either JSON file.\nWithout the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " entry, users can change both settings."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "per-user-example",
      children: "Per-user example"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This plist sets the light theme for the macOS account ", (0,jsx_runtime.jsx)(_components.code, {
        children: "lisa"
      }), ".\nIt overrides the device's unlocked dark theme and any theme value in that account's ", (0,jsx_runtime.jsx)(_components.code, {
        children: "settings.json"
      }), " at startup."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-xml",
        metastring: "title=\"/Library/Managed Preferences/lisa/io.podman_desktop.PodmanDesktop.plist\"",
        children: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n  <dict>\n    <key>preferences.appearance</key>\n    <string>light</string>\n  </dict>\n</plist>\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Lisa can change the theme during the session. At the next startup, Podman Desktop applies the per-user value again.\nThe device lock on telemetry remains effective for Lisa."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "configuration-precedence",
      children: "Configuration precedence"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop combines the sources at startup:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Configuration"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Rule"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Managed defaults"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Device plist values override matching keys in ", (0,jsx_runtime.jsx)(_components.code, {
              children: "default-settings.json"
            }), ". Other JSON defaults remain available."]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "User values"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Per-user plist values override matching keys in ", (0,jsx_runtime.jsx)(_components.code, {
              children: "settings.json"
            }), ". Other user values remain unchanged."]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Locks"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["Device plist locks and ", (0,jsx_runtime.jsx)(_components.code, {
              children: "locked.json"
            }), " locks form one list without duplicates."]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["These merges replace whole values for matching keys. Arrays and dictionaries do not merge their contents.\nAn empty device ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " array does not remove locks from ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked.json"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For a locked key, the value comes from the combined managed defaults.\nA device plist value wins over the JSON default even when ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked.json"
      }), " supplies the lock.\nUser values cannot override it."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For an unlocked key, the initial value follows this order:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Per-user plist value."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Existing ", (0,jsx_runtime.jsx)(_components.code, {
          children: "settings.json"
        }), " value."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Device plist default."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "default-settings.json"
        }), " default."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Built-in setting default."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For the examples above, telemetry stays disabled for every user. Lisa starts with the light theme.\nOther users receive the dark theme only when their user configuration has no theme value."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "deploy-through-mdm",
      children: "Deploy through MDM"
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A managed macOS device with Podman Desktop."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Access to the MDM console for application preferences or custom configuration profiles."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A device policy for settings that require enforcement."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "file-access",
      children: "File access"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Both plists must be readable by the account that runs Podman Desktop.\nKeep the files and their parent directories writable only by administrators or the management service.\nPodman Desktop does not validate file ownership or permissions before it loads the policy."
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "profile-structure",
      children: "Profile structure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The examples above are preference plists, not complete configuration profiles.\nAn MDM console can accept a preference domain and plist, or require a full ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".mobileconfig"
      }), " profile."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Apple's ", (0,jsx_runtime.jsx)(_components.code, {
        children: "com.apple.ManagedClient.preferences"
      }), " payload places application settings under the domain within ", (0,jsx_runtime.jsx)(_components.code, {
        children: "PayloadContent"
      }), ".\nFor its ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Forced"
      }), " format, the settings dictionary belongs inside ", (0,jsx_runtime.jsx)(_components.code, {
        children: "mcx_preference_settings"
      }), ".\nSee ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://developer.apple.com/documentation/devicemanagement/managedpreferences",
        children: "Apple's managed preferences payload reference"
      }), " for the profile structure."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop expects the resulting application preference file to contain the flat dictionary from the examples.\nThe profile wrapper, including ", (0,jsx_runtime.jsx)(_components.code, {
        children: "PayloadContent"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Forced"
      }), ", and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "mcx_preference_settings"
      }), ", does not belong in that file.\nPodman Desktop uses its device ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " array for enforcement.\nThe Apple ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Forced"
      }), " field does not replace this array or make per-user values enforceable."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Save the device example as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "io.podman_desktop.PodmanDesktop.plist"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Replace the sample settings with your policy values."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Make sure that the plist syntax is valid:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell",
            children: "/usr/bin/plutil -lint io.podman_desktop.PodmanDesktop.plist\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In your MDM console, create an application preference policy for the domain ", (0,jsx_runtime.jsx)(_components.code, {
            children: "io.podman_desktop.PodmanDesktop"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Import the plist through the console's custom preferences workflow, or include its dictionary in a configuration profile."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Deploy the policy at the device scope to a macOS test device."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "As the affected user, inspect the device file:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell",
            children: "/usr/bin/plutil -convert json -o - \"/Library/Managed Preferences/io.podman_desktop.PodmanDesktop.plist\"\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Make sure that the output contains the expected settings and ", (0,jsx_runtime.jsx)(_components.code, {
            children: "locked"
          }), " array."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Restart Podman Desktop."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Open ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings > Preferences"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Make sure that each locked setting has the expected value."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Make sure that each locked setting displays a ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Managed"
          }), " label or lock icon."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "After the test succeeds, deploy the policy to the remaining macOS devices."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For per-user values, select the user scope in your MDM console.\nMake sure that the resulting file exists under the correct account directory."
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsx)(_components.p, {
        children: "File location determines the scope that Podman Desktop uses. A file under an account directory cannot add locks.\nMDM enrollment or profile installation alone does not establish that the expected preference file exists."
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "policy-updates-and-removal",
      children: "Policy updates and removal"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop reads the plists once at startup. Policy changes and removal require an application restart.\nThe application does not watch these files for changes."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Unlocked device defaults fill missing user values. A later device policy change does not overwrite an existing user value.\nPer-user values override local values again at the next startup."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Policy removal does not reset ", (0,jsx_runtime.jsx)(_components.code, {
        children: "settings.json"
      }), ".\nManaged defaults copied into that file remain, and per-user values can remain if a settings save wrote them to disk.\nAfter removal, the remaining configuration sources determine the value and lock state."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "remove-enforcement",
      children: "Remove enforcement"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Remove the key from the device plist's ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked"
        }), " array and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "locked.json"
        }), ", where applicable."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Restart Podman Desktop."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "If a value must change after removal, update the corresponding user preference."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "load-failures",
      children: "Load failures"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "A missing plist contributes no settings or locks.\nIf a file is unreadable, malformed, or cannot convert to JSON, Podman Desktop logs an error and ignores that file.\nThe other plist and JSON sources still load. Startup continues without the failed file's policy."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The reader requires a dictionary and, when present, a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " array that contains only strings.\nAn invalid ", (0,jsx_runtime.jsx)(_components.code, {
        children: "locked"
      }), " value rejects the whole file, including a per-user file.\nThe reader does not validate individual settings against their schemas."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "related-documentation",
      children: "Related documentation"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration-troubleshooting#macos-mdm-preferences",
          children: "Managed configuration troubleshooting"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/configuration/managed-configuration",
          children: "JSON configuration and file locations"
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