"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[40023],{

/***/ 76862
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_compose_to_kubernetes_with_podman_kube_play_md_b4d_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-compose-to-kubernetes-with-podman-kube-play-md-b4d.json
const site_tutorial_compose_to_kubernetes_with_podman_kube_play_md_b4d_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"compose-to-kubernetes-with-podman-kube-play","title":"Compose to Kubernetes with Podman Kube Play","description":"Convert an existing Compose application to Kubernetes YAML with Kompose and validate it locally with podman kube play.","source":"@site/tutorial/compose-to-kubernetes-with-podman-kube-play.md","sourceDirName":".","slug":"/compose-to-kubernetes-with-podman-kube-play","permalink":"/tutorial/compose-to-kubernetes-with-podman-kube-play","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"tutorial","permalink":"/tutorial/tags/tutorial"},{"inline":true,"label":"compose","permalink":"/tutorial/tags/compose"},{"inline":true,"label":"kubernetes","permalink":"/tutorial/tags/kubernetes"},{"inline":true,"label":"migrating","permalink":"/tutorial/tags/migrating"}],"version":"current","sidebarPosition":9,"frontMatter":{"sidebar_position":9,"title":"Compose to Kubernetes with Podman Kube Play","description":"Convert an existing Compose application to Kubernetes YAML with Kompose and validate it locally with podman kube play.","keywords":["compose","kubernetes","podman","kompose"],"tags":["podman-desktop","tutorial","compose","kubernetes","migrating"]},"sidebar":"defaultSidebar","previous":{"title":"Testcontainers with Podman","permalink":"/tutorial/testcontainers-with-podman"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/ThemedImage/index.js + 2 modules
var ThemedImage = __webpack_require__(90448);
;// ./tutorial/compose-to-kubernetes-with-podman-kube-play.md


const frontMatter = {
	sidebar_position: 9,
	title: 'Compose to Kubernetes with Podman Kube Play',
	description: 'Convert an existing Compose application to Kubernetes YAML with Kompose and validate it locally with podman kube play.',
	keywords: [
		'compose',
		'kubernetes',
		'podman',
		'kompose'
	],
	tags: [
		'podman-desktop',
		'tutorial',
		'compose',
		'kubernetes',
		'migrating'
	]
};
const contentTitle = undefined;

const assets = {

};




