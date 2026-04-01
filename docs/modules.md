<script setup>
const modules = [
  { name: 'person', count: 15, desc: 'Names, genders, bios, job titles, prefixes, and suffixes', tags: ['firstName', 'lastName', 'fullName', 'jobTitle'] },
  { name: 'internet', count: 21, desc: 'Emails, URLs, usernames, passwords, IPs, and user agents', tags: ['email', 'url', 'username', 'ipv4'] },
  { name: 'location', count: 19, desc: 'Addresses, cities, countries, coordinates, zip codes, and time zones', tags: ['city', 'country', 'zipCode', 'latitude'] },
  { name: 'commerce', count: 9, desc: 'Product names, prices, descriptions, departments, materials, ISBN, and UPC', tags: ['productName', 'price', 'department'] },
  { name: 'date', count: 11, desc: 'Past, future, recent, soon, anytime, between, birthdate, months, weekdays, and time zones', tags: ['past', 'future', 'recent', 'between'] },
  { name: 'number', count: 7, desc: 'Integers, floats, binary, octal, and hex numbers with bounds', tags: ['int', 'float', 'bigInt', 'hex'] },
  { name: 'company', count: 9, desc: 'Company names, catch phrases, buzz phrases, and component words', tags: ['name', 'catchPhrase', 'buzzPhrase'] },
  { name: 'finance', count: 20, desc: 'Accounts, currencies, transactions, credit cards, BIC, IBAN, and bitcoin', tags: ['accountNumber', 'currency', 'iban'] },
  { name: 'helpers', count: 16, desc: 'Utility methods: array element, fake templates, regex, slugify, shuffle, mustache, and more', tags: ['arrayElement', 'fake', 'fromRegExp'] },
  { name: 'string', count: 12, desc: 'Random strings: alpha, alphanumeric, uuid, nanoid, ulid, hex, binary, octal, and more', tags: ['uuid', 'alphanumeric', 'nanoid'] },
  { name: 'lorem', count: 9, desc: 'Placeholder text: words, sentences, paragraphs, lines, slugs, and text blocks', tags: ['sentence', 'paragraph', 'words'] },
  { name: 'image', count: 7, desc: 'Random image URLs: avatars, nature, city, abstract, and custom dimensions', tags: ['avatar', 'url', 'urlLoremFlickr'] },
  { name: 'phone', count: 2, desc: 'Phone numbers and IMEI codes', tags: ['number', 'imei'] },
  { name: 'system', count: 12, desc: 'File names, paths, MIME types, extensions, semver, cron, and network interfaces', tags: ['fileName', 'mimeType', 'semver'] },
  { name: 'database', count: 5, desc: 'Column names, types, collations, engines, and MongoDB ObjectIds', tags: ['column', 'type', 'mongodbObjectId'] },
  { name: 'airline', count: 7, desc: 'Airlines, airports, airplanes, flight numbers, seats, and record locators', tags: ['airline', 'airport', 'flightNumber'] },
  { name: 'animal', count: 16, desc: 'Dogs, cats, birds, fish, snakes, bears, horses, and many more animal types', tags: ['dog', 'cat', 'bird', 'type'] },
  { name: 'color', count: 11, desc: 'Color names, hex, RGB, HSL, HWB, LAB, LCH, CMYK, and CSS color spaces', tags: ['human', 'rgb', 'hsl', 'cmyk'] },
  { name: 'food', count: 9, desc: 'Dishes, ingredients, spices, fruits, vegetables, meats, and descriptions', tags: ['dish', 'ingredient', 'fruit'] },
  { name: 'git', count: 5, desc: 'Branch names, commit entries, dates, messages, and short SHAs', tags: ['branch', 'commitMessage', 'commitSha'] },
  { name: 'hacker', count: 6, desc: 'Hacker-speak: abbreviations, adjectives, nouns, verbs, and phrases', tags: ['abbreviation', 'noun', 'phrase'] },
  { name: 'music', count: 4, desc: 'Song names, albums, artists, and music genres', tags: ['songName', 'artist', 'genre'] },
  { name: 'science', count: 2, desc: 'Chemical elements and units of measurement', tags: ['chemicalElement', 'unit'] },
  { name: 'vehicle', count: 9, desc: 'Vehicle names, manufacturers, models, types, VINs, colors, fuel, and bicycles', tags: ['vehicle', 'manufacturer', 'vin'] },
  { name: 'word', count: 9, desc: 'Random words: adjectives, adverbs, conjunctions, interjections, nouns, prepositions, verbs', tags: ['adjective', 'noun', 'verb', 'sample'] },
  { name: 'book', count: 6, desc: 'Book titles, authors, genres, publishers, and series', tags: ['title', 'author', 'genre'] },
  { name: 'datatype', count: 1, desc: 'Random boolean values with configurable probability', tags: ['boolean'] },
]
</script>

# Modules

27 modules, 259 methods. Run `faker --describe <module>` for full details.

<div class="module-grid">
  <div v-for="mod in modules" :key="mod.name" class="module-card">
    <div class="module-card-header">
      <span class="module-card-name">{{ mod.name }}</span>
      <span class="module-card-count">{{ mod.count }} {{ mod.count === 1 ? 'method' : 'methods' }}</span>
    </div>
    <span class="module-card-desc">{{ mod.desc }}</span>
    <div class="module-card-tags">
      <span v-for="tag in mod.tags" :key="tag" class="module-card-tag">{{ tag }}</span>
    </div>
  </div>
</div>
