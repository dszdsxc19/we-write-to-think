## 2024-05-22 - Client-Side Filtering in Post Layouts
**Learning:** `PostLayout` passes the *entire* list of blog posts to children components (like `SeriesRoadmap`). This means any unmemoized derivation in children (filtering/sorting 100+ posts) runs on every render of the layout (scroll events, interactions).
**Action:** When working with `PostLayout` or similar container components, aggressively verify that children accepting the full `posts` list use `useMemo` for any filtering or sorting logic.
