<style>
.linear-progress-indeterminate {
  animation: linearProgressAnimation 2s infinite linear;
  transform-origin: 0% 50%;
}
@keyframes linearProgressAnimation {
  0% {
    transform: translateX(0) scaleX(0);
  }
  20% {
    transform: translateX(0) scaleX(0.25);
  }
  100% {
    transform: translateX(100%) scaleX(0.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .linear-progress-indeterminate {
    animation: none;
  }
}
</style>

<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';

let { class: className, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<div class="w-full h-0.5 relative bg-(--pd-progressBar-bg) overflow-hidden {className}" {...restProps}>
  <div
    class="w-full h-0.5 relative bg-(--pd-progressBar-in-progress-bg) linear-progress-indeterminate outline-1 outline-(--pd-progressBar-in-progress-border) z-1"
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}>
  </div>
  <div class="w-full absolute top-1/2 -translate-y-1/2 h-px bg-(--pd-progressBar-hc-line-bg) z-0"></div>
</div>
