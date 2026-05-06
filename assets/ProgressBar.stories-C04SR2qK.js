import{k as F,f as N,o as V,b as g,p as q,c as t,d as z,g as h,e as G,j as n,r as e,l as x,a as y,h as k,i as O,s as H}from"./iframe-Csx2Ais-.js";import{c as J,i as K,d as Q}from"./create-runtime-stories-BZRqdS1V.js";import{P as b}from"./ProgressBar-B7fjXa6m.js";import{e as W}from"./each-C28urEsR.js";import"./preload-helper-PPVm8Dsz.js";import"./attributes-Ce868Ijz.js";const X=(M,R)=>{let u=()=>G(R?.(),["_children"]);var I=F(),C=N(I);{var T=r=>{var d=se(),c=t(n(d),2);W(c,5,()=>Z,i=>i.label,(i,s)=>{var o=te(),a=n(o),m=n(a,!0);e(a);var l=t(a,2),f=n(l);b(f,{get progress(){return x(s).progress}}),e(l);var w=t(l,2);{var _=v=>{var p=ne(),P=n(p,!0);e(p),y(()=>k(P,x(s).note)),g(v,p)};V(w,v=>{x(s).note&&v(_)})}e(o),y(()=>k(m,x(s).label)),g(i,o)}),e(c),e(d),g(r,d)},A=r=>{var d=re(),c=t(n(d),2);W(c,1,()=>ee,i=>i.label,(i,s)=>{var o=ae(),a=n(o),m=n(a,!0);e(a);var l=t(a,2),f=n(l);b(f,{get width(){return x(s).width},get height(){return x(s).height},progress:65}),e(l);var w=t(l,2);{var _=v=>{var p=de(),P=n(p,!0);e(p),y(()=>k(P,x(s).note)),g(v,p)};V(w,v=>{x(s).note&&v(_)})}e(o),y(()=>k(m,x(s).label)),g(i,o)}),e(d),g(r,d)},S=r=>{var d=le(),c=t(n(d),2);W(c,5,()=>$,i=>i.label,(i,s)=>{var o=oe(),a=n(o),m=n(a);e(a);var l=t(a,2),f=n(l);b(f,{get progress(){return x(s).progress}}),e(l);var w=t(l,2);{var _=v=>{var p=ie(),P=n(p,!0);e(p),y(()=>k(P,x(s).note)),g(v,p)};V(w,v=>{x(s).note&&v(_)})}e(o),y(()=>k(m,`progress=${x(s).label??""}`)),g(i,o)}),e(c),e(d),g(r,d)},E=r=>{var d=ce(),c=t(n(d),2),i=n(c),s=t(n(i),2),o=n(s);b(o,{progress:50}),e(s),O(2),e(i);var a=t(i,2),m=t(n(a),2),l=n(m);b(l,{}),e(m),O(2),e(a);var f=t(a,2),w=t(n(f),2),_=n(w);b(_,{progress:75,"aria-label":"Downloading image"}),e(w),O(2),e(f),e(c),e(d),g(r,d)},U=r=>{var d=ve(),c=n(d),i=t(n(c),2),s=t(n(i),2),o=n(s);b(o,{class:"items-center",height:"h-1",width:"w-20",progress:42}),e(s),e(i),e(c);var a=t(c,2),m=t(n(a),2),l=t(n(m),2);b(l,{class:"items-center",height:"h-1",width:"w-20",progress:42}),e(m),e(a);var f=t(a,2),w=t(n(f),2),_=t(n(w),2);b(_,{class:"items-center",height:"h-1",width:"w-20"}),e(w),e(f);var v=t(f,2),p=t(n(v),2),P=t(n(p),2);b(P,{progress:68}),e(p),e(v),e(d),g(r,d)},j=r=>{b(r,H(u))};V(C,r=>{u().kind==="levels"?r(T):u().kind==="dimensions"?r(A,1):u().kind==="rounding"?r(S,2):u().kind==="accessibility"?r(E,3):u().kind==="contexts"?r(U,4):r(j,-1)})}g(M,I)},Y={component:b,render:X,title:"Progress/ProgressBar",tags:["autodocs"],argTypes:{progress:{control:{type:"number",min:0,max:100,step:1},description:"Progress percentage (0-100). Undefined shows indeterminate animation."},width:{control:"text",description:"Tailwind width class for the bar"},height:{control:"text",description:"Tailwind height class for the bar"},class:{control:"text",description:"Additional CSS classes on the wrapper element"},kind:{table:{disable:!0}}},parameters:{docs:{description:{component:'Stories for the `ProgressBar` component from `packages/renderer`.\n\nA linear progress indicator supporting determinate (0-100% with percentage text)\nand indeterminate (animated sweep for unknown duration) modes. Used in the Task Manager\ntable and the bottom Status Bar.\n\n**Accessibility**: The inner bar uses `role="progressbar"`. Additional ARIA attributes\n(e.g. `aria-label`) can be passed and are spread onto the wrapper element.\n\n**Theming**: Uses CSS custom properties `--pd-progressBar-bg` and\n`--pd-progressBar-in-progress-bg` from the color registry.'}}}},{Story:B}=Q(),Z=[{label:"Indeterminate",progress:void 0,note:"progress=undefined"},{label:"0%",progress:0},{label:"25%",progress:25},{label:"50%",progress:50},{label:"75%",progress:75},{label:"100%",progress:100}],$=[{label:"100/3",progress:100/3,note:"Displays as 33%"},{label:"200/3",progress:200/3,note:"Displays as 67%"},{label:"5/3",progress:5/3,note:"Displays as 2%"},{label:"99.9",progress:99.9,note:"Displays as 100%"}],ee=[{label:"Default (w-36, h-4)",width:"w-36",height:"h-4",note:"Component defaults"},{label:"Compact (w-20, h-1)",width:"w-20",height:"h-1",note:"Used in Task Manager and Status Bar"},{label:"Wide (w-48, h-2)",width:"w-48",height:"h-2"},{label:"Full width (w-full, h-2)",width:"w-full",height:"h-2"}];var ne=h('<code class="text-[10px] text-(--pd-content-text)"> </code>'),te=h('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>'),se=h('<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Determinate mode shows a filled bar with percentage text. Indeterminate mode shows an animated sweep.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"></div></div>'),de=h('<code class="text-[10px] text-(--pd-content-text)"> </code>'),ae=h('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>'),re=h('<div class="flex flex-col gap-6"><div class="text-sm text-(--pd-content-text)">Width and height are Tailwind classes. The compact variant (w-20, h-1) is used in production.</div> <!></div>'),ie=h('<code class="text-[10px] text-(--pd-content-text)"> </code>'),oe=h('<div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)"> </div> <div class="py-2"><!></div> <!></div>'),le=h('<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">Percentage text uses <code>Math.round()</code> for display.</div> <div class="grid grid-cols-2 gap-4"></div></div>'),ce=h(`<div class="flex flex-col gap-4"><div class="text-sm text-(--pd-content-text)">The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
        ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with <code>role="progressbar"</code>.</div> <div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code></div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3"><div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div> <div class="py-2"><!></div> <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code></div></div></div>`),ve=h('<div class="flex flex-col gap-6 text-(--pd-content-text)"><div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Task Manager table row</div> <div class="flex items-center gap-x-4 rounded border border-(--pd-content-divider) px-4 py-3"><div class="text-sm w-48 truncate">Pulling docker.io/library/nginx:latest</div> <div class="flex items-center gap-x-2"><!></div></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">Pulling nginx:latest</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Status bar indicator (indeterminate)</div> <div class="flex items-center gap-x-2 rounded border border-(--pd-content-divider) px-3 py-2 text-xs bg-(--pd-content-card-bg)"><span class="max-w-32 text-ellipsis overflow-hidden whitespace-nowrap">2 tasks running</span> <!></div></div> <div class="flex flex-col gap-2"><div class="text-sm font-semibold text-(--pd-content-header)">Extension install dialog</div> <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-4 bg-(--pd-content-card-bg)"><div class="text-sm">Installing extension from OCI image...</div> <!></div></div></div>'),pe=h("<!> <!> <!> <!> <!> <!>",1);function L(M,R){q(R,!1),K();var u=pe(),I=N(u);B(I,{name:"Basic",args:{progress:50},parameters:{__svelteCsf:{rawCode:`{#if args.kind === 'levels'}
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
      The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
      ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
      <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
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
      The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
      ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
      <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
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
      The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
      ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
      <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
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
      The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
      ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
      <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
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
      The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
      ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
      <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
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
      The inner bar element uses <code>role="progressbar"</code>. Note: <code>aria-label</code> and other
      ARIA props land on the outer wrapper via <code>restProps</code>, not on the inner element with
      <code>role="progressbar"</code>.
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Determinate with role</div>

        <div class="py-2">
          <ProgressBar progress={50} />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Indeterminate with role</div>

        <div class="py-2">
          <ProgressBar />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">role="progressbar" on inner bar</code>
      </div>

      <div class="flex flex-col gap-2 rounded border border-(--pd-content-divider) p-3">
        <div class="text-xs font-semibold text-(--pd-content-header)">Custom aria-label</div>

        <div class="py-2">
          <ProgressBar progress={75} aria-label="Downloading image" />
        </div>

        <code class="text-[10px] text-(--pd-content-text) break-all">aria-label="Downloading image"</code>
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
{/if}`}}}),g(M,u),z()}L.__docgen={data:[],name:"ProgressBar.stories.svelte"};const D=J(L,Y),we=["Basic","ProgressLevels","Dimensions","Rounding","Accessibility","Contexts"],ue={...D.Basic,tags:["svelte-csf-v5"]},_e={...D.ProgressLevels,tags:["svelte-csf-v5"]},Pe={...D.Dimensions,tags:["svelte-csf-v5"]},ye={...D.Rounding,tags:["svelte-csf-v5"]},ke={...D.Accessibility,tags:["svelte-csf-v5"]},Be={...D.Contexts,tags:["svelte-csf-v5"]};export{ke as Accessibility,ue as Basic,Be as Contexts,Pe as Dimensions,_e as ProgressLevels,ye as Rounding,we as __namedExportsOrder,Y as default};
