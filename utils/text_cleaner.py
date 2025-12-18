import re

def clean_text(text: str) -> str:
    """
    Clean raw text by removing citations, brackets, special chars,
    excessive whitespace, and repeated patterns.
    """

    if not text:
        return ""

    # Remove citation formats like [1], [23], (see Fig.2)
    text = re.sub(r"\[[0-9]+\]", "", text)
    text = re.sub(r"\([^\)]*\)", "", text)

    # Remove non-ASCII characters
    text = text.encode("ascii", "ignore").decode()

    # Remove repeated spaces/newlines
    text = " ".join(text.split())

    # Remove special characters except essential ones
    # NOTE: hyphen is placed at the end to avoid forming a range.
    text = re.sub(r"[^a-zA-Z0-9\.\,\;\?\!\'\"%\s-]", " ", text)
    # Remove numeric-style citation markers like [1], [23]
    text = re.sub(r"\[\d+\]", " ", text)


    return text.strip()
