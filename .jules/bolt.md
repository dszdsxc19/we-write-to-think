## 2024-05-22 - [Playwright & next-intl Redirects]
**Learning:** `next-intl` with `localePrefix: 'always'` causes root paths (e.g., `/blog/slug`) to redirect (307) to the default locale (e.g., `/zh/blog/slug`). If the content exists only in another locale (e.g., `en`), checking the redirected URL results in a 404. Headless browsers might also struggle with redirects if not handled explicitly.
**Action:** Always target the explicit localized URL (e.g., `/en/blog/slug`) in verification scripts to ensure stability and correct content loading.
