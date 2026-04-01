## 2024-05-23 - Stable Dependencies for Effects
**Learning:** Computed arrays/objects inside components are unstable references, causing `useEffect` to re-run unnecessarily if listed as dependencies. This triggers `react-hooks/exhaustive-deps` warnings which are often indicators of performance issues, not just correctness.
**Action:** Always wrap derived array/object dependencies in `useMemo` to ensure referential stability, especially when they drive `useEffect` logic.
