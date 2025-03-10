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

import { writable, type Writable } from "svelte/store";
import { configurationProperties } from "./configurationProperties";
import { configuration } from '@podman-desktop/api';
import type { IConfigurationPropertyRecordedSchema } from "../../../main/src/plugin/configuration-registry";

interface FeatureFeedbackNotification {
    id: string;
    notifyAtDate: Date;
    disabled: boolean;
    opened: boolean;
}

export type RemindOption = "tomorrow" | "inTwoDays" | "never";

export const feedbackFormNotifications: Writable<FeatureFeedbackNotification[]> = writable<FeatureFeedbackNotification[]>([]);

let experimentalProperties: IConfigurationPropertyRecordedSchema[] = [];

configurationProperties.subscribe(value => {
    experimentalProperties = value.filter(v => {
        configurationProperties.
    getConfigurationValue<boolean>(`${ExperimentalSettings.SectionName}.${ExperimentalSettings.Enabled}`)
        const enabled = configuration.getConfigurationValue("")
        return v.experimental
    });
    console.log(experimentalProperties)
});

export function disableNotification(property: IConfigurationPropertyRecordedSchema): void {
    
}

export function remindLater(remindOption: RemindOption): void {
    

}
