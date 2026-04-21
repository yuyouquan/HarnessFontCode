# HarnessFontCode

> A React + qiankun micro-frontend template built on the **Harness Engineering** paradigm.
>
> Inspired by [deusyu/harness-engineering](https://github.com/deusyu/harness-engineering) — an adaptation of OpenAI's "humans steer, agents execute" model for a real frontend codebase.

## What is this?

This repo is a demo of how to apply **Harness Engineering** principles to a React frontend project so that both human developers and AI agents (Claude Code, Cursor, GitHub Copilot, Codex) can ship features fast without drowning in mistakes.

The 5-layer constraint system:

| Layer | Tool | When it runs | What it catches |
|---|---|---|---|
| **L1** | ESLint custom rules | IDE realtime + `yarn lint` | Single-file violations (banned imports, naming, missing `makeObservable`) |
| **L2** | husky + lint-staged | `git commit` | Same as L1, blocks bad commits |
| **L3** | Jest structure tests | CI (on PR) | Cross-file invariants (every page must be registered, i18n keys must align) |
| **L4** | jscpd | CI (on PR) | Code duplication |
| **L5** | Entropy scan | Weekly scheduled | TODOs with age + dead code → surfaces as artifact |

## Documentation

- **[AGENTS.md](./AGENTS.md)** — navigation guide for AI agents (and humans)
- **[prompts/_HOW-TO-USE.md](./prompts/_HOW-TO-USE.md)** — one-minute guide on how to write prompts that fully leverage the template
- **[prompts/](./prompts/)** — reusable prompt templates for common tasks (add-page, add-service, add-store, add-component)
- **[src/pages/DeviceList/](./src/pages/DeviceList/)** — working CRUD example showing the template in action
- **[docs/superpowers/specs/](./docs/superpowers/specs/)** — full design spec
- **[docs/superpowers/plans/](./docs/superpowers/plans/)** — implementation plan

## Tech stack

- React 18 + craco
- qiankun (micro-frontend)
- MobX 6
- react-intl
- Antd v6
- Custom ESLint plugin (`tools/eslint-plugin-harness-local/`)

## Quick start

```bash
yarn install
yarn start:dev       # dev server
yarn ci:quality      # one-shot local check: lint + structure + duplication
```

Any violation of the custom rules will surface immediately in your IDE with a pointer to the relevant `AGENTS.md` section.

## License

MIT
