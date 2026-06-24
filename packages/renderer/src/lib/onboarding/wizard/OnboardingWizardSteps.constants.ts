export interface OnboardingWizardStep {
  label: string;
  status: 'completed' | 'active' | 'upcoming';
}

export const ONBOARDING_WIZARD_DEFAULT_STEPS: OnboardingWizardStep[] = [
  { label: 'Install podman', status: 'upcoming' },
  { label: 'Create machine', status: 'upcoming' },
  { label: 'Install CLI tools', status: 'upcoming' },
];
