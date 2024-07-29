"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1782],{544:(e,t,o)=>{o.d(t,{Z:()=>i});var s=o(161),a=o(27378),r=o(24246);const i=function(){function e(){if(!document?.documentElement)return;const e=document.documentElement;"dark"===e.dataset?.theme?(e.classList.add("dark"),setTimeout((()=>{e.classList.add("dark")}),100)):(e.classList.remove("dark"),setTimeout((()=>{e.classList.remove("dark")}),100))}return(0,a.useEffect)((()=>{s.Z.canUseDOM&&e()}),[s.Z.canUseDOM]),(0,a.useEffect)((()=>{if(!s.Z.canUseDOM)return;const t=new MutationObserver((t=>{t.forEach((t=>{"attributes"!==t.type||"data-rh"!==t.attributeName&&"data-theme"!==t.attributeName||e()}))}));return t.observe(document.documentElement,{attributes:!0,childList:!1,subtree:!1}),()=>{t.disconnect()}}),[s.Z.canUseDOM]),(0,r.jsx)("div",{})}},23539:(e,t,o)=>{o.r(t),o.d(t,{default:()=>h});var s=o(36641),a=o(98948),r=o(50353),i=o(19374),n=o(92739),l=(o(27378),o(24246));function c(e,t,o){return`linear-gradient(${o??0}deg, ${e}, ${t})`}const d=e=>(0,l.jsx)("span",{style:{background:c(e.colorFrom,e.colorTo,e.gradientAngle),backgroundClip:"text",boxDecorationBreak:"clone"},className:"text-transparent",children:e.content});var m=o(544),x=o(40684);const p=[{id:"chatbot",name:"LLM Chatbot",content:"Experiment prompting locally",icon:i.vto,colorFrom:"#9bfacc",colorTo:"#fff",iconColor:"#36f8a7"},{id:"summarizer",name:"Text Summarizer",content:"Get insight on large text corpus",icon:i.nfZ,colorFrom:"#9cf4fd",colorTo:"#fff",iconColor:"#2fecfc"},{id:"speech-to-text",name:"Speech to text",content:"Get transcript from any audio file",icon:i.UOM,colorFrom:"#f4acce",colorTo:"#fff",iconColor:"#e54b95"},{id:"obj-detection",name:"Object Detection",content:"Get started with computer vision",icon:i.M9J,colorFrom:"#fbe696",colorTo:"#fff",iconColor:"#fccf44"}];function h(){const{siteConfig:e}=(0,r.Z)();return(0,l.jsxs)(x.Z,{title:e.title,description:"Extensibility",children:[(0,l.jsx)(m.Z,{}),(0,l.jsx)("section",{className:"text-gray-900 dark:text-gray-700 body-font",children:(0,l.jsxs)("div",{className:"container mx-auto flex px-5 py-6 items-center justify-center flex-col",children:[(0,l.jsxs)("div",{className:"text-center lg:w-2/3 w-full",children:[(0,l.jsxs)("h1",{className:"sm:text-4xl text-3xl lg:text-6xl mb-4 font-bold text-charcoal-500 dark:text-white",children:["Run"," ",(0,l.jsx)(d,{gradientAngle:90,colorFrom:"#7D2D79",colorTo:"#6d48bf",content:"Large Language Models"})," ","locally with Podman AI Lab"]}),(0,l.jsx)("p",{children:"Podman AI Lab is the easiest way to work with Large Language Models (LLMs) on your local developer workstation. Find a catalog of recipes, leverage a curated list of open source models, experiment and compare the models. Get ahead of the curve and take your development to new heights wth Podman AI Lab!"}),(0,l.jsxs)("div",{className:"mt-4 flex justify-center items-center gap-x-4",children:[(0,l.jsxs)(s.Z,{className:"items-center mt-auto no-underline hover:no-underline inline-flex text-white hover:text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded-xl text-md font-semibold",to:"/docs/ai-lab/installing",children:[(0,l.jsx)(n.G,{size:"1x",icon:i.tMT,className:"mr-2"}),"Get started"]}),(0,l.jsxs)(s.Z,{className:"items-center mt-auto no-underline hover:no-underline inline-flex text-charcoal-500 dark:text-white border-0 py-2 px-6 focus:outline-none text-md font-semibold",to:"https://github.com/containers/podman-desktop-extension-ai-lab",children:["Learn more on GitHub",(0,l.jsx)(n.G,{size:"1x",icon:i.eFW,className:"ml-2"})]})]}),(0,l.jsx)("div",{className:"my-12 rounded-xl from-purple-500 bg-gradient-to-r to-fuschia-500",children:(0,l.jsx)("div",{className:"p-8",children:(0,l.jsxs)("video",{className:"rounded-xl w-full h-full",controls:!0,children:[(0,l.jsx)("source",{src:"https://github.com/containers/podman-desktop-media/raw/ai-lab/videos/homepage/ai-lab-hero.mp4",type:"video/mp4"}),(0,l.jsx)("img",{src:(0,a.ZP)("img/extensions/ai-lab/model-service-details.png"),alt:"AI-Lab Model service page"})]})})})]}),(0,l.jsxs)("div",{className:"space-y-6 lg:w-2/3 mb-6 w-full items-center justify-center flex flex-col",children:[(0,l.jsxs)("h2",{className:"sm:text-2xl text-3xl lg:text-4xl font-bold text-charcoal-500 dark:text-white text-center",children:["Experiment with free"," ",(0,l.jsx)(d,{gradientAngle:90,colorFrom:"#7D2D79",colorTo:"#6d48bf",content:"Open Source"})," recipes"]}),(0,l.jsx)("div",{className:"w-full grid grid-cols-2 gap-2 lg:grid-cols-2",children:p.map((e=>(0,l.jsxs)("div",{className:"px-8 py-4 rounded-xl from-purple-500 from-70% bg-gradient-to-t to-white flex flex-col grow items-center text-black text-center",style:{background:c(e.colorFrom,e.colorTo),border:`1px solid ${e.colorFrom}`},children:[(0,l.jsxs)("div",{className:"flex flex-row mb-2 items-center",children:[(0,l.jsx)(n.G,{className:"mr-4",color:e.iconColor,size:"lg",icon:e.icon}),(0,l.jsx)("div",{className:"text-xl font-black text-black py-2",children:e.name})]}),(0,l.jsx)("div",{className:"text-xs font-semibold text-charcoal-100 mb-2",children:e.content})]},e.id)))}),(0,l.jsxs)("h2",{className:"sm:text-1xl text-2xl lg:text-3xl font-bold text-charcoal-500 dark:text-white text-center w-full",children:["All built to run ",(0,l.jsx)("span",{className:"text-bold",children:"locally"})," on your laptop"]})]}),(0,l.jsx)("div",{className:"lg:w-2/3 w-full",children:(0,l.jsxs)("div",{className:"space-y-8",children:[(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,l.jsx)("div",{children:(0,l.jsxs)("video",{controls:!0,children:[(0,l.jsx)("source",{src:"https://github.com/containers/podman-desktop-media/raw/ai-lab/videos/homepage/ai-1.mp4",type:"video/mp4"}),"Your browser does not support the video tag."]})}),(0,l.jsxs)("div",{children:[(0,l.jsx)("div",{className:"font-bold",children:"Recipes Catalog"}),(0,l.jsx)("div",{className:"text-sm",children:"Collection of pre-built solutions for various AI use cases and problem domains. Each recipe includes detailed explanations and sample applications that can be run using different large language models (LLMs). Get inspired by use cases and learn how to integrate AI in an optimal way. Recipes are kubernetes ready."})]})]}),(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,l.jsxs)("div",{className:"text-right",children:[(0,l.jsx)("div",{className:"font-bold",children:"Models Catalog"}),(0,l.jsx)("div",{className:"text-sm",children:"Curated list of open source large language models available out of the box. Check license and required resources. Import your own models."})]}),(0,l.jsx)("div",{children:(0,l.jsxs)("video",{controls:!0,children:[(0,l.jsx)("source",{src:"https://github.com/containers/podman-desktop-media/raw/ai-lab/videos/homepage/ai-2.mp4",type:"video/mp4"}),"Your browser does not support the video tag."]})})]}),(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,l.jsx)("div",{children:(0,l.jsxs)("video",{controls:!0,children:[(0,l.jsx)("source",{src:"https://github.com/containers/podman-desktop-media/raw/ai-lab/videos/homepage/ai-3.mp4",type:"video/mp4"}),"Your browser does not support the video tag."]})}),(0,l.jsxs)("div",{children:[(0,l.jsx)("div",{className:"font-bold",children:"Model Serving"}),(0,l.jsx)("div",{className:"text-sm",children:"Run models locally with an inference server. Get OpenAI compatible endpoints, use code snippets and start integrating AI in your application."})]})]}),(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,l.jsxs)("div",{className:"text-right",children:[(0,l.jsx)("div",{className:"font-bold",children:"Playground Environments"}),(0,l.jsx)("div",{className:"text-sm",children:"Experiment with large language models with a dedicated UI. Configure the models settings, system prompts to test and validate your prompt workflows. Compare behavior of different models."})]}),(0,l.jsx)("div",{children:(0,l.jsxs)("video",{controls:!0,children:[(0,l.jsx)("source",{src:"https://github.com/containers/podman-desktop-media/raw/ai-lab/videos/homepage/ai-4.mp4",type:"video/mp4"}),"Your browser does not support the video tag."]})})]})]})})]})})]})}}}]);