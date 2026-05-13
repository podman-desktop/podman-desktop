import{k as M,f as K,o as H,b,p as Y,c as t,d as R,g as h,e as S,j as e,i as o,r as n,s as N}from"./iframe-BQDYTyZf.js";import{c as V,i as W,d as E}from"./create-runtime-stories-Dz26sd-l.js";import{L as x}from"./LinearProgress-Dm7ug2Nu.js";import{P as B}from"./ProgressBar-Cqf2-dEd.js";import"./preload-helper-PPVm8Dsz.js";const U=(C,k)=>{let c=()=>S(k?.(),["_children"]);var g=M(),w=K(g);{var P=d=>{var s=O(),i=t(e(s),2),r=t(e(i),2),a=e(r),v=t(e(a),2);x(v),o(4),n(a),n(r),n(i),o(2),n(s),b(d,s)},y=d=>{var s=q(),i=t(e(s),2),r=t(e(i),2),a=e(r),v=t(e(a),2);x(v),o(4),n(a),n(r),n(i);var l=t(i,2),p=t(e(l),2),f=e(p),L=t(e(f),2);x(L),o(4),n(f),n(p),n(l),n(s),b(d,s)},_=d=>{var s=z(),i=t(e(s),2),r=e(i),a=t(e(r),2),v=e(a);x(v),n(a),o(2),n(r);var l=t(r,2),p=t(e(l),2),f=e(p);x(f),n(p),o(2),n(l),n(i),o(4),n(s),b(d,s)},T=d=>{var s=G(),i=t(e(s),2),r=e(i),a=t(e(r),2),v=e(a);x(v),n(a),o(2),n(r);var l=t(r,2),p=t(e(l),2),f=e(p);B(f,{}),n(p),o(2),n(l);var L=t(l,2),A=t(e(L),2),I=e(A);B(I,{progress:65}),n(A),o(2),n(L),n(i),n(s),b(d,s)},F=d=>{x(d,N(c))};H(w,d=>{c().kind==="pageHeader"?d(P):c().kind==="formPage"?d(y,1):c().kind==="accessibility"?d(_,2):c().kind==="comparison"?d(T,3):d(F,-1)})}b(C,g)},j={component:x,render:U,title:"Progress/LinearProgress",tags:["autodocs"],argTypes:{class:{control:"text",description:"Additional CSS classes on the wrapper element"},"aria-label":{control:"text",description:"Accessible label for the progress indicator"},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `LinearProgress` component from `packages/ui`.\n\nA full-width, indeterminate linear progress indicator used in page headers\nto signal that an async operation is in progress. Unlike `ProgressBar`, this\ncomponent has no determinate mode, no percentage text, and always spans the\nfull container width at 2px height.\n\n**Usage**: Rendered inside `Page.svelte` when `inProgress` is `true`,\nappearing between the page header and the tab bar. Propagated through\n`FormPage` and `EngineFormPage` to pages like DeployPodToKube,\nPodCreateFromContainers, and KubePlayYAML.\n\n**Accessibility**: Uses `role="progressbar"` with `aria-valuemin` and\n`aria-valuemax`. Supports `prefers-reduced-motion` to disable animation.\nAdditional ARIA attributes (e.g. `aria-label`) are spread onto the outer\nwrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg`,\n`--pd-progressBar-in-progress-bg`, `--pd-progressBar-in-progress-border`,\nand `--pd-progressBar-hc-line-bg` from the color registry.'}}}},{Story:m}=E();var O=h(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress is used inside <code>Page.svelte</code> between the header and tab bar.
        It appears when the <code>inProgress</code> prop is set to <code>true</code>.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Active (inProgress=true)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Idle (inProgress=false)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Containers</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create a container</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create a container</h1></div></div> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"><div class="px-4 py-2 text-sm text-(--pd-content-header) border-b-2 border-(--pd-content-header)">Details</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Networking</div> <div class="px-4 py-2 text-sm text-(--pd-content-text)">Volumes</div></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Tab content area</div></div></div></div></div>`),q=h(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">FormPage and EngineFormPage pass <code>inProgress</code> to <code>Page</code>, which renders
        LinearProgress. These pages are used for operations like deploying to Kubernetes, creating
        pods from containers, and running Kubernetes YAML files.</div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Deploy to Kubernetes (deploying)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Deploy generated pod to Kubernetes</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Deploy generated pod to Kubernetes</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div> <div class="flex flex-col gap-2"><div class="text-xs font-semibold text-(--pd-content-header)">Create pods from YAML (running)</div> <div class="rounded border border-(--pd-content-divider) overflow-hidden"><div class="flex flex-col bg-(--pd-content-bg)"><div class="flex flex-row items-center px-5 pt-4 pb-2"><div class="flex flex-col w-full"><div class="flex items-center text-sm text-(--pd-content-breadcrumb)"><span>Pods</span> <span class="mx-2">&gt;</span> <span class="font-extralight">Create pods from a Kubernetes YAML file</span></div> <h1 class="text-xl font-bold text-(--pd-content-header) pt-1">Create pods from a Kubernetes YAML file</h1></div></div> <!> <div class="flex flex-row px-2 border-b border-(--pd-content-divider)"></div> <div class="p-5 text-sm text-(--pd-content-text) h-24">Form content area</div></div></div></div></div>`),z=h(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner animated bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Since LinearProgress is always indeterminate, <code>aria-valuenow</code> is never set. Additional ARIA props (e.g. <code>aria-label</code>) land on the outer wrapper via <code>restProps</code>. The animation respects <code>prefers-reduced-motion: reduce</code>.</div> <div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Default</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">With aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Loading page content" on wrapper</code></div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">High-contrast guide line</div> <div class="text-sm text-(--pd-content-text)">A 1px guide line using <code>--pd-progressBar-hc-line-bg</code> is rendered behind the animated
          bar. In standard themes it is transparent. In high-contrast themes it becomes visible
          (white in HC Dark, black in HC Light) to ensure the bar track is perceivable.</div></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Reduced motion</div> <div class="text-sm text-(--pd-content-text)">When <code>prefers-reduced-motion: reduce</code> is active, the sweep animation is disabled
          entirely. The bar remains visible as a static filled indicator.</div></div></div>`),G=h(`<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">LinearProgress and ProgressBar serve different purposes. LinearProgress is a page-level
        indicator (full-width, thin, indeterminate-only). ProgressBar is a general-purpose component
        used in tables, status bars, and dialogs (configurable dimensions, supports determinate mode
        with percentage text).</div> <div class="grid grid-cols-1 gap-4"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">LinearProgress (page-level, indeterminate only)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Full width, h-0.5 (2px), no rounded corners, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - indeterminate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, no text</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)">ProgressBar - determinate (component-level)</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text)">Configurable width (default w-36), h-2 (8px), rounded, shows 65%</code></div></div></div>`),J=h("<!> <!> <!> <!> <!>",1);function D(C,k){Y(k,!1),W();var c=J(),g=K(c);m(g,{name:"Basic",parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var w=t(g,2);m(w,{name:"Page Header",args:{kind:"pageHeader"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var P=t(w,2);m(P,{name:"Form Page",args:{kind:"formPage"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var y=t(P,2);m(y,{name:"Accessibility",args:{kind:"accessibility"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}});var _=t(y,2);m(_,{name:"Comparison",args:{kind:"comparison"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'pageHeader'}
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
{/if}`}}}),b(C,c),R()}D.__docgen={data:[],name:"LinearProgress.stories.svelte"};const u=V(D,j),ne=["Basic","PageHeader","FormPage","Accessibility","Comparison"],te={...u.Basic,tags:["svelte-csf-v5"]},de={...u.PageHeader,tags:["svelte-csf-v5"]},se={...u.FormPage,tags:["svelte-csf-v5"]},re={...u.Accessibility,tags:["svelte-csf-v5"]},ie={...u.Comparison,tags:["svelte-csf-v5"]};export{re as Accessibility,te as Basic,ie as Comparison,se as FormPage,de as PageHeader,ne as __namedExportsOrder,j as default};
