"use strict";
(globalThis["webpackChunkdocs"] ||= []).push([[87210],{

/***/ 33105
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_troubleshooting_troubleshooting_flatpak_md_5ef_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-troubleshooting-troubleshooting-flatpak-md-5ef.json
const site_docs_troubleshooting_troubleshooting_flatpak_md_5ef_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"troubleshooting/troubleshooting-flatpak","title":"Testing a Flatpak from a release","description":"How to correctly test a Podman Desktop Flatpak bundle from the release page.","source":"@site/docs/troubleshooting/troubleshooting-flatpak.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/troubleshooting-flatpak","permalink":"/docs/troubleshooting/troubleshooting-flatpak","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/troubleshooting/troubleshooting-flatpak.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"testing","permalink":"/docs/tags/testing"},{"inline":true,"label":"linux","permalink":"/docs/tags/linux"},{"inline":true,"label":"flatpak","permalink":"/docs/tags/flatpak"}],"version":"current","sidebarPosition":50,"frontMatter":{"sidebar_position":50,"title":"Testing a Flatpak from a release","description":"How to correctly test a Podman Desktop Flatpak bundle from the release page.","tags":["podman-desktop","testing","linux","flatpak"],"keywords":["podman desktop","podman","containers","testing","linux","flatpak","release","permissions"]},"sidebar":"mySidebar","previous":{"title":"Podman on Linux","permalink":"/docs/troubleshooting/troubleshooting-podman-on-linux"},"next":{"title":"Podman on OpenShift","permalink":"/docs/troubleshooting/troubleshooting-openshift-local"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/troubleshooting/troubleshooting-flatpak.md


const frontMatter = {
	sidebar_position: 50,
	title: 'Testing a Flatpak from a release',
	description: 'How to correctly test a Podman Desktop Flatpak bundle from the release page.',
	tags: [
		'podman-desktop',
		'testing',
		'linux',
		'flatpak'
	],
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'testing',
		'linux',
		'flatpak',
		'release',
		'permissions'
	]
};
const contentTitle = 'Testing a Flatpak from a release {#testing-flatpak-release}';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure: Testing a release bundle",
  "id": "procedure-testing-a-release-bundle",
  "level": 4
}, {
  "value": "Procedure: Building from the Flathub manifest",
  "id": "procedure-building-from-the-flathub-manifest",
  "level": 4
}, {
  "value": "Reverting to the Flathub release",
  "id": "reverting-to-the-flathub-release",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
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
    h4: "h4",
    header: "header",
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
        id: "testing-flatpak-release",
        children: "Testing a Flatpak from a release"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Each Podman Desktop release includes a ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".flatpak"
      }), " bundle in the ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/releases",
        children: "GitHub release assets"
      }), ". This page explains how to test that bundle correctly, including cases where sandbox permissions have changed between releases."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When you install Podman Desktop from Flathub, the permissions declared in ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml",
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "io.podman_desktop.PodmanDesktop.yml"
        })
      }), " are applied automatically. Installing a ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".flatpak"
      }), " bundle over an existing Flathub installation can leave an older cached permission profile active, causing failures such as lost filesystem access or silent D-Bus errors."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["A Linux system with ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://flatpak.org/setup/",
            children: "Flatpak"
          }), " installed."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
            children: ".flatpak"
          }), " bundle downloaded from the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://github.com/podman-desktop/podman-desktop/releases",
            children: "releases page"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.em, {
            children: "(For building locally only)"
          }), " Flatpak builder, runtime, and SDK:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak remote-add --if-not-exists flathub --user https://flathub.org/repo/flathub.flatpakrepo\n$ flatpak install --user flathub org.flatpak.Builder org.freedesktop.Platform//25.08 org.freedesktop.Sdk//25.08\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-testing-a-release-bundle",
      children: "Procedure: Testing a release bundle"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Uninstall any existing installation to remove stale cached permissions:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak uninstall --user io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["If Podman Desktop was installed system-wide, omit ", (0,jsx_runtime.jsx)(_components.code, {
            children: "--user"
          }), ":"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak uninstall io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "(Optional) Remove cached application data for a completely clean environment:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ rm -rf ~/.var/app/io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "caution",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["This removes all local Podman Desktop settings and data stored under the Flatpak sandbox.\nFlatpak stores per-user app data in ", (0,jsx_runtime.jsx)(_components.code, {
              children: "~/.var/app/"
            }), " for both user and system-wide installs.\nIf multiple users have run Podman Desktop on the same machine, each user must run this command\nwhile logged in as themselves, or an administrator can clean another user's profile with\n", (0,jsx_runtime.jsx)(_components.code, {
              children: "sudo -u <username> rm -rf /home/<username>/.var/app/io.podman_desktop.PodmanDesktop"
            }), "."]
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Install the downloaded bundle using the same scope as Step 1:"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a user install:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak install --user ~/Downloads/podman-desktop-<version>.flatpak\n"
          })
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["For a system-wide install, omit ", (0,jsx_runtime.jsx)(_components.code, {
            children: "--user"
          }), ":"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak install ~/Downloads/podman-desktop-<version>.flatpak\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run Podman Desktop:"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a user install:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak run io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a system-wide install, the command is the same:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak run io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Verify the active permissions match the expected manifest:"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a user install:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak info --user --show-permissions io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "For a system-wide install:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak info --show-permissions io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Compare the output against the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "finish-args"
          }), " section of the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml",
            children: "upstream manifest"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-building-from-the-flathub-manifest",
      children: "Procedure: Building from the Flathub manifest"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When a pull request modifies Flatpak permissions, build the Flatpak locally from the updated manifest rather than relying on the pre-built release bundle."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Clone the Flathub manifest repository:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ git clone https://github.com/flathub/io.podman_desktop.PodmanDesktop.git\n$ cd io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Apply your changes to ", (0,jsx_runtime.jsx)(_components.code, {
            children: "io.podman_desktop.PodmanDesktop.yml"
          }), ", for example, add or update ", (0,jsx_runtime.jsx)(_components.code, {
            children: "finish-args"
          }), " entries."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Build and install locally:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak run org.flatpak.Builder \\\n    --user \\\n    --install \\\n    --force-clean \\\n    build \\\n    io.podman_desktop.PodmanDesktop.yml\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run Podman Desktop and verify the new permissions are in effect:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak run io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Check the active permissions:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ flatpak info --user --show-permissions io.podman_desktop.PodmanDesktop\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "reverting-to-the-flathub-release",
      children: "Reverting to the Flathub release"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To go back to the stable Flathub version after testing, run the commands that match the scope you used when installing:"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For a user install:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ flatpak uninstall --user io.podman_desktop.PodmanDesktop\n$ flatpak install --user flathub io.podman_desktop.PodmanDesktop\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For a system-wide install, omit ", (0,jsx_runtime.jsx)(_components.code, {
        children: "--user"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ flatpak uninstall io.podman_desktop.PodmanDesktop\n$ flatpak install flathub io.podman_desktop.PodmanDesktop\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/flathub/io.podman_desktop.PodmanDesktop/blob/master/io.podman_desktop.PodmanDesktop.yml",
          children: "Flathub manifest for Podman Desktop"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://docs.flatpak.org/en/latest/first-build.html",
          children: "Flatpak — Building your first Flatpak"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://docs.flatpak.org/en/latest/sandbox-permissions-reference.html",
          children: "Flatpak — Sandbox permissions reference"
        })
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/installation/linux-install/installing-podman-desktop-from-a-flatpak-bundle",
          children: "Installing from a Flatpak bundle"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/containers",
          children: "Working with containers"
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