import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Dt as n,F as r,Gt as i,Nt as a,Sn as o,Ut as s,W as c,at as l,d as u,gt as d,hn as f,jt as p,ln as m,m as h,nn as g,ot as ee,pn as te,q as _,rn as v,rt as y,s as b,st as x,un as S,yn as C}from"./iframe-BqaN-iHd.js";import{a as w,i as ne,n as re,r as ie,t as ae}from"./create-runtime-stories-DR1Kg36G.js";import{r as oe}from"./ErrorMessage-HgI5J7ds.js";import{t as se}from"./dist-DgoTEFvr.js";function T(e,o){let s={podman:`bg-(--pd-provider-podman)`,docker:`bg-(--pd-provider-docker)`,kubernetes:`bg-(--pd-provider-kubernetes)`,unknown:`bg-(--pd-provider-unknown)`},c=u(o,`tip`,3,``),f=i(()=>s[o.type??`unknown`]);oe(e,{get tip(){return c()},children:(e,i)=>{var s=E(),c=t(s),u=a(c,2),p=t(u,!0);S(u),S(s),n(()=>{r(c,1,`min-h-2 min-w-2 shrink-0 rounded-full ${d(f)??``}`),y(p,o.name)}),l(e,s)},$$slots:{default:!0}})}var E,ce=e((()=>{o(),C(),b(),se(),E=x(`<div class="flex w-full items-center gap-x-1 rounded-md bg-[var(--pd-label-bg)] p-1 text-sm text-[var(--pd-label-text)]"><div aria-label="Provider info circle"></div> <span class="min-w-0 flex-1 overflow-x-hidden text-ellipsis whitespace-nowrap"> </span></div>`),T.__docgen={data:[{name:`type`,visibility:`public`,description:`Provider connection type driving the colored indicator.`,keywords:[],kind:`let`,type:{kind:`union`,type:[{kind:`const`,type:`string`,value:`kubernetes`,text:`"kubernetes"`},{kind:`const`,type:`string`,value:`podman`,text:`"podman"`},{kind:`const`,type:`string`,value:`docker`,text:`"docker"`}],text:`"kubernetes" | "podman" | "docker"`},static:!1,readonly:!1},{name:`name`,visibility:`public`,description:`Label text (connection type, or displayName when multiple connections share a type).`,keywords:[{name:`required`,description:``}],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1},{name:`tip`,visibility:`public`,description:"Tooltip content — typically `connection.endpoint.socketPath`.",keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`""`}],name:`MockContainerEngineEnvironmentColumn.svelte`}}));function D(e,t){v(t,!1),h();var n=G(),r=p(n);A(r,{name:`Basic`,args:{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var i=a(r,2);A(i,{name:`Provider Types`,args:{kind:`providers`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var o=a(i,2);A(o,{name:`Display Names`,args:{kind:`displayNames`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var s=a(o,2);A(s,{name:`Tooltips`,args:{kind:`tooltips`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var c=a(s,2);A(c,{name:`Table Cell Contexts`,args:{kind:`tableContexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var u=a(c,2);A(u,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var d=a(u,2);A(d,{name:`Comparison`,args:{kind:`comparison`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}}),l(e,n),g()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,le,$;e((()=>{o(),w(),C(),ne(),ce(),b(),re(),O=(e,r,i=f)=>{let o=()=>te(r?.(),[`_children`]);var u=ee(),h=p(u),g=e=>{var r=I(),i=a(t(r),2);c(i,5,()=>j,e=>e.label,(e,r)=>{var i=F(),o=t(i),s=t(o,!0);S(o);var c=a(o,2);T(t(c),{get type(){return d(r).type},get name(){return d(r).name},get tip(){return d(r).tip}}),S(c);var u=a(c,2),f=t(u,!0);S(u);var p=a(u,2),m=e=>{var i=P(),a=t(i,!0);S(i),n(()=>y(a,d(r).note)),l(e,i)};_(p,e=>{d(r).note&&e(m)}),S(i),n(()=>{y(s,d(r).label),y(f,d(r).token)}),l(e,i)}),S(i),S(r),l(e,r)},v=e=>{var r=R(),i=a(t(r),2);c(i,5,()=>M,e=>e.label,(e,r)=>{var i=L(),o=t(i);T(t(o),{get type(){return d(r).type},get name(){return d(r).name},get tip(){return d(r).tip}}),S(o);var s=a(o,2),c=t(s),u=t(c,!0);S(c);var f=a(c,2),p=t(f,!0);S(f),S(s),S(i),n(()=>{y(u,d(r).label),y(p,d(r).note)}),l(e,i)}),S(i),S(r),l(e,r)},b=e=>{var n=z(),r=a(t(n),2),i=t(r),o=a(t(i),2);T(t(o),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),S(o),m(2),S(i);var s=a(i,2),c=a(t(s),2);T(t(c),{type:`docker`,name:`docker`,tip:``}),S(c),m(2),S(s);var u=a(s,2),d=a(t(u),2);T(t(d),{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),S(d),m(2),S(u);var f=a(u,2),p=a(t(f),2);T(t(p),{type:`podman`,name:`Very Long Podman Machine Display Name`,tip:`/Users/example/.local/share/containers/podman/machine/qemu/podman.sock`}),S(p),m(2),S(f),S(r),S(n),l(e,n)},x=e=>{var r=V();c(a(t(r),2),1,()=>N,e=>e.list,(e,r)=>{var i=B(),o=t(i),s=t(o);S(o);var c=a(o,2),u=a(t(c),2),f=t(u),p=t(f,!0);S(f);var m=a(f,2),h=t(m,!0);S(m),S(u);var g=a(u,4);T(t(g),{get type(){return d(r).type},get name(){return d(r).name},get tip(){return d(r).tip}}),S(g),S(c),S(i),n(e=>{y(s,`${d(r).list??``} list`),y(p,d(r).resource),y(h,e)},[()=>d(r).list.slice(0,-1)]),l(e,i)}),S(r),l(e,r)},C=e=>{var n=H(),r=a(t(n),2),i=t(r),o=a(t(i),2);T(t(o),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),S(o),m(2),S(i);var s=a(i,2),c=a(t(s),2);T(t(c),{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),S(c),m(2),S(s);var u=a(s,2),d=a(t(u),2),f=t(d);T(f,{type:`podman`,name:`podman`,tip:`/run/podman/podman.sock`});var p=a(f,2);T(p,{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),T(a(p,2),{name:`unknown.engine`}),S(d),m(2),S(u),m(2),S(r),S(n),l(e,n)},w=e=>{var n=U(),r=a(t(n),4);T(a(t(r),2),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),S(r),S(n),l(e,n)},ne=e=>{var n=W(),r=t(n);{let e=s(()=>o().name??`podman`),t=s(()=>o().tip??``);T(r,{get type(){return o().type},get name(){return d(e)},get tip(){return d(t)}})}S(n),l(e,n)};_(h,e=>{o().kind===`providers`?e(g):o().kind===`displayNames`?e(v,1):o().kind===`tooltips`?e(b,2):o().kind===`tableContexts`?e(x,3):o().kind===`accessibility`?e(C,4):o().kind===`comparison`?e(w,5):e(ne,-1)}),l(e,u)},k={render:O,title:`ContainerEngineEnvironmentColumn`,tags:[`autodocs`],argTypes:{type:{control:`select`,options:[`podman`,`docker`,`kubernetes`,void 0],description:`Provider connection type (colored circle)`},name:{control:`text`,description:`Display label (type when single connection; displayName when multiple)`},tip:{control:`text`,description:`Tooltip text (connection endpoint socket path)`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:"Stories for the `ContainerEngineEnvironmentColumn` component from `packages/renderer`.\n\nEngine/provider indicator column used in Containers, Images, Volumes, Networks,\nand Pods list tables. Renders a `Label` with a colored `ProviderInfoCircle` and\nan optional tooltip showing the connection socket path.\n\nThe real column resolves `object.engineId` against `providerInfos` /\n`containerConnectionCount` stores. These stories use a presentation helper that\naccepts the resolved props (`type`, `name`, `tip`) so current visuals can be\ndocumented without store wiring.\n\n**Theming**: Uses CSS custom properties `--pd-provider-podman`,\n`--pd-provider-docker`, `--pd-provider-kubernetes`, `--pd-provider-unknown`,\n`--pd-label-bg`, and `--pd-label-text` from the color registry.\n\n**Planned modernization** (#18120): Replace the plain colored circle with an\nicon-based provider indicator consistent with the design system (e.g. StatusDot\n/ StatusDotIcon pattern)."}}}},{Story:A}=ie(k),j=[{label:`Podman`,type:`podman`,name:`podman`,tip:`/var/run/podman-machine.sock`,token:`--pd-provider-podman`},{label:`Docker`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`,token:`--pd-provider-docker`},{label:`Kubernetes`,type:`kubernetes`,name:`kubernetes`,tip:``,token:`--pd-provider-kubernetes`,note:`Rare in this column; circle supports kubernetes type`},{label:`Unknown / unresolved`,type:void 0,name:`podman.missing-connection`,tip:``,token:`--pd-provider-unknown`,note:`Falls back to engineId as label when connection is missing`}],M=[{label:`Single docker connection`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`,note:`containerConnectionCount[docker] === 1 → show connection.type`},{label:`Multiple podman — default machine`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`,note:`containerConnectionCount[podman] > 1 → show connection.displayName`},{label:`Multiple podman — remote`,type:`podman`,name:`Podman Remote`,tip:`/var/run/podman-remote.sock`,note:`containerConnectionCount[podman] > 1 → show connection.displayName`},{label:`Unresolved engineId`,type:void 0,name:`podman.unknown-machine`,tip:``,note:`No matching connection → show raw object.engineId`}],N=[{resource:`nginx`,list:`Containers`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`},{resource:`docker.io/library/alpine:latest`,list:`Images`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`},{resource:`my-volume`,list:`Volumes`,type:`podman`,name:`Podman Remote`,tip:`/var/run/podman-remote.sock`},{resource:`bridge`,list:`Networks`,type:`podman`,name:`podman`,tip:`/run/podman/podman.sock`},{resource:`my-web-app-pod`,list:`Pods`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}],P=x(`<div class="text-[10px] text-(--pd-content-text)"> </div>`),F=x(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code> <!></div>`),I=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Provider type drives the colored circle via <code>ProviderInfoCircle</code> and <code>providerColors</code>. Colors come from the color registry tokens below.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"></div></div>`),L=x(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6"><div class="w-full max-w-xs shrink-0"><!></div> <div class="flex flex-col gap-1"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),R=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
        connection shares a type, show <code>connection.displayName</code>; otherwise show <code>connection.type</code>. If no connection matches, fall back to <code>object.engineId</code>.</div> <div class="flex flex-col gap-3"></div></div>`),z=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
        tip behavior is preserved.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div> <div class="max-w-[10rem] py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code></div></div></div>`),B=x(`<div class="flex flex-col gap-2"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)"> </div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5" disabled=""/></div> <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="truncate text-sm text-(--pd-content-header)"> </div> <div class="text-xs text-(--pd-content-text)"> </div></div> <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-48 shrink-0 px-3 py-2"><!></div></div></div>`),V=x(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">The Environment column appears in five list tables. Each row below mocks a typical table
        cell layout with the Environment column on the right.</div> <!></div>`),H=x(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Current accessibility surface before modernization. The circle is a plain <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
        differentiator by provider type.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div> <div class="flex max-w-xs flex-col gap-2 py-2"><!> <!> <!></div> <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div> <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)"><li>Color-only differentiation — no icon shape per provider</li> <li>Circle is a raw <code>div</code>, not an SVG icon</li> <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li></ul></div></div></div>`),U=x(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
        modernized status indicators (reference for #18120).</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div> <div class="flex items-center gap-3 py-2"><div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div></div> <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div> <div class="text-sm text-(--pd-content-text) py-2">Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with <code>role="img"</code>, larger visible indicator, and shape + color differentiation.</div> <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code></div></div> <div class="max-w-xs"><div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div> <!></div></div>`),W=x(`<div class="max-w-xs"><!></div>`),G=x(`<!> <!> <!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`ContainerEngineEnvironmentColumn.stories.svelte`},K=ae(D,k),q=[`Basic`,`ProviderTypes`,`DisplayNames`,`Tooltips`,`TableCellContexts`,`Accessibility`,`Comparison`],J={...K.Basic,tags:[`svelte-csf-v5`]},Y={...K.ProviderTypes,tags:[`svelte-csf-v5`]},X={...K.DisplayNames,tags:[`svelte-csf-v5`]},Z={...K.Tooltips,tags:[`svelte-csf-v5`]},Q={...K.TableCellContexts,tags:[`svelte-csf-v5`]},le={...K.Accessibility,tags:[`svelte-csf-v5`]},$={...K.Comparison,tags:[`svelte-csf-v5`]}}))();export{le as Accessibility,J as Basic,$ as Comparison,X as DisplayNames,Y as ProviderTypes,Q as TableCellContexts,Z as Tooltips,q as __namedExportsOrder,k as default};