import{i as e}from"./preload-helper-xPQekRTU.js";import{$ as t,It as n,Lt as r,Nt as i,Sn as a,St as o,Yt as s,b as c,dt as l,hn as u,lt as d,nn as f,pt as p,rn as m,s as h,un as g,yn as _,z as v,zt as y}from"./iframe-BPbnnp4f.js";import{a as b,i as x,n as ee,r as S,t as te}from"./create-runtime-stories-Cj-NY-6f.js";import{L as ne,P as C,f as re,g as w,t as T}from"./Icon-BKSWkUhk.js";import{r as ie}from"./Button-CrUQePcm.js";import{A as E,_ as ae,t as oe}from"./dist-DZYqjZ1G.js";function D(e,t){m(t,!1),c();var i=ce(),a=r(i);P(a,{name:`Message Types`,children:(e,t)=>{var r=H(),i=n(r),a=y(n(i),2),o=n(a);O(o,()=>`success`,()=>`Success`,()=>`Container started successfully`);var s=y(o,2);O(s,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var c=y(s,2);O(c,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),O(y(c,2),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),g(a),g(i),g(r),l(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All message types in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var o=y(a,2);P(o,{name:`Message: Success`,children:(e,t)=>{var r=U();O(n(r),()=>`success`,()=>`Success`,()=>`Container started successfully`),g(r),l(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual message type stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var s=y(o,2);P(s,{name:`Message: Error`,children:(e,t)=>{var r=W();O(n(r),()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`),g(r),l(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var u=y(s,2);P(u,{name:`Message: Warning`,children:(e,t)=>{var r=se();O(n(r),()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),g(r),l(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var d=y(u,2);P(d,{name:`Message: Info`,children:(e,t)=>{var r=G();O(n(r),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),g(r),l(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var p=y(d,2);P(p,{name:`Task Notifications`,children:(e,t)=>{var r=K(),i=n(r),a=y(n(i),2),o=n(a);k(o,()=>`Pulling image podman-desktop/ubuntu:latest`);var s=y(o,2);A(s,()=>`Container started successfully`);var c=y(s,2);j(c,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),M(y(c,2),()=>`Pull podman-desktop/ubuntu:latest`),g(a),g(i),g(r),l(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`All task notification states in one view`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var h=y(p,2);P(h,{name:`Task: In Progress`,children:(e,t)=>{var r=q();k(n(r),()=>`Pulling image podman-desktop/ubuntu:latest`),g(r),l(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Individual task state stories`}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var _=y(h,2);P(_,{name:`Task: Success`,children:(e,t)=>{var r=J();A(n(r),()=>`Container started successfully`),g(r),l(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var v=y(_,2);P(v,{name:`Task: Failure`,children:(e,t)=>{var r=Y();j(n(r),()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),g(r),l(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var b=y(v,2);P(b,{name:`Task: Canceled`,children:(e,t)=>{var r=X();M(n(r),()=>`Pull podman-desktop/ubuntu:latest`),g(r),l(e,r)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}}),P(y(b,2),{name:`All Types`,children:(e,t)=>{var r=Z(),i=n(r),a=n(i),o=y(n(a),2),s=n(o);O(s,()=>`success`,()=>`Success`,()=>`Container started successfully`);var c=y(s,2);O(c,()=>`error`,()=>`Error`,()=>`Failed to start container: permission denied`);var u=y(c,2);O(u,()=>`warning`,()=>`Warning`,()=>`Container exited with non-zero status code`),O(y(u,2),()=>`info`,()=>`Info`,()=>`Pulling image podman-desktop/ubuntu:latest`),g(o),g(a);var d=y(a,2),f=y(n(d),2),p=n(f);k(p,()=>`Pulling image podman-desktop/ubuntu:latest`);var m=y(p,2);A(m,()=>`Container started successfully`);var h=y(m,2);j(h,()=>`Build podman-desktop/myapp`,()=>`Dockerfile parse error on line 12`),M(y(h,2),()=>`Pull podman-desktop/ubuntu:latest`),g(f),g(d),g(i),g(r),l(e,r)},$$slots:{default:!0},parameters:{docs:{description:{story:`Combined overview`}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),l(e,i),f()}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,se,G,K,q,J,Y,X,Z,ce,Q,le,ue,de,fe,pe,me,he,ge,_e,ve,ye,$;e((()=>{a(),b(),_(),ne(),oe(),ae(),x(),h(),ee(),O=(e,r=u,a=u,c=u)=>{var f=L(),p=n(f),m=n(p,!0);g(p);var h=y(p,2),_=n(h),b=n(_),x=e=>{var t=F(),a=n(t);{let e=s(()=>r()===`error`?w:C);T(a,{get icon(){return o(e)},class:`shrink-0 mt-1`})}var u=y(a,2),f=n(u,!0);g(u),g(t),i(()=>d(f,c())),l(e,t)},ee=e=>{var t=I(),r=n(t,!0);g(t),i(()=>d(r,c())),l(e,t)};t(b,e=>{r()===`error`||r()===`warning`?e(x):e(ee,-1)}),g(_);var S=y(_,4);g(h),g(f),i(()=>{d(m,a()),v(h,`background: var(--pd-toast-${r()??``}-bg); color: var(--pd-toast-${r()??``}-color);`),v(S,`background: var(--pd-toast-${r()??``}-bar-bg);`)}),l(e,f)},k=(e,t=u)=>{var r=R(),a=y(n(r),2),o=n(a),s=n(o);ie(n(s),{size:`1.5em`}),g(s);var c=y(s,2),f=n(c,!0);g(c),g(o),E(y(o,2),{class:`text-(--pd-modal-text) flex-none self-start`}),g(a),g(r),i(()=>d(f,t())),l(e,r)},A=(e,t=u)=>{var r=z(),a=y(n(r),2),o=n(a),s=n(o);T(n(s),{get icon(){return re},class:`text-(--pd-state-success) fa-xl`}),g(s);var c=y(s,2),f=n(c,!0);g(c),g(o),E(y(o,2),{class:`text-(--pd-modal-text) flex-none self-start`}),g(a),g(r),i(()=>d(f,t())),l(e,r)},j=(e,t=u,r=u)=>{var a=B(),o=y(n(a),2),s=n(o),c=n(s);T(n(c),{get icon(){return w},class:`text-(--pd-state-error) fa-xl`}),g(c);var f=y(c,2),p=n(f),m=n(p);g(p);var h=y(p,2),_=n(h,!0);g(h),g(f),g(s),E(y(s,2),{class:`text-(--pd-modal-text) flex-none self-start`}),g(o),g(a),i(()=>{d(m,`Error ${t()??``}`),d(_,r())}),l(e,a)},M=(e,t=u)=>{var r=V(),a=y(n(r),2),o=n(a),s=n(o);T(n(s),{get icon(){return C},class:`text-(--pd-state-warning) fa-xl`}),g(s);var c=y(s,2),f=n(c);g(c),g(o),E(y(o,2),{class:`text-(--pd-modal-text) flex-none self-start`}),g(a),g(r),i(()=>d(f,`Canceled ${t()??``}`)),l(e,r)},N={title:`Toast`,tags:[`autodocs`],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:P}=S(N),F=p(`<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>`),I=p(`<div class="px-3 pt-2 pb-2.5"> </div>`),L=p(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>`),R=p(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),z=p(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),B=p(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>`),V=p(`<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>`),H=p(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),U=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),W=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),se=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),G=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),K=p(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),q=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),J=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),Y=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),X=p(`<div class="bg-(--pd-content-bg) p-8"><!></div>`),Z=p(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>`),ce=p(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`,1),D.__docgen={data:[],name:`Toast.stories.svelte`},Q=te(D,N),le=[`MessageTypes`,`MessageSuccess`,`MessageError`,`MessageWarning`,`MessageInfo`,`TaskNotifications`,`TaskInProgress`,`TaskSuccess`,`TaskFailure`,`TaskCanceled`,`AllTypes`],ue={...Q.MessageTypes,tags:[`svelte-csf-v5`]},de={...Q.MessageSuccess,tags:[`svelte-csf-v5`]},fe={...Q.MessageError,tags:[`svelte-csf-v5`]},pe={...Q.MessageWarning,tags:[`svelte-csf-v5`]},me={...Q.MessageInfo,tags:[`svelte-csf-v5`]},he={...Q.TaskNotifications,tags:[`svelte-csf-v5`]},ge={...Q.TaskInProgress,tags:[`svelte-csf-v5`]},_e={...Q.TaskSuccess,tags:[`svelte-csf-v5`]},ve={...Q.TaskFailure,tags:[`svelte-csf-v5`]},ye={...Q.TaskCanceled,tags:[`svelte-csf-v5`]},$={...Q.AllTypes,tags:[`svelte-csf-v5`]}}))();export{$ as AllTypes,fe as MessageError,me as MessageInfo,de as MessageSuccess,ue as MessageTypes,pe as MessageWarning,ye as TaskCanceled,ve as TaskFailure,ge as TaskInProgress,he as TaskNotifications,_e as TaskSuccess,le as __namedExportsOrder,N as default};