import {
  faChevronDown,
  faChevronUp,
  faCopy,
  faDownload,
  faExternalLinkAlt,
  faEye,
  faSearch,
  faStar,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import React, { useEffect, useMemo, useState } from 'react';

import TailWindThemeSelector from '../../components/TailWindThemeSelector';
import type { ExtensionCategory, ProcessedExtension } from '../../utils/extensionData';
import { fetchExtensionCategories, fetchExtensionReadme, fetchExtensions } from '../../utils/extensionData';

interface ExtensionDetailModalProps {
  readonly extension: ProcessedExtension | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface ExtensionDetailModalState {
  readmeContent: string;
  readmeLoading: boolean;
  readmeError: string | null;
}

function ExtensionDetailModal({ extension, isOpen, onClose }: ExtensionDetailModalProps): JSX.Element {
  const [readmeState, setReadmeState] = useState<ExtensionDetailModalState>({
    readmeContent: '',
    readmeLoading: false,
    readmeError: null,
  });

  useEffect(() => {
    if (extension && isOpen) {
      setReadmeState({
        readmeContent: '',
        readmeLoading: true,
        readmeError: null,
      });

      fetchExtensionReadme(extension.readmeUrl)
        .then(content => {
          setReadmeState({
            readmeContent: content,
            readmeLoading: false,
            readmeError: null,
          });
        })
        .catch((_error: unknown) => {
          setReadmeState({
            readmeContent: '',
            readmeLoading: false,
            readmeError: 'Failed to load README content',
          });
        });
    }
  }, [extension, isOpen]);

  if (!extension || !isOpen) return <></>;

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).catch((error: unknown) => {
      console.error('Failed to copy to clipboard:', error);
    });
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-charcoal-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={extension.icon}
                  alt={`${extension.name} icon`}
                  className="w-full h-full object-contain"
                  onError={e => {
                    // Fallback to category icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="text-6xl hidden">{getCategoryIcon(extension.category)}</div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-charcoal-300 dark:text-white">{extension.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">by {extension.publisher}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Installation</h3>
                <div className="bg-gray-100 dark:bg-charcoal-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                      podman extension install {extension.ociUri}
                    </code>
                    <button
                      onClick={() => copyToClipboard(`podman extension install ${extension.ociUri}`)}
                      className="text-purple-600 hover:text-purple-700 text-sm">
                      <FontAwesomeIcon icon={faCopy} className="mr-1" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {extension.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {extension.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Documentation</h3>
                <div className="bg-gray-100 dark:bg-charcoal-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {readmeState.readmeLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">Loading documentation...</span>
                    </div>
                  ) : readmeState.readmeError ? (
                    <div className="text-red-600 dark:text-red-400 text-center py-4">{readmeState.readmeError}</div>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 prose-headings:text-charcoal-300 dark:prose-headings:text-white prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-pre:bg-gray-200 dark:prose-pre:bg-charcoal-600 prose-pre:text-gray-800 dark:prose-pre:text-gray-200"
                      dangerouslySetInnerHTML={{ __html: formatMarkdownAsHtml(readmeState.readmeContent) }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-charcoal-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-charcoal-300 dark:text-white mb-4">Extension Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Version</span>
                    <span className="font-medium text-charcoal-300 dark:text-white">{extension.latestVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Publisher</span>
                    <span className="font-medium text-charcoal-300 dark:text-white">{extension.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Category</span>
                    <span className="font-medium text-charcoal-300 dark:text-white">{extension.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">License</span>
                    <span className="font-medium text-charcoal-300 dark:text-white">{extension.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Installs</span>
                    <span className="font-medium text-charcoal-300 dark:text-white">{extension.installs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Rating</span>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                      <span className="font-medium text-charcoal-300 dark:text-white">{extension.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Install Extension
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-charcoal-600 transition-colors flex items-center justify-center">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const iconMap: { [key: string]: string } = {
    AI: '🤖',
    Kubernetes: '☸️',
    Containers: '🐳',
    Authentication: '🔐',
    Development: '🛠️',
    Tools: '⚙️',
    Other: '📦',
  };
  return iconMap[category] || '📦';
}

function formatMarkdownAsHtml(markdown: string): string {
  if (!markdown) return '';

  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-8">$1</h1>')

      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-200 dark:bg-charcoal-600 p-3 rounded text-sm overflow-x-auto my-4"><code>$1</code></pre>',
      )

      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-200 dark:bg-charcoal-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
      )

      // Links
      .replace(
        /\[([^[\]]+)\]\(([^()]+)\)/g,
        '<a href="$2" class="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )

      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')

      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>')

      // Wrap in paragraphs
      .replace(/^(?!<[hl])([^<\n].*)$/gm, '<p class="mb-3">$1</p>')

      // Clean up empty paragraphs
      .replace(/<p class="mb-3"><\/p>/g, '')
      .replace(/<p class="mb-3"><br><\/p>/g, '')
  );
}

export default function ExtensionRegistry(): JSX.Element {
  const [extensions, setExtensions] = useState<ProcessedExtension[]>([]);
  const [categories, setCategories] = useState<ExtensionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'date' | 'rating'>('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<ProcessedExtension | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [extensionsData, categoriesData] = await Promise.all([fetchExtensions(), fetchExtensionCategories()]);
        setExtensions(extensionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load extension data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData().catch((error: unknown) => {
      console.error('Failed to load data:', error);
    });
  }, []);

  const filteredAndSortedExtensions = useMemo(() => {
    let filtered = extensions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        ext =>
          ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ext.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ext.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      // Map display names to actual category names
      const categoryMap: { [key: string]: string } = {
        'Container Engines': 'Containers',
        Kubernetes: 'Kubernetes',
        'AI & Machine Learning': 'AI',
        Authentication: 'Authentication',
        'Development Tools': 'Development',
      };

      const actualCategory = categoryMap[selectedCategory] || selectedCategory;
      filtered = filtered.filter(ext => ext.category === actualCategory);
    }

    // Sort extensions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
        default: {
          const aScore = a.rating * (parseInt(a.installs.replace(/[^\d]/g, '')) || 0);
          const bScore = b.rating * (parseInt(b.installs.replace(/[^\d]/g, '')) || 0);
          return bScore - aScore;
        }
      }
    });

    return filtered;
  }, [extensions, searchQuery, selectedCategory, sortBy]);

  const handleExtensionClick = (extension: ProcessedExtension): void => {
    setSelectedExtension(extension);
    setShowDetailModal(true);
  };

  const copyInstallCommand = (extension: ProcessedExtension): void => {
    navigator.clipboard.writeText(`podman extension install ${extension.ociUri}`).catch((error: unknown) => {
      console.error('Failed to copy to clipboard:', error);
    });
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <Layout title="Extension Registry" description="Browse and install Podman Desktop extensions">
        <TailWindThemeSelector />
        <div className="container mx-auto px-5 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading extensions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Extension Registry" description="Browse and install Podman Desktop extensions">
      <TailWindThemeSelector />

      <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
        <div className="container mx-auto px-5 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Extension Registry</h1>
            <p className="text-xl text-white/90 mb-8">
              Discover and install extensions to enhance your Podman Desktop experience
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search extensions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 text-lg bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/70 focus:border-white/40 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-charcoal-300 dark:text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === 'All'
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700'
                      }`}>
                      All Extensions ({extensions.length})
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700'
                        }`}>
                        {category.icon} {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort by</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'popularity', label: 'Popularity' },
                      { value: 'name', label: 'Name' },
                      { value: 'date', label: 'Last Updated' },
                      { value: 'rating', label: 'Rating' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as 'popularity' | 'name' | 'date' | 'rating')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === option.value
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700'
                        }`}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-charcoal-300 dark:text-white">
                {selectedCategory === 'All' ? 'All Extensions' : selectedCategory} ({filteredAndSortedExtensions.length}
                )
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedExtensions.map(extension => (
                <div
                  key={extension.id}
                  className="bg-white dark:bg-charcoal-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => handleExtensionClick(extension)}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                          <img
                            src={extension.icon}
                            alt={`${extension.name} icon`}
                            className="w-full h-full object-contain"
                            onError={e => {
                              // Fallback to category icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="text-3xl hidden">{getCategoryIcon(extension.category)}</div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-charcoal-300 dark:text-white group-hover:text-purple-600 transition-colors">
                            {extension.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">by {extension.publisher}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {extension.category}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{extension.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                          {extension.rating}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          {extension.installs}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">v{extension.latestVersion}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          copyInstallCommand(extension);
                        }}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        <FontAwesomeIcon icon={faCopy} className="mr-1" />
                        Copy Install
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleExtensionClick(extension);
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors text-sm">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedExtensions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">No extensions found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search query or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExtensionDetailModal
        extension={selectedExtension}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </Layout>
  );
}
