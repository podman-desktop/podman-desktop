"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[40491],{

/***/ 18580:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_registries_configuring_mirror_registries_md_677_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-registries-configuring-mirror-registries-md-677.json
const site_docs_containers_registries_configuring_mirror_registries_md_677_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/registries/configuring-mirror-registries","title":"Configuring a mirror registry","description":"Covers the procedure to configure a mirror registry","source":"@site/docs/containers/registries/configuring-mirror-registries.md","sourceDirName":"containers/registries","slug":"/containers/registries/configuring-mirror-registries","permalink":"/docs/containers/registries/configuring-mirror-registries","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/registries/configuring-mirror-registries.md","tags":[{"inline":true,"label":"registry-configuration","permalink":"/docs/tags/registry-configuration"},{"inline":true,"label":"mirroring-a-registry","permalink":"/docs/tags/mirroring-a-registry"}],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4,"title":"Configuring a mirror registry","description":"Covers the procedure to configure a mirror registry","keywords":["podman desktop","podman","mirroring","registry","configuration"],"tags":["registry-configuration","mirroring-a-registry"]},"sidebar":"mySidebar","previous":{"title":"Registries","permalink":"/docs/containers/registries/"},"next":{"title":"Images","permalink":"/docs/containers/images/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/registries/configuring-mirror-registries.md


const frontMatter = {
	sidebar_position: 4,
	title: 'Configuring a mirror registry',
	description: 'Covers the procedure to configure a mirror registry',
	keywords: [
		'podman desktop',
		'podman',
		'mirroring',
		'registry',
		'configuration'
	],
	tags: [
		'registry-configuration',
		'mirroring-a-registry'
	]
};
const contentTitle = 'Configuring a mirror registry';

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
    code: "code",
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
        id: "configuring-a-mirror-registry",
        children: "Configuring a mirror registry"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can add registry locations and configure their mirrors by using the Podman Desktop UI. By configuring a mirror, you can redirect a registry to another location and use its content, such as images, files, and other resources during development."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "Recreate your Podman machine"
        }), " to mount the registry configuration file."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Upgrade to the latest version of Podman."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Select ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "More Options > Setup registry configuration"
        }), " in the Podman tile. A command palette opens.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "Set up registry configuration",
          src: (__webpack_require__(94748)/* ["default"] */ .A) + "",
          width: "1376",
          height: "696"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Set up your registry configuration:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Select the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Add registry configuration"
            }), " option from the command palette.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "adding registry configuration",
              src: (__webpack_require__(12133)/* ["default"] */ .A) + "",
              width: "1212",
              height: "245"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Type the location of the registry, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io"
            }), ", and press the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Enter"
            }), " key. The ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io"
            }), " registry is added to the palette.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "quay.io registry added",
              src: (__webpack_require__(55128)/* ["default"] */ .A) + "",
              width: "1192",
              height: "290"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Select ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io"
            }), " from the command palette."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Type the location where you want to mirror the registry, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "ghcr.io"
            }), ", and press the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Enter"
            }), " key. The entry for the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io"
            }), " registry shows the location where it is mirrored.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "mirrored registry location",
              src: (__webpack_require__(68301)/* ["default"] */ .A) + "",
              width: "1204",
              height: "290"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Select the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "End configuring registries"
            }), " option to end registry configuration.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "ending registry configuration",
              src: (__webpack_require__(85636)/* ["default"] */ .A) + "",
              width: "1208",
              height: "288"
            })]
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



/***/ }),

/***/ 12133:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/add-registry-configuration-346d67b5b3201e123498d6ab4defc513.png");

/***/ }),

/***/ 85636:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/end-configuring-registries-1f1ac267d2f8b2d99af27a54cb58a273.png");

/***/ }),

/***/ 68301:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/mirrored-registry-2b516a8f9274e6a112521f2b2072ac0b.png");

/***/ }),

/***/ 55128:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/quay-option-added-2b96875c8732e0f2d7a2fb59c4ffdaa0.png");

/***/ }),

/***/ 94748:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/setting-up-registry-configuration-5ea877a046089c2c44d97a2046a7d36c.png");

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