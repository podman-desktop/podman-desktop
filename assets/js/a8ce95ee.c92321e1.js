"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[97120],{

/***/ 88158:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_images_pulling_an_image_md_a8c_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-images-pulling-an-image-md-a8c.json
const site_docs_containers_images_pulling_an_image_md_a8c_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/images/pulling-an-image","title":"Pulling an image","description":"Pulling an image to your container engine.","source":"@site/docs/containers/images/pulling-an-image.md","sourceDirName":"containers/images","slug":"/containers/images/pulling-an-image","permalink":"/docs/containers/images/pulling-an-image","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/images/pulling-an-image.md","tags":[{"inline":true,"label":"images","permalink":"/docs/tags/images"},{"inline":true,"label":"pulling-an-image","permalink":"/docs/tags/pulling-an-image"}],"version":"current","sidebarPosition":22,"frontMatter":{"sidebar_position":22,"title":"Pulling an image","description":"Pulling an image to your container engine.","keywords":["podman desktop","podman","containers","images"],"tags":["images","pulling-an-image"]},"sidebar":"mySidebar","previous":{"title":"Pushing an image to a registry","permalink":"/docs/containers/images/pushing-an-image-to-a-registry"},"next":{"title":"Start a container","permalink":"/docs/containers/starting-a-container"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/images/pulling-an-image.md


const frontMatter = {
	sidebar_position: 22,
	title: 'Pulling an image',
	description: 'Pulling an image to your container engine.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'images'
	],
	tags: [
		'images',
		'pulling-an-image'
	]
};
const contentTitle = 'Pulling an image to your container engine';

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
}];
function _createMdxContent(props) {
  const _components = {
    admonition: "admonition",
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
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "pulling-an-image-to-your-container-engine",
        children: "Pulling an image to your container engine"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can pull an image from a registry to your container engine."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "The image is available in a registry."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["If the registry or the image is not publicly available, you configured access to the registry on Podman Desktop in ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: [(0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-cog",
            size: "lg"
          }), " Settings > Registries"]
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Images"
          }), " from the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Pull"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "pull button",
            src: (__webpack_require__(96910)/* ["default"] */ .A) + "",
            width: "1812",
            height: "428"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Enter the image name, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "quay.io/podman/hello"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "Prefer the fully qualified image name that specifies the registry over the short name, which might lead to registry resolution errors."
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Pull image"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "pull button",
            src: (__webpack_require__(61186)/* ["default"] */ .A) + "",
            width: "1806",
            height: "566"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Done"
          }), "."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the pulled image on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "image pulled successfully",
          src: (__webpack_require__(17940)/* ["default"] */ .A) + "",
          width: "1822",
          height: "692"
        })]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click the name of the image to view its summary."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Optional: View the history of the image or inspect the image."
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ }),

/***/ 17940:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/image-pulled-successfully-4724a470f7f77899313ae2771bd8adae.png");

/***/ }),

/***/ 96910:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pull-button-e4088310667070547ed7102890fa4ab9.png");

/***/ }),

/***/ 61186:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pull-image-button-70ce2de844302378dfc23d6f7f870103.png");

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