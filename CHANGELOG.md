# Changelog

## [0.1.0] - 2026-03-27

### Added
- Core CLI: `faker module.method [args]` with JSON output to stdout
- Schema mode: `--schema` for structured object generation from JSON templates
- 27 modules including helpers (arrayElement, fake, fromRegExp, slugify, etc.)
- `--describe` flag for method/module discovery with params, types, examples
- `--list` with TTY-aware formatting and module descriptions
- `--locale` support for 60+ locales
- `--seed` and `--ref-date` for fully deterministic output
- `--format ndjson` for streaming output
- `--count` for batch generation
- Guided error messages that suggest next actions
- 240 deterministic fixtures, 259-method metadata index
- 66 tests, 378 assertions
