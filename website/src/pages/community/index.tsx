import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CommunityBanner from '@site/src/components/CommunityBanner';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import Layout from '@theme/Layout';
import React from 'react';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description="Podman Desktop Community page">
      <TailWindThemeSelector />
      <CommunityBanner />

      <main className="max-w-4xl mx-auto p-6 ">
        <section className="mb-8">
          <h1 className="text-3xl mb-4">Podman Desktop Community</h1>
          <p className="dark:text-gray-700">
            Welcome to the <b>Podman Desktop Community</b>! We're excited to have you here. This is the place to connect
            with fellow developers, share your experiences, contribute to the project, and help shape the future of
            Podman Desktop.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl mb-4">Why Join the Community?</h2>
          <p className="dark:text-gray-700">
            Podman Desktop is powered by an amazing open-source community. By joining, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 dark:text-gray-700">
            <li>
              <strong>Learn</strong>: Discover tips, tricks, and best practices for working with containers.
            </li>
            <li>
              <strong>Collaborate</strong>: Share your feedback and ideas to improve Podman Desktop.
            </li>
            <li>
              <strong>Contribute</strong>: Help build the project by reporting bugs, submitting code, or enhancing
              documentation.
            </li>
            <li>
              <strong>Connect</strong>: Meet like-minded developers who are passionate about containers and open-source.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl mb-4">Get Involved</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl mb-2">1. Join the Conversation</h3>
              <p className="dark:text-gray-700">Connect with the community through our official channels:</p>
              <ul className="list-disc list-inside space-y-2 dark:text-gray-700">
                <li>
                  <a href="https://discord.com/invite/x5GzFF6QH4" target="_blank" rel="noopener noreferrer">
                    Join us on our Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/podman-desktop/podman-desktop/discussions"
                    target="_blank"
                    rel="noopener noreferrer">
                    Participate on GitHub Discussions
                  </a>
                </li>
                <li>
                  <a href="https://fosstodon.org/@podmandesktop" target="_blank" rel="noopener noreferrer">
                    Follow us on Mastodon
                  </a>
                </li>
                <li>
                  <a href="https://bsky.app/profile/podman-desktop.io" target="_blank" rel="noopener noreferrer">
                    Follow us on Bluesky
                  </a>
                </li>
                <li>
                  <a href="https://x.com/Podman_io" target="_blank" rel="noopener noreferrer">
                    Follow us on X
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/podman-desktop" target="_blank" rel="noopener noreferrer">
                    Follow us on LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl mb-2">2. Contribute to the Project</h3>
              <p className="dark:text-gray-700">
                We welcome contributions of all kinds! Here’s how you can get started:
              </p>
              <ul className="list-disc list-inside space-y-2 dark:text-gray-700">
                <li>
                  <a href="https://github.com/containers/podman-desktop">Code Contributions</a>: Check out our GitHub
                  repository for open issues and contribution guidelines.
                </li>
                <li>
                  <a href="https://github.com/containers/podman-desktop/issues">Report Issues</a>: Found a bug or have a
                  feature request? Let us know!
                </li>
                <li>
                  <a href={useBaseUrl('/docs/intro')}>Documentation</a>: Help us improve our docs.
                </li>
                <li>
                  <a href={useBaseUrl('/tutorial')}>Tutorials</a>: Step-by-step guides to get started.
                </li>
                <li>
                  <a href="https://github.com/podman-desktop/community/blob/main/presentations/README.md">
                    Presentations
                  </a>
                  &nbsp;&&nbsp;
                  <a href="https://github.com/podman-desktop/community/blob/main/demos/README.md">Demos</a>: Check out
                  presentations and demos and add your own!
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl mb-2">3. Attend Community Events</h3>
              <p className="dark:text-gray-700">
                Join us for upcoming{' '}
                <a href="https://github.com/podman-desktop/community/blob/main/meetings/README.md#upcoming-community-meeting">
                  meeting
                </a>
                , webinars, and conferences.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
