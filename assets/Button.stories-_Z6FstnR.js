import{k as j,a as O,o as G,c as i,p as H,f as _,b as e,d as q,h as Y,j as c,r as s,s as A,e as E,t as $,g as b,i as f,l as L}from"./iframe-DZrThAKs.js";import{c as J,i as Q,d as X}from"./create-runtime-stories-BcV-zZ8I.js";import{f as K,e as Z}from"./index-BE2LIWIq.js";import{b as m,c as V,a as I,d as R,e as aa,g as F,h as na,i as x,j as ta,k as ea}from"./Icon-BDHzxtsM.js";import{B as D}from"./Button-B3Se09-R.js";import"./preload-helper-PPVm8Dsz.js";import"./attributes-CxgPKONh.js";const{fn:sa}=__STORYBOOK_MODULE_TEST__,ra=(h,k)=>{let n=()=>Y(k?.(),[]);var l=j(),v=O(l);{var u=t=>{var a=ya(),d=c(a),g=c(d),W=c(g,!0);s(g);var p=e(g,2);Z(p,5,()=>T[n().kind].variants,B=>B.name,(B,C)=>{var P=ua(),S=c(P),U=c(S,!0);s(S);var z=e(S,2);D(z,A(()=>L(C).args,{children:(N,xa)=>{E();var w=$();b(()=>f(w,L(C).args.content)),i(N,w)},$$slots:{default:!0}})),s(P),b(()=>f(U,L(C).name)),i(B,P)}),s(p),s(d),s(a),b(()=>f(W,T[n().kind].label)),i(t,a)},y=t=>{var a=ba(),d=c(a);D(d,A(n,{children:(g,W)=>{E();var p=$();b(()=>f(p,n().content)),i(g,p)},$$slots:{default:!0}})),s(a),i(t,a)};G(v,t=>{n().kind&&T[n().kind]?t(u):t(y,!1)})}i(h,l)},ia=sa().mockName("onclick"),oa={component:D,render:ra,title:"Button/Button",tags:["autodocs"],argTypes:{kind:{table:{disable:!0}}},args:{onclick:ia},parameters:{docs:{description:{component:`These are the stories for the \`Button\` component.
It's the default button we use throughout our application.

This collection showcases button types, states, and usage patterns
found in the Podman Desktop application.`}}}},{Story:r}=X(),da=[{name:"Primary",args:{type:"primary",content:"Primary"}},{name:"Secondary",args:{type:"secondary",content:"Secondary"}},{name:"Danger",args:{type:"danger",content:"Danger"}},{name:"Link",args:{type:"link",content:"Link"}},{name:"Tab",args:{type:"tab",content:"Tab"}},{name:"Tab Selected",args:{type:"tab",content:"Selected Tab",selected:!0}},{name:"Default (No Type)",args:{content:"Default Button"}}],ca=[{name:"Primary Disabled",args:{type:"primary",content:"Primary Disabled",disabled:!0}},{name:"Secondary Disabled",args:{type:"secondary",content:"Secondary Disabled",disabled:!0}},{name:"Danger Disabled",args:{type:"danger",content:"Danger Disabled",disabled:!0}},{name:"Primary Loading",args:{type:"primary",content:"Loading",inProgress:!0}},{name:"Secondary Loading",args:{type:"secondary",content:"Loading",inProgress:!0}},{name:"Danger Loading",args:{type:"danger",content:"Loading",inProgress:!0}},{name:"Loading With Icon",args:{type:"primary",content:"Loading with Icon",inProgress:!0,icon:K}},{name:"Disabled + Loading",args:{type:"primary",content:"Disabled + Loading",disabled:!0,inProgress:!0}}],la=[{name:"Primary With Icon",args:{type:"primary",content:"With Icon",icon:K}},{name:"Secondary With Icon",args:{type:"secondary",content:"With Icon",icon:F}},{name:"Danger With Icon",args:{type:"danger",content:"With Icon",icon:m}},{name:"Link With Icon",args:{type:"link",content:"More details",icon:ea}},{name:"Icon Only",args:{type:"primary",icon:m,"aria-label":"Delete"}},{name:"Icon Only Secondary",args:{type:"secondary",icon:x,"aria-label":"Add"}},{name:"Icon Only With Title",args:{type:"primary",icon:x,title:"Add build argument"}},{name:"Disabled Icon Only",args:{type:"secondary",icon:x,disabled:!0,title:"Cannot add more items","aria-label":"Add item"}}],ga=[{name:"Build",args:{type:"primary",content:"Build",icon:V}},{name:"Pull Image",args:{type:"primary",content:"Pull image",icon:R}},{name:"Install",args:{type:"primary",content:"Install",icon:I}},{name:"Prune",args:{type:"primary",content:"Prune",icon:m,title:"Remove unused data"}},{name:"Cleanup",args:{type:"danger",content:"Cleanup / Purge data",icon:aa}},{name:"Clear All",args:{type:"primary",content:"Clear all",icon:m}},{name:"Start",args:{type:"primary",content:"Start",icon:F}},{name:"Stop",args:{type:"primary",content:"Stop",icon:na}},{name:"Add",args:{type:"primary",content:"Add"}},{name:"Cancel (Secondary)",args:{type:"secondary",content:"Cancel"}},{name:"Cancel (Link)",args:{type:"link",content:"Cancel"}},{name:"Skip",args:{type:"secondary",content:"Skip"}},{name:"Next",args:{type:"primary",content:"Next"}},{name:"Login",args:{type:"primary",content:"Login"}},{name:"Login Disabled",args:{type:"primary",content:"Login",disabled:!0}},{name:"Login Loading",args:{type:"primary",content:"Login",inProgress:!0}},{name:"Add Build Argument",args:{type:"secondary",icon:x,"aria-label":"Add build argument"}},{name:"Delete Build Argument",args:{type:"secondary",icon:ta,"aria-label":"Delete build argument"}}],pa=[{name:"Full Width",args:{type:"primary",content:"Full Width Button",class:"w-full"}},{name:"Full Width With Icon",args:{type:"primary",content:"Build",icon:V,class:"w-full"}},{name:"Custom Padding Small",args:{type:"primary",content:"Small Padding",padding:"px-2 py-1"}},{name:"Custom Padding Large",args:{type:"primary",content:"Large Padding",padding:"px-6 py-3"}},{name:"Custom Padding Compact",args:{type:"primary",content:"Update to v1.2.3",padding:"px-3 py-0.5",icon:I}},{name:"Disabled With Validation",args:{type:"primary",content:"Submit",disabled:!0,title:"Form contains invalid fields"}},{name:"Loading Installation",args:{type:"primary",content:"Install",icon:I,inProgress:!0}},{name:"Loading Pull",args:{type:"primary",content:"Pull image",icon:R,inProgress:!0}},{name:"With Margin Right",args:{type:"secondary",content:"Cancel",class:"mr-3"}},{name:"With Margin Left",args:{type:"link",content:"Link Button",class:"ml-3"}},{name:"Auto Width",args:{type:"primary",content:"Auto Width",class:"w-auto"}},{name:"Link With Underline",args:{type:"link",content:"Underlined Link",class:"underline"}}],ma=[{name:"Very Long Text",args:{type:"primary",content:"This is a button with very long text that might wrap or overflow"}},{name:"Empty Text With Icon",args:{type:"primary",icon:m}},{name:"Hidden Button",args:{type:"primary",content:"Hidden",hidden:!0}},{name:"Custom Class",args:{type:"primary",content:"Custom Class",class:"opacity-50 hover:opacity-100"}},{name:"Custom Aria Label",args:{type:"primary",content:"Button","aria-label":"Custom accessible label for screen readers"}},{name:"All Props",args:{type:"primary",content:"All Props",icon:K,title:"This is a tooltip","aria-label":"Accessible label",class:"custom-class"}}],va=[{name:"Tab Group Unselected",args:{type:"tab",content:"All",selected:!1}},{name:"Tab Group Selected",args:{type:"tab",content:"Running",selected:!0}},{name:"Tab Capitalize",args:{type:"tab",content:"completed",class:"capitalize",selected:!1}},{name:"Tab Capitalize Selected",args:{type:"tab",content:"completed",class:"capitalize",selected:!0}},{name:"Tab With Custom Class",args:{type:"tab",content:"Custom Tab",class:"capitalize"}}],T={basic:{label:"Basic Types",variants:da},states:{label:"States",variants:ca},icons:{label:"Icons",variants:la},examples:{label:"Examples",variants:ga},patterns:{label:"Patterns",variants:pa},edges:{label:"Edge Cases",variants:ma},tabs:{label:"Tabs",variants:va}};var ua=_('<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>'),ya=_('<div class="bg-(--pd-content-card-bg) p-4"><div class="flex flex-col gap-4"><div class="text-sm font-semibold text-(--pd-content-header)"> </div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>'),ba=_('<div class="bg-(--pd-content-card-bg) p-4"><!></div>'),fa=_("<!> <!> <!> <!> <!> <!> <!>",1);function M(h,k){H(k,!1),Q();var n=fa(),l=O(n);r(l,{name:"Basic",args:{kind:"basic"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var v=e(l,2);r(v,{name:"States",args:{kind:"states"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var u=e(v,2);r(u,{name:"Icons",args:{kind:"icons"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var y=e(u,2);r(y,{name:"Examples",args:{kind:"examples"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var t=e(y,2);r(t,{name:"Patterns",args:{kind:"patterns"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var a=e(t,2);r(a,{name:"Edge Cases",args:{kind:"edges"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var d=e(a,2);r(d,{name:"Tabs",args:{kind:"tabs"},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4">
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Button {...variant.args}>{variant.args.content}</Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}}),i(h,n),q()}M.__docgen={data:[],name:"Button.stories.svelte"};const o=J(M,oa),La=["Basic","States","Icons","Examples","Patterns","EdgeCases","Tabs"],Ta={...o.Basic,tags:["svelte-csf-v5"]},Ia={...o.States,tags:["svelte-csf-v5"]},Da={...o.Icons,tags:["svelte-csf-v5"]},Ka={...o.Examples,tags:["svelte-csf-v5"]},Wa={...o.Patterns,tags:["svelte-csf-v5"]},wa={...o.EdgeCases,tags:["svelte-csf-v5"]},Aa={...o.Tabs,tags:["svelte-csf-v5"]};export{Ta as Basic,wa as EdgeCases,Ka as Examples,Da as Icons,Wa as Patterns,Ia as States,Aa as Tabs,La as __namedExportsOrder,oa as default};
