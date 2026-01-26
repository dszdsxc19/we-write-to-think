## 2024-05-22 - TableOfContents Scroll Optimization
**Learning:** Caching DOM elements in `useEffect` for a TOC component proved unreliable due to potential race conditions with content hydration (elements not found on initial mount).
**Action:** Relied on `requestAnimationFrame` throttling for the scroll event listener instead. It provides significant performance benefits (limiting checks to ~60fps) without the complexity/risk of managing DOM element references manually.
