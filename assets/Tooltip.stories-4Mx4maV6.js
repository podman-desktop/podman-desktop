import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Dt as n,Nt as r,Sn as i,W as a,at as o,gt as s,jt as c,m as l,nn as u,ot as d,p as f,pn as p,q as m,rn as h,rt as g,s as _,st as v,un as y,yn as b}from"./iframe-CFlYIAlu.js";import{a as x,i as S,n as C,r as w,t as T}from"./create-runtime-stories-BOtXrIYg.js";import{r as E}from"./ErrorMessage-DccFyTLJ.js";import{t as D}from"./dist-C-oAynll.js";function O(e,t){h(t,!1),l();var n=G(),i=c(n);j(i,{name:`Basic`,args:{tip:`this is a custom tooltip`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var f=r(d,2);j(f,{name:`i18n Wrapping`,args:{kind:`i18n`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var p=r(f,2);j(p,{name:`Container/Class`,args:{kind:`container`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}}),o(e,n),u()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{i(),x(),b(),D(),S(),_(),C(),k=(e,i)=>{let l=()=>p(i?.(),[]);var u=d(),h=c(u),_=e=>{var i=L(),c=t(i),l=r(t(c),2);a(l,5,()=>M,e=>e.name,(e,i)=>{var a=I(),c=t(a),l=t(c,!0);y(c),E(r(c,2),f(()=>s(i).args,{children:(e,t)=>{o(e,F())},$$slots:{default:!0}})),y(a),n(()=>g(l,s(i).name)),o(e,a)}),y(l),y(c),y(i),o(e,i)},v=e=>{var n=R(),i=t(n);E(r(t(i),2),{top:!0,tip:N,children:(e,t)=>{o(e,F())},$$slots:{default:!0}}),y(i),y(n),o(e,n)},b=e=>{var n=B(),i=t(n);E(r(t(i),2),{tipSnippet:e=>{o(e,z())},children:(e,t)=>{o(e,F())},$$slots:{tipSnippet:!0,default:!0}}),y(i),y(n),o(e,n)},x=e=>{var i=H(),c=t(i);a(r(t(c),2),1,()=>P,e=>e.lang,(e,i)=>{var a=V(),c=t(a),l=t(c,!0);y(c),E(r(c,2),{top:!0,get tip(){return s(i).text},children:(e,t)=>{o(e,F())},$$slots:{default:!0}}),y(a),n(()=>g(l,s(i).lang)),o(e,a)}),y(c),y(i),o(e,i)},S=e=>{var n=U(),i=t(n);E(r(t(i),2),{tip:`Top-right tooltip with container class applied`,topRight:!0,containerClass:`inline-flex`,class:`mb-[20px]`,children:(e,t)=>{o(e,F())},$$slots:{default:!0}}),y(i),y(n),o(e,n)},C=e=>{var n=W(),i=t(n);E(r(t(i),2),f(l,{children:(e,t)=>{o(e,F())},$$slots:{default:!0}})),y(i),y(n),o(e,n)};m(h,e=>{l().kind===`placements`?e(_):l().kind===`long`?e(v,1):l().kind===`snippet`?e(b,2):l().kind===`i18n`?e(x,3):l().kind===`container`?e(S,4):e(C,-1)}),o(e,u)},A={component:E,render:k,title:`Tooltip`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}},tip:{control:`text`,description:`Text to show in the tooltip`,defaultValue:`This is a tooltip`},top:{control:`boolean`,description:`Flag the tooltip as being at the top`,defaultValue:!1},topLeft:{control:`boolean`,description:`Flag the tooltip as being at the top left`,defaultValue:!1},topRight:{control:`boolean`,description:`Flag the tooltip as being at the top right`,defaultValue:!1},right:{control:`boolean`,description:`Flag the tooltip as being at the right`,defaultValue:!1},bottom:{control:`boolean`,description:`Flag the tooltip as being at the bottom`,defaultValue:!1},bottomLeft:{control:`boolean`,description:`Flag the tooltip as being at the bottom left`,defaultValue:!1},bottomRight:{control:`boolean`,description:`Flag the tooltip as being at the bottom right`,defaultValue:!1},left:{control:`boolean`,description:`Flag the tooltip as being at the left`,defaultValue:!1}},parameters:{docs:{description:{component:`These are the stories for the \`Tooltip\` component.
Allow to display a tooltip at a given position (top, bottom, etc.).
Supports simple text tooltips and complex content using snippets.`}}}},{Story:j}=w(A),M=[{name:`Top`,args:{tip:`this is a custom top tooltip`,top:!0}},{name:`Top Left`,args:{tip:`this is a custom top left tooltip`,topLeft:!0}},{name:`Top Right`,args:{tip:`this is a custom top right tooltip`,topRight:!0}},{name:`Right`,args:{tip:`this is a custom right tooltip`,right:!0}},{name:`Bottom`,args:{tip:`this is a custom bottom tooltip`,bottom:!0}},{name:`Bottom Left`,args:{tip:`this is a custom bottom left tooltip`,bottomLeft:!0}},{name:`Bottom Right`,args:{tip:`this is a custom bottom right tooltip`,bottomRight:!0}},{name:`Left`,args:{tip:`this is a custom left tooltip`,left:!0}}],N=`This is a very long tooltip message that demonstrates how tooltips handle extended content. It can contain detailed information that users need to understand the context of the UI element.`,P=[{lang:`German`,text:`Dieser Container wurde erfolgreich gestartet und ist jetzt bereit, eingehende Netzwerkanfragen zu verarbeiten.`},{lang:`Finnish`,text:`Tämä säilö on käynnistetty onnistuneesti ja se on nyt valmis käsittelemään saapuvia verkkopyyntöjä.`},{lang:`English (long)`,text:`This container engine connection has been successfully established and is currently running with all configured network interfaces active.`}],F=v(`<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>`),I=v(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),L=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-4 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">Placements</div> <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),R=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Long text tooltip example</span> <!></div></div>`),z=v(`<div class="flex flex-col gap-1 max-w-64"><div class="font-semibold">Custom snippet content</div> <div class="text-xs">Useful for richer tooltip layouts with multiple lines of information.</div></div>`),B=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Snippet tooltip content</span> <!></div></div>`),V=v(`<div class="flex flex-row items-center gap-2"><span class="w-32 text-xs text-(--pd-content-text)"> </span> <!></div>`),H=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div> <!></div></div>`),U=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Container/class example</span> <!></div></div>`),W=v(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Move mouse over the icon to see the tooltip</span> <!></div></div>`),G=v(`<!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`Tooltip.stories.svelte`},K=T(O,A),q=[`Basic`,`Placements`,`LongText`,`SnippetContent`,`I18nWrapping`,`ContainerClass`],J={...K.Basic,tags:[`svelte-csf-v5`]},Y={...K.Placements,tags:[`svelte-csf-v5`]},X={...K.LongText,tags:[`svelte-csf-v5`]},Z={...K.SnippetContent,tags:[`svelte-csf-v5`]},Q={...K.I18nWrapping,tags:[`svelte-csf-v5`]},$={...K.ContainerClass,tags:[`svelte-csf-v5`]}}))();export{J as Basic,$ as ContainerClass,Q as I18nWrapping,X as LongText,Y as Placements,Z as SnippetContent,q as __namedExportsOrder,A as default};