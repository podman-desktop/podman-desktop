"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[9962],{

/***/ 18130
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_images_building_an_image_md_014_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-images-building-an-image-md-014.json
const site_docs_containers_images_building_an_image_md_014_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/images/building-an-image","title":"Building an image","description":"Building an image on your container engine.","source":"@site/docs/containers/images/building-an-image.md","sourceDirName":"containers/images","slug":"/containers/images/building-an-image","permalink":"/docs/containers/images/building-an-image","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/images/building-an-image.md","tags":[{"inline":true,"label":"images","permalink":"/docs/tags/images"},{"inline":true,"label":"building-an-image","permalink":"/docs/tags/building-an-image"}],"version":"current","sidebarPosition":20,"frontMatter":{"sidebar_position":20,"title":"Building an image","description":"Building an image on your container engine.","keywords":["podman desktop","podman","containers","images"],"tags":["images","building-an-image"]},"sidebar":"mySidebar","previous":{"title":"Images","permalink":"/docs/containers/images/"},"next":{"title":"Pushing an image to a registry","permalink":"/docs/containers/images/pushing-an-image-to-a-registry"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/containers/images/building-an-image.md


const frontMatter = {
	sidebar_position: 20,
	title: 'Building an image',
	description: 'Building an image on your container engine.',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'images'
	],
	tags: [
		'images',
		'building-an-image'
	]
};
const contentTitle = 'Building an image on your container engine';

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
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "building-an-image-on-your-container-engine",
        children: "Building an image on your container engine"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop, you can build an image from a Containerfile on your container engine."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Your Containerfile: ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Containerfile"
        }), " or ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Dockerfile"
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
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Build"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "build button",
          src: (__webpack_require__(96535)/* ["default"] */ .A) + "",
          width: "1732",
          height: "416"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Provide the following details:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Containerfile path"
            }), ": Select the ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Containerfile"
            }), " or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Dockerfile"
            }), " to build."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Build context directory"
            }), ": The field automatically picks the context directory based on the file path. You can change the directory, if needed."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Image Name"
            }), ": Enter your image name, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-image"
            }), ". If you want to push the image to a registry, use the fully qualified image name that your registry requires, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io/my-repository/my-image"
            }), ", ", (0,jsx_runtime.jsx)(_components.code, {
              children: "ghcr.io/my-repository/my-image"
            }), ", or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "docker.io/my-repository/my-image"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Build arguments"
            }), ": Pass the key and value for the arguments defined in your ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Containerfile"
            }), " or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Dockerfile"
            }), ", if needed."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Platform"
            }), ": Select multiple platforms on which you want to build the image. The default platform is ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Intel and AMD x86_64 systems"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Build"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "building image from containerfile",
          src: (__webpack_require__(50305)/* ["default"] */ .A) + "",
          width: "1668",
          height: "1508"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Done"
        }), " after the image is built."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["View the newly created image on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "newly created image",
          src: (__webpack_require__(19024)/* ["default"] */ .A) + "",
          width: "1992",
          height: "550"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click the name of the image to view its summary.\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "image summary page",
          src: (__webpack_require__(69738)/* ["default"] */ .A) + "",
          width: "1578",
          height: "682"
        })]
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



/***/ },

/***/ 96535
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/build-button-ff19cb19e969ee48e50ed92e9b6a0d16.png");

/***/ },

/***/ 50305
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/building-image-from-containerfile-27092555bf9ae8ba5a367c6be494bb95.png");

/***/ },

/***/ 69738
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/image-summary-page-b2d048749bdc77d4ec1ebded96b4c3f7.png");

/***/ },

/***/ 19024
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/newly-created-image-668bf69c31a407a0903540dd24832f0e.png");

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