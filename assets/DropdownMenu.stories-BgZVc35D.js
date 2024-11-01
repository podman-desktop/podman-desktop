import{p as _,i as h,b as v,k as w,f as M,c as D,l as x,a,n as I,t as b,h as B,j as g}from"./props-BwKVG7cO.js";import{a as t,e as j,i as k}from"./Table-E-24qa0r.js";import{f as y,a as T,b as C}from"./index-D45Brjt-.js";import"./ErrorMessage-BCM6ozae.js";import"./Button-CiPLlw5y.js";import"./LinearProgress-rCYbQhCc.js";import"./Spinner-BgfWTWd-.js";import"./EmptyScreen-DwfU0Pt1.js";import"./fa-layers-text.svelte_svelte_type_style_lang-Bfvj-eAa.js";import{d as R,c as S,s as E}from"./create-runtime-stories-CSLQyv6s.js";import"./class-D3DHyC7V.js";import"./index-client-DjbAFBD1.js";import"./StarIcon-CneK_ZEp.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-BMJuGjCE.js";import"./index-D-8MO0q_.js";import"./index-DxKRhftL.js";const{Story:O,meta:P}=R({component:t,title:"DropdownMenu",tags:["autodocs"],args:{},parameters:{docs:{description:{component:"These are the stories for the `DropdownMenu` component.\nInteract with a drop down from a kebab menu."}}}});var q=b('<div class="flex min-h-52 justify-center p-10"><!></div>');function r(n,i){_(i,!1),E((m,e,F=I)=>{let p=()=>B(e==null?void 0:e(),["_children"]);var o=q(),c=g(o);t(c,{children:(d,G)=>{var s=w(),l=M(s);j(l,1,()=>p().items,k,(f,u)=>{t.Item(f,D(()=>x(u)))}),a(d,s)},$$slots:{default:!0}}),a(m,o)}),h(),O(n,{name:"Basic",args:{items:[{title:"Item 1",icon:y},{title:"Item 2",icon:T},{title:"Item 3",icon:C}]},parameters:{__svelteCsf:{rawCode:`<div class="flex min-h-52 justify-center p-10">
  <DropdownMenu>
    {#each args.items as item}
      <DropdownMenu.Item {...item} />
    {/each}
  </DropdownMenu>
</div>`}}}),v()}r.__docgen={keywords:[],data:[],name:"DropdownMenu.stories.svelte"};const z=S(r,P),ae=["Basic"],re=z.Basic;export{re as Basic,ae as __namedExportsOrder,P as default};