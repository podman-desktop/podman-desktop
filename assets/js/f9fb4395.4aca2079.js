"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[12065],{

/***/ 19489:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_12_06_sharing_podman_images_with_kubernetes_cluster_md_f9f_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2023_12_06_sharing_podman_images_with_kubernetes_cluster_md_f9f_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61811);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Share your local podman images with the Kubernetes cluster',
	description: 'Build image and use it directly in your kubernetes cluster',
	slug: 'sharing-podman-images-with-kubernetes-cluster',
	authors: [
		'benoitf'
	],
	tags: [
		'podman-desktop',
		'podman',
		'images',
		'kubernetes'
	],
	hide_table_of_contents: false,
	image: '/img/blog/sharing-podman-images-with-kubernetes-cluster/selkie-family.png'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Introduction",
  "id": "introduction",
  "level": 2
}, {
  "value": "podman and kubernetes/cri-o",
  "id": "podman-and-kubernetescri-o",
  "level": 2
}, {
  "value": "Minikube to the rescue",
  "id": "minikube-to-the-rescue",
  "level": 2
}, {
  "value": "kind",
  "id": "kind",
  "level": 3
}, {
  "value": "Minikube",
  "id": "minikube",
  "level": 3
}, {
  "value": "Minikube options",
  "id": "minikube-options",
  "level": 4
}, {
  "value": "Minikube kicbase image",
  "id": "minikube-kicbase-image",
  "level": 4
}, {
  "value": "Trying out cri-o using the podman machine storage folder",
  "id": "trying-out-cri-o-using-the-podman-machine-storage-folder",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Conclusion",
  "id": "conclusion",
  "level": 3
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
    ol: "ol",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "As developers we constantly improve and refine our applications. One of the challenges we face is quickly iterating when working with container images and kubernetes deployments/pods."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["For example, when we want to try a new image in a kubernetes pod, this image needs to be available on a private/public registry or on the nodes of the kubernetes cluster.\nSometimes we need to call extra commands such as ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "kind load docker-image"
      }), " or ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "minikube cache add <image>"
      }), " or publish the image first to a 3rd party registry."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "You'll agree that trying out a new image in a Kubernetes pod should be as seamless as building the image itself."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In this blog post, we will explore the best practice for streamlining the image iteration process in Kubernetes with Podman Desktop."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "hero",
        src: (__webpack_require__(23748)/* ["default"] */ .A) + "",
        width: "1920",
        height: "1080"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "introduction",
      children: "Introduction"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "When using kind or minikube or other 3rd party tools to setup a local kubernetes cluster, we have several ways to publish images."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Minikube published 8 ways of doing that at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://minikube.sigs.k8s.io/docs/handbook/pushing/",
        children: "https://minikube.sigs.k8s.io/docs/handbook/pushing/"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["There are pros and cons either way. Using a third party registry implies that you need to publish the image after each build of the image before being able to use it in the kubernetes cluster. While Podman Desktop could automate the synchronization between the local registry (where you are doing ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "podman build"
      }), ") and the third party registry, there remains a duplication of layers between the local and third party registry. And if you change the first layer, it can take a lot of time to send again all the data."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Loading images requires to pack/unpack the files so it's not adequate for large images."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Minikube offers a Podman environment, but it's important to note that it utilizes version 3.4 inside a container within the Podman machine. This implies the existence of two Podman instances."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The 3.4 version is considerably outdated and do not provide new enhancements and support towards compose, compliance with Docker REST API and 3rd party tools."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Could we just build the image and use it in kubernetes?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "podman-and-kubernetescri-o",
      children: "podman and kubernetes/cri-o"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In the kubernetes world, we need a container engine runtime. At the early stage, container runtimes were integrated with ad hoc solutions on top of docker, rkt, or others."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["But to separate concerns and to be extensible, a new interface was added: CRI for \"Container Runtime Interface\". Using the CRI interface we can plug container engines. And there are several runtimes such as containerd, cri-o and others.\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md",
        children: "https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["What is interesting to us is the cri-o project. This project is implementing the CRI interface but also adopting some projects of the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers",
        children: "containers"
      }), " organization where ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman",
        children: "podman"
      }), " and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop",
        children: "podman-desktop"
      }), " live."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["So it means cri-o uses image management from ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/image",
        children: "https://github.com/containers/image"
      }), " project and handle storage with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/storage",
        children: "https://github.com/containers/storage"
      }), " project."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["And this is what is really interesting as a podman user. As it is using common libraries between cri-o and podman, it means that in the same environment, podman and cri-o read and write the images at a common location in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/lib/containers"
      }), " folder."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["If we move one step ahead, if we mount the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/lib/containers"
      }), " folder of podman into the cri-o container it means that the kubernetes cluster could find the images that the podman machine is building."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Oh wait, it means that no more registry, additional steps would be required? Yes just build and load it."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "minikube-to-the-rescue",
      children: "Minikube to the rescue"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "While we have the goal of using both cri-o and podman altogether, we can explore the current projects allowing us to quickly setup kubernetes clusters."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "kind",
      children: "kind"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["On the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "kind"
      }), " side, there is a default configuration that is using containerd and there is no plan to support an alternative such as cri-o ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/kubernetes-sigs/kind/issues/1369#issuecomment-867440704",
        children: "https://github.com/kubernetes-sigs/kind/issues/1369#issuecomment-867440704"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["That said, some people try to maintain a way to do that but not officialy ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://gist.github.com/aojea/bd1fb766302779b77b8f68fa0a81c0f2",
        children: "https://gist.github.com/aojea/bd1fb766302779b77b8f68fa0a81c0f2"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["By doing that, we would also need to mount ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/lib/containers"
      }), " folder from the host (the podman machine) to the container. And there is no easy flag in kind."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "minikube",
      children: "Minikube"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h4, {
      id: "minikube-options",
      children: "Minikube options"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Minikube supports more options and provides a way to select the container engine runtime. And it includes support for cri-o."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We can use the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "container-runtime"
      }), " parameter and ask for ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "cri-o"
      }), " runtime. Command-line should include ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--container-runtime=cri-o"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Then, we do have a podman/cri-o environment inside the container and can use ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "eval $(minikube podman-env)"
      }), " to use the Windows/macOS podman CLI."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "One issue is that we then have two 'Podman engines': one running inside the Podman machine and another one running inside the container. The Podman included in the container is using version 3.4, as it's on Debian/Ubuntu stable, while the recent version of Podman is 4.7.x."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Can we mount the podman machine ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/lib/containers"
      }), " into the container ?"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Yes! minikube provides some options to do additional mount with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--mount-string"
      }), " argument. It is not obvious but you also need to add the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--mount"
      }), " in addition to this parameter. Full argument is ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--mount --mount-string \"<host-path:container-path>\""
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["But ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var"
      }), " is already a mounted folder. So here the idea is to change the path of where cri-o is storing its data."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["So we can provide a custom mounted path and make cri-o use that custom location. Let's pickup ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/host-containers"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["When starting minikube we need then to add ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--mount --mount-string \"/var/lib/containers:/host-containers\""
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Regarding the configuration of cri-o, currently, it's not achievable using Minikube options. However, Minikube does offer the flexibility to modify the base image."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h4, {
      id: "minikube-kicbase-image",
      children: "Minikube kicbase image"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Let's do our own base image named kicbase image."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Minikube includes a default configuration file for cri-o.\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/kubernetes/minikube/blob/v1.32.0/deploy/kicbase/02-crio.conf",
        children: "https://github.com/kubernetes/minikube/blob/v1.32.0/deploy/kicbase/02-crio.conf"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We need to change this default configuration to say that for storing the images, cri-o needs to use another directory. This new directory ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/host-containers"
      }), " will be mounted from the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/lib/containers"
      }), " folder inside the podman machine. This is how cri-o is able to see podman images."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Let's include the configuration part in this file."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-toml",
        children: "[crio]\nroot = \"/host-containers/storage\"\nrunroot = \"/host-containers/storage\"\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Let's also upgrade the Podman inside the container by adding the necessary instruction to the Dockerfile."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The Dockerfile is coming from ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/kubernetes/minikube/blob/v1.32.0/deploy/kicbase/Dockerfile#L178-L186",
        children: "https://github.com/kubernetes/minikube/blob/v1.32.0/deploy/kicbase/Dockerfile#L178-L186"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In the file, replace"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-Dockerfile",
        children: "RUN clean-install podman && \\\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "with"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-Dockerfile",
        children: "RUN sh -c \"echo 'deb https://downloadcontent.opensuse.org/repositories/devel:/kubic:/libcontainers:/unstable/xUbuntu_22.04/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:unstable.list\" && \\\n    curl -LO https://downloadcontent.opensuse.org/repositories/devel:kubic:libcontainers:unstable/xUbuntu_22.04/Release.key && \\\n    apt-key add - < Release.key && \\\n    # need to add dbus-user-session else we have\n    # cannot open sd-bus: No such file or directory: OCI runtime attempted to invoke a command that was not found\n    clean-install dbus-user-session podman && \\\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Let's rebuild the image and publish it. You can find it at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "quay.io/fbenoit/kicbase:multiarch-2023-11-06"
      }), " .\nTo build the image, clone ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/kubernetes/minikube",
        children: "https://github.com/kubernetes/minikube"
      }), " repository, and edit the files referenced before."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The command to build the kicbase image is ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "make local-kicbase"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h4, {
      id: "trying-out-cri-o-using-the-podman-machine-storage-folder",
      children: "Trying out cri-o using the podman machine storage folder"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["At the time of writing this blog post, the version ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "v1.32.0-beta.0"
      }), " has been used. For different versions you might need to build your own kicbase image."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["One crucial note: cri-o is running in root mode, this is why we mount to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/var/lib/containers"
      }), " (and then in rootful mode)."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "For simplicity, let's use a rootful podman machine to map the same folder at the two locations."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Ok now let's try in two steps:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Create a podman machine:"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "podman machine init --cpus 4 --memory 6000 --rootful\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ol, {
      start: "2",
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Start the cluster using our kicbase image"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We specify Podman as the driver (the default is Docker), state our preference to use cri-o as the container runtime instead of containerd, use our custom image that performs the update of Podman's version and the modification of cri-o's configuration to use a different storage folder. Finally, we specify an additional mount."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "minikube start --driver=podman --container-runtime=cri-o --base-image=quay.io/fbenoit/kicbase:multiarch-2023-11-06 --mount --mount-string \"/var/lib/containers:/host-containers\"\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Assuming the cluster was able to start, there is a new kubernetes cluster configured in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "$HOME/.kube/config"
      }), " file."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Using ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "kubectl"
      }), " we can start a deployment"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "kubectl apply -f https://k8s.io/examples/application/deployment.yaml\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "you can check pods are running using"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "kubectl get pods -l app=nginx\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "and if you check your podman images"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "podman images\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "you'll see nginx being listed so images are shared."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Now, you can build image using a Containerfile or pull an image, connect to the control plane instance in Podman Desktop (open a shell in minikube container) and run"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "crictl images\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "It will list the images of podman"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Note: by default, kubernetes will use the image pull policy ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Always"
      }), " using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "latest"
      }), " tag on your image. So it might try to fetch/pull/refresh the image you built locally. Use a specific tag or change the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "imagePullPolicy"
      }), " to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "IfNotPresent"
      }), " in your deployments."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["You can now use your own Containerfile/Dockerfile and build an image using ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "podman build"
      }), " command. And then check that the image is available as well in the kubernetes cluster by listing images:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell",
        children: "crictl images\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We have explored how developers can significantly reduce turnaround times by integrating Podman and Kubernetes seamlessly."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Now, let's experiment with it and provide feedback through the Podman Desktop issue tracker at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop/issues/",
        children: "https://github.com/containers/podman-desktop/issues/"
      }), " ."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Here are the next steps Podman Desktop plans to take to enhance ease of use for users:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "To make things easier, automate the process by adding this setup to a creation wizard."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Collaborate with upstream Minikube project to simplify choices and remove the requirement for customized kicbase images."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
        children: "Enhancing the overall user-friendliness of the solution for an improved developer experience."
      }), "\n"]
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

