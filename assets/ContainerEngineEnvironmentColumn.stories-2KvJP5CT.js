import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{At as t,It as n,K as r,L as i,Lt as a,Nt as o,Pt as s,Y as c,Yt as l,an as u,at as d,c as f,ct as p,f as m,fn as h,gn as g,h as _,lt as ee,on as v,pn as y,qt as b,ut as x,wn as S,xn as C,yn as te,yt as w}from"./iframe-D4yR436c.js";import{a as ne,i as T,n as re,r as ie,t as ae}from"./create-runtime-stories-DunKUiBg.js";import{r as oe}from"./ErrorMessage-W8Wh5LyM.js";import{t as se}from"./dist-eHBFdxMn.js";function E(e,r){let s={podman:`bg-(--pd-provider-podman)`,docker:`bg-(--pd-provider-docker)`,kubernetes:`bg-(--pd-provider-kubernetes)`,unknown:`bg-(--pd-provider-unknown)`},c=m(r,`tip`,3,``),u=l(()=>s[r.type??`unknown`]);oe(e,{get tip(){return c()},children:(e,s)=>{var c=D(),l=o(c),f=a(l,2),m=n(f,!0);y(c),t(()=>{i(l,1,`min-h-2 min-w-2 shrink-0 rounded-full ${w(u)??``}`),d(m,r.name)}),p(e,c)},$$slots:{default:!0}})}var D;function O(){return(O=e((()=>{S(),C(),f(),se(),D=x(`<div class="flex w-full items-center gap-x-1 rounded-md bg-[var(--pd-label-bg)] p-1 text-sm text-[var(--pd-label-text)]"><div aria-label="Provider info circle"></div> <span class="min-w-0 flex-1 overflow-x-hidden text-ellipsis whitespace-nowrap"> </span></div>`),E.__docgen={data:[{name:`type`,visibility:`public`,description:`Provider connection type driving the colored indicator.`,keywords:[],kind:`let`,type:{kind:`union`,type:[{kind:`const`,type:`string`,value:`kubernetes`,text:`"kubernetes"`},{kind:`const`,type:`string`,value:`podman`,text:`"podman"`},{kind:`const`,type:`string`,value:`docker`,text:`"docker"`}],text:`"kubernetes" | "podman" | "docker"`},static:!1,readonly:!1},{name:`name`,visibility:`public`,description:`Label text (connection type, or displayName when multiple connections share a type).`,keywords:[{name:`required`,description:``}],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1},{name:`tip`,visibility:`public`,description:"Tooltip content — typically `connection.endpoint.socketPath`.",keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`""`}],name:`MockContainerEngineEnvironmentColumn.svelte`}})))()}function k(e,t){v(t,!1),_();var n=K(),r=s(n);M(r,{name:`Basic`,args:{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}});var i=a(r,2);M(i,{name:`Provider Types`,args:{kind:`providers`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}});var o=a(i,2);M(o,{name:`Display Names`,args:{kind:`displayNames`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}});var c=a(o,2);M(c,{name:`Tooltips`,args:{kind:`tooltips`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}});var l=a(c,2);M(l,{name:`Table Cell Contexts`,args:{kind:`tableContexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}});var d=a(l,2);M(d,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}});var f=a(d,2);M(f,{name:`Comparison`,args:{kind:`comparison`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Provider type drives the colored circle via <code>ProviderInfoCircle</code> and
      <code>providerColors</code>. Colors come from the color registry tokens below.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each providerVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="max-w-xs py-2">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>

          <code class="text-[10px] text-(--pd-content-text) break-all">{variant.token}</code>
          {#if variant.note}
            <div class="text-[10px] text-(--pd-content-text)">{variant.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'displayNames'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
      connection shares a type, show <code>connection.displayName</code>; otherwise show
      <code>connection.type</code>. If no connection matches, fall back to
      <code>object.engineId</code>.
    </div>

    <div class="flex flex-col gap-3">
      {#each displayNameCases as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6">
          <div class="w-full max-w-xs shrink-0">
            <MockContainerEngineEnvironmentColumn type={variant.type} name={variant.name} tip={variant.tip} />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'tooltips'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
      tip behavior is preserved.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div>
        <div class="max-w-[10rem] py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Very Long Podman Machine Display Name"
            tip="/Users/example/.local/share/containers/podman/machine/qemu/podman.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'tableContexts'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      The Environment column appears in five list tables. Each row below mocks a typical table
      cell layout with the Environment column on the right.
    </div>

    {#each tableContextRows as row (row.list)}
      <div class="flex flex-col gap-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">
          {row.list} list
        </div>
        <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
          <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
            <input type="checkbox" class="w-3.5 h-3.5" disabled />
          </div>
          <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
            <div class="truncate text-sm text-(--pd-content-header)">{row.resource}</div>
            <div class="text-xs text-(--pd-content-text)">{row.list.slice(0, -1)}</div>
          </div>
          <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)">
            <span class="text-xs text-(--pd-content-text)">Running</span>
          </div>
          <div class="w-48 shrink-0 px-3 py-2">
            <MockContainerEngineEnvironmentColumn type={row.type} name={row.name} tip={row.tip} />
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility surface before modernization. The circle is a plain
      <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
      differentiator by provider type.
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn
            type="podman"
            name="Podman Machine Default"
            tip="/var/run/podman-machine.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div>
        <div class="max-w-xs py-2">
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
        <div class="flex max-w-xs flex-col gap-2 py-2">
          <MockContainerEngineEnvironmentColumn type="podman" name="podman" tip="/run/podman/podman.sock" />
          <MockContainerEngineEnvironmentColumn type="docker" name="docker" tip="/var/run/docker.sock" />
          <MockContainerEngineEnvironmentColumn name="unknown.engine" />
        </div>
        <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div>
        <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)">
          <li>Color-only differentiation — no icon shape per provider</li>
          <li>Circle is a raw <code>div</code>, not an SVG icon</li>
          <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li>
        </ul>
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
      modernized status indicators (reference for #18120).
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div>
        <div class="flex items-center gap-3 py-2">
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div>
          <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div>
        </div>
        <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div>
        <div class="text-sm text-(--pd-content-text) py-2">
          Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with
          <code>role="img"</code>, larger visible indicator, and shape + color differentiation.
        </div>
        <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code>
      </div>
    </div>

    <div class="max-w-xs">
      <div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div>
      <MockContainerEngineEnvironmentColumn
        type="podman"
        name="Podman Machine Default"
        tip="/var/run/podman-machine.sock" />
    </div>
  </div>
{:else}
  <div class="max-w-xs">
    <MockContainerEngineEnvironmentColumn type={args.type} name={args.name ?? 'podman'} tip={args.tip ?? ''} />
  </div>
{/if}`}}}),p(e,n),u()}var A,j,M,N,P,F,ce,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,le,ue,Q,de;function $(){return($=e((()=>{S(),ne(),C(),T(),O(),f(),re(),A=(e,i,l=te)=>{let u=()=>g(i?.(),[`_children`]);var f=ee(),m=s(f),_=e=>{var i=L(),s=a(o(i),2);r(s,5,()=>N,e=>e.label,(e,r)=>{var i=I(),s=o(i),l=n(s,!0),u=a(s,2);E(o(u),{get type(){return w(r).type},get name(){return w(r).name},get tip(){return w(r).tip}}),y(u);var f=a(u,2),m=n(f,!0),h=a(f,2),g=e=>{var i=ce(),a=n(i,!0);t(()=>d(a,w(r).note)),p(e,i)};c(h,e=>{w(r).note&&e(g)}),y(i),t(()=>{d(l,w(r).label),d(m,w(r).token)}),p(e,i)}),y(s),y(i),p(e,i)},v=e=>{var i=z(),s=a(o(i),2);r(s,5,()=>P,e=>e.label,(e,r)=>{var i=R(),s=o(i);E(o(s),{get type(){return w(r).type},get name(){return w(r).name},get tip(){return w(r).tip}}),y(s);var c=a(s,2),l=o(c),u=n(l,!0),f=a(l,2),m=n(f,!0);y(c),y(i),t(()=>{d(u,w(r).label),d(m,w(r).note)}),p(e,i)}),y(s),y(i),p(e,i)},x=e=>{var t=B(),n=a(o(t),2),r=o(n),i=a(o(r),2);E(o(i),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),y(i),h(2),y(r);var s=a(r,2),c=a(o(s),2);E(o(c),{type:`docker`,name:`docker`,tip:``}),y(c),h(2),y(s);var l=a(s,2),u=a(o(l),2);E(o(u),{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),y(u),h(2),y(l);var d=a(l,2),f=a(o(d),2);E(o(f),{type:`podman`,name:`Very Long Podman Machine Display Name`,tip:`/Users/example/.local/share/containers/podman/machine/qemu/podman.sock`}),y(f),h(2),y(d),y(n),y(t),p(e,t)},S=e=>{var i=H(),s=a(o(i),2);r(s,1,()=>F,e=>e.list,(e,r)=>{var i=V(),s=o(i),c=n(s),l=a(s,2),u=a(o(l),2),f=o(u),m=n(f,!0),h=a(f,2),g=n(h,!0);y(u);var _=a(u,4);E(o(_),{get type(){return w(r).type},get name(){return w(r).name},get tip(){return w(r).tip}}),y(_),y(l),y(i),t(e=>{d(c,`${w(r).list??``} list`),d(m,w(r).resource),d(g,e)},[()=>w(r).list.slice(0,-1)]),p(e,i)}),y(i),p(e,i)},C=e=>{var t=U(),n=a(o(t),2),r=o(n),i=a(o(r),2);E(o(i),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),y(i),h(2),y(r);var s=a(r,2),c=a(o(s),2);E(o(c),{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),y(c),h(2),y(s);var l=a(s,2),u=a(o(l),2),d=o(u);E(d,{type:`podman`,name:`podman`,tip:`/run/podman/podman.sock`});var f=a(d,2);E(f,{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),E(a(f,2),{name:`unknown.engine`}),y(u),h(2),y(l),h(2),y(n),y(t),p(e,t)},ne=e=>{var t=W(),n=a(o(t),4);E(a(o(n),2),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),y(n),y(t),p(e,t)},T=e=>{var t=G(),n=o(t);{let e=b(()=>u().name??`podman`),t=b(()=>u().tip??``);E(n,{get type(){return u().type},get name(){return w(e)},get tip(){return w(t)}})}y(t),p(e,t)};c(m,e=>{u().kind===`providers`?e(_):u().kind===`displayNames`?e(v,1):u().kind===`tooltips`?e(x,2):u().kind===`tableContexts`?e(S,3):u().kind===`accessibility`?e(C,4):u().kind===`comparison`?e(ne,5):e(T,-1)}),p(e,f)},j={render:A,title:`ContainerEngineEnvironmentColumn`,tags:[`autodocs`],argTypes:{type:{control:`select`,options:[`podman`,`docker`,`kubernetes`,void 0],description:`Provider connection type (colored circle)`},name:{control:`text`,description:`Display label (type when single connection; displayName when multiple)`},tip:{control:`text`,description:`Tooltip text (connection endpoint socket path)`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:"Stories for the `ContainerEngineEnvironmentColumn` component from `packages/renderer`.\n\nEngine/provider indicator column used in Containers, Images, Volumes, Networks,\nand Pods list tables. Renders a `Label` with a colored `ProviderInfoCircle` and\nan optional tooltip showing the connection socket path.\n\nThe real column resolves `object.engineId` against `providerInfos` /\n`containerConnectionCount` stores. These stories use a presentation helper that\naccepts the resolved props (`type`, `name`, `tip`) so current visuals can be\ndocumented without store wiring.\n\n**Theming**: Uses CSS custom properties `--pd-provider-podman`,\n`--pd-provider-docker`, `--pd-provider-kubernetes`, `--pd-provider-unknown`,\n`--pd-label-bg`, and `--pd-label-text` from the color registry.\n\n**Planned modernization** (#18120): Replace the plain colored circle with an\nicon-based provider indicator consistent with the design system (e.g. StatusDot\n/ StatusDotIcon pattern)."}}}},{Story:M}=ie(j),N=[{label:`Podman`,type:`podman`,name:`podman`,tip:`/var/run/podman-machine.sock`,token:`--pd-provider-podman`},{label:`Docker`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`,token:`--pd-provider-docker`},{label:`Kubernetes`,type:`kubernetes`,name:`kubernetes`,tip:``,token:`--pd-provider-kubernetes`,note:`Rare in this column; circle supports kubernetes type`},{label:`Unknown / unresolved`,type:void 0,name:`podman.missing-connection`,tip:``,token:`--pd-provider-unknown`,note:`Falls back to engineId as label when connection is missing`}],P=[{label:`Single docker connection`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`,note:`containerConnectionCount[docker] === 1 → show connection.type`},{label:`Multiple podman — default machine`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`,note:`containerConnectionCount[podman] > 1 → show connection.displayName`},{label:`Multiple podman — remote`,type:`podman`,name:`Podman Remote`,tip:`/var/run/podman-remote.sock`,note:`containerConnectionCount[podman] > 1 → show connection.displayName`},{label:`Unresolved engineId`,type:void 0,name:`podman.unknown-machine`,tip:``,note:`No matching connection → show raw object.engineId`}],F=[{resource:`nginx`,list:`Containers`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`},{resource:`docker.io/library/alpine:latest`,list:`Images`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`},{resource:`my-volume`,list:`Volumes`,type:`podman`,name:`Podman Remote`,tip:`/var/run/podman-remote.sock`},{resource:`bridge`,list:`Networks`,type:`podman`,name:`podman`,tip:`/run/podman/podman.sock`},{resource:`my-web-app-pod`,list:`Pods`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}],ce=x(`<div class="text-[10px] text-(--pd-content-text)"> </div>`),I=x(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code> <!></div>`),L=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Provider type drives the colored circle via <code>ProviderInfoCircle</code> and <code>providerColors</code>. Colors come from the color registry tokens below.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"></div></div>`),R=x(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6"><div class="w-full max-w-xs shrink-0"><!></div> <div class="flex flex-col gap-1"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),z=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
        connection shares a type, show <code>connection.displayName</code>; otherwise show <code>connection.type</code>. If no connection matches, fall back to <code>object.engineId</code>.</div> <div class="flex flex-col gap-3"></div></div>`),B=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
        tip behavior is preserved.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div> <div class="max-w-[10rem] py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code></div></div></div>`),V=x(`<div class="flex flex-col gap-2"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)"> </div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5" disabled=""/></div> <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="truncate text-sm text-(--pd-content-header)"> </div> <div class="text-xs text-(--pd-content-text)"> </div></div> <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-48 shrink-0 px-3 py-2"><!></div></div></div>`),H=x(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">The Environment column appears in five list tables. Each row below mocks a typical table
        cell layout with the Environment column on the right.</div> <!></div>`),U=x(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Current accessibility surface before modernization. The circle is a plain <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
        differentiator by provider type.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div> <div class="flex max-w-xs flex-col gap-2 py-2"><!> <!> <!></div> <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div> <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)"><li>Color-only differentiation — no icon shape per provider</li> <li>Circle is a raw <code>div</code>, not an SVG icon</li> <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li></ul></div></div></div>`),W=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
        modernized status indicators (reference for #18120).</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div> <div class="flex items-center gap-3 py-2"><div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div></div> <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div> <div class="text-sm text-(--pd-content-text) py-2">Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with <code>role="img"</code>, larger visible indicator, and shape + color differentiation.</div> <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code></div></div> <div class="max-w-xs"><div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div> <!></div></div>`),G=x(`<div class="max-w-xs"><!></div>`),K=x(`<!> <!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`ContainerEngineEnvironmentColumn.stories.svelte`},q=ae(k,j),J=[`Basic`,`ProviderTypes`,`DisplayNames`,`Tooltips`,`TableCellContexts`,`Accessibility`,`Comparison`],Y={...q.Basic,tags:[`svelte-csf-v5`]},X={...q.ProviderTypes,tags:[`svelte-csf-v5`]},Z={...q.DisplayNames,tags:[`svelte-csf-v5`]},le={...q.Tooltips,tags:[`svelte-csf-v5`]},ue={...q.TableCellContexts,tags:[`svelte-csf-v5`]},Q={...q.Accessibility,tags:[`svelte-csf-v5`]},de={...q.Comparison,tags:[`svelte-csf-v5`]}})))()}$();export{Q as Accessibility,Y as Basic,de as Comparison,Z as DisplayNames,X as ProviderTypes,ue as TableCellContexts,le as Tooltips,J as __namedExportsOrder,j as default};