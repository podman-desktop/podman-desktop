import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Cn as n,Dt as r,Et as i,I as a,Kt as o,Ot as s,Pt as c,Rt as l,_t as u,c as d,fn as f,ht as p,in as m,jt as h,pn as g,vn as _,wn as v,x as y,xt as b}from"./iframe-DcPvy0aW.js";import{a as x,i as S,n as C,r as w,t as T}from"./create-runtime-stories-CL2RYn2V.js";import{t as E}from"./Button-BW3wrMSg.js";import{O as D,t as O}from"./dist-BrFUFCuZ.js";function k(e,r){g(r,!1),y();var i=I(),a=h(i);M(a,{name:`One Button`,args:{initialFocus:`none`},template:e=>{var r=P(),i=t(r);D(i,{children:(e,t)=>{E(e,{type:`primary`,children:(e,t)=>{n();var r=b(`Save`);p(e,r)},$$slots:{default:!0}})},$$slots:{default:!0}}),v(r),p(e,r)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var o=c(a,2);M(o,{name:`Two Buttons`,args:{initialFocus:`none`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var s=c(o,2);M(s,{name:`Three Buttons`,args:{initialFocus:`none`},template:e=>{var r=P(),i=t(r);D(i,{children:(e,t)=>{var r=F(),i=h(r);E(i,{type:`link`,children:(e,t)=>{n();var r=b(`Back`);p(e,r)},$$slots:{default:!0}});var a=c(i,2);E(a,{type:`secondary`,children:(e,t)=>{n();var r=b(`Cancel`);p(e,r)},$$slots:{default:!0}});var o=c(a,2);E(o,{type:`primary`,children:(e,t)=>{n();var r=b(`Save`);p(e,r)},$$slots:{default:!0}}),p(e,r)},$$slots:{default:!0}}),v(r),p(e,r)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4">
  <ButtonRow>
    <Button type="link">Back</Button>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var l=c(s,2);M(l,{name:`RTL`,args:{initialFocus:`none`,dir:`rtl`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var u=c(l,2);M(u,{name:`Initial Focus Primary`,args:{initialFocus:`last`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}});var d=c(u,2);M(d,{name:`Initial Focus Cancel`,args:{initialFocus:`first`},parameters:{__svelteCsf:{rawCode:`<div class="bg-(--pd-content-card-bg) p-4" {dir}>
  <ButtonRow {initialFocus}>
    <Button type="secondary">Cancel</Button>
    <Button type="primary">Save</Button>
  </ButtonRow>
</div>`}}}),p(e,i),f()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{s(),r(),x(),i(),O(),S(),d(),C(),A=(e,r)=>{let i=m(()=>_((r?.()).initialFocus,`none`)),s=m(()=>_((r?.()).dir,`ltr`));var u=P(),d=t(u);D(d,{get initialFocus(){return l(i)},children:(e,t)=>{var r=N(),i=h(r);E(i,{type:`secondary`,children:(e,t)=>{n();var r=b(`Cancel`);p(e,r)},$$slots:{default:!0}});var a=c(i,2);E(a,{type:`primary`,children:(e,t)=>{n();var r=b(`Save`);p(e,r)},$$slots:{default:!0}}),p(e,r)},$$slots:{default:!0}}),v(u),o(()=>{a(u,`dir`,l(s)),u.dir=u.dir}),p(e,u)},j={component:D,render:A,title:`Button/ButtonRow`,tags:[`autodocs`],argTypes:{initialFocus:{control:`select`,defaultValue:`none`,options:[`none`,`first`,`last`],description:`The enabled action that receives focus when the row mounts.`}}},{Story:M}=w(j),N=u(`<!> <!>`,1),P=u(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),F=u(`<!> <!> <!>`,1),I=u(`<!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`ButtonRow.stories.svelte`},L=T(k,j),R=[`OneButton`,`TwoButtons`,`ThreeButtons`,`RTL`,`InitialFocusPrimary`,`InitialFocusCancel`],z={...L.OneButton,tags:[`svelte-csf-v5`]},B={...L.TwoButtons,tags:[`svelte-csf-v5`]},V={...L.ThreeButtons,tags:[`svelte-csf-v5`]},H={...L.RTL,tags:[`svelte-csf-v5`]},U={...L.InitialFocusPrimary,tags:[`svelte-csf-v5`]},W={...L.InitialFocusCancel,tags:[`svelte-csf-v5`]}})))()}G();export{W as InitialFocusCancel,U as InitialFocusPrimary,z as OneButton,H as RTL,V as ThreeButtons,B as TwoButtons,R as __namedExportsOrder,j as default};