/***/ 23748:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/selkie-family-1b33ecd1c85565d5af69c52a03180a61.png");

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

/***/ 61811:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/sharing-podman-images-with-kubernetes-cluster","source":"@site/blog/2023-12-06-sharing-podman-images-with-kubernetes-cluster.md","title":"Share your local podman images with the Kubernetes cluster","description":"Build image and use it directly in your kubernetes cluster","date":"2023-12-06T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"podman","permalink":"/blog/tags/podman"},{"inline":true,"label":"images","permalink":"/blog/tags/images"},{"inline":true,"label":"kubernetes","permalink":"/blog/tags/kubernetes"}],"readingTime":8.87,"hasTruncateMarker":true,"authors":[{"name":"Florent Benoit","title":"Principal Software Engineer","url":"https://github.com/benoitf","imageURL":"https://github.com/benoitf.png","key":"benoitf","page":null}],"frontMatter":{"title":"Share your local podman images with the Kubernetes cluster","description":"Build image and use it directly in your kubernetes cluster","slug":"sharing-podman-images-with-kubernetes-cluster","authors":["benoitf"],"tags":["podman-desktop","podman","images","kubernetes"],"hide_table_of_contents":false,"image":"/img/blog/sharing-podman-images-with-kubernetes-cluster/selkie-family.png"},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.6 Release","permalink":"/blog/podman-desktop-release-1.6"},"nextItem":{"title":"Podman Desktop 1.5 Release","permalink":"/blog/podman-desktop-release-1.5"}}');

/***/ })

}]);