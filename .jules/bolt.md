## 2024-05-23 - Lazy Loading Large Libraries
**Learning:** `mermaid` is a large library that was being statically imported in `MermaidLoader`, causing it to be included in the bundle for all blog posts, even those without diagrams.
**Action:** Always check imports of heavy libraries in widely used components. Use `await import('lib')` inside `useEffect` to lazy load them only when needed.
