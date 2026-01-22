"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[52492],{

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

/***/ 45659
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_troubleshooting_troubleshooting_podman_on_macos_md_d4b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-troubleshooting-troubleshooting-podman-on-macos-md-d4b.json
const site_docs_troubleshooting_troubleshooting_podman_on_macos_md_d4b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"troubleshooting/troubleshooting-podman-on-macos","title":"Podman on MacOS","description":"How to investigate when Podman does not work as expected.","source":"@site/docs/troubleshooting/troubleshooting-podman-on-macos.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/troubleshooting-podman-on-macos","permalink":"/docs/troubleshooting/troubleshooting-podman-on-macos","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/troubleshooting/troubleshooting-podman-on-macos.md","tags":[],"version":"current","sidebarPosition":30,"frontMatter":{"sidebar_position":30,"title":"Podman on MacOS","description":"How to investigate when Podman does not work as expected."},"sidebar":"mySidebar","previous":{"title":"Podman on Windows","permalink":"/docs/troubleshooting/troubleshooting-podman-on-windows"},"next":{"title":"Podman on Linux","permalink":"/docs/troubleshooting/troubleshooting-podman-on-linux"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/troubleshooting/troubleshooting-podman-on-macos.md


const frontMatter = {
	sidebar_position: 30,
	title: 'Podman on MacOS',
	description: 'How to investigate when Podman does not work as expected.'
};
const contentTitle = 'Troubleshooting Podman on macOS';

const assets = {

};



const toc = [{
  "value": "Unable to set custom binary path for Podman on macOS",
  "id": "unable-to-set-custom-binary-path-for-podman-on-macos",
  "level": 2
}, {
  "value": "Issue",
  "id": "issue",
  "level": 4
}, {
  "value": "Solution",
  "id": "solution",
  "level": 4
}, {
  "value": "Unable to locate Podman Engine",
  "id": "unable-to-locate-podman-engine",
  "level": 2
}, {
  "value": "Issue",
  "id": "issue-1",
  "level": 4
}, {
  "value": "Explanation",
  "id": "explanation",
  "level": 4
}, {
  "value": "Solution",
  "id": "solution-1",
  "level": 4
}, {
  "value": "Podman machine on Apple silicon",
  "id": "podman-machine-on-apple-silicon",
  "level": 2
}, {
  "value": "Issue",
  "id": "issue-2",
  "level": 4
}, {
  "value": "Explanation",
  "id": "explanation-1",
  "level": 4
}, {
  "value": "Solution",
  "id": "solution-2",
  "level": 4
}, {
  "value": "Recovering from a failed start",
  "id": "recovering-from-a-failed-start",
  "level": 2
}, {
  "value": "Workaround",
  "id": "workaround",
  "level": 4
}, {
  "value": "Solution",
  "id": "solution-3",
  "level": 4
}, {
  "value": "Podman machine not starting with QEMU 8.1.0 from brew",
  "id": "podman-machine-not-starting-with-qemu-810-from-brew",
  "level": 2
}, {
  "value": "Solution",
  "id": "solution-4",
  "level": 4
}, {
  "value": "Workaround",
  "id": "workaround-1",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}, {
  "value": "On Apple silicon, the Podman Machine does not start",
  "id": "on-apple-silicon-the-podman-machine-does-not-start",
  "level": 2
}, {
  "value": "Solution",
  "id": "solution-5",
  "level": 4
}, {
  "value": "Workaround",
  "id": "workaround-2",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources-1",
  "level": 4
}, {
  "value": "<code>podman machine</code> CLI commands do not work with <code>libkrun</code> provider type without manual configuration",
  "id": "podman-machine-cli-commands-do-not-work-with-libkrun-provider-type-without-manual-configuration",
  "level": 2
}, {
  "value": "Workaround",
  "id": "workaround-3",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources-2",
  "level": 4
}, {
  "value": "Running out of disk space on macOS",
  "id": "running-out-of-disk-space-on-macos",
  "level": 2
}, {
  "value": "Solution",
  "id": "solution-6",
  "level": 4
}, {
  "value": "Unable to upgrade Podman Desktop to the latest version using Homebrew",
  "id": "unable-to-upgrade-podman-desktop-to-the-latest-version-using-homebrew",
  "level": 2
}, {
  "value": "Solution",
  "id": "solution-7",
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
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "troubleshooting-podman-on-macos",
        children: "Troubleshooting Podman on macOS"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "unable-to-set-custom-binary-path-for-podman-on-macos",
      children: "Unable to set custom binary path for Podman on macOS"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "issue",
      children: "Issue"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When setting a custom binary path (under Preferences -> Custom binary path), Podman is unable to find ", (0,jsx_runtime.jsx)(_components.code, {
        children: "gvproxy"
      }), " and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman-mac-helper"
      }), ":"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "Error: unable to start host networking: \"could not find \\\"gvproxy\\\" in one of [/usr/local/opt/podman/libexec /opt/homebrew/bin /opt/homebrew/opt/podman/libexec /usr/local/bin /usr/local/libexec/podman /usr/local/lib/podman /usr/libexec/podman /usr/lib/podman $BINDIR/../libexec/podman].  To resolve this error, set the helper_binaries_dir key in the `[engine]` section of containers.conf to the directory containing your helper binaries.\"\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Download ", (0,jsx_runtime.jsx)(_components.code, {
          children: "gvproxy"
        }), " from the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/gvisor-tap-vsock/releases",
          children: "gvisor-tap-vsock release page"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Build the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman-mac-helper"
        }), " from the source code on the ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/podman/tree/main/cmd/podman-mac-helper",
          children: "Podman GitHub page"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Add the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "helpers_binaries_dir"
        }), " entry to ", (0,jsx_runtime.jsx)(_components.code, {
          children: "~/.config/containers/containers.conf"
        }), ":"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "[containers]\n\nhelper_binaries_dir=[\"/Users/user/example_directory\"]\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "NOTE"
      }), ": A pre-built binary will be added to the Podman release page so you do not have to build ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman-mac-helper"
      }), ". An ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/containers/podman/issues/16746",
        children: "issue is open for this"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "unable-to-locate-podman-engine",
      children: "Unable to locate Podman Engine"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "issue-1",
      children: "Issue"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Despite having Podman Engine installed, you might receive an error as follows -\n", (0,jsx_runtime.jsx)(_components.code, {
        children: "Error: No such keg: /usr/local/Cellar/podman"
      }), "\nor any similar error denoting that Podman Engine does not exist."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "explanation",
      children: "Explanation"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The Podman Installer and Homebrew use different locations to store the Podman Engine files in the file system. For example, Podman Installer installs Podman Engine in the path ", (0,jsx_runtime.jsx)(_components.code, {
        children: "/opt/podman"
      }), " whereas Homebrew uses the path ", (0,jsx_runtime.jsx)(_components.code, {
        children: "/usr/local"
      }), " for macOS Intel, ", (0,jsx_runtime.jsx)(_components.code, {
        children: "/opt/homebrew"
      }), " for Apple silicon and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "/home/linuxbrew/.linuxbrew"
      }), " for Linux."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-1",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To check where exactly is your Podman Engine installed, run the command-"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "which podman\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This returns the path where the Podman Engine would be installed. This would help determine further action."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For example, if you’re looking to completely uninstall Podman Engine from your system for a fresh installation, running ", (0,jsx_runtime.jsx)(_components.code, {
        children: "which podman"
      }), " returns the exact path where Podman still exists. This could be the path where Podman Installer stores Podman Engine, such as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "/opt/podman"
      }), ". Once you know the path, run:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "sudo rm -rf /opt/podman\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Or"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "sudo rm -rf path-where-podman-exists\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Here, you would replace ", (0,jsx_runtime.jsx)(_components.code, {
        children: "path-where-podman-exists"
      }), " with the output of ", (0,jsx_runtime.jsx)(_components.code, {
        children: "which podman"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can now proceed for a fresh installation of Podman Desktop"
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "podman-machine-on-apple-silicon",
      children: "Podman machine on Apple silicon"
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "issue-2",
      children: "Issue"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you are using an Apple silicon and brew, you might encounter the following error when starting Podman from Podman Desktop"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "Error: qemu exited unexpectedly with exit code 1, stderr: qemu-system-x86_64: invalid accelerator hvf\nqemu-system-x86_64: falling back to tcg\nqemu-system-x86_64: unable to find CPU model 'host'\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "explanation-1",
      children: "Explanation"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman machine is running as a ", (0,jsx_runtime.jsx)(_components.code, {
        children: "x86_64"
      }), " process and it could be due to a dual install of homebrew: one for ", (0,jsx_runtime.jsx)(_components.code, {
        children: "x86_64"
      }), " and one for ", (0,jsx_runtime.jsx)(_components.code, {
        children: "arm64"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-2",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Uninstall Podman machine on your ", (0,jsx_runtime.jsx)(_components.code, {
          children: "x86_64"
        }), " brew install (for example from a terminal running under rosetta) ", (0,jsx_runtime.jsx)(_components.code, {
          children: "brew uninstall podman"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["or uninstall brew ", (0,jsx_runtime.jsx)(_components.code, {
          children: "x86_64"
        }), " as most brew receipe have now arm64 support: follow ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/homebrew/install#uninstall-homebrew",
          children: "these instructions"
        }), " from a terminal running under rosetta"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Then run a terminal in native mode (default) and install Podman machine ", (0,jsx_runtime.jsx)(_components.code, {
        children: "brew install podman"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Finally clean the Podman machine VMs that had been previously created, and create new ones."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman machine rm podman-machine-default\n$ podman machine init\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You should be a happy camper from here."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "recovering-from-a-failed-start",
      children: "Recovering from a failed start"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "After a failed start, the Podman machine might be unable to start because a QEMU process is still running and the PID file is in use."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Kill the remaining QEMU process and stop the Podman machine:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ ps -edf | grep qemu-system | grep -v grep | awk '{print $2}' | xargs -I{} kill -9 {}; podman machine stop\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Start the Podman machine."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-3",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Use Podman 4.6.1 or greater."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "podman-machine-not-starting-with-qemu-810-from-brew",
      children: "Podman machine not starting with QEMU 8.1.0 from brew"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When you installed Podman and QEMU with brew, and QEMU version is 8.1.0, Podman machine might fail to start with an error such as:\n", (0,jsx_runtime.jsx)(_components.code, {
        children: "Error: qemu exited unexpectedly with exit code -1, stderr: qemu-system-x86_64: Error: HV_DENIED"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-4",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/installation/macos-install",
          children: "Install Podman Desktop and Podman using the .dmg installer"
        }), " rather than brew.\nThe Podman installer has a QEMU binary that has been tested with Podman."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround-1",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Keep your brew-based installation and apply one of these workarounds:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Rollback the QEMU brew package to v8.0.3."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ brew uninstall qemu\n$ curl -OSL https://raw.githubusercontent.com/Homebrew/homebrew-core/dc0669eca9479e9eeb495397ba3a7480aaa45c2e/Formula/qemu.rb\n$ brew install ./qemu.rb\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Alternatively, sign the QEMU brew binary locally:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ cat >entitlements.xml <<EOF\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n  <key>com.apple.security.hypervisor</key>\n  <true/>\n</dict>\n</plist>\nEOF\n$ codesign --sign - --entitlements entitlements.xml --force /usr/local/bin/qemu-system-$(uname -m | sed -e s/arm64/aarch64/)\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/Homebrew/homebrew-core/issues/140244",
          children: "Homebrew issue #140244"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/podman/issues/19708",
          children: "Podman issue #19708"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "on-apple-silicon-the-podman-machine-does-not-start",
      children: "On Apple silicon, the Podman Machine does not start"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["On Apple silicon, when Podman Machine starts, it stays indefinitely blocked with a ", (0,jsx_runtime.jsx)(_components.em, {
        children: "Waiting for VM"
      }), " message."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-5",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For M1 and M2 processors:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Update to Podman 4.9."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround-2",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "For M3 processors:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "To get a clean environment, remove all Podman and qemu artifacts:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Remove eventual installation from podman/podman desktop installer:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ sudo rm -rf opt/podman\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Remove brew installations:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ brew uninstall podman-desktop\n$ brew uninstall podman\n$ brew uninstall qemu\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Remove Podman files:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ rm -rf ~/.ssh/podman-machine-default\n$ rm -rf ~/.ssh/podman-machine-default.pub\n$ rm -rf ~/.local/share/containers\n$ rm -rf ~/.config/containers\n"
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Reinstall Podman using brew:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ brew install podman\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Install bunzip2:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ brew install bzip2\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Install QEMU 8.2.0 to ", (0,jsx_runtime.jsx)(_components.code, {
            children: "/opt/homebrew/Cellar/qemu/8.2.0"
          }), ":"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ curl -sL https://github.com/AkihiroSuda/qemu/raw/704f7cad5105246822686f65765ab92045f71a3b/pc-bios/edk2-aarch64-code.fd.bz2 | bunzip2 > /opt/homebrew/Cellar/qemu/8.2.0/share/qemu/edk2-aarch64-code.fd\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Install patched EDK2.\nDownload ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://github.com/lima-vm/edk2-patched.tmp/releases/download/edk2-stable202311%2Blima.0/edk2-aarch64-code.fd.gz",
            children: "EDK2"
          }), " from ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://github.com/lima-vm/edk2-patched.tmp/releases",
            children: "lima-vm/edk2-patched.tmp/releases"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Init podman machine."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Find QEMU configuration directory to define ", (0,jsx_runtime.jsx)(_components.em, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "qemu-config-directory"
            })
          }), " in next step:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ podman machine info | grep MachineConfigDir\n\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Update podman machine config json:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ sed -i 's@file=.\\*edk2-aarch64-code.fd@file=/path/to/downloaded/edk2-aarch64-code.fd@g' qemu-config-directory/podman-machine-default.json\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Start Podman machine."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources-1",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/containers/podman/issues/20776",
          children: "Issue #20776"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.h2, {
      id: "podman-machine-cli-commands-do-not-work-with-libkrun-provider-type-without-manual-configuration",
      children: [(0,jsx_runtime.jsx)(_components.code, {
        children: "podman machine"
      }), " CLI commands do not work with ", (0,jsx_runtime.jsx)(_components.code, {
        children: "libkrun"
      }), " provider type without manual configuration"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When you create a Podman machine with the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "GPU enabled (LibKrun)"
      }), " provider type, all the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman machine"
      }), " CLI commands stop working."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Podman machine is not listed"
        })
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman machine list\nNAME        VM TYPE     CREATED     LAST UP     CPUS        MEMORY      DISK SIZE\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.strong, {
        children: (0,jsx_runtime.jsx)(_components.em, {
          children: "Error: interacting with the default Podman machine"
        })
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman machine ssh\nError: vm podman-machine-default not found: podman-machine-default: VM does not exist\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "workaround-3",
      children: "Workaround"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Prefix each ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman machine"
        }), " command with\n", (0,jsx_runtime.jsx)(_components.code, {
          children: "CONTAINERS_MACHINE_PROVIDER=libkrun"
        }), ". For example, ", (0,jsx_runtime.jsx)(_components.code, {
          children: "CONTAINERS_MACHINE_PROVIDER=libkrun podman machine ls"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Manually configure the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "containers.conf"
        }), " file or the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "CONTAINERS_MACHINE_PROVIDER"
        }), " environment variable. See ", (0,jsx_runtime.jsxs)(_components.a, {
          href: "/docs/installation/macos-install#using-libkrun-as-machine-provider",
          children: ["Using ", (0,jsx_runtime.jsx)(_components.code, {
            children: "libkrun"
          }), " as machine provider"]
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources-2",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/podman-desktop/podman-desktop/issues/9860",
          children: "Issue #9860"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "running-out-of-disk-space-on-macos",
      children: "Running out of disk space on macOS"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["On macOS, ", (0,jsx_runtime.jsx)(_components.code, {
        children: ".plist"
      }), " files append Podman Desktop data to the previous log files, increasing their size."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop 1.16, the log files are automatically cleaned at the restart of the application. This ensures the log files do not increase indefinitely in size. However, you can check the size of the log files to manually troubleshoot disk space issues at any time."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-6",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Check the size of the Podman Desktop log files to troubleshoot:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ ls -la ~/Library/Logs/Podman\\ Desktop/*.log\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop 1.16.0 or later versions, your computer might require a restart to truncate the Podman Desktop log files.\nTo avoid restarting your computer, run these commands one by one:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ launchctl unload  ~/Library/LaunchAgents/io.podman_desktop.PodmanDesktop.plist\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ launchctl load  ~/Library/LaunchAgents/io.podman_desktop.PodmanDesktop.plist\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "unable-to-upgrade-podman-desktop-to-the-latest-version-using-homebrew",
      children: "Unable to upgrade Podman Desktop to the latest version using Homebrew"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When you use Homebrew to upgrade to the latest version of Podman Desktop, you might get an error stating ", (0,jsx_runtime.jsx)(_components.code, {
        children: "It seems the App source '/Applications/Podman Desktop.app' is not there"
      }), ". Because of this, you are unable to upgrade smoothly."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "solution-7",
      children: "Solution"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To resolve the error, use the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "--greedy"
      }), " flag with the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "upgrade"
      }), " command:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ brew upgrade --greedy podman-desktop\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "--greedy"
      }), " flag instructs Homebrew to check and upgrade casks marked with ", (0,jsx_runtime.jsx)(_components.code, {
        children: ":latest"
      }), " versions. This ensures self-updating applications, such as Podman Desktop, are included in the upgrade process if a newer cask version exists."]
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



/***/ }

}]);