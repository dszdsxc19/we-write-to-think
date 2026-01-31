from playwright.sync_api import sync_playwright

def verify_typewriter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            # Use /zh as default or /en. Memory says default is zh. I'll use /zh.
            response = page.goto("http://localhost:3000/zh", timeout=90000, wait_until="domcontentloaded")
            print(f"Loaded: {response.status if response else 'No response'}")

            # Wait for the typewriter text container
            # The typewriter component has this structure:
            # <div className="text-left ...">
            #   <span ref={containerRef}></span>
            #   <span className="animate-blink ..." />
            # </div>

            # I'll look for the blinking cursor or the text.
            # The text is dynamically typed. "写作即思考" is one of the descriptions.

            print("Waiting for typewriter content...")
            page.wait_for_selector(".animate-blink", timeout=10000)

            # Wait a bit for text to appear
            page.wait_for_timeout(2000)

            # Take screenshot
            page.screenshot(path="verification/typewriter.png")
            print("Screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_typewriter()
