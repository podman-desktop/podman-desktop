"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[4024],{

/***/ 60752
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_extensions_developing_when_clause_context_md_d14_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-extensions-developing-when-clause-context-md-d14.json
const site_docs_extensions_developing_when_clause_context_md_d14_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"extensions/developing/when-clause-context","title":"When clause contexts","description":"Podman Desktop when clause contexts reference","source":"@site/docs/extensions/developing/when-clause-context.md","sourceDirName":"extensions/developing","slug":"/extensions/developing/when-clause-context","permalink":"/docs/extensions/developing/when-clause-context","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/extensions/developing/when-clause-context.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/docs/tags/extension"},{"inline":true,"label":"writing","permalink":"/docs/tags/writing"},{"inline":true,"label":"when clause","permalink":"/docs/tags/when-clause"}],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"title":"When clause contexts","description":"Podman Desktop when clause contexts reference","tags":["podman-desktop","extension","writing","when clause"],"keywords":["podman desktop","extension","writing","when clause"]},"sidebar":"mySidebar","previous":{"title":"Onboarding workflow","permalink":"/docs/extensions/developing/onboarding-workflow"},"next":{"title":"Adding icons","permalink":"/docs/extensions/developing/adding-icons"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/extensions/developing/when-clause-context.md


const frontMatter = {
	sidebar_position: 1,
	title: 'When clause contexts',
	description: 'Podman Desktop when clause contexts reference',
	tags: [
		'podman-desktop',
		'extension',
		'writing',
		'when clause'
	],
	keywords: [
		'podman desktop',
		'extension',
		'writing',
		'when clause'
	]
};
const contentTitle = 'When clause contexts';

const assets = {

};



const toc = [{
  "value": "Available context keys",
  "id": "available-context-keys",
  "level": 3
}, {
  "value": "Add a custom when clause context",
  "id": "add-a-custom-when-clause-context",
  "level": 3
}, {
  "value": "Conditional operators",
  "id": "conditional-operators",
  "level": 3
}, {
  "value": "Logical operators",
  "id": "logical-operators",
  "level": 4
}, {
  "value": "Equality operators",
  "id": "equality-operators",
  "level": 4
}, {
  "value": "Comparison operators",
  "id": "comparison-operators",
  "level": 4
}, {
  "value": "In and not in",
  "id": "in-and-not-in",
  "level": 4
}, {
  "value": "Match operator",
  "id": "match-operator",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h3: "h3",
    h4: "h4",
    header: "header",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "when-clause-contexts",
        children: "When clause contexts"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop uses when clauses to enable or disable extensions command and UI customizations, such as views."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["For example, the Kind extension adds a custom icon to a container that has a label equals to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "io.x-k8s.kind.cluster"
      }), " by using the following instruction."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "\"views\": {\n   \"icons/containersList\": [\n     {\n       \"when\": \"io.x-k8s.kind.cluster in containerLabelKeys\",\n       \"icon\": \"${kind-icon}\"\n     }\n   ]\n }\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["A when clause can consist of a context key (such as ", (0,jsx_runtime.jsx)(_components.code, {
        children: "isLinux"
      }), ") or complex expressions to define a specific state."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "available-context-keys",
      children: "Available context keys"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop has a set of context keys that are evaluated to Boolean true/false."
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Context key"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "True when"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.strong, {
              children: "Operating system contexts"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {})]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "isLinux"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "True when the OS is Linux."
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "isWindows"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "True when the OS is Windows."
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "isMac"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: "True when the OS is macOS."
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop also provides context keys that return values that can be used to create meaningful expressions"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Context key"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Value in it"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "containerLabelKeys"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["A list of all labels belonging to the current container. Example: ", (0,jsx_runtime.jsx)(_components.code, {
              children: "\"value in containerLabelKeys\""
            })]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "selectedImageId"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: ["The image id which the dashboard/image menu opened belong to. Example ", (0,jsx_runtime.jsx)(_components.code, {
              children: "\"selectedImageId in imagesPushInProgressToKind\""
            })]
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "add-a-custom-when-clause-context",
      children: "Add a custom when clause context"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["If you are creating your own extension and none of the existing keys suit your needs, you can set your own context key by calling the function ", (0,jsx_runtime.jsx)(_components.code, {
        children: "setValue(key: string, value: any, scope?: 'onboarding')"
      }), " provided by the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "context"
      }), " namespace in the Podman Desktop API."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The scope, if specified, triggers a custom behavior to avoid any type of collisions between different extensions for that specific scope. Podman Desktop is responsible for handling its state and cleans it accordingly when necessary."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If omitted, the key/value is set globally. For this reason it is recommended to use the extension id as part of the key to avoid unexpected collisions with other extensions."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The first example below sets the key ", (0,jsx_runtime.jsx)(_components.code, {
        children: "\"podmanIsInstalled\""
      }), " to true globally while the second example sets the key ", (0,jsx_runtime.jsx)(_components.code, {
        children: "\"toolInstalled\""
      }), " to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "oc.exe"
      }), " using the onboarding scope."]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-js",
        children: "extensionsAPI.context.setValue('podmanIsInstalled', true);\n\nextensionsAPI.context.setValue('toolInstalled', 'oc.exe', 'onboarding');\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["After setting the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "toolInstalled"
      }), " to ", (0,jsx_runtime.jsx)(_components.code, {
        children: "oc.exe"
      }), ", you could use this information in the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "when"
      }), " clause to enable something"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"when\": \"onboardingContext:toolInstalled == oc.exe\"\n}\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "conditional-operators",
      children: "Conditional operators"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To create ", (0,jsx_runtime.jsx)(_components.code, {
        children: "when"
      }), " clauses a bit more complex Podman Desktop offers a set of operators that can be combined with each other."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "logical-operators",
      children: "Logical operators"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Logical operators allow combining simple context keys or when-clause expressions that include other operators"
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Operator"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Symbol"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Example"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Not"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "!"
            })
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "!podmanIsInstalled"
            }), " or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "!(podmanIsInstalled && isWindows)"
            })]
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "And"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "&&"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "podmanIsInstalled && isWindows"
            })
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Or"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "||"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "isLinux || isWindows"
            })
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "equality-operators",
      children: "Equality operators"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Equality operators allow checking for equality of a context key's value against a specified value."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Note:"
      }), " the right side is a value and not considered as a context key, so no value is searched in the context. If it contains whitespaces, it must be wrapped in single-quotes (for example ", (0,jsx_runtime.jsx)(_components.code, {
        children: "'my tool.exe'"
      }), ")"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Operator"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Symbol"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Example"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Equality"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "=="
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "onboardingContext:toolInstalled == oc.exe"
            })
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Inequality"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "!="
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "onboardingContext:toolInstalled != oc.exe"
            })
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "comparison-operators",
      children: "Comparison operators"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Comparison operator allow comparing a context key's value against a number."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.strong, {
        children: "Note:"
      }), " the left and right side of the operator must be separated by whitespace - ", (0,jsx_runtime.jsx)(_components.code, {
        children: "bar < 2"
      }), ", but not ", (0,jsx_runtime.jsx)(_components.code, {
        children: "bar<2"
      })]
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Operator"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Symbol"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Example"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Greater than"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: ">"
            }), ", ", (0,jsx_runtime.jsx)(_components.code, {
              children: ">="
            })]
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "onboardingContext:toolInstalled > 2"
            })
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Less than"
          }), (0,jsx_runtime.jsxs)(_components.td, {
            children: [(0,jsx_runtime.jsx)(_components.code, {
              children: "<"
            }), ", ", (0,jsx_runtime.jsx)(_components.code, {
              children: "<="
            })]
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "onboardingContext:toolInstalled <= 3"
            })
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "in-and-not-in",
      children: "In and not in"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["The ", (0,jsx_runtime.jsx)(_components.code, {
        children: "in"
      }), "/", (0,jsx_runtime.jsx)(_components.code, {
        children: "not in"
      }), " operators allow checking if a value exists/not exists within the other. The right should be a context key, which value is retrieved in the context. The left can be a value or a context key."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Operator"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Symbol"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Example"
          })]
        })
      }), (0,jsx_runtime.jsxs)(_components.tbody, {
        children: [(0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "In"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "in"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "label in containerLabelKeys"
            })
          })]
        }), (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Not"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "not in"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "label not in containerLabelKeys"
            })
          })]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "match-operator",
      children: "Match operator"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "The match operator allow treating the right side item as a regular expression literal to match against the left side."
    }), "\n", (0,jsx_runtime.jsxs)(_components.table, {
      children: [(0,jsx_runtime.jsx)(_components.thead, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.th, {
            children: "Operator"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Symbol"
          }), (0,jsx_runtime.jsx)(_components.th, {
            children: "Example"
          })]
        })
      }), (0,jsx_runtime.jsx)(_components.tbody, {
        children: (0,jsx_runtime.jsxs)(_components.tr, {
          children: [(0,jsx_runtime.jsx)(_components.td, {
            children: "Matches"
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "=~"
            })
          }), (0,jsx_runtime.jsx)(_components.td, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              children: "label =~ /podman$/"
            })
          })]
        })
      })]
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