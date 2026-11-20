import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Bt as t,Et as n,Lt as r,Pt as i,Q as a,Rt as o,Vt as s,c,dt as l,gn as u,gt as d,ht as ee,in as f,m as p,mt as m,pn as h,rn as g,tt as _,wn as v,x as y,xn as b}from"./iframe-Cq28p4pS.js";import{a as x,i as S,n as C,r as w,t as te}from"./create-runtime-stories-gHDH37rk.js";import{r as T}from"./ErrorMessage-BK3RIbCb.js";import{t as E}from"./dist-CAm5Wknz.js";function D(e,t){f(t,!1),y();var n=W(),r=o(n);A(r,{name:`Basic`,args:{tip:`this is a custom tooltip`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var i=s(r,2);A(i,{name:`Placements`,args:{kind:`placements`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var a=s(i,2);A(a,{name:`Long Text`,args:{kind:`long`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var c=s(a,2);A(c,{name:`Snippet Content`,args:{kind:`snippet`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var l=s(c,2);A(l,{name:`i18n Wrapping`,args:{kind:`i18n`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}});var u=s(l,2);A(u,{name:`Container/Class`,args:{kind:`container`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'placements'}
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
{/if}`}}}),m(e,n),g()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{v(),x(),b(),E(),S(),c(),C(),O=(e,c)=>{let d=()=>u(c?.(),[]);var f=ee(),g=o(f),v=e=>{var o=I(),c=r(o),u=s(r(c),2);a(u,5,()=>j,e=>e.name,(e,a)=>{var o=F(),c=r(o),u=t(c,!0),d=s(c,2);T(d,p(()=>n(a).args,{children:(e,t)=>{var n=P();m(e,n)},$$slots:{default:!0}})),h(o),i(()=>l(u,n(a).name)),m(e,o)}),h(u),h(c),h(o),m(e,o)},y=e=>{var t=L(),n=r(t),i=s(r(n),2);T(i,{top:!0,tip:M,children:(e,t)=>{var n=P();m(e,n)},$$slots:{default:!0}}),h(n),h(t),m(e,t)},b=e=>{var t=z(),n=r(t),i=s(r(n),2);T(i,{tipSnippet:e=>{var t=R();m(e,t)},children:(e,t)=>{var n=P();m(e,n)},$$slots:{tipSnippet:!0,default:!0}}),h(n),h(t),m(e,t)},x=e=>{var o=V(),c=r(o),u=s(r(c),2);a(u,1,()=>N,e=>e.lang,(e,a)=>{var o=B(),c=r(o),u=t(c,!0),d=s(c,2);T(d,{top:!0,get tip(){return n(a).text},children:(e,t)=>{var n=P();m(e,n)},$$slots:{default:!0}}),h(o),i(()=>l(u,n(a).lang)),m(e,o)}),h(c),h(o),m(e,o)},S=e=>{var t=H(),n=r(t),i=s(r(n),2);T(i,{tip:`Top-right tooltip with container class applied`,topRight:!0,containerClass:`inline-flex`,class:`mb-[20px]`,children:(e,t)=>{var n=P();m(e,n)},$$slots:{default:!0}}),h(n),h(t),m(e,t)},C=e=>{var t=U(),n=r(t),i=s(r(n),2);T(i,p(d,{children:(e,t)=>{var n=P();m(e,n)},$$slots:{default:!0}})),h(n),h(t),m(e,t)};_(g,e=>{d().kind===`placements`?e(v):d().kind===`long`?e(y,1):d().kind===`snippet`?e(b,2):d().kind===`i18n`?e(x,3):d().kind===`container`?e(S,4):e(C,-1)}),m(e,f)},k={component:T,render:O,title:`Tooltip`,tags:[`autodocs`],argTypes:{kind:{table:{disable:!0}},tip:{control:`text`,description:`Text to show in the tooltip`,defaultValue:`This is a tooltip`},top:{control:`boolean`,description:`Flag the tooltip as being at the top`,defaultValue:!1},topLeft:{control:`boolean`,description:`Flag the tooltip as being at the top left`,defaultValue:!1},topRight:{control:`boolean`,description:`Flag the tooltip as being at the top right`,defaultValue:!1},right:{control:`boolean`,description:`Flag the tooltip as being at the right`,defaultValue:!1},bottom:{control:`boolean`,description:`Flag the tooltip as being at the bottom`,defaultValue:!1},bottomLeft:{control:`boolean`,description:`Flag the tooltip as being at the bottom left`,defaultValue:!1},bottomRight:{control:`boolean`,description:`Flag the tooltip as being at the bottom right`,defaultValue:!1},left:{control:`boolean`,description:`Flag the tooltip as being at the left`,defaultValue:!1}},parameters:{docs:{description:{component:`These are the stories for the \`Tooltip\` component.
Allow to display a tooltip at a given position (top, bottom, etc.).
Supports simple text tooltips and complex content using snippets.`}}}},{Story:A}=w(k),j=[{name:`Top`,args:{tip:`this is a custom top tooltip`,top:!0}},{name:`Top Left`,args:{tip:`this is a custom top left tooltip`,topLeft:!0}},{name:`Top Right`,args:{tip:`this is a custom top right tooltip`,topRight:!0}},{name:`Right`,args:{tip:`this is a custom right tooltip`,right:!0}},{name:`Bottom`,args:{tip:`this is a custom bottom tooltip`,bottom:!0}},{name:`Bottom Left`,args:{tip:`this is a custom bottom left tooltip`,bottomLeft:!0}},{name:`Bottom Right`,args:{tip:`this is a custom bottom right tooltip`,bottomRight:!0}},{name:`Left`,args:{tip:`this is a custom left tooltip`,left:!0}}],M=`This is a very long tooltip message that demonstrates how tooltips handle extended content. It can contain detailed information that users need to understand the context of the UI element.`,N=[{lang:`German`,text:`Dieser Container wurde erfolgreich gestartet und ist jetzt bereit, eingehende Netzwerkanfragen zu verarbeiten.`},{lang:`Finnish`,text:`Tämä säilö on käynnistetty onnistuneesti ja se on nyt valmis käsittelemään saapuvia verkkopyyntöjä.`},{lang:`English (long)`,text:`This container engine connection has been successfully established and is currently running with all configured network interfaces active.`}],P=d(`<span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--pd-tooltip-border) text-xs text-(--pd-tooltip-text)">i</span>`),F=d(`<div class="flex flex-col gap-2"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),I=d(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-4 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">Placements</div> <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div></div></div>`),L=d(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Long text tooltip example</span> <!></div></div>`),R=d(`<div class="flex flex-col gap-1 max-w-64"><div class="font-semibold">Custom snippet content</div> <div class="text-xs">Useful for richer tooltip layouts with multiple lines of information.</div></div>`),z=d(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Snippet tooltip content</span> <!></div></div>`),B=d(`<div class="flex flex-row items-center gap-2"><span class="w-32 text-xs text-(--pd-content-text)"> </span> <!></div>`),V=d(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="text-sm font-semibold text-(--pd-content-text)">i18n text wrapping</div> <!></div></div>`),H=d(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Container/class example</span> <!></div></div>`),U=d(`<div class="bg-(--pd-content-card-bg) p-8"><div class="flex flex-row items-center gap-2 text-(--pd-content-text)"><span>Move mouse over the icon to see the tooltip</span> <!></div></div>`),W=d(`<!> <!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`Tooltip.stories.svelte`},G=te(D,k),K=[`Basic`,`Placements`,`LongText`,`SnippetContent`,`I18nWrapping`,`ContainerClass`],q={...G.Basic,tags:[`svelte-csf-v5`]},J={...G.Placements,tags:[`svelte-csf-v5`]},Y={...G.LongText,tags:[`svelte-csf-v5`]},X={...G.SnippetContent,tags:[`svelte-csf-v5`]},Z={...G.I18nWrapping,tags:[`svelte-csf-v5`]},Q={...G.ContainerClass,tags:[`svelte-csf-v5`]}})))()}$();export{q as Basic,Q as ContainerClass,Z as I18nWrapping,Y as LongText,J as Placements,X as SnippetContent,K as __namedExportsOrder,k as default};