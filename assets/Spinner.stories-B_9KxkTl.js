import{i as e}from"./preload-helper-xPQekRTU.js";import{At as t,Dt as n,F as r,Nt as i,Sn as a,W as o,at as s,gt as c,jt as l,ln as u,m as d,nn as f,ot as p,p as m,pn as h,q as g,rn as _,rt as v,s as y,st as b,un as x,ut as S,yn as C}from"./iframe-By09XlDr.js";import{a as w,i as T,n as E,r as D,t as O}from"./create-runtime-stories-B-3OhJ9A.js";import{i as k,r as A,t as j}from"./Button-CDTJQvbw.js";import{p as M,t as N}from"./dist-DGjhThcP.js";function P(e,t){_(t,!1),d();var n=G(),r=l(n);L(r,{name:`Basic`,parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Sizes used across the app (values preserved exactly).
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {#each sizeVariants as variant (variant.label)}
        <div class="flex flex-col items-center gap-2 p-3">
          <div class="text-xs text-(--pd-content-text)">{variant.label}</div>

          {#if variant.size}
            <Spinner size={variant.size} />
          {:else}
            <Spinner />
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each accessibilityVariants as variant (variant.heading)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.heading}</div>

          <div class="flex items-center justify-center py-2 {variant.containerClass ?? ''}">
            {#if variant.label}
              <Spinner label={variant.label} />
            {:else}
              <Spinner />
            {/if}
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.aria}</code>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div>
      <Button inProgress={true}>Creating</Button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div>

      <div class="flex flex-row items-center gap-3">
        <StatusIcon status="DELETING" />
        <StatusIcon status="UPDATING" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div>

      <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base">
        <div class="mr-1 text-(--pd-state-info)">
          <Spinner size="1.5em" />
        </div>

        <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="1em" />
        <div>Checking prerequisites</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div>

      <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1">
        <div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div>
        <Spinner size="1em" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="12px" />
        <div>Checking context health</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div>

      <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline">
        <div class="mr-2">
          <Spinner size="16px" />
        </div>
        Run command
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
            <div class="flex flex-row items-center h-fit">
              <div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div>
              <span class="text-(--pd-status-running)">Running</span>
              : Docker Desktop
            </div>
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-terminated)">Stopping</span>
              : Lima VM
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <Spinner {...args} />
{/if}`}}});var a=i(r,2);L(a,{name:`Sizes`,args:{kind:`sizes`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Sizes used across the app (values preserved exactly).
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {#each sizeVariants as variant (variant.label)}
        <div class="flex flex-col items-center gap-2 p-3">
          <div class="text-xs text-(--pd-content-text)">{variant.label}</div>

          {#if variant.size}
            <Spinner size={variant.size} />
          {:else}
            <Spinner />
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each accessibilityVariants as variant (variant.heading)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.heading}</div>

          <div class="flex items-center justify-center py-2 {variant.containerClass ?? ''}">
            {#if variant.label}
              <Spinner label={variant.label} />
            {:else}
              <Spinner />
            {/if}
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.aria}</code>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div>
      <Button inProgress={true}>Creating</Button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div>

      <div class="flex flex-row items-center gap-3">
        <StatusIcon status="DELETING" />
        <StatusIcon status="UPDATING" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div>

      <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base">
        <div class="mr-1 text-(--pd-state-info)">
          <Spinner size="1.5em" />
        </div>

        <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="1em" />
        <div>Checking prerequisites</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div>

      <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1">
        <div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div>
        <Spinner size="1em" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="12px" />
        <div>Checking context health</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div>

      <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline">
        <div class="mr-2">
          <Spinner size="16px" />
        </div>
        Run command
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
            <div class="flex flex-row items-center h-fit">
              <div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div>
              <span class="text-(--pd-status-running)">Running</span>
              : Docker Desktop
            </div>
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-terminated)">Stopping</span>
              : Lima VM
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <Spinner {...args} />
{/if}`}}});var o=i(a,2);L(o,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Sizes used across the app (values preserved exactly).
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {#each sizeVariants as variant (variant.label)}
        <div class="flex flex-col items-center gap-2 p-3">
          <div class="text-xs text-(--pd-content-text)">{variant.label}</div>

          {#if variant.size}
            <Spinner size={variant.size} />
          {:else}
            <Spinner />
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each accessibilityVariants as variant (variant.heading)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.heading}</div>

          <div class="flex items-center justify-center py-2 {variant.containerClass ?? ''}">
            {#if variant.label}
              <Spinner label={variant.label} />
            {:else}
              <Spinner />
            {/if}
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.aria}</code>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div>
      <Button inProgress={true}>Creating</Button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div>

      <div class="flex flex-row items-center gap-3">
        <StatusIcon status="DELETING" />
        <StatusIcon status="UPDATING" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div>

      <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base">
        <div class="mr-1 text-(--pd-state-info)">
          <Spinner size="1.5em" />
        </div>

        <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="1em" />
        <div>Checking prerequisites</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div>

      <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1">
        <div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div>
        <Spinner size="1em" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="12px" />
        <div>Checking context health</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div>

      <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline">
        <div class="mr-2">
          <Spinner size="16px" />
        </div>
        Run command
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
            <div class="flex flex-row items-center h-fit">
              <div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div>
              <span class="text-(--pd-status-running)">Running</span>
              : Docker Desktop
            </div>
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-terminated)">Stopping</span>
              : Lima VM
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <Spinner {...args} />
{/if}`}}}),L(i(o,2),{name:`Contexts`,args:{kind:`contexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Sizes used across the app (values preserved exactly).
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {#each sizeVariants as variant (variant.label)}
        <div class="flex flex-col items-center gap-2 p-3">
          <div class="text-xs text-(--pd-content-text)">{variant.label}</div>

          {#if variant.size}
            <Spinner size={variant.size} />
          {:else}
            <Spinner />
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each accessibilityVariants as variant (variant.heading)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.heading}</div>

          <div class="flex items-center justify-center py-2 {variant.containerClass ?? ''}">
            {#if variant.label}
              <Spinner label={variant.label} />
            {:else}
              <Spinner />
            {/if}
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.aria}</code>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div>
      <Button inProgress={true}>Creating</Button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div>

      <div class="flex flex-row items-center gap-3">
        <StatusIcon status="DELETING" />
        <StatusIcon status="UPDATING" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div>

      <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base">
        <div class="mr-1 text-(--pd-state-info)">
          <Spinner size="1.5em" />
        </div>

        <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="1em" />
        <div>Checking prerequisites</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div>

      <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1">
        <div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div>
        <Spinner size="1em" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div>

      <div class="flex flex-row items-center gap-2">
        <Spinner size="12px" />
        <div>Checking context health</div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div>

      <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline">
        <div class="mr-2">
          <Spinner size="16px" />
        </div>
        Run command
      </button>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div>

      <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit">
        <div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm">
          <div class="flex flex-col">
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-starting)">Starting</span>
              : Podman Machine
            </div>
            <div class="flex flex-row items-center h-fit">
              <div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div>
              <span class="text-(--pd-status-running)">Running</span>
              : Docker Desktop
            </div>
            <div class="flex flex-row items-center h-fit">
              <Spinner size="12px" label="Connection Status Icon" class="mr-1" />
              <span class="text-(--pd-status-terminated)">Stopping</span>
              : Lima VM
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <Spinner {...args} />
{/if}`}}}),s(e,n),f()}var F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z;e((()=>{a(),w(),C(),N(),k(),T(),y(),E(),F=(e,a)=>{let d=()=>h(a?.(),[`_children`]);var f=p(),_=l(f),y=e=>{var r=V(),a=i(t(r),2);o(a,5,()=>R,e=>e.label,(e,r)=>{var a=B(),o=t(a),l=t(o,!0);x(o);var u=i(o,2),d=e=>{A(e,{get size(){return c(r).size}})},f=e=>{A(e,{})};g(u,e=>{c(r).size?e(d):e(f,-1)}),x(a),n(()=>v(l,c(r).label)),s(e,a)}),x(a),x(r),s(e,r)},b=e=>{var a=U(),l=i(t(a),2);o(l,5,()=>z,e=>e.heading,(e,a)=>{var o=H(),l=t(o),u=t(l,!0);x(l);var d=i(l,2),f=t(d),p=e=>{A(e,{get label(){return c(a).label}})},m=e=>{A(e,{})};g(f,e=>{c(a).label?e(p):e(m,-1)}),x(d);var h=i(d,2),_=t(h,!0);x(h),x(o),n(()=>{v(u,c(a).heading),r(d,1,`flex items-center justify-center py-2 ${c(a).containerClass??``??``}`),v(_,c(a).aria)}),s(e,o)}),x(l),x(a),s(e,a)},C=e=>{var n=W(),r=t(n);j(i(t(r),2),{inProgress:!0,children:(e,t)=>{u(),s(e,S(`Creating`))},$$slots:{default:!0}}),x(r);var a=i(r,2),o=i(t(a),2),c=t(o);M(c,{status:`DELETING`}),M(i(c,2),{status:`UPDATING`}),x(o),x(a);var l=i(a,2),d=i(t(l),2),f=t(d);A(t(f),{size:`1.5em`}),x(f),u(2),x(d),x(l);var p=i(l,2),m=i(t(p),2);A(t(m),{size:`1em`}),u(2),x(m),x(p);var h=i(p,2),g=i(t(h),2);A(i(t(g),2),{size:`1em`}),x(g),x(h);var _=i(h,2),v=i(t(_),2);A(t(v),{size:`12px`}),u(2),x(v),x(_);var y=i(_,2),b=i(t(y),2),C=t(b);A(t(C),{size:`16px`}),x(C),u(),x(b),x(y);var w=i(y,2),T=i(t(w),2),E=t(T),D=t(E),O=t(D);A(t(O),{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),u(3),x(O),x(D),x(E),x(T),x(w);var k=i(w,2),N=i(t(k),2),P=t(N),F=t(P),I=t(F);A(t(I),{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),u(3),x(I);var L=i(I,4);A(t(L),{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),u(3),x(L),x(F),x(P),x(N),x(k),x(n),s(e,n)},w=e=>{A(e,m(d))};g(_,e=>{d().kind===`sizes`?e(y):d().kind===`accessibility`?e(b,1):d().kind===`contexts`?e(C,2):e(w,-1)}),s(e,f)},I={component:A,render:F,title:`Progress/Spinner`,tags:[`autodocs`],argTypes:{size:{control:`text`,description:`CSS size value for SVG width and height`,defaultValue:`2em`},class:{control:`text`,description:`Additional CSS classes on the wrapper element`},style:{control:`text`,description:`Inline CSS styles on the wrapper element`},label:{control:`text`,description:`Accessible label for screen readers via aria-label`,defaultValue:`Loading`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'These are the stories for the `Spinner` component.\nAn SVG-based indeterminate loading spinner for ongoing processes with unknown duration.\n\n**Accessibility**: The wrapper element uses `role="status"` with `aria-live="polite"` so screen readers\nannounce loading state changes. The SVG graphic is marked `aria-hidden="true"`. The `label` prop sets\n`aria-label` on the wrapper (default: `"Loading"`).\n\n**Color**: The spinner stroke uses `currentColor`, so it inherits the text color of its container.\n\n**Motion**: Support for `prefers-reduced-motion` is planned in\n[#15806](https://github.com/podman-desktop/podman-desktop/issues/15806).'}}}},{Story:L}=D(I),R=[{label:`Default (2em)`},{label:`2em`,size:`2em`},{label:`1em`,size:`1em`},{label:`1.4em`,size:`1.4em`},{label:`1.5em`,size:`1.5em`},{label:`12px`,size:`12px`},{label:`16px`,size:`16px`}],z=[{heading:`Default label`,aria:`role="status" aria-label="Loading" aria-live="polite"`},{heading:`Custom label: Pulling image`,label:`Pulling image`,aria:`role="status" aria-label="Pulling image" aria-live="polite"`},{heading:`Custom label: Checking prerequisites`,label:`Checking prerequisites`,aria:`role="status" aria-label="Checking prerequisites" aria-live="polite"`},{heading:`Custom label: Building container`,label:`Building container`,aria:`role="status" aria-label="Building container" aria-live="polite"`},{heading:`Color inheritance: Info`,label:`Loading info`,containerClass:`text-(--pd-state-info)`,aria:`Inherits currentColor from info context`},{heading:`Color inheritance: Warning`,label:`Loading warning`,containerClass:`text-(--pd-state-warning)`,aria:`Inherits currentColor from warning context`},{heading:`Color inheritance: Muted`,label:`Loading muted`,containerClass:`text-(--pd-content-invert-text)`,aria:`Inherits currentColor from muted context`}],B=b(`<div class="flex flex-col items-center gap-2 p-3"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),V=b(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Sizes used across the app (values preserved exactly).</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-4"></div></div>`),H=b(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code></div>`),U=b(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>`),W=b(`<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div> <!></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div> <div class="flex flex-row items-center gap-3"><!> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div> <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base"><div class="mr-1 text-(--pd-state-info)"><!></div> <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking prerequisites</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div> <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1"><div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking context health</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div> <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline"><div class="mr-2"><!></div> Run command</button></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div></div></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div> <div class="flex flex-row items-center h-fit"><div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div> <span class="text-(--pd-status-running)">Running</span> : Docker Desktop</div> <div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-terminated)">Stopping</span> : Lima VM</div></div></div></div></div></div>`),G=b(`<!> <!> <!> <!>`,1),P.__docgen={data:[],name:`Spinner.stories.svelte`},K=O(P,I),q=[`Basic`,`Sizes`,`Accessibility`,`Contexts`],J={...K.Basic,tags:[`svelte-csf-v5`]},Y={...K.Sizes,tags:[`svelte-csf-v5`]},X={...K.Accessibility,tags:[`svelte-csf-v5`]},Z={...K.Contexts,tags:[`svelte-csf-v5`]}}))();export{X as Accessibility,J as Basic,Z as Contexts,Y as Sizes,q as __namedExportsOrder,I as default};