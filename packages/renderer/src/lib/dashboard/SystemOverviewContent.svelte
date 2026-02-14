<!--
   Copyright (C) 2025 Red Hat, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   SPDX-License-Identifier: Apache-2.0
-->

<script lang="ts">
import { Button, Spinner } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import { providerInfos } from '/@/stores/providers';

import { getSystemOverviewData } from '../../stores/dashboard/system-overview-state.svelte';

// Get data reactively based on current state and providers
let data = $derived(getSystemOverviewData($providerInfos));

// Handle See Details in Resources action (works in all modes)
function navigateToResources(): void {
  router.goto('/preferences/resources');
}

// Get status badge color classes
function getStatusClasses(status: string): string {
  switch (status) {
    case 'running':
      return 'bg-[var(--pd-status-running)] shadow-[0_0_8px_var(--pd-status-running)]';
    case 'starting':
      return 'bg-[var(--pd-status-starting)]';
    case 'error':
      return 'bg-[var(--pd-status-terminated)]';
    case 'stopped':
      return 'bg-[var(--pd-status-stopped)]';
    default:
      return 'bg-[var(--pd-status-unknown)]';
  }
}

function getStatusTextClasses(status: string): string {
  switch (status) {
    case 'running':
      return 'text-[var(--pd-status-running)]';
    case 'starting':
      return 'text-[var(--pd-status-starting)]';
    case 'error':
      return 'text-[var(--pd-status-terminated)]';
    case 'stopped':
      return 'text-[var(--pd-status-stopped)]';
    default:
      return 'text-[var(--pd-status-unknown)]';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'running':
      return 'Running';
    case 'starting':
      return 'Starting';
    case 'error':
      return 'Error';
    case 'stopped':
      return 'Stopped';
    default:
      return 'Unknown';
  }
}

// Get progress bar color based on status and value
function getProgressBarColor(stat: { status: string; value: number | null }): string {
  if (stat.value === null) return 'bg-[var(--pd-content-card-bg)]';
  if (stat.status === 'warning') return 'bg-orange-500';
  if (stat.status === 'critical') return 'bg-[var(--pd-status-terminated)]';
  return 'bg-[var(--pd-content-card-light-title)]';
}
</script>

