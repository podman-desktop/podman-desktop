"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[23512],{

/***/ 4210:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_03_29_release_0_13_md_006_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_03_29_release_0_13_md_006_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57624);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);
/* harmony import */ var react_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(70305);


const frontMatter = {
	title: 'Release Notes - Podman Desktop 0.13',
	description: 'Podman Desktop 0.13 has been released!',
	slug: 'podman-desktop-release-0.13',
	authors: [
		'deboer'
	],
	tags: [
		'podman-desktop',
		'release',
		'kubernetes',
		'compose'
	],
	hide_table_of_contents: false
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};




const toc = [{
  "value": "Release details",
  "id": "release-details",
  "level": 2
}, {
  "value": "Update to Podman v4.4.4",
  "id": "update-to-podman-v444",
  "level": 3
}, {
  "value": "Compose support",
  "id": "compose-support",
  "level": 3
}, {
  "value": "Extensions",
  "id": "extensions",
  "level": 3
}, {
  "value": "UI and UX improvements",
  "id": "ui-and-ux-improvements",
  "level": 3
}, {
  "value": "Welcome page #1726",
  "id": "welcome-page-1726",
  "level": 4
}, {
  "value": "New Task Manager #1724",
  "id": "new-task-manager-1724",
  "level": 4
}, {
  "value": "Updated Resources Settings #1582",
  "id": "updated-resources-settings-1582",
  "level": 4
}, {
  "value": "Update Alerts #1827",
  "id": "update-alerts-1827",
  "level": 4
}, {
  "value": "Prune buttons #1481, #1482, #1484",
  "id": "prune-buttons-1481-1482-1484",
  "level": 4
}, {
  "value": "Other notable enhancements",
  "id": "other-notable-enhancements",
  "level": 2
}, {
  "value": "Documentation",
  "id": "documentation",
  "level": 2
}, {
  "value": "Notable bug fixes",
  "id": "notable-bug-fixes",
  "level": 2
}, {
  "value": "Community thank you",
  "id": "community-thank-you",
  "level": 2
}, {
  "value": "Final notes",
  "id": "final-notes",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
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
      children: "This release note covers Podman Desktop 0.13 release changes."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Podman Version"
        }), ": Podman 4.4.4 now included in Windows and Mac installers."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Compose"
        }), ": Support for installing Docker Compose."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Extensions"
        }), ": Improved extension support for Podman Desktop with additional capabilities."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "UX and UI Improvements"
        }), ": Welcome page, task manager, resources, and update alerts."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop 0.13 is now available. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/downloads",
        children: "Click here to download it"
      }), "!"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Podman-desktop-0-13-hero",
        src: (__webpack_require__(44380)/* ["default"] */ .A) + "",
        width: "1852",
        height: "1323"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "release-details",
      children: "Release details"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "update-to-podman-v444",
      children: "Update to Podman v4.4.4"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop 0.13 embeds ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman/releases/tag/v4.4.4",
        children: "Podman 4.4.4"
      }), " in\nWindows and macOS installers ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1456",
        children: "#1456"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "compose-support",
      children: "Compose support"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["You can install Docker Compose from the Podman Desktop UI ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1578",
        children: "#1578"
      }), ". This will allow you use Compose workflows using Podman."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "extensions",
      children: "Extensions"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "To make it easier to extend Podman Desktop we have:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Published the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://www.npmjs.com/package/@podman-desktop/api",
          children: "Podman Desktop Extension API"
        }), " to npmjs ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1727",
          children: "#1727"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Documented ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://podman-desktop.io/docs/extensions",
          children: "how to create, publish, and install your own extensions"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Expanded the API for ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
          children: "QuickPickInput"
        }), " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1839",
          children: "#1839"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "ui-and-ux-improvements",
      children: "UI and UX improvements"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "welcome-page-1726",
      children: ["Welcome page ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1726",
        children: "#1726"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The first time every user starts Podman Desktop, they will see a welcome page:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/19958075/225682776-e016ba31-5bb9-41d5-87ed-f93caeb3fb84.png",
        alt: "welcome-page"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Note that the Welcome page will only appear the first time you run Podman Desktop 0.13.0, and none of your settings or assets in Podman Desktop will be affected by it.\nOver time, this page will be expanded to help with initial setup and configuration."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "new-task-manager-1724",
      children: ["New Task Manager ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1724",
        children: "#1724"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["A new Task Manager has been added to the status bar to see the progress (or return to) long running tasks. To start with, building images ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1725",
        children: "#1725"
      }), " and Podman machine ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1742",
        children: "#1742"
      }), " are using the task manager."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "task-manager",
        src: (__webpack_require__(69414)/* ["default"] */ .A) + "",
        width: "2082",
        height: "1198"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "updated-resources-settings-1582",
      children: ["Updated Resources Settings ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1582",
        children: "#1582"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.strong, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Icon, {
          icon: "fa-solid fa-cog",
          size: "lg"
        }), " Settings > Resources"]
      }), " page has been updated with a new design, making it easier to see and control your providers from a single place."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/49404737/221908815-595715fe-4c95-4087-89e0-45e5544ed5c9.gif",
        alt: "resources"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The other settings pages have been updated for consistency with this new design."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "update-alerts-1827",
      children: ["Update Alerts ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1827",
        children: "#1827"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "A new alert button will appear in the status bar when future updates are available."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/227596136-c6123d5c-d9ae-4fb3-a569-0cfaaeebf09c.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "prune-buttons-1481-1482-1484",
      children: ["Prune buttons ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1481",
        children: "#1481"
      }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1482",
        children: "#1482"
      }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1484",
        children: "#1484"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We've added buttons to prune unused volumes ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1481",
        children: "#1481"
      }), ", images ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1482",
        children: "#1482"
      }), " and pods ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1484",
        children: "#1484"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "prune-image",
        src: (__webpack_require__(42727)/* ["default"] */ .A) + "",
        width: "2074",
        height: "570"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "other-notable-enhancements",
      children: "Other notable enhancements"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Kubernetes pods are now shown in the Pods view ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1312",
          children: "#1312"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Easy button to fix Docker compatibility mode on macOS ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1697",
          children: "#1697"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Display extension icons ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1058",
          children: "#1058"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["API to cancel long running tasks ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1777",
          children: "#1777"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "documentation",
      children: "Documentation"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The documentation has new content:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://podman-desktop.io/docs/extensions",
          children: "How to create, publish, and install your own Podman Desktop extensions"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://podman-desktop.io/docs/compose/podman-compose",
          children: "Using Compose"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://podman-desktop.io/docs/kind",
          children: "Restarting Kind"
        })
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "notable-bug-fixes",
      children: "Notable bug fixes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Periodically check and refresh Podman connection on Windows and Mac ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1662",
          children: "#1662"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Fix inconsistent Log view behaviour ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1710",
          children: "#1710"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Don't create route for regular Kubernetes clusters ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1707",
          children: "#1707"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Fix copy button on empty screen ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1804",
          children: "#1804"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Register extension tray items correctly ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1778",
          children: "#1778"
        }), " and handle updates ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1800",
          children: "#1800"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "community-thank-you",
      children: "Community thank you"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "🎉 We’d like to say a big thank you to everyone who helped to make Podman Desktop 0.13 even better:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/Tony-Sol",
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "Tony Soloveyv"
          })
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1605",
          children: ["#1605 - Fix directories inconsistency in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "~/.local/share/"
          })]
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/RobotSail",
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "Oleg"
          })
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1567",
          children: "#1567 - Check for Flatpak when calling command from exec"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/cblecker",
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "Christoph Blecker"
          })
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1556",
          children: "#1556 - Fix: Hide dock icon on macOS if starting minimized"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/pwright",
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "Paul Wright"
          })
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1604",
          children: "#1604 - Docs: correct syntax of kind doc"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/dgolovin",
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "Denis Golovin"
          })
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1790",
          children: "#1790 - Feat: add EventEmitter class to extension API"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/cfergeau",
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "Christophe Fergeau"
          })
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1642",
          children: "#1642 - Fix: Pod list \"an pod\" typing error"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "final-notes",
      children: "Final notes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The complete list of issues fixed in this release is available ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/issues?q=is%3Aclosed+milestone%3A0.13.0",
        children: "here"
      }), "."]
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

