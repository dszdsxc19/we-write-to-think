# Bolt's Journal ⚡

## 2024-05-22 - [Memoizing Expensive Calculations in Render Loop]
**Learning:** The `SeriesRoadmap` component was calculating derived state (`seriesPosts` and the SVG `path` string) on every render. This involves iterating through the posts array and string concatenation in a loop.
**Action:** Used `useMemo` to memoize these values, ensuring they are only recalculated when dependencies (`posts` or `series`) change. This reduces the work done during re-renders, which occur when the modal is opened/closed or other state changes.
