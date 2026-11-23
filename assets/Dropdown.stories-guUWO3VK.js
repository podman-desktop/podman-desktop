import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Ht as t,Rt as n,Sn as r,Tn as i,_n as a,_t as o,an as s,bn as c,c as l,ht as u,in as d,m as f,mn as p,pn as m,x as h,xt as g,zt as _}from"./iframe-CibuaZCl.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-BowkLxNP.js";import{t as C,w}from"./dist-KCFKBles.js";function T(e,n){s(n,!1),h();var r=P(),i=_(r);A(i,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var a=t(i,2);A(a,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var o=t(a,2);A(o,{name:`Left snippet`,children:(e,n)=>{w(e,{left:e=>{m();var t=g(`Selected value:\xA0`);u(e,t)},children:(e,n)=>{var r=N(),i=_(r);i.value=i.__value=`a`;var a=t(i,2);a.value=a.__value=`b`,u(e,r)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),u(e,r),d()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{i(),v(),r(),C(),y(),l(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,r,i=c)=>{let o=()=>a(r?.(),[`_children`]);var s=M(),l=n(s);w(l,f(o,{children:(e,n)=>{var r=j(),i=_(r);i.value=i.__value=`a`;var a=t(i,2);a.value=a.__value=`b`;var o=t(a,2);o.value=o.__value=`c`,u(e,r)},$$slots:{default:!0}})),p(s),u(e,s)},O=E().mockName(`onchange`),k={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:O,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:A}=x(k),j=o(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),M=o(`<div class="pb-24 flex flex-row"><!></div>`),N=o(`<option>One</option> <option>Two</option>`,1),P=o(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},F=S(T,k),I=[`Basic`,`Disabled`,`LeftSnippet`],L={...F.Basic,tags:[`svelte-csf-v5`]},R={...F.Disabled,tags:[`svelte-csf-v5`]},z={...F.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}B();export{L as Basic,R as Disabled,z as LeftSnippet,I as __namedExportsOrder,k as default};