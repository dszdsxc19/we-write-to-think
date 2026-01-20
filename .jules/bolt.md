## 2025-10-26 - Lazy Loading Huge Libraries
**Learning:** The `mermaid` library (~1MB) was being imported synchronously in `MermaidLoader.tsx`, which is included in the global `PostLayout`. This meant every blog post incurred this weight even without diagrams.
**Action:** Always check `import` statements in widely used components (like Layouts). Use `await import('lib')` inside `useEffect` with a conditional check (e.g., presence of DOM elements) to lazy load heavy, rarely-used dependencies.
