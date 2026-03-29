# Changelog

## [0.2.0] - 2026-03-28

### Added
- Schema mode (`--schema`) for generating structured JSON objects from templates
- Nested schemas, parenthesized args, literal passthrough
- File-based schemas (`--schema schema.json`)
- `--locale` flag with 60+ locales
- `--ref-date` flag for deterministic date output
- `--describe` flag for module and method discovery (params, types, examples)
- Module-level descriptions in `--list` and `--describe`
- Guided error messages that suggest next actions
- Helpers module: `arrayElement`, `fake`, `fromRegExp`, `slugify`, `shuffle`, and more
- `--format ndjson` for streaming output
- `--version` flag
- CI workflow (test on PR/push)
- Release workflow (cross-platform binaries, GitHub releases, Homebrew)
- `/release` slash command for version management
- README with full usage documentation
- Project-specific CLAUDE.md

### Changed
- `--info` renamed to `--describe` (`--info` kept as hidden alias)
- `--list` now shows module descriptions in TTY mode, JSON when piped
- Error messages now guide users to relevant commands

### Fixed
- `serialize` crash on BigInt nested inside objects/arrays
- `--locale`/`--ref-date`/`--schema` silently eating next arg when value missing
- Schema parser accepting malformed parenthesized syntax

## [0.1.0] - 2026-03-27

### Added
- Core CLI: `faker module.method [args]` with JSON output
- 240 deterministic fixtures covering all 8 return types
- `--list`, `--count`, `--seed` flags
- Serialization for string, number, boolean, bigint, Date, Date[], number[], object
