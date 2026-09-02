import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Mt as t,Pt as n,Sn as r,_n as i,c as a,ct as o,dn as s,dt as c,h as l,in as u,jt as d,m as f,mn as p,ot as m,rn as h,un as g,yn as _}from"./iframe-DAkJTS3X.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-DSVceL7X.js";import{t as C,x as w}from"./dist-BbgQ6zJ4.js";function T(e,r){u(r,!1),l();var i=P(),a=t(i);A(a,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var o=n(a,2);A(o,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var s=n(o,2);A(s,{name:`Left snippet`,children:(e,r)=>{w(e,{left:e=>{g();var t=c(`Selected value:\xA0`);m(e,t)},children:(e,r)=>{var i=N(),a=t(i);a.value=a.__value=`a`;var o=n(a,2);o.value=o.__value=`b`,m(e,i)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),m(e,i),h()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{r(),v(),_(),C(),y(),a(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,r,a=i)=>{let o=()=>p(r?.(),[`_children`]);var c=M(),l=d(c);w(l,f(o,{children:(e,r)=>{var i=j(),a=t(i);a.value=a.__value=`a`;var o=n(a,2);o.value=o.__value=`b`;var s=n(o,2);s.value=s.__value=`c`,m(e,i)},$$slots:{default:!0}})),s(c),m(e,c)},O=E().mockName(`onchange`),k={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:O,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:A}=x(k),j=o(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),M=o(`<div class="pb-24 flex flex-row"><!></div>`),N=o(`<option>One</option> <option>Two</option>`,1),P=o(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},F=S(T,k),I=[`Basic`,`Disabled`,`LeftSnippet`],L={...F.Basic,tags:[`svelte-csf-v5`]},R={...F.Disabled,tags:[`svelte-csf-v5`]},z={...F.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}B();export{L as Basic,R as Disabled,z as LeftSnippet,I as __namedExportsOrder,k as default};