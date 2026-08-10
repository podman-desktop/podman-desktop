import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Mt as t,Pt as n,c as r,ct as i,dn as a,dt as o,gn as s,h as c,in as l,jt as u,m as d,mn as f,ot as p,rn as m,un as h,vn as g,xn as _}from"./iframe-BM0VluKA.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-DgofOWkq.js";import{t as C,x as w}from"./dist-mFhywrOD.js";function T(e,r){l(r,!1),c();var i=P(),a=t(i);A(a,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var s=n(a,2);A(s,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var u=n(s,2);A(u,{name:`Left snippet`,children:(e,r)=>{w(e,{left:e=>{h();var t=o(`Selected value:\xA0`);p(e,t)},children:(e,r)=>{var i=N(),a=t(i);a.value=a.__value=`a`;var o=n(a,2);o.value=o.__value=`b`,p(e,i)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),p(e,i),m()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{_(),v(),g(),C(),y(),r(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,r,i=s)=>{let o=()=>f(r?.(),[`_children`]);var c=M(),l=u(c);w(l,d(o,{children:(e,r)=>{var i=j(),a=t(i);a.value=a.__value=`a`;var o=n(a,2);o.value=o.__value=`b`;var s=n(o,2);s.value=s.__value=`c`,p(e,i)},$$slots:{default:!0}})),a(c),p(e,c)},O=E().mockName(`onchange`),k={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:O,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:A}=x(k),j=i(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),M=i(`<div class="pb-24 flex flex-row"><!></div>`),N=i(`<option>One</option> <option>Two</option>`,1),P=i(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},F=S(T,k),I=[`Basic`,`Disabled`,`LeftSnippet`],L={...F.Basic,tags:[`svelte-csf-v5`]},R={...F.Disabled,tags:[`svelte-csf-v5`]},z={...F.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}B();export{L as Basic,R as Disabled,z as LeftSnippet,I as __namedExportsOrder,k as default};