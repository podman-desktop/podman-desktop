import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,Mt as r,Ot as i,Pt as a,Sn as o,_t as s,c,ct as l,dn as u,dt as d,h as f,in as p,it as m,jt as h,m as g,mn as ee,ot as _,rn as v,st as te,un as y,yn as ne}from"./iframe-CLfrOPBT.js";import{a as b,i as re,n as ie,r as x,t as S}from"./create-runtime-stories-1kBB17qu.js";import{C as ae,D as C,L as oe,N as w,O as T,_ as E,a as D,j as se,k as O,l as ce,o as le}from"./Icon-CvvowY7y.js";import{n as ue,t as k}from"./Button-BYa0J3gX.js";import{r as A,t as j}from"./free-regular-svg-icons-BVuv8LiA.js";function M(e,t){p(t,!1),f();var n=H(),i=r(n);L(i,{name:`Basic`,args:{kind:`basic`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var o=a(i,2);L(o,{name:`States`,args:{kind:`states`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var s=a(o,2);L(s,{name:`Icons`,args:{kind:`icons`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var c=a(s,2);L(c,{name:`Examples`,args:{kind:`examples`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var l=a(c,2);L(l,{name:`Patterns`,args:{kind:`patterns`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var u=a(l,2);L(u,{name:`Edge Cases`,args:{kind:`edges`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var d=a(u,2);L(d,{name:`Toggle Buttons`,args:{kind:`toggles`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var m=a(d,2);L(m,{name:`Tabs`,args:{kind:`tabs`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}}),_(e,n),v()}var N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{o(),b(),ne(),A(),oe(),ue(),re(),c(),ie(),{fn:N}=__STORYBOOK_MODULE_TEST__,P=(e,o)=>{let c=()=>ee(o?.(),[]);var l=te(),f=r(l),p=e=>{var n=B(),r=h(n),o=h(r),l=h(o,!0);u(o);var f=a(o,2);t(f,5,()=>R[c().kind].variants,e=>e.name,(e,t)=>{var n=z(),r=h(n),o=h(r,!0);u(r);var c=a(r,2);k(c,g(()=>s(t).args,{children:(e,n)=>{y();var r=d();i(()=>m(r,s(t).args.content)),_(e,r)},$$slots:{default:!0}})),u(n),i(()=>m(o,s(t).name)),_(e,n)}),u(f),u(r),u(n),i(()=>m(l,R[c().kind].label)),_(e,n)},v=e=>{var t=V(),n=h(t);k(n,g(c,{children:(e,t)=>{y();var n=d();i(()=>m(n,c().content)),_(e,n)},$$slots:{default:!0}})),u(t),_(e,t)};n(f,e=>{c().kind&&R[c().kind]?e(p):e(v,-1)}),_(e,l)},F=N().mockName(`onclick`),I={component:k,render:P,title:`Button/Button`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}}},args:{onclick:F},parameters:{docs:{description:{component:`These are the stories for the \`Button\` component.
It's the default button we use throughout our application.

This collection showcases button types, states, and usage patterns
found in the Podman Desktop application.`}}}},{Story:L}=x(I),R={basic:{label:`Basic Types`,variants:[{name:`Primary`,args:{type:`primary`,content:`Primary`}},{name:`Secondary`,args:{type:`secondary`,content:`Secondary`}},{name:`Danger`,args:{type:`danger`,content:`Danger`}},{name:`Link`,args:{type:`link`,content:`Link`}},{name:`Tab`,args:{type:`tab`,content:`Tab`}},{name:`Tab Selected`,args:{type:`tab`,content:`Selected Tab`,selected:!0}},{name:`Default (No Type)`,args:{content:`Default Button`}}]},states:{label:`States`,variants:[{name:`Primary Disabled`,args:{type:`primary`,content:`Primary Disabled`,disabled:!0}},{name:`Secondary Disabled`,args:{type:`secondary`,content:`Secondary Disabled`,disabled:!0}},{name:`Danger Disabled`,args:{type:`danger`,content:`Danger Disabled`,disabled:!0}},{name:`Primary Loading`,args:{type:`primary`,content:`Loading`,inProgress:!0}},{name:`Secondary Loading`,args:{type:`secondary`,content:`Loading`,inProgress:!0}},{name:`Danger Loading`,args:{type:`danger`,content:`Loading`,inProgress:!0}},{name:`Loading With Icon`,args:{type:`primary`,content:`Loading with Icon`,inProgress:!0,icon:j}},{name:`Disabled + Loading`,args:{type:`primary`,content:`Disabled + Loading`,disabled:!0,inProgress:!0}}]},icons:{label:`Icons`,variants:[{name:`Primary With Icon`,args:{type:`primary`,content:`With Icon`,icon:j}},{name:`Secondary With Icon`,args:{type:`secondary`,content:`With Icon`,icon:C}},{name:`Danger With Icon`,args:{type:`danger`,content:`With Icon`,icon:w}},{name:`Link With Icon`,args:{type:`link`,content:`More details`,icon:le}},{name:`Icon Only`,args:{type:`primary`,icon:w,"aria-label":`Delete`}},{name:`Icon Only Secondary`,args:{type:`secondary`,icon:T,"aria-label":`Add`}},{name:`Icon Only With Title`,args:{type:`primary`,icon:T,title:`Add build argument`}},{name:`Disabled Icon Only`,args:{type:`secondary`,icon:T,disabled:!0,title:`Cannot add more items`,"aria-label":`Add item`}}]},examples:{label:`Examples`,variants:[{name:`Build`,args:{type:`primary`,content:`Build`,icon:E}},{name:`Pull Image`,args:{type:`primary`,content:`Pull image`,icon:D}},{name:`Install`,args:{type:`primary`,content:`Install`,icon:O}},{name:`Prune`,args:{type:`primary`,content:`Prune`,icon:w,title:`Remove unused data`}},{name:`Cleanup`,args:{type:`danger`,content:`Cleanup / Purge data`,icon:ce}},{name:`Clear All`,args:{type:`primary`,content:`Clear all`,icon:w}},{name:`Start`,args:{type:`primary`,content:`Start`,icon:C}},{name:`Stop`,args:{type:`primary`,content:`Stop`,icon:se}},{name:`Add`,args:{type:`primary`,content:`Add`}},{name:`Cancel (Secondary)`,args:{type:`secondary`,content:`Cancel`}},{name:`Cancel (Link)`,args:{type:`link`,content:`Cancel`}},{name:`Skip`,args:{type:`secondary`,content:`Skip`}},{name:`Next`,args:{type:`primary`,content:`Next`}},{name:`Login`,args:{type:`primary`,content:`Login`}},{name:`Login Disabled`,args:{type:`primary`,content:`Login`,disabled:!0}},{name:`Login Loading`,args:{type:`primary`,content:`Login`,inProgress:!0}},{name:`Add Build Argument`,args:{type:`secondary`,icon:T,"aria-label":`Add build argument`}},{name:`Delete Build Argument`,args:{type:`secondary`,icon:ae,"aria-label":`Delete build argument`}}]},patterns:{label:`Patterns`,variants:[{name:`Full Width`,args:{type:`primary`,content:`Full Width Button`,class:`w-full`}},{name:`Full Width With Icon`,args:{type:`primary`,content:`Build`,icon:E,class:`w-full`}},{name:`Custom Padding Small`,args:{type:`primary`,content:`Small Padding`,padding:`px-2 py-1`}},{name:`Custom Padding Large`,args:{type:`primary`,content:`Large Padding`,padding:`px-6 py-3`}},{name:`Custom Padding Compact`,args:{type:`primary`,content:`Update to v1.2.3`,padding:`px-3 py-0.5`,icon:O}},{name:`Disabled With Validation`,args:{type:`primary`,content:`Submit`,disabled:!0,title:`Form contains invalid fields`}},{name:`Loading Installation`,args:{type:`primary`,content:`Install`,icon:O,inProgress:!0}},{name:`Loading Pull`,args:{type:`primary`,content:`Pull image`,icon:D,inProgress:!0}},{name:`With Margin Right`,args:{type:`secondary`,content:`Cancel`,class:`mr-3`}},{name:`With Margin Left`,args:{type:`link`,content:`Link Button`,class:`ml-3`}},{name:`Auto Width`,args:{type:`primary`,content:`Auto Width`,class:`w-auto`}},{name:`Link With Underline`,args:{type:`link`,content:`Underlined Link`,class:`underline`}}]},edges:{label:`Edge Cases`,variants:[{name:`Very Long Text`,args:{type:`primary`,content:`This is a button with very long text that might wrap or overflow`}},{name:`Empty Text With Icon`,args:{type:`primary`,icon:w}},{name:`Hidden Button`,args:{type:`primary`,content:`Hidden`,hidden:!0}},{name:`Custom Class`,args:{type:`primary`,content:`Custom Class`,class:`opacity-50 hover:opacity-100`}},{name:`Custom Aria Label`,args:{type:`primary`,content:`Button`,"aria-label":`Custom accessible label for screen readers`}},{name:`All Props`,args:{type:`primary`,content:`All Props`,icon:j,title:`This is a tooltip`,"aria-label":`Accessible label`,class:`custom-class`}}]},toggles:{label:`Toggle Buttons`,variants:[{name:`Toggle Pressed`,args:{type:`primary`,content:`Notifications`,pressed:!0}},{name:`Toggle Unpressed`,args:{type:`primary`,content:`Notifications`,pressed:!1}},{name:`Toggle Secondary Pressed`,args:{type:`secondary`,content:`Filter`,pressed:!0}},{name:`Toggle Secondary Unpressed`,args:{type:`secondary`,content:`Filter`,pressed:!1}},{name:`Toggle Icon Only Pressed`,args:{type:`secondary`,icon:j,pressed:!0,"aria-label":`Mute notifications`}},{name:`Toggle Icon Only Unpressed`,args:{type:`secondary`,icon:j,pressed:!1,"aria-label":`Mute notifications`}},{name:`Toggle Disabled Pressed`,args:{type:`secondary`,content:`Filter`,pressed:!0,disabled:!0}}]},tabs:{label:`Tabs`,variants:[{name:`Tab Group Unselected`,args:{type:`tab`,content:`All`,selected:!1}},{name:`Tab Group Selected`,args:{type:`tab`,content:`Running`,selected:!0}},{name:`Tab Capitalize`,args:{type:`tab`,content:`completed`,class:`capitalize`,selected:!1}},{name:`Tab Capitalize Selected`,args:{type:`tab`,content:`completed`,class:`capitalize`,selected:!0}},{name:`Tab With Custom Class`,args:{type:`tab`,content:`Custom Tab`,class:`capitalize`}}]}},z=l(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),B=l(`<div class="bg-(--pd-content-card-bg) p-4"><div class="flex flex-col gap-4"><div class="text-sm font-semibold text-(--pd-content-header)"> </div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),V=l(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),H=l(`<!> <!> <!> <!> <!> <!> <!> <!>`,1),M.__docgen={data:[],name:`Button.stories.svelte`},U=S(M,I),W=[`Basic`,`States`,`Icons`,`Examples`,`Patterns`,`EdgeCases`,`ToggleButtons`,`Tabs`],G={...U.Basic,tags:[`svelte-csf-v5`]},K={...U.States,tags:[`svelte-csf-v5`]},q={...U.Icons,tags:[`svelte-csf-v5`]},J={...U.Examples,tags:[`svelte-csf-v5`]},Y={...U.Patterns,tags:[`svelte-csf-v5`]},X={...U.EdgeCases,tags:[`svelte-csf-v5`]},Z={...U.ToggleButtons,tags:[`svelte-csf-v5`]},Q={...U.Tabs,tags:[`svelte-csf-v5`]}})))()}$();export{G as Basic,X as EdgeCases,J as Examples,q as Icons,Y as Patterns,K as States,Q as Tabs,Z as ToggleButtons,W as __namedExportsOrder,I as default};