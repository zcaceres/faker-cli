# faker-cli

Agent-friendly CLI for generating fake data. Wraps [@faker-js/faker](https://fakerjs.dev/) with JSON output, schema templates, 60+ locales, and built-in discoverability.

**[Documentation](https://faker-cli.zach.dev)** | **[Releases](https://faker-cli.zach.dev/releases)**

## Install

### Homebrew (macOS / Linux)

```bash
brew install zcaceres/tap/faker-cli
```

### Download binary

Standalone binaries for macOS, Linux, and Windows are available on the [releases page](https://github.com/zcaceres/faker-cli/releases).

### From source

```bash
git clone https://github.com/zcaceres/faker-cli.git
cd faker-cli && bun install
bun run cli person.firstName
```

## Usage

```bash
# Generate a single value
faker person.firstName              # "Tyler"
faker number.int '{"min":1,"max":100}'  # 42
faker airline.airline               # {"name":"Alitalia","iataCode":"AZ"}

# Generate structured objects with schema templates
faker --schema '{"name":"person.fullName","email":"internet.email","age":"number.int({\"min\":18,\"max\":65})"}'
# {"name":"Mohammad Crist","email":"Maybelle.Sipes-Effertz18@gmail.com","age":43}

# Batch generation
faker person.fullName --count 5
# ["Mohammad Crist","Laury Aufderhar PhD","Claudia Leffler","Eddie Conn","Presley Boyle"]

# NDJSON output (one value per line)
faker --schema '{"name":"person.fullName","city":"location.city"}' --count 3 --format ndjson
# {"name":"Mohammad Crist","city":"Port Aidaworth"}
# {"name":"Clinton Gutmann","city":"Brionnaboro"}
# {"name":"Pearl Larkin","city":"New Traceyworth"}

# Deterministic output
faker person.fullName --seed 42                                    # "Mohammad Crist"
faker date.past --seed 42 --ref-date 2025-01-01T00:00:00.000Z     # "2024-05-17T16:58:16.813Z"

# Locales
faker person.firstName --locale de --seed 42    # "Melinda"
faker person.firstName --locale ja --seed 42    # "結衣"

# Helpers module
faker helpers.fake "{{person.firstName}} from {{location.city}}"
faker helpers.arrayElement '["cat","dog","mouse"]'
faker helpers.fromRegExp "[A-Z]{5}"
```

## Discoverability

```bash
# List all modules
faker --list

# List methods in a module
faker --list person

# Describe a module (all methods with signatures and descriptions)
faker --describe person

# Describe a method (params, types, return type, examples)
faker --describe number.int
```

Example `--describe` output:

```
number.int(options?)
  Returns a single random integer between zero and the given max value or the given range.

  options (optional): number | { min?: number; max?: number; multipleOf?: number; }

  Returns: number

  Examples:
    faker number.int  # 2900970162509863
    faker number.int 100  # 52
    faker number.int '{ min: 1000000 }'  # 2900970162509863
```

## Schema mode

Generate structured objects from JSON templates. String values matching `module.method` are resolved; everything else passes through as a literal.

```bash
# Inline JSON
faker --schema '{"name":"person.fullName","email":"internet.email","type":"employee","active":true}'

# From file
faker --schema schema.json

# With count, locale, seed
faker --schema '{"name":"person.fullName"}' --count 10 --locale de --seed 42

# Methods with arguments use parenthesized syntax
faker --schema '{"age":"number.int({\"min\":18,\"max\":65})"}'

# Nested objects
faker --schema '{"user":{"name":"person.fullName","address":{"city":"location.city","zip":"location.zipCode"}}}'
```

## Options

| Flag | Short | Description |
|---|---|---|
| `--describe TARGET` | | Describe a module or method |
| `--list [MODULE]` | `-l` | List module or method names |
| `--count N` | `-n` | Generate N values |
| `--seed N` | `-s` | Set seed for reproducible output |
| `--locale L` | `-L` | Locale code (e.g. `de`, `en_US`, `ja`) |
| `--ref-date DATE` | | Reference date for date methods (ISO 8601) |
| `--schema JSON\|FILE` | | Generate structured object from template |
| `--format FMT` | `-f` | Output format: `json` (default), `ndjson` |
| `--version` | `-v` | Show version |
| `--help` | `-h` | Show help |

## Output

All output is valid JSON to stdout. Errors go to stderr with a non-zero exit code.

- Strings: `"Tyler"`
- Numbers: `42`
- Booleans: `true`
- Dates: `"2024-05-17T16:58:16.813Z"` (ISO 8601)
- Objects: `{"name":"Vietnam Airlines","iataCode":"VN"}`
- Arrays: `[0.93,0.31,0.18,0.2]`
- BigInt: `"312559676790126"` (serialized as string)

## License

MIT
