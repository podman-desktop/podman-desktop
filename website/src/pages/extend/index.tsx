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
              Extensions in Podman Desktop allow users to enhance and customize their container management experience.
              They enable new functionalities such as:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faGears} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Container Engines</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Adding support for different container engines like Docker, Lima, or Kubernetes.
                </p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faRocket} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">CLI Integrations</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Providing command-line integrations with tools like Helm or Kubectl.
                </p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faPalette} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">UI Elements</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Introducing custom actions, badges, views, and workflows.
                </p>
              </div>
              <div className="bg-white dark:bg-charcoal-800 rounded-lg p-6">
                <FontAwesomeIcon icon={faCloudArrowDown} className="text-purple-600 text-2xl mb-4" />
                <h3 className="text-xl font-semibold text-charcoal-300 dark:text-white mb-2">Automation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automating tasks and integrating with external services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual diagrams section */}
      <section className="py-24 bg-white dark:bg-charcoal-800">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal-300 dark:text-white mb-4">
              Visualizing Extension Capabilities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">See how extensions integrate with Podman Desktop</p>
          </div>
          <div className="flex justify-center items-center">
            <ThemedImage
              className="py-4 max-w-[550px] w-full h-auto"
              alt="Extensibility diagram"
              sources={{
                light: useBaseUrl('img/extend/extend-light.png'),
                dark: useBaseUrl('img/extend/extend-dark.png'),
              }}
            />
          </div>
        </div>
      </section>

      {/* Docker Desktop extensions section */}
      <section className="py-24 bg-gray-50 dark:bg-charcoal-900">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal-300 dark:text-white mb-4">
              Docker Desktop Extensions Support
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Podman Desktop can also leverage Docker Desktop UI extensions through a built-in wrapper that intercepts
              API calls, making integration seamless. Use Docker Desktop extensions to further enhance Podman Desktop's
              capabilities.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <ThemedImage
              className="py-4 max-w-[550px] w-full h-auto"
              alt="Extend with Docker Desktop extensions"
              sources={{
                light: useBaseUrl('img/extend/extend-dd-light.png'),
                dark: useBaseUrl('img/extend/extend-dd-dark.png'),
              }}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
