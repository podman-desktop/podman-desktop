"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[78465],{

/***/ 31135:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_11_03_release_1_5_md_a00_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_11_03_release_1_5_md_a00_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(69140);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);
/* harmony import */ var react_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(70305);


const frontMatter = {
	title: 'Podman Desktop 1.5 Release',
	description: 'Podman Desktop 1.5 has been released!',
	slug: 'podman-desktop-release-1.5',
	authors: 'duffy',
	tags: [
		'podman-desktop',
		'release',
		'kubernetes',
		'openshift',
		'onboarding',
		'compose',
		'extensions',
		'settings'
	],
	hide_table_of_contents: false,
	image: '/img/blog/podman-desktop-release-1.5/onboarding-selkies.png'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};




const toc = [{
  "value": "Release Details",
  "id": "release-details",
  "level": 2
}, {
  "value": "Onboarding",
  "id": "onboarding",
  "level": 3
}, {
  "value": "Command Palette",
  "id": "command-palette",
  "level": 3
}, {
  "value": "Expanded &quot;Summary&quot; tab for Kubernetes pods",
  "id": "expanded-summary-tab-for-kubernetes-pods",
  "level": 3
}, {
  "value": "Environment file support",
  "id": "environment-file-support",
  "level": 3
}, {
  "value": "Enhancements to the Settings area",
  "id": "enhancements-to-the-settings-area",
  "level": 3
}, {
  "value": "Improved user experience for state changes",
  "id": "improved-user-experience-for-state-changes",
  "level": 3
}, {
  "value": "Extension API improvements",
  "id": "extension-api-improvements",
  "level": 3
}, {
  "value": "Other Notable Enhancements",
  "id": "other-notable-enhancements",
  "level": 2
}, {
  "value": "Notable Bug Fixes",
  "id": "notable-bug-fixes",
  "level": 2
}, {
  "value": "Community Thank You",
  "id": "community-thank-you",
  "level": 2
}, {
  "value": "Final notes",
  "id": "final-notes",
  "level": 2
}, {
  "value": "Known Issues",
  "id": "known-issues",
  "level": 3
}, {
  "value": "Known Issues: Podman Desktop 1.5.2",
  "id": "known-issues-podman-desktop-152",
  "level": 4
}, {
  "value": "Fixed Issues",
  "id": "fixed-issues",
  "level": 3
}, {
  "value": "Where to Download",
  "id": "where-to-download",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    hr: "hr",
    img: "img",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman Desktop 1.5 Release! 🎉"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["With this release of Podman Desktop, we're introducing ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "a new onboarding feature"
      }), " that we hope will earn your 🦭 seal of approval! But wait... there's so much more!"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Onboarding"
        }), ": Guided setup and configuration of ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Podman"
        }), " and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Compose"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Podman 4.7.2"
        }), ": ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman/releases",
          children: "Podman 4.7.2"
        }), " is now included in Windows and Mac installers"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Command Palette"
        }), ": Gain easy access to various commands via a new keyboard-driven command palette"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Expanded \"Summary\" tab for Kubernetes pods"
        }), ": Go deep with extended details on Kubernetes pods in the pod \"Summary\" tab"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Environment file support"
        }), ": Chart out environment variables for new containers to access on creation"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Enhancements to the Settings area"
        }), ": Get your bearings with improved Docker compatibility mode controls"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Improved user experience for state changes"
        }), ": No more dead reckoning on container state with improved visual indication of status"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Extension API improvements"
        }), ": A boatload of improvements to the extension API enabling more goodness from 🦭 Podman Desktop's extensions"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop 1.5 is now available. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/downloads",
        children: "Click here to download it"
      }), "!"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Podman-desktop-1-5-hero",
        src: (__webpack_require__(55693)/* ["default"] */ .A) + "",
        width: "1920",
        height: "1080"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "release-details",
      children: "Release Details"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "onboarding",
      children: "Onboarding"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We are introducing a new feature providing guided flows for the initial setup of specific 🦭 Podman Desktop extensions. Release 1.5 features two new onboarding flows: Podman and Compose."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["To start the Podman onboarding flow, you can start from the dashboard notification by clicking the \"Set up\" button:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/799683/280362279-598cc052-5ea4-4c31-849c-da9bbbcc3e42.png",
        alt: "podman-onboarding-start"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/799683/280363859-f35b85f8-1dd4-4b7f-a995-25fe5d1ccced.png",
        alt: "podman-onboarding"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Visit ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.strong, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Icon, {
          icon: "fa-solid fa-cog",
          size: "lg"
        }), "Settings > Resources"]
      }), " screen and click the Compose \"Setup ...\" button in order to start Compose onboarding:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/799683/280276847-ca0558ab-70ad-48cc-8dd5-67e3eb465a62.png",
        alt: "compose-onboarding-start"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/799683/280277936-77ba0fb2-5cb0-41de-a7cf-1a3d6400fd89.png",
        alt: "compose-onboarding"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "command-palette",
      children: "Command Palette"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["A new, search-driven command palette is now available to enable quick access to various commands available across 🦭 Podman Desktop. You can try this new tool out by hitting the F1 key. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/4081",
        children: "#4081"
      }), " && ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/3979",
        children: "#3979"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/270362431-5aaa6a1b-6df5-4b66-a811-cdd148d02ad6.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "expanded-summary-tab-for-kubernetes-pods",
      children: "Expanded \"Summary\" tab for Kubernetes pods"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Kubernetes pods now offer a more comprehensive set of information under the \"Summary\" tab, including networking, volumes, environment variables, and other key metadata."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/6422176/272972815-bed96f3a-6b13-45d3-a13b-74eacb27a4cd.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "environment-file-support",
      children: "Environment file support"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["When creating a container from the Images list, there's now an option to provide an environment file to set env variables for the new container. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/4026",
        children: "#4026"
      }), " && ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/4025",
        children: "#4025"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "enhancements-to-the-settings-area",
      children: "Enhancements to the Settings area"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The user experience for enabling or disabling Docker compatibility is improved, with a new entry in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.strong, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Icon, {
          icon: "fa-solid fa-cog",
          size: "lg"
        }), "Settings > Preferences"]
      }), " screen that includes contextual guidance. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/4093",
        children: "#4093"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/6422176/270497318-902b2566-62ad-4ee6-87af-6a9a2705de99.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "improved-user-experience-for-state-changes",
      children: "Improved user experience for state changes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The user experience around state changes for containers, pods, and other objects in the UI is improved, with clear status messages and improved animated visual indicator of state changes. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/4056",
        children: "#4056"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/19958075/270027524-f5176cf9-462f-4024-920a-b4a906c7d30d.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/19958075/270027533-70e152ec-5bbf-45ad-9f1d-563752464655.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "extension-api-improvements",
      children: "Extension API improvements"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The 🦭 Podman Desktop extension API received many improvements, including:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["In addition to pushing and listing image from an extension, it's now possible to pull images from a 🦭 Podman Desktop extension ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4155",
            children: "#4155"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The 🦭 Podman Desktop extension API has been enhanced with both the ability to list images & networks and the ability to create containers & networks. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4172",
            children: "#4172"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["🦭 Podman Desktop extensions now have a consistent way to run administrative tasks. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4049",
            children: "#4049"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Extensions now have the ability to register a custom Kubernetes config generator. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3970",
            children: "#3970"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The ability of extensions to add commands to UI menus has been extended; previously for action menus it was only available in the Image list screen. It is now possible for extensions to add commands to the action menus of items listed on the Containers list screen as well. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3947",
            children: "#3947"
          }), " & ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3963",
            children: "#3963"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Extensions have gained the ability to contribute menu items in the UI based on specific conditions. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3959",
            children: "#3959"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Enhanced logic for displaying or hiding properties listed under the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.strong, {
            children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), "Settings > Preferences"]
          }), " screens is now available. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4159",
            children: "#4159"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/6422176/271650937-3991565c-12a4-4e6c-a315-9343bfa25f65.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "other-notable-enhancements",
      children: "Other Notable Enhancements"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["The progress of loading an image into Kind is now visible as a task in the task manager. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/4061",
          children: "#4061"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/42176370/270154775-eb7007b4-fd0e-4287-be9e-40ffc412de35.png",
        alt: "kind-progress-task"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["It's now possible to start a new Podman machine right after creation, or you can create it and wait to start it later. It's up to you! ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/4046",
          children: "#4046"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/49404737/269941187-f4768833-ecfc-4d0b-8acf-d4afedb428d9.png",
        alt: "podman-start-now-or-later"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["The Podman machine and Kubernetes provider creation forms have an updated look & feel consisted with other forms in the user interface, along with minor bug fixes. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/4317",
          children: "#4317"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/19958075/274694157-fe89f3bc-e5b8-4735-96e9-669fe52c7a41.png",
        alt: "Updated provider creation forms"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["The empty screen message shown when a search filter results in no matches now provides a message specific to filter matching, including the specific filter terms and an explicit button for clearing the filter. Previously, the screen displayed a generic message about how to create new objects of the type displayed on the screen, which led to some confusion about the status of the system. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/3988",
          children: "#3988"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/19958075/269291090-13e724f7-252f-4915-bb04-00665001d21d.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["New support for adding spin animations to icons is now available. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4188",
            children: "#4188"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["There is a new indeterminate progress bar type available for the task manager; this is meant for providing limited status for actions whose APIs do not provide detailed status information. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4016",
            children: "#4016"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["For authenticating as admin to perform administrative tasks, 🦭 Podman Desktop now provides touchID support for macOS. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4050",
            children: "#4050"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/436777/248588015-f08115bd-d211-43ad-bddd-286d7b3a7056.png",
        alt: "touchID-support"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/269859758-47581e2b-8469-4e9c-822c-f4fddf46684d.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Support for connecting to interactive terminals for containers via tty was added. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3900",
            children: "#3900"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["It's now more clear which container/pod providers will autostart when 🦭 Podman Desktop starts. Previously autostart had both a global and a per-provider setting. It has been simplified by removing the global setting. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3840",
            children: "#3840"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The \"Working with containers\" section of the documentation has been reworked and improved. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3951",
            children: "#3951"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "notable-bug-fixes",
      children: "Notable Bug Fixes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The disable registry command was not blocking subsequent pulls from disabled registries. This has been corrected. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4183",
            children: "#4183"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Some users behind network proxies were unable to complete workflow involving the download of online resources. The mechanism for fetching these resources has been fixed to be proxy compatible to address this issue. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3994",
            children: "#3994"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The status of pods running in Kubernetes that are undergoing the deletion process is now accurately reflected in the 🦭 Podman Desktop UI. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3877",
            children: "#3877"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The image details page always listed the image as being \"not used\" even when it was. This has been corrected. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3985",
            children: "#3985"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Previously, deleting a specific image tag would cause all tags with the same Image ID to be deleted. This has been fixed so only the selected image tag will be deleted. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3837",
            children: "#3837"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Could not view the pod details for some remote Kubernetes cluster pods due to an encoding error. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4371",
            children: "#4371"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Error logs were being tracked separately from the actions they applied to. This has been addressed for kind cluster creation failure ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4427",
            children: "#4427"
          }), " and Compose installation failure ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4407",
            children: "#4407"
          }), "."]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["For Linux users, 🦭 Podman Desktop previously did not appear under the \"Development\" menu when installed via Flatpak; it appeared under \"Utilities.\" 🦭 Podman Desktop now appears under the \"Development\" menu. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3911",
            children: "#3911"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Podman Machine names are no longer prefixed with the \"Podman Machine\" string. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3878",
            children: "#3878"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/19958075/267378447-aafdfbd7-f005-4b94-8626-9e11eec61b95.png",
        alt: "touchID-support"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The initial action state of pods and containers was being displayed as \"STARTING\" regardless of actual state; this has been corrected. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3889",
            children: "#3889"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["Resizing the application window no longer makes the last lines of a container's terminal invisible. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3993",
            children: "#3993"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["An issue with incorrect terminal behavior in response to long lines in the terminal attached to a container has been resolved. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3955",
            children: "#3955"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["A spacing issue on the run image form has been corrected. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4089",
            children: "#4089"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["The \"podify\" icon & button on the Containers list was unusually large in release 1.4. That regression has been corrected in this release. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4122",
            children: "#4122"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["An error in the instructions for Windows users on migrating from Docker has been corrected. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4157",
            children: "#4157"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "community-thank-you",
      children: "Community Thank You"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "🎉 We’d like to say a big thank you to everyone who helped to make 🦭 Podman Desktop even better. In this\nrelease we received pull requests from the following people:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/afbjorklund",
            children: "afbjorklund"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4373",
            children: "#4373 - docs: fix broken links and add lima onboarding"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4372",
            children: "#4372 - docs: clear up lima column on containers page"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4091",
            children: "#4091 - fix: avoid errors with unexpected JSON input"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4098",
            children: "#4098 - docs: Lima onboarding details"
          }), ", and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3854",
            children: "#3854 - fix: check if machine init rootful flag supported"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/axel7083",
            children: "axel7083"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4061",
            children: "#4061 - feat: adding task progress for kind"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3970",
            children: "#3970 - feat: extension can register custom kube generator"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3959",
            children: "#3959 - feat: add when property to extensions menus"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4016",
            children: "#4016 - feat: indeterminate progress bar"
          }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3963",
            children: "#3963 - fix: ContainerList propagating containers in ComposeActions and PodActions"
          }), ", and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/3947",
            children: "#3947 - feat: extend menus capabilities"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/ayushrakesh",
            children: "ayushrakesh"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4415#",
            children: "#4415 - Update README.md"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/eltociear",
            children: "eltociear"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4194",
            children: "#4194 - Update README.md"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/foxydevloper",
            children: "foxydeveloper"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4157",
            children: "#4157 - docs: Correct windows instructions for migrating from docker"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/harsh-solanki21",
            children: "harsh-solanki21"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4162",
            children: "#4162 - fix: Removed fullstop from summary"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/rahul0x00",
            children: "rahul0x00"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4240",
            children: "#4240 - fix typos in README.md"
          })]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/shelar1423",
            children: "shelar1423"
          }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
            href: "https://github.com/containers/podman-desktop/pull/4221",
            children: "#4221 - chore: document property setting in EXTENSIONS.md"
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "final-notes",
      children: "Final notes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "known-issues",
      children: "Known Issues"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We have a discussion board topic where we have posted known issues with this release. If you run into problems, please check this list before filing a bug - if we already have an issue open for it, it saves you the time and trouble of filing, and there may be a workaround posted in the issue."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h4, {
      id: "known-issues-podman-desktop-152",
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/discussions/4635",
        children: "Known Issues: Podman Desktop 1.5.2"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "fixed-issues",
      children: "Fixed Issues"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The complete list of issues fixed in this release is available ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/issues?q=is%3Aclosed+milestone%3A1.5.0",
        children: "here"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "where-to-download",
      children: "Where to Download"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Get the latest release from the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/downloads",
        children: "Downloads"
      }), " section of the website and boost your development journey with Podman Desktop. Additionally, visit the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop",
        children: "GitHub repository"
      }), " and see how you can help us make Podman Desktop better."]
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ }),

