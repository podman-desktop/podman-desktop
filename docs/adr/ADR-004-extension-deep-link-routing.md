---
status: 'proposed'
date: 2026-11-05
decision-makers: domain/extensibility, domain/foundations
consulted: domain/documentation, domain/ui-components, domain/qe
---

# ADR-004: Let extensions receive external `podman-desktop:` links through a URI handler

## Context and Problem Statement

Podman Desktop registers the `podman-desktop:` URL scheme with the operating system, but its handler understands only two fixed forms: `podman-desktop:extension/<id>` (opens an extension's page so the user can install it) and `podman-desktop:experimental`. Any other URL is dropped with a log line.

Third parties now want to start an action inside an installed extension from a web page. The concrete case is Hugging Face's "Use this model → Local apps" menu: a local app is described there either by a _deeplink_ (a URL opened by the app) or by a _snippet_ (a shell command). Podman AI Lab has no CLI, so only a deeplink can work, and it has to land on a page of the AI Lab extension (import a given model, optionally a given file). The same need was already raised generically in [podman-desktop#17014](https://github.com/podman-desktop/podman-desktop/issues/17014) (OAuth-style callbacks, deep-linking into extension views), which proposes a VS Code-style `registerUriHandler`.

The decision is needed now because:

- the URL becomes a public contract as soon as it is embedded in a third-party site, and Podman Desktop would have to accept it indefinitely;
- the capability exposes the application to input from **any** web page, so security behaviour has to be fixed before the first consumer exists;
- the consumer (Hugging Face) is a separate organisation with its own release process, so a later change of the format is expensive.

Question: how should an external link be routed to an extension, and what must the application guarantee before an extension acts on it?

## Decision Drivers

- **D1 – Safety by default.** A link can be crafted by anyone. Extensions that did not ask for links must not become reachable, nothing reaches an extension without the user's consent, and nothing expensive (for example a multi-gigabyte download) starts as a direct result of a link.
- **D2 – Stable, small public contract.** The URL format and the extension API are hard to change once published; they should be minimal and extensible.
- **D3 – Works when the extension is missing.** The link must carry enough information for the application to offer installing the right extension and then continue.
- **D4 – Reuse of existing mechanisms and known patterns.** Prefer what Podman Desktop already has (extension ids, extension page, message box) and patterns extension authors already know.
- **D5 – Cross-platform behaviour.** macOS delivers URLs through `open-url`; Windows and Linux through process arguments. Current code handles Windows only when an instance is already running. Not verified on a running system: Windows cold start, Linux (including Flatpak desktop-entry).
- **D6 – Graceful degradation on old versions.** Older Podman Desktop builds will silently ignore the new link. The design must not require them to change and must let producers mitigate.
- **D7 – Generic enough for the next consumers (#17014).** OAuth-style callbacks and other flows should not need a second mechanism.
- **D8 – Cost of change across teams.** Podman Desktop core, the extension, and Hugging Face release independently.

## Considered Options

1. **Opt-in navigation routes exposed as `podman-desktop:navigate/<extensionId>/<routeId>?<query>`** — core validates a declared parameter schema, asks the user, then runs the route's command.
2. **URI handler per extension, mirroring VS Code `window.registerUriHandler`** — links `podman-desktop://<extensionId>/<path>?<query>` are delivered as a `Uri` to the handler the extension registered; core owns routing, consent, install-and-continue and buffering; the extension owns the meaning of path and query.
3. **Expose every registered navigation route automatically** (no opt-in) — same URL as option 1 but without a flag.
4. **Hard-code an AI Lab-specific branch in the protocol handler** — a new `else if` in core.
5. **Each extension registers its own OS-level URL scheme** (for example `ai-lab:`).
6. **Local HTTP endpoint exposed by the extension** — web page calls `http://localhost:<port>/…`.
7. **Command-line snippet only** (the Hugging Face _snippet_ form).
8. **Status quo: documentation for manual import** — no link integration.
9. **HTTPS landing page that redirects to the deep link** (complement to the chosen option rather than a replacement).
10. **Route the link to a command contributed by the extension** — the link names a command; the extension's command decides what to do.

## Decision Outcome

Chosen option: **"URI handler per extension, mirroring VS Code `window.registerUriHandler`" (option 2)**, because:

- it keeps the core contract minimal (D2): one function and one interface in the API, and a URL grammar that is "extension id + anything the extension defines"; core does not model routes or parameters, which was the main concern raised against option 1 in review;
- the extension id is the URI authority, so core knows which extension to offer for installation (D3) and can confirm with the user before the extension receives anything (D1);
- extension authors already know it from VS Code, and it is the design requested in #17014 (D4, D7);
- an extension that does not register a handler is not reachable (D1, opt-in at extension level).

Option 10 is not chosen; its principle ("the extension decides what to do") is kept, see its section. Option 1 is superseded. Option 9 remains an optional **complement** for the Hugging Face case, subject to agreement with the website maintainers; it is not part of the core contract.

### Contract (normative for implementation)

**URL**

```
<urlProtocol>://<extensionId>[/<path>][?<query>][#<fragment>]
```

- `<urlProtocol>` is the scheme the product registers with the operating system: `product.json` `urlProtocol`, which is `podman-desktop` in upstream builds. Downstream builds can use another value, so core must not hard-code `podman-desktop`, and extensions that build links (for example callback URLs) must use `env.urlProtocol`. Examples in this ADR use the upstream value.
- `<extensionId>` is the extension id (`publisher.name`) and is the URI authority. It is compared without case sensitivity.
- A link is directed to an extension only if the authority looks like an extension id (it contains a dot; same rule as VS Code: `^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$`, case-insensitive). Built-in forms (`extension`, `experimental`, `preferences/experimental`) keep their current syntax and behaviour. Future built-in verbs must not contain a dot.
- `<path>`, `<query>` and `<fragment>` are defined by the extension. Core does not interpret them.
- Core limit (to be confirmed in review): URL ≤ 2048 characters; control characters are rejected.
- Example (Podman AI Lab, defined by the extension, not by core): `podman-desktop://redhat.ai-lab/models/import/hf?model=bartowski%2FLlama-3.2-3B-Instruct-GGUF&file=Llama-3.2-3B-Instruct-Q4_K_M.gguf`

**Extension API (additive)**

```ts
export interface UriHandler {
  /** Handle a URI directed to this extension. The URI comes from outside the application and is untrusted input. */
  handleUri(uri: Uri): ProviderResult<void>;
}

export namespace window {
  /** Registers the URI handler of the calling extension. An extension can register only one handler; a second call throws. */
  export function registerUriHandler(handler: UriHandler): Disposable;
}
```

The handler is bound to the id of the calling extension by core; an extension cannot register for another id.

The `Uri` passed to `handleUri` has its components as the WHATWG `URL` parser returns them: `path`, `query` and `fragment` stay percent-encoded, `query` is given without `?` and `fragment` without `#`. Extensions parse the query with `URLSearchParams`.

**Behaviour of the application (observable contract)**

1. Invalid link (syntax, limits) → the user is informed; nothing runs; query and fragment are not written to logs or telemetry.
2. Extension not installed → a dialog owned by core states which extension the link is for (display name from the catalog when available, and id) and shows the link as plain text, with "Install and open" / Cancel. Accepting opens the existing extension page; the link is kept in memory for a limited time and delivered after the extension registers its handler, without a second confirmation: clicking "Install and open" in a dialog that shows the link counts as consent (as in VS Code, where the install dialog carries the link as justification). Automatic installation without the user's click on Install is **not** introduced. An extension that is not in the catalog cannot be installed from a link; the user is informed.
3. Extension installed but disabled, stopped or failed → the user is told, and can open the extension's page. Core does not start or enable it automatically.
4. Extension started but without a handler after all extensions have started → the user is told that this version of the extension cannot open links and, when an update is available, can open it.
5. Extension installed and its handler not registered yet (application or extension still starting) → the link is buffered until the handler is registered, for a limited time.
6. Before delivery, a **confirmation dialog owned by core** shows that the request comes from an external link, the extension's display name and id (from the installed manifest), and the link as plain text. Default focus is Cancel. The handler receives the URI only after explicit confirmation. There is no "do not ask again" in the first iteration.
7. Delivery calls `handleUri` once. Errors thrown by the handler are caught and logged without the query; core does not wait for long-running work.
8. Links are processed one at a time; buffers and the queue are bounded.
9. Extensions must validate the URI and must not perform irreversible or expensive actions (for example downloads) as a direct result of `handleUri`; the user must perform an additional explicit action in the extension's own UI.

### Consequences

- Good, because the public API change is one function and one interface, both known from VS Code; old extensions are unaffected.
- Good, because core keeps the decisions that must be uniform (which extension, consent, install-and-continue, buffering) and does not have to evolve for each new use case.
- Good, because the extension id in the URL makes the "extension missing" scenario implementable and removes collisions between extensions.
- Good, because it covers callback flows such as OAuth redirects (#17014) with the same mechanism.
- Neutral, because the existing `extension/<id>` and `experimental` links keep their behaviour.
- Bad, because the core dialog cannot describe the action; the user sees the extension and the link only. Safety against harmful actions depends on extensions following the obligations (behaviour 9), which core cannot enforce.
- Bad, because each extension's path and query become that extension's own public contract (for AI Lab, the import path and parameter names), which it must keep accepting.
- Bad, because there are two consent steps in the common case (core dialog and the extension's own action), which adds friction.
- Bad, because older Podman Desktop versions silently ignore the link; the producer (Hugging Face button) cannot know the installed version.
- Bad, because platform gaps (Linux handling, Windows cold start) must be fixed or documented as limitations; otherwise "one click" is not true everywhere.
- New obligations: maintain the URL grammar as a public contract; document the API and the security obligations for extension authors (`website/docs/extensions/`); UX ownership of the dialogs; telemetry for outcome only (extension id and outcome, no query); fix `Uri` fragment handling (`parse`/`toString` duplicate the `#`) before the API is released.

### Confirmation

Compliance with this decision is checked by:

- **Unit tests** (required in the implementing PRs): URL classification table tests (extension authority, built-in forms, invalid, limits, case of the id, Windows argument shape); dispatcher tests for every state (not installed, not in catalog, disabled, stopped, failed, no handler after start, handler registered later, buffer expiry, queue limit, cancel, confirm); a test proving `handleUri` is **not** called without confirmation; a test proving a second `registerUriHandler` from the same extension throws; a test proving a handler only receives URIs whose authority is its own id; `Uri` parse/`toString` round-trip including fragment.
- **E2E test** (Playwright): emulated `open-url` for a fixture extension with a handler; asserts dialog content, Cancel (handler not called), Open (handler called once with the expected URI).
- **Review checklist** for any extension that registers a handler: URI validated; no irreversible action without in-extension confirmation; supported paths and parameters documented in the extension's docs.
- **Documentation check**: the extension docs page describes the URL grammar, the API, the security obligations, and the platform support table.
- **Manual platform matrix** before the first consumer ships: macOS, Windows, Linux (Flatpak), each with the application running and not running. Results are recorded in the PR; unsupported cells are documented, not hidden.
- **Linting**: no dedicated lint rule is proposed; the existing type checks cover the API shape. _Not verified_: whether an API-extractor-style compatibility check exists for `@podman-desktop/api`.

## Pros and Cons of the Options

### Option 1 – Opt-in navigation routes at `podman-desktop:navigate/<extensionId>/<routeId>`

Core parses the link, checks the extension and the opted-in route (`navigation.register` with a `deepLink` option declaring a title and parameters), validates parameters against the declared schema, asks the user, then runs the route's command with the parameters.

- Good, because core can describe the action in the dialog (route title, parameter names and values).
- Good, because validation of parameter names and limits is done once in core.
- Good, because the extension id is in the URL (D3) and route keys are already namespaced by extension id.
- Bad, because core models routes and parameter schemas: a larger API and contract than needed (D2); reviewers considered it exposing too much.
- Bad, because string-only parameters and one action per route do not cover callback flows (D7); a second mechanism would follow.
- Bad, because the parameter schema and limits are a new contract to maintain, in addition to the URL.

### Option 2 – URI handler per extension (`window.registerUriHandler`)

Mirrors VS Code (`src/vs/workbench/services/extensions/browser/extensionUrlHandler.ts`, `src/vs/workbench/api/common/extHostUrls.ts`). The authority of the link is the extension id; core confirms with the user, installs-and-continues when the extension is missing, buffers links until the handler exists, then calls the handler with the `Uri`.

- Good, because the API is minimal and familiar (D2, D4), and matches #17014 (D7).
- Good, because core keeps uniform control over which extension receives the link and over consent (D1, D3).
- Good, because new use cases need no core change.
- Good, because Podman Desktop activates all enabled extensions at startup, so the "extension without handler" state can be reported precisely after startup (VS Code has to activate extensions on demand through the `onUri` activation event).
- Neutral, because Podman Desktop has no equivalent of VS Code's install command with a justification, nor a confirmation dialog with a checkbox; install-and-continue is built on the existing extension page, and "do not ask again" is postponed.
- Bad, because the dialog cannot describe the action and validation moves into every extension; one careless handler is enough for a harmful action (mitigated by behaviour 9 and the review checklist, not enforced).
- Bad, because the first-segment namespace mixes built-in verbs with extension ids; the "ids contain a dot" rule must be kept for future verbs.

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
- Neutral, because it does not replace the in-application contract of option 2.
- Bad, because it needs hosting and maintenance, and reliably detecting that the application did not open is not possible from a browser.
- Bad, because it adds a hop and a place where links can be spoofed or abused (open-redirect style) if not strictly allow-listed.
- Not verified: whether the website maintainers would host it.

### Option 10 – Route the link to a command contributed by the extension

The link names a command, for example `podman-desktop://<extensionId>/<commandId>?<query>`, and core executes that command with the link data; the command decides what to do.

- Good, because commands are the existing unit of action in Podman Desktop, and the extension fully decides what happens (no route or parameter model in core).
- Bad, because the command registry is one flat, global namespace: commands registered at runtime are not linked to the extension that registered them (`commands.registerCommand` in `extension-loader.ts` passes only the id and callback to `CommandRegistry`), so core cannot check that the command in the link belongs to the extension in the link without new ownership tracking.
- Bad, because the same registry holds core commands such as `openExternal` (opens an arbitrary URL) and `update`; without a separate opt-in per command, a web page could call them (violates D1). An opt-in per command is a new API or manifest flag, and overloading `contributes.commands` would couple it to the command palette.
- Bad, because every exposed command id becomes a public contract: renaming a command breaks published links.
- Bad, because a command can also be called internally with arbitrary arguments, so the command cannot tell trusted internal calls from external links unless the arguments carry that information.
- Neutral, because once restricted to "one opted-in entry point per extension that receives the link", it becomes option 2 with a less specific API.

## More Information

- Related: [podman-desktop#17014](https://github.com/podman-desktop/podman-desktop/issues/17014) (extensible protocol handler, items 1 and 3 are covered by this decision; item 2 — refactoring the built-in routes into the same registry — is an implementation choice, not required); [podman-desktop-extension-ai-lab#4690](https://github.com/containers/podman-desktop-extension-ai-lab/issues/4690) (the first consumer).
- Prior art: VS Code `window.registerUriHandler` and its core handler (`ExtensionUrlHandler`): authority = extension id, confirmation "Allow '…' extension to open this URI?", install with justification then delivery without a second dialog, buffering until the handler is registered (5 minutes), `onUri` activation event.
- Release dependency: the consumer-visible button works only on Podman Desktop versions that contain the implementation. Intended order: core release → AI Lab release → Hugging Face change merged last. Target Podman Desktop version: not determined (`main` is currently `1.31.0-next`).
- Hugging Face acceptance of a link that requires an installed extension is not known; the install-and-continue behaviour (behaviour 2) and option 9 are the answers to bring to the Hugging Face team.
- Security notes that implementers should treat as requirements: URIs are untrusted; no logging of query or fragment; bounded buffers and queue; plain-text rendering of the link in dialogs; no automatic installation or enabling; possible administrative switch to disable external links (managed configuration) — _open question_, not decided here.
- Open questions for review: (b) whether a "do not ask again for this extension" option (setting, lockable by managed configuration) is acceptable later; (c) whether the single-colon form `podman-desktop:<extensionId>/…` is accepted and normalised or rejected (proposed: only the `//` form); (d) exact limits and buffer duration; (e) whether Linux and Windows cold-start fixes are part of the same delivery or a prerequisite; (f) policy for onboarding/first-run state.
