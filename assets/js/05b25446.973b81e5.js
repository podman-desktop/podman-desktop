"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[9019],{

/***/ 34211
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_getting_started_with_compose_md_05b_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-getting-started-with-compose-md-05b.json
const site_tutorial_getting_started_with_compose_md_05b_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"getting-started-with-compose","title":"Getting started with Compose","description":"Getting started with Compose on Podman Desktop","source":"@site/tutorial/getting-started-with-compose.md","sourceDirName":".","slug":"/getting-started-with-compose","permalink":"/tutorial/getting-started-with-compose","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"working-with-compose","permalink":"/tutorial/tags/working-with-compose"}],"version":"current","sidebarPosition":8,"frontMatter":{"sidebar_position":8,"title":"Getting started with Compose","description":"Getting started with Compose on Podman Desktop","keywords":["podman-desktop","compose","containers","containerfile","docker-compose","dockerfile","multi-container"],"tags":["podman-desktop","working-with-compose"]},"sidebar":"defaultSidebar","previous":{"title":"Creating an extension","permalink":"/tutorial/creating-an-extension"},"next":{"title":"Testcontainers with Podman","permalink":"/tutorial/testcontainers-with-podman"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/getting-started-with-compose.md


const frontMatter = {
	sidebar_position: 8,
	title: 'Getting started with Compose',
	description: 'Getting started with Compose on Podman Desktop',
	keywords: [
		'podman-desktop',
		'compose',
		'containers',
		'containerfile',
		'docker-compose',
		'dockerfile',
		'multi-container'
	],
	tags: [
		'podman-desktop',
		'working-with-compose'
	]
};
const contentTitle = 'Getting started with Compose';

const assets = {

};



