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

### Style Guide

- **No comments**: Do not add comments to code unless the logic is non-obvious due to product requirements or business rules that differ from what a developer would naturally expect.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->
