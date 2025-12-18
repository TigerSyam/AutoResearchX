import requests
from readability import Document
from bs4 import BeautifulSoup

def extract_clean_content(url: str) -> str:
    """
    Extract clean article content using readability-lxml.
    Works on most websites and requires no API key.
    """

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print("Error fetching article for extraction:", e)
        return ""

    # readability-lxml extracts main article <body>
    try:
        doc = Document(response.text)
        html = doc.summary()  # the clean article HTML
        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text(separator=" ")
    except Exception as e:
        print("Readability extraction failed:", e)
        return ""

    # final cleanup
    clean_text = " ".join(text.split())
    return clean_text
