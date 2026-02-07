"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[94365],{

/***/ 31939
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_proxy_index_md_cd2_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-proxy-index-md-cd2.json
const site_docs_proxy_index_md_cd2_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"proxy/index","title":"Restricted environments","description":"Using Podman Desktop behind a proxy requiring custom Certificate Authorities (CA).","source":"@site/docs/proxy/index.md","sourceDirName":"proxy","slug":"/proxy/","permalink":"/docs/proxy/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/proxy/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"installing","permalink":"/docs/tags/installing"},{"inline":true,"label":"windows","permalink":"/docs/tags/windows"},{"inline":true,"label":"macos","permalink":"/docs/tags/macos"},{"inline":true,"label":"linux","permalink":"/docs/tags/linux"}],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"title":"Restricted environments","description":"Using Podman Desktop behind a proxy requiring custom Certificate Authorities (CA).","tags":["podman-desktop","installing","windows","macos","linux"],"keywords":["podman desktop","containers","podman","installing","installation","windows","macos","linux"]},"sidebar":"mySidebar","previous":{"title":"Installing on RHEL 10","permalink":"/docs/installation/linux-install/install-on-rhel10"},"next":{"title":"Configuration","permalink":"/docs/configuration/"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js + 2 modules
var Tabs = __webpack_require__(78296);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js + 1 modules
var TabItem = __webpack_require__(22491);
;// ./docs/proxy/index.md


const frontMatter = {
	sidebar_position: 2,
	title: 'Restricted environments',
	description: 'Using Podman Desktop behind a proxy requiring custom Certificate Authorities (CA).',
	tags: [
		'podman-desktop',
		'installing',
		'windows',
		'macos',
		'linux'
	],
	keywords: [
		'podman desktop',
		'containers',
		'podman',
		'installing',
		'installation',
		'windows',
		'macos',
		'linux'
	]
};
const contentTitle = 'Installing in a restricted environment';

const assets = {

};





