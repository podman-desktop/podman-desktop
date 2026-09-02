import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{At as t,Lt as n,Nt as r,Pt as i,_n as a,an as o,c as s,ct as c,fn as l,h as u,k as d,on as f,pn as p,pt as m,qt as h,ut as g,wn as _,xn as v,yt as y}from"./iframe-Bne3KOWP.js";import{a as b,i as x,n as S,r as C,t as w}from"./create-runtime-stories-gn_WU5xr.js";import{t as T}from"./Button-BZ6jAZKY.js";import{T as E,t as D}from"./dist-Bxhm9zYv.js";function O(e,t){f(t,!1),u();var a=F(),s=i(a);j(s,{name:`One Button`,args:{initialFocus:`none`},template:e=>{var t=N(),n=r(t);E(n,{children:(e,t)=>{T(e,{type:`primary`,children:(e,t)=>{l();var n=m(`Save`);c(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}}),p(t),c(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var d=n(s,2);j(d,{name:`Two Buttons`,args:{initialFocus:`none`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var h=n(d,2);j(h,{name:`Three Buttons`,args:{initialFocus:`none`},template:e=>{var t=N(),a=r(t);E(a,{children:(e,t)=>{var r=P(),a=i(r);T(a,{type:`link`,children:(e,t)=>{l();var n=m(`Back`);c(e,n)},$$slots:{default:!0}});var o=n(a,2);T(o,{type:`secondary`,children:(e,t)=>{l();var n=m(`Cancel`);c(e,n)},$$slots:{default:!0}});var s=n(o,2);T(s,{type:`primary`,children:(e,t)=>{l();var n=m(`Save`);c(e,n)},$$slots:{default:!0}}),c(e,r)},$$slots:{default:!0}}),p(t),c(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="link">Back</Button>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var g=n(h,2);j(g,{name:`RTL`,args:{initialFocus:`none`,dir:`rtl`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var _=n(g,2);j(_,{name:`Initial Focus Primary`,args:{initialFocus:`last`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var v=n(_,2);j(v,{name:`Initial Focus Cancel`,args:{initialFocus:`first`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}}),c(e,a),o()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{_(),b(),v(),D(),x(),s(),S(),k=(e,o)=>{let s=h(()=>a((o?.()).initialFocus,`none`)),u=h(()=>a((o?.()).dir,`ltr`));var f=N(),g=r(f);E(g,{get initialFocus(){return y(s)},children:(e,t)=>{var r=M(),a=i(r);T(a,{type:`secondary`,children:(e,t)=>{l();var n=m(`Cancel`);c(e,n)},$$slots:{default:!0}});var o=n(a,2);T(o,{type:`primary`,children:(e,t)=>{l();var n=m(`Save`);c(e,n)},$$slots:{default:!0}}),c(e,r)},$$slots:{default:!0}}),p(f),t(()=>{d(f,`dir`,y(u)),f.dir=f.dir}),c(e,f)},A={component:E,render:k,title:`Button/ButtonRow`,tags:[`autodocs`],argTypes:{initialFocus:{control:`select`,defaultValue:`none`,options:[`none`,`first`,`last`],description:`The enabled action that receives focus when the row mounts.`}}},{Story:j}=C(A),M=g(`<!> <!>`,1),N=g(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),P=g(`<!> <!> <!>`,1),F=g(`<!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`ButtonRow.stories.svelte`},I=w(O,A),L=[`OneButton`,`TwoButtons`,`ThreeButtons`,`RTL`,`InitialFocusPrimary`,`InitialFocusCancel`],R={...I.OneButton,tags:[`svelte-csf-v5`]},z={...I.TwoButtons,tags:[`svelte-csf-v5`]},B={...I.ThreeButtons,tags:[`svelte-csf-v5`]},V={...I.RTL,tags:[`svelte-csf-v5`]},H={...I.InitialFocusPrimary,tags:[`svelte-csf-v5`]},U={...I.InitialFocusCancel,tags:[`svelte-csf-v5`]}})))()}W();export{U as InitialFocusCancel,H as InitialFocusPrimary,R as OneButton,V as RTL,B as ThreeButtons,z as TwoButtons,L as __namedExportsOrder,A as default};