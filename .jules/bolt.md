## 2026-01-01 - SeriesRoadmap Optimization
**Learning:** Animated components with complex SVG path calculations can be significant performance bottlenecks if the path generation is done in the render loop. Memoizing the derived state (filtered posts) and the expensive calculation (SVG path string) avoids redundant work, especially when the component has internal state changes (like opening/closing) or animations.
**Action:** Always look for loops and string concatenation inside render bodies of animated components. Use `useMemo` to cache these expensive derivations.
