<script lang="ts">
import type { IConfigurationPropertyRecordedSchema } from '@desktop-framework/api/configuration';
import type { OpenDialogOptions } from '@desktop-framework/extension-api';

import { t } from '/@/lib/i18n/translations.svelte';
import FileInput from '/@/lib/ui/FileInput.svelte';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  value?: string;
  onChange?: (_id: string, _value: string) => Promise<void>;
}

let {
  record,
  value = $bindable(''),
  onChange = async (_id: string, _value: string): Promise<void> => {},
}: Props = $props();

let invalidEntry = $state(false);
let dialogOptions: OpenDialogOptions = $derived({
  title: (t('settings.select') ?? 'Select {name}').replace(
    '{name}',
    t(`${record.id}.description`) ?? `${record.description}`,
  ),
  selectors: record.format === 'folder' ? ['openDirectory'] : ['openFile'],
});

function onChangeFileInput(value: string): void {
  if (record.id) {
    onChange(record.id, value).catch((_: unknown) => (invalidEntry = true));
  }
}
</script>

<div class="w-full flex">
  <!-- By default, we set 'readonly' to FALSE unless explicitly defined within
   .record of the schema. This allows edits to the fileinput. -->
  <FileInput
    id="input-standard-{record.id}"
    name={record.id}
    bind:value={value}
    onChange={onChangeFileInput}
    readonly={record.readonly ?? record.locked ?? false}
    clearable={true}
    placeholder={t(`${record.id}.placeholder`) ?? record.placeholder}
    options={dialogOptions}
    aria-invalid={invalidEntry}
    aria-label={t(`${record.id}.description`) ?? record.description} />
</div>
