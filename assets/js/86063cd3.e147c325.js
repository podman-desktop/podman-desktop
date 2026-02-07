"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[98910],{

/***/ 63079
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_lima_customizing_md_860_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-lima-customizing-md-860.json
const site_docs_lima_customizing_md_860_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"lima/customizing","title":"Customizing Lima instance","description":"Customizing Lima","source":"@site/docs/lima/customizing.md","sourceDirName":"lima","slug":"/lima/customizing","permalink":"/docs/lima/customizing","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/lima/customizing.md","tags":[{"inline":true,"label":"lima","permalink":"/docs/tags/lima"}],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Customizing Lima instance","description":"Customizing Lima","keywords":["podman desktop","containers","kubernetes","lima"],"tags":["lima"]},"sidebar":"mySidebar","previous":{"title":"Lima instance for Kubernetes","permalink":"/docs/lima/creating-a-kubernetes-instance"},"next":{"title":"Building and testing an image","permalink":"/docs/lima/building-an-image-and-testing-it-in-lima"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/lima/customizing.md


const frontMatter = {
	sidebar_position: 4,
	title: 'Customizing Lima instance',
	description: 'Customizing Lima',
	keywords: [
		'podman desktop',
		'containers',
		'kubernetes',
		'lima'
	],
	tags: [
		'lima'
	]
};
const contentTitle = 'Customizing the Lima instance for varying workloads';

const assets = {

};



