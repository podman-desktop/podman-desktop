import{p as X,f as Y,c as t,j as e,b as i,d as Z,g as l,n as P,o as ee,a as I,h as M,r as s,l as se,m as ae}from"./iframe-aTtlP2fM.js";import{c as te,i as ne,d as re,b as G}from"./create-runtime-stories-DbJFRlAo.js";import{I as B,o as oe,p as H,q as J}from"./Icon-CZ0lohKq.js";import"./ErrorMessage-BqQqarFU.js";import{S as de}from"./Button-BQXxOHKN.js";import{b as z}from"./Table-DdVgJ-6A.js";import"./LinearProgress-6sqbqt7Y.js";import"./ProgressBar-BKsxRpw-.js";import"./EmptyScreen-Do-N4ECd.js";import"./ContainerIcon-CSqApgeY.js";import"./StarIcon-DNVnN9Zu.js";import"./preload-helper-PPVm8Dsz.js";import"./each-yK1wA1RR.js";import"./index-l4C1ahnl.js";const _=(b,u=P,c=P,p=P)=>{var d=pe(),o=e(d),m=e(o,!0);s(o);var v=t(o,2),g=e(v),x=e(g);{var F=T=>{var n=le(),f=e(n);{let k=ae(()=>u()==="error"?H:J);B(f,{get icon(){return se(k)},class:"shrink-0 mt-1"})}var a=t(f,2),r=e(a,!0);s(a),s(n),I(()=>M(r,p())),i(T,n)},S=T=>{var n=ce(),f=e(n,!0);s(n),I(()=>M(f,p())),i(T,n)};ee(x,T=>{u()==="error"||u()==="warning"?T(F):T(S,-1)})}s(g);var E=t(g,4);s(v),s(d),I(()=>{M(m,c()),G(v,`background: var(--pd-toast-${u()??""}-bg); color: var(--pd-toast-${u()??""}-color);`),G(E,`background: var(--pd-toast-${u()??""}-bar-bg);`)}),i(b,d)},A=(b,u=P)=>{var c=ve(),p=t(e(c),2),d=e(p),o=e(d),m=e(o);de(m,{size:"1.5em"}),s(o);var v=t(o,2),g=e(v,!0);s(v),s(d);var x=t(d,2);z(x,{class:"text-(--pd-modal-text) flex-none self-start"}),s(p),s(c),I(()=>M(g,u())),i(b,c)},D=(b,u=P)=>{var c=ue(),p=t(e(c),2),d=e(p),o=e(d),m=e(o);B(m,{get icon(){return oe},class:"text-(--pd-state-success) fa-xl"}),s(o);var v=t(o,2),g=e(v,!0);s(v),s(d);var x=t(d,2);z(x,{class:"text-(--pd-modal-text) flex-none self-start"}),s(p),s(c),I(()=>M(g,u())),i(b,c)},j=(b,u=P,c=P)=>{var p=ge(),d=t(e(p),2),o=e(d),m=e(o),v=e(m);B(v,{get icon(){return H},class:"text-(--pd-state-error) fa-xl"}),s(m);var g=t(m,2),x=e(g),F=e(x);s(x);var S=t(x,2),E=e(S,!0);s(S),s(g),s(o);var T=t(o,2);z(T,{class:"text-(--pd-modal-text) flex-none self-start"}),s(d),s(p),I(()=>{M(F,`Error ${u()??""}`),M(E,c())}),i(b,p)},N=(b,u=P)=>{var c=fe(),p=t(e(c),2),d=e(p),o=e(d),m=e(o);B(m,{get icon(){return J},class:"text-(--pd-state-warning) fa-xl"}),s(o);var v=t(o,2),g=e(v);s(v),s(d);var x=t(d,2);z(x,{class:"text-(--pd-modal-text) flex-none self-start"}),s(p),s(c),I(()=>M(g,`Canceled ${u()??""}`)),i(b,c)},ie={title:"Toast",tags:["autodocs"],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:w}=re();var le=l('<div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5"><!> <span> </span></div>'),ce=l('<div class="px-3 pt-2 pb-2.5"> </div>'),pe=l('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md"><div class="flex-1"><!></div> <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div> <div class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]"></div></div></div>'),ve=l('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>'),ue=l('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>'),ge=l('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>'),fe=l('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>'),me=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),xe=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),_e=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),be=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),ke=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),we=l(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),he=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),Te=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),$e=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),Ce=l('<div class="bg-(--pd-content-bg) p-8"><!></div>'),ye=l('<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>'),Pe=l("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1);function K(b,u){X(u,!1),ne();var c=Pe(),p=Y(c);w(p,{name:"Message Types",children:(n,f)=>{var a=me(),r=e(a),k=t(e(r),2),$=e(k);_($,()=>"success",()=>"Success",()=>"Container started successfully");var C=t($,2);_(C,()=>"error",()=>"Error",()=>"Failed to start container: permission denied");var y=t(C,2);_(y,()=>"warning",()=>"Warning",()=>"Container exited with non-zero status code");var W=t(y,2);_(W,()=>"info",()=>"Info",()=>"Pulling image podman-desktop/ubuntu:latest"),s(k),s(r),s(a),i(n,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"All message types in one view"}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var d=t(p,2);w(d,{name:"Message: Success",children:(n,f)=>{var a=xe(),r=e(a);_(r,()=>"success",()=>"Success",()=>"Container started successfully"),s(a),i(n,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"Individual message type stories"}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var o=t(d,2);w(o,{name:"Message: Error",children:(n,f)=>{var a=_e(),r=e(a);_(r,()=>"error",()=>"Error",()=>"Failed to start container: permission denied"),s(a),i(n,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var m=t(o,2);w(m,{name:"Message: Warning",children:(n,f)=>{var a=be(),r=e(a);_(r,()=>"warning",()=>"Warning",()=>"Container exited with non-zero status code"),s(a),i(n,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var v=t(m,2);w(v,{name:"Message: Info",children:(n,f)=>{var a=ke(),r=e(a);_(r,()=>"info",()=>"Info",()=>"Pulling image podman-desktop/ubuntu:latest"),s(a),i(n,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var g=t(v,2);w(g,{name:"Task Notifications",children:(n,f)=>{var a=we(),r=e(a),k=t(e(r),2),$=e(k);A($,()=>"Pulling image podman-desktop/ubuntu:latest");var C=t($,2);D(C,()=>"Container started successfully");var y=t(C,2);j(y,()=>"Build podman-desktop/myapp",()=>"Dockerfile parse error on line 12");var W=t(y,2);N(W,()=>"Pull podman-desktop/ubuntu:latest"),s(k),s(r),s(a),i(n,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"All task notification states in one view"}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var x=t(g,2);w(x,{name:"Task: In Progress",children:(n,f)=>{var a=he(),r=e(a);A(r,()=>"Pulling image podman-desktop/ubuntu:latest"),s(a),i(n,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"Individual task state stories"}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var F=t(x,2);w(F,{name:"Task: Success",children:(n,f)=>{var a=Te(),r=e(a);D(r,()=>"Container started successfully"),s(a),i(n,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var S=t(F,2);w(S,{name:"Task: Failure",children:(n,f)=>{var a=$e(),r=e(a);j(r,()=>"Build podman-desktop/myapp",()=>"Dockerfile parse error on line 12"),s(a),i(n,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var E=t(S,2);w(E,{name:"Task: Canceled",children:(n,f)=>{var a=Ce(),r=e(a);N(r,()=>"Pull podman-desktop/ubuntu:latest"),s(a),i(n,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var T=t(E,2);w(T,{name:"All Types",children:(n,f)=>{var a=ye(),r=e(a),k=e(r),$=t(e(k),2),C=e($);_(C,()=>"success",()=>"Success",()=>"Container started successfully");var y=t(C,2);_(y,()=>"error",()=>"Error",()=>"Failed to start container: permission denied");var W=t(y,2);_(W,()=>"warning",()=>"Warning",()=>"Container exited with non-zero status code");var L=t(W,2);_(L,()=>"info",()=>"Info",()=>"Pulling image podman-desktop/ubuntu:latest"),s($),s(k);var q=t(k,2),U=t(e(q),2),O=e(U);A(O,()=>"Pulling image podman-desktop/ubuntu:latest");var R=t(O,2);D(R,()=>"Container started successfully");var V=t(R,2);j(V,()=>"Build podman-desktop/myapp",()=>"Dockerfile parse error on line 12");var Q=t(V,2);N(Q,()=>"Pull podman-desktop/ubuntu:latest"),s(U),s(q),s(r),s(a),i(n,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"Combined overview"}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),i(b,c),Z()}K.__docgen={data:[],name:"Toast.stories.svelte"};const h=te(K,ie),Oe=["MessageTypes","MessageSuccess","MessageError","MessageWarning","MessageInfo","TaskNotifications","TaskInProgress","TaskSuccess","TaskFailure","TaskCanceled","AllTypes"],Re={...h.MessageTypes,tags:["svelte-csf-v5"]},Ve={...h.MessageSuccess,tags:["svelte-csf-v5"]},Ge={...h.MessageError,tags:["svelte-csf-v5"]},He={...h.MessageWarning,tags:["svelte-csf-v5"]},Je={...h.MessageInfo,tags:["svelte-csf-v5"]},Ke={...h.TaskNotifications,tags:["svelte-csf-v5"]},Le={...h.TaskInProgress,tags:["svelte-csf-v5"]},Qe={...h.TaskSuccess,tags:["svelte-csf-v5"]},Xe={...h.TaskFailure,tags:["svelte-csf-v5"]},Ye={...h.TaskCanceled,tags:["svelte-csf-v5"]},Ze={...h.AllTypes,tags:["svelte-csf-v5"]};export{Ze as AllTypes,Ge as MessageError,Je as MessageInfo,Ve as MessageSuccess,Re as MessageTypes,He as MessageWarning,Ye as TaskCanceled,Xe as TaskFailure,Le as TaskInProgress,Ke as TaskNotifications,Qe as TaskSuccess,Oe as __namedExportsOrder,ie as default};
