"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[21181],{65494:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var s=i(24246),t=i(71670);const r={},o="Interface: ExtensionContext",c={id:"interfaces/ExtensionContext",title:"Interface: ExtensionContext",description:"Properties",source:"@site/api/interfaces/ExtensionContext.md",sourceDirName:"interfaces",slug:"/interfaces/ExtensionContext",permalink:"/api/interfaces/ExtensionContext",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",previous:{title:"Extension",permalink:"/api/interfaces/Extension"},next:{title:"FileSystemWatcher",permalink:"/api/interfaces/FileSystemWatcher"}},a={},d=[{value:"Properties",id:"properties",level:2},{value:"extensionUri",id:"extensionuri",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"secrets",id:"secrets",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"storagePath",id:"storagepath",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"subscriptions",id:"subscriptions",level:3},{value:"Defined in",id:"defined-in-3",level:4}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",p:"p",strong:"strong",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"interface-extensioncontext",children:"Interface: ExtensionContext"}),"\n",(0,s.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,s.jsx)(n.h3,{id:"extensionuri",children:"extensionUri"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"readonly"})," ",(0,s.jsx)(n.strong,{children:"extensionUri"}),": ",(0,s.jsx)(n.a,{href:"/api/classes/Uri",children:(0,s.jsx)(n.code,{children:"Uri"})})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"The uri of the directory containing the extension."}),"\n",(0,s.jsx)(n.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/containers/podman-desktop/blob/1ee9ca6bedea508b4af649976348fa9a05be1d94/packages/extension-api/src/extension-api.d.ts#L165",children:"packages/extension-api/src/extension-api.d.ts:165"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"secrets",children:"secrets"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"readonly"})," ",(0,s.jsx)(n.strong,{children:"secrets"}),": ",(0,s.jsx)(n.a,{href:"/api/interfaces/SecretStorage",children:(0,s.jsx)(n.code,{children:"SecretStorage"})})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"A storage utility for secrets. Secrets are persisted across reloads."}),"\n",(0,s.jsx)(n.h4,{id:"defined-in-1",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/containers/podman-desktop/blob/1ee9ca6bedea508b4af649976348fa9a05be1d94/packages/extension-api/src/extension-api.d.ts#L170",children:"packages/extension-api/src/extension-api.d.ts:170"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"storagepath",children:"storagePath"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"readonly"})," ",(0,s.jsx)(n.strong,{children:"storagePath"}),": ",(0,s.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"An absolute file path in which the extension can store state.\nThe directory might not exist on disk and creation is\nup to the extension."}),"\n",(0,s.jsx)(n.h4,{id:"defined-in-2",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/containers/podman-desktop/blob/1ee9ca6bedea508b4af649976348fa9a05be1d94/packages/extension-api/src/extension-api.d.ts#L160",children:"packages/extension-api/src/extension-api.d.ts:160"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"subscriptions",children:"subscriptions"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"readonly"})," ",(0,s.jsx)(n.strong,{children:"subscriptions"}),": ",(0,s.jsx)(n.code,{children:"object"}),"[]"]}),"\n"]}),"\n",(0,s.jsx)(n.h4,{id:"defined-in-3",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/containers/podman-desktop/blob/1ee9ca6bedea508b4af649976348fa9a05be1d94/packages/extension-api/src/extension-api.d.ts#L153",children:"packages/extension-api/src/extension-api.d.ts:153"})})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},71670:(e,n,i)=>{i.d(n,{Z:()=>c,a:()=>o});var s=i(27378);const t={},r=s.createContext(t);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);