<div class="flex flex-col gap-3">
  <!-- Status Message (e.g. "Some systems are stopped" or "Podman machine error detected") -->
  {#if data.statusMessage}
    {#if data.statusMessageType === 'success'}
      <!-- Clickable success message (green) -->
      <button
        type="button"
        onclick={navigateToResources}
        class="flex items-center gap-2 px-4 py-3 bg-[rgba(34,197,94,0.1)] dark:bg-[rgba(34,197,94,0.15)] rounded-lg hover:bg-[rgba(34,197,94,0.15)] dark:hover:bg-[rgba(34,197,94,0.2)] transition-colors cursor-pointer border border-transparent hover:border-[rgba(34,197,94,0.3)] w-fit text-[rgb(34,197,94)]"
        aria-label="View all systems in Resources">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium">{data.statusMessage}</span>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </button>
    {:else if data.statusMessageType === 'info'}
      <!-- Clickable info message (default styling) -->
      <button
        type="button"
        onclick={navigateToResources}
        class="flex items-center gap-2 px-4 py-3 bg-[var(--pd-content-bg)] rounded-lg hover:bg-[var(--pd-content-card-bg)] transition-colors cursor-pointer border border-transparent hover:border-[var(--pd-content-divider)] w-fit text-[var(--pd-content-card-light-title)]"
        aria-label="View systems in Resources">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium">{data.statusMessage}</span>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </button>
    {:else if data.statusMessageType === 'error'}
      <!-- Clickable error message (red) -->
      <button
        type="button"
        onclick={navigateToResources}
        class="flex items-center gap-2 px-4 py-3 bg-[rgba(185,28,28,0.1)] dark:bg-[rgba(185,28,28,0.15)] rounded-lg hover:bg-[rgba(185,28,28,0.15)] dark:hover:bg-[rgba(185,28,28,0.2)] transition-colors cursor-pointer border border-transparent hover:border-[rgba(185,28,28,0.3)] w-fit text-[var(--pd-status-terminated)]"
        aria-label="View error details in Resources">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium">{data.statusMessage}</span>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </button>
    {/if}
  {/if}

  <!-- Podman Machine Section -->
  {#if data.podmanStatus && !data.showOnlyResources}
    <div
      class="p-4 rounded-lg transition-colors"
      class:bg-[var(--pd-content-bg)]={data.podmanStatus !== 'error'}
      class:bg-[rgba(185,28,28,0.1)]={data.podmanStatus === 'error'}>
      <div class="flex items-center gap-4">
        <!-- Podman Icon -->
        <div
          class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          class:bg-[var(--pd-content-card-bg)]={data.podmanStatus !== 'error'}
          class:bg-[rgba(185,28,28,0.2)]={data.podmanStatus === 'error'}>
          <PodIcon
            size="24"
            class="{data.podmanStatus === 'error'
              ? 'text-[var(--pd-status-terminated)]'
              : 'text-[var(--pd-content-card-title)]'}" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-base font-medium text-[var(--pd-content-card-title)] flex items-center gap-2 flex-wrap">
            {data.podmanMachineName || 'Podman Machine'}
            {#if data.podmanVersion}
              <span class="text-xs font-medium text-[var(--pd-content-card-light-title)] bg-[var(--pd-content-card-bg)] px-2 py-0.5 rounded">
                {data.podmanVersion}
              </span>
            {/if}
          </div>
          <!-- Show error message as status line for error state -->
          {#if data.podmanStatus === 'error' && data.podmanError}
            <div class="text-sm flex items-center gap-2 mt-1 {getStatusTextClasses(data.podmanStatus)}">
              <span class="w-2 h-2 rounded-full {getStatusClasses(data.podmanStatus)}"></span>
              <span>{data.podmanError}</span>
            </div>
          {:else}
            <div class="text-sm flex items-center gap-2 mt-1 {getStatusTextClasses(data.podmanStatus)}">
              {#if data.podmanStatus === 'starting'}
                <Spinner size="0.75em" />
              {:else}
                <span class="w-2 h-2 rounded-full {getStatusClasses(data.podmanStatus)}"></span>
              {/if}
              {getStatusLabel(data.podmanStatus)}{#if data.podmanStatus === 'stopped'}<span class="text-[var(--pd-content-card-light-title)]"> &mdash; Required to run containers and pods</span>{/if}
            </div>
          {/if}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          {#if data.podmanStatus === 'stopped'}
            <Button type="primary" onclick={navigateToResources} aria-label="Start Podman Machine">
              Start Machine
            </Button>
          {:else if data.podmanStatus === 'error'}
            <Button type="danger" onclick={navigateToResources} aria-label="See error details in Resources">
              See Details in Resources
            </Button>
          {:else if data.podmanStatus === 'running'}
            <Button type="secondary" onclick={navigateToResources} aria-label="View Podman Machine details">View</Button>
          {/if}
          <!-- No button for 'starting' state -->
        </div>
      </div>
    </div>
  {/if}

  <!-- Podman Machine Resources Section - Separate block -->
  {#if data.systemStats && data.podmanStatus === 'running'}
    <div class="p-4 rounded-lg bg-[var(--pd-content-bg)]">
      <div class="text-xs font-medium text-[var(--pd-content-card-light-title)] uppercase tracking-wider mb-3">
        {#if data.useDemoValues}
          Podman Machine Resources · No API available, using demo values
        {:else}
          Podman Machine Resources
        {/if}
      </div>
      <div class="grid grid-cols-3 gap-4">
        {#each data.systemStats as stat}
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-sm">
              <span class="text-[var(--pd-content-card-light-title)]">{stat.label}</span>
              <span class="font-medium text-[var(--pd-content-card-title)]">
                {stat.value !== null ? `${stat.value}%` : '—'}
              </span>
            </div>
            <div class="h-2 bg-[var(--pd-content-card-bg)] rounded-full overflow-hidden">
              {#if stat.value !== null}
                <div class="h-full rounded-full transition-all {getProgressBarColor(stat)}" style="width: {stat.value}%">
                </div>
              {/if}
            </div>
            <div class="text-xs text-[var(--pd-content-card-light-title)] truncate">{stat.detail}</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Compact Kubernetes Clusters (Kind + Sandbox) - shown when showCompactClusters is true -->
  {#if data.showCompactClusters}
    <div class="flex flex-wrap gap-3">
      <!-- Kind Cluster - Compact Button Style -->
      {#if data.kindStatus}
        <button
          type="button"
          onclick={navigateToResources}
          class="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--pd-content-bg)] rounded-lg hover:bg-[var(--pd-content-card-bg)] transition-colors cursor-pointer border border-transparent hover:border-[var(--pd-content-divider)]"
          aria-label="View Kind Cluster details">
          <KubernetesIcon class="w-5 h-5 text-[var(--pd-content-card-title)]" />
          <span class="text-sm font-medium text-[var(--pd-content-card-title)]">Kind Cluster</span>
          <span class="w-2 h-2 rounded-full {getStatusClasses(data.kindStatus)}"></span>
        </button>
      {/if}

      <!-- Developer Sandbox - Compact Button Style -->
      {#if data.sandboxStatus}
        <button
          type="button"
          onclick={navigateToResources}
          class="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--pd-content-bg)] rounded-lg hover:bg-[var(--pd-content-card-bg)] transition-colors cursor-pointer border border-transparent hover:border-[var(--pd-content-divider)]"
          aria-label="View Developer Sandbox details">
          <KubernetesIcon class="w-5 h-5 text-[var(--pd-content-card-title)]" />
          <span class="text-sm font-medium text-[var(--pd-content-card-title)]">Developer Sandbox</span>
          <span class="w-2 h-2 rounded-full {getStatusClasses(data.sandboxStatus)}"></span>
        </button>
      {/if}
    </div>
  {/if}

  <!-- Full Detail Kind Cluster Section (when not using compact and not resources-only) -->
  {#if data.kindStatus && !data.showCompactClusters && !data.showOnlyResources}
    <div
      class="p-4 rounded-lg transition-colors"
      class:bg-[var(--pd-content-bg)]={data.kindStatus !== 'error'}
      class:bg-[rgba(185,28,28,0.1)]={data.kindStatus === 'error'}>
      <div class="flex items-center gap-4">
        <!-- Kubernetes Icon -->
        <div
          class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          class:bg-[var(--pd-content-card-bg)]={data.kindStatus !== 'error'}
          class:bg-[rgba(185,28,28,0.2)]={data.kindStatus === 'error'}>
          <KubernetesIcon
            class="w-6 h-6 {data.kindStatus === 'error'
              ? 'text-[var(--pd-status-terminated)]'
              : 'text-[var(--pd-content-card-title)]'}" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-base font-medium text-[var(--pd-content-card-title)] flex items-center gap-2 flex-wrap">
            Kind Cluster {data.kindClusterName ? `(${data.kindClusterName})` : ''}
            {#if data.kindRequirements}
              <span class="text-xs font-medium text-[var(--pd-content-card-light-title)] bg-[var(--pd-content-card-bg)] px-2 py-0.5 rounded">
                {data.kindRequirements}
              </span>
            {/if}
          </div>
          {#if data.kindSubtitle}
            <div class="text-sm text-[var(--pd-content-card-light-title)] mt-1">{data.kindSubtitle}</div>
          {/if}
          <!-- Show error message as status line for error state -->
          {#if data.kindStatus === 'error' && data.kindError}
            <div class="text-sm flex items-center gap-2 mt-1 {getStatusTextClasses(data.kindStatus)}">
              <span class="w-2 h-2 rounded-full {getStatusClasses(data.kindStatus)}"></span>
              <span>{data.kindError}</span>
            </div>
          {:else}
            <div class="text-sm flex items-center gap-2 mt-1 {getStatusTextClasses(data.kindStatus)}">
              <span class="w-2 h-2 rounded-full {getStatusClasses(data.kindStatus)}"></span>
              {getStatusLabel(data.kindStatus)}{#if data.kindInfo}<span class="text-[var(--pd-content-card-light-title)]"> &mdash; {data.kindInfo}</span>{/if}
            </div>
          {/if}
        </div>

        <Button
          type={data.kindStatus === 'error' ? 'danger' : 'secondary'}
          onclick={navigateToResources}
          aria-label="View Kind Cluster details">
          {data.kindStatus === 'error' ? 'See Details in Resources' : 'View'}
        </Button>
      </div>
    </div>
  {/if}

  <!-- Compact Developer Sandbox (shown when sandbox exists but not in showCompactClusters mode and not error and not resources-only) -->
  {#if data.sandboxStatus && !data.showCompactClusters && data.sandboxStatus !== 'error' && !data.showOnlyResources}
    <button
      type="button"
      onclick={navigateToResources}
      class="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--pd-content-bg)] rounded-lg hover:bg-[var(--pd-content-card-bg)] transition-colors cursor-pointer border border-transparent hover:border-[var(--pd-content-divider)] w-fit"
      aria-label="View Developer Sandbox details">
      <KubernetesIcon class="w-5 h-5 text-[var(--pd-content-card-title)]" />
      <span class="text-sm font-medium text-[var(--pd-content-card-title)]">Developer Sandbox</span>
      <span class="w-2 h-2 rounded-full {getStatusClasses(data.sandboxStatus)}"></span>
    </button>
  {/if}

  <!-- Developer Sandbox Error Section (only shown when sandbox has error and not resources-only) -->
  {#if data.sandboxStatus && !data.showCompactClusters && data.sandboxStatus === 'error' && !data.showOnlyResources}
    <div class="p-4 rounded-lg transition-colors bg-[rgba(185,28,28,0.1)]">
      <div class="flex items-center gap-4">
        <!-- Kubernetes Icon for Sandbox -->
        <div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-[rgba(185,28,28,0.2)]">
          <KubernetesIcon class="w-6 h-6 text-[var(--pd-status-terminated)]" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-base font-medium text-[var(--pd-content-card-title)]">Developer Sandbox</div>
          {#if data.sandboxSubtitle}
            <div class="text-sm text-[var(--pd-content-card-light-title)] mt-1">{data.sandboxSubtitle}</div>
          {/if}
          <!-- Show error message as status line for error state -->
          {#if data.sandboxError}
            <div class="text-sm flex items-center gap-2 mt-1 {getStatusTextClasses(data.sandboxStatus)}">
              <span class="w-2 h-2 rounded-full {getStatusClasses(data.sandboxStatus)}"></span>
              <span>{data.sandboxError}</span>
            </div>
          {:else}
            <div class="text-sm flex items-center gap-2 mt-1 {getStatusTextClasses(data.sandboxStatus)}">
              <span class="w-2 h-2 rounded-full {getStatusClasses(data.sandboxStatus)}"></span>
              {getStatusLabel(data.sandboxStatus)}
            </div>
          {/if}
        </div>

        <Button type="danger" onclick={navigateToResources} aria-label="View Developer Sandbox details">
          See Details in Resources
        </Button>
      </div>
    </div>
  {/if}

  <!-- Onboarding Message (shown in onboarding state) -->
  {#if data.showOnboarding}
    <div class="mt-2 p-3 bg-[var(--pd-content-bg)] rounded-lg border border-[var(--pd-content-divider)]">
      <p class="text-sm text-[var(--pd-content-card-light-title)]">
        🎉 <strong class="text-[var(--pd-content-card-title)]">Welcome to Podman Desktop!</strong> Your environment is ready. Check out the
        Getting Started guide below to begin.
      </p>
    </div>
  {/if}
</div>
