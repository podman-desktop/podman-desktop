"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[12005],{

/***/ 41866:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_podman_adding_certificates_to_a_podman_machine_md_36d_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-podman-adding-certificates-to-a-podman-machine-md-36d.json
const site_docs_podman_adding_certificates_to_a_podman_machine_md_36d_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"podman/adding-certificates-to-a-podman-machine","title":"Adding certificates to a Podman machine","description":"Adding certificates to a Podman machine","source":"@site/docs/podman/adding-certificates-to-a-podman-machine.md","sourceDirName":"podman","slug":"/podman/adding-certificates-to-a-podman-machine","permalink":"/docs/podman/adding-certificates-to-a-podman-machine","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/podman/adding-certificates-to-a-podman-machine.md","tags":[{"inline":true,"label":"adding-certificates","permalink":"/docs/tags/adding-certificates"}],"version":"current","sidebarPosition":51,"frontMatter":{"sidebar_position":51,"title":"Adding certificates to a Podman machine","description":"Adding certificates to a Podman machine","keywords":["podman desktop","podman","certificates"],"tags":["adding-certificates"]},"sidebar":"mySidebar","previous":{"title":"Setting Podman machine default connection","permalink":"/docs/podman/setting-podman-machine-default-connection"},"next":{"title":"Accessing Podman from another WSL distribution (Windows)","permalink":"/docs/podman/accessing-podman-from-another-wsl-instance"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/podman/adding-certificates-to-a-podman-machine.md


const frontMatter = {
	sidebar_position: 51,
	title: 'Adding certificates to a Podman machine',
	description: 'Adding certificates to a Podman machine',
	keywords: [
		'podman desktop',
		'podman',
		'certificates'
	],
	tags: [
		'adding-certificates'
	]
};
const contentTitle = 'Adding certificates to a Podman machine';

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
        id: "adding-certificates-to-a-podman-machine",
        children: "Adding certificates to a Podman machine"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can add certificates from your local certificate authority (CA) or from a third-party vendor into a Podman machine. After adding these certificates, you can use them in your images to:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Secure the communication channel between the running applications in your container and the external host system"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Validate the SSL or TLS certificates provided by external services for authentication"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsx)(_components.p, {
        children: "On Windows, the Podman commands use the CAs from the certificate store. For example, if you are unable to log in to an internal registry because the added certificate was not trusted by Podman, you can add it to the Windows certificate store. This will enable Podman commands to trust the certificate and help you log in to that registry."
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["A running ", (0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Obtained the required certificates for installation, such as ", (0,jsx_runtime.jsx)(_components.em, {
          children: "certificate.pem"
        }), " or ", (0,jsx_runtime.jsx)(_components.em, {
          children: "certificate.crt"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Start an interactive session with the default Podman machine:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ podman machine ssh <machine_name>\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "2",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Optional: Switch to a root shell only if Podman runs in the default rootless mode:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ sudo su -\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "3",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Change to the directory where the certificates must be placed:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ cd /etc/pki/ca-trust/source/anchors\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "4",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Perform one of the following steps:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Use the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "curl"
          }), " command to download a certificate:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$ curl [-k] -o <my-certificate> https://<my-server.com/my-certificate>\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Use any editor, such as Notepad or Vim to create a certificate file with .crt, .cer, or .pem extension."
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "You can convert a certificate file to a text file and copy its content to the editor."
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "5",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Add the certificate to the list of trusted certificates:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ update-ca-trust\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "6",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Optional: Run the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "exit"
        }), " command to exit the root shell."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ exit\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "7",
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "exit"
          }), " command to exit the Podman machine."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Optional: Reboot the Podman machine."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-sh",
        children: "$ podman machine stop <machine_name>\n$ podman machine start <machine_name>\n"
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