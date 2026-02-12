"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[69838],{

/***/ 42134
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_installation_windows_install_index_md_a35_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-installation-windows-install-index-md-a35.json
const site_docs_installation_windows_install_index_md_a35_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"installation/windows-install/index","title":"Windows","description":"How to install Podman Desktop and Podman on Windows.","source":"@site/docs/installation/windows-install/index.md","sourceDirName":"installation/windows-install","slug":"/installation/windows-install/","permalink":"/docs/installation/windows-install/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/installation/windows-install/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"installing","permalink":"/docs/tags/installing"},{"inline":true,"label":"windows","permalink":"/docs/tags/windows"}],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"title":"Windows","description":"How to install Podman Desktop and Podman on Windows.","tags":["podman-desktop","installing","windows"],"keywords":["podman desktop","containers","podman","installing","installation","windows"]},"sidebar":"mySidebar","previous":{"title":"Installation","permalink":"/docs/installation/"},"next":{"title":"macOS","permalink":"/docs/installation/macos-install"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./docs/installation/windows-install/index.md


const frontMatter = {
	sidebar_position: 1,
	title: 'Windows',
	description: 'How to install Podman Desktop and Podman on Windows.',
	tags: [
		'podman-desktop',
		'installing',
		'windows'
	],
	keywords: [
		'podman desktop',
		'containers',
		'podman',
		'installing',
		'installation',
		'windows'
	]
};
const contentTitle = 'Installing Podman Desktop and Podman on Windows';

const assets = {

};



