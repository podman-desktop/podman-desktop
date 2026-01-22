"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[60603],{

/***/ 52206:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_11_26_ai_lab_first_app_md_337_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2024_11_26_ai_lab_first_app_md_337_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2738);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: 'Podman AI Lab - For developers to build AI Applications with LLMs running locally',
	description: 'Learn how to create your first AI application, by using Podman AI Lab',
	slug: 'podman-ai-lab-create-ai-app-with-llm-running-locally',
	authors: [
		'phmartin'
	],
	tags: [
		'podman-desktop',
		'extension',
		'ai',
		'llm',
		'local'
	],
	hide_table_of_contents: false
};
const contentTitle = 'Our first AI Application';

const assets = {
"authorsImageUrls": [undefined],
};



const toc = [{
  "value": "Preparing Podman Desktop and Podman AI Lab",
  "id": "preparing-podman-desktop-and-podman-ai-lab",
  "level": 2
}, {
  "value": "Testing a prompt with a model",
  "id": "testing-a-prompt-with-a-model",
  "level": 2
}, {
  "value": "Testing a recipe",
  "id": "testing-a-recipe",
  "level": 2
}, {
  "value": "Structure of a recipe",
  "id": "structure-of-a-recipe",
  "level": 3
}, {
  "value": "Creating our own app",
  "id": "creating-our-own-app",
  "level": 2
}, {
  "value": "Testing my own app locally",
  "id": "testing-my-own-app-locally",
  "level": 2
}, {
  "value": "Creating a recipe",
  "id": "creating-a-recipe",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    code: "code",
    h2: "h2",
    h3: "h3",
    img: "img",
    p: "p",
    pre: "pre",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "banner",
        src: (__webpack_require__(78357)/* ["default"] */ .A) + "",
        width: "1216",
        height: "832"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Red Hat provides an extension to Podman Desktop, Podman AI Lab, which lets developers discover examples of applications by using large language models (LLMs), and gives them a framework to create their own AI-based applications and share them with their team."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We will discover, through this article, the different steps to create our first AI application, and to add it to the catalog of recipes of Podman AI Lab."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "For our first experiment, we will work on a micro-service for the podman-desktop.io website. The micro-service would receive the search terms from the website, and would ask the model to find the best matching pages, before returning the result to the website."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "my first app",
        src: (__webpack_require__(22764)/* ["default"] */ .A) + "",
        width: "1016",
        height: "574"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "preparing-podman-desktop-and-podman-ai-lab",
      children: "Preparing Podman Desktop and Podman AI Lab"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["If you haven't done it yet, first ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://podman-desktop.io/docs/ai-lab/installing",
        children: "install Podman Desktop and its extension Podman AI Lab"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["To have a better experience, it is recommended to use the GPU acceleration to serve the model. If you have such a GPU on your machine, you will need to create a Podman machine with the LibKrun provider (on MacOS). More details on ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://developers.redhat.com/articles/2024/09/10/gpu-support-podman-ai-lab",
        children: "the GPU support for Podman AI Lab"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "At the time of writing, the GPU support is still experimental on Podman AI Lab. You will need to enable the option on the Preferences to enable it."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a podman machine running using libkrun",
        src: (__webpack_require__(38437)/* ["default"] */ .A) + "",
        width: "1440",
        height: "502"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "GPU support for inference servers preference is enabled",
        src: (__webpack_require__(40849)/* ["default"] */ .A) + "",
        width: "1504",
        height: "632"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "testing-a-prompt-with-a-model",
      children: "Testing a prompt with a model"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman AI Lab provides a catalog of open source models that can be used locally. You can go to the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Models > Catalog"
      }), " page to download the model of your choice. For this article, we will use the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Mistral-7B-instruct"
      }), " model."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Mistral model is downloaded",
        src: (__webpack_require__(75036)/* ["default"] */ .A) + "",
        width: "1758",
        height: "330"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Once a model is downloaded, we can test and interact with this model to try to find the best prompt for our application. For chat models, Podman AI Lab provides a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Playground"
      }), ", so we can test different prompts and validate that the responses of the model are adequate."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Let's start a new playground (from the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Models > Playgrounds"
      }), " menu), and send our first prompt:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-text",
        children: "Give me a list of pages in the website podman-desktop.io related to \"build an image\"\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The model should reply with some list of pages, in a human-readable form (see the screenshot below, for the response we received)."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a first prompt with human-readable output",
        src: (__webpack_require__(12595)/* ["default"] */ .A) + "",
        width: "1766",
        height: "1094"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The problem is that the response is in human-readable form, but we don't want the API to return this response as is. We want to have the name and the url of the pages, and send them to the website, so the website can display these pages with its preferred format."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "For this, we can try to ask the model to reply with a structured response, with the following prompt:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-text",
        children: "Give me a list of pages in the website podman-desktop.io related to \"build an image\" as JSON output as an array of objects with 2 fields name and url\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This time, we received a response in JSON format, which is more suitable for our needs."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a prompt with structured output",
        src: (__webpack_require__(73423)/* ["default"] */ .A) + "",
        width: "1750",
        height: "1196"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We don't expect the user to ask such a precise question, and we would prefer to send to the model the exact question of the user, without modifying it in real time. To achieve this, chat models provide a system prompt feature. The system prompt can be defined at the beginning of the chat session."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Podman AI Lab supports this feature, let's restart a Playground session with the following system prompt:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-text",
        children: "Give me a list of pages in the website podman-desktop.io related to the request as JSON output as an array of objects with 2 fields name and url\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Then, send the prompt ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "build an image"
      }), ", to simulate a realistic search input of a user."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We can see in the screenshot below that the model still returns a response suitable for our use case."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a session with a system prompt",
        src: (__webpack_require__(87443)/* ["default"] */ .A) + "",
        width: "1750",
        height: "1196"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
        children: "Please note that this section was not a course on writing the best prompt, I'm sure you will find much more efficient prompts for this purpose. The purpose of this section is to demonstrate how you can iterate with Podman AI Lab to refine the prompts you want to use for your application."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "testing-a-recipe",
      children: "Testing a recipe"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Now that we have a suitable prompt to use for our application, it is time to start our application itself."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Many developers prefer to have a working example of application to start with, and Podman AI Lab provides such examples with a catalog of recipes, visible in the page ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "AI Apps > Recipe Catalog"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Let's select the Chatbot recipe (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "More details"
      }), " link on the Chatbot card), and start it with the Mistral model (by pressing the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Start"
      }), " button and filling the form)."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Once the application is started, we can access the list of running apps in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "AI Apps > Running"
      }), " page, and we can access the app's UI by clicking on the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Open AI App"
      }), " link."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We can test again by typing our prompt (not the one with a system prompt, as the recipe does not support providing a system prompt), and see that the response is very similar to the one received from the playground."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a session on the Chatbot recipe",
        src: (__webpack_require__(65755)/* ["default"] */ .A) + "",
        width: "1566",
        height: "1122"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Back to the recipe's details page, we can access the sources of the recipe by clicking on the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Open in VSCode"
      }), " button, the respository's link or the link ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Local clone"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3, {
      id: "structure-of-a-recipe",
      children: "Structure of a recipe"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The entrypoint of a recipe is the file ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "ai-lab.yaml"
      }), " present in the repository of the recipe."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Let's examine the content of this file (the syntax of the file is specified in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-ai-lab/blob/main/PACKAGING-GUIDE.md#recipe-configuration-file",
        children: "this documentation"
      }), ") for the chatbot example."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-yaml",
        children: "version: v1.0\napplication:\n  type: language\n  name: ChatBot_Streamlit\n  description: Chat with a model service in a web frontend.\n  containers:\n    - name: llamacpp-server\n      contextdir: ../../../model_servers/llamacpp_python\n      containerfile: ./base/Containerfile\n      model-service: true\n      backend:\n        - llama-cpp\n      arch:\n        - arm64\n        - amd64\n      ports:\n        - 8001\n      image: quay.io/ai-lab/llamacpp_python:latest\n    - name: streamlit-chat-app\n      contextdir: app\n      containerfile: Containerfile\n      arch:\n        - arm64\n        - amd64\n      ports:\n        - 8501\n      image: quay.io/ai-lab/chatbot:latest\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The file defines two containers, one for the inference server and one for the application itself."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The first container, for the inference server, is generic and can be reused for any app using a chat model."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["The second one is the one we are particularly interested in. It defines how the container's image for the application is built. It points to the Containerfile used to build the image, on which we can find the source code for the app: in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "app/chatbot_ui.py"
      }), " file."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Looking at the Python source file, we can see that the application uses the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "streamlit"
      }), " framework for the UI part, and the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "langchain"
      }), " framework for discussing with the model."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We can adapt this source code, by replacing the UI part with a framework to make the app a REST service, and keep the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "langchain"
      }), " part."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["An interesting part of the source code is that the recipe does not expose to the user the system prompt, but defines one internally (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "You are world class technical advisor"
      }), "):"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-python",
        children: "prompt = ChatPromptTemplate.from_messages([\n    (\"system\", \"You are world class technical advisor.\"),\n    MessagesPlaceholder(variable_name=\"history\"),\n    (\"user\", \"{input}\")\n])\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This is exactly what we want to do in our application, we will be able to indicate here the system prompt we have found earlier."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "creating-our-own-app",
      children: "Creating our own app"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Adapting the source code for the purpose of our application is out of the scope of this article, let's see the result in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/redhat-developer/podman-desktop-demo/blob/main/ai-lab-demo/recipe/app/service.py",
        children: "our app repository"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["As discussed in the previous section, we have replaced the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "streamlit"
      }), " part with the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "flask"
      }), " framework to create a REST API with two endpoints: one for the health check on ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/"
      }), " necessary for Podman AI Lab, and another one on ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "/query"
      }), ", which will be the endpoint on which the micro-service's user will send requests."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "We have also indicated our own system prompt:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-python",
        children: "prompt = ChatPromptTemplate.from_messages([\n    (\"system\", \"\"\"\n        reply in JSON format with an array of objects with 2 fields name and url\n        (and with no more text than the JSON output),\n        with a list of pages in the website https://www.podman-desktop.io related to my query\n    \"\"\"),\n    MessagesPlaceholder(variable_name=\"history\"),\n    (\"user\", \"{input}\")\n])\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "testing-my-own-app-locally",
      children: "Testing my own app locally"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["To iterate during the development of our app, we can test our app locally in our host system, while using the model served by Podman AI Lab. For this, we need to start a new model service from the page ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Models > Services"
      }), ", by clicking the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "New Model Service"
      }), ", then choosing the appropriate model (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Mistral-7B-instruct"
      }), " in our case), and specifying a port number (let's say 56625)."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a running inference server with Mistral model",
        src: (__webpack_require__(61940)/* ["default"] */ .A) + "",
        width: "1772",
        height: "262"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Then, we can run our app, by specifying through the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "MODEL_ENDPOINT"
      }), " environment variable how to access the model service."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "my app running locally",
        src: (__webpack_require__(98850)/* ["default"] */ .A) + "",
        width: "1744",
        height: "1100"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Finally, we can send a request to this app running locally, and listening in the port 5000, and we can check in the screenshot below that the response is, as expected, a list of pages (name and url) in JSON format:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "a request to the micro-service",
        src: (__webpack_require__(29393)/* ["default"] */ .A) + "",
        width: "1352",
        height: "666"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "creating-a-recipe",
      children: "Creating a recipe"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The last step is to add this application to the Podman AI Lab recipe catalog."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman AI Lab provides a way for a user to extend the provided catalog with its own recipes. This can be done by adding a file in a specific directory, as described ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/containers/podman-desktop-extension-ai-lab/tree/main?tab=readme-ov-file#-providing-a-custom-catalog",
        children: "in this documentation"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        className: "language-json",
        children: "{\n  \"version\": \"1.0\",\n  \"recipes\": [\n    {\n      \"id\": \"search-podman-desktop-io\",\n      \"description\": \"Search on Podman-desktop.io website\",\n      \"name\": \"Search Podman-desktop.io\",\n      \"repository\": \"https://github.com/redhat-developer/podman-desktop-demo\",\n      \"ref\": \"main\",\n      \"icon\": \"natural-language-processing\",\n      \"categories\": [\"natural-language-processing\"],\n      \"basedir\": \"ai-lab-demo/recipe\",\n      \"readme\": \"\",\n      \"recommended\": [\"hf.TheBloke.mistral-7b-instruct-v0.2.Q4_K_M\"],\n      \"backend\": \"llama-cpp\"\n    }\n  ]\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["By creating the file ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "$HOME/.local/share/containers/podman-desktop/extensions-storage/redhat.ai-lab/user-catalog.json"
      }), " with the content above, you should now be able to see a new recipe ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code, {
        children: "Search Podman-desktop.io"
      }), " in the recipe catalog of Podman AI Lab, and run it as any other recipe. And, of course, you can share this file with your colleagues to share with them your latest experiment."]
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

