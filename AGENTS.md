# Project Instructions

## Maintaining This File

After completing a task, review the conversation for corrections, feedback, or patterns the user pointed out. Distill those into concise, general pointers in the relevant section below. The goal is to prevent future agents from repeating the same mistakes.

- **Do add**: Architectural patterns, conventions, common pitfalls, and how things connect (e.g. which layout provides what context). Keep entries general enough that they won't go stale when files move or rename.
- **Don't add**: File-specific implementation details, temporary workarounds, or anything that duplicates skill/doc content. If a skill already covers it, don't repeat it here.
- **Keep it short**: Each entry should be 1-2 sentences. If it needs more, it belongs in a skill or a memory file instead.

## Agent Rules

DO NOT run the dev server or any database altering CLIs. Do as much as you can, and then provide instructions to the user of what needs to be done prior to running the dev server. Only run the commands if you have explicit permission from the user to execute them.

- **Better Auth upgrades**: When upgrading `better-auth`, check the `@convex-dev/better-auth` peer dependency range at the same time; those two packages do not move independently.
- **Props style**: Do not add `readonly` to routine component prop types unless the user explicitly asks for it.
- **WorkOS entry points**: Keep sign-in and sign-up as distinct AuthKit entry routes/URLs; funneling both through sign-in confuses the intended WorkOS flows.
- **WorkOS callback redirects**: In local dev, redirect users back to the public portless app base URL, not the raw Vite `127.0.0.1` port that may receive the callback internally.
- **WorkOS sign-out**: For client-initiated logout in TanStack Start, use AuthKit's client `signOut()` flow rather than navigating to a loader that calls server `signOut()`, or the redirect can run through `_serverFn` fetch and fail on CORS.
- **SSR pending UI**: Avoid setting TanStack Router's global `defaultPendingMs` to `0`; it can replace server-rendered HTML with a spinner during short hydration/auth revalidation work.
- **Shared env vars**: If a value is needed by both client and server code, define it explicitly in `src/lib/config/client.ts` with a `VITE_` name and use that public name at shared entry points; do not rely on server-env proxies or implicit package fallbacks.
- **App URL config**: Use the canonical `appUrl` config for the app base URL unless the browser truly needs a runtime env value; do not mirror it as a separate `VITE_APP_URL`.
- **Docs source of truth**: For framework/auth/backend audits, verify against current official docs and upstream repos; local skills can be stale.
- **Placeholder names**: Leave the existing TODO/TOD project placeholder naming alone unless the user explicitly asks to rename it.
- **PostHog setup**: Prefer direct PostHog SDK calls over local analytics abstraction layers. Use hosted PostHog defaults unless self-hosting is explicitly required; Convex logs/errors should be configured through Convex dashboard integrations, while `@posthog/convex` is for backend events and flags.
- **TanStack pathless routes**: Remove pathless layout routes when their children are removed; an empty pathless layout can conflict with the real index route.

### Style Guide

- **No comments**: Do not add comments to code unless the logic is non-obvious due to product requirements or business rules that differ from what a developer would naturally expect.
- **Small helpers**: Avoid extracting one-off helpers for tiny transforms when the call site remains clear inline.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->
