## 2025-05-19 - Mermaid Bundle Bloat
**Learning:** `MermaidLoader` component was statically importing `mermaid` (~150kb gzipped), causing it to be bundled in all blog posts even without diagrams.
**Action:** Use dynamic `import('mermaid')` inside the `useEffect` after verifying the presence of `.language-mermaid` elements in the DOM. This saves ~40% JS payload for most blog posts.
