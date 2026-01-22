"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[76775],{

/***/ 1153
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_docs_containers_registries_index_md_fd6_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/default/site-docs-containers-registries-index-md-fd6.json
const site_docs_containers_registries_index_md_fd6_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"containers/registries/index","title":"Registries","description":"Working with container registries","source":"@site/docs/containers/registries/index.md","sourceDirName":"containers/registries","slug":"/containers/registries/","permalink":"/docs/containers/registries/","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/containers/registries/index.md","tags":[{"inline":true,"label":"podman-desktop","permalink":"/docs/tags/podman-desktop"},{"inline":true,"label":"containers","permalink":"/docs/tags/containers"}],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"title":"Registries","description":"Working with container registries","tags":["podman-desktop","containers"],"keywords":["podman desktop","podman","containers","registries"],"hide_table_of_contents":false,"image":"/img/docs/containers/registries/img/registries.png"},"sidebar":"mySidebar","previous":{"title":"Onboarding for containers","permalink":"/docs/containers/onboarding"},"next":{"title":"Configuring a mirror registry","permalink":"/docs/containers/registries/configuring-mirror-registries"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Tabs/index.js + 2 modules
var Tabs = __webpack_require__(78296);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/TabItem/index.js + 1 modules
var TabItem = __webpack_require__(22491);
;// ./docs/containers/registries/index.md


const frontMatter = {
	sidebar_position: 3,
	title: 'Registries',
	description: 'Working with container registries',
	tags: [
		'podman-desktop',
		'containers'
	],
	keywords: [
		'podman desktop',
		'podman',
		'containers',
		'registries'
	],
	hide_table_of_contents: false,
	image: '/img/docs/containers/registries/img/registries.png'
};
const contentTitle = 'Setting up container registries';

const assets = {

};





const toc = [{
  "value": "Setting up a pre-configured registry",
  "id": "setting-up-a-pre-configured-registry",
  "level": 2
}, {
  "value": "Setting up a custom registry",
  "id": "setting-up-a-custom-registry",
  "level": 2
}, {
  "value": "Setting up a registry with an insecure certificate",
  "id": "setting-up-a-registry-with-an-insecure-certificate",
  "level": 2
}, {
  "value": "Verifying your registry setup",
  "id": "verifying-your-registry-setup",
  "level": 2
}, {
  "value": "Changing your credentials",
  "id": "changing-your-credentials",
  "level": 2
}, {
  "value": "Removing a registry",
  "id": "removing-a-registry",
  "level": 2
}, {
  "value": "Finding Podman registry configuration files",
  "id": "finding-podman-registry-configuration-files",
  "level": 2
}, {
  "value": "Next steps",
  "id": "next-steps",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    admonition: "admonition",
    code: "code",
    em: "em",
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
  }, {Icon} = _components;
  if (!Icon) _missingMdxReference("Icon", true);
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "setting-up-container-registries",
        children: "Setting up container registries"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.admonition, {
      title: "Before you start",
      type: "tip",
      children: [(0,jsx_runtime.jsx)(_components.p, {
        children: "Before you start, you should:"
      }), (0,jsx_runtime.jsxs)(_components.ul, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["Get authentication details for your container registry:", "\n", (0,jsx_runtime.jsxs)(_components.ul, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
              children: "Registry URL."
            }), "\n", (0,jsx_runtime.jsx)(_components.li, {
              children: "User name."
            }), "\n", (0,jsx_runtime.jsx)(_components.li, {
              children: "Password, or OAuth secret."
            }), "\n"]
          }), "\n"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["Get the fully qualified name of a private image stored in your registry, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "my-registry.tld/my-repository/my-image"
          }), "."]
        }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
          children: ["Get the fully qualified image name that your registry requires to push an image, such as ", (0,jsx_runtime.jsx)(_components.code, {
            children: "my-registry.tld/my-repository/my-image"
          }), "."]
        }), "\n"]
      })]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "setting-up-a-pre-configured-registry",
      children: "Setting up a pre-configured registry"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To ease usage of the most popular container registries, Podman Desktop has pre-configured registries, including:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Docker Hub"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Red Hat Quay"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "GitHub"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Google Container Registry"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If your container registry is in this list, follow the steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Registries"]
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In your registry line, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Configure"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Enter your registry credentials:"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Authenticating to a pre-configured registry",
            src: (__webpack_require__(29873)/* ["default"] */ .A) + "",
            width: "933",
            height: "431"
          })
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Username"
            }), ": Enter your user name."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Password"
            }), ": Enter your password or OAuth secret."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Login"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop logs Podman in with the provided credentials."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you enter the wrong credentials, you see an error message:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Enter the correct credentials"
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Login"
        }), " again."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "setting-up-a-custom-registry",
      children: "Setting up a custom registry"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "You have a custom container registry, or one that is not available in the pre-configured list: we have got you covered. Follow the steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Registries"]
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-plus-circle",
              size: "lg"
            }), " Add registry"]
          }), " at the top right corner of the screen."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Enter your registry details:"
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Adding a custom registry",
            src: (__webpack_require__(37662)/* ["default"] */ .A) + "",
            width: "933",
            height: "501"
          })
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Registry Location"
            }), ": Enter your repository URL, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "https://myregistry.tld"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Username"
            }), ": Enter your user name."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: [(0,jsx_runtime.jsx)(_components.strong, {
              children: "Password"
            }), ": Enter your password or OAuth secret."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Login"
            }), "."]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop logs Podman in with the provided credentials."
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you enter the wrong credentials, you see an error message:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Enter the correct credentials"
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Login"
        }), " again."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "setting-up-a-registry-with-an-insecure-certificate",
      children: "Setting up a registry with an insecure certificate"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If your registry has an insecure certificate, such as a self-signed certificate, you see a warning when setting up the registry."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In the ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Invalid Certificate"
          }), " window, click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Yes"
          }), " to add the registry anyway."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Podman Desktop Registry Warning",
            src: (__webpack_require__(75934)/* ["default"] */ .A) + "",
            width: "556",
            height: "206"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Tell Podman that it has your authorization to access the insecure registry: edit the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "registries.conf"
          }), " file."]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to a location where you can edit the ", (0,jsx_runtime.jsx)(_components.code, {
                children: "registries.conf"
              }), " file:"]
            }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
              groupId: "operating-systems",
              children: [(0,jsx_runtime.jsxs)(TabItem/* default */.A, {
                value: "win",
                label: "Windows",
                children: [(0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "The configuration file is in the Podman machine: open a terminal in the Podman Machine."
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ podman machine ssh --username root [optional-machine-name]\n"
                  })
                })]
              }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
                value: "mac",
                label: "macOS",
                children: [(0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "The configuration file is in the Podman machine: open a terminal in the Podman Machine."
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ podman machine ssh --username root [optional-machine-name]\n"
                  })
                })]
              }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
                value: "linux",
                label: "Linux",
                children: [(0,jsx_runtime.jsxs)(_components.ul, {
                  children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                    children: "The configuration file is in your host: open a terminal with superuser privileges."
                  }), "\n"]
                }), (0,jsx_runtime.jsx)(_components.pre, {
                  children: (0,jsx_runtime.jsx)(_components.code, {
                    className: "language-shell-session",
                    children: "$ sudo su -\n"
                  })
                })]
              })]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Edit the registry optional configuration file."
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "# vi /etc/containers/registries.conf\n"
              })
            }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["For each insecure registry, add a ", (0,jsx_runtime.jsx)(_components.code, {
                children: "[[registry]]"
              }), " section that defines:"]
            }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.code, {
                  children: "location ="
                }), ": Enter your registry URL."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.code, {
                  children: "insecure = true"
                }), ": Accept the insecure certificate."]
              }), "\n"]
            }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["For example, if your have two registries, such as ", (0,jsx_runtime.jsx)(_components.code, {
                children: "https://my-registry.tld"
              }), " and ", (0,jsx_runtime.jsx)(_components.code, {
                children: "http://registry.example.com"
              }), ", add the following lines:"]
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-toml",
                children: "[[registry]]\nlocation = \"my-registry.tld\"\ninsecure = true\n\n[[registry]]\nlocation = \"registry.example.com\"\ninsecure = true\n"
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Restart Podman to apply the changes."
        }), "\n", (0,jsx_runtime.jsxs)(Tabs/* default */.A, {
          groupId: "operating-systems",
          children: [(0,jsx_runtime.jsx)(TabItem/* default */.A, {
            value: "win",
            label: "Windows",
            children: (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
                  children: [(0,jsx_runtime.jsx)(Icon, {
                    icon: "fa-solid fa-cog",
                    size: "lg"
                  }), " Settings > Resources"]
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Restart the Podman machine."
              }), "\n"]
            })
          }), (0,jsx_runtime.jsx)(TabItem/* default */.A, {
            value: "mac",
            label: "macOS",
            children: (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
                  children: [(0,jsx_runtime.jsx)(Icon, {
                    icon: "fa-solid fa-cog",
                    size: "lg"
                  }), " Settings > Resources"]
                }), "."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Restart the Podman machine."
              }), "\n"]
            })
          }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
            value: "linux",
            label: "Linux (rootless)",
            children: [(0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Stop all Podman processes."
              }), "\n"]
            }), (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ pkill podman\n"
              })
            })]
          }), (0,jsx_runtime.jsxs)(TabItem/* default */.A, {
            value: "linux-rootful",
            label: "Linux (rootful)",
            children: [(0,jsx_runtime.jsxs)(_components.ul, {
              children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Restart Podman."
              }), "\n"]
            }), (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-shell-session",
                children: "$ sudo systemctl restart podman\n"
              })
            })]
          })]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "verifying-your-registry-setup",
      children: "Verifying your registry setup"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To verify your registry has been properly configured, you can do the following steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["In ", (0,jsx_runtime.jsxs)(_components.strong, {
            children: [(0,jsx_runtime.jsx)(Icon, {
              icon: "fa-solid fa-cog",
              size: "lg"
            }), " Settings > Registries"]
          }), ", the line with your registry has content in the Username and Password column, and action icons replacing the Configure button."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Pull a private image from the registry."
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Get the name of a private image stored in your registry, such as ", (0,jsx_runtime.jsx)(_components.code, {
              children: "quay.io/my-repository/my-image"
            }), ", ", (0,jsx_runtime.jsx)(_components.code, {
              children: "ghcr.io/my-repository/my-image"
            }), ", ", (0,jsx_runtime.jsx)(_components.code, {
              children: "docker.io/my-repository/my-image"
            }), ", or ", (0,jsx_runtime.jsx)(_components.code, {
              children: "my-registry.tld/my-repository/my-image"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Images"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Pull an image"
            }), "."]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
              children: "Image to Pull"
            }), " screen:", "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Image to pull"
                }), ": Enter the image name."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Click Pull image."
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsx)(_components.li, {
            children: "Click Done."
          }), "\n"]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Push an image to the registry:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Get the fully qualified image name that your registry requires, such as ", (0,jsx_runtime.jsx)(_components.code, {
                children: "quay.io/my-repository/my-image"
              }), ", ", (0,jsx_runtime.jsx)(_components.code, {
                children: "ghcr.io/my-repository/my-image"
              }), ", or ", (0,jsx_runtime.jsx)(_components.code, {
                children: "docker.io/my-repository/my-image"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Go to ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Images"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Build an image"
              }), "."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["On the ", (0,jsx_runtime.jsx)(_components.strong, {
                children: "Build Image from Containerfile"
              }), " screen"]
            }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
              children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Containerfile path"
                }), ": select the Containerfile or Dockerfile to build."]
              }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
                children: [(0,jsx_runtime.jsx)(_components.strong, {
                  children: "Image Name"
                }), ": enter the fully qualified image name that your registry requires."]
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Click Build."
              }), "\n", (0,jsx_runtime.jsx)(_components.li, {
                children: "Click Done."
              }), "\n"]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["On your image line, click ", (0,jsx_runtime.jsx)(_components.strong, {
                children: (0,jsx_runtime.jsx)(Icon, {
                  icon: "fa-solid fa-ellipsis-v",
                  size: "lg"
                })
              }), "."]
            }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["The contextual menu has a ", (0,jsx_runtime.jsxs)(_components.strong, {
                children: ["Push Image to ", (0,jsx_runtime.jsx)(_components.em, {
                  children: "your registry"
                })]
              }), " entry."]
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "changing-your-credentials",
      children: "Changing your credentials"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To change your registry credentials, you can do the following steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: [(0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-cog",
            size: "lg"
          }), " Settings > Registries"]
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["On your registry line, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-ellipsis-v",
            size: "lg"
          })
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Edit password"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Enter your credentials in the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Username"
        }), " and ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Password"
        }), " fields, and click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Login"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop logs Podman in with the updated credentials."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "removing-a-registry",
      children: "Removing a registry"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "To remove your registry, you can do the following steps:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Go to ", (0,jsx_runtime.jsxs)(_components.strong, {
          children: [(0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-cog",
            size: "lg"
          }), " Settings > Registries"]
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["On your registry line, click ", (0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(Icon, {
            icon: "fa-solid fa-ellipsis-v",
            size: "lg"
          })
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Click Remove."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman Desktop removes the registry from the settings, and logs Podman out from the registry."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "finding-podman-registry-configuration-files",
      children: "Finding Podman registry configuration files"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Podman has two files to configure registries:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.code, {
            children: "auth.json"
          }), " defines the authentication to registries."]
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Podman Desktop stores this file directly on your host, in ", (0,jsx_runtime.jsx)(_components.code, {
            children: "$HOME/.config/containers/auth.json"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "The Podman machine mounts the authentication configuration file to access it."
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "When you delete the Podman machine, the registry configuration is not lost: it stays on your host."
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: [(0,jsx_runtime.jsx)(_components.code, {
            children: "registries.conf"
          }), " defines optional features, such as allowing insecure certificates."]
        }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["The Podman machine stores the file in ", (0,jsx_runtime.jsx)(_components.code, {
            children: "/etc/containers/registries.conf"
          }), "."]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "When you delete the Podman machine, this file is deleted."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "next-steps",
      children: "Next steps"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Consider completing some other common tasks that depend registries:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Pulling an image."
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Pushing an image to a registry."
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

/***/ 29873
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/authenticating-to-a-preconfigured-registry-12cf722d1b380d17ae90e8129d31a981.png");

/***/ },

/***/ 37662
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/adding-a-custom-registry-df276b8cd69d722de97670c7eef8b235.png");

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

/***/ 75934
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/registry-warning-insecure-245d7254807b5939c082f47e5d538d80.png");

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