/***/ 55693:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/onboarding-selkies-3ddb7cb6ee2cf9abed002b01f63b1822.png");

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


/***/ }),

/***/ 70305:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ src_default)
});

// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
;// ../node_modules/react-player/dist/patterns.js
const AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i;
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
const MATCH_URL_MUX = /stream\.mux\.com\/(?!\w+\.m3u8)(\w+)/;
const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/;
const MATCH_URL_WISTIA = /(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/;
const MATCH_URL_SPOTIFY = /open\.spotify\.com\/(\w+)\/(\w+)/i;
const MATCH_URL_TWITCH = /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+|(videos?\/|\?video=)\d+)($|\?)/;
const MATCH_URL_TIKTOK = /tiktok\.com\/(?:player\/v1\/|share\/video\/|@[^/]+\/video\/)([0-9]+)/;
const canPlayFile = (url, test) => {
  if (Array.isArray(url)) {
    for (const item of url) {
      if (typeof item === "string" && canPlayFile(item, test)) {
        return true;
      }
      if (canPlayFile(item.src, test)) {
        return true;
      }
    }
    return false;
  }
  return test(url);
};
const canPlay = {
  html: (url) => canPlayFile(url, (u) => AUDIO_EXTENSIONS.test(u) || VIDEO_EXTENSIONS.test(u)),
  hls: (url) => canPlayFile(url, (u) => HLS_EXTENSIONS.test(u)),
  dash: (url) => canPlayFile(url, (u) => DASH_EXTENSIONS.test(u)),
  mux: (url) => MATCH_URL_MUX.test(url),
  youtube: (url) => MATCH_URL_YOUTUBE.test(url),
  vimeo: (url) => MATCH_URL_VIMEO.test(url) && !VIDEO_EXTENSIONS.test(url) && !HLS_EXTENSIONS.test(url),
  wistia: (url) => MATCH_URL_WISTIA.test(url),
  spotify: (url) => MATCH_URL_SPOTIFY.test(url),
  twitch: (url) => MATCH_URL_TWITCH.test(url),
  tiktok: (url) => MATCH_URL_TIKTOK.test(url)
};


