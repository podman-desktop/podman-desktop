"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[74238],{

/***/ 56632:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_images_pushing_an_image_to_a_registry_md_c5b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-images-pushing-an-image-to-a-registry-md-c5b.json
const site_docs_containers_images_pushing_an_image_to_a_registry_md_c5b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/images/pushing-an-image-to-a-registry","title":"Pushing an image to a registry","description":"Pushing an image to a registry.","source":"@site/docs/containers/images/pushing-an-image-to-a-registry.md","sourceDirName":"containers/images","slug":"/containers/images/pushing-an-image-to-a-registry","permalink":"/docs/containers/images/pushing-an-image-to-a-registry","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/images/pushing-an-image-to-a-registry.md","tags":[{"inline":true,"label":"images","permalink":"/docs/tags/images"},{"inline":true,"label":"pushing-an-image","permalink":"/docs/tags/pushing-an-image"}],"version":"current","sidebarPosition":21,"frontMatter":{"sidebar_position":21,"title":"Pushing an image to a registry","description":"Pushing an image to a registry.","keywords":["podman desktop","podman","containers","image","registry","registries"],"tags":["images","pushing-an-image"]},"sidebar":"mySidebar","previous":{"title":"Building an image","permalink":"/docs/containers/images/building-an-image"},"next":{"title":"Pulling an image","permalink":"/docs/containers/images/pulling-an-image"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/images/pushing-an-image-to-a-registry.md


const frontMatter = {
	sidebar_position: 21,
	title: 'Pushing an image to a registry',
	description: 'Pushing an image to a registry.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'image',
		'registry',
		'registries'
	],
	tags: [
		'images',
		'pushing-an-image'
	]
};
const contentTitle = 'Pushing an image to a registry';

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
        id: "pushing-an-image-to-a-registry",
        children: "Pushing an image to a registry"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can push an image to registries."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["You have configured your registry ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: [(0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-cog",
            size: "lg"
          }), " Settings > Registries"]
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["You have built an image with the fully qualified name required for your registry, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/my-repository/my-image"
        }), ", ", (0,jsx_runtime.jsx)(_components.code, {
          children: "ghcr.io/my-repository/my-image"
        }), ", or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "docker.io/my-repository/my-image"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Ensure that the image name includes the registry where to publish the image. To publish on ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/repository"
        }), " the image ", (0,jsx_runtime.jsx)(_components.code, {
          children: "my-image"
        }), ", the FQN image name should be ", (0,jsx_runtime.jsx)(_components.code, {
          children: "quay.io/repository/my-image"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Images"
        }), " from the left navigation pane."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "overflow menu"
        }), " icon corresponding to the image you want to push and select ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Push Image"
        }), ". The image tag is auto-selected.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "pushing an image",
          src: (__webpack_require__(11314)/* ["default"] */ .A) + "",
          width: "1852",
          height: "670"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Push image"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "image tag selected",
          src: (__webpack_require__(68524)/* ["default"] */ .A) + "",
          width: "1190",
          height: "558"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Done"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Go to your container registry."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Find your image."
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

/***/ 68524:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/image-tag-selected-ddd1078d412baaee11d0bbaa101ae4c2.png");

/***/ }),

/***/ 11314:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pushing-an-image-85eb503e179ad14544d583c99511f8ab.png");

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