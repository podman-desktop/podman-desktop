import type { VendorViewMode } from '../PrototypeScope/types';

export interface VendorCardProps {
  readonly name: string;
  readonly logo: string;
  readonly logoDark?: string;
  readonly description: string;
  readonly href: string;
}

export const redHatVendor: VendorCardProps = {
  name: 'Red Hat',
  logo: '/img/vendors/redhat-logo.svg',
  logoDark: '/img/vendors/redhat-logo-dark.svg',
  description:
    'Red Hat offers the Red Hat Build of Podman Desktop with enterprise support, long-term maintenance, and production-ready builds.',
  href: 'https://developers.redhat.com/products/red-hat-build-podman-desktop?intcmp=RHCTG0260000479488',
};

export const fewVendors: VendorCardProps[] = [
  redHatVendor,
  {
    name: 'SUSE',
    logo: '/img/vendors/suse-logo.svg',
    logoDark: '/img/vendors/suse-logo-dark.svg',
    description:
      'SUSE provides enterprise container management solutions with commercial support and integration for Podman Desktop.',
    href: '#',
  },
  {
    name: 'Ubuntu',
    logo: '/img/vendors/ubuntu-logo.svg',
    description:
      'Canonical offers Ubuntu Pro with enterprise support, security patching, and compliance for Podman Desktop deployments.',
    href: '#',
  },
];

export const manyVendors: VendorCardProps[] = [
  ...fewVendors,
  {
    name: 'Docker',
    logo: '/img/vendors/docker-logo.svg',
    logoDark: '/img/vendors/docker-logo-dark.svg',
    description: 'Docker provides enterprise container platform solutions with dedicated support.',
    href: '#',
  },
  {
    name: 'Mirantis',
    logo: '/img/vendors/suse-logo.svg',
    logoDark: '/img/vendors/suse-logo-dark.svg',
    description: 'Mirantis offers enterprise Kubernetes and container runtime support.',
    href: '#',
  },
  {
    name: 'Rancher',
    logo: '/img/vendors/suse-logo.svg',
    logoDark: '/img/vendors/suse-logo-dark.svg',
    description: 'Rancher delivers enterprise container management across any infrastructure.',
    href: '#',
  },
  {
    name: 'VMware',
    logo: '/img/vendors/docker-logo.svg',
    logoDark: '/img/vendors/docker-logo-dark.svg',
    description: 'VMware Tanzu provides enterprise container orchestration and support.',
    href: '#',
  },
  {
    name: 'Aqua Security',
    logo: '/img/vendors/ubuntu-logo.svg',
    description: 'Aqua Security offers container security and compliance for enterprise environments.',
    href: '#',
  },
  {
    name: 'Datadog',
    logo: '/img/vendors/docker-logo.svg',
    logoDark: '/img/vendors/docker-logo-dark.svg',
    description: 'Datadog provides enterprise monitoring and observability for container workloads.',
    href: '#',
  },
];

export function getVendors(mode: VendorViewMode): VendorCardProps[] {
  if (mode === 'single') return [redHatVendor];
  if (mode === 'few') return fewVendors;
  return manyVendors;
}
