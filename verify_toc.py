from playwright.sync_api import sync_playwright

def verify_toc(page):
    print("Navigating...")
    # Go to a blog post with TOC
    page.goto("http://localhost:3000/en/blog/code-sample", timeout=90000, wait_until="domcontentloaded")
    print("Navigated.")

    # Scroll a bit to trigger scroll events
    page.evaluate("window.scrollTo(0, 500)")
    page.wait_for_timeout(500)
    page.evaluate("window.scrollTo(0, 1000)")
    page.wait_for_timeout(500)

    # Take screenshot
    page.screenshot(path="/home/jules/verification/toc_verification.png")
    print("Screenshot taken")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_toc(page)
        finally:
            browser.close()
