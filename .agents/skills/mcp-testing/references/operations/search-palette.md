# Search & Command Palette Operations

## Navigation

| Target                  | Selector                    |
| ----------------------- | --------------------------- |
| Open palette (keyboard) | `press('F1')`               |
| Open palette (button)   | `click('[title="Search"]')` |

## Page Structure

### Command Palette

```
[aria-label="Command palette command input"]    ← search input
├── button matching /\bAll\b/                   ← tab: All (may include badge count)
├── button matching /\bCommands\b/              ← tab: Commands
├── button matching /\bDocumentation\b/         ← tab: Documentation
├── button matching /\bGo to\b/                 ← tab: Go to
└── li > button                                 ← result items
    └── li > button.selected                    ← currently selected item
```

## Locators

### CommandPalette

| Element       | Selector                                       |
| ------------- | ---------------------------------------------- |
| Input field   | `[aria-label="Command palette command input"]` |
| Clear button  | `[aria-label="clear"]`                         |
| Selected item | `li > button.selected`                         |
| Result items  | `li > button`                                  |

### Tabs

| Element           | Selector                                        |
| ----------------- | ----------------------------------------------- |
| All tab           | button with text matching `/\bAll\b/`           |
| Commands tab      | button with text matching `/\bCommands\b/`      |
| Documentation tab | button with text matching `/\bDocumentation\b/` |
| Go to tab         | button with text matching `/\bGo to\b/`         |

Use `evaluate` to click tabs since they use regex matching:

```
evaluate('Array.from(document.querySelectorAll("button")).find(b => /\\bAll\\b/.test(b.textContent))?.click()')
```

### Status

| Element    | Selector                                       |
| ---------- | ---------------------------------------------- |
| No results | text matching `/No results matching .+ found/` |

## Operations

### Open command palette

**Via keyboard:**

1. Press F1: `press('F1')`
2. Wait for input: `wait('[aria-label="Command palette command input"]')`

**Via button:**

1. Click Search: `click('[title="Search"]')`
2. Wait for input: `wait('[aria-label="Command palette command input"]')`

### Search for a command

1. Open command palette
2. Fill search: `fill('[aria-label="Command palette command input"]', '{searchTerm}')`
3. Wait for results: `wait('li > button')`

### Execute a command from palette

1. Search for command (steps 1-3)
2. Click result: `click('li > button.selected')` or find specific result by text

### Navigate to a page via palette

1. Open command palette
2. Switch to Go to tab:
   ```
   evaluate('Array.from(document.querySelectorAll("button")).find(b => /\\bGo to\\b/.test(b.textContent))?.click()')
   ```
3. Fill destination: `fill('[aria-label="Command palette command input"]', '{pageName}')`
4. Click result: `click('li > button.selected')`

### Switch palette tab

Use `evaluate` with regex matching:

```
evaluate('Array.from(document.querySelectorAll("button")).find(b => /\\b{TabName}\\b/.test(b.textContent))?.click()')
```

Replace `{TabName}` with: `All`, `Commands`, `Documentation`, or `Go to`

### Clear search

1. Click clear: `click('[aria-label="clear"]')`

### Close palette

1. Press Escape: `press('Escape')`

### Check for no results

```
evaluate('/No results matching .+ found/.test(document.body.textContent)')
```

### Get selected result text

```
getText('li > button.selected')
```

### Count results

```
evaluate('document.querySelectorAll("li > button").length')
```

## Gotchas

- Palette tabs use count badges (e.g., "All 42") — match with `/\bAll\b/` regex, not exact text
- F1 toggles the palette — pressing again closes it
- The palette overlays the current page — it doesn't navigate away
- Results update as you type — wait briefly after filling input before clicking
- The selected item (`.selected` class) changes with arrow key navigation
- Tab switching preserves the search text
