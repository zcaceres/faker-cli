<script setup>
import { ref, onMounted } from 'vue'

const releases = ref([])
const loading = ref(true)
const error = ref(null)

const platformIcon = {
  'darwin-arm64': 'macOS arm64',
  'darwin-x64': 'macOS x64',
  'linux-x64': 'Linux x64',
  'linux-arm64': 'Linux arm64',
  'windows-x64': 'Windows x64',
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getAssets(release) {
  return release.assets
    .filter(a => !a.name.endsWith('.txt') && !a.name.endsWith('.md'))
    .map(a => {
      const platform = Object.keys(platformIcon).find(p => a.name.includes(p))
      return {
        name: a.name,
        label: platform ? platformIcon[platform] : a.name,
        url: a.browser_download_url,
        size: formatBytes(a.size),
      }
    })
}

onMounted(async () => {
  try {
    const res = await fetch('https://api.github.com/repos/zcaceres/faker-cli/releases')
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`)
    releases.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="releases-page">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading releases...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Failed to load releases: {{ error }}</p>
    </div>

    <div v-else-if="releases.length === 0" class="empty">
      <p>No releases found.</p>
    </div>

    <div v-else class="release-list">
      <div v-for="(release, i) in releases" :key="release.id" class="release-card">
        <div class="release-header">
          <div class="release-title">
            <span class="release-tag">{{ release.tag_name }}</span>
            <span v-if="i === 0" class="release-latest">Latest</span>
            <span v-if="release.prerelease" class="release-pre">Pre-release</span>
          </div>
          <span class="release-date">{{ formatDate(release.published_at) }}</span>
        </div>

        <div v-if="release.body" class="release-body">
          <div v-html="renderBody(release.body)"></div>
        </div>

        <div v-if="getAssets(release).length" class="release-assets">
          <span class="assets-label">Download:</span>
          <a v-for="asset in getAssets(release)" :key="asset.name" :href="asset.url" class="asset-badge">
            <span class="asset-name">{{ asset.label }}</span>
            <span class="asset-size">{{ asset.size }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    renderBody(body) {
      // Simple markdown-like rendering for release notes
      return body
        .split('\n')
        .map(line => {
          if (line.startsWith('### ')) return `<h4>${line.slice(4)}</h4>`
          if (line.startsWith('- ')) return `<p class="release-item">${line}</p>`
          if (line.trim() === '') return ''
          return `<p>${line}</p>`
        })
        .join('\n')
    },
  },
}
</script>

<style scoped>
.releases-page {
  --rp-text: var(--faker-text, #F5F5F4);
  --rp-text-muted: var(--faker-text-muted, #D6D3D1);
  --rp-text-dim: var(--faker-text-dim, #A8A29E);
  --rp-text-faint: var(--faker-text-faint, #57534E);
  --rp-surface: var(--faker-surface, #1C1917);
  --rp-border: var(--faker-border, #292524);
  --rp-accent: var(--faker-amber, #F59E0B);

  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 64px 0;
  color: var(--rp-text-dim);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--rp-border);
  border-top-color: var(--rp-accent);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.release-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.release-card {
  background: var(--rp-surface);
  border: 1px solid var(--rp-border);
  border-radius: 12px;
  overflow: hidden;
}

.release-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid var(--rp-border);
}

.release-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.release-tag {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--rp-text);
  letter-spacing: -0.02em;
}

.release-latest {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: var(--rp-accent);
  padding: 3px 8px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.release-pre {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  color: var(--rp-text-dim);
  padding: 3px 8px;
  background: rgba(120, 113, 108, 0.1);
  border: 1px solid rgba(120, 113, 108, 0.25);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.release-date {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--rp-text-faint);
}

.release-body {
  padding: 20px 28px;
  border-bottom: 1px solid var(--rp-border);
}

.release-body :deep(h4) {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--rp-text-muted);
  margin: 12px 0 8px;
}

.release-body :deep(h4:first-child) {
  margin-top: 0;
}

.release-body :deep(p) {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--rp-text-dim);
  line-height: 20px;
  margin: 2px 0;
}

.release-body :deep(.release-item) {
  padding-left: 12px;
}

.release-assets {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  flex-wrap: wrap;
}

.assets-label {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--rp-text-faint);
}

.asset-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--rp-border);
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.15s;
}

.asset-badge:hover {
  background: var(--rp-text-faint);
}

.asset-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--rp-text-dim);
}

.asset-size {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: var(--rp-text-faint);
}

@media (max-width: 640px) {
  .release-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
