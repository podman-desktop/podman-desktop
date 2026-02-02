"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[67492],{

/***/ 30477:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_running_a_pod_using_a_container_docker_file_md_bfe_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-running-a-pod-using-a-container-docker-file-md-bfe.json
const site_tutorial_running_a_pod_using_a_container_docker_file_md_bfe_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"running-a-pod-using-a-container-docker-file","title":"Running a pod using a container or docker file","description":"Create and run a pod from a container or docker file on your machine.","source":"@site/tutorial/running-a-pod-using-a-container-docker-file.md","sourceDirName":".","slug":"/running-a-pod-using-a-container-docker-file","permalink":"/tutorial/running-a-pod-using-a-container-docker-file","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"running-a-pod-from-docker-file","permalink":"/tutorial/tags/running-a-pod-from-docker-file"},{"inline":true,"label":"running-a-pod-from-container-file","permalink":"/tutorial/tags/running-a-pod-from-container-file"}],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"title":"Running a pod using a container or docker file","description":"Create and run a pod from a container or docker file on your machine.","keywords":["podman desktop","podman","pod","Containerfile","Dockerfile"],"tags":["podman-desktop","running-a-pod-from-docker-file","running-a-pod-from-container-file"]},"sidebar":"defaultSidebar","previous":{"title":"Introduction","permalink":"/tutorial/"},"next":{"title":"Running a Kubernetes cluster","permalink":"/tutorial/running-a-kubernetes-cluster"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/running-a-pod-using-a-container-docker-file.md


const frontMatter = {
	sidebar_position: 2,
	title: 'Running a pod using a container or docker file',
	description: 'Create and run a pod from a container or docker file on your machine.',
	keywords: [
		'podman desktop',
		'podman',
		'pod',
		'Containerfile',
		'Dockerfile'
	],
	tags: [
		'podman-desktop',
		'running-a-pod-from-docker-file',
		'running-a-pod-from-container-file'
	]
};
const contentTitle = 'Running a pod using a container or docker file';

const assets = {

};