;// ../node_modules/react-player/dist/HtmlPlayer.js


const HtmlPlayer = react.forwardRef((props, ref) => {
  const Media = AUDIO_EXTENSIONS.test(`${props.src}`) ? "audio" : "video";
  return /* @__PURE__ */ react.createElement(Media, { ...props, ref }, props.children);
});
var HtmlPlayer_default = HtmlPlayer;


;// ../node_modules/react-player/dist/players.js



const Players = [
  {
    key: "hls",
    name: "hls.js",
    canPlay: canPlay.hls,
    canEnablePIP: () => true,
    player: (0,react.lazy)(
      () => Promise.all(/* import() | reactPlayerHls */[__webpack_require__.e(8555), __webpack_require__.e(77771), __webpack_require__.e(32262)]).then(__webpack_require__.bind(__webpack_require__, 39895))
    )
  },
  {
    key: "dash",
    name: "dash.js",
    canPlay: canPlay.dash,
    canEnablePIP: () => true,
    player: (0,react.lazy)(
      () => Promise.all(/* import() | reactPlayerDash */[__webpack_require__.e(8555), __webpack_require__.e(6395)]).then(__webpack_require__.bind(__webpack_require__, 20090))
    )
  },
  {
    key: "mux",
    name: "Mux",
    canPlay: canPlay.mux,
    canEnablePIP: () => true,
    player: (0,react.lazy)(
      () => Promise.all(/* import() | reactPlayerMux */[__webpack_require__.e(8555), __webpack_require__.e(77771), __webpack_require__.e(52723)]).then(__webpack_require__.bind(__webpack_require__, 74139))
    )
  },
  {
    key: "youtube",
    name: "YouTube",
    canPlay: canPlay.youtube,
    player: (0,react.lazy)(
      () => __webpack_require__.e(/* import() | reactPlayerYouTube */ 18446).then(__webpack_require__.bind(__webpack_require__, 2648))
    )
  },
  {
    key: "vimeo",
    name: "Vimeo",
    canPlay: canPlay.vimeo,
    player: (0,react.lazy)(
      () => __webpack_require__.e(/* import() | reactPlayerVimeo */ 26173).then(__webpack_require__.bind(__webpack_require__, 91740))
    )
  },
  {
    key: "wistia",
    name: "Wistia",
    canPlay: canPlay.wistia,
    canEnablePIP: () => true,
    player: (0,react.lazy)(
      () => __webpack_require__.e(/* import() | reactPlayerWistia */ 99340).then(__webpack_require__.bind(__webpack_require__, 78733))
    )
  },
  {
    key: "spotify",
    name: "Spotify",
    canPlay: canPlay.spotify,
    canEnablePIP: () => false,
    player: (0,react.lazy)(
      () => __webpack_require__.e(/* import() | reactPlayerSpotify */ 32771).then(__webpack_require__.bind(__webpack_require__, 13408))
    )
  },
  {
    key: "twitch",
    name: "Twitch",
    canPlay: canPlay.twitch,
    canEnablePIP: () => false,
    player: (0,react.lazy)(
      () => __webpack_require__.e(/* import() | reactPlayerTwitch */ 12042).then(__webpack_require__.bind(__webpack_require__, 44028))
    )
  },
  {
    key: "tiktok",
    name: "TikTok",
    canPlay: canPlay.tiktok,
    canEnablePIP: () => false,
    player: (0,react.lazy)(
      () => __webpack_require__.e(/* import() | reactPlayerTiktok */ 58085).then(__webpack_require__.bind(__webpack_require__, 30675))
    )
  },
  {
    key: "html",
    name: "html",
    canPlay: canPlay.html,
    canEnablePIP: () => true,
    player: HtmlPlayer_default
  }
];
var players_default = Players;


