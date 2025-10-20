"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[27970],{

/***/ 97773:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  assets: () => (/* binding */ assets),
  contentTitle: () => (/* binding */ contentTitle),
  "default": () => (/* binding */ MDXContent),
  frontMatter: () => (/* binding */ frontMatter),
  metadata: () => (/* reexport */ site_tutorial_testcontainers_with_podman_md_55a_namespaceObject),
  toc: () => (/* binding */ toc)
});

;// ./.docusaurus/docusaurus-plugin-content-docs/tutorial/site-tutorial-testcontainers-with-podman-md-55a.json
const site_tutorial_testcontainers_with_podman_md_55a_namespaceObject = /*#__PURE__*/JSON.parse('{"id":"testcontainers-with-podman","title":"Testcontainers with Podman","description":"Learn how to use Testcontainers with Podman and how to create basic tests using Testcontainers technology!","source":"@site/tutorial/testcontainers-with-podman.md","sourceDirName":".","slug":"/testcontainers-with-podman","permalink":"/tutorial/testcontainers-with-podman","draft":false,"unlisted":false,"tags":[{"inline":true,"label":"podman","permalink":"/tutorial/tags/podman"},{"inline":true,"label":"podman-desktop","permalink":"/tutorial/tags/podman-desktop"},{"inline":true,"label":"containers","permalink":"/tutorial/tags/containers"},{"inline":true,"label":"testcontainers","permalink":"/tutorial/tags/testcontainers"},{"inline":true,"label":"tests","permalink":"/tutorial/tags/tests"}],"version":"current","sidebarPosition":8,"frontMatter":{"sidebar_position":8,"title":"Testcontainers with Podman","description":"Learn how to use Testcontainers with Podman and how to create basic tests using Testcontainers technology!","keywords":["podman","podman-desktop","containers","testcontainers"],"tags":["podman","podman-desktop","containers","testcontainers","tests"]},"sidebar":"defaultSidebar","previous":{"title":"Getting started with Compose","permalink":"/tutorial/getting-started-with-compose"}}');
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
// EXTERNAL MODULE: ../node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(43023);
;// ./tutorial/testcontainers-with-podman.md


const frontMatter = {
	sidebar_position: 8,
	title: 'Testcontainers with Podman',
	description: 'Learn how to use Testcontainers with Podman and how to create basic tests using Testcontainers technology!',
	keywords: [
		'podman',
		'podman-desktop',
		'containers',
		'testcontainers'
	],
	tags: [
		'podman',
		'podman-desktop',
		'containers',
		'testcontainers',
		'tests'
	]
};
const contentTitle = 'What are Testcontainers';

const assets = {

};



