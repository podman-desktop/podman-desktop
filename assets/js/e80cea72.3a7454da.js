"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[54050],{

/***/ 20414
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_06_02_podman_desktop_core_md_f22_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2025_06_02_podman_desktop_core_md_f22_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56949);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Containers and Kubernetes development with Podman Desktop',
	description: 'A step-by-step guide for your containers and Kubernetes development with Podman Desktop',
	authors: [
		'firewall'
	],
	tags: [
		'podman-desktop',
		'podman',
		'development',
		'container',
		'tools'
	],
	hide_table_of_contents: false
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Building Containerized Applications with Podman Desktop",
  "id": "building-containerized-applications-with-podman-desktop",
  "level": 2
}, {
  "value": "Container Management and Log Analysis",
  "id": "container-management-and-log-analysis",
  "level": 3
}, {
  "value": "Working with Kubernetes and OpenShift",
  "id": "working-with-kubernetes-and-openshift",
  "level": 2
}, {
  "value": "Creating the Pod on your local Kubernetes cluster",
  "id": "creating-the-pod-on-your-local-kubernetes-cluster",
  "level": 3
}, {
  "value": "Monitoring Kubernetes Events and Resources",
  "id": "monitoring-kubernetes-events-and-resources",
  "level": 2
}, {
  "value": "Video walkthrough",
  "id": "video-walkthrough",
  "level": 3
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
    h3: "h3",
    img: "img",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In the world of modern software development, containers and Kubernetes are no longer optional; they are essential. That’s where Podman Desktop comes in, your ultimate tool for building, managing, and deploying containers and Kubernetes clusters with ease and confidence. In this blogpost we will walk through a typical development workflow, creating and building a container and then testing it in a local Kubernetes cluster. Let’s dive in."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "building-containerized-applications-with-podman-desktop",
      children: "Building Containerized Applications with Podman Desktop"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "First, let's start by building an application in a container with Podman Desktop. We need our application code and a Containerfile. For a simple application, your Containerfile might look something like:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-Dockerfile",
        children: "FROM docker.io/nginxinc/nginx-unprivileged\n\nCOPY <<EOF /usr/share/nginx/html/index.html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Simple NGINX Container</title>\n</head>\n<body>\n    <h1>Hello from my Podman NGINX Container!</h1>\n    <p>This content is being served by NGINX running in a Podman container.</p>\n</body>\n</html>\nEOF\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["To enhance security, we utilize the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "nginx-unprivileged"
      }), " image. This helps avoid root access, which is enforced by default in some Kubernetes distributions like OpenShift. The default NGINX image uses port 80, which is forbidden in rootless mode."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Once your application and Containerfile are ready, Podman Desktop makes the build process straightforward:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Build image",
        src: (__webpack_require__(38053)/* ["default"] */ .A) + "",
        width: "1117",
        height: "809"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Navigate to the \"Images\" section"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Select your Containerfile"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Provide a name for your image (e.g. webserver)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click \"Build\""
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "After building your image, you can immediately run it with a single click, and your container will appear in the \"Containers\" list."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Start container",
        src: (__webpack_require__(80339)/* ["default"] */ .A) + "",
        width: "1489",
        height: "1080"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Find your container on the “Images” list"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click the “Run Image ▶️” button"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Give your container a name we will call it: “webserver”"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "container-management-and-log-analysis",
      children: "Container Management and Log Analysis"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Now that our webserver container is running we can inspect it in the UI\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "View container details",
        src: (__webpack_require__(6549)/* ["default"] */ .A) + "",
        width: "1116",
        height: "808"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We can click the Open Browser button to see the webserver in our browser:\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Webserver open in browser",
        src: (__webpack_require__(59963)/* ["default"] */ .A) + "",
        width: "1513",
        height: "1062"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Monitoring container logs is crucial for debugging and understanding application behavior. Let's use Podman Desktop to view the logs of the newly created container."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Select your running container from the \"Containers\" list"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click on the \"Logs\" tab to view the container's logs"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "In the newest version of Podman Desktop you can also search in the logs!"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "View container logs",
        src: (__webpack_require__(99886)/* ["default"] */ .A) + "",
        width: "1555",
        height: "1145"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "With that, we can continue the development process. We are able to rebuild our container when we have updated code. On top of that, we can share our Containerfile with our team who will be able to reproduce the exact same environment as us to build and test their code."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "working-with-kubernetes-and-openshift",
      children: "Working with Kubernetes and OpenShift"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Now that we have a development setup up and running, it’s time to get ready for production. In today's world, it is natural for us to move to Kubernetes. Having a locally running cluster, we are able to iterate quickly but still have an environment that is as close to production as possible. This aids in a smoother migration in the future. Podman Desktop is here to help you test and execute that migration."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["With ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://kind.sigs.k8s.io/",
        children: "kind"
      }), " or ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://minikube.sigs.k8s.io/docs/",
        children: "minikube"
      }), ", we are able to have a locally running Kubernetes cluster in minutes. This will allow us to test our application in a Kubernetes environment. Kind comes installed together with Podman Desktop so you will be able to get started instantly."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Start by navigating to the “Kubernetes” page"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click on the “Create new Kind cluster” button"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Create kind cluster",
        src: (__webpack_require__(45555)/* ["default"] */ .A) + "",
        width: "1118",
        height: "808"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      start: "3",
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click “Create”"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Wait until the kind cluster gets created"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Once the cluster is created, Podman Desktop will automatically switch your Kubernetes context to the new kind cluster. If you want to change your cluster, you can switch contexts in the statusbar."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We now have a locally running Kubernetes cluster which we can explore on the Kubernetes dashboard."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Kubernetes dashboard",
        src: (__webpack_require__(4362)/* ["default"] */ .A) + "",
        width: "1118",
        height: "808"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This dashboard not only gives you an overview of your cluster but it also provides quick access to the different Kubernetes objects that exist in the cluster."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "creating-the-pod-on-your-local-kubernetes-cluster",
      children: "Creating the Pod on your local Kubernetes cluster"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "With a running Kubernetes cluster, we can now create our pod in the Kubernetes cluster. Using Podman Desktop, we can convert our previously created container into a Pod in our kind cluster."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["First we have to push our image to our kind cluster.\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Push image to kind",
        src: (__webpack_require__(71552)/* ["default"] */ .A) + "",
        width: "1116",
        height: "808"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Now that the image is available we can use the Podman Desktop UI to Deploy our container to a Pod\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Deploy to Kubernetes",
        src: (__webpack_require__(60199)/* ["default"] */ .A) + "",
        width: "1116",
        height: "806"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Navigate to the “Containers” section"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "On the webserver container, click the “Deploy to Kubernetes” button"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Choose your kind cluster"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The conversion from containers to Kubernetes manifests is particularly valuable, eliminating the need to manually write YAML files for simple deployments. Podman Desktop adds ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "imagePullPolicy: IfNotPresent"
      }), " to the generated Kubernetes YAML. This ensures that we use the image that we just pushed to the cluster is also the one we will use. Make sure to add this to your Kubernetes YAML or use a specific tag on your image to avoid the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://kubernetes.io/docs/concepts/containers/images/#imagepullpolicy-defaulting",
        children: "default pull policy"
      }), " (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Always"
      }), ")."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "monitoring-kubernetes-events-and-resources",
      children: "Monitoring Kubernetes Events and Resources"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Understanding what's happening in your Kubernetes cluster is essential for effective development. In the latest version of Podman Desktop, you can now check the events of your Kubernetes Pods in the UI."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Let's check if our pod was created and running successfully."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Navigate to the “Kubernetes” in the left-navigation"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click on the “Pods” sub-navigation"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Click on the pods you just created"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Scroll to the bottom and check the “Events”"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "We can see that our Pod was started and is running"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "View pod events",
        src: (__webpack_require__(37955)/* ["default"] */ .A) + "",
        width: "1116",
        height: "807"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We can also check out the “Logs” tab to see the logs of the running Pod.\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "View pod logs",
        src: (__webpack_require__(72763)/* ["default"] */ .A) + "",
        width: "1116",
        height: "809"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "video-walkthrough",
      children: "Video walkthrough"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("iframe", {
      width: "560",
      height: "315",
      src: "https://www.youtube.com/embed/orEZhYDf6sA",
      title: "Containers and Kubernetes development with Podman Desktop",
      frameBorder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowFullScreen: true
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman Desktop significantly streamlines the container and Kubernetes development experience by providing:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "A unified interface for building and managing containers"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Seamless integration with Kubernetes and OpenShift"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Powerful logging and debugging tools"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "A bridge between local development and production Kubernetes environments"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Whether you're just starting with containers or managing complex Kubernetes deployments, Podman Desktop offers tools that simplify your workflow and increase productivity. As ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/blog/2024/11/14/podman-desktop-cncf",
        children: "a CNCF project"
      }), ", it continues to evolve with the needs of the cloud-native community, making it an increasingly valuable tool in any developer's toolkit."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Try Podman Desktop today and experience how it can transform your container, Kubernetes and OpenShift workflows!"
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

