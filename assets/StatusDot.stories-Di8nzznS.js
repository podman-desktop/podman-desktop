import{i as e}from"./preload-helper-xPQekRTU.js";import{$ as t,It as n,Lt as r,Nt as i,P as a,Sn as o,St as s,V as c,X as l,Yt as u,Z as d,Zt as f,b as p,dt as m,ft as h,gn as g,hn as _,ln as v,lt as y,nn as b,pn as x,pt as S,rn as C,s as w,un as T,yn as E,zt as D}from"./iframe-D87ELSp4.js";import{a as O,i as k,n as A,r as j,t as M}from"./create-runtime-stories-DrwRzaM4.js";import{r as N}from"./ErrorMessage-DcnTBXc1.js";import{t as P}from"./dist-HteeXx0q.js";function F(e){return G[e]??`bg-(--pd-status-unknown)`}function I(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ee(e,t,n){return e===``?t&&n?`${t}: ${I(n)}`:I(n):e}function L(e){return F(e).includes(`outline`)}function R(e){return e.map((e,t)=>({name:`container-${t+1}`,status:e}))}function z(e){let t=[`running`,`created`,`paused`,`waiting`,`degraded`,`exited`,`stopped`,`terminated`,`dead`],n={};for(let e of t)n[e]=[];for(let t of e){let e=t.status.toLowerCase();n[e]||(n[e]=[]),n[e].push(t)}return n}function B(e,t){C(t,!1),p();var n=Ce(),i=r(n);H(i,{name:`Basic`,args:{status:`running`,name:`my-container`,tooltip:``,number:0},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}});var a=D(i,2);H(a,{name:`All Statuses`,args:{kind:`allStatuses`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}});var o=D(a,2);H(o,{name:`Number Badges`,args:{kind:`numberBadges`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}});var s=D(o,2);H(s,{name:`Pod Container Row (Individual)`,args:{kind:`podRowIndividual`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}});var c=D(s,2);H(c,{name:`Pod Container Row (Grouped)`,args:{kind:`podRowGrouped`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}});var l=D(c,2);H(l,{name:`Table Cell Context`,args:{kind:`tableCell`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}});var u=D(l,2);H(u,{name:`Density Stress Test`,args:{kind:`stressTest`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}}),H(D(u,2),{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
      notable states. <strong>Outlined</strong> dots use an outline border for inactive states.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each filledStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {#each outlinedStatuses as entry (entry.status)}
          <div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3">
            <Tooltip top tip="{capitalize(entry.status)}">
              <div
                class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline {getStatusColor(entry.status)}"
                title={capitalize(entry.status)}>
              </div>
            </Tooltip>
            <div class="flex flex-col">
              <div class="text-xs font-semibold text-(--pd-content-header)">{entry.status}</div>
              <code class="text-[10px] text-(--pd-content-text)">{entry.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'numberBadges'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      When a pod has more than 10 containers, dots are grouped by status with a count badge below.
      The dot shifts down (<code>mt-3</code>) to align with the number text.
    </div>

    <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4">
      {#each [{ status: 'running', count: 5 }, { status: 'stopped', count: 3 }, { status: 'exited', count: 2 }, { status: 'paused', count: 1 }] as badge (badge.status)}
        <Tooltip top tip="{capitalize(badge.status)}: {badge.count}">
          <div class="flex flex-col items-center">
            <div
              class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(badge.status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(badge.status)}"
              title="{capitalize(badge.status)}: {badge.count}">
            </div>
            <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{badge.count}</div>
          </div>
        </Tooltip>
      {/each}
    </div>
  </div>

{:else if args.kind === 'podRowIndividual'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {fewContainerStatuses.length} containers (at or below 10 threshold).
      Each container gets its own dot. This is the <code>Dots.svelte</code> layout for small pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div>
      <div class="flex items-center flex-wrap">
        {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
          {#each containers as container, i (i)}
            <Tooltip top tip="{container.name}: {capitalize(status)}">
              <div
                class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                title="{container.name}: {capitalize(status)}">
              </div>
            </Tooltip>
          {/each}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'podRowGrouped'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Pod with {manyContainerStatuses.length} containers (above 10 threshold).
      Containers are grouped by status with count badges. This is the <code>Dots.svelte</code> layout for large pods.
    </div>

    <div class="rounded border border-(--pd-content-divider) p-4">
      <div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div>
      <div class="flex items-start">
        {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
          {#if containers.length > 0}
            <Tooltip top tip="{capitalize(status)}: {containers.length}">
              <div class="flex flex-col items-center">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="{capitalize(status)}: {containers.length}">
                </div>
                <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
              </div>
            </Tooltip>
          {/if}
        {/each}
      </div>
    </div>
  </div>

{:else if args.kind === 'tableCell'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
      the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
      row height and column width.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-center flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(fewContainerStatuses))) as [status, containers] (status)}
              {#each containers as container, i (i)}
                <Tooltip top tip="{container.name}: {capitalize(status)}">
                  <div
                    class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                    title="{container.name}: {capitalize(status)}">
                  </div>
                </Tooltip>
              {/each}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">3m ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div>
          <div class="text-xs text-(--pd-content-text)">podman</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Degraded</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <button class="cursor-pointer flex items-start flex-wrap">
            {#each Object.entries(organizeContainers(makeMockContainers(manyContainerStatuses))) as [status, containers] (status)}
              {#if containers.length > 0}
                <Tooltip top tip="{capitalize(status)}: {containers.length}">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{capitalize(status)}: {containers.length}">
                    </div>
                    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{containers.length}</div>
                  </div>
                </Tooltip>
              {/if}
            {/each}
          </button>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">1h ago</span>
        </div>
      </div>

      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div>
      <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)">
        <div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)">
          <input type="checkbox" class="w-3.5 h-3.5" />
        </div>
        <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div>
          <div class="text-xs text-(--pd-content-text)">kubernetes</div>
        </div>
        <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)">
          <span class="text-xs text-(--pd-content-text)">Running</span>
        </div>
        <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)">
          <div class="flex items-center flex-wrap">
            {#each ['running', 'running', 'waiting'] as status, i (i)}
              <Tooltip top tip="container-{i + 1}: {capitalize(status)}">
                <div
                  class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title="container-{i + 1}: {capitalize(status)}">
                </div>
              </Tooltip>
            {/each}
          </div>
        </div>
        <div class="w-16 px-3 py-2 text-right">
          <span class="text-xs text-(--pd-content-text)">12m ago</span>
        </div>
      </div>
    </div>
  </div>

{:else if args.kind === 'stressTest'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
      Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.
    </div>

    {#each stressTests as test (test.label)}
      {@const containers = makeMockContainers(test.statuses)}
      {@const grouped = containers.length > 10}
      {@const organized = organizeContainers(containers)}

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="flex items-center gap-2">
          <div class="text-xs font-semibold text-(--pd-content-header)">{test.label}</div>
          <code class="text-[10px] text-(--pd-content-text)">({containers.length} total, {grouped ? 'grouped' : 'individual'})</code>
        </div>

        <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2">
          <div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div>
          <div class="flex items-start flex-wrap">
            {#if grouped}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#if statusContainers.length > 0}
                  <Tooltip top tip="{capitalize(status)}: {statusContainers.length}">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-2 h-2 mr-0.5 rounded-full mt-3 {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                        title="{capitalize(status)}: {statusContainers.length}">
                      </div>
                      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{statusContainers.length}</div>
                    </div>
                  </Tooltip>
                {/if}
              {/each}
            {:else}
              {#each Object.entries(organized) as [status, statusContainers] (status)}
                {#each statusContainers as container, i (i)}
                  <Tooltip top tip="{container.name}: {capitalize(status)}">
                    <div
                      class="w-2 h-2 mr-0.5 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                      title="{container.name}: {capitalize(status)}">
                    </div>
                  </Tooltip>
                {/each}
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Current accessibility characteristics and known gaps.
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div>
          <div class="flex items-center gap-2 py-2">
            <Tooltip top tip="my-container: Running">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>
            </Tooltip>
            <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div>
          <div class="flex items-center gap-3 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div>
              <span class="text-xs text-(--pd-content-text)">Filled</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div>
              <span class="text-xs text-(--pd-content-text)">Outlined</span>
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div>
          <div class="flex items-center gap-2 py-2">
            {#each ['running', 'stopped', 'dead', 'paused'] as status (status)}
              <Tooltip top tip={capitalize(status)}>
                <div
                  class="w-2 h-2 rounded-full {isOutlined(status) ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)}"
                  title={capitalize(status)}>
                </div>
              </Tooltip>
            {/each}
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code>
        </div>

        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div>
          <div class="py-2">
            <div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no
              <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the
              <code>title</code> attribute.
            </div>
          </div>
          <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div>
      <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1">
        <li>Color is the only way to distinguish between most statuses</li>
        <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li>
        <li>No shape or icon variation to differentiate statuses without color</li>
        <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li>
        <li>Outlined dots may be hard to see on some backgrounds at this size</li>
      </ul>
    </div>
  </div>

{:else}
  {@const status = args.status ?? 'running'}
  {@const name = args.name ?? ''}
  {@const customTooltip = args.tooltip ?? ''}
  {@const number = args.number ?? 0}
  {@const tip = buildTooltip(customTooltip, name, status)}
  {@const outlined = isOutlined(status)}

  <Tooltip top {tip}>
    <div
      class="w-2 h-2 mr-0.5 rounded-full text-center {outlined ? 'outline-2 outline-offset-[-2px] outline' : ''} {getStatusColor(status)} {number ? 'mt-3' : ''}"
      title={tip}>
    </div>
    {#if number}
      <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
    {/if}
  </Tooltip>
{/if}`}}}),m(e,n),b()}var te,V,H,U,ne,W,G,K,q,J,Y,X,Z,Q,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me,he,ge,_e,ve,ye,be,xe,Se,Ce,$,we,Te,Ee,De,Oe,ke,Ae,je,Me;e((()=>{o(),O(),E(),P(),k(),w(),A(),te=(e,o,p=_)=>{let b=()=>x(o?.(),[`_children`]);var S=h(),C=r(S),w=e=>{var t=re(),r=D(n(t),2),o=D(n(r),2);l(o,5,()=>ne,e=>e.status,(e,t)=>{var r=X(),o=n(r);{let e=u(()=>I(s(t).status));N(o,{top:!0,get tip(){return s(e)},children:(e,n)=>{var r=Y();i((e,t)=>{c(r,1,`w-2 h-2 rounded-full ${e??``}`),a(r,`title`,t)},[()=>F(s(t).status),()=>I(s(t).status)]),m(e,r)},$$slots:{default:!0}})}var l=D(o,2),d=n(l),f=n(d,!0);T(d);var p=D(d,2),h=n(p,!0);T(p),T(l),T(r),i(()=>{y(f,s(t).status),y(h,s(t).token)}),m(e,r)}),T(o),T(r);var d=D(r,2),f=D(n(d),2);l(f,5,()=>W,e=>e.status,(e,t)=>{var r=Q(),o=n(r);{let e=u(()=>I(s(t).status));N(o,{top:!0,get tip(){return s(e)},children:(e,n)=>{var r=Z();i((e,t)=>{c(r,1,`w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline ${e??``}`),a(r,`title`,t)},[()=>F(s(t).status),()=>I(s(t).status)]),m(e,r)},$$slots:{default:!0}})}var l=D(o,2),d=n(l),f=n(d,!0);T(d);var p=D(d,2),h=n(p,!0);T(p),T(l),T(r),i(()=>{y(f,s(t).status),y(h,s(t).token)}),m(e,r)}),T(f),T(d),T(t),m(e,t)},E=e=>{var t=ae(),r=D(n(t),2);l(r,4,()=>[{status:`running`,count:5},{status:`stopped`,count:3},{status:`exited`,count:2},{status:`paused`,count:1}],e=>e.status,(e,t)=>{{let r=u(()=>I(t.status)),o=u(()=>t.count);N(e,{top:!0,get tip(){return`${s(r)??``}: ${s(o)??``}`},children:(e,r)=>{var o=ie(),s=n(o),l=D(s,2),u=n(l,!0);T(l),T(o),i((e,n,r)=>{c(s,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${n??``}`),a(s,`title`,`${r??``}: ${t.count??``}`),y(u,t.count)},[()=>L(t.status)?`outline-2 outline-offset-[-2px] outline`:``,()=>F(t.status),()=>I(t.status)]),m(e,o)},$$slots:{default:!0}})}}),T(r),T(t),m(e,t)},O=e=>{var t=se(),o=n(t),p=n(o);v(2),T(o);var _=D(o,2),b=D(n(_),2);l(b,5,()=>Object.entries(z(R(K))),([e,t])=>e,(e,t)=>{var n=f(()=>g(s(t),2));let o=()=>s(n)[0],p=()=>s(n)[1];var _=h();l(r(_),1,p,d,(e,t)=>{{let n=u(()=>s(t).name),r=u(()=>I(o()));N(e,{top:!0,get tip(){return`${s(n)??``}: ${s(r)??``}`},children:(e,n)=>{var r=oe();i((e,n,i)=>{c(r,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${n??``}`),a(r,`title`,`${s(t).name??``}: ${i??``}`)},[()=>L(o())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(o()),()=>I(o())]),m(e,r)},$$slots:{default:!0}})}}),m(e,_)}),T(b),T(_),T(t),i(()=>y(p,`Pod with ${K.length??``} containers (at or below 10 threshold).
        Each container gets its own dot. This is the `)),m(e,t)},k=e=>{var o=le(),d=n(o),p=n(d);v(2),T(d);var _=D(d,2),b=D(n(_),2);l(b,5,()=>Object.entries(z(R(q))),([e,t])=>e,(e,o)=>{var l=f(()=>g(s(o),2));let d=()=>s(l)[0],p=()=>s(l)[1];var _=h(),v=r(_),b=e=>{{let t=u(()=>I(d())),r=u(()=>p().length);N(e,{top:!0,get tip(){return`${s(t)??``}: ${s(r)??``}`},children:(e,t)=>{var r=ce(),o=n(r),s=D(o,2),l=n(s,!0);T(s),T(r),i((e,t,n)=>{c(o,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${t??``}`),a(o,`title`,`${n??``}: ${p().length??``}`),y(l,p().length)},[()=>L(d())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(d()),()=>I(d())]),m(e,r)},$$slots:{default:!0}})}};t(v,e=>{p().length>0&&e(b)}),m(e,_)}),T(b),T(_),T(o),i(()=>y(p,`Pod with ${q.length??``} containers (above 10 threshold).
        Containers are grouped by status with count badges. This is the `)),m(e,o)},A=e=>{var o=pe(),p=D(n(o),2),_=D(n(p),2),b=D(n(_),6),x=n(b);l(x,5,()=>Object.entries(z(R(K))),([e,t])=>e,(e,t)=>{var n=f(()=>g(s(t),2));let o=()=>s(n)[0],p=()=>s(n)[1];var _=h();l(r(_),1,p,d,(e,t)=>{{let n=u(()=>s(t).name),r=u(()=>I(o()));N(e,{top:!0,get tip(){return`${s(n)??``}: ${s(r)??``}`},children:(e,n)=>{var r=ue();i((e,n,i)=>{c(r,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${n??``}`),a(r,`title`,`${s(t).name??``}: ${i??``}`)},[()=>L(o())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(o()),()=>I(o())]),m(e,r)},$$slots:{default:!0}})}}),m(e,_)}),T(x),T(b),v(2),T(_);var S=D(_,4),C=D(n(S),6),w=n(C);l(w,5,()=>Object.entries(z(R(q))),([e,t])=>e,(e,o)=>{var l=f(()=>g(s(o),2));let d=()=>s(l)[0],p=()=>s(l)[1];var _=h(),v=r(_),b=e=>{{let t=u(()=>I(d())),r=u(()=>p().length);N(e,{top:!0,get tip(){return`${s(t)??``}: ${s(r)??``}`},children:(e,t)=>{var r=de(),o=n(r),s=D(o,2),l=n(s,!0);T(s),T(r),i((e,t,n)=>{c(o,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${t??``}`),a(o,`title`,`${n??``}: ${p().length??``}`),y(l,p().length)},[()=>L(d())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(d()),()=>I(d())]),m(e,r)},$$slots:{default:!0}})}};t(v,e=>{p().length>0&&e(b)}),m(e,_)}),T(w),T(C),v(2),T(S);var E=D(S,4),O=D(n(E),6),k=n(O);l(k,4,()=>[`running`,`running`,`waiting`],d,(e,t,n)=>{{let r=u(()=>I(t));N(e,{top:!0,get tip(){return`container-${n+1}: ${s(r)??``}`},children:(e,r)=>{var o=fe();i((e,t,r)=>{c(o,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${t??``}`),a(o,`title`,`container-${n+1}: ${r??``}`)},[()=>L(t)?`outline-2 outline-offset-[-2px] outline`:``,()=>F(t),()=>I(t)]),m(e,o)},$$slots:{default:!0}})}}),T(k),T(O),v(2),T(E),T(p),T(o),m(e,o)},j=e=>{var o=_e();l(D(n(o),2),1,()=>J,e=>e.label,(e,o)=>{let p=u(()=>R(s(o).statuses)),_=u(()=>s(p).length>10),v=u(()=>z(s(p)));var b=ge(),x=n(b),S=n(x),C=n(S,!0);T(S);var w=D(S,2),E=n(w);T(w),T(x);var O=D(x,2),k=D(n(O),2),A=n(k),j=e=>{var o=h();l(r(o),1,()=>Object.entries(s(v)),([e,t])=>e,(e,o)=>{var l=f(()=>g(s(o),2));let d=()=>s(l)[0],p=()=>s(l)[1];var _=h(),v=r(_),b=e=>{{let t=u(()=>I(d())),r=u(()=>p().length);N(e,{top:!0,get tip(){return`${s(t)??``}: ${s(r)??``}`},children:(e,t)=>{var r=me(),o=n(r),s=D(o,2),l=n(s,!0);T(s),T(r),i((e,t,n)=>{c(o,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${t??``}`),a(o,`title`,`${n??``}: ${p().length??``}`),y(l,p().length)},[()=>L(d())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(d()),()=>I(d())]),m(e,r)},$$slots:{default:!0}})}};t(v,e=>{p().length>0&&e(b)}),m(e,_)}),m(e,o)},M=e=>{var t=h();l(r(t),1,()=>Object.entries(s(v)),([e,t])=>e,(e,t)=>{var n=f(()=>g(s(t),2));let o=()=>s(n)[0],p=()=>s(n)[1];var _=h();l(r(_),1,p,d,(e,t)=>{{let n=u(()=>s(t).name),r=u(()=>I(o()));N(e,{top:!0,get tip(){return`${s(n)??``}: ${s(r)??``}`},children:(e,n)=>{var r=he();i((e,n,i)=>{c(r,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${n??``}`),a(r,`title`,`${s(t).name??``}: ${i??``}`)},[()=>L(o())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(o()),()=>I(o())]),m(e,r)},$$slots:{default:!0}})}}),m(e,_)}),m(e,t)};t(A,e=>{s(_)?e(j):e(M,-1)}),T(k),T(O),T(b),i(()=>{y(C,s(o).label),y(E,`(${s(p).length??``} total, ${s(_)?`grouped`:`individual`})`)}),m(e,b)}),T(o),m(e,o)},M=e=>{var t=be(),r=D(n(t),2),o=D(n(r),2),d=n(o),f=D(n(d),2);N(n(f),{top:!0,tip:`my-container: Running`,children:(e,t)=>{m(e,ve())},$$slots:{default:!0}}),v(2),T(f),v(2),T(d);var p=D(d,4),h=D(n(p),2);l(h,4,()=>[`running`,`stopped`,`dead`,`paused`],e=>e,(e,t)=>{{let n=u(()=>I(t));N(e,{top:!0,get tip(){return s(n)},children:(e,n)=>{var r=ye();i((e,t,n)=>{c(r,1,`w-2 h-2 rounded-full ${e??``} ${t??``}`),a(r,`title`,n)},[()=>L(t)?`outline-2 outline-offset-[-2px] outline`:``,()=>F(t),()=>I(t)]),m(e,r)},$$slots:{default:!0}})}}),T(h),v(2),T(p),v(2),T(o),T(r),v(2),T(t),m(e,t)},P=e=>{let o=u(()=>b().status??`running`),l=u(()=>b().name??``),d=u(()=>b().tooltip??``),f=u(()=>b().number??0),p=u(()=>ee(s(d),s(l),s(o))),h=u(()=>L(s(o)));N(e,{top:!0,get tip(){return s(p)},children:(e,l)=>{var u=Se(),d=r(u),g=D(d,2),_=e=>{var t=xe(),r=n(t,!0);T(t),i(()=>y(r,s(f))),m(e,t)};t(g,e=>{s(f)&&e(_)}),i(e=>{c(d,1,`w-2 h-2 mr-0.5 rounded-full text-center ${s(h)?`outline-2 outline-offset-[-2px] outline`:``} ${e??``} ${s(f)?`mt-3`:``}`),a(d,`title`,s(p))},[()=>F(s(o))]),m(e,u)},$$slots:{default:!0}})};t(C,e=>{b().kind===`allStatuses`?e(w):b().kind===`numberBadges`?e(E,1):b().kind===`podRowIndividual`?e(O,2):b().kind===`podRowGrouped`?e(k,3):b().kind===`tableCell`?e(A,4):b().kind===`stressTest`?e(j,5):b().kind===`accessibility`?e(M,6):e(P,-1)}),m(e,S)},V={render:te,title:`StatusDot`,tags:[`autodocs`],argTypes:{status:{control:`select`,options:[`running`,`terminated`,`waiting`,`stopped`,`paused`,`exited`,`dead`,`created`,`degraded`,`unknown`],description:`Container status string`},name:{control:`text`,description:`Container name (used in auto-generated tooltip)`},tooltip:{control:`text`,description:`Custom tooltip text (overrides auto-generated)`},number:{control:{type:`number`,min:0},description:`Count badge shown below the dot (0 = hidden)`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:`Stories for the \`StatusDot\` component from \`packages/renderer\`.

A small colored circle indicating container or pod status. Supports filled
(active) and outlined (inactive) rendering modes, optional tooltip, and
an optional count badge for grouped display.

Used inside the Pods list table (both Podman and Kubernetes) via the
\`Dots.svelte\` wrapper.

**Planned modernization:** The dot will be replaced with a larger SVG icon
so status is not communicated by color alone (a11y).`}}}},{Story:H}=j(V),U=[{status:`running`,mode:`filled`,token:`--pd-status-running`},{status:`terminated`,mode:`filled`,token:`--pd-status-terminated`},{status:`waiting`,mode:`filled`,token:`--pd-status-waiting`},{status:`paused`,mode:`filled`,token:`--pd-status-paused`},{status:`degraded`,mode:`filled`,token:`--pd-status-degraded`},{status:`dead`,mode:`filled`,token:`--pd-status-dead`},{status:`unknown`,mode:`filled`,token:`--pd-status-unknown`},{status:`stopped`,mode:`outlined`,token:`--pd-status-stopped`},{status:`exited`,mode:`outlined`,token:`--pd-status-exited`},{status:`created`,mode:`outlined`,token:`--pd-status-created`}],ne=U.filter(e=>e.mode===`filled`),W=U.filter(e=>e.mode===`outlined`),G={running:`bg-(--pd-status-running)`,terminated:`bg-(--pd-status-terminated)`,waiting:`bg-(--pd-status-waiting)`,stopped:`outline-(--pd-status-stopped)`,paused:`bg-(--pd-status-paused)`,exited:`outline-(--pd-status-exited)`,dead:`bg-(--pd-status-dead)`,created:`outline-(--pd-status-created)`,degraded:`bg-(--pd-status-degraded)`,unknown:`bg-(--pd-status-unknown)`},K=[`running`,`running`,`running`,`stopped`,`paused`,`running`,`exited`],q=[...Array.from({length:8},()=>`running`),...Array.from({length:3},()=>`stopped`),...Array.from({length:2},()=>`exited`),`paused`,`degraded`],J=[{label:`1 container`,statuses:[`running`]},{label:`10 containers (individual threshold)`,statuses:Array.from({length:10},(e,t)=>t<7?`running`:t<9?`stopped`:`exited`)},{label:`11 containers (grouped threshold)`,statuses:[...Array.from({length:8},()=>`running`),`stopped`,`stopped`,`exited`]},{label:`50 containers`,statuses:[...Array.from({length:30},()=>`running`),...Array.from({length:10},()=>`stopped`),...Array.from({length:5},()=>`exited`),...Array.from({length:3},()=>`paused`),`degraded`,`dead`]},{label:`All same status`,statuses:Array.from({length:8},()=>`running`)}],Y=S(`<div></div>`),X=S(`<div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3"><!> <div class="flex flex-col"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),Z=S(`<div></div>`),Q=S(`<div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3"><!> <div class="flex flex-col"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),re=S(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
        notable states. <strong>Outlined</strong> dots use an outline border for inactive states.</div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div> <div class="grid grid-cols-2 gap-3 sm:grid-cols-4"></div></div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div> <div class="grid grid-cols-2 gap-3 sm:grid-cols-3"></div></div></div>`),ie=S(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),ae=S(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">When a pod has more than 10 containers, dots are grouped by status with a count badge below.
        The dot shifts down (<code>mt-3</code>) to align with the number text.</div> <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4"></div></div>`),oe=S(`<div></div>`),se=S(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)"> <code>Dots.svelte</code> layout for small pods.</div> <div class="rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div> <div class="flex items-center flex-wrap"></div></div></div>`),ce=S(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),le=S(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)"> <code>Dots.svelte</code> layout for large pods.</div> <div class="rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div> <div class="flex items-start"></div></div></div>`),ue=S(`<div></div>`),de=S(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),fe=S(`<div></div>`),pe=S(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
        the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
        row height and column width.</div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5"/></div> <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div> <div class="text-xs text-(--pd-content-text)">podman</div></div> <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)"><button class="cursor-pointer flex items-center flex-wrap"></button></div> <div class="w-16 px-3 py-2 text-right"><span class="text-xs text-(--pd-content-text)">3m ago</span></div></div> <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5"/></div> <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div> <div class="text-xs text-(--pd-content-text)">podman</div></div> <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Degraded</span></div> <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)"><button class="cursor-pointer flex items-start flex-wrap"></button></div> <div class="w-16 px-3 py-2 text-right"><span class="text-xs text-(--pd-content-text)">1h ago</span></div></div> <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5"/></div> <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div> <div class="text-xs text-(--pd-content-text)">kubernetes</div></div> <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)"><div class="flex items-center flex-wrap"></div></div> <div class="w-16 px-3 py-2 text-right"><span class="text-xs text-(--pd-content-text)">12m ago</span></div></div></div></div>`),me=S(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),he=S(`<div></div>`),ge=S(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="flex items-center gap-2"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div> <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2"><div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div> <div class="flex items-start flex-wrap"><!></div></div></div>`),_e=S(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
        Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.</div> <!></div>`),ve=S(`<div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>`),ye=S(`<div></div>`),be=S(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Current accessibility characteristics and known gaps.</div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div> <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div> <div class="flex items-center gap-2 py-2"><!> <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span></div> <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div> <div class="flex items-center gap-3 py-2"><div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div> <span class="text-xs text-(--pd-content-text)">Filled</span></div> <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div> <span class="text-xs text-(--pd-content-text)">Outlined</span></div></div> <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div> <div class="flex items-center gap-2 py-2"></div> <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div> <div class="py-2"><div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the <code>title</code> attribute.</div></div> <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code></div></div></div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div> <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1"><li>Color is the only way to distinguish between most statuses</li> <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li> <li>No shape or icon variation to differentiate statuses without color</li> <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li> <li>Outlined dots may be hard to see on some backgrounds at this size</li></ul></div></div>`),xe=S(`<div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div>`),Se=S(`<div></div> <!>`,1),Ce=S(`<!> <!> <!> <!> <!> <!> <!> <!>`,1),B.__docgen={data:[],name:`StatusDot.stories.svelte`},$=M(B,V),we=[`Basic`,`AllStatuses`,`NumberBadges`,`PodContainerRowIndividual`,`PodContainerRowGrouped`,`TableCellContext`,`DensityStressTest`,`Accessibility`],Te={...$.Basic,tags:[`svelte-csf-v5`]},Ee={...$.AllStatuses,tags:[`svelte-csf-v5`]},De={...$.NumberBadges,tags:[`svelte-csf-v5`]},Oe={...$.PodContainerRowIndividual,tags:[`svelte-csf-v5`]},ke={...$.PodContainerRowGrouped,tags:[`svelte-csf-v5`]},Ae={...$.TableCellContext,tags:[`svelte-csf-v5`]},je={...$.DensityStressTest,tags:[`svelte-csf-v5`]},Me={...$.Accessibility,tags:[`svelte-csf-v5`]}}))();export{Me as Accessibility,Ee as AllStatuses,Te as Basic,je as DensityStressTest,De as NumberBadges,ke as PodContainerRowGrouped,Oe as PodContainerRowIndividual,Ae as TableCellContext,we as __namedExportsOrder,V as default};