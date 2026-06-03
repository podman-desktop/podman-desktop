import{k as ve,f as te,o as G,b as m,p as fe,c as n,d as ge,g as _,e as me,j as t,r as e,l as f,a as Y,h as E,i as g,t as be,s as ue}from"./iframe-BEItL_Y7.js";import{c as he,i as Se,d as _e,s as we}from"./create-runtime-stories-FPIaRC0M.js";import"./ErrorMessage-CNwST5Iq.js";import{S as i,B as ke}from"./Button-vOfmG_fr.js";import{S as Z}from"./Table-Ctqt5feC.js";import{e as ee}from"./each-CENGHwDB.js";import"./LinearProgress-DoFm6IWN.js";import"./ProgressBar-BrYVrrzA.js";import"./EmptyScreen-D6YX5qe-.js";import"./preload-helper-PPVm8Dsz.js";import"./Icon-DtSVEeFV.js";import"./StarIcon-DIfq_UXV.js";import"./index-l4C1ahnl.js";import"./ContainerIcon-Lv8gSo7H.js";const ze=(A,T)=>{let b=()=>me(T?.(),["_children"]);var w=ve(),z=te(w);{var C=a=>{var d=Ae(),p=n(t(d),2);ee(p,5,()=>ye,x=>x.label,(x,s)=>{var l=Pe(),r=t(l),k=t(r,!0);e(r);var o=n(r,2);{var u=c=>{i(c,{get size(){return f(s).size}})},h=c=>{i(c,{})};G(o,c=>{f(s).size?c(u):c(h,-1)})}e(l),Y(()=>E(k,f(s).label)),m(x,l)}),e(p),e(d),m(a,d)},B=a=>{var d=Be(),p=n(t(d),2);ee(p,5,()=>Ie,x=>x.heading,(x,s)=>{var l=Te(),r=t(l),k=t(r,!0);e(r);var o=n(r,2),u=t(o);{var h=v=>{i(v,{get label(){return f(s).label}})},c=v=>{i(v,{})};G(u,v=>{f(s).label?v(h):v(c,-1)})}e(o);var S=n(o,2),y=t(S,!0);e(S),e(l),Y(()=>{E(k,f(s).heading),we(o,1,`flex items-center justify-center py-2 ${f(s).containerClass??""??""}`),E(y,f(s).aria)}),m(x,l)}),e(p),e(d),m(a,d)},ie=a=>{var d=Me(),p=t(d),x=n(t(p),2);ke(x,{inProgress:!0,children:(pe,Ve)=>{g();var xe=be("Creating");m(pe,xe)},$$slots:{default:!0}}),e(p);var s=n(p,2),l=n(t(s),2),r=t(l);Z(r,{status:"DELETING"});var k=n(r,2);Z(k,{status:"UPDATING"}),e(l),e(s);var o=n(s,2),u=n(t(o),2),h=t(u),c=t(h);i(c,{size:"1.5em"}),e(h),g(2),e(u),e(o);var S=n(o,2),y=n(t(S),2),v=t(y);i(v,{size:"1em"}),g(2),e(y),e(S);var M=n(S,2),N=n(t(M),2),ae=n(t(N),2);i(ae,{size:"1em"}),e(N),e(M);var D=n(M,2),q=n(t(D),2),de=t(q);i(de,{size:"12px"}),g(2),e(q),e(D);var V=n(D,2),j=n(t(V),2),K=t(j),le=t(K);i(le,{size:"16px"}),e(K),g(),e(j),e(V);var L=n(V,2),U=n(t(L),2),O=t(U),W=t(O),$=t(W),re=t($);i(re,{size:"12px",label:"Connection Status Icon",class:"mr-1"}),g(3),e($),e(W),e(O),e(U),e(L);var F=n(L,2),H=n(t(F),2),J=t(H),Q=t(J),R=t(Q),oe=t(R);i(oe,{size:"12px",label:"Connection Status Icon",class:"mr-1"}),g(3),e(R);var X=n(R,4),ce=t(X);i(ce,{size:"12px",label:"Connection Status Icon",class:"mr-1"}),g(3),e(X),e(Q),e(J),e(H),e(F),e(d),m(a,d)},se=a=>{i(a,ue(b))};G(z,a=>{b().kind==="sizes"?a(C):b().kind==="accessibility"?a(B,1):b().kind==="contexts"?a(ie,2):a(se,-1)})}m(A,w)},Ce={component:i,render:ze,title:"Progress/Spinner",tags:["autodocs"],argTypes:{size:{control:"text",description:"CSS size value for SVG width and height",defaultValue:"2em"},class:{control:"text",description:"Additional CSS classes on the wrapper element"},style:{control:"text",description:"Inline CSS styles on the wrapper element"},label:{control:"text",description:"Accessible label for screen readers via aria-label",defaultValue:"Loading"},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'These are the stories for the `Spinner` component.\nAn SVG-based indeterminate loading spinner for ongoing processes with unknown duration.\n\n**Accessibility**: The wrapper element uses `role="status"` with `aria-live="polite"` so screen readers\nannounce loading state changes. The SVG graphic is marked `aria-hidden="true"`. The `label` prop sets\n`aria-label` on the wrapper (default: `"Loading"`).\n\n**Color**: The spinner stroke uses `currentColor`, so it inherits the text color of its container.\n\n**Motion**: Support for `prefers-reduced-motion` is planned in\n[#15806](https://github.com/podman-desktop/podman-desktop/issues/15806).'}}}},{Story:I}=_e(),ye=[{label:"Default (2em)"},{label:"2em",size:"2em"},{label:"1em",size:"1em"},{label:"1.4em",size:"1.4em"},{label:"1.5em",size:"1.5em"},{label:"12px",size:"12px"},{label:"16px",size:"16px"}],Ie=[{heading:"Default label",aria:'role="status" aria-label="Loading" aria-live="polite"'},{heading:"Custom label: Pulling image",label:"Pulling image",aria:'role="status" aria-label="Pulling image" aria-live="polite"'},{heading:"Custom label: Checking prerequisites",label:"Checking prerequisites",aria:'role="status" aria-label="Checking prerequisites" aria-live="polite"'},{heading:"Custom label: Building container",label:"Building container",aria:'role="status" aria-label="Building container" aria-live="polite"'},{heading:"Color inheritance: Info",label:"Loading info",containerClass:"text-(--pd-state-info)",aria:"Inherits currentColor from info context"},{heading:"Color inheritance: Warning",label:"Loading warning",containerClass:"text-(--pd-state-warning)",aria:"Inherits currentColor from warning context"},{heading:"Color inheritance: Muted",label:"Loading muted",containerClass:"text-(--pd-content-invert-text)",aria:"Inherits currentColor from muted context"}];var Pe=_('<div class="flex flex-col items-center gap-2 p-3"><div class="text-xs text-(--pd-content-text)"> </div> <!></div>'),Ae=_('<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Sizes used across the app (values preserved exactly).</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-4"></div></div>'),Te=_('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div><!></div> <code class="text-[10px] text-(--pd-content-text) break-all"> </code></div>'),Be=_('<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Accessibility features: ARIA attributes and color inheritance via <code>currentColor</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>'),Me=_('<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Button in progress</div> <!></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">StatusIcon deleting/updating</div> <div class="flex flex-row items-center gap-3"><!> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Toast in-progress state</div> <div class="flex flex-nowrap min-h-10 cursor-default max-h-50 max-w-[420px] flex-row gap-2 bg-(--pd-modal-bg) p-2 text-base"><div class="mr-1 text-(--pd-state-info)"><!></div> <div class="text-base text-(--pd-card-text)">In progress: Pulling image</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Preflight check pending</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking prerequisites</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Typeahead loading</div> <div class="flex flex-row items-center gap-2 bg-(--pd-input-field-bg) px-2 py-1"><div class="text-sm text-(--pd-input-field-placeholder-text)">Search...</div> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Kubernetes context checking</div> <div class="flex flex-row items-center gap-2"><!> <div>Checking context health</div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Markdown command button loading</div> <button class="flex flex-row items-center px-4 py-[6px] rounded-[4px] text-(--pd-button-primary-text) text-[13px] whitespace-nowrap bg-(--pd-button-primary-bg) hover:bg-(--pd-button-primary-hover-bg) no-underline"><div class="mr-2"><!></div> Run command</button></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (starting)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div></div></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Statusbar provider tooltip (mixed states)</div> <div class="rounded-[9px] border border-(--pd-tooltip-outer-border) shadow-[0_4px_12px_var(--pd-shadow-color)] text-[12px] leading-[16px] w-fit"><div class="pt-[4px] pb-[5px] px-[8px] rounded-[9px] bg-(--pd-tooltip-bg) text-(--pd-tooltip-text) border border-(--pd-tooltip-inner-border) backdrop-blur-sm"><div class="flex flex-col"><div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-starting)">Starting</span> : Podman Machine</div> <div class="flex flex-row items-center h-fit"><div class="fa-regular fa-circle-check max-h-3 mr-1 text-(--pd-status-running)"></div> <span class="text-(--pd-status-running)">Running</span> : Docker Desktop</div> <div class="flex flex-row items-center h-fit"><!> <span class="text-(--pd-status-terminated)">Stopping</span> : Lima VM</div></div></div></div></div></div>'),De=_("<!> <!> <!> <!>",1);function ne(A,T){fe(T,!1),Se();var b=De(),w=te(b);I(w,{name:"Basic",parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
              <div class="fa-regular fa-circle-check max-h-3 mr-1 text-(--pd-status-running)"></div>
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
{/if}`}}});var z=n(w,2);I(z,{name:"Sizes",args:{kind:"sizes"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
              <div class="fa-regular fa-circle-check max-h-3 mr-1 text-(--pd-status-running)"></div>
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
{/if}`}}});var C=n(z,2);I(C,{name:"Accessibility",args:{kind:"accessibility"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
              <div class="fa-regular fa-circle-check max-h-3 mr-1 text-(--pd-status-running)"></div>
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
{/if}`}}});var B=n(C,2);I(B,{name:"Contexts",args:{kind:"contexts"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'sizes'}
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
              <div class="fa-regular fa-circle-check max-h-3 mr-1 text-(--pd-status-running)"></div>
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
{/if}`}}}),m(A,b),ge()}ne.__docgen={data:[],name:"Spinner.stories.svelte"};const P=he(ne,Ce),Je=["Basic","Sizes","Accessibility","Contexts"],Qe={...P.Basic,tags:["svelte-csf-v5"]},Xe={...P.Sizes,tags:["svelte-csf-v5"]},Ye={...P.Accessibility,tags:["svelte-csf-v5"]},Ze={...P.Contexts,tags:["svelte-csf-v5"]};export{Ye as Accessibility,Qe as Basic,Ze as Contexts,Xe as Sizes,Je as __namedExportsOrder,Ce as default};
