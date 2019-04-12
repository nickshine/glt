# Contributing

Contributions are welcome! Help add tasks to `glt`!

## Commit Message Guidelines

This project follows the [Conventional Commits] specification to aid in
automated releases and change log generation.  [Commitlint] is enabled and ran
as a `commit-msg` hook to enforce the commit format. [Commitizen] can be used to
prompt through any requirements at commit time `npm run cm` (or `git cz` if
Commitizen is installed globally).

In short, if a commit will be fixing a bug, prefix the commit message with `fix:`

```bash
fix: my bug fix
```

If a commit will be adding a feature, prefix the commit message with `feat:`

```bash
feat: my new feature
```

Commits with `fix:` prefix will show up in the generated changelog as bullets
under the `Bug Fixes:` section, and `feat:` prefixed messages will show under
the `Features:` section. See the available [rules][commit-rules].


[conventional commits]:https://www.conventionalcommits.org/en/v1.0.0-beta.3/
[commitlint]:https://github.com/conventional-changelog/commitlint
[commitizen]:http://commitizen.github.io/cz-cli/
[commit-rules]:https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules
