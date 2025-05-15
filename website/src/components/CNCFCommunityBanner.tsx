import Link from '@docusaurus/Link';

export function CNCFCommunityBanner(): JSX.Element {
  return (
    <section className="text-charcoal-300 dark:text-gray-400 body-font py-18 w-full">
      <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-sky-500 to-purple-500 mx-auto w-full max-w-5xl">
        <div className="container px-4 text-center rounded-xl p-10 bg-white dark:bg-charcoal-800 relative overflow-hidden">
          <h2 className="text-3xl md:text-3xl font-semibold mb-6">
            A Community-Driven Project Designed for Developers
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto mb-10">
            Built by a community of developers and shaped by user feedback, Podman Desktop offers a vendor-neutral
            platform that empowers Containers and Kubernetes workflows without lock-in. Trusted as part of the CNCF, it
            delivers flexibility, reliability, and innovation tailored for developers.
          </p>

          {/* CTA button with floating container icons inside */}
          <div className="relative flex justify-center mb-10">
            <div className="relative inline-block">
              {/* Floating containers around the button */}
              <img
                src="/img/container.svg"
                alt="Left Container"
                className="hidden md:block absolute left-[-140px] top-[-30px] w-22"
              />
              <img
                src="/img/container_semibold.svg"
                alt="Right Container 1"
                className="hidden md:block absolute right-[-80px] top-[30px] w-18"
              />
              <img
                src="/img/container.svg"
                alt="Right Container 2"
                className="hidden md:block absolute right-[-70px] top-[-10px] w-7"
              />
              <img
                src="/img/container_bold.svg"
                alt="Right Container 3"
                className="hidden md:block absolute right-[-120px] bottom-[10px] w-10"
              />

              {/* CTA Link */}
              <div className="p-[2px] rounded border-gradient bg-gradient-to-r from-sky-500 to-purple-500 w-fit z-10 relative">
                <Link
                  to="/community"
                  className="inline-block bg-white dark:bg-charcoal-800 text-charcoal-300 dark:text-white py-3 px-6 rounded hover:bg-purple-600 hover:text-white transition-colors duration-200 font-semibold text-base">
                  Interested to join the tribe?
                </Link>
              </div>
            </div>
          </div>

          {/* CNCF Logo */}
          <div className="absolute bottom-5 right-5">
            <img src="/img/cncf-logo-dark.svg" alt="Cloud Native Computing Foundation" className="w-48 dark:inline" />
            <img src="/img/cncf-logo.svg" alt="Cloud Native Computing Foundation" className="w-48 dark:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
