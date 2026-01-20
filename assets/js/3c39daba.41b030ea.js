"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[2139],{

/***/ 13247:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_01_29_run_webassembly_wasm_workloads_windows_and_macos_md_3c3_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_01_29_run_webassembly_wasm_workloads_windows_and_macos_md_3c3_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5533);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(43023);
/* harmony import */ var _theme_Tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(78296);
/* harmony import */ var _theme_TabItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22491);


const frontMatter = {
	title: 'Unlock WebAssembly on macOS & Windows',
	description: 'Spinning a OCI container image containing a WebAssembly/Wasm workload on macOS or Windows should be as simple as running any other OCI image.',
	slug: 'wasm-workloads-on-macos-and-windows-with-podman',
	authors: [
		'benoitf'
	],
	tags: [
		'podman-desktop',
		'wasm',
		'wasi',
		'WebAssembly'
	],
	hide_table_of_contents: false,
	image: '/img/blog/run-webassembly-wasm-workloads-windows-and-macos/webassembly-podman.webp'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined],
};





const toc = [{
  "value": "What is WebAssembly ?",
  "id": "what-is-webassembly-",
  "level": 2
}, {
  "value": "The extension of WebAssembly",
  "id": "the-extension-of-webassembly",
  "level": 2
}, {
  "value": "Running WebAssembly outside the browser",
  "id": "running-webassembly-outside-the-browser",
  "level": 2
}, {
  "value": "Using Podman engine with Wasm",
  "id": "using-podman-engine-with-wasm",
  "level": 2
}, {
  "value": "Running Wasm workload with podman",
  "id": "running-wasm-workload-with-podman",
  "level": 2
}, {
  "value": "Setup",
  "id": "setup",
  "level": 3
}, {
  "value": "Running Wasm images",
  "id": "running-wasm-images",
  "level": 3
}, {
  "value": "Building Wasm OCI images with podman",
  "id": "building-wasm-oci-images-with-podman",
  "level": 2
}, {
  "value": "Building with a specific platform/architecture",
  "id": "building-with-a-specific-platformarchitecture",
  "level": 3
}, {
  "value": "Source code",
  "id": "source-code",
  "level": 3
}, {
  "value": "Building Wasm images",
  "id": "building-wasm-images",
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
    em: "em",
    h2: "h2",
    h3: "h3",
    hr: "hr",
    img: "img",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_4__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Seamlessly run WebAssembly/Wasm binaries on macOS and Windows"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "You might have heard excitement recently about Wasm and WASI. Imagine a world where you can effortlessly run Wasm binaries and distribute them using Open Container Initiative (OCI) container images – a singular image deployable across multiple architectures."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Though the concept seemed straightforward, accomplishing this task proved to be quite challenging, particularly on macOS and Windows. The complexity comes from the additional virtual machine running Linux. This machine needs all of the dependencies and prerequisites correctly setup."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The wait is over. Our blog post unveils the solution, guiding you through the process of enabling Wasm workloads on both macOS and Windows."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "hero",
        src: (__webpack_require__(957)/* ["default"] */ .A) + "",
        width: "960",
        height: "480"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "what-is-webassembly-",
      children: "What is WebAssembly ?"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://webassembly.org/",
        children: "WebAssembly"
      }), " (abbreviated Wasm) was designed as a portable compilation target for programming languages, improving performance and portability of web applications (including gaming/emulators). Using a low-level binary format instead of JavaScript boosts applications to have near-native performance."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The binary format serves as a compilation target and it allows to use a wider range of programming languages such as C, C++, and Rust. While it was a browser/client technology, now it is evolving beyond the web, for example being adapted for use as a back-end or edge technology (this is for example what happened to Java that was first designed for the client side before landing to the server side)."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The Wasm binary format was designed to be secure. Wasm modules are isolated from the rest of the system, and they cannot access any system resources without explicit permission. This makes Wasm modules very safe to run, even in untrusted environments. But on another hand, for developing backend applications, this restriction is limiting the usage of Wasm."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "the-extension-of-webassembly",
      children: "The extension of WebAssembly"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "WebAssembly System Interface (WASI) was born as an essential complement to WebAssembly."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "It is a system interface that extends WebAssembly's capabilities beyond the browser, making it suitable for a wider range of environments, including servers, edge devices, and more."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "While with Wasm you had limited access to the host resources, WASI provides a standard set of system calls, enabling WebAssembly modules to interact with the host operating system in a secure and consistent manner: it includes filesystem access, sockets, and other low-level resources."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "running-webassembly-outside-the-browser",
      children: "Running WebAssembly outside the browser"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Wasm has shipped in the major browser engines so the usage of Wasm is possible without any 3rd party addition in the browser land. But when it comes to the edge/system usage, you need to find a virtual machine to run these workloads supporting WASI extension. And there is not only one application to run them, there are several Wasm runtimes such as WasmEdge, Wasmtime, Wasmer, and so on. All runtimes support different CPU architectures."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Since WASI is still maturing some of the API provided in these runtimes has not reached the standard, so users need to be careful to write portable applications that do not depend on a given runtime."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Besides running Wasm/WASI workloads on your computer, there is also the question of how you package this binary format, share, and distribute it. A convenient way to distribute and run these workloads is to use OCI images as it provides all the basics: package, storage and distribution of the binaries. Then comes the execution part."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "using-podman-engine-with-wasm",
      children: "Using Podman engine with Wasm"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "When using containers with Podman on macOS or Windows, you have a virtual machine called a \"Podman machine\" that is executing a Linux environment. We need to add support for Wasm inside this Linux environment. Podman is using the crun project as its OCI runtime, so crun needs to be able to run or delegate execution to Wasm runtimes. Lucky for us, crun supports Wasm execution."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["From the user's point of view, support for Wasm is provided as an additional platform. So when executing a Wasm workload, we specify as a platform ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform=wasi/wasm"
      }), " instead of for example ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform=linux/arm64"
      }), " or ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform=linux/amd64"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "​"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "running-wasm-workload-with-podman",
      children: "Running Wasm workload with podman"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "setup",
      children: "Setup"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_theme_Tabs__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A, {
      groupId: "operating-systems",
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_theme_TabItem__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
        value: "win",
        label: "Windows",
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["On Windows, ensure that your podman machine is a recent one. You can check using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "podman version"
          }), " command."]
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Depending on the output of the command, you might have extra steps to do."
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
          children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
            children: "Client's version and server's side version >= v4.7.0: Nothing to do, Wasm support is already there using the wasmedge runtime by default."
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
            children: "Client's version >= 4.6.0 but server's side version < 4.7. You need to create a new podman machine using the command podman machine init --now wasm"
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
            children: ["Old client/old server (< 4.7.0) or podman not being installed: follow the getting started at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://podman.io",
              children: "podman.io"
            })]
          }), "\n"]
        })]
      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_theme_TabItem__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, {
        value: "mac",
        label: "macOS",
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
          children: ["On macOS, ensure that your podman machine is a recent one. You can check using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
            children: "podman version"
          }), " command. It requires v4.8+."]
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
          children: "Depending on the output of the command, you might have extra steps to do."
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul, {
          children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
            children: "Client's version and server's side version >= v4.8.0: Nothing to do, Wasm support is already there using the wasmedge runtime by default."
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li, {
            children: "Client's version >= 4.8.0 but server's side version < 4.8. You need to create a new podman machine using the command podman machine init --now wasm"
          }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.li, {
            children: ["Old client/old server (< 4.8.0) or podman not being installed: follow the getting started at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
              href: "https://podman.io",
              children: "podman.io"
            })]
          }), "\n"]
        })]
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "running-wasm-images",
      children: "Running Wasm images"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Let's try with a simple hello world sample."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We will use example coming from ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/redhat-developer/podman-desktop-demo/tree/main/wasm/rust-hello-world",
        children: "https://github.com/redhat-developer/podman-desktop-demo/tree/main/wasm/rust-hello-world"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "There is already an OCI image on quay.io"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "To run the workload, we will use the following command:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell-shession",
        children: "$ podman run --platform wasi/wasm quay.io/podman-desktop-demo/wasm-rust-hello-world\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["When running the command, you will see a Podman Hello World that was compiled using a Rust project using the println function and compiled into Wasm using ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--target wasm32-wasi"
      }), " parameter at compilation time."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Hello World example running",
        src: (__webpack_require__(51246)/* ["default"] */ .A) + "",
        width: "369",
        height: "286"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["you can omit the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform wasi/wasm"
      }), " flag but in that case you'll get a warning that the platform of the image is not matching the platform of your computer (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "WARNING: image platform (wasi/wasm) does not match the expected platform (linux/arm64)"
      }), ")"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "From this point, you can run other OCI images using Wasm workloads, not only the podman hello world sample."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
          children: "NOTE:"
        })
      }), " if you don't have the prerequisites installed in your podman machine you will see this error: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Error: requested OCI runtime crun-wasm is not available: invalid argument"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "In that case you should check that the prerequisites from the previous section are met."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "building-wasm-oci-images-with-podman",
      children: "Building Wasm OCI images with podman"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "building-with-a-specific-platformarchitecture",
      children: "Building with a specific platform/architecture"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Running Wasm workload is an interesting use case from a consumer point of view. It helps to consume Wasm binaries. But another interesting case is to distribute and build these Wasm images so anyone could run them quickly."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The goal is to have a minimal image containing only the Wasm binary. For that we will use a multi-stage build. First stage will be the platform to build/compile the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: ".wasm"
      }), " binary file and the second/last stage will copy the binary to a scratch image."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["When building images it will use by default the architecture of the host operating system. If you are using a Mac computer with ARM chip, then the Linux images will default to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "linux/arm64"
      }), ". Using a mac/intel it will default to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "linux/amd64"
      }), " images. In the case of Wasm workloads, the expected target platform is ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "wasi/wasm"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["With podman we can use the flag ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform=wasi/wasm"
      }), " on the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "podman build"
      }), " command to specify the system/architecture. But if we do that, it means that if the Dockerfile or Containerfile contains as base image ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "FROM docker.io/redhat/ubi9-minimal"
      }), " for example it will try to fetch a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "ubi9-minimal"
      }), " image using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "wasi/wasm"
      }), " platform but of course it does not exist."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["So we need to tweak the Containerfile to include a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform"
      }), " directive inside the Containerfile."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Example of Containerfile:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-Dockerfile",
        children: "FROM --platform=$BUILDPLATFORM docker.io/redhat/ubi9-minimal as builder\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Using this method, we will fetch an image matching our host architecture but as there is still the  ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "--platform=wasi/wasm"
      }), " on the command line, the resulting image will use the right platform."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "source-code",
      children: "Source code"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Here is a simple Containerfile to build a rust application using wasm32-wasi binary output and a multi-layer OCI image. One layer for the build (installing rust, dependencies and compiling the application) and one scratch layer where we only add the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: ".wasm"
      }), " output and flag it as the entrypoint."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Source code is available at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/redhat-developer/podman-desktop-demo/tree/main/wasm/rust-hello-world",
        children: "https://github.com/redhat-developer/podman-desktop-demo/tree/main/wasm/rust-hello-world"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Containerfile"
      }), " content:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-Dockerfile",
        children: "# Build using the host platform (and not target platform wasi/wasm)\nFROM --platform=$BUILDPLATFORM docker.io/redhat/ubi9-minimal as builder\n\n# install rust and Wasm/WASI target\nRUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \\\n    && source \"$HOME/.cargo/env\" && rustup target add wasm32-wasi\n\n# copy source code\nCOPY Cargo.toml /app/\nCOPY src /app/src \n\n# change working directory\nWORKDIR /app\n\n# Build\nRUN source \"$HOME/.cargo/env\" && cd /app && cargo build --target wasm32-wasi --release\n\n# now copy the Wasm binary and flag it as the entrypoint\nFROM scratch\nENTRYPOINT [ \"/rust-hello-world.wasm\" ]\nCOPY --from=builder /app/target/wasm32-wasi/release/rust-hello.wasm /rust-hello-world.wasm\n \n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Cargo.toml"
      }), " content:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-toml",
        children: "[package]\nname = \"rust-hello-world\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[[bin]]\nname = \"rust-hello\"\npath = \"src/main.rs\"\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["And the rust program ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "src/main.rs"
      }), ":"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-toml",
        children: "\n  fn main() {\n\n    // use of strings literal for multi-line string\n    // https://doc.rust-lang.org/reference/tokens.html#raw-string-literals\n\n    // ascii art from Máirín Duffy @mairin\n    let hello = r#\"\n!... Hello Podman Wasm World ...!\n\n         .--\"--.\n       / -     - \\\n      / (O)   (O) \\\n   ~~~| -=(,Y,)=- |\n    .---. /`  \\   |~~\n ~/  o  o \\~~~~.----. ~~\n  | =(X)= |~  / (O (O) \\\n   ~~~~~~~  ~| =(Y_)=-  |\n  ~~~~    ~~~|   U      |~~\n\nProject:   https://github.com/containers/podman\nWebsite:   https://podman.io\nDocuments: https://docs.podman.io\nTwitter:   @Podman_io\n\"#;\n    println!(\"{}\", hello);\n    \n  }\n\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["All the source code is available at ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/redhat-developer/podman-desktop-demo/tree/main/wasm/rust-hello-world",
        children: "https://github.com/redhat-developer/podman-desktop-demo/tree/main/wasm/rust-hello-world"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "building-wasm-images",
      children: "Building Wasm images"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Run the command from the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "wasm/rust-hello-world"
      }), " folder if you cloned the repository or from the directory where all the files are present."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman build --platform=wasi/wasm -t rust-hello-world-wasm .\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "example of output will be :"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-console",
        children: "[1/2] STEP 1/6: FROM docker.io/redhat/ubi9-minimal AS builder\nTrying to pull docker.io/redhat/ubi9-minimal:latest...\nGetting image source signatures\nCopying blob sha256:472e9d218c02b84dcd7425232d8b1ac2928602de2de0efc01a7360d1d42bf2f6\nCopying config sha256:317fc66dad246d1fac6996189a26f85554dc9fc92ca23bf1e7bf10e16ead7c8c\nWriting manifest to image destination\n[1/2] STEP 2/6: RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y     && source \"$HOME/.cargo/env\" && rustup target add wasm32-wasi\ninfo: downloading installer\ninfo: profile set to 'default'\ninfo: default host triple is aarch64-unknown-linux-gnu\ninfo: syncing channel updates for 'stable-aarch64-unknown-linux-gnu'\ninfo: latest update on 2023-10-05, rust version 1.73.0 (cc66ad468 2023-10-03)\ninfo: downloading component 'cargo'\ninfo: downloading component 'clippy'\ninfo: downloading component 'rust-docs'\ninfo: downloading component 'rust-std'\ninfo: downloading component 'rustc'\ninfo: downloading component 'rustfmt'\ninfo: installing component 'cargo'\ninfo: installing component 'clippy'\ninfo: installing component 'rust-docs'\ninfo: installing component 'rust-std'\ninfo: installing component 'rustc'\ninfo: installing component 'rustfmt'\ninfo: default toolchain set to 'stable-aarch64-unknown-linux-gnu'\n\n  stable-aarch64-unknown-linux-gnu installed - rustc 1.73.0 (cc66ad468 2023-10-03)\n\n\nRust is installed now. Great!\n\nTo get started you may need to restart your current shell.\nThis would reload your PATH environment variable to include\nCargo's bin directory ($HOME/.cargo/bin).\n\nTo configure your current shell, run:\nsource \"$HOME/.cargo/env\"\ninfo: downloading component 'rust-std' for 'wasm32-wasi'\ninfo: installing component 'rust-std' for 'wasm32-wasi'\n--> c93a3433d432\n[1/2] STEP 3/6: COPY Cargo.toml /app/\n--> cf4488993835\n[1/2] STEP 4/6: COPY src /app/src\n--> 531b9389857c\n[1/2] STEP 5/6: WORKDIR /app\n--> 23379392f585\n[1/2] STEP 6/6: RUN source \"$HOME/.cargo/env\" && cd /app && cargo build --target wasm32-wasi --release\n   Compiling rust-hello-world v0.1.0 (/app)\n    Finished release [optimized] target(s) in 0.15s\n--> e3582e06f45b\n[2/2] STEP 1/3: FROM scratch\n[2/2] STEP 2/3: ENTRYPOINT [ \"/rust-hello-world.wasm\" ]\n--> 069b1742d906\n[2/2] STEP 3/3: COPY --from=builder /app/target/wasm32-wasi/release/rust-hello.wasm /rust-hello-world.wasm\n[2/2] COMMIT rust-hello-world-wasm\n--> e0948298c0be\nSuccessfully tagged localhost/rust-hello-world-wasm:latest\ne0948298c0be20e11da5d92646a2d6453f05e66671f72f0f792c1e1ff8de75ba\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This is a multi-stage build but at the end we only have a small image containing the Wasm binary."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Launch it quickly using"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-shell-session",
        children: "$ podman run rust-hello-world-wasm\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "and we'll see the expected output"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-console",
        children: "WARNING: image platform (wasi/wasm/v8) does not match the expected platform (linux/arm64)\n\n!... Hello Podman Wasm World ...!\n\n         .--\"--.\n       / -     - \\\n      / (O)   (O) \\\n   ~~~| -=(,Y,)=- |\n    .---. /`  \\   |~~\n ~/  o  o \\~~~~.----. ~~\n  | =(X)= |~  / (O (O) \\\n   ~~~~~~~  ~| =(Y_)=-  |\n  ~~~~    ~~~|   U      |~~\n\nProject:   https://github.com/containers/podman\nWebsite:   https://podman.io\nDocuments: https://docs.podman.io\nTwitter:   @Podman_io\n\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "​"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "After witnessing the seamless execution and creation of WebAssembly (Wasm) workloads on both Windows and macOS through the utilization of podman, the possibilities are at your fingertips."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Now, the initiative lies with you to embark on your journey of exploring, experimenting, and pushing the boundaries."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Run and build new examples and do not hesitate to contribute to the podman community by reporting and discussing these issues."
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_4__/* .useMDXComponents */ .R)(),
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

