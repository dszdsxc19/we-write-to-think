## 2026-01-25 - HeroTypewriter Unstable Dependencies
**Learning:** React components that derive arrays/objects for use in `useEffect` dependencies must memoize them. In `HeroTypewriter`, falling back to `[defaultDescription]` created a new reference every render, causing the effect to re-run and the animation to potentially jitter or reset.
**Action:** Always wrap derived non-primitive values in `useMemo` if they are used in dependency arrays.
