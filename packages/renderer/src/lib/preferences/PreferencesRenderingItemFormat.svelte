<script lang="ts">
import { ErrorMessage } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';

import Markdown from '/@/lib/markdown/Markdown.svelte';
import BooleanItem from '/@/lib/preferences/item-formats/BooleanItem.svelte';
import EnumItem from '/@/lib/preferences/item-formats/EnumItem.svelte';
import FileItem from '/@/lib/preferences/item-formats/FileItem.svelte';
import NumberItem from '/@/lib/preferences/item-formats/NumberItem.svelte';
import SliderItem from '/@/lib/preferences/item-formats/SliderItem.svelte';
import StringItem from '/@/lib/preferences/item-formats/StringItem.svelte';
import { onDidChangeConfiguration } from '/@/stores/configurationProperties';
import type { IConfigurationPropertyRecordedSchema } from '/@api/configuration/models.js';

import PasswordStringItem from './item-formats/PasswordStringItem.svelte';
import { getInitialValue, getNormalizedDefaultNumberValue } from './Util';

interface Props {
  record: IConfigurationPropertyRecordedSchema;
  initialValue: Promise<unknown>;
  givenValue?: unknown;
  setRecordValue?: (id: string, value: string | boolean | number) => void;
  invalidRecord?: (error: string) => void;
  validRecord?: () => void;
  updateResetButtonVisibility?: (recordValue: unknown) => void;
  resetToDefault?: boolean;
  enableAutoSave?: boolean;
  enableSlider?: boolean;
}

let {
  record,
  initialValue,
  givenValue,
  setRecordValue = (): void => {},
  invalidRecord = (): void => {},
  validRecord = (): void => {},
  updateResetButtonVisibility = (): void => {},
  resetToDefault = false,
  enableAutoSave = false,
  enableSlider = false,
}: Props = $props();

let currentRecord: IConfigurationPropertyRecordedSchema;
let recordUpdateTimeout: NodeJS.Timeout;

let invalidText: string | undefined = $state(undefined);
let recordValue: unknown = $state(undefined);

$effect(() => {
  updateResetButtonVisibility?.(recordValue);
});

let callBack: EventListenerOrEventListenerObject | undefined = undefined;
let callbackId: string | undefined = undefined;
onMount(() => {
  if (record.id && record.scope === 'DEFAULT') {
    callbackId = record.id;
    callBack = (): void => {
      getInitialValue(record)
        .then(v => {
          recordValue = v;
        })
        .catch((err: unknown) => console.error(`Error getting initial value ${record.id}`, err));
    };
    onDidChangeConfiguration.addEventListener(record.id, callBack);
  }
});

onDestroy(() => {
  if (callBack && callbackId) {
    onDidChangeConfiguration.removeEventListener(callbackId, callBack);
  }
});

$effect(() => {
  if (resetToDefault) {
    recordValue = record.type === 'number' ? getNormalizedDefaultNumberValue(record) : record.default;
    if (ensureType(recordValue)) {
      update(record).catch((err: unknown) => console.log(`Error updating ${record.id}`, err));
    }

    resetToDefault = false;
  }
});

$effect(() => {
  if (!isEqual(currentRecord, record)) {
    initialValue
      .then(value => {
        recordValue = value;
        if (record.type === 'boolean') {
          recordValue = !!value;
        } else if (record.type === 'object') {
          if (value && typeof value === 'object' && 'enabled' in value) {
            // There is an enabled property in the object (for experimental features)
            recordValue = !!value.enabled;
          } else {
            // There is no enabled property in the object (legacy support for experimental features)
            recordValue = !!value;
          }
        }
      })
      .catch((err: unknown) => console.error('Error getting initial value', err));

    invalidText = undefined;
    currentRecord = record;
  }
});

async function update(record: IConfigurationPropertyRecordedSchema): Promise<void> {
  // save the value
  if (record.id && isEqual(currentRecord, record)) {
    try {
      // For experimental features, use the dedicated enable/disable methods
      if (record.experimental && record.type === 'object') {
        // recordValue is already a boolean at this point (converted by the reading logic)
        if (recordValue) {
          await window.enableExperimentalConfiguration(record.id, record.scope);
        } else {
          await window.disableExperimentalConfiguration(record.id, record.scope);
        }
      } else {
        // HACK: when setting `{}` as value we need to stringify and parse the svelte state
        let settings = recordValue;
        if (typeof recordValue === 'object') {
          settings = JSON.parse(JSON.stringify(recordValue));
        }
        await window.updateConfigurationValue(record.id, settings, record.scope);
      }
    } catch (error) {
      invalidText = String(error);
      invalidRecord(invalidText);
      throw error;
    }
  }
}