;// ../node_modules/react-player/dist/props.js
const defaultProps = {
  // Falsy values don't need to be defined
  //
  // native video attrs
  // src: undefined,
  // preload: undefined,
  // crossOrigin: undefined,
  // autoPlay: false,
  // muted: false,
  // loop: false,
  // controls: false,
  // playsInline: false,
  // disableRemotePlayback: false,
  width: "320px",
  height: "180px",
  // native video props
  volume: 1,
  playbackRate: 1,
  // custom props
  // playing: undefined,
  // pip: false,
  // light: false,
  // fallback: null,
  previewTabIndex: 0,
  previewAriaLabel: "",
  oEmbedUrl: "https://noembed.com/embed?url={url}"
};


;// ../node_modules/react-player/dist/Player.js

const Player = react.forwardRef((props, ref) => {
  const { playing, pip } = props;
  const Player2 = props.activePlayer;
  const playerRef = (0,react.useRef)(null);
  const startOnPlayRef = (0,react.useRef)(true);
  (0,react.useEffect)(() => {
    var _a, _b;
    if (!playerRef.current) return;
    if (playerRef.current.paused && playing === true) {
      playerRef.current.play();
    }
    if (!playerRef.current.paused && playing === false) {
      playerRef.current.pause();
    }
    playerRef.current.playbackRate = (_a = props.playbackRate) != null ? _a : 1;
    playerRef.current.volume = (_b = props.volume) != null ? _b : 1;
  });
  (0,react.useEffect)(() => {
    var _a, _b, _c, _d, _e;
    if (!playerRef.current || !globalThis.document) return;
    if (pip && !document.pictureInPictureElement) {
      try {
        (_b = (_a = playerRef.current).requestPictureInPicture) == null ? void 0 : _b.call(_a);
      } catch (err) {
      }
    }
    if (!pip && document.pictureInPictureElement) {
      try {
        (_d = (_c = playerRef.current).exitPictureInPicture) == null ? void 0 : _d.call(_c);
        (_e = document.exitPictureInPicture) == null ? void 0 : _e.call(document);
      } catch (err) {
      }
    }
  }, [pip]);
  const handleLoadStart = (event) => {
    var _a, _b;
    startOnPlayRef.current = true;
    (_a = props.onReady) == null ? void 0 : _a.call(props);
    (_b = props.onLoadStart) == null ? void 0 : _b.call(props, event);
  };
  const handlePlay = (event) => {
    var _a, _b;
    if (startOnPlayRef.current) {
      startOnPlayRef.current = false;
      (_a = props.onStart) == null ? void 0 : _a.call(props, event);
    }
    (_b = props.onPlay) == null ? void 0 : _b.call(props, event);
  };
  if (!Player2) {
    return null;
  }
  const eventProps = {};
  const reactPlayerEventHandlers = ["onReady", "onStart"];
  for (const key in props) {
    if (key.startsWith("on") && !reactPlayerEventHandlers.includes(key)) {
      eventProps[key] = props[key];
    }
  }
  return /* @__PURE__ */ react.createElement(
    Player2,
    {
      ...eventProps,
      style: props.style,
      className: props.className,
      slot: props.slot,
      ref: (0,react.useCallback)(
        (node) => {
          playerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref !== null) {
            ref.current = node;
          }
        },
        [ref]
      ),
      src: props.src,
      crossOrigin: props.crossOrigin,
      preload: props.preload,
      controls: props.controls,
      muted: props.muted,
      autoPlay: props.autoPlay,
      loop: props.loop,
      playsInline: props.playsInline,
      disableRemotePlayback: props.disableRemotePlayback,
      config: props.config,
      onLoadStart: handleLoadStart,
      onPlay: handlePlay
    },
    props.children
  );
});
Player.displayName = "Player";
var Player_default = Player;


