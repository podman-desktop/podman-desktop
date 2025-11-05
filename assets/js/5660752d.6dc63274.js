"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[62662],{

/***/ 24749:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_openshift_openshift_local_index_md_566_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-openshift-openshift-local-index-md-566.json
const site_docs_openshift_openshift_local_index_md_566_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"openshift/openshift-local/index","title":"OpenShift Local","description":"Creating an OpenShift Local instance","source":"@site/docs/openshift/openshift-local/index.md","sourceDirName":"openshift/openshift-local","slug":"/openshift/openshift-local/","permalink":"/docs/openshift/openshift-local/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/openshift/openshift-local/index.md","tags":[{"inline":true,"label":"migrating-to-kubernetes","permalink":"/docs/tags/migrating-to-kubernetes"},{"inline":true,"label":"openshift","permalink":"/docs/tags/openshift"}],"version":"current","sidebarPosition":102,"frontMatter":{"sidebar_position":102,"title":"OpenShift Local","description":"Creating an OpenShift Local instance","keywords":["podman desktop","podman","containers","pods","migrating","kubernetes","openshift"],"tags":["migrating-to-kubernetes","openshift"]},"sidebar":"mySidebar","previous":{"title":"Developer Sandbox","permalink":"/docs/openshift/developer-sandbox/"},"next":{"title":"MicroShift","permalink":"/docs/openshift/microshift/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js + 2 modules
var Tabs = __webpack_require__(78296);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js + 1 modules
var TabItem = __webpack_require__(22491);
;// ./docs/openshift/openshift-local/index.md


const frontMatter = {
	sidebar_position: 102,
	title: 'OpenShift Local',
	description: 'Creating an OpenShift Local instance',
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'pods',
		'migrating',
		'kubernetes',
		'openshift'
	],
	tags: [
		'migrating-to-kubernetes',
		'openshift'
	]
};
const contentTitle = 'Creating an OpenShift Local instance';

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
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "creating-an-openshift-local-instance",
        children: "Creating an OpenShift Local instance"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.a, {
        href: "https://developers.redhat.com/products/openshift-local/overview",
        children: "Red Hat OpenShift Local"
      }), " manages a minimal OpenShift or MicroShift cluster on your workstation for local development and testing."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "With Podman Desktop and the OpenShift Local extension, you can manage your OpenShift Local instances."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "https://developers.redhat.com/register",
          children: "Register a Red Hat account"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Install the ", (0,jsx_runtime.jsx)(_components.em, {
            children: "OpenShift Local"
          }), " extension: on to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), ", click ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: ["OpenShift Local ", (0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-download",
              size: "lg"
            })]
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Install the OpenShift Local binaries, when on the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), ", you see ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Podman Desktop was not able to find an installation of OpenShift Local"
          }), "."]
        }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
          groupId: "operating-systems",
          children: [(0,jsx_runtime.jsx)(TabItem/* default */.A, {
            value: "win",
            label: "Windows",
            children: (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "OpenShift Local"
                }), " tile, click ", (0,jsx_runtime.jsxs)(_components.strong, {
                  children: [(0,jsx_runtime.jsx)(Icon, {
                    icon: "fa-solid fa-rocket",
                    size: "lg"
                  }), " Install"]
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "When prerequisites are missing, follow the instructions."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Red Hat OpenShift Local"
                }), " screen, click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Yes"
                }), " to start the installation."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Follow the installation program instructions."
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Reboot to finalize system changes."
              }), "\n"]
            })
          }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
            value: "mac",
            label: "macOS",
            children: (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "OpenShift Local"
                }), " tile, click ", (0,jsx_runtime.jsxs)(_components.strong, {
                  children: [(0,jsx_runtime.jsx)(Icon, {
                    icon: "fa-solid fa-rocket",
                    size: "lg"
                  }), " Install"]
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "When prerequisites are missing, follow the instructions."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Red Hat OpenShift Local"
                }), " screen, click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Yes"
                }), " to start the installation."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Follow the installation program instructions."
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Reboot to finalize system changes."
              }), "\n"]
            })
          }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
            value: "linux",
            label: "Linux",
            children: [(0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Go to the ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://console.redhat.com/openshift/create/local",
                  children: "Red Hat OpenShift local download page"
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Select your platform."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Download OpenShift Local"
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Extract the archive."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Copy the ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "crc"
                }), " binary to a directory in your", (0,jsx_runtime.jsx)(_components.code, {
                  children: "$PATH"
                }), ", such as ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "/usr/local/bin"
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "To configure your system, run the command:"
              }), "\n"]
            }), (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ crc setup\n"
              })
            }), (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Exit and restart Podman Desktop."
              }), "\n"]
            })]
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["(Optionally) Review the extension settings in ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Preferences > Extension: Red Hat OpenShift Local"]
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), ", click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Initialize and start"
          }), "."]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Select your OpenShift Local Virtual machine preset, if not set in ", (0,jsx_runtime.jsxs)(_components.strong, {
              children: [(0,jsx_runtime.jsx)(Icon, {
                icon: "fa-solid fa-cog",
                size: "lg"
              }), " Settings > Preferences > Extension: Red Hat OpenShift Local > Preset"]
            }), ".", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.em, {
                  children: "MicroShift"
                }), " (experimental): provides a lightweight and optimized environment with a limited set of services."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.em, {
                  children: "OpenShift"
                }), ": provides a single node OpenShift cluster with a fuller set of services, including a web console (requires more resources)."]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Provide a pull secret, required to pull container images from the registry:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Open the ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://cloud.redhat.com/openshift/create/local",
                  children: "Red Hat OpenShift Local download page"
                }), "."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Copy pull secret"
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Get back to Podman Desktop."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Paste the pull secret, and press ", (0,jsx_runtime.jsx)(_components.code, {
                  children: "Enter"
                }), "."]
              }), "\n"]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), " screen, ", (0,jsx_runtime.jsx)(_components.em, {
            children: "OpenShift Local is running"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), "Settings > Resources"]
          }), " screen, your OpenShift Local instance is running."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Developer Sandbox is running",
            src: (__webpack_require__(77870)/* ["default"] */ .A) + "",
            width: "467",
            height: "182"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.a, {
            href: "/docs/kubernetes/viewing-and-selecting-current-kubernetes-context",
            children: "Select your OpenShift Local instance the Podman Desktop tray"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run basic tasks such as:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kubernetes/deploying-a-pod-to-kubernetes",
              children: "Deploying a container"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kubernetes/deploying-a-pod-to-kubernetes",
              children: "Deploying a pod"
            })
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "additional-resources",
      children: "Additional resources"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "https://github.com/crc-org/crc-extension",
          children: "Red Hat OpenShift Local extension repository"
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ }),

