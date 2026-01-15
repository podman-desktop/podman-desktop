"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[93180],{

/***/ 17912:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_api_classes_repository_info_parser_md_076_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/api/site-api-classes-repository-info-parser-md-076.json
const site_api_classes_repository_info_parser_md_076_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"classes/RepositoryInfoParser","title":"Class: RepositoryInfoParser","description":"Defined in5115","source":"@site/api/classes/RepositoryInfoParser.md","sourceDirName":"classes","slug":"/classes/RepositoryInfoParser","permalink":"/api/classes/RepositoryInfoParser","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"typedocSidebar","previous":{"title":"EventEmitter","permalink":"/api/classes/EventEmitter"},"next":{"title":"TelemetryTrustedValue","permalink":"/api/classes/TelemetryTrustedValue"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./api/classes/RepositoryInfoParser.md


const frontMatter = {};
const contentTitle = 'Class: RepositoryInfoParser';

const assets = {

};



const toc = [{
  "value": "Constructors",
  "id": "constructors",
  "level": 2
}, {
  "value": "Constructor",
  "id": "constructor",
  "level": 3
}, {
  "value": "Parameters",
  "id": "parameters",
  "level": 4
}, {
  "value": "url",
  "id": "url",
  "level": 5
}, {
  "value": "Returns",
  "id": "returns",
  "level": 4
}, {
  "value": "Throws",
  "id": "throws",
  "level": 4
}, {
  "value": "Throws",
  "id": "throws-1",
  "level": 4
}, {
  "value": "Properties",
  "id": "properties",
  "level": 2
}, {
  "value": "owner",
  "id": "owner",
  "level": 3
}, {
  "value": "repository",
  "id": "repository",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    header: "header",
    hr: "hr",
    p: "p",
    strong: "strong",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "class-repositoryinfoparser",
        children: "Class: RepositoryInfoParser"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Defined in: ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/7691e4d7c9ea1057ef27cf03daa671731c53121b/packages/extension-api/src/extension-api.d.ts#L5115",
        children: "packages/extension-api/src/extension-api.d.ts:5115"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Parses a repository URL to extract owner and repository information.\nIt currently only supports GitHub repositories."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "constructors",
      children: "Constructors"
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "constructor",
      children: "Constructor"
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: "new RepositoryInfoParser"
        }), "(", (0,jsx_runtime.jsx)(_components.code, {
          children: "url"
        }), "): ", (0,jsx_runtime.jsx)(_components.code, {
          children: "RepositoryInfoParser"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Defined in: ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/7691e4d7c9ea1057ef27cf03daa671731c53121b/packages/extension-api/src/extension-api.d.ts#L5131",
        children: "packages/extension-api/src/extension-api.d.ts:5131"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Creates an instance of RepositoryInfoParser."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "parameters",
      children: "Parameters"
    }), "\n", (0,jsx_runtime.jsx)(_components.h5, {
      id: "url",
      children: "url"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        children: "string"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The URL of the repository to parse."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "returns",
      children: "Returns"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        children: "RepositoryInfoParser"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "throws",
      children: "Throws"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If the URL cannot be parsed."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "throws-1",
      children: "Throws"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If the repository is not hosted on GitHub."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "properties",
      children: "Properties"
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "owner",
      children: "owner"
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "readonly"
        }), " ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "owner"
        }), ": ", (0,jsx_runtime.jsx)(_components.code, {
          children: "string"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Defined in: ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/7691e4d7c9ea1057ef27cf03daa671731c53121b/packages/extension-api/src/extension-api.d.ts#L5119",
        children: "packages/extension-api/src/extension-api.d.ts:5119"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The owner of the GitHub repository (e.g., 'microsoft')."
    }), "\n", (0,jsx_runtime.jsx)(_components.hr, {}), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "repository",
      children: "repository"
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "readonly"
        }), " ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "repository"
        }), ": ", (0,jsx_runtime.jsx)(_components.code, {
          children: "string"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Defined in: ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/blob/7691e4d7c9ea1057ef27cf03daa671731c53121b/packages/extension-api/src/extension-api.d.ts#L5123",
        children: "packages/extension-api/src/extension-api.d.ts:5123"
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The name of the GitHub repository (e.g., 'vscode')."
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