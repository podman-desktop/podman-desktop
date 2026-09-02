import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,I as n,J as r,Mt as i,Ot as a,Pt as o,Sn as s,_t as c,c as l,ct as u,dn as d,dt as f,h as p,in as m,it as h,jt as g,m as _,mn as v,ot as y,rn as b,st as x,un as S,yn as C}from"./iframe-DAkJTS3X.js";import{a as w,i as T,n as E,r as D,t as O}from"./create-runtime-stories-DSVceL7X.js";import{i as k,r as A,t as j}from"./Button-DQzB1vjU.js";import{t as M,u as N}from"./dist-BbgQ6zJ4.js";function P(e,t){m(t,!1),p();var n=G(),r=i(n);L(r,{name:`Basic`,parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}});var a=o(r,2);L(a,{name:`Sizes`,args:{kind:`sizes`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}});var s=o(a,2);L(s,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}});var c=o(s,2);L(c,{name:`Contexts`,args:{kind:`contexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
{/if}`}}}),y(e,n),b()}var F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z;function Q(){return(Q=e((()=>{s(),w(),C(),M(),k(),T(),l(),E(),F=(e,s)=>{let l=()=>v(s?.(),[`_children`]);var u=x(),p=i(u),m=e=>{var n=V(),i=o(g(n),2);t(i,5,()=>R,e=>e.label,(e,t)=>{var n=B(),i=g(n),s=g(i,!0);d(i);var l=o(i,2),u=e=>{A(e,{get size(){return c(t).size}})},f=e=>{A(e,{})};r(l,e=>{c(t).size?e(u):e(f,-1)}),d(n),a(()=>h(s,c(t).label)),y(e,n)}),d(i),d(n),y(e,n)},b=e=>{var i=U(),s=o(g(i),2);t(s,5,()=>z,e=>e.heading,(e,t)=>{var i=H(),s=g(i),l=g(s,!0);d(s);var u=o(s,2),f=g(u),p=e=>{A(e,{get label(){return c(t).label}})},m=e=>{A(e,{})};r(f,e=>{c(t).label?e(p):e(m,-1)}),d(u);var _=o(u,2),v=g(_,!0);d(_),d(i),a(()=>{h(l,c(t).heading),n(u,1,`flex items-center justify-center py-2 ${c(t).containerClass??``??``}`),h(v,c(t).aria)}),y(e,i)}),d(s),d(i),y(e,i)},C=e=>{var t=W(),n=g(t),r=o(g(n),2);j(r,{inProgress:!0,children:(e,t)=>{S();var n=f(`Creating`);y(e,n)},$$slots:{default:!0}}),d(n);var i=o(n,2),a=o(g(i),2),s=g(a);N(s,{status:`DELETING`});var c=o(s,2);N(c,{status:`UPDATING`}),d(a),d(i);var l=o(i,2),u=o(g(l),2),p=g(u),m=g(p);A(m,{size:`1.5em`}),d(p),S(2),d(u),d(l);var h=o(l,2),_=o(g(h),2),v=g(_);A(v,{size:`1em`}),S(2),d(_),d(h);var b=o(h,2),x=o(g(b),2),C=o(g(x),2);A(C,{size:`1em`}),d(x),d(b);var w=o(b,2),T=o(g(w),2),E=g(T);A(E,{size:`12px`}),S(2),d(T),d(w);var D=o(w,2),O=o(g(D),2),k=g(O),M=g(k);A(M,{size:`16px`}),d(k),S(),d(O),d(D);var P=o(D,2),F=o(g(P),2),I=g(F),L=g(I),R=g(L),z=g(R);A(z,{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),S(3),d(R),d(L),d(I),d(F),d(P);var B=o(P,2),V=o(g(B),2),H=g(V),U=g(H),G=g(U),K=g(G);A(K,{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),S(3),d(G);var q=o(G,4),J=g(q);A(J,{size:`12px`,label:`Connection Status Icon`,class:`mr-1`}),S(3),d(q),d(U),d(H),d(V),d(B),d(t),y(e,t)},w=e=>{A(e,_(l))};r(p,e=>{l().kind===`sizes`?e(m):l().kind===`accessibility`?e(b,1):l().kind===`contexts`?e(C,2):e(w,-1)}),y(e,u)},I={component:A,render:F,title:`Progress/Spinner`,tags:[`autodocs`],argTypes:{size:{control:`text`,description:`CSS size value for SVG width and height`,defaultValue:`2em`},class:{control:`text`,description:`Additional CSS classes on the wrapper element`},style:{control:`text`,description:`Inline CSS styles on the wrapper element`},label:{control:`text`,description:`Accessible label for screen readers via aria-label`,defaultValue:`Loading`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'These are the stories for the `Spinner` component.\nAn SVG-based indeterminate loading spinner for ongoing processes with unknown duration.\n\n**Accessibility**: The wrapper element uses `role="status"` with `aria-live="polite"` so screen readers\nannounce loading state changes. The SVG graphic is marked `aria-hidden="true"`. The `label` prop sets\n`aria-label` on the wrapper (default: `"Loading"`).\n\n**Color**: The spinner stroke uses `currentColor`, so it inherits the text color of its container.\n\n**Motion**: Support for `prefers-reduced-motion` is planned in\n[#15806](https://github.com/podman-desktop/podman-desktop/issues/15806).'}}}},{Story:L}=D(I),R=[{label:`Default (2em)`},{label:`2em`,size:`2em`},{label:`1em`,size:`1em`},{label:`1.4em`,size:`1.4em`},{label:`1.5em`,size:`1.5em`},{label:`12px`,size:`12px`},{label:`16px`,size:`16px`}],z=[{heading:`Default label`,aria:`role="status" aria-label="Loading" aria-live="polite"`},{heading:`Custom label: Pulling image`,label:`Pulling image`,aria:`role="status" aria-label="Pulling image" aria-live="polite"`},{heading:`Custom label: Checking prerequisites`,label:`Checking prerequisites`,aria:`role="status" aria-label="Checking prerequisites" aria-live="polite"`},{heading:`Custom label: Building container`,label:`Building container`,aria:`role="status" aria-label="Building container" aria-live="polite"`},{heading:`Color inheritance: Info`,label:`Loading info`,containerClass:`text-(--pd-state-info)`,aria:`Inherits currentColor from info context`},{heading:`Color inheritance: Warning`,label:`Loading warning`,containerClass:`text-(--pd-state-warning)`,aria:`Inherits currentColor from warning context`},{heading:`Color inheritance: Muted`,label:`Loading muted`,containerClass:`text-(--pd-content-invert-text)`,aria:`Inherits currentColor from muted context`}],B=u(`<div class="flex flex-col items-center gap-2 p-3"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>`),V=u(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Sizes used across the app (values preserved exactly).</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-4"></div></div>`),H=u(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code></div>`),U=u(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>`),W=u(`<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div> <!></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div> <div class="flex flex-row items-center gap-3"><!> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div> <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base"><div class="mr-1 text-(--pd-state-info)"><!></div> <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking prerequisites</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div> <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1"><div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking context health</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div> <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline"><div class="mr-2"><!></div> Run command</button></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div></div></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div> <div class="flex flex-row items-center h-fit"><div class="fa-regular fa-circle-check fa-w-[12px] mr-1 text-(--pd-status-running)"></div> <span class="text-(--pd-status-running)">Running</span> : Docker Desktop</div> <div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-terminated)">Stopping</span> : Lima VM</div></div></div></div></div></div>`),G=u(`<!> <!> <!> <!>`,1),P.__docgen={data:[],name:`Spinner.stories.svelte`},K=O(P,I),q=[`Basic`,`Sizes`,`Accessibility`,`Contexts`],J={...K.Basic,tags:[`svelte-csf-v5`]},Y={...K.Sizes,tags:[`svelte-csf-v5`]},X={...K.Accessibility,tags:[`svelte-csf-v5`]},Z={...K.Contexts,tags:[`svelte-csf-v5`]}})))()}Q();export{X as Accessibility,J as Basic,Z as Contexts,Y as Sizes,q as __namedExportsOrder,I as default};