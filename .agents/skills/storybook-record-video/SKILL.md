---
name: storybook-record-video
description: >-
  Record MP4 videos of a Storybook component story in all four themes
  (light, dark, hc-light, hc-dark). Use when the user asks to record,
  capture, or grab a video of a Storybook story or component animation.
---

# Storybook: Record Story Videos

Record MP4 videos of a specific Storybook story across all four themes: light, dark, high-contrast light, and high-contrast dark. Produces GitHub-compatible H.264 MP4 files.

## Prerequisites

- Storybook dev server running on port 6006 (`pnpm --filter storybook dev`)
- `ffmpeg` available on the system PATH
- Playwright MCP server available (`mcp__plugin_playwright_playwright__*` tools)

## Required inputs

Ask the user for anything not provided:

| Input                | Example                          | Notes                                           |
| -------------------- | -------------------------------- | ----------------------------------------------- |
| **Story ID**         | `progress-linearprogress--basic` | The Storybook story ID (from the URL `?id=...`) |
| **Output directory** | `.` (project root)               | Where to save the MP4 files                     |
| **Filename prefix**  | `linear-progress-old`            | Files will be named `{prefix}-{theme}.mp4`      |
| **Duration**         | `20`                             | Recording duration in seconds (default: 20)     |
| **Viewport width**   | `800`                            | CSS pixel width (default: 800)                  |
| **Viewport height**  | `200`                            | CSS pixel height (default: 200)                 |

## Theme identifiers

The four Storybook themes and their URL global values:

| Theme    | Global value | Description               |
| -------- | ------------ | ------------------------- |
| Light    | `light`      | Standard light theme      |
| Dark     | `dark`       | Standard dark theme       |
| HC Light | `hc-light`   | High-contrast light theme |
| HC Dark  | `hc-dark`    | High-contrast dark theme  |

## Procedure

### 1. Verify prerequisites

```bash
lsof -i :6006 | head -3        # Storybook running?
which ffmpeg                     # ffmpeg available?
```

### 2. Record frames for each theme

For each theme in `[light, dark, hc-light, hc-dark]`, use a single `browser_run_code_unsafe` call that:

1. Navigates to the story iframe URL
2. Sets the viewport to the requested dimensions
3. Waits 500ms for the story to render
4. Captures PNG frames at ~60fps (16ms interval) for the requested duration
5. Saves frames to a temp directory

**Story iframe URL pattern:**

```
http://localhost:6006/iframe.html?id={STORY_ID}&viewMode=story&globals=theme:{THEME}
```

**Frame capture code pattern:**

```javascript
async page => {
  await page.goto('http://localhost:6006/iframe.html?id={STORY_ID}&viewMode=story&globals=theme:{THEME}', {
    waitUntil: 'networkidle',
  });
  await page.setViewportSize({ width: { WIDTH }, height: { HEIGHT } });
  await page.waitForTimeout(500);

  const dir = `${process.env['TMPDIR'] ?? '/tmp'}/sb-video-{THEME}`;
  const totalMs = { DURATION } * 1000;
  const interval = 16; // ~60fps
  const count = Math.floor(totalMs / interval);

  for (let i = 0; i < count; i++) {
    await page.screenshot({
      path: `${dir}/frame-${String(i).padStart(5, '0')}.png`,
      type: 'png',
    });
    if (i < count - 1) {
      await page.waitForTimeout(interval);
    }
  }

  return `Saved ${count} frames to ${dir}`;
};
```

### 3. Encode MP4 with ffmpeg

For each theme, encode the frames into a GitHub-compatible MP4:

```bash
ffmpeg -y -framerate 60 \
  -i "${TMPDIR:-/tmp}/sb-video-{THEME}/frame-%05d.png" \
  -c:v libx264 -pix_fmt yuv420p \
  -movflags +faststart \
  {OUTPUT_DIR}/{PREFIX}-{THEME}.mp4
```

The `-movflags +faststart` flag is required for GitHub inline playback.

### 4. Verify and clean up

```bash
# Verify all four files
ffprobe -v quiet -show_entries stream=width,height,r_frame_rate,duration {OUTPUT_DIR}/{PREFIX}-light.mp4
ls -lh {OUTPUT_DIR}/{PREFIX}-*.mp4

# Clean up temp frames
rm -rf "${TMPDIR:-/tmp}/sb-video-light" "${TMPDIR:-/tmp}/sb-video-dark" "${TMPDIR:-/tmp}/sb-video-hc-light" "${TMPDIR:-/tmp}/sb-video-hc-dark"
```

### 5. Report results

List all produced files with their dimensions, framerate, duration, and file size.

## Important notes

- Create temp frame directories before recording: `mkdir -p "${TMPDIR:-/tmp}/sb-video-{THEME}"`
- This procedure uses Unix/macOS temp directory conventions; Windows is not supported
- Clean up temp directories after encoding
- Each `browser_run_code_unsafe` call is independent - global state does not persist between calls
- The Playwright MCP sandbox does not support `require()` or dynamic `import()` - use `page.screenshot({ path })` to write files
- Do NOT use CDP `Emulation.setDeviceMetricsOverride` for video - use `page.setViewportSize()` instead for correct frame dimensions
- If the component is not animated, a shorter duration (4-5 seconds) is sufficient