const toc = [{
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "Directory",
  "id": "directory",
  "level": 3
}, {
  "value": "Resources",
  "id": "resources",
  "level": 3
}, {
  "value": "VM and Mount",
  "id": "vm-and-mount",
  "level": 3
}, {
  "value": "Containers",
  "id": "containers",
  "level": 3
}, {
  "value": "Docker",
  "id": "docker",
  "level": 4
}, {
  "value": "Podman",
  "id": "podman",
  "level": 4
}, {
  "value": "Kubernetes",
  "id": "kubernetes",
  "level": 3
}, {
  "value": "k3s.io",
  "id": "k3sio",
  "level": 4
}, {
  "value": "k8s.io",
  "id": "k8sio",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h3: "h3",
    h4: "h4",
    header: "header",
    li: "li",
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
        id: "customizing-the-lima-instance-for-varying-workloads",
        children: "Customizing the Lima instance for varying workloads"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can customize Lima instance, using YAML and ", (0,jsx_runtime.jsx)(_components.code, {
        children: "yq"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For more information on yq, see the yq ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://mikefarah.gitbook.io/yq/",
        children: "documentation"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "To create a new instance:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ limactl create <instance>\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "To edit an existing instance:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "$ limactl edit <instance>\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Some of the things you can edit:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Change the number of CPUs, the memory, and the disk size"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Change the operating system (the Linux distribution)"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Modify the cluster setup (the Kubernetes distribution)"
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "both"
        }), " of container workloads and Kubernetes workloads"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "See also:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://lima-vm.io/docs/",
          children: "Lima documentation"
        })
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/afbjorklund/lima-gui",
          children: "Lima GUI"
        }), " (with editor)"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "directory",
      children: "Directory"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To find the location of the instance directory (", (0,jsx_runtime.jsx)(_components.code, {
        children: "Dir"
      }), "):"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "limactl list <instance> --format '{{.Dir}}'\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "resources",
      children: "Resources"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The resources can be set per instance, or as a global default."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "# CPUs\n# 🟢 Builtin default: min(4, host CPU cores)\ncpus: null\n\n# Memory size\n# 🟢 Builtin default: min(\"4GiB\", half of host memory)\nmemory: null\n\n# Disk size\n# 🟢 Builtin default: \"100GiB\"\ndisk: null\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To set the default, edit ", (0,jsx_runtime.jsx)(_components.code, {
        children: "_config/default.yaml"
      }), " in Lima home."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "# The builtin defaults can be changed globally by creating a $LIMA_HOME/_config/default.yaml\n# file. It will be used by ALL instances under the same $LIMA_HOME, and it\n# will be applied on each `limactl start`, so can affect instance restarts.\n\n# A similar mechanism is $LIMA_HOME/_config/override.yaml, which will take\n# precedence even over the settings in an instances lima.yaml file.\n# It too applies to ALL instances under the same $LIMA_HOME, and is applied\n# on each restart. It can be used to globally override settings, e.g. make\n# the mount of the home directory writable.\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "vm-and-mount",
      children: "VM and Mount"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Any virtual machine (or server) with ssh can be used for Lima."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Most compatible mount type is \"reverse-sshfs\" (from ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/lima-vm/sshocker",
        children: "sshocker"
      }), ")."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Optionally you can use \"qemu\" vm with \"9p\" (aka virtfs) mount."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "On macOS 13+, you can also use \"vz\" vm with \"virtiofs\" mount."
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "# VM type: \"qemu\" or \"vz\" (on macOS 13 and later).\n# The vmType can be specified only on creating the instance.\n# The vmType of existing instances cannot be changed.\n# 🟢 Builtin default: \"qemu\"\nvmType: null\n\n# Mount type for above mounts, such as \"reverse-sshfs\" (from sshocker),\n# \"9p\" (EXPERIMENTAL, from QEMU’s virtio-9p-pci, aka virtfs),\n# or \"virtiofs\" (EXPERIMENTAL, needs `vmType: vz`)\n# 🟢 Builtin default: \"reverse-sshfs\" (for QEMU), \"virtiofs\" (for vz)\nmountType: null\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "containers",
      children: "Containers"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can install a container engine, in addition to the existing runtime."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For instance you can install ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/containers/podman",
        children: "Podman Engine"
      }), ",\nor you can install ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/docker/docker",
        children: "Docker Engine"
      }), ".\nAfter that you can port forward the socket, to the host ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Dir"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "docker",
      children: "Docker"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "portForwards:\n  - guestSocket: '/var/run/docker.sock'\n    hostSocket: '{{.Dir}}/sock/docker.sock'\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "/var/run/docker.sock"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "export DOCKER_HOST=\"unix://{{.Dir}}/sock/docker.sock\"\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "podman",
      children: "Podman"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "portForwards:\n  - guestSocket: '/run/podman/podman.sock'\n    hostSocket: '{{.Dir}}/sock/podman.sock'\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "/run/podman/podman.sock"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "export CONTAINER_HOST=\"unix://{{.Dir}}/sock/podman.sock\"\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "kubernetes",
      children: "Kubernetes"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can install Kubernetes, on top of the existing container engine."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For instance you can use ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/cri-o/cri-o",
        children: "CRI-O"
      }), " for Podman,\nor ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/Mirantis/cri-dockerd",
        children: "CRI-Dockerd"
      }), " for Docker.\nAfter that you can copy the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "kubeconfig.yaml"
      }), " file, to the host ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Dir"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "k3sio",
      children: "k3s.io"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "copyToHost:\n  - guest: '/etc/rancher/k3s/k3s.yaml'\n    host: '{{.Dir}}/copied-from-guest/kubeconfig.yaml'\n    deleteOnStop: true\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "/etc/rancher/k3s/k3s.yaml"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "export KUBECONFIG=\"{{.Dir}}/copied-from-guest/kubeconfig.yaml\"\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "k8sio",
      children: "k8s.io"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-yaml",
        children: "copyToHost:\n  - guest: '/etc/kubernetes/admin.conf'\n    host: '{{.Dir}}/copied-from-guest/kubeconfig.yaml'\n    deleteOnStop: true\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "/etc/kubernetes/admin.conf"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "export KUBECONFIG=\"{{.Dir}}/copied-from-guest/kubeconfig.yaml\"\n"
      })
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