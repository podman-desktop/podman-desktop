import{i as e}from"./preload-helper-xPQekRTU.js";import{At as t,Dt as n,Nt as r,Sn as i,W as a,at as o,gt as s,jt as c,ln as l,m as u,nn as d,ot as f,p,pn as m,q as h,rn as g,rt as _,s as v,st as y,un as b,yn as x}from"./iframe-By09XlDr.js";import{a as S,i as C,n as w,r as T,t as E}from"./create-runtime-stories-B-3OhJ9A.js";import{n as D,t as O}from"./ProgressBar-CqTpr_Et.js";function k(e,t){g(t,!1),u();var n=W(),i=c(n);M(i,{name:`Basic`,args:{progress:50},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var a=r(i,2);M(a,{name:`Progress Levels`,args:{kind:`levels`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var s=r(a,2);M(s,{name:`Dimensions`,args:{kind:`dimensions`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var l=r(s,2);M(l,{name:`Rounding`,args:{kind:`rounding`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var f=r(l,2);M(f,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}}),M(r(f,2),{name:`Contexts`,args:{kind:`contexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}}),o(e,n),d()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;e((()=>{i(),S(),x(),D(),C(),v(),w(),A=(e,i)=>{let u=()=>m(i?.(),[`_children`]);var d=f(),g=c(d),v=e=>{var i=R(),c=r(t(i),2);a(c,5,()=>N,e=>e.label,(e,i)=>{var a=L(),c=t(a),l=t(c,!0);b(c);var u=r(c,2);O(t(u),{get progress(){return s(i).progress}}),b(u);var d=r(u,2),f=e=>{var r=I(),a=t(r,!0);b(r),n(()=>_(a,s(i).note)),o(e,r)};h(d,e=>{s(i).note&&e(f)}),b(a),n(()=>_(l,s(i).label)),o(e,a)}),b(c),b(i),o(e,i)},y=e=>{var i=B();a(r(t(i),2),1,()=>F,e=>e.label,(e,i)=>{var a=z(),c=t(a),l=t(c,!0);b(c);var u=r(c,2);O(t(u),{get width(){return s(i).width},get height(){return s(i).height},progress:65}),b(u);var d=r(u,2),f=e=>{var r=I(),a=t(r,!0);b(r),n(()=>_(a,s(i).note)),o(e,r)};h(d,e=>{s(i).note&&e(f)}),b(a),n(()=>_(l,s(i).label)),o(e,a)}),b(i),o(e,i)},x=e=>{var i=V(),c=r(t(i),2);a(c,5,()=>P,e=>e.label,(e,i)=>{var a=L(),c=t(a),l=t(c);b(c);var u=r(c,2);O(t(u),{get progress(){return s(i).progress}}),b(u);var d=r(u,2),f=e=>{var r=I(),a=t(r,!0);b(r),n(()=>_(a,s(i).note)),o(e,r)};h(d,e=>{s(i).note&&e(f)}),b(a),n(()=>_(l,`progress=${s(i).label??``}`)),o(e,a)}),b(c),b(i),o(e,i)},S=e=>{var n=H(),i=r(t(n),2),a=t(i),s=r(t(a),2);O(t(s),{progress:50}),b(s),l(2),b(a);var c=r(a,2),u=r(t(c),2);O(t(u),{}),b(u),l(2),b(c);var d=r(c,2),f=r(t(d),2);O(t(f),{progress:75,"aria-label":`Downloading image`}),b(f),l(2),b(d),b(i),b(n),o(e,n)},C=e=>{var n=U(),i=t(n),a=r(t(i),2),s=r(t(a),2);O(t(s),{class:`items-center`,height:`h-1`,width:`w-20`,progress:42}),b(s),b(a),b(i);var c=r(i,2),l=r(t(c),2);O(r(t(l),2),{class:`items-center`,height:`h-1`,width:`w-20`,progress:42}),b(l),b(c);var u=r(c,2),d=r(t(u),2);O(r(t(d),2),{class:`items-center`,height:`h-1`,width:`w-20`}),b(d),b(u);var f=r(u,2),p=r(t(f),2);O(r(t(p),2),{progress:68}),b(p),b(f),b(n),o(e,n)},w=e=>{O(e,p(u))};h(g,e=>{u().kind===`levels`?e(v):u().kind===`dimensions`?e(y,1):u().kind===`rounding`?e(x,2):u().kind===`accessibility`?e(S,3):u().kind===`contexts`?e(C,4):e(w,-1)}),o(e,d)},j={component:O,render:A,title:`Progress/ProgressBar`,tags:[`autodocs`],argTypes:{progress:{control:{type:`number`,min:0,max:100,step:1},description:`Progress percentage (0-100). Undefined shows indeterminate animation.`},width:{control:`text`,description:`Tailwind width class for the bar`},height:{control:`text`,description:`Tailwind height class for the bar`},class:{control:`text`,description:`Additional CSS classes on the wrapper element`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `ProgressBar` component from `packages/renderer`.\n\nA linear progress indicator supporting determinate (0-100% with percentage text)\nand indeterminate (animated sweep for unknown duration) modes. Used in the Task Manager\ntable and the bottom Status Bar.\n\n**Accessibility**: The inner bar uses `role="progressbar"`. Additional ARIA attributes\n(e.g. `aria-label`) can be passed and are spread onto the wrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg` and\n`--pd-progressBar-in-progress-bg` from the color registry.'}}}},{Story:M}=T(j),N=[{label:`Indeterminate`,progress:void 0,note:`progress=undefined`},{label:`0%`,progress:0},{label:`25%`,progress:25},{label:`50%`,progress:50},{label:`75%`,progress:75},{label:`100%`,progress:100}],P=[{label:`100/3`,progress:100/3,note:`Displays as 33%`},{label:`200/3`,progress:200/3,note:`Displays as 67%`},{label:`5/3`,progress:5/3,note:`Displays as 2%`},{label:`99.9`,progress:99.9,note:`Displays as 100%`}],F=[{label:`Default (w-36, h-2)`,width:`w-36`,height:`h-2`,note:`Component defaults`},{label:`Compact (w-20, h-1)`,width:`w-20`,height:`h-1`,note:`Used in Task Manager and Status Bar`},{label:`Wide (w-48, h-2)`,width:`w-48`,height:`h-2`},{label:`Full width (w-full, h-2)`,width:`w-full`,height:`h-2`}],I=y(`<code class="text-[10px] text-(--pd-content-text)"> </code>`),L=y(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>`),R=y(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>`),z=y(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>`),B=y(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.</div> <!></div>`),V=y(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Percentage text uses <code>Math.round()</code> for display.</div> <div class="grid grid-cols-2 gap-4"></div></div>`),H=y(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note: <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
        not on the inner element with <code>role="progressbar"</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code></div></div></div>`),U=y(`<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div> <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3"><div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div> <div class="flex items-center gap-x-2"><!></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)"><div class="text-sm">Installing extension from OCI image...</div> <!></div></div></div>`),W=y(`<!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`ProgressBar.stories.svelte`},G=E(k,j),K=[`Basic`,`ProgressLevels`,`Dimensions`,`Rounding`,`Accessibility`,`Contexts`],q={...G.Basic,tags:[`svelte-csf-v5`]},J={...G.ProgressLevels,tags:[`svelte-csf-v5`]},Y={...G.Dimensions,tags:[`svelte-csf-v5`]},X={...G.Rounding,tags:[`svelte-csf-v5`]},Z={...G.Accessibility,tags:[`svelte-csf-v5`]},Q={...G.Contexts,tags:[`svelte-csf-v5`]}}))();export{Z as Accessibility,q as Basic,Q as Contexts,Y as Dimensions,J as ProgressLevels,X as Rounding,K as __namedExportsOrder,j as default};