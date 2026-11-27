import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,At as n,Bt as r,Ct as i,En as a,Ft as o,I as s,It as c,Jt as l,Mt as u,Nt as d,Ot as f,Tn as p,_t as m,c as h,hn as g,it as _,kt as v,m as y,mn as b,mt as x,vt as ee,x as te,yn as ne,yt as S}from"./iframe-C8E0bH--.js";import{a as re,i as ie,n as ae,r as oe,t as se}from"./create-runtime-stories-uG7mwCkM.js";import{I as ce,M as C,N as w,O as le,P as T,U as ue,d as de,o as E,s as D,y as O,z as k}from"./Icon-D7g09WL9.js";import{n as fe,t as A}from"./Button-B-OuIm6Y.js";import{r as pe,t as j}from"./free-regular-svg-icons-Bu4VtLvb.js";function M(e,t){g(t,!1),te();var n=V(),r=d(n);I(r,{name:`Basic`,args:{kind:`basic`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var i=c(r,2);I(i,{name:`States`,args:{kind:`states`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var a=c(i,2);I(a,{name:`Icons`,args:{kind:`icons`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var o=c(a,2);I(o,{name:`Examples`,args:{kind:`examples`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var s=c(o,2);I(s,{name:`Patterns`,args:{kind:`patterns`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var l=c(s,2);I(l,{name:`Edge Cases`,args:{kind:`edges`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var u=c(l,2);I(u,{name:`Toggle Buttons`,args:{kind:`toggles`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var f=c(u,2);I(f,{name:`Tabs`,args:{kind:`tabs`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}});var p=c(f,2);I(p,{name:`RTL`,args:{kind:`rtl`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
  <div class="bg-(--pd-content-card-bg) p-4" dir={groupKinds[args.kind].dir}>
    <div class="flex flex-col gap-4">
      <div class="text-sm font-semibold text-(--pd-content-header)">{groupKinds[args.kind].label}</div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each groupKinds[args.kind].variants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <!-- An empty body still counts as children, which would hide a missing aria-label on icon-only buttons -->
            <div class="contents" lang={variant.lang}>
              {#if variant.args.content}
                <Button {...variant.args}>{variant.args.content}</Button>
              {:else}
                <Button {...variant.args} />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-4">
    <Button {...args}>{args.content}</Button>
  </div>
{/if}`}}}),m(e,n),b()}var N,P,me,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{n(),v(),re(),f(),pe(),ue(),fe(),ie(),h(),ae(),{fn:N}=__STORYBOOK_MODULE_TEST__,P=(e,n)=>{let f=()=>ne(n?.(),[]);var h=ee(),g=d(h),v=e=>{var n=z(),d=u(n),h=u(d),g=o(h,!0),v=c(h,2);t(v,5,()=>L[f().kind].variants,e=>e.name,(e,t)=>{var n=R(),d=u(n),f=o(d,!0),h=c(d,2),g=u(h),v=e=>{A(e,y(()=>r(t).args,{children:(e,n)=>{p();var a=i();l(()=>x(a,r(t).args.content)),m(e,a)},$$slots:{default:!0}}))},b=e=>{A(e,y(()=>r(t).args))};_(g,e=>{r(t).args.content?e(v):e(b,-1)}),a(h),a(n),l(()=>{x(f,r(t).name),s(h,`lang`,r(t).lang)}),m(e,n)}),a(v),a(d),a(n),l(()=>{s(n,`dir`,L[f().kind].dir),x(g,L[f().kind].label),n.dir=n.dir}),m(e,n)},b=e=>{var t=B(),n=u(t);A(n,y(f,{children:(e,t)=>{p();var n=i();l(()=>x(n,f().content)),m(e,n)},$$slots:{default:!0}})),a(t),m(e,t)};_(g,e=>{f().kind&&L[f().kind]?e(v):e(b,-1)}),m(e,h)},me=N().mockName(`onclick`),F={component:A,render:P,title:`Button/Button`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}}},args:{onclick:me},parameters:{docs:{description:{component:`These are the stories for the \`Button\` component.
It's the default button we use throughout our application.

This collection showcases button types, states, and usage patterns
found in the Podman Desktop application.`}}}},{Story:I}=oe(F),L={basic:{label:`Basic Types`,variants:[{name:`Primary`,args:{type:`primary`,content:`Primary`}},{name:`Secondary`,args:{type:`secondary`,content:`Secondary`}},{name:`Danger`,args:{type:`danger`,content:`Danger`}},{name:`Link`,args:{type:`link`,content:`Link`}},{name:`Tab`,args:{type:`tab`,content:`Tab`,selected:!1}},{name:`Tab Selected`,args:{type:`tab`,content:`Selected Tab`,selected:!0}},{name:`Default (No Type)`,args:{content:`Default Button`}}]},states:{label:`States`,variants:[{name:`Primary Disabled`,args:{type:`primary`,content:`Primary Disabled`,disabled:!0}},{name:`Secondary Disabled`,args:{type:`secondary`,content:`Secondary Disabled`,disabled:!0}},{name:`Danger Disabled`,args:{type:`danger`,content:`Danger Disabled`,disabled:!0}},{name:`Primary Loading`,args:{type:`primary`,content:`Loading`,inProgress:!0}},{name:`Secondary Loading`,args:{type:`secondary`,content:`Loading`,inProgress:!0}},{name:`Danger Loading`,args:{type:`danger`,content:`Loading`,inProgress:!0}},{name:`Loading With Icon`,args:{type:`primary`,content:`Loading with Icon`,inProgress:!0,icon:j}},{name:`Disabled + Loading`,args:{type:`primary`,content:`Disabled + Loading`,disabled:!0,inProgress:!0}}]},icons:{label:`Icons`,variants:[{name:`Primary With Icon`,args:{type:`primary`,content:`With Icon`,icon:j}},{name:`Secondary With Icon`,args:{type:`secondary`,content:`With Icon`,icon:C}},{name:`Danger With Icon`,args:{type:`danger`,content:`With Icon`,icon:k}},{name:`Link With Icon`,args:{type:`link`,content:`More details`,icon:D}},{name:`Icon Only`,args:{type:`primary`,icon:k,"aria-label":`Delete`}},{name:`Icon Only Secondary`,args:{type:`secondary`,icon:w,"aria-label":`Add`}},{name:`Icon Only With Tooltip`,args:{type:`primary`,icon:w,"aria-label":`Add build argument`,title:`Add build argument`}},{name:`Disabled Icon Only`,args:{type:`secondary`,icon:w,disabled:!0,"aria-label":`Add item`}}]},examples:{label:`Examples`,variants:[{name:`Build`,args:{type:`primary`,content:`Build`,icon:O}},{name:`Pull Image`,args:{type:`primary`,content:`Pull image`,icon:E}},{name:`Install`,args:{type:`primary`,content:`Install`,icon:T}},{name:`Prune`,args:{type:`primary`,content:`Prune`,icon:k,title:`Remove unused data`}},{name:`Cleanup`,args:{type:`danger`,content:`Cleanup / Purge data`,icon:de}},{name:`Clear All`,args:{type:`primary`,content:`Clear all`,icon:k}},{name:`Start`,args:{type:`primary`,content:`Start`,icon:C}},{name:`Stop`,args:{type:`primary`,content:`Stop`,icon:ce}},{name:`Add`,args:{type:`primary`,content:`Add`}},{name:`Cancel (Secondary)`,args:{type:`secondary`,content:`Cancel`}},{name:`Cancel (Link)`,args:{type:`link`,content:`Cancel`}},{name:`Skip`,args:{type:`secondary`,content:`Skip`}},{name:`Next`,args:{type:`primary`,content:`Next`}},{name:`Login`,args:{type:`primary`,content:`Login`}},{name:`Login Disabled`,args:{type:`primary`,content:`Login`,disabled:!0}},{name:`Login Loading`,args:{type:`primary`,content:`Login`,inProgress:!0}},{name:`Add Build Argument`,args:{type:`secondary`,icon:w,"aria-label":`Add build argument`}},{name:`Delete Build Argument`,args:{type:`secondary`,icon:le,"aria-label":`Delete build argument`}}]},patterns:{label:`Patterns`,variants:[{name:`Full Width`,args:{type:`primary`,content:`Full Width Button`,class:`w-full`}},{name:`Full Width With Icon`,args:{type:`primary`,content:`Build`,icon:O,class:`w-full`}},{name:`Custom Padding Small`,args:{type:`primary`,content:`Small Padding`,padding:`px-2 py-1`}},{name:`Custom Padding Large`,args:{type:`primary`,content:`Large Padding`,padding:`px-6 py-3`}},{name:`Custom Padding Compact`,args:{type:`primary`,content:`Update to v1.2.3`,padding:`px-3 py-0.5`,icon:T}},{name:`Loading Installation`,args:{type:`primary`,content:`Install`,icon:T,inProgress:!0}},{name:`Loading Pull`,args:{type:`primary`,content:`Pull image`,icon:E,inProgress:!0}},{name:`With Margin Right`,args:{type:`secondary`,content:`Cancel`,class:`mr-3`}},{name:`With Margin Left`,args:{type:`link`,content:`Link Button`,class:`ml-3`}},{name:`Auto Width`,args:{type:`primary`,content:`Auto Width`,class:`w-auto`}},{name:`Link With Underline`,args:{type:`link`,content:`Underlined Link`,class:`underline`}}]},edges:{label:`Edge Cases`,variants:[{name:`Very Long Text`,args:{type:`primary`,content:`This is a button with very long text that might wrap or overflow`}},{name:`Hidden Button`,args:{type:`primary`,content:`Hidden`,hidden:!0}},{name:`Custom Class`,args:{type:`primary`,content:`Custom Class`,class:`opacity-50 hover:opacity-100`}},{name:`Custom Aria Label`,args:{type:`danger`,content:`Delete`,icon:k,"aria-label":`Delete container web-1`}},{name:`All Props`,args:{type:`primary`,content:`Pull image`,icon:E,title:`Pull the image from its registry`,"aria-label":`Pull image quay.io/podman/hello`,class:`custom-class`}},{name:`Long Label (German)`,lang:`de`,args:{type:`primary`,content:`Alle nicht verwendeten Images entfernen`,icon:k}},{name:`Long Label (Finnish)`,lang:`fi`,args:{type:`secondary`,content:`Poista kaikki käyttämättömät levykuvat`}}]},toggles:{label:`Toggle Buttons`,variants:[{name:`Toggle Pressed`,args:{type:`primary`,content:`Notifications`,pressed:!0}},{name:`Toggle Unpressed`,args:{type:`primary`,content:`Notifications`,pressed:!1}},{name:`Toggle Secondary Pressed`,args:{type:`secondary`,content:`Filter`,pressed:!0}},{name:`Toggle Secondary Unpressed`,args:{type:`secondary`,content:`Filter`,pressed:!1}},{name:`Toggle Icon Only Pressed`,args:{type:`secondary`,icon:j,pressed:!0,"aria-label":`Mute notifications`}},{name:`Toggle Icon Only Unpressed`,args:{type:`secondary`,icon:j,pressed:!1,"aria-label":`Mute notifications`}},{name:`Toggle Disabled Pressed`,args:{type:`secondary`,content:`Filter`,pressed:!0,disabled:!0}}]},tabs:{label:`Tabs`,variants:[{name:`Tab Group Unselected`,args:{type:`tab`,content:`All`,selected:!1}},{name:`Tab Group Selected`,args:{type:`tab`,content:`Running`,selected:!0}},{name:`Tab Capitalize`,args:{type:`tab`,content:`completed`,class:`capitalize`,selected:!1}},{name:`Tab Capitalize Selected`,args:{type:`tab`,content:`completed`,class:`capitalize`,selected:!0}},{name:`Tab With Custom Class`,args:{type:`tab`,content:`Custom Tab`,class:`capitalize`,selected:!1}}]},rtl:{label:`Right-to-Left`,variants:[{name:`Primary With Icon`,lang:`ar`,args:{type:`primary`,content:`سحب الصورة`,icon:E}},{name:`Link With Icon`,lang:`ar`,args:{type:`link`,content:`مزيد من التفاصيل`,icon:D}},{name:`Loading With Icon`,lang:`ar`,args:{type:`primary`,content:`تثبيت`,icon:T,inProgress:!0}},{name:`Icon Only`,lang:`ar`,args:{type:`secondary`,icon:w,"aria-label":`إضافة`}}],dir:`rtl`}},R=S(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <div class="contents"><!></div></div>`),z=S(`<div class="bg-(--pd-content-card-bg) p-4"><div class="flex flex-col gap-4"><div class="text-sm font-semibold text-(--pd-content-header)"> </div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),B=S(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),V=S(`<!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),M.__docgen={data:[],name:`Button.stories.svelte`},H=se(M,F),U=[`Basic`,`States`,`Icons`,`Examples`,`Patterns`,`EdgeCases`,`ToggleButtons`,`Tabs`,`RTL`],W={...H.Basic,tags:[`svelte-csf-v5`]},G={...H.States,tags:[`svelte-csf-v5`]},K={...H.Icons,tags:[`svelte-csf-v5`]},q={...H.Examples,tags:[`svelte-csf-v5`]},J={...H.Patterns,tags:[`svelte-csf-v5`]},Y={...H.EdgeCases,tags:[`svelte-csf-v5`]},X={...H.ToggleButtons,tags:[`svelte-csf-v5`]},Z={...H.Tabs,tags:[`svelte-csf-v5`]},Q={...H.RTL,tags:[`svelte-csf-v5`]}})))()}$();export{W as Basic,Y as EdgeCases,q as Examples,K as Icons,J as Patterns,Q as RTL,G as States,Z as Tabs,X as ToggleButtons,U as __namedExportsOrder,F as default};