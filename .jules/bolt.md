## 2024-05-23 - Lazy Loading Heavy Libraries
**Learning:** Heavy client-side libraries like `mermaid` (700kB+) can be inadvertently bundled into the main chunk if imported at the top level of a component used in common layouts (like `PostLayout`), even if not used on the current page.
**Action:** Always inspect the usage of heavy libraries. Use dynamic `import()` inside `useEffect` combined with DOM checks (e.g., `document.querySelectorAll`) to load them only when strictly necessary. This significantly reduces the initial JS load (observed ~43% reduction in First Load JS for blog posts).
