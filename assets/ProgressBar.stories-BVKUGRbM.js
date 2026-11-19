import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Bt as t,Et as n,Lt as r,Pt as i,Q as a,Rt as o,Vt as s,c,dt as l,fn as u,gn as d,gt as f,ht as p,in as m,m as h,mt as g,pn as _,rn as v,tt as y,wn as b,x,xn as S}from"./iframe-pE4nVEtF.js";import{a as C,i as w,n as T,r as ee,t as E}from"./create-runtime-stories-eUPmPlxL.js";import{n as D,t as O}from"./ProgressBar-CiCN2_M2.js";function k(e,t){m(t,!1),x();var n=W(),r=o(n);M(r,{name:`Basic`,args:{progress:50},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var i=s(r,2);M(i,{name:`Progress Levels`,args:{kind:`levels`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var a=s(i,2);M(a,{name:`Dimensions`,args:{kind:`dimensions`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var c=s(a,2);M(c,{name:`Rounding`,args:{kind:`rounding`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var l=s(c,2);M(l,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var u=s(l,2);M(u,{name:`Contexts`,args:{kind:`contexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}}),g(e,n),v()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{b(),C(),S(),D(),w(),c(),T(),A=(e,c)=>{let f=()=>d(c?.(),[`_children`]);var m=p(),v=o(m),b=e=>{var o=R(),c=s(r(o),2);a(c,5,()=>N,e=>e.label,(e,a)=>{var o=L(),c=r(o),u=t(c,!0),d=s(c,2),f=r(d);O(f,{get progress(){return n(a).progress}}),_(d);var p=s(d,2),m=e=>{var r=I(),o=t(r,!0);i(()=>l(o,n(a).note)),g(e,r)};y(p,e=>{n(a).note&&e(m)}),_(o),i(()=>l(u,n(a).label)),g(e,o)}),_(c),_(o),g(e,o)},x=e=>{var o=B(),c=s(r(o),2);a(c,1,()=>F,e=>e.label,(e,a)=>{var o=z(),c=r(o),u=t(c,!0),d=s(c,2),f=r(d);O(f,{get width(){return n(a).width},get height(){return n(a).height},progress:65}),_(d);var p=s(d,2),m=e=>{var r=I(),o=t(r,!0);i(()=>l(o,n(a).note)),g(e,r)};y(p,e=>{n(a).note&&e(m)}),_(o),i(()=>l(u,n(a).label)),g(e,o)}),_(o),g(e,o)},S=e=>{var o=V(),c=s(r(o),2);a(c,5,()=>P,e=>e.label,(e,a)=>{var o=L(),c=r(o),u=t(c),d=s(c,2),f=r(d);O(f,{get progress(){return n(a).progress}}),_(d);var p=s(d,2),m=e=>{var r=I(),o=t(r,!0);i(()=>l(o,n(a).note)),g(e,r)};y(p,e=>{n(a).note&&e(m)}),_(o),i(()=>l(u,`progress=${n(a).label??``}`)),g(e,o)}),_(c),_(o),g(e,o)},C=e=>{var t=H(),n=s(r(t),2),i=r(n),a=s(r(i),2),o=r(a);O(o,{progress:50}),_(a),u(2),_(i);var c=s(i,2),l=s(r(c),2),d=r(l);O(d,{}),_(l),u(2),_(c);var f=s(c,2),p=s(r(f),2),m=r(p);O(m,{progress:75,"aria-label":`Downloading image`}),_(p),u(2),_(f),_(n),_(t),g(e,t)},w=e=>{var t=U(),n=r(t),i=s(r(n),2),a=s(r(i),2),o=r(a);O(o,{class:`items-center`,height:`h-1`,width:`w-20`,progress:42}),_(a),_(i),_(n);var c=s(n,2),l=s(r(c),2),u=s(r(l),2);O(u,{class:`items-center`,height:`h-1`,width:`w-20`,progress:42}),_(l),_(c);var d=s(c,2),f=s(r(d),2),p=s(r(f),2);O(p,{class:`items-center`,height:`h-1`,width:`w-20`}),_(f),_(d);var m=s(d,2),h=s(r(m),2),v=s(r(h),2);O(v,{progress:68}),_(h),_(m),_(t),g(e,t)},T=e=>{O(e,h(f))};y(v,e=>{f().kind===`levels`?e(b):f().kind===`dimensions`?e(x,1):f().kind===`rounding`?e(S,2):f().kind===`accessibility`?e(C,3):f().kind===`contexts`?e(w,4):e(T,-1)}),g(e,m)},j={component:O,render:A,title:`Progress/ProgressBar`,tags:[`autodocs`],argTypes:{progress:{control:{type:`number`,min:0,max:100,step:1},description:`Progress percentage (0-100). Undefined shows indeterminate animation.`},width:{control:`text`,description:`Tailwind width class for the bar`},height:{control:`text`,description:`Tailwind height class for the bar`},class:{control:`text`,description:`Additional CSS classes on the wrapper element`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `ProgressBar` component from `packages/renderer`.\n\nA linear progress indicator supporting determinate (0-100% with percentage text)\nand indeterminate (animated sweep for unknown duration) modes. Used in the Task Manager\ntable and the bottom Status Bar.\n\n**Accessibility**: The inner bar uses `role="progressbar"`. Additional ARIA attributes\n(e.g. `aria-label`) can be passed and are spread onto the wrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg` and\n`--pd-progressBar-in-progress-bg` from the color registry.'}}}},{Story:M}=ee(j),N=[{label:`Indeterminate`,progress:void 0,note:`progress=undefined`},{label:`0%`,progress:0},{label:`25%`,progress:25},{label:`50%`,progress:50},{label:`75%`,progress:75},{label:`100%`,progress:100}],P=[{label:`100/3`,progress:100/3,note:`Displays as 33%`},{label:`200/3`,progress:200/3,note:`Displays as 67%`},{label:`5/3`,progress:5/3,note:`Displays as 2%`},{label:`99.9`,progress:99.9,note:`Displays as 100%`}],F=[{label:`Default (w-36, h-2)`,width:`w-36`,height:`h-2`,note:`Component defaults`},{label:`Compact (w-20, h-1)`,width:`w-20`,height:`h-1`,note:`Used in Task Manager and Status Bar`},{label:`Wide (w-48, h-2)`,width:`w-48`,height:`h-2`},{label:`Full width (w-full, h-2)`,width:`w-full`,height:`h-2`}],I=f(`<code class="text-[10px] text-(--pd-content-text)"> </code>`),L=f(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>`),R=f(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>`),z=f(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>`),B=f(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.</div> <!></div>`),V=f(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Percentage text uses <code>Math.round()</code> for display.</div> <div class="grid grid-cols-2 gap-4"></div></div>`),H=f(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note: <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
        not on the inner element with <code>role="progressbar"</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code></div></div></div>`),U=f(`<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div> <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3"><div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div> <div class="flex items-center gap-x-2"><!></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)"><div class="text-sm">Installing extension from OCI image...</div> <!></div></div></div>`),W=f(`<!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`ProgressBar.stories.svelte`},G=E(k,j),K=[`Basic`,`ProgressLevels`,`Dimensions`,`Rounding`,`Accessibility`,`Contexts`],q={...G.Basic,tags:[`svelte-csf-v5`]},J={...G.ProgressLevels,tags:[`svelte-csf-v5`]},Y={...G.Dimensions,tags:[`svelte-csf-v5`]},X={...G.Rounding,tags:[`svelte-csf-v5`]},Z={...G.Accessibility,tags:[`svelte-csf-v5`]},Q={...G.Contexts,tags:[`svelte-csf-v5`]}})))()}$();export{Z as Accessibility,q as Basic,Q as Contexts,Y as Dimensions,J as ProgressLevels,X as Rounding,K as __namedExportsOrder,j as default};