import{n as h,s as x,b as a,g as i,j as I,f as u,c as s,e as S,p as C,d as B,t as O,r as T,i as L}from"./iframe-DXFTqHs1.js";import{c as A,i as E,d as P}from"./create-runtime-stories-CjnmB2uq.js";import"./ErrorMessage-DH_3DpOP.js";import"./Button-BfogKd4F.js";import{D as w}from"./Table-CnjqaSfo.js";import"./LinearProgress-CMfCZ84s.js";import"./EmptyScreen-DJdY0URt.js";import"./preload-helper-PPVm8Dsz.js";import"./Icon-Dcd_2Cn6.js";import"./attributes-BaqubOFj.js";import"./index-Bwd0Nebv.js";import"./StarIcon-BgWRLWOb.js";import"./ContainerIcon-B4BobQj4.js";const{fn:j}=__STORYBOOK_MODULE_TEST__,y=(p,l,d=h)=>{let r=()=>S(l?.(),["_children"]);var e=k(),v=I(e);w(v,x(r,{children:(_,$)=>{var c=V(),o=u(c);o.value=o.__value="a";var t=s(o,2);t.value=t.__value="b";var n=s(t,2);n.value=n.__value="c",a(_,c)},$$slots:{default:!0}})),T(e),a(p,e)},M=j().mockName("onchange"),R={component:w,render:y,title:"Dropdown",tags:["autodocs"],argTypes:{value:{control:"text",description:"Initial value shown in the dropdown",defaultValue:""},onchange:M,disabled:{control:"boolean",description:"Set the dropdown as being disabled",defaultValue:!1},options:{description:"Dropdown items"}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:f}=P();var V=i("<option>Item A</option> <option>Item B</option> <option>Item C</option>",1),k=i('<div class="pb-24 flex flex-row"><!></div>'),F=i("<option>One</option> <option>Two</option>",1),K=i("<!> <!> <!>",1);function g(p,l){C(l,!1),E();var d=K(),r=u(d);f(r,{name:"Basic",args:{value:"Initial value"},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
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
</div>`}}});var v=s(e,2);f(v,{name:"Left snippet",children:(_,$)=>{w(_,{left:o=>{L();var t=O("Selected value: ");a(o,t)},children:(o,t)=>{var n=F(),m=u(n);m.value=m.__value="a";var D=s(m,2);D.value=D.__value="b",a(o,n)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),a(p,d),B()}g.__docgen={data:[],name:"Dropdown.stories.svelte"};const b=A(g,R),eo=["Basic","Disabled","LeftSnippet"],to={...b.Basic,tags:["svelte-csf-v5"]},no={...b.Disabled,tags:["svelte-csf-v5"]},ao={...b.LeftSnippet,tags:["svelte-csf-v5"]};export{to as Basic,no as Disabled,ao as LeftSnippet,eo as __namedExportsOrder,R as default};
