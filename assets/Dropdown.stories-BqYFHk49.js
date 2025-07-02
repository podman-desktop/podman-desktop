import{n as x,f as p,s as I,c as s,i as S,p as C,a as u,b as r,d as $,t as B,g as O}from"./iframe-CjMwcVZv.js";import{c as T,i as L,d as A}from"./create-runtime-stories-DSf5vlDr.js";import"./ErrorMessage-DU4KEzRQ.js";import"./Button-BkHG6hnc.js";import{D as w}from"./Table-D2d-1HMb.js";import"./LinearProgress-DH7tUal0.js";import"./Spinner-D8Zw9_jl.js";import"./EmptyScreen-Uu3q9dzZ.js";import"./Icon-evA5e_cy.js";import"./attributes-D2YsoQ7u.js";import"./index-D6iXELdJ.js";import"./StarIcon-B5jMMCbW.js";import"./index-DtmeDzJ6.js";const{fn:E}=__STORYBOOK_MODULE_TEST__,P=(l,t,d=x)=>{let i=()=>O(t==null?void 0:t(),["_children"]);var n=V(),v=S(n);w(v,I(i,{children:(_,h)=>{var c=R(),o=u(c);o.value=o.__value="a";var e=r(o,2);e.value=e.__value="b";var a=r(e,2);a.value=a.__value="c",s(_,c)},$$slots:{default:!0}})),s(l,n)},y=E().mockName("onchange"),M={component:w,render:P,title:"Dropdown",tags:["autodocs"],argTypes:{value:{control:"text",description:"Initial value shown in the dropdown",defaultValue:""},onchange:y,disabled:{control:"boolean",description:"Set the dropdown as being disabled",defaultValue:!1},options:{description:"Dropdown items"}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:f}=A();var R=p("<option>Item A</option> <option>Item B</option> <option>Item C</option>",1),V=p('<div class="pb-24 flex flex-row"><!></div>'),j=p("<option>One</option> <option>Two</option>",1),k=p("<!> <!> <!>",1);function g(l,t){C(t,!1),L();var d=k(),i=u(d);f(i,{name:"Basic",args:{value:"Initial value"},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var n=r(i,2);f(n,{name:"Disabled",args:{value:"Disabled dropdown",disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var v=r(n,2);f(v,{name:"Left snippet",children:(_,h)=>{w(_,{left:o=>{var e=B("Selected value: ");s(o,e)},children:(o,e)=>{var a=j(),m=u(a);m.value=m.__value="a";var D=r(m,2);D.value=D.__value="b",s(o,a)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),s(l,d),$()}g.__docgen={data:[],name:"Dropdown.stories.svelte"};const b=T(g,M),Z=["Basic","Disabled","LeftSnippet"],oo={...b.Basic,tags:["svelte-csf-v5"]},eo={...b.Disabled,tags:["svelte-csf-v5"]},to={...b.LeftSnippet,tags:["svelte-csf-v5"]};export{oo as Basic,eo as Disabled,to as LeftSnippet,Z as __namedExportsOrder,M as default};
