## 2024-05-23 - Lazy Loading Mermaid.js
**Learning:** `mermaid` is a very large library (~150kB compressed). Including it statically in components used by blog layouts forces it to load on every blog post, even those without diagrams.
**Action:** Always use dynamic imports (`await import('mermaid')`) for heavy libraries like this, especially when their usage is conditional (e.g., depends on specific DOM elements existing).
