## 2024-05-22 - Static Imports in Layout Components
**Learning:** Static imports of heavy libraries (like `mermaid`) in components used by layouts (e.g., `PostLayout`) force those libraries into the main bundle or common chunks, even if the library is only needed for a fraction of the content.
**Action:** Use `await import('lib')` inside `useEffect` or event handlers for heavy dependencies that are conditionally needed based on DOM content or user interaction.
