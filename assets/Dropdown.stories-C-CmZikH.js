import{n as h,f as i,s as x,c as a,i as I,p as S,a as u,b as s,d as C,t as B,g as O}from"./iframe-wSvnP9kD.js";import{c as T,i as L,d as A}from"./create-runtime-stories-jtEEn28N.js";import"./ErrorMessage-ru9G3ewQ.js";import"./Button-BePdiGan.js";import{D as w}from"./Table-ytHBKh5W.js";import"./LinearProgress-abdBgFba.js";import"./Spinner-DC1n-Hyn.js";import"./EmptyScreen-2Fp1pp8L.js";import"./Icon-uf-Emmkq.js";import"./attributes-DUzJWJrt.js";import"./index-D6iXELdJ.js";import"./StarIcon-yD25WOvn.js";import"./index-DtmeDzJ6.js";const{fn:E}=__STORYBOOK_MODULE_TEST__,P=(p,l,d=h)=>{let r=()=>O(l?.(),["_children"]);var t=V(),v=I(t);w(v,x(r,{children:(_,$)=>{var c=R(),o=u(c);o.value=o.__value="a";var e=s(o,2);e.value=e.__value="b";var n=s(e,2);n.value=n.__value="c",a(_,c)},$$slots:{default:!0}})),a(p,t)},y=E().mockName("onchange"),M={component:w,render:P,title:"Dropdown",tags:["autodocs"],argTypes:{value:{control:"text",description:"Initial value shown in the dropdown",defaultValue:""},onchange:y,disabled:{control:"boolean",description:"Set the dropdown as being disabled",defaultValue:!1},options:{description:"Dropdown items"}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:f}=A();var R=i("<option>Item A</option> <option>Item B</option> <option>Item C</option>",1),V=i('<div class="pb-24 flex flex-row"><!></div>'),j=i("<option>One</option> <option>Two</option>",1),k=i("<!> <!> <!>",1);function g(p,l){S(l,!1),L();var d=k(),r=u(d);f(r,{name:"Basic",args:{value:"Initial value"},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var t=s(r,2);f(t,{name:"Disabled",args:{value:"Disabled dropdown",disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var v=s(t,2);f(v,{name:"Left snippet",children:(_,$)=>{w(_,{left:o=>{var e=B("Selected value: ");a(o,e)},children:(o,e)=>{var n=j(),m=u(n);m.value=m.__value="a";var D=s(m,2);D.value=D.__value="b",a(o,n)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown {...args}>
  <Dropdown>
<option value="a">One</option>
<option value="b">Two</option>
{#snippet left()}
  Selected value:&nbsp;
{/snippet}
</Dropdown>
</Dropdown>`}}}),a(p,d),C()}g.__docgen={data:[],name:"Dropdown.stories.svelte"};const b=T(g,M),Z=["Basic","Disabled","LeftSnippet"],oo={...b.Basic,tags:["svelte-csf-v5"]},eo={...b.Disabled,tags:["svelte-csf-v5"]},to={...b.LeftSnippet,tags:["svelte-csf-v5"]};export{oo as Basic,eo as Disabled,to as LeftSnippet,Z as __namedExportsOrder,M as default};
