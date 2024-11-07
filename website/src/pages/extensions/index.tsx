import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import TailWindThemeSelector from '@site/src/components/TailWindThemeSelector';
import Layout from '@theme/Layout';

function ExtensionListFromIframe(): JSX.Element {
  return <iframe title="Extensions Catalog" src="https://registry.podman-desktop.io" className="w-full h-screen" />;
}

export default function Extensions(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Extensions">
      <TailWindThemeSelector />
      <ExtensionListFromIframe />
    </Layout>
  );
}
