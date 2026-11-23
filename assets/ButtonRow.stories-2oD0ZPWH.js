import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Dt as t,Ft as n,Ht as r,I as i,Qt as a,Rt as o,Sn as s,Tn as c,_t as l,an as u,c as d,ht as f,in as p,mn as m,pn as h,vn as g,x as _,xt as v,zt as y}from"./iframe-CibuaZCl.js";import{a as b,i as x,n as S,r as C,t as w}from"./create-runtime-stories-BowkLxNP.js";import{t as T}from"./Button-CjeumIbg.js";import{O as E,t as D}from"./dist-KCFKBles.js";function O(e,t){u(t,!1),_();var n=F(),i=y(n);j(i,{name:`One Button`,args:{initialFocus:`none`},template:e=>{var t=N(),n=o(t);E(n,{children:(e,t)=>{T(e,{type:`primary`,children:(e,t)=>{h();var n=v(`Save`);f(e,n)},$$slots:{default:!0}})},$$slots:{default:!0}}),m(t),f(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var a=r(i,2);j(a,{name:`Two Buttons`,args:{initialFocus:`none`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var s=r(a,2);j(s,{name:`Three Buttons`,args:{initialFocus:`none`},template:e=>{var t=N(),n=o(t);E(n,{children:(e,t)=>{var n=P(),i=y(n);T(i,{type:`link`,children:(e,t)=>{h();var n=v(`Back`);f(e,n)},$$slots:{default:!0}});var a=r(i,2);T(a,{type:`secondary`,children:(e,t)=>{h();var n=v(`Cancel`);f(e,n)},$$slots:{default:!0}});var o=r(a,2);T(o,{type:`primary`,children:(e,t)=>{h();var n=v(`Save`);f(e,n)},$$slots:{default:!0}}),f(e,n)},$$slots:{default:!0}}),m(t),f(e,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
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
</div>`}}});var l=r(c,2);j(l,{name:`Initial Focus Primary`,args:{initialFocus:`last`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var d=r(l,2);j(d,{name:`Initial Focus Cancel`,args:{initialFocus:`first`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}}),f(e,n),p()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{c(),b(),s(),D(),x(),d(),S(),k=(e,s)=>{let c=a(()=>g((s?.()).initialFocus,`none`)),l=a(()=>g((s?.()).dir,`ltr`));var u=N(),d=o(u);E(d,{get initialFocus(){return t(c)},children:(e,t)=>{var n=M(),i=y(n);T(i,{type:`secondary`,children:(e,t)=>{h();var n=v(`Cancel`);f(e,n)},$$slots:{default:!0}});var a=r(i,2);T(a,{type:`primary`,children:(e,t)=>{h();var n=v(`Save`);f(e,n)},$$slots:{default:!0}}),f(e,n)},$$slots:{default:!0}}),m(u),n(()=>{i(u,`dir`,t(l)),u.dir=u.dir}),f(e,u)},A={component:E,render:k,title:`Button/ButtonRow`,tags:[`autodocs`],argTypes:{initialFocus:{control:`select`,defaultValue:`none`,options:[`none`,`first`,`last`],description:`The enabled action that receives focus when the row mounts.`}}},{Story:j}=C(A),M=l(`<!> <!>`,1),N=l(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),P=l(`<!> <!> <!>`,1),F=l(`<!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`ButtonRow.stories.svelte`},I=w(O,A),L=[`OneButton`,`TwoButtons`,`ThreeButtons`,`RTL`,`InitialFocusPrimary`,`InitialFocusCancel`],R={...I.OneButton,tags:[`svelte-csf-v5`]},z={...I.TwoButtons,tags:[`svelte-csf-v5`]},B={...I.ThreeButtons,tags:[`svelte-csf-v5`]},V={...I.RTL,tags:[`svelte-csf-v5`]},H={...I.InitialFocusPrimary,tags:[`svelte-csf-v5`]},U={...I.InitialFocusCancel,tags:[`svelte-csf-v5`]}})))()}W();export{U as InitialFocusCancel,H as InitialFocusPrimary,R as OneButton,V as RTL,B as ThreeButtons,z as TwoButtons,L as __namedExportsOrder,A as default};