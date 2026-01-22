"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[86219],{

/***/ 22491
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


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

/***/ },

/***/ 26076
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_podman_gpu_md_b75_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-podman-gpu-md-b75.json
const site_docs_podman_gpu_md_b75_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"podman/gpu","title":"GPU container access","description":"GPU passthrough utilization within Windows, macOS and Linux","source":"@site/docs/podman/gpu.md","sourceDirName":"podman","slug":"/podman/gpu","permalink":"/docs/podman/gpu","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/podman/gpu.md","tags":[],"version":"current","sidebarPosition":20,"frontMatter":{"sidebar_position":20,"title":"GPU container access","description":"GPU passthrough utilization within Windows, macOS and Linux"},"sidebar":"mySidebar","previous":{"title":"Creating a Podman machine","permalink":"/docs/podman/creating-a-podman-machine"},"next":{"title":"Native Apple Rosetta translation layer (macOS)","permalink":"/docs/podman/rosetta"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js + 2 modules
var Tabs = __webpack_require__(78296);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js + 1 modules
var TabItem = __webpack_require__(22491);
;// ./docs/podman/gpu.md


const frontMatter = {
	sidebar_position: 20,
	title: 'GPU container access',
	description: 'GPU passthrough utilization within Windows, macOS and Linux'
};
const contentTitle = 'GPU container access';

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
  "value": "Troubleshooting",
  "id": "troubleshooting",
  "level": 4
}, {
  "value": "Version mismatch",
  "id": "version-mismatch",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources",
  "level": 4
}, {
  "value": "Prerequisites",
  "id": "prerequisites-1",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure-1",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification-1",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources-1",
  "level": 4
}, {
  "value": "Prerequisites",
  "id": "prerequisites-2",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure-2",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification-2",
  "level": 4
}, {
  "value": "Additional resources",
  "id": "additional-resources-2",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
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
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "gpu-container-access",
        children: "GPU container access"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Leveraging GPU capabilities within a Podman container provides a powerful and efficient method for running GPU-accelerated workloads. Below are instructions on how to get started setting up your OS to utilize the GPU."
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      children: [(0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        className: "markdown",
        children: [(0,jsx_runtime.jsx)(_components.h4, {
          id: "prerequisites",
          children: "Prerequisites"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "NVIDIA Graphics Card (Pascal or later)"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "WSL2 (Hyper-V is not supported)"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "procedure",
          children: "Procedure"
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["The ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://www.nvidia.com/Download/index.aspx",
                children: "most up-to-date NVIDIA GPU Driver"
              }), " will support WSL 2. You are not required to download anything else on your host machine for your NVIDIA card."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.a, {
                href: "/docs/installation/windows-install",
                children: "Verify that WSL2 was installed when installing Podman Desktop."
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.a, {
                href: "/docs/podman/creating-a-podman-machine",
                children: "Create your Podman Machine."
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Install NVIDIA Container Toolkit onto the Podman Machine:"
            }), "\n"]
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Podman Machine requires the NVIDIA Container Toolkit to be installed."
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["This can be installed by following the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-with-yum-or-dnf",
            children: "official NVIDIA guide"
          }), " or running the steps below:"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "SSH into the Podman Machine:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$ podman machine ssh\n"
          })
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run the following commands ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "on the Podman Machine, not the host system"
          }), ":"]
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$ curl -s -L https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo | \\\n tee /etc/yum.repos.d/nvidia-container-toolkit.repo && \\\n yum install -y nvidia-container-toolkit && \\\n nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml && \\\n nvidia-ctk cdi list\n"
          })
        }), (0,jsx_runtime.jsx)(_components.admonition, {
          type: "info",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "A configuration change might occur when you create or remove Multi-Instance GPU (MIG) devices, or upgrade the Compute Unified Device Architecture (CUDA) driver. In such cases, you must generate a new Container Device Interface (CDI) specification."
          })
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "verification",
          children: "Verification"
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["To verify that containers created can access the GPU, you can use ", (0,jsx_runtime.jsx)(_components.code, {
            children: "nvidia-smi"
          }), " from within a container with NVIDIA drivers installed."]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following official NVIDIA container on your host machine:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$ podman run --rm --device nvidia.com/gpu=all nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Example output:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "PS C:\\Users\\admin>  podman run --rm --device nvidia.com/gpu=all nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi\nFri Aug 16 18:58:14 2024\n+---------------------------------------------------------------------------------------+\n| NVIDIA-SMI 545.36                 Driver Version: 546.33       CUDA Version: 12.3     |\n|-----------------------------------------+----------------------+----------------------+\n| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |\n| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |\n|                                         |                      |               MIG M. |\n|=========================================+======================+======================|\n|   0  NVIDIA GeForce RTX 3060        On  | 00000000:07:00.0  On |                  N/A |\n|  0%   34C    P8              20W / 170W |    886MiB / 12288MiB |      1%      Default |\n|                                         |                      |                  N/A |\n+-----------------------------------------+----------------------+----------------------+\n\n+---------------------------------------------------------------------------------------+\n| Processes:                                                                            |\n|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |\n|        ID   ID                                                             Usage      |\n|=======================================================================================|\n|    0   N/A  N/A        33      G   /Xwayland                                 N/A      |\n+---------------------------------------------------------------------------------------+\n"
          })
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "troubleshooting",
          children: "Troubleshooting"
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "version-mismatch",
          children: "Version mismatch"
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "You might encounter the following error inside the containers:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-console",
            children: "# nvidia-smi\nFailed to initialize NVML: N/A\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "This problem is related to a mismatch between the Container Device Interface (CDI) and the installed version."
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "To fix this problem, generate a new CDI specification by running the following inside the Podman machine:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell",
            children: "nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml\n"
          })
        }), (0,jsx_runtime.jsx)(_components.admonition, {
          type: "info",
          children: (0,jsx_runtime.jsx)(_components.p, {
            children: "You might need to restart your Podman machine."
          })
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "additional-resources",
          children: "Additional resources"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-with-yum-or-dnf",
              children: "NVIDIA Container Toolkit Installation"
            })
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "macOS",
        label: "macOS (Apple silicon)",
        className: "markdown",
        children: [(0,jsx_runtime.jsx)(_components.h4, {
          id: "prerequisites-1",
          children: "Prerequisites"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Mac with Apple silicon (M1 or later)"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "procedure-1",
          children: "Procedure"
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.strong, {
            children: "Important to note"
          }), " that using the \"Metal\" GPU on macOS utilizes specialized software to achieve this. Specifically a ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "virtualized GPU"
          }), " from within the Podman Machine that provides translation support from ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://www.vulkan.org/",
            children: "Vulkan"
          }), " and ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://github.com/KhronosGroup/MoltenVK",
            children: "MoltenVK"
          }), " calls to MSL (Metal Shading Language), Apples GPU."]
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Create a Podman Machine that uses ", (0,jsx_runtime.jsx)(_components.code, {
              children: "libkrun"
            }), ":"]
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "libkrun",
            src: (__webpack_require__(74839)/* ["default"] */ .A) + "",
            width: "1406",
            height: "1150"
          })
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "verification-1",
          children: "Verification"
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Using the GPU functionality requires a specialized Containerfile containing a ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://copr.fedorainfracloud.org/coprs/slp/mesa-krunkit/",
            children: "patched MESA driver"
          }), "."]
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Create the following Containerfile:"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-Dockerfile",
            children: "FROM fedora:40\nUSER 0\n\nRUN dnf -y install dnf-plugins-core && \\\n    dnf -y install dnf-plugin-versionlock && \\\n    dnf -y install mesa-vulkan-drivers vulkan-loader-devel vulkan-headers vulkan-tools vulkan-loader glslc --setopt=install_weak_deps=False && \\\n    dnf -y copr enable slp/mesa-krunkit fedora-40-aarch64 && \\\n    dnf -y downgrade mesa-vulkan-drivers.aarch64 --repo=copr:copr.fedorainfracloud.org:slp:mesa-krunkit && \\\n    dnf versionlock mesa-vulkan-drivers && \\\n    dnf clean all && rm -rf /var/cache/dnf\n"
          })
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          start: "2",
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Build the image:"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "build_libkrun_image",
            src: (__webpack_require__(64238)/* ["default"] */ .A) + "",
            width: "1050",
            height: "700"
          })
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          start: "3",
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Verify you can see the GPU by running a test container:"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$  podman run --rm -it --device /dev/dri --name gpu-info <gpu-container-image>  vulkaninfo | grep \"GPU\"\n"
          })
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Example output:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$  podman run --rm -it --device /dev/dri --name gpu-info quay.io/slopezpa/fedora-vgpu vulkaninfo | grep \"GPU\"\n  GPU id = 0 (Virtio-GPU Venus (Apple M1 Pro))\n  GPU id = 1 (llvmpipe (LLVM 17.0.6, 128 bits))\nGPU0:\n deviceType        = PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU\n deviceName        = Virtio-GPU Venus (Apple M1 Pro)\nGPU1:\n"
          })
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "additional-resources-1",
          children: "Additional resources"
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Important note that the virtualized GPU (Virtio-GPU Venus (Apple M1 Pro)) only supports vulkan compute shaders, not rendering / draw. For more information on the available GPU features, see ", (0,jsx_runtime.jsx)(_components.code, {
            children: "vulkaninfo"
          }), " from within the container."]
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://sinrega.org/2024-03-06-enabling-containers-gpu-macos/",
              children: "Enabling containers to access the GPU on macOS"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/containers/libkrun",
              children: "libkrun"
            })
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        className: "markdown",
        children: [(0,jsx_runtime.jsx)(_components.h4, {
          id: "prerequisites-2",
          children: "Prerequisites"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "NVIDIA Graphics Card (Pascal or later)"
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "procedure-2",
          children: "Procedure"
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Install the latest NVIDIA GPU Driver for your OS."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Follow the instructions on ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
                children: "installing the NVIDIA Container Toolkit"
              }), " in relation to your Linux distribution."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Generate the CDI Specification file for Podman:"
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "This file is saved either to /etc/cdi or /var/run/cdi on your Linux distribution and is used for Podman to detect your GPU(s)."
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Generate the CDI file:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-sh",
                children: "$ nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml\n"
              })
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Check the list of generated devices:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-sh",
                children: "$ nvidia-ctk cdi list\n"
              })
            }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["More information as well as troubleshooting tips can be found ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html",
                children: "on the official NVIDIA CDI guide"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Configure SELinux (if applicable)"
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "On SELinux-enabled operating systems, such as the Fedora family, the default policy usually disallows containers to have direct access to devices. We make sure it's allowed."
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Check whether SELinux is installed and enabled:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-sh",
                children: "$ getenforce\n"
              })
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                  children: ["If ", (0,jsx_runtime.jsx)(_components.code, {
                    children: "getenforce"
                  }), " is not found or its output is ", (0,jsx_runtime.jsx)(_components.code, {
                    children: "Permissive"
                  }), " or ", (0,jsx_runtime.jsx)(_components.code, {
                    children: "Disabled"
                  }), ", no action is needed."]
                }), "\n"]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                  children: ["If the output is ", (0,jsx_runtime.jsx)(_components.code, {
                    children: "Enforcing"
                  }), ", configure SELinux to enable device access for containers:"]
                }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-sh",
                    children: "$ sudo setsebool -P container_use_devices true\n"
                  })
                }), "\n"]
              }), "\n"]
            }), "\n"]
          }), "\n"]
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "verification-2",
          children: "Verification"
        }), (0,jsx_runtime.jsxs)(_components.p, {
          children: ["To verify that containers created can access the GPU, you can use ", (0,jsx_runtime.jsx)(_components.code, {
            children: "nvidia-smi"
          }), " from within a container with NVIDIA drivers installed."]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following official NVIDIA container on your host machine:"
        }), (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "$ podman run --rm --device nvidia.com/gpu=all nvidia/cuda:11.0.3-base-ubuntu20.04 nvidia-smi\n"
          })
        }), (0,jsx_runtime.jsx)(_components.h4, {
          id: "additional-resources-2",
          children: "Additional resources"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html",
              children: "NVIDIA CDI guide"
            })
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-with-yum-or-dnf",
              children: "NVIDIA Container Toolkit installation"
            })
          }), "\n"]
        })]
      })]
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

/***/ 64238
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/build_image-1b5bd1a6506009cced1a375950f2f426.png");

/***/ },

/***/ 74839
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/libkrun-c0337f5410b62c5206b00b9e25a47518.png");

/***/ },

/***/ 78296
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


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

/***/ }

}]);