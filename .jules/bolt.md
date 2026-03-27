## 2025-05-27 - [Scroll Performance in TableOfContents]
**Learning:** Frequent DOM queries (`document.getElementById`, `getBoundingClientRect`) in scroll event listeners are a major bottleneck.
**Action:** Always throttle scroll listeners using `requestAnimationFrame` and cache DOM elements in `useRef` outside the listener loop when possible.
