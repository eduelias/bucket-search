# Contributing to bucket-search

Thanks for your interest in improving the project! This document explains how
to get set up and what we expect from contributions.

## Ground rules

- Keep the package lean: `@aws-sdk/client-s3` is the only runtime dependency,
  and it should stay that way unless there is a very good reason.
- Everything a consumer might want to change should be an overridable method on
  `DefaultProject` / `SearchProjectInterface`, not a hard-coded behaviour.
- Public behaviour changes must update `README.md`.

## Development setup

```bash
git clone https://github.com/eduelias/bucket-search.git
cd bucket-search
nvm use          # picks up .nvmrc
yarn install     # a yarn.lock is committed; npm install also works
yarn build       # compiles to dist/ with declarations in dist/@types
```

- `yarn build` — clean compile with `tsc` (strict mode, `noEmitOnError`).
- `yarn lint` — formats `src/**/*.ts` in place with Prettier.

A Husky pre-commit hook runs `tsc && lint-staged` (Prettier on staged files),
so a commit that does not compile or is unformatted will be rejected locally.

## Making changes

1. Create a branch: `git checkout -b feat/short-description`.
2. Make your change; `yarn build` must pass with zero errors.
3. Run `yarn lint` so the diff is Prettier-clean.
4. Keep commits focused with a clear message.
5. Open a pull request against `main` and describe what changed and why.

There is no automated test suite yet — a contribution that adds one would be
very welcome. Until then, describe in your PR how you verified the change
(ideally against a real bucket, without pasting any bucket names or account
details you would not want public).

## Coding conventions

- TypeScript, strict mode — no `any` leaks (`noImplicitAny` is on).
- Follow the existing style: small focused methods, hooks over flags.
- Prettier settings live in `.prettierrc` (single quotes, semicolons,
  80-column lines); ESLint config in `.eslintrc`.
- New extension points belong on `SearchProjectInterface` with a safe default
  implementation in `DefaultProject`.

## Reporting bugs / requesting features

Open an issue at
[github.com/eduelias/bucket-search/issues](https://github.com/eduelias/bucket-search/issues).
Include your Node.js version, the package version, and steps to reproduce.
Never paste AWS credentials, account IDs, or private bucket names into issues.

## License

By contributing you agree that your contributions are licensed under the
project's [MIT license](LICENSE).
