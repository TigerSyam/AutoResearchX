import requests

def search_duckduckgo(query: str, max_results: int = 5):
    """
    Perform a DuckDuckGo search and return list of URLs + summaries.
    This API is free, no key needed.
    """

    url = "https://api.duckduckgo.com/"

    params = {
        "q": query,
        "format": "json",
        "no_redirect": 1,
        "no_html": 1
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
    except Exception as e:
        print("Error using DuckDuckGo:", e)
        return []

    results = []

    # Instant answers
    if "RelatedTopics" in data:
        for topic in data["RelatedTopics"]:
            if "FirstURL" in topic:
                results.append({
                    "title": topic.get("Text", ""),
                    "url": topic.get("FirstURL", "")
                })
                if len(results) >= max_results:
                    break

    return results
