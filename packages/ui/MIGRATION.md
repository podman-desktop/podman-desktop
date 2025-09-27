# @podman-desktop/ui-svelte

## Version 1.22

- ([#14026](https://github.com/podman-desktop/podman-desktop/pull/14026))The `Tooltip` component has been migrated to Svelte 5. The `tip` prop remains unchanged for simple text tooltips. The `tip` slot has been replaced with `tipSnippet` snippet for complex HTML content. You can have a look at [this blog post](https://sveltekit.io/blog/snippets) to learn more about `slot` to `snippet` migration.

## Version 1.19

- ([#12559](https://github.com/podman-desktop/podman-desktop/pull/12559)) The `breadcrumbTitle` property has been removed from the `Page`, `FormPage`, and `DetailsPage` components. You can safely remove this `breadcrumbTitle` property from the calls to these components, as its value was not used.
- ([#12555](https://github.com/podman-desktop/podman-desktop/pull/12555)) The `NavPage` component now uses `snippet`s instead of `slot`s. You can have a look at [this blog post](https://sveltekit.io/blog/snippets) to learn more about `slot` to `snippet` migration.
- ([#12561](https://github.com/podman-desktop/podman-desktop/pull/12561)) The `Page` component now uses `snippet`s instead of `slot`s. You can have a look at [this blog post](https://sveltekit.io/blog/snippets) to learn more about `slot` to `snippet` migration.