/***/ 22491:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TabItem)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tabItem":"tabItem_wHwb"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function TabItem({children,hidden,className}){return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{role:"tabpanel",className:(0,clsx/* default */.A)(styles_module.tabItem,className),hidden,children:children});}

/***/ }),

/***/ 78296:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Tabs)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(11750);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(53237);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/scrollUtils.js
var scrollUtils = __webpack_require__(90766);
// EXTERNAL MODULE: ../node_modules/react-router/esm/react-router.js
var react_router = __webpack_require__(49519);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useIsomorphicLayoutEffect.js
var useIsomorphicLayoutEffect = __webpack_require__(14395);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/historyUtils.js
var historyUtils = __webpack_require__(35043);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/jsUtils.js
var jsUtils = __webpack_require__(44544);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-common/lib/utils/storageUtils.js + 1 modules
var storageUtils = __webpack_require__(94243);
;// ../node_modules/@docusaurus/theme-common/lib/utils/tabsUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// A very rough duck type, but good enough to guard against mistakes while
// allowing customization
function isTabItem(comp){const{props}=comp;return!!props&&typeof props==='object'&&'value'in props;}function sanitizeTabsChildren(children){return react.Children.toArray(children).filter(child=>child!=='\n').map(child=>{if(!child||/*#__PURE__*/(0,react.isValidElement)(child)&&isTabItem(child)){return child;}// child.type.name will give non-sensical values in prod because of
// minification, but we assume it won't throw in prod.
throw new Error(`Docusaurus error: Bad <Tabs> child <${// @ts-expect-error: guarding against unexpected cases
typeof child.type==='string'?child.type:child.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`);})?.filter(Boolean)??[];}function extractChildrenTabValues(children){return sanitizeTabsChildren(children).map(({props:{value,label,attributes,default:isDefault}})=>({value,label,attributes,default:isDefault}));}function ensureNoDuplicateValue(values){const dup=(0,jsUtils/* duplicates */.XI)(values,(a,b)=>a.value===b.value);if(dup.length>0){throw new Error(`Docusaurus error: Duplicate values "${dup.map(a=>a.value).join(', ')}" found in <Tabs>. Every value needs to be unique.`);}}function useTabValues(props){const{values:valuesProp,children}=props;return (0,react.useMemo)(()=>{const values=valuesProp??extractChildrenTabValues(children);ensureNoDuplicateValue(values);return values;},[valuesProp,children]);}function isValidValue({value,tabValues}){return tabValues.some(a=>a.value===value);}function getInitialStateValue({defaultValue,tabValues}){if(tabValues.length===0){throw new Error('Docusaurus error: the <Tabs> component requires at least one <TabItem> children component');}if(defaultValue){// Warn user about passing incorrect defaultValue as prop.
if(!isValidValue({value:defaultValue,tabValues})){throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${defaultValue}" but none of its children has the corresponding value. Available values are: ${tabValues.map(a=>a.value).join(', ')}. If you intend to show no default tab, use defaultValue={null} instead.`);}return defaultValue;}const defaultTabValue=tabValues.find(tabValue=>tabValue.default)??tabValues[0];if(!defaultTabValue){throw new Error('Unexpected error: 0 tabValues');}return defaultTabValue.value;}function getStorageKey(groupId){if(!groupId){return null;}return`docusaurus.tab.${groupId}`;}function getQueryStringKey({queryString=false,groupId}){if(typeof queryString==='string'){return queryString;}if(queryString===false){return null;}if(queryString===true&&!groupId){throw new Error(`Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".`);}return groupId??null;}function useTabQueryString({queryString=false,groupId}){const history=(0,react_router/* useHistory */.W6)();const key=getQueryStringKey({queryString,groupId});const value=(0,historyUtils/* useQueryStringValue */.aZ)(key);const setValue=(0,react.useCallback)(newValue=>{if(!key){return;// no-op
}const searchParams=new URLSearchParams(history.location.search);searchParams.set(key,newValue);history.replace({...history.location,search:searchParams.toString()});},[key,history]);return[value,setValue];}function useTabStorage({groupId}){const key=getStorageKey(groupId);const[value,storageSlot]=(0,storageUtils/* useStorageSlot */.Dv)(key);const setValue=(0,react.useCallback)(newValue=>{if(!key){return;// no-op
}storageSlot.set(newValue);},[key,storageSlot]);return[value,setValue];}function useTabs(props){const{defaultValue,queryString=false,groupId}=props;const tabValues=useTabValues(props);const[selectedValue,setSelectedValue]=(0,react.useState)(()=>getInitialStateValue({defaultValue,tabValues}));const[queryStringValue,setQueryString]=useTabQueryString({queryString,groupId});const[storageValue,setStorageValue]=useTabStorage({groupId});// We sync valid querystring/storage value to state on change + hydration
const valueToSync=(()=>{const value=queryStringValue??storageValue;if(!isValidValue({value,tabValues})){return null;}return value;})();// Sync in a layout/sync effect is important, for useScrollPositionBlocker
// See https://github.com/facebook/docusaurus/issues/8625
(0,useIsomorphicLayoutEffect/* default */.A)(()=>{if(valueToSync){setSelectedValue(valueToSync);}},[valueToSync]);const selectValue=(0,react.useCallback)(newValue=>{if(!isValidValue({value:newValue,tabValues})){throw new Error(`Can't select invalid tab value=${newValue}`);}setSelectedValue(newValue);setQueryString(newValue);setStorageValue(newValue);},[setQueryString,setStorageValue,tabValues]);return{selectedValue,selectValue,tabValues};}
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useIsBrowser.js
var useIsBrowser = __webpack_require__(86681);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tabList":"tabList_J5MA","tabItem":"tabItem_l0OV"});
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function TabList({className,block,selectedValue,selectValue,tabValues}){const tabRefs=[];const{blockElementScrollPositionUntilNextRender}=(0,scrollUtils/* useScrollPositionBlocker */.a_)();const handleTabChange=event=>{const newTab=event.currentTarget;const newTabIndex=tabRefs.indexOf(newTab);const newTabValue=tabValues[newTabIndex].value;if(newTabValue!==selectedValue){blockElementScrollPositionUntilNextRender(newTab);selectValue(newTabValue);}};const handleKeydown=event=>{let focusElement=null;switch(event.key){case'Enter':{handleTabChange(event);break;}case'ArrowRight':{const nextTab=tabRefs.indexOf(event.currentTarget)+1;focusElement=tabRefs[nextTab]??tabRefs[0];break;}case'ArrowLeft':{const prevTab=tabRefs.indexOf(event.currentTarget)-1;focusElement=tabRefs[prevTab]??tabRefs[tabRefs.length-1];break;}default:break;}focusElement?.focus();};return/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,clsx/* default */.A)('tabs',{'tabs--block':block},className),children:tabValues.map(({value,label,attributes})=>/*#__PURE__*/(0,jsx_runtime.jsx)("li",{// TODO extract TabListItem
role:"tab",tabIndex:selectedValue===value?0:-1,"aria-selected":selectedValue===value,ref:tabControl=>{tabRefs.push(tabControl);},onKeyDown:handleKeydown,onClick:handleTabChange,...attributes,className:(0,clsx/* default */.A)('tabs__item',styles_module.tabItem,attributes?.className,{'tabs__item--active':selectedValue===value}),children:label??value},value))});}function TabContent({lazy,children,selectedValue}){const childTabs=(Array.isArray(children)?children:[children]).filter(Boolean);if(lazy){const selectedTabItem=childTabs.find(tabItem=>tabItem.props.value===selectedValue);if(!selectedTabItem){// fail-safe or fail-fast? not sure what's best here
return null;}return/*#__PURE__*/(0,react.cloneElement)(selectedTabItem,{className:(0,clsx/* default */.A)('margin-top--md',selectedTabItem.props.className)});}return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"margin-top--md",children:childTabs.map((tabItem,i)=>/*#__PURE__*/(0,react.cloneElement)(tabItem,{key:i,hidden:tabItem.props.value!==selectedValue}))});}function TabsComponent(props){const tabs=useTabs(props);return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.tabs.container,// former name kept for backward compatibility
// see https://github.com/facebook/docusaurus/pull/4086
'tabs-container',styles_module.tabList),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(TabList,{...tabs,...props}),/*#__PURE__*/(0,jsx_runtime.jsx)(TabContent,{...tabs,...props})]});}function Tabs(props){const isBrowser=(0,useIsBrowser/* default */.A)();return/*#__PURE__*/(0,jsx_runtime.jsx)(TabsComponent// Remount tabs after hydration
// Temporary fix for https://github.com/facebook/docusaurus/issues/5653
,{...props,children:sanitizeTabsChildren(props.children)},String(isBrowser));}

/***/ }),

/***/ 77870:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/resources-openshift-local-running-1eea98ac12a94cb97437a2e74046ee6a.png");

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