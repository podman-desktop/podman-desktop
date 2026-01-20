"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[91224],{

/***/ 34049:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_podman_rosetta_md_932_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-podman-rosetta-md-932.json
const site_docs_podman_rosetta_md_932_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"podman/rosetta","title":"Native Apple Rosetta translation layer (macOS)","description":"Use Apple Rosetta to speed up cross-architecture containers","source":"@site/docs/podman/rosetta.md","sourceDirName":"podman","slug":"/podman/rosetta","permalink":"/docs/podman/rosetta","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/podman/rosetta.md","tags":[],"version":"current","sidebarPosition":20,"frontMatter":{"sidebar_position":20,"title":"Native Apple Rosetta translation layer (macOS)","description":"Use Apple Rosetta to speed up cross-architecture containers"},"sidebar":"mySidebar","previous":{"title":"GPU container access","permalink":"/docs/podman/gpu"},"next":{"title":"Remote access","permalink":"/docs/podman/podman-remote"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/podman/rosetta.md


const frontMatter = {
	sidebar_position: 20,
	title: 'Native Apple Rosetta translation layer (macOS)',
	description: 'Use Apple Rosetta to speed up cross-architecture containers'
};
const contentTitle = 'Native Apple Rosetta translation layer';

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
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
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
        id: "native-apple-rosetta-translation-layer",
        children: "Native Apple Rosetta translation layer"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["On macOS, Podman machine creates a virtual machine that uses the native Apple hypervisor ", (0,jsx_runtime.jsx)(_components.code, {
        children: "applehv"
      }), " with Rosetta enabled by default. This increases the speed of any ", (0,jsx_runtime.jsx)(_components.code, {
        children: "x86_64"
      }), " builds or containers to near-native levels by using a translation layer."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Rosetta support is enabled by default on all new Podman machine installations. If you disable Rosetta, ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://www.qemu.org/",
        children: "qemu"
      }), " will instead be used."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "macOS Silicon"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To enable Rosetta support, re-create your Podman machine instance:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Delete your Podman machine."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Enable Rosetta support under ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Settings"
          }), ":"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "rosetta",
        src: (__webpack_require__(93210)/* ["default"] */ .A) + "",
        width: "1050",
        height: "700"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      start: "3",
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Re-create your Podman machine."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To verify that Rosetta has been enabled or disabled, check your ", (0,jsx_runtime.jsx)(_components.code, {
        children: "~/.config/containers/containers.conf"
      }), " configuration."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You will see the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "rosetta"
      }), " configuration parameter with either ", (0,jsx_runtime.jsx)(_components.code, {
        children: "true"
      }), " or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "false"
      }), ". If the parameter does ", (0,jsx_runtime.jsx)(_components.em, {
        children: "not"
      }), " exist, Rosetta is already enabled by default."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://developer.apple.com/documentation/virtualization/running_intel_binaries_in_linux_vms_with_rosetta",
          children: "Official Apple Rosetta documentation"
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

/***/ 93210:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/rosetta-c2114a08b874ea1dde1c55d36128c39a.png");

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