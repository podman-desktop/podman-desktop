import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Dt as n,Et as r,Ot as i,Pt as a,Q as o,Rt as s,Z as c,_n as l,_t as u,bn as d,c as f,fn as p,gt as m,ht as h,in as g,jt as _,m as v,pn as y,wn as b,x}from"./iframe-CcOc-Wz9.js";import{a as S,i as C,n as w,r as T,t as E}from"./create-runtime-stories-CQa1x6_D.js";import{C as D,L as O,P as k,U as A,a as j,b as M,c as N,l as P,w as F,z as I}from"./Icon-ChW5bR60.js";import{S as L,t as R}from"./dist-I-SZCn4G.js";function z(e,t){y(t,!1),x();var n=q(),r=_(n);{let e=g(()=>({items:[{title:`Item 1`,icon:P},{title:`Item 2`,icon:k},{title:`Item 3`,icon:I}]}));U(r,{name:`Basic`,get args(){return s(e)},parameters:{__svelteCsf:{rawCode:`<div class="flex min-h-52 justify-center p-10">
  <DropdownMenu>
    {#each args.items as item, index (index)}
      <DropdownMenu.Item {...item} />
    {/each}
  </DropdownMenu>
</div>`}}})}var i=a(r,2);U(i,{name:`Group with label`,get template(){return V},args:{label:`Open Browser`,urls:[`http://localhost:8080`,`http://localhost:9090`,`http://localhost:9443`]},parameters:{docs:{description:{story:`Items grouped under a label, between separators (e.g. the exposed ports of a container)`}},__svelteCsf:{rawCode:`<div class="flex min-h-[28rem] justify-center p-10">
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
</div>`}}}),h(e,n),p()}var B,V,H,U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{i(),n(),S(),r(),A(),R(),C(),f(),w(),B=(e,n,r=d)=>{let i=()=>l(n?.(),[`_children`]);var a=W(),u=t(a);L(u,{children:(e,t)=>{var n=m(),r=_(n);c(r,1,()=>i().items,o,(e,t)=>{L.Item(e,v(()=>s(t)))}),h(e,n)},$$slots:{default:!0}}),b(a),h(e,a)},V=(e,n,r=d)=>{let i=()=>l(n?.(),[`_children`]);var o=K(),u=t(o);L(u,{children:(e,t)=>{var n=G(),r=_(n);L.Item(r,{title:`Open Logs`,get icon(){return j}});var o=a(r,2);L.Item(o,{title:`Generate Kube`,get icon(){return F}});var l=a(o,2);L.Item(l,{title:`Deploy to Kubernetes`,get icon(){return k}});var u=a(l,2);L.Separator(u,{});var d=a(u,2);L.Group(d,{get label(){return i().label},children:(e,t)=>{var n=m(),r=_(n);c(r,1,()=>i().urls,e=>e,(e,t)=>{L.Item(e,{get title(){return s(t)},get icon(){return D}})}),h(e,n)},$$slots:{default:!0}});var f=a(d,2);L.Separator(f,{});var p=a(f,2);L.Item(p,{title:`Open Terminal`,get icon(){return O}});var g=a(p,2);L.Item(g,{title:`Restart Container`,get icon(){return N}});var v=a(g,2);L.Item(v,{title:`Export Container`,get icon(){return M}}),h(e,n)},$$slots:{default:!0}}),b(o),h(e,o)},H={component:L,render:B,title:`DropdownMenu`,tags:[`autodocs`],args:{},parameters:{docs:{description:{component:"These are the stories for the `DropdownMenu` component.\nInteract with a drop down from a kebab menu."}}}},{Story:U}=T(H),W=u(`<div class="flex min-h-52 justify-center p-10"><!></div>`),G=u(`<!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),K=u(`<div class="flex min-h-[28rem] justify-center p-10"><!></div>`),q=u(`<!> <!>`,1),z.__docgen={data:[],name:`DropdownMenu.stories.svelte`},J=E(z,H),Y=[`Basic`,`GroupWithLabel`],X={...J.Basic,tags:[`svelte-csf-v5`]},Z={...J.GroupWithLabel,tags:[`svelte-csf-v5`]}})))()}Q();export{X as Basic,Z as GroupWithLabel,Y as __namedExportsOrder,H as default};