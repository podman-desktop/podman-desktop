import{k as F,f as N,o as V,b as g,p as q,c as t,d as z,g as b,e as G,j as n,r as e,l as p,a as y,h as k,i as O,s as H}from"./iframe-BQDYTyZf.js";import{c as J,i as K,d as Q}from"./create-runtime-stories-Dz26sd-l.js";import{P as m}from"./ProgressBar-Cqf2-dEd.js";import{e as W}from"./each-DiM-c2HC.js";import"./preload-helper-PPVm8Dsz.js";const X=(M,R)=>{let w=()=>G(R?.(),["_children"]);var I=F(),C=N(I);{var T=i=>{var s=ae(),c=t(n(s),2);W(c,5,()=>Z,r=>r.label,(r,a)=>{var o=te(),d=n(o),h=n(d,!0);e(d);var l=t(d,2),f=n(l);m(f,{get progress(){return p(a).progress}}),e(l);var u=t(l,2);{var _=v=>{var x=ne(),P=n(x,!0);e(x),y(()=>k(P,p(a).note)),g(v,x)};V(u,v=>{p(a).note&&v(_)})}e(o),y(()=>k(h,p(a).label)),g(r,o)}),e(c),e(s),g(i,s)},A=i=>{var s=ie(),c=t(n(s),2);W(c,1,()=>ee,r=>r.label,(r,a)=>{var o=de(),d=n(o),h=n(d,!0);e(d);var l=t(d,2),f=n(l);m(f,{get width(){return p(a).width},get height(){return p(a).height},progress:65}),e(l);var u=t(l,2);{var _=v=>{var x=se(),P=n(x,!0);e(x),y(()=>k(P,p(a).note)),g(v,x)};V(u,v=>{p(a).note&&v(_)})}e(o),y(()=>k(h,p(a).label)),g(r,o)}),e(s),g(i,s)},S=i=>{var s=le(),c=t(n(s),2);W(c,5,()=>$,r=>r.label,(r,a)=>{var o=oe(),d=n(o),h=n(d);e(d);var l=t(d,2),f=n(l);m(f,{get progress(){return p(a).progress}}),e(l);var u=t(l,2);{var _=v=>{var x=re(),P=n(x,!0);e(x),y(()=>k(P,p(a).note)),g(v,x)};V(u,v=>{p(a).note&&v(_)})}e(o),y(()=>k(h,`progress=${p(a).label??""}`)),g(r,o)}),e(c),e(s),g(i,s)},E=i=>{var s=ce(),c=t(n(s),2),r=n(c),a=t(n(r),2),o=n(a);m(o,{progress:50}),e(a),O(2),e(r);var d=t(r,2),h=t(n(d),2),l=n(h);m(l,{}),e(h),O(2),e(d);var f=t(d,2),u=t(n(f),2),_=n(u);m(_,{progress:75,"aria-label":"Downloading image"}),e(u),O(2),e(f),e(c),e(s),g(i,s)},U=i=>{var s=ve(),c=n(s),r=t(n(c),2),a=t(n(r),2),o=n(a);m(o,{class:"items-center",height:"h-1",width:"w-20",progress:42}),e(a),e(r),e(c);var d=t(c,2),h=t(n(d),2),l=t(n(h),2);m(l,{class:"items-center",height:"h-1",width:"w-20",progress:42}),e(h),e(d);var f=t(d,2),u=t(n(f),2),_=t(n(u),2);m(_,{class:"items-center",height:"h-1",width:"w-20"}),e(u),e(f);var v=t(f,2),x=t(n(v),2),P=t(n(x),2);m(P,{progress:68}),e(x),e(v),e(s),g(i,s)},j=i=>{m(i,H(w))};V(C,i=>{w().kind==="levels"?i(T):w().kind==="dimensions"?i(A,1):w().kind==="rounding"?i(S,2):w().kind==="accessibility"?i(E,3):w().kind==="contexts"?i(U,4):i(j,-1)})}g(M,I)},Y={component:m,render:X,title:"Progress/ProgressBar",tags:["autodocs"],argTypes:{progress:{control:{type:"number",min:0,max:100,step:1},description:"Progress percentage (0-100). Undefined shows indeterminate animation."},width:{control:"text",description:"Tailwind width class for the bar"},height:{control:"text",description:"Tailwind height class for the bar"},class:{control:"text",description:"Additional CSS classes on the wrapper element"},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `ProgressBar` component from `packages/renderer`.\n\nA linear progress indicator supporting determinate (0-100% with percentage text)\nand indeterminate (animated sweep for unknown duration) modes. Used in the Task Manager\ntable and the bottom Status Bar.\n\n**Accessibility**: The inner bar uses `role="progressbar"`. Additional ARIA attributes\n(e.g. `aria-label`) can be passed and are spread onto the wrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg` and\n`--pd-progressBar-in-progress-bg` from the color registry.'}}}},{Story:B}=Q(),Z=[{label:"Indeterminate",progress:void 0,note:"progress=undefined"},{label:"0%",progress:0},{label:"25%",progress:25},{label:"50%",progress:50},{label:"75%",progress:75},{label:"100%",progress:100}],$=[{label:"100/3",progress:100/3,note:"Displays as 33%"},{label:"200/3",progress:200/3,note:"Displays as 67%"},{label:"5/3",progress:5/3,note:"Displays as 2%"},{label:"99.9",progress:99.9,note:"Displays as 100%"}],ee=[{label:"Default (w-36, h-2)",width:"w-36",height:"h-2",note:"Component defaults"},{label:"Compact (w-20, h-1)",width:"w-20",height:"h-1",note:"Used in Task Manager and Status Bar"},{label:"Wide (w-48, h-2)",width:"w-48",height:"h-2"},{label:"Full width (w-full, h-2)",width:"w-full",height:"h-2"}];var ne=b('<code class="text-[10px] text-(--pd-content-text)"> </code>'),te=b('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>'),ae=b('<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>'),se=b('<code class="text-[10px] text-(--pd-content-text)"> </code>'),de=b('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>'),ie=b('<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.</div> <!></div>'),re=b('<code class="text-[10px] text-(--pd-content-text)"> </code>'),oe=b('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>'),le=b('<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Percentage text uses <code>Math.round()</code> for display.</div> <div class="grid grid-cols-2 gap-4"></div></div>'),ce=b(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note: <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
        not on the inner element with <code>role="progressbar"</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code></div></div></div>`),ve=b('<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div> <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3"><div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div> <div class="flex items-center gap-x-2"><!></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)"><div class="text-sm">Installing extension from OCI image...</div> <!></div></div></div>'),xe=b("<!> <!> <!> <!> <!> <!>",1);function L(M,R){q(R,!1),K();var w=xe(),I=N(w);B(I,{name:"Basic",args:{progress:50},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var C=t(I,2);B(C,{name:"Progress Levels",args:{kind:"levels"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var T=t(C,2);B(T,{name:"Dimensions",args:{kind:"dimensions"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var A=t(T,2);B(A,{name:"Rounding",args:{kind:"rounding"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var S=t(A,2);B(S,{name:"Accessibility",args:{kind:"accessibility"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}});var E=t(S,2);B(E,{name:"Contexts",args:{kind:"contexts"},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {#each progressVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'dimensions'}
  <div class="flex flex-col gap-6">
    <div class="text-sm text-(--pd-content-text)">
      Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.
    </div>

    {#each dimensionVariants as variant (variant.label)}
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4">
        <div class="text-xs font-semibold text-(--pd-content-header)">{variant.label}</div>

        <div class="py-2">
          <ProgressBar width={variant.width} height={variant.height} progress={65} />
        </div>

        {#if variant.note}
          <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
        {/if}
      </div>
    {/each}
  </div>
{:else if args.kind === 'rounding'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      Percentage text uses <code>Math.round()</code> for display.
    </div>

    <div class="grid grid-cols-2 gap-4">
      {#each roundingVariants as variant (variant.label)}
        <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
          <div class="text-xs font-semibold text-(--pd-content-header)">progress={variant.label}</div>

          <div class="py-2">
            <ProgressBar progress={variant.progress} />
          </div>

          {#if variant.note}
            <code class="text-[10px] text-(--pd-content-text)">{variant.note}</code>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else if args.kind === 'accessibility'}
  <div class="flex flex-col gap-4">
    <div class="text-sm text-(--pd-content-text)">
      The inner bar element uses <code>role="progressbar"</code> with <code>aria-valuemin</code> and
      <code>aria-valuemax</code>. Determinate mode also sets <code>aria-valuenow</code>. Note:
      <code>aria-label</code> and other ARIA props land on the outer wrapper via <code>restProps</code>,
      not on the inner element with <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-valuemin="0" aria-valuemax="100" (no aria-valuenow)</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label on wrapper, not on role="progressbar"</code>
      </div>
    </div>
  </div>
{:else if args.kind === 'contexts'}
  <div class="flex flex-col gap-6 text-(--pd-content-text)">
    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div>

      <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3">
        <div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div>
        <div class="flex items-center gap-x-2">
          <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" progress={42} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div>

      <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)">
        <span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span>
        <ProgressBar class="items-center" height="h-1" width="w-20" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)">
        <div class="text-sm">Installing extension from OCI image...</div>
        <ProgressBar progress={68} />
      </div>
    </div>
  </div>
{:else}
  <ProgressBar {...args} />
{/if}`}}}),g(M,w),z()}L.__docgen={data:[],name:"ProgressBar.stories.svelte"};const D=J(L,Y),he=["Basic","ProgressLevels","Dimensions","Rounding","Accessibility","Contexts"],ue={...D.Basic,tags:["svelte-csf-v5"]},we={...D.ProgressLevels,tags:["svelte-csf-v5"]},_e={...D.Dimensions,tags:["svelte-csf-v5"]},Pe={...D.Rounding,tags:["svelte-csf-v5"]},ye={...D.Accessibility,tags:["svelte-csf-v5"]},ke={...D.Contexts,tags:["svelte-csf-v5"]};export{ye as Accessibility,ue as Basic,ke as Contexts,_e as Dimensions,we as ProgressLevels,Pe as Rounding,he as __namedExportsOrder,Y as default};