/***/ 22764:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/00-my-first-ai-app-975275e358520eba078b928a1d6dab24.png");

/***/ }),

/***/ 38437:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/01-ai-lab-demo-libkrun-machine-156b16fdbe8420e178c1841ad4f87777.png");

/***/ }),

/***/ 40849:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/02-ai-lab-demo-gpu-preference-b07601b3bf8351400ddfe29e36cb374f.png");

/***/ }),

/***/ 75036:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/03-ai-lab-demo-mistral-model-downloaded-fae651cc75b1359854abac10de7565bd.png");

/***/ }),

/***/ 12595:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/04-ai-lab-demo-prompt-1-75066ea8b569d8340f75ba7d133cfd2a.png");

/***/ }),

/***/ 73423:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/05-ai-lab-demo-prompt-json-a401e74714648bea7435dd03e1472fd8.png");

/***/ }),

/***/ 87443:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/06-ai-lab-demo-system-prompt-7569049a092952cf0bf43ce8aa05b3fa.png");

/***/ }),

/***/ 65755:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/07-ai-lab-demo-recipe-session-45f989e2f16ee20e4e7e0af826461e7f.png");

/***/ }),

/***/ 61940:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/08-ai-lab-demo-inference-server-39bdfa098bc1b65c8c2835223f92556b.png");

