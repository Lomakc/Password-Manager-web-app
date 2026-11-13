<div align="center">

# VaultKey

**A Lightweight, Client-Side Password Manager & Cryptographically Secure Credential Generator**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg)](#)

[Overview](#overview) • [Key Features](#key-features) • [Architecture](#architecture) • [Installation](#installation) • [Security Notice](#security-notice) • [Roadmap](#roadmap)

</div>

---

## Overview

**VaultKey** is a zero-dependency web application designed for generating high-entropy passwords and managing local credentials through a clean, responsive interface. Built entirely with native web standards (HTML5, CSS3, and Vanilla ES6+ JavaScript), it eliminates third-party runtime bloat while leveraging the browser's built-in **Web Crypto API** for secure random number generation.

---

## Key Features

### Cryptographic Password Generation
* **CSPRNG Engine:** Utilizes `window.crypto.getRandomValues()` rather than `Math.random()` to ensure cryptographically strong pseudo-randomness.
* **Configurable Entropy:** Adjustable password lengths ranging from **8 to 32 characters**.
* **Granular Character Sets:** Independent toggles for uppercase (`A–Z`), lowercase (`a–z`), numeric (`0–9`), and special symbols (`!@#$%^&*`).
* **Real-Time Strength Assessment:** Dynamic heuristic analyzer that scores character diversity and length across five security tiers (*Very Weak* to *Very Strong*).

### Local Credential Vault
* **Persistent Storage:** Automatically serializes and stores vault entries in the browser's `localStorage`.
* **Instant Filtering:** Real-time, case-insensitive search indexing across website titles and usernames.
* **Privacy Controls:** Individual password masking (`••••••••••••`) with on-demand visibility toggles.
* **Clipboard Integration:** One-click credential copying powered by the asynchronous Clipboard API with non-intrusive toast notifications.
* **XSS Mitigation:** Built-in HTML entity escaping (`escapeHTML`) to safely sanitize user-supplied input before DOM injection.

---

## Architecture

VaultKey follows a modular separation of concerns with zero build steps required:

```text
vaultkey/
├── index.html      # Semantic DOM structure, accessibility attributes, and layout
├── style.css       # CSS custom properties (variables), responsive CSS Grid, and dark theme
├── script.js       # State management, Web Crypto generator, DOM rendering, and storage I/O
└── README.md       # Project documentation
```

---

## Installation

### Local Execution
Because VaultKey relies purely on native browser APIs, no package managers (`npm`/`yarn`) or bundlers are required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vaultkey.git
   cd vaultkey
   ```
2. **Launch the application:**
   Open `index.html` directly in any modern web browser, or serve it via a local development server:
   ```bash
   # Using Python 3
   python -m http.server 8080

   # Using Node.js (npx)
   npx serve .
   ```

---

## Security Notice

> **Disclaimer:** VaultKey is engineered as a client-side utility and educational reference architecture.
>
> * **Unencrypted Storage:** Credentials are currently persisted in plaintext within `window.localStorage`. Any script running on the same origin or user with local access to browser storage can inspect the data.
> * **Data Persistence:** Clearing browser cache or site data will permanently erase stored credentials.
> * **Production Use:** Do not store critical financial, corporate, or primary identity credentials in this application without implementing client-side encryption (e.g., **AES-256-GCM** via `SubtleCrypto`) and a Master Password key-derivation flow (**PBKDF2** / **Argon2**).

---

## Roadmap

- [ ] **Zero-Knowledge Encryption:** Encrypt vault payloads with AES-GCM using a key derived from a user-defined Master Password.
- [ ] **Encrypted Backup & Restore:** Support exporting and importing encrypted `.json` vault snapshots.
- [ ] **Clipboard Auto-Clear:** Automatically overwrite clipboard contents 30 seconds after copying a password.
- [ ] **Credential Editing:** Inline modal support for updating existing usernames, URLs, and rotated passwords.

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.
