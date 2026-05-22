import{p as L,f as Q,c as t,j as e,b as p,d as X,g as v,n as y,a as F,h as P,r as s}from"./iframe-LIHp3s34.js";import{c as Y,i as Z,d as ee,a as G}from"./create-runtime-stories-CpDjtbNC.js";import{I as j,o as se,p as ae,q as te}from"./Icon-rrvwro58.js";import"./ErrorMessage-D6QRxSD4.js";import{S as ne}from"./Button-DKGaQ8PR.js";import{b as W}from"./Table-Berxa0HC.js";import"./LinearProgress-COIZOA2E.js";import"./ProgressBar-Bs6nsUiq.js";import"./EmptyScreen-DEnGWe5i.js";import"./ContainerIcon-DNkPr1zD.js";import"./StarIcon-DOXknnnp.js";import"./preload-helper-PPVm8Dsz.js";import"./each-tVM3y6b7.js";import"./index-l4C1ahnl.js";const x=(_,m=y,i=y,l=y)=>{var o=oe(),r=e(o),u=e(r,!0);s(r);var c=t(r,2),g=e(c),f=e(g,!0);s(g);var M=t(g,2);s(c),s(o),F(()=>{P(u,i()),G(c,`background: var(--pd-toast-${m()??""}-bg); color: var(--pd-toast-${m()??""}-color);`),P(f,l()),G(M,`background: var(--pd-toast-${m()??""}-bar-bg);`)}),p(_,o)},z=(_,m=y)=>{var i=de(),l=t(e(i),2),o=e(l),r=e(o),u=e(r);ne(u,{size:"1.5em"}),s(r);var c=t(r,2),g=e(c,!0);s(c),s(o);var f=t(o,2);W(f,{class:"text-(--pd-modal-text) flex-none self-start"}),s(l),s(i),F(()=>P(g,m())),p(_,i)},A=(_,m=y)=>{var i=ie(),l=t(e(i),2),o=e(l),r=e(o),u=e(r);j(u,{get icon(){return se},class:"text-(--pd-state-success) fa-xl"}),s(r);var c=t(r,2),g=e(c,!0);s(c),s(o);var f=t(o,2);W(f,{class:"text-(--pd-modal-text) flex-none self-start"}),s(l),s(i),F(()=>P(g,m())),p(_,i)},D=(_,m=y,i=y)=>{var l=le(),o=t(e(l),2),r=e(o),u=e(r),c=e(u);j(c,{get icon(){return ae},class:"text-(--pd-state-error) fa-xl"}),s(u);var g=t(u,2),f=e(g),M=e(f);s(f);var I=t(f,2),E=e(I,!0);s(I),s(g),s(r);var B=t(r,2);W(B,{class:"text-(--pd-modal-text) flex-none self-start"}),s(o),s(l),F(()=>{P(M,`Error ${m()??""}`),P(E,i())}),p(_,l)},N=(_,m=y)=>{var i=ce(),l=t(e(i),2),o=e(l),r=e(o),u=e(r);j(u,{get icon(){return te},class:"text-(--pd-state-warning) fa-xl"}),s(r);var c=t(r,2),g=e(c);s(c),s(o);var f=t(o,2);W(f,{class:"text-(--pd-modal-text) flex-none self-start"}),s(l),s(i),F(()=>P(g,`Canceled ${m()??""}`)),p(_,i)},re={title:"Toast",tags:["autodocs"],parameters:{docs:{description:{component:"Toast notifications appear in the bottom-right corner of the Podman Desktop window.\n\n## Message toasts\n\nTriggered by the main process via the `toast:handler` IPC event (e.g. when a container\noperation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables\nfrom the color registry:\n\n| Variant | Background              | Text color                 | Progress bar               |\n|---------|-------------------------|----------------------------|----------------------------|\n| success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|\n| error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |\n| warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|\n| info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |\n\n## Task toasts\n\nShown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.\nThey use `--pd-modal-bg` as the card background and `--pd-state-*` variables for\nstatus icons. Task toasts cycle through four lifecycle states:\n\n- **In progress** — spinner while the task runs\n- **Success** — green check icon on completion\n- **Failure** — red exclamation icon with an error message\n- **Canceled** — amber warning icon\n\n## Theme support\n\nUse the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`\nand verify that all toast variants update correctly."}}}},{Story:b}=ee();var oe=v('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide"> </span> <div class="w-64 rounded overflow-hidden text-sm select-none shadow-md"><div class="px-3 py-2.5"> </div> <div class="h-[3px] w-3/5"></div></div></div>'),de=v('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded-md border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>'),ie=v('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded-md border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>'),le=v('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded-md border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure"><!></div> <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46"><span> </span> <p class="text-(--pd-content-text)"> </p></div></div> <!></div></div>'),ce=v('<div class="flex flex-col gap-1"><span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span> <div class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded-md border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md"><div class="flex flex-row gap-1 items-start"><div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled"><!></div> <span class="text-(--pd-card-text) wrap-break-word max-w-46"> </span></div> <!></div></div>'),pe=v(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),ve=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),ge=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),ue=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),fe=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),me=v(`<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-6"><p class="text-sm text-(--pd-content-text)">Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.</p> <div class="flex flex-wrap gap-6"><!> <!> <!> <!></div></div></div>`),xe=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),_e=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),be=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),ke=v('<div class="bg-(--pd-content-bg) p-8"><!></div>'),we=v('<div class="bg-(--pd-content-bg) p-8"><div class="flex flex-col gap-8"><div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div> <div class="flex flex-col gap-4"><h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3> <div class="flex flex-wrap gap-4"><!> <!> <!> <!></div></div></div></div>'),Te=v("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1);function H(_,m){L(m,!1),Z();var i=Te(),l=Q(i);b(l,{name:"Message Types",children:(d,w)=>{var a=pe(),n=e(a),T=t(e(n),2),h=e(T);x(h,()=>"success",()=>"Success",()=>"Container started successfully");var $=t(h,2);x($,()=>"error",()=>"Error",()=>"Failed to start container: permission denied");var C=t($,2);x(C,()=>"warning",()=>"Warning",()=>"Container exited with non-zero status code");var S=t(C,2);x(S,()=>"info",()=>"Info",()=>"Pulling image podman-desktop/ubuntu:latest"),s(T),s(n),s(a),p(d,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"All message types in one view"}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var o=t(l,2);b(o,{name:"Message: Success",children:(d,w)=>{var a=ve(),n=e(a);x(n,()=>"success",()=>"Success",()=>"Container started successfully"),s(a),p(d,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"Individual message type stories"}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('success', 'Success', 'Container started successfully')}
</div>
</undefined>`}}});var r=t(o,2);b(r,{name:"Message: Error",children:(d,w)=>{var a=ge(),n=e(a);x(n,()=>"error",()=>"Error",()=>"Failed to start container: permission denied"),s(a),p(d,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
</div>
</undefined>`}}});var u=t(r,2);b(u,{name:"Message: Warning",children:(d,w)=>{var a=ue(),n=e(a);x(n,()=>"warning",()=>"Warning",()=>"Container exited with non-zero status code"),s(a),p(d,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
</div>
</undefined>`}}});var c=t(u,2);b(c,{name:"Message: Info",children:(d,w)=>{var a=fe(),n=e(a);x(n,()=>"info",()=>"Info",()=>"Pulling image podman-desktop/ubuntu:latest"),s(a),p(d,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var g=t(c,2);b(g,{name:"Task Notifications",children:(d,w)=>{var a=me(),n=e(a),T=t(e(n),2),h=e(T);z(h,()=>"Pulling image podman-desktop/ubuntu:latest");var $=t(h,2);A($,()=>"Container started successfully");var C=t($,2);D(C,()=>"Build podman-desktop/myapp",()=>"Dockerfile parse error on line 12");var S=t(C,2);N(S,()=>"Pull podman-desktop/ubuntu:latest"),s(T),s(n),s(a),p(d,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"All task notification states in one view"}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}});var f=t(g,2);b(f,{name:"Task: In Progress",children:(d,w)=>{var a=xe(),n=e(a);z(n,()=>"Pulling image podman-desktop/ubuntu:latest"),s(a),p(d,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"Individual task state stories"}},__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var M=t(f,2);b(M,{name:"Task: Success",children:(d,w)=>{var a=_e(),n=e(a);A(n,()=>"Container started successfully"),s(a),p(d,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastSuccess('Container started successfully')}
</div>
</undefined>`}}});var I=t(M,2);b(I,{name:"Task: Failure",children:(d,w)=>{var a=be(),n=e(a);D(n,()=>"Build podman-desktop/myapp",()=>"Dockerfile parse error on line 12"),s(a),p(d,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
</div>
</undefined>`}}});var E=t(I,2);b(E,{name:"Task: Canceled",children:(d,w)=>{var a=ke(),n=e(a);N(n,()=>"Pull podman-desktop/ubuntu:latest"),s(a),p(d,a)},$$slots:{default:!0},parameters:{__svelteCsf:{rawCode:`<undefined {...args}>
  <div class="bg-(--pd-content-bg) p-8">
{@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
</div>
</undefined>`}}});var B=t(E,2);b(B,{name:"All Types",children:(d,w)=>{var a=we(),n=e(a),T=e(n),h=t(e(T),2),$=e(h);x($,()=>"success",()=>"Success",()=>"Container started successfully");var C=t($,2);x(C,()=>"error",()=>"Error",()=>"Failed to start container: permission denied");var S=t(C,2);x(S,()=>"warning",()=>"Warning",()=>"Container exited with non-zero status code");var J=t(S,2);x(J,()=>"info",()=>"Info",()=>"Pulling image podman-desktop/ubuntu:latest"),s(h),s(T);var U=t(T,2),q=t(e(U),2),O=e(q);z(O,()=>"Pulling image podman-desktop/ubuntu:latest");var R=t(O,2);A(R,()=>"Container started successfully");var V=t(R,2);D(V,()=>"Build podman-desktop/myapp",()=>"Dockerfile parse error on line 12");var K=t(V,2);N(K,()=>"Pull podman-desktop/ubuntu:latest"),s(q),s(U),s(n),s(a),p(d,a)},$$slots:{default:!0},parameters:{docs:{description:{story:"Combined overview"}},__svelteCsf:{rawCode:`<undefined {...args}>
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
</undefined>`}}}),p(_,i),X()}H.__docgen={data:[],name:"Toast.stories.svelte"};const k=Y(H,re),De=["MessageTypes","MessageSuccess","MessageError","MessageWarning","MessageInfo","TaskNotifications","TaskInProgress","TaskSuccess","TaskFailure","TaskCanceled","AllTypes"],Ne={...k.MessageTypes,tags:["svelte-csf-v5"]},je={...k.MessageSuccess,tags:["svelte-csf-v5"]},Ue={...k.MessageError,tags:["svelte-csf-v5"]},qe={...k.MessageWarning,tags:["svelte-csf-v5"]},Oe={...k.MessageInfo,tags:["svelte-csf-v5"]},Re={...k.TaskNotifications,tags:["svelte-csf-v5"]},Ve={...k.TaskInProgress,tags:["svelte-csf-v5"]},Ge={...k.TaskSuccess,tags:["svelte-csf-v5"]},He={...k.TaskFailure,tags:["svelte-csf-v5"]},Je={...k.TaskCanceled,tags:["svelte-csf-v5"]},Ke={...k.AllTypes,tags:["svelte-csf-v5"]};export{Ke as AllTypes,Ue as MessageError,Oe as MessageInfo,je as MessageSuccess,Ne as MessageTypes,qe as MessageWarning,Je as TaskCanceled,He as TaskFailure,Ve as TaskInProgress,Re as TaskNotifications,Ge as TaskSuccess,De as __namedExportsOrder,re as default};
