import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Lt as t,Rt as n,Vt as r,bt as i,c as a,fn as o,gn as s,gt as c,in as l,m as u,mt as d,pn as f,rn as p,wn as m,x as h,xn as g,yn as _}from"./iframe-Cq28p4pS.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-gHDH37rk.js";import{t as C,w}from"./dist-CAm5Wknz.js";function T(e,t){l(t,!1),h();var a=P(),s=n(a);A(s,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var c=r(s,2);A(c,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var u=r(c,2);A(u,{name:`Left snippet`,children:(e,t)=>{w(e,{left:e=>{o();var t=i(`Selected value:\xA0`);d(e,t)},children:(e,t)=>{var i=N(),a=n(i);a.value=a.__value=`a`;var o=r(a,2);o.value=o.__value=`b`,d(e,i)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),d(e,a),p()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{m(),v(),g(),C(),y(),a(),b(),{fn:E}=__STORYBOOK_MODULE_TEST__,D=(e,i,a=_)=>{let o=()=>s(i?.(),[`_children`]);var c=M(),l=t(c);w(l,u(o,{children:(e,t)=>{var i=j(),a=n(i);a.value=a.__value=`a`;var o=r(a,2);o.value=o.__value=`b`;var s=r(o,2);s.value=s.__value=`c`,d(e,i)},$$slots:{default:!0}})),f(c),d(e,c)},O=E().mockName(`onchange`),k={component:w,render:D,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:O,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:A}=x(k),j=c(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),M=c(`<div class="pb-24 flex flex-row"><!></div>`),N=c(`<option>One</option> <option>Two</option>`,1),P=c(`<!> <!> <!>`,1),T.__docgen={data:[],name:`Dropdown.stories.svelte`},F=S(T,k),I=[`Basic`,`Disabled`,`LeftSnippet`],L={...F.Basic,tags:[`svelte-csf-v5`]},R={...F.Disabled,tags:[`svelte-csf-v5`]},z={...F.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}B();export{L as Basic,R as Disabled,z as LeftSnippet,I as __namedExportsOrder,k as default};