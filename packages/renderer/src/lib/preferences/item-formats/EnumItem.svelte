<script lang="ts">
import type { IConfigurationPropertyRecordedSchema } from '@desktop-framework/api/configuration';
import { Dropdown } from '@podman-desktop/ui-svelte';

import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  value?: string;
  onChange?: (_id: string, _value: string) => Promise<void>;
}

let {
  record,
  value = $bindable(),
  onChange = async (_id: string, _value: string): Promise<void> => {},
}: Props = $props();

let invalidEntry = $state(false);

function onChangeHandler(newValue: unknown): void {
  invalidEntry = false;
  if (record.id && newValue !== value) {
    onChange(record.id, newValue as string).catch((_: unknown) => (invalidEntry = true));
  }
}
</script>

<Dropdown
  name={record.id}
  id="input-standard-{record.id}"
  onChange={onChangeHandler}
  bind:value={value}
  ariaInvalid={invalidEntry}
   ariaLabel={t(`${record.id}.description`) ?? record.description}
  disabled={!!record.readonly || !!record.locked}
  options={record.enum?.map((recordEnum, index) => ({
    label: t(`${record.id}.enum.${recordEnum}`) ?? record.enumLabels?.[index] ?? recordEnum,
    value: recordEnum,
  }))}>
</Dropdown>
