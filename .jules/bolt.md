## 2024-05-23 - Dead Code and Animation Memoization
**Learning:** Optimizing dead code (like `layouts/ListLayout.tsx` which was unused in favor of `ListLayoutWithTags`) is a trap. Always verify if a component is actually used before optimizing it.
**Action:** Use `grep` to check import usage of a component before diving into optimization.

**Learning:** Animation components (like `SeriesRoadmap`) often perform expensive calculations (SVG paths, filtering) in the render loop.
**Action:** Always look for `useMemo` opportunities in components that use `framer-motion` or other animation libraries, especially for derived state and complex string generation.
