/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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
import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import { ONBOARDING_WIZARD_DEFAULT_STEPS } from './OnboardingWizardSteps.constants';
import OnboardingWizardSteps from './OnboardingWizardSteps.svelte';

describe('OnboardingWizardSteps', () => {
  test('renders completed, active, and upcoming steps', () => {
    render(OnboardingWizardSteps, {
      steps: [
        { label: 'Install podman', status: 'completed' },
        { label: 'Create machine', status: 'active' },
        { label: 'Install CLI tools', status: 'upcoming' },
      ],
    });

    expect(screen.getByText('Install podman')).toBeInTheDocument();
    expect(screen.getByText('Create machine')).toBeInTheDocument();
    expect(screen.getByText('Install CLI tools')).toBeInTheDocument();
  });

  test('renders default constant steps when no props are passed', () => {
    render(OnboardingWizardSteps);

    for (const step of ONBOARDING_WIZARD_DEFAULT_STEPS) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
  });

  test('applies completed marker without text decoration', () => {
    render(OnboardingWizardSteps, {
      steps: [{ label: 'Install podman', status: 'completed' }],
    });

    const completedText = screen.getByText('Install podman');
    expect(completedText).not.toHaveClass('line-through');
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  test('applies active emphasis and non-active opacity', () => {
    render(OnboardingWizardSteps, {
      steps: [
        { label: 'Install podman', status: 'completed' },
        { label: 'Create machine', status: 'active' },
        { label: 'Install CLI tools', status: 'upcoming' },
      ],
    });

    expect(screen.getByText('Create machine').parentElement).toHaveClass('font-semibold');
    expect(screen.getByText('Install CLI tools').parentElement).toHaveClass('opacity-70');
    expect(screen.getByText('Create machine').closest('li')).toHaveAttribute('aria-current', 'step');
  });

  test('renders numbered markers when markerStyle is numbered', () => {
    render(OnboardingWizardSteps, {
      markerStyle: 'numbered',
      steps: [
        { label: 'Install podman', status: 'upcoming' },
        { label: 'Create machine', status: 'upcoming' },
        { label: 'Install CLI tools', status: 'upcoming' },
      ],
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
