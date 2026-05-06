<style>
.progress-bar-indeterminate {
  animation: indeterminateAnimation 2s infinite linear;
  transform-origin: 0% 50%;
}
@keyframes indeterminateAnimation {
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
</style>

<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';

interface Props extends HTMLAttributes<HTMLElement> {
  progress?: number;
  width?: string;
  height?: string;
}

let { progress, width = 'w-36', height = 'h-2', class: className, ...restProps }: Props = $props();
</script>

<div class="flex flex-row items-center {className}" {...restProps} >
  <div class="{width} {height} relative rounded-full bg-(--pd-progressBar-bg) progress-bar overflow-hidden">
    {#if progress !== undefined}
      <div
        class="{width} {height} relative bg-(--pd-progressBar-in-progress-bg) rounded-full progress-bar-incremental outline-1 outline-(--pd-progressBar-in-progress-border) z-1"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style="width:{progress}%">
      </div>
      <div class="{width} absolute top-1/2 -translate-y-1/2 h-px bg-(--pd-progressBar-hc-line-bg) z-0"></div>
    {:else}
      <div
        class="{width} {height} relative bg-(--pd-progressBar-in-progress-bg) rounded-full progress-bar-indeterminate outline-2 outline-(--pd-progressBar-in-progress-border) z-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}>
      </div>
      <div class="{width} absolute top-1/2 -translate-y-1/2 h-px bg-(--pd-progressBar-hc-line-bg) z-0"></div>
    {/if}
  </div>
  {#if progress !== undefined}
    <div class="ml-2 text-xs min-w-5">{Math.round(progress)}%</div>
  {/if}
</div>
