# Getting Started

## Installation

### Homebrew (recommended)

```bash
brew install zcaceres/tap/faker-cli
```

### Pre-built binary

Download the latest binary for your platform from the [Releases](/releases) page. Then make it executable and move it to your PATH:

```bash
chmod +x faker-darwin-arm64
sudo mv faker-darwin-arm64 /usr/local/bin/faker
```

On macOS, you'll need to remove the quarantine flag since the binary isn't signed:

```bash
xattr -d com.apple.quarantine /usr/local/bin/faker
```

### From source

Requires [Bun](https://bun.sh) runtime.

```bash
git clone https://github.com/zcaceres/faker-cli.git
cd faker-cli && bun install
```

When running from source, use `bun run src/cli.ts` instead of `faker` in the examples below.

Verify the installation:

```bash
faker --help
```

## First Commands

Every command follows the same pattern: `faker module.method [args] [flags]`

### Generate a name

```bash
$ faker person.firstName
"Alice"
```

### Pass arguments as JSON

```bash
$ faker number.int '{"min":1,"max":100}'
73
```

### Generate structured objects with --schema

```bash
$ faker --schema '{"name":"person.fullName","email":"internet.email"}'
{"name":"Heather Padberg","email":"Heather_Padberg@yahoo.com"}
```

### Batch generate as NDJSON

```bash
$ faker person.firstName --count 3 --format ndjson
"Alice"
"Bob"
"Charlie"
```

## Discover What's Available

No external docs needed. faker-cli can describe itself.

### List all modules

```bash
$ faker --list
["airline","animal","book","color","commerce","company","database",
 "datatype","date","finance","food","git","hacker","helpers","image",
 "internet","location","lorem","music","number","person","phone",
 "science","string","system","vehicle","word"]
```

### Describe a method

```bash
$ faker --describe number.int
number.int(options?)
  Returns a single random integer between zero and the given max value
  or the given range.

  options (optional): number | { min?, max?, multipleOf? }
  Returns: number
```

### Describe a module

```bash
$ faker --describe person
person — Names, genders, bios, job titles, prefixes, and suffixes

  firstName, lastName, fullName, middleName, gender, sex, ...
```