const toc = [{
  "value": "Common use cases with Testcontainers",
  "id": "common-use-cases-with-testcontainers",
  "level": 2
}, {
  "value": "Setup Testcontainers with Podman",
  "id": "setup-testcontainers-with-podman",
  "level": 2
}, {
  "value": "Creating a project",
  "id": "creating-a-project",
  "level": 2
}, {
  "value": "Running tests",
  "id": "running-tests",
  "level": 2
}, {
  "value": "Conclusion",
  "id": "conclusion",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    admonition: "admonition",
    blockquote: "blockquote",
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
  };
  return (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [(0,jsx_runtime.jsx)(_components.p, {
      children: (0,jsx_runtime.jsx)(_components.img, {
        alt: "plane",
        src: (__webpack_require__(3051)/* ["default"] */ .A) + "",
        width: "1692",
        height: "440"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.header, {
      children: (0,jsx_runtime.jsx)(_components.h1, {
        id: "what-are-testcontainers",
        children: "What are Testcontainers"
      })
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: [(0,jsx_runtime.jsx)(_components.a, {
        href: "https://testcontainers.com/",
        children: "Testcontainers"
      }), " is an open source library that allows you to test any containerized dependencies, such as databases, various cloud technologies, or message brokers. For ease of use, Testcontainers has many preconfigured dependencies called modules."]
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Besides that, Testcontainers supports various languages in which you can easily write your tests, such as Python, Go, Rust, Ruby, JavaScript, .NET, Java, and others."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "common-use-cases-with-testcontainers",
      children: "Common use cases with Testcontainers"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Thanks to the container technology, you can obtain fresh, clean instances without any complex setup for use cases such as:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Data access layer integration tests"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "UI/Acceptance tests"
      }), "\n", (0,jsx_runtime.jsx)(_components.li, {
        children: "Application integration tests"
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "setup-testcontainers-with-podman",
      children: "Setup Testcontainers with Podman"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["Before we start, you need to have installed ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://podman.io/",
        children: "Podman"
      }), " and run it in socket listening:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-shell",
        children: "$ podman system service --time=0 &\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Set Testcontainers runtime to Podman by using one of the following options:"
    }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Enable the ", (0,jsx_runtime.jsx)(_components.a, {
            href: "https://podman-desktop.io/docs/migrating-from-docker/managing-docker-compatibility",
            children: "Docker Compatibility"
          }), " feature."]
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Create a ", (0,jsx_runtime.jsx)(_components.code, {
            children: ".testcontainers.properties"
          }), " file in your home directory for global configuration of your Testcontainers and add the following line to the configuration file:"]
        }), "\n", (0,jsx_runtime.jsxs)(_components.ul, {
          children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "MacOS"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-title=\".testcontainers.properties\"",
                children: "docker.host=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')\n"
              })
            }), "\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Run the following command after configuration:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-bash",
                children: "$ export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock\n"
              })
            }), "\n"]
          }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
            children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
              children: "Linux:"
            }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
              children: (0,jsx_runtime.jsx)(_components.code, {
                className: "language-title=\".testcontainers.properties\"",
                children: "docker.host=unix://${XDG_RUNTIME_DIR}/podman/podman.sock\n"
              })
            }), "\n", (0,jsx_runtime.jsx)(_components.admonition, {
              type: "note",
              children: (0,jsx_runtime.jsx)(_components.p, {
                children: "Every language supported by Testcontainers has different properties supported by the .testcontainers.properties file."
              })
            }), "\n"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsxs)(_components.blockquote, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
        children: [(0,jsx_runtime.jsx)(_components.strong, {
          children: (0,jsx_runtime.jsx)(_components.em, {
            children: "OPTIONAL:"
          })
        }), " If you are running Podman in rootless mode, you must disable Ryuk by defining this environment variable:"]
      }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
        children: (0,jsx_runtime.jsx)(_components.code, {
          className: "language-bash",
          children: "$ export TESTCONTAINERS_RYUK_DISABLED=true\n"
        })
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "creating-a-project",
      children: "Creating a project"
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "This example uses the Redis service and Redis module from Testcontainers. You can create a project and install all the dependencies by following the procedure."
    }), "\n", (0,jsx_runtime.jsxs)(_components.ol, {
      children: ["\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Initialize a project."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-bash",
            children: "$ npm init -y\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Installing dependencies."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-bash",
            children: "$ npm install testcontainers vitest @testcontainers/redis redis typescript --save-dev\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsxs)(_components.p, {
          children: ["Update ", (0,jsx_runtime.jsx)(_components.code, {
            children: "package.json"
          }), " file."]
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-json",
            metastring: "title=\"package.json\"",
            children: "...\n    \"scripts\": {\n    \"test\": \"vitest\"\n    },\n...\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Create basic CRUD operations using the Redis Node.js library."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-ts",
            metastring: "title=\"index.ts\"",
            children: "import { createClient, RedisClientType } from 'redis';\n\nlet redisClient: RedisClientType | undefined = undefined;\n\nexport async function connectRedis(url: string) {\n  redisClient = createClient({ url });\n  await redisClient.connect();\n  return redisClient;\n}\n\nexport async function setValue(key: string, value: string): Promise<string | null> {\n  if (!redisClient) {\n    throw new Error('Redis client is not connected');\n  }\n  return await redisClient.set(key, value);\n}\n\nexport async function getValue(key: string): Promise<string | null> {\n  if (!redisClient) {\n    throw new Error('Redis client is not connected');\n  }\n  return redisClient.get(key);\n}\n\nexport async function deleteValue(key: string[]): Promise<number> {\n  if (!redisClient) {\n    throw new Error('Redis client is not connected');\n  }\n  return await redisClient.del(key);\n}\n\nexport async function disconnectRedis() {\n  if (redisClient) {\n    await redisClient.quit();\n    redisClient = undefined;\n  }\n}\n"
          })
        }), "\n"]
      }), "\n", (0,jsx_runtime.jsxs)(_components.li, {
        children: ["\n", (0,jsx_runtime.jsx)(_components.p, {
          children: "Create basic tests for CRUD operations."
        }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
          children: (0,jsx_runtime.jsx)(_components.code, {
            className: "language-ts",
            metastring: "title=\"index.spec.ts\"",
            children: "import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest';\nimport { connectRedis, deleteValue, disconnectRedis, getValue, setValue } from '.';\nimport { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';\nimport { Wait } from 'testcontainers';\nimport { createClient } from 'redis';\n\nlet container: StartedRedisContainer;\n\nbeforeAll(async () => {\n  container = await new RedisContainer()\n    .withExposedPorts(6379)\n    .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))\n    .start();\n\n  await connectRedis(`redis://localhost:${container.getMappedPort(6379)}`);\n});\n\nafterAll(async () => {\n  await disconnectRedis();\n});\n\nbeforeEach(async () => {\n  // Flushind DB and adding to Redis some values before each test\n  const client = createClient({ url: `redis://localhost:${container.getMappedPort(6379)}` });\n  await client.connect();\n\n  await client.flushDb();\n  await client.set('preset-key', 'preset-value');\n  await client.set('preset-key1', 'preset-value1');\n  await client.quit();\n});\n\ntest('set value on server', async () => {\n  // Set value\n  const ret = await setValue('key', 'value');\n  expect(ret).toBe('OK');\n\n  // Update value\n  const ret1 = await setValue('key', 'updated-value');\n  expect(ret1).toBe('OK');\n});\n\ntest('get value from server', async () => {\n  // Get preset value\n  const value = await getValue('preset-key');\n  expect(value).toBe('preset-value');\n\n  // Get not existing value\n  const value1 = await getValue('key');\n  expect(value1).toBeNull();\n});\n\ntest('delete value on server', async () => {\n  // Delete two records in a same time\n  const res = await deleteValue(['preset-key', 'preset-key1']);\n  expect(res).toBe(2);\n\n  // Delete not existing record\n  const res1 = await deleteValue(['key']);\n  expect(res1).toBe(0);\n});\n"
          })
        }), "\n"]
      }), "\n"]
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "running-tests",
      children: "Running tests"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["When running Testcontainers for the first time, ensure that you run your tests in ", (0,jsx_runtime.jsx)(_components.code, {
        children: "DEBUG"
      }), " mode by using this command:"]
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        className: "language-bash",
        children: "$ DEBUG=testcontainers* npm test\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Then, you should be able to see lines similar to the ones below:"
    }), "\n", (0,jsx_runtime.jsx)(_components.pre, {
      children: (0,jsx_runtime.jsx)(_components.code, {
        children: "testcontainers [DEBUG] Loading \".testcontainers.properties\" file...\ntestcontainers [DEBUG] Loaded \".testcontainers.properties\" file\ntestcontainers [DEBUG] Found custom configuration: dockerHost: \"unix:///run/user/1000//podman/podman.sock\n"
      })
    }), "\n", (0,jsx_runtime.jsx)(_components.p, {
      children: "Those lines indicate that Testcontainers found the configuration file, and the containers are created on the Podman engine instead of Docker."
    }), "\n", (0,jsx_runtime.jsx)(_components.h2, {
      id: "conclusion",
      children: "Conclusion"
    }), "\n", (0,jsx_runtime.jsxs)(_components.p, {
      children: ["This tutorial provides a basic step-by-step walkthrough using the Testcontainers technology to run a ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://redis.io/",
        children: "Redis"
      }), " server with Podman. More examples can be found in the guides of ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://testcontainers.com/guides/",
        children: "Testcontainers"
      }), ". If you encounter any problems, feel free to open an issue on Podman Desktop's ", (0,jsx_runtime.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/podman-desktop/issues",
        children: "GitHub"
      }), "."]
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

/***/ 3051:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/testcontainers-0f97b0af41ad602eec79fe1756d415c5.png");

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