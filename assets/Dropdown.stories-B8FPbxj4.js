import{i as e}from"./preload-helper-xPQekRTU.js";import{Ft as t,It as n,Rt as r,cn as i,fn as a,ft as o,ht as s,ln as c,mn as l,nn as u,p as d,s as f,tn as p,ut as m,vn as h,xn as g,y as _}from"./iframe-DOTDKAll.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-nV0eUVm6.js";import{t as C,w}from"./dist-T5kDptIH.js";function T(e,t){u(t,!1),_();var a=N(),o=n(a);k(o,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var c=r(o,2);k(c,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}}),k(r(c,2),{name:`Left snippet`,children:(e,t)=>{w(e,{left:e=>{i(),m(e,s(`Selected value:\xA0`))},children:(e,t)=>{var i=M(),a=n(i);a.value=a.__value=`a`;var o=r(a,2);o.value=o.__value=`b`,m(e,i)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),m(e,a),p()}var E,D,O,k,A,j,M,N,P,F,I,L,R;e((()=>{g(),v(),h(),C(),y(),f(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,i,o=l)=>{let s=()=>a(i?.(),[`_children`]);var u=j();w(t(u),d(s,{children:(e,t)=>{var i=A(),a=n(i);a.value=a.__value=`a`;var o=r(a,2);o.value=o.__value=`b`;var s=r(o,2);s.value=s.__value=`c`,m(e,i)},$$slots:{default:!0}})),c(u),m(e,u)},O={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:E().mockName(`onchange`),disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:k}=x(O),A=o(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),j=o(`<div class="pb-24 flex flex-row"><!></div>`),M=o(`<option>One</option> <option>Two</option>`,1),N=o(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},P=S(T,O),F=[`Basic`,`Disabled`,`LeftSnippet`],I={...P.Basic,tags:[`svelte-csf-v5`]},L={...P.Disabled,tags:[`svelte-csf-v5`]},R={...P.LeftSnippet,tags:[`svelte-csf-v5`]}}))();export{I as Basic,L as Disabled,R as LeftSnippet,F as __namedExportsOrder,O as default};