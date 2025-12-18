import requests
from bs4 import BeautifulSoup

def fetch_webpage(url: str) -> str:
    """
    Fetch text content from a webpage (with browser headers to avoid 403).
    Returns clean visible text.
    """

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching URL: {url} | {e}")
        return ""

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove scripts, styles, noscript, etc.
    for tag in soup(["script", "style", "noscript", "meta", "header", "footer"]):
        tag.decompose()

    # Extract visible text
    text = soup.get_text(separator=" ")

    # Clean whitespace
    clean_text = " ".join(text.split())

    return clean_text
