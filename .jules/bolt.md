## 2024-05-22 - Heavy Library in Shared Layout
**Learning:** `MermaidLoader` imported `mermaid` (a very large library) at the top level. Because `MermaidLoader` is included in `PostLayout`, which is used by all blog posts, `mermaid` was being bundled into the initial JS for every post page, regardless of whether a diagram was present. This added ~150KB to the First Load JS.
**Action:** For heavy, conditionally used libraries (especially in shared layouts), always use dynamic imports (`await import(...)`) inside `useEffect` or event handlers to avoid bloating the main bundle.
