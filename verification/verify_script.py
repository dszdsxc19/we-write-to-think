from playwright.sync_api import sync_playwright

def verify_series_roadmap():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Increase timeout
            page.set_default_timeout(60000)

            # Navigate to a post with a series
            url = "http://localhost:3000/en/blog/code-sample"
            print(f"Navigating to {url}")
            # Use domcontentloaded to be faster
            response = page.goto(url, wait_until="domcontentloaded")

            if response.status != 200:
                print(f"Failed to load page: {response.status}")
                return

            # Look for the Series Roadmap button
            print("Searching for button...")
            try:
                roadmap_btn = page.get_by_text("View Series Roadmap")
                roadmap_btn.wait_for(state="visible", timeout=10000)
                print("Series Roadmap button found.")
                roadmap_btn.click()

                # Wait for modal to open
                print("Waiting for modal...")
                page.wait_for_timeout(2000) # Wait for animation

                page.screenshot(path="verification/series_roadmap_open.png")
                print("Captured Series Roadmap open state.")
            except Exception as e:
                print(f"Series Roadmap button NOT found or not clickable: {e}")
                page.screenshot(path="verification/post_page_no_button.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_series_roadmap()
