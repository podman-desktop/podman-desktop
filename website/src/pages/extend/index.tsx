import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
  faBook,
  faCloudArrowDown,
  faCode,
  faDownload,
  faGears,
  faPalette,
  faRocket,
  faStar,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';
import React, { useEffect, useState } from 'react';

import TailWindThemeSelector from '../../components/TailWindThemeSelector';
import type { ProcessedExtension } from '../../utils/extensionData';
import { fetchExtensions, getFeaturedExtensions } from '../../utils/extensionData';

function ExtendHero(): JSX.Element {
  return (
    <section className="text-charcoal-300 dark:text-gray-400 body-font bg-gradient-to-br from-purple-500 to-blue-600">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <div className="text-center lg:w-3/4 w-full">
          <h1 className="title-font sm:text-5xl text-4xl lg:text-7xl mb-6 font-bold text-white">
            Extend Podman Desktop
          </h1>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Unlock unlimited possibilities with our growing ecosystem of extensions. Customize your container workflow
            with tools for Kubernetes, AI, security, and container management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/extensions"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Browse Extensions
            </Link>
            <Link
              to="/docs/extensions/developing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
              Build Your Own
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExtensionShowcase(): JSX.Element {
  const [featuredExtensions, setFeaturedExtensions] = useState<ProcessedExtension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExtensions = async (): Promise<void> => {
      try {
        const extensions = await fetchExtensions();
        const featured = getFeaturedExtensions(extensions, 6);
        setFeaturedExtensions(featured);
      } catch (error) {
        console.error('Failed to load extensions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExtensions().catch((error: unknown) => {
      console.error('Failed to load extensions:', error);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-charcoal-800">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal-300 dark:text-white mb-4">Popular Extensions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover the most loved extensions in our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-charcoal-700 rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-charcoal-800">
      <div className="container mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal-300 dark:text-white mb-4">Popular Extensions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover the most loved extensions in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredExtensions.map((ext, _index) => (
            <div
              key={ext.id}
              className="bg-white dark:bg-charcoal-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4">
                  <img
                    src={ext.icon}
                    alt={`${ext.name} icon`}
                    className="w-full h-full object-contain"
                    onError={e => {
                      // Hide image if it fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white">{ext.name}</h3>
                  <span className="text-sm text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                    {ext.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{ext.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{ext.rating}</span>
                  <span className="text-sm text-gray-500 ml-2">({ext.installs})</span>
                </div>
                <Link
                  to={`/extensions?extension=${ext.id}`}
                  className="text-purple-600 hover:text-purple-700 font-medium">
                  Install →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickActions(): JSX.Element {
  const actions = [
    {
      title: 'Browse Catalog',
      description: 'Explore 50+ available extensions',
      icon: faDownload,
      link: '/extensions',
      color: 'bg-blue-500',
    },
    {
      title: 'Build Extension',
      description: 'Create your own extension',
      icon: faCode,
      link: '/docs/extensions/developing',
      color: 'bg-green-500',
    },
    {
      title: 'API Reference',
      description: 'Complete developer documentation',
      icon: faBook,
      link: '/docs/extensions/api',
      color: 'bg-purple-500',
    },
    {
      title: 'Community',
      description: 'Get help and share ideas',
      icon: faUsers,
      link: '/community',
      color: 'bg-orange-500',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-charcoal-800">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-charcoal-300 dark:text-white mb-4">Get Started</h2>
          <p className="text-gray-600 dark:text-gray-300">Choose your path to extend Podman Desktop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white dark:bg-charcoal-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 no-underline">
              <div
                className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <FontAwesomeIcon icon={action.icon} />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">{action.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Extend Podman Desktop - Customize Your Container Workflow"
      description="Learn how to extend Podman Desktop with extensions for Kubernetes, AI, security, and container management. Build custom extensions and enhance your development workflow.">
      <TailWindThemeSelector />
      <ExtendHero />
      <ExtensionShowcase />
      <QuickActions />

      {/* Keep some of the original content for detailed information */}
      <section className="py-24 bg-gray-50 dark:bg-charcoal-900">
        <div className="container mx-auto px-5">
          <div className="text-center lg:w-2/3 w-full mx-auto">
            <h2 className="title-font sm:text-4xl text-3xl lg:text-5xl mb-8 font-bold text-charcoal-300 dark:text-white">
              What are Extensions?
            </h2>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Extensions are designed to be modular and easily pluggable into Podman Desktop. They allow you to use and
              manipulate a wide range of Podman Desktop functionalities via our API. You can customize every component
              of Podman Desktop and extend its functionality with these extensions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faGears} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Container Engines</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for container engines like Podman or Docker, and virtual machine integrations like Lima.
                </p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faRocket} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Extension Points</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Podman Desktop extension points including tray icon menus, status bar items, icons, menus, and
                  commands.
                </p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faPalette} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Third-party Tools</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Integration with third-party tools like Kind, Compose, and other container management tools.
                </p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faCloudArrowDown} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">API Communication</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All functionalities are communicated entirely through the @podman-desktop/api package.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual diagrams section - Redesigned with two-column layout */}
      <section className="py-24 bg-white dark:bg-charcoal-800 overflow-hidden">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image column - Left side */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-charcoal-700 dark:to-charcoal-600 p-8 max-w-[550px] mx-auto">
                <ThemedImage
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                  alt="Extensibility diagram"
                  sources={{
                    light: useBaseUrl('img/extend/extend-light.png'),
                    dark: useBaseUrl('img/extend/extend-dark.png'),
                  }}
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
            </div>

            {/* Content column - Right side */}
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 text-sm font-semibold mb-4">
                ARCHITECTURE
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-charcoal-300 dark:text-white mb-6">
                Visualizing Extension Capabilities
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Extensions are modular and easily pluggable into Podman Desktop, allowing you to use and manipulate a
                wide range of functionalities through our API without knowing the internal workings.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faGears} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-1">
                      Provider Registration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Register as specific providers for authentication, registry, Kubernetes, containers, CLI tools, or
                      others.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faPalette} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-1">UI Integration</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Add entries to menus, status bar items, configuration panels, and register to specific events.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faRocket} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-1">API Communication</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Interact with users through input boxes, display notifications, execute processes, and send
                      telemetry data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/docs/extensions/api"
                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-3 transition-all">
                  Explore Extension API
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Docker Desktop extensions section - Redesigned with reversed two-column layout */}
      <section className="py-24 bg-gray-50 dark:bg-charcoal-900 overflow-hidden">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content column - Left side */}
            <div className="order-1">
              <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                COMPATIBILITY
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-charcoal-300 dark:text-white mb-6">
                Docker Desktop Extensions Support
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Podman Desktop supports Docker Desktop extensions through a built-in wrapper that intercepts API calls,
                making integration seamless. Use Docker Desktop extensions to further enhance Podman Desktop's
                capabilities.
              </p>

              <div className="bg-white dark:bg-charcoal-800 rounded-xl p-6 mb-9 border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-3">Extension Architecture</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>
                      <strong className="text-charcoal-300 dark:text-white">Modular Design:</strong> Extensions are
                      designed to be modular and easily pluggable into Podman Desktop
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>
                      <strong className="text-charcoal-300 dark:text-white">API Communication:</strong> All
                      functionalities are communicated entirely through the @podman-desktop/api package
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>
                      <strong className="text-charcoal-300 dark:text-white">Simple Activation:</strong> Extensions
                      provide only two entrypoints: activate() and deactivate() functions
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/docs/extensions/developing"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Learn More
                  <FontAwesomeIcon icon={faBook} />
                </Link>
                <Link
                  to="/extensions"
                  className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-charcoal-800 transition-colors">
                  View Compatible Extensions
                </Link>
              </div>
            </div>

            {/* Image column - Right side */}
            <div className="relative order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-charcoal-700 dark:to-charcoal-600 p-8 max-w-[550px] mx-auto">
                <ThemedImage
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                  alt="Extend with Docker Desktop extensions"
                  sources={{
                    light: useBaseUrl('img/extend/extend-dd-light.png'),
                    dark: useBaseUrl('img/extend/extend-dd-dark.png'),
                  }}
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
