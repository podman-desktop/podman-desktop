"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[15855],{

/***/ 52489
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* reexport default export from named module */ _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_08_24_5_million_lessons_learned_md_93d_json__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var _site_docusaurus_docusaurus_plugin_content_blog_default_site_blog_2026_08_24_5_million_lessons_learned_md_93d_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56974);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62540);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43023);


const frontMatter = {
	title: '5 Lessons Learned After 5 Million Downloads',
	description: 'Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.',
	slug: '5-million-lessons-learned',
	authors: [
		'kyetter',
		'slemeur'
	],
	tags: [
		'podman-desktop',
		'5-million',
		'downloads',
		'celebrate',
		'community'
	],
	image: '/img/blog/5million/banner.jpg'
};
const contentTitle = undefined;

const assets = {
"authorsImageUrls": [undefined, undefined],
};



const toc = [{
  "value": "Wooohooo 🎉",
  "id": "wooohooo-",
  "level": 2
}, {
  "value": "1. Extensibility works",
  "id": "1-extensibility-works",
  "level": 2
}, {
  "value": "2. Scaling breaks things",
  "id": "2-scaling-breaks-things",
  "level": 2
}, {
  "value": "3. Building the community we want",
  "id": "3-building-the-community-we-want",
  "level": 2
}, {
  "value": "4. Adoption doesn&#39;t always look the way you expect",
  "id": "4-adoption-doesnt-always-look-the-way-you-expect",
  "level": 2
}, {
  "value": "5. Open source travels farther than you can see",
  "id": "5-open-source-travels-farther-than-you-can-see",
  "level": 2
}, {
  "value": "What&#39;s next",
  "id": "whats-next",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    em: "em",
    h2: "h2",
    img: "img",
    p: "p",
    strong: "strong",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_2__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img, {
        alt: "Banner announcing 5 million downloads",
        src: (__webpack_require__(34678)/* ["default"] */ .A) + "",
        width: "1200",
        height: "630"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "wooohooo-",
      children: "Wooohooo 🎉"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Podman Desktop just crossed ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.strong, {
        children: "5,000,000 downloads"
      }), "! Less than a year ago we were celebrating ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "/blog/3-million",
        children: "3 million"
      }), ", and now we're humbled to be at 5 million. That kind of growth doesn't happen without a community pushing us, challenging us, and choosing us. Thank you."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["Download numbers can easily become vanity metrics. So instead of just announcing one, we wanted to mark this milestone the way developers ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.em, {
        children: "actually"
      }), " like to celebrate: with a retro. Here's what came out of it."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "1-extensibility-works",
      children: "1. Extensibility works"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "The container landscape hasn't stood still since Podman Desktop launched: new tooling, AI, and constant churn in integration points, to name a few. Our extension-based architecture made it easier to respond, and that wasn't an accident. Many of us on the founding team came from the IDE space, building tools and extensions on top of VS Code, so making Podman Desktop extensible from day one was a deliberate choice, not an afterthought. We wanted people to be able to shape the tool to their own needs, and we wanted people working with other, related container technologies to be able to build their own extensions too."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Extensions like Apple Container and AI Lab let us adapt to the market without disrupting the core application. AI Lab in particular has been a great example of extensibility opening up entirely new use cases: it's helped developers realize they can run models locally using the container technology they already know, and from there, get inspired to build their own LLM-powered use cases. We're also seeing organizations build their own internal extensions to tailor Podman Desktop to their specific developer workflows or connect it to their own internal systems, which makes the tool easier to adopt at an enterprise scale."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "That said, staying this open comes at a cost we keep paying, not one we paid once. Features like our dashboard and onboarding flows are built so extensions can contribute their own views into them, and that constraint makes those areas harder to redesign or refactor than they would be in a closed system. Keeping the UI and styling consistent across a growing ecosystem of third-party extensions, without breaking them every time we ship an upgrade, takes real, ongoing care. It was a commitment we made early on, and one the team has never backed away from."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "2-scaling-breaks-things",
      children: "2. Scaling breaks things"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "For us, that was telemetry. When usage was low, we could gather the data we needed about product use without paying much attention to volume. That granular data was a great way to track feature adoption and inform the roadmap, and it's also genuinely helped us fix things fast: at one point we caught, directly through telemetry, that a QEMU change was breaking the Podman machine on certain setups, and were able to build and ship a patch before it turned into a wider wave of bug reports. Telemetry gave us patterns and context that users reporting an issue often can't provide on their own, since they don't always have a clean reproducer."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "As we grew, though, the cost of collecting all that data grew with it, and our approach hadn't kept pace. We had to sit down and rethink what we actually needed: which events tell us something about how well the application is performing, which ones tell us whether a feature is discovered and used, and which ones we were only collecting out of habit. We deliberately stopped measuring the things that fell into that last bucket. We now collect less, but more deliberately, and it's paying off in both directions: it's cheaper and clearer for us to act on, and it still gives us what we need to evaluate new features and the impact of changes we ship."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "3-building-the-community-we-want",
      children: "3. Building the community we want"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "More downloads brought more contributions, more issues, and more pull requests. While our progress relies on our excellent contributors, there have been growing pains. Some contributions didn't match our coding practices, or overlapped with work already in progress or planned for a later point on the roadmap. Contribution volume is up and that means real time spent chasing authors for follow-up instead of shipping."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Our response was to make the path clearer before people start, not just react after the fact: we published contributing guides, and added guardrails in the repository, including a bot that automatically checks pull request quality so contributors get that feedback directly, without waiting on a maintainer. It's made contributing easier, and contributions keep growing as a result, so reviewing them takes real time and coordination. That's a good problem to have, and we're happy with the pace of contributions we're getting today. The lesson: maintaining a community of contributors is paramount, and it's on us to build the guardrails that make that the easy path."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "4-adoption-doesnt-always-look-the-way-you-expect",
      children: "4. Adoption doesn't always look the way you expect"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "It's tempting to assume that if you build a great feature, people will use it. When we launched the Kubernetes Extension, adoption didn't match how useful we thought this feature was."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Kubernetes has actually been part of Podman's DNA since the very beginning; the name \"Podman\" itself comes from \"Pod Manager,\" a nod to Kubernetes pods. We know most containers built with Podman Desktop eventually land on a Kubernetes environment, and Kubernetes brings its own layer of complexity for developers. So working with the community, and with organizations running containers at scale on Kubernetes, we set out to build what developers actually needed: help shaping containers so they're ready for Kubernetes, and the ability to quickly inspect, test, and debug workloads, down to getting a terminal directly inside a running container. That work shipped as our Kubernetes dashboard, built in the open with the community, and we're genuinely happy with where it landed."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "So why didn't adoption immediately follow? We think it comes down to awareness and perception more than the feature itself. Most people know Podman first as the best alternative to Docker, and don't necessarily think of us as a tool that also helps them work with Kubernetes, even though that's been part of the roadmap from day one. Adoption doesn't always happen right away, and shifting how people perceive a tool can take longer than shipping the feature itself. Building a great product is part strategic vision, part user feedback, and part enablement and awareness. We try to stay grounded in how the product is used today, while still leaving room to make strategic bets for the future."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "5-open-source-travels-farther-than-you-can-see",
      children: "5. Open source travels farther than you can see"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "This last lesson might be the most encouraging. Building on open-source foundations has compounding value: it lets a community grow around a project in ways a closed, corporate roadmap never could. Adoption of developer tools still runs mostly on word of mouth, so we pay attention to every signal we can get: issues opened on GitHub, who shows up to our community calls, conversations at developer conferences, and Red Hat customers reaching out with questions of their own. Case in point, through those signals we've discovered large-scale corporate adoption of Podman Desktop that had been happening quietly, well before it ever showed up as a direct ask to our team."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "Five million downloads isn't really about the number. It shows that people are picking up Podman Desktop and gives us more to learn about where and how they use it."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2, {
      id: "whats-next",
      children: "What's next"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p, {
      children: ["We're bringing this retro to our ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a, {
        href: "https://github.com/podman-desktop/community/issues/25",
        children: "community call on Thursday, August 27"
      }), ", live, with room for questions and anyone who wants to celebrate with us."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p, {
      children: "From all of us on the Podman Desktop team, thank you for the downloads, the issues, the pull requests, the extensions, and the honest feedback that keeps teaching us these lessons. Here's to the next 5 million. 🚀"
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



/***/ },

/***/ 34678
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/banner-d5797627269f7b4e2f6a2482e4aca936.jpg");

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

/***/ 56974
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"permalink":"/blog/5-million-lessons-learned","source":"@site/blog/2026-08-24-5-million-lessons-learned.md","title":"5 Lessons Learned After 5 Million Downloads","description":"Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.","date":"2026-08-24T00:00:00.000Z","tags":[{"inline":true,"label":"podman-desktop","permalink":"/blog/tags/podman-desktop"},{"inline":true,"label":"5-million","permalink":"/blog/tags/5-million"},{"inline":true,"label":"downloads","permalink":"/blog/tags/downloads"},{"inline":true,"label":"celebrate","permalink":"/blog/tags/celebrate"},{"inline":true,"label":"community","permalink":"/blog/tags/community"}],"readingTime":6.57,"hasTruncateMarker":false,"authors":[{"name":"Kathryn Yetter","title":"Product Manager","url":"https://github.com/kyetter","imageURL":"https://github.com/kyetter.png","key":"kyetter","page":null},{"name":"Stevan Le Meur","title":"Product Manager","url":"https://github.com/slemeur","imageURL":"https://github.com/slemeur.png","key":"slemeur","page":null}],"frontMatter":{"title":"5 Lessons Learned After 5 Million Downloads","description":"Podman Desktop just crossed 5,000,000 downloads. Here are 5 lessons the team learned along the way.","slug":"5-million-lessons-learned","authors":["kyetter","slemeur"],"tags":["podman-desktop","5-million","downloads","celebrate","community"],"image":"/img/blog/5million/banner.jpg"},"unlisted":false,"nextItem":{"title":"Intel Mac support in Podman Desktop: What developers need to know","permalink":"/blog/intel-mac-podman-6-transition"}}');

/***/ }

}]);