const toc = [{
  "value": "Before you begin",
  "id": "before-you-begin",
  "level": 2
}, {
  "value": "Download and run the example application",
  "id": "download-and-run-the-example-application",
  "level": 2
}, {
  "value": "Viewing the guestbook application",
  "id": "viewing-the-guestbook-application",
  "level": 2
}, {
  "value": "Viewing and modifying the database",
  "id": "viewing-and-modifying-the-database",
  "level": 2
}, {
  "value": "How does it work?",
  "id": "how-does-it-work",
  "level": 3
}, {
  "value": "Scaling more replicas",
  "id": "scaling-more-replicas",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
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
        id: "getting-started-with-compose",
        children: "Getting started with Compose"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.a, {
        href: "https://www.compose-spec.io/",
        children: "Compose is a specification"
      }), " for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services, networks, and volumes. This allows you to capture in a single file the entire configuration necessary to run a set of interconnected containers as an application. For example, if you have an application that requires a web server, a database, and a caching service, you can define these components and their relationships in your Compose file."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["To use the Compose YAML, you can leverage a specification implementation, such as ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://docs.podman.io/en/latest/markdown/podman-compose.1.html",
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "podman compose"
        })
      }), " and ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/docker/compose",
        children: (0,jsx_runtime.jsx)(_components.code, {
          children: "docker compose"
        })
      }), "."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This tutorial covers the following end-to-end tasks required to use a multi-container Compose application within Podman Desktop:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/getting-started-with-compose#download-and-run-the-example-application",
          children: "Download and run the example application"
        }), " using ", (0,jsx_runtime.jsx)(_components.code, {
          children: "podman compose up"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/getting-started-with-compose#viewing-the-guestbook-application",
          children: "View the guestbook web application"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/getting-started-with-compose#viewing-and-modifying-the-database",
          children: "View and modify the database"
        }), " to check the guestbook web application is synchronized and running correctly."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.a, {
          href: "/tutorial/getting-started-with-compose#scaling-more-replicas",
          children: "Scale database replicas"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "before-you-begin",
      children: "Before you begin"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "If you do not have Compose installed, you can follow the complete onboarding process to install it system wide:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Install the Compose extension from the catalog. For more details, see ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://podman-desktop.io/docs/extensions/install",
            children: "Installing a Podman Desktop extension"
          }), "."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Set up Compose and complete the onboarding process to configure it system-wide.\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "Onboarding process",
            src: (__webpack_require__(83424)/* ["default"] */ .A) + "",
            width: "1496",
            height: "1206"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Check that you are able to run ", (0,jsx_runtime.jsx)(_components.code, {
            children: "podman compose"
          }), ":"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "podman compose\nRun compose workloads via an external provider such as docker-compose or podman-compose\n\nDescription:\n  This command is a thin wrapper around an external compose provider such as docker-compose or podman-compose.  This means that podman compose is executing another tool that implements the compose functionality but sets up the environment in a way to let the compose provider communicate transparently with the local Podman socket.  The specified options as well the command and argument are passed directly to the compose provider.\n...\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
      type: "note",
      children: (0,jsx_runtime.jsxs)(_components.p, {
        children: ["If Compose is already installed, you have the option to upgrade or downgrade its version by navigating to the ", (0,jsx_runtime.jsx)(_components.strong, {
          children: "Settings > CLI Tools"
        }), " page."]
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "download-and-run-the-example-application",
      children: "Download and run the example application"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Our example application is located at ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/redhat-developer/podman-desktop-demo",
        children: "github.com/redhat-developer/podman-desktop-demo"
      }), "."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run ", (0,jsx_runtime.jsx)(_components.code, {
            children: "git clone"
          }), " to build the Go binary web application:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "git clone https://github.com/redhat-developer/podman-desktop-demo\ncd podman-desktop-demo/guestbook-compose\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run ", (0,jsx_runtime.jsx)(_components.code, {
            children: "podman compose up -d"
          }), " to start the application:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "podman compose up -d\n>>>> Executing external compose provider \"/usr/local/bin/docker-compose\". Please refer to the documentation for details. <<<<\n\n[+] Running 3/3\n✔ Container redis-replica  Started                                                                        0.0s\n✔ Container web            Started                                                                        0.0s\n✔ Container redis-leader   Started                                                                        0.0s\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "viewing-the-guestbook-application",
      children: "Viewing the guestbook application"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Within Podman Desktop, you can now see that all three containers are up and operational."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click the \"Open Browser\" button to view the web application:\n", (0,jsx_runtime.jsx)(_components.img, {
            alt: "Open browser",
            src: (__webpack_require__(29979)/* ["default"] */ .A) + "",
            width: "2850",
            height: "828"
          })]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Within the Guestbook web application, you can:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "\"Sign\" the guestbook, which will write to the Redis leader and synchronize to the replicas."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "\"Read\" from the guestbook, which will read from the pool of Redis replicas. This allows for readability even if the Redis leader is unavailable."
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.code, {
                children: "/env"
              }), ": View the container's environment variables."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: [(0,jsx_runtime.jsx)(_components.code, {
                children: "/info"
              }), ": View information about the Redis cluster."]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.img, {
                alt: "Guestbook application",
                src: (__webpack_require__(65135)/* ["default"] */ .A) + "",
                width: "949",
                height: "653"
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "viewing-and-modifying-the-database",
      children: "Viewing and modifying the database"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Using Podman Desktop, you can also access the container's terminal directly from the GUI and modify the database."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Click ", (0,jsx_runtime.jsx)(_components.strong, {
            children: "Open Terminal"
          }), " to access the ", (0,jsx_runtime.jsx)(_components.code, {
            children: "redis-leader"
          }), " terminal:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.p, {
          children: (0,jsx_runtime.jsx)(_components.img, {
            alt: "Open terminal",
            src: (__webpack_require__(34915)/* ["default"] */ .A) + "",
            width: "2408",
            height: "1070"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Modify the database as if you are doing database administration:"
        }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Run ", (0,jsx_runtime.jsx)(_components.code, {
                children: "redis-cli"
              }), " within the container to access the Redis database."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Type ", (0,jsx_runtime.jsx)(_components.code, {
                children: "LPUSH guestbook \"Hello World!\""
              }), " and you will see your web application update in real-time."]
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
              children: ["Type ", (0,jsx_runtime.jsx)(_components.code, {
                children: "DEL guestbook"
              }), " and you will see that your database drops the ", (0,jsx_runtime.jsx)(_components.code, {
                children: "guestbook"
              }), " key and clears the database."]
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: (0,jsx_runtime.jsx)(_components.img, {
                alt: "Redis CLI",
                src: (__webpack_require__(23415)/* ["default"] */ .A) + "",
                width: "1652",
                height: "534"
              })
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Changes will reflect in real-time on the guestbook."
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["You can further modify the database and see the changes propagate to the Redis replicas. For example, view the logs of the ", (0,jsx_runtime.jsx)(_components.code, {
        children: "redis-replica"
      }), ", and you will notice that there are periodic database synchronizations as well as reads to the database:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "Redis replica logs",
        src: (__webpack_require__(47296)/* ["default"] */ .A) + "",
        width: "1680",
        height: "1148"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.h3, {
      id: "how-does-it-work",
      children: "How does it work?"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "A quick overview of how the architecture works in this multi-container scenario:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["Within the Guestbook application, it looks for a database with the names ", (0,jsx_runtime.jsx)(_components.code, {
          children: "redis-leader"
        }), " and ", (0,jsx_runtime.jsx)(_components.code, {
          children: "redis-replica"
        }), " on port ", (0,jsx_runtime.jsx)(_components.code, {
          children: "6379"
        }), "."]
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Because it is a Compose application, the containers are connected on the same network. This means that a neighboring container can be network-accessible simply by its container name."
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "There is a set of environment variables that the web application can modify in the Compose application:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "REDIS_LEADER"
        }), ": The default is ", (0,jsx_runtime.jsx)(_components.code, {
          children: "redis-leader"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "REDIS_REPLICAS"
        }), ": The default is ", (0,jsx_runtime.jsx)(_components.code, {
          children: "redis-replica"
        }), ". It can be comma-separated, such as ", (0,jsx_runtime.jsx)(_components.code, {
          children: "redis-replica-1,redis-replica-2"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "REDIS_PORT"
        }), ": The default is ", (0,jsx_runtime.jsx)(_components.code, {
          children: "6379"
        }), "."]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: [(0,jsx_runtime.jsx)(_components.code, {
          children: "SERVER_PORT"
        }), ": The default is ", (0,jsx_runtime.jsx)(_components.code, {
          children: "8080"
        }), "."]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "scaling-more-replicas",
      children: "Scaling more replicas"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Want to scale more replicas? This can be achieved by adding an environment variable to your ", (0,jsx_runtime.jsx)(_components.code, {
        children: "compose.yaml"
      }), " and duplicating your ", (0,jsx_runtime.jsx)(_components.code, {
        children: "redis-replica"
      }), " entry."]
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Modify your ", (0,jsx_runtime.jsx)(_components.code, {
            children: "compose.yaml"
          }), " as follows:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-yaml",
            children: "services:\n  redis-leader:\n    container_name: redis-leader\n    image: redis:latest\n    ports:\n      - '6379'\n\n  redis-replica:\n    container_name: redis-replica\n    image: redis:latest\n    ports:\n      - '6379'\n    command: redis-server --replicaof redis-leader 6379\n\n  redis-replica-2:\n    container_name: redis-replica-2\n    image: redis:latest\n    ports:\n      - '6379'\n    command: redis-server --replicaof redis-leader 6379\n\n  web:\n    container_name: web\n    build: ./web\n    ports:\n      - '8080:8080'\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Run ", (0,jsx_runtime.jsx)(_components.code, {
            children: "podman compose up -d"
          }), " again to ensure the new container has been added and the new environment variable has propagated:"]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-sh",
            children: "podman compose up -d\n>>>> Executing external compose provider \"/usr/local/bin/docker-compose\". Please refer to the documentation for details. <<<<\n\n[+] Running 4/4\n✔ Container redis-replica-2  Started                                                                      0.0s\n✔ Container redis-leader     Running                                                                      0.0s\n✔ Container web              Started                                                                      0.0s\n✔ Container redis-replica    Running                                                                      0.0s\n"
          })
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



/***/ },

/***/ 65135
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/helloworld-516adc89ef8a509fb5ce998d3b0ea94b.png");

/***/ },

/***/ 83424
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/onboarding-59e0db2497389dec25a3b6bb8844a893.png");

/***/ },

/***/ 29979
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/openbrowser-9dda9ceaa832418fc532135f5921ccf2.png");

/***/ },

/***/ 34915
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/openterminal-32b76b2c26213e8cd4139cf9783b456c.png");

/***/ },

/***/ 23415
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/redis-cli-45bdb3866b5813d2cc9009e5474f0117.png");

/***/ },

/***/ 47296
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/redisreplica-c911ec791d20083c803f63c6d86f4b70.png");

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