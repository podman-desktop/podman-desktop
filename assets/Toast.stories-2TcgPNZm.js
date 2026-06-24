import{i as e}from"./preload-helper-xPQekRTU.js";import{At as t,Dt as n,N as r,Nt as i,Sn as a,Ut as o,at as s,gt as c,hn as l,jt as u,m as d,nn as f,q as p,rn as m,rt as h,s as g,st as _,un as v,yn as y}from"./iframe-By09XlDr.js";import{a as b,i as x,n as S,r as C,t as ee}from"./create-runtime-stories-B-3OhJ9A.js";import{L as te,P as w,f as ne,g as T,t as E}from"./Icon-SuyQ2Qwm.js";import{r as re}from"./Button-CDTJQvbw.js";import{A as D,_ as ie,t as ae}from"./dist-DGjhThcP.js";function O(e,n){m(n,!1),d();var r=K(),a=u(r);F(a,{name:`Message Types`,children:(e,n)=>{var r=oe(),a=t(r),o=i(t(a),2),c=t(o);k(c,()=>`success`,()=>`Success`,()=>`Container started successfully`);var l=i(c,2);k(l,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var u=i(l,2);k(u,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),k(i(u,2),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),v(o),v(a),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All message types in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var o=i(a,2);F(o,{name:`Message: Success`,children:(e,n)=>{var r=U();k(t(r),()=>`success`,()=>`Success`,()=>`Container started successfully`),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual message type stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var c=i(o,2);F(c,{name:`Message: Error`,children:(e,n)=>{var r=U();k(t(r),()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var l=i(c,2);F(l,{name:`Message: Warning`,children:(e,n)=>{var r=U();k(t(r),()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var p=i(l,2);F(p,{name:`Message: Info`,children:(e,n)=>{var r=U();k(t(r),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var h=i(p,2);F(h,{name:`Task Notifications`,children:(e,n)=>{var r=W(),a=t(r),o=i(t(a),2),c=t(o);A(c,()=>`Pulling image podman-desktop/ubuntu:latest`);var l=i(c,2);j(l,()=>`Container started successfully`);var u=i(l,2);M(u,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),N(i(u,2),()=>`Pull podman-desktop/ubuntu:latest`),v(o),v(a),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All task notification states in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var g=i(h,2);F(g,{name:`Task: In Progress`,children:(e,n)=>{var r=U();A(t(r),()=>`Pulling image podman-desktop/ubuntu:latest`),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual task state stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var _=i(g,2);F(_,{name:`Task: Success`,children:(e,n)=>{var r=U();j(t(r),()=>`Container started successfully`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var y=i(_,2);F(y,{name:`Task: Failure`,children:(e,n)=>{var r=U();M(t(r),()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var b=i(y,2);F(b,{name:`Task: Canceled`,children:(e,n)=>{var r=U();N(t(r),()=>`Pull podman-desktop/ubuntu:latest`),v(r),s(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}}),F(i(b,2),{name:`All Types`,children:(e,n)=>{var r=G(),a=t(r),o=t(a),c=i(t(o),2),l=t(c);k(l,()=>`success`,()=>`Success`,()=>`Container started successfully`);var u=i(l,2);k(u,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var d=i(u,2);k(d,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),k(i(d,2),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),v(c),v(o);var f=i(o,2),p=i(t(f),2),m=t(p);A(m,()=>`Pulling image podman-desktop/ubuntu:latest`);var h=i(m,2);j(h,()=>`Container started successfully`);var g=i(h,2);M(g,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),N(i(g,2),()=>`Pull podman-desktop/ubuntu:latest`),v(p),v(f),v(a),v(r),s(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Combined overview`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),s(e,r),f()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,oe,U,W,G,K,q,J,Y,X,Z,Q,$,se,ce,le,ue,de,fe;e((()=>{a(),b(),y(),te(),ae(),ie(),x(),g(),S(),k=(e,a=l,u=l,d=l)=>{var f=R(),m=t(f),g=t(m,!0);v(m);var _=i(m,2),y=t(_),b=t(y),x=e=>{var r=I(),l=t(r);{let e=o(()=>a()===`error`?T:w);E(l,{get icon(){return c(e)},class:`shrink-0 mt-1`})}var u=i(l,2),f=t(u,!0);v(u),v(r),n(()=>h(f,d())),s(e,r)},S=e=>{var r=L(),i=t(r,!0);v(r),n(()=>h(i,d())),s(e,r)};p(b,e=>{a()===`error`||a()===`warning`?e(x):e(S,-1)}),v(y);var C=i(y,4);v(_),v(f),n(()=>{h(g,u()),r(_,`background: var(--pd-toast-${a()??``}-bg); color: var(--pd-toast-${a()??``}-color);`),r(C,`background: var(--pd-toast-${a()??``}-bar-bg);`)}),s(e,f)},A=(e,r=l)=>{var a=z(),o=i(t(a),2),c=t(o),u=t(c);re(t(u),{size:`1.5em`}),v(u);var d=i(u,2),f=t(d,!0);v(d),v(c),D(i(c,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(o),v(a),n(()=>h(f,r())),s(e,a)},j=(e,r=l)=>{var a=B(),o=i(t(a),2),c=t(o),u=t(c);E(t(u),{get icon(){return ne},class:`text-(--pd-state-success) fa-xl`}),v(u);var d=i(u,2),f=t(d,!0);v(d),v(c),D(i(c,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(o),v(a),n(()=>h(f,r())),s(e,a)},M=(e,r=l,a=l)=>{var o=V(),c=i(t(o),2),u=t(c),d=t(u);E(t(d),{get icon(){return T},class:`text-(--pd-state-error) fa-xl`}),v(d);var f=i(d,2),p=t(f),m=t(p);v(p);var g=i(p,2),_=t(g,!0);v(g),v(f),v(u),D(i(u,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(c),v(o),n(()=>{h(m,`Error ${r()??``}`),h(_,a())}),s(e,o)},N=(e,r=l)=>{var a=H(),o=i(t(a),2),c=t(o),u=t(c);E(t(u),{get icon(){return w},class:`text-(--pd-state-warning) fa-xl`}),v(u);var d=i(u,2),f=t(d);v(d),v(c),D(i(c,2),{class:`text-(--pd-modal-text) flex-none self-start`}),v(o),v(a),n(()=>h(f,`Canceled ${r()??``}`)),s(e,a)},P={title:`Toast`,tags:[`autodocs`],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:F}=C(P),I=_(`<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>`),L=_(`<div class="px-3 pt-2 pb-2.5"> </div>`),R=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>`),z=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),B=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),V=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>`),H=_(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),oe=_(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),U=_(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),W=_(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),G=_(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>`),K=_(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`Toast.stories.svelte`},q=ee(O,P),J=[`MessageTypes`,`MessageSuccess`,`MessageError`,`MessageWarning`,`MessageInfo`,`TaskNotifications`,`TaskInProgress`,`TaskSuccess`,`TaskFailure`,`TaskCanceled`,`AllTypes`],Y={...q.MessageTypes,tags:[`svelte-csf-v5`]},X={...q.MessageSuccess,tags:[`svelte-csf-v5`]},Z={...q.MessageError,tags:[`svelte-csf-v5`]},Q={...q.MessageWarning,tags:[`svelte-csf-v5`]},$={...q.MessageInfo,tags:[`svelte-csf-v5`]},se={...q.TaskNotifications,tags:[`svelte-csf-v5`]},ce={...q.TaskInProgress,tags:[`svelte-csf-v5`]},le={...q.TaskSuccess,tags:[`svelte-csf-v5`]},ue={...q.TaskFailure,tags:[`svelte-csf-v5`]},de={...q.TaskCanceled,tags:[`svelte-csf-v5`]},fe={...q.AllTypes,tags:[`svelte-csf-v5`]}}))();export{fe as AllTypes,Z as MessageError,$ as MessageInfo,X as MessageSuccess,Y as MessageTypes,Q as MessageWarning,de as TaskCanceled,ue as TaskFailure,ce as TaskInProgress,se as TaskNotifications,le as TaskSuccess,J as __namedExportsOrder,P as default};