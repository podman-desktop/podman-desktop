import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{At as t,It as n,K as r,L as i,Lt as a,Nt as o,Pt as s,Y as c,an as l,at as u,c as d,ct as f,fn as p,gn as m,h,lt as g,m as _,on as v,pn as y,pt as b,ut as x,wn as S,xn as C,yt as w}from"./iframe-D4yR436c.js";import{a as T,i as E,n as D,r as O,t as k}from"./create-runtime-stories-DunKUiBg.js";import{i as A,r as j,t as M}from"./Button-BaFVaBRK.js";import{t as N,u as P}from"./dist-eHBFdxMn.js";function F(e,t){v(t,!1),h();var n=K(),r=s(n);R(r,{name:`Basic`,parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}});var i=a(r,2);R(i,{name:`Sizes`,args:{kind:`sizes`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}});var o=a(i,2);R(o,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}});var c=a(o,2);R(c,{name:`Contexts`,args:{kind:`contexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}}),f(e,n),l()}var I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{S(),T(),C(),N(),A(),E(),d(),D(),I=(e,l)=>{let d=()=>m(l?.(),[`_children`]);var h=g(),v=s(h),x=e=>{var i=H(),s=a(o(i),2);r(s,5,()=>z,e=>e.label,(e,r)=>{var i=V(),s=o(i),l=n(s,!0),d=a(s,2),p=e=>{j(e,{get size(){return w(r).size}})},m=e=>{j(e,{})};c(d,e=>{w(r).size?e(p):e(m,-1)}),y(i),t(()=>u(l,w(r).label)),f(e,i)}),y(s),y(i),f(e,i)},S=e=>{var s=W(),l=a(o(s),2);r(l,5,()=>B,e=>e.heading,(e,r)=>{var s=U(),l=o(s),d=n(l,!0),p=a(l,2),m=o(p),h=e=>{j(e,{get label(){return w(r).label}})},g=e=>{j(e,{})};c(m,e=>{w(r).label?e(h):e(g,-1)}),y(p);var _=a(p,2),v=n(_,!0);y(s),t(()=>{u(d,w(r).heading),i(p,1,`flex items-center justify-center py-2 ${w(r).containerClass??``??``}`),u(v,w(r).aria)}),f(e,s)}),y(l),y(s),f(e,s)},C=e=>{var t=G(),n=o(t),r=a(o(n),2);M(r,{inProgress:!0,children:(e,t)=>{p();var n=b(`Creating`);f(e,n)},$$slots:{default:!0}}),y(n);var i=a(n,2),s=a(o(i),2),c=o(s);P(c,{status:`DELETING`});var l=a(c,2);P(l,{status:`UPDATING`}),y(s),y(i);var u=a(i,2),d=a(o(u),2),m=o(d),h=o(m);j(h,{size:`1.5em`}),y(m),p(2),y(d),y(u);var g=a(u,2),_=a(o(g),2),v=o(_);j(v,{size:`1em`}),p(2),y(_),y(g);var x=a(g,2),S=a(o(x),2),C=a(o(S),2);j(C,{size:`1em`}),y(S),y(x);var w=a(x,2),T=a(o(w),2),E=o(T);j(E,{size:`12px`}),p(2),y(T),y(w);var D=a(w,2),O=a(o(D),2),k=o(O),A=o(k);j(A,{size:`16px`}),y(k),p(),y(O),y(D);var N=a(D,2),F=a(o(N),2),I=o(F),L=o(I),R=o(L),z=o(R);j(z,{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),p(3),y(R),y(L),y(I),y(F),y(N);var B=a(N,2),V=a(o(B),2),H=o(V),U=o(H),W=o(U),K=o(W);j(K,{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),p(3),y(W);var q=a(W,4),J=o(q);j(J,{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),p(3),y(q),y(U),y(H),y(V),y(B),y(t),f(e,t)},T=e=>{j(e,_(d))};c(v,e=>{d().kind===`sizes`?e(x):d().kind===`accessibility`?e(S,1):d().kind===`contexts`?e(C,2):e(T,-1)}),f(e,h)},L={component:j,render:I,title:`Progress/Spinner`,tags:[`autodocs`],argTypes:{size:{control:`text`,description:`CSS size value for SVG width and height`,defaultValue:`2em`},class:{control:`text`,description:`Additional CSS classes on the wrapper element`},style:{control:`text`,description:`Inline CSS styles on the wrapper element`},label:{control:`text`,description:`Accessible label for screen readers via aria-label`,defaultValue:`Loading`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'These are the stories for the `Spinner` component.\nAn SVG-based indeterminate loading spinner for ongoing processes with unknown duration.\n\n**Accessibility**: The wrapper element uses `role="status"` with `aria-live="polite"` so screen readers\nannounce loading state changes. The SVG graphic is marked `aria-hidden="true"`. The `label` prop sets\n`aria-label` on the wrapper (default: `"Loading"`).\n\n**Color**: The spinner stroke uses `currentColor`, so it inherits the text color of its container.\n\n**Motion**: Support for `prefers-reduced-motion` is planned in\n[#15806](https://github.com/podman-desktop/podman-desktop/issues/15806).'}}}},{Story:R}=O(L),z=[{label:`Default (2em)`},{label:`2em`,size:`2em`},{label:`1em`,size:`1em`},{label:`1.4em`,size:`1.4em`},{label:`1.5em`,size:`1.5em`},{label:`12px`,size:`12px`},{label:`16px`,size:`16px`}],B=[{heading:`Default label`,aria:`role="status" aria-label="Loading" aria-live="polite"`},{heading:`Custom label: Pulling image`,label:`Pulling image`,aria:`role="status" aria-label="Pulling image" aria-live="polite"`},{heading:`Custom label: Checking prerequisites`,label:`Checking prerequisites`,aria:`role="status" aria-label="Checking prerequisites" aria-live="polite"`},{heading:`Custom label: Building container`,label:`Building container`,aria:`role="status" aria-label="Building container" aria-live="polite"`},{heading:`Color inheritance: Info`,label:`Loading info`,containerClass:`text-(--pd-state-info)`,aria:`Inherits currentColor from info context`},{heading:`Color inheritance: Warning`,label:`Loading warning`,containerClass:`text-(--pd-state-warning)`,aria:`Inherits currentColor from warning context`},{heading:`Color inheritance: Muted`,label:`Loading muted`,containerClass:`text-(--pd-content-invert-text)`,aria:`Inherits currentColor from muted context`}],V=x(`<div class="flex flex-col items-center gap-2 p-3"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),H=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Sizes used across the app (values preserved exactly).</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-4"></div></div>`),U=x(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code></div>`),W=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>`),G=x(`<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div> <!></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div> <div class="flex flex-row items-center gap-3"><!> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div> <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base"><div class="mr-1 text-(--pd-state-info)"><!></div> <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking prerequisites</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div> <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1"><div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking context health</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div> <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline"><div class="mr-2"><!></div> Run command</button></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div></div></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div> <div class="flex flex-row items-center h-fit"><div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div> <span class="text-(--pd-status-running)">Running</span> : Docker Desktop</div> <div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-terminated)">Stopping</span> : Lima VM</div></div></div></div></div></div>`),K=x(`<!> <!> <!> <!>`,1),F.__docgen={data:[],name:`Spinner.stories.svelte`},q=k(F,L),J=[`Basic`,`Sizes`,`Accessibility`,`Contexts`],Y={...q.Basic,tags:[`svelte-csf-v5`]},X={...q.Sizes,tags:[`svelte-csf-v5`]},Z={...q.Accessibility,tags:[`svelte-csf-v5`]},Q={...q.Contexts,tags:[`svelte-csf-v5`]}})))()}$();export{Z as Accessibility,Y as Basic,Q as Contexts,X as Sizes,J as __namedExportsOrder,L as default};