/***/ 44380:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/podman-desktop-release-0.13-a15251500e13ad05b8a7b404ab301f34.png");

/***/ }),

/***/ 42727:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/prune-image-96f9366ae264c822b47bfc350d987451.png");

/***/ }),

/***/ 69414:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/task-manager-2c9725a8db209c3607e83a24d9ea1582.png");

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

/***/ 57624:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/podman-desktop-release-0.13","source":"@site/blog/2023-03-29-release-0.13.md","title":"Release Notes - Podman Desktop 0.13","description":"Podman Desktop 0.13 has been released!","date":"2023-03-29T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"release","permalink":"/blog/tags/release"},{"inline":true,"label":"kubernetes","permalink":"/blog/tags/kubernetes"},{"inline":true,"label":"compose","permalink":"/blog/tags/compose"}],"readingTime":4.72,"hasTruncateMarker":true,"authors":[{"name":"Tim deBoer","title":"Architect","url":"https://github.com/deboer-tim","imageURL":"https://github.com/deboer-tim.png","key":"deboer","page":null}],"frontMatter":{"title":"Release Notes - Podman Desktop 0.13","description":"Podman Desktop 0.13 has been released!","slug":"podman-desktop-release-0.13","authors":["deboer"],"tags":["podman-desktop","release","kubernetes","compose"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Release Notes - Podman Desktop 0.14","permalink":"/blog/podman-desktop-release-0.14"},"nextItem":{"title":"5 things to know about Podman Desktop for a Docker user","permalink":"/blog/5-things-to-know-for-a-docker-user"}}');

/***/ })

}]);