import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{At as t,F as n,It as r,Lt as i,Nt as a,Pt as o,Y as s,an as c,at as l,c as u,ct as d,h as f,on as p,pn as m,qt as h,ut as g,wn as _,xn as v,yn as y,yt as b}from"./iframe-Bne3KOWP.js";import{a as x,i as S,n as C,r as w,t as ee}from"./create-runtime-stories-gn_WU5xr.js";import{L as te,P as T,f as ne,g as E,t as D}from"./Icon-Dx43b1Sr.js";import{r as re}from"./Button-BZ6jAZKY.js";import{k as O,m as ie,t as ae}from"./dist-Bxhm9zYv.js";function k(e,t){p(t,!1),f();var n=q(),r=o(n);I(r,{name:`Message Types`,children:(e,t)=>{var n=oe(),r=a(n),o=i(a(r),2),s=a(o);A(s,()=>`success`,()=>`Success`,()=>`Container started successfully`);var c=i(s,2);A(c,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var l=i(c,2);A(l,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`);var u=i(l,2);A(u,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),m(o),m(r),m(n),d(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`All message types in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var s=i(r,2);I(s,{name:`Message: Success`,children:(e,t)=>{var n=W(),r=a(n);A(r,()=>`success`,()=>`Success`,()=>`Container started successfully`),m(n),d(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual message type stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var l=i(s,2);I(l,{name:`Message: Error`,children:(e,t)=>{var n=W(),r=a(n);A(r,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`),m(n),d(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var u=i(l,2);I(u,{name:`Message: Warning`,children:(e,t)=>{var n=W(),r=a(n);A(r,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),m(n),d(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var h=i(u,2);I(h,{name:`Message: Info`,children:(e,t)=>{var n=W(),r=a(n);A(r,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),m(n),d(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var g=i(h,2);I(g,{name:`Task Notifications`,children:(e,t)=>{var n=G(),r=a(n),o=i(a(r),2),s=a(o);j(s,()=>`Pulling image podman-desktop/ubuntu:latest`);var c=i(s,2);M(c,()=>`Container started successfully`);var l=i(c,2);N(l,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`);var u=i(l,2);P(u,()=>`Pull podman-desktop/ubuntu:latest`),m(o),m(r),m(n),d(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`All task notification states in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var _=i(g,2);I(_,{name:`Task: In Progress`,children:(e,t)=>{var n=W(),r=a(n);j(r,()=>`Pulling image podman-desktop/ubuntu:latest`),m(n),d(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual task state stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var v=i(_,2);I(v,{name:`Task: Success`,children:(e,t)=>{var n=W(),r=a(n);M(r,()=>`Container started successfully`),m(n),d(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var y=i(v,2);I(y,{name:`Task: Failure`,children:(e,t)=>{var n=W(),r=a(n);N(r,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),m(n),d(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var b=i(y,2);I(b,{name:`Task: Canceled`,children:(e,t)=>{var n=W(),r=a(n);P(r,()=>`Pull podman-desktop/ubuntu:latest`),m(n),d(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var x=i(b,2);I(x,{name:`All Types`,children:(e,t)=>{var n=K(),r=a(n),o=a(r),s=i(a(o),2),c=a(s);A(c,()=>`success`,()=>`Success`,()=>`Container started successfully`);var l=i(c,2);A(l,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var u=i(l,2);A(u,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`);var f=i(u,2);A(f,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),m(s),m(o);var p=i(o,2),h=i(a(p),2),g=a(h);j(g,()=>`Pulling image podman-desktop/ubuntu:latest`);var _=i(g,2);M(_,()=>`Container started successfully`);var v=i(_,2);N(v,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`);var y=i(v,2);P(y,()=>`Pull podman-desktop/ubuntu:latest`),m(h),m(p),m(r),m(n),d(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`Combined overview`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),d(e,n),c()}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,oe,W,G,K,q,J,Y,X,Z,Q,$,se,ce,le,ue,de,fe,pe;function me(){return(me=e((()=>{_(),x(),v(),te(),ae(),ie(),S(),u(),C(),A=(e,o=y,c=y,u=y)=>{var f=z(),p=a(f),g=r(p,!0),_=i(p,2),v=a(_),x=a(v),S=e=>{var n=L(),s=a(n);{let e=h(()=>o()===`error`?E:T);D(s,{get icon(){return b(e)},class:`shrink-0 mt-1`})}var c=i(s,2),f=r(c,!0);m(n),t(()=>l(f,u())),d(e,n)},C=e=>{var n=R(),i=r(n,!0);t(()=>l(i,u())),d(e,n)};s(x,e=>{o()===`error`||o()===`warning`?e(S):e(C,-1)}),m(v);var w=i(v,4);m(_),m(f),t(()=>{l(g,c()),n(_,`background: var(--pd-toast-${o()??``}-bg); color: var(--pd-toast-${o()??``}-color);`),n(w,`background: var(--pd-toast-${o()??``}-bar-bg);`)}),d(e,f)},j=(e,n=y)=>{var o=B(),s=i(a(o),2),c=a(s),u=a(c),f=a(u);re(f,{size:`1.5em`}),m(u);var p=i(u,2),h=r(p,!0);m(c);var g=i(c,2);O(g,{class:`text-(--pd-modal-text) flex-none self-start`}),m(s),m(o),t(()=>l(h,n())),d(e,o)},M=(e,n=y)=>{var o=V(),s=i(a(o),2),c=a(s),u=a(c),f=a(u);D(f,{get icon(){return ne},class:`text-(--pd-state-success) fa-xl`}),m(u);var p=i(u,2),h=r(p,!0);m(c);var g=i(c,2);O(g,{class:`text-(--pd-modal-text) flex-none self-start`}),m(s),m(o),t(()=>l(h,n())),d(e,o)},N=(e,n=y,o=y)=>{var s=H(),c=i(a(s),2),u=a(c),f=a(u),p=a(f);D(p,{get icon(){return E},class:`text-(--pd-state-error) fa-xl`}),m(f);var h=i(f,2),g=a(h),_=r(g),v=i(g,2),b=r(v,!0);m(h),m(u);var x=i(u,2);O(x,{class:`text-(--pd-modal-text) flex-none self-start`}),m(c),m(s),t(()=>{l(_,`Error ${n()??``}`),l(b,o())}),d(e,s)},P=(e,n=y)=>{var o=U(),s=i(a(o),2),c=a(s),u=a(c),f=a(u);D(f,{get icon(){return T},class:`text-(--pd-state-warning) fa-xl`}),m(u);var p=i(u,2),h=r(p);m(c);var g=i(c,2);O(g,{class:`text-(--pd-modal-text) flex-none self-start`}),m(s),m(o),t(()=>l(h,`Canceled ${n()??``}`)),d(e,o)},F={title:`Toast`,tags:[`autodocs`],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:I}=w(F),L=g(`<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>`),R=g(`<div class="px-3 pt-2 pb-2.5"> </div>`),z=g(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>`),B=g(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),V=g(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),H=g(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>`),U=g(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),oe=g(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),W=g(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),G=g(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),K=g(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>`),q=g(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),k.__docgen={data:[],name:`Toast.stories.svelte`},J=ee(k,F),Y=[`MessageTypes`,`MessageSuccess`,`MessageError`,`MessageWarning`,`MessageInfo`,`TaskNotifications`,`TaskInProgress`,`TaskSuccess`,`TaskFailure`,`TaskCanceled`,`AllTypes`],X={...J.MessageTypes,tags:[`svelte-csf-v5`]},Z={...J.MessageSuccess,tags:[`svelte-csf-v5`]},Q={...J.MessageError,tags:[`svelte-csf-v5`]},$={...J.MessageWarning,tags:[`svelte-csf-v5`]},se={...J.MessageInfo,tags:[`svelte-csf-v5`]},ce={...J.TaskNotifications,tags:[`svelte-csf-v5`]},le={...J.TaskInProgress,tags:[`svelte-csf-v5`]},ue={...J.TaskSuccess,tags:[`svelte-csf-v5`]},de={...J.TaskFailure,tags:[`svelte-csf-v5`]},fe={...J.TaskCanceled,tags:[`svelte-csf-v5`]},pe={...J.AllTypes,tags:[`svelte-csf-v5`]}})))()}me();export{pe as AllTypes,Q as MessageError,se as MessageInfo,Z as MessageSuccess,X as MessageTypes,$ as MessageWarning,fe as TaskCanceled,de as TaskFailure,le as TaskInProgress,ce as TaskNotifications,ue as TaskSuccess,Y as __namedExportsOrder,F as default};