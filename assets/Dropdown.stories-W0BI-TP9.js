import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Lt as t,Nt as n,Pt as r,an as i,c as a,ct as o,fn as s,gn as c,h as l,m as u,on as d,pn as f,pt as p,ut as m,wn as h,xn as g,yn as _}from"./iframe-Bne3KOWP.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-gn_WU5xr.js";import{t as C,x as w}from"./dist-Bxhm9zYv.js";function T(e,n){d(n,!1),l();var a=P(),c=r(a);A(c,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var u=t(c,2);A(u,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var f=t(u,2);A(f,{name:`Left snippet`,children:(e,n)=>{w(e,{left:e=>{s();var t=p(`Selected value:\xA0`);o(e,t)},children:(e,n)=>{var i=N(),a=r(i);a.value=a.__value=`a`;var s=t(a,2);s.value=s.__value=`b`,o(e,i)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),o(e,a),i()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{h(),v(),g(),C(),y(),a(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,i,a=_)=>{let s=()=>c(i?.(),[`_children`]);var l=M(),d=n(l);w(d,u(s,{children:(e,n)=>{var i=j(),a=r(i);a.value=a.__value=`a`;var s=t(a,2);s.value=s.__value=`b`;var c=t(s,2);c.value=c.__value=`c`,o(e,i)},$$slots:{default:!0}})),f(l),o(e,l)},O=E().mockName(`onchange`),k={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:O,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:A}=x(k),j=m(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),M=m(`<div class="pb-24 flex flex-row"><!></div>`),N=m(`<option>One</option> <option>Two</option>`,1),P=m(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},F=S(T,k),I=[`Basic`,`Disabled`,`LeftSnippet`],L={...F.Basic,tags:[`svelte-csf-v5`]},R={...F.Disabled,tags:[`svelte-csf-v5`]},z={...F.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}B();export{L as Basic,R as Disabled,z as LeftSnippet,I as __namedExportsOrder,k as default};