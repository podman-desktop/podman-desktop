import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { faBluesky, faDiscord, faGithub, faLinkedin, faMastodon, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCalendar, faCamera, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommunityBanner from '@site/src/components/CommunityBanner';
import GradientButton from '@site/src/components/GradientButton';
import GradientIcon from '@site/src/components/GradientIcon';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import Layout from '@theme/Layout';
import React from 'react';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description="Podman Desktop Community page">
      <TailWindThemeSelector />
      <CommunityBanner />

      <div className="max-w-4xl mx-auto p-6 text-center text-base">
        <div className="bg-hero-pattern bg-no-repeat bg-center">
          <img
            src={useBaseUrl('img/seals-community.png')}
            alt="Podman Desktop Community Mascots"
            className="mx-auto mb-8 w-[70%]"
          />
        </div>

        <section className="mb-24">
          <h1 className="text-3xl font-bold mb-6">Podman Desktop Community</h1>
          <p className="text-base">
            Welcome to the Podman Desktop Community! We're excited to have you here. This is the place to connect with
            fellow developers, share your experiences, contribute to the project, and help shape the future of Podman
            Desktop.
          </p>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-4">Why Join the Community?</h2>
          <p className="mb-12">Podman Desktop is powered by an amazing open-source community. By joining, you can:</p>
          <div className="grid grid-cols-2 gap-10 text-left ">
            <div>
              <h4 className="font-semibold uppercase">Learn</h4>
              <p>Discover tips, tricks, and best practices for working with containers.</p>
            </div>
            <div>
              <h4 className="font-semibold uppercase">Contribute</h4>
              <p>Help build the project by reporting bugs, submitting code, or enhancing documentation.</p>
            </div>
            <div>
              <h4 className="font-semibold uppercase">Collaborate</h4>
              <p>Share your feedback and ideas to improve Podman Desktop.</p>
            </div>
            <div>
              <h4 className="font-semibold uppercase">Connect</h4>
              <p>Meet like-minded developers who are passionate about containers and open-source.</p>
            </div>
          </div>
        </section>

        <section className="pb-8 pt-8 bg-hero-pattern bg-no-repeat bg-center mb-24">
          <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
          <p className="mb-14">Connect with the community through our official channels:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-8 text-black dark:text-white justify-items-center">
            {/* Row 1 */}
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faDiscord} size="4x" className="mb-4" />
              <GradientButton href="https://discord.com/invite/x5GzFF6QH4">Join our Discord</GradientButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faGithub} size="4x" className="mb-4" />
              <GradientButton href="https://github.com/podman-desktop/podman-desktop/discussions">
                GitHub discussions
              </GradientButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faBluesky} size="4x" className="mb-4" />
              <GradientButton href="https://bsky.app/profile/podman-desktop.io">Follow us on Bluesky</GradientButton>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={faXTwitter} size="4x" className="mb-4" />
              <GradientButton href="https://x.com/podmandesktop">Follow us on X</GradientButton>
            </div>

            {/* Row 2: Center the last two */}
            <div className="contents sm:flex sm:justify-center sm:col-span-4">
              <div className="flex flex-col items-center gap-2 sm:mx-10">
                <FontAwesomeIcon icon={faLinkedin} size="4x" className="mb-4" />
                <GradientButton href="https://www.linkedin.com/company/podman-desktop">
                  Connect on LinkedIn
                </GradientButton>
              </div>
              <div className="flex flex-col items-center gap-2 sm:mx-10">
                <FontAwesomeIcon icon={faMastodon} size="4x" className="mb-4" />
                <GradientButton href="https://fosstodon.org/@podmandesktop">Follow us on Mastodon</GradientButton>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-6 text-center">Contribute to the Project</h2>
          <p className="mb-14">We welcome contributions of all kinds! Here's how you can get started:</p>
          <div className="grid grid-cols-2 gap-6 text-left">
            <div>
              <a className="font-semibold uppercase" href="https://github.com/containers/podman-desktop">
                Contribute code
              </a>
              <p className="mt-1">
                Tackle open issues, add features, or improve performance by contributing code to our GitHub repository.
              </p>
            </div>
            <div>
              <a className="font-semibold uppercase" href={useBaseUrl('/docs/intro')}>
                Documentation
              </a>
              <p className="mt-1">
                Enhance our docs by clarifying instructions, adding guides, or fixing mistakes for the benefit of all
                users.
              </p>
            </div>
            <div>
              <a className="font-semibold uppercase" href="https://github.com/containers/podman-desktop/issues">
                Report issues
              </a>
              <p className="mt-1">
                Help us improve by reporting bugs or suggesting features through our issue tracker.
              </p>
            </div>
            <div>
              <a className="font-semibold uppercase" href={useBaseUrl('/tutorial')}>
                Tutorials
              </a>
              <p className="mt-1">
                Create or update tutorials to help users get started or explore advanced Podman Desktop features.
              </p>
            </div>
            <div>
              <a
                className="font-semibold uppercase"
                href="https://github.com/podman-desktop/community/blob/main/presentations/README.md">
                Presentations and demos
              </a>
              <p className="mt-1">
                Share or watch community presentations and demos to learn and inspire others with your workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Attend Community Events</h2>
          <p className="mb-14">Join us for upcoming meetups, webinars, and conferences.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center text-center justify-center">
              <p className="mb-1 font-semibold pb-6 uppercase">Latest meeting</p>
              <div className="flex items-center mb-6">
                <GradientIcon icon={faCamera} size={24} />
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <GradientButton href="https://github.com/podman-desktop/community/blob/main/meetings/README.md#upcoming-community-meeting">
                  Watch recording
                </GradientButton>
              </div>
            </div>
            <div className="flex flex-col items-center text-center justify-center">
              <p className="mb-1 font-semibold pb-10 pt-2 uppercase">Join community meeting</p>
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faCalendar} />
                <span>Every 4th Thursday of the month</span>
              </div>
              <div className="flex items-center gap-2 mb-10">
                <FontAwesomeIcon icon={faClock} />
                <span>9–10 am EST</span>
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <GradientButton
                  href="https://github.com/podman-desktop/community/issues?q=is%3Aissue%20state%3Aopen%20Agenda%20for%20Podman%20Desktop"
                  solid={true}>
                  Join Us!
                </GradientButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
