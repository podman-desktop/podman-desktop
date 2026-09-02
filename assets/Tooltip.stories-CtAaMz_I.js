import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,Mt as r,Ot as i,Pt as a,Sn as o,_t as s,c,ct as l,dn as u,h as d,in as f,it as p,jt as m,m as h,mn as g,ot as _,rn as v,st as y,yn as b}from"./iframe-DAkJTS3X.js";import{a as x,i as S,n as C,r as w,t as ee}from"./create-runtime-stories-DSVceL7X.js";import{r as T}from"./ErrorMessage-BmN78v6Z.js";import{t as E}from"./dist-BbgQ6zJ4.js";function D(e,t){f(t,!1),d();var n=W(),i=r(n);A(i,{name:`Basic`,args:{tip:`this is a custom tooltip`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{:else if args.kind === 'i18n'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div>
      {#each i18nVariants as variant (variant.lang)}
        <div class="flex flex-row items-center gap-2">
          <span class="w-32 text-xs text-(--pd-content-text)">{variant.lang}</span>
          <Tooltip top tip={variant.text}>
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
              i
            </span>
          </Tooltip>
        </div>
      {/each}
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
{/if}`}}});var o=a(i,2);A(o,{name:`Placements`,args:{kind:`placements`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{:else if args.kind === 'i18n'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div>
      {#each i18nVariants as variant (variant.lang)}
        <div class="flex flex-row items-center gap-2">
          <span class="w-32 text-xs text-(--pd-content-text)">{variant.lang}</span>
          <Tooltip top tip={variant.text}>
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
              i
            </span>
          </Tooltip>
        </div>
      {/each}
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
{/if}`}}});var s=a(o,2);A(s,{name:`Long Text`,args:{kind:`long`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{:else if args.kind === 'i18n'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div>
      {#each i18nVariants as variant (variant.lang)}
        <div class="flex flex-row items-center gap-2">
          <span class="w-32 text-xs text-(--pd-content-text)">{variant.lang}</span>
          <Tooltip top tip={variant.text}>
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
              i
            </span>
          </Tooltip>
        </div>
      {/each}
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
{/if}`}}});var c=a(s,2);A(c,{name:`Snippet Content`,args:{kind:`snippet`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{:else if args.kind === 'i18n'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div>
      {#each i18nVariants as variant (variant.lang)}
        <div class="flex flex-row items-center gap-2">
          <span class="w-32 text-xs text-(--pd-content-text)">{variant.lang}</span>
          <Tooltip top tip={variant.text}>
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
              i
            </span>
          </Tooltip>
        </div>
      {/each}
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
{/if}`}}});var l=a(c,2);A(l,{name:`i18n Wrapping`,args:{kind:`i18n`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{:else if args.kind === 'i18n'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div>
      {#each i18nVariants as variant (variant.lang)}
        <div class="flex flex-row items-center gap-2">
          <span class="w-32 text-xs text-(--pd-content-text)">{variant.lang}</span>
          <Tooltip top tip={variant.text}>
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
              i
            </span>
          </Tooltip>
        </div>
      {/each}
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
{/if}`}}});var u=a(l,2);A(u,{name:`Container/Class`,args:{kind:`container`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{:else if args.kind === 'i18n'}
  <div class="bg-(--pd-content-card-bg) p-8">
    <div class="flex flex-col gap-6 text-(--pd-content-text)">
      <div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div>
      {#each i18nVariants as variant (variant.lang)}
        <div class="flex flex-row items-center gap-2">
          <span class="w-32 text-xs text-(--pd-content-text)">{variant.lang}</span>
          <Tooltip top tip={variant.text}>
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">
              i
            </span>
          </Tooltip>
        </div>
      {/each}
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
{/if}`}}}),_(e,n),v()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{o(),x(),b(),E(),S(),c(),C(),O=(e,o)=>{let c=()=>g(o?.(),[]);var l=y(),d=r(l),f=e=>{var n=I(),r=m(n),o=a(m(r),2);t(o,5,()=>j,e=>e.name,(e,t)=>{var n=F(),r=m(n),o=m(r,!0);u(r);var c=a(r,2);T(c,h(()=>s(t).args,{children:(e,t)=>{var n=P();_(e,n)},$$slots:{default:!0}})),u(n),i(()=>p(o,s(t).name)),_(e,n)}),u(o),u(r),u(n),_(e,n)},v=e=>{var t=L(),n=m(t),r=a(m(n),2);T(r,{top:!0,tip:M,children:(e,t)=>{var n=P();_(e,n)},$$slots:{default:!0}}),u(n),u(t),_(e,t)},b=e=>{var t=z(),n=m(t),r=a(m(n),2);T(r,{tipSnippet:e=>{var t=R();_(e,t)},children:(e,t)=>{var n=P();_(e,n)},$$slots:{tipSnippet:!0,default:!0}}),u(n),u(t),_(e,t)},x=e=>{var n=V(),r=m(n),o=a(m(r),2);t(o,1,()=>N,e=>e.lang,(e,t)=>{var n=B(),r=m(n),o=m(r,!0);u(r);var c=a(r,2);T(c,{top:!0,get tip(){return s(t).text},children:(e,t)=>{var n=P();_(e,n)},$$slots:{default:!0}}),u(n),i(()=>p(o,s(t).lang)),_(e,n)}),u(r),u(n),_(e,n)},S=e=>{var t=H(),n=m(t),r=a(m(n),2);T(r,{tip:`Top-right tooltip with container class applied`,topRight:!0,containerClass:`inline-flex`,class:`mb-[20px]`,children:(e,t)=>{var n=P();_(e,n)},$$slots:{default:!0}}),u(n),u(t),_(e,t)},C=e=>{var t=U(),n=m(t),r=a(m(n),2);T(r,h(c,{children:(e,t)=>{var n=P();_(e,n)},$$slots:{default:!0}})),u(n),u(t),_(e,t)};n(d,e=>{c().kind===`placements`?e(f):c().kind===`long`?e(v,1):c().kind===`snippet`?e(b,2):c().kind===`i18n`?e(x,3):c().kind===`container`?e(S,4):e(C,-1)}),_(e,l)},k={component:T,render:O,title:`Tooltip`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}},tip:{control:`text`,description:`Text to show in the tooltip`,defaultValue:`This is a tooltip`},top:{control:`boolean`,description:`Flag the tooltip as being at the top`,defaultValue:!1},topLeft:{control:`boolean`,description:`Flag the tooltip as being at the top left`,defaultValue:!1},topRight:{control:`boolean`,description:`Flag the tooltip as being at the top right`,defaultValue:!1},right:{control:`boolean`,description:`Flag the tooltip as being at the right`,defaultValue:!1},bottom:{control:`boolean`,description:`Flag the tooltip as being at the bottom`,defaultValue:!1},bottomLeft:{control:`boolean`,description:`Flag the tooltip as being at the bottom left`,defaultValue:!1},bottomRight:{control:`boolean`,description:`Flag the tooltip as being at the bottom right`,defaultValue:!1},left:{control:`boolean`,description:`Flag the tooltip as being at the left`,defaultValue:!1}},parameters:{docs:{description:{component:`These are the stories for the \`Tooltip\` component.
Allow to display a tooltip at a given position (top, bottom, etc.).
Supports simple text tooltips and complex content using snippets.`}}}},{Story:A}=w(k),j=[{name:`Top`,args:{tip:`this is a custom top tooltip`,top:!0}},{name:`Top Left`,args:{tip:`this is a custom top left tooltip`,topLeft:!0}},{name:`Top Right`,args:{tip:`this is a custom top right tooltip`,topRight:!0}},{name:`Right`,args:{tip:`this is a custom right tooltip`,right:!0}},{name:`Bottom`,args:{tip:`this is a custom bottom tooltip`,bottom:!0}},{name:`Bottom Left`,args:{tip:`this is a custom bottom left tooltip`,bottomLeft:!0}},{name:`Bottom Right`,args:{tip:`this is a custom bottom right tooltip`,bottomRight:!0}},{name:`Left`,args:{tip:`this is a custom left tooltip`,left:!0}}],M=`This is a very long tooltip message that demonstrates how tooltips handle extended content. It can contain detailed information that users need to understand the context of the UI element.`,N=[{lang:`German`,text:`Dieser Container wurde erfolgreich gestartet und ist jetzt bereit, eingehende Netzwerkanfragen zu verarbeiten.`},{lang:`Finnish`,text:`Tämä säilö on käynnistetty onnistuneesti ja se on nyt valmis käsittelemään saapuvia verkkopyyntöjä.`},{lang:`English (long)`,text:`This container engine connection has been successfully established and is currently running with all configured network interfaces active.`}],P=l(`<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>`),F=l(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),I=l(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-4 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">Placements</div> <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),L=l(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Long text tooltip example</span> <!></div></div>`),R=l(`<div class="flex flex-col gap-1 max-w-64"><div class="font-semibold">Custom snippet content</div> <div class="text-xs">Useful for richer tooltip layouts with multiple lines of information.</div></div>`),z=l(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Snippet tooltip content</span> <!></div></div>`),B=l(`<div class="flex flex-row items-center gap-2"><span class="w-32 text-xs text-(--pd-content-text)"> </span> <!></div>`),V=l(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div> <!></div></div>`),H=l(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Container/class example</span> <!></div></div>`),U=l(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Move mouse over the icon to see the tooltip</span> <!></div></div>`),W=l(`<!> <!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`Tooltip.stories.svelte`},G=ee(D,k),K=[`Basic`,`Placements`,`LongText`,`SnippetContent`,`I18nWrapping`,`ContainerClass`],q={...G.Basic,tags:[`svelte-csf-v5`]},J={...G.Placements,tags:[`svelte-csf-v5`]},Y={...G.LongText,tags:[`svelte-csf-v5`]},X={...G.SnippetContent,tags:[`svelte-csf-v5`]},Z={...G.I18nWrapping,tags:[`svelte-csf-v5`]},Q={...G.ContainerClass,tags:[`svelte-csf-v5`]}})))()}$();export{q as Basic,Q as ContainerClass,Z as I18nWrapping,Y as LongText,J as Placements,X as SnippetContent,K as __namedExportsOrder,k as default};