const toc = [{
  "value": "Before you begin",
  "id": "before-you-begin",
  "level": 2
}, {
  "value": "Building an image",
  "id": "building-an-image",
  "level": 2
}, {
  "value": "Creating a container",
  "id": "creating-a-container",
  "level": 2
}, {
  "value": "Creating and running a pod",
  "id": "creating-and-running-a-pod",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
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
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "running-a-pod-using-a-container-or-docker-file",
        children: "Running a pod using a container or docker file"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial covers the following end-to-end tasks required to run a pod from a container or docker file:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Building an image"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Creating a container"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Creating and running a pod"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "When creating a container, you can set the following configurations:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["With ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Basic"
          }), " configuration, you have the option to:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Define volumes to configure a persistent storage location. For this, you must set up a host directory and then mount this directory to a container. You can keep your application data intact in your host directory even after your container is stopped or failed."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Define port mapping to create an externally accessible container. For this, you must map a host port with the container port. After this mapping, any requests to port on the host are forwarded to port in the container."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Select a file containing environment variables for your container. This file contains data in the ", (0,jsx_runtime.jsx)(_components.code, {
                children: "key=value"
              }), " format."]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["With ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Advanced"
          }), " configuration, you have the option of:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Automatic removal of container"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Specifying ID of the user who can run a container"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Selecting a restart policy that defines whether a container should restart on exit"
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["With ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Networking"
          }), " configuration, you have the option of defining:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "A container host name"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "A custom DNS server"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Additional hosts"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "The networking mode for a container"
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["With ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Security"
          }), " configuration, you have the option to:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Secure you container resources"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Make container root filesystem read-only"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Add or drop security capabilities"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Specify a namespace to restrict the usage of containers to a group of users with defined privileges and ownership"
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "before-you-begin",
      children: "Before you begin"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Make sure you have:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/installation",
          children: "Installed Podman Desktop"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/podman/creating-a-podman-machine",
          children: "A running Podman machine"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "A developer role."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Created a docker file using the following code, if you do not have one on your machine:"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-dockerfile",
        children: "# syntax=docker/dockerfile:1\n\nARG NODE_VERSION\nARG ALPINE_VERSION\n\nFROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base\nWORKDIR /src\n\nFROM base AS build\nCOPY package*.json ./\nRUN npm ci\nRUN npm run build\n\nFROM base AS production\nCOPY package*.json ./\nRUN npm ci --omit=dev && npm cache clean --force\nCOPY --from=build /src/dist/ .\nCMD [\"node\", \"app.js\"]\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "building-an-image",
      children: "Building an image"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "Create a new container",
            src: (__webpack_require__(56022)/* ["default"] */ .A) + "",
            width: "1178",
            height: "525"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Build image from Containerfile"
          }), " page, provide the following details:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Containerfile path: Select the path where the container or docker file is placed."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Build context directory: The field automatically picks up the context directory based on the file path."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Image name: Enter the image name, if required."
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Build arguments: Pass the required arguments to build the image. This example uses arguments, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "NODE_VERSION"
            }), " and ", (0,jsx_runtime.jsx)(_components.code, {
              children: "ALPINE_VERSION"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Platform: Change the platform on which you want to build the image. The default platform is Intel and AMD x86_64 systems.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "Build an image from a containerfile",
              src: (__webpack_require__(5242)/* ["default"] */ .A) + "",
              width: "1952",
              height: "1260"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Build"
          }), ". The image starts to build."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Done"
          }), " once the image is built successfully."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the newly created image on the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Images"
          }), " page."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-container",
      children: "Creating a container"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Images"
          }), " in the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Run Image"
          }), " icon corresponding to the image you want to run. The ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create a container from image page"
          }), " opens.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running an image",
            src: (__webpack_require__(36844)/* ["default"] */ .A) + "",
            width: "1952",
            height: "446"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Configure the basic details of the container:\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "basic details of a container",
            src: (__webpack_require__(41136)/* ["default"] */ .A) + "",
            width: "2432",
            height: "1224"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Advanced"
          }), " tab to configure advanced details of the container:\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "advanced details of a container",
            src: (__webpack_require__(23788)/* ["default"] */ .A) + "",
            width: "2432",
            height: "1224"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Networking"
          }), " tab to configure the networking details of the container:\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "networking details of a container",
            src: (__webpack_require__(65748)/* ["default"] */ .A) + "",
            width: "2432",
            height: "1224"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Optional: Select the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Security"
          }), " tab to configure the security details of the container:\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "security details of a container",
            src: (__webpack_require__(25088)/* ["default"] */ .A) + "",
            width: "2432",
            height: "1224"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Start Container"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Check the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Container Details"
          }), " page for information, such as summary, logs, YAML code, and to access the terminal.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "container details page",
            src: (__webpack_require__(73659)/* ["default"] */ .A) + "",
            width: "2432",
            height: "1018"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "close"
          }), " icon on the right hand side of the page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the newly created container on the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " page."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-and-running-a-pod",
      children: "Creating and running a pod"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Containers"
          }), " from the left navigation pane."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Select the containers from the container list.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "selecting containers",
            src: (__webpack_require__(66314)/* ["default"] */ .A) + "",
            width: "2432",
            height: "658"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create Pod"
          }), ". The ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Copy containers to a pod"
          }), " page opens."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Change the name of the pod if required and click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Create Pod"
          }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "creating pods",
            src: (__webpack_require__(6258)/* ["default"] */ .A) + "",
            width: "2432",
            height: "826"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["View the newly created pod on the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Pods"
          }), " page."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Start Pod"
          }), " icon corresponding to the pod you created."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Check that the pod is running on the same page.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "running pod",
            src: (__webpack_require__(37087)/* ["default"] */ .A) + "",
            width: "1072",
            height: "215"
          })]
        }), "\n"]
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



/***/ }),

/***/ 23788:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/advanced-config-container-563bf8a672ec90dc564ad1efb2208a5d.png");

/***/ }),

/***/ 41136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/basic-config-container-c935b251ea9a74db43ced66947495630.png");

/***/ }),

/***/ 5242:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/build-image-from-containerfile-d842ceedd3110ec55205a6e64c2ced86.png");

/***/ }),

/***/ 73659:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/container-details-page-42130fb2c004a3970bed9c92d2c10b6a.png");

/***/ }),

/***/ 56022:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/create-a-new-container-c3419d57d22da0359935309ddd5c742c.png");

/***/ }),

/***/ 6258:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/creating-a-pod-1dcd8844fa8619b3ce915df9046eaf3e.png");

/***/ }),

/***/ 37087:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/my-pod-d0605843631636e62b1bf8baf34a981e.png");

/***/ }),

/***/ 65748:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/networking-config-container-29f121b925232c90f2124a1ddcd2f830.png");

/***/ }),

/***/ 36844:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/run-image-8e07bb1386f655e5b2d7730eafe69081.png");

/***/ }),

/***/ 25088:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/security-config-container-6355b3f3990f8db753ad03df3f7c33d2.png");

/***/ }),

/***/ 66314:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/selecting-containers-534731d085f40875fcb68de89e4d4e46.png");

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