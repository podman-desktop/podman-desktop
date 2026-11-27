import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{$ as t,At as n,Bt as r,En as i,Ft as a,It as o,Jt as s,Mt as c,Nt as l,Ot as u,Sn as d,Tn as f,W as p,_t as m,c as h,cn as g,f as _,hn as v,it as y,kt as b,mn as x,mt as S,on as C,vt as ee,x as w,yn as te,yt as T}from"./iframe-C8E0bH--.js";import{a as E,i as ne,n as re,r as ie,t as ae}from"./create-runtime-stories-uG7mwCkM.js";import{r as oe}from"./ErrorMessage-Bdms8k_-.js";import{t as se}from"./dist-BZaKH8L8.js";function D(e,t){let n={podman:`bg-(--pd-provider-podman)`,docker:`bg-(--pd-provider-docker)`,kubernetes:`bg-(--pd-provider-kubernetes)`,unknown:`bg-(--pd-provider-unknown)`},l=_(t,`tip`,3,``),u=g(()=>n[t.type??`unknown`]);oe(e,{get tip(){return l()},children:(e,n)=>{var l=O(),d=c(l),f=o(d,2),h=a(f,!0);i(l),s(()=>{p(d,1,`min-h-2 min-w-2 shrink-0 rounded-full ${r(u)??``}`),S(h,t.name)}),m(e,l)},$$slots:{default:!0}})}var O;function k(){return(k=e((()=>{n(),b(),u(),h(),se(),O=T(`<div class="flex w-full items-center gap-x-1 rounded-md bg-[var(--pd-label-bg)] p-1 text-sm text-[var(--pd-label-text)]"><div aria-label="Provider info circle"></div> <span class="min-w-0 flex-1 overflow-x-hidden text-ellipsis whitespace-nowrap"> </span></div>`),D.__docgen={data:[{name:`type`,visibility:`public`,description:`Provider connection type driving the colored indicator.`,keywords:[],kind:`let`,type:{kind:`union`,type:[{kind:`const`,type:`string`,value:`kubernetes`,text:`"kubernetes"`},{kind:`const`,type:`string`,value:`podman`,text:`"podman"`},{kind:`const`,type:`string`,value:`docker`,text:`"docker"`}],text:`"kubernetes" | "podman" | "docker"`},static:!1,readonly:!1},{name:`name`,visibility:`public`,description:`Label text (connection type, or displayName when multiple connections share a type).`,keywords:[{name:`required`,description:``}],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1},{name:`tip`,visibility:`public`,description:"Tooltip content — typically `connection.endpoint.socketPath`.",keywords:[],kind:`let`,type:{kind:`type`,type:`string`,text:`string`},static:!1,readonly:!1,defaultValue:`""`}],name:`MockContainerEngineEnvironmentColumn.svelte`}})))()}function A(e,t){v(t,!1),w();var n=q(),r=l(n);N(r,{name:`Basic`,args:{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var i=o(r,2);N(i,{name:`Provider Types`,args:{kind:`providers`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var a=o(i,2);N(a,{name:`Display Names`,args:{kind:`displayNames`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var s=o(a,2);N(s,{name:`Tooltips`,args:{kind:`tooltips`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var c=o(s,2);N(c,{name:`Table Cell Contexts`,args:{kind:`tableContexts`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var u=o(c,2);N(u,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}});var d=o(u,2);N(d,{name:`Comparison`,args:{kind:`comparison`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'providers'}
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
{/if}`}}}),m(e,n),x()}var j,M,N,P,F,I,L,R,ce,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$,le,ue,de;function fe(){return(fe=e((()=>{n(),b(),E(),u(),ne(),k(),h(),re(),j=(e,n,u=d)=>{let p=()=>te(n?.(),[`_children`]);var h=ee(),g=l(h),_=e=>{var n=ce(),l=o(c(n),2);t(l,5,()=>P,e=>e.label,(e,t)=>{var n=R(),l=c(n),u=a(l,!0),d=o(l,2);D(c(d),{get type(){return r(t).type},get name(){return r(t).name},get tip(){return r(t).tip}}),i(d);var f=o(d,2),p=a(f,!0),h=o(f,2),g=e=>{var n=L(),i=a(n,!0);s(()=>S(i,r(t).note)),m(e,n)};y(h,e=>{r(t).note&&e(g)}),i(n),s(()=>{S(u,r(t).label),S(p,r(t).token)}),m(e,n)}),i(l),i(n),m(e,n)},v=e=>{var n=B(),l=o(c(n),2);t(l,5,()=>F,e=>e.label,(e,t)=>{var n=z(),l=c(n);D(c(l),{get type(){return r(t).type},get name(){return r(t).name},get tip(){return r(t).tip}}),i(l);var u=o(l,2),d=c(u),f=a(d,!0),p=o(d,2),h=a(p,!0);i(u),i(n),s(()=>{S(f,r(t).label),S(h,r(t).note)}),m(e,n)}),i(l),i(n),m(e,n)},b=e=>{var t=V(),n=o(c(t),2),r=c(n),a=o(c(r),2);D(c(a),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),i(a),f(2),i(r);var s=o(r,2),l=o(c(s),2);D(c(l),{type:`docker`,name:`docker`,tip:``}),i(l),f(2),i(s);var u=o(s,2),d=o(c(u),2);D(c(d),{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),i(d),f(2),i(u);var p=o(u,2),h=o(c(p),2);D(c(h),{type:`podman`,name:`Very Long Podman Machine Display Name`,tip:`/Users/example/.local/share/containers/podman/machine/qemu/podman.sock`}),i(h),f(2),i(p),i(n),i(t),m(e,t)},x=e=>{var n=U(),l=o(c(n),2);t(l,1,()=>I,e=>e.list,(e,t)=>{var n=H(),l=c(n),u=a(l),d=o(l,2),f=o(c(d),2),p=c(f),h=a(p,!0),g=o(p,2),_=a(g,!0);i(f);var v=o(f,4);D(c(v),{get type(){return r(t).type},get name(){return r(t).name},get tip(){return r(t).tip}}),i(v),i(d),i(n),s(e=>{S(u,`${r(t).list??``} list`),S(h,r(t).resource),S(_,e)},[()=>r(t).list.slice(0,-1)]),m(e,n)}),i(n),m(e,n)},w=e=>{var t=W(),n=o(c(t),2),r=c(n),a=o(c(r),2);D(c(a),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),i(a),f(2),i(r);var s=o(r,2),l=o(c(s),2);D(c(l),{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),i(l),f(2),i(s);var u=o(s,2),d=o(c(u),2),p=c(d);D(p,{type:`podman`,name:`podman`,tip:`/run/podman/podman.sock`});var h=o(p,2);D(h,{type:`docker`,name:`docker`,tip:`/var/run/docker.sock`}),D(o(h,2),{name:`unknown.engine`}),i(d),f(2),i(u),f(2),i(n),i(t),m(e,t)},T=e=>{var t=G(),n=o(c(t),4);D(o(c(n),2),{type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}),i(n),i(t),m(e,t)},E=e=>{var t=K(),n=c(t);{let e=C(()=>p().name??`podman`),t=C(()=>p().tip??``);D(n,{get type(){return p().type},get name(){return r(e)},get tip(){return r(t)}})}i(t),m(e,t)};y(g,e=>{p().kind===`providers`?e(_):p().kind===`displayNames`?e(v,1):p().kind===`tooltips`?e(b,2):p().kind===`tableContexts`?e(x,3):p().kind===`accessibility`?e(w,4):p().kind===`comparison`?e(T,5):e(E,-1)}),m(e,h)},M={render:j,title:`ContainerEngineEnvironmentColumn`,tags:[`autodocs`],argTypes:{type:{control:`select`,options:[`podman`,`docker`,`kubernetes`,void 0],description:`Provider connection type (colored circle)`},name:{control:`text`,description:`Display label (type when single connection; displayName when multiple)`},tip:{control:`text`,description:`Tooltip text (connection endpoint socket path)`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:"Stories for the `ContainerEngineEnvironmentColumn` component from `packages/renderer`.\n\nEngine/provider indicator column used in Containers, Images, Volumes, Networks,\nand Pods list tables. Renders a `Label` with a colored `ProviderInfoCircle` and\nan optional tooltip showing the connection socket path.\n\nThe real column resolves `object.engineId` against `providerInfos` /\n`containerConnectionCount` stores. These stories use a presentation helper that\naccepts the resolved props (`type`, `name`, `tip`) so current visuals can be\ndocumented without store wiring.\n\n**Theming**: Uses CSS custom properties `--pd-provider-podman`,\n`--pd-provider-docker`, `--pd-provider-kubernetes`, `--pd-provider-unknown`,\n`--pd-label-bg`, and `--pd-label-text` from the color registry.\n\n**Planned modernization** (#18120): Replace the plain colored circle with an\nicon-based provider indicator consistent with the design system (e.g. StatusDot\n/ StatusDotIcon pattern)."}}}},{Story:N}=ie(M),P=[{label:`Podman`,type:`podman`,name:`podman`,tip:`/var/run/podman-machine.sock`,token:`--pd-provider-podman`},{label:`Docker`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`,token:`--pd-provider-docker`},{label:`Kubernetes`,type:`kubernetes`,name:`kubernetes`,tip:``,token:`--pd-provider-kubernetes`,note:`Rare in this column; circle supports kubernetes type`},{label:`Unknown / unresolved`,type:void 0,name:`podman.missing-connection`,tip:``,token:`--pd-provider-unknown`,note:`Falls back to engineId as label when connection is missing`}],F=[{label:`Single docker connection`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`,note:`containerConnectionCount[docker] === 1 → show connection.type`},{label:`Multiple podman — default machine`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`,note:`containerConnectionCount[podman] > 1 → show connection.displayName`},{label:`Multiple podman — remote`,type:`podman`,name:`Podman Remote`,tip:`/var/run/podman-remote.sock`,note:`containerConnectionCount[podman] > 1 → show connection.displayName`},{label:`Unresolved engineId`,type:void 0,name:`podman.unknown-machine`,tip:``,note:`No matching connection → show raw object.engineId`}],I=[{resource:`nginx`,list:`Containers`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`},{resource:`docker.io/library/alpine:latest`,list:`Images`,type:`docker`,name:`docker`,tip:`/var/run/docker.sock`},{resource:`my-volume`,list:`Volumes`,type:`podman`,name:`Podman Remote`,tip:`/var/run/podman-remote.sock`},{resource:`bridge`,list:`Networks`,type:`podman`,name:`podman`,tip:`/run/podman/podman.sock`},{resource:`my-web-app-pod`,list:`Pods`,type:`podman`,name:`Podman Machine Default`,tip:`/var/run/podman-machine.sock`}],L=T(`<div class="text-[10px] text-(--pd-content-text)"> </div>`),R=T(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code> <!></div>`),ce=T(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Provider type drives the colored circle via <code>ProviderInfoCircle</code> and <code>providerColors</code>. Colors come from the color registry tokens below.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"></div></div>`),z=T(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3 sm:flex-row sm:items-center sm:gap-6"><div class="w-full max-w-xs shrink-0"><!></div> <div class="flex flex-col gap-1"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),B=T(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Display name logic from <code>ContainerEngineEnvironmentColumn</code>: when more than one
        connection shares a type, show <code>connection.displayName</code>; otherwise show <code>connection.type</code>. If no connection matches, fall back to <code>object.engineId</code>.</div> <div class="flex flex-col gap-3"></div></div>`),V=T(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Tooltip content is <code>connection?.endpoint?.socketPath</code>. Hover each label to verify
        tip behavior is preserved.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With socket path</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/podman-machine.sock"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Empty tip (no tooltip)</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">tip="" — Label still renders, no tip</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Docker socket</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">tip="/var/run/docker.sock"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Long path truncation in label</div> <div class="max-w-[10rem] py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Narrow column — label ellipsizes; tip remains full path</code></div></div></div>`),H=T(`<div class="flex flex-col gap-2"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)"> </div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5" disabled=""/></div> <div class="min-w-0 flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="truncate text-sm text-(--pd-content-header)"> </div> <div class="text-xs text-(--pd-content-text)"> </div></div> <div class="w-24 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-48 shrink-0 px-3 py-2"><!></div></div></div>`),U=T(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">The Environment column appears in five list tables. Each row below mocks a typical table
        cell layout with the Environment column on the right.</div> <!></div>`),W=T(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Current accessibility surface before modernization. The circle is a plain <code>div</code> with <code>aria-label="Provider info circle"</code> — color is the only
        differentiator by provider type.</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">ARIA on circle</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">aria-label="Provider info circle"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Tooltip conveys socket path</div> <div class="max-w-xs py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Pointer-hover only — no focusable trigger for keyboard access</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div> <div class="flex max-w-xs flex-col gap-2 py-2"><!> <!> <!></div> <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify tokens</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Known gaps (modernization)</div> <ul class="list-disc space-y-1 pl-5 text-[10px] text-(--pd-content-text)"><li>Color-only differentiation — no icon shape per provider</li> <li>Circle is a raw <code>div</code>, not an SVG icon</li> <li>Dot is 8×8px (<code>min-w-2 min-h-2</code>) — small visible size; color-only non-text contrast</li></ul></div></div></div>`),G=T(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Side-by-side of the current plain-dot treatment versus the icon-based pattern used by
        modernized status indicators (reference for #18120).</div> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Current — ProviderInfoCircle</div> <div class="flex items-center gap-3 py-2"><div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-podman)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-docker)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-kubernetes)"></div> <div aria-label="Provider info circle" class="min-h-2 min-w-2 rounded-full bg-(--pd-provider-unknown)"></div></div> <code class="text-[10px] text-(--pd-content-text)">8×8px colored divs — color only</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Target direction — icon-based</div> <div class="text-sm text-(--pd-content-text) py-2">Match <code>StatusDot</code> / <code>StatusDotIcon</code>: SVG icons with <code>role="img"</code>, larger visible indicator, and shape + color differentiation.</div> <code class="text-[10px] text-(--pd-content-text)">See StatusDot stories and #14008</code></div></div> <div class="max-w-xs"><div class="mb-2 text-xs font-semibold text-(--pd-content-header)">Full column (current)</div> <!></div></div>`),K=T(`<div class="max-w-xs"><!></div>`),q=T(`<!> <!> <!> <!> <!> <!> <!>`,1),A.__docgen={data:[],name:`ContainerEngineEnvironmentColumn.stories.svelte`},J=ae(A,M),Y=[`Basic`,`ProviderTypes`,`DisplayNames`,`Tooltips`,`TableCellContexts`,`Accessibility`,`Comparison`],X={...J.Basic,tags:[`svelte-csf-v5`]},Z={...J.ProviderTypes,tags:[`svelte-csf-v5`]},Q={...J.DisplayNames,tags:[`svelte-csf-v5`]},$={...J.Tooltips,tags:[`svelte-csf-v5`]},le={...J.TableCellContexts,tags:[`svelte-csf-v5`]},ue={...J.Accessibility,tags:[`svelte-csf-v5`]},de={...J.Comparison,tags:[`svelte-csf-v5`]}})))()}fe();export{ue as Accessibility,X as Basic,de as Comparison,Q as DisplayNames,Z as ProviderTypes,le as TableCellContexts,$ as Tooltips,Y as __namedExportsOrder,M as default};