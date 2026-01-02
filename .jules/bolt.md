## 2024-05-23 - SeriesRoadmap Optimization
**Learning:** Complex SVG path generation and list filtering in client components can be expensive if performed on every render.
**Action:** Use `useMemo` to cache derived data (filtered lists) and expensive computations (SVG paths) in interactive components, especially when they receive large datasets as props.
