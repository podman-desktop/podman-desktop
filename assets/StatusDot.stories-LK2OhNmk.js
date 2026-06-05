import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t,Ft as n,It as r,Jt as i,Mt as a,N as o,Q as s,Rt as c,X as l,Xt as u,Y as d,cn as f,ct as p,dt as m,fn as h,ft as g,hn as _,ln as v,mn as y,nn as b,s as x,tn as S,ut as C,vn as w,xn as T,xt as E,y as D}from"./iframe-DOTDKAll.js";import{a as O,i as k,n as A,r as j,t as M}from"./create-runtime-stories-nV0eUVm6.js";import{r as N}from"./ErrorMessage-DP2578-T.js";import{t as P}from"./dist-T5kDptIH.js";function F(e){return G[e]??`bg-(--pd-status-unknown)`}function I(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ee(e,t,n){return e===``?t&&n?`${t}: ${I(n)}`:I(n):e}function L(e){return F(e).includes(`outline`)}function R(e){return e.map((e,t)=>({name:`container-${t+1}`,status:e}))}function z(e){let t=[`running`,`created`,`paused`,`waiting`,`degraded`,`exited`,`stopped`,`terminated`,`dead`],n={};for(let e of t)n[e]=[];for(let t of e){let e=t.status.toLowerCase();n[e]||(n[e]=[]),n[e].push(t)}return n}function B(e,t){b(t,!1),D();var n=Ce(),i=r(n);H(i,{name:`Basic`,args:{status:`running`,name:`my-container`,tooltip:``,number:0},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}});var a=c(i,2);H(a,{name:`All Statuses`,args:{kind:`allStatuses`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}});var o=c(a,2);H(o,{name:`Number Badges`,args:{kind:`numberBadges`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}});var s=c(o,2);H(s,{name:`Pod Container Row (Individual)`,args:{kind:`podRowIndividual`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}});var l=c(s,2);H(l,{name:`Pod Container Row (Grouped)`,args:{kind:`podRowGrouped`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}});var u=c(l,2);H(u,{name:`Table Cell Context`,args:{kind:`tableCell`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}});var d=c(u,2);H(d,{name:`Density Stress Test`,args:{kind:`stressTest`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}}),H(c(d,2),{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'allStatuses'}
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
{/if}`}}}),C(e,n),S()}var te,V,H,U,ne,W,G,K,q,J,Y,X,Z,Q,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me,he,ge,_e,ve,ye,be,xe,Se,Ce,$,we,Te,Ee,De,Oe,ke,Ae,je,Me;e((()=>{T(),O(),w(),P(),k(),x(),A(),te=(e,g,b=y)=>{let x=()=>h(g?.(),[`_children`]);var S=m(),w=r(S),T=e=>{var r=re(),s=c(n(r),2),l=c(n(s),2);d(l,5,()=>ne,e=>e.status,(e,r)=>{var s=X(),l=n(s);{let e=i(()=>I(E(r).status));N(l,{top:!0,get tip(){return E(e)},children:(e,n)=>{var i=Y();a((e,n)=>{t(i,1,`w-2 h-2 rounded-full ${e??``}`),o(i,`title`,n)},[()=>F(E(r).status),()=>I(E(r).status)]),C(e,i)},$$slots:{default:!0}})}var u=c(l,2),d=n(u),f=n(d,!0);v(d);var m=c(d,2),h=n(m,!0);v(m),v(u),v(s),a(()=>{p(f,E(r).status),p(h,E(r).token)}),C(e,s)}),v(l),v(s);var u=c(s,2),f=c(n(u),2);d(f,5,()=>W,e=>e.status,(e,r)=>{var s=Q(),l=n(s);{let e=i(()=>I(E(r).status));N(l,{top:!0,get tip(){return E(e)},children:(e,n)=>{var i=Z();a((e,n)=>{t(i,1,`w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline ${e??``}`),o(i,`title`,n)},[()=>F(E(r).status),()=>I(E(r).status)]),C(e,i)},$$slots:{default:!0}})}var u=c(l,2),d=n(u),f=n(d,!0);v(d);var m=c(d,2),h=n(m,!0);v(m),v(u),v(s),a(()=>{p(f,E(r).status),p(h,E(r).token)}),C(e,s)}),v(f),v(u),v(r),C(e,r)},D=e=>{var r=ae(),s=c(n(r),2);d(s,4,()=>[{status:`running`,count:5},{status:`stopped`,count:3},{status:`exited`,count:2},{status:`paused`,count:1}],e=>e.status,(e,r)=>{{let s=i(()=>I(r.status)),l=i(()=>r.count);N(e,{top:!0,get tip(){return`${E(s)??``}: ${E(l)??``}`},children:(e,i)=>{var s=ie(),l=n(s),u=c(l,2),d=n(u,!0);v(u),v(s),a((e,n,i)=>{t(l,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${n??``}`),o(l,`title`,`${i??``}: ${r.count??``}`),p(d,r.count)},[()=>L(r.status)?`outline-2 outline-offset-[-2px] outline`:``,()=>F(r.status),()=>I(r.status)]),C(e,s)},$$slots:{default:!0}})}}),v(s),v(r),C(e,r)},O=e=>{var s=se(),h=n(s),g=n(h);f(2),v(h);var y=c(h,2),b=c(n(y),2);d(b,5,()=>Object.entries(z(R(K))),([e,t])=>e,(e,n)=>{var s=u(()=>_(E(n),2));let c=()=>E(s)[0],f=()=>E(s)[1];var p=m();d(r(p),1,f,l,(e,n)=>{{let r=i(()=>E(n).name),s=i(()=>I(c()));N(e,{top:!0,get tip(){return`${E(r)??``}: ${E(s)??``}`},children:(e,r)=>{var i=oe();a((e,r,a)=>{t(i,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${r??``}`),o(i,`title`,`${E(n).name??``}: ${a??``}`)},[()=>L(c())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(c()),()=>I(c())]),C(e,i)},$$slots:{default:!0}})}}),C(e,p)}),v(b),v(y),v(s),a(()=>p(g,`Pod with ${K.length??``} containers (at or below 10 threshold).
        Each container gets its own dot. This is the `)),C(e,s)},k=e=>{var l=le(),h=n(l),g=n(h);f(2),v(h);var y=c(h,2),b=c(n(y),2);d(b,5,()=>Object.entries(z(R(q))),([e,t])=>e,(e,l)=>{var d=u(()=>_(E(l),2));let f=()=>E(d)[0],h=()=>E(d)[1];var g=m(),y=r(g),b=e=>{{let r=i(()=>I(f())),s=i(()=>h().length);N(e,{top:!0,get tip(){return`${E(r)??``}: ${E(s)??``}`},children:(e,r)=>{var i=ce(),s=n(i),l=c(s,2),u=n(l,!0);v(l),v(i),a((e,n,r)=>{t(s,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${n??``}`),o(s,`title`,`${r??``}: ${h().length??``}`),p(u,h().length)},[()=>L(f())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(f()),()=>I(f())]),C(e,i)},$$slots:{default:!0}})}};s(y,e=>{h().length>0&&e(b)}),C(e,g)}),v(b),v(y),v(l),a(()=>p(g,`Pod with ${q.length??``} containers (above 10 threshold).
        Containers are grouped by status with count badges. This is the `)),C(e,l)},A=e=>{var h=pe(),g=c(n(h),2),y=c(n(g),2),b=c(n(y),6),x=n(b);d(x,5,()=>Object.entries(z(R(K))),([e,t])=>e,(e,n)=>{var s=u(()=>_(E(n),2));let c=()=>E(s)[0],f=()=>E(s)[1];var p=m();d(r(p),1,f,l,(e,n)=>{{let r=i(()=>E(n).name),s=i(()=>I(c()));N(e,{top:!0,get tip(){return`${E(r)??``}: ${E(s)??``}`},children:(e,r)=>{var i=ue();a((e,r,a)=>{t(i,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${r??``}`),o(i,`title`,`${E(n).name??``}: ${a??``}`)},[()=>L(c())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(c()),()=>I(c())]),C(e,i)},$$slots:{default:!0}})}}),C(e,p)}),v(x),v(b),f(2),v(y);var S=c(y,4),w=c(n(S),6),T=n(w);d(T,5,()=>Object.entries(z(R(q))),([e,t])=>e,(e,l)=>{var d=u(()=>_(E(l),2));let f=()=>E(d)[0],h=()=>E(d)[1];var g=m(),y=r(g),b=e=>{{let r=i(()=>I(f())),s=i(()=>h().length);N(e,{top:!0,get tip(){return`${E(r)??``}: ${E(s)??``}`},children:(e,r)=>{var i=de(),s=n(i),l=c(s,2),u=n(l,!0);v(l),v(i),a((e,n,r)=>{t(s,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${n??``}`),o(s,`title`,`${r??``}: ${h().length??``}`),p(u,h().length)},[()=>L(f())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(f()),()=>I(f())]),C(e,i)},$$slots:{default:!0}})}};s(y,e=>{h().length>0&&e(b)}),C(e,g)}),v(T),v(w),f(2),v(S);var D=c(S,4),O=c(n(D),6),k=n(O);d(k,4,()=>[`running`,`running`,`waiting`],l,(e,n,r)=>{{let s=i(()=>I(n));N(e,{top:!0,get tip(){return`container-${r+1}: ${E(s)??``}`},children:(e,i)=>{var s=fe();a((e,n,i)=>{t(s,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${n??``}`),o(s,`title`,`container-${r+1}: ${i??``}`)},[()=>L(n)?`outline-2 outline-offset-[-2px] outline`:``,()=>F(n),()=>I(n)]),C(e,s)},$$slots:{default:!0}})}}),v(k),v(O),f(2),v(D),v(g),v(h),C(e,h)},j=e=>{var f=_e();d(c(n(f),2),1,()=>J,e=>e.label,(e,f)=>{let h=i(()=>R(E(f).statuses)),g=i(()=>E(h).length>10),y=i(()=>z(E(h)));var b=ge(),x=n(b),S=n(x),w=n(S,!0);v(S);var T=c(S,2),D=n(T);v(T),v(x);var O=c(x,2),k=c(n(O),2),A=n(k),j=e=>{var l=m();d(r(l),1,()=>Object.entries(E(y)),([e,t])=>e,(e,l)=>{var d=u(()=>_(E(l),2));let f=()=>E(d)[0],h=()=>E(d)[1];var g=m(),y=r(g),b=e=>{{let r=i(()=>I(f())),s=i(()=>h().length);N(e,{top:!0,get tip(){return`${E(r)??``}: ${E(s)??``}`},children:(e,r)=>{var i=me(),s=n(i),l=c(s,2),u=n(l,!0);v(l),v(i),a((e,n,r)=>{t(s,1,`w-2 h-2 mr-0.5 rounded-full mt-3 ${e??``} ${n??``}`),o(s,`title`,`${r??``}: ${h().length??``}`),p(u,h().length)},[()=>L(f())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(f()),()=>I(f())]),C(e,i)},$$slots:{default:!0}})}};s(y,e=>{h().length>0&&e(b)}),C(e,g)}),C(e,l)},M=e=>{var n=m();d(r(n),1,()=>Object.entries(E(y)),([e,t])=>e,(e,n)=>{var s=u(()=>_(E(n),2));let c=()=>E(s)[0],f=()=>E(s)[1];var p=m();d(r(p),1,f,l,(e,n)=>{{let r=i(()=>E(n).name),s=i(()=>I(c()));N(e,{top:!0,get tip(){return`${E(r)??``}: ${E(s)??``}`},children:(e,r)=>{var i=he();a((e,r,a)=>{t(i,1,`w-2 h-2 mr-0.5 rounded-full ${e??``} ${r??``}`),o(i,`title`,`${E(n).name??``}: ${a??``}`)},[()=>L(c())?`outline-2 outline-offset-[-2px] outline`:``,()=>F(c()),()=>I(c())]),C(e,i)},$$slots:{default:!0}})}}),C(e,p)}),C(e,n)};s(A,e=>{E(g)?e(j):e(M,-1)}),v(k),v(O),v(b),a(()=>{p(w,E(f).label),p(D,`(${E(h).length??``} total, ${E(g)?`grouped`:`individual`})`)}),C(e,b)}),v(f),C(e,f)},M=e=>{var r=be(),s=c(n(r),2),l=c(n(s),2),u=n(l),p=c(n(u),2);N(n(p),{top:!0,tip:`my-container: Running`,children:(e,t)=>{C(e,ve())},$$slots:{default:!0}}),f(2),v(p),f(2),v(u);var m=c(u,4),h=c(n(m),2);d(h,4,()=>[`running`,`stopped`,`dead`,`paused`],e=>e,(e,n)=>{{let r=i(()=>I(n));N(e,{top:!0,get tip(){return E(r)},children:(e,r)=>{var i=ye();a((e,n,r)=>{t(i,1,`w-2 h-2 rounded-full ${e??``} ${n??``}`),o(i,`title`,r)},[()=>L(n)?`outline-2 outline-offset-[-2px] outline`:``,()=>F(n),()=>I(n)]),C(e,i)},$$slots:{default:!0}})}}),v(h),f(2),v(m),f(2),v(l),v(s),f(2),v(r),C(e,r)},P=e=>{let l=i(()=>x().status??`running`),u=i(()=>x().name??``),d=i(()=>x().tooltip??``),f=i(()=>x().number??0),m=i(()=>ee(E(d),E(u),E(l))),h=i(()=>L(E(l)));N(e,{top:!0,get tip(){return E(m)},children:(e,i)=>{var u=Se(),d=r(u),g=c(d,2),_=e=>{var t=xe(),r=n(t,!0);v(t),a(()=>p(r,E(f))),C(e,t)};s(g,e=>{E(f)&&e(_)}),a(e=>{t(d,1,`w-2 h-2 mr-0.5 rounded-full text-center ${E(h)?`outline-2 outline-offset-[-2px] outline`:``} ${e??``} ${E(f)?`mt-3`:``}`),o(d,`title`,E(m))},[()=>F(E(l))]),C(e,u)},$$slots:{default:!0}})};s(w,e=>{x().kind===`allStatuses`?e(T):x().kind===`numberBadges`?e(D,1):x().kind===`podRowIndividual`?e(O,2):x().kind===`podRowGrouped`?e(k,3):x().kind===`tableCell`?e(A,4):x().kind===`stressTest`?e(j,5):x().kind===`accessibility`?e(M,6):e(P,-1)}),C(e,S)},V={render:te,title:`StatusDot`,tags:[`autodocs`],argTypes:{status:{control:`select`,options:[`running`,`terminated`,`waiting`,`stopped`,`paused`,`exited`,`dead`,`created`,`degraded`,`unknown`],description:`Container status string`},name:{control:`text`,description:`Container name (used in auto-generated tooltip)`},tooltip:{control:`text`,description:`Custom tooltip text (overrides auto-generated)`},number:{control:{type:`number`,min:0},description:`Count badge shown below the dot (0 = hidden)`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:`Stories for the \`StatusDot\` component from \`packages/renderer\`.

A small colored circle indicating container or pod status. Supports filled
(active) and outlined (inactive) rendering modes, optional tooltip, and
an optional count badge for grouped display.

Used inside the Pods list table (both Podman and Kubernetes) via the
\`Dots.svelte\` wrapper.

**Planned modernization:** The dot will be replaced with a larger SVG icon
so status is not communicated by color alone (a11y).`}}}},{Story:H}=j(V),U=[{status:`running`,mode:`filled`,token:`--pd-status-running`},{status:`terminated`,mode:`filled`,token:`--pd-status-terminated`},{status:`waiting`,mode:`filled`,token:`--pd-status-waiting`},{status:`paused`,mode:`filled`,token:`--pd-status-paused`},{status:`degraded`,mode:`filled`,token:`--pd-status-degraded`},{status:`dead`,mode:`filled`,token:`--pd-status-dead`},{status:`unknown`,mode:`filled`,token:`--pd-status-unknown`},{status:`stopped`,mode:`outlined`,token:`--pd-status-stopped`},{status:`exited`,mode:`outlined`,token:`--pd-status-exited`},{status:`created`,mode:`outlined`,token:`--pd-status-created`}],ne=U.filter(e=>e.mode===`filled`),W=U.filter(e=>e.mode===`outlined`),G={running:`bg-(--pd-status-running)`,terminated:`bg-(--pd-status-terminated)`,waiting:`bg-(--pd-status-waiting)`,stopped:`outline-(--pd-status-stopped)`,paused:`bg-(--pd-status-paused)`,exited:`outline-(--pd-status-exited)`,dead:`bg-(--pd-status-dead)`,created:`outline-(--pd-status-created)`,degraded:`bg-(--pd-status-degraded)`,unknown:`bg-(--pd-status-unknown)`},K=[`running`,`running`,`running`,`stopped`,`paused`,`running`,`exited`],q=[...Array.from({length:8},()=>`running`),...Array.from({length:3},()=>`stopped`),...Array.from({length:2},()=>`exited`),`paused`,`degraded`],J=[{label:`1 container`,statuses:[`running`]},{label:`10 containers (individual threshold)`,statuses:Array.from({length:10},(e,t)=>t<7?`running`:t<9?`stopped`:`exited`)},{label:`11 containers (grouped threshold)`,statuses:[...Array.from({length:8},()=>`running`),`stopped`,`stopped`,`exited`]},{label:`50 containers`,statuses:[...Array.from({length:30},()=>`running`),...Array.from({length:10},()=>`stopped`),...Array.from({length:5},()=>`exited`),...Array.from({length:3},()=>`paused`),`degraded`,`dead`]},{label:`All same status`,statuses:Array.from({length:8},()=>`running`)}],Y=g(`<div></div>`),X=g(`<div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3"><!> <div class="flex flex-col"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),Z=g(`<div></div>`),Q=g(`<div class="flex items-center gap-3 rounded border border-(--pd-content-divider) p-3"><!> <div class="flex flex-col"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div></div>`),re=g(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">StatusDot uses two rendering modes. <strong>Filled</strong> dots use a solid background for active or
        notable states. <strong>Outlined</strong> dots use an outline border for inactive states.</div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Filled (active states)</div> <div class="grid grid-cols-2 gap-3 sm:grid-cols-4"></div></div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Outlined (inactive states)</div> <div class="grid grid-cols-2 gap-3 sm:grid-cols-3"></div></div></div>`),ie=g(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),ae=g(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">When a pod has more than 10 containers, dots are grouped by status with a count badge below.
        The dot shifts down (<code>mt-3</code>) to align with the number text.</div> <div class="flex items-start gap-4 rounded border border-(--pd-content-divider) p-4"></div></div>`),oe=g(`<div></div>`),se=g(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)"> <code>Dots.svelte</code> layout for small pods.</div> <div class="rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header) mb-2">Individual dots</div> <div class="flex items-center flex-wrap"></div></div></div>`),ce=g(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),le=g(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)"> <code>Dots.svelte</code> layout for large pods.</div> <div class="rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header) mb-2">Grouped with counts</div> <div class="flex items-start"></div></div></div>`),ue=g(`<div></div>`),de=g(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),fe=g(`<div></div>`),pe=g(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">StatusDots appear inside the Containers column of the Pods list table. This mock reproduces
        the real table row layout so you can evaluate how a larger dot (with SVG icon) would affect
        row height and column width.</div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 7 containers)</div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5"/></div> <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="text-sm text-(--pd-content-header) truncate">my-web-app-pod</div> <div class="text-xs text-(--pd-content-text)">podman</div></div> <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)"><button class="cursor-pointer flex items-center flex-wrap"></button></div> <div class="w-16 px-3 py-2 text-right"><span class="text-xs text-(--pd-content-text)">3m ago</span></div></div> <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Podman pod row (button wrapper, 15 containers - grouped)</div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5"/></div> <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="text-sm text-(--pd-content-header) truncate">microservices-stack-pod</div> <div class="text-xs text-(--pd-content-text)">podman</div></div> <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Degraded</span></div> <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)"><button class="cursor-pointer flex items-start flex-wrap"></button></div> <div class="w-16 px-3 py-2 text-right"><span class="text-xs text-(--pd-content-text)">1h ago</span></div></div> <div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Kubernetes pod row (no button wrapper)</div> <div class="flex items-center rounded border border-(--pd-content-divider) bg-(--pd-content-card-bg)"><div class="w-10 px-3 py-2 flex items-center justify-center border-r border-(--pd-content-divider)"><input type="checkbox" class="w-3.5 h-3.5"/></div> <div class="flex-1 px-3 py-2 border-r border-(--pd-content-divider)"><div class="text-sm text-(--pd-content-header) truncate">nginx-deployment-7fb96c846b-x4k2p</div> <div class="text-xs text-(--pd-content-text)">kubernetes</div></div> <div class="w-20 px-3 py-2 border-r border-(--pd-content-divider)"><span class="text-xs text-(--pd-content-text)">Running</span></div> <div class="w-32 px-3 py-2 border-r border-(--pd-content-divider)"><div class="flex items-center flex-wrap"></div></div> <div class="w-16 px-3 py-2 text-right"><span class="text-xs text-(--pd-content-text)">12m ago</span></div></div></div></div>`),me=g(`<div class="flex flex-col items-center"><div></div> <div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div></div>`),he=g(`<div></div>`),ge=g(`<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="flex items-center gap-2"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <code class="text-[10px] text-(--pd-content-text)"> </code></div> <div class="flex items-center rounded bg-(--pd-content-card-bg) px-3 py-2"><div class="w-40 text-sm text-(--pd-content-header) truncate mr-4">test-pod</div> <div class="flex items-start flex-wrap"><!></div></div></div>`),_e=g(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Edge cases for density and layout. The 10-container threshold switches from individual dots to grouped counts.
        Use this to evaluate how a larger StatusDot (with SVG icon) would affect each density level.</div> <!></div>`),ve=g(`<div class="w-2 h-2 rounded-full bg-(--pd-status-running)" title="my-container: Running"></div>`),ye=g(`<div></div>`),be=g(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Current accessibility characteristics and known gaps.</div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Current behavior</div> <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Tooltip via title attribute</div> <div class="flex items-center gap-2 py-2"><!> <span class="text-xs text-(--pd-content-text)">Hover to see tooltip</span></div> <code class="text-[10px] text-(--pd-content-text)">title="my-container: Running"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Fill vs outline distinction</div> <div class="flex items-center gap-3 py-2"><div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-(--pd-status-running)"></div> <span class="text-xs text-(--pd-content-text)">Filled</span></div> <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full outline-2 outline-offset-[-2px] outline outline-(--pd-status-stopped)"></div> <span class="text-xs text-(--pd-content-text)">Outlined</span></div></div> <code class="text-[10px] text-(--pd-content-text)">Only non-color distinction currently</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast themes</div> <div class="flex items-center gap-2 py-2"></div> <code class="text-[10px] text-(--pd-content-text)">Switch to hc-light / hc-dark to verify</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">No ARIA role</div> <div class="py-2"><div class="text-xs text-(--pd-content-text)">The dot is a plain <code>&lt;div&gt;</code> with no <code>role</code> or <code>aria-label</code>. Screen readers rely solely on the <code>title</code> attribute.</div></div> <code class="text-[10px] text-(--pd-content-text)">Missing: role="status", aria-label</code></div></div></div> <div class="flex flex-col gap-4"><div class="text-xs font-semibold uppercase tracking-wide text-(--pd-content-header)">Known gaps (to address in modernization)</div> <ul class="list-disc pl-5 text-sm text-(--pd-content-text) space-y-1"><li>Color is the only way to distinguish between most statuses</li> <li>8x8px dot may be too small for touch targets (WCAG recommends 24x24px minimum)</li> <li>No shape or icon variation to differentiate statuses without color</li> <li>No <code>role="status"</code> or <code>aria-label</code> on the dot element</li> <li>Outlined dots may be hard to see on some backgrounds at this size</li></ul></div></div>`),xe=g(`<div class="text-sm font-bold text-(--pd-content-text) mr-0.5"> </div>`),Se=g(`<div></div> <!>`,1),Ce=g(`<!> <!> <!> <!> <!> <!> <!> <!>`,1),B.__docgen={data:[],name:`StatusDot.stories.svelte`},$=M(B,V),we=[`Basic`,`AllStatuses`,`NumberBadges`,`PodContainerRowIndividual`,`PodContainerRowGrouped`,`TableCellContext`,`DensityStressTest`,`Accessibility`],Te={...$.Basic,tags:[`svelte-csf-v5`]},Ee={...$.AllStatuses,tags:[`svelte-csf-v5`]},De={...$.NumberBadges,tags:[`svelte-csf-v5`]},Oe={...$.PodContainerRowIndividual,tags:[`svelte-csf-v5`]},ke={...$.PodContainerRowGrouped,tags:[`svelte-csf-v5`]},Ae={...$.TableCellContext,tags:[`svelte-csf-v5`]},je={...$.DensityStressTest,tags:[`svelte-csf-v5`]},Me={...$.Accessibility,tags:[`svelte-csf-v5`]}}))();export{Me as Accessibility,Ee as AllStatuses,Te as Basic,je as DensityStressTest,De as NumberBadges,ke as PodContainerRowGrouped,Oe as PodContainerRowIndividual,Ae as TableCellContext,we as __namedExportsOrder,V as default};