<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import { withBulkConfirmation } from '/@/lib/actions/BulkActions';
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import DevelopmentExtensionTableActionsColumn from '/@/lib/extensions/dev-mode/table/ActionsColumn.svelte';
import DevelopmentExtensionTableExtensionColumn from '/@/lib/extensions/dev-mode/table/ExtensionColumn.svelte';
import DevelopmentExtensionTableNameColumn from '/@/lib/extensions/dev-mode/table/NameColumn.svelte';
import DevelopmentExtensionTableOriginColumn from '/@/lib/extensions/dev-mode/table/OriginColumn.svelte';
import DevelopmentExtensionTableStatusColumn from '/@/lib/extensions/dev-mode/table/StatusColumn.svelte';
import {
  ensureExtensionTableViewportListeners,
  extensionTableViewport,
} from '/@/lib/extensions/extension-table-columns.svelte';

interface Props {
  selectedItemsNumber?: number;
  extensionFolderUIInfos: SelectableExtensionDevelopmentFolderInfoUI[];
}

let { extensionFolderUIInfos, selectedItemsNumber = $bindable(0) }: Props = $props();

onMount(() => {
  ensureExtensionTableViewportListeners();
});

const showOrigin = $derived(!extensionTableViewport.hideOrigin);
const showStatus = $derived(!extensionTableViewport.hideStatus);

function extensionDisplayName(extensionFolder: SelectableExtensionDevelopmentFolderInfoUI): string {
  const installedName = extensionFolder.installedExtension?.displayName?.trim();
  if (installedName) {
    return installedName;
  }
  const extensionName = extensionFolder.extension?.name?.trim();
  if (extensionName) {
    return extensionName;
  }
  // Folder rows set `name` to the path; only use it when it is a real display label.
  const label = extensionFolder.name?.trim();
  if (label && label !== extensionFolder.path) {
    return label;
  }
  return 'Unknown';
}

const nameColumn = new TableColumn<SelectableExtensionDevelopmentFolderInfoUI, string>('Name', {
  // Content-sized with a floor so the NAME header isn't jammed against LOCATION.
  width: 'minmax(9rem, max-content)',
  renderer: DevelopmentExtensionTableExtensionColumn,
  renderMapping: (extensionFolder): string => extensionDisplayName(extensionFolder),
  comparator: (a, b): number => extensionDisplayName(a).localeCompare(extensionDisplayName(b)),
});

const locationColumn = new TableColumn<SelectableExtensionDevelopmentFolderInfoUI>('Location', {
  // Location takes remaining space; Type then Status stay fixed near Actions.
  width: 'minmax(0, 1fr)',
  renderer: DevelopmentExtensionTableNameColumn,
  comparator: (a, b): number => a.path.localeCompare(b.path),
});

const typeColumn = new TableColumn<SelectableExtensionDevelopmentFolderInfoUI>('Type', {
  width: '88px',
  renderer: DevelopmentExtensionTableOriginColumn,
});

const extensionStatusColumn = new TableColumn<SelectableExtensionDevelopmentFolderInfoUI>('Status', {
  width: '120px',
  renderer: DevelopmentExtensionTableStatusColumn,
  comparator: (a, b): number => (a.extension?.state ?? '').localeCompare(b.extension?.state ?? ''),
});

// No comparator — matches Catalog/Installed Actions header (label only, not sortable).
const actionsColumn = new TableColumn<SelectableExtensionDevelopmentFolderInfoUI>('Actions', {
  align: 'right',
  width: '100px',
  renderer: DevelopmentExtensionTableActionsColumn,
  overflow: true,
});

// Order: Name → Location → Type → Status → Actions (Type/Status drop on small viewports)
const columns = $derived([
  nameColumn,
  locationColumn,
  ...(showOrigin ? [typeColumn] : []),
  ...(showStatus ? [extensionStatusColumn] : []),
  actionsColumn,
]);

const tableLayoutKey = $derived(`type:${showOrigin}-status:${showStatus}`);

const row = new TableRow<SelectableExtensionDevelopmentFolderInfoUI>({
  selectable: (): boolean => true,
});

function deleteSelectedFolders(): void {}
let bulkDeleteInProgress = false;

function key(extensionFolder: SelectableExtensionDevelopmentFolderInfoUI): string {
  return extensionFolder.path;
}
function label(extensionFolder: SelectableExtensionDevelopmentFolderInfoUI): string {
  return extensionFolder.name;
}
</script>

<!-- Cancel Table's built-in mx-5; parent already provides horizontal padding so width matches the toolbar. -->
<div class="min-w-0 [&>[role='table']]:mx-0">
  {#key tableLayoutKey}
    <Table
      kind="custom-local-extension-list-v3"
      data={extensionFolderUIInfos}
      {columns}
      {row}
      bind:selectedItemsNumber
      defaultSortColumn="Name"
      key={key}
      label={label}
      enableLayoutConfiguration={true}
      on:update={(): SelectableExtensionDevelopmentFolderInfoUI[] =>
        (extensionFolderUIInfos = [...extensionFolderUIInfos])}>
    </Table>
  {/key}
</div>

<div class="h-5 px-5 mb-2">
  {#if selectedItemsNumber > 0}
    <Button
      on:click={(): void =>
        withBulkConfirmation(
          deleteSelectedFolders,
          `Untrack loading extension from ${selectedItemsNumber} folder${selectedItemsNumber > 1 ? 's' : ''}`,
          { title: 'Untrack Extensions?', variant: 'delete' },
        )}
      title="Untrack {selectedItemsNumber} selected items"
      inProgress={bulkDeleteInProgress}
      icon={faTrash} />
    <span>On {selectedItemsNumber} selected items.</span>
  {:else}
    <div>&nbsp;</div>
  {/if}
</div>