function isEqual(first: IConfigurationPropertyRecordedSchema, second: IConfigurationPropertyRecordedSchema): boolean {
  return JSON.stringify(first) === JSON.stringify(second);
}

function autoSave(): Promise<void> {
  if (enableAutoSave) {
    return new Promise((_, reject) => {
      recordUpdateTimeout = setTimeout(() => {
        update(record).catch((err: unknown) => reject(err));
      }, 1000);
    });
  }
  return Promise.resolve();
}

function ensureType(value: unknown): boolean {
  switch (typeof value) {
    case 'boolean':
      return record.type === 'boolean' || record.type === 'object';
    case 'number':
      return record.type === 'number' || record.type === 'integer';
    case 'string':
      return record.type === 'string';
    default:
      return false;
  }
}

async function onChange(recordId: string, value: boolean | string | number): Promise<void> {
  if (recordId !== record.id) {
    return;
  }
  if (!ensureType(value)) {
    invalidText = `Value type provided is ${typeof value} instead of ${record.type}.`;
    invalidRecord(invalidText);
    return Promise.reject(invalidText);
  }

  clearTimeout(recordUpdateTimeout);

  // HACK: when updating experimental features (representated in settings.json by object)
  // disabling this feature will set undefined as a value
  // enabling will set empty object
  if (record.type === 'object' && typeof value === 'boolean') {
    if (value) {
      recordValue = {};
    } else {
      recordValue = undefined;
    }
  } else {
    // update the value
    recordValue = value;
  }

  // propagate the update to parent
  setRecordValue(recordId, value);

  // valid the value (each child component is responsible for validating the value
  invalidText = undefined;
  validRecord();

  // auto save
  return await autoSave();
}

function numberItemValue(): number {
  if (givenValue && typeof givenValue === 'number') {
    return givenValue;
  } else if (recordValue && typeof recordValue === 'number') {
    return recordValue;
  }
  return getNormalizedDefaultNumberValue(record);
}
</script>

<div class="flex flex-row mb-1 pt-2 text-start items-center justify-start">
  {#if invalidText}
    <ErrorMessage error="{invalidText}." icon={true} class="mr-2" />
  {/if}
  {#if record.type === 'boolean'}
    <BooleanItem
      record={record}
      checked={typeof givenValue === 'boolean' ? givenValue : !!recordValue}
      onChange={onChange} />
  {:else if record.type === 'object'}
    <BooleanItem
      record={record}
      checked={!!recordValue}
      onChange={onChange} />
  {:else if record.type === 'number' || record.type === 'integer'}
    {#if enableSlider && typeof record.maximum === 'number'}
      <SliderItem
        record={record}
        value={typeof givenValue === 'number' ? givenValue : getNormalizedDefaultNumberValue(record)}
        onChange={onChange} />
    {:else}
      <NumberItem
        record={record}
        value={numberItemValue()}
        onChange={onChange}
        invalidRecord={invalidRecord} />
    {/if}
  {:else if record.type === 'string' && (typeof recordValue === 'string' || recordValue === undefined)}
    {#if record.format === 'file' || record.format === 'folder'}
      <FileItem
        record={record}
        value={typeof givenValue === 'string' ? givenValue : (recordValue ?? '')}
        onChange={onChange} />
    {:else if record.enum && record.enum.length > 0}
      <EnumItem record={record} value={typeof givenValue === 'string' ? givenValue : recordValue} onChange={onChange} />
    {:else if record.format === 'password'}
      <PasswordStringItem
        record={record}
        value={typeof givenValue === 'string' ? givenValue : recordValue}
        onChange={onChange} />
    {:else}
      <StringItem
        record={record}
        value={typeof givenValue === 'string' ? givenValue : recordValue}
        onChange={onChange} />
    {/if}
  {:else if record.type === 'markdown'}
    <div class="text-sm">
      <Markdown markdown={record.markdownDescription} />
    </div>
  {/if}
</div>
