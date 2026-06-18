import{i as e}from"./preload-helper-xPQekRTU.js";import{At as t,Dt as n,Nt as r,Sn as i,W as a,at as o,gt as s,jt as c,m as l,nn as u,ot as d,p as f,pn as p,q as m,rn as h,rt as g,s as _,st as v,un as y,yn as b}from"./iframe-DcOQFD4R.js";import{a as x,i as S,n as C,r as w,t as T}from"./create-runtime-stories-CcEIEDit.js";import{r as E}from"./ErrorMessage-ZXD4Q4Xy.js";import{t as D}from"./dist-CSMb2sCr.js";function O(e,t){h(t,!1),l();var n=H(),i=c(n);j(i,{name:`Basic`,args:{tip:`this is a custom tooltip`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-4 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">Placements</div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each placementVariants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Tooltip {...variant.args}>
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
                i
              </span>
            </Tooltip>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if args.kind === 'long'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Long text tooltip example</span>
      <Tooltip top tip={longText}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'snippet'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Snippet tooltip content</span>
      <Tooltip>
        {#snippet tipSnippet()}
          <div class="flex flex-col gap-1 max-w-64">
            <div class="font-semibold">Custom snippet content</div>
            <div class="text-xs">
              Useful for richer tooltip layouts with multiple lines of information.
            </div>
          </div>
        {/snippet}
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'container'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Container/class example</span>
      <Tooltip tip="Top-right tooltip with container class applied" topRight containerClass="inline-flex" class="mb-[20px]">
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Move mouse over the icon to see the tooltip</span>
      <Tooltip {...args}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{/if}`}}});var a=r(i,2);j(a,{name:`Placements`,args:{kind:`placements`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-4 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">Placements</div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each placementVariants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Tooltip {...variant.args}>
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
                i
              </span>
            </Tooltip>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if args.kind === 'long'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Long text tooltip example</span>
      <Tooltip top tip={longText}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'snippet'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Snippet tooltip content</span>
      <Tooltip>
        {#snippet tipSnippet()}
          <div class="flex flex-col gap-1 max-w-64">
            <div class="font-semibold">Custom snippet content</div>
            <div class="text-xs">
              Useful for richer tooltip layouts with multiple lines of information.
            </div>
          </div>
        {/snippet}
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'container'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Container/class example</span>
      <Tooltip tip="Top-right tooltip with container class applied" topRight containerClass="inline-flex" class="mb-[20px]">
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Move mouse over the icon to see the tooltip</span>
      <Tooltip {...args}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{/if}`}}});var s=r(a,2);j(s,{name:`Long Text`,args:{kind:`long`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-4 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">Placements</div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each placementVariants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Tooltip {...variant.args}>
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
                i
              </span>
            </Tooltip>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if args.kind === 'long'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Long text tooltip example</span>
      <Tooltip top tip={longText}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'snippet'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Snippet tooltip content</span>
      <Tooltip>
        {#snippet tipSnippet()}
          <div class="flex flex-col gap-1 max-w-64">
            <div class="font-semibold">Custom snippet content</div>
            <div class="text-xs">
              Useful for richer tooltip layouts with multiple lines of information.
            </div>
          </div>
        {/snippet}
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'container'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Container/class example</span>
      <Tooltip tip="Top-right tooltip with container class applied" topRight containerClass="inline-flex" class="mb-[20px]">
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Move mouse over the icon to see the tooltip</span>
      <Tooltip {...args}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{/if}`}}});var d=r(s,2);j(d,{name:`Snippet Content`,args:{kind:`snippet`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-4 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">Placements</div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each placementVariants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Tooltip {...variant.args}>
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
                i
              </span>
            </Tooltip>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if args.kind === 'long'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Long text tooltip example</span>
      <Tooltip top tip={longText}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'snippet'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Snippet tooltip content</span>
      <Tooltip>
        {#snippet tipSnippet()}
          <div class="flex flex-col gap-1 max-w-64">
            <div class="font-semibold">Custom snippet content</div>
            <div class="text-xs">
              Useful for richer tooltip layouts with multiple lines of information.
            </div>
          </div>
        {/snippet}
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'container'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Container/class example</span>
      <Tooltip tip="Top-right tooltip with container class applied" topRight containerClass="inline-flex" class="mb-[20px]">
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Move mouse over the icon to see the tooltip</span>
      <Tooltip {...args}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{/if}`}}}),j(r(d,2),{name:`Container/Class`,args:{kind:`container`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-4 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">Placements</div>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each placementVariants as variant (variant.name)}
          <div class="flex flex-col gap-2">
            <div class="text-xs text-(--pd-content-text)">{variant.name}</div>
            <Tooltip {...variant.args}>
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
                i
              </span>
            </Tooltip>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if args.kind === 'long'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Long text tooltip example</span>
      <Tooltip top tip={longText}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'snippet'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Snippet tooltip content</span>
      <Tooltip>
        {#snippet tipSnippet()}
          <div class="flex flex-col gap-1 max-w-64">
            <div class="font-semibold">Custom snippet content</div>
            <div class="text-xs">
              Useful for richer tooltip layouts with multiple lines of information.
            </div>
          </div>
        {/snippet}
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else if args.kind === 'container'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Container/class example</span>
      <Tooltip tip="Top-right tooltip with container class applied" topRight containerClass="inline-flex" class="mb-[20px]">
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{:else}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-row items-center gap-2 text-(--pd-content-text)">
      <span>Move mouse over the icon to see the tooltip</span>
      <Tooltip {...args}>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
          i
        </span>
      </Tooltip>
    </div>
  </div>
{/if}`}}}),o(e,n),u()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;e((()=>{i(),x(),b(),D(),S(),_(),C(),k=(e,i)=>{let l=()=>p(i?.(),[]);var u=d(),h=c(u),_=e=>{var i=I(),c=t(i),l=r(t(c),2);a(l,5,()=>M,e=>e.name,(e,i)=>{var a=F(),c=t(a),l=t(c,!0);y(c),E(r(c,2),f(()=>s(i).args,{children:(e,t)=>{o(e,P())},$$slots:{default:!0}})),y(a),n(()=>g(l,s(i).name)),o(e,a)}),y(l),y(c),y(i),o(e,i)},v=e=>{var n=L(),i=t(n);E(r(t(i),2),{top:!0,tip:N,children:(e,t)=>{o(e,P())},$$slots:{default:!0}}),y(i),y(n),o(e,n)},b=e=>{var n=z(),i=t(n);E(r(t(i),2),{tipSnippet:e=>{o(e,R())},children:(e,t)=>{o(e,P())},$$slots:{tipSnippet:!0,default:!0}}),y(i),y(n),o(e,n)},x=e=>{var n=B(),i=t(n);E(r(t(i),2),{tip:`Top-right tooltip with container class applied`,topRight:!0,containerClass:`inline-flex`,class:`mb-[20px]`,children:(e,t)=>{o(e,P())},$$slots:{default:!0}}),y(i),y(n),o(e,n)},S=e=>{var n=V(),i=t(n);E(r(t(i),2),f(l,{children:(e,t)=>{o(e,P())},$$slots:{default:!0}})),y(i),y(n),o(e,n)};m(h,e=>{l().kind===`placements`?e(_):l().kind===`long`?e(v,1):l().kind===`snippet`?e(b,2):l().kind===`container`?e(x,3):e(S,-1)}),o(e,u)},A={component:E,render:k,title:`Tooltip`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}},tip:{control:`text`,description:`Text to show in the tooltip`,defaultValue:`This is a tooltip`},top:{control:`boolean`,description:`Flag the tooltip as being at the top`,defaultValue:!1},topLeft:{control:`boolean`,description:`Flag the tooltip as being at the top left`,defaultValue:!1},topRight:{control:`boolean`,description:`Flag the tooltip as being at the top right`,defaultValue:!1},right:{control:`boolean`,description:`Flag the tooltip as being at the right`,defaultValue:!1},bottom:{control:`boolean`,description:`Flag the tooltip as being at the bottom`,defaultValue:!1},bottomLeft:{control:`boolean`,description:`Flag the tooltip as being at the bottom left`,defaultValue:!1},bottomRight:{control:`boolean`,description:`Flag the tooltip as being at the bottom right`,defaultValue:!1},left:{control:`boolean`,description:`Flag the tooltip as being at the left`,defaultValue:!1}},parameters:{docs:{description:{component:`These are the stories for the \`Tooltip\` component.
Allow to display a tooltip at a given position (top, bottom, etc.).
Supports simple text tooltips and complex content using snippets.`}}}},{Story:j}=w(A),M=[{name:`Top`,args:{tip:`this is a custom top tooltip`,top:!0}},{name:`Top Left`,args:{tip:`this is a custom top left tooltip`,topLeft:!0}},{name:`Top Right`,args:{tip:`this is a custom top right tooltip`,topRight:!0}},{name:`Right`,args:{tip:`this is a custom right tooltip`,right:!0}},{name:`Bottom`,args:{tip:`this is a custom bottom tooltip`,bottom:!0}},{name:`Bottom Left`,args:{tip:`this is a custom bottom left tooltip`,bottomLeft:!0}},{name:`Bottom Right`,args:{tip:`this is a custom bottom right tooltip`,bottomRight:!0}},{name:`Left`,args:{tip:`this is a custom left tooltip`,left:!0}}],N=`This is a very long tooltip message that demonstrates how tooltips handle extended content. It can contain detailed information that users need to understand the context of the UI element.`,P=v(`<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>`),F=v(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),I=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-4 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">Placements</div> <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),L=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Long text tooltip example</span> <!></div></div>`),R=v(`<div class="flex flex-col gap-1 max-w-64"><div class="font-semibold">Custom snippet content</div> <div class="text-xs">Useful for richer tooltip layouts with multiple lines of information.</div></div>`),z=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Snippet tooltip content</span> <!></div></div>`),B=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Container/class example</span> <!></div></div>`),V=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Move mouse over the icon to see the tooltip</span> <!></div></div>`),H=v(`<!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`Tooltip.stories.svelte`},U=T(O,A),W=[`Basic`,`Placements`,`LongText`,`SnippetContent`,`ContainerClass`],G={...U.Basic,tags:[`svelte-csf-v5`]},K={...U.Placements,tags:[`svelte-csf-v5`]},q={...U.LongText,tags:[`svelte-csf-v5`]},J={...U.SnippetContent,tags:[`svelte-csf-v5`]},Y={...U.ContainerClass,tags:[`svelte-csf-v5`]}}))();export{G as Basic,Y as ContainerClass,q as LongText,K as Placements,J as SnippetContent,W as __namedExportsOrder,A as default};