/***/ }),

/***/ 98850:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/09-ai-lab-demo-my-app-local-aa55b298edb1f3a0cc25347006ea6849.png");

/***/ }),

/***/ 29393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/10-ai-lab-demo-my-app-http-request-b93e4de45b3add66d3f97c73c5f0ffea.png");

/***/ }),

/***/ 78357:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/banner-1f24d8fca8ff7163882c09d2d0a667cb.png");

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

/***/ 2738:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/podman-ai-lab-create-ai-app-with-llm-running-locally","source":"@site/blog/2024-11-26-ai-lab-first-app.md","title":"Podman AI Lab - For developers to build AI Applications with LLMs running locally","description":"Learn how to create your first AI application, by using Podman AI Lab","date":"2024-11-26T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"extension","permalink":"/blog/tags/extension"},{"inline":true,"label":"ai","permalink":"/blog/tags/ai"},{"inline":true,"label":"llm","permalink":"/blog/tags/llm"},{"inline":true,"label":"local","permalink":"/blog/tags/local"}],"readingTime":9.4,"hasTruncateMarker":false,"authors":[{"name":"Philippe Martin","title":"Principal Software Engineer","url":"https://github.com/feloy","imageURL":"https://github.com/feloy.png","key":"phmartin","page":null}],"frontMatter":{"title":"Podman AI Lab - For developers to build AI Applications with LLMs running locally","description":"Learn how to create your first AI application, by using Podman AI Lab","slug":"podman-ai-lab-create-ai-app-with-llm-running-locally","authors":["phmartin"],"tags":["podman-desktop","extension","ai","llm","local"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Podman Desktop 1.15 Release","permalink":"/blog/podman-desktop-release-1.15"},"nextItem":{"title":"Podman Desktop + CNCF - Community Driven Move","permalink":"/blog/2024/11/14/podman-desktop-cncf"}}');

/***/ })

}]);