;// ../node_modules/react-player/dist/ReactPlayer.js



const Preview = (0,react.lazy)(() => __webpack_require__.e(/* import() | reactPlayerPreview */ 36353).then(__webpack_require__.bind(__webpack_require__, 81910)));
const customPlayers = [];
const createReactPlayer = (players, playerFallback) => {
  const getActivePlayer = (src) => {
    for (const player of [...customPlayers, ...players]) {
      if (src && player.canPlay(src)) {
        return player;
      }
    }
    if (playerFallback) {
      return playerFallback;
    }
    return null;
  };
  const ReactPlayer = react.forwardRef((_props, ref) => {
    const props = { ...defaultProps, ..._props };
    const { src, slot, className, style, width, height, fallback, wrapper } = props;
    const [showPreview, setShowPreview] = (0,react.useState)(!!props.light);
    (0,react.useEffect)(() => {
      if (props.light) {
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    }, [props.light]);
    const handleClickPreview = (e) => {
      var _a;
      setShowPreview(false);
      (_a = props.onClickPreview) == null ? void 0 : _a.call(props, e);
    };
    const renderPreview = (src2) => {
      if (!src2) return null;
      const { light, playIcon, previewTabIndex, oEmbedUrl, previewAriaLabel } = props;
      return /* @__PURE__ */ react.createElement(
        Preview,
        {
          src: src2,
          light,
          playIcon,
          previewTabIndex,
          previewAriaLabel,
          oEmbedUrl,
          onClickPreview: handleClickPreview
        }
      );
    };
    const renderActivePlayer = (src2) => {
      var _a, _b;
      const player = getActivePlayer(src2);
      if (!player) return null;
      const { style: style2, width: width2, height: height2, wrapper: wrapper2 } = props;
      const config = (_a = props.config) == null ? void 0 : _a[player.key];
      return /* @__PURE__ */ react.createElement(
        Player_default,
        {
          ...props,
          ref,
          activePlayer: (_b = player.player) != null ? _b : player,
          slot: wrapper2 ? void 0 : slot,
          className: wrapper2 ? void 0 : className,
          style: wrapper2 ? { display: "block", width: "100%", height: "100%" } : { display: "block", width: width2, height: height2, ...style2 },
          config
        }
      );
    };
    const Wrapper = wrapper == null ? ForwardChildren : wrapper;
    const UniversalSuspense = fallback === false ? ForwardChildren : react.Suspense;
    return /* @__PURE__ */ react.createElement(Wrapper, { slot, className, style: { width, height, ...style } }, /* @__PURE__ */ react.createElement(UniversalSuspense, { fallback }, showPreview ? renderPreview(src) : renderActivePlayer(src)));
  });
  ReactPlayer.displayName = "ReactPlayer";
  ReactPlayer.addCustomPlayer = (player) => {
    customPlayers.push(player);
  };
  ReactPlayer.removeCustomPlayers = () => {
    customPlayers.length = 0;
  };
  ReactPlayer.canPlay = (src) => {
    if (src) {
      for (const Player2 of [...customPlayers, ...players]) {
        if (Player2.canPlay(src)) {
          return true;
        }
      }
    }
    return false;
  };
  ReactPlayer.canEnablePIP = (src) => {
    var _a;
    if (src) {
      for (const Player2 of [...customPlayers, ...players]) {
        if (Player2.canPlay(src) && ((_a = Player2.canEnablePIP) == null ? void 0 : _a.call(Player2))) {
          return true;
        }
      }
    }
    return false;
  };
  return ReactPlayer;
};
const ForwardChildren = ({ children }) => children;


;// ../node_modules/react-player/dist/index.js
"use client";


const fallback = players_default[players_default.length - 1];
var src_default = createReactPlayer(players_default, fallback);



/***/ }),

