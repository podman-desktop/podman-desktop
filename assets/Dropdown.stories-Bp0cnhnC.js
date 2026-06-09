import{i as e}from"./preload-helper-xPQekRTU.js";import{It as t,Lt as n,Sn as r,b as i,dt as a,gt as o,hn as s,ln as c,nn as l,p as u,pn as d,pt as f,rn as p,s as m,un as h,yn as g,zt as _}from"./iframe-B6XbGnoQ.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-CwfEVFPA.js";import{t as C,w}from"./dist-3i4y9MqY.js";function T(e,t){p(t,!1),i();var r=N(),s=n(r);k(s,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var u=_(s,2);k(u,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}}),k(_(u,2),{name:`Left snippet`,children:(e,t)=>{w(e,{left:e=>{c(),a(e,o(`Selected value:\xA0`))},children:(e,t)=>{var r=M(),i=n(r);i.value=i.__value=`a`;var o=_(i,2);o.value=o.__value=`b`,a(e,r)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),a(e,r),l()}var E,D,O,k,A,j,M,N,P,F,I,L,R;e((()=>{r(),v(),g(),C(),y(),m(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,r,i=s)=>{let o=()=>d(r?.(),[`_children`]);var c=j();w(t(c),u(o,{children:(e,t)=>{var r=A(),i=n(r);i.value=i.__value=`a`;var o=_(i,2);o.value=o.__value=`b`;var s=_(o,2);s.value=s.__value=`c`,a(e,r)},$$slots:{default:!0}})),h(c),a(e,c)},O={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:E().mockName(`onchange`),disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:k}=x(O),A=f(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),j=f(`<div class="pb-24 flex flex-row"><!></div>`),M=f(`<option>One</option> <option>Two</option>`,1),N=f(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},P=S(T,O),F=[`Basic`,`Disabled`,`LeftSnippet`],I={...P.Basic,tags:[`svelte-csf-v5`]},L={...P.Disabled,tags:[`svelte-csf-v5`]},R={...P.LeftSnippet,tags:[`svelte-csf-v5`]}}))();export{I as Basic,L as Disabled,R as LeftSnippet,F as __namedExportsOrder,O as default};