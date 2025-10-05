import '@fortawesome/fontawesome-svg-core/styles.css';

import { useLocation } from '@docusaurus/router';
import {
  faChevronDown,
  faChevronUp,
  faCopy,
  faDownload,
  faSearch,
  faStar,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import DOMPurify from 'dompurify';
import React, { useEffect, useMemo, useState } from 'react';

import TailWindThemeSelector from '../../components/TailWindThemeSelector';
import type { CategoryMapping, ExtensionCategory, ProcessedExtension } from '../../utils/extensionData';
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
  copyFeedback: boolean;
}

function ExtensionDetailModal({ extension, isOpen, onClose }: ExtensionDetailModalProps): JSX.Element {
  const [readmeState, setReadmeState] = useState<ExtensionDetailModalState>({
    readmeContent: '',
    readmeLoading: false,
    readmeError: null,
    copyFeedback: false,
  });

  useEffect(() => {
    if (extension && isOpen) {
      setReadmeState({
        readmeContent: '',
        readmeLoading: true,
        readmeError: null,
        copyFeedback: false,
      });

      fetchExtensionReadme(extension.readmeUrl)
        .then(content => {
          setReadmeState({
            readmeContent: content,
            readmeLoading: false,
            readmeError: null,
            copyFeedback: false,
          });
        })
        .catch((_error: unknown) => {
          setReadmeState({
            readmeContent: '',
            readmeLoading: false,
            readmeError: 'Failed to load README content',
            copyFeedback: false,
          });
        });
    }
  }, [extension, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!extension || !isOpen) return <></>;

  const getInstallUrl = (extension: ProcessedExtension): string => {
    return `podman-desktop:extension/${extension.id}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-250 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}>
      <div
        className="bg-white dark:bg-charcoal-800 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto lg:overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-25 h-25 flex items-center justify-center">
                <img
                  src={extension.icon}
                  alt={`${extension.name} icon`}
                  className="w-full h-full object-contain"
                  onError={e => {
                    // Hide image if it fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-charcoal-300 dark:text-white mb-2">{extension.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 -mt-1 mb-0">by {extension.publisher}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer">
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Documentation</h3>
              <div className="bg-gray-100 dark:bg-charcoal-700 rounded-lg p-4 h-[50vh] lg:h-[75vh] overflow-y-auto">
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

            <div className="space-y-4 lg:space-y-6">
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
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span className="text-gray-600 dark:text-gray-300">Categories</span>
                    <div className="flex flex-wrap gap-1 sm:justify-end">
                      {extension.categories.map((cat, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                          {cat}
                        </span>
                      ))}
                    </div>
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

              {extension.keywords.length > 0 && (
                <div>
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

              <div className="space-y-3">
                <a
                  href={getInstallUrl(extension)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center no-underline">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Install Extension
                </a>
                <button
                  onClick={() => {
                    const copyToClipboard = async (): Promise<void> => {
                      try {
                        const url = new URL(window.location.href);
                        url.searchParams.set('extension', extension.id);
                        await navigator.clipboard.writeText(url.toString());
                        // Show feedback
                        setReadmeState(prev => ({ ...prev, copyFeedback: true }));
                        setTimeout(() => {
                          setReadmeState(prev => ({ ...prev, copyFeedback: false }));
                        }, 2000);
                      } catch (err) {
                        console.error('Failed to copy permalink:', err);
                      }
                    };
                    copyToClipboard().catch((err: unknown) => {
                      console.error('Failed to copy permalink:', err);
                    });
                  }}
                  className="w-full bg-gray-100 dark:bg-charcoal-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-charcoal-500 transition-colors flex items-center justify-center cursor-pointer">
                  <FontAwesomeIcon icon={faCopy} className="mr-2" />
                  {readmeState.copyFeedback ? 'Copied!' : 'Share Extension'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarkdownAsHtml(markdown: string): string {
  if (!markdown) return '';

  const html = markdown
    // Headers with IDs for anchor links
    .replace(/^### ([^\n]*)$/gm, (match, title) => {
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');
      return `<h3 id="${id}" class="text-lg font-semibold mb-2 mt-4">${title}</h3>`;
    })
    .replace(/^## ([^\n]*)$/gm, (match, title) => {
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');
      return `<h2 id="${id}" class="text-xl font-semibold mb-3 mt-6">${title}</h2>`;
    })
    .replace(/^# ([^\n]*)$/gm, (match, title) => {
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');
      return `<h1 id="${id}" class="text-2xl font-bold mb-4 mt-2">${title}</h1>`;
    })

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

    // Images - handle various formats
    .replace(
      /!image\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 mx-auto block" />',
    )

    // Handle !image without brackets
    .replace(/!image\(([^)]+)\)/g, '<img src="$1" alt="" class="max-w-full h-auto rounded-lg my-4 mx-auto block" />')

    // Standard markdown images - detect badge images and align them to the left
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      // Check if this looks like a badge (shields.io, codecov, etc.)
      const isBadge =
        /shields\.io|codecov\.io|github\.com.*badge|img\.shields\.io|badge/i.test(src) ||
        /badge|stars|coverage|version|license|downloads|build|status|quality|security/i.test(alt) ||
        /\.svg$/.test(src); // SVG images are often badges

      if (isBadge) {
        return `<img src="${src}" alt="${alt}" class="h-5 inline-block mr-2 my-1 mb-2" /><br>`;
      }
      return `<img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg my-4 mx-auto block" />`;
    })

    // Links - handle internal anchor links within the modal
    .replace(
      /\[([^[\]]+)\]\(#([^)]+)\)/g,
      '<a href="#$2" class="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer" onclick="event.preventDefault(); document.getElementById(\'$2\').scrollIntoView({behavior: \'smooth\'}); return false;">$1</a>',
    )
    // External links - open in same window
    .replace(
      /\[([^[\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" class="text-purple-600 dark:text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Lists - simple approach
    .replace(/^\* ([^\n]*)$/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
    .replace(/^- ([^\n]*)$/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
    .replace(/^\d+\. ([^\n]*)$/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')

    // Clean up multiple spaces and normalize whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')

    // Handle paragraph breaks first
    .replace(/\n\n/g, '</p><p class="mb-3">')

    // Handle single line breaks within paragraphs
    .replace(/\n/g, '<br>')

    // Wrap remaining plain text in paragraphs (excluding existing HTML elements)
    .replace(/^(?!<[hl])(?!<li)(?!<p)(?!<img)(?!<pre)(?!<code)([^<\n][^\n]*)$/gm, '<p class="mb-3">$1</p>')

    // Clean up empty paragraphs and fix paragraph structure
    .replace(/<p class="mb-3"><\/p>/g, '')
    .replace(/<p class="mb-3"><br><\/p>/g, '')
    .replace(/<p class="mb-3">\s*<\/p>/g, '');

  // Sanitize the HTML to prevent XSS attacks
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'em',
      'b',
      'i',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'pre',
      'code',
      'blockquote',
    ],
    ALLOWED_ATTR: ['id', 'class', 'href', 'target', 'rel', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    // Remove any onclick handlers and javascript: URLs
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
  });
}

export default function ExtensionRegistry(): JSX.Element {
  const [extensions, setExtensions] = useState<ProcessedExtension[]>([]);
  const [categories, setCategories] = useState<ExtensionCategory[]>([]);
  const [categoryMapping, setCategoryMapping] = useState<CategoryMapping>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'date' | 'rating'>('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<ProcessedExtension | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { search } = useLocation();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [extensionsData, categoriesResult] = await Promise.all([fetchExtensions(), fetchExtensionCategories()]);
        setExtensions(extensionsData);
        setCategories(categoriesResult.categories);
        setCategoryMapping(categoriesResult.mapping);
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

  // Handle URL parameters for permalinks
  useEffect(() => {
    const extensionId = new URLSearchParams(search).get('extension');
    if (extensionId && extensions.length > 0) {
      const extension = extensions.find(ext => ext.id === extensionId);
      if (extension) {
        setSelectedExtension(extension);
        setShowDetailModal(true);
      } else {
        // Extension not found, clean up URL parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('extension');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [search, extensions]);

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
      const actualCategory = categoryMapping[selectedCategory] || selectedCategory;
      filtered = filtered.filter(ext => ext.category === actualCategory);
    }

    // Clone the array before sorting to avoid mutating the original extensions array
    filtered = [...filtered];

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
  }, [extensions, searchQuery, selectedCategory, sortBy, categoryMapping]);

  const handleExtensionClick = (extension: ProcessedExtension): void => {
    setSelectedExtension(extension);
    setShowDetailModal(true);
    // Update URL with extension parameter
    const url = new URL(window.location.href);
    url.searchParams.set('extension', extension.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleModalClose = (): void => {
    setShowDetailModal(false);
    setSelectedExtension(null);
    // Remove extension parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('extension');
    window.history.pushState({}, '', url.toString());
  };

  if (loading) {
    return (
      <Layout
        title="Podman Desktop Extensions - Browse & Install Container Tools"
        description="Discover and install Podman Desktop extensions for Kubernetes, AI, security, and container management. 50+ free extensions to enhance your development workflow.">
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
    <Layout
      title="Podman Desktop Extensions - Browse & Install Container Tools"
      description="Discover and install Podman Desktop extensions for Kubernetes, AI, security, and container management. 50+ free extensions to enhance your development workflow.">
      <TailWindThemeSelector />

      <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
        <div className="container mx-auto px-5 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Podman Desktop Extension Registry</h1>
            <p className="text-xl text-white/90 mb-8">
              Discover and install extensions to enhance your Podman Desktop container management experience
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-700 text-lg"
                    style={{ color: '#374151', fontSize: '18px' }}
                  />
                </div>
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
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-charcoal-800 rounded-lg lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-charcoal-300 dark:text-white mb-0">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-100 dark:bg-charcoal-700 hover:bg-gray-200 dark:hover:bg-charcoal-600 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="text-sm" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'} overflow-hidden`}>
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
                          selectedCategory === category.name
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700'
                        }`}>
                        {category.name} ({category.count})
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors break-words ${
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-charcoal-300 dark:text-white">
                {selectedCategory === 'All' ? 'All Extensions' : selectedCategory} ({filteredAndSortedExtensions.length}
                )
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedExtensions.map(extension => (
                <div
                  key={extension.id}
                  className="bg-white dark:bg-charcoal-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group h-80 flex flex-col">
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center justify-center space-x-3 min-w-0 flex-1">
                          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <img
                              src={extension.icon}
                              alt={`${extension.name} icon`}
                              className="w-full h-full object-contain"
                              onError={e => {
                                // Hide image if it fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3
                              onClick={() => handleExtensionClick(extension)}
                              className="text-lg font-semibold text-charcoal-300 dark:text-white group-hover:text-purple-600 transition-colors truncate mb-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                              {extension.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate -mt-1 mb-0">
                              by {extension.publisher}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded mt-2">
                          {extension.category}
                        </span>
                      </div>
                    </div>

                    <p
                      onClick={() => handleExtensionClick(extension)}
                      className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {extension.description}
                    </p>

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

                    <div className="flex mt-auto">
                      <button
                        onClick={() => handleExtensionClick(extension)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm cursor-pointer">
                        <FontAwesomeIcon icon={faDownload} className="mr-1" />
                        Install
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

      <ExtensionDetailModal extension={selectedExtension} isOpen={showDetailModal} onClose={handleModalClose} />
    </Layout>
  );
}
