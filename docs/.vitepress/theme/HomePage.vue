<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <span class="overline">Agent-Friendly CLI for Fake Data</span>
        <h1 class="headline">Generate<br/>Anything Fake</h1>
        <p class="subtitle">
          259 methods across 27 modules. Names, emails, addresses,
          dates, numbers, images — all from your terminal.
        </p>
      </div>
      <div class="cta-buttons">
        <a :href="withBase('/guide/getting-started')" class="btn btn-primary">Get Started</a>
        <a :href="withBase('/modules')" class="btn btn-secondary">Module Reference</a>
      </div>

      <!-- Terminal -->
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-dot"></div>
          <div class="terminal-dot"></div>
          <div class="terminal-dot"></div>
          <span class="terminal-title">terminal</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-block">
            <div class="terminal-cmd">$ faker person.fullName --seed 42</div>
            <div class="terminal-out">"Mohammad Crist"</div>
          </div>
          <div class="terminal-block">
            <div class="terminal-cmd">$ faker internet.email --locale de</div>
            <div class="terminal-out">"Alia.Hargasser99@yahoo.com"</div>
          </div>
          <div class="terminal-block">
            <div class="terminal-cmd">$ faker --schema '{"name":"person.fullName","email":"internet.email"}'</div>
            <div class="terminal-schema">{"name":<span class="terminal-out-inline">"Heather Padberg"</span>,"email":<span class="terminal-out-inline">"Heather_Padberg@yahoo.com"</span>}</div>
          </div>
          <div class="terminal-prompt">
            <span class="terminal-cmd">$ </span>
            <div class="terminal-cursor"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="features-header">
        <span class="overline">Why faker-cli</span>
        <h2 class="features-headline">Built for machines.<br/><span class="dim">Readable by humans.</span></h2>
      </div>
      <div class="feature-grid">
        <div class="feature-card">
          <span class="feature-icon">{ }</span>
          <h3>Pure JSON Output</h3>
          <p>Every command outputs valid JSON to stdout. Errors to stderr. No parsing needed — pipe directly into jq, your agent, or any automation.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">--schema</span>
          <h3>Schema Mode</h3>
          <p>Define the shape you need as a JSON template. faker-cli resolves every field to realistic data. Nested objects, arrays, inline args — all supported.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">--describe</span>
          <h3>Self-Discoverable</h3>
          <p>Agents don't need docs. Every module and method is introspectable with --describe. Parameters, types, return values, and CLI examples — all built in.</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">--seed 42</span>
          <h3>Deterministic</h3>
          <p>Same seed, same output. Every time. Combine with --locale for 60+ languages and --ref-date to pin dates. Fully reproducible test data.</p>
        </div>
      </div>
    </section>

    <!-- Install -->
    <section class="install">
      <span class="overline">Get Started in Seconds</span>
      <h2 class="install-headline">One line. Any platform.</h2>
      <div class="install-cmd">
        <span class="install-dollar">$</span>
        <span class="install-text">brew install zcaceres/tap/faker-cli</span>
      </div>
      <div class="install-alt">
        <span class="install-alt-text">or download binaries for</span>
        <div class="install-platforms">
          <span class="platform-badge">macOS</span>
          <span class="platform-badge">Linux</span>
          <span class="platform-badge">Windows</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1440px;
  margin: 0 auto;
}

/* ── Hero ── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 100px 64px 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.overline {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #F59E0B;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.headline {
  font-family: 'Syne', sans-serif;
  font-size: 80px;
  font-weight: 800;
  color: #F5F5F4;
  letter-spacing: -0.04em;
  line-height: 80px;
  text-align: center;
  margin: 0;
  border: none;
  padding: 0;
  background: none;
}

.subtitle {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  font-style: italic;
  color: #78716C;
  text-align: center;
  max-width: 520px;
  line-height: 32px;
  margin: 0;
}

/* ── CTA ── */
.cta-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 36px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #F59E0B;
  color: #0C0A09;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #FBBF24;
}

.btn-secondary {
  border: 1px solid #292524;
  color: #A8A29E;
  font-weight: 500;
}

.btn-secondary:hover {
  border-color: #44403C;
  color: #F5F5F4;
}

/* ── Terminal ── */
.terminal {
  background: #1C1917;
  border: 1px solid #292524;
  border-radius: 12px;
  width: 100%;
  max-width: 720px;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid #292524;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #292524;
}

.terminal-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #57534E;
  margin-left: 8px;
}

.terminal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.terminal-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.terminal-cmd {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #A8A29E;
  line-height: 22px;
}

.terminal-out {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #A3E635;
  line-height: 22px;
}

.terminal-schema {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: #57534E;
  line-height: 22px;
}

.terminal-out-inline {
  color: #A3E635;
}

.terminal-prompt {
  display: flex;
  align-items: center;
}

.terminal-cursor {
  width: 8px;
  height: 18px;
  background: #F59E0B;
  border-radius: 1px;
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ── Features ── */
.features {
  padding: 100px 64px 0;
}

.features-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
}

.features-headline {
  font-family: 'Syne', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #F5F5F4;
  letter-spacing: -0.03em;
  line-height: 42px;
  margin: 0;
  border: none;
  padding: 0;
}

.features-headline .dim {
  color: #57534E;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  background: #1C1917;
  border: 1px solid #292524;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-icon {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 24px;
  color: #F59E0B;
  line-height: 28px;
}

.feature-card h3 {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #F5F5F4;
  letter-spacing: -0.01em;
  margin: 0;
  border: none;
  padding: 0;
  background: none;
}

.feature-card p {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #78716C;
  margin: 0;
}

/* ── Install ── */
.install {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 64px 80px;
  gap: 32px;
}

.install-headline {
  font-family: 'Syne', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #F5F5F4;
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0;
  border: none;
  padding: 0;
}

.install-cmd {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 32px;
  background: #1C1917;
  border: 1px solid #292524;
  border-radius: 10px;
}

.install-dollar {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  color: #A8A29E;
}

.install-text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: #F5F5F4;
}

.install-alt {
  display: flex;
  align-items: center;
  gap: 24px;
}

.install-alt-text {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: #57534E;
}

.install-platforms {
  display: flex;
  gap: 12px;
}

.platform-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: #78716C;
  padding: 4px 10px;
  border: 1px solid #292524;
  border-radius: 4px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero {
    padding: 48px 24px 0;
  }

  .headline {
    font-size: 44px;
    line-height: 48px;
  }

  .subtitle {
    font-size: 18px;
    line-height: 26px;
  }

  .terminal {
    max-width: 100%;
  }

  .terminal-cmd,
  .terminal-out,
  .terminal-schema {
    font-size: 11px;
  }

  .features {
    padding: 64px 24px 0;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .features-headline {
    font-size: 28px;
    line-height: 34px;
  }

  .install {
    padding: 80px 24px 64px;
  }

  .install-headline {
    font-size: 28px;
  }

  .install-alt {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
