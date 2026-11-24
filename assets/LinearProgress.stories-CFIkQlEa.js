import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{At as t,Cn as n,Dt as r,Et as i,Ot as a,Pt as o,_n as s,_t as c,c as l,fn as u,gt as d,ht as f,jt as p,m,nt as h,pn as g,wn as _,x as v}from"./iframe-s7E2AunH.js";import{a as y,i as b,n as x,r as S,t as C}from"./create-runtime-stories-B_xXyEgO.js";import{n as w,t as T}from"./LinearProgress-DIVmpTS2.js";import{n as E,t as D}from"./ProgressBar-DYLAE03x.js";function O(e,t){g(t,!1),v();var n=I(),r=p(n);j(r,{name:`Basic`,parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var i=o(r,2);j(i,{name:`Page Header`,args:{kind:`pageHeader`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var a=o(i,2);j(a,{name:`Form Page`,args:{kind:`formPage`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var s=o(a,2);j(s,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var c=o(s,2);j(c,{name:`Comparison`,args:{kind:`comparison`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}}),f(e,n),u()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{a(),r(),y(),i(),w(),E(),b(),l(),x(),k=(e,r)=>{let i=()=>s(r?.(),[`_children`]);var a=d(),c=p(a),l=e=>{var r=M(),i=o(t(r),2),a=o(t(i),2),s=t(a),c=o(t(s),2);T(c,{}),n(4),_(s),_(a),_(i),n(2),_(r),f(e,r)},u=e=>{var r=N(),i=o(t(r),2),a=o(t(i),2),s=t(a),c=o(t(s),2);T(c,{"aria-label":`Deploying pod to Kubernetes`}),n(4),_(s),_(a),_(i);var l=o(i,2),u=o(t(l),2),d=t(u),p=o(t(d),2);T(p,{"aria-label":`Creating pods from YAML`}),n(4),_(d),_(u),_(l),_(r),f(e,r)},g=e=>{var r=P(),i=o(t(r),2),a=t(i),s=o(t(a),2),c=t(s);T(c,{}),_(s),n(2),_(a);var l=o(a,2),u=o(t(l),2),d=t(u);T(d,{"aria-label":`Loading page content`}),_(u),n(2),_(l),_(i),n(4),_(r),f(e,r)},v=e=>{var r=F(),i=o(t(r),2),a=t(i),s=o(t(a),2),c=t(s);T(c,{}),_(s),n(2),_(a);var l=o(a,2),u=o(t(l),2),d=t(u);D(d,{}),_(u),n(2),_(l);var p=o(l,2),m=o(t(p),2),h=t(m);D(h,{progress:65}),_(m),n(2),_(p),_(i),_(r),f(e,r)},y=e=>{T(e,m(i))};h(c,e=>{i().kind===`pageHeader`?e(l):i().kind===`formPage`?e(u,1):i().kind===`accessibility`?e(g,2):i().kind===`comparison`?e(v,3):e(y,-1)}),f(e,a)},A={component:T,render:k,title:`Progress/LinearProgress`,tags:[`autodocs`],argTypes:{class:{control:`text`,description:`Additional CSS classes on the wrapper element`},"aria-label":{control:`text`,description:`Accessible label for the progress indicator`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `LinearProgress` component from `packages/ui`.\n\nA full-width, indeterminate linear progress indicator used in page headers\nto signal that an async operation is in progress. Unlike `ProgressBar`, this\ncomponent has no determinate mode, no percentage text, and always spans the\nfull container width at 2px height.\n\n**Usage**: Rendered inside `Page.svelte` when `inProgress` is `true`,\nappearing between the page header and the tab bar. Propagated through\n`FormPage` and `EngineFormPage` to pages like DeployPodToKube,\nPodCreateFromContainers, and KubePlayYAML.\n\n**Accessibility**: Uses `role="progressbar"` with `aria-valuemin` and\n`aria-valuemax`. Supports `prefers-reduced-motion` to disable animation.\nAdditional ARIA attributes (e.g. `aria-label`) are spread onto the outer\nwrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg`,\n`--pd-progressBar-in-progress-bg`, `--pd-progressBar-in-progress-border`,\nand `--pd-progressBar-hc-line-bg` from the color registry.'}}}},{Story:j}=S(A),M=c(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
        It appears when the <code>inProgress</code> prop is set to <code>true</code>.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div></div>`),N=c(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
        LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
        pods from containers, and running Kubernetes YAML files.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Deploy generated pod to Kubernetes</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create pods from a Kubernetes YAML file</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div></div>`),P=c(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code> is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.</div> <div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Default</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code></div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div> <div class="text-sm text-(--pd-content-text)">A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
          bar. In standard themes it is transparent. In high-contrast themes it becomes visible
          (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.</div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div> <div class="text-sm text-(--pd-content-text)">When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
          entirely. The bar remains visible as a static filled indicator.</div></div></div>`),F=c(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
        indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
        used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
        with percentage text).</div> <div class="grid grid-cols-1 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code></div></div></div>`),I=c(`<!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`LinearProgress.stories.svelte`},L=C(O,A),R=[`Basic`,`PageHeader`,`FormPage`,`Accessibility`,`Comparison`],z={...L.Basic,tags:[`svelte-csf-v5`]},B={...L.PageHeader,tags:[`svelte-csf-v5`]},V={...L.FormPage,tags:[`svelte-csf-v5`]},H={...L.Accessibility,tags:[`svelte-csf-v5`]},U={...L.Comparison,tags:[`svelte-csf-v5`]}})))()}W();export{H as Accessibility,z as Basic,U as Comparison,V as FormPage,B as PageHeader,R as __namedExportsOrder,A as default};