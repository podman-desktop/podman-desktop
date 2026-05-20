---
name: storybook-screenshot-story
description: >-
  Capture HiDPI (retina, 2x) screenshots of a Storybook component story in all
  four themes (light, dark, hc-light, hc-dark). Use when the user asks to
  screenshot, capture, or grab an image of a Storybook story or component.
---

# Storybook: Screenshot Story (HiDPI)

Capture retina-quality (2x device scale factor) PNG screenshots of a specific Storybook story across all four themes: light, dark, high-contrast light, and high-contrast dark.

## Prerequisites

- Storybook dev server running on port 6006 (`pnpm --filter storybook dev`)
- Playwright MCP server available (`mcp__plugin_playwright_playwright__*` tools)

## Required inputs

Ask the user for anything not provided:

| Input                | Example                          | Notes                                           |
| -------------------- | -------------------------------- | ----------------------------------------------- |
| **Story ID**         | `progress-linearprogress--basic` | The Storybook story ID (from the URL `?id=...`) |
| **Output directory** | `.` (project root)               | Where to save the PNG files                     |
| **Filename prefix**  | `linear-progress`                | Files will be named `{prefix}-{theme}.png`      |
| **Viewport width**   | `800`                            | CSS pixel width (default: 800)                  |
| **Viewport height**  | `200`                            | CSS pixel height (default: 200)                 |

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

### 2. Capture screenshots for each theme

For each theme in `[light, dark, hc-light, hc-dark]`, use a `browser_run_code_unsafe` call. Multiple themes can be captured in a single call for efficiency.

**Story iframe URL pattern:**

```
http://localhost:6006/iframe.html?id={STORY_ID}&viewMode=story&globals=theme:{THEME}
```

**Screenshot code pattern (all four themes in one call):**

```javascript
async page => {
  const themes = ['light', 'dark', 'hc-light', 'hc-dark'];
  const outputDir = '{OUTPUT_DIR}';
  const prefix = '{PREFIX}';

  for (const theme of themes) {
    await page.goto(`http://localhost:6006/iframe.html?id={STORY_ID}&viewMode=story&globals=theme:${theme}`, {
      waitUntil: 'networkidle',
    });

    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: { WIDTH },
      height: { HEIGHT },
      deviceScaleFactor: 2,
      mobile: false,
    });

    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${outputDir}/${prefix}-${theme}.png`,
      type: 'png',
    });
  }

  return 'Captured all 4 themes';
};
```

### 3. Verify output

Read each screenshot to confirm correct theme rendering:

```javascript
// Use the Read tool on each file to visually verify
{OUTPUT_DIR}/{PREFIX}-light.png
{OUTPUT_DIR}/{PREFIX}-dark.png
{OUTPUT_DIR}/{PREFIX}-hc-light.png
{OUTPUT_DIR}/{PREFIX}-hc-dark.png
```

### 4. Report results

List all produced files with their file sizes.

## Important notes

- Use CDP `Emulation.setDeviceMetricsOverride` with `deviceScaleFactor: 2` for HiDPI output
- The output PNG dimensions will be at CSS pixel size (e.g., 800x200) but rendered at 2x quality internally
- For true 2x pixel dimensions in the file, use `page.screenshot({ scale: 'device' })` - however this may not work reliably with CDP emulation
- Wait at least 500ms after navigation for the story to fully render
- For animated components, the screenshot captures a single frame - use the `storybook-record-video` skill instead if animation matters
- The `hc-light` and `hc-dark` theme names use a hyphen, not camelCase
