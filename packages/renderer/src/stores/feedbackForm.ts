/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { type Writable, writable } from 'svelte/store';

import type { IConfigurationPropertyRecordedSchema } from '../../../main/src/plugin/configuration-registry';
import type { RemindOption } from '../../../main/src/plugin/message-box';
import { configurationProperties } from './configurationProperties';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface FeedbackNotification {
  id: string;

  // undefined for "Don't show aggain option"
  // Date for "Remind me in 2 days" and "Remind me tomorrow"
  notifyAtDate: Date | undefined;

  // If is the feature enabled in the experimental feature page
  featureDisabled: boolean;

  // Help variable for each feature to remember if the dialog was already opened
  wasOpenned: boolean;
}

export type ExperimentalFeatures =
  | 'tasks.StatusBar'
  | 'tasks.Manager'
  | 'kubernetes.statesExperimental'
  | 'statusbarProviders.showProviders';

export const feedbackFormNotifications: Writable<Map<string, FeedbackNotification>> = writable(new Map());

let experimentalProperties: IConfigurationPropertyRecordedSchema[] = [];

function setupFeedback(): void {
  configurationProperties.subscribe(configurations => {
    // Get only experimental properties
    experimentalProperties = configurations.filter(
      experimentalProperty => experimentalProperty.experimental?.githubDiscussionLink,
    );

    feedbackFormNotifications.update(store => {
      experimentalProperties.forEach(async (property): Promise<void> => {
        if (!property.id) return;
        const enabled = (await window.getConfigurationValue<boolean>(property.id)) ?? false;

        // Get record from store
        const record = store.get(property.id);

        // If record does not exist, then create one
        // Otherwise update disabled
        if (!record) {
          store.set(property.id, {
            id: property.id,
            notifyAtDate: undefined,
            featureDisabled: !enabled,
            wasOpenned: false,
          });
        } else {
          store.set(property.id, { ...record, featureDisabled: !enabled });
        }
      });
      return store;
    });
  });
}

setupFeedback();

function updateNotifyAtDate(id: string, notifyAtDate: Date | undefined): void {
  return feedbackFormNotifications.subscribe(map => {
    const feedbackNotification = map.get(id);
    if (feedbackNotification) map.set(id, { ...feedbackNotification, notifyAtDate: notifyAtDate, wasOpenned: true });
  })();
}

function remindLater(id: string, remindOption: RemindOption): void {
  let daysAhead = 0;
  if (remindOption === 'Remind me in 2 days') daysAhead = 2;
  else if (remindOption === 'Remind me tomorrow') daysAhead = 1;
  else return updateNotifyAtDate(id, undefined);

  const remindDate = new Date();
  remindDate.setDate(remindDate.getDate() + daysAhead);
  remindDate.setHours(0, 0, 0, 0);
  return updateNotifyAtDate(id, remindDate);
}

function formatName(id: string): string {
  // Changes id to nicely formated human readable string (same as in experimental features page)
  return id
    .replace(/([A-Z])/g, ' $1')
    .replace(/\./g, '')
    .replace(/^./, id => {
      return id.toUpperCase();
    });
}

function canBeOpenned(featureID: ExperimentalFeatures): boolean {
  let canOpen = true;
  const unsubscriber = feedbackFormNotifications.subscribe(store => {
    const record = store.get(featureID);
    // If is feature disabled don't show the dialog
    if (!record || record.featureDisabled) {
      canOpen = false;
      return;
    }

    // The experimental page of the feature was openned (e.g. Tasks Manager)
    if (!record.wasOpenned) {
      canOpen = true;
      return;
    }

    // "Don't show again" option was selected previously
    if (!record.notifyAtDate) {
      canOpen = false;
      return;
    }

    // If is todays date before notifyAtDate => don't show dialog, otherwise show
    const date = new Date();
    canOpen = record.notifyAtDate.getTime() <= date.getTime() ? true : false;
  });

  unsubscriber();
  return canOpen;
}

window.events?.receive('openWebsite', async (args: unknown): Promise<void> => {
  await window.openExternal(args as string);
});

export async function showFeedbackDialog(featureID: ExperimentalFeatures): Promise<void> {
  if (!canBeOpenned(featureID)) return;

  const featureGitHubLink = experimentalProperties.find(property => property.id === featureID)?.experimental
    ?.githubDiscussionLink;
  const featureName = formatName(featureID);
  if (!featureGitHubLink) return;

  const footerMarkdownDescription: string = `:button[fa-thumbs-up]{command=openWebsite args='["${featureGitHubLink}"]'} :button[fa-thumbs-down]{command=openWebsite args='["${featureGitHubLink}"]'}`;

  const response = await window.showMessageBox({
    title: `Share Your Feedback`,
    message: `We are testing something new!\n\nHow's your experience so far with [${featureName}](${featureGitHubLink})? Let us know on GitHub!`,
    type: `info`,
    buttons: [
      {
        heading: 'Remind me later',
        buttons: ['Remind me tomorrow', 'Remind me in 2 days', `Don't show me again`],
      },
      {
        label: 'Share Feedback on GitHub',
        icon: faArrowUpRightFromSquare,
      },
    ],
    defaultId: 1,
    footerMarkdownDescription: footerMarkdownDescription,
  });

  // Share Feedback on GitHub was selected
  if (response.response === 1) {
    window.openExternal(featureGitHubLink);
    remindLater(featureID, "Don't show again");
  }
  // Option from Dropdown was selected
  else if (response.response === 0 && response.option) remindLater(featureID, response.option);
}
