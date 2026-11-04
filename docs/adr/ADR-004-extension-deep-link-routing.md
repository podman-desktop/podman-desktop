---
status: 'proposed'
date: 2026-11-04
decision-makers: domain/extensibility, domain/foundations
consulted: domain/documentation, domain/ui-components, domain/qe
---

# ADR-004: Let extensions receive external `podman-desktop:` links through opt-in navigation routes

## Context and Problem Statement

Podman Desktop registers the `podman-desktop:` URL scheme with the operating system, but its handler understands only two fixed forms: `podman-desktop:extension/<id>` (opens an extension's page so the user can install it) and `podman-desktop:experimental`. Any other URL is dropped with a log line.

Third parties now want to start an action inside an installed extension from a web page. The concrete case is Hugging Face's "Use this model → Local apps" menu: a local app is described there either by a _deeplink_ (a URL opened by the app) or by a _snippet_ (a shell command). Podman AI Lab has no CLI, so only a deeplink can work, and it has to land on a page of the AI Lab extension (import a given model, optionally a given file). The same need was already raised generically in [podman-desktop#17014](https://github.com/podman-desktop/podman-desktop/issues/17014) (OAuth-style callbacks, deep-linking into extension views).

The decision is needed now because:

- the URL becomes a public contract as soon as it is embedded in a third-party site, and Podman Desktop would have to accept it indefinitely;
- the capability exposes the application to input from **any** web page, so security behaviour has to be fixed before the first consumer exists;
- the consumer (Hugging Face) is a separate organisation with its own release process, so a later change of the format is expensive.

Question: how should an external link be routed to an extension, and what must the application guarantee before an extension acts on it?

## Decision Drivers

- **D1 – Safety by default.** A link can be crafted by anyone; nothing may start (especially multi-gigabyte downloads) without explicit user consent. Extensions that did not ask for this must not become reachable.
- **D2 – Stable, small public contract.** Format of the URL and the shape of the extension API are hard to change once published; they should be minimal and extensible.
- **D3 – Works when the extension is missing.** The link must carry enough information for the application to offer installing the right extension and then continue.
- **D4 – Reuse of existing mechanisms.** Extensions already register navigation routes (`navigation.register`); route keys are already namespaced by extension id (`<extensionId>.<routeId>`). Not verified outside the reading of `extension-loader.ts`: whether other consumers rely on the exact key form.
- **D5 – Cross-platform behaviour.** macOS delivers URLs through `open-url`; Windows and Linux through process arguments. Current code handles Windows only when an instance is already running. Not verified on a running system: Windows cold start, Linux (including Flatpak desktop-entry).
- **D6 – Graceful degradation on old versions.** Older Podman Desktop builds will silently ignore the new link. The design must not require them to change and must let producers mitigate.
- **D7 – Compatibility with a future generic handler (#17014).** The choice must not block `registerUriHandler`-style extensibility.
- **D8 – Cost of change across teams.** Podman Desktop core, the extension, and Hugging Face release independently.

## Considered Options

1. **Opt-in navigation routes exposed as `podman-desktop:navigate/<extensionId>/<routeId>?<query>`** — core validates, asks the user, then runs the route's command.
2. **Generic URI handler API** (`registerUriHandler`, VS Code style, [#17014](https://github.com/podman-desktop/podman-desktop/issues/17014)) — the extension receives the raw URI and decides everything.
3. **Expose every registered navigation route automatically** (no opt-in) — same URL as option 1 but without a flag.
4. **Hard-code an AI Lab-specific branch in the protocol handler** — a new `else if` in core.
5. **Each extension registers its own OS-level URL scheme** (for example `ai-lab:`).
6. **Local HTTP endpoint exposed by the extension** — web page calls `http://localhost:<port>/…`.
7. **Command-line snippet only** (the Hugging Face _snippet_ form).
8. **Status quo: documentation for manual import** — no link integration.
9. **HTTPS landing page that redirects to the deep link** (complement to option 1 rather than a replacement; evaluated separately because reviewers are likely to ask).

## Decision Outcome

Chosen option: **"Opt-in navigation routes exposed as `podman-desktop:navigate/<extensionId>/<routeId>`" (option 1)**, because it is the only option that satisfies D1 and D3 together (core-enforced consent, and the id of the extension is in the URL) while adding the smallest public API surface (D2) on top of an existing mechanism (D4). It does not prevent a later generic handler (D7). Option 9 is adopted as an optional **complement** for the Hugging Face case, subject to agreement with the website maintainers; it is not part of the core contract.

### Contract (normative for implementation)

**URL**

```
podman-desktop:navigate/<extensionId>/<routeId>[?<key>=<value>[&<key>=<value>…]]
podman-desktop://navigate/…   (accepted and normalised to the form above)
```

- `<extensionId>` is the extension id (`publisher.name`); `<routeId>` is the value the extension passed to `navigation.register` (without the extension prefix). The core builds the registry key as `<extensionId>.<routeId>`.
- Query is `application/x-www-form-urlencoded`; all values are strings; fragment is ignored.
- Reserved leading segments: `extension`, `experimental`, `navigate`. All other leading segments are reserved for future use and rejected.
- Proposed limits (to be confirmed in review): URL ≤ 2048 characters, ≤ 16 parameters, value ≤ 512 characters, no control characters, no duplicate keys, only parameters declared by the route.

**Extension API (additive)**

```ts
navigation.register(
  routeId: string,
  commandId: string,
  searchEntry?: NavigationSearchEntry,
  options?: {
    deepLink?: {
      title: string;                                  // shown in the confirmation dialog
      parameters?: Record<string, { description: string; required?: boolean }>;
    };
  },
): Disposable;
```

A route is reachable from a link only if `deepLink` is present. The command receives exactly one argument: `Readonly<Record<string, string>>`. Parameters are untrusted input and the extension must validate them again.

**Behaviour of the application (observable contract)**

1. Invalid link (syntax, limits, unknown/undeclared parameters) → the user is informed; nothing runs; parameter values are not written to logs or telemetry.
2. Extension not installed → the user is offered to install it (existing extension page flow); the link is kept in memory for a limited time and resumed after the extension starts. Automatic installation without the user's click is **not** introduced.
3. Extension installed but not running, or route not registered/not opted in → the user is told that the extension (version) cannot handle the link and, when an update is available, can open the update.
4. Valid link and available route → a **confirmation dialog owned by core** shows: that the request comes from an external link, the extension's display name and id, the route `title`, and the parameter names and values as plain text. Default focus is Cancel. The command runs only after explicit confirmation. There is no "remember my choice" in the first iteration.
5. Links are processed one at a time; the queue is bounded.
6. Extensions must not perform irreversible or expensive actions (for example downloads) as a direct result of the command; the user must perform an additional explicit action in the extension's own UI.

### Consequences

- Good, because any extension can be reached from the web without gaining a way to bypass user consent; consent and validation live in one place (core).
- Good, because the public API change is a single optional argument and two small types, and old extensions are unaffected.
- Good, because the extension id in the URL makes the "extension missing" scenario implementable and removes route-name collisions between extensions.
- Good, because the route key scheme already exists, so no second registry is needed.
- Neutral, because the existing `extension/<id>` and `experimental` links keep their behaviour.
- Bad, because the URL format becomes a long-lived public contract: Podman Desktop must accept it indefinitely, even if a generic handler later replaces the implementation.
- Bad, because there are two consent steps in the common case (core dialog and the extension's own action), which adds friction.
- Bad, because string-only parameters and one action per route do not cover generic callback flows such as OAuth redirects (#17014 remains partly open).
- Bad, because older Podman Desktop versions silently ignore the link; the producer (Hugging Face button) cannot know the installed version.
- Bad, because platform gaps (Linux handling, Windows cold start) must be fixed or documented as limitations; otherwise "one click" is not true everywhere.
- New obligations: maintain the URL grammar and limits as a public contract; document it for extension authors (`website/docs/extensions/`); keep the security guidance current; provide a migration path if the format is ever superseded (keep accepting the old one); UX ownership of the dialog; telemetry for outcome only.

### Confirmation

Compliance with this decision is checked by:

- **Unit tests** (required in the implementing PRs): URL parsing table tests (valid, invalid, boundary, both `:` and `://` forms, Windows argument shape); dispatcher tests for every state (not installed, stopped, route missing, not opted in, valid, cancel, confirm, queue limit, pending-link expiry); a test proving the extension command is **not** invoked without confirmation; a test proving routes registered without `deepLink` are not reachable.
- **E2E test** (Playwright): emulated `open-url` for a fixture extension with an opted-in route; asserts dialog content, Cancel (no command), Continue (command called once with expected parameters).
- **Review checklist** for any new `deepLink` route: parameters declared and validated by the extension; no irreversible action without in-extension confirmation; `title` understandable without context; documented in the extension's docs.
- **Documentation check**: the extension docs page lists the URL grammar, limits, and platform support table.
- **Manual platform matrix** before the first consumer ships: macOS, Windows, Linux (Flatpak), each with the application running and not running. Results are recorded in the PR; unsupported cells are documented, not hidden.
- **Linting**: no dedicated lint rule is proposed (the contract is behavioural); the existing type checks cover the API shape. _Not verified_: whether an API-extractor-style compatibility check exists for `@podman-desktop/api`.

## Pros and Cons of the Options

### Option 1 – Opt-in navigation routes at `podman-desktop:navigate/<extensionId>/<routeId>`

Core parses the link, checks the extension and the opted-in route, validates parameters against a declared schema, asks the user, then runs the route's command with the parameters.

- Good, because consent and validation are enforced by core independently of extension code (D1).
- Good, because the extension id is in the URL (D3) and routes are already namespaced (D4).
- Good, because the API addition is minimal and backward compatible (D2).
- Good, because it can later coexist with a generic handler as one built-in "verb" (D7).
- Neutral, because it covers "open something with a few string arguments" only.
- Bad, because the parameter schema and limits are a new contract to maintain.
- Bad, because the URL contract is long-lived (D8).

### Option 2 – Generic URI handler (`registerUriHandler`)

The extension registers a handler; links of the form `podman-desktop://<extensionId>/<path>?<query>` are delivered to it as a parsed URI (as proposed in #17014).

- Good, because it supports arbitrary paths and flows such as OAuth callbacks.
- Good, because it mirrors a well-known API in other editors, which lowers the learning curve.
- Neutral, because core could still show a generic confirmation, but cannot describe the action since it does not know what the handler will do (unless the API also asks for a description).
- Bad, because validation and safety move into every extension; one careless handler is enough for a drive-by action.
- Bad, because the first-segment namespace mixes built-in verbs with extension ids (rule "ids contain a dot" is subtle).
- Bad, because the API surface and semantics (lifecycle, activation order, multiple handlers) need a larger design discussion than this feature warrants.
- Not verified: how much of the #17014 author's intended design is already agreed.

### Option 3 – Expose every registered navigation route automatically

Same URL as option 1, but every `navigation.register` call becomes reachable.

- Good, because no API change and no extension changes.
- Bad, because existing routes were designed for internal use (for example AI Lab's `recipe.start` takes a recipe id and a tracking id) and become callable by any web page (violates D1).
- Bad, because tightening this later (opt-in) would break extensions that started relying on it.

### Option 4 – Hard-code an AI Lab branch in core

A new `else if` for `ai-lab` in the protocol handler that sends a dedicated IPC message.

- Good, because the smallest code change for the first consumer.
- Bad, because core now knows about one extension; every next extension needs a core release.
- Bad, because the consent and install-then-continue logic would be duplicated per case.
- Bad, because it is the pattern #17014 explicitly calls non-scalable.

### Option 5 – Extension registers its own OS-level URL scheme

For example `ai-lab:` opened by the OS and routed to the extension.

- Good, because the link is independent of Podman Desktop's own grammar.
- Bad, because extensions run inside Podman Desktop; the OS handler would still have to be Podman Desktop, and registering arbitrary schemes needs core support, installer changes and per-platform work.
- Bad, because multiple applications may claim the same scheme (no ownership guarantees).
- Bad, because there is no common consent point.

### Option 6 – Local HTTP endpoint exposed by the extension

The web page calls `http://localhost:<port>/…` served by the extension.

- Good, because no OS protocol registration is involved.
- Bad, because a fixed port conflicts with other software and firewalls; a random port cannot be put in a static link.
- Bad, because it exposes a network listener reachable by any local process and any web page (CSRF/DNS-rebinding class risks).
- Bad, because there is no way to start the application if it is not running.

### Option 7 – Snippet only (copy-paste command)

Hugging Face shows a command; Podman AI Lab provides one.

- Good, because it requires nothing from the browser or the OS.
- Bad, because Podman AI Lab has no CLI; a command would have to be invented and shipped.
- Bad, because it loses the one-click experience that other local apps on the same menu provide.

### Option 8 – Status quo plus documentation

Document manual model import; no integration.

- Good, because zero engineering cost and zero new attack surface.
- Bad, because it does not address the request and leaves Podman AI Lab absent from a discovery surface used by competitors.

### Option 9 – HTTPS landing page that redirects to the deep link (complement)

Hugging Face points to an `https://` page on a Podman Desktop-owned site (https deeplinks already exist for other apps in the Hugging Face registry); the page tries to open the `podman-desktop:` link and shows installation/upgrade guidance if nothing happens.

- Good, because it gives a fallback for users without Podman Desktop or with a version that ignores the link (D6).
- Good, because the final link format can later change without a Hugging Face release.
- Neutral, because it does not replace the in-application contract of option 1.
- Bad, because it needs hosting and maintenance, and reliably detecting that the application did not open is not possible from a browser.
- Bad, because it adds a hop and a place where links can be spoofed or abused (open-redirect style) if not strictly allow-listed.
- Not verified: whether the website maintainers would host it.

## More Information

- Related: [podman-desktop#17014](https://github.com/podman-desktop/podman-desktop/issues/17014) (extensible protocol handler); [podman-desktop-extension-ai-lab#4690](https://github.com/containers/podman-desktop-extension-ai-lab/issues/4690) (the first consumer).
- Release dependency: the consumer-visible button works only on Podman Desktop versions that contain the implementation. Intended order: core release → AI Lab release → Hugging Face change merged last. Target Podman Desktop version: not determined (`main` is currently `1.31.0-next`).
- Security notes that implementers should treat as requirements: untrusted parameters; no logging of parameter values; bounded queue; plain-text rendering of values in the dialog; no automatic installation; possible administrative switch to disable external links (managed configuration) — _open question_, not decided here.
- Open questions for review: (a) whether the dialog is repeated after "install and continue"; (b) whether a "remember for this extension" option is acceptable later; (c) naming of the verb (`navigate`) and of the options object; (d) exact limits; (e) whether Linux and Windows cold-start fixes are part of the same delivery or a prerequisite; (f) policy for onboarding/first-run state.
