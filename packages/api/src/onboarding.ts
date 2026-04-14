/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { z } from 'zod';

export const OnboardingStepItemSchema = z.object({
  value: z.string(),
  highlight: z.boolean().optional(),
  when: z.string().optional(),
});

export type OnboardingStepItem = z.output<typeof OnboardingStepItemSchema>;

export const OnboardingStatusSchema = z.enum(['completed', 'failed', 'skipped']);

export type OnboardingStatus = z.output<typeof OnboardingStatusSchema>;

export const OnboardingStateSchema = z.enum(['completed', 'failed']);

export type OnboardingState = z.output<typeof OnboardingStateSchema>;

export const OnboardingEmbeddedComponentTypeSchema = z.enum([
  'createContainerProviderConnection',
  'createKubernetesProviderConnection',
]);

export type OnboardingEmbeddedComponentType = z.output<typeof OnboardingEmbeddedComponentTypeSchema>;

export const OnboardingStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  media: z
    .object({
      path: z.string(),
      altText: z.string(),
    })
    .optional(),
  command: z.string().optional(),
  completionEvents: z.array(z.string()).optional(),
  content: z.array(z.array(OnboardingStepItemSchema)).optional(),
  component: OnboardingEmbeddedComponentTypeSchema.optional(),
  when: z.string().optional(),
  status: OnboardingStatusSchema.optional(),
  state: OnboardingStateSchema.optional(),
});

export type OnboardingStep = z.output<typeof OnboardingStepSchema>;

export const OnboardingSchema = z.object({
  title: z.string(),
  priority: z.number().optional(),
  description: z.string().optional(),
  media: z
    .object({
      path: z.string(),
      altText: z.string(),
    })
    .optional(),
  steps: z.array(OnboardingStepSchema),
  enablement: z.string(),
});

export type Onboarding = z.output<typeof OnboardingSchema>;

export const OnboardingInfoSchema = OnboardingSchema.extend({
  extension: z.string(),
  removable: z.boolean(),
  name: z.string(),
  displayName: z.string(),
  icon: z.string(),
  welcomeMessage: z.string().optional(),
  status: OnboardingStatusSchema.optional(),
});

export type OnboardingInfo = z.output<typeof OnboardingInfoSchema>;
