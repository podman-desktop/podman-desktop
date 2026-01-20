"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[79981],{

/***/ 59433:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_01_18_release_0_11_md_832_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_01_18_release_0_11_md_832_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83991);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);
/* harmony import */ var react_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(70305);


const frontMatter = {
	title: 'Release Notes - Podman Desktop 0.11',
	description: 'Podman Desktop 0.11 has been released!',
	slug: 'podman-desktop-release-0.11',
	authors: [
		'slemeur'
	],
	tags: [
		'podman-desktop',
		'release',
		'kubernetes'
	],
	hide_table_of_contents: false
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
  "value": "Air-Gapped installation #1104 #1120",
  "id": "air-gapped-installation-1104-1120",
  "level": 3
}, {
  "value": "Feedback within Podman Desktop #1078",
  "id": "feedback-within-podman-desktop-1078",
  "level": 3
}, {
  "value": "Docker compatibility mode #1047",
  "id": "docker-compatibility-mode-1047",
  "level": 3
}, {
  "value": "Allow to toggle on/off the proxy setting #983",
  "id": "allow-to-toggle-onoff-the-proxy-setting-983",
  "level": 3
}, {
  "value": "Namespace selection for deploy to Kubernetes #1008",
  "id": "namespace-selection-for-deploy-to-kubernetes-1008",
  "level": 3
}, {
  "value": "Configure Podman binary path #941",
  "id": "configure-podman-binary-path-941",
  "level": 3
}, {
  "value": "Provide pre-defined registries #1201",
  "id": "provide-pre-defined-registries-1201",
  "level": 3
}, {
  "value": "UI/UX Improvements",
  "id": "uiux-improvements",
  "level": 3
}, {
  "value": "View Pods logs #1122",
  "id": "view-pods-logs-1122",
  "level": 4
}, {
  "value": "Improved feedback when clicking on container list action icons #1150 #1161",
  "id": "improved-feedback-when-clicking-on-container-list-action-icons-1150-1161",
  "level": 4
}, {
  "value": "Allows to change the default font size for the editor #1160",
  "id": "allows-to-change-the-default-font-size-for-the-editor-1160",
  "level": 4
}, {
  "value": "Keep expanded state of pods when refreshing containers #1042",
  "id": "keep-expanded-state-of-pods-when-refreshing-containers-1042",
  "level": 4
}, {
  "value": "Click on the Pod name redirects to the Pod details page #1159",
  "id": "click-on-the-pod-name-redirects-to-the-pod-details-page-1159",
  "level": 4
}, {
  "value": "Improved styles of buttons for actions #984",
  "id": "improved-styles-of-buttons-for-actions-984",
  "level": 4
}, {
  "value": "Improved alignments in pages with lists #1182",
  "id": "improved-alignments-in-pages-with-lists-1182",
  "level": 4
}, {
  "value": "Other Notable Enhancements",
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
  "value": "Community Thank You",
  "id": "community-thank-you",
  "level": 2
}, {
  "value": "Final Notes",
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
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This release note covers Podman Desktop 0.11 release changes."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Air-Gapped Installation"
        }), ": New all-in-one binaries for air-gapped installation."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Feedback"
        }), ": Submit feedback directly from Podman Desktop."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Docker Compatibility Mode"
        }), ": Information about the Docker compatibility mode."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Proxy Setting"
        }), ": Toggle on/off the proxy setting."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Deploy to Kubernetes"
        }), ": Select the namespace to deploy to Kubernetes."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Registry Configuration"
        }), ": Simplified registry configuration for well known registries."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "UX/UI Improvements"
        }), ": View pod's container logs, better visual feedback, configurable editor font size, and more."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop 0.11 is now available. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/downloads",
        children: "Click here to download it"
      }), "!"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "release-details",
      children: "Release Details"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "air-gapped-installation-1104-1120",
      children: ["Air-Gapped installation ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1104",
        children: "#1104"
      }), " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1120",
        children: "#1120"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "For users who are not able to connect to the internet, a new all-in-one (airgap) binary that includes the Podman Desktop application and the Podman binaries is now available for both Mac and Windows. When initializing a new Podman machine using all-in-one binaries, it'll use the embedded files and not grab them from internet:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "on Mac, it embeds the qemu FCOS binaries."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "on Windows, it embeds the WSL binary."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "To differentiate the air-gapped binaries from the regular ones, you can check the artifactname, they're containing 'airgap' and are bigger.\nPlease note, that those binaries are available only on releases and not the pre-releases."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "There is also an optional way to provide a custom Podman machine image in the create machine form. By providing the path to the image you want, Podman Desktop will create a machine with that image. Leaving the field empty will use the default image (the one included in the binary)."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/210508524-45005536-ac74-4074-92c1-2b3ca51d0073.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "feedback-within-podman-desktop-1078",
      children: ["Feedback within Podman Desktop ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1078",
        children: "#1078"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Submitting feedback on Podman Desktop is getting easier as it is possible directly within the tool. This will help to get more information about the issues you are facing and will help us to improve the tool."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/208938878-948a2764-d73b-4584-a80d-497c052482c1.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Please feel free to submit any feedback you have, we are looking forward to hearing from you!"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "docker-compatibility-mode-1047",
      children: ["Docker compatibility mode ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1047",
        children: "#1047"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The Docker compatibility mode is a feature that allows to use Podman as a drop-in replacement for Docker. It relies on the Docker socket helper provided with Podman and automatically handle the local setup of Podman path to the Docker socket. Tools like ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://www.testcontainers.com/",
        children: "Testcontainers"
      }), " or others are relying on this to communicate to the container engine."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In this new version of Podman Desktop, we are now providing information to the user about the status of this compatibility mode directly on the dashboard page. The way it works is the following:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "When Docker is running: the socket is pointing to Docker."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "When Podman is starting and Docker is not running: the docker API socket will use Podman."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["In case the compatibility mode is not activated, new documentation on how to activate it and how to easily switch between Docker and Podman is available here: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/docs/migrating-from-docker",
        children: "https://podman-desktop.io/docs/migrating-from-docker"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["This is a warning displayed for Windows users:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/436777/209305744-9056addd-f122-4f75-9e03-ad27a0109375.png",
        alt: "windows-docker-compatibility"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["This is the warning for Mac users:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/6422176/207964861-a9c1f72c-89d6-4816-beab-397af4125620.png",
        alt: "mac-docker-compatibility"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "allow-to-toggle-onoff-the-proxy-setting-983",
      children: ["Allow to toggle on/off the proxy setting ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/983",
        children: "#983"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In some context, users need the ability to disable and re-enable the proxy configuration very quickly, without having to entirely reconfigure it. This is now possible from the Podman Desktop settings page, where a toggle to enable/disable the proxy configuration has been added."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/205955418-670bc37c-a74f-40ef-bc60-8d9d013aa0dc.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Note: extensions can read this information and then update the proxy configuration."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "namespace-selection-for-deploy-to-kubernetes-1008",
      children: ["Namespace selection for deploy to Kubernetes ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1008",
        children: "#1008"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "A new dropdown menu has been added to the deploy to Kubernetes screen to allow selecting the namespace to deploy to. Defaults to defaultnamespace, if unable to get any from kube_client module."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["If the user have set ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "kubectl config set-context --current --namespace=NAMESPACE"
      }), " it honors that as the chosen value."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/7339809/206688886-095e4f15-42ae-4a0a-b1c6-ae4b547fcdfb.gif",
        alt: "deploy-kubernetes-namespace"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "configure-podman-binary-path-941",
      children: ["Configure Podman binary path ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/941",
        children: "#941"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Users might use a custom path to the podman binary. An option within settings (Settings -> Preferences) to allow providing an additional path to Podman binary has been added.\nThis is useful for users who have installed Podman using a package manager and want to use the binary provided by the package manager.\nSee: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/docs/troubleshooting/troubleshooting-podman-on-macos#unable-to-set-custom-binary-path-for-podman-on-macos",
        children: "Unable to set custom binary path for Podman on macOS"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/6422176/204832063-5858065a-2fc3-49de-8d23-3b99b7d10dbf.png",
        alt: "custom-path"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h3, {
      id: "provide-pre-defined-registries-1201",
      children: ["Provide pre-defined registries ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1201",
        children: "#1201"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The experience of configuring a registry is getting simplified for the most popular ones. The user will be able to select a registry from a pre-defined list and will only have to provide the username and password. The following registries will be pre-defined:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Dockerhub"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Red Hat Quay"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "GitHub"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "IBM Container Registry"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Google Container Registry"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/6422176/214332937-eb1d9050-0d32-4bc4-8393-49b4583b1390.mov",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "uiux-improvements",
      children: "UI/UX Improvements"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "view-pods-logs-1122",
      children: ["View Pods logs ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1122",
        children: "#1122"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The pods details view provides the ability to view the logs of each containers that might be running in a pod. Moreover, as it can also be hard to scan and identify which container is producing which output, we appended the container name at the beginning of each output and differentiate each container with a different color."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/6422176/211024673-eee9bad8-1b0c-4446-b8d1-97a226282c4d.png",
        alt: "pods-logs"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "improved-feedback-when-clicking-on-container-list-action-icons-1150-1161",
      children: ["Improved feedback when clicking on container list action icons ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1150",
        children: "#1150"
      }), " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1161",
        children: "#1161"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "When starting/stopping or deleting a container, a spinner is now displayed. In case of error, a message indicating that the action failed will also be better indicated."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/211531610-2347d302-4918-46ae-a5a2-c80fac0314f5.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["For containers that exit immediately or short-lived containers, the feedback is also improved and include report of error now provide a better feedback to the user ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1161",
        children: "#1161"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/211831905-ebf596d5-efc8-4f55-8cb8-3f31655388b9.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "allows-to-change-the-default-font-size-for-the-editor-1160",
      children: ["Allows to change the default font size for the editor ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1160",
        children: "#1160"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "An editor is used in several screens of Podman Desktop, from the inspect screen to container's outputs and Kubernetes YAML. The default font size is 10 pixels. It's now possible to adjust the font size to the one the one you prefer. This setting is persisted and will be used for all the editors of Podman Desktop and available from the preferences page (Settings -> Preferences)."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/211778161-130ff733-b2ca-4306-bea3-d031196c3b29.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "keep-expanded-state-of-pods-when-refreshing-containers-1042",
      children: ["Keep expanded state of pods when refreshing containers ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1042",
        children: "#1042"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "When switching from different screens of the application or simply refreshing the list of containers, the expanded state of each item in the list is now persisted and will be properly restored."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/207864147-b68ea9bd-0ca9-42dc-882e-b8a705233749.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "click-on-the-pod-name-redirects-to-the-pod-details-page-1159",
      children: ["Click on the Pod name redirects to the Pod details page ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1159",
        children: "#1159"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The list of containers also displays pods, now clicking on the pod name directly redirects to the Pod details page."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://user-images.githubusercontent.com/436777/211770946-2255f39f-7e2e-48ad-9ead-bcbfe6a115a7.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "improved-styles-of-buttons-for-actions-984",
      children: ["Improved styles of buttons for actions ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/984",
        children: "#984"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The style of the buttons for actions on item in the list of in details pages have been improved. The background has been removed, but to make the hover state more visible, the \"hover\" circle is visible and the icon's color is also changing."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["On lists:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/6422176/205979121-b49a0ddf-03bb-4a4d-8d12-bc8d0bd52387.png",
        alt: "list-actions"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["On details pages:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/6422176/205979123-ea420b17-e834-4029-82eb-22949889eee9.png",
        alt: "details-actions"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.h4, {
      id: "improved-alignments-in-pages-with-lists-1182",
      children: ["Improved alignments in pages with lists ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/pull/1182",
        children: "#1182"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The alignment of the items in the list of containers and pods have been improved. The header of each columns are now aligned with the text. and the actions icons are now aligned with the top of the text."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        src: "https://user-images.githubusercontent.com/19958075/212712580-096fd090-0beb-40a4-8dc6-b3fdc5e81e35.png",
        alt: "list-actions"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "other-notable-enhancements",
      children: "Other Notable Enhancements"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Statistics area in container details are always shown. (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1131",
          children: "#1131"
        }), ")"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Add more descriptive wording and more information to extensions. (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/985",
          children: "#985"
        }), ")"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Allow to install on-the fly Podman Desktop extensions using an OCI image. (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1187",
          children: "#1187"
        }), ")"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Display correctly non-multiplexed stream in logs (when using non interactive mode). (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1197",
          children: "#1197"
        }), ")"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Font changed from white to gray for non-name sections (creation date, size). (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1206",
          children: "#1206"
        }), ")"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Add Help/about menu for macOS/Windows/Linux. (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1207",
          children: "#1207"
        }), ")"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "documentation",
      children: "Documentation"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Coming with this new version of Podman Desktop, the documentation has been getting attention (with number of editorial reviews) and new content have been added."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Content for helping users to migrate from Docker to Podman has been added:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1088",
          children: ["Using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "podman-mac-helper"
          }), " tool to migrate from Docker to Podman on macOS"]
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1129",
          children: "better identify podman-mac-helper verification steps"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1143",
          children: "Emulating Docker CLI using Podman to migrate from Docker to Podman"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1146",
          children: "Migrating from Docker section"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1152",
          children: "Verifying that your tools are using Podman"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1144",
          children: "Importing saved containers"
        })
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Several of other improvements have been made to the documentation and the website:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/962",
          children: "Troubleshooting for Apple Silicon and brew x86_64 installs"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/972",
          children: "Change text of custom binary location, add docs"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/974",
          children: "Silent install option for windows"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1079",
          children: "Upgrade to vite v4 and rollup v3"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1118",
          children: "Refreshing documentation on installing on Linux"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1130",
          children: "Identify the shell sessions in Installing on Linux"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1133",
          children: "Website: the linux binary is not a source, it should be promoted as a binary"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1162",
          children: "Introducing tabs for operatings systems and container engines"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1165",
          children: "website: In the landing page, update plugins and container engines lists"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1163",
          children: "Document where code is located within Podman Desktop"
        })
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1172",
          children: "(extension-api): Documentation on how to write an extension and use the api"
        })
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "notable-bug-fixes",
      children: "Notable bug fixes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Update to v0.3.2 Docker Desktop API for extensions - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1070",
          children: "#1070"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Updated link to the Matrix room - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1076",
          children: "#1076"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Report error when container name already exists - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1142",
          children: "#1142"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Fixed connectivity to the Podman machine when the generated socket length is greater than 104 characters in MacOS - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1145",
          children: "#1145"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Do not use long calls for external clients - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1151",
          children: "#1151"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Invalid name/tag for images with registries using a different port - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1127",
          children: "#1127"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Invalid badge count for images when two images have the same tag - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1124",
          children: "#1124"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Fixed detection of WSL2 - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/981",
          children: "#981"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Handle invalid kubeconfig files instead of crashing - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/953",
          children: "#953"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Removed redundant actions from details pages - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1200",
          children: "#1200"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Fixed registry URL not aligned with header - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1205",
          children: "#1205"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["Moved SVGs to reusable components - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1211",
          children: "#1211"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "Extensions API has also been improved in this new release:"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(extension-api): Allows to register a factory for kubernetes connection objects (like for container connections) - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1040",
          children: "#1040"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(extension-api): List or inspect containers, be notified on events - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1041",
          children: "#1041"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(extension-api): Allows to get provider notification - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1045",
          children: "#1045"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(dd-extension-api): Implement toast API - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1154",
          children: "#1154"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(extension-api): Moved extension properties to preferences - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/948",
          children: "#948"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(dd-extension-api): Added open dev console on dd webview in development mode - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1071",
          children: "#1071"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(extension-api): Added notes on extension and frameworks/tooling of Podman Desktop - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1166",
          children: "#1166"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(extension-api): Documentation on how to write an extension and use the api - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1172",
          children: "#1172"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: ["(dd-extension-api): DD extensions should see only minimal information on containers - ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1191",
          children: "#1191"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "community-thank-you",
      children: "Community Thank You"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "🎉 We’d like to say a big thank you to everyone who helped to make Podman Desktop 0.11 even better:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/emmanuelbernard",
          children: "Emmanuel Bernard"
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/962",
          children: "#962 - Troubleshooting for Apple Silicon"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/eidottermihi",
          children: "Michael Prankl"
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/974",
          children: "#974 - Silent install option for windows"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/elervik",
          children: "Endre Lervik"
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1008",
          children: "#1008 - Namespace selection for deploy to kubernetes"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/evanfpearson",
          children: "Evan FP"
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1145",
          children: "#1145 - fixed socket path length error"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/lsm5",
          children: "Lokesh Mandvekar"
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/956",
          children: "#956 - add repository key to package.json"
        })]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/jeffmaury",
          children: "Jean François Maury"
        }), " in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://github.com/containers/podman-desktop/pull/1194",
          children: "#1194 - Cannot create Kind cluster on Windows"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "final-notes",
      children: "Final Notes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The complete list of issues fixed in this release is available ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/issues?q=is%3Aclosed+milestone%3A0.11.0",
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

/***/ 83991:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/podman-desktop-release-0.11","source":"@site/blog/2023-01-18-release-0.11.md","title":"Release Notes - Podman Desktop 0.11","description":"Podman Desktop 0.11 has been released!","date":"2023-01-18T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"release","permalink":"/blog/tags/release"},{"inline":true,"label":"kubernetes","permalink":"/blog/tags/kubernetes"}],"readingTime":12.82,"hasTruncateMarker":true,"authors":[{"name":"Stevan Le Meur","title":"Product Manager","url":"https://github.com/slemeur","imageURL":"https://github.com/slemeur.png","key":"slemeur","page":null}],"frontMatter":{"title":"Release Notes - Podman Desktop 0.11","description":"Podman Desktop 0.11 has been released!","slug":"podman-desktop-release-0.11","authors":["slemeur"],"tags":["podman-desktop","release","kubernetes"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Release Notes - Podman Desktop 0.12","permalink":"/blog/podman-desktop-release-0.12"},"nextItem":{"title":"Release Notes - Podman Desktop 0.10","permalink":"/blog/podman-desktop-release-0.10"}}');

/***/ })

}]);