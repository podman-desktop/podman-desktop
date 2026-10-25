<script lang="ts">
import { isDark, isHighContrast } from '/@/stores/appearance';
import { colorsInfos } from '/@/stores/colors';

interface Props {
  url: string | undefined;
}

let { url }: Props = $props();

function syncTheme(webviewElement: HTMLElement): { destroy: () => void } {
  const guest = webviewElement as HTMLElement & {
    executeJavaScript: (script: string) => Promise<unknown>;
  };
  let domReady = false;
  let frame: number | undefined;

  const applyTheme = (): void => {
    if (!domReady) return;
    const theme = $isDark ? 'dark' : 'light';
    const style = getComputedStyle(webviewElement);
    const color = (name: string): string => style.getPropertyValue(name).trim();
    const background = style.backgroundColor;
    const text = color('--pd-content-text');
    const link = color('--pd-link');
    // Use the app's resolved tokens, including custom and high-contrast themes.
    const contrastCss = $isHighContrast
      ? `a { text-decoration: underline; }
    :focus-visible { outline: 2px solid ${color('--pd-button-focus-ring')} !important; outline-offset: 2px; }`
      : '';
    const css = `:root {
      --ifm-background-color: ${background};
      --ifm-background-surface-color: ${background};
      --ifm-navbar-background-color: ${background};
      --ifm-footer-background-color: ${background};
      --ifm-font-color-base: ${text};
      --ifm-heading-color: ${text};
      --ifm-navbar-link-color: ${text};
      --ifm-menu-color: ${text};
      --ifm-color-primary: ${link};
      --ifm-link-color: ${link};
      --ifm-color-emphasis-300: ${color('--pd-content-divider')};
      --ifm-code-background: ${color('--pd-content-card-bg')};
      color-scheme: ${theme};
    }
    html, body, .navbar, .footer { background-color: ${background} !important; }
    ${contrastCss}`;
    guest
      .executeJavaScript(`(() => {
      try { localStorage.setItem('theme', ${JSON.stringify(theme)}); } catch {}
      document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
      let style = document.getElementById('podman-desktop-tab-background');
      if (!style) {
        style = document.createElement('style');
        style.id = 'podman-desktop-tab-background';
        document.head.appendChild(style);
      }
      style.textContent = ${JSON.stringify(css)};
    })()`)
      .catch((error: unknown) => console.error('Failed to sync documentation theme', error));
  };

  const onDomReady = (): void => {
    domReady = true;
    applyTheme();
  };

  webviewElement.addEventListener('dom-ready', onDomReady);
  webviewElement.addEventListener('did-finish-load', applyTheme);
  const scheduleTheme = (): void => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(applyTheme);
  };
  const subscriptions = [
    isDark.subscribe(scheduleTheme),
    isHighContrast.subscribe(scheduleTheme),
    colorsInfos.subscribe(scheduleTheme),
  ];

  return {
    destroy: (): void => {
      subscriptions.forEach(unsubscribe => unsubscribe());
      if (frame !== undefined) cancelAnimationFrame(frame);
      webviewElement.removeEventListener('dom-ready', onDomReady);
      webviewElement.removeEventListener('did-finish-load', applyTheme);
    },
  };
}

const documentationUrl = $derived.by(() => {
  if (!url) return undefined;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:' ? parsedUrl.toString() : undefined;
  } catch {
    return undefined;
  }
});
</script>

{#if documentationUrl}
  <webview
    src={documentationUrl}
    aria-label="Documentation"
    use:syncTheme
    style="height: 100%; width: 100%; background: var(--pd-content-bg); color-scheme: {$isDark ? 'dark' : 'light'}"></webview>
{:else}
  <div class="p-4">This documentation link is invalid.</div>
{/if}
