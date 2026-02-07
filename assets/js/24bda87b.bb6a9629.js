"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[90843],{

/***/ 56042
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_podman_creating_a_podman_machine_md_24b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-podman-creating-a-podman-machine-md-24b.json
const site_docs_podman_creating_a_podman_machine_md_24b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"podman/creating-a-podman-machine","title":"Creating a Podman machine","description":"Podman Desktop can assist you to create custom Podman machine on Windows and macOS.","source":"@site/docs/podman/creating-a-podman-machine.md","sourceDirName":"podman","slug":"/podman/creating-a-podman-machine","permalink":"/docs/podman/creating-a-podman-machine","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/podman/creating-a-podman-machine.md","tags":[{"inline":true,"label":"podman","permalink":"/docs/tags/podman"},{"inline":true,"label":"installing","permalink":"/docs/tags/installing"},{"inline":true,"label":"windows","permalink":"/docs/tags/windows"},{"inline":true,"label":"macOS","permalink":"/docs/tags/mac-os"}],"version":"current","sidebarPosition":20,"frontMatter":{"sidebar_position":20,"title":"Creating a Podman machine","description":"Podman Desktop can assist you to create custom Podman machine on Windows and macOS.","tags":["podman","installing","windows","macOS"],"keywords":["podman desktop","containers","podman","installing","installation","windows","macos","podman machine"]},"sidebar":"mySidebar","previous":{"title":"Podman","permalink":"/docs/podman/"},"next":{"title":"GPU container access","permalink":"/docs/podman/gpu"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/podman/creating-a-podman-machine.md


const frontMatter = {
	sidebar_position: 20,
	title: 'Creating a Podman machine',
	description: 'Podman Desktop can assist you to create custom Podman machine on Windows and macOS.',
	tags: [
		'podman',
		'installing',
		'windows',
		'macOS'
	],
	keywords: [
		'podman desktop',
		'containers',
		'podman',
		'installing',
		'installation',
		'windows',
		'macos',
		'podman machine'
	]
};
const contentTitle = 'Creating a Podman machine';

const assets = {

};



const toc = [{
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure",
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
        id: "creating-a-podman-machine",
        children: "Creating a Podman machine"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "On macOS and Windows, running the Podman container engine requires running a Linux virtual machine."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "By default, Podman Desktop initializes a Podman machine with a standard configuration."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Consider creating a custom Podman machine to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Control the assigned resources: CPUs, memory, and disk size."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Use a custom boot image."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Use the rootful connection by default, for example to run Kind."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "(On Windows) Route the traffic through the network connection from your Windows session."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The Podman executable is installed."
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["On the macOS ARM64 platform, you might get a warning that the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "krunkit"
            }), " binary is unavailable on the ", (0,jsx_runtime.jsx)(_components.em, {
              children: "Create Podman machine"
            }), " page. To resolve the warning, ", (0,jsx_runtime.jsxs)(_components.a, {
              href: "https://github.com/containers/krunkit?tab=readme-ov-file#installation",
              children: ["install ", (0,jsx_runtime.jsx)(_components.code, {
                children: "krunkit"
              }), " manually"]
            }), " or ", (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/containers/podman/releases",
              children: "install Podman using the GitHub installer"
            }), "."]
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Podman"
        }), " tile, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create new"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Create a Podman machine"
        }), " screen:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.strong, {
                children: "Name"
              }), ":\nEnter a name, such as ", (0,jsx_runtime.jsx)(_components.code, {
                children: "podman-machine-default"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.strong, {
                children: "CPU(s)"
              }), ":\nSelect the number of CPUs."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.strong, {
                children: "Memory"
              }), ":\nSelect the memory size."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.strong, {
                children: "Disk size"
              }), ":\nSelect the disk size."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Optional: Provide a bootable image using one of the following options:"
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Image Path"
                }), ": Select an image, such as ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "podman-machine.aarch64.applehv.raw.zst"
                }), " from your local machine."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Image URL or image reference"
                }), ": Enter an image URL or a registry path. You can use an image URL from the ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://github.com/containers/podman/releases",
                  children: "Podman releases page"
                }), " or use a valid registry path in the format ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "registry/repo/image:version"
                }), "."]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.strong, {
                children: "Machine with root privileges"
              }), ":\nEnable to use the rootful connection by default.\nRequired to use Kind on Windows."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Additional settings based on your operating system:"
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["(On Windows)", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: [(0,jsx_runtime.jsx)(_components.strong, {
                      children: "User mode networking (traffic relayed by a user process)"
                    }), ": Enable to route the traffic through the network connection from your Windows session. This setting is required to access resources behind your VPN connection."]
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: [(0,jsx_runtime.jsx)(_components.strong, {
                      children: "Provider Type"
                    }), ": The setting is visible only to administrators, and its default value is ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "wsl"
                    }), "."]
                  }), "\n"]
                }), "\n"]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["(On macOS) ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Provider Type"
                }), ":", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["For the macOS ARM64 platform, the default value is ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "GPU enabled (LibKrun)"
                    }), ". However, you can switch to ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "Apple HyperVisor"
                    }), " when needed."]
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["For the macOS AMD64 platform, the default value is ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "Apple HyperVisor"
                    }), ", and you cannot use the ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "GPU enabled (LibKrun)"
                    }), " provider."]
                  }), "\n"]
                }), "\n"]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Create"
              }), "."]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.img, {
                alt: "Create a Podman machine",
                src: (__webpack_require__(52064)/* ["default"] */ .A) + "",
                width: "1954",
                height: "1220"
              })
            }), "\n"]
          }), "\n"]
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



/***/ },

/***/ 52064
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-a-podman-machine-31ae4d2a0e55ee126a413e75f6cee8ac.png");

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