/***/ 69140:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/podman-desktop-release-1.5","source":"@site/blog/2023-11-03-release-1.5.md","title":"Podman Desktop 1.5 Release","description":"Podman Desktop 1.5 has been released!","date":"2023-11-03T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"release","permalink":"/blog/tags/release"},{"inline":true,"label":"kubernetes","permalink":"/blog/tags/kubernetes"},{"inline":true,"label":"openshift","permalink":"/blog/tags/openshift"},{"inline":true,"label":"onboarding","permalink":"/blog/tags/onboarding"},{"inline":true,"label":"compose","permalink":"/blog/tags/compose"},{"inline":true,"label":"extensions","permalink":"/blog/tags/extensions"},{"inline":true,"label":"settings","permalink":"/blog/tags/settings"}],"readingTime":11.09,"hasTruncateMarker":false,"authors":[{"name":"Máirín Duffy","title":"User Experience Designer","url":"https://github.com/mairin","imageURL":"https://github.com/mairin.png","key":"duffy","page":null}],"frontMatter":{"title":"Podman Desktop 1.5 Release","description":"Podman Desktop 1.5 has been released!","slug":"podman-desktop-release-1.5","authors":"duffy","tags":["podman-desktop","release","kubernetes","openshift","onboarding","compose","extensions","settings"],"hide_table_of_contents":false,"image":"/img/blog/podman-desktop-release-1.5/onboarding-selkies.png"},"unlisted":false,"prevItem":{"title":"Share your local podman images with the Kubernetes cluster","permalink":"/blog/sharing-podman-images-with-kubernetes-cluster"},"nextItem":{"title":"Podman Desktop 1.4 Release","permalink":"/blog/podman-desktop-release-1.4"}}');

/***/ })

}]);