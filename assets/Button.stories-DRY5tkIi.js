import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Cn as n,Dt as r,Et as i,I as a,Kt as o,Nt as s,Ot as c,Pt as l,Rt as u,Z as d,_n as f,_t as p,c as m,fn as h,ft as g,gt as ee,ht as _,jt as v,m as y,nt as b,pn as te,wn as x,x as ne,xt as S}from"./iframe-DcPvy0aW.js";import{a as re,i as ie,n as ae,r as oe,t as se}from"./create-runtime-stories-CL2RYn2V.js";import{C as ce,D as C,L as le,N as w,O as T,_ as E,a as D,j as ue,k as O,l as de,o as k}from"./Icon-DzD1li--.js";import{n as fe,t as A}from"./Button-BW3wrMSg.js";import{r as pe,t as j}from"./free-regular-svg-icons-Bu4VtLvb.js";function M(e,t){te(t,!1),ne();var n=V(),r=v(n);I(r,{name:`Basic`,args:{kind:`basic`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var i=l(r,2);I(i,{name:`States`,args:{kind:`states`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var a=l(i,2);I(a,{name:`Icons`,args:{kind:`icons`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var o=l(a,2);I(o,{name:`Examples`,args:{kind:`examples`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var s=l(o,2);I(s,{name:`Patterns`,args:{kind:`patterns`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var c=l(s,2);I(c,{name:`Edge Cases`,args:{kind:`edges`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var u=l(c,2);I(u,{name:`Toggle Buttons`,args:{kind:`toggles`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var d=l(u,2);I(d,{name:`Tabs`,args:{kind:`tabs`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}});var f=l(d,2);I(f,{name:`RTL`,args:{kind:`rtl`},parameters:{__svelteCsf:{rawCode:`{#if args.kind && groupKinds[args.kind]}
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
{/if}`}}}),_(e,n),h()}var me,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{c(),r(),re(),i(),pe(),le(),fe(),ie(),m(),ae(),{fn:me}=__STORYBOOK_MODULE_TEST__,N=(e,r)=>{let i=()=>f(r?.(),[]);var c=ee(),p=v(c),m=e=>{var r=z(),c=t(r),f=t(c),p=s(f,!0),m=l(f,2);d(m,5,()=>L[i().kind].variants,e=>e.name,(e,r)=>{var i=R(),c=t(i),d=s(c,!0),f=l(c,2),p=t(f),m=e=>{A(e,y(()=>u(r).args,{children:(e,t)=>{n();var i=S();o(()=>g(i,u(r).args.content)),_(e,i)},$$slots:{default:!0}}))},h=e=>{A(e,y(()=>u(r).args))};b(p,e=>{u(r).args.content?e(m):e(h,-1)}),x(f),x(i),o(()=>{g(d,u(r).name),a(f,`lang`,u(r).lang)}),_(e,i)}),x(m),x(c),x(r),o(()=>{a(r,`dir`,L[i().kind].dir),g(p,L[i().kind].label),r.dir=r.dir}),_(e,r)},h=e=>{var r=B(),a=t(r);A(a,y(i,{children:(e,t)=>{n();var r=S();o(()=>g(r,i().content)),_(e,r)},$$slots:{default:!0}})),x(r),_(e,r)};b(p,e=>{i().kind&&L[i().kind]?e(m):e(h,-1)}),_(e,c)},P=me().mockName(`onclick`),F={component:A,render:N,title:`Button/Button`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}}},args:{onclick:P},parameters:{docs:{description:{component:`These are the stories for the \`Button\` component.
It's the default button we use throughout our application.

This collection showcases button types, states, and usage patterns
found in the Podman Desktop application.`}}}},{Story:I}=oe(F),L={basic:{label:`Basic Types`,variants:[{name:`Primary`,args:{type:`primary`,content:`Primary`}},{name:`Secondary`,args:{type:`secondary`,content:`Secondary`}},{name:`Danger`,args:{type:`danger`,content:`Danger`}},{name:`Link`,args:{type:`link`,content:`Link`}},{name:`Tab`,args:{type:`tab`,content:`Tab`,selected:!1}},{name:`Tab Selected`,args:{type:`tab`,content:`Selected Tab`,selected:!0}},{name:`Default (No Type)`,args:{content:`Default Button`}}]},states:{label:`States`,variants:[{name:`Primary Disabled`,args:{type:`primary`,content:`Primary Disabled`,disabled:!0}},{name:`Secondary Disabled`,args:{type:`secondary`,content:`Secondary Disabled`,disabled:!0}},{name:`Danger Disabled`,args:{type:`danger`,content:`Danger Disabled`,disabled:!0}},{name:`Primary Loading`,args:{type:`primary`,content:`Loading`,inProgress:!0}},{name:`Secondary Loading`,args:{type:`secondary`,content:`Loading`,inProgress:!0}},{name:`Danger Loading`,args:{type:`danger`,content:`Loading`,inProgress:!0}},{name:`Loading With Icon`,args:{type:`primary`,content:`Loading with Icon`,inProgress:!0,icon:j}},{name:`Disabled + Loading`,args:{type:`primary`,content:`Disabled + Loading`,disabled:!0,inProgress:!0}}]},icons:{label:`Icons`,variants:[{name:`Primary With Icon`,args:{type:`primary`,content:`With Icon`,icon:j}},{name:`Secondary With Icon`,args:{type:`secondary`,content:`With Icon`,icon:C}},{name:`Danger With Icon`,args:{type:`danger`,content:`With Icon`,icon:w}},{name:`Link With Icon`,args:{type:`link`,content:`More details`,icon:k}},{name:`Icon Only`,args:{type:`primary`,icon:w,"aria-label":`Delete`}},{name:`Icon Only Secondary`,args:{type:`secondary`,icon:T,"aria-label":`Add`}},{name:`Icon Only With Tooltip`,args:{type:`primary`,icon:T,"aria-label":`Add build argument`,title:`Add build argument`}},{name:`Disabled Icon Only`,args:{type:`secondary`,icon:T,disabled:!0,"aria-label":`Add item`}}]},examples:{label:`Examples`,variants:[{name:`Build`,args:{type:`primary`,content:`Build`,icon:E}},{name:`Pull Image`,args:{type:`primary`,content:`Pull image`,icon:D}},{name:`Install`,args:{type:`primary`,content:`Install`,icon:O}},{name:`Prune`,args:{type:`primary`,content:`Prune`,icon:w,title:`Remove unused data`}},{name:`Cleanup`,args:{type:`danger`,content:`Cleanup / Purge data`,icon:de}},{name:`Clear All`,args:{type:`primary`,content:`Clear all`,icon:w}},{name:`Start`,args:{type:`primary`,content:`Start`,icon:C}},{name:`Stop`,args:{type:`primary`,content:`Stop`,icon:ue}},{name:`Add`,args:{type:`primary`,content:`Add`}},{name:`Cancel (Secondary)`,args:{type:`secondary`,content:`Cancel`}},{name:`Cancel (Link)`,args:{type:`link`,content:`Cancel`}},{name:`Skip`,args:{type:`secondary`,content:`Skip`}},{name:`Next`,args:{type:`primary`,content:`Next`}},{name:`Login`,args:{type:`primary`,content:`Login`}},{name:`Login Disabled`,args:{type:`primary`,content:`Login`,disabled:!0}},{name:`Login Loading`,args:{type:`primary`,content:`Login`,inProgress:!0}},{name:`Add Build Argument`,args:{type:`secondary`,icon:T,"aria-label":`Add build argument`}},{name:`Delete Build Argument`,args:{type:`secondary`,icon:ce,"aria-label":`Delete build argument`}}]},patterns:{label:`Patterns`,variants:[{name:`Full Width`,args:{type:`primary`,content:`Full Width Button`,class:`w-full`}},{name:`Full Width With Icon`,args:{type:`primary`,content:`Build`,icon:E,class:`w-full`}},{name:`Custom Padding Small`,args:{type:`primary`,content:`Small Padding`,padding:`px-2 py-1`}},{name:`Custom Padding Large`,args:{type:`primary`,content:`Large Padding`,padding:`px-6 py-3`}},{name:`Custom Padding Compact`,args:{type:`primary`,content:`Update to v1.2.3`,padding:`px-3 py-0.5`,icon:O}},{name:`Loading Installation`,args:{type:`primary`,content:`Install`,icon:O,inProgress:!0}},{name:`Loading Pull`,args:{type:`primary`,content:`Pull image`,icon:D,inProgress:!0}},{name:`With Margin Right`,args:{type:`secondary`,content:`Cancel`,class:`mr-3`}},{name:`With Margin Left`,args:{type:`link`,content:`Link Button`,class:`ml-3`}},{name:`Auto Width`,args:{type:`primary`,content:`Auto Width`,class:`w-auto`}},{name:`Link With Underline`,args:{type:`link`,content:`Underlined Link`,class:`underline`}}]},edges:{label:`Edge Cases`,variants:[{name:`Very Long Text`,args:{type:`primary`,content:`This is a button with very long text that might wrap or overflow`}},{name:`Hidden Button`,args:{type:`primary`,content:`Hidden`,hidden:!0}},{name:`Custom Class`,args:{type:`primary`,content:`Custom Class`,class:`opacity-50 hover:opacity-100`}},{name:`Custom Aria Label`,args:{type:`danger`,content:`Delete`,icon:w,"aria-label":`Delete container web-1`}},{name:`All Props`,args:{type:`primary`,content:`Pull image`,icon:D,title:`Pull the image from its registry`,"aria-label":`Pull image quay.io/podman/hello`,class:`custom-class`}},{name:`Long Label (German)`,lang:`de`,args:{type:`primary`,content:`Alle nicht verwendeten Images entfernen`,icon:w}},{name:`Long Label (Finnish)`,lang:`fi`,args:{type:`secondary`,content:`Poista kaikki käyttämättömät levykuvat`}}]},toggles:{label:`Toggle Buttons`,variants:[{name:`Toggle Pressed`,args:{type:`primary`,content:`Notifications`,pressed:!0}},{name:`Toggle Unpressed`,args:{type:`primary`,content:`Notifications`,pressed:!1}},{name:`Toggle Secondary Pressed`,args:{type:`secondary`,content:`Filter`,pressed:!0}},{name:`Toggle Secondary Unpressed`,args:{type:`secondary`,content:`Filter`,pressed:!1}},{name:`Toggle Icon Only Pressed`,args:{type:`secondary`,icon:j,pressed:!0,"aria-label":`Mute notifications`}},{name:`Toggle Icon Only Unpressed`,args:{type:`secondary`,icon:j,pressed:!1,"aria-label":`Mute notifications`}},{name:`Toggle Disabled Pressed`,args:{type:`secondary`,content:`Filter`,pressed:!0,disabled:!0}}]},tabs:{label:`Tabs`,variants:[{name:`Tab Group Unselected`,args:{type:`tab`,content:`All`,selected:!1}},{name:`Tab Group Selected`,args:{type:`tab`,content:`Running`,selected:!0}},{name:`Tab Capitalize`,args:{type:`tab`,content:`completed`,class:`capitalize`,selected:!1}},{name:`Tab Capitalize Selected`,args:{type:`tab`,content:`completed`,class:`capitalize`,selected:!0}},{name:`Tab With Custom Class`,args:{type:`tab`,content:`Custom Tab`,class:`capitalize`,selected:!1}}]},rtl:{label:`Right-to-Left`,variants:[{name:`Primary With Icon`,lang:`ar`,args:{type:`primary`,content:`سحب الصورة`,icon:D}},{name:`Link With Icon`,lang:`ar`,args:{type:`link`,content:`مزيد من التفاصيل`,icon:k}},{name:`Loading With Icon`,lang:`ar`,args:{type:`primary`,content:`تثبيت`,icon:O,inProgress:!0}},{name:`Icon Only`,lang:`ar`,args:{type:`secondary`,icon:T,"aria-label":`إضافة`}}],dir:`rtl`}},R=p(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <div class="contents"><!></div></div>`),z=p(`<div class="bg-(--pd-content-card-bg) p-4"><div class="flex flex-col gap-4"><div class="text-sm font-semibold text-(--pd-content-header)"> </div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),B=p(`<div class="bg-(--pd-content-card-bg) p-4"><!></div>`),V=p(`<!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),M.__docgen={data:[],name:`Button.stories.svelte`},H=se(M,F),U=[`Basic`,`States`,`Icons`,`Examples`,`Patterns`,`EdgeCases`,`ToggleButtons`,`Tabs`,`RTL`],W={...H.Basic,tags:[`svelte-csf-v5`]},G={...H.States,tags:[`svelte-csf-v5`]},K={...H.Icons,tags:[`svelte-csf-v5`]},q={...H.Examples,tags:[`svelte-csf-v5`]},J={...H.Patterns,tags:[`svelte-csf-v5`]},Y={...H.EdgeCases,tags:[`svelte-csf-v5`]},X={...H.ToggleButtons,tags:[`svelte-csf-v5`]},Z={...H.Tabs,tags:[`svelte-csf-v5`]},Q={...H.RTL,tags:[`svelte-csf-v5`]}})))()}$();export{W as Basic,Y as EdgeCases,q as Examples,K as Icons,J as Patterns,Q as RTL,G as States,Z as Tabs,X as ToggleButtons,U as __namedExportsOrder,F as default};