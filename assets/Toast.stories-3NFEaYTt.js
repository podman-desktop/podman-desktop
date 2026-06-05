import{i as e}from"./preload-helper-xPQekRTU.js";import{Ft as t,It as n,Jt as r,Mt as i,Q as a,R as o,Rt as s,ct as c,ft as l,ln as u,mn as d,nn as f,s as p,tn as m,ut as h,vn as g,xn as _,xt as v,y}from"./iframe-DOTDKAll.js";import{a as b,i as ee,n as x,r as S,t as te}from"./create-runtime-stories-nV0eUVm6.js";import{L as ne,P as C,f as re,g as w,t as T}from"./Icon-CLELlOC8.js";import{r as ie}from"./Button-CRcMFVUd.js";import{A as E,_ as ae,t as oe}from"./dist-T5kDptIH.js";function D(e,r){f(r,!1),y();var i=ce(),a=n(i);P(a,{name:`Message Types`,children:(e,n)=>{var r=H(),i=t(r),a=s(t(i),2),o=t(a);O(o,()=>`success`,()=>`Success`,()=>`Container started successfully`);var c=s(o,2);O(c,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var l=s(c,2);O(l,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),O(s(l,2),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),u(a),u(i),u(r),h(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All message types in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var o=s(a,2);P(o,{name:`Message: Success`,children:(e,n)=>{var r=U();O(t(r),()=>`success`,()=>`Success`,()=>`Container started successfully`),u(r),h(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual message type stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var c=s(o,2);P(c,{name:`Message: Error`,children:(e,n)=>{var r=W();O(t(r),()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`),u(r),h(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var l=s(c,2);P(l,{name:`Message: Warning`,children:(e,n)=>{var r=se();O(t(r),()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),u(r),h(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var d=s(l,2);P(d,{name:`Message: Info`,children:(e,n)=>{var r=G();O(t(r),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),u(r),h(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var p=s(d,2);P(p,{name:`Task Notifications`,children:(e,n)=>{var r=K(),i=t(r),a=s(t(i),2),o=t(a);k(o,()=>`Pulling image podman-desktop/ubuntu:latest`);var c=s(o,2);A(c,()=>`Container started successfully`);var l=s(c,2);j(l,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),M(s(l,2),()=>`Pull podman-desktop/ubuntu:latest`),u(a),u(i),u(r),h(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All task notification states in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var g=s(p,2);P(g,{name:`Task: In Progress`,children:(e,n)=>{var r=q();k(t(r),()=>`Pulling image podman-desktop/ubuntu:latest`),u(r),h(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual task state stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var _=s(g,2);P(_,{name:`Task: Success`,children:(e,n)=>{var r=J();A(t(r),()=>`Container started successfully`),u(r),h(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var v=s(_,2);P(v,{name:`Task: Failure`,children:(e,n)=>{var r=Y();j(t(r),()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),u(r),h(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var b=s(v,2);P(b,{name:`Task: Canceled`,children:(e,n)=>{var r=X();M(t(r),()=>`Pull podman-desktop/ubuntu:latest`),u(r),h(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}}),P(s(b,2),{name:`All Types`,children:(e,n)=>{var r=Z(),i=t(r),a=t(i),o=s(t(a),2),c=t(o);O(c,()=>`success`,()=>`Success`,()=>`Container started successfully`);var l=s(c,2);O(l,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var d=s(l,2);O(d,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),O(s(d,2),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),u(o),u(a);var f=s(a,2),p=s(t(f),2),m=t(p);k(m,()=>`Pulling image podman-desktop/ubuntu:latest`);var g=s(m,2);A(g,()=>`Container started successfully`);var _=s(g,2);j(_,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),M(s(_,2),()=>`Pull podman-desktop/ubuntu:latest`),u(p),u(f),u(i),u(r),h(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Combined overview`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),h(e,i),m()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,se,G,K,q,J,Y,X,Z,ce,Q,le,ue,de,fe,pe,me,he,ge,_e,ve,ye,$;e((()=>{_(),b(),g(),ne(),oe(),ae(),ee(),p(),x(),O=(e,n=d,l=d,f=d)=>{var p=L(),m=t(p),g=t(m,!0);u(m);var _=s(m,2),y=t(_),b=t(y),ee=e=>{var a=F(),o=t(a);{let e=r(()=>n()===`error`?w:C);T(o,{get icon(){return v(e)},class:`shrink-0 mt-1`})}var l=s(o,2),d=t(l,!0);u(l),u(a),i(()=>c(d,f())),h(e,a)},x=e=>{var n=I(),r=t(n,!0);u(n),i(()=>c(r,f())),h(e,n)};a(b,e=>{n()===`error`||n()===`warning`?e(ee):e(x,-1)}),u(y);var S=s(y,4);u(_),u(p),i(()=>{c(g,l()),o(_,`background: var(--pd-toast-${n()??``}-bg); color: var(--pd-toast-${n()??``}-color);`),o(S,`background: var(--pd-toast-${n()??``}-bar-bg);`)}),h(e,p)},k=(e,n=d)=>{var r=R(),a=s(t(r),2),o=t(a),l=t(o);ie(t(l),{size:`1.5em`}),u(l);var f=s(l,2),p=t(f,!0);u(f),u(o),E(s(o,2),{class:`text-(--pd-modal-text) flex-none self-start`}),u(a),u(r),i(()=>c(p,n())),h(e,r)},A=(e,n=d)=>{var r=z(),a=s(t(r),2),o=t(a),l=t(o);T(t(l),{get icon(){return re},class:`text-(--pd-state-success) fa-xl`}),u(l);var f=s(l,2),p=t(f,!0);u(f),u(o),E(s(o,2),{class:`text-(--pd-modal-text) flex-none self-start`}),u(a),u(r),i(()=>c(p,n())),h(e,r)},j=(e,n=d,r=d)=>{var a=B(),o=s(t(a),2),l=t(o),f=t(l);T(t(f),{get icon(){return w},class:`text-(--pd-state-error) fa-xl`}),u(f);var p=s(f,2),m=t(p),g=t(m);u(m);var _=s(m,2),v=t(_,!0);u(_),u(p),u(l),E(s(l,2),{class:`text-(--pd-modal-text) flex-none self-start`}),u(o),u(a),i(()=>{c(g,`Error ${n()??``}`),c(v,r())}),h(e,a)},M=(e,n=d)=>{var r=V(),a=s(t(r),2),o=t(a),l=t(o);T(t(l),{get icon(){return C},class:`text-(--pd-state-warning) fa-xl`}),u(l);var f=s(l,2),p=t(f);u(f),u(o),E(s(o,2),{class:`text-(--pd-modal-text) flex-none self-start`}),u(a),u(r),i(()=>c(p,`Canceled ${n()??``}`)),h(e,r)},N={title:`Toast`,tags:[`autodocs`],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:P}=S(N),F=l(`<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>`),I=l(`<div class="px-3 pt-2 pb-2.5"> </div>`),L=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>`),R=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),z=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),B=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>`),V=l(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),H=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),U=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),W=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),se=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),G=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),K=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),q=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),J=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),Y=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),X=l(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),Z=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>`),ce=l(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`Toast.stories.svelte`},Q=te(D,N),le=[`MessageTypes`,`MessageSuccess`,`MessageError`,`MessageWarning`,`MessageInfo`,`TaskNotifications`,`TaskInProgress`,`TaskSuccess`,`TaskFailure`,`TaskCanceled`,`AllTypes`],ue={...Q.MessageTypes,tags:[`svelte-csf-v5`]},de={...Q.MessageSuccess,tags:[`svelte-csf-v5`]},fe={...Q.MessageError,tags:[`svelte-csf-v5`]},pe={...Q.MessageWarning,tags:[`svelte-csf-v5`]},me={...Q.MessageInfo,tags:[`svelte-csf-v5`]},he={...Q.TaskNotifications,tags:[`svelte-csf-v5`]},ge={...Q.TaskInProgress,tags:[`svelte-csf-v5`]},_e={...Q.TaskSuccess,tags:[`svelte-csf-v5`]},ve={...Q.TaskFailure,tags:[`svelte-csf-v5`]},ye={...Q.TaskCanceled,tags:[`svelte-csf-v5`]},$={...Q.AllTypes,tags:[`svelte-csf-v5`]}}))();export{$ as AllTypes,fe as MessageError,me as MessageInfo,de as MessageSuccess,ue as MessageTypes,pe as MessageWarning,ye as TaskCanceled,ve as TaskFailure,ge as TaskInProgress,he as TaskNotifications,_e as TaskSuccess,le as __namedExportsOrder,N as default};