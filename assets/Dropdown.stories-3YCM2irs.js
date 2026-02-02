import{n as $,f as i,s as x,c as n,j as I,p as S,a as u,b as s,d as C,e as B,t as O,h as T,r as L}from"./iframe-rVsMYg-I.js";import{c as A,i as E,d as P}from"./create-runtime-stories-CFoipW4_.js";import"./ErrorMessage-rYivWJls.js";import"./Button-eWSpxixg.js";import{D as w}from"./Table-Wj-QvVNn.js";import"./LinearProgress-DDWdnhk1.js";import"./EmptyScreen-DgH6_675.js";import"./preload-helper-PPVm8Dsz.js";import"./Icon-BYMyeuKo.js";import"./attributes-BXB_sF3U.js";import"./index-6LMdwVb6.js";import"./StarIcon-DfgnjY14.js";import"./ContainerIcon-BkQVWBS2.js";const{fn:j}=__STORYBOOK_MODULE_TEST__,y=(p,l,d=$)=>{let r=()=>T(l?.(),["_children"]);var e=k(),v=I(e);w(v,x(r,{children:(_,h)=>{var c=V(),o=u(c);o.value=o.__value="a";var t=s(o,2);t.value=t.__value="b";var a=s(t,2);a.value=a.__value="c",n(_,c)},$$slots:{default:!0}})),L(e),n(p,e)},M=j().mockName("onchange"),R={component:w,render:y,title:"Dropdown",tags:["autodocs"],argTypes:{value:{control:"text",description:"Initial value shown in the dropdown",defaultValue:""},onchange:M,disabled:{control:"boolean",description:"Set the dropdown as being disabled",defaultValue:!1},options:{description:"Dropdown items"}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:f}=P();var V=i("<option>Item A</option> <option>Item B</option> <option>Item C</option>",1),k=i('<div class="pb-24 flex flex-row"><!></div>'),F=i("<option>One</option> <option>Two</option>",1),K=i("<!> <!> <!>",1);function g(p,l){S(l,!1),E();var d=K(),r=u(d);f(r,{name:"Basic",args:{value:"Initial value"},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var e=s(r,2);f(e,{name:"Disabled",args:{value:"Disabled dropdown",disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var v=s(e,2);f(v,{name:"Left snippet",children:(_,h)=>{w(_,{left:o=>{B();var t=O("Selected value: ");n(o,t)},children:(o,t)=>{var a=F(),m=u(a);m.value=m.__value="a";var D=s(m,2);D.value=D.__value="b",n(o,a)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),n(p,d),C()}g.__docgen={data:[],name:"Dropdown.stories.svelte"};const b=A(g,R),eo=["Basic","Disabled","LeftSnippet"],to={...b.Basic,tags:["svelte-csf-v5"]},ao={...b.Disabled,tags:["svelte-csf-v5"]},no={...b.LeftSnippet,tags:["svelte-csf-v5"]};export{to as Basic,ao as Disabled,no as LeftSnippet,eo as __namedExportsOrder,R as default};
