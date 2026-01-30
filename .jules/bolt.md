## 2025-02-19 - Mermaid.js Static Import Bottleneck
**Learning:** `PostLayout` imports `MermaidLoader` which statically imported `mermaid` (500kb+). Since `PostLayout` is used on all blog posts, this caused `mermaid` to be bundled and loaded on every blog post, regardless of whether it contained diagrams.
**Action:** Use dynamic imports (`await import('mermaid')`) inside `useEffect` with a check for `pre.language-mermaid` elements. This ensures the library is only loaded when needed.

## 2025-02-19 - Memory vs Code Discrepancy
**Learning:** The memory bank described `MermaidLoader` as "dynamically importing mermaid", but the actual code contained a static import.
**Action:** Always verify "known" optimizations against the actual code. The code is the source of truth.
