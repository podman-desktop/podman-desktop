"use strict";
(globalThis["webpackChunkdocs"] = globalThis["webpackChunkdocs"] || []).push([[51162],{

/***/ 40452
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BrowserOnly)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63696);
/* harmony import */ var _docusaurus_useIsBrowser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(86681);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62540);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Similar comp to the one described here:
// https://www.joshwcomeau.com/react/the-perils-of-rehydration/#abstractions
function BrowserOnly({children,fallback}){const isBrowser=(0,_docusaurus_useIsBrowser__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)();if(isBrowser){if(typeof children!=='function'&&"production"==='development')// removed by dead control flow
{}return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,{children:children?.()});}return fallback??null;}

/***/ },

/***/ 48419
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16655);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63696);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62540);
function TailWindThemeSelector(){function updadeTailwindDarkTheme(){if(!document?.documentElement){return;}const html=document.documentElement;if(html.dataset?.theme==='dark'){html.classList.add('dark');setTimeout(()=>{html.classList.add('dark');},100);}else{html.classList.remove('dark');setTimeout(()=>{html.classList.remove('dark');},100);}}(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{if(_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM){updadeTailwindDarkTheme();}},[_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM]);// monitor the attribute managed by docusaurus
(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{if(!_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM){return;}const mutationObserver=new MutationObserver(mutations=>{mutations.forEach(mutation=>{if(mutation.type==='attributes'&&(mutation.attributeName==='data-rh'||mutation.attributeName==='data-theme')){updadeTailwindDarkTheme();}});});mutationObserver.observe(document.documentElement,{attributes:true,childList:false,subtree:false});return()=>{mutationObserver.disconnect();};},[_docusaurus_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.canUseDOM]);return/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{});}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TailWindThemeSelector);

/***/ },

/***/ 72935
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Home)
});

// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/BrowserOnly.js
var BrowserOnly = __webpack_require__(40452);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useDocusaurusContext.js
var useDocusaurusContext = __webpack_require__(67032);
// EXTERNAL MODULE: ../node_modules/@fortawesome/free-solid-svg-icons/index.mjs
var free_solid_svg_icons = __webpack_require__(65958);
// EXTERNAL MODULE: ../node_modules/@fortawesome/react-fontawesome/dist/index.js
var dist = __webpack_require__(97660);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(45968);
// EXTERNAL MODULE: ../node_modules/@docusaurus/core/lib/client/exports/useGlobalData.js
var useGlobalData = __webpack_require__(25466);
// EXTERNAL MODULE: ../node_modules/@fortawesome/free-brands-svg-icons/index.mjs
var free_brands_svg_icons = __webpack_require__(95601);
// EXTERNAL MODULE: ./src/components/TelemetryLink.tsx
var TelemetryLink = __webpack_require__(46543);
// EXTERNAL MODULE: ./src/components/utils.ts
var utils = __webpack_require__(82019);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(63696);
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(62540);
;// ./src/components/downloads/OSDownloadCard.tsx
/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/function CopyButton({onCopy}){const[copied,setCopied]=react.useState(false);react.useEffect(()=>{if(!copied)return undefined;const timeout=window.setTimeout(()=>setCopied(false),1500);return()=>window.clearTimeout(timeout);},[copied]);return/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{className:"relative shrink-0 group",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("button",{type:"button","aria-label":copied?'Copied':'Copy to clipboard',className:"p-1 bg-transparent border-0 cursor-pointer text-charcoal-300 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-300",onClick:event=>{event.stopPropagation();onCopy().then(()=>setCopied(true)).catch(err=>{console.error('unable to copy instructions',err);});},children:/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{size:"xs",icon:copied?free_solid_svg_icons/* faCheck */.e68:free_solid_svg_icons/* faPaste */.R9T,className:"text-xl"})}),/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal-800 dark:bg-charcoal-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",children:copied?'Copied':'Copy to clipboard'})]});}function InstallCommand({command}){return/*#__PURE__*/(0,jsx_runtime.jsxs)("code",{className:"inline-flex items-center gap-1.5 w-full max-w-full min-w-0 box-border dark:bg-charcoal-800/50 bg-gray-400/50 px-2 py-1 text-sm dark:text-purple-200 text-purple-600",children:[/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{size:"xs",icon:free_solid_svg_icons/* faTerminal */.MNM,className:"shrink-0 mt-0.5"}),/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"min-w-0 flex-1 wrap-break-word text-left",children:command}),/*#__PURE__*/(0,jsx_runtime.jsx)(CopyButton,{onCopy:()=>navigator.clipboard.writeText(command)})]});}function OSDownloadCard({osName,osIcon,highlighted=false,primaryDownload,otherDownloads,installCommand,additionalContent}){const[expanded,setExpanded]=react.useState(false);const toggleExpanded=()=>{if(!expanded){(0,utils/* sendGoatCounterEvent */.i)('download',`expand-${osName}`);}setExpanded(value=>!value);};return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:`rounded-lg dark:text-gray-400 text-charcoal-300 bg-gray-400/25 dark:bg-charcoal-450/25 ${highlighted?'ring-2 ring-purple-500':''}`,children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-col md:flex-row md:items-center gap-4 text-charcoal-300 dark:text-white cursor-pointer select-none",children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex items-center gap-3 min-w-0 flex-1 px-6 py-5 w-full self-stretch",role:"button",tabIndex:0,onClick:toggleExpanded,onKeyDown:event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleExpanded();}},"aria-expanded":expanded,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{size:"2x",icon:osIcon,className:"shrink-0 text-purple-500"}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"min-w-0 flex-1 flex flex-col gap-0.5",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("p",{className:"text-lg md:text-xl font-medium leading-tight m-0",children:osName}),/*#__PURE__*/(0,jsx_runtime.jsxs)("p",{className:"text-xs leading-tight m-0 text-charcoal-300 dark:text-gray-400",children:["Podman Desktop for ",osName]})]}),/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"md:hidden shrink-0",children:/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{icon:free_solid_svg_icons/* faChevronDown */.Jt$,className:`transition-transform ${expanded?'rotate-180':''}`})})]}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex items-center gap-6 w-full md:w-auto md:shrink-0 px-6 py-5",children:[/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{className:"flex flex-col items-stretch flex-1 md:flex-initial md:w-52 min-w-0",onClick:event=>event.stopPropagation(),onKeyDown:event=>event.stopPropagation(),children:[/*#__PURE__*/(0,jsx_runtime.jsxs)(TelemetryLink/* TelemetryLink */.E,{className:`w-full no-underline hover:no-underline inline-flex justify-center border py-2 px-5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-sm text-md font-semibold items-center transition-colors ${highlighted?'border-purple-500 bg-purple-500 hover:bg-purple-600 hover:border-purple-600 text-white':'border-purple-500 bg-transparent text-purple-600 dark:text-purple-500 hover:bg-purple-500 hover:text-white dark:hover:text-white'}`,eventPath:"download",eventTitle:primaryDownload.eventTitle,to:primaryDownload.url,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{size:"1x",icon:free_solid_svg_icons/* faDownload */.cbP,className:"mr-2"}),"Download"]}),/*#__PURE__*/(0,jsx_runtime.jsx)("p",{className:"block w-full mt-1 text-[0.675rem] leading-tight text-center m-0",children:primaryDownload.caption})]}),/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"hidden md:flex shrink-0",role:"button",tabIndex:0,onClick:toggleExpanded,onKeyDown:event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleExpanded();}},"aria-expanded":expanded,children:/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{icon:free_solid_svg_icons/* faChevronDown */.Jt$,className:`transition-transform ${expanded?'rotate-180':''}`})})]})]}),expanded&&/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"px-6 md:px-16 pr-4 pb-3 flex flex-col gap-2 border-t border-purple-500/40 pt-3",children:[otherDownloads,installCommand&&/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-nowrap items-center gap-2 min-w-0 max-w-full",children:[/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{size:"sm",icon:installCommand.icon,className:"shrink-0"}),/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{className:"text-sm shrink-0",children:[installCommand.label,":"]}),/*#__PURE__*/(0,jsx_runtime.jsx)(InstallCommand,{command:installCommand.command})]}),additionalContent]})]});}
;// ./src/components/downloads/linux.tsx
/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/function LinuxDownloads({highlighted=false}){const{latestRelease:{linux,version}}=(0,useGlobalData/* usePluginData */.P_)('docusaurus-plugin-github-metadata');const otherDownloads=/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-wrap items-center gap-x-4 gap-y-1 text-sm",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"text-charcoal-300 dark:text-gray-400",children:"Other:"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-linux",to:linux.amd64,children:"AMD64 binary"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-linux",to:linux.arm64,children:"ARM64 binary"})]});return/*#__PURE__*/(0,jsx_runtime.jsx)(OSDownloadCard,{osName:"Linux",osIcon:free_brands_svg_icons/* faLinux */.M_V,highlighted:highlighted,primaryDownload:{url:linux.flatpak,eventTitle:'download-linux',caption:`Linux *.flatpak, version ${version}`},otherDownloads:otherDownloads,installCommand:{icon:free_brands_svg_icons/* faLinux */.M_V,label:/*#__PURE__*/(0,jsx_runtime.jsx)(Link/* default */.A,{className:"underline text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200",href:"https://flathub.org/apps/details/io.podman_desktop.PodmanDesktop",onClick:event=>event.stopPropagation(),children:"Flathub"}),command:'flatpak install flathub io.podman_desktop.PodmanDesktop'}});}
;// ./src/components/downloads/macos.tsx
/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/function MacOSDownloads({highlighted=false}){const{latestRelease:{macos,version}}=(0,useGlobalData/* usePluginData */.P_)('docusaurus-plugin-github-metadata');const otherDownloads=/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-wrap items-center gap-x-4 gap-y-1 text-sm",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"text-charcoal-300 dark:text-gray-400",children:"Other:"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-mac",to:macos.x64,children:"Intel"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-mac",to:macos.arm64,children:"Apple silicon"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-mac",to:macos.airgapsetupX64,children:"Air-gapped Intel"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-mac",to:macos.airgapsetupArm64,children:"Air-gapped Apple silicon"})]});return/*#__PURE__*/(0,jsx_runtime.jsx)(OSDownloadCard,{osName:"macOS",osIcon:free_brands_svg_icons/* faApple */.qKs,highlighted:highlighted,primaryDownload:{url:macos.universal,eventTitle:'download-mac',caption:`Universal *.dmg, version ${version}`},otherDownloads:otherDownloads,installCommand:{icon:free_solid_svg_icons/* faBeer */.CZR,label:'Brew',command:'brew install --cask podman-desktop'}});}
;// ./src/components/downloads/windows.tsx
/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/function WindowsDownloads({highlighted=false}){const{latestRelease:{windows,version}}=(0,useGlobalData/* usePluginData */.P_)('docusaurus-plugin-github-metadata');const otherDownloads=/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"flex flex-wrap items-center gap-x-4 gap-y-1 text-sm",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"text-charcoal-300 dark:text-gray-400",children:"Other:"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-windows",to:windows.setupArm64,children:"Arm64 installer"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-windows",to:windows.binaryX64,children:"Portable x64"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-windows",to:windows.binaryArm64,children:"Portable arm64"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-windows",to:windows.airgapsetupX64,children:"Air-gapped x64"}),/*#__PURE__*/(0,jsx_runtime.jsx)(TelemetryLink/* TelemetryLink */.E,{className:"underline dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 font-semibold",eventPath:"download",eventTitle:"download-windows",to:windows.airgapsetupArm64,children:"Air-gapped arm64"})]});const additionalContent=/*#__PURE__*/(0,jsx_runtime.jsx)("div",{children:/*#__PURE__*/(0,jsx_runtime.jsxs)(Link/* default */.A,{className:"underline inline-flex items-center dark:text-white text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 py-1 font-semibold text-sm",href:"docs/installation/windows-install",onClick:event=>event.stopPropagation(),children:[/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{size:"1x",icon:free_brands_svg_icons/* faWindows */.tQI,className:"mr-2"}),"Package Managers Guide"]})});return/*#__PURE__*/(0,jsx_runtime.jsx)(OSDownloadCard,{osName:"Windows",osIcon:free_brands_svg_icons/* faWindows */.tQI,highlighted:highlighted,primaryDownload:{url:windows.setupX64,eventTitle:'download-windows',caption:`Windows installer x64, version ${version}`},otherDownloads:otherDownloads,installCommand:{icon:free_brands_svg_icons/* faMicrosoft */.uu9,label:'winget',command:'winget install -e --id RedHat.Podman-Desktop'},additionalContent:additionalContent});}
// EXTERNAL MODULE: ./src/components/TailWindThemeSelector/index.tsx
var TailWindThemeSelector = __webpack_require__(48419);
// EXTERNAL MODULE: ../node_modules/@docusaurus/theme-classic/lib/theme/Layout/index.js + 76 modules
var Layout = __webpack_require__(16805);
;// ./src/pages/downloads/index.tsx
function DownloadsContent(){const detectedOS=(0,utils/* getClientPlatform */.$)();const[showOtherPlatforms,setShowOtherPlatforms]=react.useState(false);const ShowOtherPlatformsButton=()=>{return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{children:/*#__PURE__*/(0,jsx_runtime.jsxs)("button",{type:"button",onClick:()=>setShowOtherPlatforms(value=>!value),className:"inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-colors duration-200 bg-transparent","aria-expanded":showOtherPlatforms,children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:"min-w-35 text-left",children:showOtherPlatforms?'Hide other platforms':'Show other platforms'}),/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* FontAwesomeIcon */.gc,{icon:free_solid_svg_icons/* faChevronDown */.Jt$,className:`w-3.5 shrink-0 transition-transform ${showOtherPlatforms?'rotate-180':''}`})]})});};// Render downloads in order: detected OS first (expanded), then others
const renderDownloads=()=>{if(detectedOS?.os==='Windows'){return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(WindowsDownloads,{highlighted:true}),/*#__PURE__*/(0,jsx_runtime.jsx)(ShowOtherPlatformsButton,{}),showOtherPlatforms&&/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(MacOSDownloads,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(LinuxDownloads,{})]})]});}else if(detectedOS?.os==='macOS'){return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(MacOSDownloads,{highlighted:true}),/*#__PURE__*/(0,jsx_runtime.jsx)(ShowOtherPlatformsButton,{}),showOtherPlatforms&&/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(WindowsDownloads,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(LinuxDownloads,{})]})]});}else if(detectedOS?.os==='Linux'){return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(LinuxDownloads,{highlighted:true}),/*#__PURE__*/(0,jsx_runtime.jsx)(ShowOtherPlatformsButton,{}),showOtherPlatforms&&/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(WindowsDownloads,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(MacOSDownloads,{})]})]});}// Default order if OS cannot be detected (show all)
return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(WindowsDownloads,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(MacOSDownloads,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(LinuxDownloads,{})]});};return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"container mx-auto flex flex-col pb-16",children:[/*#__PURE__*/(0,jsx_runtime.jsx)(TailWindThemeSelector/* default */.A,{}),/*#__PURE__*/(0,jsx_runtime.jsx)("section",{className:"w-full bg-hero-pattern bg-no-repeat bg-top bg-contain",children:/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:"bg-white/30 dark:bg-transparent w-full pb-8",children:[/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"w-full mb-8",children:/*#__PURE__*/(0,jsx_runtime.jsx)("h1",{className:"text-2xl sm:text-3xl lg:text-4xl leading-tight m-0 title-font font-medium text-charcoal-300 dark:text-white",children:"Downloads"})}),/*#__PURE__*/(0,jsx_runtime.jsx)("h2",{className:"text-2xl leading-tight m-0 mb-2 font-bold text-charcoal-300 dark:text-white",children:"Open source Podman Desktop"}),/*#__PURE__*/(0,jsx_runtime.jsx)("p",{className:"m-0 mb-6 text-charcoal-300 dark:text-gray-400 max-w-3xl",children:"Free and open source Podman Desktop for macOS, Windows, and Linux."}),/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"flex flex-col gap-2.5 w-full",children:renderDownloads()})]})})]});}function Home(){const{siteConfig}=(0,useDocusaurusContext/* default */.A)();return/*#__PURE__*/(0,jsx_runtime.jsx)(Layout/* default */.A,{title:siteConfig.title,description:"Downloads",children:/*#__PURE__*/(0,jsx_runtime.jsx)(BrowserOnly/* default */.A,{fallback:/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"container mx-auto py-16",children:"Loading downloads\u2026"}),children:()=>/*#__PURE__*/(0,jsx_runtime.jsx)(DownloadsContent,{})})});}

/***/ }

}]);