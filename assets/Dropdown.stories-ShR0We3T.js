import{i as e}from"./preload-helper-xPQekRTU.js";import{At as t,Nt as n,Sn as r,at as i,hn as a,jt as o,ln as s,m as c,nn as l,p as u,pn as d,rn as f,s as p,st as m,un as h,ut as g,yn as _}from"./iframe-By09XlDr.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-B-3OhJ9A.js";import{t as C,w}from"./dist-DGjhThcP.js";function T(e,t){f(t,!1),c();var r=N(),a=o(r);k(a,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var u=n(a,2);k(u,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}}),k(n(u,2),{name:`Left snippet`,children:(e,t)=>{w(e,{left:e=>{s(),i(e,g(`Selected value:\xA0`))},children:(e,t)=>{var r=M(),a=o(r);a.value=a.__value=`a`;var s=n(a,2);s.value=s.__value=`b`,i(e,r)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),i(e,r),l()}var E,D,O,k,A,j,M,N,P,F,I,L,R;e((()=>{r(),v(),_(),C(),y(),p(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,r,s=a)=>{let c=()=>d(r?.(),[`_children`]);var l=j();w(t(l),u(c,{children:(e,t)=>{var r=A(),a=o(r);a.value=a.__value=`a`;var s=n(a,2);s.value=s.__value=`b`;var c=n(s,2);c.value=c.__value=`c`,i(e,r)},$$slots:{default:!0}})),h(l),i(e,l)},O={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:E().mockName(`onchange`),disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:k}=x(O),A=m(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),j=m(`<div class="pb-24 flex flex-row"><!></div>`),M=m(`<option>One</option> <option>Two</option>`,1),N=m(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},P=S(T,O),F=[`Basic`,`Disabled`,`LeftSnippet`],I={...P.Basic,tags:[`svelte-csf-v5`]},L={...P.Disabled,tags:[`svelte-csf-v5`]},R={...P.LeftSnippet,tags:[`svelte-csf-v5`]}}))();export{I as Basic,L as Disabled,R as LeftSnippet,F as __namedExportsOrder,O as default};