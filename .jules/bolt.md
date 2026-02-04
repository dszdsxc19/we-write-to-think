## 2024-05-22 - Throttling Scroll Listeners
**Learning:** `scroll` event listeners that call `getBoundingClientRect` cause layout thrashing.
**Action:** Always throttle these listeners using `requestAnimationFrame` to align with the browser's paint cycle.
