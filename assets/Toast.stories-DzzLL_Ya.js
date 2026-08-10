import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{J as t,Mt as n,Ot as r,P as i,Pt as a,Wt as o,_t as s,c,ct as l,dn as u,gn as d,h as f,in as p,it as m,jt as h,ot as g,rn as _,vn as v,xn as y}from"./iframe-ZsUrswuR.js";import{a as b,i as x,n as S,r as C,t as ee}from"./create-runtime-stories-D3cE2fFD.js";import{L as te,P as w,f as ne,g as T,t as E}from"./Icon-gi75grox.js";import{r as re}from"./Button-0pkU-Av-.js";import{D,m as ie,t as ae}from"./dist-B8HNpz-q.js";function O(e,t){p(t,!1),f();var r=q(),i=n(r);F(i,{name:`Message Types`,children:(e,t)=>{var n=U(),r=h(n),i=a(h(r),2),o=h(i);k(o,()=>`success`,()=>`Success`,()=>`Container started successfully`);var s=a(o,2);k(s,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var c=a(s,2);k(c,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`);var l=a(c,2);k(l,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),u(i),u(r),u(n),g(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`All message types in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var o=a(i,2);F(o,{name:`Message: Success`,children:(e,t)=>{var n=W(),r=h(n);k(r,()=>`success`,()=>`Success`,()=>`Container started successfully`),u(n),g(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual message type stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var s=a(o,2);F(s,{name:`Message: Error`,children:(e,t)=>{var n=W(),r=h(n);k(r,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`),u(n),g(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var c=a(s,2);F(c,{name:`Message: Warning`,children:(e,t)=>{var n=W(),r=h(n);k(r,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),u(n),g(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var l=a(c,2);F(l,{name:`Message: Info`,children:(e,t)=>{var n=W(),r=h(n);k(r,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),u(n),g(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var d=a(l,2);F(d,{name:`Task Notifications`,children:(e,t)=>{var n=G(),r=h(n),i=a(h(r),2),o=h(i);A(o,()=>`Pulling image podman-desktop/ubuntu:latest`);var s=a(o,2);j(s,()=>`Container started successfully`);var c=a(s,2);M(c,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`);var l=a(c,2);N(l,()=>`Pull podman-desktop/ubuntu:latest`),u(i),u(r),u(n),g(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`All task notification states in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var m=a(d,2);F(m,{name:`Task: In Progress`,children:(e,t)=>{var n=W(),r=h(n);A(r,()=>`Pulling image podman-desktop/ubuntu:latest`),u(n),g(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual task state stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var v=a(m,2);F(v,{name:`Task: Success`,children:(e,t)=>{var n=W(),r=h(n);j(r,()=>`Container started successfully`),u(n),g(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var y=a(v,2);F(y,{name:`Task: Failure`,children:(e,t)=>{var n=W(),r=h(n);M(r,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),u(n),g(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var b=a(y,2);F(b,{name:`Task: Canceled`,children:(e,t)=>{var n=W(),r=h(n);N(r,()=>`Pull podman-desktop/ubuntu:latest`),u(n),g(e,n)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var x=a(b,2);F(x,{name:`All Types`,children:(e,t)=>{var n=K(),r=h(n),i=h(r),o=a(h(i),2),s=h(o);k(s,()=>`success`,()=>`Success`,()=>`Container started successfully`);var c=a(s,2);k(c,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var l=a(c,2);k(l,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`);var d=a(l,2);k(d,()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),u(o),u(i);var f=a(i,2),p=a(h(f),2),m=h(p);A(m,()=>`Pulling image podman-desktop/ubuntu:latest`);var _=a(m,2);j(_,()=>`Container started successfully`);var v=a(_,2);M(v,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`);var y=a(v,2);N(y,()=>`Pull podman-desktop/ubuntu:latest`),u(p),u(f),u(r),u(n),g(e,n)},$$slots:{default:!0},parameters:{docs:{description:{story:`Combined overview`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),g(e,r),_()}var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,oe,se,ce,le,ue,de,fe,pe;function $(){return($=e((()=>{y(),b(),v(),te(),ae(),ie(),x(),c(),S(),k=(e,n=d,c=d,l=d)=>{var f=R(),p=h(f),_=h(p,!0);u(p);var v=a(p,2),y=h(v),b=h(y),x=e=>{var t=I(),i=h(t);{let e=o(()=>n()===`error`?T:w);E(i,{get icon(){return s(e)},class:`shrink-0 mt-1`})}var c=a(i,2),d=h(c,!0);u(c),u(t),r(()=>m(d,l())),g(e,t)},S=e=>{var t=L(),n=h(t,!0);u(t),r(()=>m(n,l())),g(e,t)};t(b,e=>{n()===`error`||n()===`warning`?e(x):e(S,-1)}),u(y);var C=a(y,4);u(v),u(f),r(()=>{m(_,c()),i(v,`background: var(--pd-toast-${n()??``}-bg); color: var(--pd-toast-${n()??``}-color);`),i(C,`background: var(--pd-toast-${n()??``}-bar-bg);`)}),g(e,f)},A=(e,t=d)=>{var n=z(),i=a(h(n),2),o=h(i),s=h(o),c=h(s);re(c,{size:`1.5em`}),u(s);var l=a(s,2),f=h(l,!0);u(l),u(o);var p=a(o,2);D(p,{class:`text-(--pd-modal-text) flex-none self-start`}),u(i),u(n),r(()=>m(f,t())),g(e,n)},j=(e,t=d)=>{var n=B(),i=a(h(n),2),o=h(i),s=h(o),c=h(s);E(c,{get icon(){return ne},class:`text-(--pd-state-success) fa-xl`}),u(s);var l=a(s,2),f=h(l,!0);u(l),u(o);var p=a(o,2);D(p,{class:`text-(--pd-modal-text) flex-none self-start`}),u(i),u(n),r(()=>m(f,t())),g(e,n)},M=(e,t=d,n=d)=>{var i=V(),o=a(h(i),2),s=h(o),c=h(s),l=h(c);E(l,{get icon(){return T},class:`text-(--pd-state-error) fa-xl`}),u(c);var f=a(c,2),p=h(f),_=h(p);u(p);var v=a(p,2),y=h(v,!0);u(v),u(f),u(s);var b=a(s,2);D(b,{class:`text-(--pd-modal-text) flex-none self-start`}),u(o),u(i),r(()=>{m(_,`Error ${t()??``}`),m(y,n())}),g(e,i)},N=(e,t=d)=>{var n=H(),i=a(h(n),2),o=h(i),s=h(o),c=h(s);E(c,{get icon(){return w},class:`text-(--pd-state-warning) fa-xl`}),u(s);var l=a(s,2),f=h(l);u(l),u(o);var p=a(o,2);D(p,{class:`text-(--pd-modal-text) flex-none self-start`}),u(i),u(n),r(()=>m(f,`Canceled ${t()??``}`)),g(e,n)},P={title:`Toast`,tags:[`autodocs`],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:F}=C(P),I=l(`<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>`),L=l(`<div class="px-3 pt-2 pb-2.5"> </div>`),R=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>`),z=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),B=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),V=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>`),H=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),U=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),W=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),G=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),K=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>`),q=l(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),O.__docgen={data:[],name:`Toast.stories.svelte`},J=ee(O,P),Y=[`MessageTypes`,`MessageSuccess`,`MessageError`,`MessageWarning`,`MessageInfo`,`TaskNotifications`,`TaskInProgress`,`TaskSuccess`,`TaskFailure`,`TaskCanceled`,`AllTypes`],X={...J.MessageTypes,tags:[`svelte-csf-v5`]},Z={...J.MessageSuccess,tags:[`svelte-csf-v5`]},Q={...J.MessageError,tags:[`svelte-csf-v5`]},oe={...J.MessageWarning,tags:[`svelte-csf-v5`]},se={...J.MessageInfo,tags:[`svelte-csf-v5`]},ce={...J.TaskNotifications,tags:[`svelte-csf-v5`]},le={...J.TaskInProgress,tags:[`svelte-csf-v5`]},ue={...J.TaskSuccess,tags:[`svelte-csf-v5`]},de={...J.TaskFailure,tags:[`svelte-csf-v5`]},fe={...J.TaskCanceled,tags:[`svelte-csf-v5`]},pe={...J.AllTypes,tags:[`svelte-csf-v5`]}})))()}$();export{pe as AllTypes,Q as MessageError,se as MessageInfo,Z as MessageSuccess,X as MessageTypes,oe as MessageWarning,fe as TaskCanceled,de as TaskFailure,le as TaskInProgress,ce as TaskNotifications,ue as TaskSuccess,Y as __namedExportsOrder,P as default};