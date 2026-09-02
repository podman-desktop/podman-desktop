import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Mt as t,Ot as n,Pt as r,Sn as i,Wt as a,_t as o,c as s,ct as c,dn as l,dt as u,h as d,hn as f,in as p,jt as m,k as h,ot as g,rn as _,un as v,yn as y}from"./iframe-CLfrOPBT.js";import{a as b,i as x,n as S,r as C,t as w}from"./create-runtime-stories-1kBB17qu.js";import{t as T}from"./Button-BYa0J3gX.js";import{T as E,t as D}from"./dist-ByvHSlw7.js";function O(e,n){p(n,!1),d();var i=F(),a=t(i);j(a,{name:`One Button`,args:{initialFocus:`none`},template:e=>{var t=N(),n=m(t);E(n,{children:(e,t)=>{T(e,{type:`primary`,children:(e,t)=>{v();var n=u(`Save`);g(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}}),l(t),g(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var o=r(a,2);j(o,{name:`Two Buttons`,args:{initialFocus:`none`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var s=r(o,2);j(s,{name:`Three Buttons`,args:{initialFocus:`none`},template:e=>{var n=N(),i=m(n);E(i,{children:(e,n)=>{var i=P(),a=t(i);T(a,{type:`link`,children:(e,t)=>{v();var n=u(`Back`);g(e,n)},$$slots:{default:!0}});var o=r(a,2);T(o,{type:`secondary`,children:(e,t)=>{v();var n=u(`Cancel`);g(e,n)},$$slots:{default:!0}});var s=r(o,2);T(s,{type:`primary`,children:(e,t)=>{v();var n=u(`Save`);g(e,n)},$$slots:{default:!0}}),g(e,i)},$$slots:{default:!0}}),l(n),g(e,n)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="link">Back</Button>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var c=r(s,2);j(c,{name:`RTL`,args:{initialFocus:`none`,dir:`rtl`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var f=r(c,2);j(f,{name:`Initial Focus Primary`,args:{initialFocus:`last`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var h=r(f,2);j(h,{name:`Initial Focus Cancel`,args:{initialFocus:`first`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}}),g(e,i),_()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{i(),b(),y(),D(),x(),s(),S(),k=(e,i)=>{let s=a(()=>f((i?.()).initialFocus,`none`)),c=a(()=>f((i?.()).dir,`ltr`));var d=N(),p=m(d);E(p,{get initialFocus(){return o(s)},children:(e,n)=>{var i=M(),a=t(i);T(a,{type:`secondary`,children:(e,t)=>{v();var n=u(`Cancel`);g(e,n)},$$slots:{default:!0}});var o=r(a,2);T(o,{type:`primary`,children:(e,t)=>{v();var n=u(`Save`);g(e,n)},$$slots:{default:!0}}),g(e,i)},$$slots:{default:!0}}),l(d),n(()=>{h(d,`dir`,o(c)),d.dir=d.dir}),g(e,d)},A={component:E,render:k,title:`Button/ButtonRow`,tags:[`autodocs`],argTypes:{initialFocus:{control:`select`,defaultValue:`none`,options:[`none`,`first`,`last`],description:`The enabled action that receives focus when the row mounts.`}}},{Story:j}=C(A),M=c(`<!> <!>`,1),N=c(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),P=c(`<!> <!> <!>`,1),F=c(`<!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`ButtonRow.stories.svelte`},I=w(O,A),L=[`OneButton`,`TwoButtons`,`ThreeButtons`,`RTL`,`InitialFocusPrimary`,`InitialFocusCancel`],R={...I.OneButton,tags:[`svelte-csf-v5`]},z={...I.TwoButtons,tags:[`svelte-csf-v5`]},B={...I.ThreeButtons,tags:[`svelte-csf-v5`]},V={...I.RTL,tags:[`svelte-csf-v5`]},H={...I.InitialFocusPrimary,tags:[`svelte-csf-v5`]},U={...I.InitialFocusCancel,tags:[`svelte-csf-v5`]}})))()}W();export{U as InitialFocusCancel,H as InitialFocusPrimary,R as OneButton,V as RTL,B as ThreeButtons,z as TwoButtons,L as __namedExportsOrder,A as default};