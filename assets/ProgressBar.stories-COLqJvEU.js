import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,Dt as n,Ft as r,Ht as i,Rt as a,Sn as o,Tn as s,Vt as c,_n as l,_t as u,an as d,c as f,ft as p,gt as m,ht as h,in as g,m as _,mn as v,nt as y,pn as b,x,zt as S}from"./iframe-BVBodC_b.js";import{a as C,i as w,n as T,r as ee,t as E}from"./create-runtime-stories-PJ4vq3I2.js";import{n as D,t as O}from"./ProgressBar-BVnY9c_r.js";function k(e,t){d(t,!1),x();var n=W(),r=S(n);M(r,{name:`Basic`,args:{progress:50},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var a=i(r,2);M(a,{name:`Progress Levels`,args:{kind:`levels`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var o=i(a,2);M(o,{name:`Dimensions`,args:{kind:`dimensions`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var s=i(o,2);M(s,{name:`Rounding`,args:{kind:`rounding`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var c=i(s,2);M(c,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}});var l=i(c,2);M(l,{name:`Contexts`,args:{kind:`contexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
{/if}`}}}),h(e,n),g()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{s(),C(),o(),D(),w(),f(),T(),A=(e,o)=>{let s=()=>l(o?.(),[`_children`]);var u=m(),d=S(u),f=e=>{var o=R(),s=i(a(o),2);t(s,5,()=>N,e=>e.label,(e,t)=>{var o=L(),s=a(o),l=c(s,!0),u=i(s,2),d=a(u);O(d,{get progress(){return n(t).progress}}),v(u);var f=i(u,2),m=e=>{var i=I(),a=c(i,!0);r(()=>p(a,n(t).note)),h(e,i)};y(f,e=>{n(t).note&&e(m)}),v(o),r(()=>p(l,n(t).label)),h(e,o)}),v(s),v(o),h(e,o)},g=e=>{var o=B(),s=i(a(o),2);t(s,1,()=>F,e=>e.label,(e,t)=>{var o=z(),s=a(o),l=c(s,!0),u=i(s,2),d=a(u);O(d,{get width(){return n(t).width},get height(){return n(t).height},progress:65}),v(u);var f=i(u,2),m=e=>{var i=I(),a=c(i,!0);r(()=>p(a,n(t).note)),h(e,i)};y(f,e=>{n(t).note&&e(m)}),v(o),r(()=>p(l,n(t).label)),h(e,o)}),v(o),h(e,o)},x=e=>{var o=V(),s=i(a(o),2);t(s,5,()=>P,e=>e.label,(e,t)=>{var o=L(),s=a(o),l=c(s),u=i(s,2),d=a(u);O(d,{get progress(){return n(t).progress}}),v(u);var f=i(u,2),m=e=>{var i=I(),a=c(i,!0);r(()=>p(a,n(t).note)),h(e,i)};y(f,e=>{n(t).note&&e(m)}),v(o),r(()=>p(l,`progress=${n(t).label??``}`)),h(e,o)}),v(s),v(o),h(e,o)},C=e=>{var t=H(),n=i(a(t),2),r=a(n),o=i(a(r),2),s=a(o);O(s,{progress:50}),v(o),b(2),v(r);var c=i(r,2),l=i(a(c),2),u=a(l);O(u,{}),v(l),b(2),v(c);var d=i(c,2),f=i(a(d),2),p=a(f);O(p,{progress:75,"aria-label":`Downloading image`}),v(f),b(2),v(d),v(n),v(t),h(e,t)},w=e=>{var t=U(),n=a(t),r=i(a(n),2),o=i(a(r),2),s=a(o);O(s,{class:`items-center`,height:`h-1`,width:`w-20`,progress:42}),v(o),v(r),v(n);var c=i(n,2),l=i(a(c),2),u=i(a(l),2);O(u,{class:`items-center`,height:`h-1`,width:`w-20`,progress:42}),v(l),v(c);var d=i(c,2),f=i(a(d),2),p=i(a(f),2);O(p,{class:`items-center`,height:`h-1`,width:`w-20`}),v(f),v(d);var m=i(d,2),g=i(a(m),2),_=i(a(g),2);O(_,{progress:68}),v(g),v(m),v(t),h(e,t)},T=e=>{O(e,_(s))};y(d,e=>{s().kind===`levels`?e(f):s().kind===`dimensions`?e(g,1):s().kind===`rounding`?e(x,2):s().kind===`accessibility`?e(C,3):s().kind===`contexts`?e(w,4):e(T,-1)}),h(e,u)},j={component:O,render:A,title:`Progress/ProgressBar`,tags:[`autodocs`],argTypes:{progress:{control:{type:`number`,min:0,max:100,step:1},description:`Progress percentage (0-100). Undefined shows indeterminate animation.`},width:{control:`text`,description:`Tailwind width class for the bar`},height:{control:`text`,description:`Tailwind height class for the bar`},class:{control:`text`,description:`Additional CSS classes on the wrapper element`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `ProgressBar` component from `packages/renderer`.\n\nA linear progress indicator supporting determinate (0-100% with percentage text)\nand indeterminate (animated sweep for unknown duration) modes. Used in the Task Manager\ntable and the bottom Status Bar.\n\n**Accessibility**: The inner bar uses `role="progressbar"`. Additional ARIA attributes\n(e.g. `aria-label`) can be passed and are spread onto the wrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg` and\n`--pd-progressBar-in-progress-bg` from the color registry.'}}}},{Story:M}=ee(j),N=[{label:`Indeterminate`,progress:void 0,note:`progress=undefined`},{label:`0%`,progress:0},{label:`25%`,progress:25},{label:`50%`,progress:50},{label:`75%`,progress:75},{label:`100%`,progress:100}],P=[{label:`100/3`,progress:100/3,note:`Displays as 33%`},{label:`200/3`,progress:200/3,note:`Displays as 67%`},{label:`5/3`,progress:5/3,note:`Displays as 2%`},{label:`99.9`,progress:99.9,note:`Displays as 100%`}],F=[{label:`Default (w-36, h-2)`,width:`w-36`,height:`h-2`,note:`Component defaults`},{label:`Compact (w-20, h-1)`,width:`w-20`,height:`h-1`,note:`Used in Task Manager and Status Bar`},{label:`Wide (w-48, h-2)`,width:`w-48`,height:`h-2`},{label:`Full width (w-full, h-2)`,width:`w-full`,height:`h-2`}],I=u(`<code class="text-[10px] text-(--pd-content-text)"> </code>`),L=u(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>`),R=u(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>`),z=u(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>`),B=u(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.</div> <!></div>`),V=u(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Percentage text uses <code>Math.round()</code> for display.</div> <div class="grid grid-cols-2 gap-4"></div></div>`),H=u(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note: <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
        not on the inner element with <code>role="progressbar"</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code></div></div></div>`),U=u(`<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div> <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3"><div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div> <div class="flex items-center gap-x-2"><!></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)"><div class="text-sm">Installing extension from OCI image...</div> <!></div></div></div>`),W=u(`<!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`ProgressBar.stories.svelte`},G=E(k,j),K=[`Basic`,`ProgressLevels`,`Dimensions`,`Rounding`,`Accessibility`,`Contexts`],q={...G.Basic,tags:[`svelte-csf-v5`]},J={...G.ProgressLevels,tags:[`svelte-csf-v5`]},Y={...G.Dimensions,tags:[`svelte-csf-v5`]},X={...G.Rounding,tags:[`svelte-csf-v5`]},Z={...G.Accessibility,tags:[`svelte-csf-v5`]},Q={...G.Contexts,tags:[`svelte-csf-v5`]}})))()}$();export{Z as Accessibility,q as Basic,Q as Contexts,Y as Dimensions,J as ProgressLevels,X as Rounding,K as __namedExportsOrder,j as default};