const toc = [{
  "value": "Installing Podman Desktop and Podman",
  "id": "installing-podman-desktop-and-podman",
  "level": 2
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Using a proxy",
  "id": "using-a-proxy",
  "level": 2
}, {
  "value": "Verification",
  "id": "verification-1",
  "level": 4
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
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
  }, {Details, Icon} = _components;
  if (!Details) _missingMdxReference("Details", true);
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "installing-in-a-restricted-environment",
        children: "Installing in a restricted environment"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "In a restricted environment you might face the following challenges:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The default Podman Desktop and Podman installation methods download assets during the setup."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "However, a network restricted environment might refuse access to these external resources."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Consider rather using the restricted environment installation method."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The Podman Machine receives a network address distinct to your computer network address."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "When you are using a VPN, you might have problems to access, from your host, resources that the Podman Machine exposes."
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Consider enabling the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "User mode networking"
          }), " option when creating your Podman Machine to route the network traffic through your host."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The Podman Machine connects directly to the external network."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "However, a restricted environment might block all traffic no going to a proxy."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Consider configuring Podman Desktop and your Podman Machine to route the traffic through a proxy."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial is guiding you through the required steps to work in a restricted environment."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop-and-podman",
      children: "Installing Podman Desktop and Podman"
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      groupId: "operating-systems",
      children: [(0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        children: [(0,jsx_runtime.jsxs)(_components.p, {
          children: ["The Windows ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Installer for restricted environments"
          }), " has all artifacts required to install Podman Desktop and Podman. It does not require Internet access to download resources during installation.\nHowever, it does not contain additional utilities, such as Compose or Kind."]
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Check that your environment has:"
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "6 GB RAM for the Podman Machine."
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Windows Subsystem for Linux version 2 (WSL 2) prerequisites. See ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://docs.microsoft.com/en-us/windows/wsl/install",
                  children: "Enabling WSL 2"
                }), ", ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://learn.microsoft.com/en-us/windows/wsl/basic-commands",
                  children: "WSL basic commands"
                }), ", and ", (0,jsx_runtime.jsx)(_components.a, {
                  href: "https://learn.microsoft.com/en-us/windows/wsl/troubleshooting#error-0x80370102-the-virtual-machine-could-not-be-started-because-a-required-feature-is-not-installed",
                  children: "Troubleshooting WSL 2"
                }), ":", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "The Windows user has administrator privileges."
                  }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Windows 64bit."
                  }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Windows 10 Build 19043 or greater, or Windows 11."
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["On a virtual machine: ", (0,jsx_runtime.jsx)(_components.a, {
                      href: "https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#configure-nested-virtualization",
                      children: "Nested Virtualization enabled"
                    }), "."]
                  }), "\n"]
                }), "\n"]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Prepare your system."
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Enable the WSL feature, without installing the default Ubuntu distribution of Linux."
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Open the Command Prompt, and run:."
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "> wsl --install --no-distribution\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Restart your computer."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Download the ", (0,jsx_runtime.jsx)(_components.em, {
                children: "Installer for restricted environments"
              }), " from to the ", (0,jsx_runtime.jsx)(_components.a, {
                href: "/downloads/windows",
                children: "Windows downloads page"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Copy the downloaded file to the Windows host in a restricted environment, and run it."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Dashboard"
              }), " from the left navigation pane. The screen displays: ", (0,jsx_runtime.jsxs)(_components.em, {
                children: [(0,jsx_runtime.jsx)(Icon, {
                  icon: "fa-solid fa-info",
                  size: "lg"
                }), " Podman needs to be set up"]
              }), "."]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.img, {
                alt: "Podman needs set up screen",
                src: (__webpack_require__(620)/* ["default"] */ .A) + "",
                width: "1852",
                height: "590"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Set up"
              }), " button."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Review and validate all confirmation screens to set up the Podman Machine."
            }), "\n", (0,jsx_runtime.jsxs)(Details, {
              children: [(0,jsx_runtime.jsx)("summary", {
                children: (0,jsx_runtime.jsx)(_components.p, {
                  children: "Optionally, when you are using a VPN, consider enabling user mode networking:"
                })
              }), (0,jsx_runtime.jsxs)("div", {
                children: [(0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "When you are using a VPN, you might have problems to access, from your host, resources that the Podman Machine exposes."
                  }), "\n"]
                }), (0,jsx_runtime.jsxs)(_components.p, {
                  children: ["To enable access from your host to resources on your Podman Machine, in the ", (0,jsx_runtime.jsx)(_components.strong, {
                    children: "Create Podman machine"
                  }), " screen, enable the ", (0,jsx_runtime.jsx)(_components.strong, {
                    children: "User mode networking (traffic relayed by a user process)"
                  }), " option."]
                })]
              })]
            }), "\n"]
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "mac",
        label: "macOS",
        children: [(0,jsx_runtime.jsxs)(_components.p, {
          children: ["The macOS ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Disk Image for restricted environments"
          }), " has all artifacts required to install Podman Desktop and Podman. It does not require Internet access to download resources during installation.\nHowever, it does not contain additional utilities, such as Compose or Kind."]
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Download the ", (0,jsx_runtime.jsx)(_components.em, {
                children: "Disk Image for restricted environments"
              }), " from the ", (0,jsx_runtime.jsx)(_components.a, {
                href: "/downloads/macos",
                children: "macOS downloads page"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Copy the downloaded file to the macOS host in a restricted environment, and double-click it."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Drag the Podman Desktop icon to the Applications folder."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Dashboard"
              }), " from the left navigation pane.The screen displays: ", (0,jsx_runtime.jsxs)(_components.em, {
                children: [(0,jsx_runtime.jsx)(Icon, {
                  icon: "fa-solid fa-info",
                  size: "lg"
                }), " Podman needs to be set up"]
              }), "."]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.img, {
                alt: "Podman needs set up screen",
                src: (__webpack_require__(620)/* ["default"] */ .A) + "",
                width: "1852",
                height: "590"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Set up"
              }), " button."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Review and validate all confirmation screens to set up the Podman Machine."
            }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
              type: "tip",
              children: (0,jsx_runtime.jsxs)(_components.p, {
                children: ["To route the network traffic through your VPN, in the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Create Podman machine"
                }), " screen, enable the ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "User mode networking (traffic relayed by a user process)"
                }), " option."]
              })
            }), "\n"]
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        children: [(0,jsx_runtime.jsxs)(_components.p, {
          children: ["The Linux ", (0,jsx_runtime.jsx)(_components.em, {
            children: "AMD64 binary (tar.gz)"
          }), " has all artifacts required to install Podman Desktop. It does not require Internet access to download resources during installation.\nHowever, it does not contain additional utilities, such as Podman CLI, Compose, or Kind."]
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "The Podman Destkop archive for restricted environments does not contain Podman CLI."
            }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["To install Podman, go to ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://podman.io/",
                children: "the Podman website"
              }), ", and follow the installation instructions."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Download the ", (0,jsx_runtime.jsx)(_components.em, {
                children: "AMD64 binary (tar.gz)"
              }), " archive from ", (0,jsx_runtime.jsx)(_components.a, {
                href: "https://podman-desktop.io/downloads/linux",
                children: "the Linux Downloads page"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Copy the downloaded file to the Linux host in a restricted environment, and extract the archive content."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["In the extracted directory, open the ", (0,jsx_runtime.jsx)(_components.code, {
                children: "podman-desktop"
              }), " executable file."]
            }), "\n"]
          }), "\n"]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), ", the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Podman"
          }), " tile displays ", (0,jsx_runtime.jsx)(_components.em, {
            children: "Podman is running"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Podman is running screen",
            src: (__webpack_require__(67280)/* ["default"] */ .A) + "",
            width: "2124",
            height: "838"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "using-a-proxy",
      children: "Using a proxy"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Requirements:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "<your.proxy.tld:port>"
        }), ": Your proxy URL."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Optional: your proxy Certificate Authorities (CA) in Privacy-Enhanced Mail (PEM) format."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
      groupId: "operating-systems",
      children: [(0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "win",
        label: "Windows",
        children: (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Settings > Proxy"
              }), " from the left navigation pane."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Select a proxy configuration: ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "System"
              }), ", ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Manual"
              }), ", or ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Disabled"
              }), "."]
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["If you select ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Manual"
                }), ", configure your proxy URLs and bypass proxy settings details.\n", (0,jsx_runtime.jsx)(_components.img, {
                  alt: "Proxy settings",
                  src: (__webpack_require__(49695)/* ["default"] */ .A) + "",
                  width: "1622",
                  height: "728"
                })]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Update"
              }), ". A notification opens."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "OK"
              }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "Proxy update notification",
                src: (__webpack_require__(16795)/* ["default"] */ .A) + "",
                width: "1250",
                height: "444"
              })]
            }), "\n", (0,jsx_runtime.jsxs)(Details, {
              children: [(0,jsx_runtime.jsx)("summary", {
                children: (0,jsx_runtime.jsx)(_components.p, {
                  children: "Optionally, to use a proxy requiring a custom Certificate Authorities:"
                })
              }), (0,jsx_runtime.jsxs)("div", {
                children: [(0,jsx_runtime.jsxs)(_components.ol, {
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["Store your proxy Certificate Authorities (CA), in Privacy-Enhanced Mail (PEM) format, in the ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "proxy_ca.pem"
                    }), " file."]
                  }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Copy the certificate to the Podman machine:"
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ cat proxy_ca.pem | podman machine ssh podman-machine-default \"cat > proxy_ca.pem\"\n"
                  })
                }), (0,jsx_runtime.jsxs)(_components.ol, {
                  start: "3",
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "Open a shell prompt on the Podman machine:"
                    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                      children: (0,jsx_runtime.jsx)(_components.code, {
                        className: "language-shell-session",
                        children: "$ podman machine ssh\n"
                      })
                    }), "\n"]
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "Add the custom Certificate Authorities (CA) for your proxy:"
                    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                      children: (0,jsx_runtime.jsx)(_components.code, {
                        className: "language-shell-session",
                        children: "$ sudo cp <proxy_ca.pem> /etc/pki/ca-trust/source/anchors/\n$ sudo update-ca-trust\n"
                      })
                    }), "\n"]
                  }), "\n"]
                })]
              })]
            }), "\n", (0,jsx_runtime.jsxs)(Details, {
              children: [(0,jsx_runtime.jsx)("summary", {
                children: (0,jsx_runtime.jsx)(_components.p, {
                  children: "Optionally, to use a proxy in your containers:"
                })
              }), (0,jsx_runtime.jsxs)("div", {
                children: [(0,jsx_runtime.jsxs)(_components.ol, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Open a shell prompt on the Podman machine:"
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ podman machine ssh\n"
                  })
                }), (0,jsx_runtime.jsxs)(_components.ol, {
                  start: "2",
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                      children: ["Edit the ", (0,jsx_runtime.jsx)(_components.code, {
                        children: "containers.conf"
                      }), " file to pass the proxy environment variables to Podman CLI."]
                    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "The file location depends on your connection mode:"
                    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                          children: [(0,jsx_runtime.jsx)(_components.code, {
                            children: "rootless"
                          }), ": ", (0,jsx_runtime.jsx)(_components.code, {
                            children: "$HOME/.config/containers/containers.conf"
                          })]
                        }), "\n"]
                      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                          children: [(0,jsx_runtime.jsx)(_components.code, {
                            children: "rootful"
                          }), ": ", (0,jsx_runtime.jsx)(_components.code, {
                            children: "/etc/containers/containers.conf"
                          })]
                        }), "\n"]
                      }), "\n"]
                    }), "\n"]
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "Set the proxy environment variables to pass into the containers:"
                    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                      children: (0,jsx_runtime.jsx)(_components.code, {
                        className: "language-toml",
                        children: "[containers]\nhttp_proxy = true\nenv = [\"http_proxy=<your.proxy.tld:port>\", \"https_proxy=<your.proxy.tld:port>\"]\n"
                      })
                    }), "\n"]
                  }), "\n"]
                })]
              })]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Settings > Resources"
              }), " and restart the Podman machine."]
            }), "\n"]
          }), "\n"]
        })
      }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
        value: "mac",
        label: "macOS",
        children: (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Settings > Proxy"
              }), " from the left navigation pane."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Select a proxy configuration: ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "System"
              }), ", ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Manual"
              }), ", or ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Disabled"
              }), "."]
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["If you select ", (0,jsx_runtime.jsx)(_components.strong, {
                  children: "Manual"
                }), ", configure your proxy URLs and bypass proxy settings details.\n", (0,jsx_runtime.jsx)(_components.img, {
                  alt: "Proxy settings",
                  src: (__webpack_require__(49695)/* ["default"] */ .A) + "",
                  width: "1622",
                  height: "728"
                })]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Update"
              }), ". A notification opens."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "OK"
              }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
                alt: "Proxy update notification",
                src: (__webpack_require__(16795)/* ["default"] */ .A) + "",
                width: "1250",
                height: "444"
              })]
            }), "\n", (0,jsx_runtime.jsxs)(Details, {
              children: [(0,jsx_runtime.jsx)("summary", {
                children: (0,jsx_runtime.jsx)(_components.p, {
                  children: "Optionally, to use a proxy requiring a custom Certificate Authorities:"
                })
              }), (0,jsx_runtime.jsxs)("div", {
                children: [(0,jsx_runtime.jsxs)(_components.ol, {
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["Store your proxy Certificate Authorities (CA) in Privacy-Enhanced Mail (PEM) format, in your home directory, in the ", (0,jsx_runtime.jsx)(_components.code, {
                      children: "proxy_ca.pem"
                    }), " file."]
                  }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Copy the certificate to the Podman machine:"
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ cat proxy_ca.pem | podman machine ssh podman-machine-default \"cat > proxy_ca.pem\"\n"
                  })
                }), (0,jsx_runtime.jsxs)(_components.ol, {
                  start: "3",
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "Open a shell prompt on the Podman machine:"
                    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                      children: (0,jsx_runtime.jsx)(_components.code, {
                        className: "language-shell-session",
                        children: "$ podman machine ssh\n"
                      })
                    }), "\n"]
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "Add the custom Certificate Authorities (CA) for your proxy:"
                    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                      children: (0,jsx_runtime.jsx)(_components.code, {
                        className: "language-shell-session",
                        children: "$ sudo cp <proxy_ca.pem> /etc/pki/ca-trust/source/anchors/\n$ sudo update-ca-trust\n"
                      })
                    }), "\n"]
                  }), "\n"]
                })]
              })]
            }), "\n", (0,jsx_runtime.jsxs)(Details, {
              children: [(0,jsx_runtime.jsx)("summary", {
                children: (0,jsx_runtime.jsx)(_components.p, {
                  children: "Optionally, to use a proxy in your containers:"
                })
              }), (0,jsx_runtime.jsxs)("div", {
                children: [(0,jsx_runtime.jsxs)(_components.ol, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "Open a shell prompt on the Podman machine:"
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ podman machine ssh\n"
                  })
                }), (0,jsx_runtime.jsxs)(_components.ol, {
                  start: "2",
                  children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                      children: ["Edit the ", (0,jsx_runtime.jsx)(_components.code, {
                        children: "containers.conf"
                      }), " file to pass the proxy environment variables to Podman CLI."]
                    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "The file location depends on your connection mode:"
                    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
                      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                          children: [(0,jsx_runtime.jsx)(_components.code, {
                            children: "rootless"
                          }), ": ", (0,jsx_runtime.jsx)(_components.code, {
                            children: "$HOME/.config/containers/containers.conf"
                          })]
                        }), "\n"]
                      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                          children: [(0,jsx_runtime.jsx)(_components.code, {
                            children: "rootful"
                          }), ": ", (0,jsx_runtime.jsx)(_components.code, {
                            children: "/etc/containers/containers.conf"
                          })]
                        }), "\n"]
                      }), "\n"]
                    }), "\n"]
                  }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                    children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
                      children: "Set the proxy environment variables to pass into the containers:"
                    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
                      children: (0,jsx_runtime.jsx)(_components.code, {
                        className: "language-toml",
                        children: "[containers]\nhttp_proxy = true\nenv = [\"http_proxy=<your.proxy.tld:port>\", \"https_proxy=<your.proxy.tld:port>\"]\n"
                      })
                    }), "\n"]
                  }), "\n"]
                })]
              })]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Settings > Resources"
              }), " and restart the Podman machine."]
            }), "\n"]
          }), "\n"]
        })
      }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
        value: "linux",
        label: "Linux",
        children: [(0,jsx_runtime.jsxs)(_components.p, {
          children: ["On Linux, Podman Desktop ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Proxy"
          }), " settings have no effect on Podman."]
        }), (0,jsx_runtime.jsx)(_components.p, {
          children: "Configure Podman:"
        }), (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Edit the ", (0,jsx_runtime.jsx)(_components.code, {
                children: "containers.conf"
              }), " file to pass the proxy environment variables to Podman CLI."]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "The file location depends on your connection mode:"
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                  children: [(0,jsx_runtime.jsx)(_components.code, {
                    children: "rootless"
                  }), ": ", (0,jsx_runtime.jsx)(_components.code, {
                    children: "$HOME/.config/containers/containers.conf"
                  })]
                }), "\n"]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
                  children: [(0,jsx_runtime.jsx)(_components.code, {
                    children: "rootful"
                  }), ": ", (0,jsx_runtime.jsx)(_components.code, {
                    children: "/etc/containers/containers.conf"
                  })]
                }), "\n"]
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Set the proxy environment variables to pass into the Podman engine:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-toml",
                children: "[engine]\nenv = [\"http_proxy=<your.proxy.tld:port>\", \"https_proxy=<your.proxy.tld:port>\"]\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Add the custom Certificate Authorities (CA) for your proxy:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ sudo cp <proxy_ca.pem> /etc/pki/ca-trust/source/anchors/\n$ sudo update-ca-trust\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Restart all ", (0,jsx_runtime.jsx)(_components.code, {
                children: "podman"
              }), " processes."]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ pkill podman\n"
              })
            }), "\n"]
          }), "\n"]
        })]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification-1",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Podman can pull images."
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Images"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Pull an image"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Image to Pull"
            }), ": Enter an image name, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io/podman/hello"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Pull image"
            }), ". Podman Desktop reports ", (0,jsx_runtime.jsx)(_components.code, {
              children: "Download complete"
            }), " after a while."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Done"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "You can install extensions such as:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/compose/setting-up-compose",
              children: "Installing Compose"
            })
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/kind/installing",
              children: "Installing Kind"
            }), "."]
          }), "\n"]
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}



/***/ },

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

/***/ },

/***/ 67280
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dashboard-podman-is-running-2c184ead8222ea1e25cad1e93486cce7.png");

/***/ },

/***/ 620
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/dashboard-podman-needs-set-up-719be7e03b84ebd869ede67885586251.png");

/***/ },

/***/ 49695
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/proxy-settings-00e2e287087510d2f7f67b4390695d56.png");

/***/ },

/***/ 16795
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/proxy-update-notification-1bb67c26b6c4179de365f0e761690639.png");

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