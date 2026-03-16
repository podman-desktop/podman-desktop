<script lang="ts">
interface Props {
  label: string;
  percent: number;
  warningThreshold?: number;
}

let { label, percent, warningThreshold = 80 }: Props = $props();

let isWarning = $derived(percent > warningThreshold);
</script>

<div class="flex items-center gap-1.5">
  <span class="w-7 text-right text-[10px] text-[var(--pd-content-text-sub)]">{label}</span>
  <div class="w-12 h-1.5 bg-[var(--pd-progressBar-bg)] rounded-full overflow-hidden">
    <div
      class="h-full transition-all duration-300 rounded-full"
      class:bg-[var(--pd-progressBar-in-progress-bg)]={!isWarning}
      class:bg-[var(--pd-state-warning)]={isWarning}
      style="width: {percent}%"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="{label} usage"></div>
  </div>
  <span
    class="text-[10px] tabular-nums"
    class:text-[var(--pd-content-text-sub)]={!isWarning}
    class:text-[var(--pd-state-warning)]={isWarning}>{Math.round(percent)}%</span>
</div>