const toc = [{
  "value": "Installing Podman Desktop",
  "id": "installing-podman-desktop",
  "level": 2
}, {
  "value": "Procedure",
  "id": "procedure",
  "level": 4
}, {
  "value": "Silent Windows installer",
  "id": "silent-windows-installer",
  "level": 4
}, {
  "value": "Chocolatey",
  "id": "chocolatey",
  "level": 4
}, {
  "value": "Scoop package manager for Windows",
  "id": "scoop-package-manager-for-windows",
  "level": 4
}, {
  "value": "Installing Podman",
  "id": "installing-podman",
  "level": 2
}, {
  "value": "Use WSL2 as machine provider",
  "id": "use-wsl2-as-machine-provider",
  "level": 3
}, {
  "value": "Prerequisites",
  "id": "prerequisites",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure-1",
  "level": 4
}, {
  "value": "Use Hyper-V as machine provider",
  "id": "use-hyper-v-as-machine-provider",
  "level": 3
}, {
  "value": "Prerequisites",
  "id": "prerequisites-1",
  "level": 4
}, {
  "value": "Procedure",
  "id": "procedure-2",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification",
  "level": 4
}, {
  "value": "Install Podman Desktop dependencies",
  "id": "install-podman-desktop-dependencies",
  "level": 3
}, {
  "value": "Procedure",
  "id": "procedure-3",
  "level": 4
}, {
  "value": "Verification",
  "id": "verification-1",
  "level": 4
}, {
  "value": "Next steps",
  "id": "next-steps",
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
    h3: "h3",
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
  }, {Details} = _components;
  if (!Details) _missingMdxReference("Details", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "installing-podman-desktop-and-podman-on-windows",
        children: "Installing Podman Desktop and Podman on Windows"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman-desktop",
      children: "Installing Podman Desktop"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You can install Podman Desktop by using:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "The Windows installer"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Windows Package Manager (WinGet)"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Other alternative methods"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.em, {
        children: (0,jsx_runtime.jsx)(_components.strong, {
          children: "Using the Windows installer"
        })
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "During setup, you can choose from the following installation scopes:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Anyone who uses this computer (all users): Installs the application for all users and requires administrative privileges; enter your credentials when prompted."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Only for me (Username): Installs the application for the current user only; no administrative privileges required."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/downloads/windows",
          children: "Download the Windows installer"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Locate the file in the ", (0,jsx_runtime.jsx)(_components.code, {
          children: "Downloads"
        }), " folder, and double-click it. The ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Podman Desktop Setup"
        }), " screen opens."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Select whether to install the application for all users or only for the current user."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Install"
        }), ".\n", (0,jsx_runtime.jsx)(_components.img, {
          alt: "install button",
          src: (__webpack_require__(3022)/* ["default"] */ .A) + "",
          width: "1000",
          height: "778"
        })]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["After the installation is complete, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Finish"
        }), " to close the screen. The ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Get started with Podman Desktop"
        }), " screen opens."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.em, {
        children: (0,jsx_runtime.jsx)(_components.strong, {
          children: "Using WinGet"
        })
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.a, {
            href: "https://aka.ms/getwinget",
            children: "Install the Winget Package manager for Windows"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Install from the terminal:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> winget install RedHat.Podman-Desktop\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(Details, {
      children: [(0,jsx_runtime.jsxs)("summary", {
        children: [(0,jsx_runtime.jsx)(_components.p, {
          children: "Alternate installation methods:"
        }), (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Silent Windows installer"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Chocolatey"
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Scoop"
          }), "\n"]
        })]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "silent-windows-installer",
        children: "Silent Windows installer"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "/downloads/windows",
              children: "Download the Windows installer"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: ["To install without user interaction, run the Windows installer with the silent flag ", (0,jsx_runtime.jsx)(_components.code, {
              children: "/S"
            }), " from the Command Prompt:"]
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> podman-desktop-1.6.4-setup-x64.exe /S\n"
            })
          }), "\n"]
        }), "\n"]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "chocolatey",
        children: "Chocolatey"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: ["Install the ", (0,jsx_runtime.jsx)(_components.a, {
              href: "https://chocolatey.org/install",
              children: "Chocolatey package manager"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
            children: "Install from the terminal:"
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> choco install podman-desktop\n"
            })
          }), "\n"]
        }), "\n"]
      }), (0,jsx_runtime.jsx)(_components.h4, {
        id: "scoop-package-manager-for-windows",
        children: "Scoop package manager for Windows"
      }), (0,jsx_runtime.jsxs)(_components.ol, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
            children: [(0,jsx_runtime.jsx)(_components.a, {
              href: "https://github.com/ScoopInstaller/Install#readme",
              children: "Install the Scoop package manager"
            }), "."]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
            children: "Install from the terminal:"
          }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
            children: (0,jsx_runtime.jsx)(_components.code, {
              className: "language-shell-session",
              children: "> scoop bucket add extras\n> scoop install podman-desktop\n"
            })
          }), "\n"]
        }), "\n"]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "installing-podman",
      children: "Installing Podman"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "On Windows, running the Podman container engine requires a Linux distribution to run in a virtual machine. You can use Windows Subsystem for Linux version 2 (WSL 2) or Hyper-V as the machine provider."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "During Podman installation, ensure that you have administrator privileges for the following tasks:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Enable the WSL or Hyper-V feature."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Create a Hyper-V Podman machine."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "use-wsl2-as-machine-provider",
      children: "Use WSL2 as machine provider"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Podman Desktop creates a ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2",
        children: "Windows Subsystem for Linux version 2 (WSL 2)"
      }), " virtual machine, also known as the Podman machine. The major benefits are:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Ease of use."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "WSL 2 native virtualization performance."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You must enable the WSL feature. This is required by Podman Desktop to create the default ", (0,jsx_runtime.jsx)(_components.code, {
        children: "wsl"
      }), " Podman machine."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Check that your environment meets the following requirements:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "6 GB of RAM for the Podman machine."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Required WSL 2 prerequisites:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Administrator privileges for the Windows user."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Windows 64bit."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "All editions: Windows 10 Build 19043 or later, or Windows 11"
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Enable ", (0,jsx_runtime.jsx)(_components.a, {
              href: "https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#configure-nested-virtualization",
              children: "nested virtualization"
            }), " if you are running Windows as a VM on a host hypervisor."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-1",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following commands to enable the WSL feature without installing the default Ubuntu distribution of Linux:"
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> wsl --update\n> wsl --install --no-distribution\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
          type: "note",
          children: (0,jsx_runtime.jsxs)(_components.p, {
            children: ["If you run the Podman Desktop setup on a Windows 10 LTSC version, you require to install a specific WSL distribution. See ", (0,jsx_runtime.jsx)(_components.a, {
              href: "/docs/troubleshooting/troubleshooting-podman-on-windows#windows-10-enterprise-ltsc-version-21h2-podman-desktop-is-unable-to-detect-wsl2-machine",
              children: "Troubleshooting Podman on Windows"
            })]
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Restart your machine."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "wsl --status"
          }), " command in the CLI to check that WSL 2 is available."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "use-hyper-v-as-machine-provider",
      children: "Use Hyper-V as machine provider"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "As an administrator, you can set up a Podman machine using Hyper-V as the provider. Hyper-V on Windows offers the following benefits:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Run multiple operating systems on a single machine."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Speed up virtual machine deployment."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Enhance security through environment isolation."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Simplify management using native Windows tools and PowerShell."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You must enable the Hyper-V feature. This is required by Podman Desktop to create the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "Hyper-V"
      }), " Podman machine."]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "prerequisites-1",
      children: "Prerequisites"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Check that your environment meets the following requirements:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "6 GB of RAM for the Podman machine."
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Required Hyper-V prerequisites:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Administrator privileges for the Windows user."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Windows 64bit."
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Pro or Enterprise edition: Windows 10 Build 19043 or later, or Windows 11"
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Enable ", (0,jsx_runtime.jsx)(_components.a, {
              href: "https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#configure-nested-virtualization",
              children: "nested virtualization"
            }), " if you are running Windows as a VM on a host hypervisor."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-2",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Run the following command to enable the Hyper-V feature:"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Using command prompt"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> DISM /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Using PowerShell"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Restart your machine."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Check that Hyper-V is active."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Using command prompt"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> systeminfo\n"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.strong, {
            children: "Using PowerShell"
          })
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-shell-session",
            children: "> Get-Service vmcompute\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "install-podman-desktop-dependencies",
      children: "Install Podman Desktop dependencies"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When the Podman Desktop installation completes, the ", (0,jsx_runtime.jsx)(_components.strong, {
        children: "Get started with Podman Desktop"
      }), " screen opens. This screen helps you to start the onboarding process. Alternatively, you can completely skip this onboarding setup. You can always complete the setup later by using one of the following ways:"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Use the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Set up"
        }), " button in the notification on the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Dashboard"
        }), " page."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Use the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Setup Podman"
        }), " button on the Podman tile, located on the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), " page."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "procedure-3",
      children: "Procedure"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Get started with Podman Desktop"
          }), " screen, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Start Onboarding"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Perform the following steps to install Podman:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Next"
            }), ". A confirmation notification opens."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Yes"
            }), ". The ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Podman Setup"
            }), " screen opens with the default WSLv2 virtualization provider selected."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Optional: Select the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Windows Hyper-V"
            }), " provider when needed."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Install"
            }), ". A notification stating ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Installation Successfully Completed"
            }), " appears on the screen.\n", (0,jsx_runtime.jsx)(_components.img, {
              alt: "install button for Podman",
              src: (__webpack_require__(49893)/* ["default"] */ .A) + "",
              width: "1204",
              height: "962"
            })]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Close"
            }), ". A page notifying that Podman is set up correctly opens."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Perform the following steps to create a Podman machine:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Next"
            }), ". A page notifying you to create a Podman machine opens."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Next"
            }), ", and then click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Create"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Next"
          }), ", and follow the instructions on the screen to install the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "kubectl"
          }), " and ", (0,jsx_runtime.jsx)(_components.code, {
            children: "compose"
          }), " CLIs."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["After installing the CLIs, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Next"
          }), " to go to the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Dashboard"
          }), " page."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "verification-1",
      children: "Verification"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > Resources"
        }), " page, and view the running Podman machine on the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Podman"
        }), " tile."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You are ready to use the application."
    }), "\n", (0,jsx_runtime.jsx)(_components.h4, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/containers",
          children: "Work with containers"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/docs/kubernetes",
          children: "Work with Kubernetes"
        }), "."]
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

/***/ 3022
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/install-button-for-podman-desktop-35a8030ec9281d0944ff217c13a7c1a1.png");

/***/ },

/***/ 49893
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/install-podman-through-installer-0ca90bea854ebebc91f2566e04054ae0.png");

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