import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{Ht as t,Rt as n,Sn as r,Tn as i,_n as a,_t as o,an as s,c,gt as l,ht as u,in as d,m as f,mn as p,nt as m,pn as h,x as g,zt as _}from"./iframe-NdRP2ilt.js";import{a as v,i as y,n as b,r as x,t as S}from"./create-runtime-stories-nVQGQy5u.js";import{n as C,t as w}from"./LinearProgress-cr1GVwaw.js";import{n as T,t as E}from"./ProgressBar-DqxU_8Mi.js";function D(e,n){s(n,!1),g();var r=F(),i=_(r);A(i,{name:`Basic`,parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var a=t(i,2);A(a,{name:`Page Header`,args:{kind:`pageHeader`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var o=t(a,2);A(o,{name:`Form Page`,args:{kind:`formPage`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var c=t(o,2);A(c,{name:`Accessibility`,args:{kind:`accessibility`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var l=t(c,2);A(l,{name:`Comparison`,args:{kind:`comparison`},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}}),u(e,r),d()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{i(),v(),r(),C(),T(),y(),c(),b(),O=(e,r)=>{let i=()=>a(r?.(),[`_children`]);var o=l(),s=_(o),c=e=>{var r=j(),i=t(n(r),2),a=t(n(i),2),o=n(a),s=t(n(o),2);w(s,{}),h(4),p(o),p(a),p(i),h(2),p(r),u(e,r)},d=e=>{var r=M(),i=t(n(r),2),a=t(n(i),2),o=n(a),s=t(n(o),2);w(s,{"aria-label":`Deploying pod to Kubernetes`}),h(4),p(o),p(a),p(i);var c=t(i,2),l=t(n(c),2),d=n(l),f=t(n(d),2);w(f,{"aria-label":`Creating pods from YAML`}),h(4),p(d),p(l),p(c),p(r),u(e,r)},g=e=>{var r=N(),i=t(n(r),2),a=n(i),o=t(n(a),2),s=n(o);w(s,{}),p(o),h(2),p(a);var c=t(a,2),l=t(n(c),2),d=n(l);w(d,{"aria-label":`Loading page content`}),p(l),h(2),p(c),p(i),h(4),p(r),u(e,r)},v=e=>{var r=P(),i=t(n(r),2),a=n(i),o=t(n(a),2),s=n(o);w(s,{}),p(o),h(2),p(a);var c=t(a,2),l=t(n(c),2),d=n(l);E(d,{}),p(l),h(2),p(c);var f=t(c,2),m=t(n(f),2),g=n(m);E(g,{progress:65}),p(m),h(2),p(f),p(i),p(r),u(e,r)},y=e=>{w(e,f(i))};m(s,e=>{i().kind===`pageHeader`?e(c):i().kind===`formPage`?e(d,1):i().kind===`accessibility`?e(g,2):i().kind===`comparison`?e(v,3):e(y,-1)}),u(e,o)},k={component:w,render:O,title:`Progress/LinearProgress`,tags:[`autodocs`],argTypes:{class:{control:`text`,description:`Additional CSS classes on the wrapper element`},"aria-label":{control:`text`,description:`Accessible label for the progress indicator`},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `LinearProgress` component from `packages/ui`.\n\nA full-width, indeterminate linear progress indicator used in page headers\nto signal that an async operation is in progress. Unlike `ProgressBar`, this\ncomponent has no determinate mode, no percentage text, and always spans the\nfull container width at 2px height.\n\n**Usage**: Rendered inside `Page.svelte` when `inProgress` is `true`,\nappearing between the page header and the tab bar. Propagated through\n`FormPage` and `EngineFormPage` to pages like DeployPodToKube,\nPodCreateFromContainers, and KubePlayYAML.\n\n**Accessibility**: Uses `role="progressbar"` with `aria-valuemin` and\n`aria-valuemax`. Supports `prefers-reduced-motion` to disable animation.\nAdditional ARIA attributes (e.g. `aria-label`) are spread onto the outer\nwrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg`,\n`--pd-progressBar-in-progress-bg`, `--pd-progressBar-in-progress-border`,\nand `--pd-progressBar-hc-line-bg` from the color registry.'}}}},{Story:A}=x(k),j=o(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
        It appears when the <code>inProgress</code> prop is set to <code>true</code>.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div></div>`),M=o(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
        LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
        pods from containers, and running Kubernetes YAML files.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Deploy generated pod to Kubernetes</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create pods from a Kubernetes YAML file</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div></div>`),N=o(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code> is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.</div> <div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Default</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code></div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div> <div class="text-sm text-(--pd-content-text)">A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
          bar. In standard themes it is transparent. In high-contrast themes it becomes visible
          (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.</div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div> <div class="text-sm text-(--pd-content-text)">When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
          entirely. The bar remains visible as a static filled indicator.</div></div></div>`),P=o(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
        indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
        used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
        with percentage text).</div> <div class="grid grid-cols-1 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code></div></div></div>`),F=o(`<!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`LinearProgress.stories.svelte`},I=S(D,k),L=[`Basic`,`PageHeader`,`FormPage`,`Accessibility`,`Comparison`],R={...I.Basic,tags:[`svelte-csf-v5`]},z={...I.PageHeader,tags:[`svelte-csf-v5`]},B={...I.FormPage,tags:[`svelte-csf-v5`]},V={...I.Accessibility,tags:[`svelte-csf-v5`]},H={...I.Comparison,tags:[`svelte-csf-v5`]}})))()}U();export{V as Accessibility,R as Basic,H as Comparison,B as FormPage,z as PageHeader,L as __namedExportsOrder,k as default};