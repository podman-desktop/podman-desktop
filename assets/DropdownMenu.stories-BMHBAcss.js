import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,At as n,Bt as r,En as i,It as a,Mt as o,Nt as s,Ot as c,Sn as l,_t as u,c as d,et as f,hn as p,kt as m,m as h,mn as g,on as _,vt as v,x as y,yn as b,yt as x}from"./iframe-C8E0bH--.js";import{a as S,i as C,n as w,r as T,t as E}from"./create-runtime-stories-uG7mwCkM.js";import{C as D,L as O,P as k,U as A,a as j,b as M,c as N,l as P,w as F,z as I}from"./Icon-D7g09WL9.js";import{S as L,t as R}from"./dist-BZaKH8L8.js";function z(e,t){p(t,!1),y();var n=q(),i=s(n);{let e=_(()=>({items:[{title:`Item 1`,icon:P},{title:`Item 2`,icon:k},{title:`Item 3`,icon:I}]}));U(i,{name:`Basic`,get args(){return r(e)},parameters:{__svelteCsf:{rawCode:`<div class="flex min-h-52 justify-center p-10">
  <DropdownMenu>
    {#each args.items as item, index (index)}
      <DropdownMenu.Item {...item} />
    {/each}
  </DropdownMenu>
</div>`}}})}var o=a(i,2);U(o,{name:`Group with label`,get template(){return V},args:{label:`Open Browser`,urls:[`http://localhost:8080`,`http://localhost:9090`,`http://localhost:9443`]},parameters:{docs:{description:{story:`Items grouped under a label, between separators (e.g. the exposed ports of a container)`}},__svelteCsf:{rawCode:`<div class="flex min-h-[28rem] justify-center p-10">
  <DropdownMenu>
    <DropdownMenu.Item title="Open Logs" icon={faAlignLeft} />
    <DropdownMenu.Item title="Generate Kube" icon={faFileCode} />
    <DropdownMenu.Item title="Deploy to Kubernetes" icon={faRocket} />
    <DropdownMenu.Separator />
    <DropdownMenu.Group label={args.label}>
      {#each args.urls as url (url)}
        <DropdownMenu.Item title={url} icon={faExternalLinkSquareAlt} />
      {/each}
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item title="Open Terminal" icon={faTerminal} />
    <DropdownMenu.Item title="Restart Container" icon={faArrowsRotate} />
    <DropdownMenu.Item title="Export Container" icon={faDownload} />
  </DropdownMenu>
</div>`}}}),u(e,n),g()}var B,V,H,U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{n(),m(),S(),c(),A(),R(),C(),d(),w(),B=(e,n,a=l)=>{let c=()=>b(n?.(),[`_children`]);var d=W(),p=o(d);L(p,{children:(e,n)=>{var i=v(),a=s(i);t(a,1,()=>c().items,f,(e,t)=>{L.Item(e,h(()=>r(t)))}),u(e,i)},$$slots:{default:!0}}),i(d),u(e,d)},V=(e,n,c=l)=>{let d=()=>b(n?.(),[`_children`]);var f=K(),p=o(f);L(p,{children:(e,n)=>{var i=G(),o=s(i);L.Item(o,{title:`Open Logs`,get icon(){return j}});var c=a(o,2);L.Item(c,{title:`Generate Kube`,get icon(){return F}});var l=a(c,2);L.Item(l,{title:`Deploy to Kubernetes`,get icon(){return k}});var f=a(l,2);L.Separator(f,{});var p=a(f,2);L.Group(p,{get label(){return d().label},children:(e,n)=>{var i=v(),a=s(i);t(a,1,()=>d().urls,e=>e,(e,t)=>{L.Item(e,{get title(){return r(t)},get icon(){return D}})}),u(e,i)},$$slots:{default:!0}});var m=a(p,2);L.Separator(m,{});var h=a(m,2);L.Item(h,{title:`Open Terminal`,get icon(){return O}});var g=a(h,2);L.Item(g,{title:`Restart Container`,get icon(){return N}});var _=a(g,2);L.Item(_,{title:`Export Container`,get icon(){return M}}),u(e,i)},$$slots:{default:!0}}),i(f),u(e,f)},H={component:L,render:B,title:`DropdownMenu`,tags:[`autodocs`],args:{},parameters:{docs:{description:{component:"These are the stories for the `DropdownMenu` component.\nInteract with a drop down from a kebab menu."}}}},{Story:U}=T(H),W=x(`<div class="flex min-h-52 justify-center p-10"><!></div>`),G=x(`<!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),K=x(`<div class="flex min-h-[28rem] justify-center p-10"><!></div>`),q=x(`<!> <!>`,1),z.__docgen={data:[],name:`DropdownMenu.stories.svelte`},J=E(z,H),Y=[`Basic`,`GroupWithLabel`],X={...J.Basic,tags:[`svelte-csf-v5`]},Z={...J.GroupWithLabel,tags:[`svelte-csf-v5`]}})))()}Q();export{X as Basic,Z as GroupWithLabel,Y as __namedExportsOrder,H as default};