/***/ 957:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/webassembly-podman-e40f6760fbeda109aa109b4a4d926f40.webp");

/***/ }),

/***/ 51246:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/wasm-hello-world-99612b86e6bdb59de87cb1e150e42a37.png");

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

/***/ 5533:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/wasm-workloads-on-macos-and-windows-with-podman","source":"@site/blog/2024-01-29-run-webassembly-wasm-workloads-windows-and-macos.md","title":"Unlock WebAssembly on macOS & Windows","description":"Spinning a OCI container image containing a WebAssembly/Wasm workload on macOS or Windows should be as simple as running any other OCI image.","date":"2024-01-29T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"wasm","permalink":"/blog/tags/wasm"},{"inline":true,"label":"wasi","permalink":"/blog/tags/wasi"},{"inline":true,"label":"WebAssembly","permalink":"/blog/tags/web-assembly"}],"readingTime":11.27,"hasTruncateMarker":true,"authors":[{"name":"Florent Benoit","title":"Principal Software Engineer","url":"https://github.com/benoitf","imageURL":"https://github.com/benoitf.png","key":"benoitf","page":null}],"frontMatter":{"title":"Unlock WebAssembly on macOS & Windows","description":"Spinning a OCI container image containing a WebAssembly/Wasm workload on macOS or Windows should be as simple as running any other OCI image.","slug":"wasm-workloads-on-macos-and-windows-with-podman","authors":["benoitf"],"tags":["podman-desktop","wasm","wasi","WebAssembly"],"hide_table_of_contents":false,"image":"/img/blog/run-webassembly-wasm-workloads-windows-and-macos/webassembly-podman.webp"},"unlisted":false,"prevItem":{"title":"Podman Desktop Wins 2024 DEVIES Award","permalink":"/blog/podman-desktop-wins-devies-award"},"nextItem":{"title":"Podman Desktop 1.7 Release","permalink":"/blog/podman-desktop-release-1.7"}}');

/***/ })

}]);