/***/ 38053
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/build-image-da5629f42809afa78ad4071f8da2acd0.png");

/***/ },

/***/ 6549
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/container-details-3e4c522516f5ddecf71b4a777e6aa8fa.png");

/***/ },

/***/ 99886
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/container-logs-6d72372131fb9f62ba67129aa854ea2e.png");

/***/ },

/***/ 45555
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-kind-cluster-a3855ece123687b1254e66d99d69b175.png");

/***/ },

/***/ 60199
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/deploy-to-kubernetes-ef4b3e37f061e93e58e83cf10292b953.png");

/***/ },

/***/ 4362
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kubernetes-dashboard-7d03f0afaeb9f16b01cfdbbd6b0443c6.png");

/***/ },

/***/ 72763
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/kubernetes-pod-logs-0e0061eb67bee69ed822dafcd65b4819.png");

/***/ },

/***/ 59963
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/nginx-in-container-00fdfd67599bde6a62156cd6c191cfff.png");

/***/ },

/***/ 37955
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/pod-details-events-93d45098689bf15a353c0d4f631aad1a.png");

/***/ },

/***/ 71552
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/push-image-to-kind-85747669289bb45a53af089ea26ff604.png");

/***/ },

/***/ 80339
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/start-container-350c82e23842cf8d06c7cd42c06824a4.png");

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

/***/ 56949
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/2025/06/02/podman-desktop-core","source":"@site/blog/2025-06-02-podman-desktop-core.md","title":"Containers and Kubernetes development with Podman Desktop","description":"A step-by-step guide for your containers and Kubernetes development with Podman Desktop","date":"2025-06-02T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"development","permalink":"/blog/tags/development"},{"inline":true,"label":"container","permalink":"/blog/tags/container"},{"inline":true,"label":"tools","permalink":"/blog/tags/tools"}],"readingTime":6,"hasTruncateMarker":false,"authors":[{"name":"Matt Demyttenaere","title":"Product Manager","url":"https://github.com/firewall","imageURL":"https://github.com/firewall.png","key":"firewall","page":null}],"frontMatter":{"title":"Containers and Kubernetes development with Podman Desktop","description":"A step-by-step guide for your containers and Kubernetes development with Podman Desktop","authors":["firewall"],"tags":["podman-desktop","podman","development","container","tools"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.20 Release","permalink":"/blog/podman-desktop-release-1.20"},"nextItem":{"title":"Podman Desktop 1.19 Release","permalink":"/blog/podman-desktop-release-1.19"}}');

/***/ }

}]);