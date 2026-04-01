# Usage

Schemas, output formats, locales, determinism, and self-discovery.

## Schema Mode

Define the shape you need as JSON. Every string value matching `module.method` is resolved to fake data. Everything else passes through as a literal.

### Inline schema

```bash
$ faker --schema '{"name":"person.fullName","email":"internet.email","age":"number.int({\"min\":18,\"max\":65})"}'
{"name":"Kristin Cronin","email":"Kristin@yahoo.com","age":34}
```

### File-based schema

```bash
$ faker --schema user.json --count 100
```

Create a `user.json` file with your template:

```json
{
  "name": "person.fullName",
  "email": "internet.email",
  "address": {
    "city": "location.city",
    "zip": "location.zipCode"
  },
  "role": "admin"
}
```

### Nested schemas with literals

Nested objects are recursed into. Non-matching strings pass through as literals:

```bash
$ faker --schema '{"user":{"name":"person.fullName","address":{"city":"location.city","zip":"location.zipCode"}},"role":"admin"}'
{"user":{"name":"Heather Padberg","address":{"city":"North Eula","zip":"17916"}},"role":"admin"}
```

### Parenthesized arguments

Pass arguments to methods using parenthesized syntax:

```bash
$ faker --schema '{"age":"number.int({\"min\":18,\"max\":65})","score":"number.float({\"min\":0,\"max\":100})"}'
{"age":34,"score":72.5}
```

## Output Formats

Three output formats via `--format`. JSON is the default.

### JSON (default)

```bash
$ faker person.firstName --count 3
["Alice","Bob","Charlie"]
```

### NDJSON

One value per line — ideal for streaming and piping:

```bash
$ faker person.firstName --count 3 --format ndjson
"Alice"
"Bob"
"Charlie"
```

### CSV

RFC 4180 compliant. Header row from object keys, proper escaping:

```bash
$ faker --schema '{"name":"person.fullName","email":"internet.email"}' --count 3 --format csv
name,email
Alice Smith,alice@example.com
Bob Jones,bob@example.com
Charlie Brown,charlie@example.com
```

## Locales & Determinism {#locales-determinism}

### Locale-specific data

Generate data in 60+ languages with `--locale`:

```bash
$ faker person.fullName --locale de
"Sieglinde Hartmann"

$ faker person.fullName --locale ja
"山田 太郎"

$ faker location.city --locale fr
"Paris"
```

### Reproducible output with --seed

Same seed produces identical output every time:

```bash
$ faker person.firstName --seed 42
"Mohammad"

$ faker person.firstName --seed 42
"Mohammad"
```

### Pin dates with --ref-date

Date methods use `Date.now()` by default. Pin them for reproducibility:

```bash
$ faker date.past --ref-date 2025-01-01T00:00:00.000Z --seed 42
"2024-06-15T08:23:41.000Z"
```

Combine `--seed` + `--ref-date` for fully deterministic date output.

## All Flags

| Flag | Description |
|---|---|
| `--schema JSON\|FILE` | Generate structured object from schema template |
| `--count N`, `-n N` | Generate N values (max 100,000) |
| `--seed N`, `-s N` | Set seed for reproducible output |
| `--locale L`, `-L L` | Locale code (e.g. de, en_US, ja). Default: en |
| `--ref-date DATE` | Reference date for date methods (ISO 8601) |
| `--format FMT`, `-f FMT` | Output format: json (default), ndjson, csv |
| `--describe TARGET` | Describe a module or method (params, types, examples) |
| `--list`, `-l` | List modules or methods within a module |
| `--version`, `-v` | Show version |
| `--help`, `-h` | Show this help |
