## 2024-05-23 - Performance Optimization of List Layouts
**Learning:** `useDeferredValue` helps with responsiveness but doesn't prevent expensive re-calculations on every render.
**Action:** Use `useMemo` to cache derived data (like search indices or filtered lists) alongside `useDeferredValue` to ensure true performance gains.
