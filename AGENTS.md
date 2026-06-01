# AGENTS.md

This guide is for future agents and maintainers working in this repository. It summarizes how the CLI is organized, how changes should be made, and which checks matter before handing work back.

## Project Overview

`table-printer-cli` is the command-line interface for `console-table-printer`. It publishes a `ctp` binary that accepts JSON row data from an input argument or stdin, optionally accepts table options as JSON, and prints a formatted table using the `console-table-printer` library.

The companion repositories are usually checked out next to this repo:

- `../console-table-printer`: the underlying rendering library and source of truth for table options.
- `../console-table-docu`: the Docusaurus documentation site, including CLI docs.

## Repository Map

- `index.ts`: CLI entry point and exported `runCLI` function. It configures Commander, reads package version metadata, handles `--input`, `--stdin`, and `--tableOptions`, and invokes the service.
- `src/service.ts`: parses and validates input/options, creates a `Table`, adds rows, and prints the table.
- `src/inputVerifier.ts`: JSON validation helpers for row input and table options.
- `test/readmeExamples/`: tests that exercise README-level examples.
- `test/infrastructuralTests/`: Jest discovery and `dist` package-shape tests.
- `index.test.ts`: CLI option handling tests with Commander and service mocks.
- `src/*.test.ts`: focused unit tests for validation and service behavior.
- `static-resources/`: README screenshots.
- `.github/workflows/`: CI coverage and semantic-release workflows.
- `PULL_REQUEST_TEMPLATE.md`: PR template used by maintainers.

## Development Commands

Use Yarn for this repository.

```bash
yarn
yarn build
yarn test
yarn lint
yarn format
```

Useful targeted checks:

```bash
yarn jest --config jestconfig.json index.test.ts
yarn jest --config jestconfig.json src/service.test.ts
yarn jest --config jestconfig.json test/readmeExamples
yarn jest --config jestconfig.json test/infrastructuralTests/jest-discovery.test.ts
yarn jest --config jestconfig.json test/infrastructuralTests/dist-contents.test.ts
npm pack
```

Notes:

- `yarn build` runs `tsc` and emits CommonJS JavaScript plus `.d.ts` files into `dist/`.
- The published binary is `ctp`, mapped in `package.json` to `dist/index.js`.
- `yarn test` uses `jestconfig.json` and enforces global 80% coverage thresholds.
- CI runs on Node 24 with `yarn install --frozen-lockfile`.
- `package.json` has a `setup` script that runs `npm install`, but normal repo work and CI use Yarn.

## Architecture Notes

The high-level flow is:

1. `index.ts` creates a Commander program in `runCLI`.
2. `--input` passes the input string directly to `printTableFromInp`.
3. `--stdin` reads file descriptor `0`, converts it to a string, and passes that to `printTableFromInp`.
4. `--tableOptions` is passed as a raw JSON string.
5. `src/service.ts` validates both JSON strings, parses them, constructs `new Table(options)`, adds each row, and calls `table.printTable()`.

Important behavior:

- Input must be a JSON array. Non-array JSON is rejected.
- Empty arrays are valid and still print an empty table.
- `tableOptions` only needs to be valid JSON; option semantics come from `console-table-printer`.
- The CLI entry point reads package version from `package.json`, first from the parent of `dist` for installed usage and then from the current directory for development.
- `runCLI` is exported so tests can call CLI behavior without spawning a process.
- The shebang in `index.ts` is required for the installed `ctp` binary.

## Working On Features

When adding or changing CLI behavior:

- Update Commander options in `index.ts`.
- Keep parsing/validation behavior in `src/inputVerifier.ts` or `src/service.ts`.
- Keep `console-table-printer` rendering behavior in the library repo. Do not reimplement table formatting here.
- Preserve `runCLI(argv = process.argv)` so tests and embedders can pass explicit arguments.
- Update README usage and screenshots when user-facing CLI behavior changes.
- Update docs in `../console-table-docu`, especially `docs/doc-cli-install-quick-start.md` and `docs/doc-cli-brew.md`, when CLI flags, examples, install steps, or behavior change.
- Check `../console-table-printer` when adding or documenting table options, because the CLI forwards those options directly to `new Table(options)`.

Prefer keeping the CLI thin. Its job is to collect input, validate JSON, pass options through, and delegate rendering to the library.

## Testing Guidance

Choose tests based on the change:

- CLI flags or argument routing: update `index.test.ts`.
- Input validation: update `src/inputVerifier.test.ts`.
- Table construction or option pass-through: update `src/service.test.ts`.
- README examples: update tests under `test/readmeExamples/`.
- Test discovery changes: update `test/infrastructuralTests/jest-discovery.test.ts` whenever adding, removing, or renaming test files.
- Build output or package-shape changes: update `test/infrastructuralTests/dist-contents.test.ts` and run `npm pack` if package contents are affected.

When adding a test file, add its path to the explicit `expectedFiles` list in `test/infrastructuralTests/jest-discovery.test.ts`.

Useful flow for CLI changes:

```bash
yarn build
yarn jest --config jestconfig.json index.test.ts src/service.test.ts src/inputVerifier.test.ts
yarn jest --config jestconfig.json test/infrastructuralTests
```

## Documentation Coordination

This repo has two documentation surfaces:

- `README.md`: npm/GitHub quick start and core CLI examples.
- `../console-table-docu`: deployed docs site for users.

When CLI behavior changes, update both if users need to discover the new behavior. Keep option names, help output, screenshots, and examples consistent across README, docs, tests, and the Commander configuration.

For visual changes, update screenshots in this repo's `static-resources/` and any corresponding docs-site images under `../console-table-docu/static/img/examples/`.

## Formatting And Style

- TypeScript is strict: `strict`, `strictNullChecks`, and `noImplicitAny` are enabled.
- Keep CLI logic small and explicit. Avoid hidden global state outside package-version detection.
- Preserve stdout/stderr intent in tests when changing error messages.
- Prefer readable fixture data in examples and tests. JSON should be compact enough for CLI usage but still obvious to reviewers.
- Do not add dependencies unless they are clearly justified; this package should stay lightweight.

## Packaging And Release

The package publishes only `dist` through the `files` field, excluding test artifacts. Standard metadata such as `package.json`, `README.md`, and `LICENSE` are included by npm.

Package-sensitive fields:

- `main`: `dist/index.js`
- `types`: `dist/index.d.ts`
- `bin.ctp`: `dist/index.js`
- `files`: `dist` with test exclusions

Releases are handled by semantic-release on `main` and `master`. The release workflow builds the package and publishes through npm provenance.

## Common Pitfalls

- Forgetting the shebang in `index.ts` can break the installed binary.
- Changing CLI option names requires updates in README, docs, tests, and help output expectations.
- `tableOptions` is JSON passed through to `console-table-printer`; validate syntax here, but document semantics from the library.
- `fs.readFileSync(0)` is how stdin is read. Keep this behavior testable.
- Adding tests without updating the Jest discovery expected list will fail infrastructure tests.
- Package-shape changes can pass source tests while breaking npm consumers.

## Before Finishing A Change

For documentation-only changes, inspect the Markdown and update docs-site references when applicable.

For code changes, usually run:

```bash
yarn build
yarn test
yarn lint
```

For package-shape or binary-entry changes, also run:

```bash
npm pack
```

If tests are not run, say so in the handoff and identify the highest-risk unchecked area.
