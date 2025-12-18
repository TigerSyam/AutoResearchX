from utils.web_fetch import fetch_webpage
from utils.text_cleaner import clean_text

class ResearchAgent:

    def __init__(self):
        """
        ResearchAgent does:
        1. Takes input URL(s)
        2. Fetches raw webpage text
        3. Cleans the text
        4. Returns structured research data
        """
        pass

    def run(self, urls: list):
        """
        urls = list of webpage URLs to fetch
        Returns list of {url, text}
        """

        research_data = []

        for url in urls:
            print(f"[ResearchAgent] Fetching: {url}")

            # Step 1: Fetch webpage text
            raw_text = fetch_webpage(url)

            if not raw_text:
                print(f"[ResearchAgent] Failed to fetch: {url}")
                continue

            # Step 2: Clean text
            cleaned = clean_text(raw_text)

            if len(cleaned) < 200:
                print(f"[ResearchAgent] Content too short, skipping: {url}")
                continue

            research_data.append({
                "url": url,
                "text": cleaned,
            })

        return research_data
