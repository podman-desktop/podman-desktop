import{p as g,i as I,f as p,a as f,s as r,b as s,c as C,t as S,n as B,d as T,h as $,j as L}from"./props-BQIdJNSI.js";import"./ErrorMessage-CbclVIFU.js";import"./Button-C-upAzmK.js";import{D as w}from"./Table-D-qrPYof.js";import"./LinearProgress-Wsg1lUWU.js";import"./Spinner-DGv3OdZ_.js";import"./EmptyScreen-CNcih5HN.js";import{c as y,s as A,d as O}from"./create-runtime-stories-DfwGlSfA.js";import{f as P}from"./index-BMS2073q.js";import"./this-CL8O8lI-.js";import"./attributes-SJox0dev.js";import"./index-B5O8svG2.js";import"./fa-layers-text.svelte_svelte_type_style_lang-fftxYGzc.js";import"./StarIcon-D5jfCksK.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DtmeDzJ6.js";import"./index-CfOrKyLd.js";const j=(l,t,d=B)=>{let i=()=>$(t==null?void 0:t(),["_children"]);var n=F(),m=L(n);w(m,T(i,{children:(v,x)=>{var c=E(),o=f(c);o.value=o.__value="a";var e=r(o,2);e.value=e.__value="b";var a=r(e,2);a.value=a.__value="c",s(v,c)},$$slots:{default:!0}})),s(l,n)},k=P().mockName("onchange"),V={component:w,title:"Dropdown",tags:["autodocs"],argTypes:{value:{control:"text",description:"Initial value shown in the dropdown",defaultValue:""},onchange:k,disabled:{control:"boolean",description:"Set the dropdown as being disabled",defaultValue:!1},options:{description:"Dropdown items"}},parameters:{docs:{description:{component:"These are the stories for the `Dropdown` component."}}}},{Story:_}=O();var E=p("<option>Item A</option> <option>Item B</option> <option>Item C</option>",1),F=p('<div class="pb-24 flex flex-row"><!></div>'),M=p("<option>One</option> <option>Two</option>",1),N=p("<!> <!> <!>",1);function D(l,t){g(t,!1),A(j),I();var d=N(),i=f(d);_(i,{name:"Basic",args:{value:"Initial value"},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var n=r(i,2);_(n,{name:"Disabled",args:{value:"Disabled dropdown",disabled:!0},parameters:{__svelteCsf:{rawCode:`<div class="pb-24 flex flex-row">
  <Dropdown {...args}>
    <option value="a">Item A</option>
    <option value="b">Item B</option>
    <option value="c">Item C</option>
  </Dropdown>
</div>`}}});var m=r(n,2);_(m,{name:"Left snippet",children:(v,x)=>{w(v,{left:o=>{var e=S("Selected value: ");s(o,e)},children:(o,e)=>{var a=M(),u=f(a);u.value=u.__value="a";var h=r(u,2);h.value=h.__value="b",s(o,a)},$$slots:{left:!0,default:!0}})},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<Dropdown>
  <option value="a">One</option>
  <option value="b">Two</option>
  {#snippet left()}
    Selected value:&nbsp;
  {/snippet}
</Dropdown>`}}}),s(l,d),C()}D.__docgen={keywords:[],data:[],name:"Dropdown.stories.svelte"};const b=y(D,V),ao=["Basic","Disabled","LeftSnippet"],ro=b.Basic,so=b.Disabled,io=b.LeftSnippet;export{ro as Basic,so as Disabled,io as LeftSnippet,ao as __namedExportsOrder,V as default};
