import{k as F,a as k,o as M,c as o,p as U,f as s,b as d,d as I,h as A,j as a,r as i,s as y,l as j,g as E,i as O}from"./iframe-BzfG5bFM.js";import{c as q,i as z,d as D}from"./create-runtime-stories-BQlbvVWR.js";import{T as v}from"./ErrorMessage-mWzMawv4.js";import"./Button-WL0V_Qon.js";import"./Table-Ca82bXu_.js";import{e as G}from"./index-hZESuXxH.js";import"./LinearProgress-CMa7C23P.js";import"./EmptyScreen-BNNWo25p.js";import"./preload-helper-PPVm8Dsz.js";import"./Icon-DHufhCe9.js";import"./attributes-BYznJFYO.js";import"./StarIcon-DFXPMUKm.js";import"./ContainerIcon-BwTuGGBj.js";const H=(w,_)=>{let x=()=>A(_?.(),[]);var f=F(),u=k(f);{var h=e=>{var t=X(),n=a(t),p=d(a(n),2);G(p,5,()=>K,r=>r.name,(r,c)=>{var l=W(),g=a(l),P=a(g,!0);i(g);var V=d(g,2);v(V,y(()=>j(c).args,{children:(R,pt)=>{var B=Q();o(R,B)},$$slots:{default:!0}})),i(l),E(()=>O(P,j(c).name)),o(r,l)}),i(p),i(n),i(t),o(e,t)},T=e=>{var t=Z(),n=a(t),p=d(a(n),2);v(p,{top:!0,tip:N,children:(r,c)=>{var l=Y();o(r,l)},$$slots:{default:!0}}),i(n),i(t),o(e,t)},C=e=>{var t=nt(),n=a(t),p=d(a(n),2);v(p,{tipSnippet:c=>{var l=tt();o(c,l)},children:(c,l)=>{var g=et();o(c,g)},$$slots:{tipSnippet:!0,default:!0}}),i(n),i(t),o(e,t)},$=e=>{var t=it(),n=a(t),p=d(a(n),2);v(p,{tip:"Top-right tooltip with container class applied",topRight:!0,containerClass:"inline-flex",class:"mb-[20px]",children:(r,c)=>{var l=ot();o(r,l)},$$slots:{default:!0}}),i(n),i(t),o(e,t)},L=e=>{var t=lt(),n=a(t),p=d(a(n),2);v(p,y(x,{children:(r,c)=>{var l=st();o(r,l)},$$slots:{default:!0}})),i(n),i(t),o(e,t)};M(u,e=>{x().kind==="placements"?e(h):x().kind==="long"?e(T,1):x().kind==="snippet"?e(C,2):x().kind==="container"?e($,3):e(L,!1)})}o(w,f)},J={component:v,render:H,title:"Tooltip",tags:["autodocs"],argTypes:{kind:{table:{disable:!0}},tip:{control:"text",description:"Text to show in the tooltip",defaultValue:"This is a tooltip"},top:{control:"boolean",description:"Flag the tooltip as being at the top",defaultValue:!1},topLeft:{control:"boolean",description:"Flag the tooltip as being at the top left",defaultValue:!1},topRight:{control:"boolean",description:"Flag the tooltip as being at the top right",defaultValue:!1},right:{control:"boolean",description:"Flag the tooltip as being at the right",defaultValue:!1},bottom:{control:"boolean",description:"Flag the tooltip as being at the bottom",defaultValue:!1},bottomLeft:{control:"boolean",description:"Flag the tooltip as being at the bottom left",defaultValue:!1},bottomRight:{control:"boolean",description:"Flag the tooltip as being at the bottom right",defaultValue:!1},left:{control:"boolean",description:"Flag the tooltip as being at the left",defaultValue:!1}},parameters:{docs:{description:{component:"These are the stories for the `Tooltip` component.\nAllow to display a tooltip at a given position (top, bottom, etc.).\nSupports simple text tooltips and complex content using snippets."}}}},{Story:m}=D(),K=[{name:"Top",args:{tip:"this is a custom top tooltip",top:!0}},{name:"Top Left",args:{tip:"this is a custom top left tooltip",topLeft:!0}},{name:"Top Right",args:{tip:"this is a custom top right tooltip",topRight:!0}},{name:"Right",args:{tip:"this is a custom right tooltip",right:!0}},{name:"Bottom",args:{tip:"this is a custom bottom tooltip",bottom:!0}},{name:"Bottom Left",args:{tip:"this is a custom bottom left tooltip",bottomLeft:!0}},{name:"Bottom Right",args:{tip:"this is a custom bottom right tooltip",bottomRight:!0}},{name:"Left",args:{tip:"this is a custom left tooltip",left:!0}}],N="This is a very long tooltip message that demonstrates how tooltips handle extended content. It can contain detailed information that users need to understand the context of the UI element.";var Q=s('<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>'),W=s('<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>'),X=s('<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-4 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">Placements</div> <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>'),Y=s('<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>'),Z=s('<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Long text tooltip example</span> <!></div></div>'),tt=s('<div class="flex flex-col gap-1 max-w-64"><div class="font-semibold">Custom snippet content</div> <div class="text-xs">Useful for richer tooltip layouts with multiple lines of information.</div></div>'),et=s('<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>'),nt=s('<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Snippet tooltip content</span> <!></div></div>'),ot=s('<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>'),it=s('<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Container/class example</span> <!></div></div>'),st=s('<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>'),lt=s('<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Move mouse over the icon to see the tooltip</span> <!></div></div>'),at=s("<!> <!> <!> <!> <!>",1);function S(w,_){U(_,!1),z();var x=at(),f=k(x);m(f,{name:"Basic",args:{tip:"this is a custom tooltip"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var u=d(f,2);m(u,{name:"Placements",args:{kind:"placements"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var h=d(u,2);m(h,{name:"Long Text",args:{kind:"long"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var T=d(h,2);m(T,{name:"Snippet Content",args:{kind:"snippet"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var C=d(T,2);m(C,{name:"Container/Class",args:{kind:"container"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}}),o(w,x),I()}S.__docgen={data:[],name:"Tooltip.stories.svelte"};const b=q(S,J),_t=["Basic","Placements","LongText","SnippetContent","ContainerClass"],Ct={...b.Basic,tags:["svelte-csf-v5"]},yt={...b.Placements,tags:["svelte-csf-v5"]},jt={...b.LongText,tags:["svelte-csf-v5"]},kt={...b.SnippetContent,tags:["svelte-csf-v5"]},St={...b.ContainerClass,tags:["svelte-csf-v5"]};export{Ct as Basic,St as ContainerClass,jt as LongText,yt as Placements,kt as SnippetContent,_t as __namedExportsOrder,J as default};
