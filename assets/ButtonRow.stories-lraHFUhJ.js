import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Bt as n,Ct as r,En as i,I as a,It as o,Jt as s,Mt as c,Nt as l,Ot as u,Tn as d,_t as f,bn as p,c as m,hn as h,kt as g,mn as _,on as v,x as y,yt as b}from"./iframe-C8E0bH--.js";import{a as x,i as S,n as C,r as w,t as T}from"./create-runtime-stories-uG7mwCkM.js";import{t as E}from"./Button-B-OuIm6Y.js";import{O as D,t as O}from"./dist-BZaKH8L8.js";function k(e,t){h(t,!1),y();var n=I(),a=l(n);M(a,{name:`One Button`,args:{initialFocus:`none`},template:e=>{var t=P(),n=c(t);D(n,{children:(e,t)=>{E(e,{type:`primary`,children:(e,t)=>{d();var n=r(`Save`);f(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}}),i(t),f(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var s=o(a,2);M(s,{name:`Two Buttons`,args:{initialFocus:`none`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var u=o(s,2);M(u,{name:`Three Buttons`,args:{initialFocus:`none`},template:e=>{var t=P(),n=c(t);D(n,{children:(e,t)=>{var n=F(),i=l(n);E(i,{type:`link`,children:(e,t)=>{d();var n=r(`Back`);f(e,n)},$$slots:{default:!0}});var a=o(i,2);E(a,{type:`secondary`,children:(e,t)=>{d();var n=r(`Cancel`);f(e,n)},$$slots:{default:!0}});var s=o(a,2);E(s,{type:`primary`,children:(e,t)=>{d();var n=r(`Save`);f(e,n)},$$slots:{default:!0}}),f(e,n)},$$slots:{default:!0}}),i(t),f(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="link">Back</Button>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var p=o(u,2);M(p,{name:`RTL`,args:{initialFocus:`none`,dir:`rtl`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var m=o(p,2);M(m,{name:`Initial Focus Primary`,args:{initialFocus:`last`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var g=o(m,2);M(g,{name:`Initial Focus Cancel`,args:{initialFocus:`first`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}}),f(e,n),_()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{t(),g(),x(),u(),O(),S(),m(),C(),A=(e,t)=>{let u=v(()=>p((t?.()).initialFocus,`none`)),m=v(()=>p((t?.()).dir,`ltr`));var h=P(),g=c(h);D(g,{get initialFocus(){return n(u)},children:(e,t)=>{var n=N(),i=l(n);E(i,{type:`secondary`,children:(e,t)=>{d();var n=r(`Cancel`);f(e,n)},$$slots:{default:!0}});var a=o(i,2);E(a,{type:`primary`,children:(e,t)=>{d();var n=r(`Save`);f(e,n)},$$slots:{default:!0}}),f(e,n)},$$slots:{default:!0}}),i(h),s(()=>{a(h,`dir`,n(m)),h.dir=h.dir}),f(e,h)},j={component:D,render:A,title:`Button/ButtonRow`,tags:[`autodocs`],argTypes:{initialFocus:{control:`select`,defaultValue:`none`,options:[`none`,`first`,`last`],description:`The enabled action that receives focus when the row mounts.`}}},{Story:M}=w(j),N=b(`<!> <!>`,1),P=b(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),F=b(`<!> <!> <!>`,1),I=b(`<!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`ButtonRow.stories.svelte`},L=T(k,j),R=[`OneButton`,`TwoButtons`,`ThreeButtons`,`RTL`,`InitialFocusPrimary`,`InitialFocusCancel`],z={...L.OneButton,tags:[`svelte-csf-v5`]},B={...L.TwoButtons,tags:[`svelte-csf-v5`]},V={...L.ThreeButtons,tags:[`svelte-csf-v5`]},H={...L.RTL,tags:[`svelte-csf-v5`]},U={...L.InitialFocusPrimary,tags:[`svelte-csf-v5`]},W={...L.InitialFocusCancel,tags:[`svelte-csf-v5`]}})))()}G();export{W as InitialFocusCancel,U as InitialFocusPrimary,z as OneButton,H as RTL,V as ThreeButtons,B as TwoButtons,R as __namedExportsOrder,j as default};