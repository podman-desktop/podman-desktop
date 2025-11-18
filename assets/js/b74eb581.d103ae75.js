"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[6197],{

/***/ 26782:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_12_16_cncf_projects_md_b74_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_12_16_cncf_projects_md_b74_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2442);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);
/* harmony import */ var react_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(70305);


const frontMatter = {
	title: 'Using CNCF projects with Podman Desktop',
	description: 'Learn how utilize Podman Desktop in interacting and using CNCF projects!',
	slug: 'cncf-projects',
	authors: [
		'cdrage'
	],
	tags: [
		'podman-desktop',
		'cncf',
		'podman',
		'extensions',
		'compose',
		'containers'
	],
	hide_table_of_contents: false
};
const contentTitle = 'Launching CNCF projects from Podman Desktop';

const assets = {
"authorsImageUrls": [undefined],
};




const toc = [{
  "value": "Key features of Podman Desktop for CNCF projects",
  "id": "key-features-of-podman-desktop-for-cncf-projects",
  "level": 2
}, {
  "value": "Minikube",
  "id": "minikube",
  "level": 2
}, {
  "value": "Backstage",
  "id": "backstage",
  "level": 2
}, {
  "value": "Dapr",
  "id": "dapr",
  "level": 2
}, {
  "value": "Conclusion",
  "id": "conclusion",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    img: "img",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "plane",
        src: (__webpack_require__(65489)/* ["default"] */ .A) + "",
        width: "898",
        height: "603"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop serves as a powerful tool for managing and visualizing cloud-native applications and can interact seamlessly with a range of ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://www.cncf.io/",
        children: "CNCF (Cloud Native Computing Foundation)"
      }), " projects."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "It's an accessible platform for developers working with single-container applications, multi-container configurations with Compose files, and complex, distributed applications on Kubernetes clusters."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "key-features-of-podman-desktop-for-cncf-projects",
      children: "Key features of Podman Desktop for CNCF projects"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman Desktop brings together three powerful features for managing small to large-scale projects:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Container Management"
        }), ": Supports creating, running, and monitoring containers."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Compose Support"
        }), ": Allows you to deploy applications defined in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "https://www.compose-spec.io/",
          children: "Compose files"
        }), ". This is particularly useful for managing applications that require multiple services, such as web servers, databases, and caches."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
          children: "Kubernetes Integration"
        }), ": Offers tools to manage multi-node Kubernetes clusters, making it ideal for handling more complex distributed applications that need orchestration across several pods and services. You can setup your own development cluster with Podman Desktop using our ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/minikube/installing-extension",
          children: "Minikube"
        }), " or ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
          href: "/docs/kind/installing-extension",
          children: "Kind"
        }), " extensions."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "minikube",
      children: "Minikube"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://minikube.sigs.k8s.io/docs/",
        children: "Minikube"
      }), " is a local Kubernetes development cluster which allows for an easy way to learn and develop for Kubernetes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Minikube can be seamlessly integrated with Podman Desktop, enabling Kubernetes development workflows within Podman’s environment. This is made possible by ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/docs/minikube/installing-extension",
        children: "installing the Minikube extension"
      }), ", which allows creating, managing, and deploying clusters directly from the Podman Desktop."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The following video provides a complete guide from installation to cluster creation:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_player__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
      playing: true,
      playsInline: true,
      controls: true,
      src: "https://github.com/containers/podman-desktop-media/raw/refs/heads/minikube/video/guide.mp4",
      width: "100%",
      height: "100%"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "backstage",
      children: "Backstage"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://backstage.io/",
        children: "Backstage"
      }), " is an open-source platform for building developer portals, designed by Spotify. It empowers engineering teams to create customized, centralized hubs for managing and documenting their services, applications, and infrastructure. Backstage’s extensible architecture includes features for cataloging software components, organizing documentation, managing cloud resources, and tracking workflows."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["A popular method for deploying Backstage is through a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/backstage/charts",
        children: "Helm chart"
      }), ". Once deployed, you can view Backstage’s services in the Kubernetes Dashboard to monitor components and ensure proper configuration:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "backstage services",
        src: (__webpack_require__(51138)/* ["default"] */ .A) + "",
        width: "1070",
        height: "694"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "You can also access your deployed Backstage instance by using Podman Desktop's port forwarding feature. This feature allows you to securely forward a local port to the Backstage service running on your Kubernetes cluster, making it easy to access the instance from a local browser."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "backstage port forward",
        src: (__webpack_require__(49822)/* ["default"] */ .A) + "",
        width: "1070",
        height: "694"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "dapr",
      children: "Dapr"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://docs.dapr.io/",
        children: "Dapr"
      }), " (Distributed Application Runtime) is an open-source, event-driven runtime designed to help developers build resilient, stateless, and stateful applications that can run seamlessly on cloud or edge environments."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Dapr abstracts the complexities of distributed systems, offering building blocks for service invocation, state management, publish/subscribe messaging, and resource bindings, which simplify the development of microservices and cloud-native applications."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Dapr can be deployed in a local environment using Podman by following their ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://docs.dapr.io/operations/hosting/self-hosted/self-hosted-with-podman/",
        children: "self-hosted podman setup"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "To initialize Dapr with Podman after installing the Dapr CLI, execute the following command:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-console",
        children: "$ dapr init --container-runtime podman\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Once initialized, you can manage and interact with Dapr directly within Podman Desktop:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "dapr",
        src: (__webpack_require__(51672)/* ["default"] */ .A) + "",
        width: "1124",
        height: "760"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Additionally, Podman Desktop provides a \"Launch Browser\" button, allowing quick and convenient access to the Dapr UI for monitoring and management:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "dapr browser",
        src: (__webpack_require__(72433)/* ["default"] */ .A) + "",
        width: "1124",
        height: "760"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Whether you’re managing Kubernetes clusters, harnessing the power of Backstage for developer portals, or deploying microservices with Dapr, Podman Desktop provides a unified environment to streamline your workflows."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Check out the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://www.cncf.io/projects/",
        children: "list of graduate and incubating projects"
      }), " to discover even more possibilities with Podman Desktop."]
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

