import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Ct as n,En as r,It as i,Mt as a,Nt as o,Ot as s,Sn as c,Tn as l,_t as u,c as d,hn as f,kt as p,m,mn as h,x as g,yn as _,yt as v}from"./iframe-mYX-99dy.js";import{a as y,i as b,n as x,r as S,t as C}from"./create-runtime-stories-CoiC7gtU.js";import{t as w,w as T}from"./dist-DqTIYKgy.js";function E(e,t){f(t,!1),g();var r=F(),a=o(r);j(a,{name:`Basic`,args:{value:`Initial value`},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var s=i(a,2);j(s,{name:`Disabled`,args:{value:`Disabled dropdown`,disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var c=i(s,2);j(c,{name:`Left snippet`,children:(e,t)=>{T(e,{left:e=>{l();var t=n(`Selected value:\xA0`);u(e,t)},children:(e,t)=>{var n=P(),r=o(n);r.value=r.__value=`a`;var a=i(r,2);a.value=a.__value=`b`,u(e,n)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),u(e,r),h()}var D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{t(),p(),y(),s(),w(),b(),d(),x(),{fn:D}=__STORYBOOK_MODULE_TEST__,O=(e,t,n=c)=>{let s=()=>_(t?.(),[`_children`]);var l=N(),d=a(l);T(d,m(s,{children:(e,t)=>{var n=M(),r=o(n);r.value=r.__value=`a`;var a=i(r,2);a.value=a.__value=`b`;var s=i(a,2);s.value=s.__value=`c`,u(e,n)},$$slots:{default:!0}})),r(l),u(e,l)},k=D().mockName(`onchange`),A={component:T,render:O,title:`Dropdown`,tags:[`autodocs`],argTypes:{value:{control:`text`,description:`Initial value shown in the dropdown`,defaultValue:``},onchange:k,disabled:{control:`boolean`,description:`Set the dropdown as being disabled`,defaultValue:!1},options:{description:`Dropdown items`}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:j}=S(A),M=v(`<option>Item A</option> <option>Item B</option> <option>Item C</option>`,1),N=v(`<div class="pb-24 flex flex-row"><!></div>`),P=v(`<option>One</option> <option>Two</option>`,1),F=v(`<!> <!> <!>`,1),E.__docgen={data:[],name:`Dropdown.stories.svelte`},I=C(E,A),L=[`Basic`,`Disabled`,`LeftSnippet`],R={...I.Basic,tags:[`svelte-csf-v5`]},z={...I.Disabled,tags:[`svelte-csf-v5`]},B={...I.LeftSnippet,tags:[`svelte-csf-v5`]}})))()}V();export{R as Basic,z as Disabled,B as LeftSnippet,L as __namedExportsOrder,A as default};