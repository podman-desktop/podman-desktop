// API Configuration
const API_BASE_URL = 'https://registry.podman-desktop.io/api';

export interface ExtensionVersion {
  version: string;
  preview: boolean;
  lastUpdated: string;
  ociUri: string;
  files: Array<{
    assetType: string;
    data: string;
  }>;
}

export interface Extension {
  publisher: {
    publisherName: string;
    displayName: string;
  };
  extensionName: string;
  displayName: string;
  shortDescription: string;
  license: string;
  categories: string[];
  keywords: string[];
  versions: ExtensionVersion[];
}

export interface ProcessedExtension {
  id: string;
  name: string;
  description: string;
  publisher: string;
  category: string;
  categories: string[];
  icon: string;
  latestVersion: string;
  lastUpdated: string;
  installs: string;
  rating: number;
  license: string;
  keywords: string[];
  ociUri: string;
  readmeUrl: string;
}

export interface ExtensionCategory {
  name: string;
  description: string;
  count: number;
  extensions: ProcessedExtension[];
}

export interface CategoryMapping {
  [displayName: string]: string;
}

// Cache for extension data
let extensionCache: ProcessedExtension[] | null = null;
let categoryCache: ExtensionCategory[] | null = null;

export async function fetchExtensions(): Promise<ProcessedExtension[]> {
  if (extensionCache) {
    return extensionCache;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/extensions.json`);
    const data = await response.json();

    const processedExtensions: ProcessedExtension[] = data.extensions.map((ext: Extension) => {
      const latestVersion = ext.versions
        .filter(v => !v.preview)
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0];

      // Calculate popularity metrics (simulated based on version count and recency)
      const versionCount = ext.versions.filter(v => !v.preview).length;
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(latestVersion?.lastUpdated ?? ext.versions[0].lastUpdated).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const installs = versionCount > 5 ? '10k+' : versionCount > 3 ? '5k+' : versionCount > 1 ? '1k+' : '500+';

      const rating = Math.max(4.0, Math.min(5.0, 4.5 - (daysSinceUpdate / 365) * 0.5 + (versionCount / 10) * 0.3));

      // Get icon and README URLs from the files array
      const latestVersionData = latestVersion ?? ext.versions[0];
      const iconFile = latestVersionData.files.find(f => f.assetType === 'icon');
      const readmeFile = latestVersionData.files.find(f => f.assetType === 'README');

      const iconUrl =
        iconFile?.data ??
        `${API_BASE_URL}/extensions/${ext.publisher.publisherName}/${ext.extensionName}/${latestVersionData.version}/icon.png`;
      const readmeUrl =
        readmeFile?.data ??
        `${API_BASE_URL}/extensions/${ext.publisher.publisherName}/${ext.extensionName}/${latestVersionData.version}/README.md`;

      return {
        id: `${ext.publisher.publisherName}.${ext.extensionName}`,
        name: ext.displayName,
        description: ext.shortDescription,
        publisher: ext.publisher.displayName,
        category: ext.categories[0] ?? 'Other',
        categories: ext.categories,
        icon: iconUrl,
        latestVersion: latestVersion?.version ?? ext.versions[0].version,
        lastUpdated: latestVersion?.lastUpdated ?? ext.versions[0].lastUpdated,
        installs,
        rating: Math.round(rating * 10) / 10,
        license: ext.license,
        keywords: ext.keywords,
        ociUri: latestVersion?.ociUri ?? ext.versions[0].ociUri,
        readmeUrl,
      };
    });

    // Sort by popularity (rating * install count)
    processedExtensions.sort((a, b) => {
      const aScore = a.rating * (parseInt(a.installs.replace(/[^\d]/g, '')) || 0);
      const bScore = b.rating * (parseInt(b.installs.replace(/[^\d]/g, '')) || 0);
      return bScore - aScore;
    });

    extensionCache = processedExtensions;
    return processedExtensions;
  } catch (error) {
    console.error('Failed to fetch extensions:', error);
    return getFallbackExtensions();
  }
}

export async function fetchExtensionCategories(): Promise<{
  categories: ExtensionCategory[];
  mapping: CategoryMapping;
}> {
  if (categoryCache) {
    // Return cached data with mapping
    const mapping = createCategoryMapping(categoryCache);
    return { categories: categoryCache, mapping };
  }

  const extensions = await fetchExtensions();

  const categoryMap = new Map<string, ProcessedExtension[]>();

  extensions.forEach(ext => {
    if (!categoryMap.has(ext.category)) {
      categoryMap.set(ext.category, []);
    }
    categoryMap.get(ext.category)!.push(ext);
  });

  // Get all unique categories from the API
  const apiCategories = Array.from(categoryMap.keys()).sort((a, b) => a.localeCompare(b));

  // Create display categories based on API categories
  const categories: ExtensionCategory[] = apiCategories
    .map(apiCategory => {
      const categoryExtensions = categoryMap.get(apiCategory) ?? [];

      return {
        name: apiCategory,
        description: `${apiCategory} extensions`,
        count: categoryExtensions.length,
        extensions: categoryExtensions,
      };
    })
    .filter(cat => cat.count > 0);

  categoryCache = categories;
  const mapping = createCategoryMapping(categories);
  return { categories, mapping };
}

function createCategoryMapping(categories: ExtensionCategory[]): CategoryMapping {
  const mapping: CategoryMapping = {};

  categories.forEach(category => {
    mapping[category.name] = category.name;
  });

  return mapping;
}

export function getFeaturedExtensions(extensions: ProcessedExtension[], count: number = 3): ProcessedExtension[] {
  return extensions.slice(0, count);
}

export function getPopularExtensions(extensions: ProcessedExtension[], count: number = 6): ProcessedExtension[] {
  return extensions.slice(0, count);
}

export async function fetchExtensionReadme(readmeUrl: string): Promise<string> {
  try {
    const response = await fetch(readmeUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch README:', error);
    return 'README content not available.';
  }
}

function getFallbackExtensions(): ProcessedExtension[] {
  return [
    {
      id: 'podman-desktop.ai-lab',
      name: 'AI Lab',
      description: 'Build and run AI models with GPU acceleration',
      publisher: 'Podman Desktop',
      category: 'AI',
      categories: ['AI'],
      icon: '/img/extensions/ai-lab.png',
      latestVersion: '1.0.0',
      lastUpdated: '2024-12-01T00:00:00Z',
      installs: '10k+',
      rating: 4.8,
      license: 'Apache-2.0',
      keywords: ['ai', 'gpu', 'machine-learning'],
      ociUri: 'ghcr.io/podman-desktop/extension-ai-lab:latest',
      readmeUrl: `${API_BASE_URL}/extensions/podman-desktop/ai-lab/1.0.0/README.md`,
    },
    {
      id: 'podman-desktop.kind',
      name: 'Kind',
      description: 'Run local Kubernetes clusters using containers',
      publisher: 'Podman Desktop',
      category: 'Kubernetes',
      categories: ['Kubernetes'],
      icon: '/img/extensions/kind.png',
      latestVersion: '1.0.0',
      lastUpdated: '2024-12-01T00:00:00Z',
      installs: '25k+',
      rating: 4.9,
      license: 'Apache-2.0',
      keywords: ['kubernetes', 'kind', 'local'],
      ociUri: 'ghcr.io/podman-desktop/extension-kind:latest',
      readmeUrl: `${API_BASE_URL}/extensions/podman-desktop/kind/1.0.0/README.md`,
    },
    {
      id: 'podman-desktop.compose',
      name: 'Compose',
      description: 'Multi-container Docker Compose support',
      publisher: 'Podman Desktop',
      category: 'Development',
      categories: ['Development'],
      icon: '/img/extensions/compose.png',
      latestVersion: '1.0.0',
      lastUpdated: '2024-12-01T00:00:00Z',
      installs: '50k+',
      rating: 4.7,
      license: 'Apache-2.0',
      keywords: ['compose', 'docker', 'multi-container'],
      ociUri: 'ghcr.io/podman-desktop/extension-compose:latest',
      readmeUrl: `${API_BASE_URL}/extensions/podman-desktop/compose/1.0.0/README.md`,
    },
  ];
}
