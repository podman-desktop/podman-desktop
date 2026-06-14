<script lang="ts">
import { Table, TableColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { ExtensionsUtils } from './extensions-utils';
import { setInstalledTableCallbacks } from './installed-extension-table-context';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';
import InstalledExtensionTableActionsColumn from './table/InstalledExtensionTableActionsColumn.svelte';
import InstalledExtensionTableIconColumn from './table/InstalledExtensionTableIconColumn.svelte';
import InstalledExtensionTableLifecycleColumn from './table/InstalledExtensionTableLifecycleColumn.svelte';
import InstalledExtensionTableNameColumn from './table/InstalledExtensionTableNameColumn.svelte';
import InstalledExtensionTableOriginColumn from './table/InstalledExtensionTableOriginColumn.svelte';
import InstalledExtensionTableVersionColumn from './table/InstalledExtensionTableVersionColumn.svelte';

interface Props {
  rows: InstalledExtensionTableRow[];
  onChangeVersion: (extension: CatalogExtensionInfoUI) => void;
}

let { rows, onChangeVersion }: Props = $props();

const extensionsUtils = new ExtensionsUtils();

onMount(() => {
  setInstalledTableCallbacks({ onChangeVersion });
});

const iconColumn = new TableColumn<InstalledExtensionTableRow>(' ', {
  width: '56px',
  renderer: InstalledExtensionTableIconColumn,
});

const nameColumn = new TableColumn<InstalledExtensionTableRow>('Name', {
  width: '2fr',
  renderer: InstalledExtensionTableNameColumn,
});

const publisherColumn = new TableColumn<InstalledExtensionTableRow, string>('Publisher', {
  width: '1.5fr',
  renderer: TableSimpleColumn,
  renderMapping: (row): string =>
    extensionsUtils.resolvePublisherDisplayName(row.extension, row.catalogExtension.publisherDisplayName),
  comparator: (a, b): number =>
    extensionsUtils
      .resolvePublisherDisplayName(a.extension, a.catalogExtension.publisherDisplayName)
      .localeCompare(extensionsUtils.resolvePublisherDisplayName(b.extension, b.catalogExtension.publisherDisplayName)),
});

const versionColumn = new TableColumn<InstalledExtensionTableRow>('Version', {
  width: '1.25fr',
  renderer: InstalledExtensionTableVersionColumn,
  comparator: (a, b): number => (a.extension.version ?? '').localeCompare(b.extension.version ?? ''),
});

const statusColumn = new TableColumn<InstalledExtensionTableRow>('Status', {
  width: '1fr',
  renderer: InstalledExtensionTableLifecycleColumn,
});

const originColumn = new TableColumn<InstalledExtensionTableRow>('Origin', {
  width: '1.75fr',
  renderer: InstalledExtensionTableOriginColumn,
});

const actionsColumn = new TableColumn<InstalledExtensionTableRow>('Actions', {
  align: 'right',
  width: '80px',
  renderer: InstalledExtensionTableActionsColumn,
  overflow: true,
});

const columns = [iconColumn, nameColumn, publisherColumn, versionColumn, statusColumn, originColumn, actionsColumn];

const row = new TableRow<InstalledExtensionTableRow>({});

function key(tableRow: InstalledExtensionTableRow): string {
  return tableRow.extension.id;
}

function label(tableRow: InstalledExtensionTableRow): string {
  return tableRow.name;
}
</script>

<Table kind="extensions" data={rows} {columns} {row} defaultSortColumn="Name" key={key} label={label} />
