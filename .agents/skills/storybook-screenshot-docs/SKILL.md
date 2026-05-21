---
name: storybook-screenshot-docs
description: >-
  Capture a full-page HiDPI (retina, 2x) screenshot of a Storybook component's
  Docs page in all four themes (light, dark, hc-light, hc-dark). Use when the
  user asks to screenshot, capture, or grab the Docs page, autodocs, or full
  documentation view of a Storybook component.
---

# Storybook: Screenshot Docs Page (HiDPI, Full Scroll)

Capture retina-quality (2x device scale factor) full-page PNG screenshots of a Storybook component's Docs page across all four themes. The Docs page is the autodocs view that shows all stories, controls table, and component documentation in a single scrollable page.

## Prerequisites

- Storybook dev server running on port 6006 (`pnpm --filter storybook dev`)
- Playwright MCP server available (`mcp__plugin_playwright_playwright__*` tools)

## Required inputs

Ask the user for anything not provided:

| Input                | Example                   | Notes                                                        |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| **Story ID**         | `progress-linearprogress` | The component's Storybook ID prefix (without `--story-name`) |
| **Output directory** | `.` (project root)        | Where to save the PNG files                                  |
| **Filename prefix**  | `linear-progress-docs`    | Files will be named `{prefix}-{theme}.png`                   |
| **Viewport width**   | `1280`                    | CSS pixel width (default: 1280)                              |

## Theme identifiers

| Theme    | Global value | Description               |
| -------- | ------------ | ------------------------- |
| Light    | `light`      | Standard light theme      |
| Dark     | `dark`       | Standard dark theme       |
| HC Light | `hc-light`   | High-contrast light theme |
| HC Dark  | `hc-dark`    | High-contrast dark theme  |

## Procedure

### 1. Verify prerequisites

```bash
lsof -i :6006 | head -3   # Storybook running?
```

### 2. Capture full-page screenshots for each theme

The Docs page must be loaded via the **iframe URL directly** (not the Storybook shell), because `fullPage: true` only captures the scrollable area of the navigated page. When using the Storybook shell, the Docs content is inside an iframe and `fullPage` only expands the outer frame.

**Docs iframe URL pattern:**

```
http://localhost:6006/iframe.html?id={STORY_ID}--docs&viewMode=docs&globals=theme:{THEME}
```

For each theme, use a `browser_run_code_unsafe` call:

```javascript
async page => {
  await page.goto('http://localhost:6006/iframe.html?id={STORY_ID}--docs&viewMode=docs&globals=theme:{THEME}', {
    waitUntil: 'networkidle',
  });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: { WIDTH },
    height: 800,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // Scroll to bottom and back to trigger lazy-loaded story previews
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: '{OUTPUT_DIR}/{PREFIX}-{THEME}.png',
    type: 'png',
    fullPage: true,
  });

  return 'Captured full-page screenshot';
};
```

### 3. Verify output

Read each screenshot to confirm all stories rendered:

```javascript
// Use the Read tool on each file to visually verify
{OUTPUT_DIR}/{PREFIX}-light.png
{OUTPUT_DIR}/{PREFIX}-dark.png
{OUTPUT_DIR}/{PREFIX}-hc-light.png
{OUTPUT_DIR}/{PREFIX}-hc-dark.png
```

Verify that the screenshot includes:

- Component title and description at the top
- Controls/args table
- All story previews (Basic, and any named stories)
- Code snippet toggles

### 4. Report results

List all produced files with their file sizes and image dimensions.

## Important notes

- **Must navigate to the iframe URL directly**, not the Storybook shell URL. The Storybook shell renders the Docs page inside an iframe, and `fullPage: true` does not capture cross-frame scrollable content.
- **Scroll to bottom first** to trigger lazy-loaded story previews. Without this, some stories may appear as blank placeholders.
- Wait at least 2000ms after scrolling to bottom for stories to render, then scroll back to top before capturing.
- The Docs page height varies depending on the number of stories - `fullPage: true` handles this automatically.
- The viewport height (800px) is only the initial viewport; `fullPage: true` expands to capture all content.
- The `hc-light` and `hc-dark` theme names use a hyphen, not camelCase.
- For very large Docs pages with many stories, you may need to increase the scroll wait time.
