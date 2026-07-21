import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Dt as n,N as r,Nt as i,Sn as a,Ut as o,at as s,gt as c,hn as l,jt as u,m as d,nn as f,q as p,rn as m,rt as h,s as g,st as _,un as v,yn as y}from"./iframe-B3tDhzOO.js";import{a as b,i as x,n as S,r as ee,t as te}from"./create-runtime-stories-3MZ5jW5z.js";import{L as ne,P as C,f as re,g as w,t as T}from"./Icon-B-n5MYAE.js";import{r as ie}from"./Button-D5YY7g_Z.js";import{A as E,_ as ae,t as oe}from"./dist-DQnnFEur.js";function D(e,n){m(n,!1),d();var r=K(),a=u(r);P(a,{name:`Message Types`,children:(e,n)=>{var r=H(),a=t(r),o=i(t(a),2),c=t(o);O(c,()=>`success`,()=>`Success`,()=>`Container started successfully`);var l=i(c,2);O(l,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var u=i(l,2);O(u,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`);var d=i(u,2);O(d,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),v(o),v(a),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All message types in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
<div class="flex flex-col gap-6">
  <p class="text-sm text-(--pd-content-text)">
    Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
    variables. Switch themes to verify all variants update correctly.
  </p>
  <div class="flex flex-wrap gap-6">
    {@render messageToast('success', 'Success', 'Container started successfully')}
    {@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
    {@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
    {@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
  </div>
</div>
</div>
</undefined>`}}});var o=i(a,2);P(o,{name:`Message: Success`,children:(e,n)=>{var r=U(),i=t(r);O(i,()=>`success`,()=>`Success`,()=>`Container started successfully`),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual message type stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var c=i(o,2);P(c,{name:`Message: Error`,children:(e,n)=>{var r=U(),i=t(r);O(i,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var l=i(c,2);P(l,{name:`Message: Warning`,children:(e,n)=>{var r=U(),i=t(r);O(i,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var p=i(l,2);P(p,{name:`Message: Info`,children:(e,n)=>{var r=U(),i=t(r);O(i,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var h=i(p,2);P(h,{name:`Task Notifications`,children:(e,n)=>{var r=W(),a=t(r),o=i(t(a),2),c=t(o);k(c,()=>`Pulling image podman-desktop/ubuntu:latest`);var l=i(c,2);A(l,()=>`Container started successfully`);var u=i(l,2);j(u,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`);var d=i(u,2);M(d,()=>`Pull podman-desktop/ubuntu:latest`),v(o),v(a),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All task notification states in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
<div class="flex flex-col gap-6">
  <p class="text-sm text-(--pd-content-text)">
    Task toasts track long-running operations such as pulling images or starting providers.
    They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
    for the status icons, independent of the message toast palette.
  </p>
  <div class="flex flex-wrap gap-6">
    {@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
    {@render taskToastSuccess('Container started successfully')}
    {@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
    {@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
  </div>
</div>
</div>
</undefined>`}}});var g=i(h,2);P(g,{name:`Task: In Progress`,children:(e,n)=>{var r=U(),i=t(r);k(i,()=>`Pulling image podman-desktop/ubuntu:latest`),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual task state stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var _=i(g,2);P(_,{name:`Task: Success`,children:(e,n)=>{var r=U(),i=t(r);A(i,()=>`Container started successfully`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var y=i(_,2);P(y,{name:`Task: Failure`,children:(e,n)=>{var r=U(),i=t(r);j(i,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var b=i(y,2);P(b,{name:`Task: Canceled`,children:(e,n)=>{var r=U(),i=t(r);M(i,()=>`Pull podman-desktop/ubuntu:latest`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var x=i(b,2);P(x,{name:`All Types`,children:(e,n)=>{var r=G(),a=t(r),o=t(a),c=i(t(o),2),l=t(c);O(l,()=>`success`,()=>`Success`,()=>`Container started successfully`);var u=i(l,2);O(u,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var d=i(u,2);O(d,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`);var f=i(d,2);O(f,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),v(c),v(o);var p=i(o,2),m=i(t(p),2),h=t(m);k(h,()=>`Pulling image podman-desktop/ubuntu:latest`);var g=i(h,2);A(g,()=>`Container started successfully`);var _=i(g,2);j(_,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`);var y=i(_,2);M(y,()=>`Pull podman-desktop/ubuntu:latest`),v(m),v(p),v(a),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Combined overview`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
<div class="flex flex-col gap-8">
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3>
    <div class="flex flex-wrap gap-4">
      {@render messageToast('success', 'Success', 'Container started successfully')}
      {@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
      {@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
      {@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
    </div>
  </div>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3>
    <div class="flex flex-wrap gap-4">
      {@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
      {@render taskToastSuccess('Container started successfully')}
      {@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
      {@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
    </div>
  </div>
</div>
</div>
</undefined>`}}}),s(e,r),f()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,se,ce,le,ue,de,fe,$;e((()=>{a(),b(),y(),ne(),oe(),ae(),x(),g(),S(),O=(e,a=l,u=l,d=l)=>{var f=L(),m=t(f),g=t(m,!0);v(m);var _=i(m,2),y=t(_),b=t(y),x=e=>{var r=F(),l=t(r);{let e=o(()=>a()===`error`?w:C);T(l,{get icon(){return c(e)},class:`shrink-0 mt-1`})}var u=i(l,2),f=t(u,!0);v(u),v(r),n(()=>h(f,d())),s(e,r)},S=e=>{var r=I(),i=t(r,!0);v(r),n(()=>h(i,d())),s(e,r)};p(b,e=>{a()===`error`||a()===`warning`?e(x):e(S,-1)}),v(y);var ee=i(y,4);v(_),v(f),n(()=>{h(g,u()),r(_,`background: var(--pd-toast-${a()??``}-bg); color: var(--pd-toast-${a()??``}-color);`),r(ee,`background: var(--pd-toast-${a()??``}-bar-bg);`)}),s(e,f)},k=(e,r=l)=>{var a=R(),o=i(t(a),2),c=t(o),u=t(c);ie(t(u),{size:`1.5em`}),v(u);var d=i(u,2),f=t(d,!0);v(d),v(c),E(i(c,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(o),v(a),n(()=>h(f,r())),s(e,a)},A=(e,r=l)=>{var a=z(),o=i(t(a),2),c=t(o),u=t(c);T(t(u),{get icon(){return re},class:`text-(--pd-state-success) fa-xl`}),v(u);var d=i(u,2),f=t(d,!0);v(d),v(c),E(i(c,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(o),v(a),n(()=>h(f,r())),s(e,a)},j=(e,r=l,a=l)=>{var o=B(),c=i(t(o),2),u=t(c),d=t(u);T(t(d),{get icon(){return w},class:`text-(--pd-state-error) fa-xl`}),v(d);var f=i(d,2),p=t(f),m=t(p);v(p);var g=i(p,2),_=t(g,!0);v(g),v(f),v(u),E(i(u,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(c),v(o),n(()=>{h(m,`Error ${r()??``}`),h(_,a())}),s(e,o)},M=(e,r=l)=>{var a=V(),o=i(t(a),2),c=t(o),u=t(c);T(t(u),{get icon(){return C},class:`text-(--pd-state-warning) fa-xl`}),v(u);var d=i(u,2),f=t(d);v(d),v(c),E(i(c,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(o),v(a),n(()=>h(f,`Canceled ${r()??``}`)),s(e,a)},N={title:`Toast`,tags:[`autodocs`],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:P}=ee(N),F=_(`<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>`),I=_(`<div class="px-3 pt-2 pb-2.5"> </div>`),L=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>`),R=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),z=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),B=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>`),V=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),H=_(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),U=_(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),W=_(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),G=_(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>`),K=_(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`Toast.stories.svelte`},q=te(D,N),J=[`MessageTypes`,`MessageSuccess`,`MessageError`,`MessageWarning`,`MessageInfo`,`TaskNotifications`,`TaskInProgress`,`TaskSuccess`,`TaskFailure`,`TaskCanceled`,`AllTypes`],Y={...q.MessageTypes,tags:[`svelte-csf-v5`]},X={...q.MessageSuccess,tags:[`svelte-csf-v5`]},Z={...q.MessageError,tags:[`svelte-csf-v5`]},Q={...q.MessageWarning,tags:[`svelte-csf-v5`]},se={...q.MessageInfo,tags:[`svelte-csf-v5`]},ce={...q.TaskNotifications,tags:[`svelte-csf-v5`]},le={...q.TaskInProgress,tags:[`svelte-csf-v5`]},ue={...q.TaskSuccess,tags:[`svelte-csf-v5`]},de={...q.TaskFailure,tags:[`svelte-csf-v5`]},fe={...q.TaskCanceled,tags:[`svelte-csf-v5`]},$={...q.AllTypes,tags:[`svelte-csf-v5`]}}))();export{$ as AllTypes,Z as MessageError,se as MessageInfo,X as MessageSuccess,Y as MessageTypes,Q as MessageWarning,fe as TaskCanceled,de as TaskFailure,le as TaskInProgress,ce as TaskNotifications,ue as TaskSuccess,J as __namedExportsOrder,N as default};