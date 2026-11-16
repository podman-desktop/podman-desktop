import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Et as t,F as n,Lt as r,Pt as i,Rt as a,Vt as o,Zt as s,_n as c,bt as l,c as u,fn as d,gt as f,in as p,mt as m,pn as h,rn as g,wn as _,x as v,xn as y}from"./iframe-DoDVlzb4.js";import{a as b,i as x,n as S,r as C,t as w}from"./create-runtime-stories-CDcxVhIA.js";import{t as T}from"./Button-BRm60HSf.js";import{O as E,t as D}from"./dist-ExhkgLLa.js";function O(e,t){p(t,!1),v();var n=F(),i=a(n);j(i,{name:`One Button`,args:{initialFocus:`none`},template:e=>{var t=N(),n=r(t);E(n,{children:(e,t)=>{T(e,{type:`primary`,children:(e,t)=>{d();var n=l(`Save`);m(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}}),h(t),m(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var s=o(i,2);j(s,{name:`Two Buttons`,args:{initialFocus:`none`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var c=o(s,2);j(c,{name:`Three Buttons`,args:{initialFocus:`none`},template:e=>{var t=N(),n=r(t);E(n,{children:(e,t)=>{var n=P(),r=a(n);T(r,{type:`link`,children:(e,t)=>{d();var n=l(`Back`);m(e,n)},$$slots:{default:!0}});var i=o(r,2);T(i,{type:`secondary`,children:(e,t)=>{d();var n=l(`Cancel`);m(e,n)},$$slots:{default:!0}});var s=o(i,2);T(s,{type:`primary`,children:(e,t)=>{d();var n=l(`Save`);m(e,n)},$$slots:{default:!0}}),m(e,n)},$$slots:{default:!0}}),h(t),m(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="link">Back</Button>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var u=o(c,2);j(u,{name:`RTL`,args:{initialFocus:`none`,dir:`rtl`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var f=o(u,2);j(f,{name:`Initial Focus Primary`,args:{initialFocus:`last`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var _=o(f,2);j(_,{name:`Initial Focus Cancel`,args:{initialFocus:`first`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}}),m(e,n),g()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{_(),b(),y(),D(),x(),u(),S(),k=(e,u)=>{let f=s(()=>c((u?.()).initialFocus,`none`)),p=s(()=>c((u?.()).dir,`ltr`));var g=N(),_=r(g);E(_,{get initialFocus(){return t(f)},children:(e,t)=>{var n=M(),r=a(n);T(r,{type:`secondary`,children:(e,t)=>{d();var n=l(`Cancel`);m(e,n)},$$slots:{default:!0}});var i=o(r,2);T(i,{type:`primary`,children:(e,t)=>{d();var n=l(`Save`);m(e,n)},$$slots:{default:!0}}),m(e,n)},$$slots:{default:!0}}),h(g),i(()=>{n(g,`dir`,t(p)),g.dir=g.dir}),m(e,g)},A={component:E,render:k,title:`Button/ButtonRow`,tags:[`autodocs`],argTypes:{initialFocus:{control:`select`,defaultValue:`none`,options:[`none`,`first`,`last`],description:`The enabled action that receives focus when the row mounts.`}}},{Story:j}=C(A),M=f(`<!> <!>`,1),N=f(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),P=f(`<!> <!> <!>`,1),F=f(`<!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`ButtonRow.stories.svelte`},I=w(O,A),L=[`OneButton`,`TwoButtons`,`ThreeButtons`,`RTL`,`InitialFocusPrimary`,`InitialFocusCancel`],R={...I.OneButton,tags:[`svelte-csf-v5`]},z={...I.TwoButtons,tags:[`svelte-csf-v5`]},B={...I.ThreeButtons,tags:[`svelte-csf-v5`]},V={...I.RTL,tags:[`svelte-csf-v5`]},H={...I.InitialFocusPrimary,tags:[`svelte-csf-v5`]},U={...I.InitialFocusCancel,tags:[`svelte-csf-v5`]}})))()}W();export{U as InitialFocusCancel,H as InitialFocusPrimary,R as OneButton,V as RTL,B as ThreeButtons,z as TwoButtons,L as __namedExportsOrder,A as default};