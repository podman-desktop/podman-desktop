import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Cn as n,Dt as r,Et as i,Ot as a,Pt as o,_n as s,_t as c,bn as l,c as u,fn as d,ht as f,jt as p,m,pn as h,wn as g,x as _,xt as v}from"./iframe-CcOc-Wz9.js";import{a as y,i as b,n as x,r as S,t as C}from"./create-runtime-stories-CQa1x6_D.js";import{t as w,w as T}from"./dist-I-SZCn4G.js";function E(e,t){h(t,!1),_();var r=F(),i=p(r);j(i,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var a=o(i,2);j(a,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var s=o(a,2);j(s,{name:`Left snippet`,children:(e,t)=>{T(e,{left:e=>{n();var t=v(`Selected value:\xA0`);f(e,t)},children:(e,t)=>{var n=P(),r=p(n);r.value=r.__value=`a`;var i=o(r,2);i.value=i.__value=`b`,f(e,n)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),f(e,r),d()}var D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{a(),r(),y(),i(),w(),b(),u(),x(),{fn:D}=__STORYBOOK_MODULE_TEST__,O=(e,n,r=l)=>{let i=()=>s(n?.(),[`_children`]);var a=N(),c=t(a);T(c,m(i,{children:(e,t)=>{var n=M(),r=p(n);r.value=r.__value=`a`;var i=o(r,2);i.value=i.__value=`b`;var a=o(i,2);a.value=a.__value=`c`,f(e,n)},$$slots:{default:!0}})),g(a),f(e,a)},k=D().mockName(`onchange`),A={component:T,render:O,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:k,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:j}=S(A),M=c(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),N=c(`<div class="pb-24 flex flex-row"><!></div>`),P=c(`<option>One</option> <option>Two</option>`,1),F=c(`<!> <!> <!>`,1),E.__docgen={data:[],name:`Dropdown.stories.svelte`},I=C(E,A),L=[`Basic`,`Disabled`,`LeftSnippet`],R={...I.Basic,tags:[`svelte-csf-v5`]},z={...I.Disabled,tags:[`svelte-csf-v5`]},B={...I.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}V();export{R as Basic,z as Disabled,B as LeftSnippet,L as __namedExportsOrder,A as default};