const toc = [{
  "value": "Why this migration path",
  "id": "why-this-migration-path",
  "level": 2
}, {
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 2
}, {
  "value": "Why this tutorial starts with podman kube play",
  "id": "why-this-tutorial-starts-with-podman-kube-play",
  "level": 2
}, {
  "value": "Step 1: run the existing Compose app",
  "id": "step-1-run-the-existing-compose-app",
  "level": 2
}, {
  "value": "Step 2: convert Compose to Kubernetes YAML",
  "id": "step-2-convert-compose-to-kubernetes-yaml",
  "level": 2
}, {
  "value": "Step 3: run Kubernetes YAML locally",
  "id": "step-3-run-kubernetes-yaml-locally",
  "level": 2
}, {
  "value": "Step 4: before using a real cluster",
  "id": "step-4-before-using-a-real-cluster",
  "level": 2
}, {
  "value": "What Kompose migration covers and what it does not",
  "id": "what-kompose-migration-covers-and-what-it-does-not",
  "level": 2
}, {
  "value": "What kube play validates vs a real Kubernetes engine",
  "id": "what-kube-play-validates-vs-a-real-kubernetes-engine",
  "level": 2
}, {
  "value": "Cleanup",
  "id": "cleanup",
  "level": 2
}, {
  "value": "Troubleshooting",
  "id": "troubleshooting",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,lib/* useMDXComponents */.R)(),
    ...props.components
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.p, {
      children: "You do not need a full rewrite to start moving from Compose to Kubernetes."
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This tutorial uses the existing ", (0,jsx_runtime.jsx)(_components.code, {
        children: "guestbook-compose"
      }), " sample from ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman-desktop-demo"
      }), " and walks through a practical migration flow:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Run the app with Compose."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Convert ", (0,jsx_runtime.jsx)(_components.code, {
          children: "compose.yaml"
        }), " to Kubernetes YAML with ", (0,jsx_runtime.jsx)(_components.code, {
          children: "kompose"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Run the generated manifests locally with ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman kube play"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "why-this-migration-path",
      children: "Why this migration path"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Keep your current Compose workflow while adopting Kubernetes step by step."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Validate generated manifests locally before touching a real cluster."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Catch gaps early and reduce production migration risk."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Podman Desktop: ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://podman-desktop.io/downloads",
          children: "Download Podman Desktop"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Podman CLI (", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman"
        }), ") available. If you installed Podman through Podman Desktop onboarding, it is already included (check with ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman --version"
        }), ")."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Kompose: ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://kompose.io/",
          children: "kompose.io"
        })]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["On macOS or Windows, ensure your Podman machine is running in ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Settings > Resources"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "why-this-tutorial-starts-with-podman-kube-play",
      children: "Why this tutorial starts with podman kube play"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This guide uses ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman kube play"
      }), " as a local pre-validation step. The goal is to quickly check that generated manifests are runnable before investing time in full cluster setup."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This step does not replace validation on a real Kubernetes engine. After local validation, you may run the same manifests on ", (0,jsx_runtime.jsx)(_components.code, {
        children: "microshift"
      }), ", ", (0,jsx_runtime.jsx)(_components.code, {
        children: "minikube"
      }), ", or ", (0,jsx_runtime.jsx)(_components.code, {
        children: "kind"
      }), " to confirm real cluster behavior."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-1-run-the-existing-compose-app",
      children: "Step 1: run the existing Compose app"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Clone the demo repository and open the existing sample:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ git clone https://github.com/redhat-developer/podman-desktop-demo.git\n$ cd podman-desktop-demo/guestbook-compose\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Start the stack (recommended in foreground for easier debugging):"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman compose -f compose.yaml up --build\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Keep this terminal open. Run the next commands from a second terminal."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you prefer detached mode, use:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman compose -f compose.yaml up -d --build\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
      alt: "Step 1 podman compose terminal output",
      sources: {
        light: (__webpack_require__(32770)/* ["default"] */ .A),
        dark: (__webpack_require__(32770)/* ["default"] */ .A)
      }
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Open the guestbook UI:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "http://localhost:8080",
          children: "http://localhost:8080"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
      alt: "Step 1 in Podman Desktop: containers list",
      sources: {
        light: (__webpack_require__(60471)/* ["default"] */ .A),
        dark: (__webpack_require__(80247)/* ["default"] */ .A)
      }
    }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
      alt: "Step 1 guestbook app",
      sources: {
        light: (__webpack_require__(95941)/* ["default"] */ .A),
        dark: (__webpack_require__(95941)/* ["default"] */ .A)
      }
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-2-convert-compose-to-kubernetes-yaml",
      children: "Step 2: convert Compose to Kubernetes YAML"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Generate Kubernetes manifests from the Compose file:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ kompose convert --stdout -f compose.yaml > guestbook-kube.yaml\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This conversion is file-based and works even if Podman pods are not present."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You may see this warning during conversion:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-text",
        children: "WARN Service \"redis-replica\" won't be created because 'ports' is not specified\n"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This is expected for this sample. ", (0,jsx_runtime.jsx)(_components.code, {
        children: "redis-replica"
      }), " is internal-only, so it does not publish host ports. Kompose can still generate the workload resources needed for local validation with ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman kube play"
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
      alt: "Step 2 generated Kubernetes YAML",
      sources: {
        light: (__webpack_require__(39828)/* ["default"] */ .A),
        dark: (__webpack_require__(39828)/* ["default"] */ .A)
      }
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-3-run-kubernetes-yaml-locally",
      children: "Step 3: run Kubernetes YAML locally"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Stop Compose first:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["If you started Compose in foreground mode, press ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Ctrl-C"
      }), " in the first terminal."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you started Compose in detached mode, run:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman compose -f compose.yaml down\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Run the generated YAML:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman kube play --replace --publish-all guestbook-kube.yaml\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "At this point, you crossed the first Kubernetes boundary:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Your app is no longer started from Compose"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Your app is now started from Kubernetes manifests"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Podman executes those manifests locally so you can validate behavior"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Verify the app:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: (0,jsx_runtime.jsx)(_components.a, {
          href: "http://localhost:8080",
          children: "http://localhost:8080"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(ThemedImage/* default */.A, {
      alt: "Step 3 containers after kube play",
      sources: {
        light: (__webpack_require__(58076)/* ["default"] */ .A),
        dark: (__webpack_require__(79154)/* ["default"] */ .A)
      }
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "step-4-before-using-a-real-cluster",
      children: "Step 4: before using a real cluster"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This sample validates migration flow, not production readiness."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Before production:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Replace demo settings and credentials"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Add readiness/liveness probes and resource requests/limits"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Add ingress/TLS and storage policies"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Add CI checks and image/dependency scanning"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "what-kompose-migration-covers-and-what-it-does-not",
      children: "What Kompose migration covers and what it does not"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "What Kompose generally covers well:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Basic service definitions and container images"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Environment variables"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Simple port mappings"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Straightforward volume mappings"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "What typically needs manual follow-up:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Ingress and external exposure strategy"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Probe tuning and resource requests/limits"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Storage classes and cluster-specific persistence behavior"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "RBAC, security policies, and network policies"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Advanced scheduling and autoscaling"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "what-kube-play-validates-vs-a-real-kubernetes-engine",
      children: "What kube play validates vs a real Kubernetes engine"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["What ", (0,jsx_runtime.jsx)(_components.code, {
        children: "podman kube play"
      }), " validates in this tutorial:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Generated manifests are runnable locally"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Basic container wiring and service reachability"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Fast local smoke checks for migration flow"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "What a real Kubernetes engine additionally validates:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Scheduler and full cluster networking behavior"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Ingress/controller integration"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Production auth, RBAC, and policy enforcement"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Distro/cloud-specific operational behavior"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "cleanup",
      children: "Cleanup"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman compose -f compose.yaml down -v\n$ podman kube down guestbook-kube.yaml\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "troubleshooting",
      children: "Troubleshooting"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Port already in use (", (0,jsx_runtime.jsx)(_components.code, {
          children: "8080"
        }), "): stop conflicting containers, then rerun."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Local image pull error for ", (0,jsx_runtime.jsx)(_components.code, {
          children: "web"
        }), ": ensure Compose build completed before ", (0,jsx_runtime.jsx)(_components.code, {
          children: "kube play"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "kompose"
        }), " not found: install from ", (0,jsx_runtime.jsx)(_components.a, {
          href: "https://kompose.io/",
          children: "kompose.io"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "kube play"
        }), " issues after retries: run ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman kube down guestbook-kube.yaml"
        }), " and retry."]
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

/***/ 32770
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-1-compose-output-c4cbebf62c57679b2b9ee3db957ddf52.png");

/***/ },

/***/ 95941
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-1-grocery-app-ea1bae7d2d1f6e345069d09b6900741d.png");

/***/ },

/***/ 80247
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-1-podman-desktop-dark-86bc958310b12f79b4560dd13658cd90.png");

/***/ },

/***/ 60471
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-1-podman-desktop-light-d8de6c26c98a09397ca2e9a034e20cb5.png");

/***/ },

/***/ 39828
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-2-generated-yaml-1d07ac67a09bbf614da563503859feef.png");

/***/ },

/***/ 79154
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-3-containers-kube-play-dark-d14cc8c165f4ad391f47f55117670086.png");

/***/ },

/***/ 58076
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/step-3-containers-kube-play-light-4812648931a4c2b6cbf4c5056430d4f4.png");

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