/***/ 51138:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/backstage-733c9c3d86cab05c0cabe85b475ff5cc.png");

/***/ }),

/***/ 49822:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/backstage_port-57b8ef824c306ac52a339bd11f3133f1.png");

/***/ }),

/***/ 51672:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dapr-31224058af60d5500d34044a9af4d569.png");

/***/ }),

/***/ 72433:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dapr_browser-07d06b22e720bf21bbc916349e805ae7.png");

/***/ }),

/***/ 65489:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/plane-b0fd896eb3d2743db0636e98679a665d.png");

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

/***/ 2442:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/cncf-projects","source":"@site/blog/2024-12-16-cncf-projects.md","title":"Using CNCF projects with Podman Desktop","description":"Learn how utilize Podman Desktop in interacting and using CNCF projects!","date":"2024-12-16T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"cncf","permalink":"/blog/tags/cncf"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"extensions","permalink":"/blog/tags/extensions"},{"inline":true,"label":"compose","permalink":"/blog/tags/compose"},{"inline":true,"label":"containers","permalink":"/blog/tags/containers"}],"readingTime":3.15,"hasTruncateMarker":false,"authors":[{"name":"Charlie Drage","title":"Software Engineer","url":"https://github.com/cdrage","imageURL":"https://github.com/cdrage.png","key":"cdrage","page":null}],"frontMatter":{"title":"Using CNCF projects with Podman Desktop","description":"Learn how utilize Podman Desktop in interacting and using CNCF projects!","slug":"cncf-projects","authors":["cdrage"],"tags":["podman-desktop","cncf","podman","extensions","compose","containers"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop BootC extension 1.6 Release","permalink":"/blog/bootc-release-1.6"},"nextItem":{"title":"Podman Desktop 1.15 Release","permalink":"/blog/podman-desktop-release-1.15"}}');

/***/ })

}]);