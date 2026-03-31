## 2024-05-22 - Component Render Optimization
**Learning:** `SeriesRoadmap` component was re-calculating derived state (sorting posts) and generating complex SVG paths (string concatenation and math) on every render, including during animations or parent re-renders.
**Action:** Wrap expensive derived data and path generation logic in `useMemo` to ensure they only run when dependencies change. Move constant definitions outside the component scope.
