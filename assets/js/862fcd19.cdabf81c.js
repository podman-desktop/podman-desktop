"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[53034],{

/***/ 82309
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_07_31_intel_mac_podman_6_transition_md_862_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_07_31_intel_mac_podman_6_transition_md_862_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17102);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Intel Mac support in Podman Desktop: What developers need to know',
	description: 'Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.',
	slug: 'intel-mac-podman-6-transition',
	authors: [
		'kyetter'
	],
	tags: [
		'podman-desktop',
		'podman',
		'macos',
		'deprecation'
	],
	hide_table_of_contents: false
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Podman on macOS: A brief history",
  "id": "podman-on-macos-a-brief-history",
  "level": 2
}, {
  "value": "What&#39;s changing?",
  "id": "whats-changing",
  "level": 2
}, {
  "value": "I&#39;m on an Apple silicon Mac. Does this affect me?",
  "id": "im-on-an-apple-silicon-mac-does-this-affect-me",
  "level": 2
}, {
  "value": "What are the key dates?",
  "id": "what-are-the-key-dates",
  "level": 2
}, {
  "value": "Where can I share feedback?",
  "id": "where-can-i-share-feedback",
  "level": 2
}, {
  "value": "Conclusion",
  "id": "conclusion",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    h2: "h2",
    p: "p",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/podman-container-tools/podman/releases/tag/v6.0.0",
        children: "Podman v6.0.0"
      }), " has removed support for Intel-based Macs, and will no longer publish an installer. Podman Desktop is adjusting how we bundle the engine so Apple silicon, Windows, and Linux users can move to Podman 6 without leaving Intel Mac users with a broken install experience. This change shipped with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/blog/podman-desktop-release-1.29",
        children: "Podman Desktop 1.29"
      }), ". Here is what is changing, why, and what to do next."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "podman-on-macos-a-brief-history",
      children: "Podman on macOS: A brief history"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman Desktop bundles Podman so developers can install a working container environment from a single download. On macOS, Podman runs inside a lightweight virtual machine, and Podman Desktop has shipped a universal installer supporting both Apple silicon and Intel hardware. That made sense when Intel Macs were still common in the field. With Podman 6 now released, there is neither support nor an installer for Intel Macs, so we need a clear plan for the developers still on that hardware."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "whats-changing",
      children: "What's changing?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Starting with current Podman Desktop releases, ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "not every download ships the same Podman version"
      }), ":"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.table, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.thead, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.th, {
            children: "Download"
          }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.th, {
            children: "Bundled Podman version"
          })]
        })
      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tbody, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "macOS installer (Apple silicon)"
          }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Podman 6"
          })]
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "macOS installer (Intel)"
          }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Podman 5"
          })]
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "macOS installer (universal)"
          }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Podman 5 and Podman 6"
          })]
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Windows installer"
          }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Podman 6"
          })]
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.tr, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Linux packages"
          }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.td, {
            children: "Podman 6"
          })]
        })]
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Intel Mac users will continue to receive a Podman Desktop installer, but it will bundle ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Podman 5"
      }), ", not Podman 6. The universal macOS installer includes both architectures, so it installs Podman 5 on Intel Macs and Podman 6 on Apple silicon. Everyone else moves to Podman 6 with their next Podman Desktop update."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "im-on-an-apple-silicon-mac-does-this-affect-me",
      children: "I'm on an Apple silicon Mac. Does this affect me?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["No. If you are on Apple silicon, your Podman Desktop macOS installer bundles ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Podman 6"
      }), ". You get the latest engine improvements, and your upgrade path is unchanged. Install or update Podman Desktop as you normally would from the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/downloads/macos",
        children: "downloads page"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "what-are-the-key-dates",
      children: "What are the key dates?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop follows the Podman project's support policy for the v5.8 series. As documented in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/podman-container-tools/podman/blob/main/README.md",
        children: "Podman README"
      }), ":"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
        children: "After the release of Podman 6.0, the Podman maintainers have decided to extend upstream support of the v5.8 series of releases until the 2nd week of June in 2027, one year after the release of Podman 6.0. This support will only include CVE fixes and critical bugfixes."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We are aligning with that policy. We will continue to provide a bundle for Intel-based Macs until the Podman team ceases support in the second week of June 2027. After that point, Intel Mac users who remain on that hardware will rely on previously released Podman Desktop versions or external Podman installations rather than current installers."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "If the Podman maintainers adjust the v5.8 support window, we will follow their lead and communicate any changes to this timeline."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "where-can-i-share-feedback",
      children: "Where can I share feedback?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["If this transition affects your team or you have input on the timeline, please share it on ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/issues/16339",
        children: "GitHub issue #16339"
      }), " or join us in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/community",
        children: "community discussions"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman 6 moves the container ecosystem forward, and Podman Desktop is moving with it. This bundling change is available now in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/blog/podman-desktop-release-1.29",
        children: "Podman Desktop 1.29"
      }), ". For Intel Mac users, Podman Desktop will keep bundling Podman 5 for as long as the Podman maintainers support the v5.8 series, currently through the 2nd week of June 2027. Use that runway to plan your next environment, and keep building with confidence on Apple silicon, Windows, and Linux where Podman 6 is ready today."]
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return MDXLayout ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout, {
    ...props,
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent, {
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


/***/ },

/***/ 17102
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/intel-mac-podman-6-transition","source":"@site/blog/2026-07-31-intel-mac-podman-6-transition.md","title":"Intel Mac support in Podman Desktop: What developers need to know","description":"Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.","date":"2026-07-31T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"macos","permalink":"/blog/tags/macos"},{"inline":true,"label":"deprecation","permalink":"/blog/tags/deprecation"}],"readingTime":3.06,"hasTruncateMarker":true,"authors":[{"name":"Kathryn Yetter","title":"Product Manager","url":"https://github.com/kyetter","imageURL":"https://github.com/kyetter.png","key":"kyetter","page":null}],"frontMatter":{"title":"Intel Mac support in Podman Desktop: What developers need to know","description":"Podman 6 drops Intel Mac support. Podman Desktop will keep bundling Podman 5 for Intel Mac installs through upstream v5.8 support (through the second week of June 2027), while all other platforms move to Podman 6.","slug":"intel-mac-podman-6-transition","authors":["kyetter"],"tags":["podman-desktop","podman","macos","deprecation"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"5 Lessons Learned After 5 Million Downloads","permalink":"/blog/5-million-lessons-learned"},"nextItem":{"title":"Podman Desktop 1.29 Release","permalink":"/blog/podman-desktop-release-1.29"}}');

/***/ }

}]);