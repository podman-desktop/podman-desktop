import{i as e}from"./preload-helper-xPQekRTU.js";import{$ as t,It as n,Lt as r,Sn as i,b as a,dt as o,ft as s,ln as c,nn as l,p as u,pn as d,pt as f,rn as p,s as m,un as h,yn as g,zt as _}from"./iframe-Bo7YYJ33.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-C5zPArum.js";import{n as C,t as w}from"./LinearProgress-CSCIVUrY.js";import{n as T,t as E}from"./ProgressBar-BFPhEAsq.js";function D(e,t){p(t,!1),a();var n=F(),i=r(n);A(i,{name:`Basic`,parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
      It appears when the <code>inProgress</code> prop is set to <code>true</code>.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <LinearProgress />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'formPage'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
      LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
      pods from containers, and running Kubernetes YAML files.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Deploy generated pod to Kubernetes</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1>
            </div>
          </div>

          <LinearProgress aria-label="Deploying pod to Kubernetes" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create pods from a Kubernetes YAML file</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1>
            </div>
          </div>

          <LinearProgress aria-label="Creating pods from YAML" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code>
      and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code>
      is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via
      <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Default</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div>

        <div class="py-2">
          <LinearProgress aria-label="Loading page content" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code>
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div>

      <div class="text-sm text-(--pd-content-text)">
        A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
        bar. In standard themes it is transparent. In high-contrast themes it becomes visible
        (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div>

      <div class="text-sm text-(--pd-content-text)">
        When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
        entirely. The bar remains visible as a static filled indicator.
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
      indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
      used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
      with percentage text).
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div>

        <div class="py-2">
          <ProgressBar progress={65} />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code>
      </div>
    </div>
  </div>
{:else}
  <LinearProgress {...args} />
{/if}`}}});var s=_(i,2);A(s,{name:`Page Header`,args:{kind:`pageHeader`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
      It appears when the <code>inProgress</code> prop is set to <code>true</code>.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <LinearProgress />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'formPage'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
      LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
      pods from containers, and running Kubernetes YAML files.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Deploy generated pod to Kubernetes</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1>
            </div>
          </div>

          <LinearProgress aria-label="Deploying pod to Kubernetes" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create pods from a Kubernetes YAML file</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1>
            </div>
          </div>

          <LinearProgress aria-label="Creating pods from YAML" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code>
      and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code>
      is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via
      <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Default</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div>

        <div class="py-2">
          <LinearProgress aria-label="Loading page content" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code>
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div>

      <div class="text-sm text-(--pd-content-text)">
        A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
        bar. In standard themes it is transparent. In high-contrast themes it becomes visible
        (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div>

      <div class="text-sm text-(--pd-content-text)">
        When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
        entirely. The bar remains visible as a static filled indicator.
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
      indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
      used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
      with percentage text).
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div>

        <div class="py-2">
          <ProgressBar progress={65} />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code>
      </div>
    </div>
  </div>
{:else}
  <LinearProgress {...args} />
{/if}`}}});var c=_(s,2);A(c,{name:`Form Page`,args:{kind:`formPage`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
      It appears when the <code>inProgress</code> prop is set to <code>true</code>.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <LinearProgress />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'formPage'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
      LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
      pods from containers, and running Kubernetes YAML files.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Deploy generated pod to Kubernetes</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1>
            </div>
          </div>

          <LinearProgress aria-label="Deploying pod to Kubernetes" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create pods from a Kubernetes YAML file</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1>
            </div>
          </div>

          <LinearProgress aria-label="Creating pods from YAML" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code>
      and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code>
      is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via
      <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Default</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div>

        <div class="py-2">
          <LinearProgress aria-label="Loading page content" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code>
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div>

      <div class="text-sm text-(--pd-content-text)">
        A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
        bar. In standard themes it is transparent. In high-contrast themes it becomes visible
        (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div>

      <div class="text-sm text-(--pd-content-text)">
        When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
        entirely. The bar remains visible as a static filled indicator.
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
      indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
      used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
      with percentage text).
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div>

        <div class="py-2">
          <ProgressBar progress={65} />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code>
      </div>
    </div>
  </div>
{:else}
  <LinearProgress {...args} />
{/if}`}}});var u=_(c,2);A(u,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
      It appears when the <code>inProgress</code> prop is set to <code>true</code>.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <LinearProgress />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'formPage'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
      LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
      pods from containers, and running Kubernetes YAML files.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Deploy generated pod to Kubernetes</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1>
            </div>
          </div>

          <LinearProgress aria-label="Deploying pod to Kubernetes" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create pods from a Kubernetes YAML file</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1>
            </div>
          </div>

          <LinearProgress aria-label="Creating pods from YAML" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code>
      and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code>
      is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via
      <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Default</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div>

        <div class="py-2">
          <LinearProgress aria-label="Loading page content" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code>
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div>

      <div class="text-sm text-(--pd-content-text)">
        A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
        bar. In standard themes it is transparent. In high-contrast themes it becomes visible
        (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div>

      <div class="text-sm text-(--pd-content-text)">
        When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
        entirely. The bar remains visible as a static filled indicator.
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
      indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
      used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
      with percentage text).
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div>

        <div class="py-2">
          <ProgressBar progress={65} />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code>
      </div>
    </div>
  </div>
{:else}
  <LinearProgress {...args} />
{/if}`}}}),A(_(u,2),{name:`Comparison`,args:{kind:`comparison`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
      It appears when the <code>inProgress</code> prop is set to <code>true</code>.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <LinearProgress />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Containers</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create a container</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1>
            </div>
          </div>

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)">
            <div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div>
            <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div>
          </div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Tab content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'formPage'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
      LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
      pods from containers, and running Kubernetes YAML files.
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Deploy generated pod to Kubernetes</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1>
            </div>
          </div>

          <LinearProgress aria-label="Deploying pod to Kubernetes" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div>

      <div class="rounded border border-(--pd-content-divider) overflow-hidden">
        <div class="flex flex-col bg-(--pd-content-bg)">
          <div class="flex flex-row items-center px-5 pt-4 pb-2">
            <div class="flex flex-col w-full">
              <div class="flex items-center text-sm text-(--pd-content-breadcrumb)">
                <span>Pods</span>
                <span class="mx-2">&gt;</span>
                <span class="font-extralight">Create pods from a Kubernetes YAML file</span>
              </div>
              <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1>
            </div>
          </div>

          <LinearProgress aria-label="Creating pods from YAML" />

          <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div>

          <div class="p-5 text-sm text-(--pd-content-text) h-24">
            Form content area
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code>
      and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code>
      is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via
      <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Default</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div>

        <div class="py-2">
          <LinearProgress aria-label="Loading page content" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code>
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div>

      <div class="text-sm text-(--pd-content-text)">
        A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
        bar. In standard themes it is transparent. In high-contrast themes it becomes visible
        (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.
      </div>
    </div>

    <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
      <div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div>

      <div class="text-sm text-(--pd-content-text)">
        When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
        entirely. The bar remains visible as a static filled indicator.
      </div>
    </div>
  </div>
{:else if args.kind === 'comparison'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
      indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
      used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
      with percentage text).
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div>

        <div class="py-2">
          <LinearProgress />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div>

        <div class="py-2">
          <ProgressBar progress={65} />
        </div>

        <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code>
      </div>
    </div>
  </div>
{:else}
  <LinearProgress {...args} />
{/if}`}}}),o(e,n),l()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;e((()=>{i(),v(),g(),C(),T(),y(),m(),b(),O=(e,i)=>{let a=()=>d(i?.(),[`_children`]);var l=s(),f=r(l),p=e=>{var t=j(),r=_(n(t),2),i=_(n(r),2),a=n(i);w(_(n(a),2),{}),c(4),h(a),h(i),h(r),c(2),h(t),o(e,t)},m=e=>{var t=M(),r=_(n(t),2),i=_(n(r),2),a=n(i);w(_(n(a),2),{"aria-label":`Deploying pod to Kubernetes`}),c(4),h(a),h(i),h(r);var s=_(r,2),l=_(n(s),2),u=n(l);w(_(n(u),2),{"aria-label":`Creating pods from YAML`}),c(4),h(u),h(l),h(s),h(t),o(e,t)},g=e=>{var t=N(),r=_(n(t),2),i=n(r),a=_(n(i),2);w(n(a),{}),h(a),c(2),h(i);var s=_(i,2),l=_(n(s),2);w(n(l),{"aria-label":`Loading page content`}),h(l),c(2),h(s),h(r),c(4),h(t),o(e,t)},v=e=>{var t=P(),r=_(n(t),2),i=n(r),a=_(n(i),2);w(n(a),{}),h(a),c(2),h(i);var s=_(i,2),l=_(n(s),2);E(n(l),{}),h(l),c(2),h(s);var u=_(s,2),d=_(n(u),2);E(n(d),{progress:65}),h(d),c(2),h(u),h(r),h(t),o(e,t)},y=e=>{w(e,u(a))};t(f,e=>{a().kind===`pageHeader`?e(p):a().kind===`formPage`?e(m,1):a().kind===`accessibility`?e(g,2):a().kind===`comparison`?e(v,3):e(y,-1)}),o(e,l)},k={component:w,render:O,title:`Progress/LinearProgress`,tags:[`autodocs`],argTypes:{class:{control:`text`,description:`Additional CSS classes on the wrapper element`},"aria-label":{control:`text`,description:`Accessible label for the progress indicator`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `LinearProgress` component from `packages/ui`.\n\nA full-width, indeterminate linear progress indicator used in page headers\nto signal that an async operation is in progress. Unlike `ProgressBar`, this\ncomponent has no determinate mode, no percentage text, and always spans the\nfull container width at 2px height.\n\n**Usage**: Rendered inside `Page.svelte` when `inProgress` is `true`,\nappearing between the page header and the tab bar. Propagated through\n`FormPage` and `EngineFormPage` to pages like DeployPodToKube,\nPodCreateFromContainers, and KubePlayYAML.\n\n**Accessibility**: Uses `role="progressbar"` with `aria-valuemin` and\n`aria-valuemax`. Supports `prefers-reduced-motion` to disable animation.\nAdditional ARIA attributes (e.g. `aria-label`) are spread onto the outer\nwrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg`,\n`--pd-progressBar-in-progress-bg`, `--pd-progressBar-in-progress-border`,\nand `--pd-progressBar-hc-line-bg` from the color registry.'}}}},{Story:A}=x(k),j=f(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
        It appears when the <code>inProgress</code> prop is set to <code>true</code>.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div></div>`),M=f(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
        LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
        pods from containers, and running Kubernetes YAML files.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Deploy generated pod to Kubernetes</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create pods from a Kubernetes YAML file</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div></div>`),N=f(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code> is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.</div> <div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Default</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code></div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div> <div class="text-sm text-(--pd-content-text)">A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
          bar. In standard themes it is transparent. In high-contrast themes it becomes visible
          (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.</div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div> <div class="text-sm text-(--pd-content-text)">When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
          entirely. The bar remains visible as a static filled indicator.</div></div></div>`),P=f(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
        indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
        used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
        with percentage text).</div> <div class="grid grid-cols-1 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code></div></div></div>`),F=f(`<!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`LinearProgress.stories.svelte`},I=S(D,k),L=[`Basic`,`PageHeader`,`FormPage`,`Accessibility`,`Comparison`],R={...I.Basic,tags:[`svelte-csf-v5`]},z={...I.PageHeader,tags:[`svelte-csf-v5`]},B={...I.FormPage,tags:[`svelte-csf-v5`]},V={...I.Accessibility,tags:[`svelte-csf-v5`]},H={...I.Comparison,tags:[`svelte-csf-v5`]}}))();export{V as Accessibility,R as Basic,H as Comparison,B as FormPage,z as PageHeader,L as __namedExportsOrder,k as default};